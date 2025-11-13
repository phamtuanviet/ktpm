import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

async function main() {
  const airports: any[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream('src/domain/aircraft/data/airports.csv')
      .pipe(csv())
      .on('data', (row) => {
        airports.push({
          name: row.name,
          iataCode: row.iataCode,
          icaoCode: row.icaoCode,
          country: row.country,
          city: row.city,
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude),
          type: row.type,
        });
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });


  for (const a of airports) {
    try {
      await prisma.airport.create({ data: a });
    } catch (err: any) {
      console.error(`Error adding ${a.name}:`, err.message);
    }
  }

  await prisma.$disconnect();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
