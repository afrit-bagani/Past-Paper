import { z } from "zod";
import { Suggestion } from "../models/suggestion.model.js";
import mongoose from "mongoose";

// Get all suggestion
export const getSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find()
      .select("-phoneNo")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Fetched suggestion successfully",
      suggestions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error while fetching suggestions",
      error: error.message,
    });
  }
};

// create new suggestion
export const createSuggestion = async (req, res) => {
  const { name, phoneNo, description } = req.body;
  if (!(name && phoneNo && description)) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Name, phone no and description is reuired",
    });
  }
  try {
    const suggestionSchema = z.object({
      name: z.string(),
      phoneNo: z.string(),
      description: z.string().max(200),
    });
    const parseData = suggestionSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Input validation failed",
      });
    }
    const suggestion = await Suggestion.create({ name, phoneNo, description });
    const suggestionObj = suggestion.toObject();
    delete suggestionObj.phoneNo;
    return res.status(201).json({
      success: true,
      status: 201,
      message: "Suggestion submit",
      suggestion: suggestionObj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating suggestion",
      error: error.message,
    });
  }
};

// Add like
export const addLike = async (req, res) => {
  const { suggestionId, visitorId } = req.body;
  if (!suggestionId) {
    return res
      .status(400)
      .json({ success: false, status: 400, message: "No id received" });
  }
  try {
    const validSuggestionId =
      suggestionId && new mongoose.Types.ObjectId(suggestionId);
    const validVisitorId = visitorId && new mongoose.Types.ObjectId(visitorId);
    if (!(suggestionId && visitorId)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Suggestion id and visitor id both are required",
      });
    }
    const suggestion = await Suggestion.findById(validSuggestionId);
    if (!suggestion) {
      return res
        .status(400)
        .json({ success: false, message: "Suggestion not found" });
    }
    suggestion.increaseLike(validVisitorId);
    await suggestion.save();
    return res
      .status(200)
      .json({ success: true, status: 200, message: "Liked suggestion" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Like not added",
      error: error.message,
    });
  }
};

// Remove like
export const removeLike = async (req, res) => {
  const { suggestionId, visitorId } = req.body;
  if (!(suggestionId && visitorId)) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Suggestion id and visitor id both is required",
    });
  }
  try {
    if (
      !(
        new mongoose.Types.ObjectId(suggestionId) &&
        new mongoose.Types.ObjectId(visitorId)
      )
    ) {
      return res.status(400).json({
        success: false,
        status: 400,
        message:
          "Suggestion id and visitor is invalid, it is not a mongo db object id",
      });
    }

    const suggestion = await Suggestion.findById(suggestionId);
    if (!suggestion) {
      return res
        .status(404)
        .json({ success: false, message: "Suggestion not found" });
    }

    suggestion.decreaseLike(visitorId);
    await suggestion.save();
    return res
      .status(200)
      .json({ success: true, status: 200, message: "Like remove" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Likes not removed",
      error: error.message,
    });
  }
};
