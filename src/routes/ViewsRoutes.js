import {Router} from 'express'
import { productMongo } from "../index.js"
import { sessionManager } from '../index.js'
import { usuariosModelo } from '../dao/models/users.models.js'

export const router=Router()


const auth=(req, res, next)=>{
    if(!req.session.usuario){
        res.redirect('/login')
    }

    next()
}


router.get('/', auth, async (req,res)=>{
    try{
        let productos = await productMongo.getProductsMongo()
        res.status(200).render('home', {
            productos
        })
    }catch(error){
        res.setHeader('Content-Type','application/json') 
        console.log(error.message)
        return res.status(400).json({error:error})
    }
})


router.get('/products', async (req,res) => {
    try {
      let usuario=req.session.usuario
      let {limit=10, page=1, sort, query} = req.query 
      console.log(`Queries received in view router LIMIT: ${limit}, PAGE: ${page}, QUERY: ${query}, SORT: ${sort}`) 
      let products = await productMongo.getProducts( limit, page, query, sort)  
      let {totalPages, hasNextPage, hasPrevPage, prevPage, nextPage} = products
      console.log('Pagination values from DB: ', totalPages, hasNextPage, hasPrevPage, prevPage, nextPage)  
      res.status(200).render('products' , {
        usuario,
        data: products.docs,
        totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, limit, page, sort, query
      })
  
    } catch (error) {
          res.setHeader('Content-Type','application/json') 
          console.log(error.message)
          return res.status(400).json({error:`error`}) 
    }
})

// router.get('/session', async (req,res) =>{
//     try{
//         let usuario = await sessionManager.getUsuarios(nombre, role)
//         res.status(200).render('session' , {
//             data: usuario.docs,
//             })
//     }catch(error){
//         res.setHeader('Content-Type','application/json') 
//         console.log(error.message)
//         return res.status(400).json({error:`error`}) 
//     }
// })

router.get('/realtimeproducts', async (req,res)=>{

    let productos= await productMongo.getProducts()

    res.status(200).render('realTimeProducts',{
        productos: productos 
    })
})

router.get('/chat',(req,res)=>{


    res.status(200).render('chat')
})




// const auth2=(req, res, next)=>{
//     if(req.session.usuario){
//         return res.redirect('/profile')
//     }

//     next()
// }

router.get('/', auth, (req,res)=>{

    res.setHeader('Content-Type','text/html')
    res.status(200).render('home') //, {login:req.session.usuario?true:false}
})

router.get('/signup',(req,res)=>{

    let {error}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('signup', {error}) //, login:false
})

router.get('/login', (req,res)=>{

    let {error, mensaje}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('login', {error, mensaje}) //, login:false
})

router.get('/profile', auth, (req,res)=>{

    let usuario=req.session.usuario

    res.setHeader('Content-Type','text/html')
    res.status(200).render('profile', {usuario}) //, login:true
})


export { router as viewsRouter }