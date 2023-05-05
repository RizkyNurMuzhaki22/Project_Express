const config = require("../configs/database");
const mysql = require("mysql");
// Tahap 1
const session = require("express-session");
const express = require("express");
const connection = mysql.createConnection(config);
connection.connect();
const app = express();

// Tahap 1 middleware
app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
}));

// Menampilkan data
const getDataBarang = async (req, res) => {
    try{
        const data = await new Promise((resolve, reject) => {
        connection.query("SELECT * FROM barang", function (error, rows){
            if (rows){
                resolve(rows);
            } else{
                reject([]);
            }
        });
    });
    if (req.session.loggedin) {
        res.send({
            success: true,
            message: "Berhasil Mengambil Data !",
            data: data
        });
    } else{
        res.send({
            succes: true,
            message: "Silahkan Login Terlebih Dahulu"
        })
    }
}
    catch(error){
        console.log(error);
        res.send({
            success: false,
            message: error.stack,
        });
    }
}
    
// Menambahkan data
const addDataBarang = async(req, res) => {
    try{
        let data_kodebarang;
    if(req.body.kodebarang == undefined || req.body.kode_barang == ""){
        data_kodebarang = null;
    }
    else {
        data_kodebarang = req.body.kode_barang;
    }
    let total = req.body.harga * req.body.jumlah;
    let potongan;
    if (total > 100000) {
        potongan = 10000;
    }else{
        potongan = 0;
    }
    let total_harga = total - potongan;

    let data = {
        kode_barang: data_kodebarang,
        nama_barang: req.body.nama_barang,
        harga: req.body.harga,
        jumlah: req.body.jumlah,
        potongan: potongan,
        total_harga: total_harga
    }    
    const result = await new Promise((resolve, reject) =>{
        connection.query("INSERT INTO barang SET ?;",[data], function(error, rows){
            if (rows) {
                resolve(true);
            }else{
                reject(false);
            }
        });
    
    });

        res.send({
            succes: true,
            message: "Berhasil Menambahkan Data !"
        });
    
    }

    catch(error){
        console.log(error);
    res.send({
        succes: false,
        message: error.stack,
    });
}
}
// Mengubah data
const editDataBarang = async(req, res) => {
    try{
        let id = req.params.id;
    let dataEdit = {
        nama_barang: req.body.nama_barang,
        harga: req.body.harga,
        jumlah: req.body.jumlah
    }
    const result = await new Promise((resolve, reject) =>{
        connection.query("UPDATE barang set ? WHERE id = ?;", [dataEdit, id], function(error, rows){
            if (rows) {
                resolve(true);
            }else{
                reject(false);
            }
        });
    });
        res.send({
            succes: true,
            message: "Berhasil Edit Data !"
        });
    }
        catch(error){
        res.send({
            succes: false,
            message: error.stack,
        });
    }
}
// Menghapus Data
const deleteDataBarang = async(req, res) => {
    try{
        let id = req.params.id;
    const result = await new Promise((resolve, reject) => {
        connection.query("DELETE FROM barang WHERE id = ?;", [id], function(error, rows){
            if (rows) {
                resolve(true);
            }else{
                reject(false);
            }
            
        });
    });

        res.send({
            succes: true,
            message: "Berhasil Mengapus Data !"
        });
    }
    catch(error){
        res.send({
            succes: false,
            message: error.stack
        });
    }
}
module.exports = {
    getDataBarang,
    addDataBarang,
    editDataBarang,
    deleteDataBarang
}