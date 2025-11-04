import { prisma } from "../services/prisma.js";

// Create a new OTP for email verification to buying a ticket
export async function createOtp(email, otp, ttlSeconds = 1000) {
  return prisma.emailVerification.create({
    data: {
      email,
      otp,
      expiresAt: new Date(Date.now() + ttlSeconds * 1000)
    }
  });
}

// To check if an OTP is valid , used in the verification process of buying a ticket
export async function verifyOtp(email, otp) {
  const record = await prisma.emailVerification.findFirst({
    where: {
      email,
      otp,
      used: false,
      expiresAt: { gt: new Date() }
    }
  });
  if (!record) throw new Error('Invalid or expired OTP');
  await prisma.emailVerification.update({
    where: { id: record.id },
    data: { used: true }
  });
}
