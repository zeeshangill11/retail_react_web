ALTER TABLE `product_item_master` ADD `style` VARCHAR(128) NOT NULL AFTER `image_url`, ADD `country` VARCHAR(128) NOT NULL AFTER `style`, ADD `supplier_no` VARCHAR(128) NOT NULL AFTER `country`, ADD `po_supplier_no` VARCHAR(128) NOT NULL AFTER `supplier_no`;