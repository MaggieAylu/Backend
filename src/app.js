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


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Crear un servidor HTTP
const httpServer = createServer()

// Crear una instancia de Server de socket.io adjunta al servidor HTTP
const socketServer = new Server(httpServer)


const PORT = 8080
const app = express()


app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(new URL('/', import.meta.url).pathname, 'public')))

app.use('/', viewsRouter);
app.use('/api/products', (req, res, next)=>{
    req.codigo='007'
    if(req.query.nombre){
        req.query.nombre=req.query.nombre.toLowerCase()
    }
    req.io= io
    next()
}, ProductRouterMongo)

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))
// app.use("/", productsRouter)
app.use("/api/carts", cartsRouter)

app.use("/api/cartsmongo", cartRouterMongo)
app.use("/api/productsmongo", ProductRouterMongo)


// Iniciar el servidor HTTP en lugar de app.listen
// httpServer.listen(PORT, () => {
//     console.log("Servidor funcionando")
// });

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`)
})

// export const io = socketServer
// export const io=new Server(server)
// server.listen(PORT, ()=>{
//     console.log('servidor funcionando')
// })

export const io=new Server(server)

try{
    await mongoose.connect('mongodb+srv://maggie:Houseofcards_22@cluster0.ecwxfro.mongodb.net/?retryWrites=true&w=majority',{dbName: 'desafio'})  
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
