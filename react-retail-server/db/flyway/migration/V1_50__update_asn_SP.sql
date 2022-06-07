DELIMITER $$
CREATE PROCEDURE `asn_fix_321`(IN `var_asn` VARCHAR(255), IN `var_P_S` VARCHAR(255))
BEGIN
     DECLARE P_S_V varchar (255);
     DECLARE asn_v varchar (255);
     DECLARE total_duplicate_packing  varchar (255);
     DECLARE total_duplicate_shipping  varchar (255);
     DECLARE total_duplicate_receiving  varchar (255);
     SET P_S_V = var_P_S;
     SET asn_v = var_asn;
   
        IF P_S_V = 'packing' THEN  
         
    SELECT GROUP_CONCAT(id)
        INTO total_duplicate_packing
        FROM asn_items
        where asn=asn_v and process_status='open' and process = 'packing' group by tag_id having count(tag_id)>1;


          IF total_duplicate_packing !='' THEN
             UPDATE asn_items SET is_deleted = '1' where id in(SELECT min(id) FROM `asn_items` where asn=asn_v and process_status='open' and process = 'packing' group by tag_id having count(tag_id)>1);
             update `asn_master` set packed_item=(select count(*) from asn_items where asn=asn_v and process_status='open' ) where asn=asn_v;
	
    END IF;
        ELSEIF   P_S_V = 'shipping' THEN  
        	
          SELECT GROUP_CONCAT(id)
    INTO total_duplicate_shipping
    FROM asn_items
    where asn=asn_v and process_status='intransit' and process = 'shipping' group by tag_id having count(tag_id)>1;
  
        
        
        IF total_duplicate_shipping !='' THEN
        
            UPDATE asn_items SET is_deleted = '1' where id in(SELECT min(id) FROM `asn_items` where 
            asn=asn_v and process_status='intransit' and process = 'shipping' group by tag_id having 		count(tag_id)>1);

            update `asn_master` set transferred_item=(select count(*) from asn_items where 
             asn=asn_v and process_status='intransit' ) where asn=asn_v;
            
            
          END IF;  
            
        ELSEIF   P_S_V = 'receiving' THEN 
        
        
         SELECT GROUP_CONCAT(id)
    INTO total_duplicate_receiving
    FROM asn_items
    where asn=asn_v and process_status='closed' and process = 'receiving' group by tag_id having count(tag_id)>1;
  
        
         IF total_duplicate_receiving !='' THEN
             UPDATE asn_items SET is_deleted = '1' where id in(SELECT min(id) FROM `asn_items` where 
            asn=asn_v and process_status='closed' and process = 'receiving' group by tag_id having count(tag_id)>1);

            update `asn_master` set received_item=(select count(*) from asn_items where 
             asn=asn_v and process_status='closed' ) where asn=asn_v;
             
             
            END IF;   
             
        ELSE
            SELECT * FROM asn_master WHERE 0;
        END IF;

    

END$$
DELIMITER ;
