import { model, Schema } from "mongoose";

const fileSchema = new Schema(
  {
    fileName: { type: String, required: true },
    folderId: { type: Schema.Types.ObjectId, ref: "Folder", default: null },
    path: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Visitor" },
    public_id: { type: String, require: true },
    url: { type: String, required: true },
    fileType: { type: String },
    size: { type: Number },
  },
  { timestamps: true }
);

export const File = model("File", fileSchema);
