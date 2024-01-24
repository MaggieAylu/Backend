import { cartsModel } from "../models/cart.model.js"
import { ProductMongo } from "./productMongo.js"


export class CartMongo {
  async getCarts(){ 
    try {
      return await cartsModel.find({deleted:false}).populate('products.productId') 
    } catch (error) {
      if (error) {
        console.log(error)  
        return null 
      }
    }
  }

  async getCartById(id) {
    try {
      let cart = await cartsModel.findOne({_id:id},{lean:true}).populate('products.productId') 
      if (!cart) {
        console.log('Cart with ID not found: ', id) 
      }
      return cart  
    } catch (error) {
      console.log('Error getting the cart with ID: ', id) 
      throw new Error('Error getting the cart with ID: ', id) 
    }
  }

  async getProductInCart(id) { 
    try {
      if (!await  ProductMongo.checkProductById(productId)){
        return false
      }
      let productFound = await cartsModel.find({productid:id})
      if (productFound) {
        console.log("Product found in cart:", productFound) 
        return true
      } else{
        console.log("Product not found")
        return false
      }
    } catch (error) {
      console.log(error.message) 
      throw new Error("Error checking for products in the cart") 
    }
  }

  async addCart({products}) { 
    try{
      for (let element of products) { 
        if (!element.productId || !element.quantity) {
          return false
        } else {
          if(!await  ProductMongo.checkProductById(element.productId)){ 
            console.log(`The product with ID ${element.productId} doesn't exist so it cannot be added to the cart`)
            return false
          }
        }
      }  
      let carts = await cartsModel.find().lean() 
      console.log('Current carts in the DB: ', carts)
      let cartId = 1 
      if (carts.length > 0) {
        cartId = carts[carts.length - 1].cartId + 1 
      }
      let newCart = {
        cartId,
        products
      }
      console.log('New cart en addCart: ', newCart) 
      let result = await cartsModel.create(newCart) 
      console.log('Result of addCart', result) 
      if (result) {
        console.log('Cart created successfully') 
        return true
      } else {
        console.log('Error saving the cart to the DB') 
        return false
      }
    } catch (error){
      console.log(error.message)
      console.log("Error creating the cart") 
      throw new Error("Error creating the cart") 
    }
  }

  async addProductToCart(cartId, { productId, quantity }) { 
    try {
      if (!cartId || !productId || !quantity || await  ProductMongo.checkProductById(productId)) { 
        console.log(' You entered invalid data, the product ID is incorrect or it does not exists in the product DB') 
        return false 
      } else {
        let cartFound = await cartsModel.findOne({_id:cartId, deleted:false}) 
        if (!cartFound) {
          console.log("Cart not found") 
          return false 
        }
        const productsIndex = cartFound.products.findIndex(product => product.productId.equals(productId)) 
        if (productsIndex === -1){
          console.log('The product does not exists in the cart, so it will be added') 
          const newProduct = {productId: productId, quantity: quantity} 
          let result = await cartsModel.findByIdAndUpdate(
            cartId,
            {$push: {products: newProduct}},
            {new:true}
          ) 
          console.log(result) 
        } else {
          console.log('The product is in the cart, so its quantity will be updated') 
          let newQuantity = quantity + cartFound.products[productsIndex].quantity
          let update = { $set: { [`products.${productsIndex}.quantity`]: newQuantity } } 
          let result = await cartsModel.findByIdAndUpdate(
            cartId,
            update,
            {new:true}
          )
          console.log(result) 
        }
        return true 
      }
    } catch (error) {
      console.log(error.message) 
      throw new Error("Error updating the cart") 
    }
  }

  async deleteProductFromCart (cartId, productId) { 

    try {
      let cartFound = await cartsModel.findOne({_id:cartId, deleted:false})  
      if (!cartFound) {
        console.log("Cart not found") 
        return false 
      }
      const productsIndex = cartFound.products.findIndex(product => product.productId.equals(productId)) 
      if (productsIndex === -1){
        console.log('The product does not exists in the cart you specified')
        return false
      } else {
        let deleteResult = await cartsModel.updateOne(
            {_id: cartId},
            {$pull: {products: {productId: productId}}}
          ) 
        return deleteResult
      }
    } catch (error) {
      console.log(error.message) 
      throw new Error("Error deleting the product") 
    }

  }

  async emptyCart (cartId) { 
    try {
      let cartFound = await cartsModel.findOne({_id:cartId, deleted:false})  
      if (!cartFound) {
        console.log("Cart not found") 
        return false 
      }
      let emptyCart = await cartsModel.updateOne(
        {_id: cartId},
        { $set: { products: [] } }
      ) 
      return emptyCart
    } catch (error) {
      console.log(error.message) 
      throw new Error("Error emptying the cart") 
    }
  }

  async updateCart (cartId, {products}) { 
    try {
      let cartFound = await cartsModel.findOne({_id:cartId, deleted:false})  
      if (!cartFound) {
        console.log("Cart not found") 
        return false 
      }
      for (let element of products) { 
        if (!element.productId || !element.quantity) {
          console.log('Missing product ID or quantity') 
          return false
        } else {
          if(!await  ProductMongo.checkProductById(element.productId)){ 
            console.log(`The product with ID ${element.productId} doesn't exist so it cannot be added to the cart`)
            return false
          }
          let updatedCart = await cartsModel.updateOne(
            {_id: cartId},
            { $set: { products: products } }
          ) 
          return updatedCart
        }
      }  
    } catch (error) {
      console.log(error.message) 
      throw new Error("Error updating the cart") 
    }
  }

  async updateProductQuantityCart (cartId, productId, quantity) {
    try {
      let cartFound = await cartsModel.findOne({_id:cartId, deleted:false}) 
      if (!cartFound) {
        console.log("Cart not found") 
        return false 
      }
      const productsIndex = cartFound.products.findIndex(product => product.productId.equals(productId)) 
        if (productsIndex === -1){
          console.log('The product does not exists in the cart, so it cannot be updated') 
          return false 
        } else {
          let update = { $set: { [`products.${productsIndex}.quantity`]: quantity } } 
          let result = await cartsModel.findByIdAndUpdate(
            cartId,
            update,
            {new:true}
          )
          console.log(result) 
          return result 
        }      
    } catch (error) {
      console.log(error.message) 
      throw new Error("Error updating the quantity of the product in cart") 
    }
  }

  async deleteCart(cartId) { 
    try {
      let result = await cartsModel.deleteOne({_id:cartId}) 
      console.log(result) 
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}

