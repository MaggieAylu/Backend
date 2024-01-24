import { productMongo } from "../dao/index.js"

export class ProductsService {
    static getProductsMongo() {
        return productMongo.getProductsMongo()
    }

    static getProducts(limit=10, page=1, query={}, sort={}) {
        return productMongo.getProducts(limit=10, page=1, query={}, sort={})
    }

    static getProductsPaginate(){
        return productMongo.getProductsPaginate()
    }

    static getProductsSort(sortPrice){
        return productMongo.getProductsSort(sortPrice)
    }

    static getProductById(id) {
        return productMongo.getProductById(id)
    }
    
    static checkProductById(id){
        return productMongo.checkProductById(id)
    }

    static addProduct({ title, description, price, thumbnail, code, stock, status=true, deleted=false}) {
        return productMongo.addProduct( title, description, price, thumbnail, code, stock, status=true, deleted=false)
    }

    static updateProduct(id, object) {
        return productMongo.updateProduct(id, object)
    }

    static deleteProduct(id) {
        return productMongo.deleteProduct(id)
    }
}