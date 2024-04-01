import express from 'express';
const router = express.Router();
import OrderItem from '../models/order-item.js';
import OrderModel from '../models/orders.js';
import AccessToken from '../helpers/jwt.js';


router.get('/', async (req, res) => {
    const orderList = await OrderModel.Order.find().populate('user', 'name')
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
        .sort({ 'dateOrdered': -1 });
    if (!orderList) {
        res.status(500).json({ success: false });
    }
    res.send(orderList)
})


router.get('/get/userorder/:userId', async (req, res) => {
    const userOrderList = await OrderModel.Order.find({user:req.params.userId})
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
        .sort({ 'dateOrdered': -1 }).select('-user');
    if (!userOrderList) {
        res.status(500).json({ success: false });
    }
    res.send(userOrderList)
})



router.get('/:id', async (req, res) => {
    const order = await OrderModel.Order.findById(req.params.id).populate('user', 'name').populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
    if (!order) {
        res.status(500).json({ success: false });
    }
    res.send(order)
})



router.post('/', async (req, res) => {
    try {
        let orderItemsIds = Promise.all(req.body.orderItems.map(async (curItem) => {
            let newOrderItem = new OrderItem({
                quantity: curItem.quantity,
                product: curItem.product
            })
            newOrderItem = await OrderItem.insertMany([newOrderItem])
            return newOrderItem[0]._id;
        }))
        let newOrdersItems;
        await orderItemsIds.then((item) => newOrdersItems = item)

        const totalPrices = await newOrdersItems.map(async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice

        })
        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        let { shippingAddress1, shippingAddress2, city, zip, country, phone, status, user } = req.body
        let order = new OrderModel.Order({ orderItems: newOrdersItems, shippingAddress1, shippingAddress2, city, zip, country, phone, status, totalPrice: totalPrice, user })
        order = await OrderModel.Order.insertMany([order])
        if (!order)
            return res.status(400).send("The category cannot be created.")
        res.status(200).send(order)
    } catch (error) {
        console.log(error.message)
    }
})


router.put('/:id', async (req, res) => {
    const { status } = req.body;
    const order = await OrderModel.Order.findByIdAndUpdate(
        req.params.id,
        { status }, { new: true }
    )
    if (!order) {
        return res.status(404).send({ success: false })
    }
    res.send(order)
})


router.delete('/:id', async (req, res) => {
    try {
        OrderModel.Order.findByIdAndRemove(req.params.id)
            .then(async order => {
                if (order) {
                    await order.orderItems.map(async currentItem => {
                        await OrderItem.findByIdAndRemove(currentItem)
                    })
                    return res.status(200).send({ message: "order deleted" })
                }
                else {
                    return res.status(404).send({ message: "order not deleted" })

                }
            }).catch((err) => {
                return res.status(500).send({ message: "order not found" })
            })

    } catch (error) {
        return res.status(404).json({ success: false, error: error })

    }
})

router.get('/get/totalsales', async (req, res) => {
    const totalSales = await OrderModel.Order.aggregate([
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
    ])
    if (!totalSales) {
        return res.status(400).send("the order sales cannot be aggregated")
    }
    res.send({ totalSales: totalSales.pop().totalsales })
})


router.get('/get/count', async (req, res) => {
    try {
        const orderCount = await OrderModel.Order.countDocuments()

        if (orderCount) {
            res.status(200).json({ orderCount: orderCount });
        } else {
            res.status(404).send("Not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});




export default router