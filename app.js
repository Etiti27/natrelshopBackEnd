require('dotenv').config()
const express = require('express')
const app=express()
const mongoose= require("mongoose")
const cors= require("cors")
const bodyParser = require('body-parser')
const session= require('express-session')
const MongoStore = require('connect-mongo')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer=require('nodemailer')
var SibApiV3Sdk = require('sib-api-v3-sdk');
const postCalc=require("./routes/postRoutes/calculateQuan")
const _ =require('lodash')
const cookieParser = require("cookie-parser")
const ejs=require('ejs')
const accountSid = process.env.ACCOUNT_SID || "AC270dd2e2d127e0c37be7d28f01be33cc";
const authToken = process.env.AUTH_TOKEN || "0853ea933ac6bcca32934f71046f7152";
const client = require('twilio')(accountSid, authToken);



//connecting to DB
mongoose.set("strictQuery", false);
const mongoDBUrl=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qqlrjp5.mongodb.net/NatrelTherapyDB`

    mongoose.connect(mongoDBUrl)



// middlewares
app.set('view engine', 'ejs');
app.use('/public', express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser());
// app.use('/stripe', stripe)

  
app.use('/minus', postCalc)


app.use('/webhook', bodyParser.raw({type: "*/*"}))
app.use(bodyParser.json({type: 'application/json'}))
app.set('trust proxy', 1)
app.use(bodyParser.json())

app.use(session({
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: true,
store: MongoStore.create({ mongoUrl: mongoDBUrl }),
cookie:{maxAge: 3600 * 24,
secure: true}
  }))


// app.use(session({ 
// secret: 'keyboard cat',
// resave:false,
// saveUninitialized: true,
// cookie: { maxAge: 60000 }}))

// Access the session as req.session
app.get('/', function(req, res) {
  // if (req.session.views) {
  //   req.session.views++
  //   console.log(`i executtt`);
  //   res.write(`<p>i am here </p>`)
  // } else {
  //   req.session.views = 1
  //   console.log(`me`);
  //   res.end('welcome to the session demo. refresh!')
  // }
  // console.log(req.session);
 
})
 


   
  

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
        type:Number,
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
    }
    })
const Product=mongoose.model('product',productSchema);
const hairElixer= new Product({
  name:'HAIR ELIXER',
  desc: 'There is nothing more satisfying than to have hair care technology that builds and strengthens your hair. With Sisay Cosmetics Golden Hair Elixer, you have just that, a rich 100% Natural Hair elixir that strengthens and adds shine to your precious hair.',
  salePrice: 25,
  price: 50,
  quantity:1,
  moreDesc:`the secret to thick, healthy, and beautiful hair. the main and one of the most potent ingredients in this elixir is cold-pressed fenugreek oil ( essential oil). this potent plant possesses benefits catering specifically to hair.Fenugreek (Trigonella foenum-graecum). It has a 6000-year history and is commonly called Methi, high concentration of beneficial elements such as Vitamins A, B, and C, as well as phosphates, flavonoids, iron, saponins, and other minerals.It is rich in vitamins A, K, and C, folic acid, potassium, iron, calcium, and proteins, all of which are cornerstones for hair growth.`,
  ingredient:`Glycine Soja (Soybean) Oil, Trigonella Foenum-Graecum Seed Oil, Ricinus Communis (Castor) Seed Oil, Sesamum Indicum (Sesame) Seed Oil, Nigella Sativa Seed Oil, Tocopherol, Parfum,
  Benzyl Benzoate, Limonene, Coumarin, Alpha Isomethyl Ionone, Cinnamal, Geraniol, Citronellol,
  Hexyl Cinnamal, Benzyl Salicylate, Benzyl Alcohol`,
  image:"HairElixir.jpeg"
})

const dailyDetox= new Product({
  name:'DAILY DETOX',
  desc:'Daily Detox Elixir is a powerful blend of natural ingredients carefully selected to rid your body of harmful toxins and free radicals, allowing you to feel refreshed, rejuvenated, and ready to tackle whatever the day brings. ',
  price:30,
  salePrice:50,
  quantity:1,
  moreDesc:`Detoxification is essential for maintaining the health of our bodies, especially our hair. Toxins from the environment and the food we eat are continually present in our bodies. These toxins can build up in our organs over time, which can result in a number of health issues, including hair loss. These dangerous toxins can be eliminated from the body through detoxification, which also improves the efficiency of our organs.

  There are different organs in our body that can benefit from detoxification for better hair growth.`,
  image: "dailytoxic.png"

})
const defaultProduct=[hairElixer, dailyDetox]
// Product.insertMany(defaultProduct, function(err){
//   if(err){
//     throw err
//   }
// })


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

const isProductIsInCart=(cart, id)=>{
   for (let i = 0; i < cart.length; i++) {
    if(cart[i].id === id) {
      return true;
    }
    
   } 
   return false 
//   cart.forEach((cartItem)=>{
//     if(cartItem.id === id) {
//       return true;
//     }
//   })
//   return false
   
}
// app.get("/cart", function(req, res){
//     const cart= req.session.cart
//     const total=req.session.total
//     console.log(total);
//     res.json(cart, total)
    
// })
let cart;
let total;
let product;

let shippingInfo=[];
const calculateTotal=(cart, req)=>{
    total=0;
    cart && cart.map((carts)=>{
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

        
            
            res.send(stories)
        
        
    })
})







app.get("/data", function(req,res){
Product.find({}, function(err,products){
    if(products.length<=1){
        Product.insertMany(defaultProduct, function(err){
            if(err){
                throw err
            }
        })
        res.redirect('/data')
    }
    
    res.send(products)
    // res.render('home', {products:products})
})

})


app.get("/data/:name", function(req,res){
  const namer= _.upperCase(req.params.name)
  
  Product.find({name:namer}, function(err,products){
      res.json(products)
  })
  
  })

  app.use(function(req, res, next) {
    req.session.cart=cart
    next()
  })
  

app.post("/addtocart", function(req,res){

const {name, quantity,  salePrice, image,id}=req.body;


 product={name,quantity,salePrice,image,id}

    if(req.session.cart){
      cart=req.session.cart;
       
      if(!isProductIsInCart(cart, id)){
        cart.push(product)
      }
       
     
    }else{
      req.session.cart=[product]
      
      cart=req.session.cart;
    
    }
    
      

      
      
   

        
calculateTotal(cart, req)


res.redirect('/cart')



    })

app.get("/cart", function(req,res){
  
//  console.log(cart);
res.send(cart)

    
})

app.get("/total", (req, res)=>{
 
  
  res.json(total)
  
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

})






//stripe integration
app.post('/create-checkout-session', async (req, res) => {
    const datas=req.body
    
    req.session.ship=datas
    shippingInfo=req.session.ship
    // console.log(shippingInfo);
    
    req.session.shipper=datas[0]
     mainshipper=req.session.shipper
    // console.log(mainshipper);
   req.session.productInfo=datas[1]
   productInf=req.session.productInfo
   console.log(productInf);
  
   
    
       const line_items= productInf.map((data)=>{
       
        
        // console.log(data);
          
            return {
              
                    price_data: {
                      currency: "eur",
                      product_data: {
                        name: data.name && data.name,
                        
                        // description: data.desc,
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
              currency: "eur",
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
              currency: "eur",
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

  let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET
  
  
  app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event

    if(event.type==="checkout.session.completed"){
      console.log(`completed`);
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
          const Ship = mongoose.model('shippingInf', shipSchema)
          const date = new Date();

          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          let currentDate = `${day}-${month}-${year}`


          const body=`<div style={{color='green'}}> Dear ${mainshipper.firstName} ${mainshipper.lastName}, </div>
          <br/>
          <div>You have successfully Purchased the following product(s): </div>
          ${productInf.map((product)=>{
            return(
            //  `product name : ${product.name}, 
            //   Quantity : ${product.quantity}
            //   Amount: ${product.salePrice}

           `<table>
              
              <tr>
                <th> Product ID:     ${product.id}</th> <br/>
                <th> Name:     ${product.name}</th> <br/>
                <th> Quantity:      ${product.quantity}</th> 
                
              </tr>

            </table>
             
           `
              
            )
          })}
          <p>we know the world is full of choices. Thank you for choosing us! We appreciate it.</p>
          <p>We'll let you know as soon as it ships. In the meantime, reach out to our friendly support team with any questions you have. They're super nice...</p>
          <button style={{padding:"50%"}}><a href="mailto:support@natreltherapy.shop">Email Support</a></button>
          `

          console.log(body);
          let transporter = nodemailer.createTransport({
            host: "premium81.web-hosting.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: "support@natreltherapy.shop", // generated ethereal user
              pass: "Obinna123456", // generated ethereal password
            },
          });
         
          let mailOptions = {
            from: `"Na'trel Therapy" <support@natreltherapy.shop>`,
            to: mainshipper.email,
            subject: 'Successfully Purchased!!',
            
            html: body
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          
          // console.log(shippingInfo);
         productInf.map((shippi)=>{
            

              const ship= new Ship({
            
                  product_id:shippi.id,
                  date:currentDate,
                  firstName:mainshipper.firstName,
                  lastName:mainshipper.lastName,
                  email:mainshipper.email,
                  address:mainshipper.address,
                  city:mainshipper.city,
                  country:mainshipper.country,
                  postalCode:mainshipper.postalCode,
                  productName:shippi.name,
                  quantity:shippi.quantity,
                  price:shippi.salePrice
                  })
                  ship.save()
                
                  .then(()=>{

                        })
                  })
    } 
    response.send();
  
})

 

  app.post('/posted', (req,res)=>{
let {id, quantity, isIncrease, isDecrease} = req.body

  if(isIncrease){
    
    cart.forEach((cartItem)=>{
      if(cartItem.id===id){
        cartItem.quantity=parseInt(cartItem.quantity) + 1
      }
      
    })
    }
    // console.log(cart);
 
  
  if(isDecrease){
    
     cart.forEach((item)=>{
      if(item.id===id){
         if(item.quantity > 1){
        item.quantity = parseInt(item.quantity) - 1
      }

      }
     

     })
        
      
      
    
  

  }

calculateTotal(cart, req)
res.redirect('/cart')
})


app.post('/deletecart', (req,res)=>{
  const {names, id}= req.body
  cart && cart.map((cartItem)=>{
    if(cartItem.id===id){
      cart.splice(cart.indexOf(cartItem),1);
    }
  })
  calculateTotal(cart,req)
  res.redirect('/cart')
})

let searchItem;
app.post('/searchproduct', (req,res)=>{
  const search=_.upperCase(req.body.search);
  console.log(search);
  Product.findOne({name:search}, function(err, result){
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
    res.redirect('/searchedItem')
  })
})

app.get("/searchedItem", function(req,res){
  res.json(searchItem)

})


// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure


  app.listen(3000, function(){
    console.log(`connected successfullyy!!!`);
  })     