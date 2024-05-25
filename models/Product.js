const mongoose = require("mongoose");

const Productschema = new mongoose.Schema(
  {
    name: {
      type: String,
      Required: true,
    },
    description: {
      type: String,
      Required: true,
    },
    price: {
      type: Number,
      Required: true,
    },

    stock: {
      type: Number,
      Required: true,
      default: 1,
    },
    rating: {
      type: Number,
      Required: true,
      default: 0,
    },

    image: {
      public_id: {
        type: String,
        Required: true,
      },
      url: {
        type: String,
        Required: true,
      },
    },
    category: {
      type: String,
      Required: true,
    },
  },
  { timestamps: true }
);
const ProductModel = mongoose.model("product", Productschema);

module.exports = ProductModel;
