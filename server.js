const express = require("express");
const app = express();
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
app.io = io;
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

require("./utils/chat/socket.js")(io);


// App Setup  ---------------------------------------------

app.use(express.static("public"));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080',
  credentials : true
 }));
dotenv.config();
const isProduction = false;
// Passport Config
require("./utils/passport.js")(passport);

// Express Session ------------------------------------------
const userSession = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
});
const initPassport = passport.initialize();
const initpassportSession = passport.session();

app.use(userSession);

// Passport middleware
app.use(initPassport);
app.use(initpassportSession);
io.use(wrap(userSession));
io.use(wrap(initPassport));
io.use(wrap(initpassportSession));

// Mongoose Connection ------------------------------------

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Socket -------------------------------------------------

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
});


// Routes -------------------------------------------------

app.use('/', require('./routes/index.js'));
app.use('/auth', require('./routes/auth/auth.js'));
app.use('/users', require('./routes/users.js'));
app.use('/chat', require('./routes/chat/index.js'));
app.use("/user", require("./routes/user/index.js"));
app.use("/payments", require("./routes/payments/index.js"));

// --------------------------------------------------------
//                      DEV ONLY
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');   
  res.setHeader('Access-Control-Allow-Credentials', 'true');   
  console.log(req.method + " request just came in...");
  next();
});
// --------------------------------------------------------

// Error Checking -----------------------------------------

// app.use((req, res, next) => {
//   const error = new Error("Error 404. Not Found");
//   error.status = 404;
//   next(error);
// });

// app.use((err, req, res, next) => {
//   if (!isProduction) {
//     console.log(err.stack);
//   }

//   res.status(err.status || 500);

//   res.json({
//     errors: {
//       message: err.message,
//       error: err,
//     },
//   });
// });


// Server -------------------------------------------------
http.listen(3000, () => {
  console.log("Listening on port 3000...");
});




module.exports = http;
