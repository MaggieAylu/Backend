import { Router } from "express" 
import { productMongo } from "../index.js" 
import { io } from '../app.js'

const router = Router() 


router.get("/", async (req, res) => { 
    res.setHeader("Content-Type", "application/json")  
    let {limit=10, page=1, category, sort={}} = req.query 
    let sortOption = {}  
    let query = {} 
    if(category) {
      query.description = { $regex: category, $options: 'i' }  
    }
    if (sort === "asc") {
      sortOption = {price: 1} 
    } else if (sort === "desc") {
      sortOption = {price: -1} 
    } else {
      console.log('Only can be asc or desc')
    }
    console.log(`Queries received in products router LIMIT: ${limit}, PAGE: ${page}, QUERY: ${category}, SORT: ${sort}`)
    limit = parseInt(limit)  
    page = parseInt(page)
    let products = await productMongo.getProducts(limit, page, query, sortOption) 
    let {totalPages, hasNextPage, hasPrevPage, prevPage, nextPage} = products 
    let prevLink = '', nextLink = '' 
    if (hasPrevPage) {
      prevLink = `localhost:8080/api/products?limit=${limit}&page=${prevPage}`
    } else { prevLink = null}
    if (hasNextPage) {
      nextLink = `localhost:8080/api/products?limit=${limit}&page=${nextPage}`
    } else { nextLink = null}
    if (!products) {
      res.status(400).json({ error: 'The products could not be fetched from the DB'}) 
    } else {
      res.status(200).json( 
        {
          status:'sucess',
          payload: products.docs,
          totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, prevLink, nextLink
        }
       ) 
    }
  }) 
  
  router.get("/:id", async (req, res) => { 
    res.setHeader("Content-Type", "application/json")  
    let id = req.params.id  
    if (!id) {
      return res.status(400).json({error: "The ID you entered is not a valid number"}) 
    }
    let result = await productMongo.getProductById(id) 
    if (!result) {
      res.status(400).json({error: "The product couldn't be found"}) 
    } else {
      res.status(200).json({ result }) 
    }
  }) 
  
  router.delete("/:id", async (req, res) => { 
    res.setHeader("Content-Type", "application/json") 
    let id = req.params.id  
    if (!id) {
      return res.status(404).json({error: "The ID you entered is not a valid number"}) 
    }
    let result = await productMongo.deleteProduct(id) 
    let updatedProducts = await productMongo.getProducts() 
    io.emit('newProduct', updatedProducts.docs) 
    if (!result) {
      res.status(400).json({error: "The product couldn't be found"}) 
    } else {
      res.status(200).json({status:'success', message:'Product removed successfully'})
    }
  }) 
  
  router.put("/:id", async (req, res) => { 
    res.setHeader("Content-Type", "application/json") 
    let product = req.body 
    let id = req.params.id  
    if (!id) {
      return res.status(400).json({error: "The ID you entered is not a valid number"}) 
    }
    let result = await productMongo.updateProduct(id, product)  
    let updatedProducts = await productMongo.getProducts() 
    io.emit('newProduct', updatedProducts.docs) 
    if (!result) {
      res.status(404).json({error: "The product couldn't be found"}) 
    } else {
      res.status(200).json({status:'success', message:'Product updated successfully'})
    }
  }) 
  
  router.post('/', async (req, res)=> {
    res.setHeader("Content-Type", "application/json") 
    let product = req.body 
    console.log(product)
    if (!product.title || !product.description || !product.price || !product.code || !product.stock) {
      return res.status(400).json({status: 'error', error: 'Incomplete data, make sure to enter all required fields'})
    } 
    try {
      await productMongo.addProduct(product) 
      let updatedProducts = await productMongo.getProducts() 
      io.emit('newProduct', updatedProducts.docs) 
      res.status(200).json({ status: 'success', message:'Product added successfully' }) 
    } catch (error) {
      res.status(400).json({status:'error', message: error.message}) 
    }
  })

export {router as ProductRouterMongo}