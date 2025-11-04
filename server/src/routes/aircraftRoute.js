import express from "express";
import * as aircraftController from "../controllers/aircraftController.js";
import adminAuth from "../middleware/adminAuth.js";

export const aircraftRoute = express.Router();

// Define routes for aircraft operations

// Get all aircrafts, search by query, filter, count, and CRUD operations used by the admin
aircraftRoute.get(
  "/get-aircrafts-by-search",
  adminAuth,
  aircraftController.getAircraftsBySearch
);

// Counnt all aircrafts
aircraftRoute.get(
  "/count-aircrafts",
  adminAuth,
  aircraftController.countAircrafts
);

// Filter aircrafts based on certain criteria
aircraftRoute.get("/filter", adminAuth, aircraftController.filterAircrafts);

// Automatically complete aircraft names used by admin
aircraftRoute.get(
  "/search-aircrafts-in-flight/:q",
  aircraftController.searchAircraftsInFlight
);
aircraftRoute.get("/:id", aircraftController.getAircraft);
aircraftRoute.post("/", adminAuth, aircraftController.createNewAircraft);
aircraftRoute.put("/:id", aircraftController.updateExistingAircraft);
aircraftRoute.delete(
  "/:id",
  adminAuth,
  aircraftController.deleteExistingAircraft
);
