const authy = require("authy")("2KtdJt55E4AOZBcRhqw5ua6TYDu4DV9X");

const registerUser = (email, phone) => {
  return new Promise((resolve, reject) => {
    authy.register_user(email, phone, "64", false, function (err, regRes) {
      // Save code against the user
      authy.request_sms(regRes.user.id, function (err, res) {
        resolve(regRes);
      });
    });
  });
};

const sendUserVerify = (phone) => {
  return new Promise((resolve, reject) => {
    User.findOne({ phone: phone }).then((user) => {
      if (!user) {
        return "User Not Found";
      } else {
        authy.request_sms(user.userToken, function (err, res) {
          resolve(res);
        });
      }
    });
  });
};

const checkUserVerify = (authy_id, code) => {
  return new Promise((resolve, reject) => {
    authy.verify(authy_id, (token = code), function (err, res) {
      resolve(res);
    });
  });
};

module.exports = {
  registerUser,
  sendUserVerify,
  checkUserVerify,
};
