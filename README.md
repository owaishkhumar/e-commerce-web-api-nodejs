
# E Commerce Rest-Api using Nodejs & MongoDB

## Overview
This project is a RESTful API for an e-commerce platform built using Node.js and MongoDB. It provides endpoints for user authentication, product management, shopping cart operations, and order processing. The API is designed to be scalable, secure, and efficient.

## Table of Content

 - Features
 - Technologies Used
 - API Endpoints
 - Contact

## Features
Certainly! A RESTful API for e-commerce typically involves a variety of features to support the functionalities of an online shopping platform. Here's a list of common features for an e-commerce RESTful API:

**1) User Authentication and Authorization:**

- __User Registration:__ Allowing users to create accounts by - providing necessary details.
- __User Login:__ Authenticating users and providing access tokens for secure interactions.

**2) Product Management:**

- __Product Listing:__ Retrieving a list of available products.
- __Product Details:__ Getting detailed information about a specific product.
- __Product Creation:__ Adding new products to the inventory.
- __Product Update and Deletion:__ Modifying existing product details and removing products from the inventory.
- __Image Upload for Products:__ Allowing users to upload images for product representation.

**3) Category Management:**

- __Category Listing:__ Retrieving a list of available product categories.
- __Category Details:__ Getting detailed information about a specific category.
- __Category Creation:__ Adding new product categories.
- __Category Update and Deletion:__ Modifying existing category details and removing categories.

**4) Order Processing:**

- __Place Order:__ Allowing users to place a new order.
- __Order Details:__ Retrieving details about a specific order.
- __Order Listing:__ Getting a list of all placed orders.
- __Update Order Status:__ Modifying the status of an order (e.g., processing, shipped, delivered).


**5) Security:**

- __Token-based Authentication:__ Using tokens (JWT) to secure API endpoints.
- __Password Hashing:__ Storing passwords securely using hashing algorithms.

## Technologies Used

- **Node.js:** Backend development using JavaScript runtime.
- **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB:** NoSQL database for scalable and flexible data storage.
- **JSON Web Token (JWT):** For secure authentication and authorization.
- **Bcrypt:** Password hashing library for enhanced security.
- **Multer:** Middleware for handling file uploads, used for image upload functionality.
- 
## API Endpoints

### Routes

**Products**
```bash
    GET         /api/v1/products
    GET         /api/v1/products/:id
    POST        /api/v1/products
    PUT         /api/v1/products/:id
    DELETE      /api/v1/products/:id
    PUT         /api/v1/products/gallery-images/:id
    GET         /api/v1/products/get/featured/:count
    GET         /api/v1/products/get/count
```

**Category**
```bash
    GET      /api/v1/category
    GET      /api/v1/category/:id
    POST     /api/v1/category
    PUT      /api/v1/category/:id
    DELETE   /api/v1/category/:id
```

**Orders**
```bash
    GET      /api/v1/order
    GET      /api/v1/order/:id
    POST     /api/v1/order
    PUT      /api/v1/order/:id
    DELETE   /api/v1/order/:id
    GET      /api/v1/order/get/count
```

**User**
```bash
    GET      /api/v1/users
    GET      /api/v1/users/:id
    POST     /api/v1/users
    PUT      /api/v1/users/:id
    DELETE   /api/v1/users/:id
    GET      /api/v1/users/get/count
```
**Register new user**
```bash
    POST     /api/v1/users/register
```

**Login user**
```bash
    POST     /api/v1/users/login
```

## Contact

- **Email ID:** khumarowaish@gmail.com
- **Linkedin:** [mohammed-owaish](https://www.linkedin.com/in/mohammed-owaish-k-125a87131/)
