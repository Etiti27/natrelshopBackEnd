const express= require('express');

const router=express.Router();
const Product=require('./ProductSchema')

const dailyDetox= new Product({
  name:'DAILY DETOX ELIXIR',
  desc:'Daily Detox Elixir is a powerful blend of natural ingredients carefully selected to rid your body of harmful toxins and free radicals, allowing you to feel refreshed, rejuvenated, and ready to tackle whatever the day brings. ',
  price:60.99,
  salePrice:24.95,
  quantity:1,
  moreDesc:`Detoxification is essential for maintaining the health of our bodies, especially our hair. Toxins from the environment and the food we eat are continually present in our bodies. These toxins can build up in our organs over time, which can result in a number of health issues, including hair loss. These dangerous toxins can be eliminated from the body through detoxification, which also improves the efficiency of our organs.

  There are different organs in our body that can benefit from detoxification for better hair growth.`,
  image: "HairElixir.jpeg"

})

const defaultProduct=[dailyDetox]
// Product.insertMany(defaultProduct, function(err){
//   if(err){
//     throw err
//   }
// })
router.get("/", function(req,res){
    Product.find({}, function(err,products){
        if(products.length<1){
            Product.insertMany(defaultProduct, function(err){
                if(err){
                    throw err
                }
            })
            res.redirect('/data')
        }
       req.session.save(()=>{
        // console.log(`saved`);
       })
        res.send(products);
        
    });
    });

    module.exports=router;