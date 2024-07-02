const express = require("express");
const UserController = require("../controller/UserController");
const CategoryController = require("../controller/CategoryController");
const ProductController=require("../controller/ProductController")
const checkUserAuth = require("../middleware/Auth");
const route = express.Router();

//Userconstoller

route.get("/getuser", UserController.getuser);
route.get("/getDisplay", UserController.getDisplay);
route.post("/getSingleuser/:id", checkUserAuth, UserController.getSingleuser);
route.get("/getUserDetail", UserController.getUserDetail);
route.post("/userinsert", UserController.userinsert);
route.post("/verifylogin", UserController.verifylogin);
route.post("/updatepassword", checkUserAuth, UserController.updatepassword);
route.post("/updateProfile", checkUserAuth, UserController.updateProfile);
route.post("/logoutuser", UserController.logoutuser);

//CategoryController
route.post("/createCategory", CategoryController.createCategory);
route.post("/viewCategory", CategoryController.viewCategory);
route.post("/displayCategory", CategoryController.categoryDisplay);
route.get("/getAllCategory", CategoryController.getAllCategory);
route.get("/getCategoryDetail", CategoryController.getCategoryDetail);

//product
route.post("/getAllProduct", ProductController.getAllProduct );
route.post("/createProduct", ProductController.createProduct );
route.post("/ProductDetail", ProductController.ProductDetail );
route.post("/getAdminProduct", ProductController.getAdminProduct);
route.post("/DeleteProduct", ProductController.DeleteProduct);

module.exports = route;
