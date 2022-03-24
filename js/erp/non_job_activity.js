$(document).ready(function(){
var ExistSuccess = 'Ok';
  var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
  var oldalert = alert_required;

  $(function() {
	    $('.act_space').on('keypress', function(e) {
	        if (e.which == 32)
	            return false;
	    });
	});

$(document).on('click', '.delete-non-job', function (e) {

  e.preventDefault();
  var delete_url = $(this).data('href'),
    non_job_activity_id = $(this).data('none-job-id'),
    
    path = $(this).attr('data-path'),
    $this = $(this),
    return_url = window.location.href;
  if ($('#returnpath').val()) {
    return_url = $('#returnpath').val();
  }

  BootstrapDialog.confirm('Are you sure you want to delete this Acitivity?', function (result) {
  
    if (result) {
      $.ajax({
        type: 'POST',
        url: delete_url,
        data: {
          'non_job_activity_id': non_job_activity_id
        },
        success: function (response) {
          
          window.location.href = path + '/index';
          localStorage.setItem('response', response);
         
        },
        error: function (response) {
          BootstrapDialog.show({
            title: 'None Job Activity',
            message: 'Unable to delete this Acitivity. Please try later.',
            buttons: [{
              label: 'Close',
              action: function (dialogRef) {
                dialogRef.close();
              }
            }],
            cssClass: 'small-dialog',
          });
        }
      });
    }
  });
});
  

$('.update-new-activity , .add-new-activity').click(function (e) {
    e.preventDefault();
  var form = '#' + $(this).closest('form').attr('id'),
    success = [],
    non_job_activity_id = $('input[name="non_job_activity_id"]').val(),
    path = $(this).attr('data-path');

  function highlight(field, empty_value) {
    if (field.length > 0) {
      if (field.val() === empty_value) {
        $(field).parent().addClass('highlight');
        success.push(false);
      } else {
        $(field).parent().removeClass('highlight');
        success.push(true);
      }
    }
  }

  highlight($(form).find('#activity-name'), '');
  highlight($(form).find('#activity-desc'), '');
  
  var check_fields = (success.indexOf(false) > -1);


  if ($(this).hasClass('add-new-activity')) {
    if (check_fields === true) {
      $('html, body').animate({
        scrollTop: 0
      }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {

      $.ajax({
        type: 'POST',
        url: path + '/create/',
        data: $(form).serialize().replace(/%5B%5D/g, '[]'),
        success: function (response) {
          window.location.href = path + '/index';
          localStorage.setItem('response', response);
        },
        error: function (response) {
          $('html, body').animate({
            scrollTop: 0
          }, 400);
          $('form').find('.response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  }
  if ($(this).hasClass('update-new-activity')) {
    if (check_fields === true) {
      $('html, body').animate({
        scrollTop: 0
      }, 400);
      $('form').find('.response').empty().prepend(alert_required).fadeIn();
    } else {
      $.ajax({
        type: 'POST',
        url: '../' + non_job_activity_id + '/edit/',
        data: $(form).serialize().replace(/%5B%5D/g, '[]'),
        success: function (response) {
          window.location.href = path + '/index';
          localStorage.setItem('response', response);
        },
        error: function (response) {
          $('html, body').animate({
            scrollTop: 0
          }, 400);
          $('form').find('.response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  }
 
});

$('.view_activity').click(function(e) {

  $('.view_small_loader').show();
  $('.reset_values').html('');
  var non_job_activity_id = $(this).data('id');
  $.ajax({
    type: 'POST',
    dataType: 'json',
    url:appHome+'/non-job-activity/common_ajax',
    data: {
      'non_job_activity_id': non_job_activity_id,
      'action_type' : 'get_activity_detail'
        },
    success: function(response){
      $('.view_small_loader').hide();
      if(response != ""){
        $('#modal_activity_name').html(response.act_name);
        $('#modal_activity_desc').html(response.act_desc);  
        $('#modal_rechargeable').html(response.act_rechargeable);
      }
    },
    error: function(response){
      BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
         buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',  
     });
    }
  });
});
$(document).on('change', '.custom-page-pagesize', function (e) {
  var pagelimit = $(this).val();
 $('#pagesize').val(pagelimit);
  $('.non-job-form').submit();
});

});