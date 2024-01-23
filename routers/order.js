const { Order } = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const orderList = await Order.find()
        .populate('user', 'name')
        .sort({ 'dateOrdered': -1 }); //Sort is used for descending

    if (!orderList) {
        res.status(500).json({ success: false })
    }
    res.send(orderList);
})

router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        });

    if (!order) {
        res.status(500).json({ success: false })
    }
    res.send(order);
})

router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async orderItemId => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product','price');
        const price = orderItem.product.price * orderItem.quantity;
        return price;
    }))

    const totalPrice = totalPrices.reduce((a,b)=> a+b,0);

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if (!order)
        return res.status(400).send('the order cannot be created!')

    res.send(order);
})

router.put('/:id', async(req,res) => {

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status         
        },
        {new: true}
    )
    if(!order){
        return res.status(400).send("The product is not found")
    }
    return res.send(order);
});

router.delete('/:id', async(req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(async orderItem =>{
                await OrderItem.findByIdAndRemove(orderItem);
            })
            return res.status(200).json({ success: true, message: 'the order is deleted' })
        }
        else {
            return res.status(404).json({ success: false, message: 'the order not found' })
        }
    }).catch(err => {
        res.status(404).json({ success: false, error: err })
    })
});

router.get('/get/totalsales', async (req,res)=>{
    const totalSales = await Order.aggregate([{
        $group: {_id: null , totalsales:{$sum : "$totalPrice"}}
    }])

    if(!totalSales){
        return res.status(404).send('The order sales is not generated')
    }    
    return res.status(200).send({totalsales: totalSales.pop().totalsales});
})

router.get('/get/count', async (req,res)=>{
    const OrderCount = await Order.countDocuments();

    if (!OrderCount) {
        return res.status(200).json({ message: "There are no orders" })
    }
    return res.status(200).json({
        OrderCount: OrderCount
    });
})

router.get(`/get/userorders/:userid`, async (req, res) => {
    const userOrderList = await Order.find({user: req.params.userid})
        .populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        });

    if (!userOrderList) {
        res.status(500).json({ success: false })
    }
    res.send(userOrderList);
})




module.exports = router;