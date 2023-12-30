import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path:'./.env'
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3001);
    console.log(`server is running at port : ${process.env.PORT}`);
  })
  .catch((err) => {
    console.log("MongoBD is failed to connect");
  });
app.use(cors());
app.use(bodyParser.json());
