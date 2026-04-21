import mongoose from "mongoose"

const locationSchema = new mongoose.Schema({
    locationName: {
        type: String,
        required: true,
        trim: true
    },
    locationType: {
        type: String,
        required: true,
        enum: ['Component', 'Office', 'Site', 'Warehouse', 'Other'],
        default: 'Component'
    },
    componentType: {
        type: String,
        enum: ['OHP', 'WTP', 'ITP', 'IRS', 'STP', 'ETP', 'Others', null],
        default: null
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    address: {
        type: String,
        trim: true
    },
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

locationSchema.index({ projectId: 1, locationName: 1 })

const Location = mongoose.model("Location", locationSchema)

export default Location