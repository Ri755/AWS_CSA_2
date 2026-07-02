const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Pesanan = sequelize.define(
  "pesanan",
  {
    pesanan_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pesanan_nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pesanan_lokasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pesanan_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    pesanan_status: {
      type: DataTypes.ENUM("pending", "diproses", "terkirim"),
      allowNull: false,
      defaultValue: "pending",
    },
    pesan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nomer_telpon: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    pesanan_tanggal: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pesanan_tanggal_pengiriman: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "pesanan",
    timestamps: true,
    paranoid: true,
  },
);

module.exports = Pesanan;
