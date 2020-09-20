const express = require("express");
const app = express();
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");

// App Setup  ---------------------------------------------

app.use(express.static("public"));
app.use(express.json());
app.use(cors());
dotenv.config();
const isProduction = false;
// Passport Config
require("./utils/passport.js")(passport);

// Express Session ------------------------------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Mongoose Connection ------------------------------------

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Routes -------------------------------------------------

app.use("/", require("./routes/index.js"));
app.use("/auth", require("./routes/auth/auth.js"));
app.use("/users", require("./routes/users.js"));
app.use("/user", require("./routes/user/index.js"));
app.use("/payments", require("./routes/payments/index.js"));

// --------------------------------------------------------
//                      DEV ONLY
app.use((req, res, next) => {
  console.log(req.method + " request just came in...");
  next();
});
// --------------------------------------------------------

// Error Checking -----------------------------------------

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

// Server -------------------------------------------------
app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
