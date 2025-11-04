import { prisma } from "../services/prisma.js";

// Function to sanitize aircraft data to convert BigInt to string and 
// avoid JSON serialization issues
const sanitizeAircraft = (aircraft) => {
  const converted = { ...aircraft };
  for (const key in converted) {
    if (typeof converted[key] === "bigint") {
      converted[key] = converted[key].toString();
    }
  }
  return converted;
};

export const getAllAircrafts = async () => {
  return await prisma.aircraft.findMany();
};

export const getAircraftById = async (id) => {
  const aircraft = await prisma.aircraft.findUnique({
    where: { id },
    include: {
      flights: {
        select: {
          id: true,
          flightNumber: true,
          departureTime: true,
          arrivalTime: true,
          estimatedArrival: true,
          estimatedDeparture: true,
          status: true,
          departureAirport: {
            select: {
              id: true,
              name: true,
            },
          },
          arrivalAirport: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  const sanitizedAircraft = sanitizeAircraft(aircraft);
  return sanitizedAircraft;
};

export const getAircraftByName = async (name) => {
  return await prisma.aircraft.findFirst({
    where: { name },
  });
};

export const getAircraftsBySearch = async (
  page = 1,
  pageSize = 10,
  query = "",
  sortBy = "id",
  sortOrder = "asc"
) => {
  const searchCondition = query
    ? {
        OR: [
          { id: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
          { manufacturer: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};
  const skip = (page - 1) * pageSize;
  const orderByOption = sortBy
    ? { [sortBy]: sortOrder.toLowerCase() === "desc" ? "desc" : "asc" }
    : { id: "asc" };
  const aircrafts = await prisma.aircraft.findMany({
    where: searchCondition,
    skip: skip,
    take: pageSize,
    orderBy: orderByOption,
  });
  const sanitizedAircrafts = aircrafts.map(sanitizeAircraft);
  const totalAircrafts = await prisma.aircraft.count({
    where: searchCondition,
  });
  return {
    aircrafts: sanitizedAircrafts,
    totalPages: Math.ceil(totalAircrafts / pageSize),
    currentPage: page,
  };
};

export const createAircraft = async (data) => {
  return await prisma.aircraft.create({
    data,
  });
};

export const searchAircraftsByName = async (q) => {

  return await prisma.aircraft.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { manufacturer: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 10,
    orderBy: {
      name: "asc",
    },
  });
};

export const updateAircraft = async (id, data) => {
  return await prisma.aircraft.update({
    where: { id },
    data,
  });
};

export const deleteAircraft = async (id) => {
  const flightCount = await prisma.flight.count({
    where: { id },
  });

  if (flightCount > 0) {
    throw new Error(
      `Cannot delete Aircraft #${id}: there are ${flightCount} flights still referencing it.`
    );
  }
  return await prisma.aircraft.delete({
    where: {
      id,
    },
  });
};

export const filterAircrafts = async (query) => {
  const operatorMap = {
    id: "equals",
    name: "contains",
    manufacturer: "contains",
  };

  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  const where = {};
  Object.entries(query).forEach(([key, val]) => {
    if (val == null || val === "" || !operatorMap[key]) return;
    where[key] = { [operatorMap[key]]: val };
  });

  if (Object.keys(where).length === 0) {
    throw new Error("At least one filter param is required");
  }

  const aircrafts = await prisma.aircraft.findMany({
    where,
    skip,
    take: pageSize,
  });
  console.log(aircrafts);

  const sanitizedAircrafts = Array.isArray(aircrafts)
    ? aircrafts.map(sanitizeAircraft)
    : [];
  const totalAircrafts = await prisma.aircraft.count({
    where,
  });
  return {
    aircrafts: sanitizedAircrafts,
    totalPages: Math.ceil(totalAircrafts / pageSize),
    currentPage: page,
  };
};

export const countAircrafts = async () => {
  const count = await prisma.aircraft.count();
  return count;
};