-- CreateIndex
CREATE INDEX "Passenger_fullName_idx" ON "Passenger"("fullName");

-- CreateIndex
CREATE INDEX "Ticket_bookingReference_idx" ON "Ticket"("bookingReference");

-- CreateIndex
CREATE INDEX "Ticket_cancelCode_idx" ON "Ticket"("cancelCode");

-- CreateIndex
CREATE INDEX "Ticket_seatNumber_idx" ON "Ticket"("seatNumber");
