const express=require('express');
const cal=require('../CalculateTotal');
const isProduct=require('../IsProductInCart');
const router=express.Router();


let product;
router.post("/", function(req,res){
    let {name, quantity,  salePrice, image,id}=req.body;
     product={name,quantity,salePrice,image,id};
        if(req.session.cart){
         var cart=req.session.cart;   
          if(!isProduct.isProductIsInCart(cart, id)){
            cart.push(product)
          }
        }else{
          req.session.cart=[product] 
         var cart=req.session.cart;
        }      
    cal.calculateTotal(cart, req)
    res.redirect('/cart')
    
        })

module.exports=router;