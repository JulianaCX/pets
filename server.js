const express = require('express')
const bodyParser = require ('body-parser')
const path = require('path')
const Database = require('better-sqlite3')

const db = new Database('./accounts.db')
db.exec (' CREATE TABLE IF NOT EXISTS users (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, username varchar(255), password varchar(255), salt varchar(255))')

const app = express () 
app.use(bodyParser.urlencoded({
    extended: true 
}))

app.post('/register', function(req, res){
    let username = req.body.email;
    let password = req.body.password; 

    let stmt = db.prepare ('SELECT * from users WHERE username=?')
    let row = stmt.get(username)
    
  
    if ( row == undefined){ 
       let insert = db.prepare('INSERT INTO users (username, password, salt) VALUES (?, ?, ?)')
       insert.run(username, password, 'SALT')
       res.redirect('/authenticate')
    }
    else { 
       let filePath = path.join(__dirname,'registerform.html')
       res.sendFile(filePath) 
    }
})

app.get('/register', function(req, res){
    let filePath = path.join(__dirname,'registerform.html')
    res.sendFile(filePath)
})

app.get('/authenticate', function(req, res){
    let filePath = path.join(__dirname,'login.html')
    res.sendFile(filePath)
})

app.listen(8081, function() {
    console.log ('server Listening on port 8081')
})


app.post('/authenticate', function(req, res){ 

    let stmtpass = db.prepare ('SELECT * from users WHERE username=?')
    let username = req.body.email;
    let password = req.body.password;
    let user = stmtpass.get (username)

    if (user.password == password){
        res.send ('Authenticated!')
    }
})
