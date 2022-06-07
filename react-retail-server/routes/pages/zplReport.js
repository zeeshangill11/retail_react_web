var main_table = '';
function getstoreinfo(){
    $(document).ready(function() {
        
 
    $('.datepicker22').datepicker({format:'yyyy-mm-dd'});


    main_table= $('#dataTable').DataTable( {
             dom: 'Bfrtip',

            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'AsnData'
                },{

                    extend: 'print',
                    title: 'AsnData'       
                },
            ],
            "pageLength": 25,   
            'processing': true,
            'serverSide': true,
             "initComplete": function( settings, json ) {
                // $(".data-tables").css('visibility','visible');
                $(".before_load_table").hide();
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
            }, 
            'serverMethod': 'post',
            'ajax': {
                'url':'/api/1.0.0/stockCountRecords/GetZPLReportData/',
                "data": 
                function ( d ) {
                    return $.extend( {}, d, {
                        "Storeid": $('#Storeid').val(),
                        "Epc":$('#Epc').val(),
                        "uid":$('#uid').val(),
                        "date22":$('#date').val(),
                        "user_id":$('#user_id').val(),
                    } );
                },
            }, 
            "order": [[1, 'desc']], 
            "responsive": true,
            "columns": [
                { "data": "uid" },
                { "data": "epc" },
                { "data": "sku" },
                { "data": "Product_Name" },
                { "data": "PO_NO" },
                  { "data": "Supplier_ID" },
                { "data": "Shipment_no" },
                { "data": "Comments" },
                // { "data": "qty" },
                 { "data": "storeid" },
                // { "data": "printerid" },
                // { "data": "zplid" },
                 { "data": "status" },
                // { "data": "Retail_Product_Price" },
                // { "data": "Retail_Product_VAT" },
                // { "data": "Retail_Product_SP_VAT_EN" },
               
            ],
            "searching": false,
            "select": true
        });
    }); 
}

$('.run').click(function(){
    var error = 0;
    var $this = $('#ZPLreportFilters');
    var StoreID =  $('#Storeid').val();
    if(StoreID == ''){
     //   error = 1;
       // $this.find('.Store_error').html('Please Select Store !'); 
    
    }else{
        
        $this.find('.Store_error').html(''); 
    }
    if(error == 0){
        $(".data-tables").css('visibility','visible');
        main_table.ajax.reload(); 
    }
   
});

getstoreinfo();

function getasnDetails(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);

            var Type = '';
            Type += '<option value="">Store</option>';
            for(var i = 0; i < response_data.length; i++){
                Type += '<option value="'+response_data[i].storename+'">'+response_data[i].storename+'</option>';                   
            }
            $("#Storeid").html(Type);
            $('#Storeid').selectpicker('refresh');

           

             
        }
    });
}
getasnDetails();


function get_user_datail()
{
     $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getUsers",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            //console.log(response_data);

            var Type = '';
            Type += '<option value="">User ID</option>';
            for(var i = 0; i < response_data.length; i++){
                Type += '<option value="'+response_data[i].id+'">'+response_data[i].username+'</option>';                   
            }
            $("#user_id").html(Type);
            $('#user_id').selectpicker('refresh');

           

             
        }
    });
}

get_user_datail();


var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");


$(document).on('click','.zpl_details', function(){  

    var uid = $(this).attr('uid');
   
    window.location.href="zplReportDetails?uid="+uid;
});


