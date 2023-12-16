import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import bodyParser from "body-parser";
import { User } from "./models/user.models.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config();


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3001);
    console.log(`server is running at port : ${process.env.PORT}`)
    
})
.catch((err)=>{
    console.log("MongoBD is failed to connect");
})



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

