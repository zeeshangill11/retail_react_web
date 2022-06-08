DELIMITER $$
CREATE  PROCEDURE `update_stock_count_0002115_v1`(
                                IN var_sku VARCHAR(255), 
                                IN var_store_id VARCHAR(255), 
                                IN var_date VARCHAR(255))
BEGIN
                                DECLARE total DECIMAL(10,2) DEFAULT 0;
                                DECLARE my_initial DECIMAL(10,2) DEFAULT 0;
                                SELECT count(*),initial 
                                INTO total,my_initial
                                FROM stock_count_0002115
                                WHERE code = var_sku and stockcountdate=var_date and storeid=var_store_id;
                                IF total =0 THEN
                                   insert into stock_count_0002115 set code=var_sku, stockcountdate=var_date, initial=0,counted=1,unexpected=1, storeid=var_store_id,
                                    counted_sf=(SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date and place='salesfloor' ),
                                    counted_sr=(SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date and place='stockroom' );
                                    UPDATE stock_count_0002115 set departmentid= (SELECT department FROM epc_temp where stockcountdate = var_date AND store_id= var_store_id and item_code=var_sku group by item_code ) where code=var_sku;
                                ELSEIF my_initial = 0 THEN 
                                  update stock_count_0002115 set  
                                  unexpected=(SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date AND store_id= var_store_id),
                                  counted=(SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date AND store_id= var_store_id),
                                  counted_sf=(SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date and place='salesfloor' AND store_id= var_store_id ),
                                  counted_sr=(SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date and place='stockroom' AND store_id= var_store_id )
                                    where code=var_sku AND stockcountdate=var_date AND  stockcountdate=var_date ;
                                    UPDATE stock_count_0002115 set departmentid= (SELECT department FROM epc_temp where stockcountdate = var_date AND store_id= var_store_id and item_code=var_sku group by item_code ) where code=var_sku;
                                ELSE
                                  UPDATE stock_count_0002115
                                    set 
                                    counted= (SELECT count(*) FROM epc_temp where 
                                    item_code =var_sku and check_date=var_date AND store_id= var_store_id ), 
                                    counted_sr = (SELECT count(*) FROM epc_temp where  
                                    item_code =var_sku and check_date=var_date 
                                    and place='stockroom' AND store_id= var_store_id), 
                                    counted_sf = (SELECT count(*) FROM epc_temp where  
                                    item_code =var_sku and check_date=var_date and place='salesfloor' AND store_id= var_store_id), 
                                    missing = CASE WHEN initial >=counted THEN (initial - counted)  ELSE 0  END, 
                                    unexpected = CASE  WHEN counted > initial THEN (counted - initial) ELSE 0  END 
                                    WHERE code=var_sku  
                                    AND  stockcountdate = var_date AND storeid= var_store_id;
                                END IF;
                                END$$
DELIMITER ;