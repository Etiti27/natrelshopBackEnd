const express=require('express');
const mongoose= require("mongoose");
const nodemailer=require('nodemailer');
const passport= require('passport');
const passportLocalMongoose= require('passport-local-mongoose');
const SHIP= require('../ShipSchema');



let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOSTING,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });
const router=express.Router();



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

  passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.post('/admin', (req, res) => {
  if(req.isAuthenticated()) {
    
    const {clientId}=req.body
    console.log(clientId);
    SHIP.findOne({orderID:clientId},(err, result)=>{
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
    
  }
  else if(!req.isAuthenticated()){
    res.json(`not authenticated`)
  }
  else{
    res.json('not admin')
  }
 
  // console.log(req.session);
})


router.post('/register', (req,res)=>{
  
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
  
  
  router.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/data');
    });
  });
  
//   router.post('/logout', (req,res)=>{
//     req.logout((err)=>{
//       if(!err){
//         res.send();
//       }
//     });
//   })
  router.post('/confirmshipping', (req,res)=>{
    const {shipped, clientId}=req.body;
    console.log(shipped);
    console.log(clientId);
    let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${day}-${month}-${year}`
    if(req.isAuthenticated()){
      SHIP.findOneAndUpdate({orderID:clientId}, {$set:{status:shipped, shipDate:currentDate}}, {new: true}, (err, doc) => {
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
  
  router.get('/allorders', (req,res)=>{
    if(req.isAuthenticated()){
      SHIP.find({}, (err,result)=>{
        if(err){
          console.log(err);
    
        }if(result){
          res.json(result)
        }
      })
    }if(!req.isAuthenticated()){
      res.json('not authenticated');
      console.log('not authenticated');
    }
  })
  
  router.post('/login', (req,res) =>{
  
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


  module.exports=router;