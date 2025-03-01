const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const mySqlPool = require("./config/db");

require("dotenv").config();

const app = express();

//Middleware
app.use(express.json());
app.use(morgan("dev"));

//PORT
const PORT = process.env.PORT || 5000;

mySqlPool
  .query("SELECT 1")
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`PORT: ${PORT}`);
      console.log("Server is running...");
    });
  })
  .catch((error) => {
    console.error(`Error occured: ${error}`);
  });
