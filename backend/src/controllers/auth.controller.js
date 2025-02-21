import { z } from "zod";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

// Generate access and refresh token
export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log({
      success: false,
      message: "Failed to create token",
      error: error.message,
    });
  }
};

//  Register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Registration failed",
      error: "Name, Email and password both are required to register",
    });
  }
  const registerSchema = z.object({
    name: z.string().max(50),
    email: z.string().email("Invaild email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(40, "Password must not exceed 40 characters"),
  });

  try {
    const parseData = registerSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Input vaildation failed",
        error: parseData.error.errors,
      });
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Email is already taken, please login",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    await User.create({ name, email, password: hashedPassword });
    return res
      .status(201)
      .json({ success: true, status: 201, message: "You are register" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "There is problem while registering the user",
      error: error.message,
    });
  }
};

// login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res
      .status(401)
      .json({ success: false, message: "Email and password is required" });
  }
  const loginSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Minimum 8 char is needed")
      .max(40, "Maximun 40 char is allowed"),
  });
  try {
    const parseData = loginSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status.json({
        success: false,
        message: "Input validation failed while login",
        error: parseData.error.errors,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email not found, register first",
      });
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Password is incorrect" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    return res
      .status(201)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 180 * 24 * 60 * 60 * 1000,
      })
      .json({ success: true, message: "You are login" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while login user",
      error: error.message,
    });
  }
};
