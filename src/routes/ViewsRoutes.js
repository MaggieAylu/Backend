import {Router} from 'express'
import { productMongo } from "../index.js"

export const router=Router()

router.get('/', async (req,res)=>{
    let productos = await productMongo.getProducts()
    res.status(200).render('home', {
        productos: productos
    })
})

router.get('/')

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