console.log("cargo de productos.js")

const socket=io()

// socket.on("nuevoProducto", producto=>{
//     console.log("viene importado:", producto)
//     document.location.href='/realTimeProducts'

//     let ulProductos=document.querySelector('ul')
//     let liNuevoProducto=document.createElement('li')
//     liNuevoProducto.innerHTML=producto
//     ulProductos.append(liNuevoProducto)
// })

// socket.on('nuevoProductoConMiddleware', producto=>{
//     console.log('viene desde un middleware:', producto)
// })


const cardProductsContainer = document.getElementById("cardProductsContainer")

socket.on("productsArray", (productsData) => {
    if (productsData.length > 0) {
        cardProductsContainer.innerHTML = `
            <h1 class="title-category">SHOP</h1>
            <div>
                <div class="item-list">
        `

        productsData.forEach((product) => {
            let cardProduct = `
                <div class="card-list">
                    <a href="/products/${product._id}">
                        <div class="card">
            `

            if (product.thumbnail) {
                cardProduct += `
                    <img class="card-img-top" src="/assets/imgProducts/${product.thumbnail}" alt="${product.title}">
                `
            }

            cardProduct += `
                        <div class="card-body row justify-content-evenly">
                            <h5 class="card-title mb-3">${product.title}</h5>
                            <p class="col-auto text-card-list">$${product.price}</p>
                            <p class="col-auto text-card-list category-card" data-category="${product.category}">
                                ${product.category}
                            </p>
                        </div>
                    </div>
                </a>
                <button class="btn-delete-product" data-product-id="${product._id}">Eliminar</button>
            `

            cardProductsContainer.querySelector(".item-list").innerHTML += cardProduct
        })

        cardProductsContainer.innerHTML += `</div></div></div>`

        const deleteProductBtn = document.querySelectorAll(".btn-delete-product")

        deleteProductBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const productId = e.target.getAttribute("data-product-id")
                if (confirm("Do you want to remove this product?")) {
                    socket.emit("deleteProduct", productId)
                }
            })
        })

        const categoryInfo = document.querySelectorAll("[data-category]")

        categoryInfo.forEach((cat) => {
            const category = cat.getAttribute("data-category")
            
            if (category === "remera"){
                cat.classList.add("ropa-category-card")
            } else if(category === "pantalones"){
                cat.classList.add("pantalones-category-card")
            } else if (category === "corset"){
                cat.classList.add("corset-category-card")
            } else if (category === "vestidos"){
                cat.classList.add("vestido-category-card")
            } else if(category === "camperas"){
                cat.classList.add("camperas-category-card")
            }
        })
    } else {
        cardProductsContainer.innerHTML = `
            <h1 class="title-category">SHOP</h1>
            <h2 class="title-category">Could not load the categories</h2>
        `
    }
})

const addProductForm = document.getElementById("addProductForm")

addProductForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(addProductForm)
    const jsonData = {}

    for (const [key, value] of formData.entries()) {
        jsonData[key] = value
    }
    
    socket.emit("addProduct", jsonData)
    addProductForm.reset()
})