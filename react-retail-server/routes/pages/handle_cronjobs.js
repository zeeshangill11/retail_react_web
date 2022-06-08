var main_table = '';
function GetUserRoles(){
	$(document).ready(function() {
		//alert($('#Process').val());
		main_table =$('#dataTable').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction, 
                    title: 'CronJobs'
                },{

                    extend: 'print',
                    title: 'CronJobs'      
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
				'url':'/api/1.0.0/stockCountRecords/handlercronjobsApi/',
				"data": 
				function ( d ) {
                    return $.extend( {}, d, {
                        'Retail_CycleCountID':$('#Retail_CycleCountID').val(),
						'Date':$('#Date').val(),
						'status':$('#status').val(),
						'process_type':$('#process_type').val(),
						'store_id':$('#store_id').val(),
                    } );
                },
			},	
			"responsive": true,
			
			"columns": [
				{ "data": "id" },
				{ "data": "Retail_CycleCountID" },
				{ "data": "DateTIme" },
				{ "data": "store_id" },
				{ "data": "destinationStore" },
				{ "data": "status" },
				{ "data": "process_type" },
				{"data":'action'},
			],
			"searching": false,
		});
	});
}
GetUserRoles();
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


$(document).on('click','.cronjob_run',function(){
	var cronjob_id = $(this).attr('cronjob_id');
	
	$.ajax({
        type:'POST',
        data:{
        	cronjob_id:cronjob_id
        },
        url: "/api/1.0.0/stockCountRecords/updateCronJobtable",
        success: function(data)
        {
            var response_data = JSON.parse(data);

          main_table.ajax.reload();
           
                      

        }
    });
	
});

function GETprocess(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/SelectFiltersCronjob",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);
            var Process = '';
         	
            process_type += '<option value="" id="0">Select Process</option>';
            for(var i = 0; i < response_data.length; i++){
                process_type += '<option value="'+response_data[i].process_type+'">'+response_data[i].process_type+'</option>';                 
            }
            $("#process_type").html(process_type);
            $('#process_type').selectpicker('refresh');

           

           
        }
    });
}

GETprocess();


function GETStore(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);
            var Process = '';
         	var store_id = '';
            

            store_id += '<option value="" id="0">Select store</option>';
            for(var i = 0; i < response_data.length; i++){
                store_id += '<option value="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                 
            }
            $("#store_id").html(store_id);
            $('#store_id').selectpicker('refresh');

           
        }
    });
}

GETStore();