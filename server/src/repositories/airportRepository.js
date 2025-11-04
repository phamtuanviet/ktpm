import { prisma } from "../services/prisma.js";

export const getAllAirports = async () => {
  return await prisma.airport.findMany();
};

export const getAirportById = async (id) => {
  return await prisma.airport.findUnique({
    where: { id: Number(id) },
  });
};

export const getAirportByName = async (name) => {
  return await prisma.airport.findFirst({
    where: { name },
  });
};

// Get airports by search query with 20 results limit for client-side search
export const searchAirportsByQuery = async (q) => {
  return await prisma.airport.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { country: { contains: q, mode: "insensitive" } },
        { iataCode: { contains: q, mode: "insensitive" } },
        { icaoCode: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 20,
  });
};

export const searchAirportsByName = async (q) => {
  return await prisma.airport.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { country: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 10,
    orderBy: {
      name: "asc",
    },
  });
};

export const createAirport = async (data) => {
  return await prisma.airport.create({
    data,
  });
};

export const updateAirport = async (id, data) => {
  return await prisma.airport.update({
    where: { id: Number(id) },
    data,
  });
};

export const deleteAirport = async (id) => {
  return await prisma.airport.delete({
    where: { id: Number(id) },
  });
};
