const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const mySqlPool = require("./config/db");
const restaurantRoutes = require("./routes/restaurantRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const restaurantCategoryRoutes = require("./routes/restaurantCategoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const tagRoutes = require("./routes/tageRoutes");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();

//Middleware
app.use(express.json());
app.use(morgan("dev"));
// app.use(cors());
// app.use(bodyParser.json);

//Routes
app.use("/restaurants", restaurantRoutes);
app.use("/categories", categoryRoutes);
app.use("/rc", restaurantCategoryRoutes);
app.use("/tags", tagRoutes);
app.use("/orders", orderRoutes);

//Not found routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});
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
