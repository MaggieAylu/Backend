import { __dirname } from "./utils.js"
import path from "path"
import { ProductMongo } from "./dao/Mongo/productMongo.js"
import { CartMongo } from "./dao/Mongo/CartMongo.js"


export const productMongo = new ProductMongo()
export const cartMongo = new CartMongo()

