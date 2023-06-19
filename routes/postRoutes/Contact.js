const express=require('express');
const nodemailer=require('nodemailer');
const router=express.Router()
router.post('/', function(req, res){
    const {name, email,subject, message}=req.body
    console.log(req.body);
    //Gmail
    const sliceEmail=email.toLowerCase().slice(-10)
    if(sliceEmail==='@gmail.com'){
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_NAME,
          pass:process.env.GMAIL_APP_PASSWORD
        }
      });
      
      var mailOptions = {
        from: `${name}  ${email} <${email}>`,
        to: process.env.EMAIL_USER,
        subject: subject,
        text: message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.json()
    }
    else{
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
    }
    //custom email
    
    
    })

    module.exports=router