var alert_success = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-thumbs-o-up"></i>Successfully saved !!!</div>';
var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Some error occured.</div>';

$(document).ready(function(){
    if($(".multi-sel-ctrl").length != 0){
        $(".multi-sel-ctrl").multiselect({
            enableCaseInsensitiveFiltering: true,
            enableFiltering: true,
            maxHeight: 200,
            buttonWidth: '100%',
            onChange: function(element, checked) {
                if (checked === true && element.val() != '') {
                     element.parent().multiselect('deselect', '');
                     element.parent().multiselect('refresh');
                 }
                 if (checked === true && element.val() == '') {
                     element.parent().val('');
                     element.parent().multiselect('refresh');
                 }
                 if(checked === false && element.parent().val() == null){
                     element.parent().val('');
                     element.parent().multiselect('refresh');
                 }
            }
        });
    }
    $('.tmp-input-ctrl').remove();
    getNextJobCountry();
});


//Page size change
$(document).on('change','.custom-page-pagesize', function(){
    var pagelimit = $(this).val();
    $('#pagesize').val(pagelimit);
    $('#unlock-form').submit();
}); 

// Select all
$(document).on('click','.all_checked',function(){
    var checked = $(this).is(':checked');
    if(checked) {
        $('.unlock_all').prop('checked',true);
    }
    else{
        $('.unlock_all').prop('checked',false);
    }

});

$(document).on('click','.unlock_all', function(){
    totalSelected();
});

function totalSelected(){
    var acceptCount = $('.unlock_all:checked').length;
    var acceptTotal = $('.unlock_all').length;
    if(acceptCount == acceptTotal){
      $('.all_checked').prop('checked',true);
    }else{
      $('.all_checked').prop('checked',false);
    }
}

$(document).on('click','#unlock-costs',function(){

    var message = '';
    var jobcost_ids = [];
    $('.unlock_all:checked').each(function () {
        var id = $(this).data('jc_id');
        jobcost_ids.push(id);
    });

    if(jobcost_ids.length>0){

        $.ajax({
            type: 'POST',
            url: appHome+'/job-cost/common_ajax',
            data: {
              'jobcost_ids'   : jobcost_ids,
              'action_type' : 'unlock_job_cost'
            },
            beforeSend: function() {
                $('#unlock-costs').find('span').removeClass().addClass('fa fa-spinner fa-spin');
                $('#unlock-costs').attr('disabled','disabled');
            },
            success: function(response){
                $('#unlock-costs').find('span').removeClass('fa fa-spinner fa-spin').addClass('glyphicon glyphicon-ok-circle');
                $('#unlock-costs').removeAttr('disabled');
                if(response == 'success'){
                    message = alert_success;
                }
                else{
                    message = alert_error;
                }
                window.location.reload();           
                localStorage.setItem('response', message);
            },
            error: function(response){
                $('#unlock-costs').find('span').removeClass('fa fa-spinner fa-spin').addClass('glyphicon glyphicon-ok-circle');
                $('#unlock-costs').removeAttr('disabled');
            }
        });
    }
    else{
        BootstrapDialog.show({title: 'Warning', message : 'Please select at least one cost!',
            buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],
            cssClass: 'small-dialog',  
        });
    }
});

function getNextJobCountry(){
    var job_numbers = [];
    $('.next_country').each(function () {
        var job_number = $(this).data('job_number');
        if(jQuery.inArray(job_number,job_numbers) == -1){
            job_numbers.push(job_number);
        }
    });

    if(job_numbers.length > 0){
        $.ajax({
            type: 'POST',
            url: appHome+'/job-cost/common_ajax',
            data: {
              'job_numbers'   : job_numbers,
              'action_type' : 'get_next_job_country'
            },
            success: function(response){
                if(response){
                    response = JSON.parse(response);
                    $.each(response, function(key, value) {
                        $('.job_'+key).text(value);
                        $('.job_'+key).removeClass('fa fa-spinner fa-spin');
                    }); 
                }
                $('.next_country').removeClass('fa fa-spinner fa-spin');
            },
            error: function(response){
                $('.next_country').removeClass('fa fa-spinner fa-spin');
            }
        });
    }
}
