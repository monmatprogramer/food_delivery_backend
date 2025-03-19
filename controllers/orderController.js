const mySqlPool = require("../config/db");

const getAllOrder = async (req, res) => {
  try {
    const [orders] = await mySqlPool.query(
      `
        SELECT * FROM orders ORDER BY created_at DESC
      `
    );
    //[order]: [{...},{...},{...},{...},{...},{...}]
    // if there are no orders, return immediately
    if (orders.length === 0) {
      return res.json({
        success: true,
        results: orders,
      });
    }
    // Get an array of order IDs from the fetched orders
    const orderIds = orders.map((order) => order.id);

    // Fetch all order_items for orders in on go
    const [orderItems] = await mySqlPool.query(
      `SELECT * FROM order_items WHERE order_id IN (?) ORDER BY order_id DESC`,
      [orderIds] //? is parameterized queries
    );

    // Group order items by order_id for easy lookup
    const itemsByOrderId = orderItems.reduce((acc, item) => {
      if (!acc[item.order_id]) {
        acc[item.order_id] = [];
      }
      acc[item.order_id].push(item);
      return acc;
    }, {});

    // Attach items to their corresponding orders
    orders.forEach((order) => {
      order.items = itemsByOrderId[order.id] || [];
    });

    return res.status(200).json({
      success: true,
      message: "Get all order",
      results: orders,
    });
  } catch (error) {
    console.error("Error occurred while fetching orders: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getAllOrderById = async (req, res) => {
  try {
    const [orders] = await mySqlPool.query(
      `
        SELECT * FROM orders WHERE id = ?
      `,
      [req.params.id]
    );
    //If it empty
    if (orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });
    }
    const order = orders[0];
    // Get items for the order
    const [items] = await mySqlPool.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [order.id]
    );
    order.items = items;
    res.status(200).json({
      success: true,
      message: "Get order by ID",
      results: order,
    });
  } catch (error) {
    console.error("Error occurred while fetching orders by ID: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const createNewOrder = async (req, res) => {
  const { name, address, phone, paymentMethod, items, totalPrice } = req.body;

  if (!name || !address || !phone || !paymentMethod || !items || !totalPrice) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide name, address, phone, paymentMethod, items and totalPrice",
    });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Items must be a non-empty array",
    });
  }

  // Strat a transaction
  const connection = await mySqlPool.getConnection();
  try {
    await connection.beginTransaction();
    const [orderResult] = await connection.query(
      `INSERT INTO orders (customer_name, address, phone, payment_method, total_price) VALUES(?,?,?,?,?)`,
      [name, address, phone, paymentMethod, totalPrice]
    );

    const orderId = orderResult.insertId;
    for (const item of items) {
      // Check if item has all required properties
      if (
        !item.id ||
        !item.name ||
        item.price === undefined ||
        item.quantity === undefined
      ) {
        throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
      }
      // Make sure price and quanity are numbers
      const price = parseFloat(item.price);
      const quantity = parseFloat(item.quantity);
      if (isNaN(price) || isNaN(quantity)) {
        throw new Error(
          `Invalid price or quantity for item: ${JSON.stringify(item)}`
        );
      }

      // Insert the order item
      await connection.query(
        `INSERT INTO order_items (order_id, menu_item_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, item.price, item.quantity]
      );
    }

    await connection.commit();
    // Get the created order with items
    const [newOrder] = await mySqlPool.query(
      "SELECT * FROM orders WHERE id = ?",
      [orderId]
    );
    const [orderItmes] = await mySqlPool.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [orderId]
    );
    newOrder[0].items = orderItmes;
    res.status(201).json({
      success: true,
      data: newOrder[0],
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Server error" + error.message,
    });
  } finally {
    connection.release();
  }
};

module.exports = { getAllOrder, createNewOrder, getAllOrderById };
