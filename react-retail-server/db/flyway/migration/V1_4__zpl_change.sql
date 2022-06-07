ALTER TABLE `zpl_printer` ADD `Retail_Product_Price` VARCHAR(128) NOT NULL AFTER `status`, ADD `Retail_Product_VAT` VARCHAR(128) NOT NULL AFTER `Retail_Product_Price`, ADD `Retail_Product_SP_VAT_EN` VARCHAR(128) NOT NULL AFTER `Retail_Product_VAT`;

ALTER TABLE `zpl_printer` ADD `Retail_Product_Color` VARCHAR(250) NOT NULL AFTER `Retail_Product_SP_VAT_EN`, ADD `Retail_Product_Size` VARCHAR(250) NOT NULL AFTER `Retail_Product_Color`, ADD `Retail_Product_Season` VARCHAR(250) NOT NULL AFTER `Retail_Product_Size`, ADD `Retail_Product_Gender` VARCHAR(250) NOT NULL AFTER `Retail_Product_Season`, ADD `Retail_Product_SupplierItemNum` VARCHAR(250) NOT NULL AFTER `Retail_Product_Gender`;


ALTER TABLE `zpl_printer` CHANGE `zplid` `zplid` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;