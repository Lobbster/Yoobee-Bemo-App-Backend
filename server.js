const express = require("express");
const app = express();
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const fileUpload = require('express-fileupload');
const firebase = require("./utils/firebase.js");
app.io = io;
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

require("./socket")(io);


// App Setup  ---------------------------------------------

app.use(express.static("public"));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080',
  credentials : true
 }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
dotenv.config();
const isProduction = false;
// Passport Config
require("./utils/passport.js")(passport);


// Initialise Firebase ------------------------------------

firebase.init();


// Mongoose Connection ------------------------------------

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Express Session ------------------------------------------
const userSession = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ 
    mongooseConnection: mongoose.connection,

  })
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
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});




module.exports = http;