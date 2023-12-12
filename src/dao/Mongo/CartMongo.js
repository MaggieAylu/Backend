import { cartsModel } from "../models/cart.model.js"

export class CartMongo{
  async getCartsMongo(){
    try {
      return await cartsModel.find({ deleted: false }).lean()
    } catch (error) {
      console.error('Error getting carts:', error.message)
      return null
    }
  }
  
  async getCartsByIdMongo(id){
    return await cartsModel.findOne({deleted:false, _id:id}).lean()
  }

  async addCartsMongo(
    title,
    description,
    price,
    thumbnail = [],
    code,
    stock,
    category,
  ){
    try {
      let products = {
          title: title,
          description: description,
          price: price,
          thumbnail: thumbnail,
          code: code,
          stock: stock,
          category: category,
        }

     let newCart = await cartsModel.create(products)
              return newCart
    } catch (error) {
              console.log(`Unexpected error: try again later`, error.message)
              return error.mensaje
    }
  }

  async updateCartMongo(id, objeto){
    return await cartsModel.updateOne({deleted:false, _id:id}, objeto)
  }

  async delCartMongo(id){
    return await cartsModel.updateOne({deleted:false, _id:id},{$set:{deleted:true}})
  }
}
  