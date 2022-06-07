DROP PROCEDURE IF EXISTS `goods_item_warehouse_duplication`;
DROP PROCEDURE IF EXISTS `goods_item_store_duplication`;


DELIMITER $$
CREATE  PROCEDURE `goods_item_store_duplication`(
    IN `var_epc` VARCHAR(255), 
    IN `var_store` VARCHAR(255),
    IN `var_Retail_CycleCountID` VARCHAR(255)
    )
BEGIN
    
     DECLARE total_duplicate_epc  varchar (255);
        
    SELECT GROUP_CONCAT(goods_item_store_id) INTO total_duplicate_epc FROM goods_item_store 
        WHERE epc = var_epc AND store = var_store GROUP BY epc HAVING COUNT(epc)>1;

          IF total_duplicate_epc !='' THEN
          
            UPDATE goods_item_store t1
            INNER JOIN goods_item_store t2
            set t1.is_deleted  = '1' 
            WHERE 
            t1.goods_item_store_id < t2.goods_item_store_id and  
            t1.epc = var_epc and t2.epc = var_epc and t1.store = var_store and t2.store = var_store  and t1.Retail_CycleCountID = var_Retail_CycleCountID and t2.Retail_CycleCountID = var_Retail_CycleCountID;
             
             
             
             
        ELSE
            SELECT * FROM goods_item_store WHERE 0;
        END IF;

    

END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `goods_item_warehouse_duplication`(
    IN `var_epc` VARCHAR(255), 
    IN `var_store` VARCHAR(255),
    IN `var_Retail_CycleCountID` VARCHAR(255)
)
BEGIN
    
     DECLARE total_duplicate_epc  varchar (255);
        
    SELECT GROUP_CONCAT(goods_item_warehouse_id) INTO total_duplicate_epc FROM goods_item_warehouse 
        WHERE epc = var_epc AND store = var_store GROUP BY epc HAVING COUNT(epc)>1;

          IF total_duplicate_epc !='' THEN
          
          
             UPDATE goods_item_warehouse t1
            INNER JOIN goods_item_warehouse t2
            set t1.is_deleted  = '1' 
            WHERE 
            t1.goods_item_warehouse_id < t2.goods_item_warehouse_id and  
            t1.epc = var_epc and t2.epc = var_epc and t1.store = var_store and t2.store = var_store and t1.Retail_CycleCountID = var_Retail_CycleCountID and t2.Retail_CycleCountID = var_Retail_CycleCountID;
              
        ELSE
            SELECT * FROM goods_item_warehouse WHERE 0;
        END IF;

    

END$$
DELIMITER ;