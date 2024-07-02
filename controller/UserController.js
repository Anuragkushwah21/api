const UserModel = require("../models/user");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

cloudinary.config({
  cloud_name: "dfoy70dri",
  api_key: "529319773434976",
  api_secret: "gnqQy8vKL-UAidGzN4WAp_5OZ2I",
});

class UserController {
  static getuser = async (req, res) => {
    try {
      res.send("hello");
    } catch (error) {
      console.log(error);
    }
  };
  static getDisplay = async (req, res) => {
    try {
      const data = await UserModel.find();
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
    }
  };
  static getSingleuser = async (req, res) => {
    try {
      const data = await UserModel.findById(req.params.id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static getUserDetail = async (req, res) => {
    try {
      const data = await UserModel.findById(req.params.id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static userinsert = async (req, res) => {
    try {
      // console.log(req.body)
      const file = req.files.image;
      //image upload
      const uploadImage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "profileapiimage",
      });
      const { name, email, password, confirmpassword } = req.body;
      const user = await UserModel.findOne({ email: email });
      // console.log(user)

      if (user) {
        res
          .status(401)
          .json({ status: "failed", message: "EMAIL ALREADY EXISTS" });
      } else {
        if (name && email && password && confirmpassword) {
          if (password == confirmpassword) {
            const hashpassword = await bcrypt.hash(password, 10);
            const result = new UserModel({
              name: name,
              email: email,
              password: hashpassword,
              confirmpassword: confirmpassword,
              image: {
                public_id: uploadImage.public_id,
                url: uploadImage.secure_url,
              },
            });
            await result.save();
            res.status(201).json({
              status: "success",
              message: "Registaration successfull plz login",
            });
          } else {
            res.status(401).json({
              status: "failed",
              message: "password and confirmpassword dosenot same",
            });
          }
        } else {
          res
            .status(401)
            .json({ status: "failed", message: "All fields are required" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  static verifylogin = async (req, res) => {
    try {
      // console.log(req.body)
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });

        if (user != null) {
          const isMatched = await bcrypt.compare(password, user.password);
          if (isMatched) {
            // token gen.
            const token = jwt.sign(
              { ID: user._id },
              "anuragkushwah9669907552asdfghjkzxcvbnm"
            );
            // console.log(token);
            res.cookie("token", token);

            res.status(201).json({
              status: "success",
              message: "Login OK Report",
              token: token,
              user,
            });
          } else {
            res.status(401).json({
              status: "failed",
              message: "Email pr password are not same",
            });
          }
        } else {
          res
            .status(401)
            .json({ status: "failed", message: "you are not a regis user" });
        }
      } else {
        res
          .status(401)
          .json({ status: "failed", message: "All field require" });
      }
    } catch (error) {
      console.log("error");
    }
  };
  static logoutuser = async (req, res) => {
    try {
      res.clearCookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(200).json({
        success: true,
        message: "Logged Out",
      });
    } catch (error) {
      console.log(error);
    }
  };
  static updatepassword = async (req, res) => {
    try {
      // console.log(req.userdata)
      const { oldpassword, newpassword, confirmpassword } = req.body;
      const { id } = req.Userdata;
      if (oldpassword && newpassword && confirmpassword) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(oldpassword, user.password);
        // console.log(isMatched)
        if (!isMatched) {
          res
            .status(401)
            .json({
              status: "failed",
              message: "current password is incorrect",
            });
        } else {
          if (newpassword != confirmpassword) {
            res
              .status(401)
              .json({ status: "failed", message: "password does not match" });
          } else {
            const newHashPassword = await bcrypt.hash(newpassword, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            res
              .status(201)
              .json({
                status: "success",
                message: "password updated successfully",
              });
          }
        }
      } else {
        res
          .status(401)
          .json({ status: "failed", message: "all fields are required" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.Userdata;
      const { name, email, image } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;

        // delete image from cloudnary
        await cloudinary.uploader.destroy(imageID);
        // new image
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "profileapiimage",
          }
        );

        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }

      const updateuserProfile = await UserModel.findByIdAndUpdate(id, data);
      res.status(200).json({
        succes: true,
        updateuserProfile,
      });
    } catch (error) {}
  };
}

module.exports = UserController;
