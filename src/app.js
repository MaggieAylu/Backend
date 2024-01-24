import express from "express"
import { fileURLToPath } from 'url'
import path from "path"
import { engine } from 'express-handlebars'
import { viewsRouter } from "./routing/ViewsRoutes.js"
import { cartsRouter } from "./routing/carts.js"
import { Server } from 'socket.io'
import { createServer } from 'http'
import mongoose from "mongoose"
import { ProductRouterMongo } from "./routing/products.mongo.js"
import { cartRouterMongo } from "./routing/carts.mongo.js"
import cookieParser from 'cookie-parser'
import session from "express-session"
import MongoStore from 'connect-mongo'
import dotenv from 'dotenv'
// import { sessionRouter } from './routes/sessions.js'
import { SessionsRouter } from "./routing/sessions.js"
import { inicializarPassport } from "./config/passport.config.js"
import passport from 'passport'
import { usuariosModelo } from "./dao/models/users.models.js"
import { sessionManager } from "./dao/index.js"
import { fork } from "child_process"
import { SessionManagerDB } from "./dao/Mongo/sessionMongo.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Crear un servidor HTTP
const httpServer = createServer()

// Crear una instancia de Server de socket.io adjunta al servidor HTTP
const socketServer = new Server(httpServer)


const PORT = 8080
const app = express()

const sessionsRouter=new SessionsRouter()

// app.use(session ({
//     store: MongoStore.create ({
//         mongoUrl: 'mongodb+srv://maggie:Houseofcards_22@cluster0.ecwxfro.mongodb.net/?retryWrites=true&w=majority',
//         ttl: 3000,
//     }),
//     secret: "Houseofcards_22",
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24,}
// }))


app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
inicializarPassport()
app.use(passport.initialize())
// app.use(passport.session())

app.use(express.static(path.join(new URL('/', import.meta.url).pathname, 'public')))

app.use('/', viewsRouter)
app.use('/api/products', (req, res, next)=>{
    req.codigo='007'
    if(req.query.first_name){
        req.query.first_name=req.query.first_name.toLowerCase()
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
app.use("/api/sessions",  sessionsRouter.getRouter())


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

// const db = new SessionManagerDB()

// app.get('/', (req, res) => {
//     const isLogin = db.getUsuarios(req.cookies.jwt)
//     res.render('products', { isLogin })
//     console.log(isLogin)
//   })


