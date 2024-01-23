function errorHandler(err,req,res,next){
    if(err.name === 'UnauthorizedError'){
        // jwt authentication error
        return res.status(401).json("User is unauthorized")
    }
    if(err.name === 'ValidationError'){
        // validation error
        return res.status(401).json({message: err})
    }

    // default server error
    return res.status(500).json(err )
}

module.exports = errorHandler;