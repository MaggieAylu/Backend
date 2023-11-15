import express from "express"
import { fileURLToPath } from 'url'
import path from "path"
import { engine } from 'express-handlebars'
import { productsRouter } from "../src/routes/products.js"
import { viewsRouter } from "./routes/ViewsRoutes.js"
import { cartsRouter } from "../src/routes/carts.js"
import { Server } from 'socket.io'
import { createServer } from 'http'
import morgan from 'morgan'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Crear un servidor HTTP
const httpServer = createServer()

// Crear una instancia de Server de socket.io adjunta al servidor HTTP
const socketServer = new Server(httpServer)

const PORT = 8080
const app = express()

app.use(morgan('dev'))

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
    req.io=io
    next()
}, productsRouter)

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))
// app.use("/", productsRouter)
app.use("/api/carts", cartsRouter)

// Iniciar el servidor HTTP en lugar de app.listen
// httpServer.listen(PORT, () => {
//     console.log("Servidor funcionando")
// });

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`)
})

export const io = socketServer


// setInterval(()=>{
//     let temperatura=Math.floor(Math.random()*(7)+34)
//     io.emit('nuevaTemperatura')
// })