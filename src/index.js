import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import bodyParser from "body-parser";
import { User } from "./models/user.models.js"; // user means customer
import { Employee } from "./models/employee.model.js";
import dotenv from "dotenv";
import { DB_Name, user_db, employee_db, admin_db } from "./constant.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config();

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
// Middleware
// const middleware = (req, res, next) => {
//   console.log("I am middleware");
//   next();
// };

// Apply middleware to all routes
// app.use(middleware);
// customer data entry-------------------------------
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

// employee data entering --------------------------------------
app.post("/employee", async (req, res) => {
  try {
    const employeeCount = await Employee.countDocuments();

    let employee = new Employee();
    employee.EmplyeeId = employeeCount + 1;
    employee.EmplyeeName = req.body.EmplyeeName;
    employee.EmplyeeEmail = req.body.EmplyeeEmail;
    employee.EmplyeePhone = req.body.EmplyeePhone;
    employee.EmployeePassword = req.body.EmployeePassword;
    const doc = await employee.save();
    console.log(doc);
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/employee", async (req, res) => {
  const docs = await Employee.find({});
  res.json(docs);
});
// login handle-----------------------------------------------
let userType = null;
let userEmail = null;
let userPassword = null;
app.post("/login", async (req, res) => {
  const userType = req.body.User;
  const userEmail = req.body.Email;
  const userPassword = req.body.Password;

  console.log("login:", userType, userEmail, userPassword);

  try {
    const result = await checkLogin(userType, userEmail, userPassword);
    res.json(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function checkLogin(userType, userEmail, userPassword) {
  if (!userType || !userEmail || !userPassword) {
    return "Data is not available";
  } else {
    if (userType === "Customer") {
      try {
        const db = client.db(DB_Name);
        const use_db = db.collection("users");
        const user = await use_db.findOne({ Email: userEmail });
        if (user) {
          console.log("User found:", user);
          return "User found: " + JSON.stringify(user);
        } else {
          console.log("User not found");
          return "User not found";
        }
      } catch (error) {
        console.error("Error finding user:", error);
        throw error; // Rethrow the error for proper handling in the calling function
      }
    } else if (userType === "Sales Team") {
      // Implement Sales Team login logic
      return "Sales Team login logic not implemented";
    } else if (userType === "Admin") {
      // Implement Admin login logic
      return "Admin login logic not implemented";
    } else {
      return "Invalid user type";
    }
  }
}

app.get("/login", async (req, res) => {
  const docs = await checkLogin(userType, userEmail, userPassword);
  res.json(docs);
});
