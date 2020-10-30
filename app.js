const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require("dotenv");
const bodyParser = require("body-parser");


const app = express();
dotenv.config();

console.log(Date.now())

const MONGODB_URI = `mongodb+srv://coin:1234567890@cluster0.y5nwu.mongodb.net/softkash?retryWrites=true&w=majority`;

// Setup cors
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import Routes 
const userRoutes = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const exampleRoute = require("./routes/exampleRoute");
const adminRoute = require("./routes/adminRoute");


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });

  app.use("/", userRoutes);
  app.use("/", authRoute);
  app.use("/", exampleRoute);
  app.use("/", adminRoute);


// process.exit();

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Connected to Database!");
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => {
    console.log(err);
  });