import express from "express";
import {
  getRevenue,
} from "../controllers/revenueController.js";

export const revenueRoute = express.Router();

revenueRoute.get("/get-revenue", getRevenue);