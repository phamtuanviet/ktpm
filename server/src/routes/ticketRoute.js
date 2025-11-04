import express from "express";
import * as ticketController from "../controllers/ticketController.js";
import adminAuth from "../middleware/adminAuth.js";

export const ticketRoute = express.Router();

ticketRoute.get("/get-tickets-by-search", ticketController.getTicketsBySearch);
ticketRoute.get("/count-all-ticket", ticketController.countAllTicket);
ticketRoute.get(
  "/count-cancelled-ticket",
  ticketController.countCancelledTicket
);
ticketRoute.get("/count-ticket-stats", ticketController.countTicketStats);
ticketRoute.get(
  "/get-all-flight/:flightId",
  ticketController.getAllTicketsFromFlight
);


ticketRoute.get("/look-up/:search", ticketController.lookUpTicket);

// Filtering and searching
ticketRoute.get("/filter",adminAuth, ticketController.filterTickets);
ticketRoute.get("/:id", ticketController.getTicketById);
ticketRoute.post("/", ticketController.createTicket);

// Ticket client request handling
ticketRoute.post("/ticket-client", ticketController.handleTicketClientRequest);

// Cancel ticket
ticketRoute.put("/cancel", ticketController.cancelTicket);
ticketRoute.delete("/:id", adminAuth, ticketController.deleteTicket);
