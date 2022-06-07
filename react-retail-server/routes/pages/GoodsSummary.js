var main_table = '';
var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>"); 

function today(){
    var mydate = new Date();

    //var month = (mydate.getMonth().toString().length < 2 ? "0"+mydate.getMonth().toString() :mydate.getMonth());

    const monthNames = ["01", "02", "03", "04", "05", "06",
      "07", "08", "09", "10", "11", "12"
    ];

    var month = monthNames[mydate.getMonth()];
    
    var date = (mydate.getDate().toString().length < 2 ? "0"+mydate.getDate().toString() :mydate.getDate());

    var year = mydate.getFullYear();
    var today_date = year+"-"+month+"-"+ date;
    return today_date;
}

function StoreID(){
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
StoreID();

$(document).ready(function() {
    $('#FromDate').val(today());
    $('#ToDate').val(today());
    $(".before_load_table").hide();
	main_table=$('#dataTable').DataTable( {
        dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'GoodsStockStore'
                },{

                    extend: 'print',
                    title: 'GoodsStockStore'       
                },
            ],
			"pageLength": 25,
            "order": [[ 0, "desc" ]],
			'processing': true,
			'serverSide': true,
             "initComplete": function( settings, json ) {
                
                
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
            }, 
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/stockCountRecords/getgoodssummary/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"store_id": $( "#StoreID" ).val(),
						"RetailItemBatchId":$( "#RetailItemBatchId" ).val(),
						"from_my_date":$( "#FromDate" ).val(),	
                        "to_my_date" :$('#ToDate').val(),
					} );
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "store" },
                { "data": "retail_item_batch_id" },
                { "data": "item_count" },
                { "data": "date" }
                
                
			],
            'columnDefs': [ {
                'targets': [0,1,2,3], /* column index */
                'orderable': false, /* true or false */
             }],
            "searching": false,
		});
	}); 

$('.run').click(function(){
    var $this = $('#GoodsInForm');
    var working = false;
    var error = 0;

    var FromDate = new Date($('#FromDate').val());
    var ToDate = new Date($('#ToDate').val());


    var StoreID = $( "#StoreID" ).val();
   
    if(FromDate !== '' && ToDate!==''){
        
        if (FromDate > ToDate){
            error = 1;
            $this.find('.Date_error').html('From Date must be less then To Date !'); 
        } else{
           $this.find('.Date_error').html('');  
        }  
    }

   
    if(error == 0){
        //console.log('aaa');
        $(".data-tables").css('visibility','visible');
        working = true;
        main_table.ajax.reload();
    }  
});
$('#StoreID').selectpicker({
    noneSelectedText : 'All Destinations'
});


$(document).on('click','.goods_info', function(){  

    var retail_item_batch_id = $(this).attr('retail_item_batch_id');
    var store_id = $('#StoreID').val(); 
    var item_count = $(this).attr('item_count');

    var FromDate = $('#FromDate').val();
    var ToDate = $('#ToDate').val();

    var cond = '';

    if(retail_item_batch_id !=='' && typeof(retail_item_batch_id) !=="undefined"){

        cond +='&retail_item_batch_id='+retail_item_batch_id
    }

    if(store_id !=='all_destination'){
        store_id = store_id
    }else{
        store_id = $(this).attr('store_id');     
    }


    if(item_count!=='' && typeof(item_count)!== "undefined"){
        cond +='&item_count='+item_count
    }

    if(FromDate!=='' ){
        cond +='&FromDate='+FromDate
    }

    if(ToDate!=='' ){
        cond +='&ToDate='+ToDate
    }
    

    window.location.href="GoodsDetail?store_id="+store_id+cond;
});