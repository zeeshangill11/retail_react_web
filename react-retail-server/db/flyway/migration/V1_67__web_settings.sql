CREATE TABLE `web_settings` (
  `id` int(20) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `url` varchar(250) DEFAULT NULL,
  `key` varchar(250) DEFAULT NULL,
  `value` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `web_settings` (`id`, `url`, `key`, `value`) VALUES
(1, 'http://localhost:8080/', 'external_server', '0');