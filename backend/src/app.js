import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { visitorRoute } from "./routes/visitor.route.js";
import { authRoute } from "./routes/auth.route.js";
import { userRouter } from "./routes/user.route.js";
import { fileRouter } from "./routes/file.route.js";
import { folderRouter } from "./routes/folder.route.js";
import { suggestionRoute } from "./routes/suggestion.route.js";

export const app = express();

const corsOptions = {
  origin: ["https://your-frontend.com"],
  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/visitor", visitorRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRouter);
app.use("/api/files", fileRouter);
app.use("/api/folders", folderRouter);
app.use("/api/suggestions", suggestionRoute);
