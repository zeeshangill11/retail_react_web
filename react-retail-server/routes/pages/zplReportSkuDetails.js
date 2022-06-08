var main_table = '';
function getstoreinfo(){
    $(document).ready(function() {
        
        const params = new URLSearchParams(window.location.search)

        var zku_zpl22 = params.get('zku_zpl');
        var store_id = params.get('store_id');

        var Epc = params.get('Epc');

        var uid = params.get('uid');

        var user_id = params.get('user_id');

        var date22 = params.get('date22');

      
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
                'url':'/api/1.0.0/stockCountRecords/GetZPLReportData_sku_detail/',
                "data": 
                function ( d ) {
                    return $.extend( {}, d, {
                        "Storeid": store_id,
                        "Epc":Epc,
                        "uid":uid,
                        "date22":date22,
                        "user_id":user_id,
                        "zku_zpl22":zku_zpl22
                    } );
                },
            },  
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
                
                { "data": "storeid" },
                
                { "data": "status" },
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




var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");



