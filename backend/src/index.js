import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app ,server } from "./lib/socket.js";

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

dotenv.config();


app.use(cookieParser());
app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/message",messageRoutes);

const port = process.env.PORT || 5002;


server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
