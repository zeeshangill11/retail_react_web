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
				'url':'/api/1.0.0/stockCountRecords/ibt_differenceReport/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"ans": $( "#ans" ).val(),
						"datetime": $( "#datetime" ).val(),
							
					} );
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "id" },
				{ "data": "datetime" },
				{ "data": "asn" },
				{ "data": "send_mail" },
				{ "data": "view_details" }
				
               
			],
            'columnDefs': [ {
                'targets': [4], /* column index */
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
$(document).on('click','.missing_ibt', function(){	

	var asn_id = $(this).attr('asn_id');

    window.location.href="missing_ibt_list?asn_id="+asn_id;
});



