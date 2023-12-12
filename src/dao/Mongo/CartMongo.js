import { cartsModelo } from "../models/cart.model.js"

export class CartMongo{
    async getCartsMongo(){
        try {
            return await cartsModelo.find({ deleted: false }).lean()
          } catch (error) {
            console.error('Error getting carts:', error.message)
            return null
          }
    }
}
  