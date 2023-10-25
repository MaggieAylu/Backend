const fs = require('fs')

class ProductManager{
    constructor(rutaArchivo){
        this.path = rutaArchivo
    }
    addProducts(title, description, price, thumbnail, code, stock){
        let products = this.getProducts()
       let id= 1
       if(products.length>0){
        id = products[products.length-1].id + 1
       }
       
        let nuevoProducto ={
            id,
            title,
            description,
            price,
            thumbnail,
            stock
        }

        let existe = products.find(p=>p.code===code)
        if(existe){
            console.log(`The product with code ${code} already exists in DB`)
            return
        }

        products.push(nuevoProducto)

        fs.writeFileSync(this.path, JSON.stringify(products, null, 5))
    }
    getProducts(){
        if (fs.existsSync(this.path)){
            return JSON.parse(fs.readFileSync(this.path, "utf-8"))
        }else{
            return[]
        }
    }
    getProductById(id){
        let products = this.getProducts()
        let index = products.findIndex(p=>p.id===id)
        if(index===-1){
            console.log(`${id} Not found`)
            return
        }
        return products[index]
    }
    updateProduct(id, title, description, price, thumbnail, code, stock){
        let products = this.getProducts()
        let index = products.findIndex(p=>p.id===id)
        if(index===-1){
            console.log(`The product with the id ${id} does not exist in DB`)
        return
        }

        products[index]={
            ...products[index],
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }

        fs.writeFileSync(this.path, JSON.stringify(products, null, 5))
    }
    deleteProduct(id){
        let products = this.getProducts()
        let index = products.findIndex(p=>p.id===id)
        if(index===-1){
            console.log(`${id} Not found`)
            return
        }
        products.splice(index, 1)

        fs.writeFileSync(this.path, JSON.stringify(products, null, 5))
    }
}


const pm =new ProductManager("./productos.json")
console.log(pm.getProducts())
pm.addProducts('remera', 'remera de manga corta color azul', 2000, 'imagenes\remera.webp', 30)
pm.addProducts('short', 'short de jean', 5000, 'imagenes\short.jpeg', 15)
pm.addProducts('vestido', 'vestido lunares', 4000, 'imagenes\vestido de lunares.webp', 30)

console.log(pm.getProducts())
pm.deleteProduct(2)
console.log(pm.getProducts())
pm.updateProduct(4,{title:'pollera', description: 'pollera de jean', price:12000, thumbnail:'imagen/pollera', code:4, stock:5})
console.log(pm.updateProduct()) 
