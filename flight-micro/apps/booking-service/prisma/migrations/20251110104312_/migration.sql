/*
  Warnings:

  - A unique constraint covering the columns `[flightId,seatClass]` on the table `FlightSeat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FlightSeat_flightId_seatClass_key" ON "FlightSeat"("flightId", "seatClass");
