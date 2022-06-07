// function departmentID(){
//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/getDepartment",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
//             var department = '';
//             department += '<option value="" department_id="0">All Department</option>';
//             for(var i = 0; i < response_data.length; i++){
//                 department += '<option value="'+response_data[i].departmentid+'" department_id="'+response_data[i].departmentid+'" departmentname="'+response_data[i].departmentname+'">'+response_data[i].departmentid+'</option>';					
//             }
//             $("#DepartmentID").html(department);
//             $('#DepartmentID').selectpicker('refresh');
//         }
//     }); 
// }
// departmentID(); 
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
                storename += '<option value="'+response_data[i].storename+'" store_id="'+response_data[i].storeid+'" storename="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';					
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');
        }
    });
}
storeName();
function BrandName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getBrandNameNewForinventory",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var brand = '';
            brand += '<option value="" brand_id="0">All Brand</option>';
            for(var i = 0; i < response_data.length; i++){
               if(response_data[i].brand_name!="")
               {
                brand += '<option value="'+response_data[i].brand_name+'">'+unescape(response_data[i].brand_name)+'</option>';                  
               }
            }
            $("#BrandID").html(brand);
            $('#BrandID').selectpicker('refresh');
        }
    });
}
BrandName();

function Color(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getColorsForInventory",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);
            var Color = '';
            Color += '<option value="" Color="0">All Colors</option>';
            for(var i = 0; i < response_data.length; i++){
                Color += '<option value="'+response_data[i].color+'">'+
                unescape(response_data[i].color)+'</option>';                  
            }
            $("#Color").html(Color);
            $('#Color').selectpicker('refresh');
        }
    });
}
Color();

function Size(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getSizeForInventory",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);
            var Size = '';
            Size += '<option value="" Color="0">All Size</option>';
            for(var i = 0; i < response_data.length; i++){
                Size += '<option value="'+response_data[i].size+'">'+
                unescape(response_data[i].size)+'</option>';                  
            }
            $("#Size").html(Size);
            $('#Size').selectpicker('refresh');
        }
    });
}
Size();

var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

// function SkuCode(){
//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/getSkuCode",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
          
//             var skucode = '';
//             skucode += '<option value="" skucode_id="0">All SKU</option>';
//             for(var i = 0; i < response_data.length; i++){
//                 skucode += '<option value="'+response_data[i].skucode+'" skucode="'+response_data[i].skucode+'" skucode_name="'+response_data[i].skucode+'">'+response_data[i].skucode+'</option>';					
//             }
//             $("#SkuID").html(skucode);
//             $('#SkuID').selectpicker('refresh');   
//         }
//     });
// }
// SkuCode();

// function Epc(){
//     $.ajax({
//         type:'POST',
//         url: "/api/1.0.0/stockCountRecords/Epc",
//         success: function(data)
//         {
//             var response_data = JSON.parse(data);
//             var epc = '';
//             epc += '<option value="" epc="0">All SKU</option>';
//             for(var i = 0; i < response_data.length; i++){
//                 epc += '<option value="'+response_data[i].epc+'" skucode="'+response_data[i].epc+'" skucode_name="'+response_data[i].epc+'">'+response_data[i].epc+'</option>';					
//             }
//             $("#EPC").html(epc);
//             $('#EPC').selectpicker('refresh');
//         }
//     });
// }
// Epc();


var main_table='';
function GetInventoryByItem(){
	$(document).ready(function() {
		
		main_table = $('#dataTable_inventory').DataTable( {
            dom: 'Bfrtip',

            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'InventoryData Data'
                },{

                    extend: 'print',
                    title: 'InventoryData Data'       
                },
            ],
			"pageLength": 25,
			'processing': true,

            "initComplete": function( settings, json ) {
                // $(".data-tables").css('visibility','visible');
                $(".before_load_table").hide();
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
            },  
            
			'serverSide': true,
			'serverMethod': 'post',
			'ajax': {
				'url':'/api/1.0.0/inventoryData/GetInventoryByItem',
				"data": 
				function ( d ) {
					return $.extend( {}, d, {
						"StoreID":$('#StoreID').val(),
						"epc":$('#EPC').val(),
						"SKU":$('#SKU').val(),
						"DepartmentID":$('#DepartmentID').val(),
						"BrandID":$('#BrandID').val(),
						"Color":$('#Color').val(),
						"Size":$('#Size').val(),
					} );
				},
			},
				
			"responsive": true,
			"columns": [
				//{ "data": "departmentname" },
                { "data": "epc" },
                
                { "data": "item_code" },
                { "data": "store_id" },
                { "data": "brand_name" },
                { "data": "color" },
                { "data": "size" },
                // { "data": "zone" },
                { "data": "ItemDispostion" },
                { "data": "action" },

				
			],
			'columnDefs': [ {
				'targets': [3,4,5,6,7], /* column index */
				'orderable': false, /* true or false */
			 }],
             "searching": false,
			
		})
	});
}
GetInventoryByItem();
// $(document).on('change','#DepartmentID,#BrandID,#StoreID,#EPC,#SkuID', function(){
   
// 	setTimeout(function(){
// 		//alert('----------')
// 		//GetInventoryByItem();
// 		main_table.ajax.reload();
// 	},1000)

// });


$('.run').click(function(){

   var $this = $('#StoreID');
   var error = 0;

  var StoreID = $('#StoreID').val();
  if(StoreID == ''){
    error = 1;

    $('.error_StoreID').html('<span>Plesae Select Store</span>');
  }else{
    $('.error_StoreID').html('<span></span>');
  }
    
  if(error == 0){
    
    $(".data-tables").css('visibility','visible');
    main_table.ajax.reload();
  
  }
   
});

$('#DepartmentID').selectpicker({
    liveSearch: true,
    maxOptions: 1,
    noneSelectedText : 'Select Department'

});
$('#BrandID').selectpicker({
    liveSearch: true,
    maxOptions: 1,
    noneSelectedText : 'Select Brand'
});
$('#StoreID').selectpicker({
    liveSearch: true,
    maxOptions: 1,
    noneSelectedText : 'Select Store'
});
$('#EPC').selectpicker({
    liveSearch: true,
    maxOptions: 1,
    noneSelectedText : 'Select EPC'
});
$('#SkuID').selectpicker({
    liveSearch: true,
    maxOptions: 1,
    noneSelectedText : 'Select SKU'
});


$('#Size').selectpicker({
    noneSelectedText : 'All Size'
});
$('#Color').selectpicker({
    noneSelectedText : 'All Color'
});
   


	


$(document).on('click','.epc_detail', function(){   

    var epc = $(this).attr('epc');
    
    window.location.href="epc_details?epc="+epc;
});

// setTimeout(function(){
 	
// },2000);
