import { prisma } from "../services/prisma.js";

import { startOfDay, subDays, addDays } from "date-fns";

export const getAllRevenue = async () => {
  const today = startOfDay(new Date());
  const sevenDaysAgo = subDays(today, 6);
  const tomorrow = addDays(today, 1);

  // console.log('today', today);

  const tickets = await prisma.ticket.findMany({
    where: {
      isCancelled: false,
      bookedAt: {
        gte: sevenDaysAgo,
        lt: tomorrow,
      },
    },
    include: {
      flightSeat: true,
    },
  });

  // Tạo map doanh thu mặc định
  const revenueMap = {};

  for (let i = 0; i < 7; i++) {
    const current = addDays(sevenDaysAgo, i);
    current.setHours(current.getHours() + 7);
    const date = current.toISOString().slice(0, 10);
    revenueMap[date] = 0;
  }

  // Cộng doanh thu theo ngày
  tickets.forEach((ticket) => {
    const date = new Date(ticket.bookedAt);
    date.setHours(date.getHours() + 7);
    const dateKey = date.toISOString().slice(0, 10);
    const price = ticket.flightSeat.price;
    const discount = ticket.discount;
    const revenue = price * (1 - discount);

    if (revenueMap[dateKey] !== undefined) {
      revenueMap[dateKey] += revenue;
    }
  });

  // Trả về danh sách ngày & doanh thu, định dạng ngày là d/m/yyyy (không thêm số 0)
  const result = Object.entries(revenueMap)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([isoDate, total]) => {
      const dateObj = new Date(isoDate);
      const day = dateObj.getDate(); // 1–31
      const month = dateObj.getMonth() + 1; // 0–11 → 1–12
      const year = dateObj.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      return { date: formattedDate, total };
    });

  return result;
};
