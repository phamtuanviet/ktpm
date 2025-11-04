import * as flightSeatRepository from "../repositories/flightSeatRepository.js";

export const getAllFlightSeats = async (req, res) => {
  try {
    const flightSeats = await flightSeatRepository.getAllFlightSeats();
    res.status(200).json({ success: true, data: flightSeats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFlightSeatById = async (req, res) => {
  try {
    const flightSeat = await flightSeatRepository.getFlightSeatById(
      req.params.id
    );
    if (!flightSeat) {
      return res.status(404).json({ error: "FlightSeat not found" });
    }
    res.status(200).json({ success: true, data: flightSeat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFlightSeat = async (req, res) => {
  try {
    const { flightId, totalSeats, price, seatClass } = req.body;
    if (totalSeats < 1 || price <= 0) {
      return res
        .status(500)
        .json({ success: false, message: "Total Seat or price invalid" });
    }
    if (!flightId || !totalSeats || !price || !seatClass) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required field" });
    }
    const newFlightSeat = await flightSeatRepository.createFlightSeat({
      flightId,
      totalSeats,
      price,
      seatClass,
    });
    res.status(201).json({ success: true, data: newFlightSeat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFlightSeat = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedFlightSeat = await flightSeatRepository.updateFlightSeat(
      id,
      req.body
    );
    res.status(200).json({ success: true, data: updatedFlightSeat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookedSeat = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedFlightSeat = await flightSeatRepository.updateBookedSeat(id);
    res.status(200).json({ success: true, data: updatedFlightSeat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFlightSeat = async (req, res) => {
  try {
    const deleteledFlightSeat = await flightSeatRepository.deleteFlightSeat(
      req.params.id
    );
    res.status(200).json({ success: true, data: deleteledFlightSeat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
