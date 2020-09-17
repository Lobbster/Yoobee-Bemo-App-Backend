const mongoose = require("mongoose");

// Mongo Module
const state = {
  db: null,
};
function connect() {
  state.db = mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
}
function getConnection() {
  return Promise.resolve(state.db);
}
module.exports = {
  connect,
  getConnection,
};