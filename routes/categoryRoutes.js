const express = require("express");

const { getAllCategories,getCategoryById } = require("../controllers/categoryController");

//Router
const categoryRouter = express.Router();

//Match route
//--- Geta ll categories (GET)
 categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);

// Export the router to outside or it is executed in app.js when run the server
module.exports = categoryRouter; // categoryRouter will be execute for get all categories
