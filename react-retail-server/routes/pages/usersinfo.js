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
	            'url':  '/api/1.0.0/stockCountRecords/getusersinfo/',
	            "data": 
	            function ( d ) {
	                return $.extend( {}, d, {
	                    "Name": $( "#Name" ).val(),
	                    "UserName":$('#UserName').val(),    
	                } );
	            },
	        },  
	        "responsive": true,
	        "columns": [
	            { "data": "id" },
	            { "data": "name" },
	            { "data": "username" },
	            { "data": "role_name" },
	            { "data": "storeid" },
	            { "data": "status" },
	            { "data": "last_login" },
	            {"data":'action'},
	        ],
	        'columnDefs': [ {
                'targets': [5,6,7], /* column index */
                'orderable': false, /* true or false */
             }],
	        "searching": false,
	    });

	}); 
}

getstoreinfo();
$('.run').click(function(){
   
    var Name = $("#Name").val();
	var UserName =	$("#UserName").val();
	main_table.ajax.reload();
});

function getUserinforMation(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/GetUserinformationdrop",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);
            var Name = '';
            var Username = '';
            Name += '<option value="" id="0">Select Name</option>';
            for(var i = 0; i < response_data.length; i++){
                Name += '<option value="'+response_data[i].name+'" id="'+response_data[i].id+'">'+response_data[i].name+'</option>';                 
            }
            $("#Name").html(Name);
            $('#Name').selectpicker('refresh');

             Username += '<option value="" id="0">Select User Name</option>';
            for(var i = 0; i < response_data.length; i++){
                Username += '<option value="'+response_data[i].username+'" id="'+response_data[i].id+'">'+response_data[i].username+'</option>';                 
            }
            $("#UserName").html(Username);
            $('#UserName').selectpicker('refresh');
        }
    });
}

getUserinforMation();
$('#Name').selectpicker({
    noneSelectedText : 'Name'
});
$('#UserName').selectpicker({
    noneSelectedText : 'Username'
});
// Delete Record..

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
			url: "/api/1.0.0/stockCountRecords/userDelete",
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

$(document).on('click','.UserEdit', function(){
	
	var edit_id = $(this).attr('edit_id');
	window.location.href='edituser_info?edit_id='+edit_id;
		
});

