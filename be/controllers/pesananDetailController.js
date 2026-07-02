const { PesananDetail, Pesanan, Menu, Pegawai } = require("../models");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  createPesananDetailSchema,
  createPesananSchema,
} = require("../validations/pesananDetailValidation");

// =====================================================
// CREATE PESANAN DETAIL
// =====================================================
exports.createPesananDetail = async (req, res) => {
  try {
    const { error } = createPesananDetailSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { menu_id, pesanan_detail_jumlah, pesanan_id, subtotal } = req.body;

    // Pastikan menu ada
    const menu = await Menu.findByPk(menu_id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu tidak ditemukan",
      });
    }

    // Pastikan pesanan ada
    const pesanan = await Pesanan.findByPk(pesanan_id);

    if (!pesanan) {
      return res.status(404).json({
        success: false,
        message: "Pesanan tidak ditemukan",
      });
    }

    const newPesananDetail = await PesananDetail.create({
      menu_id,
      pesanan_detail_jumlah,
      pesanan_id,
      subtotal,
    });

    return res.status(201).json({
      success: true,
      message: "Pesanan detail created successfully",
      data: newPesananDetail,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create pesanan detail",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE PESANAN
// =====================================================
exports.createPesanan = async (req, res) => {
  try {
    const { error } = createPesananSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      pesanan_nama,
      pesanan_lokasi,
      pesanan_email,
      nomer_telpon,
      pesan,
      pesanan_tanggal,
      pesanan_tanggal_pengiriman,
    } = req.body;

    const newPesanan = await Pesanan.create({
      pesanan_nama,
      pesanan_lokasi,
      pesanan_email,
      nomer_telpon,
      pesan,
      pesanan_tanggal,
      pesanan_tanggal_pengiriman,
      pesanan_status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Pesanan created successfully",
      data: newPesanan,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create pesanan",
      error: error.message,
    });
  }
};

// =====================================================
// SHOW PESANAN DETAIL (GROUP BY PESANAN)
// =====================================================
exports.showPesananDetailSpesifik = async (req, res) => {
  try {
    const details = await PesananDetail.findAll({
      order: [["pesanan_id", "ASC"]],
      include: [
        {
          model: Menu,
          as: "menu",
        },
        {
          model: Pesanan,
          as: "pesanan",
        },
      ],
    });

    const grouped = {};

    details.forEach((detail) => {
      const item = detail.toJSON();

      const pid = item.pesanan_id;

      if (!grouped[pid]) {
        grouped[pid] = {
          pesanan_id: pid,
          pesanan_nama: item.pesanan?.pesanan_nama || "Tidak diketahui",

          pesanan_status: item.pesanan?.pesanan_status || "pending",

          data: [],
        };
      }

      grouped[pid].data.push(item);
    });

    return res.status(200).json(Object.values(grouped));
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};
// =====================================================
// UPDATE STATUS PESANAN
// =====================================================
exports.updateStatusPesanan = async (req, res) => {
  const { id } = req.params;
  const { pesan, userInfo } = req.body;

  try {
    const findPesanan = await Pesanan.findByPk(id);

    if (!findPesanan) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan",
      });
    }

    let newStatus = findPesanan.pesanan_status;

    if (newStatus === "pending") {
      newStatus = "diproses";
    } else if (newStatus === "diproses") {
      newStatus = "terkirim";
    } else {
      newStatus = "pending";
    }

    const pesan_text = `${userInfo}${pesan}`;

    await findPesanan.update({
      pesanan_status: newStatus,
      pesan: pesan_text,
    });

    return res.status(200).json({
      success: true,
      message: "Status pesanan berhasil diperbarui",
      data: findPesanan,
    });
  } catch (error) {
    console.error("Error updating pesanan status:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui status pesanan",
      error: error.message,
    });
  }
};

// =====================================================
// CHECK PASSWORD PEMESANAN
// =====================================================
exports.cekPasswordPemesanan = async (req, res) => {
  const { password, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const pegawai_id = decoded.pegawai_id;

    const user = await Pegawai.findByPk(pegawai_id);

    if (!user) {
      return res.status(404).json({
        message: "Pegawai tidak ditemukan",
      });
    }

    const isMatch = await bcrypt.compare(password, user.pegawai_password);

    if (!isMatch) {
      return res.status(200).json({
        message: "Password salah",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Password benar, akses diizinkan",
      status: true,
      data: {
        pegawai_id: user.pegawai_id,
        pegawai_nama: user.pegawai_nama,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Gagal memverifikasi password atau token tidak valid",
      error: error.message,
    });
  }
};

// =====================================================
// GET PESANAN BY ID
// =====================================================
exports.getPesananById = async (req, res) => {
  try {
    const { pesanan_id } = req.params;

    const pesanan = await Pesanan.findByPk(pesanan_id);

    if (!pesanan) {
      return res.status(404).json({
        success: false,
        message: "Pesanan not found",
      });
    }

    const pesananDetails = await PesananDetail.findAll({
      where: {
        pesanan_id,
      },
      include: [
        {
          model: Menu,
          as: "menu",
        },
      ],
      order: [["pesanan_detail_id", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      data: {
        pesanan,
        details: pesananDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching pesanan:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pesanan",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PESANAN STATUS
// =====================================================
exports.updatePesananStatus = async (req, res) => {
  try {
    const { pesanan_id } = req.params;
    const { pesanan_status } = req.body;

    const validStatuses = ["pending", "diproses", "terkirim"];

    if (!validStatuses.includes(pesanan_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: pending, diproses, or terkirim",
      });
    }

    const pesanan = await Pesanan.findByPk(pesanan_id);

    if (!pesanan) {
      return res.status(404).json({
        success: false,
        message: "Pesanan not found",
      });
    }

    await pesanan.update({
      pesanan_status,
    });

    return res.status(200).json({
      success: true,
      message: "Pesanan status updated successfully",
      data: pesanan,
    });
  } catch (error) {
    console.error("Error updating pesanan status:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update pesanan status",
      error: error.message,
    });
  }
};

// =====================================================
// GET PESANAN DETAIL BY PESANAN ID
// =====================================================
exports.getPesananDetailById = async (req, res) => {
  try {
    const { id } = req.params;

    const details = await PesananDetail.findAll({
      where: {
        pesanan_id: id,
      },
      include: [
        {
          model: Menu,
          as: "menu",
        },
      ],
      order: [["pesanan_detail_id", "ASC"]],
    });

    return res.status(200).json(details);
  } catch (error) {
    console.error("Error fetching pesanan detail:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pesanan detail",
      error: error.message,
    });
  }
};
