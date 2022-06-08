
var checkboxValue = false
$(document).on('change','#uae_time',function(){
    checkboxValue = $(this).is(':checked');
    $('#utc_time').prop('checked',false)
    main_table.ajax.reload();
});
var checkboxutc_time = false;
$(document).on('change','#utc_time',function(){
    checkboxutc_time = $(this).is(':checked');
    $('#uae_time').prop('checked',false)
    main_table.ajax.reload();
});


var main_table = '';
function getstoreinfo(){
	$(document).ready(function() {
main_table=$('#dataTable').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'AuditInfo'
                },{

                    extend: 'print',
                    title: 'AuditInfo'      
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
				'url':'/api/1.0.0/stockCountRecords/getauditinfo/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"retail_cyclecount_id": $( "#retail_cyclecount_id" ).val(),
						"LogType": $( "#LogType" ).val(),
						"date": $( "#date" ).val(),
						"StoreID": $( "#StoreID" ).val(),
                        "show_uae_time":checkboxValue,
                        "show_utc_time":checkboxutc_time,	
					} );
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "auditid" },
				{ "data": "audit_text" },
				{ "data": "date" },
				{ "data": "log_type" },
				{ "data": "storeid" },
                { "data": "Retail_CycleCountID" },
				{ "data": "audit_json" },
				{ "data": "deviceid" },
			],
            'columnDefs': [ {
                'targets': [5], /* column index */
                'orderable': false, /* true or false */
            }],
			"searching": false,
			"order": [[ 0, 'desc' ]]
		});
	}); 
}

getstoreinfo();
$('.run').click(function(){
   
	main_table.ajax.reload();
});

function getUserinforMation(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/GetDeviceInfo",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            
            var DeviceID = '';
           	
            DeviceID += '<option value="" id="0">Select Device</option>';
            for(var i = 0; i < response_data.length; i++){
                DeviceID += '<option value="'+response_data[i].deviceid+'">'+response_data[i].deviceid+'</option>';                 
            }
            $("#DeviceId").html(DeviceID);
            $('#DeviceId').selectpicker('refresh');			


        }
    });
}
getUserinforMation();

function LogType(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/log_type",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            
           	var LogType = ''

           //	console.log(response_data);
           

			LogType += '<option value="" id="0">Select Log</option>';
            for(var i = 0; i < response_data.length; i++){
                LogType += '<option value="'+response_data[i].log_type+'">'+response_data[i].log_type+'</option>';                 
            }
            $("#LogType").html(LogType);
            $('#LogType').selectpicker('refresh');

        }
    });
}

LogType();

function storeName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var storename = '';
            storename += '<option value="" store_id="0">Select Stores</option>';
            for(var i = 0; i < response_data.length; i++){
                storename += '<option value="'+response_data[i].storename+'" store_id="'+response_data[i].storeid+'" storename="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                   
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');

           // alert( $("#StoreID").val());
        }
    });
}
storeName();

$('#DeviceId').selectpicker({
    noneSelectedText : 'Select Device'
});
$('#LogType').selectpicker({
    noneSelectedText : 'Select Log Type'
});
$('#StoreID').selectpicker({
    noneSelectedText : 'Select Store'
});

var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");


