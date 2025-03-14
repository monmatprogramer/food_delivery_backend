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
    const [rows] = await mySqlPool.query(
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
function isString(value) {
  return typeof value === "string";
}
const createNewCategory = async (req, res) => {
  //Two fields : name, icon
  try {
    const { name, icon } = req.body;
    if (!isString(name) || !isString(icon)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type of [name, icon]",
        results: ["No data"],
      });
    }
    if (
      !name ||
      !icon ||
      name === null ||
      icon === null ||
      name.length === 0 ||
      icon.length === 0 ||
      name.trim() === "" ||
      icon.trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Category [name, icon] is required",
        results: ["No data"],
      });
    }
    // Insert data into database
    const [result] = await mySqlPool.query(
      "INSERT INTO category (name,icon) VALUES(?,?)",
      [name, icon]
    );
    //result.insertId
    res.status(200).json({
      success: true,
      message: "Create a category",
      results: `Insert ID: ${result.insertId}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: e.message,
      results: "No data",
    });
  }
};
module.exports = { getAllCategories, getCategoryById, createNewCategory };
