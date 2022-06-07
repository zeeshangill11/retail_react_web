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
				'url':'/api/1.0.0/stockCountRecords/getstoreinfo/',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"storeid": $( "#StoreID" ).val(),
						"Company":$( "#Company" ).val(),
						"Country":$( "#Country" ).val(),
					} );
				},
			},	
			"responsive": true,
			"columns": [
				{ "data": "storeid" },
				{ "data": "storename" },
				{ "data": "store_location" },
				{ "data": "lat_lng" },
				{ "data": "store_country" },
                { "data": "store_company" },
                { "data": "store_type" },
                { "data": "status"},
                { "data": "action"},

			],
            'columnDefs': [ {
                'targets': [4,6,7], /* column index */
                'orderable': false, /* true or false */
             }],
			"searching": false,
		});
	}); 
}


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


$('.run').click(function(){
   
    var storeid = $("#StoreID").val();
    //alert(storeid)
	var Company =	$("#Company").val();
	//alert(Company)
	var Country =	$("#Country").val();
	//alert(Country)
	main_table.ajax.reload();

});







function storeName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {

            var response_data = JSON.parse(data);
            //console.log(response_data);
            var storename = '';
           
            storename += '<option value="" store_id="0">Select Name</option>';
            for(var i = 0; i < response_data.length; i++){
                storename += '<option value="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                 
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');

            
        }
    });
}
storeName();



function getStoreCompany(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreCompany",
        success: function(data)
        {

            var response_data = JSON.parse(data);
            //console.log(response_data);
           
            var storecompany = '';
            var storecountry = '';
            // var StoreCode = '';
           

            storecompany += '<option value="" store_id="0">Select Company</option>';
            for(var i = 0; i < response_data.length; i++){
                storecompany += '<option value="'+response_data[i].store_company+'" store_id="'+response_data[i].storeid+'" storename="'+response_data[i].storename+'">'+response_data[i].store_company+'</option>';                 
            }
            $("#Company").html(storecompany);
            $('#Company').selectpicker('refresh');


            
        }
    });
}
getStoreCompany();



function store_country(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/store_country",
        success: function(data)
        {

            var response_data = JSON.parse(data);
            //console.log(response_data);
           
            var storecountry = '';
           


            storecountry += '<option value="" store_id="0">Select Country</option>';
            for(var i = 0; i < response_data.length; i++){
                storecountry += '<option value="'+response_data[i].store_country+'" store_id="'+response_data[i].store_country+'" storename="'+response_data[i].storename+'">'+response_data[i].store_country+'</option>';                 
            }
            $("#Country").html(storecountry);
            $('#Country').selectpicker('refresh');

            
        }
    });
}
store_country();




$('#StoreID').selectpicker({
    noneSelectedText : 'Store'
});

$('#Company').selectpicker({
    noneSelectedText : 'Company'
});
$('#Country').selectpicker({
    noneSelectedText : 'Country'
});

$('#StoreCode').selectpicker({
    noneSelectedText : 'Code'
});

// Delete Record..
$(document).on('click','.deleteRecord', function(){
	var id = $(this).attr('del_id');
    var store_name = $(this).attr('store_name');
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
			url: "/api/1.0.0/stockCountRecords/storeDelete",
			data:{
                "store_name":store_name,
                "id":id
            },
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

$(document).on('click','.StoreEdit', function(){
	
	var edit_id = $(this).attr('edit_id');
	window.location.href='editstore?edit_id='+edit_id;		
});