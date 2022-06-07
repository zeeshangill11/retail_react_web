ALTER TABLE `asn_master`  
ADD `packing_status` VARCHAR(128) NOT NULL  AFTER `receiving_date`,  
ADD `shipping_status` VARCHAR(128) NOT NULL  AFTER `packing_status`,  
ADD `receiving_status` VARCHAR(128) NOT NULL  AFTER `shipping_status`,  
ADD `packing_ref_list_id` VARCHAR(128) NOT NULL  AFTER `receiving_status`,  
ADD `shipping_ref_list_id` VARCHAR(128) NOT NULL  AFTER `packing_ref_list_id`,  
ADD `receiving_ref_list_id` VARCHAR(128) NOT NULL  AFTER `shipping_ref_list_id`;

ALTER TABLE `asn_master` CHANGE `packing_status` `packing_status` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, CHANGE `shipping_status` `shipping_status` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, CHANGE `receiving_status` `receiving_status` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, CHANGE `packing_ref_list_id` `packing_ref_list_id` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, CHANGE `shipping_ref_list_id` `shipping_ref_list_id` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL, CHANGE `receiving_ref_list_id` `receiving_ref_list_id` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
