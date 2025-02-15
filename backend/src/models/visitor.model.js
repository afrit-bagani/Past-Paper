import { model, Schema } from "mongoose";

const visitorSchema = new Schema(
  {
    ipHistory: [
      {
        ip: { type: String, require: true },
        firstSeen: { type: Date, default: Date.now },
      },
    ],
    location: { type: String },
    totalTimeSpentInSec: { type: Number, default: 0 },
    sessions: [
      {
        duration: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    platform: { type: String },
    userAgent: { type: String },
    orientation: { type: String },
    screenResolution: { type: String },
    connectionType: [{ type: String }],
    pageURL: [{ type: String }],
    browserLanguage: { type: String },
    referrer: { type: String },
  },
  { timestamps: true }
);

// Method to add a unique IP
visitorSchema.methods.addUniqueIp = function (newIp) {
  const exist = this.ipHistory.some((ipObj) => ipObj.ip === newIp);
  if (!exist) {
    this.ipHistory.push({ ip: newIp });
  }
};

// Method to add session data
visitorSchema.methods.addSession = function (sessionDuration) {
  if (sessionDuration && sessionDuration > 0) {
    this.sessions.push({ duration: sessionDuration, timestamp: new Date() });
    this.totalTimeSpentInSec += sessionDuration;
  }
};

// method to track unique connection types
visitorSchema.methods.addConnectionType = function (newConnectionType) {
  if (newConnectionType && !this.connectionType.includes(newConnectionType)) {
    this.connectionType.push(newConnectionType);
  }
};

// method to track page visited
visitorSchema.methods.addPageURL = function (newPageURL) {
  if (newPageURL && !this.pageURL.includes(newPageURL)) {
    this.pageURL.push(newPageURL);
  }
};

export const Visitor = model("Visitor", visitorSchema);
