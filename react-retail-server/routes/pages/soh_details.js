var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");


function getSOHSummary(){
    $.ajax({
       type:'POST',
        url: "/api/1.0.0/inventoryData/getSOHSummary",
        success:function(data){
            var response_data = JSON.parse(data);
            //console.log(response_data);
            for (var i = 0;i <response_data.length;i++) {
                // console.log(response_data[i].onhandtotal);
                $('#on_hand_matching_'+response_data[i].mystore).text(response_data[i].onhandtotal);
                $('#counted_'+response_data[i].mystore).text(response_data[i].inventroycount);
            }

        } 
    });
}


function getSOHSummary_yesterday(){
    $.ajax({
       type:'POST',
        url: "/api/1.0.0/inventoryData/getSOHSummary_yesterday",
        success:function(data){
            var response_data = JSON.parse(data);
            //console.log(response_data);
            for (var i = 0;i <response_data.length;i++) {
                // console.log(response_data[i].onhandtotal);
                $('#yesterday_soh_'+response_data[i].mystore).text(response_data[i].onhandtotal);
                //$('#counted_'+response_data[i].mystore).html('<span>'+response_data[i].inventroycount+'</span');
            }

        } 
    });
}


function calculate(var_yserday_onhand_matching,var_onhand_matching){


    var yesterday_onhand_matching_per = var_yserday_onhand_matching;
    var onhand_matching_per = var_onhand_matching;
    

    var pEarned = parseInt(yesterday_onhand_matching_per);
    var pPos = parseInt(onhand_matching_per); 
   
    var perc="";
    if(isNaN(pPos) || isNaN(pEarned)){
        perc=" ";
       }else{
       perc = ((pEarned/pPos) * 100).toFixed(3);
    }

    return perc;
}

function getDetails_soh(){

    var table = $("#dataTable tbody");
    var change_color = '';
    var yesterday_soh = '';
    var current_soh = '';
    var get_percentage = '';
    var $tds = '';
    table.find('tr').each(function (i, el) {
        $tds = $(this).find('td');
        yesterday_soh = $tds.eq(3).text();
        current_soh = $tds.eq(4).text();

        get_percentage = calculate(current_soh,yesterday_soh);
       
        if(parseInt(get_percentage)>=150 )
        {
           change_color = $tds.eq(3).css("background","red");
        }   
        if( parseInt(get_percentage)>45 && parseInt(get_percentage)<55)
        {
           change_color = $tds.eq(3).css("background","red");
        }       
    });
}

setTimeout(function(){
    getSOHSummary();
    getSOHSummary_yesterday();
},1000);  

setInterval(function(){
 getDetails_soh();
},3000)                      

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
			"pageLength": 150,
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
				'url':'/api/1.0.0/inventoryData/soh_detailsController/',
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
				{ "data": "check_all" },
				{ "data": "storeid" },
				{ "data": "storename" },
                { "data": "yesterday_soh" },
				{ "data": "on_hand_matching" },
				{ "data": "counted" },
                { "data": "action"},

			],
            'columnDefs': [ {
               'targets': [0,3], /* column index */
                'orderable': false, /* true or false */
             }],
			"searching": false,
		});
	}); 
}


getstoreinfo();



$('.run').click(function(){
	main_table.ajax.reload();
    getSOHSummary();
    getSOHSummary_yesterday();
});



$('#Check_all').change(function () {
	$('.check_all_inner').prop('checked',this.checked);
});
function getSoh(var_my_this,store_name,nextstore){
    var my_this = var_my_this;
    my_this.parents('td').find('.msg_div').html("Please Wait...");
    my_this.prop('disabled',true);
    my_this.html("Please wait");
	
    $.ajax({
	 	type:'POST',
        url: "/api/1.0.0/cronjobs/StockSummaryDump",
        data:{
            store_id:store_name
        },
        success:function(data){
        	 my_this.html("Consume SOH");
             my_this.prop('disabled',false);
             my_this.parents('td').find('.msg_div').html(data.message);
        	//swal("SOH Dump Successfully !");
            

        }
    })
}

function CleanSoh(store_name,nextstore){

    var store_name22 = store_name;
    
    swal({
      text: 'Please Enter Password',
      content: "input",
      button: {
        text: "Delete",
        closeModal: false,
      },
    })
    .then(result => {
      if (!result) throw null;
       
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/cronjobs/CleanSOH",
            data:{
                "store_id":store_name22,
                "password":result
            },
            success: function(data)
            {
                
            var response_data = JSON.parse(data);
            var result_set = response_data.toString();
           
            if(result_set == "Incorrect Password !"){
                swal({
                    title: 'Incorrect password',
                    icon: "warning"
                })
                swal.stopLoading();
            }else if(result_set == "Clean Successfully !"){
                swal("Poof! Soh Clean Successfully !", {
                    icon: "success",
                });
                swal.stopLoading();
                swal.close();
            }
                
                
            }
        });
        
    })
    .catch(err => {
      if (err) {
        swal("Oh noes!", "The AJAX request failed!", "error");
      } else {
        swal.stopLoading();
        swal.close();
      }
    });  
    
    
}

function run_cycle_count_Soh(var_my_this,store_name,nextstore){
    var my_this = var_my_this;
    var store_name22 = store_name;

    my_this.parents('td').find('.msg_div').html("Please Wait...");
    my_this.prop('disabled',true);
    my_this.html("Please wait");
    
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/cronjobs/run_cycle_count",
        data:{
            "store_name":store_name22,
            "token":'innovent@123'
        },
        success: function(data)
        {
            
            var response_data = (data);
            console.log(response_data.message);
            if(response_data.message != null || response_data.message == 'All Done !.' )
            {
                my_this.html("Run CycleCount");
                my_this.prop('disabled',false);
                my_this.parents('td').find('.msg_div').html(data.message);
                /*swal("Poof! Cycle Count run Successfully !", {
                    icon: "success",
                });*/
                return false;    
            }else {
                my_this.parents('td').find('.msg_div').html('Error !');
            }
        }
    });
}

$(document).on('click','.run_all', function(){

	// $('.check_all_inner').each(function(index,value){

	// 	var $this = $(this);

	// 	if($this.prop('checked')){
	// 		alert($this.val());
	// 	}

	// });

	//getSoh()


	//alert($('.check_all_inner:checked').val());

})
$(document).on('click','.consume_soh', function(){
    var my_this     =   $(this);
    var store_name  =   $(this).attr('store_name');
	getSoh(my_this,store_name,'');
});


$(document).on('click','.clean_soh', function(){
    var store_name = $(this).attr('store_name');
    CleanSoh(store_name,'');
});


$(document).on('click','.run_soh', function(){
    var my_this     =   $(this);
    var store_name  = $(this).attr('store_name');
    run_cycle_count_Soh(my_this,store_name,'');
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

