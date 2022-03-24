$(document).ready(function(){
	
var ExistSuccess = 'Ok';
var is_email_exist = 'Ok';
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
var oldalert = alert_required;
	

$('#confirm_change_password').click(function(e){
	$('.highlight').removeClass('highlight');
	$('#user-password,#user-cpassword').val('');
	var atLeastOneIsChecked = $('#confirm_change_password:checkbox:checked').length > 0;
	if(atLeastOneIsChecked){
		$('#user-password,#user-cpassword').prop('disabled', false);
	}else{
		$('#user-password,#user-cpassword').prop('disabled', true);
	}
})

/**
 * multi select option for customers
 */
if($(".multi-sel-ctrl").length != 0){
	$(".multi-sel-ctrl").multiselect({
		enableCaseInsensitiveFiltering: true,
		enableFiltering: true,
		maxHeight: 200,
		buttonWidth: '100%',
		onChange: function(element, checked) {
			
		}
	});
	}
	$('.tmp-input-ctrl').remove();//This control is for not showing old select box
	
	//$('.user-custcode').hide();
	//condition to check the customer
	if($('#user-access').val() != 'ra')
	{
		$('.user-custcode').hide();
		$('#user-customercode').val('');
		if($(".multi-sel-ctrl").length != 0){ $('#user-customercode').multiselect('refresh'); }
	}
	else
	{
		$('.user-custcode').show();
		
	}
	//function to display the customer
	$("#user-access").change(function(){
	if($('#user-access').val() != 'ra')
	{
		$('.user-custcode').hide();
		$('#user-customercode').val('');
		if($(".multi-sel-ctrl").length != 0){ $('#user-customercode').multiselect('refresh'); }
	}
	else
	{
		$('.user-custcode').show();
		
	}
	});
$('.active_checkbox').click(function(e){
	var checkbox = $(this);
	if(checkbox.prop('checked') == true){
		checkbox.removeAttr('checked');
	}else{
		checkbox.prop('checked',true);
	}
	var username = checkbox.data('username');
	var tr = checkbox.closest("tr");
	if(checkbox.attr('data-currentstatus') == 'active'){
		var updateStatus = 0;
		var updateStatusName = 'inactive';
		var type =BootstrapDialog.TYPE_DANGER;
		var mButton = 'btn-danger';
		var message = 'Are you sure want to <strong>Inactive</strong> this User ? ';
	}else{
		var updateStatus = 1;
		var updateStatusName = 'active';
		var type =BootstrapDialog.TYPE_SUCCESS;
		var mButton = 'btn-success';
		var message = 'Are you sure want to <strong>Active</strong> this User ? ';
	}
	
	 BootstrapDialog.show({
         type: type,
         title: 'Confirmation',
         message: message,
         buttons: [{
		             label: 'Close',
		             action: function(dialogItself){
		                 dialogItself.close();
		                 if(checkbox.attr('data-currentstatus') == 'active'){
		                	 checkbox.prop('checked',true);
		                 }else{
		                	 checkbox.removeAttr('checked');
		                 }
		             }
		         },{
	             label: 'Ok',
	             cssClass: mButton,
	             action: function(dialogItself){
	            	 dialogItself.close();
	            	 $.ajax({
	         	        type: 'POST', 
	         	        url: appHome+'/user/common_ajax',  
	         	        async : false,
	         	        data: {
	         				'username' : username,
	         				'updateStatus'	   : updateStatus,
	         				'action_type' : 'changeStatus'
	         			},
	         	        success: function(response){
	         	        	if(response == 1){
	         	        		tr.toggleClass('success danger');
	         	        		checkbox.attr('data-currentstatus',updateStatusName);
	         	        		if(updateStatusName == 'active'){
		   	         	    		 checkbox.prop('checked',true);
		   	         	         }else{
		   	         	        	 checkbox.removeAttr('checked');
		   	         	         }
	         	        	}else{
	         	        		if(checkbox.attr('data-currentstatus') == 'active'){
	   	         	    		 checkbox.prop('checked',true);
	   	         	         	}else{
	   	         	        	 checkbox.removeAttr('checked');
	   	         	         	}
	         	        	}
	         	        },
	         	        error: function(response){
	         	          $('html, body').animate({ scrollTop: 0 }, 400);
	         	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	         	    	 if(checkbox.attr('data-currentstatus') == 'active'){
	         	    		 checkbox.prop('checked',true);
	         	         }else{
	         	        	 checkbox.removeAttr('checked');
	         	         }
	         	        }
	         	  });
	             }
         }]
     });
});

$("#user-telephone").keypress(function(e){
	var strCheckphone = '0123456789-+() ';
	var key = '';
	var whichCodeNum = (window.Event) ? e.which : e.keyCode;

	if(window.navigator.userAgent.indexOf("MSIE") > -1){
		whichCodeNum = e.keyCode; 
	}
	
	if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter

	key = String.fromCharCode(whichCodeNum);

	if(strCheckphone.indexOf(key) == -1) return false;  // Not a valid key
});


$("#user-username").keypress(function(event){
	var inputValue = event.which;
	var regex = new RegExp("^[a-zA-Z0-9_\b]+$");
	var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

	var keypressed = event.which || event.keyCode;
	if(keypressed == 37 || keypressed == 38 || keypressed == 39 || keypressed == 40 || keypressed == 8 || keypressed == 46){ // Left / Up / Right / Down Arrow, Backspace, Delete keys
	   return;
	}
	if (!regex.test(key)) {
	     event.preventDefault();
	     return false;
	}
});

/**
* update edit-vgm-route
*/
$('.create-user,.edit-user').click(function(e){
  $('.highlight').removeClass('highlight');
  e.preventDefault();
  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      password_strength = '',
      username = $('input[name="hidden-username"]').val(),
      path = $(this).attr('data-path');

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
  
  	function isEmail(email) {
	  // var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
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

  	function isUsernameExists(user,button) {
		ExistSuccess = [];
		if(button.hasClass('edit-user')){
	  		var type = "update";
	  	}
	  	if(button.hasClass('create-user')){
	  		var type = "create";
	  	}
		var username = $('#user-username').val();
		
		if(type == "create"){
			  $.ajax({
			        type: 'POST', 
			        url: appHome+'/user/common_ajax',  
			        async : false,
			        data: {
						'username' : username,
						'type'	   : type,
						'action_type' : 'usernameexist'
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
			          $('form').find('#response').empty().prepend(alert_error).fadeIn();
			        }
			  });
		}
  	}

  	function isEmailExists(element, button) {
		if(button.hasClass('edit-user')){
	  		var type = "update";
	  	}
	  	if(button.hasClass('create-user')){
	  		var type = "create";
	  	}
		var email = $('#user-email').val();
		var user_id = $('#hidden-user-id').val();
		
		$.ajax({
		    type: 'POST', 
		    url: appHome+'/user/common_ajax',  
		    async : false,
		    data: {
				'email' : email,
				'type'	: type,
				'user_id' : user_id,
				'action_type' : 'email_exist'
			},
		    success: function(response){
		    	if(response > 0){
		    		is_email_exist = 'Exist';
		    	}else{
		    		is_email_exist = 'Ok';
		    	}
		    },
		    error: function(response){
		      	$('html, body').animate({ scrollTop: 0 }, 400);
		      	$('form').find('#response').empty().prepend(alert_error).fadeIn();
		    }
		});
		
  	}

  	function checkCommonPassword(password){
	  	var count =0;
	  
	  	$.ajax({
	    	type: 'POST', 
	    	url: appHome+'/auth/common-ajax',  
	    	async : false,
	    	data: {
	      		'password'    : password,
	      		'action_type' : 'check_common_password'
	    	},
	    	success: function(response){
	      		if(response){
	        		count = response;
	      		}
	    	},
	    	error: function(response){
	      		$('html, body').animate({ scrollTop: 0 }, 400);
	      		$('form').find('#response').empty().prepend(alert_error).fadeIn();
	    	}
	  	});
	  	return count;
	}

  	function checkStrongPassword(password) {
	    var regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
	    //var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
	    var char_regex = /^(?!.*[!@#$%^&*()\-_+={}[\]|\\;:'",<.>\/?]{2}).+$/;
	    var test = regex.test(password.val());
	    if(test){
	    	var test_char = char_regex.test(password.val());
    		if(test_char){
		      	password_strength = 'good';
		      	var count = checkCommonPassword(password.val());
			    if(count == 1){
			      	password_strength = 'weak';
			    }
			}
			else{
				password_strength = 'weak';
			}
	    }else{
	      	password_strength = 'weak';
	    }
  	}

	if($('#user-username').val() != '' ){
		isUsernameExists($(form).find('#user-username'),$(this)); //function for chech username exist or not
	}

	if($('#user-email').val() != ''){
		isEmailExists($(form).find('#user-email'),$(this)); //function for chech username exist or not
	}

  	if($(this).hasClass('create-user')){
	  if($('#user-password').val() != ''){
	    checkStrongPassword($(form).find('#user-password'));
	  }
	}
  
  highlight($(form).find('#user-fullname'), '');
  highlight($(form).find('#user-email'), '');
  highlight($(form).find('#user-username'), '');
  
  if($('#form-type').val() == 'add'){
	  highlight($(form).find('#user-password'), '');
	  highlight($(form).find('#user-cpassword'), '');
  }
  if(($('#form-type').val() == 'edit') && ($('#confirm_change_password:checkbox:checked').length > 0) ){
	  highlight($(form).find('#user-password'), '');
	  highlight($(form).find('#user-cpassword'), '');
  }
  if($('#user-password').val() != $('#user-cpassword').val()){
	  $('#user-password').parent().addClass('highlight');
	  $('#user-cpassword').parent().addClass('highlight');
      success.push(false);
  }
  
  if($('#user-email').val() != ''){
	  isEmail($(form).find('#user-email'));
  }
  if(ExistSuccess == 'Exist'){
	  success.push(false);
	  $('#user-username').parent().addClass('highlight');
  	  alert_required =  '<div class="alert alert-danger alert-dismissable">'
  		  					+'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
  		  					+'<i class="fa fa-exclamation-triangle"></i>' 
  		  					+'<strong>Uh oh!</strong> This Username already exists.</div>';
  }else if(is_email_exist == 'Exist'){
	  success.push(false);
	  $('#user-email').parent().addClass('highlight');
  	  alert_required =  '<div class="alert alert-danger alert-dismissable">'
  		  					+'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
  		  					+'<i class="fa fa-exclamation-triangle"></i>' 
  		  					+'<strong>Uh oh!</strong> This Email already exists.</div>';
  }
  else if(password_strength == 'weak'){
    success.push(false);
    $('#user-password').parent().addClass('highlight');
    alert_required =  '<div class="alert alert-danger alert-dismissable">'
                +'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
                +'<i class="fa fa-exclamation-triangle"></i>' 
                +'<strong>Weak Password!</strong> Password should have the following characteristics<br>'
                +'<ul><li>Minimum eight characters</li><li>Minimum one uppercase letter</li>'
                +'<li>Minimum one lowercase letter</li><li>Minimum one number</li>'
                +'<li>Minimum one special character</li><li>Avoid consecutive special characters'
                +'</li></ul><br>Note: Also be cautious to avoid common passwords</div>';
  }
  else{
	  success.push(true); 
	  alert_required = oldalert;
  }   
  var check_fields = (success.indexOf(false) > -1);
  /**
  * update edit-vgm-route
  */
  if($(this).hasClass('edit-user')){
	 
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {
    	$(this).prop('disabled','disabled');
    	var user_id = $('#hidden-user-id').val();
      $.ajax({
        type: 'POST',
        url: appHome+'/user/'+user_id+'/update',
        data: $(form).serialize().replace(/%5B%5D/g, '[]'),
        success: function(response){
          window.location.href = $('#returnpath').val();
          localStorage.setItem('response', response);
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  }
  
  /**
   * create-vgm-route
   */
   if($(this).hasClass('create-user')){
     if(check_fields === true){
       $('html, body').animate({ scrollTop: 0 }, 400);
       $('form').find('#response').empty().prepend(alert_required).fadeIn();
     } else {
       $(this).prop('disabled','disabled');
       $.ajax({
         type: 'POST',
         url: appHome+'/user/add',
         data: $(form).serialize().replace(/%5B%5D/g, '[]'),
         success: function(response){
           window.location.href = $('#returnpath').val();
           localStorage.setItem('response', response);
         },
         error: function(response){
           $('html, body').animate({ scrollTop: 0 }, 400);
           $('form').find('#response').empty().prepend(alert_error).fadeIn();
         }
       });
     }
   }
});

//Delete VGM Route
$('.delete-vgm-route').click(function(e) {
	e.preventDefault();
	
	var delete_url = $(this).attr('href'),
		route_id = $(this).data('route-id'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
	
	BootstrapDialog.confirm('Are you sure you want to delete this VGM Route ?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				url: delete_url,
				data: {'route_id' : route_id},
				success: function(response){
					//location.reload();
					window.location.href = return_url;
					localStorage.setItem('response', response);
				},
				error: function(response){
					BootstrapDialog.show({title: 'VGM Route', message : 'Unable to delete this VGM Route. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		} 
	});
});

});//end of document ready
