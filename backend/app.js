import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerSpec.js";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

// Routes
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

// Initialize express app
const app = express();

// ✅ Helmet with CORS resource policy disabled
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://admin.wealtstockresearchfirm.com",
  "https://wealtstockresearchfirm.com",
];

// ✅ CORS middleware with allowlist
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
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

// ✅ Preflight OPTIONS handler
app.options("*", cors());

// ✅ Set CORS headers manually for static assets
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next();
});

// ✅ Serve static files (e.g., images)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath, stat) => {
      res.set("Access-Control-Allow-Origin", "*");
    },
  })
);

// Other middlewares
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Swagger docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customer", customersRouter);
app.use("/api/site-config", siteConfigRoutes);
app.use("/api/wallet", walletNtransactionRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api", contactRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Welcome to Role-Based Auth API (MySQL + Node.js)");
});

export default app;
