import express from 'express';
const router = express.Router();
import Category from '../models/category.js'



router.get('/', async (req, res) => {
    const categoryList = await Category.find({})
    if (!categoryList) {
        res.status(500).json({ success: false })
    } else {
        res.status(200).json({ categoryList: categoryList, success: true })
    }
})

router.get('/:id', async (req, res) => {
    const categoryList = await Category.findById(req.params.id)
    if (!categoryList) {
        res.status(500).json({ success: false })
    } else {
        res.status(200).json({ categoryList: categoryList, success: true })
    }
})

router.post('/', async (req, res) => {
    const { name, icon, color } = req.body;
    let category = new Category({
        name,
        icon,
        color
    })
    category = await Category.insertMany([category])
    if (!category) {
        return res.status(404).send({ success: false })
    }
    res.send(category)
})

router.put('/:id', async (req, res) => {
    const { name, icon, color } = req.body;
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name, icon, color }, { new: true }
    )
    if (!category) {
        return res.status(404).send({ success: false })
    }
    res.send(category)
})

router.delete('/:id', async (req, res) => {
    try {
        let category = await Category.findByIdAndRemove(req.params.id)
        if (category) {
            return res.status(200).json({ success: true })
        }
        else {
            return res.status(404).json({ success: false })
        }

    } catch (error) {
        return res.status(404).json({ success: false, error: error })

    }
})


export default router