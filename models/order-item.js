import mongoose from "mongoose";

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required:true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref:'Product'
    }
})

let OrderItem = mongoose.model('orderItem',orderItemSchema);

export default OrderItem