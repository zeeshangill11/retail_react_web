DELIMITER $$
CREATE PROCEDURE `product_item_master_check`()
BEGIN
 	DECLARE data_from_product_item_master_1  varchar (255);
    DECLARE data_from_product_item_master_2  varchar (255);
    
	select count(Skucode) INTO data_from_product_item_master_1 from product_item_master_2;
    
    IF data_from_product_item_master_1 != ''  THEN
        select count(*) INTO data_from_product_item_master_2 FROM product_item_master_2 WHERE NOT EXISTS ( SELECT 1
        from
            product_item_master
        WHERE
            product_item_master_2.skucode = product_item_master.skucode 
           );
       
       IF data_from_product_item_master_2 !='' THEN 
       	
        INSERT INTO product_item_master (storeid,skucode,product_name,product_des,epc,item_code,last_detected_time,
  user,zone,departmentid,brand,color,size,sfsr,status,group_name,group_description,dept,departmentname,brand_description,barcode,
  model,subgroup,sgroup,ean_no,sp_net,season,vat,sales_area,sp_gross_eng,sp_gross_arb,supplier_item_no,supplier_name,
  type_no,arabic_desc,origin,english_desc,company,currency,cost,image_url,style,country,supplier_no,po_supplier_no)  
SELECT storeid,skucode,product_name,product_des,epc,item_code,last_detected_time,user,zone,departmentid,brand,color,size,sfsr,
status,group_name,group_description,dept,departmentname,brand_description,barcode,model,subgroup,sgroup,ean_no,sp_net,season,vat,sales_area,sp_gross_eng,
sp_gross_arb,supplier_item_no,supplier_name,type_no,arabic_desc,origin,english_desc,company,currency,cost,image_url,style,country,supplier_no,po_supplier_no

FROM    product_item_master_2 WHERE NOT EXISTS ( SELECT 1
    from
        product_item_master
WHERE product_item_master_2.skucode = product_item_master.skucode 
   );
   
   UPDATE product_item_master t1 
        INNER JOIN product_item_master_2 t2 ON t1.skucode = t2.skucode
SET t1.product_name =t2.product_name,
t1.product_des =t2.product_des,
t1.brand =t2.brand,
t1.color =t2.color,
t1.size =t2.size,
t1.group_name =t2.group_name,t1.departmentname =t2.departmentname,t1.ean_no =t2.ean_no,t1.sp_net =t2.sp_net,
t1.season =t2.season,t1.vat =t2.vat,t1.sales_area =t2.sales_area,t1.sp_gross_eng =t2.sp_gross_eng,
t1.sp_gross_arb =t2.sp_gross_arb,t1.supplier_item_no =t2.supplier_item_no,t1.supplier_name =t2.supplier_name,
t1.type_no =t2.type_no,t1.arabic_desc =t2.arabic_desc,t1.origin =t2.origin,t1.english_desc =t2.english_desc,
t1.company =t2.company,t1.currency =t2.currency,t1.cost =t2.cost,t1.style =t2.style,
t1.country =t2.country,t1.supplier_no =t2.supplier_no,t1.po_supplier_no = t2.po_supplier_no    
        where t1.skucode = t2.skucode;
        
        delete from product_item_master_2;
       	
        
       END IF;
    
    END IF;
    
    
END$$
DELIMITER ;