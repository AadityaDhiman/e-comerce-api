import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

const uploadImage = async (localImagePath) => { 
try {
    if (!localImagePath) return "path not found";
     
    const response = await cloudinary.uploader.upload(localImagePath, {
        resource_type:"auto",
    })
    return response
} catch (err) {
    console.log("EXCEPTION  IN UPLOADER=> ",err.message)
    fs.unlinkSync(`public/uploads/${localImagePath}`)
    return null
}

}

export default uploadImage