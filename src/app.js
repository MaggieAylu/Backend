import express from 'express'
import {ProductManager} from './clases.js'

const app = express()
const PORT = 8080
const productsJson = './src/productos.json'

const productManager = new ProductManager(productsJson)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/Products', async (req, res) => {
    let data = await productManager.getProducts()

    if (!data || data.length === 0) {
        return res.status(404).send('No products found.')
    } else {
        const limit = parseInt(req.query.limit)
        if (isNaN(limit)) {
            return res.status(200).send(data)
        } else {
            const limitedData = data.slice(0, limit)
            return res.status(200).send(limitedData)
        }
    }
});

app.get('/Products/:pid', async (req, res) => {
    try {
        let pid = req.params.pid
        let data = await productManager.getProducts()
        if (!data) {
            throw Error('Error reading the file')
        } else {
            let result = data.find((item) => item.id == pid); 
            if (!result) {
                throw Error('The product does not exist')
            } else {
                return res.status(200).send(result)
            }
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
});
