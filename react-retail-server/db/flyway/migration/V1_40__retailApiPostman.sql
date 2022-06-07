CREATE TABLE `retailapis` (
  `id` int(20) NOT NULL,
  `request_name` varchar(250) NOT NULL,
  `envoirment` varchar(250) NOT NULL,
  `endpoint` varchar(250) NOT NULL,
  `payload` text NOT NULL,
  `server_protocol` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `retailapis` (`id`, `request_name`, `envoirment`, `endpoint`, `payload`, `server_protocol`) VALUES
(1, 'CycleCount - SOH per Store (today)', 'POST', 'reportExecution/SOHPERSTORE', '{\r\n\"StoreID\":\"0002115\"\r\n}', 'http'),
(2, 'SUPPLYCHAIN - Open PACKING', 'PATCH', 'things?upsert=true&verboseResult=false', '[{\r\n\"group\": \">RUBAIYAT\",\r\n\"thingTypeCode\": \"ITEM\",\r\n\"serialNumber\": \"0002115_000017405782\",\r\n\"udfs\": {\r\n    \"Retail_Bizlocation_Original\": {\"value\": \"0002115\"},\r\n    \"deviceId\": {\"value\": \"C2A0622C-CB02-41E9-9465-9946B282B38F\"},\r\n    \"Retail_BizTransactionId\": {\"value\": \"testing1\"},\r\n    \"Retail_BizTransactionProcess\": {\"value\": \"packing\"},\r\n    \"Retail_BizTransactionProcessStatus\": {\"value\": \"open\"},\r\n    \"source\": {\"value\": \"MOBILE\"},\r\n    \"user\": {\"value\": \"store2115\"},\r\n    \"remarks\": {\"value\": \"Sample comments when opening a pack\"}\r\n}}\r\n]', 'http');


ALTER TABLE `retailapis`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `retailapis`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;
