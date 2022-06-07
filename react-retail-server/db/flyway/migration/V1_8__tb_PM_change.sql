
ALTER TABLE `product_item_master` ADD `sp_net` VARCHAR(128) NOT NULL AFTER `ean_no`, ADD `season` VARCHAR(128) NOT NULL AFTER `sp_net`, ADD `vat` VARCHAR(128) NOT NULL AFTER `season`, ADD `sales_area` VARCHAR(128) NOT NULL AFTER `vat`, ADD `sp_gross_eng` VARCHAR(128) NOT NULL AFTER `sales_area`, ADD `sp_gross_arb` VARCHAR(128) NOT NULL AFTER `sp_gross_eng`, ADD `supplier_item_no` VARCHAR(128) NOT NULL AFTER `sp_gross_arb`, ADD `supplier_name` VARCHAR(128) NOT NULL AFTER `supplier_item_no`, ADD `type_no` VARCHAR(128) NOT NULL AFTER `supplier_name`;




ALTER TABLE `zpl_printer` ADD `load_id` INT(250) NOT NULL AFTER `Retail_Product_SupplierItemNum`;