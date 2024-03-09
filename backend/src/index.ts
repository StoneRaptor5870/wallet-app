import express from "express";
import { dbConnect } from "./lib/dbConnect";
import dotenv from "dotenv";
import { mainRouter } from "./routes/mainRouter";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://192.168.1.2:5173"],
  })
);
dotenv.config();

app.use("/api/v1", mainRouter);
app.use("/", (req, res) => {
  res.send("<h1>Hello from wallet app server<h1>");
});

dbConnect();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
