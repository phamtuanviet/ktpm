import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/authRoute.js";
import userRouter from "./routes/useRoute.js";
import { airportRoute } from "./routes/airportRoute.js";
import { newsRoute } from "./routes/newsRoute.js";
import { aircraftRoute } from "./routes/aircraftRoute.js";
import { flightRoute } from "./routes/flightRoute.js";
import { startFlightStatusCron } from "./services/flightStatusCron.js";
import { flightSeatRoute } from "./routes/flightSeatRoute.js";
import { ticketRoute } from "./routes/ticketRoute.js";
import { revenueRoute } from "./routes/revenueRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;
startFlightStatusCron();

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(cookieParser());
// Cors middleware to allow cross-origin requests
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/airport", airportRoute);
app.use("/api/news", newsRoute);
app.use("/api/aircraft", aircraftRoute);
app.use("/api/flight", flightRoute);
app.use("/api/flight-seat", flightSeatRoute);
app.use("/api/ticket", ticketRoute);
app.use("/api/revenue", revenueRoute);
const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

app.get("/api/test/check-health", (req, res) => {
  const num = 40; 
  
  // Bắt đầu tính toán nặng
  const result = fibonacci(num);

  res.json({
    status: "heavy fibonacci task done",
    result: result,
  });
});

app.get("/api/test/check-health1", (req, res) => {
  
  res.json({
    status: "heavy fibonacci task done",
    result: new Date(),
  });
});

// Listen requests on the specified port
app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});


