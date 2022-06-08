var main_table =[];
function gettop20under(){
	$(document).ready(function() {
  
		const params = new URLSearchParams(window.location.search)

        var date = params.get('date');
        var store_id = params.get('store_id');
        var show_over = params.get('show_over');
        //alert(store_id)
        var brand_id = '';
        brand_id = params.get('brand_id');
        var department_id = '';
        department_id = params.get('department_id');

       
        if(brand_id !==''){
            brand = brand_id;
        }
        
        if(department_id !==''){
            department = department_id
        }

		main_table= $('#dataTable').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'AllUnders'
                },{

                    extend: 'print',
                    title: 'AllUnders'      
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
				'url':'/api/1.0.0/stockCountRecords/getunderall/',
				"data": 
                function ( d ) {
                    return $.extend( {}, d, {
                        "date": date,
                        "storeid": store_id,
                        "bid": brand,
                        "dptid":department,
                        "show_over":show_over  
                    } );
                },
			
			},	
			"responsive": true,
			"columns": [
				{ "data": "skucode" },
				{ "data": "departmentid" },
				{ "data": "brandname" },
				{ "data": "color" },
				{ "data": "size" },
				{ "data": "expected" },
				{ "data": "counted" },
				{ "data": "diff" },
				{ "data": "season" },
				{ "data": "suppliername" },
				{ "data": "price" },
                { "data": "totalprice" },
                { "data": "supplier_item_no" },
			],
			"searching":false,
			'columnDefs': [ {
                'targets': [1,2,5,6,7,8], /* column index */
                'orderable': false, /* true or false */
             }],
		});
	});

}
var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");
 gettop20under()
