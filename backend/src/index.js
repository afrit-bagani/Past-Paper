import "dotenv/config";

import { connectDB } from "./db/connection.db.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🌐 Server is started at http://localhost:${PORT}/api/`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed !!!", error.message);
  });
