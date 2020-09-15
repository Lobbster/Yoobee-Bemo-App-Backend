let express = require('express');
let app = express();
const cors = require("cors");

// Prevent CORS permission errors
app.use(cors());
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const isProduction = false;

// Parse JSON
app.use(express.json());

//Mongoose errors go away
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.listen(3000, () => {  // Start listening once DB connection is made
  console.log("Listening on port 3000...");
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

//routes to the http://localhost:3000/users
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
