import express from 'express'
import * as employeecontroller from '../controller/employeecontroller.js'

const emproutes = express.Router()

emproutes.post('/create', employeecontroller.create)

emproutes.get('/get', employeecontroller.getAllEmployee)

emproutes.patch('/update/:id', employeecontroller.updateEmployee)

emproutes.delete('/delete/:id', employeecontroller.deleteEmployee)

emproutes.get("/show/:id", employeecontroller.getEmployeeById)



export default emproutes       