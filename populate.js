require('dotenv').config();

const connectDB = require('./db/connectDB')
const Product = require('./models/product')

const jsonProduct = require('./product.json')

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Product.deleteMany();
        await Product.create(jsonProduct)
        console.log('ogun kill u there')
        process.exit(0);
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()