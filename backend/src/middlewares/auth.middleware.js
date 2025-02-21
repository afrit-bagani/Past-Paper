import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refershToken"
    );
    if (!user) {
      return res
        .status(402)
        .json({ success: false, message: "Token is invalid" });
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Invalid token", error: error.message });
  }
};

export const authorize = (permission) => (req, res, next) => {
  // Different user role
  const roles = {
    User: ["read", "upload"],
    Moderator: ["read", "upload", "createFolder", "renameFile", "renameFolder"],
    Admin: [
      "read",
      "upload",
      "createFolder",
      "renameFile",
      "renameFolder",
      "deleteFile",
      "deleteFolder",
      "manageModerator",
    ],
  };
  const userRole = req.user?.role || "User";
  if (!roles[userRole].includes(permission)) {
    return res.status(403).json({
      success: false,
      status: 403,
      message: `${userRole} don't have permission for ${permission}`,
    });
  }
  next();
};
