const express = require("express");
const UserController = require("../controller/UserController");
const route = express.Router();

//Userconstoller

route.get("/getalluser",UserController.getalluser)
route.post("/userinsert",UserController.userinsert)




module.exports = route;
