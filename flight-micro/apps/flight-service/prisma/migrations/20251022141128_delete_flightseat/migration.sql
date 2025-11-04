/*
  Warnings:

  - You are about to drop the `FlightSeat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."FlightSeat" DROP CONSTRAINT "FlightSeat_flight_id_fkey";

-- DropTable
DROP TABLE "public"."FlightSeat";
