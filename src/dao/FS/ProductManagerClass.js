import fs from "fs"

export class ProductManager{
    constructor(filePath){
        this.filePath = filePath
    }
    fileExist(){
        return fs.existsSync(this.filePath)
    }
    async addProducts(title, description, price, status, thumbnail, code, stock){
       try {
       let products = await this.getProducts()
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
       
        // else if(
        //     !title || typeof title !== "string" ||
        //     !description || (!Array.isArray(description) || !description.every(item => typeof item === "string")) ||
        //     !price || price < 0 || typeof price !== "number" ||
        //     (status && typeof status !== "boolean") ||
        //     (thumbnail && (!Array.isArray(thumbnail) || !thumbnail.every(item => typeof item === "string"))) ||
        //     !stock || stock < 0 || typeof stock !== "number"
        // ){
        //     throw new Error("Error adding products: all fields are fields required")
        // }

        if(!status){
            status = true 
        }

        let existe = products.find(p=>p.code===code)
        if(existe){
            console.log(`The product with code ${code} already exists in DB`)
            return
        }

        products.push(nuevoProducto)

        await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 5))
    }catch(error){
        throw error
    }
    }
    async getProducts() {
        try {
            if (this.fileExist()) {
                const content = await fs.promises.readFile(this.filePath, "utf-8")
                const products = JSON.parse(content)
                return products
            } else {
                return []
            }
        } catch (error) {
            console.error(' al obtener los productos del archivo', error)
            throw new Error('Error reading products')
        }
    }
    
    async deleteProduct(id) {
        try {
            if (this.fileExist()) {
                let products = await this.getProducts() // Obtener los productos de manera asincrónica
                let index = products.findIndex(p => p.id === id)
                if (index === -1) {
                    console.log(`${id} Not found`)
                    return
                }
                products.splice(index, 1)
    
                await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 5))
            } else {
                throw new Error('DB is empty')
            }
        } catch (error) {
            throw error
        }
    }
    
    async getProductById(id) {
        try {
            let products = await this.getProducts()
            let index = products.findIndex(p => p.id === id)
            if (index === -1) {
                throw new Error(`Error founding ID ${id}`)
            }
            return products[index]
        } catch (error) {
            throw error
        }
    }
    
    async updateProduct(id, title, description, price, thumbnail, code, stock){
        try{
            let products = await this.getProducts()
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
    
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 5))
        } catch(error){
            throw error 
        }
    }
}

