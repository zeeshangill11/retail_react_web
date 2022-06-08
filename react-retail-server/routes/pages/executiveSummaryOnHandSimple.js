var main_table = [];
function ExecutiveSummaryOnHandSimple(){
    $(document).ready(function() {

    

       const params = new URLSearchParams(window.location.search)

        var date = params.get('date');
        var store_id = params.get('store_id');

        var show_over = params.get('show_over');
        
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
                    title: 'ExecutiveSummaryOnHand'
                },{

                    extend: 'print',
                    title: 'ExecutiveSummaryOnHand'      
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
                'url':'/api/1.0.0/inventoryData/OneHandSimple',
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
                { "data": "departmentname" },
                { "data": "brand" },
                { "data": "color" },
                { "data": "size" },
                { "data": "initial" },
                { "data": "counted" },
                { "data": "overs" },

            ],
            'columnDefs': [ {
                'targets': [6,7], /* column index */
                'orderable': false, /* true or false */
             }],
            "searching": false,
        })
    });
}


//setTimeout(function(){
    // var columns = main_table.settings().init().columns;
    // main_table.columns().every(function(index) { 
    //     console.log(columns[index].mData);
    // })
    //alert( 'Data source: '+main_table.ajax.url() );
   //alert(main_table.columns().names())
// },1000)


var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");                              

ExecutiveSummaryOnHandSimple();

