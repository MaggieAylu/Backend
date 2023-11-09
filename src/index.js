import { __dirname } from "../src/utils.js"
import path from "path"
import { ProductManager } from "./ProductManagerClass.js"
import { CartManager } from "./CartClass.js"

export const productManager = new ProductManager(path.join(__dirname, "/productos.json"))
export const cartManager = new CartManager(path.join(__dirname, "/carts.json"))