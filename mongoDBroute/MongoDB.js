const express=require('express');
const mongoose= require("mongoose");

exports.DBConnection=()=>{
    mongoose.set("strictQuery", false);
    const mongoDBUrl=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qqlrjp5.mongodb.net/NatrelTherapyDB`
    
        mongoose.connect(mongoDBUrl)
}



