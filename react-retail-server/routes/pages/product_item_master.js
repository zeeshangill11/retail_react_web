var main_table = [];

function getstoreinfo(){
	$(document).ready(function() {
		main_table = $('#dataTable').DataTable( {
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',  
                    action: newExportAction,
                    title: 'Product item master'
                },{

                    extend: 'print', 
                    title: 'Product item master'      
                },
            ],
			"pageLength": 25,
			'processing': true,
            "initComplete": function( settings, json ) {
                $(".data-tables").css('visibility','visible');
                $(".before_load_table").hide();
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
            },  
			'serverSide': true,
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/inventoryData/product_item_master_controller/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"skucode": $( "#skucode" ).val(),
						"ean":$( "#ean" ).val(),
					} );
				},
			},	
			"responsive": true,
			"columns": [
                { "data": "id" },
              
				{ "data": "skucode" },
               
                { "data": "product_des" },
                { "data": "arabic_desc" },    
                { "data": "item_code" },
                
               

                { "data": "brand" },
                { "data": "color" },
                { "data": "size" },

               

                { "data": "departmentname" },

               

                { "data": "ean_no" },



                { "data": "sp_net" },
                { "data": "season" },
                { "data": "vat" },
                { "data": "sales_area" },
                { "data": "sp_gross_eng" },
                { "data": "sp_gross_arb" },
                { "data": "supplier_item_no" },
                { "data": "supplier_name" },


                { "data": "type_no" },
               
                { "data": "origin" },
                { "data": "english_desc" },
                { "data": "company" },
                { "data": "currency" },
                { "data": "cost" },
                { "data": "image_url" },


                { "data": "country" },
                { "data": "supplier_no" },
                { "data": "po_supplier_no" },

                { "data": "last_detected_time" },
                { "data": "user" },
                { "data": "zone" },
                { "data": "departmentid" },
                { "data": "epc" },

              

                { "data": "product_name" },
                { "data": "storeid" },

                { "data": "sfsr" },
                { "data": "status" },
                { "data": "group_name" },
                { "data": "group_description" },
                { "data": "dept" },

                { "data": "brand_description" },
                { "data": "barcode" },
                { "data": "model" },
                { "data": "subgroup" },
                { "data": "sgroup" },
                



			],
            'columnDefs': [ {
                'targets': [4,6,7], /* column index */
                'orderable': false, /* true or false */
             }],
			"searching": false,
		});
	}); 
}


getstoreinfo();

var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");				                


$('.run').click(function(){
   
   
	main_table.ajax.reload();

});
