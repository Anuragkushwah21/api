const CategoryModel = require("../models/Category");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dfoy70dri",
  api_key: "529319773434976",
  api_secret: "gnqQy8vKL-UAidGzN4WAp_5OZ2I",
});

class CategoryController {
  static createCategory = async (req, res) => {
    try {
      //   console.log(req.files)

      const file = req.files.image;
      const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userImage",
      });

      const { name } = req.body;
      const data = new CategoryModel({
        name: name,
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });
      await data.save();
      res.status(201).json({
        status: "success",
        message: "Category added Succesfully",
      });
    } catch (error) {
      res.send(error);
    }
  };
  static getAllCategory = async (req, res) => {
    try {
      //   console.log(req.files)
      const allCategories = await CategoryModel.find();
      res.status(201).json({
        status: true,
        allCategories,
      });
    } catch (error) {
      res.send(error);
    }
  };
  static getCategoryDetail = async (req, res) => {
    try {
      //   console.log(req.files)
      const CategoryDetail = await CategoryModel.find(req.params.id);
      res.status(201).json({
        status: true,
        CategoryDetail,
      });
    } catch (error) {
      res.send(error);
    }
  };
  static viewCategory =async(req,res)=>{
    try {
      const categories =await CategoryModel.find()
      res.status(200).json(categories)
    } catch (error) {
      res.status(500).json({message:error.message})
      
    }

  }
}

module.exports = CategoryController;
