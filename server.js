const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const sqlite3 = require('sqlite3').verbose()
const crypto = require('crypto')
app.use(express.static(__dirname));

app.listen(8080, function(){
    console.log('it works')
})
app.get('/', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + '/index.htm');
})


app.post('/register', urlencodedParser, function (req, res) {
    console.log('register request')
   email = req.body.email1
   password = req.body.pword
   let db = new sqlite3.Database('accounts.db');

   var saltss = crypto.randomBytes(8).toString('hex').slice(0,16)

   password = hashsalt(password, saltss)

   db.run(`INSERT INTO accounts (password,username,salt) VALUES (?, ?, ?)`, [password, email, saltss])

   response = {
      email:req.body.email1,
      password:req.body.pword,
      salts:saltss
   }
   console.log(response)
  res.sendFile(__dirname + '/index.htm');

})
app.post('/authenticate', urlencodedParser, function (req, res) {
   email = req.body.email
   password = req.body.password
   let db = new sqlite3.Database('accounts.db');

   db.all(`SELECT salt, password FROM accounts WHERE ?="username"`, [email], (err, rows) => {
      rows.forEach((row)=>{
         if(hashsalt(password, row.salt)== row.password){
            console.log('authenticated')
            res.end('Authenticated!')}
         else{
            res.end('Failed!')
            console.log('faileesds')
         }
      })
      
   })
})


function hashsalt(password, salts){
    var hash = crypto.createHmac('sha512', salts)
    hash.update(password);
    return hash.digest('hex')
}



