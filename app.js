require('dotenv').config();
require('express-async-errors')

const express = require('express');
const app = express();

const connectDB = require('./db/connectDB')
const products = require('./routes/product')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

//middleware
app.use(express.json())

//routes
app.get('/', (req, res) => {
    res.send('<h1>STORE API</h1><a href="/api/v21/products">Products Routes</a>')
})

//Product routes
app.use('/api/v1/products', products)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 3000

const start = async (req, res) => {
    try {
        //connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}`));
    } catch (error) {
        console.log(error)
    }
}

start()