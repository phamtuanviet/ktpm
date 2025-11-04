import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This function reads a CSV file and imports airport data into the database
async function importCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          name: data.name,
          iataCode: data.iataCode,
          icaoCode: data.icaoCode,
          country: data.country,
          city: data.city,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          type: data.type
        });
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

// Main function to execute the import
async function main() {
  try {
    const filePath = 'data_importer/airports/airports.csv';
    const airports = await importCSV(filePath);

    const result = await prisma.airport.createMany({
      data: airports
    });
    console.log(`Đã thêm ${result.count} bản ghi vào bảng Airport`);
  } catch (error) {
    console.error('Có lỗi xảy ra:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
