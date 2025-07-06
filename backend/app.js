import express from "express";
import path from "path";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerSpec.js";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import walletNtransactionRoutes from "./routes/walletNtransactionRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import siteConfigRoutes from "./routes/siteConfigRoutes.js";
import customersRouter from "./routes/customerRouter.js";
import contactRoutes from "./routes/contactRoutes.js";

// App Initialization
const app = express();
const __dirname = path.resolve();

// ✅ Security & Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.USER_FRONTEND, process.env.ADMIN_FRONTEND, "*"],
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve Static Files With CORS-Safe Headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // ✅ Fix for image display
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/site', express.static(path.join(__dirname, 'uploads/site')));

// ✅ Swagger API Docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customer", customersRouter);
app.use("/api/site-config", siteConfigRoutes);
app.use("/api/wallet", walletNtransactionRoutes);
app.use("/api/trade", tradeRoutes);
app.use('/api', contactRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Role-Based Auth API (MySQL + Node.js)");
});

export default app;
