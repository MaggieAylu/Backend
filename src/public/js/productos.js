console.log("cargo de productos.js")

const socket=io()

socket.on("nuevoProducto", producto=>{
    console.log("viene importado:", producto)
    document.location.href='/realTimeProducts'

    let ulProductos=document.querySelector('ul')
    let liNuevoProducto=document.createElement('li')
    liNuevoProducto.innerHTML=producto
    ulProductos.append(liNuevoProducto)
})

socket.on('nuevoProductoConMiddleware', producto=>{
    console.log('viene desde un middleware:', producto)
})
