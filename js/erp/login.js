var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
var alert_password = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Password mismatch, please try again.</div>';
var alert_history_password = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Choose a password that is different from your last passwords</div>';
var alert_email = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Invalid mail address.</div>';
var old_alert = alert_required;
var success = [];
var exist_status = '';
var history_status = '';
var password_strength = '';

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

function isPasswordExist() {

  var password = $('#old_password').val().trim();
  var user_id = $('#user_id').val();
  
  $.ajax({
    type: 'POST', 
    url: appHome+'/auth/common-ajax',  
    async : false,
    data: {
      'password'    : password,
      'user_id'     : user_id,
      'action_type' : 'password_exist'
    },
    success: function(response){
      if(response == 1){
        exist_status = 'exist';
        $('#old_password').parent().removeClass('highlight');
      }else{
        exist_status = 'none';
        $('#old_password').parent().addClass('highlight');
      }
    },
    error: function(response){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_error).fadeIn();
    }
  });
}

function checkHistoryPassword() {

  var password = $('#new_password').val().trim();
  var user_id = $('#user_id').val();
  
  $.ajax({
    type: 'POST', 
    url: appHome+'/auth/common-ajax',  
    async : false,
    data: {
      'password'    : password,
      'user_id'     : user_id,
      'action_type' : 'check_history_password'
    },
    success: function(response){
      if(response == 1){
        history_status = 'exist';
        $('#new_password').parent().removeClass('highlight');
      }else{
        history_status = 'none'
        $('#new_password').parent().addClass('highlight');
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
  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
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

$(document).on('click','.reset_password',function(e){
	e.preventDefault();
	$('.highlight').removeClass('highlight');
	var form = '#'+$(this).closest('form').attr('id');
  success = [];
  exist_status = '';
  history_status = '';
  password_strength = '';

  if($('#new_password').val() != ''){
    checkStrongPassword($(form).find('#new_password'));
  }

  if($('#old_password').val() != ''){
    // existing 
    isPasswordExist();
  }

  if($('#new_password').val() != ''){
    checkHistoryPassword();
  }

  highlight($(form).find('#old_password'), '');
	highlight($(form).find('#new_password'), '');
	highlight($(form).find('#confirm_password'), '');

  if(exist_status == 'none'){
    success.push(false);
    $('#old_password').parent().addClass('highlight');
    alert_required =  '<div class="alert alert-danger alert-dismissable">'
                +'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
                +'<i class="fa fa-exclamation-triangle"></i>' 
                +'<strong>Uh oh!</strong> Old password is incorrect.</div>';
  }else if(password_strength == 'weak'){
    success.push(false);
    $('#new_password').parent().addClass('highlight');
    alert_required =  '<div class="alert alert-danger alert-dismissable">'
                +'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
                +'<i class="fa fa-exclamation-triangle"></i>' 
                +'<strong>Weak Password!</strong> Password should have the following characteristics<br>'
                +'<ul><li>Minimum eight characters</li><li>Minimum one uppercase letter</li>'
                +'<li>Minimum one lowercase letter</li><li>Minimum one number</li>'
                +'<li>Minimum one special character</li><li>Avoid consecutive special characters'
                +'</li></ul><br>Note: Also be cautious to avoid common passwords</div>';
  }else if(history_status == 'exist'){
    success.push(false);
    $('#new_password').parent().addClass('highlight');
    alert_required =  '<div class="alert alert-danger alert-dismissable">'
                +'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
                +'<i class="fa fa-exclamation-triangle"></i>' 
                +'<strong>Uh oh!</strong> Choose a password that is different from your last passwords.</div>';
  }else{
    success.push(true); 
    alert_required = old_alert;
  }  

	var check_fields = (success.indexOf(false) > -1);
	if(check_fields === true){
    $('html, body').animate({ scrollTop: 0 }, 400);
    $('form').find('#response').empty().prepend(alert_required).fadeIn();
  } else if($('#new_password').val().trim() != $('#confirm_password').val().trim()) {
  	$('html, body').animate({ scrollTop: 0 }, 400);
    $('form').find('#response').empty().prepend(alert_password).fadeIn();
  }else{
  	$(this).prop('disabled','disabled');
  	var user_id = $('#hidden-user-id').val();
    var type = $('#type').val();

  	$.ajax({
    	type: 'POST',
    	url: appHome+'/auth/save-password',
    	data: $(form).serialize().replace(/%5B%5D/g, '[]'),
    	success: function(response){
      	if(type == 'token'){
          window.location.href = appHome+'/auth/login';
          localStorage.setItem('response', response);
        }
        else{
          window.location.href = appHome+'/user/index';
          localStorage.setItem('response', response);
        }
    	},
      error: function(response){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_error).fadeIn();
      }
  	});
  }
});

function isEmail(email) {
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

$(document).on('click','.forgot_password',function(e){
  e.preventDefault();
  $('.highlight').removeClass('highlight');
  var button = $('.forgot_password');
  var form = '#'+$(this).closest('form').attr('id'),
    success = [],
    mail_check = '',
    exist_status = '';

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
    var regex = btl_email_regex;
    var test = regex.test(email.val());
    if(test){
      $(email).parent().removeClass('highlight');
      mail_check = 'valid';
    }else{
      $(email).parent().addClass('highlight');
      mail_check = 'invalid';
    }
  }

  function isEmailExist(email) {
    var email_name = email.val().trim();
    
    $.ajax({
      type: 'POST', 
      url: appHome+'/auth/common-ajax',  
      async : false,
      data: {
        'email'    : email_name,
        'action_type' : 'email_exist'
      },
      success: function(response){
        if(response == 1){
          exist_status = 'exist';
          $(email).parent().removeClass('highlight');
        }else{
          exist_status = 'none';
          $(email).parent().addClass('highlight');
        }
      },
      error: function(response){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_error).fadeIn();
      }
    });
  }

  highlight($(form).find('#email'), '');

  if($('#email').val() != ''){
    isEmail($(form).find('#email'));
    isEmailExist($(form).find('#email'));
  }

  var check_fields = (success.indexOf(false) > -1);
  if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
  } else if(mail_check == 'invalid') {
    $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_email).fadeIn();
  }else if(exist_status == 'none') {
    $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_email).fadeIn();
  }else{
    $(this).prop('disabled','disabled');
    var user_id = $('#hidden-user-id').val();
    
    $.ajax({
      type: 'POST',
      url: appHome+'/auth/common-ajax',
      data: {
        'email' : $('#email').val().trim(),
        'action_type' : 'password_reset_mail'
      },
      success: function(response){
        button.removeAttr('disabled');
        $('form').find('#response').empty().prepend(response).fadeIn();
        button.hide();
        $('.back_login').show();
      },
      error: function(response){
        button.removeAttr('disabled');
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_error).fadeIn();
      }
    });
  }
});

$(document).on('click','.change_password',function(e){
  e.preventDefault();
  $('.highlight').removeClass('highlight');
  var form = '#'+$(this).closest('form').attr('id');
  success = [];
  exist_status = '';
  history_status = '';
  password_strength = '';

  if($('#new_password').val() != ''){
    checkStrongPassword($(form).find('#new_password'));
  }

  if($('#new_password').val() != ''){
    checkHistoryPassword();
  }

  highlight($(form).find('#new_password'), '');
  highlight($(form).find('#confirm_password'), '');

  if(password_strength == 'weak'){
    success.push(false);
    $('#new_password').parent().addClass('highlight');
    alert_required =  '<div class="alert alert-danger alert-dismissable">'
                +'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
                +'<i class="fa fa-exclamation-triangle"></i>' 
                +'<strong>Weak Password!</strong> Password should have the following characteristics<br>'
                +'<ul><li>Minimum eight characters</li><li>Minimum one uppercase letter</li>'
                +'<li>Minimum one lowercase letter</li><li>Minimum one number</li>'
                +'<li>Minimum one special character</li><li>Avoid consecutive special characters</li>'
                +'</ul><br>Note: Also be cautious to avoid common passwords.</div>';
  }else if(history_status == 'exist'){
    success.push(false);
    $('#new_password').parent().addClass('highlight');
    alert_required =  '<div class="alert alert-danger alert-dismissable">'
                +'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
                +'<i class="fa fa-exclamation-triangle"></i>' 
                +'<strong>Uh oh!</strong> Choose a password that is different from your last passwords.</div>';
  }else{
    success.push(true); 
    alert_required = old_alert;
  }  

  var check_fields = (success.indexOf(false) > -1);
  if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
  } else if($('#new_password').val().trim() != $('#confirm_password').val().trim()) {
    $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_password).fadeIn();
  }else{
    $(this).prop('disabled','disabled');
    var user_id = $('#hidden-user-id').val();
    var type = $('#type').val();
    
    $.ajax({
      type: 'POST',
      url: appHome+'/auth/save-password',
      data: $(form).serialize().replace(/%5B%5D/g, '[]'),
      success: function(response){
        if(type == 'token'){
          window.location.href = appHome+'/auth/login';
          localStorage.setItem('response', response);
        }
        else{
          window.location.href = appHome+'/user/index';
          localStorage.setItem('response', response);
        }
      },
      error: function(response){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_error).fadeIn();
      }
    });
  }
});

window.addEventListener("load", function(){
  var oldUnameValue = '';
    $("#username").bind("focusout change", function (event) {
      setTimeout(function() {
      checkIfUserExists();
      }, 100);
    });
  // $( "#username" ).keypress(function() {
  //   setTimeout(function() {
  //       var newUnameValue = $( "#username" ).val();
  //       if(oldUnameValue != newUnameValue){
  //         checkIfUserExists();
  //       }
  //       oldUnameValue = newUnameValue;
  //     }, 100);
  // });
});
$(function() {
  $('#login').attr('autocomplete', 'off');
  $('#login input').attr('autocomplete', 'off');
  $( "#username" ).attr('readonly', true);
        setTimeout(function() {
           $( "#username" ).attr('readonly', false);
      }, 700);
});
function checkIfUserExists(){

  var username = $('#username').val();
 
  if(username.length >= 4){
    $.ajax({
      type: 'POST', 
      url: appHome+'/auth/common-ajax',  
      async : false,
      data: {
        'username'    : username,
        'action_type' : 'check_if_existing_user'
      },
      success: function(response){
        if(response == 1){
          $('#passCodeDiv').show();
        }else{
          $('#passCodeDiv').hide();
        }
      },
      error: function(response){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_error).fadeIn();
      }
    });
  }
}

