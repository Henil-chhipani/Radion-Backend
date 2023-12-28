import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
const router = Router();

router.route("/register").post(registerUser);



// app.post("/register", async (req, res) => {
//     let user = new User();
//     user.FirstName = req.body.FirstName;
//     user.LastName = req.body.LastName;
//     user.DOB = req.body.DOB;
//     user.Gender = req.body.Gender;
//     user.Email = req.body.Email;
//     user.Phone = req.body.Phone;
//     user.Password = req.body.Password;
//     user.RePassword = req.body.RePassword;
//     user.Blance = 0;
//     const doc = await user.save();

//     console.log(doc);
//     res.json(doc);
//   });
//   app.get("/register", async (req, res) => {
//     const docs = await User.find({});
//     res.json(docs);
//   });

// employee data entering --------------------------------------
//   app.post("/employee", async (req, res) => {
//     try {
//       const employeeCount = await Employee.countDocuments();

//       let employee = new Employee();
//       employee.EmplyeeId = employeeCount + 1;
//       employee.EmplyeeName = req.body.EmplyeeName;
//       employee.EmplyeeEmail = req.body.EmplyeeEmail;
//       employee.EmplyeePhone = req.body.EmplyeePhone;
//       employee.EmployeePassword = req.body.EmployeePassword;
//       const doc = await employee.save();
//       console.log(doc);
//       res.json(doc);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
//   app.get("/employee", async (req, res) => {
//     const docs = await Employee.find({});
//     res.json(docs);
//   });

export default router;
