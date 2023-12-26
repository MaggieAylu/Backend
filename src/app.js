import express from "express"
import { fileURLToPath } from 'url'
import path from "path"
import { engine } from 'express-handlebars'
import { viewsRouter } from "./routes/ViewsRoutes.js"
import { cartsRouter } from "../src/routes/carts.js"
import { Server } from 'socket.io'
import { createServer } from 'http'
import mongoose from "mongoose"
import { ProductRouterMongo } from "./routes/products.mongo.js"
import { cartRouterMongo } from "./routes/carts.mongo.js"
import cookieParser from 'cookie-parser'
import session from "express-session"
import MongoStore from 'connect-mongo'
import dotenv from 'dotenv'
import { sessionRouter } from './routes/sessions.js'
// import { inicializarPassport } from "./config/passport.config.js"
import passport from 'passport'
import { usuariosModelo } from "./dao/models/users.models.js"
import { sessionManager } from "./index.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Crear un servidor HTTP
const httpServer = createServer()

// Crear una instancia de Server de socket.io adjunta al servidor HTTP
const socketServer = new Server(httpServer)


const PORT = 8080
const app = express()

app.use(cookieParser())

app.use(session ({
    store: MongoStore.create ({
        mongoUrl: 'mongodb+srv://maggie:Houseofcards_22@cluster0.ecwxfro.mongodb.net/?retryWrites=true&w=majority',
        ttl: 3000,
    }),
    secret: "Houseofcards_22",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,}
}))


app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// inicializarPassport()
// app.use(passport.initialize())
// app.use(passport.session())

app.use(express.static(path.join(new URL('/', import.meta.url).pathname, 'public')))

app.use('/', viewsRouter)
app.use('/api/products', (req, res, next)=>{
    req.codigo='007'
    if(req.query.nombre){
        req.query.nombre=req.query.nombre.toLowerCase()
    }
    req.io= io
    next()
}, ProductRouterMongo)

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
// app.use("/", productsRouter)
// app.use("/api/carts", cartRouterMongo)


app.use("/api/cartsmongo", cartRouterMongo)
app.use("/api/productsmongo", ProductRouterMongo)
app.use("/api/sessions",  sessionRouter)


// Iniciar el servidor HTTP en lugar de app.listen
// httpServer.listen(PORT, () => {
//     console.log("Servidor funcionando")
// })

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`)
})

// export const io = socketServer
// export const io=new Server(server)
// server.listen(PORT, ()=>{
//     console.log('servidor funcionando')
// })

export const io=new Server(server)

dotenv.config()

try{
    await mongoose.connect('mongodb+srv://maggie:Houseofcards_22@cluster0.ecwxfro.mongodb.net/?retryWrites=true&w=majority',{dbName: 'ecommerce'})  
    console.log('DB Online...!!')
} catch(error){
    console.log(error.message)
}

let usuarios=[]
let mensajes=[]

io.on('connection', socket=>{
    console.log(`Se ha conectado un cliente con id ${socket.id}`)

    socket.on('id', nombre=>{

        usuarios.push({nombre, id:socket.id})
        socket.broadcast.emit('nuevoUsuario',nombre)
        socket.emit("hello",mensajes)
    })
    socket.on('mensaje', datos=>{
        mensajes.push(datos)
        io.emit('nuevoMensaje', datos)
    })

    socket.on("disconnect",()=>{
        let usuario=usuarios.find(u=>u.id===socket.id)
        if(usuario){
            io.emit("usuarioDesconectado", usuario.nombre)
        }
    })
})

// app.get('/session', async (req,res)=>{
//     let nombre = await sessionManager.getUsuarios(nombre)
//     if(req.query.nombre){
//         res.send(`Bienvenido ${nombre}`)
//     }
// })

// // app.get('/',(req,res)=>{

// //     console.log(req.session)

// //     let mensaje="Bienvenido"
// //     if(req.session.contador){
// //         req.session.contador++
// //         mensaje+=`. Visitas totales a esta ruta: ${req.session.contador}`

// //     }else{
// //         req.session.contador=1
// //     }

// //     if(req.query.nombre){
// //         mensaje=`Bienvenido ${req.query.nombre}`
// //         if(req.session.usuario){
// //             let indice=req.session.usuario.findIndex(u=>u.nombre===req.query.nombre)
// //             if(indice===-1){
// //                 req.session.usuario.push({
// //                     nombre:req.query.nombre,
// //                      visitas:1
// //                 })
// //             }else{
// //                 req.session.usuario[indice].visitas++
// //                 mensaje+=`. Usted ha ingresado a esta ruta en ${req.session.usuario[indice].visitas} oportunidades`
// //             }
// //         }else{
// //             req.session.usuario=[
// //                 {
// //                     nombre:req.query.nombre, 
// //                     visitas: 1
// //                 }
// //             ]
// //         }
// //     }

// //     res.setHeader('Content-Type','text/plain') 
// //     res.status(200).send(mensaje) 

// // })

// app.get('/reset',(req,res)=>{
    
//     req.session.destroy(error=>{
//         if(error){
//             res.setHeader('Content-Type','application/json') 
//             return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`})
//         }
//     })

//     res.setHeader('Content-Type','application/json') 
//     res.status(200).json({
//         resultado:"Session reiniciada...!!!"
//     }) 
// }) 



// const products = await productManager.getProducts()
// io.emit("productsArray", products)

// // Add the product from the client socket
// io.on("addProduct", async (productsData) => {
//     try {
//         const result = await productManager.addProduct(productsData)
//         const products = await productManager.getProducts()
//         socketServer.emit("productsArray", products)
//     } catch (error) {
//         console.error(error.message)
//     }
// })

// // Remove the product from the client socket
// io.on("deleteProduct", async (productId) => {
//     try {
//         const result = await productManager.deleteProduct(productId)
//         const products = await productManager.getProducts()
//         socketServer.emit("productsArray", products)
//     } catch (error) {
//         console.error(error.message)
//     }
// })






// app.get('/session', (req,res)=>{
//     if(req.session.counter){
//         req.session.counter++
//         res.send(`Se ha visitado el sitio ${req.session.counter} veces.`)
//     }else{
//         req.session.counter = 1
//         res.send(`Bienvenido ${nombre}`)
//     }
// })

// app.get('/session', (req,res)=>{
//     let nombre = usuariosModelo.find(nombre, role)
//     if(req.session){
//         res.send(`Bienvenido ${nombre} tu rol es: ${rol}`)
//     }
// })

// // app.get('/logout',(req,res)=>{
// //     req.session.destroy(err=>{
// //         if(!err) res.send('Logout ok!')
// //         else res.send({status: 'Logout ERROR', body: err})
// //     })
// // })