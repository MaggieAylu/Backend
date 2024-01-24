const addToCartBtn = document.querySelectorAll(".add-to-cart")

addToCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        const cartId = "" 
        const productId = e.target.getAttribute("data-product-id")
        const productTitle = e.target.getAttribute("data-product-title")

        const response = await fetch(`/api/cartsmongo/${cartId}/product/${productId}`, {
            method: "POST"
        })
        
        if (response.status === 200) {
            alert(`"${productTitle}" ADDED TO CART`)
        } else {
            throw new Error("Error adding product to cart")
        }
    })
})

// const carritoContenido = document.getElementById('carrito-contenido')
// const eliminar = document.getElementsByClassName("eliminar")
// const verCarrito = document.getElementById('verCarrito')
// const carrito = []

// const agregarAlCarrito = (id) => {
//     const agregarCarrito = carrito.find(producto => producto.id === id)
//     if (agregarCarrito) {
//         agregarCarrito.cantidad++
//     } else {
//         const producto = productos.find(producto => producto.id === id)
//         carrito.push(producto)
//     }
// }

// const eliminarDelCarrito = (id) => {
//     const producto = carrito.find(producto => producto.id === id) 
//     if (producto) {
//       if (producto.cantidad > 1) {
//         producto.cantidad-- 
//         setTimeout(()=>{
//             carritoContenido.classList.add('ocultar')
//             Swal.fire({
//                 title: 'Producto eliminado',
//                 text: 'Su producto fue eliminado con exito',
//                 icon: 'success',
//                 confirmButtonText: 'Cerrar'
//             })
//         }, 1000)
//       } else {
//         const indice = carrito.lastIndexOf(producto) 
//         carrito.splice(indice, 1) 
//         setTimeout(()=>{
//             carritoContenido.classList.add('ocultar')
//             Swal.fire({
//                 title: 'Producto eliminado',
//                 text: 'Su producto fue eliminado con exito',
//                 icon: 'success',
//                 confirmButtonText: 'Cerrar'
//             })
//         }, 1000)
//       }
//     }
// }

// const crearCarrito = () =>{
//     carritoContenido.innerHTML = ''
//     carritoContenido.classList.add('abrir')
//     const tuCarrito = document.createElement('div')
//     tuCarrito.className = 'ver-carrito'
//     tuCarrito.innerHTML = `
//     <h1 class="titulo">Tu Carrito.</h1>
//     `
//     carritoContenido.appendChild(tuCarrito)

//     const boton = document.createElement('h1')
//     boton.innerText = 'X'
//     boton.className = 'cerrar'
//     boton.addEventListener('click', () => {
//         carritoContenido.classList.add('ocultar')
//     })
//     tuCarrito.appendChild(boton)
//     carritoContenido.classList.remove('ocultar')

//     carrito.forEach((product) => {
//         let contenido = document.createElement('div')
//         contenido.className = 'contenido-del-carrito'
//         contenido.innerHTML = `
//         <img src="${product.thumbnail}"
//         <h3>${product.title}</h3>
//         <p>$${product.price}</p>
//         <p>${product.quantity}</p>
//         <button id="eliminar${product.id}" class="eliminar">Eliminar</button>`

//         carritoContenido.appendChild(contenido)

//         const eliminar = document.getElementById(`eliminar${product.id}`)

//         eliminar.addEventListener('click', () => {
//             eliminarDelCarrito(prod.id) })
//     })
  
//    const total = carrito.reduce((acc, el) => acc + el.price * el.quantity, 0)
//    const totalPagar = document.createElement('div')
//    totalPagar.className = 'total-pagar'
//    totalPagar.innerHTML = `Total: $${total}`
//    carritoContenido.appendChild(totalPagar)


//    const finalizarCompra = document.createElement('button')
//    finalizarCompra.className = 'cart-btn'
//    finalizarCompra.innerHTML = `Finalizar Compra`
//    carritoContenido.appendChild(finalizarCompra)
//    finalizarCompra.addEventListener('click', () =>{
//     if(carrito.length > 0){
//         Swal.fire({
//             title: '¡Muchas Gracias!',
//             text: 'Su compra fue realizada con exito',
//             icon: 'success',
//             confirmButtonText: 'Aceptar'
//         })
//         carrito.splice(0,carrito.length)
//         carritoContenido.classList.add('ocultar')
//     }
//     else{
//         Swal.fire({
//             title: 'Opcion Invalida',
//             text: 'El carrito esta vacio',
//             icon: 'error',
//             confirmButtonText: 'Cerrar'
//         })
//     }
//    })
//    carritoContenido.classList.remove('ocultar')
// }

// verCarrito.addEventListener('click', () =>{crearCarrito()})