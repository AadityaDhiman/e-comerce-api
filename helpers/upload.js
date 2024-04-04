import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

// this code for localPath
// const uploadImage = async (localImagePath) => {
// try {
//     if (!localImagePath) return "path not found";
     
//     const response = await cloudinary.uploader.upload(localImagePath, {
//         folder:products
//     })
//     return response
// } catch (err) {
//     console.log("EXCEPTION  IN UPLOADER=> ",err.message)
//     // fs.unlinkSync(`public/uploads/${localImagePath}`)
//     return null
// }

// }

// this code for production on cloudinary

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (err, result) => {
            if(err) return reject(err)
            else return resolve(result)

        }).end(file.buffer)
    })
}


export default uploadImage