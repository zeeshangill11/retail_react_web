ALTER TABLE goods_item_warehouse
ADD is_deleted int(20) DEFAULT '0';
ALTER TABLE goods_item_store
ADD is_deleted int(20) DEFAULT '0';


DELIMITER $$
CREATE PROCEDURE `goods_item_warehouse_duplication`(
    IN `var_epc` VARCHAR(255), 
    IN `var_store` VARCHAR(255)
)
BEGIN
    
     DECLARE total_duplicate_epc  varchar (255);
        
   	SELECT GROUP_CONCAT(goods_item_warehouse_id) INTO total_duplicate_epc FROM goods_item_warehouse 
		WHERE epc = var_epc AND store = var_store and is_deleted = '0'  GROUP BY epc HAVING COUNT(epc)>1;

          IF total_duplicate_epc !='' THEN
             UPDATE goods_item_warehouse SET is_deleted = '1' where goods_item_warehouse_id in(SELECT min(goods_item_warehouse_id) FROM `goods_item_warehouse` WHERE epc=var_epc and store=var_store AND is_deleted<>'1' group by epc having count(epc)>1);
              
        ELSE
            SELECT * FROM goods_item_warehouse WHERE 0;
        END IF;
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE `goods_item_store_duplication`(
    IN `var_epc` VARCHAR(255), 
    IN `var_store` VARCHAR(255)
)
BEGIN
    
     DECLARE total_duplicate_epc  varchar (255);
        
   	SELECT GROUP_CONCAT(goods_item_store_id) INTO total_duplicate_epc FROM goods_item_store 
		WHERE epc = var_epc AND store = var_store and is_deleted = '0' GROUP BY epc HAVING COUNT(epc)>1;

          IF total_duplicate_epc !='' THEN
             UPDATE goods_item_store SET is_deleted = '1' where goods_item_store_id in(SELECT min(goods_item_store_id) FROM `goods_item_store` WHERE epc=var_epc and store=var_store AND is_deleted<>'1' group by epc having count(epc)>1);
                 
        ELSE
            SELECT * FROM goods_item_store WHERE 0;
        END IF;
END$$
DELIMITER ;
