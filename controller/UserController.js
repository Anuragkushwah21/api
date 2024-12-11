const UserModel = require("../models/user");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

cloudinary.config({
  cloud_name: "dfoy70dri",
  api_key: "529319773434976",
  api_secret: "gnqQy8vKL-UAidGzN4WAp_5OZ2I",
});

class UserController {
  static getAllDisplay = async (req, res) => {
    try {
      const data = await UserModel.find(); // Sort by createdAt in descending order (-1)
      res.status(200).json({
        data,
      });
    } catch (error) {
      // console.log(error)
      res.status(400).json({ status: "failed", message: error.message });
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
      const { id } = req.Userdata;
      const data = await UserModel.findById(id);
      return res
        .status(200)
        .json({ status: "success", message: "user details found", data });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: "failed", message: "Internal server error." });
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
          res.status(401).json({
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
            res.status(201).json({
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
  static sendResetPasswordMail = async (name, email, token) => {
    try {
      let transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: "anuragkofficial21@gmail.com",
          pass: "bjlgmcajfhsvpwwz",
        },
      });
      let mailOptions = {
        from: "test@gmail.com", // sender address
        to: email, // list of receivers
        subject: "For Reset Password", // Subject line
        text: "hello", // plain text body
        html:
          "<p>Hii " +
          name +
          ',Please click here to <a href="http://localhost:3300/reset-password?token=' +
          token +
          '">Reset</a>Your Password.',
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Mail Has been sent:- ", info.response);
        }
      });
    } catch (error) {
      {
        res
          .status(200)
          .send({ success: true, message: "This email does't exits." });
      }
    }
  };
  static ForgotPassword = async (req, res) => {
    try {
      const email = req.body.email;
      const userData = await UserModel.findOne({ email: email });
      if (userData) {
        const randomString = randomstring.generate();
        const data = await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendResetPasswordMail(userData.name, userData.email, randomString);
        res.status(200).send({
          success: true,
          message: "Please Check Your Inbox of Mail and Reset Your Password.",
        });
      } else {
        res
          .status(200)
          .send({ success: true, message: "This email does't exits." });
      }
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  };
  static ResetPassword = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        const password = req.body.password;
        const hashPassword = await bcrypt.hash(password,10);
        const userData = await UserModel.findByIdAndUpdate(
          { _id: tokenData._id },
          { $set: { password: hashPassword, token: "" } },
          { new: true }
        );
        res
          .status(200)
          .send({
            success: true,
            message: "User Password Has been Updated Successfully",
            data: userData,
          });
      } else {
        res
          .status(400)
          .send({ success: true, message: "This Link Has been Expired" });
      }
    } catch (error) {
      res.status(400).send({ success: true, message: error.message });
    }
  };
}

module.exports = UserController;
