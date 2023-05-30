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
// var SibApiV3Sdk = require('sib-api-v3-sdk');
// const postCalc=require("./routes/postRoutes/calculateQuan")
const _ =require('lodash');
const cookieParser = require("cookie-parser");
const compression=require("compression")
const { v1: uuidv1,v4: uuidv4} = require('uuid');
const passport= require('passport');
const passportLocalMongoose= require('passport-local-mongoose');
const bcrypt= require('bcrypt');
const { object } = require('webidl-conversions')
const saltRound= 10;


// const ejs=require('ejs')
// const accountSid = process.env.ACCOUNT_SID  
// const authToken = process.env.AUTH_TOKEN 
// const client = require('twilio')(accountSid, authToken);



//connecting to DB
mongoose.set("strictQuery", false);
const mongoDBUrl=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qqlrjp5.mongodb.net/NatrelTherapyDB`

    mongoose.connect(mongoDBUrl)

    const corsOptions = {
      origin: "https://natreltherapy.shop",
      credentials: true,
      "Access-Control-Allow-Credentials": true
  };

// middlewares
// app.set('view engine', 'ejs');
// app.use('/public', express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors())
app.use(cors(corsOptions))

app.use(cookieParser());
// app.use('/stripe', stripe)


// app.use('/minus', postCalc)


app.use('/webhook', bodyParser.raw({type: "*/*"}))
app.use(bodyParser.json({type: 'application/json'}))
app.set('trust proxy', 1)
app.use(bodyParser.json())
app.use(compression())

app.use(session({
secret: process.env.SESSION_SECRET,
resave: true,
saveUninitialized: true,
store: MongoStore.create({ mongoUrl: mongoDBUrl }),
cookie: { 
  // httpOnly:true,
  maxAge: 360000000,
  secure: false
}
  }))
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));


// app.use(session({ 
// secret: 'keyboard cat',
// resave:false,
// saveUninitialized: true,
// cookie: { maxAge: 60000 }}))

// Access the session as req.session
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOSTING,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});
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
  res.json(`working ...`)
 
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
        type: Number,
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
    },
    usage:{
      type:String
    }
    })
const Product=mongoose.model('product',productSchema);
const hairElixer= new Product({
  name:'HAIR OIL',
  desc: 'There is nothing more satisfying than to have hair care technology that builds and strengthens your hair. With Sisay Cosmetics Golden Hair Elixer, you have just that, a rich 100% Natural Hair elixir that strengthens and adds shine to your precious hair.',
  salePrice: 34.95,
  price: 70.99,
  quantity:1,
  moreDesc:`the secret to thick, healthy, and beautiful hair. the main and one of the most potent ingredients in this elixir is cold-pressed fenugreek oil ( essential oil). this potent plant possesses benefits catering specifically to hair.Fenugreek (Trigonella foenum-graecum). It has a 6000-year history and is commonly called Methi, high concentration of beneficial elements such as Vitamins A, B, and C, as well as phosphates, flavonoids, iron, saponins, and other minerals.It is rich in vitamins A, K, and C, folic acid, potassium, iron, calcium, and proteins, all of which are cornerstones for hair growth.`,
  ingredient:`Glycine Soja (Soybean) Oil, Trigonella Foenum-Graecum Seed Oil, Ricinus Communis (Castor) Seed Oil, Sesamum Indicum (Sesame) Seed Oil, Nigella Sativa Seed Oil, Tocopherol, Parfum,
  Benzyl Benzoate, Limonene, Coumarin, Alpha Isomethyl Ionone, Cinnamal, Geraniol, Citronellol,
  Hexyl Cinnamal, Benzyl Salicylate, Benzyl Alcohol`,
  image:"dailytoxic.png"
})

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
const defaultProduct=[hairElixer, dailyDetox]
// Product.insertMany(defaultProduct, function(err){
//   if(err){
//     throw err
//   }
// })
app.post('/populate', (req,res)=>{
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
    
  })
})

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
    
    res.send(products);
    
});
});


app.get("/data/:name", function(req,res){
  const namer= _.lowerCase(req.params.name)
  
  Product.find({name:namer}, function(err,products){
      res.json(products)
  })
  
  })

  app.use(function(req, res, next) {
    req.session.cart=cart
    next()
  })
  

app.post("/addtocart", function(req,res){

let {name, quantity,  salePrice, image,id}=req.body;


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
res.json(cart)

    
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
let currencysymbol;

let mainshipper;


let productInf
app.post('/create-checkout-session', async (req, res) => {
    const datas=req.body;
    req.session.ship=datas;
    shippingInfo=req.session.ship
    const userID=uuidv4().slice(0,5)
    // console.log(uuidv4());
    // console.log(shippingInfo);
    
    req.session.shipper=datas[0]
     mainshipper=req.session.shipper
    //  console.log(shippingSession.shipper);
    //  console.log(mainshipper);
   
   req.session.productInfo=datas[1]
   productInf=req.session.productInfo
  //  console.log(productInf);
  
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
        userID:userID,
        cart:JSON.stringify(productInf),
        customerInfo:JSON.stringify(mainshipper)
      }
    })

    // const coupon = await stripe.coupons.create({
      
    //   percent_off: 25.5,
    //   duration: 'once',
    //   name:"percentage off"
      
    // });
    const promotionCode = await stripe.promotionCodes.create({
      coupon: 'Obinna27',
      
      
    });

       const line_items= productInf.map((data)=>{
       
        
        // console.log(data);
          
            return {
              
                    price_data: {
                      currency: currencysymbol,
                      product_data: {
                        name: data.name && data.name,
                        images:[`https://natreltherapy.shop${data.image}`],
                        
                        // description: data.description,
                        
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
        
      customer:customer.id,
      line_items,
    
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      mode: 'payment',
      success_url: 'https://natreltherapy.shop/stripe-success',
      cancel_url: 'https://natreltherapy.shop/cancel',
      // consent_collection: {
      //   terms_of_service: 'required',
      // },


    //   shipping_address_collection: {
    //     allowed_countries: ["US", "CA", "KE"],
    //   },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: currencysymbol,
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
    
  
    res.send({datas:datas,
        url:session.url,
        
    });
   
  })

  let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET
  const shipSchema=new mongoose.Schema({
    userID:String,
    firstName:String,
    lastName:String,
    email:String,
    address:String,
    country:String,
    city:String,
    postalCode:String,
    date:String,
    shipDate:String,
    product:Object,
    amountSpent:Number,
    status:String
});
const SHIP= mongoose.model('shippingDetail', shipSchema);
  
  app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers['stripe-signature'];
  
   
    let data;
    let eventType;
  if(endpointSecret){
    let event;
    try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  data=event.data.object;
  eventType = event.type;
}else{
  data=request.body.data.object;
  eventType = request.body.type;
}
    

    // Handle the event
// console.log(event.data.object);
    if(eventType==="checkout.session.completed"){
stripe.customers.retrieve(data.customer)
.then((customer)=>{
  const objCus=JSON.parse(customer.metadata.customerInfo);
  const cartItem=JSON.parse(customer.metadata.cart);
  console.log(cartItem);
  console.log("data:", data);
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let currentDate = `${day}-${month}-${year}`
  
const userID=uuidv4().slice(0,7)
  const ships=new SHIP({
    date:currentDate,
    userID:customer.metadata.userID ,
    amountSpent:data.amount_total,
    firstName:objCus.firstName,
    lastName:objCus.lastName,
    email:objCus.email,
    address:objCus.address,
    city:objCus.city,
    country:objCus.country,
    shipDate:'null',
    postalCode:objCus.postalCode,
    product:cartItem,
    status: 'Not Ship'
   

  })
  
 

  const body=`<h2> Dear ${objCus.firstName} ${objCus.lastName}, </h2>
           <br/>
            <p>You have successfully Purchased the following product(s): </p>
            
            ${cartItem.map((cart)=>{
              return(
                `
                product Name: ${cart.name}
                quantity: ${cart.quantity}
                `
              )})}
                
          <br/>
          <p>we know the world is full of choices. Thank you for choosing us! We appreciate it.</p>
          <p>We'll let you know as soon as it ships. In the meantime, reach out to our friendly support team with any questions you have. They're super nice...</p>
          
             `

             const body2= `
             <p>${objCus.firstName} ${objCus.lastName} with userID:${userID},  have successfully Purchased the following product(s) </p>
            
              ${cartItem.map((cart)=>{
                return(
                  `
                  product Name: ${cart.name}
                  quantity: ${cart.quantity}
                  `
                )
                
              })}


             <h4>SHIPPING ADDRESS</h4>
             <p>Email: ${objCus.email}</p>
             <p>Address: ${objCus.address}</p>
             <p>Country: ${objCus.country}</p>
             <p>City: ${objCus.city}</p>
             <p>Postal Code: ${objCus.postalCode}</p>`;

           
                       
                        let mailOptions = {
                          from: `"Na'trel Therapy" <sales@natreltherapy.shop>`,
                          to: objCus.email,
                          subject: 'Successfully Purchased!!',
                          
                          html: body
                        };
                        
                        transporter.sendMail(mailOptions, function(error, info){
                          if (error) {
                            console.log(error);
                          } else {
                            console.log('Email sent to customer: ' + info.response);
                          }
                        });

                        //messaging admin about successful product

          let mailOptionss = {
            from: `"Na'trel Therapy" <sales@natreltherapy.shop>`,
            to: process.env.EMAIL_USER,
            subject: 'Purchase Alert!',
            
            html: body2
          };
          
          transporter.sendMail(mailOptionss, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent to admin: ' + info.response);
            }
          });
          

  ships.save()


}).then(()=>{
  
})
.catch((err)=>{
  console.log(err.message);
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
  const search=_.lowerCase(req.body.search);
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



//contactPage post

app.post('/contact', function(req, res){
const {name, email,subject, message}=req.body
console.log(req.body);

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOSTING,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

let mailOptions = {
  from:`${name} <${email}>`,
  to: process.env.EMAIL_USER,
  subject: subject,
  
  html: message
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
res.json()
})



const userSchema=new mongoose.Schema({
  firstName:String,
  lastName:String,
  Username:String,
  password:String,
  country:String,
  city: String,
  phoneNumber: Number,
  email:String
});
userSchema.plugin(passportLocalMongoose);

const User= mongoose.model('User', userSchema);

passport.use(User.createStrategy());
// passport.use(new LocalStrategy(User.authenticate()))

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());



// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

// passport.serializeUser(function(User, done) {
//   done(null, User.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
// $or: [
//   {'the_key': 'value1'},
//   {`the_key': 'value2'}
// ]
// app.post('/register',function(req,res){
//   const {name, username,password, city,country, phone, email}=req.body;
//   User.findOne({$or:[
//     {username:username},
//     {email:email}
//   ]}, (err, user)=>{
//     if(user){
//       console.log(user);
//       res.status(201).json(`username or Exist exist!`);
//       // res.redirect('/userfound')
//     }else{
// bcrypt.hash(password,saltRound, function(err, hash){
//   const newUser= new User({
//     name: name,
//     username:username,
//     email:email,
//     password:hash,
//     city:city, 
//     country:country,
//     phone:phone

//   });
//   // passport.authenticate("local", (req,res)=>{
//   //   console.log(`authenticity`);
//   //   res.redirect('/adminsection')
//   // })
//   newUser.save((err, user)=>{
//     if(err){
//       console.log(err);
//     }else{
//       console.log(`i am logged in`);
//       passport.authenticate("local")(req,res, function(){
//                 console.log(`i am authenticated again`);
//                 // res.json()
//                 res.redirect('/admin')
//                 console.log(req.user);
               
                
                
//               })
//       res.status(200).json(`registered`);
     
//     }
//   })
// })
     
      // User.register({
      //   name,
      //   email,
      //   phone,
      //   country,
      //   city,
      //   username,
        
      // },
      // password, function(err, user){
      //   if(user){
      //     console.log(user);
      //     passport.authenticate('local')(req,res,function(){
      //       res.redirect('/adminsection')
      //     })
          
      //   }else{
      //     throw err
      //   }
      // })
//     }
//   })
 
// } )


//i am the working example
app.post('/register', (req,res)=>{
  
  const {name, username,password, city,country, phone, email}=req.body;
  console.log(req.body);

User.register({
  name:name,
  username:username,
  city:city,
  country:country,
  phone:phone,
  email:email

}, password, (err, user)=>{
  if(err){
    console.log(err);
    
  }
  else{
   res.json('registered')
  }
})
})




app.post('/logout', (req,res)=>{
  req.logout((err)=>{
    if(!err){
      res.redirect('/cart')
    }
  });
})

// app.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) throw err;
//     if (!user){ res.send("No User Exists");}

//     else {
//       req.logIn(user, (err) => {
//         if (err) throw err;
//         res.send("Successfully Authenticated");
//         console.log(`Successfully Authenticated`);
//         console.log(req.user);
//       });
//     }
//   })(req, res, next);
// });

// // app.post("/login", (req, res, next) => {
// //   passport.authenticate("local", (err, user, info) => {
// //     if (err) throw err;
// //     if (!user) {console.log("No User Exists");}
// //     else {
// //       req.logIn(user, (err) => {
// //         if (err) throw err;
// //         res.send("Successfully Authenticated");
// //         console.log(`Successfully Authenticated`);
// //         console.log(req.user);
// //       });
// //     }
// //   })(req, res, next);
// // });

// app.post('/login', (req,res,next)=>{
//   const {username, password} = req.body
//   // console.log(req.body);
//   User.findOne({username: username},(err,user)=>{
//     console.log(user);
//     if(err){
//       console.log(err);
//       throw err
//     }
   
//     if(user){
      
//       bcrypt.compare(password, user.password, function(err, result) {
//         if(result===false){
//           console.log(`user not found`);
//         }
//         if(result===true){
//           console.log(`user found`);
//           passport.authenticate("local")(req,res,function(){
//             console.log(`authenticated`);
//           })
//         }
//     });
//     }
//   })
// })
//i am the working example
app.post('/login', (req,res) =>{

  const {username, password}=req.body;
  
  const user=new User({
        username:username,
        password:password})
  req.login(user, function(err){
    if(err){
      console.log(err);
    }
    
    else{
      
      User.findOne({username:username}, function(err,admin){
        if(!admin){
          console.log(`here`);
        }
        if(admin){
          if(admin.username==='admin'){
            passport.authenticate("local")(req,res, function(){
           
              res.json('admin')
            
            })
           }
           if(admin.username !=='admin'){
            res.json('not admin')
           }
        }
      
      })
      
    }
  })
})

app.post('/admin', (req, res) => {
  if(req.isAuthenticated()) {
    
    const {clientId}=req.body
    console.log(clientId);
    SHIP.findOne({userID:clientId},(err, result)=>{
      if(err){
        console.log(err)
      }
      if(!result){
        res.json(`not found`)
      }
      else{
        console.log(result);
        res.json(result)
      }
    })
    
  }else{
    res.json('not admin')
  }
 
  // console.log(req.session);
})


app.post('/confirmshipping', (req,res)=>{
  const {shipped, clientId}=req.body;
  console.log(shipped);
  console.log(clientId);
  let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let currentDate = `${day}-${month}-${year}`
  if(req.isAuthenticated()){
    SHIP.findOneAndUpdate({userID:clientId}, {$set:{status:shipped, shipDate:currentDate}}, {new: true}, (err, doc) => {
      if (err) {
          console.log("Something wrong when updating data!");
      }
      
      if(doc){
        console.log(doc);
        //send message to client
        let message='product you recent purchase from our store has been shipped!'
        let mailOptions = {
          from: `"Na'trel Therapy" <sales@natreltherapy.shop>`,
          to: doc.email,
          subject: 'Product Shipped',
          
          html: message
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent to customer: ' + info.response);
          }
        });

        //send to admin

        let message2='You just confirmed a shipping'
        let mailOptions2 = {
          from: `"Na'trel Therapy" <sales@natreltherapy.shop>`,
          to: process.env.EMAIL_USER,
          subject: 'Ship Confirmation',
          
          html: message2
        };
        
        transporter.sendMail(mailOptions2, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent to customer: ' + info.response);
          }
        });
      }
      res.json('admin')
  });

  }else(
    res.json('not admin')
  )
  

})

app.get('/allorders', (req,res)=>{
  if(req.isAuthenticated()){
    SHIP.find({}, (err,result)=>{
      if(err){
        console.log(err);
  
      }if(result){
        res.json(result)
      }
    })

  }
 
})
app.listen(3000, function(){
  console.log(`connected successfullyy!!!`);
})     