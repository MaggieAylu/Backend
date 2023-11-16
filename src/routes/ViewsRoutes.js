import {Router} from 'express'
import { productManager } from "../index.js"
export const router=Router()


router.get('/', async (req,res)=>{

    let productos = await productManager.getProducts()
    res.status(200).render('home', {
        productos: productos
    })
})

router.get('/realtimeproducts', async (req,res)=>{

    let productos= await productManager.getProducts()

    res.status(200).render('realTimeProducts',{
        productos: productos 
    })
})

export { router as viewsRouter }