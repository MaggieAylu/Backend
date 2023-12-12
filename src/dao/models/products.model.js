import mongoose from 'mongoose'

const productsCollection = 'products'
const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    status: {
      type: Boolean,
      default: true,
    },
    thumbnail: String,
    code: {
      type: String,
      unique: true,
    },
    stock: Number,
  }
)

export const ProductModel = mongoose.model(productsCollection, productSchema)
