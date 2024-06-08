const { Router } = require("express");

const { createPaymentIntent, listingPaymentIntent, capturePaymentIntentById, createRefund } = require("../Controllers/Payment.controller");

const paymentRouter = Router();

/**
 * @swagger
 * /create_intent:
 *   post:
 *     summary: Create a payment intent
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       500:
 *         description: Internal server error
 */


// Creating a payment intent
paymentRouter.post('/create_intent', createPaymentIntent);


/**
 * @swagger
 * /capture_intent/{id}:
 *   post:
 *     summary: Capture a payment intent by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment intent ID
 *     responses:
 *       200:
 *         description: Payment intent captured successfully
 *       400:
 *         description: This PaymentIntent has already been captured.
 *       500:
 *         description: Internal server error
 */


// Capturing a payment intent by ID
paymentRouter.post('/capture_intent/:id', capturePaymentIntentById);


/**
 * @swagger
 * /create_refund/{id}:
 *   post:
 *     summary: Create a refund for a payment intent by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment intent ID
 *     responses:
 *       200:
 *         description: Refund created successfully
 *       500:
 *         description: Internal server error
 */

// Creating a refund for a payment intent by ID
paymentRouter.post('/create_refund/:id', createRefund);


/**
 * @swagger
 * /get_intents:
 *   get:
 *     summary: Get a list of all payment intents
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of payment intents
 *       500:
 *         description: Internal server error
 */

// Getting a list of all payment intents
paymentRouter.get('/get_intents', listingPaymentIntent);

module.exports = {
    paymentRouter
}