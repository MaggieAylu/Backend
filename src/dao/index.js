import { ProductMongo } from "./Mongo/productMongo.js"
import { CartMongo } from "./Mongo/CartMongo.js"
import { SessionManagerDB } from "./Mongo/sessionMongo.js"


export const productMongo = new ProductMongo()
export const cartMongo = new CartMongo()
export const sessionManager = new SessionManagerDB()
