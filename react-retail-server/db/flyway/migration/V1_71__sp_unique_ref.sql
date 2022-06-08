DELIMITER $$
CREATE OR REPLACE PROCEDURE `get_reference_value`(
 IN `var_qty` VARCHAR(255) 

)
BEGIN


SELECT reference_value FROM reference_table;
UPDATE  reference_table SET reference_value=(reference_value+var_qty);
END$$
DELIMITER ;