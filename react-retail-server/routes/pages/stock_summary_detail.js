var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

function storeName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {

            var response_data = JSON.parse(data);
            //console.log(response_data);
            var storename = '';
           
            storename += '<option value="" store_id="0">Select Name</option>';
            for(var i = 0; i < response_data.length; i++){
                storename += '<option value="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                 
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');

            
        }
    });
}
storeName();

function critical_out_of_stock(){
    
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/inventoryData/CriticalOutOfStocksummary_DetailsReport",
        data:{
            "storeid": $( "#StoreID" ).val(),
            "from_my_date":$( "#FromDate" ).val(),    
            "to_my_date" :$('#ToDate').val()
        },
        success: function(data)
        {

            var response_data = JSON.parse(data);
            //console.log(response_data);
            var critical_out_of_stock = '';
            //console.log('sssssssssssss')
            // if(response_data !== undefined && response_data !== ''){
                
                for(var i = 0; i < response_data.length; i++){
                    // console.log(response_data[i].storeid);
                    // console.log(response_data[i].CriticalStock);
                    $('#critical_out_of_stock_'+response_data[i].storeid+"_"+i).html('<span>'+response_data[i].CriticalStock+'</span>');                 
                }

            // }
            

            
        }
    });
}


var main_table = [];
function getstoreinfo(){
	$(document).ready(function() {
		main_table = $('#dataTable').DataTable( {
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',  
                    action: newExportAction,
                    title: 'Stock Summary Details'
                },{

                    extend: 'print', 
                    title: 'Stock Summary Details'      
                },
            ],
			"pageLength": 150,
			'processing': true,
            "initComplete": function( settings, json ) {
                //$(".data-tables").css('visibility','visible');
                $(".before_load_table").hide();
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
            },  
			'serverSide': true,
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/inventoryData/getStockSummaryDetails_Report/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"storeid": $( "#StoreID" ).val(),
						"from_my_date":$( "#FromDate" ).val(),    
                        "to_my_date" :$('#ToDate').val(),
					} );
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "date" },
				{ "data": "storename" },
				{ "data": "onhandtotal" },
                { "data": "inventroycount" },
				{ "data": "item_accuracy" },
				{ "data": "operational_accuracy" },
                { "data": "onhandmatching"},
                { "data": "missingtotal"},
                { "data": "overtotal"},
                { "data": "critical_out_of_stock"},
                { "data": "counted_sf"},
                { "data": "counted_sr"},

			],
            'columnDefs': [ {
               'targets': [0,3], /* column index */
                'orderable': false, /* true or false */
             }],
			"searching": false,
		});
	}); 
}


getstoreinfo();


$('.run').click(function(){
	

    var working = false;
    var error = 0;

    var FromDate = new Date($('#FromDate').val());
    var ToDate = new Date($('#ToDate').val());
    var Source = $('#StoreID').val();

    if(Source ==''){
        error = 1;
      $('.Source_error').html('Please Select Store !');  
    
    }else{
        $('.Source_error').html('');
    }
   

    if(FromDate !== '' && ToDate!==''){
        
         
        if (FromDate > ToDate){
            error = 1;
            $('.Date_error').html('From Date must be less then To Date !'); 
        } else{
           $('.Date_error').html('');  
        }  
    }
    
   
    if(error == 0){
        //console.log('aaa');
        $(".data-tables").css('visibility','visible');
        $(".before_load_table").hide();
        working = true;
        main_table.ajax.reload();
        setTimeout(function(){
          critical_out_of_stock();  
      },3000)
        
    }  
    
});


