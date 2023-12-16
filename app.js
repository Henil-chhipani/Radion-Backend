import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { User } from "./models/user.models.js";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Radion");
  console.log("db connected");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const app = express();

app.use(cors());
app.use(bodyParser.json());
// Middleware
// const middleware = (req, res, next) => {
//   console.log("I am middleware");
//   next();
// };

// Apply middleware to all routes
// app.use(middleware);

app.post("/register", async (req, res) => {
  let user = new User();
  user.FirstName = req.body.FirstName;
  user.LastName = req.body.LastName;
  user.DOB = req.body.DOB;
  user.Gender = req.body.Gender;
  user.Email = req.body.Email;
  user.Phone = req.body.Phone;
  user.Password = req.body.Password;
  user.RePassword = req.body.RePassword;
  user.Blance = 0;
  const doc = await user.save();

  console.log(doc);
  res.json(doc);
});
app.get("/register", async (req, res) => {
  const docs = await User.find({});
  res.json(docs);
});
app.listen(3002, () => {
  console.log("Server listening on port 3002");
});
