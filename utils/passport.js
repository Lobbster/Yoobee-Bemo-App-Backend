const customStrategy = require("passport-custom");
const User = require("../models/User.js");
const { checkUserVerify } = require("./twilio.js");

// Export Passport Custom Strategy
module.exports = function (passport) {
  passport.use(
    "passworless",
    new customStrategy((req, done) => {
      // Check if the request includes a code and userId
      if (req.body.phone && req.body.code) {
        // Run the twilio CheckUserVerify utility
        checkUserVerify(req.body.phone, req.body.code)
          .then((verify) => {
            // If no errors and the vrification was successful
            if (!verify.error && verify.response.success == "true") {
              // Return user with no errors
              done(null, verify.user);
            } else {
              // Return error
              return done({
                status: 401,
                error: verify.error.message,
                response: null,
              });
            }
          })
          .catch((err) => {
            return done(err); // 401 User not found
          });
      } else {
        // 401 Request Missing parameters
        return done({
          status: 400,
          error: "Missing parameters",
          response: null,
        });
      }
    })
  );

  // Setialize the user (Pull out thier id for refrence with the app)
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize the user (From thier localStorage key find thier user object)
  // This allows you to get the current user from req.user in any route
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
