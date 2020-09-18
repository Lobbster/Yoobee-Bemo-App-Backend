const router = require("express").Router();
const Payment = require("../../models/Payment.js");
const User = require("../../models/User.js");
const Transaction = require("../../models/Transaction.js");
const { createTransaction } = require("../../utils/transactionFunctions.js");

// Payment middleware
router.param("id", (req, res, next, id) => {
  Payment.findById(id)
    .then((payment) => {
      if (!payment) {
        res.status(404).send("Payment not found");
      } else {
        req.payment = payment;
        return next();
      }
    })
    .catch(next);
});

// Create a payment
router.post("/", (req, res, next) => {
  const payment = new Payment(req.body);
  payment.save().then((payment) => {
    return res.status(201).send(payment)
  }).catch(next)
});

// Confirm a payment
router.post("/confirm", (req, res, next) => {
  createTransaction(req.body.payment).then((transaction) => {
    if (transaction.error) {
      return next(transaction.error)
    }

    return res.status(201).send(transaction);
  }).catch(next)
});

module.exports = router;
