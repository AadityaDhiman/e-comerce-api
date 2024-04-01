import Express from "express";
const router = Express.Router();
import ProductModel from '../models/product.js';
import Category from '../models/category.js';
import mongoose from 'mongoose';
import multer from 'multer';
// import AccessToken from '../helpers/jwt.js';

const file_type = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/gif': 'gif',
    'image/jpg': 'jpg'

}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = file_type[file.mimetype];
        let uploadError = new Error('Invalid image type');
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = file_type[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const upload = multer({ storage: storage });



router.post(`/`, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const categories = await Category.findById(req.body.category);

        if (!categories) return res.status(404).send("some error: ")
        const { name, description, richDescription, brand, price, category, countInStock, rating, numReviews, isFeatured, dateCreated } = req.body
        const fileName = req.file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        let product = new ProductModel.Product({
            name, description, richDescription, image: `${basePath}${fileName}`, brand, price, category, countInStock, rating, numReviews, isFeatured, dateCreated
        })
        product = await ProductModel.Product.insertMany([product])
        if (!product)
            return res.status(404).json({ message: "the product not created " })
        res.send(product)
    } catch (error) {
        console.log(error.message)

    }
})

router.put('/gallery-images/:id', upload.array('images', 20), async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {

            res.status(404).send("Invalid Id: ")
        }
        const files = req.files
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        if (files) {
            files.map(file => {
                imagesPaths.push(`${basePath}${file.filename}`)
            })
        }
        const product = await ProductModel.Product.findByIdAndUpdate(req.params.id, {
            images: imagesPaths
        }, { new: true })

        if (!product)
            return res.status(500).send("the category is not available not updated")
        res.send(product)
    } catch (error) {
        res.status(500).send("the category is not available not")

    }

})


router.get(`/`, async (req, res) => {
    try {
        let filter = {};
        if (req.query.categories) {
            filter = { category: req.query.categories.split() }
        }
        const productList = await ProductModel.Product.find(filter).populate('category');
        if (productList) {
            res.status(200).json({ success: true, productList, message: "Data found" })
        } else {
            res.status(200).json({ success: false, message: "Data Not found Some error occurred" })
        }
    } catch (error) {
        res.send("EXCEPTION IN PRODUCTS =>" + error.message)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const product = await ProductModel.Product.findById(req.params.id).populate('category');
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).send("Not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/get/count', async (req, res) => {
    try {
        const productCount = await ProductModel.Product.countDocuments()

        if (productCount) {
            res.status(200).json({ productCount: productCount });
        } else {
            res.status(404).send("Not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/get/featured/:count', async (req, res) => {

    try {
        const count = req.params.count ? req.params.count : 0
        const products = await ProductModel.Product.find({ isFeatured: true }).limit(+count)

        if (products) {
            res.status(200).json(products);
        } else {
            res.status(404).send("Not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});




router.put('/:id', async (req, res) => {
    try {

        if (!mongoose.isValidObjectId(req.params.id)) {

            res.status(404).send("Invalid Id: ")
        }
        const categories = await Category.findById(req.body.category);

        if (!categories) return res.status(404).send("some error: ")

        const { name, description, richDescription, image, images, brand, price, category, countInStock, rating, numReviews, isFeatured, dateCreated } = req.body
        console.log(req.params.id)
        const product = await ProductModel.Product.findByIdAndUpdate(req.params.id,
            {
                name, description, richDescription, image, images, brand, price, category, countInStock, rating, numReviews, isFeatured, dateCreated
            },
            {
                new: true
            });
        if (!product)
            return res.status(500).send("the category is not available not updated")
        res.send(product)

    } catch (error) {
        console.log(error.message)

    }
})


router.delete('/:id', async (req, res) => {
    try {
        let product = await ProductModel.Product.findByIdAndRemove(req.params.id)
        if (product) {
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