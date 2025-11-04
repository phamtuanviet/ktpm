import transporter from "../config/nodemailer.js";
import {
  createOtp,
  verifyOtp,
} from "../repositories/emailVerificationRepesitory.js";
import {
  getFlightSeatBySeatClassAndFlight,
  updateManyBookedSeat,
} from "../repositories/flightSeatRepository.js";
import { createPassenger } from "../repositories/passengerRepository.js";
import * as ticketRepository from "../repositories/ticketRepository.js";
import { findUserByEmail } from "../repositories/userRepository.js";
import { generateBookingReference } from "../services/other.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const mapPassengerType = {
  adults: "ADULT",
  children: "CHILD",
  infants: "INFANT",
};

const sendVerifyOtp = async (email) => {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  await createOtp(email, otp);
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Confirm buy ticket by OTP",
    text: `To confirm buy ticket you can type exacly OTP,
       Your OTP is ${otp}. Verify your account using this OTP`,
  };

  await transporter.sendMail(mailOptions);
};

export const getAllTicketsFromFlight = async (req, res) => {
  try {
    const fligthId = req.params.flightId;
    const tickets = await ticketRepository.getAllTicketsFromFlight(fligthId);
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await ticketRepository.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const {
      passengerName,
      passengerType,
      seatClass,
      flightNumber,
      passengerEmail,
    } = req.body;

    if (
      !passengerName ||
      !seatClass ||
      !flightNumber ||
      !passengerType ||
      !passengerEmail
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required field" });
    }
    const newTicket = await ticketRepository.createTicket(req.body);
    res.status(201).json({ success: true, data: newTicket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTicketsBySearch = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const query = req.query.query || "";
    const sortBy = req.query.sortBy || "id";
    const sortOrder = req.query.sortOrder || "asc";

    const { tickets, totalPages, currentPage } =
      await ticketRepository.getTicketsBySearch(
        page,
        pageSize,
        query,
        sortBy,
        sortOrder
      );

    return res.json({
      success: true,
      data: {
        tickets,
        totalPages,
        currentPage,
      },
    });
  } catch (error) {
    console.error("Error in getPaginatedTickets:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const cancelTicket = async (req, res) => {
  try {
    const { id, cancelCode } = req.body;
    if (!id || !cancelCode)
      return res
        .status(400)
        .json({ success: false, message: "Id and cancelCode are required" });
    console.log(req.body);
    const ticket = await ticketRepository.cancelTicket({ id, cancelCode });
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const deleteTicket = await ticketRepository.delete(req.params.id);
    res.status(200).json({ success: true, data: deleteTicket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const filterTickets = async (req, res) => {
  try {
    const data = await ticketRepository.filterTickets(req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.message.includes("At least one")) {
      return res.status(400).json({ success: false, error: err.message });
    }
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const handleTicketClientRequest = async (req, res) => {
  try {
    const {
      step,
      passengers,
      outboundFlightId,
      outboundSeatClass,
      inboundFlightId,
      inboundSeatClass,
      email: guestEmail,
      otp,
    } = req.body;
    console.log(req.body);

    let userEmail = null;
    if (req?.cookies?.token) {
      const { token } = req.cookies;
      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = tokenDecode.email;
    }

    const effectiveEmail = userEmail || guestEmail;
    if (!effectiveEmail)
      return res.status(400).json({ message: "Email required" });

    if (step === "sendOtp") {
      await sendVerifyOtp(effectiveEmail);
      return res.json({ success: true });
    } else if (step === "verifyOtp") {
      await verifyOtp(effectiveEmail, otp);
      const user = await findUserByEmail(effectiveEmail);
      const totalTicketsPerFlight =
        (passengers.adults?.length || 0) + (passengers.children?.length || 0);
      const outboundInfo = await getFlightSeatBySeatClassAndFlight(
        outboundFlightId,
        outboundSeatClass
      );
      if (
        !outboundInfo ||
        outboundInfo.bookedSeats + totalTicketsPerFlight >
          outboundInfo.totalSeats
      ) {
        return res
          .status(400)
          .json({ message: "Not enough seats on outbound flight" });
      }

      let inboundInfo = null;
      if (inboundFlightId) {
        inboundInfo = await getFlightSeatBySeatClassAndFlight(
          inboundFlightId,
          inboundSeatClass
        );
        if (
          !inboundInfo ||
          inboundInfo.bookedSeats + totalTicketsPerFlight >
            inboundInfo.totalSeats
        ) {
          return res
            .status(400)
            .json({ message: "Not enough seats on return flight" });
        }
      }

      async function bookForFlight(flightId, seatInfo) {
        const createdTickets = [];
        for (const [key, list] of Object.entries(passengers)) {
          for (const p of list) {
            const passenger = await createPassenger({
              fullName: p.fullName,
              email: effectiveEmail,
              dob: p.dob ? new Date(p.dob) : null,
              passport: p.passport,
            });
            if (key === "infants") continue;
            const bookingReference = generateBookingReference(5);
            const cancelCode = generateBookingReference(10);
            const ticket = await ticketRepository.createTicketV2({
              flightId,
              passengerType: mapPassengerType[key],
              passengerId: passenger.id,
              flightSeatId: seatInfo.id,
              bookingReference,
              bookedById: user?.id,
              cancelCode,
            });
            createdTickets.push(ticket);
          }
        }
        await updateManyBookedSeat(seatInfo.id, createdTickets.length);
        return createdTickets;
      }
      const allCreated = [];
      const outboundTickets = await bookForFlight(
        outboundFlightId,
        outboundInfo
      );
      allCreated.push(...outboundTickets);
      const inboundTickets = inboundFlightId
        ? await bookForFlight(inboundFlightId, inboundInfo)
        : [];
      allCreated.push(...inboundTickets);
      const formatList = (list) =>
        list.length
          ? list
              .map(
                (t, i) =>
                  `${i + 1}. ${t.bookingReference} and Cancel Code is ${
                    t.cancelCode
                  }`
              )
              .join("\n")
          : "None";

      const emailText = `
Dear Customer,

Outbound Flight:
${formatList(outboundTickets)}

Return Flight:
${formatList(inboundTickets)}

Have a wonderful trip!
`.trim();

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: effectiveEmail,
        subject: "Your Booking References",
        text: emailText,
      });

      return res.json({ success: true, tickets: allCreated });
    } else {
      return res.status(400).json({ success: false, message: "Unknown step" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

export const lookUpTicket = async (req, res) => {
  try {
    const search = req?.params?.search || null;
    let dataSearch = search;
    if (!search || search === "none") {
      let userEmail = null;
      const { token } = req.cookies;
      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = tokenDecode.email;
      dataSearch = userEmail;
      if (!dataSearch)
        return res
          .status(400)
          .json({ success: false, message: "Data search is required" });
    }

    const tickets = await ticketRepository.lookUpTickets(dataSearch);
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const countAllTicket = async (req, res) => {
  try {
    const count = await ticketRepository.countAllTicket();
    return res.status(200).json({ success: true, data: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const countCancelledTicket = async (req, res) => {
  try {
    const count = await ticketRepository.countCancelledTicket();
    return res.status(200).json({ success: true, data: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const countTicketStats = async (req, res) => {
  try {
    const count = await ticketRepository.countTicketStats();
    return res.status(200).json({ success: true, data: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};