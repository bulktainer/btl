var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var oldalert = alert_required;
var exist_status = 'Ok';

$(document).on('click', '#metabase_view', function(){
    viewMetabaseGraph();
});

function viewMetabaseGraph(){

    var h = $('.overlay-complete-loader').height();
    if(h == 0) { h = 100; }
    $('.btl_overlay').height(h);  
    $('.btl_relative').show();
    var button = $('#metabase_view');
    button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
    button.attr('disabled','disabled');

    $.ajax({
        type: 'POST',
        data: {
            'type' : $('#component_type').val(),
            'value' : $('#component_id').val(),
            'action_type' : 'view_metabase'
        },
        url: appHome+'/metabase/common-ajax',
        success: function(response){
            if(response){
                $('.meta-div').html(response);
                setTimeout(function(){ 
                    $('.btl_relative').hide();
					$('.meta-div iframe').css('max-width','100%');
                    $('.meta-div iframe').show(); 
                }, 4000);
                button.find('span').removeClass("fa fa-spinner fa-spin");
                button.removeAttr('disabled');
            }
        },
        error: function(jqXHR, textStatus, ex) {
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
            button.find('span').removeClass();
            button.removeAttr('disabled');
        }
    });
} 

$(document).on('click', '#component_list', function(){
    $('#component_list i').toggleClass('fa-minus-circle fa-plus-circle');
});

$(document).on('click', '.delete-question', function(e){ 
    e.preventDefault();
    var metabase_id     = $(this).data('metabase-id');
    BootstrapDialog.confirm('Are you sure you want to delete this component?', function(result){
        if(result) {
            $.ajax({
                type : 'POST',
                url  : appHome+'/metabase/common-ajax',
                data :{
                    'metabase_id': metabase_id,
                    'action_type': 'delete_component'
                },
                success: function(response){
                     window.location.href = $('#return_path').val();
                    localStorage.setItem('response', response);
                },
                error: function(response){
                    BootstrapDialog.show({title: 'Error', message : 'Unable to delete. Please try later.',
                         buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',  
                    });
                }
            });
        }
    });
});

$(document).on('click','#save_question',function(e){
    $('.highlight').removeClass('highlight');
    e.preventDefault();
    var form = '#question-form',
      success = [];
    
    function highlight(field, empty_value){
      if(field.length > 0){
        if(field.val().trim() === empty_value){
          $(field).parent().addClass('highlight');
          success.push(false);
        } else {
          $(field).parent().removeClass('highlight');
          success.push(true);
        }
      }
    }

    var question_id = $('#question_id').val().trim();
    var question_name = $('#question_name').val().trim();
    var description = $('#description').val().trim();
    var component_type = $('#component_group').val();

    highlight($(form).find('#question_id'), '');
    highlight($(form).find('#question_name'), '');

    if(question_id != '' && question_name != '' && $.isNumeric(question_id)){
        $.ajax({
            type: 'POST', 
            url: appHome+'/metabase/common-ajax',  
            async : false,
            data: {
            'question_name'  : question_name,
            'question_id'    : question_id,
            'component_type' : component_type,
            'action_type'    : 'check_question_exist'
            },
            success: function(response){
              if(parseInt(response) > 0){
                exist_status = 'Exist'
                $('#cust_code').parent().addClass('highlight');
                return exist_status;
              }else{
                exist_status = 'Ok'
                $('#cust_code').parent().removeClass('highlight');
                return exist_status;
              }
            },
            error: function(response){
              $('html, body').animate({ scrollTop: 0 }, 400);
              $('form').find('#response').empty().prepend(alert_error).fadeIn();
              return exist_status;
            }
        });
    }

    if(exist_status == 'Exist'){
        success.push(false);
        alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This component already exists.</div>';
    }else{
        if($.isNumeric(question_id)){
            success.push(true);
            alert_required = oldalert;
        }
        else{
            success.push(false);
            alert_required = oldalert;
        }
    }

    var check_fields = (success.indexOf(false) > -1);

    if(check_fields === true){
        $('#message-div').empty().prepend(alert_required).fadeIn();
    }
    else{
        $.ajax({
            type : 'POST',
            url  : appHome+'/metabase/common-ajax',
            data :{
                'question_id': question_id,
                'question_name': question_name,
                'description': description,
                'component_type' : component_type,
                'action_type': 'save_component'
            },
            success: function(response){
                window.location.href = $('#return_path').val();
                localStorage.setItem('response', response);
            },
            error: function(response){
                BootstrapDialog.show({title: 'Error', message : 'Unable to connect. Please try later.',
                     buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',  
                });
            }
        });
    }
});

$(document).on('click', '.add_question', function(){
  $('.clear_text').val('');
  $('#message-div').empty();
});

$(document).on('change', '#component_type', function(){
    getComponentsByType();
});

function getComponentsByType(){

    var component_type = $('#component_type').val();
    $.ajax({
        type: 'POST', 
        url: appHome+'/metabase/common-ajax',  
        async : false,
        data: {
        'component_type'  : component_type,
        'action_type'    : 'get_components_by_type'
        },
        success: function(response){
            $('#component_id').html(response);
            $('.chosen').chosen().trigger("chosen:updated");
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          return exist_status;
        }
    });
}