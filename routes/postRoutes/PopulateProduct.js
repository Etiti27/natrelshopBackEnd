const express=require('express');
const Product=require('../ProductSchema')
const router=express.Router();
router.post('/', (req,res)=>{
    const {name, desc, salePrice, price, quantity,moreDesc,ingredient, image,usage}=req.body
    const newProduct= new Product({
      name:name,
      desc:desc,
      salePrice:salePrice,
      price:price,
      quantity:quantity,
      moreDesc:moreDesc,
      ingredient:ingredient,
      image:image,
      usage:usage
    })
    newProduct.save((err,result)=>{
      console.log(result);
      res.send()
    })
  })
  
module.exports=router;