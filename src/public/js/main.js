const categoryInfo= document.querySelector("[data-category]")

categoryInfo.forEach((cat)=>{
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