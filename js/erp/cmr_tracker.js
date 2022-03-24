$(document).ready(function(){
	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;

	$('.add-cmr-tracker,.update-cmr-tracker').click(function(e){
	
  e.preventDefault();  
  
  var form = '#'+$(this).closest('form').attr('id'),
  success = [],
  cmr_tracker_id = $('input[name="cmr_tracker_id"]').val(),
  path = $(this).attr('data-path');
  
function highlight(field, empty_value){
	if(field.length > 0){
		if(field.val() === empty_value){
			$(field).parent().addClass('highlight');
			success.push(false);
		} else {
			$(field).parent().removeClass('highlight');
			success.push(true);
		}
	}
}

 function isEmail(email) {
	  //var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	  var regex = btl_email_regex;
	  var t = regex.test(email.val());
	  if(t){
		  $(email).parent().removeClass('highlight');
		  success.push(true);
	  }else{
		  $(email).parent().addClass('highlight');
	        success.push(false);
	  }
	}

 function isCmrnameExists(user,button) {

	ExistSuccess = [];
	if(button.hasClass('update-cmr-tracker')){
  		var type = "update";
  	}
  	if(button.hasClass('add-cmr-tracker')){
  		var type = "create";
  	}
	var cmr_area = $('#cmr_area').val();
	
	if(type == "create"){
		  $.ajax({
		        type: 'POST', 
		        url: appHome+'/cmr-tracker/common_ajax',  
		        async : false,
		        data: {
					'cmr_area' : cmr_area,
					'type'	   : type,
					'action_type' : 'cmrnameexist'
				},
		        success: function(response){
		        	if(response > 0){
		        		ExistSuccess = 'Exist'
		        		$(user).parent().addClass('highlight');
		        	}else{
		        		ExistSuccess = 'Ok'
		        		$(user).parent().removeClass('highlight');
		        	}
		        },
		        error: function(response){
		          $('html, body').animate({ scrollTop: 0 }, 400);
		          $('form').find('.response').empty().prepend(alert_error).fadeIn();
		        }
		  });
	}
  }

  if($('#cmr_area').val() != '' ){
	isCmrnameExists($(form).find('#cmr_area'),$(this)); //function for chech cmr name exist or not
  }


	highlight($(form).find('#cmr_area'), '');
	highlight($(form).find('#cmr_zoom_contact'), '');
	highlight($(form).find('#cmr_zoom_contact_name'), '');

	if($('#cmr_zoom_contact').val() != ''){
	  isEmail($(form).find('#cmr_zoom_contact'));
  	}

  	if(ExistSuccess == 'Exist'){
	  success.push(false);
  	  alert_required =  '<div class="alert alert-danger alert-dismissable">'
  		  					+'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
  		  					+'<i class="fa fa-exclamation-triangle"></i>' 
  		  					+'<strong>Uh oh!</strong> This CMR Name already exists.</div>';
  }else{
	  success.push(true); 
	  alert_required = oldalert;
  }   



	var check_fields = (success.indexOf(false) > -1);

	

	if($(this).hasClass('add-cmr-tracker')){
	    if(check_fields === true){
	      $('html, body').animate({ scrollTop: 0 }, 400);
	      $('form').find('.response').empty().prepend(alert_required).fadeIn();
	    } else {
	            
	      $.ajax({
	        type: 'POST',
	        url: path+'/add/',
	        data: $(form).serialize().replace(/%5B%5D/g, '[]'),
	        success: function(response){
	          window.location.href = path+'/index';
	          
	          localStorage.setItem('response', response);
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('.response').empty().prepend(alert_error).fadeIn();
	        }
	      });
	    }
	}
	
	if ($(this).hasClass('update-cmr-tracker')) {
	    if (check_fields === true) {
	      $('html, body').animate({
	        scrollTop: 0
	      }, 400);
	      $('form').find('.response').empty().prepend(alert_required).fadeIn();
	    } else {
	      $.ajax({
	        type: 'POST',
	        url: '../' + cmr_tracker_id + '/edit/',
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

	$(document).on('click', '.delete-cmr-tracker', function (e) {
	  e.preventDefault();
	  var delete_url = $(this).data('href'),
	  cmr_tracker_id = $(this).data('cmr-tracker-id'),
	  path = $(this).attr('data-path'),
	  $this = $(this),
	  return_url = window.location.href;
	  if ($('#returnpath').val()) {
	    return_url = $('#returnpath').val();
	  }

	  BootstrapDialog.confirm('Are you sure you want to delete this CMR Tracker?', function (result) {	  
	    if (result) {
	      $.ajax({
	        type: 'POST',
	        url: delete_url,
	        data: {
	          'cmr_tracker_id': cmr_tracker_id,
	         
	        },
	        success: function (response) {
	        	localStorage.setItem('response', response);
	        	window.location.href = path + '/index';
	         
	        },
	        error: function (response) {
	          BootstrapDialog.show({
	            message: 'Unable to delete this CMR Tracker. Please try later.',
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
});
