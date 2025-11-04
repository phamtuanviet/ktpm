import { findUserByEmail, findUserById } from "./userRepository.js";
import {
  getFlightSeatById,
  getFlightSeatBySeatClassAndFlight,
  updateBookedSeat,
  updateFlightSeat,
} from "./flightSeatRepository.js";
import { getFlightByFlightNumber } from "./flightRepository.js";
import { generateBookingReference } from "../services/other.js";
import { startOfDay, subDays, addDays } from "date-fns";
import { prisma } from "../services/prisma.js";

const sanitize = (obj) => {
  const converted = { ...obj };
  for (const key in converted) {
    const val = converted[key];
    if (typeof converted[key] === "bigint") {
      converted[key] = converted[key].toString();
    }
    if (val instanceof Date) {
      converted[key] = val.toISOString();
    }
  }
  return converted;
};

export const getAllTicketsFromFlight = async (flightId) => {
  return await prisma.ticket.findMany({
    where: { flightId },
  });
};

export const getTicketById = async (id) => {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id,
    },
    include: {
      flight: {
        include: {
          departureAirport: true,
          arrivalAirport: true,
        },
      },
      bookedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      flightSeat: true,
      passenger: true,
    },
  });
  return ticket;
};

export const createTicket = async (data) => {
  const flight = await getFlightByFlightNumber(data.flightNumber);
  console.log(flight);
  if (
    !flight ||
    !(flight.status === "SCHEDULED" || flight.status === "DELAYED")
  ) {
    throw new Error("Flight isn't existing or finished");
  }
  const user = findUserByEmail(data.passengerEmail);

  const flightSeat = await getFlightSeatBySeatClassAndFlight(
    flight.id,
    data.seatClass
  );
  if (!flightSeat) {
    throw new Error("Flight seat isn't existing");
  }
  const count = await prisma.ticket.count({
    where: {
      flightId: flight.id,
      flightSeatId: flightSeat.id,
    },
  });

  const seatNumber = `${flightSeat.seatClass.charAt(0).toUpperCase()}${count}`;
  const bookingReference = generateBookingReference(5);
  let ticketData = {
    flightId: flight.id,
    flightSeatId: flightSeat.id,
    bookedById: user?.id || undefined,
    discount: data?.discount || 0,
    passengerName: data.passengerName,
    passengerEmail: data.passengerEmail || undefined,
    passengerType: data.passengerType,
  };

  ticketData.seatNumber = seatNumber;
  ticketData.bookingReference = bookingReference;
  const createdTicket = await prisma.ticket.create({
    data: ticketData,
  });
  updateBookedSeat(flightSeat.id);
  return createdTicket;
};

export const getTicketsBySearch = async (
  page = 1,
  pageSize = 10,
  query = "",
  sortBy = "id",
  sortOrder = "asc"
) => {
  const searchCondition = query
    ? {
        OR: [
          {
            flight: {
              is: {
                OR: [
                  { flightNumber: { contains: query, mode: "insensitive" } },
                  {
                    departureAirport: {
                      is: {
                        name: { contains: query, mode: "insensitive" },
                      },
                    },
                    arrivalAirport: {
                      is: {
                        name: { contains: query, mode: "insensitive" },
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            bookedBy: {
              is: {
                OR: [{ name: { contains: query, mode: "insensitive" } }],
              },
            },
          },
          {
            passenger: {
              is: {
                OR: [
                  { fullName: { contains: query, mode: "insensitive" } },
                  { email: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          },
          {
            seatNumber: { contains: query, mode: "insensitive" },
          },
        ],
      }
    : {};

  const skip = (page - 1) * pageSize;

  let orderByOption;

  if (sortBy === "bookedBy") {
    orderByOption = {
      [sortBy]: {
        name: sortOrder.toLowerCase() === "desc" ? "desc" : "asc",
      },
    };
  } else if (sortBy === "flight") {
    orderByOption = {
      [sortBy]: {
        flightNumber: sortOrder.toLowerCase() === "desc" ? "desc" : "asc",
      },
    };
  } else if (sortBy === "flightSeat") {
    orderByOption = {
      [sortBy]: {
        seatClass: sortOrder.toLowerCase() === "desc" ? "desc" : "asc",
      },
    };
  } else if (sortBy === "passengerName") {
    orderByOption = {
      ["passenger"]: {
        fullName: sortOrder.toLowerCase() === "desc" ? "desc" : "asc",
      },
    };
  } else if (sortBy === "passengerEmail") {
    orderByOption = {
      ["passenger"]: {
        email: sortOrder.toLowerCase() === "desc" ? "desc" : "asc",
      },
    };
  } else {
    orderByOption = {
      [sortBy]: sortOrder.toLowerCase() === "desc" ? "desc" : "asc",
    };
  }

  const tickets = await prisma.ticket.findMany({
    where: searchCondition,
    skip,
    take: pageSize,
    orderBy: orderByOption,
    include: {
      flight: {
        select: {
          id: true,
          flightNumber: true,
          departureTime: true,
          estimatedDeparture: true,
          departureAirport: {
            select: {
              name: true,
            },
          },
          arrivalAirport: {
            select: {
              name: true,
            },
          },
        },
      },
      passenger: {},
      flightSeat: {},
      bookedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const ticketsData = tickets.map((t) => {
    return sanitize(t);
  });

  const totalTickets = await prisma.ticket.count({
    where: searchCondition,
  });

  return {
    tickets: ticketsData,
    totalPages: Math.ceil(totalTickets / pageSize),
    currentPage: page,
  };
};

export const updateTicket = async (id, data) => {
  return await prisma.ticket.update({
    where: { id },
    data,
  });
};

export const cancelTicket = async ({ id, cancelCode }) => {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id,
      isCancelled: false,
      cancelCode,
    },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const currentTime = new Date();
  if (currentTime > ticket.cancellationDeadline) {
    throw new Error("Cancel time limit expired");
  }
  const flightSeat = await getFlightSeatById(ticket.flightSeatId);
  await updateFlightSeat(flightSeat.id, {
    bookedSeats: flightSeat.bookedSeats - 1,
  });

  return await prisma.ticket.update({
    where: { id },
    data: {
      isCancelled: true,
    },
  });
};

export const deleteTicket = async (id) => {
  return await prisma.ticket.delete({
    where: { id },
  });
};
export const filterTickets = async (query) => {
  const {
    flightNumber,
    seatClass,
    passengerType,
    passengerName,
    passengerEmail,
    isCancelled,
  } = query;

  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  const where = {};

  if (flightNumber)
    where.flight = { is: { flightNumber: { equals: flightNumber } } };
  if (seatClass)
    where.flightSeat = { is: { seatClass: { equals: seatClass } } };
  if (passengerType) where.passengerType = { equals: passengerType };
  if (passengerName)
    where.passenger = {
      is: { fullName: { contains: passengerName, mode: "insensitive" } },
    };
  if (passengerEmail)
    where.passenger = {
      is: { email: { contains: passengerName, mode: "insensitive" } },
    };
  if (isCancelled !== undefined) {
    where.isCancelled = { equals: Boolean(isCancelled) };
  }

  if (Object.keys(where).length === 0) {
    throw new Error("At least one filter param is required");
  }

  const tickets = await prisma.ticket.findMany({
    where,
    skip,
    take: pageSize,
    include: {
      flight: {
        select: {
          id: true,
          flightNumber: true,
          departureTime: true,
          estimatedDeparture: true,
          departureAirport: {
            select: {
              name: true,
            },
          },
          arrivalAirport: {
            select: {
              name: true,
            },
          },
        },
      },
      flightSeat: {},
      passenger: {},
      bookedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  const ticketsData = tickets.map((t) => {
    return sanitize(t);
  });

  const totalTickets = await prisma.ticket.count({
    where,
  });

  return {
    tickets: ticketsData,
    totalPages: Math.ceil(totalTickets / pageSize),
    currentPage: page,
  };
};

export const createTicketV2 = async ({
  flightId,
  passengerType,
  passengerId,
  flightSeatId,
  bookingReference,
  bookedById,
  cancelCode,
}) => {
  const count = await prisma.ticket.count({
    where: {
      flightId,
      flightSeatId,
    },
  });
  const flightSeat = await getFlightSeatById(flightSeatId);

  const seatNumber = `${flightSeat.seatClass.charAt(0).toUpperCase()}${count}`;
  return await prisma.ticket.create({
    data: {
      flightId,
      passengerType,
      passengerId,
      flightSeatId,
      bookingReference,
      bookedById: bookedById ?? null,
      seatNumber,
      cancelCode,
    },
  });
};

export const lookUpTickets = async (search) => {
  const tickets = await prisma.ticket.findMany({
    where: {
      OR: [
        { passengerEmail: search },
        { bookingReference: search },
        {
          passenger: {
            email: search,
          },
        },
      ],
      isCancelled: false,
    },
    select: {
      id: true,
      bookingReference: true,
      passengerName: true,
      passengerEmail: true,
      passengerType: true,
      discount: true,
      bookedAt: true,
      seatNumber: true,

      passenger: {
        select: {
          id: true,
          fullName: true,
          email: true,
          dob: true,
          passport: true,
        },
      },
      flightSeat: {
        select: {
          id: true,
          seatClass: true,
          price: true,
        },
      },
      flight: {
        select: {
          id: true,
          flightNumber: true,
          departureTime: true,
          arrivalTime: true,
          status: true,
          departureAirport: {
            select: {
              id: true,
              name: true,
              city: true,
              country: true,
              iataCode: true,
              icaoCode: true,
            },
          },
          arrivalAirport: {
            select: {
              id: true,
              name: true,
              city: true,
              country: true,
              iataCode: true,
              icaoCode: true,
            },
          },
          seats: {
            select: {
              id: true,
              seatClass: true,
              totalSeats: true,
              bookedSeats: true,
              price: true,
            },
          },
        },
      },
    },
  });

  return tickets;
};

export const countAllTicket = async () => {
  const count = await prisma.ticket.count();
  return count;
};

export const countCancelledTicket = async () => {
  const count = await prisma.ticket.count({
    where: {
      isCancelled: true,
    },
  });
  return count;
};

export const countTicketStats = async () => {
  const today = startOfDay(new Date());
  console.log(today);
  const sevenDaysAgo = subDays(today, 6);
  const tomorrow = addDays(today, 1);

  const tickets = await prisma.ticket.findMany({
    where: {
      bookedAt: {
        gte: sevenDaysAgo,
        lt: tomorrow,
      },
    },
    select: {
      bookedAt: true,
      isCancelled: true,
    },
  });

  // Tạo map ngày
  const statsMap = {};
  for (let i = 0; i < 7; i++) {
    const current = addDays(sevenDaysAgo, i);
    current.setHours(current.getHours() + 7);
    const date = current.toISOString().slice(0, 10);
    statsMap[date] = { booked: 0, cancelled: 0 };
  }

  // Tính toán
  tickets.forEach((ticket) => {
    const date = new Date(ticket.bookedAt);
    date.setHours(date.getHours() + 7);
    const key = date.toISOString().slice(0, 10);
    if (statsMap[key]) {
      if (ticket.isCancelled) statsMap[key].cancelled += 1;
      else statsMap[key].booked += 1;
    }
  });

  // Format trả về: date dạng d/m/yyyy
  const result = Object.entries(statsMap).map(
    ([isoDate, { booked, cancelled }]) => {
      const d = new Date(isoDate);
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      return { date: formattedDate, booked, cancelled };
    }
  );

  return result;
};
