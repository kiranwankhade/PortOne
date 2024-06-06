const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  intentId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
});


const Payment = mongoose.model('Payment', PaymentSchema)

module.exports = {
    Payment
};
