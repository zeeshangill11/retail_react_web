DELIMITER $$
CREATE PROCEDURE `update_epc_from_pm`(
    IN `var_EPC` VARCHAR(255)
)
BEGIN

   UPDATE epc E
	INNER JOIN product_item_master PM ON E.item_code = PM.skucode 
	SET 
	E.brand=PM.brand, 
	E.color=PM.color, 
	E.size=PM.size, 
	E.department=PM.departmentname WHERE E.epc = var_EPC;

END$$
DELIMITER ;