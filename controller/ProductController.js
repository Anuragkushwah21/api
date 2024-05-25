const ProductModel = require("../models/Product");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dfoy70dri",
  api_key: "529319773434976",
  api_secret: "gnqQy8vKL-UAidGzN4WAp_5OZ2I",
});

class ProductController {
  static getAllProduct = async (req, res) => {
    try {
      const getAllProduct = await ProductModel.find();

      res.status(200).json({
        status: true,
        getAllProduct,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static createProduct = async (req, res) => {
    try {
      // console.log(req.body)
      // console.log(req.body)
      const file = req.files.image;
      const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userImage",
      });

      const { name, description, price, stock, rating, category } = req.body;
      const data = new ProductModel({
        name: name,
        description: description,
        price: price,
        stock: stock,
        rating: rating,
        category: category,
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });
      await data.save();

      res.status(201).json({
        status: "success",
        message: "Product added successfully 🐧🐧 ",
      });
    } catch (error) {
      console.log(error);
    }
  };

  static ProductDetail = async (req, res) => {
    try {
      const ProductDetail = await ProductModel.findById(req.params.id);

      res.status(201).json({
        status: true,
        ProductDetail,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static getAdminProduct = async (req, res) => {
    try {
      const AdminProduct = await ProductModel.find();

      res.status(201).json({
        status: true,
        AdminProduct,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static DeleteProduct = async (req, res) => {
    try {
      const AdminProduct = await ProductModel.findByIdAndDelete(req.params.id);

      res.status(201).json({
        status: "success",
        message: "Product delete successfully 🐧🐧 ",AdminProduct
      });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = ProductController;
