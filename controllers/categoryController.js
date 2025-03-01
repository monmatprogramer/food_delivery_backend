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
      data: rows,
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
module.exports = { getAllCategories };
