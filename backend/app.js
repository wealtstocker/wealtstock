import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerSpec.js";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import walletNtransactionRoutes from "./routes/walletNtransactionRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import siteConfigRoutes from "./routes/siteConfigRoutes.js";
import customersRouter from "./routes/customerRouter.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();
app.use(helmet());

console.log(process.env.USER_FRONTEND, process.env.ADMIN_FRONTEND,)
app.use(
  cors({
    origin: [process.env.USER_FRONTEND, process.env.ADMIN_FRONTEND, "*"],
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
app.use("/uploads/site", express.static("uploads/site"));
app.use("/api/site-config", siteConfigRoutes);
app.use("/api/wallet", walletNtransactionRoutes);
app.use("/api/trade", tradeRoutes);
app.use('/api', contactRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to Role-Based Auth API (MySQL + Node.js)");
});
export default app;
