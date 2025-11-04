import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import transporter from "../config/nodemailer.js";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
} from "../repositories/userRepository.js";
import { empty } from "@prisma/client/runtime/library";

dotenv.config();



export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new Error("Missing Details");
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(name, email, hashedPassword);
    /*const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: "localhost",
    });*/
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to QAirline",
      text: "Welcome to my website ",
    };
    await transporter.sendMail(mailOptions);
    const safeUser = user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          isAccountVerified: user.isAccountVerified,
          role: user.role,
        }
      : null;

    res.json({
      success: true,
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Missing Details");
    }

    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    if (user.isAccountVerified === true) {
      const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
        domain:
          process.env.NODE_ENV === "production" ? "domain.com" : "localhost",
        //domain: "localhost",
      });
    }
    const safeUser = user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          isAccountVerified: user.isAccountVerified,
          role: user.role,
        }
      : null;

    res.json({ success: true, message: "Login successfully", user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      domain:
        process.env.NODE_ENV === "production" ? "domain.com" : "localhost",
    });
    res.json({ success: true, message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await findUserById(id);
    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account is already verified",
      });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await updateUser(id, {
      verifyOtp: user.verifyOtp,
      verifyOtpExpireAt: user.verifyOtpExpireAt,
    });
    //console.log("Passing")
    // Send OTP to user's email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Verification OTP Sent on Email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { id, otp } = req.body;
  if (!id || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await findUserById(id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
      domain:
        process.env.NODE_ENV === "production" ? "domain.com" : "localhost",
      //domain: "localhost",
    });
    const userUpdate = await updateUser(id, {
      isAccountVerified: true,
      verifyOtp: "",
      verifyOtpExpireAt: 0,
    });
    const safeUser = {
      id: userUpdate.id,
      name: userUpdate.name,
      email: userUpdate.email,
      isAccountVerified: userUpdate.isAccountVerified,
      role: userUpdate.role,
    };

    return res.json({
      success: true,
      message: "Email verified successfully",
      user: safeUser,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
/*export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ succes: false, message: error.message });
  }
};*/

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(500)
      .json({ success: false, message: "Email is required" });
  }
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await updateUser(user.id, {
      resetOtp: user.resetOtp,
      resetOtpExpireAt: user.resetOtpExpireAt,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp} Use this OTP to proceed with resetting your password`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Reset OTP sent on Email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.json({
      success: false,
      message: "Email, OTP are required",
    });
  }
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not found" });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(500).json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(500).json({ success: false, message: "OTP Expired" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
      domain:
        process.env.NODE_ENV === "production" ? "domain.com" : "localhost",
      //domain: "localhost",
    });
    if (user.isAccountVerified !== true) {
      await updateUser(user.id, { isAccountVerified: true });
    }
    const safeUser = user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          isAccountVerified: true,
          role: user.role,
        }
      : null;
    return res.status(200).json({
      success: true,
      message: "OTP is correct",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  if (!userId || !newPassword) {
    return res.json({
      success: false,
      message: "Id, new password are required",
    });
  }
  try {
    const user = await findUserById(userId);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUser(user.id, {
      resetOtp: "",
      resetOtpExpireAt: 0,
      password: hashedPassword,
    });
    return res.json({
      success: true,
      message: "Reset password successfully",
    });
  } catch (error) {
    return res.status(500).json({ succes: false, message: error.message });
  }
};
