const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// Tahap 1 Tambahkan mysql + Session
const mysql = require("mysql");
const session = require("express-session");
// Tahap 2 tambahkan koneksi ke database
const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "project",
});

// Tahap 3 session
app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure : false }
}));
// definisi enviroment secara global (.env)
require("dotenv").config();

// Convert data ke json
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Memanggil route produk
const appRoute = require("./src/routes");
app.use("/", appRoute);

// Tahap 4 Membuat Route & Proses Login

app.post("/login", function(req,res){
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {

        connection.query("SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password], function(error, results, fields) {

            if (error) throw error;

            if (results.length > 0) {

                req.session.loggedin = true;
                req.session.username = username;
                req.session.password = password;

                res.send({
                    succes: true,
                    message: "Login Berhasil !"
                });
            } else {
                res.send({
                    succes: false,
                    message: "Login Gagal !"
                });
            }
            res.send();
        });
    } else {
        res.send({
            succes: true,
            message: "Silahkan Masukkan Username Dan Password Terlebih Dahulu"
        });
        res.send();
    }
});
// Menjalankan server sesuai dengan port yang terdaftar di .env (8080)
app.listen(process.env.APP_PORT, () => {
    console.log(`server berjalan http://localhost:${process.env.APP_PORT}`)
});
