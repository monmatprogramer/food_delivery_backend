const express = require("express");
const { getAllRC } = require("../controllers/getAllRCController");

//Router
const rcRouter = express.Router();

rcRouter.get("/",getAllRC);

//export this router
module.exports = rcRouter;