require('dotenv').config()
const express = require('express')
const app=express()
const mongoose= require("mongoose");
const cors= require("cors")
const bodyParser = require('body-parser')
const session= require('express-session')
const MongoStore = require('connect-mongo')
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
const nodemailer=require('nodemailer')
const _ =require('lodash');
const cookieParser = require("cookie-parser");
const compression=require("compression")
const { v1: uuidv1,v4: uuidv4} = require('uuid');
const passport= require('passport');
const passportLocalMongoose= require('passport-local-mongoose');
// const mon=require('./routes/mongoDBroute/MongoDB')
const homePage=require('./routes/Homepage');
const stories= require('./routes/Stories');
const searched=require('./routes/Search');
const SearchProduct=require('./routes/postRoutes/SearchedProduct');
const Product=require('./routes/ProductSchema');
const contactPage =require('./routes/postRoutes/Contact');
const populatePage=require('./routes/postRoutes/PopulateProduct');
const addToCart= require('./routes/postRoutes/AddToCart');
const cartPage=require('./routes/Cart');
const stripeCheckoutPage=require('./routes/postRoutes/StripeCheckOutSession');
const editQuantity=require('./routes/postRoutes/EditQuantity');
const deleteProductInCart=require('./routes/postRoutes/DeleteProductInCart');
const user=require('./routes/postRoutes/User/User');
const SHIP=require('./routes/postRoutes/ShipSchema');
const productReadMore=require('./routes/ProductReadMore');
const DB=require('./mongoDBroute/MongoDB')

//connecting to DB

DB.DBConnection()

// middlewares
const corsOptions = {
  origin:  'http://localhost:3001',
  credentials: true,
  "Access-Control-Allow-Credentials": true
};
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsOptions))
app.use(cookieParser());
app.use('/webhook', bodyParser.raw({type: "*/*"}))
app.use(bodyParser.json({type: 'application/json'}))
app.set('trust proxy', 1)
app.use(bodyParser.json())
app.use(compression())
//session configuratin
app.use(session({
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: true
// store: MongoStore.create({ mongoUrl: mongoDBUrl }),

  }))
  
  //passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

//Routing
app.use('/data', homePage);
app.use('/ourstory', stories );
app.use("/searcheditem", SearchProduct);
app.use('/contact', contactPage);
app.use('/populate', populatePage);
app.use('/addtocart', addToCart);
app.use('/cart', cartPage);
app.use('/create-checkout-session', stripeCheckoutPage);
app.use('/posted', editQuantity);
app.use('/deletecart', deleteProductInCart);
app.use('/user', user);
app.use('/details', productReadMore);



let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOSTING,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

//stripe integration
  let endpointSecret = process.env.STRIPE_ENDPOINT_TEST_SECRET;
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
    
    // Handle stripe events
    if(eventType==="checkout.session.completed"){
stripe.customers.retrieve(data.customer)
.then((customer)=>{
  const objCus=JSON.parse(customer.metadata.customerInfo);
  const cartItem=JSON.parse(customer.metadata.cart);
  
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let currentDate = `${day}-${month}-${year}`

  const ships=new SHIP({
    date:currentDate,
    orderID:customer.metadata.orderID ,
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
           orderID:${customer.metadata.orderID}
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
             <p>${objCus.firstName} ${objCus.lastName} with <strong> orderID:${customer.metadata.orderID} </strong>,  have successfully Purchased the following product(s) </p>
            
              ${cartItem.map((cart)=>{
                return(
                  `
                  product Name: ${cart.name}, 
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

app.listen(3000, function(){
  console.log(`connected successfullyy!!!`);
})     