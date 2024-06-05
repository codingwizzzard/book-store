const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://harshshah123346:12345@cluster0.52qlyhd.mongodb.net/user")

const db = mongoose.connection

db.on('connected', (err) => {
    if(err) {
        console.log("Database not connected")
        return false
    }
    console.log("Database connected")
})

module.exports = db