import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import walletNtransactionRoutes from "./routes/walletNtransactionRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerSpec.js";
import customersRouter from "./routes/customerRouter.js";

const app = express();

// CORS middleware
app.use(
  cors({
    origin: "https://wealtstockresearchfirm.com/",
    credentials: true,
  })
);

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
app.use("/uploads", express.static("uploads"));

// Wallet and trade routes
app.use("/api/wallet", walletNtransactionRoutes);
app.use("/api/trade", tradeRoutes);

app.get("/api/welcome", (req, res) => {
  res.send("Welcome to Role-Based Auth API (MySQL + Node.js)");
});

export default app;
