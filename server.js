const express = require('express');
const app = express();
const passport = require('passport');
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// App Configuration
app.use(express.static('public'));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
dotenv.config();

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});


// Configure Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//ROUTING ------------------------------------
app.use((req, res, next) => {
  console.log(req.method + " request just came in...");
  next();
});
  
app.get("/", (req, res) => {
  console.log(`${req.method} request received...`);
  res.send("server running...");
});

// Auth Routes
const authRoute = require("./routes/auth/auth.js")
app.use("/auth", authRoute);
  
// User Routes
const users = require("./routes/users.js");
app.use("/users", users);

//ERRORS ------------------------------------
app.use((req, res, next) => {
  const error = new Error("Errors are happening, try again...");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  if (!isProduction) {
    console.log(err.stack);
  }

  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: err,
    },
  });
});

  
// Server Listener
app.listen(3000, () => { 
  console.log("Listening on port 3000...");
});