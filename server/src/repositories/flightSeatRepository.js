import pkg from '@prisma/client';
import { getFlightById } from "./flightRepository.js";
import { prisma } from "../services/prisma.js";

const { SeatClass } = pkg;

export const getAllFlightSeats = async () => {
  return await prisma.flightSeat.findMany();
};


export const getFlightSeatById = async (id) => {
  return await prisma.flightSeat.findUnique({
    where: { id: Number(id) },
  });
};

// Get flight seat by flightId and seatClass
export const getFlightSeatBySeatClassAndFlight = async (
  flightId,
  seatClass
) => {
  return await prisma.flightSeat.findUnique({
    where: {
      flightId_seatClass: { flightId, seatClass },
    },
  });
};

export const createFlightSeat = async (data) => {
  console.log(data.flightId);
  const flight = getFlightById(data.flightId);
  if (!flight) {
    throw new Error("Flight isn't existing");
  }
  return await prisma.flightSeat.create({
    data,
  });
};

export const updateFlightSeat = async (id, data) => {
  return await prisma.flightSeat.update({
    where: { id: Number(id) },
    data,
  });
};

export const updateBookedSeat = async (id) => {
  const flightSeat = await prisma.flightSeat.findUnique({
    where: { id: Number(id) },
  });

  if (!flightSeat) {
    throw new Error("Flight seat not found");
  }

  if (flightSeat.bookedSeats >= flightSeat.totalSeats) {
    throw new Error("No available seats in this class");
  }

  return await prisma.flightSeat.update({
    where: { id: Number(id) },
    data: {
      bookedSeats: {
        increment: 1,
      },
    },
  });
};

export const updateManyBookedSeat = async (id, seatsToBook) => {
  const seatId = Number(id);
  const count = Number(seatsToBook);

  return await prisma.$transaction(async (tx) => {
    const flightSeat = await tx.flightSeat.findUnique({
      where: { id: seatId },
    });
    if (!flightSeat) {
      throw new Error("Flight seat not found");
    }
    if (flightSeat.bookedSeats + count > flightSeat.totalSeats) {
      throw new Error("Not enough available seats in this class");
    }
    return tx.flightSeat.update({
      where: { id: seatId },
      data: { bookedSeats: { increment: count } },
    });
  });
};

export const deleteFlightSeat = async (id) => {
  return await prisma.flightSeat.delete({
    where: { id: Number(id) },
  });
};
