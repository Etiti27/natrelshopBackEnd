const express=require('express');
const router=express.Router();
const _ =require('lodash');
const Product=require('../ProductSchema');

let searchItem;
router.post('/', (req,res)=>{
  const {search}=req.body
  
const searched= _.lowerCase(search);
  console.log(searched);
  Product.findOne({name:searched}, function(err, result){
    if(!result){
      searchItem='not found!'
      
    }
    if(!err){
     
      searchItem=result
    }
    
    if(searchItem===null){
      searchItem='not found!'
    }
    console.log(searchItem);
    res.redirect('/searcheditem')
  })
})

router.get("/", function(req,res){
    res.json(searchItem)
  
  })

module.exports=router