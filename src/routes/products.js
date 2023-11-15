import { Router} from "express"
import { productManager } from "../index.js"
import {io} from "../app.js"

const router = Router()

router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await productManager.getProducts()

        if (limit) {
            const productsLimit = products.slice(0, parseInt(limit))
            res.status(200).json({ data: productsLimit })
        } else {
            res.status(200).json({ data: products })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const product = await productManager.getProductById(pid)
        
        if (product) {
            res.status(200).json({ data: product })
        } else {
            res.status(404).json({ error: error.message })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post("/", async (req, res) => {
    try {
        const { title, description, price, code, stock} = req.body
        if(!title || !description || !price || !code || !stock){
            throw new Error("Error adding products: all fields are fields required")
        }

        await productManager.addProduct(productInfo)
        let productoNuevo = productManager.createProduct({id, ...req.body})

        // Emit event to notify clients about the new product
        io.emit('nuevoProduct', nombre)
        req.io.emit('nuevoProductoConMiddleware', nombre)

        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({payload:productoNuevo})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.put("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const updateFields = req.body

        await productManager.updateProduct(pid, updateFields)
        res.status(200).json({ message: `Producto con ID ${pid} actualizado` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        
        await productManager.deleteProduct(pid)
        res.status(200).json({ message: `Producto con ID ${pid} eliminado` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


export { router as productsRouter }
