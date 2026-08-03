import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: String,

    sku: {
      type: String,
      unique: true,
      sparse: true,
    },

    category: {
      type: String,
      required: true,
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    salePrice: Number,

    stock: {
      type: Number,
      default: 0,
    },

    tags: [String],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);