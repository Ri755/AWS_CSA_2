const { DetailMenu, Menu } = require("../models");
// ======================================
// CREATE DETAIL MENU
// ======================================
exports.createDetailMenu = async (req, res) => {
  try {
    const {
      detail_menu_nama_bahan,
      detail_menu_jumlah,
      detail_menu_satuan,
      detail_menu_harga,
      menu_id,
    } = req.body;

    // Pastikan menu ada
    const menuExists = await Menu.findByPk(menu_id);

    if (!menuExists) {
      return res.status(404).json({
        message: "Menu tidak ditemukan",
      });
    }

    const detailMenu = await DetailMenu.create({
      detail_menu_nama_bahan,
      detail_menu_jumlah,
      detail_menu_satuan,
      detail_menu_harga,
      menu_id,
    });

    return res.status(201).json({
      message: "Detail menu berhasil ditambahkan.",
      data: detailMenu,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ======================================
// GET ALL DETAIL MENU
// ======================================
exports.getAllDetailMenu = async (req, res) => {
  try {
    const detailMenus = await DetailMenu.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Detail menu berhasil diambil.",
      data: detailMenus,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ======================================
// GET DETAIL MENU BY MENU ID
// ======================================
exports.getDetailMenuById = async (req, res) => {
  try {
    const { id } = req.params;

    const detailMenus = await DetailMenu.findAll({
      where: {
        menu_id: id,
      },
      order: [["createdAt", "DESC"]],
    });

    if (detailMenus.length === 0) {
      return res.status(404).json({
        message: "Detail pada menu ini kosong",
      });
    }

    return res.status(200).json({
      message: "Detail menu berhasil diambil.",
      data: detailMenus,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ======================================
// UPDATE DETAIL MENU
// ======================================
exports.updateDetailMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      detail_menu_nama_bahan,
      detail_menu_jumlah,
      detail_menu_satuan,
      detail_menu_harga,
    } = req.body;

    const detailMenu = await DetailMenu.findByPk(id);

    if (!detailMenu) {
      return res.status(404).json({
        message: "Detail menu tidak ditemukan!",
      });
    }

    await detailMenu.update({
      detail_menu_nama_bahan,
      detail_menu_jumlah,
      detail_menu_satuan,
      detail_menu_harga,
    });

    return res.status(200).json({
      message: "Detail menu berhasil diperbarui.",
      data: detailMenu,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ======================================
// DELETE DETAIL MENU (SOFT DELETE)
// ======================================
exports.deleteDetailMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const detailMenu = await DetailMenu.findByPk(id);

    if (!detailMenu) {
      return res.status(404).json({
        message: "Detail menu tidak ditemukan!",
      });
    }

    await detailMenu.destroy();

    return res.status(200).json({
      message: "Detail menu berhasil dihapus.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};
