ALTER TABLE `product_item_master` ADD `arabic_desc` VARCHAR(512) NOT NULL AFTER `type_no`;


ALTER TABLE `product_item_master` ADD `origin` VARCHAR(250) NOT NULL AFTER `arabic_desc`, 
ADD `english_desc` VARCHAR(250) NOT NULL AFTER `origin`, 
ADD `company` VARCHAR(250) NOT NULL AFTER `english_desc`, 
ADD `currency` VARCHAR(250) NOT NULL AFTER `company`,
ADD `cost` VARCHAR(250) NOT NULL AFTER `currency`, 
ADD `image_url` VARCHAR(250) NOT NULL AFTER `cost`;



ALTER TABLE `product_item_master` 
CHANGE `ean_no` `ean_no` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `sp_net` `sp_net` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `season` `season` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `vat` `vat` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `sales_area` `sales_area` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `sp_gross_eng` `sp_gross_eng` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `sp_gross_arb` `sp_gross_arb` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `supplier_item_no` `supplier_item_no` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `supplier_name` `supplier_name` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `type_no` `type_no` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `arabic_desc` `arabic_desc` VARCHAR(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `origin` `origin` VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `english_desc` `english_desc` VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `company` `company` VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `currency` `currency` VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `cost` `cost` VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, 
CHANGE `image_url` `image_url` VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;