var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");
var checkboxValue = false
$(document).on('change','#show_details',function(){
    checkboxValue = $(this).is(':checked');
    // alert(checkboxValue);
});

var main_table = '';
function getstoreinfo(){
    $(document).ready(function() {
    
    main_table= $('#dataTable').DataTable( {
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',
                    action: newExportAction,
                    title: 'IBT Data'
                },{

                    extend: 'print',
                    title: 'IBT Data'       
                },
            ],
            "pageLength": 1000,
            "order": [[ 0, "desc" ]],   
            'processing': true,
            'serverSide': true,
             "initComplete": function( settings, json ) {
                //$(".data-tables").css('visibility','visible');
                $(".before_load_table").hide();
            },
            'language': {
                'loadingRecords': '&nbsp;',
                'processing': '&nbsp; &nbsp; Please wait... <br><div class="spinner"></div>'
            }, 
            'serverMethod': 'post',
            'ajax': {
                'url':'/api/1.0.0/stockCountRecords/get_problem_asn/',
                "data": 
                function ( d ) {
                    return $.extend( {}, d, {
                        "from_my_date":$( "#FromDate" ).val(),
                        "Asn":$('#Asn').val(),
                        "show_details":checkboxValue
                    });
                },
            },  
            "responsive": true,
            "columns": [
                { "data": "asn" },
                 { "data": "db_status" },
                { "data": "status" },

                { "data": "packing_date" },
                { "data": "shipping_date" },
                { "data": "receiving_date" },
                { "data": "packed_item" },
                { "data": "transferred_item" },
                { "data": "received_item" }
               
                
            ],
            "searching": false,
            "select": true,
            "order": [[ 0, 'desc' ]]
            // "columnDefs": [
            //     { "visible": false, "targets": 5 }
            // ]
        });
    }); 
}

function getfaultyrecord(){
    var table = $('#dataTable tbody');
    var faulty = '';

    table.find('tr').each(function(i,el){
        $tds = $(this).find('td');
        faulty = $tds.eq(6).text();
        // console.log(faulty)    
        faulty = $.trim(faulty);
        if(faulty=="red")
        {
            // alert(faulty)
            $(this).find('td').css("background","red");
        }

    });
}


$('.run').click(function(){
    var $this = $('#AsnForm');
    var working = false;
    var error = 0;

    
    var FromDate = $('#FromDate').val();
   
    if(FromDate == ''){
        error = 1;
        $this.find('.Date_error').html('Please Select Date !');  
       
    }else{
        $this.find('.Date_error').html('');  
    }

   
    if(error == 0){
        //console.log('aaa');
        $(".data-tables").css('visibility','visible');
        $(".before_load_table").hide();
        working = true;
        main_table.ajax.reload();
        setTimeout(function(){
            getfaultyrecord();
        },3000)
    }  
})

getstoreinfo();

