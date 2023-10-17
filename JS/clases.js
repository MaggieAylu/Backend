class ProductManager{
    constructor(){
        this.products = [];
    }
    addProducts(title, description, price, thumbnail, stock){
       let code = 1
       if(this.products.length>0){
        code = this.products[this.products.length-1].code + 1
       }
       
        let nuevoProducto ={
            code,
            title,
            description,
            price,
            thumbnail,
            stock
        }

        this.products.push(nuevoProducto)
    }
    getProducts(){
        return this.products;
    }
    getProductById(id){
        let indice = this.products.findIndex(producto=>producto.id===id)
        if(indice===-1){
            return console.log('Not found')
        }
        return this.products[indice]
    }
}

let pm = new ProductManager()
pm.addProducts('remera', 'remera de manga corta color azul', 2000, 'imagenes\remera.webp', 30 )
pm.addProducts('short', 'short de jean', 5000, 'imagenes\short.jpeg', 15)
console.log(pm.getProducts())

console.log(pm.getProductById(2))
