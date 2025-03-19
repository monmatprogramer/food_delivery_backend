const express = require("express");
const {
  getAllOrder,
  createNewOrder,
  getAllOrderById,
} = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.get("/", getAllOrder);
orderRouter.post("/", createNewOrder);
orderRouter.get("/:id", getAllOrderById);

module.exports = orderRouter;
