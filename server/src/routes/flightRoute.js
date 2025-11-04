import express from "express";
import * as flightController from "../controllers/flightController.js";
import adminAuth from "../middleware/adminAuth.js";

export const flightRoute = express.Router();

// Search flights by query with a limit of 20 results for client-side search
flightRoute.get("/search-flights-in-ticket/:q",flightController.searchFlightsInTicket)

// Get all flights, search by query, filter, count, and CRUD operations used by the admin
flightRoute.get("/get-flights-by-search",adminAuth,flightController.getFlightsBySearch)
// Filter flights based on certain criteria used by the admin
flightRoute.get("/filter",adminAuth,flightController.filterFlights)
flightRoute.get("/search-flights-by-user",flightController.searchFlightsForUser)
// Count all flights used by the admin
flightRoute.get("/count-flights", adminAuth,flightController.countFlights);
flightRoute.get("/count-status", flightController.countStatus);
flightRoute.get("/:id", flightController.getFlightById);

flightRoute.post("/", adminAuth,flightController.createFlight);
flightRoute.put("/:id", flightController.updateFlight);
flightRoute.delete("/:id", adminAuth,flightController.cancelFlight);
