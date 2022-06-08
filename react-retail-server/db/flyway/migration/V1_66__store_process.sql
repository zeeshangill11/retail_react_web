CREATE TABLE `store_process_status` (
  `id` int(20) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `storename` varchar(250) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `status` int(2) NOT NULL DEFAULT 0,
  `iot_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `store_process_status` (`id`, `storename`, `datetime`, `status`, `iot_date`) VALUES
(1, '0002115', NULL, 0, '0000-00-00'),
(2, '0001130', NULL, 0, '0000-00-00'),
(3, '0001106', NULL, 0, '0000-00-00'),
(4, '0002171', NULL, 0, '0000-00-00'),
(5, '0004001', NULL, 0, '0000-00-00'),
(6, '0004005', NULL, 0, '0000-00-00'),
(7, '0001002', NULL, 0, '0000-00-00'),
(8, '0001005', NULL, 0, '0000-00-00'),
(9, '0001108', NULL, 0, '0000-00-00'),
(10, '0001006', NULL, 0, '0000-00-00'),
(11, '0001109', '2021-07-13 20:00:31', 1, '2021-07-13'),
(12, '0001124', NULL, 0, '0000-00-00'),
(13, '0001126', NULL, 0, '0000-00-00'),
(14, '0001127', NULL, 0, '0000-00-00'),
(15, '0001134', NULL, 0, '0000-00-00'),
(16, '0001135', NULL, 0, '0000-00-00'),
(17, '0001147', NULL, 0, '0000-00-00'),
(18, '0001148', NULL, 0, '0000-00-00'),
(19, '0001149', NULL, 0, '0000-00-00'),
(20, '0001150', NULL, 0, '0000-00-00'),
(21, '0001151', NULL, 0, '0000-00-00'),
(22, '0001152', NULL, 0, '0000-00-00'),
(23, '0001153', NULL, 0, '0000-00-00'),
(24, '0001155', NULL, 0, '0000-00-00'),
(25, '0001156', NULL, 0, '0000-00-00'),
(26, '0001952', NULL, 0, '0000-00-00'),
(27, '0002103', NULL, 0, '0000-00-00'),
(28, '0002124', NULL, 0, '0000-00-00'),
(29, '0002133', NULL, 0, '0000-00-00'),
(30, '0002139', NULL, 0, '0000-00-00'),
(31, '0002142', NULL, 0, '0000-00-00'),
(32, '0002146', NULL, 0, '0000-00-00'),
(33, '0002148', NULL, 0, '0000-00-00'),
(34, '0002149', NULL, 0, '0000-00-00'),
(35, '0002150', NULL, 0, '0000-00-00'),
(36, '0002151', NULL, 0, '0000-00-00'),
(37, '0002155', NULL, 0, '0000-00-00'),
(38, '0002156', NULL, 0, '0000-00-00'),
(39, '0002162', NULL, 0, '0000-00-00'),
(40, '0002166', NULL, 0, '0000-00-00'),
(41, '0002168', NULL, 0, '0000-00-00'),
(42, '0002954', NULL, 0, '0000-00-00'),
(43, '0009275', NULL, 0, '0000-00-00'),
(44, '0009297', NULL, 0, '0000-00-00'),
(45, '0009901', NULL, 0, '0000-00-00'),
(46, '0001142', NULL, 0, '0000-00-00');
