const express = require('express');
const router = express.Router();
const { Product } = require('../models/product')
const mongoose = require('mongoose');
const { OrderItem } = require('../models/order-item');

router.get(`/`, async (req, res) => {
    const orderItem = await OrderItem.find().populate('product');

    if (!orderItem) {
        return res.status(500).json({ success: false })
    }
    return res.send(orderItem);
})

module.exports = router;
