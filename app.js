const express = require('express')
const session = require('express-session')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended : true }));
// app.get('/', (req, res) => {
 //  res.redirect('/')
 // })
 app.use(session({
  secret: 'Secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
   secure: false,
   sameSite: true
  }
 }))
 app.use(require('./routes/loginRoute'));
 app.use(require('./routes/productRoute'));

app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})