import mongoose, { Schema } from 'mongoose';

const PayrollSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    basicSalary: {
        type: Number,
        default: 0
    },
    allowances: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        default: 0
    },
    paymentDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Payroll = mongoose.model('Payroll', PayrollSchema);
export default Payroll;
