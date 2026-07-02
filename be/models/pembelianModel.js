const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Pembelian = sequelize.define(
  "pembelian",
  {
    pembelian_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bahan_baku_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bahan_baku",
        key: "bahan_baku_id",
      },
    },
    pembelian_jumlah: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pembelian_satuan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pembelian_harga_satuan: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: "pembelian",
    timestamps: true,
    paranoid: true,
  },
);

module.exports = Pembelian;
