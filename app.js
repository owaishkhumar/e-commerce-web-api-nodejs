const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const dbconnect = require('./DB/dbconnect')

const port = process.env.PORT || 8000;
const api = process.env.API_URL

//Router Models
const productsRouter = require('./routers/product');
const categoryRouter = require('./routers/category');
const orderRouter = require('./routers/order');
const orderItemRouter = require('./routers/order-item');
const userRouter = require('./routers/user');

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use('*', cors());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(authJwt());
app.use(errorHandler);



app.use(`${api}/products`, productsRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/order`, orderRouter);
app.use(`${api}/orderitem`, orderItemRouter);
app.use(`${api}/user`, userRouter);

// Connecting to Database
dbconnect();

//Server Running
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})