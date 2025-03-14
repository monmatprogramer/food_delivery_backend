const express = require("express");
const { getAllRestaurants, getFeaturedRestaurants } = require("../controllers/restaurantController");

//Router
const restaurantRouter = express.Router();

restaurantRouter.get("/", getAllRestaurants);
restaurantRouter.get("/featured",getFeaturedRestaurants);

//export the router
module.exports = restaurantRouter;
