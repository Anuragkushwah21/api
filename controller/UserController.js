const UserModel = require("../models/user");
const cloudinary = require("cloudinary").v2;
const bcrypt=require("bcrypt")

cloudinary.config({
  cloud_name: "dfoy70dri",
  api_key: "529319773434976",
  api_secret: "gnqQy8vKL-UAidGzN4WAp_5OZ2I",
});

class UserController {
  static getalluser = async (req, res) => {
    try {
      res.send("hello user");
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
        const { name, email, password, confirmpassword } = req.body
        const user = await UserModel.findOne({ email: email });
        // console.log(user)

        if (user) {
          res.status(401).json({ status: "failed", message: "EMAIL ALREADY EXISTS" })
        } else {
            if (name && email && password && confirmpassword) {
                if (password == confirmpassword) {
                    const hashpassword = await bcrypt.hash(password, 10)
                    const result = new UserModel({
                        name: name,
                        email: email,
                        password: hashpassword,
                        confirmpassword: confirmpassword,
                        image: {
                          public_id: uploadImage.public_id,
                          url: uploadImage.secure_url,
                        },

                    })
                    await result.save()
                  res  .status(201).json({ status: "success", message: "Registaration successfull plz login" })
                } else {
                  res.status(401).json({ status: "failed", message: "password and confirmpassword dosenot same" })
                }
            } else {
              res.status(401).json({ status: "failed", message: "All fields are required" })
            }
        }



    } catch (error) {
        console.log(error)
    }

}

}


module.exports = UserController;
