const express= require('express');

const router=express.Router();
const { v1: uuidv1,v4: uuidv4} = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

router.post('/', async (req, res) => {
let currencysymbol;
let mainshipper;
let productInf=[]
    const datas=req.body;
    console.log(datas);
    req.session.ship=datas;
    shippingInfo=req.session.ship
    const orderID=uuidv4().slice(0,7)
   
    
    req.session.shipper=datas[0]
     mainshipper=req.session.shipper
    
   
   req.session.productInfo=datas[1]
   productInf=req.session.productInfo
  
  console.log(productInf);
   if(mainshipper.country==='United States'){
    currencysymbol='usd'
   }
   else if(mainshipper.country==="United Kingdom") {
    currencysymbol='gbp'
   } else {
    currencysymbol='eur'
   }
    const customer=await stripe.customers.create({
      metadata:{
        orderID:orderID,
        cart:JSON.stringify(productInf),
        customerInfo:JSON.stringify(mainshipper)
      }
    })

       const line_items= productInf.map((data)=>{
       
        
            return {
              
                    price_data: {
                      currency: currencysymbol,
                      product_data: {
                        name: data.name && data.name,
                        images:[`http://localhost:3001/${data.image}`],
                        
                       
                        metadata: {
                          id: data.id && data.id,
                          
                        },
                      },
                      unit_amount: data.salePrice * 100,
                    },
                    quantity: data.quantity && data.quantity
                  
                    
                  }
                  
                
                
                
        })
  
  // console.log(line_items);
   
    const session = await stripe.checkout.sessions.create({
        
      customer:customer.id,
      line_items,
    
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      mode: 'payment',
      success_url: 'http://localhost:3001/stripe-success',
      cancel_url: 'http://localhost:3001/cancel',
      // consent_collection: {
      //   terms_of_service: 'required',
      // },


    //   shipping_address_collection: {
    //     allowed_countries: ["US", "CA", "KE"],
    //   },
      shipping_options: [
        // {
        //   shipping_rate_data: {
        //     type: "fixed_amount",
        //     fixed_amount: {
        //       amount: 0,
        //       currency: currencysymbol,
        //     },
        //     display_name: "Free shipping",
        //     // Delivers between 5-7 business days
        //     delivery_estimate: {
        //       minimum: {
        //         unit: "business_day",
        //         value: 5,
        //       },
        //       maximum: {
        //         unit: "business_day",
        //         value: 7,
        //       },
        //     },
        //   },
        // },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: currencysymbol,
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
    
    });
    
  req.session.currencysymbol=currencysymbol;
  

    res.send({datas:datas,
        url:session.url,
        
    });
   
  })

  module.exports=router