var main_table = '';
function GetUserRoles(){
	$(document).ready(function() {
		main_table =		$('#dataTable').DataTable( {
			dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'UserRoles'
                },{

                    extend: 'print',
                    title: 'UserRoles'      
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
				'url':'/api/1.0.0/stockCountRecords/GetUserRoles/'
			},	
			"responsive": true,
			
			"columns": [
				{ "data": "role_id" },
				{ "data": "role_name" },
				// { "data": "storename" },
				{ "data": "createddate" },
				{ "data": "viewpermissions" },
				{"data":'action'},
			],
			'columnDefs': [ {
                'targets': [3,4], /* column index */
                'orderable': false, /* true or false */
             }],
			"searching": false,
		});
	});
}
GetUserRoles();
var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

function storeName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var storename = '';
            storename += '<option value="" store_id="0">All Stores</option>';
            for(var i = 0; i < response_data.length; i++){
                storename += '<option value="'+response_data[i].storeid+'" store_id="'+response_data[i].storeid+'" storename="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';					
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');
        }
    });
}
storeName();
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
			url: "/api/1.0.0/stockCountRecords/RolesDelete",
			data:"id="+id,
			success: function(data)
			{
				var response = JSON.parse(data);
				
				swal("Poof! Your Record has been deleted !", {
			      icon: "success",
			    });
				main_table.ajax.reload();
				// if(response.title != 'Error'){
				// 	initiazeTable().then(function(response){
				// 	}).catch(function(error){
				// 		console.log(error);
				// 		resolve(0);
				// 	});
				// }
			}
		});
	    
	  } else {
	    swal("Your Record is safe !");
	  }
	});

});
	//Edit Record.

$(document).on('click','.RoleEdit', function(){
	
	var edit_id = $(this).attr('edit_id');
	window.location.href='editUserRoles?edit_id='+edit_id;
		
});
$(document).on('click','.permission', function(){	
	var role_id = $(this).attr('role_id');
	$(".modal-title").text('Permissions');
	var mythis = $('#UserRoles');
	mythis.find('.waiting').show();
	$.ajax({
		type:'POST',
		data: "role_id="+role_id,
		url: "/api/1.0.0/stockCountRecords/Viewpermission",
		success: function(data)
		{
			var response_data = JSON.parse(data);
			mythis.find('.waiting').hide();
			$("#permissions_list").html('<ul><li>'+response_data[0].user_permission+'</li></ul>')

				
			  var permission = JSON.parse(response_data[0].user_permission)
			  
			  	var list = '';
				list += '<ul>';

				for(i = 0 ;i<permission.length;i++){

					list += '<li>'+permission[i]+'</li>';	
				}			
				list +='</ul>';

				$("#permissions_list").html(list);				
		}
	});
	
});

$(document).on('click','.storename', function(){	
		var role_id = $(this).attr('role_id');
		$(".modal-title").text('Store Name');
			
		var mythis = $('#UserRoles');
		mythis.find('.waiting').show();  	

	$.ajax({
		type:'POST',
		data: "role_id="+role_id,
		url: "/api/1.0.0/stockCountRecords/ViewStores",
		success: function(data)
		{
			var response_data = JSON.parse(data);
			mythis.find('.waiting').hide();
			
			var list = '';
			list += '<ul>';
			for(i = 0 ;i<response_data.length;i++){
				
				list += '<li>'+response_data[i].storename+'</li>';	
			}			
			list +='</ul>';

			$("#permissions_list").html(list);								
		}
	});	
})