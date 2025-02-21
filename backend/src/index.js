import "dotenv/config";

import { connectDB } from "./db/connection.db.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000/api";

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🌐 Server is started at ${BASE_URL}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed !!!", error.message);
  });
