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
	                title: 'Usersinfo'
	            },{

                	extend: 'print',
                	title: 'Usersinfo'		
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
	        } ,


	        'serverSide': true,
	        'serverMethod': 'post',
	        'ajax': {
	            'url':  '/api/1.0.0/inventoryData/GetApiRetails/',
	            "data": 
	            function ( d ) {
	                return $.extend( {}, d, {
	                    "request_name": $( "#request_name" ).val(),
	                    "envoirment":$('#envoirment').val(),    
	                } );
	            },
	        },  
	        "responsive": true,
	        "columns": [
	            { "data": "id" },
	            { "data": "request_name" },
	            { "data": "envoirment" },
	            { "data": "endpoint" },
	            { "data": "server_protocol" },
	            { "data": "payload" },
	            { "data": "action" },
	           
	        ],
	        'columnDefs': [ {
                'targets': [5], /* column index */
                'orderable': false, /* true or false */
             }],
	        "searching": false,
	    });

	}); 
}

getstoreinfo();
$('.run').click(function(){
   
   
	main_table.ajax.reload();
});




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
			url: "/api/1.0.0/stockCountRecords/RetailDelete",
			data:"id="+id,
			success: function(data)
			{
				var response = JSON.parse(data);
				
				swal("Poof! Your Record has been deleted !", {
			      icon: "success",
			    });
				main_table.ajax.reload();
				
			}
		});
	    
	  } else {
	    swal("Your Record is safe !");
	  }
	});

});

//Edit Record.

$(document).on('click','.RetialEdit', function(){
	
	var edit_id = $(this).attr('edit_id');
	window.location.href='editretailapi?edit_id='+edit_id;
		
});

$(document).on('click','.Run', function(){
	
	var run_id = $(this).attr('run_id');
	window.location.href='runRetailApis?run_id='+run_id;
		
});


