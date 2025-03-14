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
function isValidString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
const createNewCategory = async (req, res) => {
  //Two fields : name, icon
  try {
    const { name, icon } = req.body;
    if (!isValidString(name) || !isValidString(icon)) {
      return res.status(400).json({
        success: false,
        message:
          "Category name and Icon are required and must be non-empty strings",
        results: null,
      });
    }
    const trimmedName = name.trim();
    const trimmedIcon = name.trim();

    const [existingCategories] = await mySqlPool.query(
      "SELECT * FROM category WHERE name = ?",
      [trimmedName]
    );

    if (existingCategories.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This category already exists",
        result: null,
      });
    }

    // Insert data into database
    const [result] = await mySqlPool.query(
      "INSERT INTO category (name,icon) VALUES(?,?)",
      [trimmedName, trimmedIcon]
    );
    //result.insertId
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      results: {
        id: result.insertId,
        name: trimmedName,
        icon: trimmedIcon,
      },
    });
  } catch (error) {
    console.error("Error creating category: ", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      results: null,
    });
  }
};
module.exports = { getAllCategories, getCategoryById, createNewCategory };
