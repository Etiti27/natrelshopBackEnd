const express=require('express');

const mongoose= require("mongoose");

//PRODUCTS SCHEMA
const productSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    salePrice:{
        type: Number,
        min:[1, "price can't be less than 1"]
    },
    price:{
        type: Number,
        min:[1, "price can't be less than 1"]
    },
    quantity:{
        type:Number,
        min:[1, "quantity can't be less than 1"]
    },
    moreDesc:{
    type: String

    },
    ingredient:{
        type: String
    },
    image:{
      type:String
    },
    usage:{
      type:String
    }
    })
const Product=mongoose.model('product',productSchema);
module.exports=Product


