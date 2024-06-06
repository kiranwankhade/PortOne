require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

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

    // Attaching the payment method to teh customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });

    // Creating Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
      customer: customer.id,
      payment_method: "pm_card_visa",
      confirmation_method: "manual",
      description: "Payment for your order",
      use_stripe_sdk: true,
      confirm: false,
    });
    res.status(200).send({ paymentIntent });
  } catch (err) {
    next(err);
  }
};


// Getting a list of all payment intent
const listingPaymentIntent = async (req, res, next) => {
    try {
        const paymentIntents = await stripe.paymentIntents.list();         
        res.status(200).send({ paymentIntents });
    } catch (err) {
        next(err);
    }
}


module.exports = { createPaymentIntent,listingPaymentIntent };
