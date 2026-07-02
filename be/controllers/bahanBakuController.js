const { BahanBaku, Pembelian } = require("../models");

const {
  addBahanBakuSchema,
  updateBahanBakuSchema,
  addPembelianSchema,
} = require("../validations/bahanBakuValidation");

// =====================================
// GET ALL
// =====================================
exports.getAllBahanBaku = async (req, res) => {
  try {
    const bahanBakuList = await BahanBaku.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(bahanBakuList);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// =====================================
// GET ONE
// =====================================
exports.getBahanBakuById = async (req, res) => {
  try {
    const bahanBaku = await BahanBaku.findOne({
      where: {
        bahan_baku_id: req.params.id,
      },
    });

    if (!bahanBaku) {
      return res.status(404).json({
        message: "Bahan baku tidak ditemukan!",
      });
    }

    return res.status(200).json(bahanBaku);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// =====================================
// ADD
// =====================================
exports.addBahanBaku = async (req, res) => {
  try {
    const { error } = addBahanBakuSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const newBahanBaku = await BahanBaku.create({
      ...req.body,
    });

    return res.status(201).json({
      message: "Bahan baku berhasil ditambahkan!",
      data: newBahanBaku,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// UPDATE
// =====================================
exports.updateBahanBaku = async (req, res) => {
  try {
    const { error } = updateBahanBakuSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { id } = req.params;

    const bahanBaku = await BahanBaku.findOne({
      where: {
        bahan_baku_id: id,
      },
    });

    if (!bahanBaku) {
      return res.status(404).json({
        message: "Bahan baku tidak ditemukan!",
      });
    }

    await bahanBaku.update(req.body);

    return res.status(200).json({
      message: "Bahan baku berhasil diperbarui!",
      data: bahanBaku,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// DELETE (Soft Delete)
// =====================================
exports.deleteBahanBaku = async (req, res) => {
  try {
    const { id } = req.params;

    const bahanBaku = await BahanBaku.findOne({
      where: {
        bahan_baku_id: id,
      },
    });

    if (!bahanBaku) {
      return res.status(404).json({
        message: "Bahan baku tidak ditemukan!",
      });
    }

    await bahanBaku.destroy();

    return res.status(200).json({
      message: "Bahan baku berhasil dihapus.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// ADD PEMBELIAN
// =====================================
exports.addPembelian = async (req, res) => {
  try {
    const { error } = addPembelianSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const {
      bahan_baku_id,
      pembelian_jumlah,
      pembelian_satuan,
      pembelian_harga_satuan,
    } = req.body;

    const bahan = await BahanBaku.findByPk(bahan_baku_id);

    if (!bahan) {
      return res.status(404).json({
        message: "Bahan baku tidak ditemukan.",
      });
    }

    const newPembelian = await Pembelian.create({
      bahan_baku_id,
      pembelian_jumlah,
      pembelian_satuan,
      pembelian_harga_satuan,
    });

    return res.status(201).json({
      message: "Pembelian berhasil ditambahkan!",
      data: newPembelian,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
