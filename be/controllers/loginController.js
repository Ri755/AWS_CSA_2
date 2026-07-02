const Pegawai = require("../models/pegawai");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =====================================
// LOGIN
// =====================================
exports.doLogin = async (req, res) => {
  try {
    const { pegawai_id, password } = req.body;

    console.log("Mulai pengecekan pegawai_id:", pegawai_id);

    const isUserAda = await Pegawai.findOne({
      where: {
        pegawai_id: parseInt(pegawai_id),
      },
    });

    if (!isUserAda) {
      return res.status(404).send({
        message: "Pegawai tidak ditemukan",
      });
    }

    const valid = await bcrypt.compare(password, isUserAda.pegawai_password);

    if (!valid) {
      return res.status(401).send({
        message: "Password salah",
      });
    }

    const payload = {
      pegawai_id: isUserAda.pegawai_id,
      pegawai_nama: isUserAda.pegawai_nama,
      pegawai_role: isUserAda.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    return res.status(200).send({
      message: "Berhasil Login",
      token,
    });
  } catch (error) {
    console.error("Error login:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// DECRYPT TOKEN
// =====================================
exports.decryptToken = (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(200).send({
        message: "Token tidak ditemukan",
        status: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).send({
      message: "Token valid",
      status: true,
      data: decoded,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
