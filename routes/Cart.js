const express=require('express');
const router=express.Router();

router.get("/", function(req,res){

    var cart = req.session.cart;
   var total=req.session.total;
   console.log(cart);
   req.session.save()
   if(cart !==undefined){
     const cartLength=cart.length
     console.log(cartLength);
       res.json({cart,total, cartLength})
   }  
   })

   module.exports=router