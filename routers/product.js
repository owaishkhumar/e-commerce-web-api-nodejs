const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Product } = require('../models/product');
const { Category } = require('../models/category');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];

        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
const uploadOptions = multer({ storage: storage })
// const uploadOptions = multer({ storage: storage })
router.get(`/short`, async (req, res) => {
    const productLists = await Product.find({},'name brand -_id').lean();
    console.log(productLists);

    if (!productLists) {
        res.status(500).json({ success: false })
    }
    res.send(productLists);
})

router.get(`/`, async (req, res) => {
    let filter = {}

    if(req.query.category){
        filter = {category: req.query.category.split(',')};
    }

    const productList = await Product.find(filter).populate('category');
    // const productList = await Product.find(filter).select('-_id').lean();

    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList);
})

router.get(`/:id`, async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id))
        return res.status(400).send('Invalid prodcut ID');

    const product = await Product.findById(req.params.id).populate('category');
    
    if (!product) {
        res.status(500).json({ success: false })
    }
    return res.send(product);
})


router.post(`/`, uploadOptions.single('image') ,async (req, res) => { 

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');
    
    const file = req.file;
    if(!file) return res.status(400).send('File not exist');


    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    const products = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`, //'https://localhost:8000/public/uploads/filename.jpej'
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    products.save().then(createProduct => {
        res.status(201).json(createProduct);
    }).catch(err => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
})

router.put('/:id', async(req,res) => {
    if(!mongoose.isValidObjectId(req.params.id))
        return res.status(400).send('Invalid prodcut ID');

    const category = await Category.findById(req.body.category);
    if(!category) 
        return res.status(400).send('Invalid Category');

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,           
        },
        {new: true}
    )
    if(!product){
        return res.status(400).send("The product is not found")
    }
    return res.send(product);
});


router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: 'the category is deleted' })
        }
        else {
            return res.status(404).json({ success: false, message: 'the category not found' })
        }
    }).catch(err => {
        res.status(404).json({ success: false, error: err })
    })
});

//API for product count
router.get(`/get/count`, async (req, res) => {

    const productCount = await Product.countDocuments();

    if (!productCount) {
        return res.status(200).json({ message: "There are no products" })
    }
    return res.status(200).json({
        productCount: productCount
    });
})

//API for featured products and count is used for number limiting the featured products
router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const product = await Product.find({isFeatured: true}).limit(+count);

    if (!product) {
        return res.status(500).json({ success: false });
    }
    return res.status(200).json(product);
})

router.get(`/get/featured/`, async (req, res) => {
    // const count = req.params.count ? req.params.count : 0;
    const product = await Product.find({isFeatured: true});

    if (!product) {
        return res.status(500).json({ success: false });
    }
    return res.status(200).json(product);
})

router.put(
    '/gallery-image/:id', 
    uploadOptions.array('images',10),
    async(req,res) => {
        if(!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid prodcut ID');

        const files = req.files;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        let imagePaths =[];

        if(files){
            files.map(file=>{
                imagePaths.push(`${basePath}${file.filename}`)
            })
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagePaths           
            },
            // {new: true}
        )


        if(!product){
            return res.status(400).send("The product is not found")
        }
        return res.send(product);
    }
);

module.exports = router;