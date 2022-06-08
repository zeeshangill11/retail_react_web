var main_table = '';

function getprinter(){
	$(document).ready(function() {
	main_table =	$('#dataTable').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'Printer'
                },{

                    extend: 'print',
                    title: 'Printer'      
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
				'url':'/api/1.0.0/stockCountRecords/getprinter/'
			},	
			"responsive": true,
			"columns": [
				{ "data": "id" },
				{ "data": "name" },
				{ "data": "ip" },
				{ "data": "port" },
				{ "data": "storeid" },
				{ "data": "status" },
				{ "data": "remarks" },
				{ "data": "action" },
                
			],
			"oLanguage": {
			   "sSearch": "IP Address"
			 },
			 'columnDefs': [ {
                'targets': [4,5,7], /* column index */
                'orderable': false, /* true or false */
             }],
			 "searching": false,
		});
	}); 
}


getprinter();

var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

$(document).on('click','.deleteRecord', function(){
	var id = $(this).attr('del_id');
	swal({
	  title: "Are you sure?",
	  text: "You won't be able to revert this !",
	  icon: "warning",
	  buttons: true,
	  dangerMode: true,
	})
	.then((willDelete) => {
	  if (willDelete) {
  		$.ajax({
			type:'POST',
			url: "/api/1.0.0/stockCountRecords/DeletePrinter",
			data:"id="+id,
			success: function(data)
			{
				var response = JSON.parse(data);
				
				swal("Poof! Your Record has been deleted !", {
			      icon: "success",
			    });
				main_table.ajax.reload();
				if(response.title != 'Error'){
					// initiazeTable().then(function(response){
					// }).catch(function(error){
					// 	console.log(error);
					// 	resolve(0);
					// });
				}
			}
		});
	    
	  } else {
	    swal("Your Record is safe !");
	  }
	});

});

$(document).on('click','.PrinterEdit', function(){
	
	var edit_id = $(this).attr('edit_id');
	window.location.href='editprinter?edit_id='+edit_id;
		
});

