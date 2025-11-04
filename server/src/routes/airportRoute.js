import express from "express";
import {
  getAirports,
  getAirport,
  createNewAirport,
  updateExistingAirport,
  deleteExistingAirport,
  searchAirport,
  searchAirportsInFlight,
} from "../controllers/airportController.js";
import adminAuth from "../middleware/adminAuth.js";

export const airportRoute = express.Router();

airportRoute.get("/get/:id", getAirport);
// Get airports by search query with 20 results limit for client-side search
airportRoute.get("/search-airports/:q", searchAirport);

// Hint for searching airports in flight with 10 results limit to automatically complete airport names used by admin
airportRoute.get("/search-airports-in-flight/:q", searchAirportsInFlight);
airportRoute.post("/create", adminAuth, createNewAirport);
airportRoute.put("/update/:id", adminAuth, updateExistingAirport);
airportRoute.delete("/delete/:id", adminAuth, deleteExistingAirport);
