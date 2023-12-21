import {Router} from 'express'
import { productMongo } from "../index.js"

export const router=Router()

router.get('/', async (req,res)=>{
    let productos = await productMongo.getProducts()
    res.status(200).render('home', {
        productos: productos
    })
})

router.get('/products', async (req,res) => {

    try {
      let {limit=10, page=1, sort, query} = req.query 
      console.log(`Queries received in view router LIMIT: ${limit}, PAGE: ${page}, QUERY: ${query}, SORT: ${sort}`) 
      let products = await productMongo.getProducts( limit, page, query, sort)  
      let {totalPages, hasNextPage, hasPrevPage, prevPage, nextPage} = products
      console.log('Pagination values from DB: ', totalPages, hasNextPage, hasPrevPage, prevPage, nextPage)  
      res.status(200).render('products' , {
        data: products.docs,
        totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, limit, page, sort, query
      })
  
    } catch (error) {
          res.setHeader('Content-Type','application/json') 
          console.log(error.message)
          return res.status(400).json({error:`error`}) 
    }
})

router.get('/realtimeproducts', async (req,res)=>{

    let productos= await productMongo.getProducts()

    res.status(200).render('realTimeProducts',{
        productos: productos 
    })
})

router.get('/chat',(req,res)=>{


    res.status(200).render('chat')
})


const auth=(req, res, next)=>{
    if(!req.session.usuario){
        res.redirect('/login')
    }

    next()
}

router.get('/',(req,res)=>{

    res.setHeader('Content-Type','text/html')
    res.status(200).render('home')
})

router.get('/signup',(req,res)=>{

    let {error}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('signup', {error})
})

router.get('/login',(req,res)=>{

    let {error, mensaje}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('login', {error, mensaje})
})

router.get('/profile', auth, (req,res)=>{

    let usuario=req.session.usuario

    res.setHeader('Content-Type','text/html')
    res.status(200).render('profile', {usuario})
})


export { router as viewsRouter }