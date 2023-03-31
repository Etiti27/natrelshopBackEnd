const express=require('express')
const app = express();
const router=express.Router()
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



router.post("/minus", (req,res)=>{
const {quantity}=req.body;
console.log(quantity);



})
module.exports=router