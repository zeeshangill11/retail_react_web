var main_table = [];
function getstoreinfo(){
	$(document).ready(function() {
	main_table=	$('#dataTable').DataTable( {
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'GoodsStockWareHouse'
                },{

                    extend: 'print',
                    title: 'GoodsStockWareHouse'       
                },
            ],
			"pageLength": 25,
            "order": [[ 0, "desc" ]],
			'processing': true,
             "initComplete": function( settings, json ) {
                // $(".data-tables").css('visibility','visible');
                $(".before_load_table").hide();
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
            }, 
			'serverSide': true,
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/stockCountRecords/getgoodswarehouse/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"store_id": $( "#StoreID" ).val(),
                        "RetailItemBatchId":$( "#RetailItemBatchId" ).val(),
                        "from_my_date":$( "#FromDate" ).val(),  
                        "to_my_date" :$('#ToDate').val(),
                        "EPC" :$('#EPC').val(),
                        "SKU" :$('#SKU').val(),	
                        "supplier_number" :$('#supplier_number').val(),
                        "shipment_number" :$('#shipment_number').val(),
                        "Retail_Item_Batch_Id" :$('#Retail_Item_Batch_Id').val(),
					} );
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "date" },
                { "data": "refno" },
                { "data": "retail_item_batch_id" },
                { "data": "supplier_number" },
                { "data": "shipment_number" },
                { "data": "store" },
                { "data": "purchase_order" },
                
                { "data": "epc" },
                { "data": "remarks" },
                { "data": "id" },
                { "data": "comments" },
			],
            'columnDefs': [ {
                'targets': [2,,3,5], /* column index */
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


function StoreName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
           
            var StoreID = '';
            	StoreID += '<option value="all_destination" StoreID="0">All Destination</option>';
            for(var i = 0; i < response_data.length; i++){
                StoreID += '<option value="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';					
            }
            $("#StoreID").html(StoreID);
            $('#StoreID').selectpicker('refresh');
        }
    });
}
StoreName();

function GetStoreInfoGoodsWareHoue(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/GoodsWareHoue_retail_item_batch_id",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var retail_item_batch_id = '';
             retail_item_batch_id += '<option value="">All RetailItemBatchId</option>';
            for(var i = 0; i < response_data.length; i++){
                retail_item_batch_id += '<option value="'+response_data[i].retail_item_batch_id+'">'+response_data[i].retail_item_batch_id+'</option>';                  
            }
            $("#RetailItemBatchId").html(retail_item_batch_id);
            $('#RetailItemBatchId').selectpicker('refresh');

        }
    });
}
GetStoreInfoGoodsWareHoue();

$('.run').click(function(){
    var $this = $('#GoodsInForm');
    var working = false;
    var error = 0;

    var FromDate = new Date($('#FromDate').val());
    var ToDate = new Date($('#ToDate').val());

    var StoreID = $( "#StoreID" ).val();
    // if(StoreID =='' ){
    //     error = 1;
    //   $this.find('.Destination_error').html('Please Select Destination !');  
    
    // }else{
    //     $this.find('.Destination_error').html('');
    // }

    if(FromDate !== '' && ToDate!==''){
        
         
        if (FromDate > ToDate){
            error = 1;
            $this.find('.Date_error').html('From Date must be less then To Date !'); 
        } else{
           $this.find('.Date_error').html('');  
        }  
    }

   
    if(error == 0){
        $(".data-tables").css('visibility','visible')
        //console.log('aaa');
        working = true;
        main_table.ajax.reload();
    }  
});
$('#StoreID').selectpicker({
    noneSelectedText : 'All Destinations'
});
