DROP VIEW `view_epc`;
CREATE VIEW View_epc AS
SELECT `Retail_CycleCountID`, `store_id`, `epc`, `item_code`,`department`, `brand`, `color`, `size`, `check_date` FROM epc
WHERE check_date >= DATE_ADD(NOW(),INTERVAL -90 DAY);
DROP VIEW `view_asn_items`;
CREATE VIEW view_asn_items AS
SELECT `original_location`, `process_status`, `process`,  `tag_id`, `destination_location`,  `asn`, `store_id`, `date`, `brand`, `sku` FROM asn_items
WHERE date >= DATE_ADD(NOW(),INTERVAL -90 DAY);
DROP VIEW `view_epc_detail`;
CREATE VIEW view_epc_detail AS
SELECT `store_id`, `epc`, `item_code`, `Retail_CycleCountID`,`department`, `brand`, `color`, `size`, `date`, `action_done` FROM epc_detail
WHERE date >= DATE_ADD(NOW(),INTERVAL -90 DAY);
CREATE VIEW view_goods_item_store AS
SELECT * FROM goods_item_store
WHERE date >= DATE_ADD(NOW(),INTERVAL -90 DAY);
CREATE VIEW view_goods_item_warehouse AS
SELECT * FROM goods_item_warehouse
WHERE date >= DATE_ADD(NOW(),INTERVAL -90 DAY);







