const {
  HeaderPenjualan,
  Penjualan,
  Menu,
  DetailMenu,
  BahanBaku,
  Pegawai,
} = require("../models");

const {
  headerPenjualanSchema,
  updateHeaderPenjualanSchema,
  detailPenjualanSchema,
} = require("../validations/detailPenjualanValidation");

// =============================
// CREATE HEADER PENJUALAN
// =============================
exports.createHeaderPenjualan = async (req, res) => {
  try {
    const { error, value } = headerPenjualanSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      });
    }

    const pegawai_id = req.hasil?.pegawai_id || null;

    const header = await HeaderPenjualan.create({
      ...value,
      pegawai_id,
    });

    return res.status(201).json({
      message: "Header penjualan berhasil dibuat",
      data: header,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Gagal membuat header penjualan",
      error: err.message,
    });
  }
};

// =============================
// CREATE DETAIL PENJUALAN
// =============================
exports.createDetailPenjualan = async (req, res) => {
  try {
    const { error, value } = detailPenjualanSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      });
    }

    const headerExists = await HeaderPenjualan.findByPk(
      value.header_penjualan_id,
    );

    if (!headerExists) {
      return res.status(404).json({
        message: "Header penjualan tidak ditemukan",
      });
    }

    const menuExists = await Menu.findByPk(value.menu_id);

    if (!menuExists) {
      return res.status(404).json({
        message: "Menu tidak ditemukan",
      });
    }

    const penjualan = await Penjualan.create(value);

    try {
      const detailMenus = await DetailMenu.findAll({
        where: {
          menu_id: value.menu_id,
        },
      });

      for (const detail of detailMenus) {
        const bahan = await BahanBaku.findOne({
          where: {
            bahan_baku_nama: detail.detail_menu_nama_bahan,
          },
        });

        if (bahan) {
          const pengurangan =
            detail.detail_menu_jumlah * value.penjualan_jumlah;

          await bahan.update({
            bahan_baku_jumlah: bahan.bahan_baku_jumlah - pengurangan,
          });
        }
      }
    } catch (stockErr) {
      console.error(stockErr);
    }

    return res.status(201).json({
      message: "Detail penjualan berhasil dibuat",
      data: penjualan,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Gagal membuat detail penjualan",
      error: err.message,
    });
  }
};

// =============================
// GET ALL PENJUALAN
// =============================
exports.getAllPenjualan = async (req, res) => {
  try {
    const headers = await HeaderPenjualan.findAll({
      include: [
        {
          model: Penjualan,
          as: "penjualans",
          include: [
            {
              model: Menu,
              as: "menu",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data penjualan",
      data: headers,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Gagal mengambil data",
      error: err.message,
    });
  }
};

// =============================
// GET BY ID
// =============================
exports.getPenjualanById = async (req, res) => {
  try {
    const data = await HeaderPenjualan.findByPk(req.params.id, {
      include: [
        {
          model: Pegawai,
          as: "pegawai",
        },
        {
          model: Penjualan,
          as: "penjualans",
          include: [
            {
              model: Menu,
              as: "menu",
            },
          ],
        },
      ],
    });

    if (!data) {
      return res.status(404).json({
        message: "Penjualan tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Berhasil mengambil data",
      data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

// =============================
// UPDATE HEADER
// =============================
exports.updateHeaderPenjualan = async (req, res) => {
  try {
    const { error, value } = updateHeaderPenjualanSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        details: error.details[0].message,
      });
    }

    const header = await HeaderPenjualan.findByPk(req.params.id);

    if (!header) {
      return res.status(404).json({
        message: "Header penjualan tidak ditemukan",
      });
    }

    await header.update(value);

    return res.status(200).json({
      message: "Header penjualan berhasil diupdate",
      data: header,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

// =============================
// DELETE DETAIL
// =============================
exports.deleteDetailPenjualan = async (req, res) => {
  try {
    const penjualan = await Penjualan.findByPk(req.params.id);

    if (!penjualan) {
      return res.status(404).json({
        message: "Detail penjualan tidak ditemukan",
      });
    }

    await penjualan.destroy();

    return res.status(200).json({
      message: "Detail penjualan berhasil dihapus",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

// =============================
// GET DETAIL HEADER
// =============================
exports.getDetailByHeaderId = async (req, res) => {
  try {
    const detail = await Penjualan.findAll({
      where: {
        header_penjualan_id: req.params.headerId,
      },
      include: [
        {
          model: Menu,
          as: "menu",
        },
      ],
    });

    return res.status(200).json({
      message: "Berhasil mengambil detail penjualan",
      data: detail,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};
