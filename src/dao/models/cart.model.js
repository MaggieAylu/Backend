import mongoose from "mongoose"

const cartsCollection = 'carts'

const cartSchema = new mongoose.Schema(
    {
        products: Array,
        deleted: {
            type: Boolean,
            default: false,
        },   
    },
    {
        timestamps:true,
        stric: true 
    }
)

export const cartsModel = mongoose.model(cartsCollection, cartSchema)