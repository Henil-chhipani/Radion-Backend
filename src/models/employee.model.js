import mongoose, { Schema } from "mongoose";
const employeeSchema = new Schema(
  {
    EmplyeeId: { type: Number, require: true },
    EmplyeeName: { type: String, require: true },
    EmplyeeEmail: { type: String, require: true },
    EmplyeePhone: { type: String, require: true },
    EmployeePassword: { type: String, require: true },
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);
