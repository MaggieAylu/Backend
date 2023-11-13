import express from "express"
import { fileURLToPath } from 'url'
import path from "path"
import { productsRouter } from "../src/routes/products.js"
import { cartsRouter } from "../src/routes/carts.js"


const port = 8080
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.listen(port, () => {
    console.log("Servidor funcionando")
})

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

