const mySqlPool = require("../config/db");

const getAllCategories = async (req, res) => {
  try {
    const [rows] = await mySqlPool.query(`SELECT * FROM category`);

    //Not existing data
    if (rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No categories found",
      });
    }

    //Existing data
    res.status(200).send({
      success: true,
      message: "All categories",
      results: rows,
    });
  } catch (error) {
    console.log(`${error}`.red);
    res.status(500).send({
      success: false,
      message: "Error in Getting all students",
      error: error.message,
    });
  }
};
const getCategoryById = async (req, res) => {
  try {
    console.log("id: ", req.params.id);
    const [rows] = await mysqlPool.query(
      "SELECT * FROM category WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        results: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Get Category by ID",
      results: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      results: "Server error",
    });
  }
};
module.exports = { getAllCategories, getCategoryById };
