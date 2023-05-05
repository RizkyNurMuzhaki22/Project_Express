const router = require("express").Router();
const routeBarang = require("./barang");

// GET localhost:8080/produk => Ambil data semua produk
router.use("/barang", routeBarang);

module.exports = router;

// Index ini untuk menampung berbagai route