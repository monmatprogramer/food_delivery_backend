const express = require("express");
const {
  getAllOrder,
  createNewOrder,
} = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.get("/", getAllOrder);
orderRouter.post("/", createNewOrder);
module.exports = orderRouter;
