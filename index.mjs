import express from "express";
import sequelize from "./utils/database.mjs";
import populateDatabase from "./utils/populateDatabase.mjs";
import appRoutes from "./app/app.mjs";
import config from "./config/config.mjs";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.PORT;

// create a http server
const server = http.createServer(app);

// Serve the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// App Routes
appRoutes(app);

// Sync Database and Start Server
sequelize
  .sync()
  .then(async () => {
    await populateDatabase();
    console.log("Database synced successfully.");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// export the server for testing
export { server };
