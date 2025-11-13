import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FlightCronService {
  private readonly logger = new Logger(FlightCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Chạy mỗi phút
  @Cron('* * * * *')
  async handleFlightStatusUpdate() {
    const now = new Date();

    try {
      await this.prisma.flight.updateMany({
        where: {
          OR: [
            { status: 'SCHEDULED', departureTime: { lte: now } },
            { status: 'DELAYED', estimatedDeparture: { lte: now } },
          ],
        },
        data: { status: 'DEPARTED' },
      });

      const flights = await this.prisma.flight.findMany({
        where: { status: 'DEPARTED' },
      });

      for (const flight of flights) {
        const arrivalCheckTime = flight.estimatedArrival ?? flight.arrivalTime;
        if (arrivalCheckTime && arrivalCheckTime <= now) {
          await this.prisma.flight.update({
            where: { id: flight.id },
            data: { status: 'ARRIVED' },
          });
        }
      }

      this.logger.log(`Flight status updated at ${now.toISOString()}`);
    } catch (error) {
      this.logger.error(
        `Error updating flight status at ${now.toISOString()}`,
        error.stack,
      );
    }
  }
}
