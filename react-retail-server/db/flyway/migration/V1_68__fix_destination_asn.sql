DELIMITER $$
CREATE PROCEDURE `fix_destinaion_asn`(
   
    IN `var_asn` VARCHAR(255)
)
BEGIN
	 DECLARE check_destination varchar (255);
     	
      SELECT AM.destination INTO check_destination  FROM `asn_master` AM 
	  INNER JOIN asn_items AI ON AM.asn=AI.asn WHERE AM.asn = var_asn
      AND AI.process_status = 'intransit' 
      AND AI.process = 'shipping' and AI.is_deleted='0' GROUP BY AI.asn; 
   		
      IF (check_destination IS NULL or check_destination = '') THEN  
   		
        update asn_master SET 
destination = (select destination_location from asn_items where process='shipping' and process_status = 'intransit' AND asn = var_asn  and is_deleted='0' GROUP BY asn);
        
      END IF;
    
END$$
DELIMITER ;