// test.spec.mjs (ESM)
// Treating as ECMAScript Modules (ESM) is the standard JavaScript module system.
// We can Use Import

import 'dotenv/config';
import * as chai from 'chai';
import supertest from 'supertest';
import app from '../index.cjs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_KEY);

// HTTP requests
const request = supertest(app);

// assertion library  as its expect , should
const expect = chai.expect;

describe('Stripe Payment', function() {
  this.timeout(10000); // Increase timeout for slow tests

  let customer;
  let paymentMethod;

  before(async () => {
    customer = await stripe.customers.create({
      email: 'test@test.com',
    });

    paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: 'tok_visa',
      },
    });

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });
  });

  describe('create Payment Intent', () => {
    it('should create a payment intent', async () => {
      const response = await request
        .post('/api/v1/create_intent')
        .send({
          email: 'test@test.com',
          amount: 100,
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('paymentIntent');
    });
  });

  describe('capture Payment Intent', () => {
    it('should capture a payment intent', async () => {
      const createIntent = await stripe.paymentIntents.create({
        amount: 5000,
        currency: 'inr',
        customer: customer.id,
        payment_method: paymentMethod.id,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        capture_method: 'manual',
        description: 'Payment for your order',
        confirm: false,
      });

      const response = await request
        .post(`/api/v1/capture_intent/${createIntent.id}`)
        .send();

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('capturedPaymentIntent');
    });
  });

  describe('create Payment Refund', () => {
    it('should create a refund', async () => {
        const createIntent = await stripe.paymentIntents.create({
          amount: 5000, 
          currency: 'inr',
          customer: customer.id,
          payment_method: paymentMethod.id,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
          capture_method: 'manual',
          description: 'Payment for your order',
          confirm: false,
        });
  
        // Confirm and capture the payment intent first
        await stripe.paymentIntents.confirm(createIntent.id);
        await stripe.paymentIntents.capture(createIntent.id);
  
        // Create the refund
        const response = await request
          .post(`/api/v1/create_refund/${createIntent.id}`)
          .send();
  
        if (response.status !== 200) {
          console.error('Refund creation failed:', response.body);
        }
  
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('refund');
      });
  });

  describe('list all Payment Intents', () => {
    it('should list all payment intents', async () => {
      const response = await request
        .get('/api/v1/get_intents')
        .send();

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('paymentIntents');
    });
  });
});
