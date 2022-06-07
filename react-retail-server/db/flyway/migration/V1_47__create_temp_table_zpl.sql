CREATE TABLE `print_payload_temp` (
  `id` int(20) NOT NULL,
  `epc` varchar(250) NOT NULL,
  `payload` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `print_payload_temp`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `print_payload_temp`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT;
COMMIT;