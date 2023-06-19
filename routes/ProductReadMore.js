const express=require('express');
const router=express.Router();
const Product=require('./ProductSchema');
const _ =require('lodash');


router.get("/readmore/:name", function(req,res){
    const namer= _.lowerCase(req.params.name)
    
    Product.find({name:namer}, function(err,products){
        res.json(products)
    })
    
    })


module.exports=router;