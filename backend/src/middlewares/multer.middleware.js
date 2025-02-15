import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./public/temp");
  },
  filename: (req, file, cb) => {
    const random = uuidv4();
    return cb(null, `${random}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
