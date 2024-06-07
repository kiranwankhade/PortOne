const { Router } = require("express");

const { createPaymentIntent, listingPaymentIntent, capturePaymentIntentById, createRefund } = require("../Controllers/Payment.controller");

const paymentRouter = Router();

// Creating a payment intent
paymentRouter.post('/create_intent', createPaymentIntent);

// Capturing a payment intent by ID
paymentRouter.post('/capture_intent/:id', capturePaymentIntentById);

// Creating a refund for a payment intent by ID
paymentRouter.post('/create_refund/:id', createRefund);

// Getting a list of all payment intents
paymentRouter.get('/get_intents', listingPaymentIntent);

module.exports = {
    paymentRouter
}