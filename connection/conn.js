import mongoose from 'mongoose';

const connectDB = () => {
    try {
        return mongoose.connect("mongodb://127.0.0.1:27017/ecommerce").then(() => {
            console.log("Connected ")
        })
    } catch (error) {
        console.log(error.message);
        
    }
}

export default connectDB