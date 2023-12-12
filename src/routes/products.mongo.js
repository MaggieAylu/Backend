import { Router } from "express"
import { ProductModel } from "../dao/models/products.model.js"
import mongoose from "mongoose"
import { ProductMongo } from "../dao/Mongo/productMongo.js"

const router = Router()
const productMongo = new ProductMongo()

router.get('/',async(req,res)=>{
    let productos = []
    try {
        productos = await productMongo.getProductsMongo()
    } catch(error){
        console.log(error.message)
    }
    res.setHeader('Content-Type','application/json')
    return res.status(200).json({productos})
})

router.get('/:pid',async(req,res)=>{
    let {pid} = req.params
    let existe
    if (!mongoose.Types.ObjectId.isValid(pid)){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error:`Please enter a valid ID...!!!`})
    }
    try{
        existe=await productMongo.getProductByIdMongo(pid)
    } catch(error){
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({error: `unexpected server error -Try later`, detalle: error.message})
    }
    if(!existe){
        res.setHeader('Content-Type','application/json')
        return res.status(400).json({error:`There is no product with ID ${pid}`});
    }
    res.setHeader('Content-Type','application/json')
    return res.status(200).json({producto:existe })
})


router.post('/',async (req,res)=>{
    let {
        title,
        description,
        price,
        thumbnail = [],
        code,
        stock,
        category,
        status,
      } = req.body;
  
      if (!title || !description || !price || !code || !stock || !category) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({
          error: `The title, description, price, code, stock, category and status data are mandatory`,
        })
      }
  
      let existeCode = false
  
      try {
        existeCode = await ProductModel.findOne({deleted:false, code:code}).lean()
      } catch (error) {
        res.setHeader('Content-Type','application/json')
              return res.status(500).json({error:`unexpected server error -Try later`, detalle: error.message})
      }
  
      if (existeCode) {
        res.setHeader('Content-Type','application/json')
              return res.status(400).json({error:`The product with code ${code} already exists in BD..........`})
      }
  
      try {
  
        let resultado =  await productMongo.addProductMongo(title, description,price, thumbnail, code, stock, category, status)
        res.setHeader('Content-Type','application/json')
                  return res.status(200).json({payload: resultado})
        
      } catch (error) {
        res.setHeader('Content-Type','application/json')
        return res.status(500).json({error:`unexpected server error -Try later`, detalle: error.message})
      }     
  })
  
  router.put('/:pid', async (req,res )=>{
    let {pid} = req.params
    let existe 
  
    if(!mongoose.Types.ObjectId.isValid(pid)){ // con esta instruccion validamos que el ID sea Valido 
      res.setHeader('Content-Type','application/json')
      return res.status(400).json({error:`Please enter a valid ID...!!!`})
  }
  
  try {
    existe = await productMongo.getProductByIdMongo(pid)
  } catch (error) {
        res.setHeader('Content-Type','application/json')
        return res.status(500).json({error:`unexpected server error -Try later`, detalle: error.message})
  }
  
  if(!existe){
    res.setHeader('Content-Type','application/json')
    return res.status(400).json({error:`There is no product with ID ${pid}`})
  }
  
    if(req.body._id || req.body.code){
            res.setHeader('Content-Type','application/json')
            return res.status(400).json({error:`Cannot modify properties "_id" and "code" `})
    }
    let resultado 
    
    try {
        resultado = await productMongo.updateProductMongo(pid, req.body )
        if (resultado.modifiedCount>0) {
            res.setHeader('Content-Type','application/json')
            return res.status(200).json({payload: "Modification made"})
            
        }else{
            res.setHeader('Content-Type','application/json')
            return res.status(400).json({error:`The modification was not finalized`})
        }   
    } catch (error) {
            res.setHeader('Content-Type','application/json')
            return res.status(500).json({error:`unexpected server error -Try later`, detalle: error.message})
    }
  })
  
  
  
  router.delete('/:pid', async (req,res )=>{
    let {pid} = req.params
    let existe 
  
    if(!mongoose.Types.ObjectId.isValid(pid)){
      res.setHeader('Content-Type','application/json')
      return res.status(400).json({error:`Please enter a valid ID...!!!`})
  }
  
  try {
    existe = await productMongo.getProductByIdMongo(pid)
  } catch (error) {
        res.setHeader('Content-Type','application/json')
        return res.status(500).json({error:`unexpected server error -Try later`, detalle: error.message})
  }
  
  if(!existe){
    res.setHeader('Content-Type','application/json')
    return res.status(400).json({error:`There is no product with ID ${pid}`})
  }
    let resultado 
    try {
        resultado = await productMongo.delProductMongo(pid)
        if (resultado.modifiedCount>0) {
            res.setHeader('Content-Type','application/json')
            return res.status(200).json({payload: "Product removed"})
            
        }else{
                res.setHeader('Content-Type','application/json')
                return res.status(400).json({error:`The elimination was not completed`})
        }
       
    } catch (error) {
            res.setHeader('Content-Type','application/json')
            return res.status(500).json({error:`unexpected server error -Try later`, detalle: error.message})
    }
  
  
  })
export {router as ProductRouterMongo}