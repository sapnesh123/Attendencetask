import express from 'express'
import { 
    getAllStates, 
    getCitiesByState,
    createLocation,
    getLocations,
    getLocationById,
    updateLocation,
    deleteLocation,
    getComponentTypes
} from '../controller/locationcontroller.js'

const router = express.Router()

// Get all states
router.get('/all-states', getAllStates)

// Get cities by state
router.get('/cities/:state', getCitiesByState)

// Project Locations CRUD
router.post('/project/create', createLocation)
router.get('/project', getLocations)
router.get('/project/:id', getLocationById)
router.patch('/project/:id', updateLocation)
router.delete('/project/:id', deleteLocation)
router.get('/component-types', getComponentTypes)

export default router
