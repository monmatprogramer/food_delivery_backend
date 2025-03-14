const mySqlPool = require("../config/db");

const getAllOrder = async (req, res) => {
  try {
    // const [orders] = await mySqlPool.query();
  } catch (error) {}
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
  // Strat a transaction
  const connection = await mySqlPool.getConnection();
  try {
    await connection.beginTransaction();
    const [orderResult] = await connection.query(
      `INSERT INTO orders (customer_name, address, phone, payment_method, total_price) VALUES(?,?,?,?,?)`,
      [name, address, phone, paymentMethod, totalPrice]
    );
    const orderId = orderResult.insertId;
    console.log(items);
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, menu_item_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, item.price, item.quantity]
      );
      console.log("Finish: ", item.id);
    }
    console.log("-------");
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
      message: "Server error",
    });
  } finally {
    connection.release();
  }
};

module.exports = { getAllOrder, createNewOrder };
