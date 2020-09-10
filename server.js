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

app.listen(3000, () => {  // Start listening once DB connection is made
  console.log("Listening on port 3000...");
});

