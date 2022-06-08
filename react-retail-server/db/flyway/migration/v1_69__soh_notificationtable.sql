CREATE TABLE `soh_notification` (
  `id` int(20) NOT NULL,
  `storename` varchar(250) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `status` int(2) NOT NULL DEFAULT 0,
  `soh_controller` varchar(255) DEFAULT NULL,
  `soh_date` date NOT NULL,
  `soh_mail` int(2) NOT NULL DEFAULT 0,
  `soh_result` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `soh_notification`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `soh_notification`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT;
COMMIT;

