const mysqlPool = require("../config/db");

//Get all tag
const getAllTags = async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      `
            SELECT * FROM tag
        `
    );

    if (rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Not found tags resouce",
      },);
    }

    res.status(200).send({
        success: true,
        message: "All tages",
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

module.exports = { getAllTags };
