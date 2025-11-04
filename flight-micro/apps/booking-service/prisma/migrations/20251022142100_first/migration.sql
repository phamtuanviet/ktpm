-- CreateEnum
CREATE TYPE "SeatClass" AS ENUM ('ECONOMY', 'BUSINESS', 'FIRST_CLASS');

-- CreateEnum
CREATE TYPE "PassengerType" AS ENUM ('ADULT', 'CHILD', 'INFANT');

-- CreateTable
CREATE TABLE "Passenger" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "passport" TEXT,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightSeat" (
    "id" SERIAL NOT NULL,
    "flightId" TEXT NOT NULL,
    "seatClass" "SeatClass" NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "bookedSeats" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlightSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "flightId" TEXT NOT NULL,
    "bookedById" TEXT,
    "bookingReference" TEXT NOT NULL,
    "cancelCode" TEXT NOT NULL,
    "seatNumber" TEXT,
    "flightSeatId" INTEGER NOT NULL,
    "passengerId" TEXT,
    "passengerType" "PassengerType" NOT NULL DEFAULT 'ADULT',
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isCancelled" BOOLEAN NOT NULL DEFAULT false,
    "bookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRef" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserRef_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FlightSeat_flightId_idx" ON "FlightSeat"("flightId");

-- CreateIndex
CREATE UNIQUE INDEX "FlightSeat_flightId_seatClass_key" ON "FlightSeat"("flightId", "seatClass");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_bookingReference_key" ON "Ticket"("bookingReference");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_cancelCode_key" ON "Ticket"("cancelCode");

-- CreateIndex
CREATE INDEX "Ticket_flightId_idx" ON "Ticket"("flightId");

-- CreateIndex
CREATE INDEX "Ticket_bookedById_idx" ON "Ticket"("bookedById");

-- CreateIndex
CREATE UNIQUE INDEX "UserRef_email_key" ON "UserRef"("email");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_flightSeatId_fkey" FOREIGN KEY ("flightSeatId") REFERENCES "FlightSeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Passenger"("id") ON DELETE SET NULL ON UPDATE CASCADE;
