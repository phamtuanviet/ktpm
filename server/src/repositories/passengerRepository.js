import { prisma } from "../services/prisma.js";
export const getAllPassengers = async () => {
  return await prisma.passenger.findMany();
};

export const getPassengerById = async (id) => {
  return await prisma.passenger.findUnique({
    where: { id },
  });
};

export const getPassengerByName = async (name) => {
  return await prisma.passenger.findFirst({
    where: { fullName: name },
  });
};

export const createPassenger = async (data) => {
  return await prisma.passenger.create({
    data,
  });
};

export const updatePassenger = async (id, data) => {
  return await prisma.passenger.update({
    where: { id },
    data,
  });
};

export const deletePassenger = async (id) => {
  return await prisma.passenger.delete({
    where: { id },
  });
};
