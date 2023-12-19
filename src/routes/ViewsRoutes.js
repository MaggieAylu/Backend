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

export { router as viewsRouter }