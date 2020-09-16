const dotenv = require("dotenv");
const authy = require("authy")(process.env.TWILIO_API_KEY);
const User = require("../models/User.js");

// Register a new userToken with Twilio using the provided email and phone
const registerUser = (email, phone) => {
  // Return a Promise
  return new Promise((resolve, reject) => {
    // Using Twilio Authy register a user, NZ numbers only.
    authy.register_user(email, phone, "64", false, function (err, user) {
      authy.request_sms(regRes.user.id, function (err, res) {
        // Return the Twilio user object (Inlcudes userToken / authyId)
        resolve(user);
      });
    });
  });
};

// Send a verification to a user when given a phone number
const sendUserVerify = (phone) => {
  // Return a Promise
  return new Promise((resolve, reject) => {
    User.findOne({ phone: phone }).then((user) => {
      // If not user return so
      if (!user) {
        return "User Not Found";
      } else {
        // If the phone number is registered send verification
        authy.request_sms(user.userToken, function (err, res) {
          // Return the response (includes sms status and other info)
          resolve(res);
        });
      }
    });
  });
};

// Check a verification code against a user
const checkUserVerify = (userId, code) => {
  // Return a Promise
  return new Promise((resolve, reject) => {
    // Find the user to get thier userToken which was setup during registration
    User.findOne({ _id: userId }).then((user) => {
      // Check with authy that the user provided the correct verification code
      authy.verify(user.userToken, token=code, function (err, res) {
        // Resolve any errors, the response and the user logingin
        resolve({
          error: err,
          response: res,
          user: user
        });
      });
    });
  });
};

// Export all the modules
module.exports = {
  registerUser,
  sendUserVerify,
  checkUserVerify,
};
