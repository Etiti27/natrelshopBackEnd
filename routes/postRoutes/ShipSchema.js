const { Double } = require('bson');
const mongoose=require('mongoose');


    const shipSchema=new mongoose.Schema({
        orderID:String,
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
        amountSpent:String,
        status:String
    });
    const SHIP= mongoose.model('shippingDetail', shipSchema);
    
    module.exports=SHIP

