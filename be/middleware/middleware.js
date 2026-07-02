const Pegawai = require("../models/pegawai");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let templateMiddleware = async (req, res, next) => {
  try {
    next();
  } catch (err) {
    return res.status(500).send({
      error: err.message,
    });
  }
};

let isAuthenticate = async (req, res, next) => {
  try {
    const token = req.headers["x-auth-token"];

    if (!token) {
      return res.status(400).send({
        message: "Authentication Required",
      });
    }

    // Verifikasi JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.hasil = decoded;

    // ==========================
    // Sequelize Version
    // ==========================
    const findPegawai = await Pegawai.findOne({
      where: {
        pegawai_id: decoded.pegawai_id,
      },
    });

    if (!findPegawai) {
      return res.status(404).send({
        message: "Pegawai tidak ditemukan atau sudah dihapus.",
      });
    }

    req.pegawai = findPegawai;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).send({
        message: "Token sudah kadaluarsa",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).send({
        message: "Token tidak valid",
      });
    }

    return res.status(500).send({
      error: err.message,
    });
  }
};

let isManager = async (req, res, next) => {
  try {
    const role = req.pegawai.role;

    if (role !== "manager") {
      return res.status(403).send({
        message: "Akses ditolak. Hanya untuk manager",
      });
    }

    next();
  } catch (err) {
    return res.status(500).send({
      error: err.message,
    });
  }
};

module.exports = {
  isAuthenticate,
  isManager,
};
