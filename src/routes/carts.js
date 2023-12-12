import { Router } from "express"
// import { cartManager, productManager } from "../index.js"


export const router = Router()

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart()
        res.status(201).json({ data: newCart, message: "Carrito creado" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get("/:cid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const cart = await cartManager.getCartById(cid)

        if (cart) {
            res.status(200).json({ data: cart })
        } else {
            res.status(404).json({ error: error.message })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        const quantity = parseInt(req.body.quantity || 1)
        
        await cartManager.addProductToCart(cid, pid, quantity)
        res.status(200).json({ message: `${quantity} de este producto agregado al carrito` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export { router as cartsRouter }