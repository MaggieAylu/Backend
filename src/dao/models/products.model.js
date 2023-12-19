import mongoose from 'mongoose'
import paginate  from "mongoose-paginate-v2"

const productsCollection = 'products'
const productSchema = new mongoose.Schema(
  {
    id:{
      type: Number, required: true, unique: true
    },
    title: {
      type: String, required: true
    },
    description: {
      type: String, required: true
    },
    price: {
      type: Number, required: true
    },
    thumbnail: {
      type: Array, required: true
    },
    code: {
      type: Number, required: true, unique: true
    },
    stock: {
      type: Number, required: true
    },
    status: {
      type: Boolean, default: true
    },
    deleted: {
      type: Boolean, default: false
    }
  },
  {
    timestamps: true
  }
)

productSchema.plugin(paginate)
export const ProductModel = mongoose.model(productsCollection, productSchema)
