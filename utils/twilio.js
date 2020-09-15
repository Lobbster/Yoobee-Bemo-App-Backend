const authy = require("authy")("2KtdJt55E4AOZBcRhqw5ua6TYDu4DV9X");

const registerUser = (email, phone) => {
  // Register a new user with authy
  // Email, Phone, Country Code, Use Authy App
  authy.register_user(email, phone, "64", false, function (err, res) {
    // Save code against the user
    authy.request_sms(res.user.id, function (err, res) {
    });
  });
};

const sendUserVerify = (userId) => {
  User.findOne({ _id: userId }).then((user) => {
    if (!user) {
      return "User Not Found";
    } else {
      authy.request_sms(user.userToken, function (err, res) {
        console.log(res.message);
        return res
      });
    }
  });
};

// const checkUserVerify = (user, code) => {
//   authy.verify(authy_id, (token = code), function (err, res) {
//     console.log(res.message);
//   });
// };

module.exports = {
  registerUser,
  sendUserVerify
};
