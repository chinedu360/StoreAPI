const Product = require('../models/product')

const getAllProducts = async (req, res, next) => {
    //throw new Error('testing trhe mic 1 2')
    const { featured, name, company, sort, select, numericFilters } = req.query
    const queryObject = {}

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }

    if (name) {
        queryObject.name = { $regex: name, $options: 'i'} 
    }

    if (company) {
        queryObject.company = company
    }

    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
        
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        });
    }
    console.log(queryObject)
 
    let result = Product.find(queryObject)
 
    //sort
    if (sort) {
        //when passing multiple sort strings, we want to split with a comma and join with space first thats the only sr=tring value the sort method accepts.
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    } else {
        // setting a default sort, if the user has not set a sort param
        result = result.sort('createdAt')
    }

    //select
    if (select) {
        const selectList = select.split(',').join(' ');
        result = result.select(selectList)
    }

    //skip
    const page = Number(req.query.page) || 1
    //limit
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    const products = await result

    res.status(200).json({nbHits: products.length, products })
}

module.exports = {
    getAllProducts
}