import { Visitor } from "../models/visitor.model.js";

// create a new visitor when, someone first time visit the website
export const createNewVisitor = async (req, res) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress ||
    "unknown-ip";
  const platform = req.headers["sec-ch-ua-platform"] || "unknown-platform";
  try {
    const visitor = await Visitor.create({ ...req.body, ip, platform });
    if (!visitor) {
      return res.status(400).json({ message: "Visitor not created" });
    }
    return res
      .status(201)
      .setHeader("X-Visitor-ID", visitor._id.toString())
      .cookie("visitorId", visitor._id.toString(), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365,
      })
      .json({
        success: true,
        status: 201,
        message: "Visitor id created",
        visitorId: visitor._id,
      });
  } catch (error) {
    return res.status(500).json({
      success: true,
      status: 500,
      message: "Error while creating visitor id",
      error: error.message,
    });
  }
};

// Store session duration for each user
export const trackSessionTime = async (req, res) => {
  const { sessionDuration, connectionType, pageURL } = req.body;
  const visitorId = req.headers["x-visitor-id"];
  const newIp =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress ||
    "unknown-ip";

  if (!visitorId) {
    return res
      .status(404)
      .json({ success: false, status: 404, error: "Visitor ID is required" });
  }

  try {
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res
        .status(404)
        .json({ success: false, status: 404, error: "Visitor not found" });
    }
    visitor.addUniqueIp(newIp);
    visitor.addSession(sessionDuration);
    visitor.addConnectionType(connectionType);
    visitor.addPageURL(pageURL);
    await visitor.save();
    return res.status(200).json({ message: "Session recorded" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error tracking session time",
      error: error.message,
    });
  }
};
