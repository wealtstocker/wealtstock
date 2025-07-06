import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerSpec.js";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import walletNtransactionRoutes from "./routes/walletNtransactionRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import siteConfigRoutes from "./routes/siteConfigRoutes.js";
import customersRouter from "./routes/customerRouter.js";
import contactRoutes from "./routes/contactRoutes.js";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init express app
const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false, // ✅ disable it completely
  })
);

// Logging frontend URLs
console.log(
  "Allowed Frontends:",
  process.env.USER_FRONTEND,
  process.env.ADMIN_FRONTEND
);

// ✅ Use specific origins only (not "*") with credentials
const allowedOrigins = [
  process.env.USER_FRONTEND || "http://localhost:5173",
  process.env.ADMIN_FRONTEND || "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Add matching CORS headers to static files
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next();
});

// ✅ Serve all uploads (including site images)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path, stat) => {
      res.set("Access-Control-Allow-Origin", "*"); // optional here if image is public
    },
  })
);

// Other middlewares
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Swagger UI route for API documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customer", customersRouter);
app.use("/api/site-config", siteConfigRoutes);
app.use("/api/wallet", walletNtransactionRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api", contactRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Role-Based Auth API (MySQL + Node.js)");
});

export default app;
