import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app ,server } from "./lib/socket.js";
import path from "path";

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

dotenv.config();

const __dirname = path.resolve();
const port = process.env.PORT || 5002;

app.use(cookieParser());
app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/message",messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
