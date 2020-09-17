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

// router.post("/", (req, res, next) => {
//   const payment = new Payment(req.body);
//   payment.save().then((payment) => {
//     const transaction = new Transaction({
//       source: source,
//       destination: destination,
//       amount: paymentResult.amount,
//     });

//     transaction.save().then((transactionResult) => {
//       return res.status(201).send({
//         amount: paymentResult.amount,
//         status: paymentResult.status,
//         transaction: transactionResult,
//       });
//     }).catch(next)
//   }).catch(next)
// });

// Start Payment
// router.post("/", (req, res, next) => {
//   const payment = new Payment(req.body);
//   payment
//     .save()
//     .then((paymentResult) => {
//       const source = User.findOne({ _id: paymentResult.source }).then((res) => {
//         return res
//       });
//       const destination = User.findOne({ _id: paymentResult.destination }).then((res) => {
//         return res
//       });

//       const transaction = new Transaction({
//         source: source,
//         destination: destination,
//         amount: paymentResult.amount,
//       });
//       transaction.save().then((transactionResult) => {
//         return res.status(201).send({
//           amount: paymentResult.amount,
//           status: paymentResult.status,
//           transaction: transactionResult,
//         });
//       });
//     })
//     .catch(next);
// });

module.exports = router;
