
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const {Payment} = require("../Model/Payment.schema")

const createPaymentIntent = async (req, res, next) => {
  const { email, amount } = req.body;
  try {
    // Creating a customer
    const customer = await stripe.customers.create({
        email: email,
      });
  
      // Creating a payment method using test card token
      const paymentMethod = await stripe.paymentMethods.create({
        type: "card",
        card: {
          token: "tok_visa",
        },
      });
  
      // Attaching the payment method to the customer
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customer.id,
      });
  
      // Creating Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'inr',
        customer: customer.id,
        payment_method: paymentMethod.id,
        automatic_payment_methods: { 
            enabled: true, 
            allow_redirects: "never" // Disable redirect-based payment methods
          },
        capture_method: "manual", // Explicitly set capture_method to manual
        description: "Payment for your order",
        confirm: false
      });
  
      const payment = new Payment({
        intentId: paymentIntent.id,
        amount: amount,
        currency: 'inr',
        status: paymentIntent.status,
      });

      await payment.save();
  
      res.status(200).send({ paymentIntent });
  } catch (err) {
    next(err);
  }
};

const capturePaymentIntentById = async (req, res, next) => {
    try {
        const { id } = req.params;
    
        // Retrieve the payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(id);
    
        // Check if the payment intent has already been captured
        if (paymentIntent.status === 'succeeded') {
          return res.status(400).send({ error: 'This PaymentIntent has already been captured.' });
        }
    
        // Confirming a payment
        const confirmedPaymentIntent = await stripe.paymentIntents.confirm(id);
    
        // Capturing a payment intent using payment intent id
        const capturedPaymentIntent = await stripe.paymentIntents.capture(id);
    
        // Update the payment status in the database
        await Payment.findOneAndUpdate({ intentId: id }, { status: capturedPaymentIntent.status });    
    
        return res.status(200).send({ capturedPaymentIntent });
      } catch (err) {
        next(err);
    }
  };

// Refund 
const createRefund = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Creating a Refund using payment intent id
        const refund = await stripe.refunds.create({ payment_intent: id });    
    
        // Update the payment status in the database
        await Payment.findOneAndUpdate({ intentId: id }, { status: 'refunded' });
    
        return res.status(200).send({ refund });
      } catch (err) {
        next(err);
      }
}

// Getting a list of all payment intent
const listingPaymentIntent = async (req, res, next) => {
    try {
        // const paymentIntents = await Payment.find();         
    // res.status(200).send({ paymentIntents });
        const paymentIntents = await stripe.paymentIntents.list();         
        res.status(200).send({ paymentIntents });
    } catch (err) {
        next(err);
    }
}


module.exports = { createPaymentIntent,capturePaymentIntentById,createRefund,listingPaymentIntent };
