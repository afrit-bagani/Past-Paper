import { model, Schema, Types } from "mongoose";

const folderSchema = new Schema(
  {
    folderName: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Folder", default: null },
    path: [
      {
        folderName: { type: String, require: true },
        folderId: { type: Schema.Types.ObjectId, ref: "Folder" },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Folder = model("Folder", folderSchema);
