import { ProductModel } from "../models/products.model.js"


export class ProductMongo {
  async getProductsMongo() {
    try {
      return await ProductModel.find({ deleted: false }).lean()
    } catch (error) {
      console.log(error.messsage)
      return null
    }
  }

  async getProductByIdMongo(id) {
    return await ProductModel.findOne({deleted:false, _id:id}).lean()
  
  }

  async addProductMongo(
    title,
    description,
    price,
    thumbnail = [],
    code,
    stock,
    category,
    status = true
  ) {

    try {
        let producto = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            category: category,
            status: status,
          }

       let nuevoProducto = await ProductModel.create(producto)
                return nuevoProducto
    } catch (error) {
                console.log(`Unexpected error: try again later`, error.message)
                return error.mensaje
    }

   
  }

  async updateProductMongo(id, objeto) {
    return await ProductModel.updateOne({deleted:false, _id:id}, objeto)

  }

  async delProductMongo(id) {
    return await ProductModel.updateOne({deleted:false, _id:id},{$set:{deleted:true}})
  }
}