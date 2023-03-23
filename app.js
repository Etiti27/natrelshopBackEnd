require('dotenv').config()
const express = require('express')
const app=express()
const mongoose= require("mongoose")
const cors= require("cors")
const bodyParser = require('body-parser')
const session= require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET






// middlewares
app.use(cors())
// app.use('/stripe', stripe)

  
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    secure:true, 
    cookie: { 
        httpOnly:true,
        maxAge: 360000000,
        secure: true
    }
  }))
 
mongoose.set("strictQuery", false);
const mongoDBUrl=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qqlrjp5.mongodb.net/NatrelTherapyDB`

    mongoose.connect(mongoDBUrl)

    const aboutUsSchema= new mongoose.Schema({
        
    })
  

  const productSchema= new mongoose.Schema({
    productName:{
        type: String,
        required: true
    },
    productDescription:{
        type: String,
        required: true
    },
    productSalePrice:{
        type:Number,
        min:[1, "price can't be less than 1"]
    },
    productPrice:{
        type: Number,
        min:[1, "price can't be less than 1"]
    },
    productQuantity:{
        type:Number,
        min:[1, "quantity can't be less than 1'"]
    },
    productMoreDescription:{
    type: String

    },
    productIngredient:{
        type: String
    }
    })
const Product=mongoose.model('product',productSchema);
const hairElixer= new Product({
  productName:'HAIR ELIXER',
  productDescription: 'There is nothing more satisfying than to have hair care technology that builds and strengthens your hair. With Sisay Cosmetics Golden Hair Elixer, you have just that, a rich 100% Natural Hair elixir that strengthens and adds shine to your precious hair.',
  productSalePrice: 25,
  productPrice: 50,
  productQuantity:1,
  productMoreDescription:`the secret to thick, healthy, and beautiful hair. the main and one of the most potent ingredients in this elixir is cold-pressed fenugreek oil ( essential oil). this potent plant possesses benefits catering specifically to hair.Fenugreek (Trigonella foenum-graecum). It has a 6000-year history and is commonly called Methi, high concentration of beneficial elements such as Vitamins A, B, and C, as well as phosphates, flavonoids, iron, saponins, and other minerals.It is rich in vitamins A, K, and C, folic acid, potassium, iron, calcium, and proteins, all of which are cornerstones for hair growth.`,
  productIngredient:`Glycine Soja (Soybean) Oil, Trigonella Foenum-Graecum Seed Oil, Ricinus Communis (Castor) Seed Oil, Sesamum Indicum (Sesame) Seed Oil, Nigella Sativa Seed Oil, Tocopherol, Parfum,
  Benzyl Benzoate, Limonene, Coumarin, Alpha Isomethyl Ionone, Cinnamal, Geraniol, Citronellol,
  Hexyl Cinnamal, Benzyl Salicylate, Benzyl Alcohol`
})

hairElixer.save()

const OurStorySchema= new mongoose.Schema({
    story:{
        type: String
    },
    mission:{
        type: String
    },
    vision:{
        type: String
    }

});

const Ourstory= mongoose.model("story", OurStorySchema);

const stories= new Ourstory({
    story:`Na'trel Therapy is a successor brand that was formed from our founder's pure passion for an healthy natural hair journey. Our existence since about two decades offering natural hair care product is a foundation on which Na'trel Therapy was established. We pride ourselves in offering natural, organic products with unique ingredients, across the world as the No. 1 Natural Hair and Skin Beauty Brand globally with clients who have been testifying to the wonders of our products. We are dedicated to providing customers with the highest quality products and an exceptional customer experience. Our goal is to help you look and feel your best, every day. With a focus on natural, organic, unique and nourishing ingredients, our products are carefully crafted to deliver real results for all hair and skin types. Whether you're looking to hydrate dry skin, improve the look and feel of damaged hair, or simply pamper yourself, we have a solution for you. We are dedicated to dynamic research and formulation of products that positively impact your life, with a lineup of hair, skin and overall beauty products, luxuriously made just for YOU. At Na'trel Therapy, we believe that self-care is a vital part of overall health and wellness. Our products are designed to be more than just a quick fix; they're a long-term investment for your well-being.`,
    mission:`Na'trel Therapy is here to provide you luxury lifestyle with products formulated for YOU, as well as providing an opportunity for everyone to build an evolutionary business model and achieve generational wealth.`,
    vision:`At Natrel Therapy, our vision is to be the leading provider of premium, natural, organic and unique hair and skin beauty products that help customers look and feel their best. Our vision is to create a world where everyone can enjoy the benefits of healthy, beautiful hair and skin, without sacrificing their well-being, because we see a future where self-care is a regular part of everyone's routine, and where natural beauty products are the norm, not the exception. We strive to be a trusted and reliable source of information and inspiration and to provide an exceptional customer experience that exceeds expectations. Our goal is to empower our customers to make informed decisions about their beauty routine, and to help them achieve the results they desire. We aim to offer simple but effective ways for families to create income streams and generational wealth with our business model. To create an evolutionary connection with a unique opportunity to unleash our clients and partners full potential to luxury, while leaving their best life.`
})

// stories.insertMany([Ourstory])

const isProductInCart=(cart, ids)=>{
    cart.map((carts)=>{
        if(carts.id==ids){
            return true
        }
    })
    return false
}
// app.get("/cart", function(req, res){
//     const cart= req.session.cart
//     const total=req.session.total
//     console.log(total);
//     res.json(cart, total)
    
// })
let cart;
let total;
let shippingInfo=[];
const calculateTotal=(cart, req)=>{
    total=0;
    cart.map((carts)=>{
        if(carts.salePrice){
            total=total + (carts.salePrice * carts.quantity)
        }
        else{
            total=total + (carts.price * carts.quantity)
        }

    })
    req.session.total=total
    return total
    
}

app.get('/ourstory', function(req,res){

    
   
    Ourstory.find({}, function(err, stories){

        if( stories.length===0){
            Ourstory.insertMany([stories], function(err){
                if(err){
                   console.log(err);
                }
            })
            res.redirect('/ourstory');
        }

        
            console.log(stories);
            res.json(stories)
        
        
    })
})







app.get("/data", function(req,res){
Product.find({}, function(err,products){
    if(products.length===0){
        Product.insertMany([hairElixer], function(err){
            if(err){
                throw err
            }
        })
        res.redirect('/data')
    }
    console.log(products);
    res.json(products)
})

})


app.post("/addToCart", function(req,res){

const {names, quantity, price, salePrice, image,id}=req.body

const product={

    names,quantity,price,salePrice,image,id
}

// console.log(product);
let ids=product.id


    if(req.session.cart){
        cart=req.session.cart
        if(!isProductInCart(cart,ids)){
        
            cart.push(product);
            
        }
       
    }
    else{
        req.session.cart=[product] ;
        cart= req.session.cart ;
        
       
    }
calculateTotal(cart, req)

res.redirect('/cart')
// console.log(req.session.cart)
// console.log(req.session.total);;

})

app.get("/cart", function(req,res){
    
   

    res.json(cart)
})



app.post("/shippingAddress", function(req, res){
const {firstName, lastName, address, email, country, city, postalCode}=req.body
const shippingData={
    firstName,
    lastName,
    address,
    email,
    country,
    city,
    postalCode
}
shipping.push(shippingData)
console.log(shipping);
})






//stripe integration
app.post('/create-checkout-session', async (req, res) => {
    const datas=req.body
    

   
    
    req.session.ship=datas
    shippingInfo=req.session.ship
    console.log(shippingInfo);

    
       const line_items= datas && datas.map((data)=>{
            return {
                    price_data: {
                      currency: "usd",
                      product_data: {
                        name: data.names,
                        
                        // description: data.desc,
                        metadata: {
                          id: data.id,
                        },
                      },
                      unit_amount: data.salePrice * 100,
                    },
                    quantity: data.quantity,
                  };
        })
  
  
   
    const session = await stripe.checkout.sessions.create({
        
        
      line_items,
    
      payment_method_types: ["card"],
      mode: 'payment',
      success_url: 'http://localhost:3001/stripe-success',
      cancel_url: 'http://localhost:3001/cancel',


    //   shipping_address_collection: {
    //     allowed_countries: ["US", "CA", "KE"],
    //   },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
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
  
    res.send({datas:datas,
        url:session.url,
        
    });
   
  })



 



app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  let event = req.body;
  let data
  let eventType
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
      console.log(`webhook verified`);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
    data=event.data.object
    eventType=event.type
  }
  else{
    data=event.data.object
    eventType=event.type
  }
if(eventType==="checkout.session.completed"){
    console.log(`checkout.session.completed`);
    const shipSchema=new mongoose.Schema({
        firstName:String,
        lastName:String,
        email:String,
        address:String,
        country:String,
        city:String,
        postalCode:String,
        productName:String,
        quantity:Number,
        price:Number,
        product_id:String,
        date:String
    })
    const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${day}-${month}-${year}`

    const Ship=mongoose.model('shippingInfo', shipSchema)
shippingInfo && shippingInfo.map((shippi)=>{
    const ship= new Ship({
        product_id:shippi.id,
        date:currentDate,
        firstName:shippi.firstName,
        lastName:shippi.lastName,
        email:shippi.email,
        address:shippi.address,
        city:shippi.city,
        country:shippi.country,
        postalCode:shippi.postalCode,
        productName:shippi.names,
        quantity:shippi.quantity,
        price:shippi.salePrice
    })
    ship.save().then(()=>{
        console.log(`shipping successftluiiu`);
    })
})

    

}
if(eventType==="payment_intent.created"){
    console.log(`payment_intent.created`);
    console.log(shippingInfo);
}
  

  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
});





  app.listen(3000, function(){
    console.log(`connected successfullyy!!!`);
  })