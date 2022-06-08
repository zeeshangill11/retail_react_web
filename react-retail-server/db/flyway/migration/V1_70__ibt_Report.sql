CREATE TABLE `ibt_report` (
  `id` int(20) NOT NULL,
  `ibt` varchar(250) DEFAULT NULL,
  `portal_status` varchar(250) DEFAULT NULL,
  `iot_status` varchar(250) DEFAULT NULL,
  `status_match` varchar(250) DEFAULT NULL,
  `process` varchar(250) DEFAULT NULL,
  `ibt_date` date DEFAULT NULL,
  `send_mail` int(2) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `ibt_report`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `ibt_report`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT;
COMMIT;
