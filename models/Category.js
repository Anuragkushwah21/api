const mongoose = require("mongoose");

const Categoryschema = new mongoose.Schema(
    {
        name: {
            type: String,
            Required: true,
        },   
        image:{
            public_id:{
                type:String,
                Required:true,
            },
            url:{
                type:String,
                Required:true,
            },
        },
    },
    { timestamps: true }
);
const CategoryModel = mongoose.model("categories",Categoryschema);

module.exports = CategoryModel;
