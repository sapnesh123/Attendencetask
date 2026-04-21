import State from "../models/statemodel.js"
import City from "../models/citysmodel.js"
import Location from "../models/locationmodel.js"
import mongoose from "mongoose"
import citysmodel from "../models/citysmodel.js"

// Get all states
export const getAllStates = async (req, res) => {
  try {
    const states = await State.find().sort({ name: 1 })
    res.json(states)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCitiesByState = async (req, res) => {
  try {
    const { state } = req.params

    const cities = await citysmodel.find({
      stateId: new mongoose.Types.ObjectId(state)
    })
  

    res.json(cities)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Project Location CRUD
export const createLocation = async (req, res) => {
    try {
        const { locationName, locationType, componentType, projectId, address, latitude, longitude } = req.body

        if (!locationName || !locationType) {
            return res.status(400).json({ success: false, message: "Location name and type are required" })
        }

        let finalComponentType = componentType
        if (locationType !== 'Component') {
            finalComponentType = null
        }

        const location = await Location.create({
            locationName,
            locationType,
            componentType: finalComponentType,
            projectId,
            address,
            latitude,
            longitude
        })

        res.status(201).json({ success: true, data: location })
    } catch (error) {
        console.error("Error creating location:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getLocations = async (req, res) => {
    try {
        const { projectId, locationType } = req.query
        let query = { isActive: true }

        if (projectId) {
            query.projectId = projectId
        }

        if (locationType) {
            query.locationType = locationType
        }

        const locations = await Location.find(query)
            .populate('projectId', 'projectName projectID')
            .sort({ locationType: 1, locationName: 1 })

        res.status(200).json({ success: true, data: locations })
    } catch (error) {
        console.error("Error fetching locations:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id)
            .populate('projectId', 'projectName projectID')

        if (!location) {
            return res.status(404).json({ success: false, message: "Location not found" })
        }

        res.status(200).json({ success: true, data: location })
    } catch (error) {
        console.error("Error fetching location:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const updateLocation = async (req, res) => {
    try {
        const { locationName, locationType, componentType, projectId, address, latitude, longitude, isActive } = req.body

        let finalComponentType = componentType
        if (locationType && locationType !== 'Component') {
            finalComponentType = null
        }

        const location = await Location.findByIdAndUpdate(
            req.params.id,
            {
                locationName,
                locationType,
                componentType: finalComponentType,
                projectId,
                address,
                latitude,
                longitude,
                isActive
            },
            { new: true, runValidators: true }
        )

        if (!location) {
            return res.status(404).json({ success: false, message: "Location not found" })
        }

        res.status(200).json({ success: true, data: location })
    } catch (error) {
        console.error("Error updating location:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        )

        if (!location) {
            return res.status(404).json({ success: false, message: "Location not found" })
        }

        res.status(200).json({ success: true, message: "Location deleted successfully" })
    } catch (error) {
        console.error("Error deleting location:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getComponentTypes = async (req, res) => {
    try {
        const componentTypes = [
            { value: 'OHP', label: 'OHP' },
            { value: 'WTP', label: 'WTP' },
            { value: 'ITP', label: 'ITP' },
            { value: 'IRS', label: 'IRS' },
            { value: 'STP', label: 'STP' },
            { value: 'ETP', label: 'ETP' },
            { value: 'Others', label: 'Others' }
        ]

        res.status(200).json({ success: true, data: componentTypes })
    } catch (error) {
        console.error("Error fetching component types:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}
