function loader(){
	Swal.fire({
		title: 'Please Wait',
		willOpen: () => {
			Swal.showLoading()
		}
	});
}
//loader();

onehand=[];
//count = [];

function onehandTotal(){
    return new Promise(function(resolve, reject) {
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/inventoryData/oneHand",
            data:$("#CountDynamic").serialize(),
            success: function(data)
            {
                var response_data = JSON.parse(data);

                onehand.push(response_data);
                
            $('#onehand').html('<span class="accu-onhand-vl">'+response_data[0].total+'</span>');
               //console.log(showdata[0].TotalStoreId)
            
            }
        });
    });
}

function inventoryCount(){
    return new Promise(function(resolve, reject) {
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/inventoryData/inventoryCount",
            data:$("#CountDynamic").serialize(),
            success: function(data)
            {
                var response_data = JSON.parse(data);

                //count.push(response_data);      
                $('#inventoryCount').html('<span class="accu-count-vl">'+response_data[0].count+'</span>');
                $('#frontval').html('<span class="ftbk-vl">'+response_data[0].count+'</span>');
               //console.log(showdata[0].TotalStoreId)
            
            }
        });
    });
}
function missingtotal(){
    return new Promise(function(resolve, reject) {
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/inventoryData/missingCol",
            data:$("#CountDynamic").serialize(),
            success: function(data)
            {
                var response_data = JSON.parse(data);

                //count.push(response_data);
                     
                $('#undernum').html('<p style="color:#cf1431;">'+response_data[0].total+'</p>');
                $('#underper').html('<p style="color:#cf1431;">'+response_data[0].percentage+'%</p>');
                // $('#frontval').html('<span class="ftbk-vl">'+response_data[0].count+'</span>');
               //console.log(response_data)
            
            }
        });
    });
}
function expectedtotal(){
    return new Promise(function(resolve, reject) {
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/inventoryData/unexpectedCol",
            data:$("#CountDynamic").serialize(),
            success: function(data)
            {
                var response_data = JSON.parse(data);

                //count.push(response_data);
                     
                $('#expectednum').html('<p style="color:#5fdc64;">'+response_data[0].total+'</p>');
                $('#expectedper').html('<p style="color:#5fdc64;">'+response_data[0].percentage+'%</p>');
                // $('#frontval').html('<span class="ftbk-vl">'+response_data[0].count+'</span>');
               console.log(response_data)
            
            }
        });
    });
}
function departmentID(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getDepartment",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var department = '';
            department += '<option value="0" department_id="0">Department</option>';
            for(var i = 0; i < response_data.length; i++){
                department += '<option value="'+response_data[i].departmentid+'" department_id="'+response_data[i].departmentid+'" departmentname="'+response_data[i].departmentname+'">'+response_data[i].departmentname+'</option>';					
            }
            $("#DepartmentID").html(department);
        }
    });
}
function BrandName(){
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/stockCountRecords/getBrandName",
        success: function(data)
        {
            var response_data = JSON.parse(data);
            var brand = '';
            brand += '<option value="0" brand_id="0">BrandName</option>';
            for(var i = 0; i < response_data.length; i++){
                brand += '<option value="'+response_data[i].skucode+'" brand_id="'+response_data[i].skucode+'" brand_name="'+response_data[i].brand_name+'">'+response_data[i].brand_name+'</option>';					
            }
            $("#BrandID").html(brand);
        }
    });
}
onehandTotal().then(function(response){
	//console.log(onehand);	
}).catch(function(error){
	console.log(error);
	resolve(0);
})
inventoryCount().then(function(response){
	//console.log(onehand);	
}).catch(function(error){
	console.log(error);
	resolve(0);
})
missingtotal().then(function(response){
	//console.log(onehand);	
}).catch(function(error){
	console.log(error);
	resolve(0);
})
expectedtotal().then(function(response){
	//console.log(onehand);	
}).catch(function(error){
	console.log(error);
	resolve(0);
})
departmentID();
BrandName();
function departmentidonehandTotal(departmentid){
    //alert(departmentid);
    return new Promise(function(resolve, reject) {
        $.ajax({
            type:'POST',
            data:"department_id="+departmentid,
            url: "/api/1.0.0/inventoryData/oneHandDepartment",
            success: function(data)
            {
                var response_data = JSON.parse(data);

                onehand.push(response_data);
                
            $('#onehand').html('<span class="accu-onhand-vl">'+response_data[0].total+'</span>');
               //console.log(showdata[0].TotalStoreId)
            
            }
        });
    });
}
function brandnameonehandTotal(brandid){
    //alert(departmentid);
    return new Promise(function(resolve, reject) {
        $.ajax({
            type:'POST',
            data:"brand_id="+brandid,
            url: "/api/1.0.0/inventoryData/oneHandBrand",
            success: function(data)
            {
                var response_data = JSON.parse(data);

                onehand.push(response_data);
                
            $('#onehand').html('<span class="accu-onhand-vl">'+response_data[0].total+'</span>');
               //console.log(showdata[0].TotalStoreId)
            
            }
        });
    });
}
function departmentidinventoryCount(departmentid){
    return new Promise(function(resolve, reject) {
        $.ajax({
            type:'POST',
            data:"department_id="+departmentid,
            url: "/api/1.0.0/inventoryData/inventoryCountDepartment",
            success: function(data)
            {
                var response_data = JSON.parse(data);

                //count.push(response_data);      
                $('#inventoryCount').html('<span class="accu-count-vl">'+response_data[0].count+'</span>');
                $('#frontval').html('<span class="ftbk-vl">'+response_data[0].count+'</span>');
               //console.log(showdata[0].TotalStoreId)
            
            }
        });
    });
}

function brandnameinventoryCount(brandid){
    return new Promise(function(resolve, reject) {
        $.ajax({
            type:'POST',
            data:"brand_id="+brandid,
            url: "/api/1.0.0/inventoryData/inventoryCountBrand",
            success: function(data)
            {
                var response_data = JSON.parse(data);

                //count.push(response_data);      
                $('#inventoryCount').html('<span class="accu-count-vl">'+response_data[0].count+'</span>');
                $('#frontval').html('<span class="ftbk-vl">'+response_data[0].count+'</span>');
               //console.log(showdata[0].TotalStoreId)
            
            }
        });
    });
}

function departmentidmissingtotal(departmentid){
    return new Promise(function(resolve, reject) {
        $.ajax({
            type:'POST',
            data:"department_id="+departmentid,
            url: "/api/1.0.0/inventoryData/missingColDeparment",
            success: function(data)
            {
                var response_data = JSON.parse(data);

                //count.push(response_data);
                     
                $('#undernum').html('<p style="color:#cf1431;">'+response_data[0].total+'</p>');
                $('#underper').html('<p style="color:#cf1431;">'+response_data[0].percentage+'%</p>');
                // $('#frontval').html('<span class="ftbk-vl">'+response_data[0].count+'</span>');
               //console.log(response_data)
            
            }
        });
    });
}
function brandnamemissingtotal(brandid){
    return new Promise(function(resolve, reject) {
        $.ajax({
            type:'POST',
            data:"brand_id="+brandid,
            url: "/api/1.0.0/inventoryData/missingColBrand",
            success: function(data)
            {
                var response_data = JSON.parse(data);

                //count.push(response_data);
                     
                $('#undernum').html('<p style="color:#cf1431;">'+response_data[0].total+'</p>');
                $('#underper').html('<p style="color:#cf1431;">'+response_data[0].percentage+'%</p>');
                // $('#frontval').html('<span class="ftbk-vl">'+response_data[0].count+'</span>');
               //console.log(response_data)
            
            }
        });
    });
}
function departmenexpectedtotal(departmentid){
    return new Promise(function(resolve, reject) {
        $.ajax({
            type:'POST',
            data:"department_id="+departmentid,
            url: "/api/1.0.0/inventoryData/unexpectedColDepartment",
            success: function(data)
            {
                var response_data = JSON.parse(data);

                //count.push(response_data);
                     
                $('#expectednum').html('<p style="color:#5fdc64;">'+response_data[0].total+'</p>');
                $('#expectedper').html('<p style="color:#5fdc64;">'+response_data[0].percentage+'%</p>');
                // $('#frontval').html('<span class="ftbk-vl">'+response_data[0].count+'</span>');
               console.log(response_data)
            
            }
        });
    });
}
function brandnameexpectedtotal(brandid){
    return new Promise(function(resolve, reject) {
        $.ajax({
            type:'POST',
            data:"brand_id="+brandid,
            url: "/api/1.0.0/inventoryData/unexpectedColBrand",
            success: function(data)
            {
                var response_data = JSON.parse(data);

                //count.push(response_data);
                     
                $('#expectednum').html('<p style="color:#5fdc64;">'+response_data[0].total+'</p>');
                $('#expectedper').html('<p style="color:#5fdc64;">'+response_data[0].percentage+'%</p>');
                // $('#frontval').html('<span class="ftbk-vl">'+response_data[0].count+'</span>');
               console.log(response_data)
            
            }
        });
    });
}

    $(function() {
        $('#DepartmentID , #BrandID').change(function(e) {
            var DepartmentID = $('option:selected', this).attr('department_id');
            var BrandID = $('option:selected', this).attr('brand_id');
            
            if(DepartmentID == 0){
                onehandTotal();
                inventoryCount();
                missingtotal();
                expectedtotal();
            }else if(DepartmentID != 0 && DepartmentID != ' '){
                departmentidonehandTotal(DepartmentID);
                departmentidinventoryCount(DepartmentID);
                departmentidmissingtotal(DepartmentID);
                departmenexpectedtotal(DepartmentID);   
            }  

        });
        
        $('#BrandID').change(function(e) {

            var BrandID = $('option:selected', this).attr('brand_id');
            //alert(BrandID)
            if(BrandID == 0){
                onehandTotal();
                inventoryCount();
                missingtotal();
                expectedtotal();
            }else if(BrandID != 0 && BrandID != ' '){
                brandnameonehandTotal(BrandID);
                brandnameinventoryCount(BrandID);
                brandnamemissingtotal(BrandID);
                brandnameexpectedtotal(BrandID);   
            }

        });

    });

    
   
    
       
  
    
    //alert(id);
    
   

