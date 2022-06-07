
CREATE VIEW View_stock_count AS
SELECT * FROM stock_count
WHERE stockcountdate >= DATE_ADD(NOW(),INTERVAL -90 DAY);

CREATE VIEW View_epc AS
SELECT * FROM epc
WHERE check_date >= DATE_ADD(NOW(),INTERVAL -90 DAY);

CREATE VIEW View_epc_detail AS
SELECT * FROM epc_detail
WHERE date >= DATE_ADD(NOW(),INTERVAL -90 DAY);

CREATE VIEW View_asn_items AS
SELECT * FROM asn_items
WHERE date >= DATE_ADD(NOW(),INTERVAL -90 DAY);


CREATE VIEW View_asn_master AS
SELECT * FROM asn_master
WHERE date >= DATE_ADD(NOW(),INTERVAL -90 DAY);







