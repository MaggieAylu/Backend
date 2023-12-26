import { Router } from 'express'
import { cartMongo } from '../index.js'

export const router=Router()

router.get("/", async (req, res) => { 
  res.setHeader("Content-Type", "application/json")
  let carts = await cartMongo.getCarts() 
  if (!carts) {
    res.status(400).json({error: 'Could not fetch carts'}) 
  } else {
    res.status(200).json({ carts }) 
  }
}) 

router.get("/:cid", async (req, res) => { 
  res.setHeader("Content-Type", "application/json") 
  let id = req.params.cid  
  let result = await  cartMongo.getCartById(id) 
  if (!result) {
    res.status(400).json({error: "The cart couldn't be found"}) 
  } else {
    res.status(200).json({ result }) 
  }
}) 

router.post("/:cid/product/:pid", async (req, res) => { 
  res.setHeader("Content-Type", "application/json")  
  let cartId  = req.params.cid 
  let productId = req.params.pid 
  let product = req.body  
  if (productId != product.productId){
    return res.status(400).json({error: "The product Id in the URL must match the productId in the req.body"}) 
  }
  if (!cartId || !productId) {
    return res.status(400).json({error: "The cart or product ID you entered is not a valid number"}) 
  }
  let result = await  cartMongo.addProductToCart(cartId, product)
  if (result){
    res.status(200).json({status:'success', message: "Product added to the cart successfully"})
  } else {
    return res.status(400).json({status: 'error', error: "The cart couldn't be updated, make sure you entered the data correctly"})
  }
})  

router.post("/", async (req,res) => { 
  let products = req.body  
  if (!products) {
    return res.status(400).json({status: 'error', error: "Incomplete data, make sure specify the products to be added to the cart"})
  } else {
    let result = await  cartMongo.addCart(products) 
    if (result) {
      res.status(200).json({status:'success', message: "Cart created successfully"})
    } else{
      return res.status(400).json({status: 'error', error: "The cart couldn't be created, make sure you entered the data correctly"})
    }
  }
}) 

router.delete("/:cid/product/:pid", async (req, res) => { 
  res.setHeader("Content-Type", "application/json")  
  let cartId  = req.params.cid 
  let productId = req.params.pid 
  if (!cartId || !productId) {
    return res.status(400).json({error: "The cart or product ID you entered is not a valid number"}) 
  }
  let result = await  cartMongo.deleteProductFromCart(cartId, productId)
  if (result){
    res.status(200).json({status:'success', message: "Product deleted from cart successfully"})
  } else {
    return res.status(400).json({status: 'error', error: "The product couldn't be deleted from the cart"})
  }
})  

router.delete("/:cid", async (req, res) => { 
  res.setHeader("Content-Type", "application/json")  
  let cartId = req.params.cid  
  if (!cartId) { 
    return res.status(400).json({error: "Please provide a valid cart ID"}) 
  }
  let result = await  cartMongo.emptyCart(cartId) 
  if (result) { 
    res.status(200).json({status: 'success', message: "Cart deleted successfully"}) 
  } else {
    res.status(400).json({error: "The cart couldn't be found or emptied"}) 
  }
})  

router.put('/:cid', async (req, res) => { 
  res.setHeader("Content-Type", "application/json")  
  let cartId = req.params.cid  
  let products = req.body 
  if (!products) {
    return res.status(400).json({status: 'error', error: "Incomplete data, make sure specify the products to be added to the cart"})
  } else {
    let result = await  cartMongo.updateCart(cartId, products) 
    if (result) {
      res.status(200).json({status:'success', message: "Cart updated successfully"})
    } else{
      return res.status(400).json({status: 'error', error: "The cart couldn't be updated, make sure you entered the data correctly"})
    }
  }
})  

router.put('/:cid/product/:pid', async (req, res) => { 
  res.setHeader("Content-Type", "application/json")  
  let cartId = req.params.cid  
  let productId = req.params.pid 
  let {quantity} = req.body  
  quantity = parseInt(quantity)  
  if (!cartId || !productId || !quantity || !Number.isInteger(quantity)) {
    return res.status(400).json({status: 'error', error: "Incomplete data, make sure specify the quantity of the product to be updated"})
  } else {
    let result = await  cartMongo.updateProductQuantityCart(cartId, productId, quantity) 
    if (result) {
      res.status(200).json({status:'success', message: "Product quantity in Cart updated successfully"})
    } else{
      return res.status(400).json({status: 'error', error: "The product quantity in Cart couldn't be updated, make sure you entered the data correctly"})
    }
  }
}) 

export {router as cartRouterMongo}