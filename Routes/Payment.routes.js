const { Router } = require("express");
const { createPaymentIntent, listingPaymentIntent } = require("../Controllers/Payment.controller");

const paymentRouter = Router();

// Creating a payment intent
paymentRouter.post('/create_intent', createPaymentIntent) 
paymentRouter.get('/get_intents', listingPaymentIntent) 

module.exports = {
    paymentRouter
}