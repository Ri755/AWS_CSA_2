const {
  HeaderPenjualan,
  Penjualan,
  Menu,
  DetailMenu,
  BahanBaku,
} = require("../models");

const {
  headerPenjualanSchema,
  detailPenjualanSchema,
} = require("../validations/mainPenjualanValidation");

const { Op } = require("sequelize");

// ========================================
// CREATE HEADER PENJUALAN
// ========================================
const createHeaderPenjualan = async (req, res) => {
  try {
    const { error, value } = headerPenjualanSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      });
    }

    const pegawai_id = req.hasil?.pegawai_id || null;

    const headerPenjualan = await HeaderPenjualan.create({
      ...value,
      pegawai_id,
    });

    return res.status(201).json({
      message: "Header penjualan berhasil dibuat",
      data: headerPenjualan,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Gagal membuat header penjualan",
      error: err.message,
    });
  }
};

// ========================================
// CREATE DETAIL PENJUALAN
// ========================================
const createDetailPenjualan = async (req, res) => {
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

    const ingredients = await DetailMenu.findAll({
      where: {
        menu_id: value.menu_id,
      },
    });

    const stockChecks = await Promise.all(
      ingredients.map(async (ingredient) => {
        const bahanBaku = await BahanBaku.findOne({
          where: {
            bahan_baku_nama: ingredient.detail_menu_nama_bahan,
          },
        });

        const requiredQuantity =
          ingredient.detail_menu_jumlah * value.penjualan_jumlah;

        return {
          bahanBaku,
          ingredient,
          requiredQuantity,
          hasEnoughStock:
            bahanBaku && bahanBaku.bahan_baku_jumlah >= requiredQuantity,

          isZeroStock: bahanBaku && bahanBaku.bahan_baku_jumlah === 0,
        };
      }),
    );

    const hasZeroStock = stockChecks.some((item) => item.isZeroStock);

    if (hasZeroStock) {
      return res.status(400).json({
        message: "Menu tidak bisa dipilih karena bahan baku habis",
        zeroStockIngredients: stockChecks
          .filter((x) => x.isZeroStock)
          .map((x) => x.ingredient.detail_menu_nama_bahan),
      });
    }

    const insufficient = stockChecks.some((item) => !item.hasEnoughStock);

    if (insufficient) {
      return res.status(400).json({
        message: "Stok bahan baku tidak cukup",
        insufficientIngredients: stockChecks
          .filter((x) => !x.hasEnoughStock)
          .map(
            (x) =>
              `${x.ingredient.detail_menu_nama_bahan} (butuh ${x.requiredQuantity}, tersedia ${x.bahanBaku?.bahan_baku_jumlah ?? 0})`,
          ),
      });
    }

    const penjualan = await Penjualan.create(value);

    await Promise.all(
      stockChecks.map(async (check) => {
        if (check.bahanBaku) {
          await check.bahanBaku.update({
            bahan_baku_jumlah:
              check.bahanBaku.bahan_baku_jumlah - check.requiredQuantity,
          });
        }
      }),
    );

    return res.status(201).json({
      message: "Detail penjualan berhasil dibuat dan stok berhasil diperbarui",
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

// ========================================
// GET ALL PENJUALAN
// ========================================
const getAllPenjualan = async (req, res) => {
  try {
    const data = await Penjualan.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: HeaderPenjualan,
          as: "header",
        },
        {
          model: Menu,
          as: "menu",
        },
      ],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data penjualan",
      data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Gagal mengambil data penjualan",
      error: err.message,
    });
  }
};

// ========================================
// GET PENJUALAN BY HEADER ID
// ========================================
const getPenjualanById = async (req, res) => {
  try {
    const { id } = req.params;

    const header = await HeaderPenjualan.findByPk(id);

    if (!header) {
      return res.status(404).json({
        message: "Penjualan tidak ditemukan",
      });
    }

    const items = await Penjualan.findAll({
      where: {
        header_penjualan_id: id,
      },
      include: [
        {
          model: Menu,
          as: "menu",
        },
      ],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data penjualan",
      data: {
        header,
        items,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Gagal mengambil data penjualan",
      error: err.message,
    });
  }
};

// ========================================
// UPDATE HEADER PENJUALAN
// ========================================
const updateHeaderPenjualan = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = headerPenjualanSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      });
    }

    const header = await HeaderPenjualan.findByPk(id);

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
      message: "Gagal update header penjualan",
      error: err.message,
    });
  }
};

module.exports = {
  createHeaderPenjualan,
  createDetailPenjualan,
  getAllPenjualan,
  getPenjualanById,
  updateHeaderPenjualan,
};
