import express from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.js';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const userList = await UserModel.User.find().select("name email phone")
        if (!userList) {
            res.status(500).json({ success: false });
        }
        res.status(200).json({ success: true, userList })
    } catch (error) {
        res.status(500).json({ success: false });
        console.log(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const user = await UserModel.User.findById(req.params.id).select('-password')
        if (!user) {
            res.status(500).json({ success: false })
        } else {
            res.status(200).json({ user: user, success: true })
        }
    } catch (error) {
        res.status(500).json({ success: false })
    }
})

router.post('/signup', async (req, res) => {
    try {
        const {
            name, email, password, phone, isAdmin, street, apartment, zip, city, country } = req.body;
        let user = new UserModel.User({
            name, email, password: await bcrypt.hash(password, 10), phone, isAdmin, street, apartment, zip, city, country
        })
        user = await UserModel.User.insertMany([user])
        console.log(user)
        if (!user) {
            return res.status(200).json({ success: false })
        }
        res.send(user)

    } catch (error) {
        console.log(error.message)
        res.status(404).send({ success: false })
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await UserModel.User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).json({ success: false,message: 'User not found'})
        }
        else {
            if (await bcrypt.compare(req.body.password, user.password)) {
             const token =  jsonwebtoken.sign({
                    userId: user.id,
                    isAdmin: user.isAdmin,
                }, process.env.secret, {
                    expiresIn: '1d'
                })
                res.status(200).json({ success:true, message:"Success",token})
            }
            else {
                res.status(200).json({ success:false,message:"password incorrect" })
            }
        }
    } catch (error) {
        console.log("EXCEPTION IN LOGIN URL"+error.message)
    }
})


router.get('/get/count', async (req, res) => {
    try {
        const userCount = await UserModel.User.countDocuments()
        if (userCount) {
            res.status(200).json({ userCount: userCount });
        } else {
            res.status(404).send("Not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let user = await UserModel.User.findByIdAndRemove(req.params.id)
        if (user) {
            return res.status(200).json({ success: true })
        }
        else {
            return res.status(404).json({ success: false })
        }
    } catch (error) {
        return res.status(404).json({ success: false, error: error })
    }
})

export default router;



