const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const bahanBakuRoutes = require("./routes/bahanBakuRoutes");
const login = require("./routes/loginRoutes");
const menuManagement = require("./routes/menuManagement");
const detailMenuRoutes = require("./routes/detailMenuRoutes");
const pesananDetailRoutes = require("./routes/pesananDetailRoutes");
const detailPenjualanRoutes = require("./routes/detailPenjualanRoutes");
const mainPenjualanRoutes = require("./routes/mainPenjualanRoutes");
const laporanKeuanganRoutes = require("./routes/laporanKeuanganRoutes");
const historyRoutes = require("./routes/historyRoutes");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// ========================
// ROUTES
// ========================

app.use("/api/login", login);

app.use("/api/decrypt", login);

app.use("/api/menu_management", menuManagement);

app.use("/api/menu_management/detail", detailMenuRoutes);

app.use("/api/bahan_Baku", bahanBakuRoutes);

app.use("/api/pesanan_detail/detail", pesananDetailRoutes);

app.use("/api/detail_penjualan", detailPenjualanRoutes);

app.use("/api/history", historyRoutes);

app.use("/api/main_penjualan", mainPenjualanRoutes);

app.use("/api/laporan_keuangan", laporanKeuanganRoutes);

// ========================

module.exports = app;
