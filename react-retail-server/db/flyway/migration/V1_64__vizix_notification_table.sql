CREATE TABLE `vizix_notification` (
  `id` int(20) NOT NULL,
  `storename` varchar(250) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `status` int(2) NOT NULL DEFAULT 0,
  `vizix_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `vizix_notification`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `vizix_notification`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT;
COMMIT;
