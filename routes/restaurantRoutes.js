const express = require("express");
const { getAllRestaurants } = require("../controllers/restaurantController");

//Router
const restaurantRouter = express.Router();

restaurantRouter.get("/", getAllRestaurants);

//export the router
module.exports = restaurantRouter;
