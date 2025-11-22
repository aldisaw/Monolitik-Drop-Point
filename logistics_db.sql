-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 22, 2025 at 05:19 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `logistics_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `courier`
--

CREATE TABLE `courier` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `vehicle_plate` varchar(15) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Tersedia'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `courier`
--

INSERT INTO `courier` (`id`, `name`, `phone`, `vehicle_plate`, `status`) VALUES
(1, 'Ujang Kurir', '0812121212', 'D1337SU', 'Tersedia'),
(2, 'Asep Vario', '086546464', 'B1234AA', 'Tersedia'),
(3, 'Mamat Nmax', '089898989', 'D7751AS', 'Sedang Mengambil'),
(4, 'Burhan Mio', '0821545454', 'D55461AD', 'Nonaktif'),
(5, 'Beben SupraX', '0885124523', 'Z6223TA', 'Sedang Mengantar'),
(6, 'Dedi Begjul', '085711211121', 'F2253GH', 'Tersedia'),
(7, 'Aep Skupi', '0881214551', 'D9595NP', 'Tersedia');

-- --------------------------------------------------------

--
-- Table structure for table `shipments`
--

CREATE TABLE `shipments` (
  `id` int(11) NOT NULL,
  `shipper_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `weight_item` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipper_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'At Drop Point',
  `kota` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provinsi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kecamatan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode_pos` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat_lengkap` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `courier_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shipments`
--

INSERT INTO `shipments` (`id`, `shipper_name`, `weight_item`, `shipper_phone`, `receiver_phone`, `receiver_name`, `status`, `kota`, `provinsi`, `kecamatan`, `kode_pos`, `alamat_lengkap`, `created_at`, `courier_id`) VALUES
(2, 'Fuad Nandiasa', '1', '081222566870', '087788058823', 'Kania', 'Ready for Pickup', 'Bandung', 'Jawa Barat', 'Babakan Tarogong', '40222', 'testing alamat', '2025-11-17 10:37:06', 3),
(3, 'Aldi', '1', '+628989898989', '+6289898989', 'Unla', 'At Drop Point', 'Bandung', 'Jawa barat', 'Bandung Wetan', '40116', 'Jl Buntu No 33', '2025-11-17 10:37:06', NULL),
(4, 'Tia', '1', '+6289656029943', '+6289898989', 'Tio', 'At Drop Point', 'Bandung', 'Jawa barat', 'Bandung Wetan', '40116', 'Jalan Jalan', '2025-11-17 11:10:55', NULL),
(5, 'Ria', '2', '0811112222', '083322211111', 'Rio', 'At Drop Point', 'Bandung', 'Jawa barat', 'Bandung Wetan', '40116', 'Jalan sore', '2025-11-17 11:31:18', NULL),
(6, 'Lia', '2', '08989898989', '083322211111', 'Leo', 'At Drop Point', 'Bandung', 'Jawa barat', 'Bandung Wetan', '40116', 'Jalan pagi', '2025-11-17 12:22:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_id`
--

CREATE TABLE `user_id` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `nama_lengkap` varchar(100) DEFAULT NULL,
  `role` varchar(30) DEFAULT 'pegawai'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_id`
--

INSERT INTO `user_id` (`id`, `username`, `password`, `nama_lengkap`, `role`) VALUES
(1, 'adi', 'adi', 'Adi Sopipud', 'pegawai_dp');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courier`
--
ALTER TABLE `courier`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `vehicle_plate` (`vehicle_plate`);

--
-- Indexes for table `shipments`
--
ALTER TABLE `shipments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_courier` (`courier_id`);

--
-- Indexes for table `user_id`
--
ALTER TABLE `user_id`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courier`
--
ALTER TABLE `courier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `shipments`
--
ALTER TABLE `shipments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_id`
--
ALTER TABLE `user_id`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `shipments`
--
ALTER TABLE `shipments`
  ADD CONSTRAINT `fk_courier` FOREIGN KEY (`courier_id`) REFERENCES `courier` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
