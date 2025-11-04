import { prisma } from "../services/prisma.js";
import { getAirportById, getAirportByName } from "./airportRepository.js";
import { getAircraftById, getAircraftByName } from "./aircraftRepository.js";
import {
  createFlightSeat,
  getFlightSeatBySeatClassAndFlight,
  updateFlightSeat,
} from "./flightSeatRepository.js";
import { generateFlightNumber } from "../services/other.js";


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

export const getAllFlights = async () => {
  return await prisma.flight.findMany();
};

export const getFlightById = async (id) => {
  const flight = await prisma.flight.findUnique({
    where: { id },
    include: {
      departureAirport: true,
      arrivalAirport: true,
      aircraft: true,
      seats: true,
    },
  });
  const sanitizedFlight = sanitize(flight);
  return sanitizedFlight;
};

export const getFlightByFlightNumber = async (flightNumber) => {
  return await prisma.flight.findUnique({
    where: { flightNumber },
  });
};

export const searchFlightsByName = async (q) => {
  return await prisma.flight.findMany({
    where: {
      OR: [{ flightNumber: { contains: q, mode: "insensitive" } }],
    },
    take: 10,
    orderBy: {
      flightNumber: "asc",
    },
  });
};

// Create a new flight with its seats used by admin
export const createFlight = async (data) => {
  if (data.departureAirport === data.arrivalAirport) {
    throw new Error("Depature airport and arrival airport must be different");
  }
  const departureAirport = await getAirportByName(data.departureAirport);
  const arrivalAirport = await getAirportByName(data.arrivalAirport);
  const aircraft = await getAircraftByName(data.aircraft);
  if (!data.flightNumber) {
    let isDuplicated = true;
    while (isDuplicated) {
      data.flightNumber = generateFlightNumber();
      const checkFlight = await prisma.flight.findUnique({
        where: { flightNumber: data.flightNumber },
      });
      if (!checkFlight) isDuplicated = false;
    }
  }
  const flight = await prisma.flight.findUnique({
    where: { flightNumber: data.flightNumber },
  });
  if (flight) {
    throw new Error("Flight is existing");
  }
  if (!departureAirport || !arrivalAirport) {
    throw new Error("Invalid airport");
  }
  if (!aircraft) {
    throw new Error("Invalid aircraft");
  }
  const { seats } = data;

  const tempCreatedFlight = await prisma.flight.create({
    data: {
      flightNumber: data.flightNumber,
      departureTime: data.departureTime,
      arrivalTime: data.arrivalTime,
      aircraft: { connect: { id: aircraft.id } },
      departureAirport: { connect: { id: departureAirport.id } },
      arrivalAirport: { connect: { id: arrivalAirport.id } },
    },
  });

  // Create flight seats
  const createdSeats = await seats.map(async (seat) => {
    const seatData = {
      ...seat,
      flightId: tempCreatedFlight.id,
    };
    await createFlightSeat(seatData);
  });

  const createdFlight = {
    ...tempCreatedFlight,
    seats: createdSeats,
  };

  return createdFlight;
};

// Update flight information and its seats used by admin
export const updatedFlight = async (id, data) => {
  const { estimatedDeparture, estimatedArrival, seats } = data;
  const estimatedDepartureTime = estimatedDeparture
    ? new Date(estimatedDeparture)
    : null;
  const estimatedArrivalTime = estimatedArrival
    ? new Date(estimatedArrival)
    : null;
  console.log(data);
  const flight = await prisma.flight.findUnique({
    where: {
      id,
      status: {
        in: ["DELAYED", "SCHEDULED"],
      },
    },
  });
  if (!flight) {
    throw new Error("Flight not found or has taken off");
  }

  console.log(flight);

  if (
    (estimatedDepartureTime < flight.departureTime &&
      flight.estimatedDeparture == null) ||
    (flight.estimatedDeparture != null &&
      estimatedDepartureTime < flight.estimatedDeparture)
  ) {
    throw new Error(
      "The flight's schedule prevents an early departure, which may inconvenience the customer."
    );
  }
  await seats.map(async (seat) => {
    const oldSeat = await getFlightSeatBySeatClassAndFlight(id, seat.seatClass);
    if (seat.totalSeats < oldSeat.bookedSeats) {
      throw new Error("Total seats 's not less than booked seats");
    }
    const dataSeat = {
      totalSeats: seat.totalSeats,
      price: seat.price,
    };
    await updateFlightSeat(oldSeat.id, dataSeat);
  });

  if (
    (estimatedDepartureTime === flight.departureTime ||
      estimatedDepartureTime === flight.estimatedDeparture) &&
    (estimatedArrivalTime === flight.estimatedArrival ||
      estimatedArrivalTime === flight.arrivalTime)
  ) {
    return flight;
  }

  const flightData = {
    estimatedDeparture,
    estimatedArrival,
    status: "DELAYED",
  };

  return await prisma.flight.update({
    where: { id },
    data: {
      ...flightData,
    },
  });
};

// Get all flights with pagination and search functionality used by admin
export const getFlightsBySearch = async (
  page = 1,
  pageSize = 10,
  query = "",
  sortBy = "departureTime",
  sortOrder = "asc"
) => {
  const searchCondition = query
    ? {
        OR: [
          { flightNumber: { contains: query, mode: "insensitive" } },
          {
            departureAirport: {
              is: {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { iataCode: { contains: query, mode: "insensitive" } },
                  { icaoCode: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          },
          {
            arrivalAirport: {
              is: {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { iataCode: { contains: query, mode: "insensitive" } },
                  { icaoCode: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          },
          {
            aircraft: {
              is: {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { manufacturer: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          },
        ],
      }
    : {};

  const skip = (page - 1) * pageSize;

  let orderByOption;

  if (
    sortBy === "departureAirport" ||
    sortBy === "arrivalAirport" ||
    sortBy === "aircraft"
  ) {
    orderByOption = {
      [sortBy]: {
        name: sortOrder.toLowerCase() === "desc" ? "desc" : "asc",
      },
    };
  } else {
    orderByOption = {
      [sortBy]: sortOrder.toLowerCase() === "desc" ? "desc" : "asc",
    };
  }

  const flights = await prisma.flight.findMany({
    where: searchCondition,
    skip,
    take: pageSize,
    orderBy: orderByOption,
    include: {
      departureAirport: {
        select: {
          id: true,
          name: true,
          iataCode: true,
          icaoCode: true,
        },
      },
      arrivalAirport: {
        select: {
          id: true,
          name: true,
          iataCode: true,
          icaoCode: true,
        },
      },
      aircraft: {
        select: {
          id: true,
          name: true,
          manufacturer: true,
        },
      },
      seats: {
        select: {
          price: true,
          seatClass: true,
          totalSeats: true,
          bookedSeats: true,
        },
      },
    },
  });

  const flightsWithStats = flights.map((f) => {
    const seatsByClass = f.seats.map((s) => ({
      seatClass: s.seatClass,
      totalSeats: s.totalSeats,
      bookedSeats: s.bookedSeats,
      price: s.price,
    }));

    // Calculate total seats and booked seats of all classes
    const totalSeats = seatsByClass.reduce((sum, s) => sum + s.totalSeats, 0);
    const bookedSeats = seatsByClass.reduce((sum, s) => sum + s.bookedSeats, 0);

    return sanitize({
      ...f,
      seats: seatsByClass,
      totalSeats,
      bookedSeats,
    });
  });

  const totalFlights = await prisma.flight.count({
    where: searchCondition,
  });

  return {
    flights: flightsWithStats,
    totalPages: Math.ceil(totalFlights / pageSize),
    currentPage: page,
  };
};

export const cancelFlight = async (id) => {
  const flight = await prisma.flight.findUnique({
    where: {
      id: Number(id),
      status: {
        in: ["SCHEDULED", "DELAYED"],
      },
    },
  });

  if (!flight) {
    throw new Error("Flight not found");
  }
  return await prisma.flight.update({
    where: { id: Number(id) },
    data: {
      status: "CANCELLED",
    },
  });
};

// Filter flights based on various criteria used by admin
export const filterFlights = async (query) => {
  const {
    id,
    flightNumber,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    status,
    aircraft,
  } = query;
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 10;

  const where = {};
  if (id) where.id = { equals: id };
  if (flightNumber) where.flightNumber = { equals: flightNumber };
  if (departureTime) {
    const start = new Date(departureTime);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    where.departureTime = { gte: start, lt: end };
  }
  if (arrivalTime) {
    const startA = new Date(arrivalTime);
    const endA = new Date(startA);
    endA.setDate(endA.getDate() + 1);
    where.arrivalTime = { gte: startA, lt: endA };
  }
  if (status) where.status = { equals: status };
  if (departureAirport)
    where.departureAirport = {
      is: { name: { contains: departureAirport, mode: "insensitive" } },
    };
  if (arrivalAirport)
    where.arrivalAirport = {
      is: { name: { contains: arrivalAirport, mode: "insensitive" } },
    };
  if (aircraft)
    where.aircraft = {
      is: { name: { contains: aircraft, mode: "insensitive" } },
    };

  if (Object.keys(where).length === 0)
    throw new Error("At least one filter param is required");

  const skip = (page - 1) * pageSize;

  const flights = await prisma.flight.findMany({
    where,
    skip,
    take: pageSize,
    include: {
      departureAirport: {
        select: { id: true, name: true, iataCode: true, icaoCode: true },
      },
      arrivalAirport: {
        select: { id: true, name: true, iataCode: true, icaoCode: true },
      },
      aircraft: { select: { id: true, name: true, manufacturer: true } },
      seats: {
        select: {
          price: true,
          seatClass: true,
          totalSeats: true,
          bookedSeats: true,
        },
      },
    },
  });

  const flightsWithStats = flights.map((f) => {
    const seatsByClass = f.seats.map((s) => ({
      seatClass: s.seatClass,
      totalSeats: s.totalSeats,
      bookedSeats: s.bookedSeats,
      price: s.price,
    }));

    // Calculate total seats and booked seats of all classes
    const totalSeats = seatsByClass.reduce((sum, s) => sum + s.totalSeats, 0);
    const bookedSeats = seatsByClass.reduce((sum, s) => sum + s.bookedSeats, 0);

    return sanitize({
      ...f,
      seats: seatsByClass,
      totalSeats,
      bookedSeats,
    });
  });

  const totalFlights = await prisma.flight.count({
    where,
  });

  return {
    flights: flightsWithStats,
    totalPages: Math.ceil(totalFlights / pageSize),
    currentPage: page,
  };
};

// Search flights for user in a specific trip
export const searchFlightsForUser = async (params) => {
  const {
    tripType,
    departureAirport,
    arrivalAirport,
    startDate,
    returnDate,
    adults = 1,
    children = 0,
    infants = 0,
  } = params;

  if (!tripType || !departureAirport || !arrivalAirport || !startDate) {
    throw new Error(
      "tripType, departureAirport, arrivalAirport and startDate are required"
    );
  }
  if (tripType === "twoway" && !returnDate) {
    throw new Error("Return Date is required for twoway trip");
  }

  // Tổng số ghế cần đặt (infants không sử dụng ghế)
  const totalPassengers = adults + children;
  if (totalPassengers < 1) {
    throw new Error("Must have at least 1 adult or child");
  }

  const buildWhere = (from, to, dateValue) => {
    const start = new Date(dateValue);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    console.log(start, end);

    return {
      departureAirport: {
        is: { name: { contains: from, mode: "insensitive" } },
      },
      arrivalAirport: { is: { name: { contains: to, mode: "insensitive" } } },
      OR: [
        { status: "SCHEDULED", departureTime: { gte: start, lt: end } },
        { status: "DELAYED", estimatedDeparture: { gte: start, lt: end } },
      ],
    };
  };

  const fetchAndFilter = async (where) => {
    const flights = await prisma.flight.findMany({
      where,
      include: {
        departureAirport: {
          select: { id: true, name: true, iataCode: true, icaoCode: true },
        },
        arrivalAirport: {
          select: { id: true, name: true, iataCode: true, icaoCode: true },
        },
        aircraft: { select: { id: true, name: true, manufacturer: true } },
        seats: {
          select: {
            seatClass: true,
            price: true,
            totalSeats: true,
            bookedSeats: true,
          },
        },
      },
    });

    return flights.map((f) => {
      const seatsWithAvailability = f.seats.map((s) => ({
        ...s,
        availableSeats: s.totalSeats - s.bookedSeats,
      }));

      const usable = seatsWithAvailability.filter(
        (s) => s.availableSeats >= totalPassengers
      );
      if (!usable.length) {
        return null;
      }
      return sanitize({ ...f, seats: usable });
    });
  };

  const outboundWhere = buildWhere(departureAirport, arrivalAirport, startDate);
  const outbound = await fetchAndFilter(outboundWhere);

  if (!outbound.length) {
    if (tripType === "oneway") return { outbound: [] };
    throw new Error("No suitable trip found");
  }

  if (tripType === "twoway") {
    const inboundWhere = buildWhere(
      arrivalAirport,
      departureAirport,
      returnDate
    );
    const inbound = await fetchAndFilter(inboundWhere);

    if (!inbound.length) {
      throw new Error("No suitable trip found");
    }

    return { outbound, inbound };
  }

  return { outbound };
};

export const countFlights = async () => {
  return await prisma.flight.count();
};

export const countStatus = async () => {
  const statusCounts = await prisma.flight.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  // Danh sách tất cả trạng thái có trong enum
  const ALL_STATUSES = ["Scheduled", "Delayed", "Departed", "Arrived", "Cancelled"];

  // Chuyển kết quả groupBy thành map để tra nhanh
  const resultMap = Object.fromEntries(
    statusCounts.map((item) => [capitalize(item.status), item._count.id])
  );

  // Trả về đủ 5 trạng thái, nếu không có thì count = 0
  return ALL_STATUSES.map((status) => ({
    status,
    count: resultMap[status] || 0,
  }));
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}