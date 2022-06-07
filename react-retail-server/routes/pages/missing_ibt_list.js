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
	const params = new URLSearchParams(window.location.search)

    var asn_id = params.get('asn_id');
        
    main_table=$('#dataTable').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'IBT Difference'
                },{

                    extend: 'print',
                    title: 'IBT Difference'      
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
				'url':'/api/1.0.0/stockCountRecords/missing_ibt_listReport/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"asn": asn_id	
					});
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "rec_epc" },
				{ "data": "ship_epc" },
				
				
				
               
			],
            'columnDefs': [ {
                'targets': [0,1], /* column index */
                'orderable': false, /* true or false */
            }],
			"searching": false,
			"paging": false
			
		});
	}); 
}

getstoreinfo();
$('.run').click(function(){
   
	main_table.ajax.reload();
});





