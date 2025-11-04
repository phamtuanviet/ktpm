import express from "express";
import * as flightSeatController from "../controllers/flightSeatController.js";
import adminAuth from "../middleware/adminAuth.js";

export const flightSeatRoute = express.Router();

flightSeatRoute.get(
  "/get-all-flight-seats",
  flightSeatController.getAllFlightSeats
);
flightSeatRoute.get("/:id", flightSeatController.getFlightSeatById);
flightSeatRoute.post("/", adminAuth, flightSeatController.createFlightSeat);
flightSeatRoute.put("/:id", flightSeatController.updateFlightSeat);
flightSeatRoute.put("/booked/:id", flightSeatController.updateBookedSeat);
flightSeatRoute.delete(
  "/:id",
  adminAuth,
  flightSeatController.deleteFlightSeat
);
