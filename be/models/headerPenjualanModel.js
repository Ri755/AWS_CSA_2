const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const HeaderPenjualan = sequelize.define(
  "header_penjualan",
  {
    header_penjualan_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    header_penjualan_tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    header_penjualan_jenis: {
      type: DataTypes.ENUM("offline", "online"),
      allowNull: false,
    },
    header_penjualan_keterangan: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    header_penjualan_biaya_tambahan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    header_penjualan_uang_muka: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    pegawai_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "pegawai",
        key: "pegawai_id",
      },
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
    tableName: "header_penjualan",
    timestamps: true,
    paranoid: true,
  },
);

module.exports = HeaderPenjualan;
