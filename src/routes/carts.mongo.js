import { Router } from 'express'
import mongoose from 'mongoose'
import { cartsModelo } from '../dao/models/cart.model.js'
import { CartMongo } from '../dao/Mongo/CartMongo.js'

export const router=Router()

const cartMongo = new CartMongo()

router.get('/',async (req,res)=>{
    let carts = []
    try {
        carts = await cartMongo.getCartsMongo()
    } catch (error) {
        console.log(error.message)
    }
    res.setHeader('Content-Type','application/json')
    return res.status(200).json({carts})
})

router.post('/',async (req,res)=>{
    let {products} = req.body
      if (!products ) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({
          error: `Cart products are required`
        })
      }
      try {
        let nuevoCarrito = await cartsModelo.create(products[0])
            res.setHeader('Content-Type','application/json')
            return res.status(200).json({payload: nuevoCarrito})
      } catch (error) {
            res.setHeader('Content-Type','application/json')
            return res.status(500).json({error:`Unexpected server error -Try later`, detalle: error.message})
      }    
})

export {router as cartRouterMongo}