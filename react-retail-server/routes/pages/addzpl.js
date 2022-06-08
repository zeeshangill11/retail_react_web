function storeName() {
    $.ajax({
        type: 'POST',
        url: "/api/1.0.0/stockCountRecords/getStoreName",
        success: function(data) {
            var response_data = JSON.parse(data);
            var storename = '';
            storename += '<option value="select">Select Store</option>';
            for (var i = 0; i < response_data.length; i++) {
                storename += '<option value="' + response_data[i].storename + '">' + response_data[i].storename + '</option>';
            }
            $("#StoreID").html(storename);
            $('#StoreID').selectpicker('refresh');
        }
    });
}
storeName();

$('#StoreID').selectpicker({
    noneSelectedText: 'Select Store'
});
var currentdate = new Date();
var datetime = currentdate.getDate() + "/" +
    (currentdate.getMonth() + 1) + "/" +
    currentdate.getFullYear() + " " +
    currentdate.getHours() + ":" +
    currentdate.getMinutes() + ":" +
    currentdate.getSeconds();
//console.log(datetime);
$(".dateTime").html("<span>Last Update: " + datetime + "</span>");

$(function() {

    $(document).on('change', '#StoreID', function() {
        var $this = $(this).val();

        var error = 0;
        if ($this == 'select') {
            error = 1;
            $('.error_stoid').html('Please Select Store !')
        } else {
            $('.error_stoid').html(' ')
        }
    })

    $(document).on('keyup', '#zpl', function() {
        var $this = $(this).val();

        var error = 0;
        if ($this.indexOf("'") != -1) {
            error = 1;
            $('.error_zpl').html('Please remove the single quote !')
        } else {
            $('.error_zpl').html(' ')
        }
    })

    var validobj = $("#AddZPLForm").validate({
        rules: {
            name: {
                required: true,
            },
            zpl: {
                required: true,
               
            },
            remarks: {
                required: true,
            },
            status: {
                required: true,
            },
        },

        submitHandler: function(form) {

            var $this = $('#AddZPLForm');
            var working = false;
            var error = 0;
            var zplValue = $this.find('[name="zpl"]').val();

            if ($this.find('[name="stoid"]').val() == "" 
                || $this.find('[name="stoid"]').val() == null ||
                $this.find('[name="stoid"]').val() == 'select') {
                error = 1;
                $this.find('.error_stoid').html('Please Select Store !')
            } else {
                $this.find('.error_stoid').html(' ')
            }
            if(zplValue.indexOf("'") != -1){
                error = 1;
                $this.find('error_zpl').html('Please remove the single quote ! ')   
            }else{
                $this.find('error_zpl').html('  ') 
            }
            if (error == 0) {
                working = true;
                $.ajax({
                    type: 'POST',
                    url: "/api/1.0.0/stockCountRecords/AddZPL",
                    data: $("#AddZPLForm").serialize(),
                    success: function(data) {
                        $("#submit").html('Add ZPL');
                        $("#submit").removeAttr('disabled');

                        var response = JSON.parse(data);

                        swal("Good job!", "ZPL Added Successfully !", "success");


                        setTimeout(function() {
                            window.location.href = 'zpl';
                        }, 2000)
                    }
                });
            }
        }
    });

});