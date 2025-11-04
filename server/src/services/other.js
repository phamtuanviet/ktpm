export function generateBookingReference(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateFlightNumber() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const prefix =
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)];

  const number = Math.floor(1000 + Math.random() * 9000); // từ 1000 đến 9999

  return `${prefix}${number}`;
}