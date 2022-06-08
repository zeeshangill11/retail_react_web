var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

                   

var main_table = [];

function getstoreinfo(){
	$(document).ready(function() {
		main_table = $('#dataTable').DataTable( {
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',  
                    action: newExportAction,
                    title: 'StoreInfo'
                },{

                    extend: 'print', 
                    title: 'StoreInfo'      
                },
            ],
			"pageLength": 150,
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
				'url':'/api/1.0.0/inventoryData/admin_error_logReport/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"storeid": $( "#StoreID" ).val(),
					});
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "date_time" },
				{ "data": "file_name" },
                { "data": "view_file" },
			],
            'columnDefs':[{
               'targets': [0,1,2], /* column index */
                'orderable': false, /* true or false */
            }],
			"searching": false,
            "paging": false
		});
	}); 
}


getstoreinfo();



$(document).on('click','.clear_file',function(){

    $.ajax({
        type:'POST',
        url: "/api/1.0.0/inventoryData/clear_fileReport",
        success: function(data)
        {
           
            main_table.ajax.reload();
            console.log(data);

           // alert( $("#StoreID").val());
        }
    });

});


