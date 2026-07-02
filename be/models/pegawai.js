const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Pegawai = sequelize.define(
  "pegawai",
  {
    pegawai_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pegawai_nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pegawai_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pegawai_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("manager", "karyawan"),
      defaultValue: "karyawan",
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "pegawai",
    timestamps: true,
    paranoid: true,
  },
);

module.exports = Pegawai;
