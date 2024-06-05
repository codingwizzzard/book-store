const express = require('express')
const multer = require('multer')
const fs = require('fs')
const db = require('./config/database')
const bookModel = require('./models/userSchema')

const app = express()

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads/'))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage }).single('image')

app.get('/', (req, res) => {
  bookModel.find({}).then((data) => {
    return res.render('index', { data })
  }).catch((err) => {
    console.log(err)
    return false
  })
})

app.get('/add', (req, res) => {
  return res.render('add')
})

app.post('/add', upload, (req, res) => {
  const { title, author, publishyear, id } = req.body
  if (id) {
    if (req.file) {

      let image = req.file.path

      bookModel.findById(id).then((data) => {
        fs.unlinkSync(data.image)
      }).catch((err) => {
        console.log(err)
        return false
      })

      bookModel.findByIdAndUpdate(id, { title, author, publishyear, image }).then(() => {
        return res.redirect('/')
      }).catch((err) => {
        console.log(err)
        return false
      })
    } else {
      bookModel.findById(id).then((data) => {
        let image = data.image
        bookModel.findByIdAndUpdate(id, { title, author, publishyear, image }).then(() => {
          return res.redirect('/')
        }).catch((err) => {
          console.log(err)
          return false
        })
      }).catch((err) => {
        console.log(err)
        return false
      })
    }
  } else {

    let image = req.file.path

    bookModel.create({ title, author, publishyear, image }).then(() => {
      return res.redirect('/')
    }).catch((err) => {
      console.log(err)
      return false
    })
  }
})

app.get('/editBook/:id', (req, res) => {
  let { id } = req.params
  bookModel.findById(id).then((data) => {
    res.render('edit', { data })
  }).catch((err) => {
    console.log(err)
    return false
  })
})

app.get('/edittbl', (req, res) => {
  bookModel.find({}).then((data) => {
    res.render('edittbl', { data })
  }).catch((err) => {
    console.log(err)
    return false
  })
})

app.get('/deleteBook/:id', (req, res) => {

  let { id } = req.params
  
  bookModel.findById(id).then((data) => {
    fs.unlinkSync(data.image)
  }).catch((err) => {
    console.log(err)
    return false
  })

  bookModel.findByIdAndDelete(id).then(() => {
    return res.redirect('/edittbl')
  }).catch((err) => {
    console.log(err)
    return false
  })
})

app.get('/bookDetails/:id', (req, res) => {

  let { id } = req.params
  
  bookModel.findById(id).then((data) => {
    return res.render('bookDetails', { data })
  }).catch((err) => {
    console.log(err)
    return false;
  })
})

app.listen(1303, (err) => {
  if (err) {
    console.log("Server not started")
    return false
  }
  console.log("Server started at http://localhost:1303")
}) 