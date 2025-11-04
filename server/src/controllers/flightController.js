import * as flightRepository from "../repositories/flightRepository.js";

export const getAllFlights = async (req, res) => {
  try {
    const flights = await flightRepository.getAllFlights();
    res.status(200).json({ success: true, data: flights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFlightById = async (req, res) => {
  try {
    const flight = await flightRepository.getFlightById(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: "Flight not found" });
    }
    res.status(200).json({ success: true, data: flight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFlight = async (req, res) => {
  try {
    const {
      flightNumber,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      aircraft,
      seats,
    } = req.body;

    if (arrivalTime <= departureTime) {
      return res.status(500).json({ success: false, message: "Invalid time" });
    }
    if (
      !departureAirport ||
      !arrivalAirport ||
      !departureTime ||
      !arrivalTime ||
      !aircraft ||
      !seats.length === 3
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required field",
        data: req.body,
      });
    }
    const newFlight = await flightRepository.createFlight(
      req.body
    );
    res.status(201).json({ success: true, data: newFlight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFlightsBySearch = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const query = req.query.query || "";
    const sortBy = req.query.sortBy || "id";
    const sortOrder = req.query.sortOrder || "asc";

    const { flights, totalPages, currentPage } =
      await flightRepository.getFlightsBySearch(
        page,
        pageSize,
        query,
        sortBy,
        sortOrder
      );

    return res.json({
      success: true,
      data: {
        flights,
        totalPages,
        currentPage,
      },
    });
  } catch (error) {
    console.error("Error in getPaginatedFlights:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFlight = async (req, res) => {
  try {
    const { departureTime, arrivalTime,seats } = req.body;
    if (arrivalTime <= departureTime) {
      return res.status(500).json({ success: false, message: "Invalid time" });
    }
    const updatedFlight = await flightRepository.updatedFlight(
      req.params.id,
      {
        estimatedDeparture: departureTime,
        estimatedArrival: arrivalTime,
        seats
      }
    );
    res.status(200).json({ success: true, data: updatedFlight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchFlightsInTicket = async (req, res) => {
  try {
    const { q } = req.params;
    if (!q) {
      return res.status(400).json({ error: "Query parameter q is required" });
    }
    const results = await flightRepository.searchFlightsByName(q);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelFlight = async (req, res) => {
  try {
    const cancelledFlight = await flightRepository.cancelFlight(req.params.id);
    res.status(200).json({ success: true, data: cancelledFlight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const filterFlights = async (req, res) => {
  try {
    const data = await flightRepository.filterFlights(req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.message.includes('At least one')) return res.status(400).json({ success: false, error: err.message });
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const searchFlightsForUser = async (req, res) => {
  try {
    const data = await flightRepository.searchFlightsForUser(req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.message.includes('At least one')) return res.status(400).json({ success: false, error: err.message });
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
  }
};

export const countFlights = async (req, res) => {
  try {
    const count = await flightRepository.countFlights();
    return res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error in countFlights:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const countStatus = async (req, res) => {
  try {
    const count = await flightRepository.countStatus();
    return res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error in countStatus:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};