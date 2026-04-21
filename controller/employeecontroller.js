import mongoose from "mongoose"
import Payroll from "../models/payroll.js"
import User from "../models/user.js"



export const create = async (req, res) => {
    let payrollDoc = null

    try {
        const { payroll, ...userData } = req.body

        /* ---------------- EMPLOYEE ID ---------------- */
        const lastUser = await User
            .findOne()
            .sort({ employeeId: -1 })
            .select("employeeId")

        let employeeId = 1001
        if (lastUser?.employeeId) {
            employeeId = Number(lastUser.employeeId) + 1
        }


        /* ---------------- CREATE PAYROLL FIRST ---------------- */
        payrollDoc = await Payroll.create({
            ...payroll,
        })

        /* ---------------- CREATE USER ---------------- */
        const user = await User.create({
            ...userData,
            employeeId,
            payrollId: payrollDoc._id
        })

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: user
        })

    } catch (error) {
        /* ---------------- ROLLBACK PAYROLL ---------------- */
        if (payrollDoc?._id) {
            await Payroll.findByIdAndDelete(payrollDoc._id)
        }

        console.log(error)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}





export const getAllEmployee = async (req, res) => {
    try {
        const users = await User.find({
      role: { $nin: ["admins", "HR"] }
    })
        res.status(200).json({ success: true, message: "Employees fetched successfully", data: users })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}



export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params
        const { payroll, ...userData } = req.body

        /* ---------------- UPDATE USER ---------------- */
        const user = await User.findByIdAndUpdate(
            id,
            userData,         
            { new: true }
        )

        /* ---------------- UPDATE PAYROLL ---------------- */
        if (payroll && user?.payrollId) {
            await Payroll.findByIdAndUpdate(
                user.payrollId,
                payroll,
                { new: true }
            )
        }

        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: user
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}





export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params


        const employee = await User.findById(id)

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            })
        }


        if (employee.payrollId) {
            await Payroll.findByIdAndDelete(employee.payrollId)
        }


        await User.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: "Employee & payroll deleted successfully",
        })
    } catch (error) {
        console.error("Delete Employee Error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to delete employee",
            error: error.message,
        })
    }
}



export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params
        const employee = await User.findById(id)
        res.status(200).json({ success: true, message: "Employee fetched successfully", data: employee })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

