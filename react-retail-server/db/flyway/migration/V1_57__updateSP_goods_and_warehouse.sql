DELIMITER $$
CREATE PROCEDURE `update_goods_ware_house`(
    IN `var_EPC` VARCHAR(255)
)
BEGIN
   
    UPDATE goods_item_warehouse GW 
	INNER JOIN zpl_printer ZP ON GW.epc = ZP.epc 
	SET GW.supplier_number=ZP.Supplier_ID, 
	GW.shipment_number=ZP.Shipment_no WHERE GW.epc = var_EPC;
     
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `update_goods_item_store`(
    IN `var_EPC` VARCHAR(255)
)
BEGIN
   
    UPDATE goods_item_store GS 
	INNER JOIN zpl_printer ZP ON GS.epc = ZP.epc 
	SET GS.supplier_number=ZP.Supplier_ID, 
	GS.shipment_number=ZP.Shipment_no WHERE GS.epc = var_EPC;
     
END$$
DELIMITER ;