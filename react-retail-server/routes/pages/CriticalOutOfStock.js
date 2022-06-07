var main_table = [];
function getCrticalOutofStock(){
    $(document).ready(function() {
       
       const params = new URLSearchParams(window.location.search)

        var date = params.get('date');
        var store_id = params.get('store_id');
        var show_over = params.get('show_over');
        //alert(store_id)
        var brand_id = '';
        brand_id = params.get('brand_id');
        var department_id = '';
        department_id = params.get('department_id');

       
        if(brand_id !==''){
            brand = brand_id;
        }
        
        if(department_id !==''){
            department = department_id
        }

       
     main_table = $('#dataTable').DataTable( {
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'CriticalOutOfStock'
                },{

                    extend: 'print',
                    title: 'CriticalOutOfStock'      
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
                'url':'/api/1.0.0/inventoryData/CriticalOutOfStock',
                "data": 
                function ( d ) {
                    return $.extend( {}, d, {
                        "date": date,
                        "storeid": store_id,
                        "bid": brand,
                        "dptid":department,
                        "show_over":show_over   
                    } );
                },
            },
                
            "responsive": true,
            "columns": [
                { "data": "code" },
                { "data": "departmentid" },
              
                { "data": "brand_name" },
                { "data": "color" },
                { "data": "size" },
                { "data": "initial" },
                { "data": "counted" },
                { "data": "unexpected" },

                { "data": "missing" },
                { "data": "season" },
                { "data": "suppliername" },
                { "data": "price" },
                { "data": "totalprice" },
           
            ],

            'columnDefs': [ {
                'targets': [6,7], /* column index */
                'orderable': false, /* true or false */
             }],
            "searching": false,
        })
    });  
}
$('.run').click(function(){
   
    var location = $( "#StoreID" ).val();
    var deveice =   $( "#DeviceID" ).val();
    main_table.ajax.reload();
});

var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");                              

getCrticalOutofStock();

