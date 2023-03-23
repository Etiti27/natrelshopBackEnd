require('dotenv').config()
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router=express.Router()
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.json())


router.post('/create-checkout-session', async (req, res) => {
  console.log(req.body);
 
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    mode: 'payment',
    success_url: 'http://localhost:3001/stripe-success',
    cancel_url: 'http://localhost:3001/cancel',
  });

  res.send({url:session.url});
 
})

module.exports = router