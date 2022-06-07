var selected_device; 
var devices = [];
var printer_ip=[];


function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}


function setup()
{
    //Get the default device from the application as a first step. Discovery takes longer to complete.
    BrowserPrint.getDefaultDevice("printer", function(device)
    {

        //Add device to list of devices and to html select element
        selected_device = device;
        devices.push(device);
        var html_select = document.getElementById("selected_device");
        var option = document.createElement("option");
        option.text = device.name;
        html_select.add(option);
        var temp='';
        //Discover any other devices available to the application
        BrowserPrint.getLocalDevices(function(device_list){
            for(var i = 0; i < device_list.length; i++)
            {
                //Add device to list of devices and to html select element
                var device = device_list[i];
                if(!selected_device || device.uid != selected_device.uid)
                {
                    devices.push(device);
                    var option = document.createElement("option");
               
                
                   
                    option.text = device.name;
                    option.value = device.uid;
                    temp =(device.uid).split(":");
                    printer_ip.push(temp[0]);
                    html_select.add(option);
                }
            }
            
        }, function(){alert("Error getting local devices")},"printer");
       
        
    }, function(error){
        //alert(error);
    });
     setTimeout(function (){
           $("#selected_device").addClass("form-control");     
        },500);
}
function getConfig(){
    BrowserPrint.getApplicationConfiguration(function(config){
        alert(JSON.stringify(config))
    }, function(error){
        alert(JSON.stringify(new BrowserPrint.ApplicationConfiguration()));
    })
}
function writeToSelectedPrinter(dataToWrite)
{
    selected_device.send(dataToWrite, successCallback, errorCallback);
}
var readCallback = function(readData) {
    if(readData === undefined || readData === null || readData === "")
    {
        alert("No Response from Device");
    }
    else
    {
        alert(readData);
    }
    
}

var successCallback = function(successMsg){
    alert("Success: " + successMsg);    
}

var errorCallback = function(errorMessage){
    alert("Error: " + errorMessage);    
}
function readFromSelectedPrinter()
{

    selected_device.read(readCallback, errorCallback);
    
}
function getDeviceCallback(deviceList)
{
    alert("Devices: \n" + JSON.stringify(deviceList, null, 4))
}

function sendImage(imageUrl)
{
    url = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
    url = url + "/" + imageUrl;
    selected_device.convertAndSendFile(url, undefined, errorCallback)
}
function sendFile(fileUrl){
    url = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
    url = url + "/" + fileUrl;
    selected_device.sendFile(url, undefined, errorCallback)
}
function onDeviceSelected(selected)
{
    for(var i = 0; i < devices.length; ++i){
        if(selected.value == devices[i].uid)
        {
            selected_device = devices[i];
            return;
        }
    }
}
window.onload = setup;
/*--------------------------------ZPL Printer Coding END HERE------------------------------------------*/


function clean_form()
{
     $('[name="UID"]').val('');
     $('[name="SKU"]').val('');
     $('[name="SKU"]').val('');
     $('[name="ProductName"]').val('');
     $('[name="SupplierName"]').val('');       
     $('[name="Retail_Product_Price"]').val('');
     $('[name="Retail_Product_Color"]').val('');
     $('[name="Retail_Product_Size"]').val('');
     $('[name="Retail_Product_Gender"]').val('');
     $('[name="Retail_Product_Season"]').val('');

     $('[name="Retail_Product_VAT"]').val('');
     $('[name="Retail_Product_SP_VAT_EN"]').val('');
     $('[name="Retail_Product_SupplierItemNum"]').val('');
    
}
function clean_form_new()
{
   
     $('[name="UID"]').val('');
     $('[name="SKU"]').val('');
    
     $('[name="ProductName"]').val('');
     $('[name="SupplierName"]').val('');       
     $('[name="Retail_Product_Price"]').val('');
     $('[name="Retail_Product_Color"]').val('');
     $('[name="Retail_Product_Size"]').val('');
     $('[name="Retail_Product_Gender"]').val('');
     $('[name="Retail_Product_Season"]').val('');

    
    
}
function clean_form_for_uid_keyup()
{
    
     $('[name="SKU"]').val('');
     $('[name="SKU"]').val('');
     $('[name="ProductName"]').val('');
     $('[name="SupplierName"]').val('');       
     $('[name="Retail_Product_Price"]').val('');
     $('[name="Retail_Product_Color"]').val('');
     $('[name="Retail_Product_Size"]').val('');
     $('[name="Retail_Product_Gender"]').val('');
     $('[name="Retail_Product_Season"]').val('');

     $('[name="Retail_Product_VAT"]').val('');
     $('[name="Retail_Product_SP_VAT_EN"]').val('');
     $('[name="Retail_Product_SupplierItemNum"]').val('');
    
}

function get_zpl()
{
 
        
        var storeid = $("#StoreID").val();
      
        $.ajax({
            type:'POST',
            data:{'store_id':storeid},
            url: "/api/1.0.0/stockCountRecords/getZPL_new",
            success: function(data)
            {
                var response_data = JSON.parse(data);
                var ZPL = '';
                ZPL += '';
                for(var i = 0; i < response_data.length; i++){
                    ZPL += '<option value="'+response_data[i].zpl+'">'+response_data[i].name+'</option>';                 
                }
                $("#ZPL").html(ZPL);
                $('#ZPL').selectpicker('refresh');

                 setTimeout(function (){
                    console.log(printer_ip);
                    $('#ZPL[name=selValue]').val(1);
                    $('#ZPL').selectpicker('refresh');
                   
                },500);
            }
        });

  
} 

function Printer(){

    

    var storeid = $("#StoreID").val();
    $.ajax({
        type:'POST',
        data:{'store_id':storeid},

        url: "/api/1.0.0/stockCountRecords/getPrinterInfo_new",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var Printer = '';
            Printer += '';
            for(var i = 0; i < response_data.length; i++){
               

               
                if(printer_ip.indexOf(response_data[i].name) !== -1){
                    
                }
                else
                {
                    Printer += '<option value="'+response_data[i].name+'">'+response_data[i].name+'</option>';  
                }               
            }
            $("#Printer").html(Printer);
            $('#Printer').selectpicker('refresh');
            setTimeout(function (){
                   
                $('#Printer[name=selValue]').val(1);
                $('#Printer').selectpicker('refresh');
               
            },500);
        }
    });
}
Printer();

$(document).ready(function (){
    $("#StoreID").on("change",function (){
        get_zpl();
        Printer();
    });

    function  update_qty()
    {
        var qty = $("#qty").val();
        if(qty>10)
        {
            $("#qty").val('10'); 
            $(".error_qty").html("Qty shouldn't be more than 10");
        }
        else
        {
            $(".error_qty").html('');
        }
        if(qty>1)
        {
            $("#auto_print").prop("checked",false);
        }

    }
    update_qty();
    $("#qty").on("keyup",function (){
        update_qty();
        
    });
    $("#auto_print").on("change",function (){
        if($("#auto_print").prop("checked")==true)
        {
             $("#qty").val('1');  
        }
    });
    

});


function storeName(){
  
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var storename = '';
            var select_str='';
            storename += '';
            for(var i = 0; i < response_data.length; i++){
                if(i==0){select_str='selected';}else{select_str='';}
               
                storename += '<option value="'+response_data[i].storename+'" '+select_str+' store-type="'+response_data[i].store_type+'" >'+response_data[i].storename+'</option>';                  
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');
            setTimeout(function (){
               
                $('#StoreID[name=selValue]').val(1);
                $('#StoreID').selectpicker('refresh');
                 get_zpl();
                 Printer();
            },500);
        }
    });
}
storeName();





$('#StoreID').selectpicker({
    noneSelectedText : 'Select Store'
});
$('#ZPL').selectpicker({
    noneSelectedText : 'Select ZPL'
});
$('#Printer').selectpicker({
    noneSelectedText : 'Select Printer'
});
var previous_text='';
var input_timeout;
$(document).ready(function(){
   
    $(".reset_popop").on("click",function (){
        
        $("#PO_NO").val('');
        $("#Supplier_ID").val('');
        $("#Shipment_no").val('');
        $("#Comments").val('');

    }); 
 
  
    var xhr=null;
    $("#UID").on("input",function (){
        clean_form_for_uid_keyup(); 
        clearTimeout(input_timeout);
        input_timeout = setTimeout(function(){ 

        
           
            
      
       // if(previous_text!=$("#UID").val())
       // {
            previous_text=$("#UID").val();
            
            if( xhr != null ) {
                xhr.abort();
                xhr = null;
            }

            

            
            var uuid2 = $('#UID').val();
            var send_uui = (uuid2);
            xhr = $.ajax({

                type:'POST',
                url:"/api/1.0.0/stockCountRecords/ZplDataProductMaster_new",
                data:{
                    uid:send_uui
                },
                success:function (data2){
                    var response23 = JSON.parse(data2);
                    if(response23.length>0)
                    {


                        var Product_MasterDataa = response23[0]

                        if(Product_MasterDataa.dept !== '' ||
                            Product_MasterDataa.dept !== null
                          ){

                           $('#department').val(Product_MasterDataa.dept);
 
                        }

                        if(Product_MasterDataa.ean_no !== '' ||
                            Product_MasterDataa.ean_no !== null
                          ){
                           
                            if($('#UID').val()!=Product_MasterDataa.ean_no)
                            {
                                alert("UID Not Match ean_no");
                                clean_form_for_uid_keyup(); 
                                return false;
                            }
                        }
  
                        


                        if(Product_MasterDataa.brand !== '' ||
                            Product_MasterDataa.brand !== null
                          ){

                           $('#brand').val(Product_MasterDataa.brand); 
                        }

                        if(Product_MasterDataa.type_no !== '' ||
                            Product_MasterDataa.type_no !== null
                          ){

                           $('#style').val(Product_MasterDataa.type_no); 
                        }

                         

                        if(Product_MasterDataa.skucode !== '' ||
                            Product_MasterDataa.skucode !== null
                          ){ 
                         
                           $('#SKU').val(padDigits(Product_MasterDataa.skucode,14)); 

                            $('#SKU_without_zero').val(Product_MasterDataa.skucode); 

                       
                        }


                        if(Product_MasterDataa.supplier_name !== '' ||
                            Product_MasterDataa.supplier_name !== null
                          ){

                           $('#SupplierName').val(Product_MasterDataa.supplier_name); 
                        }



                        if(Product_MasterDataa.english_desc !== '' ||
                            Product_MasterDataa.english_desc !== null
                          ){

                           $('#ProductName').val(Product_MasterDataa.english_desc); 
                        }
                        
                        if(Product_MasterDataa.arabic_desc !== '' ||
                            Product_MasterDataa.arabic_desc !== null
                          ){

                           $('#ProductName_ar').val(Product_MasterDataa.arabic_desc); 
                        }


                        

                        if(Product_MasterDataa.sp_net !== '' ||
                            Product_MasterDataa.sp_net !== null
                          ){

                           $('#Retail_Product_Price').val(Product_MasterDataa.sp_net); 
                        }



                        if(Product_MasterDataa.vat !== '' ||
                            Product_MasterDataa.vat !== null
                          ){

                           $('#Retail_Product_VAT').val(Product_MasterDataa.vat); 
                        }



                        if(Product_MasterDataa.color !== '' ||
                            Product_MasterDataa.color !== null
                          ){

                           $('#Retail_Product_Color').val(Product_MasterDataa.color); 
                        }
                       
                        if(Product_MasterDataa.size !== '' ||
                            Product_MasterDataa.size !== null
                          ){

                           $('#Retail_Product_Size').val(Product_MasterDataa.size); 
                        }



                        

                        if(Product_MasterDataa.season !== '' ||
                            Product_MasterDataa.season !== null
                          ){

                           $('#Retail_Product_Season').val(Product_MasterDataa.season); 
                        }

                       
                        if(Product_MasterDataa.sales_area !== '' ||
                            Product_MasterDataa.sales_area !== null
                          ){

                           $('#Retail_Product_Gender').val(Product_MasterDataa.sales_area); 
                        }


                       
                        if(Product_MasterDataa.sp_gross_eng !== '' ||
                            Product_MasterDataa.sp_gross_eng !== null
                          ){

                           $('#Retail_Product_SP_VAT_EN').val(Product_MasterDataa.sp_gross_eng); 
                        }

                        if(Product_MasterDataa.supplier_item_no !== '' ||
                            Product_MasterDataa.supplier_item_no !== null
                          ){

                           $('#Retail_Product_SupplierItemNum').val(Product_MasterDataa.supplier_item_no); 
                        }
                        
                        if(Product_MasterDataa.ean_no !== '' ||
                            Product_MasterDataa.ean_no !== null
                          ){

                           $('#Retail_Product_UniqueID').val(Product_MasterDataa.ean_no); 
                        }


                        setTimeout(function (){

                            var auto_print22 = $("#auto_print").prop('checked');

                            if(auto_print22)
                            {
                                $("#printButton").click();    
                                
                            }
                        },500);
                        

                        if(Product_MasterDataa.storeid !== null && 
                            Product_MasterDataa.storeid !== '' &&   Product_MasterDataa.storeid>0){
                           $('#StoreID option[value='+Product_MasterDataa.storeid+']').prop('selected', true);
                            $('#StoreID').selectpicker('refresh');       
                        }else{
                           
                           // $('#StoreID').val(' ');
                        }    
                    }
                    else
                    {

                        $("#department, #brand, #style, #SKU, #SupplierName, #ProductName, #Retail_Product_Price, #Retail_Product_VAT").val('');
                        $("#Retail_Product_Color, #Retail_Product_Size, #Retail_Product_Season, #Retail_Product_Gender").val('');
                    }


                }

            });
        }, 500);

        //}

    });


});

$('#printButton').click(function(){

    //var working = false;
    var error = 0;
    var $this = $('#PrinterForm')
    //alert('ok');
   // $("#printButton").html('<i class="fa fa-spin fa-spinner"></i>&nbsp;Please Wait...');
   if($("#StoreID option:selected").attr("store-type")=="StoreFront")
{}
else{



    if($("#Supplier_ID").val()=="" )
    {
        alert("Supplier ID Field Is Empty Please Click Detail Button To Add");
        error=1;
        return false;
    }

    if($("#Shipment_no").val()=="" )
    {
        alert("Supplier ID Field Is Empty Please Click Detail Button To Add");
        error=1;
        return false;
    }

    if($("#Comments").val()=="" )
    {
        alert("Comments Field Is Empty Please Click Detail Button To Add");
        error=1;
        return false;
    }

}


    if($this.find('[name="UID"]').val()==""){
        error=1;
        $this.find('.error_UID').html('Please Enter UID !')               
    }else{
        $this.find('.error_UID').html(' ')
    }
  
   
    
   
        // alert(organization_name)

            
        var uidvalidation = $this.find('[name="SKU"]').val();
      
        if(uidvalidation==""){

            error=1;
            $this.find('.error_SKU').html('<span>Please Enter SKU !</span>')               
        }else{
            $this.find('.error_SKU').html(' ')
        }

       

        if($this.find('[name="ProductName"]').val()==""){
            error=1;
            $this.find('.error_ProductName').html('Please Enter Product Name !')               
        }else{
            $this.find('.error_ProductName').html(' ')
        }

       
        if($this.find('[name="SupplierName"]').val()==""){
            error=1;
            $this.find('.error_SupplierName').html('Please Enter Supplier Name !')               
        }else{
            $this.find('.error_SupplierName').html(' ')
        }

        if($this.find('[name="qty"]').val()==""){
            error=1;
            $this.find('.error_qty').html('Please Enter Qty !')               
        }else{
            $this.find('.error_qty').html(' ')
        }






        if($this.find('[name="Retail_Product_Price"]').val()==""){
            error=1;
            $this.find('.error_Retail_Product_Price').html('Please Enter Retail Product Price !')               
        }else{
            $this.find('.error_Retail_Product_Price').html(' ')
        }

        if($this.find('[name="Retail_Product_Color"]').val()==""){
            error=1;
            $this.find('.error_Retail_Product_Color').html('Please Enter Retail Product Color !')               
        }else{
            $this.find('.error_Retail_Product_Color').html(' ')
        }

        if($this.find('[name="Retail_Product_Size"]').val()==""){
            error=1;
            $this.find('.error_Retail_Product_Size').html('Please Enter Retail Product Size !')               
        }else{
            $this.find('.error_Retail_Product_Size').html(' ')
        }

        if($this.find('[name="Retail_Product_Gender"]').val()==""){
            error=1;
            $this.find('.error_Retail_Product_Gender').html('Please Enter Retail Product Gender !')               
        }else{
            $this.find('.error_Retail_Product_Gender').html(' ')
        }

        //season
        if($this.find('[name="Retail_Product_Season"]').val()==""){
            error=1;
            $this.find('.error_Retail_Product_Season').html('Please Enter Retail Product Season !')               
        }else{
            $this.find('.error_Retail_Product_Season').html(' ')
        }


        if($this.find('[name="Retail_Product_VAT"]').val()==""){
            error=1;
            $this.find('.error_Retail_Product_VAT').html('Please Enter Retail Product VAT !')               
        }else{
            $this.find('.error_Retail_Product_VAT').html(' ')
        }

        if($this.find('[name="Retail_Product_SP_VAT_EN"]').val()==""){
            error=1;
            $this.find('.error_Retail_Product_SP_VAT_EN').html('Please Enter Retail Product SP VAT EN !')               
        }else{
            $this.find('.error_Retail_Product_SP_VAT_EN').html(' ')
        }

     

        if($this.find('[name="StoreID"]').val()=="" || 
            $this.find('[name="StoreID"]').val() ==null){
            error=1;
            $this.find('.error_StoreID').html('Please Select Store !')               
        }else{
            $this.find('.error_StoreID').html(' ')
        }

        if($this.find('[name="ZPL"]').val()=="" || $this.find('[name="ZPL"]').val() ==null){
            error=1;
            $this.find('.error_ZPL').html('Please Select Zpl !')               
        }else{
            $this.find('.error_ZPL').html(' ')
        }



       
      

    if(error == 0){
        //working = true;
        $("#printButton").html('Please Wait');
        
        $("#printButton").attr('disabled','disabled');
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/stockCountRecords/AddPrinterForm_new",
            data:$("#PrinterForm").serialize(),
            success: function(data)
            {

                $("#printButton").html('SUBMIT');
                $("#printButton").removeAttr('disabled');
                 var response = JSON.parse(data);
                   

                var abc =   response.split(',')
                
                
                 var table=''    
                    table += '<div style="display:none;justify-content: space-between;margin-bottom: 10px">'+ 
                            '<div style="display: inline-block;">'+ 

                                '<button type="button" id="print_epc_button"'+ 
                                ' class="btn btn-default print_run" '+ 
                                ' style="color:#000;border-color:#000;'+ 
                                ' border-radius:0px;'+ 
                                ' background:transparent"> '+
                                ' Print'+  
                                '</button> '+ 

                            '</div>'+

                            '<div style="text-align: right;margin-bottom: 10px;display: inline-block;">'+ 

                                '<input type="checkbox" id="print_all"'+ 
                                ' class="btn btn-default print_all" '+ 
                                ' style="color:#000;border-color:#000;'+ 
                                ' border-radius:0px;'+ 
                                ' background:transparent"> '+
                                ' '+  
                                '</> '+ 

                            '</div>'+

                           
                               '</div>'

                        
                    



                
                    table += '<table border=1 style="text-align:center" class="table"> '+ 
                    ' <thead> '+ 
                    ' <th>#</th>'+ 
                    ' <th>EPC</th> '+ 
                    ' <th>Print </th>'+  
                    ' </tr>'+ 
                    '</thead>'+ 
                    ' <tbody> ' 
                    
                        for(var i =0;i<abc.length;i++){
                            if(abc[i] !== ''){
                              
                                table +='<tr rowspan="4" id="print_'+abc[i]+'"> ';
                                table +='<td>'+i+'</td>'
                                table +='<td class="epc22">'+abc[i]+'</td>'

                                table +='<td>'+ 
                                    
                                '<input type="checkbox" class="inner_epc" name="print_epc[]" value='+abc[i]+' />'
                                + 
                                '</td>'
                                table += '</tr>'    
                            } 
                        }
                           
                      
                    
                        table +='</tbody>'
                        table += ' </table>';
                    
                        $("#epc_list").html(table);


                        $('.inner_epc').prop('checked',true);
                        setTimeout(function (){
                            $(".print_run").click();
                        },500);


                       

                   

                  

            }
        });
    }else{
        clean_form();


        jQuery(".error_msg").html("<div style='color:red'>Please check details</div>");
        return false;
    }
    
});




$(document).ready(function(){
    function send_vizx(
        epc,
        storeid,
        my_zpl,
        Printer,
        uid,
        sku,
        SKU_without_zero,
        supplier_name,
        ProductName,
        Retail_Product_Price,
        Retail_Product_VAT,
        Retail_Product_Color,
        Retail_Product_Size,
        Retail_Product_Season,
        Retail_Product_Gender,
        Retail_Product_SP_VAT_EN,
        Retail_Product_SupplierItemNum,
        Brand,
        Department,
        style,
        PO_NO,
        Supplier_ID,
        Shipment_no,
        Comments) {


        var epc = epc;
        var my_zpl_name = my_zpl;
        var store_id = storeid;
        var my_printer = Printer; 
        
        var sku = sku;
        var SKU_without_zero= SKU_without_zero;
        var uid = uid ;

        var supplier_name = supplier_name; 
       
        var ProductName   =     ProductName;
        ProductName = ProductName.replace(/["']/g, "");
        ProductName = ProductName.replace(/\\/g, "");
        var retail_product_price = Retail_Product_Price;
        var retail_product_vat = Retail_Product_VAT;
   
        var Retail_Product_Color = Retail_Product_Color;
        var Retail_Product_Size = Retail_Product_Size;
        var Retail_Product_Season = Retail_Product_Season;
        var Retail_Product_Gender = Retail_Product_Gender;
        
        var retail_product_sp_vat_en = Retail_Product_SP_VAT_EN;

        var Retail_Product_SupplierItemNum = Retail_Product_SupplierItemNum;

        var PO_NO = PO_NO;
        var Supplier_ID = Supplier_ID;
        var Shipment_no = Shipment_no;
        var Comments = Comments;

        var  Brand=Brand;
        var  Department=Department;
        var style=style;

        $.ajax({
            type:'POST',
            url: "/api/1.0.0/stockCountRecords/ConfirmApiRequestPrinter_new",
            data:{
                epc : epc,
                zpl : my_zpl_name,
                store_id : store_id,
                my_printer : my_printer,
                sku:sku,
                sku_without_zero:SKU_without_zero,
                uid : uid ,
                supplier_name : supplier_name,
                ProductName:ProductName,
                
                retail_product_price : Retail_Product_Price,
                retail_product_vat : Retail_Product_VAT,
                Retail_Product_Color: Retail_Product_Color,
                Retail_Product_Size: Retail_Product_Size, 
                Retail_Product_Season: Retail_Product_Season,
                Retail_Product_Gender :Retail_Product_Gender,   
                retail_product_sp_vat_en : Retail_Product_SP_VAT_EN,
                Retail_Product_SupplierItemNum: Retail_Product_SupplierItemNum,
                PO_NO: PO_NO,
                Supplier_ID: Supplier_ID,
                Shipment_no: Shipment_no,
                Comments: Comments,
                Brand: Brand,
                Department: Department,
                style: style,  
            },
            success: function(data)
            {


            

            }
        });


        // alert('aaa');
        // $.ajax({
        //     type:'POST',
        //     url: "/api/1.0.0/stockCountRecords/ZPL_printer_form",
        //     data:$("#PrinterForm").serialize(),
        //     success: printRawString 
            
        // });
    }
     function send_vizx_error() {
        alert('my_error');
        // $.ajax({
        //     type:'POST',
        //     url: "/api/1.0.0/stockCountRecords/ZPL_printer_form",
        //     data:$("#PrinterForm").serialize(),
        //     success: printRawString 
            
        // });
    }
    function printRawString(data){
        return new Promise(function(resolve, reject) {
            var abc=data;
            setTimeout(function (){
              resolve("zeeshan"+abc);  
            },3000);
            
        });
    
    } 
    $(document).on('click','#stop_printing',function(){

        tobe_print=[];
        $("#stop_printing").hide();  
    })
      
        
    function  print_one_by_one(tobe_print,i)
    {
       
        if(tobe_print[i]!==undefined)
        {
            





            var epc=tobe_print[i];
            $("#current_epc").val(epc);
            $(".status_message").html("<span class='alert alert-success'>"+epc+" Printing Start</span>");

            var storeid = '';
            var Printer = '';
            var my_zpl = '';
            var supplier_name = '';
            var ProductName='';
            var uid = '';
            var uid2 = '';
            var Retail_Product_Price = '';
            var Retail_Product_VAT = '';
            var Retail_Product_SP_VAT_EN = '';
            var Retail_Product_Color = '';
            var Retail_Product_Size = '';
            var Retail_Product_Season = '';
            var Retail_Product_Gender = '';
            var Retail_Product_SupplierItemNum = '';
            var ean_no='';

            var PO_NO='';
            var Supplier_ID='';
            var Shipment_no='';
            var Comments='';
            var sku='';
            var SKU_without_zero='';
            var ProductName_ar='';
                    
            storeid = $('#StoreID').val();
            Printer = $('#Printer').val();
            supplier_name = $('#SupplierName').val();
            ProductName = $('#ProductName').val();
            ProductName_ar =  $('#ProductName_ar').val();
            uid2 = $('#UID').val();
            Retail_Product_Price = $('#Retail_Product_Price').val();
            Retail_Product_VAT = $('#Retail_Product_VAT').val();
            sku = $('#SKU').val();
            SKU_without_zero = $('#SKU_without_zero').val();

            Retail_Product_SP_VAT_EN = $('#Retail_Product_SP_VAT_EN').val();

            ean_no = $('#UID').val();

            Retail_Product_Color = $('#Retail_Product_Color').val();
            Retail_Product_Size = $('#Retail_Product_Size').val();
            Retail_Product_Season = $('#Retail_Product_Season').val();
            Retail_Product_Gender = $('#Retail_Product_Gender').val();
            Retail_Product_SupplierItemNum = $('#Retail_Product_SupplierItemNum').val();

            PO_NO = $('#PO_NO').val();
            Supplier_ID = $('#Supplier_ID').val();
            Shipment_no = $('#Shipment_no').val();
            Comments = $('#Comments').val();


            var Brand = $('#brand').val();
            var Department = $('#department').val();
            var style = $('#style').val();



            my_zpl = $('#ZPL').val();
            var my_zpl_name =$('#ZPL option:selected').text();
           
            uid = (uid2);



            my_zpl = my_zpl.split("${Retail_Product_Level2Name}").join(Brand);
            my_zpl = my_zpl.split("${Retail_Product_SupplierName}").join(supplier_name);
            my_zpl = my_zpl.split("${Retail_Product_SKUOriginal}").join(SKU_without_zero);
            my_zpl = my_zpl.split("${Retail_Product_Price}").join(Retail_Product_Price);
            my_zpl = my_zpl.split("${Retail_Product_Name}").join(ProductName);
            my_zpl = my_zpl.split("${Retail_Product_Name_Text}").join(ProductName_ar);


            my_zpl = my_zpl.split("${Retail_Product_VAT}").join(Retail_Product_VAT);
            my_zpl = my_zpl.split("${Retail_Product_SP_VAT_EN}").join(Retail_Product_SP_VAT_EN);
            my_zpl = my_zpl.split("${Retail_Product_UniqueID}").join(ean_no);

            my_zpl = my_zpl.split("${serialNumber}").join(epc);


            my_zpl = my_zpl.split("${Retail_Product_SupplierItemNum}").join(Retail_Product_SupplierItemNum);
            my_zpl = my_zpl.split("${Retail_Product_Color}").join(Retail_Product_Color);
            my_zpl = my_zpl.split("${Retail_Product_Size}").join(Retail_Product_Size);
            my_zpl = my_zpl.split("${Retail_Product_Season}").join(Retail_Product_Season);
            my_zpl = my_zpl.split("${Retail_Product_Gender}").join(Retail_Product_Gender);



             send_vizx(
                    epc,
                    storeid,
                    my_zpl,
                    Printer,
                    uid,
                    sku,
                    SKU_without_zero,
                    supplier_name,
                    ProductName,
                    Retail_Product_Price,
                    Retail_Product_VAT,
                    Retail_Product_Color,
                    Retail_Product_Size,
                    Retail_Product_Season,
                    Retail_Product_Gender,
                    Retail_Product_SP_VAT_EN,
                    Retail_Product_SupplierItemNum,
                    Brand,
                    Department,
                    style,
                    PO_NO,
                    Supplier_ID,
                    Shipment_no,
                    Comments);

             //alert("i am here");
            
            //alert(uid);

            console.log(my_zpl);

  
           try {
                

                if(ProductName !== '' && Retail_Product_Price !== ''){
                    selected_device.send(my_zpl, 
                        function (data){
                            

                       send_vizx(
                            epc,
                            storeid,
                            my_zpl,
                            Printer,
                            uid,
                            sku,
                            SKU_without_zero,
                            supplier_name,
                            ProductName,
                            Retail_Product_Price,
                            Retail_Product_VAT,
                            Retail_Product_Color,
                            Retail_Product_Size,
                            Retail_Product_Season,
                            Retail_Product_Gender,
                            Retail_Product_SP_VAT_EN,
                            Retail_Product_SupplierItemNum,
                            Brand,
                            Department,
                            style,
                            PO_NO,
                            Supplier_ID,
                            Shipment_no,
                            Comments) ;
                          $("#print_"+epc).remove();
                            

                          $(".status_message").html("<span class='alert alert-success'>"+epc+" Printed</span>");
                          setTimeout(function (){
                                
                            var auto_print22 = $("#auto_print").prop('checked');

                            if(auto_print22)
                            {      
                                clean_form_new();   
                            }   
                              i =i+1;
                              print_one_by_one(tobe_print,i);
                           },2000);
                        },
                        function (data){
                          
                            // $("#print_"+epc).remove();
                            //$(".status_message").html("<span class='alert alert-success'>"+epc+" Printing Printed</span>");
                            //send_vizx(my_zpl,epc,storeid,Printer,supplier_name,uid,Retail_Product_Price,Retail_Product_VAT,Retail_Product_SP_VAT_EN);
                            //send_vizx(my_zpl,epc,storeid,Printer,supplier_name,uid,Retail_Product_Price,Retail_Product_VAT,Retail_Product_SP_VAT_EN);
                            


                            $("#print_"+epc+" td").css("color",'red');
                            $(".status_message").html("<span class='alert alert-danger'>"+epc+" Error !</span>");
                     
                            setTimeout(function (){

                              i =i+1;
                              print_one_by_one(tobe_print,i);
                            },2000);

                        }
                    );
                }else{
                    
                    alert("This EPC "+epc+" printing is missing")
                     i =i+1;
                    setTimeout(function (){
                         print_one_by_one(tobe_print,i);
                    },2000);  

                }    

            }

            catch(err) {
               
                console.log('error');

                i =i+1;
                print_one_by_one(tobe_print,i);

                $(".status_message").html("<span class='alert alert-danger'>Error Printer Not Attached!</span>");

            }

           


            // setTimeout(function (){
            //     $("#print_"+epc).remove();
            //     $(".status_message").html("<span class='alert alert-success'>"+epc+" Printed</span>");
            //     i =i+1;
            //     setTimeout(function (){
            //          print_one_by_one(tobe_print,i);
            //     },2000);   
            // },2000);   

        }
    }
    $(document).on('click','.print_run',function(){
        tobe_print = [];
        var i=0;
        $(".status_message").html("<span class='alert alert-success'>Start Printing</span>");
        $(".inner_epc:checked").each(function (){
            
            tobe_print.push($(this).val());      

        });  
        print_one_by_one(tobe_print,i);  

  
    });
    $(document).on('change','#print_all',function () {
       
        $('.inner_epc').prop('checked',this.checked);
    });
    $(document).on('change','.inner_epc',function () {
     
    if ($('.inner_epc:checked').length == $('.inner_epc').length){
        $('#print_all').prop('checked',true);
    }else {
      $('#print_all').prop('checked',false);
     }
    });
})


var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
$(".dateTime").html("<span>Last Update: "+datetime+"</span>");
