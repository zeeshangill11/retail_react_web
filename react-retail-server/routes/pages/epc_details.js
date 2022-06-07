var main_table = '';
function EpcReportDetails(){
	$(document).ready(function() {
		const params = new URLSearchParams(window.location.search)

        var epc = params.get('epc');
		main_table=	$('#dataTable').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'EpcDetails'
                },{

                    extend: 'print',
                    title: 'EpcDetails'       
                },
            ],
			"pageLength": 25,
			"responsive": true,
			'processing': true,
			'serverSide': true,
			 "initComplete": function( settings, json ) {
                $(".data-tables").css('visibility','visible');
                $(".before_load_table").hide();
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
            }, 
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/inventoryData/epc_report_details/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"store_id": $('#store_id').val(),
						"Date":$('#Date').val(),
						"epc":epc,
					} );
				},
			},	
			"columns": [
				{ "data": "date" },
				{ "data": "store_id" },
				{ "data": "epc" },
				{ "data": "item_code" },
                { "data": "zone" },
                { "data": "department" },
                { "data": "brand" },
                { "data": "color" },
                { "data": "size" },
                { "data": "action" },
			],
			"searching": false,
		});
	}); 
}

$('.run').click(function(){

   main_table.ajax.reload(); 
});

EpcReportDetails();

function epcReportFilter(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/inventoryData/epcReportFilter",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);

            var store_id = '';
            store_id += '<option value="">Source</option>';
            for(var i = 0; i < response_data.length; i++){
                store_id += '<option value="'+response_data[i].store_id+'">'+response_data[i].store_id+'</option>';					
            }
            $("#store_id").html(store_id);
            $('#store_id').selectpicker('refresh');             
        }
    });
}
epcReportFilter();


var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");



