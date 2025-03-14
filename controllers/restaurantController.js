const mysqlPool = require("../config/db");
const getAllRestaurants = async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      `
            SELECT r.*, GROUP_CONCAT(c.name) as categories
            FROM restaurant r
            LEFT JOIN restaurant_category rc ON r.id = rc.restaurant_id
            LEFT JOIN category c ON rc.category_id = c.id
            GROUP BY r.id
        `
    );
    //Not existing data
    if (rows.length < 0) {
      return res.status(404).send({
        success: false,
        message: "No restaurants found",
      });
    }

    //Existing data
    res.status(200).send({
      success: true,
      message: "All restaurants",
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

// Get featured restaurant
const getFeaturedRestaurants = async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      `
          select r.*, group_concat(c.name) as categories
          from food_delivery_db.restaurant r
          left join food_delivery_db.restaurant_category rc on r.id = rc.restaurant_id
          left join food_delivery_db.category c on rc.restaurant_id = c.id
          where r.isFeatured = 1
          group by r.id;
      `
    );

    if (rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No featured restaurants food",
      });
    }

    res.status(200).send({
      success: true,
      message: "Featured restaurants",
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

module.exports = {
  getAllRestaurants,
  getFeaturedRestaurants,
};
