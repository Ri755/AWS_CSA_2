const {Pesanan, PesananDetail, Menu} = require("../models");

exports.getHistoryByEmail = async (req, res) => {
  try {
    const { pesanan_email } = req.query;

    const pesananList = await Pesanan.findAll({
      where: {
        pesanan_email,
      },
      include: [
        {
          model: PesananDetail,
          as: "details",
          include: [
            {
              model: Menu,
              as: "menu",
              attributes: ["menu_id", "menu_nama", "menu_harga"],
            },
          ],
        },
      ],
      order: [["pesanan_tanggal", "DESC"]],
    });

    const formattedData = pesananList.map((pesanan) => ({
      pesanan_id: pesanan.pesanan_id,
      pesanan_nama: pesanan.pesanan_nama,
      pesanan_lokasi: pesanan.pesanan_lokasi,
      pesanan_email: pesanan.pesanan_email,
      pesanan_status: pesanan.pesanan_status,
      pesanan_tanggal: pesanan.pesanan_tanggal,
      pesanan_tanggal_pengiriman: pesanan.pesanan_tanggal_pengiriman,

      details: pesanan.details.map((detail) => ({
        pesanan_detail_id: detail.pesanan_detail_id,
        menu_id: detail.menu_id,
        menu_nama: detail.menu ? detail.menu.menu_nama : null,
        menu_harga: detail.menu ? detail.menu.menu_harga : null,
        pesanan_detail_jumlah: detail.pesanan_detail_jumlah,
      })),
    }));

    return res.status(200).json({
      message: "History pesanan berhasil diambil.",
      data: formattedData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
