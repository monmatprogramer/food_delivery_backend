const mysqlPool = require("../config/db");

// Create getAllRC controller
const getAllRC = async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      `
            SELECT * FROM restaurant_category
        `
    );
    //Check it is exist or not
    if (rows.length === 0) {
      // 404 : Not found resource
      return res.status(404).send({
        sucess: false,
        message: "Not found restaurant_category resouces",
      });
    }

    // If it is found
    res.status(200).send({
      success: true,
      message: "All restaurant_category",
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

module.exports = { getAllRC };
