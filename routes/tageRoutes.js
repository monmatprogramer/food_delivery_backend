//insert express package
const express = require('express');

//Call controller
const {getAllTags} = require("../controllers/tagController");


//Create router
const tagRouter = express.Router();

//Create router
tagRouter.get("/",getAllTags);


//Export
module.exports = tagRouter;