const { sequelize } = require("../config/sequelize");

const Pegawai = require("./pegawai");
const BahanBaku = require("./bahanBakuModel");
const Menu = require("./menuModels");
const DetailMenu = require("./detailMenu");
const Pembelian = require("./pembelianModel");
const HeaderPenjualan = require("./headerPenjualanModel");
const Penjualan = require("./penjualanModel");
const Pesanan = require("./Pesanan");
const PesananDetail = require("./PesananDetail");

BahanBaku.hasMany(Pembelian, {
  foreignKey: "bahan_baku_id",
  as: "pembelians",
});

Pembelian.belongsTo(BahanBaku, {
  foreignKey: "bahan_baku_id",
  as: "bahan_baku",
});

Menu.hasMany(DetailMenu, {
  foreignKey: "menu_id",
  as: "detail_menus",
});

DetailMenu.belongsTo(Menu, {
  foreignKey: "menu_id",
  as: "menu",
});

HeaderPenjualan.hasMany(Penjualan, {
  foreignKey: "header_penjualan_id",
  as: "penjualans",
});

Penjualan.belongsTo(HeaderPenjualan, {
  foreignKey: "header_penjualan_id",
  as: "header",
});

Pegawai.hasMany(HeaderPenjualan, {
  foreignKey: "pegawai_id",
  as: "header",
});

HeaderPenjualan.belongsTo(Pegawai, {
  foreignKey: "pegawai_id",
  as: "pegawai",
});

Menu.hasMany(Penjualan, {
  foreignKey: "menu_id",
  as: "penjualans",
});

Penjualan.belongsTo(Menu, {
  foreignKey: "menu_id",
  as: "menu",
});

Pesanan.hasMany(PesananDetail, {
  foreignKey: "pesanan_id",
  as: "details",
});

PesananDetail.belongsTo(Pesanan, {
  foreignKey: "pesanan_id",
  as: "pesanan",
});

Menu.hasMany(PesananDetail, {
  foreignKey: "menu_id",
  as: "details",
});

PesananDetail.belongsTo(Menu, {
  foreignKey: "menu_id",
  as: "menu",
});

module.exports = {
  sequelize,
  Pegawai,
  BahanBaku,
  Menu,
  DetailMenu,
  Pembelian,
  HeaderPenjualan,
  Penjualan,
  Pesanan,
  PesananDetail,
};
