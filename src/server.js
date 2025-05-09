import express from "express";
import "dotenv/config";
import cors from "cors"
import authRoutes from "./routes/authRoutes.js";
import booksRoutes from "./routes/booksRoutes.js"
import { connectDB } from "../lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.status(200).json("Server Running");
})

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);

app.listen(PORT,()=>{
    console.log("server is running");
    connectDB();
})