DROP VIEW View_asn_items;
CREATE VIEW View_asn_items AS
select
    `asn_items`.`original_location` as `original_location`,
    `asn_items`.`process_status` as `process_status`,
    `asn_items`.`process` as `process`,
    `asn_items`.`tag_id` as `tag_id`,
    `asn_items`.`destination_location` as `destination_location`,
    `asn_items`.`asn` as `asn`,
    `asn_items`.`store_id` as `store_id`,
    `asn_items`.`date` as `date`,
    `asn_items`.`brand` as `brand`,
    `asn_items`.`sku` as `sku`
from
    `asn_items`
where 
is_deleted = '0' and 
    `asn_items`.`date` >= current_timestamp() + interval -90 day;

