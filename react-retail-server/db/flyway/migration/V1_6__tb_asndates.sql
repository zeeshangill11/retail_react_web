ALTER TABLE `asn_master` ADD `packing_date` DATETIME NOT NULL AFTER `packing_remarks`;
ALTER TABLE `asn_master` ADD `shipping_date` DATETIME NOT NULL AFTER `shipping_remarks`;
ALTER TABLE `asn_master` ADD `receiving_date` DATETIME NOT NULL AFTER `receiving_remarks`;