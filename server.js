const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const sqlite3 = require('sqlite3').verbose()
const crypto = require('crypto')
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({secret: "Shh, keep it a secret!"}));
app.use(express.static(__dirname));
const http = require('http');


app.listen(8080, function(){
  console.log('it works')
})
app.all('/', urlencodedParser, function (req, res) {
  res.sendFile(__dirname + '/index.htm');
})

//register
app.post('/register', urlencodedParser, function (req, res) {
  console.log('register request')
  var eaw = true
  email = req.body.email1
   
  let db = new sqlite3.Database('accounts.db');
  db.all(`SELECT id, salt, password FROM accounts WHERE ?="username"`, [email], (err, rows) => {
    rows.forEach((rows)=>{
      console.log(rows)
      eaw = false
      console.log(eaw + 'forEach')
    })

    if(eaw){
      console.log(eaw)
      console.log('entering into database')
      var saltss = crypto.randomBytes(8).toString('hex').slice(0,16)
      password = req.body.pword
      password = hashsalt(password, saltss)
      db.run(`INSERT INTO accounts (password,username,salt) VALUES (?, ?, ?)`, [password, email, saltss])
//
      db.all(`SELECT id, salt, password FROM accounts WHERE ?="username"`, [email], (err, rows) => {
        rows.forEach((row)=>{
          res.cookie("TheID", row.id)
          res.cookie("TheUser", row.username)
        })

        response = {
        email:req.body.email1,
        password:req.body.pword,
        salts:saltss
     }


    
    console.log(response)
    res.redirect('/longtermgoals');
   

      })
//


    }

    else{
      res.redirect('/')
    }
  })

})



  //login
app.post('/homepage', urlencodedParser, function (req, res) {
  helper = '/'
   email = req.body.email2
   passwrd = req.body.loginPword

   let db = new sqlite3.Database('accounts.db');

   console.log(passwrd)

   db.all(`SELECT id,username, salt, password FROM accounts WHERE ?="username"`, [email], (err, rows) => {
      rows.forEach((row)=>{
         if(hashsalt(passwrd, row.salt)== row.password){
            console.log('authenticated')
            res.cookie("TheID" , row.id)
            res.cookie("TheUser", row.username)
            helper = '/home'
          }
      })
      res.redirect(helper)
   })
   
})




app.all('/addgoals', urlencodedParser, function (req, res) {
   name = req.body.goaltitle
   priority = req.body.priority
   date = req.body.date
   type = req.body.goaltype
   db.run(`INSERT INTO goals (id,goals, subgoals, priority, duedate, complete) VALUES (?, ?, ?)`, [req.cookie, name, type, priority, date, 'no'])
   res.cookie('goal', [name, priority, date, type])
})


function hashsalt(password, salts){
    var hash = crypto.createHmac('sha512', salts)
    hash.update(password);
    return hash.digest('hex')
}

app.get('/home', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + '/home.html')
})

app.get('/longtermgoals', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + '/longtermgoals.htm')
})
app.get('/select_animal', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + '/intro_animal.htm')
})

