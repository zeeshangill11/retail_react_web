ALTER TABLE `product_item_master` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;

ALTER TABLE `product_item_master` CHANGE `status` `status` VARCHAR(128) NULL DEFAULT NULL;


