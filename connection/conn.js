import mongoose from 'mongoose';

const connectDB = () => {
    try {
        return mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log("Connected ")
        })
    } catch (error) {
        console.log(error.message);
        
    }
}

export default connectDB