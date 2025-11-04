import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This cron job updates flight statuses every minute
// It checks for flights that are scheduled or delayed and updates their status to departed if the departure time has passed
export const startFlightStatusCron = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    await prisma.flight.updateMany({
      where: {
        OR: [
          { status: "SCHEDULED", departureTime: { lte: now } },
          { status: "DELAYED", estimatedDeparture: { lte: now } },
        ],
      },
      data: { status: "DEPARTED" },
    });

    const flights = await prisma.flight.findMany({
      where: { status: "DEPARTED" },
    });

    for (const flight of flights) {
      const arrivalCheckTime = flight.estimatedArrival ?? flight.arrivalTime;

      if (arrivalCheckTime && arrivalCheckTime <= now) {
        await prisma.flight.update({
          where: { id: flight.id },
          data: { status: "ARRIVED" },
        });
      }
    }

    console.log(`[CRON] Flight status updated at ${now.toISOString()}`);
  });
};
