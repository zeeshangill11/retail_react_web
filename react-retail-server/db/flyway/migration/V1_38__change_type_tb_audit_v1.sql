update `tb_audit` set  date='0000-00-00 00:00:00';
ALTER TABLE `tb_audit` CHANGE `date` `date` DATETIME NULL DEFAULT NULL, CHANGE `deviceid` `deviceid` VARCHAR(20) NULL DEFAULT NULL, CHANGE `storeid` `storeid` VARCHAR(20) NULL DEFAULT NULL, CHANGE `user_id` `user_id` VARCHAR(20) NULL DEFAULT NULL;
