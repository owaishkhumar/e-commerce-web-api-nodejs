const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Category } = require('../models/category');
// console.log(Category); 

router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();
    // const categoryList = await Category.find().select('name image -_id');

    if (!categoryList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(categoryList);
    // console.log(categoryList[0].name);
    categoryList.forEach(element => {
        console.log(element);
    });
});

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id).then(category => {
        if (category) {
            return res.status(200).send({
                category,
                success: true
            });
        }
        else {
            return res.status(404).json({ success: false, message: 'the category not found' })
        }
    }).catch(err => {
        res.status(404).json({ success: false, error: err })
    })
});

router.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    })
    category = await category.save();
    console.log(category);
    
    if (!category)
        return res.status(404).send('the category cannot be created');

    // category.then(createProduct => {
    //     res.status(201).json(createProduct);
    // }).catch(err => {
    //     res.status(500).json({
    //         error: err,
    //         success: false
    //     })
    // })

    res.send(category);
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({ success: true, message: 'the category is deleted' })
        }
        else {
            return res.status(404).json({ success: false, message: 'the category not found' })
        }
    }).catch(err => {
        res.status(404).json({ success: false, error: err })
    })
});

router.delete('/:key/:value', async (req, res) => {
    const criteria = {[req.params.key]:req.params.value};
    const category = await Category.deleteOne(criteria);
    if (category.deletedCount > 0)
        return res.status(200).json({ success: true, message: 'the category is deleted' });
    else
        return res.status(404).json({ success: false, message: 'the category not found' });
});


router.put('/:id', async(req,res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,           
        },
        {new: true}
    )
    if(!category){
        return res.status(400).send("The category is not found")
    }
    res.send(category   );
});

// router.delete('/:key/:value', async (req, res) => {
//     // const criteria = {[req.params.key]:req.params.value};
//     const category = await Category.updateOne(
//         {[req.params.key]: req.params.value},
//         {
//             name: req.body.name,
//             icon: req.body.icon,
//             color: req.body.color, 
//         }
//     );
//     console.log(category);
//     if (category.matchCount > 0)
//         return res.status(200).json({ success: true, message: 'the category is deleted' });
//     else
//         return res.status(404).json({ success: false, message: 'the category not found' });
// });

module.exports = router;