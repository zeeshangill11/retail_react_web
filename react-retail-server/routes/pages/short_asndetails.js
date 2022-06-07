var main_table = '';
function getstoreinfo(){
	$(document).ready(function() {
	main_table=	$('#dataTable').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'Short IBT Data'
                },{

                    extend: 'print',
                    title: 'Short IBT Data'       
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
				'url':'/api/1.0.0/stockCountRecords/short_asn_details/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						
						"Date":$('#Date').val(),
						"Asn":$('#Asn').val(),
							
					} );
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "date" },
				{ "data": "asn" },
				{ "data": "source" },
				{ "data": "destination" },
				{ "data": "packed_item" },
                { "data": "transferred_item" },
                { "data": "received_item" },
                { "data": "status" },
			],
            "searching": false,
		});
	}); 
}

$('.run').click(function(){

   main_table.ajax.reload(); 
});

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


