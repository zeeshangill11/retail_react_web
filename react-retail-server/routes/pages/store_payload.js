var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                //console.log(datetime);
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");

function getStores(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var Stores 		  = '';
            for(var i = 0; i < response_data.length; i++){
                Stores += '<tr>'+
                				'<td>'+response_data[i].storename+'</td>'+
                				'<td><button class="btn btn-primary btn-sm" onclick="get_payload(\''+response_data[i].storename+'\')">Payload</button></td>'+
                		  '</tr>';
            }
            $("#dataTable").find('tbody').append(Stores);
            $(".before_load_table").hide();
            $(".data-tables").css('visibility','visible');
        }
    });
}

getStores();
function get_payload(var_storename){
	var storename = var_storename; 
	var error = 0;
    var FromDate = $('#FromDate').val();
    
    if(FromDate == ''){
        error = 1;
        $('.Date_error').html('Date must be Selected!');
    } else {
    	FromDate = new Date($('#FromDate').val());   
    }
    if(error == 0){
        var url = '/store_payload_single/?store='+storename+'&&date='+FromDate;
        window.open(url, '_blank').focus();
    }
}