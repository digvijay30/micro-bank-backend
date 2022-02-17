import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connect from "./DB/connect.js";
import userRouter from "./routes/users.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/", userRouter);
app.use('/profile', express.static('uploads'));

app.listen(PORT, async () => {
  await connect();
  console.log(`Your server is running on port ${PORT} `);
});
