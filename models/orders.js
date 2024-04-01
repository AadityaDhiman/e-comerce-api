import mongoose from "mongoose";
import moment from 'moment-timezone'


const orderSchema = new mongoose.Schema({

    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orderItem',
        required: true
    }],
    shippingAddress1: {
        type: String,
        required: true
    },
    shippingAddress2: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        type: String,
        default: () => moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
    }
})


orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
})

const Order = new mongoose.model("order", orderSchema)

export default {Order,orderSchema}