const express=require('express');
const cal=require('../CalculateTotal');
const router=express.Router();
router.post('/', (req,res)=>{
    const {names, id}= req.body
    const cart=req.session.cart
    cart.map((cartItem)=>{
      if(cartItem.id===id){
        cart.splice(cart.indexOf(cartItem),1);
      }
    })
    cal.calculateTotal(cart,req)
    res.redirect('/cart')
  })
  module.exports=router