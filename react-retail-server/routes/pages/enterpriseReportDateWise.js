var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

function critical_out_of_stock(store_id,fetch_date) {
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/inventoryData/CriticalOutOfStocksummary_DetailsReport",
        data:{
            "storeid": store_id,
            "from_my_date":fetch_date,
        },
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var critical_out_of_stock = '';
            if(response_data.length > 0){
                for(var i = 0; i < response_data.length; i++){
                    //$('#critical_out_of_stock_'+response_data[i].storeid).html('<span>'+response_data[i].CriticalStock+'</span>');                 
                    $('#critical_out_of_stock_'+response_data[i].storeid).closest('td').html(response_data[i].CriticalStock);                 
                }
            } else {            	
                //$('#critical_out_of_stock_'+store_id).html('<span>0</span>');                 
                $('#critical_out_of_stock_'+store_id).closest('td').html('0');                 
            }
        }
    });
}


var main_table = [];
function getstoreinfo(){
    $(document).ready(function() {
        main_table = $('#dataTable').DataTable( {
            //dom: 'Bfrtip',
             dom: 'Blrtip',
            buttons: [
                {
                    extend: 'excelHtml5',  
                    action: newExportAction,
                    title: 'Stock Summary Details',
                    exportOptions: {
	                    columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11 ]
	                }
                },{

                    extend: 'print', 
                    title: 'Stock Summary Details',
                    exportOptions: {
	                    columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11 ]
	                }     
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
            'serverSide': false,
             'select': true,
            'serverMethod': 'post',
            'ajax': {
                'url':'/api/1.0.0/inventoryData/executiveSummaryDateWise/',
                "data": 
                function ( d ) {
                    return $.extend( {}, d, {
                        "from_my_date":$( "#FromDate" ).val(),
                        "to_my_date":$( "#ToDate" ).val(),
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
               'targets': [0], /* column index */
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

    var FromDate = $('#FromDate').val();
    if(FromDate == ''){
        error = 1;
        $('.Date_error').html('Date must be Selected!');
    } else {
    	FromDate = new Date($('#FromDate').val());   
    }
   
    if(error == 0){
        //console.log('aaa');
        $(".data-tables").css('visibility','visible');
        $(".before_load_table").hide();
        working = true;
        main_table.ajax.reload();
        setTimeout(function(){
        	$('.critical_out_of_stock').each(function() {
			    //console.log($(this).attr("store_id"));
                var storeid = $(this).attr("store_id");
                var date11 = $(this).attr("count_date");
        		critical_out_of_stock(storeid,date11);
			});
      	},6000)
    }

});