CREATE TABLE `notificaton_asn` (
  `id` int(20) NOT NULL,
  `asn` varchar(250) NOT NULL,
  `send_mail` int(1) NOT NULL DEFAULT 0,
  `datetime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `notificaton_asn`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `notificaton_asn`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT;
COMMIT;

