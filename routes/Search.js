const express= require('express');
const _ =require('lodash');
const Product=require('./ProductSchema');
const router=express.Router();
router.get("/", function(req,res){
    const namer= _.lowerCase(req.params.name)
    
    Product.find({name:namer}, function(err,products){
        res.json(products)
    })
    
    })

    module.exports=router