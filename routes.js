import express from 'express'
import authroutes from './routes/authroutes.js'
import emproutes from './routes/employeeroute.js'
import attendanceroutes from './routes/attendanceroutes.js'
import overtimeroutes from './routes/overtimeroutes.js'
import dashboardroutes from './routes/dashboardroutes.js'
import userroutes from './routes/userroutes.js'

const router = express.Router()

router.use('/auth', authroutes)
router.use('/employee', emproutes)
router.use('/attendance', attendanceroutes)
router.use('/overtime', overtimeroutes)
router.use('/dashboard', dashboardroutes)
router.use('/users', userroutes)

export default router
