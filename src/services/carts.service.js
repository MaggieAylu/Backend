import { cartMongo } from "../dao/index.js"

export class CartsService {
    static getCarts() {
        return cartMongo.getCarts()
    }

    static getCartById(cartId) {
        return cartMongo.getCartById(cartId)
    }

    static addCart() {
        return cartMongo.addCart()
    }

    static addProductToCart(cartId, productId) {
        return cartMongo.addProductToCart(cartId, productId)
    }

    static updateCart(cartId, newProducts) {
        return cartMongo.updateCart(cartId, newProducts)
    }

    static updateProductQuantityCart(cartId, productId, newQuantity) {
        return cartMongo.updateProductQuantityCart(cartId, productId, newQuantity)
    }

    static emptyCart(cartId, newCart) {
        return cartMongo.emptyCart(cartId, newCart)
    }

    static deleteProductFromCart(cartId, productId) {
        return cartMongo.deleteProductFromCart(cartId, productId)
    }
}