const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Penjualan = sequelize.define(
  "penjualan",
  {
    penjualan_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    header_penjualan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "header_penjualan",
        key: "header_penjualan_id",
      },
    },
    menu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "menu",
        key: "menu_id",
      },
    },
    penjualan_jumlah: {
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
    tableName: "penjualan",
    timestamps: true,
    paranoid: true,
  },
);

module.exports = Penjualan;
