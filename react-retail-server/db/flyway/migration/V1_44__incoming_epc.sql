
CREATE TABLE `incoming_epc` (
  `id` int(250) NOT NULL,
  `Retail_CycleCountID` varchar(128) DEFAULT NULL,
  `store_id` varchar(120) DEFAULT NULL,
  `epc` varchar(250) DEFAULT NULL,
  `item_code` double DEFAULT NULL,
  `last_detected_time` varchar(100) DEFAULT NULL,
  `user` varchar(100) DEFAULT NULL,
  `zone` varchar(100) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `check_date` date DEFAULT NULL,
  `place` varchar(128) DEFAULT NULL,
  `status` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `incoming_epc`
--
ALTER TABLE `incoming_epc`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `incoming_epc`
--
ALTER TABLE `incoming_epc`
  MODIFY `id` int(250) NOT NULL AUTO_INCREMENT;
COMMIT;
