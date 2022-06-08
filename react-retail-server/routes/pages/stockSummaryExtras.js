var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

var main_table = '';
function getstoreinfo(){
	$(document).ready(function() {
	
	main_table=	$('#dataTable').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'IBT Data'
                },{

                    extend: 'print',
                    title: 'IBT Data'       
                },
            ],
			"pageLength": 1000,
            "order": [[ 0, "desc" ]],	
			'processing': true,
			'serverSide': true,
			 "initComplete": function( settings, json ) {
                //$(".data-tables").css('visibility','visible');
                $(".before_load_table").hide();
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
            }, 
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/stockCountRecords/get_extra_stock_count/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"FromDate":$( "#FromDate" ).val(),
                        "StoreID":$('#StoreID').val(),
                        "Payload":$('#Payload').val(),
                       
					});
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "sku" },
				{ "data": "qty" }
				// { "data": "transferred_item" },
    //             { "data": "received_item" },
    //             { "data": "db_status" },
    //             { "data": "status" }
                
			],
			"searching": false,
			"select": true,
            "order": [[ 0, 'desc' ]],
            "paging": false
            // "columnDefs": [
            //     { "visible": false, "targets": 5 }
            // ]
		});
	}); 
}


getstoreinfo();


    
function storeName(){
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/stockCountRecords/getStoreName",
            success: function(data)
            {
                var response_data = JSON.parse(data);
                var storename = '';
                storename += '<option value="" store_id="0">All Stores</option>';
                for(var i = 0; i < response_data.length; i++){
                    storename += '<option value="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                  
                }
                $("#StoreID").html(storename);
                $('#StoreID').selectpicker('refresh');
            }
        });
    }
storeName();


$('.run').click(function(){
    
    var working = false;
    var error = 0;

    var FromDate = new Date($('#FromDate').val());
   
  

    // if(FromDate !== ''){
        
    //     error = 1;
    //     $('.Date_error').html('From Date must be less then To Date !'); 
      
    // }else{
    //     $('.Date_error').html('');  
    // }

   
    if(error == 0){
        
        $(".data-tables").css('visibility','visible');
        $(".before_load_table").hide();
            


        working = true;
        main_table.ajax.reload();
    }  
})

