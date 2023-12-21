import { ProductMongo } from "./dao/Mongo/productMongo.js"
import { CartMongo } from "./dao/Mongo/CartMongo.js"
import { SessionManagerDB } from "./dao/Mongo/sessionMongo.js"


export const productMongo = new ProductMongo()
export const cartMongo = new CartMongo()
export const sessionManager = new SessionManagerDB()
