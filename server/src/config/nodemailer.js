import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config()

// configure the SMTP transporter
// using Brevo (formerly Sendinblue) SMTP settings
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, 
  requireTLS: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, 
  },
});



export default transporter;