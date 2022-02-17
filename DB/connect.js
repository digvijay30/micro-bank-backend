import Mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connect = () => {
  return Mongoose.connect(process.env.DB_CONNECTION);
};

export default connect;
