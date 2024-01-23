const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User} = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({success: false})
    }
    res.send(userList);
})

router.get(`/:id`, async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id))
        return res.send("Not a valid user ID")

    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        res.status(500).json({success: false, message: "User ID not found"})
    }
    res.status(200).send(user);
})

router.post(`/register`, (req, res) => {
    const user = new User({
        name: req.body.name, 
        email: req.body.email, 
        passwordHash: bcrypt.hashSync(req.body.password,10),
        phone: req.body.phone,
        isAdmin: false,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })

    // console.log(user)

    user.save().then(createUser => {
        res.status(201).send(createUser);
    }).catch(err => {
        res.status(500).send({
            message: "User cannot be created",
            error: err,
            success: false
        })
    })
})

router.post(`/admin`, (req, res) => {
    const user = new User({
        name: req.body.name, 
        email: req.body.email, 
        passwordHash: bcrypt.hashSync(req.body.password,10),
        phone: req.body.phone,
        isAdmin: true,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })

    // console.log(user)

    user.save().then(createUser => {
        res.status(201).send(createUser);
    }).catch(err => {
        res.status(500).send({
            message: "User cannot be created",
            error: err,
            success: false
        })
    })
})

router.post('/login', async (req,res)=>{
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;

    if(!user){
        return res.status(400).send("User not found");
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token  = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}
        )
        return res.status(200).send({
            message: 'User authenticated',
            email: user.email,
            token: token,
        });
    }
    else{
        return res.status(400).send('Password is incorrect');
    }
})

router.get(`/get/count`, async (req, res) => {

    const userCount = await User.countDocuments();

    if (!userCount) {
        return res.status(200).json({ message: "There are no products" })
    }
    return res.status(200).json({
        userCount: userCount
    });
})

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'the user is deleted' })
        }
        else {
            return res.status(404).json({ success: false, message: 'the user not found' })
        }
    }).catch(err => {
        res.status(404).json({ success: false, error: err })
    })
});




module.exports = router;