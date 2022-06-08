/*var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);*/
var main_table = '';
function getstoreinfo(){
	$(document).ready(function() {
		const params = new URLSearchParams(window.location.search)

        var store = params.get('store');

        var date = params.get('date');
        $(".dateTime").html("<span>Payload Date: "+date+"</span>");

		main_table=	$('#dataTable').DataTable( {
			dom: 'Bfrtip',
	        buttons: [
	            {
	                extend: 'excel',
	                action: newExportAction,
	                title: 'IBT Details'
	            },{

	                extend: 'print',
	                title: 'IBT Details'       
	            },
	        ],
			"pageLength": 25,
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
				'url':'/api/1.0.0/stockCountRecords/StorePayload/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"store":store,
						"date":date
					});
				},
			},	
			"responsive": true,
			"columns": [
				/*{ "data": "date" },
				{ "data": "store_name" },
				{ "data": "iot_total" },*/
				{ "data": "recent_payload" }
			],
			"searching": false,
			"order": [[ 0, 'desc' ]],
		});
	}); 
}

getstoreinfo();