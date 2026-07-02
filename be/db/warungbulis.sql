/*!40101 SET NAMES utf8mb4 */;
/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

USE `warungbulis`

-- =====================================================================
-- TABLE: pegawai
-- DESCRIPTION: Data master pegawai/karyawan warung
-- RELASI: 1-N dengan header_penjualan
-- =====================================================================
DROP TABLE IF EXISTS `pegawai`;
CREATE TABLE `pegawai` (
  `pegawai_id` INT(11) NOT NULL AUTO_INCREMENT,
  `pegawai_nama` VARCHAR(100) NOT NULL,
  `pegawai_email` VARCHAR(100) NOT NULL UNIQUE,
  `pegawai_password` VARCHAR(255) NOT NULL,
  `role` ENUM('manager', 'karyawan') DEFAULT 'karyawan',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`pegawai_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================================
-- TABLE: bahan_baku
-- DESCRIPTION: Master data bahan baku/material untuk memasak
-- RELASI: 1-N dengan pembelian, 1-N dengan detail_menu
-- =====================================================================
DROP TABLE IF EXISTS `bahan_baku`;
CREATE TABLE `bahan_baku` (
  `bahan_baku_id` INT(11) NOT NULL AUTO_INCREMENT,
  `bahan_baku_nama` VARCHAR(100) NOT NULL,
  `bahan_baku_jumlah` FLOAT NOT NULL,
  `bahan_baku_harga` INT(11) NOT NULL,
  `bahan_baku_satuan` VARCHAR(100) NOT NULL COMMENT 'unit: kg, liter, unit, gram, dll',
  `bahan_baku_harga_satuan` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`bahan_baku_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================================
-- TABLE: menu
-- DESCRIPTION: Master data menu/produk yang dijual
-- RELASI: 1-N dengan detail_menu, 1-N dengan penjualan, 1-N dengan pesanan_detail
-- =====================================================================
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `menu_id` INT(11) NOT NULL AUTO_INCREMENT,
  `menu_nama` VARCHAR(255) NOT NULL,
  `menu_harga` INT(11) NOT NULL DEFAULT 0,
  `menu_gambar` LONGTEXT NOT NULL COMMENT 'URL gambar menu',
  `menu_status_aktif` TINYINT(1) DEFAULT 1 COMMENT '1=aktif, 0=tidak aktif',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`menu_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================================
-- TABLE: detail_menu
-- DESCRIPTION: Resep/komposisi bahan untuk setiap menu
-- RELASI: N-1 dengan menu, N-1 dengan bahan_baku
-- =====================================================================
DROP TABLE IF EXISTS `detail_menu`;
CREATE TABLE `detail_menu` (
  `detail_menu_id` INT(11) NOT NULL AUTO_INCREMENT,
  `detail_menu_nama_bahan` VARCHAR(255) NOT NULL,
  `detail_menu_jumlah` FLOAT NOT NULL COMMENT 'Jumlah bahan dalam satuan',
  `detail_menu_satuan` VARCHAR(255) NOT NULL,
  `detail_menu_harga` INT(11) NOT NULL COMMENT 'Harga bahan untuk 1 menu',
  `menu_id` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`detail_menu_id`),
  KEY `fk_menu_id` (`menu_id`),
  CONSTRAINT `detail_menu_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================================
-- TABLE: pembelian
-- DESCRIPTION: Riwayat pembelian bahan baku dari supplier
-- RELASI: N-1 dengan bahan_baku
-- =====================================================================
DROP TABLE IF EXISTS `pembelian`;
CREATE TABLE `pembelian` (
  `pembelian_id` INT(11) NOT NULL AUTO_INCREMENT,
  `bahan_baku_id` INT(11) NOT NULL,
  `pembelian_jumlah` FLOAT NOT NULL,
  `pembelian_satuan` VARCHAR(255) NOT NULL,
  `pembelian_harga_satuan` INT(11) NOT NULL COMMENT 'Harga per satuan saat pembelian',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`pembelian_id`),
  KEY `fk_bahan_baku_id` (`bahan_baku_id`),
  KEY `idx_tanggal` (`createdAt`),
  CONSTRAINT `pembelian_ibfk_1` FOREIGN KEY (`bahan_baku_id`) REFERENCES `bahan_baku` (`bahan_baku_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================================
-- TABLE: header_penjualan
-- DESCRIPTION: Header/master transaksi penjualan
-- RELASI: N-1 dengan pegawai, 1-N dengan penjualan
-- =====================================================================
DROP TABLE IF EXISTS `header_penjualan`;
CREATE TABLE `header_penjualan` (
  `header_penjualan_id` INT(11) NOT NULL AUTO_INCREMENT,
  `header_penjualan_tanggal` DATETIME NOT NULL,
  `header_penjualan_jenis` ENUM('offline','online') NOT NULL COMMENT 'offline=di toko, online=delivery',
  `header_penjualan_keterangan` VARCHAR(255) NOT NULL,
  `header_penjualan_biaya_tambahan` INT(11) NOT NULL DEFAULT 0 COMMENT 'Biaya packaging, ongkir, dll',
  `header_penjualan_uang_muka` INT(11) NOT NULL DEFAULT 0 COMMENT 'DP dari customer',
  `pegawai_id` INT(11) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`header_penjualan_id`),
  KEY `fk_pegawai_id` (`pegawai_id`),
  KEY `idx_tanggal` (`header_penjualan_tanggal`),
  KEY `idx_jenis` (`header_penjualan_jenis`),
  CONSTRAINT `header_penjualan_ibfk_1` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai` (`pegawai_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================================
-- TABLE: penjualan
-- DESCRIPTION: Detail item dalam setiap transaksi penjualan
-- RELASI: N-1 dengan header_penjualan, N-1 dengan menu
-- =====================================================================
DROP TABLE IF EXISTS `penjualan`;
CREATE TABLE `penjualan` (
  `penjualan_id` INT(11) NOT NULL AUTO_INCREMENT,
  `header_penjualan_id` INT(11) NOT NULL,
  `menu_id` INT(11) NOT NULL,
  `penjualan_jumlah` INT(11) NOT NULL COMMENT 'Qty item yang terjual',
  `subtotal` INT(11) NOT NULL DEFAULT 0 COMMENT 'menu_harga * penjualan_jumlah',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`penjualan_id`),
  KEY `fk_header_penjualan_id` (`header_penjualan_id`),
  KEY `fk_menu_id_penjualan` (`menu_id`),
  CONSTRAINT `penjualan_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `penjualan_ibfk_2` FOREIGN KEY (`header_penjualan_id`) REFERENCES `header_penjualan` (`header_penjualan_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================================
-- TABLE: pesanan
-- DESCRIPTION: Master pesanan dari customer (online order)
-- RELASI: 1-N dengan pesanan_detail
-- =====================================================================
DROP TABLE IF EXISTS `pesanan`;
CREATE TABLE `pesanan` (
  `pesanan_id` INT(11) NOT NULL AUTO_INCREMENT,
  `pesanan_nama` VARCHAR(255) NOT NULL COMMENT 'Nama customer',
  `pesanan_lokasi` VARCHAR(255) NOT NULL COMMENT 'Alamat pengiriman',
  `pesanan_email` VARCHAR(255) NOT NULL,
  `pesanan_status` ENUM('pending','diproses','terkirim') NOT NULL DEFAULT 'pending',
  `pesan` TEXT DEFAULT NULL COMMENT 'Catatan khusus dari customer',
  `nomer_telpon` VARCHAR(200) DEFAULT NULL,
  `pesanan_tanggal` DATETIME DEFAULT NULL COMMENT 'Tanggal order dibuat',
  `pesanan_tanggal_pengiriman` DATETIME DEFAULT NULL COMMENT 'Tanggal target pengiriman',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`pesanan_id`),
  KEY `idx_email` (`pesanan_email`),
  KEY `idx_status` (`pesanan_status`),
  KEY `idx_tanggal` (`pesanan_tanggal`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================================
-- TABLE: pesanan_detail
-- DESCRIPTION: Detail item dalam setiap pesanan customer
-- RELASI: N-1 dengan pesanan, N-1 dengan menu
-- =====================================================================
DROP TABLE IF EXISTS `pesanan_detail`;
CREATE TABLE `pesanan_detail` (
  `pesanan_detail_id` INT(11) NOT NULL AUTO_INCREMENT,
  `menu_id` INT(11) DEFAULT NULL,
  `pesanan_detail_jumlah` INT(11) NOT NULL COMMENT 'Qty item yang dipesan',
  `pesanan_id` INT(11) DEFAULT NULL,
  `subtotal` INT(11) NOT NULL COMMENT 'menu_harga * pesanan_detail_jumlah',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`pesanan_detail_id`),
  KEY `fk_menu_id_pesanan_detail` (`menu_id`),
  KEY `fk_pesanan_id` (`pesanan_id`),
  CONSTRAINT `pesanan_detail_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pesanan_detail_ibfk_2` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan` (`pesanan_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO pegawai 
(pegawai_id, pegawai_nama, pegawai_email, pegawai_password, ROLE, createdAt, updatedAt) 
VALUES 
(1, 'Budi', 'b@b.com', '$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS', 'karyawan', NOW(), NOW()),
(2, 'Siti', 'siti@warungbulis.com', '$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS', 'karyawan', NOW(), NOW()),
(3, 'Andi', 'andi@warungbulis.com', '$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS', 'karyawan', NOW(), NOW()),
(4, 'Rina', 'rina@warungbulis.com', '$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS', 'karyawan', NOW(), NOW()),
(5, 'Dewi', 'dewi@warungbulis.com', '$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS', 'karyawan', NOW(), NOW()),
(6, 'Agus', 'agus@warungbulis.com', '$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS', 'karyawan', NOW(), NOW()),
(7, 'Tina', 'tina@warungbulis.com', '$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS', 'karyawan', NOW(), NOW()),
(8, 'Eko', 'eko@warungbulis.com', '$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS', 'karyawan', NOW(), NOW()),
(9, 'Lina', 'lina@warungbulis.com', '$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS', 'karyawan', NOW(), NOW()),
(10, 'Rudi', 'rudi@warungbulis.com', '$2b$10$vd.ZdRs2h9mqGJyoiGx1oOuVJkHn/FglS.DB4uO.6Wa1kkIyO2/lS', 'karyawan', NOW(), NOW()),
(11, 'Mikael', 'mikael@warungbulis.com', '$2a$12$rhjOvfoFm3jMN9KCW9FqeORO2JjWEiFNIOBlWFJfqivv8wNc5Smym', 'manager', NOW(), NOW());

-- ===== TABLE 2: BAHAN_BAKU (Ingredient Master) =====
-- No FK dependencies
INSERT INTO bahan_baku 
(bahan_baku_id, bahan_baku_nama, bahan_baku_jumlah, bahan_baku_harga, bahan_baku_satuan, bahan_baku_harga_satuan, createdAt, updatedAt) 
VALUES 
(1, 'Bandeng', 25, 425000, 'unit', 17000, NOW(), NOW()),
(2, 'Cabe Merah', 3, 54000, 'kg', 18000, NOW(), NOW()),
(3, 'Bawang Putih', 4.2, 126000, 'kg', 30000, NOW(), NOW()),
(4, 'Bawang Merah', 3.18, 82680, 'kg', 26000, NOW(), NOW()),
(5, 'Biji Kemiri', 1.245, 59760, 'kg', 48000, NOW(), NOW()),
(6, 'Ketumbar', 1.11, 52170, 'kg', 47000, NOW(), NOW()),
(7, 'Jahe', 1.72, 41280, 'kg', 24000, NOW(), NOW()),
(8, 'Kecap Manis', 3, 111000, 'liter', 37000, NOW(), NOW()),
(9, 'Garam', 0.45, 72000, 'kg', 16000, NOW(), NOW()),
(10, 'Minyak Goreng', 2, 37000, 'kg', 18500, NOW(), NOW()),
(11, 'Tepung Terigu', 4, 41000, 'kg', 10250, NOW(), NOW()),
(12, 'Tepung Biang', 3, 31500, 'kg', 10500, NOW(), NOW()),
(13, 'Telur', 50, 128000, 'unit', 2560, NOW(), NOW()),
(14, 'Cabe Rawit', 2.5, 50000, 'kg', 20000, NOW(), NOW()),
(15, 'Daun Jeruk', 0.05, 1750, 'kg', 35000, NOW(), NOW()),
(16, 'Sachet Santan', 30, 60000, 'unit', 2000, NOW(), NOW()),
(17, 'Merica', 0.1, 10000, 'kg', 100000, NOW(), NOW()),
(18, 'Gula', 1.92, 30720, 'kg', 16000, NOW(), NOW()),
(19, 'Daun Pisang', 100, 50000, 'unit', 500, NOW(), NOW()),
(20, 'Cincau', 2.34, 50000, 'kg', 46800, NOW(), NOW()),
(21, 'Susu Kental', 2.02, 70700, 'liter', 35000, NOW(), NOW()),
(22, 'Nata De Coco', 2.67, 48060, 'kg', 18000, NOW(), NOW()),
(23, 'Sachet Teh', 150, 120000, 'unit', 800, NOW(), NOW()),
(24, 'Kaldu Bubuk', 1, 30000, 'kg', 30000, NOW(), NOW());

-- ===== TABLE 3: MENU (Menu Master) =====
-- No FK dependencies
INSERT INTO menu 
(menu_id, menu_nama, menu_harga, menu_gambar, menu_status_aktif, createdAt, updatedAt) 
VALUES 
(1, 'Bandeng Bakar', 60000, 'https://i.imgur.com/9UFXrw5.jpeg', TRUE, NOW(), NOW()),
(2, 'Bandeng Goreng', 60000, 'https://i.imgur.com/EXpwRPU.jpeg', TRUE, NOW(), NOW()),
(3, 'Bandeng Goreng Crispy', 60000, 'https://i.imgur.com/z7bMwBS.jpeg', TRUE, NOW(), NOW()),
(4, 'Otak Otak Bandeng', 70000, 'https://i.imgur.com/t7i8K4M.jpeg', TRUE, NOW(), NOW()),
(5, 'Bandeng Pepes', 70000, 'https://i.imgur.com/PPYYNRa.jpeg', TRUE, NOW(), NOW()),
(6, 'Es Cincau Susu', 7000, 'https://i.imgur.com/wQo8yqD.jpeg', TRUE, NOW(), NOW()),
(7, 'Es Teh', 4000, 'https://th.bing.com/th/id/OIP.rCtqYWrKKpktfUZqLxj4pAHaHa?w=216&h=215&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1', TRUE, NOW(), NOW()),
(8, 'Pecel Lele', 24000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbpIoXzpb43E0WJOwOfvtJPtyMgJaX3ai5QA&s', FALSE, NOW(), NOW()),
(9, 'Bakso', 20000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSikceAHEyId9rMz8X8CI1Md2U1gsdxKZBm_Q&s', FALSE, NOW(), NOW()),
(10, 'Rawon', 28000, 'https://awsimages.detik.net.id/community/media/visual/2023/03/14/resep-rawon-daging-surabaya_169.jpeg?w=600&q=90', FALSE, NOW(), NOW()),
(11, 'Tahu Goreng', 3, 'https://th.bing.com/th/id/OSK.ecf9df001af81740b902293078ed5c67?w=200&h=126&c=7&rs=1&qlt=80&r=0&o=6&cdv=1&cb=ucfimg1&dpr=1.3&pid=16.1&ucfimg=1', FALSE, NOW(), NOW());

-- ===== TABLE 4: DETAIL_MENU (Recipe - depends on menu) =====
-- FK: menu_id -> menu(menu_id)
INSERT INTO detail_menu 
(detail_menu_id, detail_menu_nama_bahan, detail_menu_jumlah, detail_menu_satuan, detail_menu_harga, menu_id, createdAt, updatedAt) 
VALUES 
(1, 'Bandeng', 1, 'unit', 17000, 1, NOW(), NOW()),
(2, 'Cabe Merah', 0.011, 'kg', 220, 1, NOW(), NOW()),
(3, 'Bawang Putih', 0.015, 'kg', 450, 1, NOW(), NOW()),
(4, 'Bawang Merah', 0.015, 'kg', 390, 1, NOW(), NOW()),
(5, 'Biji Kemiri', 0.015, 'kg', 720, 1, NOW(), NOW()),
(6, 'Ketumbar', 0.005, 'kg', 235, 1, NOW(), NOW()),
(7, 'Jahe', 0.03, 'kg', 720, 1, NOW(), NOW()),
(8, 'Kecap Manis', 0.045, 'liter', 1665, 1, NOW(), NOW()),
(9, 'Bandeng', 1, 'unit', 17000, 2, NOW(), NOW()),
(10, 'Bawang Putih', 0.003, 'kg', 90, 2, NOW(), NOW()),
(11, 'Garam', 0.005, 'kg', 80, 2, NOW(), NOW()),
(12, 'Kaldu Bubuk', 0.005, 'kg', 150, 2, NOW(), NOW()),
(13, 'Minyak Goreng', 0.25, 'liter', 4625, 2, NOW(), NOW()),
(14, 'Bandeng', 1, 'unit', 17000, 3, NOW(), NOW()),
(15, 'Bawang Putih', 0.003, 'kg', 90, 3, NOW(), NOW()),
(16, 'Ketumbar', 0.005, 'kg', 235, 3, NOW(), NOW()),
(17, 'Garam', 0.005, 'kg', 80, 3, NOW(), NOW()),
(18, 'Kaldu Bubuk', 0.005, 'kg', 150, 3, NOW(), NOW()),
(19, 'Tepung Biang', 0.075, 'kg', 787.5, 3, NOW(), NOW()),
(20, 'Tepung Terigu', 0.075, 'kg', 768.75, 3, NOW(), NOW()),
(21, 'Telur', 1, 'unit', 2560, 3, NOW(), NOW()),
(22, 'Minyak Goreng', 0.25, 'liter', 4625, 3, NOW(), NOW()),
(23, 'Bandeng', 1, 'unit', 17000, 4, NOW(), NOW()),
(24, 'Bawang Merah', 0.03, 'kg', 780, 4, NOW(), NOW()),
(25, 'Bawang Putih', 0.003, 'kg', 90, 4, NOW(), NOW()),
(26, 'Cabe Merah', 0.077, 'kg', 1540, 4, NOW(), NOW()),
(27, 'Cabe Rawit', 0.0015, 'kg', 270, 4, NOW(), NOW()),
(28, 'Jahe', 0.03, 'kg', 720, 4, NOW(), NOW()),
(29, 'Ketumbar', 0.005, 'kg', 235, 4, NOW(), NOW()),
(30, 'Daun Jeruk', 0.0002, 'kg', 7, 4, NOW(), NOW()),
(31, 'Biji Kemiri', 0.015, 'kg', 720, 4, NOW(), NOW()),
(32, 'Ketumbar', 0.005, 'kg', 235, 4, NOW(), NOW()),
(33, 'Merica', 0.0025, 'kg', 250, 4, NOW(), NOW()),
(34, 'Telur', 1, 'unit', 2560, 4, NOW(), NOW()),
(35, 'Sachet Santan', 1, 'unit', 2000, 4, NOW(), NOW()),
(36, 'Garam', 0.005, 'kg', 80, 4, NOW(), NOW()),
(37, 'Gula', 0.005, 'kg', 80, 4, NOW(), NOW()),
(38, 'Bandeng', 1, 'unit', 17000, 5, NOW(), NOW()),
(39, 'Bawang Merah', 0.03, 'kg', 780, 5, NOW(), NOW()),
(40, 'Bawang Putih', 0.003, 'kg', 90, 5, NOW(), NOW()),
(41, 'Cabe Merah', 0.077, 'kg', 1540, 5, NOW(), NOW()),
(42, 'Cabe Rawit', 0.0015, 'kg', 270, 5, NOW(), NOW()),
(43, 'Jahe', 0.03, 'kg', 720, 5, NOW(), NOW()),
(44, 'Biji Kemiri', 0.015, 'kg', 720, 5, NOW(), NOW()),
(45, 'Ketumbar', 0.005, 'kg', 235, 5, NOW(), NOW()),
(46, 'Garam', 0.0025, 'kg', 40, 5, NOW(), NOW()),
(47, 'Gula', 0.005, 'kg', 80, 5, NOW(), NOW()),
(48, 'Kaldu Bubuk', 0.0025, 'kg', 75, 5, NOW(), NOW()),
(49, 'Daun Pisang', 1, 'unit', 500, 5, NOW(), NOW()),
(50, 'Cincau', 0.045, 'kg', 2106, 6, NOW(), NOW()),
(51, 'Gula', 0.015, 'kg', 240, 6, NOW(), NOW()),
(52, 'Susu Kental', 0.015, 'kg', 525, 6, NOW(), NOW()),
(53, 'Nata De Coco', 0.015, 'kg', 721, 6, NOW(), NOW()),
(54, 'Sachet Teh', 1, 'unit', 800, 7, NOW(), NOW()),
(55, 'Gula', 0.015, 'kg', 240, 7, NOW(), NOW());

-- ===== TABLE 5: PEMBELIAN (Purchase - depends on bahan_baku) =====
-- FK: bahan_baku_id -> bahan_baku(bahan_baku_id)
INSERT INTO pembelian 
(pembelian_id, bahan_baku_id, pembelian_jumlah, pembelian_satuan, pembelian_harga_satuan, createdAt, updatedAt) 
VALUES 
(1, 1, 10, 'unit', 17000, NOW(), NOW()),
(2, 2, 1, 'kg', 54000, NOW(), NOW()),
(3, 3, 0.5, 'kg', 126000, NOW(), NOW()),
(4, 4, 0.5, 'kg', 82680, NOW(), NOW()),
(5, 5, 0.2, 'kg', 59760, NOW(), NOW()),
(6, 6, 0.2, 'kg', 47000, NOW(), NOW()),
(7, 7, 0.3, 'kg', 24000, NOW(), NOW()),
(8, 8, 2, 'liter', 111000, NOW(), NOW()),
(9, 9, 3, 'kg', 16000, NOW(), NOW()),
(10, 10, 2, 'kg', 18500, NOW(), NOW());

-- ===== TABLE 6: HEADER_PENJUALAN (Sales Header - depends on pegawai) =====
-- FK: pegawai_id -> pegawai(pegawai_id)
INSERT INTO header_penjualan 
(header_penjualan_id, header_penjualan_tanggal, header_penjualan_jenis, header_penjualan_keterangan, header_penjualan_biaya_tambahan, header_penjualan_uang_muka, pegawai_id, createdAt, updatedAt) 
VALUES 
(1, '2025-10-01 10:00:00', 'offline', 'Penjualan menu offline, 2 Bandeng Bakar dan 3 Es Cincau Susu', 5000, 0, 1, NOW(), NOW()),
(2, '2025-11-01 12:00:00', 'online', 'Penjualan menu online, 1 Bandeng Goreng dan 2 Es Teh', 10000, 50, 2, NOW(), NOW()),
(3, '2025-10-02 09:30:00', 'offline', 'Penjualan menu offline, 1 Bandeng Goreng Crispy', 3000, 0, 3, NOW(), NOW()),
(4, '2025-10-02 14:00:00', 'online', 'Penjualan menu online, 2 Otak Otak Bandeng', 7000, 20, 1, NOW(), NOW()),
(5, '2025-10-03 08:00:00', 'offline', 'Penjualan menu offline, 1 Bandeng Pepes', 4000, 0, 2, NOW(), NOW()),
(6, '2025-10-03 13:00:00', 'online', 'Penjualan menu online, 2 Es Cincau Susu', 6000, 10, 3, NOW(), NOW()),
(7, '2025-10-04 11:00:00', 'offline', 'Penjualan menu offline, 3 Bandeng Bakar', 4000, 0, 1, NOW(), NOW()),
(8, '2025-10-04 15:00:00', 'online', 'Penjualan menu online, 1 Bandeng Pepes dan 2 Es Teh', 5000, 15, 2, NOW(), NOW());

-- ===== TABLE 7: PENJUALAN (Sales Item - depends on header_penjualan & menu) =====
-- FK: header_penjualan_id -> header_penjualan(header_penjualan_id)
-- FK: menu_id -> menu(menu_id)
INSERT INTO penjualan 
(penjualan_id, header_penjualan_id, menu_id, penjualan_jumlah, subtotal, createdAt, updatedAt) 
VALUES 
(1, 1, 1, 2, 120000, NOW(), NOW()),
(2, 1, 6, 3, 21000, NOW(), NOW()),
(3, 2, 2, 1, 60000, NOW(), NOW()),
(4, 2, 7, 2, 8000, NOW(), NOW()),
(5, 3, 3, 1, 60000, NOW(), NOW()),
(6, 4, 4, 2, 140000, NOW(), NOW()),
(7, 5, 5, 1, 70000, NOW(), NOW()),
(8, 6, 6, 2, 14000, NOW(), NOW()),
(9, 7, 1, 3, 180000, NOW(), NOW()),
(10, 8, 5, 1, 70000, NOW(), NOW()),
(11, 8, 7, 2, 8000, NOW(), NOW());

-- ===== TABLE 8: PESANAN (Customer Order) =====
-- No FK dependencies
INSERT INTO pesanan 
(pesanan_id, pesanan_nama, pesanan_lokasi, pesanan_email, pesanan_status, nomer_telpon, pesanan_tanggal, pesanan_tanggal_pengiriman, createdAt, updatedAt) 
VALUES 
(1, 'Ali', 'Jln. Mawar No. 12, Surabaya', 'ali@email.com', 'pending', '08120093101', '2025-10-01 09:00:00', '2025-11-01 12:00:00', NOW(), NOW()),
(2, 'Ali', 'Jln. Melati No. 5, Gresik', 'ali@email.com', 'diproses', '08120007302', '2025-10-01 10:00:00', '2025-11-01 13:00:00', NOW(), NOW()),
(3, 'Ali', 'Jln. Kenanga No. 8, Sidoarjo', 'ali@email.com', 'terkirim', '08120112303', '2025-10-02 11:00:00', '2025-11-02 14:00:00', NOW(), NOW()),
(4, 'Tari', 'Jln. Dahlia No. 3, Malang', 'tari@email.com', 'pending', '08128765004', '2025-10-02 12:00:00', '2025-11-02 15:00:00', NOW(), NOW()),
(5, 'Bayu', 'Jln. Anggrek No. 9, Lamongan', 'bayu@email.com', 'pending', '08120238965', '2025-10-03 08:00:00', '2025-11-03 11:00:00', NOW(), NOW()),
(6, 'Nina', 'Jln. Teratai No. 7, Kediri', 'nina@email.com', 'pending', '08120019966', '2025-10-03 09:00:00', '2025-12-03 12:00:00', NOW(), NOW()),
(7, 'Fajar', 'Jln. Flamboyan No. 4, Blitar', 'fajar@email.com', 'pending', '08126589107', '2025-10-04 10:00:00', '2025-12-04 13:00:00', NOW(), NOW()),
(8, 'Lia', 'Jln. Cempaka No. 6, Tulungagung', 'lia@email.com', 'pending', '08120449308', '2025-10-04 11:00:00', '2025-12-04 14:00:00', NOW(), NOW()),
(9, 'Riski', 'Jln. Bougenville No. 10, Madiun', 'riski@email.com', 'pending', '08120002309', '2025-10-05 09:30:00', '2025-12-05 12:30:00', NOW(), NOW()),
(10, 'Salsa', 'Jln. Kamboja No. 2, Jombang', 'salsa@email.com', 'pending', '08120643010', '2025-10-05 10:30:00', '2025-12-05 13:30:00', NOW(), NOW());

-- ===== TABLE 9: PESANAN_DETAIL (Order Item - depends on pesanan & menu) =====
-- FK: pesanan_id -> pesanan(pesanan_id) ON DELETE CASCADE
-- FK: menu_id -> menu(menu_id)
INSERT INTO pesanan_detail 
(pesanan_detail_id, menu_id, pesanan_detail_jumlah, pesanan_id, subtotal, createdAt, updatedAt) 
VALUES 
(1, 1, 2, 1, 120000, NOW(), NOW()),
(2, 6, 1, 1, 7000, NOW(), NOW()),
(3, 2, 1, 2, 60000, NOW(), NOW()),
(4, 7, 2, 2, 8000, NOW(), NOW()),
(5, 3, 1, 3, 60000, NOW(), NOW()),
(6, 4, 2, 3, 140000, NOW(), NOW()),
(7, 5, 1, 4, 70000, NOW(), NOW()),
(8, 6, 2, 4, 14000, NOW(), NOW()),
(9, 1, 3, 5, 180000, NOW(), NOW()),
(10, 7, 1, 5, 4000, NOW(), NOW()),
(11, 2, 1, 6, 60000, NOW(), NOW()),
(12, 4, 1, 6, 70000, NOW(), NOW()),
(13, 1, 2, 7, 120000, NOW(), NOW()),
(14, 6, 1, 7, 7000, NOW(), NOW()),
(15, 3, 2, 8, 120000, NOW(), NOW()),
(16, 5, 1, 8, 70000, NOW(), NOW()),
(17, 2, 2, 9, 120000, NOW(), NOW()),
(18, 7, 1, 9, 4000, NOW(), NOW()),
(19, 4, 2, 10, 140000, NOW(), NOW()),
(20, 6, 1, 10, 7000, NOW(), NOW());

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
