DELETE FROM product_item_master
WHERE ID NOT IN
(
    SELECT MIN(ID)
    FROM product_item_master
    GROUP BY item_code
)