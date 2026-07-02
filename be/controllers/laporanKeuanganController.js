const {
  HeaderPenjualan,
  Penjualan,
  Menu,
  BahanBaku,
  Pembelian,
  Pesanan,
  PesananDetail,
  Pegawai,
} = require("../models");

// ==============================
// LAPORAN PENJUALAN
// ==============================
const getLaporanPenjualan = async (req, res) => {
  try {
    const penjualan = await Penjualan.findAll({
      include: [
        {
          model: HeaderPenjualan,
          as: "header",
          include: [
            {
              model: Pegawai,
              as: "pegawai",
            },
          ],
        },
        {
          model: Menu,
          as: "menu",
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const groupedData = {};

    penjualan.forEach((item) => {
      const key = item.header_penjualan_id;
      const pesananNama = "Walk-in";

      if (!groupedData[key]) {
        groupedData[key] = {
          header_penjualan_id: key,
          tanggal: item.header.header_penjualan_tanggal,
          jenis: item.header.header_penjualan_jenis,
          biaya_tambahan: item.header.header_penjualan_biaya_tambahan || 0,
          persentase_dp: item.header.header_penjualan_uang_muka || 0,
          pegawai_id: item.header.pegawai_id,
          pegawai_nama: item.header.pegawai?.pegawai_nama || null,
          pesanan_nama: [],
          items: [],
        };
      }

      if (!groupedData[key].pesanan_nama.includes(pesananNama)) {
        groupedData[key].pesanan_nama.push(pesananNama);
      }

      groupedData[key].items.push({
        penjualan_id: item.penjualan_id,
        menu_id: item.menu_id,
        menu_nama: item.menu?.menu_nama || null,
        menu_harga: item.menu?.menu_harga || 0,
        penjualan_jumlah: item.penjualan_jumlah,
        pesanan_nama: pesananNama,
        subtotal: (item.menu?.menu_harga || 0) * item.penjualan_jumlah,
      });
    });

    const transformedData = Object.values(groupedData).map((group) => {
      const totalSubtotal = group.items.reduce(
        (sum, item) => sum + item.subtotal,
        0,
      );

      const totalBiayaTambahan = group.biaya_tambahan;
      const persentaseDP = group.persentase_dp;

      const totalDP = totalSubtotal * (persentaseDP / 100);

      const grandTotal = totalSubtotal + totalBiayaTambahan;

      const sisaPembayaran = grandTotal - totalDP;

      return {
        header_penjualan_id: group.header_penjualan_id,
        pesanan_nama: group.pesanan_nama,
        pegawai_id: group.pegawai_id,
        pegawai_nama: group.pegawai_nama,
        tanggal: group.tanggal,
        jenis: group.jenis,
        items: group.items,
        totalSubtotal,
        totalBiayaTambahan,
        persentaseDP,
        totalDP,
        grandTotal,
        sisaPembayaran,
      };
    });

    return res.status(200).json({
      message: "Berhasil mengambil laporan penjualan",
      data: transformedData,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Gagal mengambil laporan penjualan",
      error: err.message,
    });
  }
};

// ==============================
// LAPORAN PEMBELIAN
// ==============================
const getLaporanPembelian = async (req, res) => {
  try {
    const pembelian = await Pembelian.findAll({
      include: [
        {
          model: BahanBaku,
          as: "bahan_baku",
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const transformedData = pembelian.map((item) => ({
      pembelian_id: item.pembelian_id,
      tanggal: item.createdAt,
      bahan_baku_id: item.bahan_baku_id,
      bahan_baku_nama: item.bahan_baku?.bahan_baku_nama || null,
      pembelian_jumlah: item.pembelian_jumlah,
      pembelian_satuan: item.pembelian_satuan,
      pembelian_harga_satuan: item.pembelian_harga_satuan,
      subtotal: item.pembelian_jumlah * item.pembelian_harga_satuan,
      bahan_baku_jumlah: item.bahan_baku?.bahan_baku_jumlah || 0,
    }));

    return res.status(200).json({
      message: "Berhasil mengambil laporan pembelian",
      data: transformedData,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Gagal mengambil laporan pembelian",
      error: err.message,
    });
  }
};

// ==============================
// LAPORAN PESANAN
// ==============================
const getLaporanPesanan = async (req, res) => {
  try {
    const pesananList = await Pesanan.findAll({
      include: [
        {
          model: PesananDetail,
          as: "details",
          include: [
            {
              model: Menu,
              as: "menu",
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const transformedData = pesananList.map((pes) => {
      const items = pes.details.map((detail) => ({
        menu_id: detail.menu_id,
        menu_nama: detail.menu?.menu_nama || null,
        menu_harga: detail.menu?.menu_harga || 0,
        pesanan_detail_jumlah: detail.pesanan_detail_jumlah,
        subtotal: (detail.menu?.menu_harga || 0) * detail.pesanan_detail_jumlah,
      }));

      const total = items.reduce((sum, item) => sum + item.subtotal, 0);

      return {
        pesanan_id: pes.pesanan_id,
        pesanan_nama: pes.pesanan_nama,
        pesanan_email: pes.pesanan_email,
        pesanan_lokasi: pes.pesanan_lokasi,
        pesanan_status: pes.pesanan_status,
        tanggal: pes.pesanan_tanggal,
        tanggal_pengiriman: pes.pesanan_tanggal_pengiriman,
        items,
        total,
      };
    });

    return res.status(200).json({
      message: "Berhasil mengambil laporan pesanan",
      data: transformedData,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Gagal mengambil laporan pesanan",
      error: err.message,
    });
  }
};

module.exports = {
  getLaporanPenjualan,
  getLaporanPembelian,
  getLaporanPesanan,
};
