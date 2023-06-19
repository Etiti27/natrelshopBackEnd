const express=require('express');
const cal=require('../CalculateTotal');
const router=express.Router();
router.post('/', (req,res)=>{
    let {id, quantity, isIncrease, isDecrease} = req.body
    const cart=req.session.cart
      if(isIncrease){
        
        cart.forEach((cartItem)=>{
          if(cartItem.id===id){
            cartItem.quantity=parseInt(cartItem.quantity) + 1
          }
          
        })
        }
        
      if(isDecrease){
        
         cart.forEach((item)=>{
          if(item.id===id){
             if(item.quantity > 1){
            item.quantity = parseInt(item.quantity) - 1
          }
    
          }
         
    
         })
        
      }
    
    cal.calculateTotal(cart, req)
    res.redirect('/cart')
    })
    module.exports=router