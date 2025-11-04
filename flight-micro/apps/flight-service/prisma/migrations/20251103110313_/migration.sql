-- CreateEnum
CREATE TYPE "SagaStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- DropIndex
DROP INDEX "public"."Flight_departure_airport_id_arrival_airport_id_departureTim_idx";

-- DropIndex
DROP INDEX "public"."Flight_flightNumber_idx";

-- AlterTable
ALTER TABLE "Flight" ADD COLUMN     "sagaStatus" "SagaStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Airport_city_idx" ON "Airport"("city");

-- CreateIndex
CREATE INDEX "Flight_sagaStatus_departure_airport_id_idx" ON "Flight"("sagaStatus", "departure_airport_id");

-- CreateIndex
CREATE INDEX "Flight_sagaStatus_arrival_airport_id_idx" ON "Flight"("sagaStatus", "arrival_airport_id");

-- CreateIndex
CREATE INDEX "Flight_sagaStatus_flightNumber_idx" ON "Flight"("sagaStatus", "flightNumber");

-- CreateIndex
CREATE INDEX "Flight_sagaStatus_status_idx" ON "Flight"("sagaStatus", "status");

-- CreateIndex
CREATE INDEX "Flight_sagaStatus_departureTime_idx" ON "Flight"("sagaStatus", "departureTime");

-- CreateIndex
CREATE INDEX "Flight_sagaStatus_arrivalTime_idx" ON "Flight"("sagaStatus", "arrivalTime");
