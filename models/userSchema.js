const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishyear: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

const bookModel = mongoose.model('bookTbl',bookSchema)

module.exports = bookModel