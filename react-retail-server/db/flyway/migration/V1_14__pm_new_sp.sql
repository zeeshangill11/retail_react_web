DROP PROCEDURE IF EXISTS `product_item_master_itemss`; 
DELIMITER $$
CREATE PROCEDURE `product_item_master_items_insert`(
   
   IN `var_store_id` VARCHAR(255), 
   IN `var_sku` VARCHAR(255), 
   IN `var_product_name` VARCHAR(255),
   IN `var_product_des` VARCHAR(255), 
  
   IN `var_epc` VARCHAR(255), 
   IN `var_last_detected_time` VARCHAR(255), 
   IN `var_user` VARCHAR(255), 
   IN `var_zone` VARCHAR(255),

   IN `var_department_id` VARCHAR(255),
   IN `var_brand` VARCHAR(255), 
   IN `var_color` VARCHAR(255), 
   IN `var_size` VARCHAR(255), 
   IN `var_sfsr` VARCHAR(255), 
   IN `var_status` VARCHAR(255), 
   IN `var_group_name` VARCHAR(255), 
   IN `var_group_description` VARCHAR(255), 
   IN `var_dept` VARCHAR(255), 
   IN `var_departmentname` VARCHAR(255), 
   IN `var_brand_description` VARCHAR(255), 
   IN `var_barcode` VARCHAR(255), 
   IN `var_model` VARCHAR(255), 
   IN `var_subgroup` VARCHAR(255), 
   IN `var_sgroup` VARCHAR(255),
   IN `var_ean_no` VARCHAR(255) ,
   IN `var_sp_net` VARCHAR(255),
   IN `var_season` VARCHAR(255),
   IN `var_vat` VARCHAR(255),
   IN `var_sales_area` VARCHAR(255),
   IN `var_sp_gross_eng` VARCHAR(255),
   IN `var_sp_gross_arb` VARCHAR(255),
   IN `var_supplier_item_no` VARCHAR(255),
   IN `var_supplier_name` VARCHAR(255),
   IN `var_type_no` VARCHAR(255),
   IN `var_arabic_desc` VARCHAR(255),
   IN `var_origin` VARCHAR(255),
   IN `var_english_desc` VARCHAR(255),
   IN `var_company` VARCHAR(255),
   IN `var_currency` VARCHAR(255),
   IN `var_cost` VARCHAR(255),
   IN `var_image_url` VARCHAR(255) 
   )
BEGIN
   
        DECLARE my_sku DECIMAL(10,2) DEFAULT 0;
        
        SELECT skucode 
        INTO my_sku
        FROM product_item_master
        WHERE `skucode` = var_sku;

        IF my_sku = '' THEN

        insert into product_item_master set  `storeid`= var_store_id,
        `skucode`= var_sku,
        `product_name`= var_product_name,
        `product_des`= var_product_des,
        `epc`= var_epc,
        `last_detected_time`= var_last_detected_time,
        `user`= var_user,
        `zone`= var_zone,
        `departmentid`= var_department_id,
        `brand`= var_brand,
        `color`= var_color,
        `size`= var_size,
        `sfsr`= var_sfsr,
        `status`= var_status,
        `group_name`= var_group_name,
        `group_description`= var_group_description,
        `dept`= var_dept,
        `departmentname`=  var_departmentname,
        `brand_description`= var_brand_description,
        `barcode`= var_barcode,
        `model`= var_model,
        `subgroup`= var_subgroup,
        `sgroup` = var_sgroup,
        `ean_no` = var_ean_no ,
        `sp_net` = var_sp_net,
        `season`= var_season,
        `vat`= var_vat,
        `sales_area` = var_sales_area,
        `sp_gross_eng` = var_sp_gross_eng,
        `sp_gross_arb` = var_sp_gross_arb,
        `supplier_item_no` = var_supplier_item_no,
        `supplier_name`= var_supplier_name,
        `type_no`= var_type_no,
        `arabic_desc`= var_arabic_desc,
        `origin`= var_origin,
        `english_desc`= var_english_desc,
        `company`= var_company,
        `currency`= var_currency,
        `cost`= var_cost,
        `image_url`= var_image_url; 


        ELSE

           
         update product_item_master set  `storeid`= var_store_id,`skucode`= var_sku,
        `product_name`= var_product_name,
        `product_des`= var_product_des,
        `epc`= var_epc,
        `last_detected_time`= var_last_detected_time,
        `user`= var_user,
        `zone`= var_zone,
        `departmentid`= var_department_id,
        `brand`= var_brand,
        `color`= var_color,
        `size`= var_size,
        `sfsr`= var_sfsr,
        `status`= var_status,
        `group_name`= var_group_name,
        `group_description`= var_group_description,
        `dept`= var_dept,
        `departmentname`=  var_departmentname,
        `brand_description`= var_brand_description,
        `barcode`= var_barcode,
        `model`= var_model,
        `subgroup`= var_subgroup,
        `sgroup`= var_sgroup,`ean_no` = var_ean_no ,
        `sp_net` = var_sp_net,
        `season`= var_season,
        `vat`= var_vat,
        `sales_area` = var_sales_area,
        `sp_gross_eng` = var_sp_gross_eng,
        `sp_gross_arb` = var_sp_gross_arb,
        `supplier_item_no` = var_supplier_item_no,
        `supplier_name`= var_supplier_name,
        `type_no`= var_type_no,
        `arabic_desc`= var_arabic_desc,
        `origin`= var_origin,
        `english_desc`= var_english_desc,
        `company`= var_company,
        `currency`= var_currency,
        `cost`= var_cost,
        `image_url`= var_image_url where `skucode`= var_sku ;
             
        END IF;
       
        


    END$$
DELIMITER ;