const express = require("express");
const {
  getAllOrder,
  createNewOrder,
  getAllOrderById,
  updateStatus,
} = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.get("/", getAllOrder);
orderRouter.post("/", createNewOrder);
orderRouter.get("/:id", getAllOrderById);
orderRouter.patch("/:id/status", updateStatus);

module.exports = orderRouter;
