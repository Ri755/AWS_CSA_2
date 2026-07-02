const Menu = require("../models/menuModels");
const {
  addBahanBakuSchema,
  updateBahanBakuSchema,
  message,
} = require("../validations/menuManagementValidation");

// ===============================
// ADD MENU
// ===============================
exports.addMenu = async (req, res) => {
  try {
    const { menu_nama, menu_harga, menu_gambar } = req.body;

    if (!menu_nama || !menu_harga || !menu_gambar) {
      return res.status(400).send({
        message: "Salah Satu Data Kosong !!!",
      });
    }

    const insertMakanan = await Menu.create({
      menu_nama,
      menu_harga,
      menu_gambar,
      menu_status_aktif: 1,
    });

    return res.status(201).send({
      message: "Berhasil Menambahkan Menu",
      data: insertMakanan,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL MENU
// ===============================
exports.getMenu = async (req, res) => {
  try {
    const getAllMenu = await Menu.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(getAllMenu);
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ===============================
// TOGGLE STATUS MENU
// ===============================
exports.ubahStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const findMenu = await Menu.findOne({
      where: {
        menu_id: id,
      },
    });

    if (!findMenu) {
      return res.status(404).send({
        message: "Menu tidak ditemukan",
      });
    }

    findMenu.menu_status_aktif = findMenu.menu_status_aktif == 1 ? 0 : 1;

    await findMenu.save();

    return res.status(200).send({
      message: "Berhasil Mengupdate",
      data: findMenu,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ===============================
// EDIT MENU
// ===============================
exports.editMenuManagement = async (req, res) => {
  try {
    const { id } = req.params;
    const { menu_nama, menu_harga, menu_gambar } = req.body;

    const findMenu = await Menu.findOne({
      where: {
        menu_id: id,
      },
    });

    if (!findMenu) {
      return res.status(404).send({
        message: "Menu tidak ditemukan",
      });
    }

    findMenu.menu_nama = menu_nama ?? findMenu.menu_nama;

    findMenu.menu_harga = menu_harga ?? findMenu.menu_harga;

    findMenu.menu_gambar = menu_gambar ?? findMenu.menu_gambar;

    await findMenu.save();

    return res.status(200).send({
      message: "Menu berhasil diperbarui",
      data: findMenu,
      status: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update menu",
      error: error.message,
    });
  }
};

// ===============================
// TEMPLATE
// ===============================
exports.template = async (req, res) => {
  try {
    const getAllMenu = await Menu.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(getAllMenu);
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
