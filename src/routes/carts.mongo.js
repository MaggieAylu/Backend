import { Router } from 'express'
import { cartsModel } from '../dao/models/cart.model.js'
import { CartMongo } from '../dao/Mongo/CartMongo.js'
import { ProductMongo } from '../dao/Mongo/productMongo.js'

export const router=Router()

const cartMongo = new CartMongo()
const productMongo = new ProductMongo()

// Get all carts
router.get("/", async (req, res) => {
    try {
        const carts = await cartMongo.getCarts() 
        res.status(201).json({ data: carts }) 
    } catch (error) {
        res.status(500).json({ error: error.message }) 
    }
}) 

// Get a cart by ID
router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params 
        const cart = await cartMongo.getCartById(cid) 
        res.status(201).json({ data: cart }) 
    } catch (error) {
        res.status(500).json({ error: error.message }) 
    }
}) 

// Create a cart
router.post("/", async (req, res) => {
    try {
        const createdCart = await cartMongo.createCart() 
        res.status(201).json({ data: createdCart }) 
    } catch (error) {
        res.status(500).json({ error: error.message }) 
    }
}) 

// Add a product to a cart
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params 

        // Check if cid and pid exist or throw the corresponding error
        const cart = await cartMongo.getCartById(cid) 
        const product = await productMongo.getProductByIdMongo(pid) 

        const addedProductToCart = await cartMongo.addProductToCart(cid, pid) 
        res.status(200).json({ data: addedProductToCart }) 
    } catch (error) {
        res.status(500).json({ error: error.message }) 
    }
}) 

// Update a cart with an array of products
router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params 
        const { newProducts } = req.body 

        // Check if cid exists or throw the corresponding error
        const cart = await cartMongo.getCartById(cid) 

        const updatedProductsInCart = await cartMongo.updateProductsInCart(cid, newProducts) 
        res.status(200).json({ data: updatedProductsInCart }) 
    } catch (error) {
        res.status(500).json({ error: error.message }) 
    }
}) 

// Update the quantity of a product in the cart
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params 
        const { newQuantity } = req.body 

        // Check if cid and pid exist or throw the corresponding error
        const cart = await cartMongo.getCartById(cid) 
        const product = await productMongo.getProductByIdMongo(pid) 

        const updatedQuantityProductInCart = await cartMongo.updateProductQuantityInCart(cid, pid, newQuantity) 
        res.status(200).json({ data: updatedQuantityProductInCart }) 
    } catch (error) {
        res.status(500).json({ error: error.message }) 
    }
}) 

// Delete all products from a cart
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params 
        const { newCart } = req.body 

        // Check if cid exists or throw the corresponding error
        const cart = await cartMongo.getCartById(cid) 

        const emptyNewCart = await cartMongo.deleteAllProductsInCart(cid, newCart) 
        res.status(200).json({ data: emptyNewCart }) 
    } catch (error) {
        res.status(500).json({ error: error.message }) 
    }
}) 

// Delete a product from the cart
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params 

        // Check if cid and pid exist or throw the corresponding error
        const cart = await cartMongo.getCartById(cid) 
        const product = await productMongo.getProductByIdMongo(pid) 

        const newCart = await cartMongo.deleteProductInCart(cid, pid) 
        res.status(200).json({ data: newCart }) 
    } catch (error) {
        res.status(500).json({ error: error.message }) 
    }
}) 

export {router as cartRouterMongo}