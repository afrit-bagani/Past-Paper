import { model, Schema } from "mongoose";

const suggestionSchema = new Schema(
  {
    name: { type: String, require: true },
    phoneNo: { type: String, require: true },
    description: { type: String, require: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "Visitor" }],
  },
  { timestamps: true }
);

// Increase like if not already liked
suggestionSchema.methods.increaseLike = function (visitorId) {
  if (!this.likes.includes(visitorId)) {
    this.likes.push(visitorId);
  }
};

// Decrease like if the visitor has already liked it
suggestionSchema.methods.decreaseLike = function (visitorId) {
  this.likes = this.likes.filter(
    (id) => id.toString() !== visitorId.toString()
  );
};

export const Suggestion = model("Suggestion", suggestionSchema);
