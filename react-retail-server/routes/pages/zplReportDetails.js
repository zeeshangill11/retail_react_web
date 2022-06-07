var main_table = '';
function getstoreinfo(){
    $(document).ready(function() {
        
        const params = new URLSearchParams(window.location.search)

        var uid = params.get('uid');

      


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
                $(".data-tables").css('visibility','visible');
                $(".before_load_table").hide();
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
            }, 
            'serverMethod': 'post',
            'ajax': {
                'url':'/api/1.0.0/stockCountRecords/GetZPLReportDataDeatails/',
                "data": 
                function ( d ) {
                    return $.extend( {}, d, {
                        "Storeid": $('#Storeid').val(),
                        "Epc":$('#Epc').val(),
                        "uid":uid,
                    } );
                },
            },  
            "responsive": true,
            "columns": [
                { "data": "uid" },
                { "data": "epc" },
                { "data": "suppliername" },
                { "data": "qty" },
                { "data": "storeid" },
                { "data": "printerid" },
                { "data": "zplid" },
                { "data": "status" },
                { "data": "Retail_Product_Price" },
                { "data": "Retail_Product_VAT" },
                { "data": "Retail_Product_SP_VAT_EN" },
                // { "data": "action" },
            ],
            "searching": false,
            "select": true
        });
    }); 
}

$('.run').click(function(){

   main_table.ajax.reload(); 
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


var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");



