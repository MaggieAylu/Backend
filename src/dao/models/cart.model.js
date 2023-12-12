import mongoose from "mongoose"

const cartsCollection = 'carts'

const cartsEsquema = new mongoose.Schema(
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

export const cartsModelo = mongoose.model(cartsCollection, cartsEsquema)