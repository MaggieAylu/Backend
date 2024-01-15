import { cartsModel } from "../models/cart.model.js"
import { ProductMongo } from "./productMongo.js"


export class CartMongo {
  async getCarts(){ 
    try {
      return await cartsModel.find({deleted:false}).populate('products.productId') 
    } catch (error) {
      if (error) {
        console.log(error)  // There aren't any products or there was an error
        return null 
      }
    }
  }

  async getCartById(id) { // Checks if a cart exists and returns the cart
    try {
      let cart = await cartsModel.findOne({_id:id},{lean:true}).populate('products.productId') 
      if (!cart) {
        console.log('Cart with ID not found: ', id) 
      }
      return cart  // Return the found cart
    } catch (error) {
      console.log('Error getting the cart with ID: ', id) 
      throw new Error('Error getting the cart with ID: ', id) 
    }
  }

  async getProductInCart(id) { // Checks if a product ID is already present in a cart
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

  async addCart({products}) { // Creates a new cart with products and adds it to the database
    try{
      for (let element of products) { // Checks that every product in the array is valid 
        if (!element.productId || !element.quantity) {
          return false
        } else {
          if(!await  ProductMongo.checkProductById(element.productId)){ // Checks that every product exists in the list of products before it can be added to the cart
            console.log(`The product with ID ${element.productId} doesn't exist so it cannot be added to the cart`)
            return false
          }
        }
      }  
      let carts = await cartsModel.find().lean()  // Get all carts (even deleted ones) so that the ID can be set properly
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

  async addProductToCart(cartId, { productId, quantity }) { // Adds a product to a cart. If the product is already in the cart, increase its quantity
    try {
      if (!cartId || !productId || !quantity || await  ProductMongo.checkProductById(productId)) { // Check if the product ID is invalid or doesn't exist in the list of products
        console.log(' You entered invalid data, the product ID is incorrect or it does not exists in the product DB') 
        return false 
      } else {
        let cartFound = await cartsModel.findOne({_id:cartId, deleted:false}) 
        if (!cartFound) {
          console.log("Cart not found") 
          return false 
        }
        const productsIndex = cartFound.products.findIndex(product => product.productId.equals(productId)) // Finds and retrieves the index of the product we are going to update (if it exists)
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

  async deleteProductFromCart (cartId, productId) { // Deletes a single product from a cart

    try {
      let cartFound = await cartsModel.findOne({_id:cartId, deleted:false})  // Fetch the cart we are looking for
      if (!cartFound) {
        console.log("Cart not found") 
        return false 
      }
      const productsIndex = cartFound.products.findIndex(product => product.productId.equals(productId)) // Finds and retrieves the index of the product we are going to delete (if it exists)
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

  async emptyCart (cartId) { // Deletes all the products from a cart
    try {
      let cartFound = await cartsModel.findOne({_id:cartId, deleted:false})  // Fetch the cart we are looking for
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

  async updateCart (cartId, {products}) { // Updates a cart with the products sent via body
    try {
      let cartFound = await cartsModel.findOne({_id:cartId, deleted:false})  // Fetch the cart we are looking for
      if (!cartFound) {
        console.log("Cart not found") 
        return false 
      }
      for (let element of products) { // Checks that every product in the array is valid 
        if (!element.productId || !element.quantity) {
          console.log('Missing product ID or quantity') 
          return false
        } else {
          if(!await  ProductMongo.checkProductById(element.productId)){ // Checks that every product exists in the list of products before it can be added to the cart
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
      let cartFound = await cartsModel.findOne({_id:cartId, deleted:false})  // Fetch the cart we are looking for
      if (!cartFound) {
        console.log("Cart not found") 
        return false 
      }
      const productsIndex = cartFound.products.findIndex(product => product.productId.equals(productId)) // Finds and retrieves the index of the product we are going to update (if it exists)
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

  async deleteCart(cartId) { // Deletes a cart from the DB from its ID
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
//   constructor() {
//       this.model = cartsModel
//   }

//   // Get all carts
//   async getCarts() {
//       try {
//           const result = await this.model.find().populate("products.product").lean()
//           return result
//       } catch (error) {
//           console.log("getCarts: ", error.message)
//           throw new Error("Error retrieving carts")
//       }
//   }

//   // Get a cart by ID
//   async getCartById(cartId) {
//       try {
//           const result = await this.model.findById(cartId).populate("products.product").lean()

//           if (!result) {
//               throw new Error("Cart not found")
//           }

//           return result 
//       } catch (error) {
//           console.log("getCartById: ", error.message) 
//           throw new Error("Error retrieving the cart") 
//       }
//   }

//   // Create a cart
//   async createCart() {
//       try {
//           const newCart = {} 
//           const result = await this.model.create(newCart) 
//           return result 
//       } catch (error) {
//           console.log("createCart: ", error.message) 
//           throw new Error("Error creating the cart") 
//       }
//   }

//   // Add a product to a cart
//   async addProductToCart(cartId, productId) {
//       try {
//           let quantity = 1 
//           const cart = await this.getCartById(cartId) 
//           const productInCart = cart.products.find((product) => product.product._id == productId) 

//           if (productInCart) {
//               productInCart.quantity += quantity 
//           } else {
//               cart.products.push({ product: productId, quantity }) 
//           }

//           const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true }) 
//           return result 
//       } catch (error) {
//           console.log("addProductToCart: ", error.message) 
//           throw new Error("Error adding the product to the cart") 
//       }
//   }

//   // Update a cart with an array of products
//   async updateProductsInCart(cartId, newProducts) {
//       try {
//           const cart = await this.getCartById(cartId) 

//           cart.products = newProducts 

//           const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true }) 
//           return result 
//       } catch (error) {
//           console.log("updateProductsInCart: ", error.message) 
//           throw new Error("Error updating the cart's products") 
//       }
//   }

//   // Update the quantity of a product in the cart
//   async updateProductQuantityInCart(cartId, productId, newQuantity) {
//       try {
//           const cart = await this.getCartById(cartId) 
//           const productInCartIndex = cart.products.findIndex((product) => product.product._id == productId) 

//           if (productInCartIndex >= 0) {
//               cart.products[productInCartIndex].quantity = newQuantity 

//               if (newQuantity >= 1) {
//                   const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true }) 
//                   return result 
//               } else {
//                   throw new Error("Quantity must be greater than or equal to 1") 
//               }
//           } else {
//               throw new Error("Cannot update quantity because the product is not in the cart") 
//           }
//       } catch (error) {
//           console.log("updateProductQuantityInCart: ", error.message) 
//           throw new Error("Error updating the quantity of the product in the cart") 
//       }
//   }

//   // Delete all products from a cart
//   async deleteAllProductsInCart(cartId, newCart) {
//       try {
//           const cart = await this.getCartById(cartId) 

//           newCart = [] 
//           cart.products = newCart 

//           const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true }) 
//           return result 
//       } catch (error) {
//           console.log("deleteAllProductsInCart: ", error.message) 
//           throw new Error("Error deleting products from the cart") 
//       }
//   }

//   // Delete a product from the cart
//   async deleteProductInCart(cartId, productId) {
//       try {
//           const cart = await this.getCartById(cartId) 
//           const productInCart = cart.products.find((product) => product.product._id == productId) 

//           if (productInCart) {
//               const newProducts = cart.products.filter((product) => product.product._id != productId) 

//               cart.products = newProducts 

//               const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true }) 
//               return result 
//           } else {
//               throw new Error("The product to delete is not in the cart") 
//           }
//       } catch (error) {
//           console.log("deleteProductInCart: ", error.message) 
//           throw new Error("Error deleting the product from the cart") 
//       }
//   }
