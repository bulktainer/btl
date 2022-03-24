$(document).ready(function(){
	
$(document).on('change', '.custom-page-pagesize', function(e) {
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('#supplier-route-email-form').submit();
});
	
var ExistSuccess = 'Ok';
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var oldalert = alert_required;
	
/**
* update edit-vgm-route
*/
$('.edit-supplier-mail-route,.create-supplier-mail-route').click(function(e){
	  
  $('.highlight').removeClass('highlight');
  $('.highlight').attr('title','')
  e.preventDefault();
  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      suppRouteId = $('input[name="supp_route_id"]').val(),
      path = $(this).attr('data-path');

  function highlight(field, empty_value){
    if(field.length > 0){
      if(field.val().trim() === empty_value){
        $(field).parent().addClass('highlight');
        $(field).parent().attr('title','Required');
        success.push(false);
      } else {
        $(field).parent().removeClass('highlight');
        $(field).parent().attr('title','');
        success.push(true);
      }
    }
  }
  
  function isEmail(email) {
	  //var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	  var regex = btl_email_regex;
	  var emailaddress = email.val().trim();
	  var t = regex.test(emailaddress);
	  if(t){
		  $(email).parent().removeClass('highlight');
		  $(email).parent().attr('title','');
		  success.push(true);
	  }else{
		  $(email).parent().addClass('highlight');
		  $(email).parent().attr('title','Invalid Email Address');
	        success.push(false);
	  }
	}

  function isrouteExist(tmodeObj,button) {
	ExistSuccess = [];
	  
	if(button.hasClass('edit-supplier-mail-route')){
  		var type = "update";
  	}
  	if(button.hasClass('create-supplier-mail-route')){
  		var type = "create";
  	}
	var tmode = tmodeObj.val();
	var routeID = $('#supp_route_id').val();
	
	  $.ajax({
	        type: 'POST', 
	        url: path+'/common_ajax',
	        async : false,
	        data: {
				'tmode'   : tmode,
				'action_type' : 'check_route_exists',
				'type' : type,
				'routeID' : routeID
			},
	        success: function(response){
	        	if(response > 0){
	        		ExistSuccess = 'Exist'
	        		$(tmodeObj).parent().addClass('highlight');	 
	        	}else{
	        		ExistSuccess = 'Ok'
	        		$(tmodeObj).parent().removeClass('highlight');
	        	}
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	  });
  }
  
  function checkemailValueSame(classname){
	  var inputs = $('.'+classname);
	 // console.log(inputs);
	  var returnValue = inputs.filter(function(i,el){
		      return inputs.not(this).filter(function() {
		    	  return this.value.trim() === el.value.trim();
		      }).length !== 0;
	  });
	  returnValue.each(function( index ) {
		  if($(this).val().trim() != ''){
			  $(this).parent().addClass('highlight');
			  $(this).parent().attr('title','Same Email');
			  success.push(false);
		  }
		});
  }
  
  highlight($(form).find('#toname-filter'), '');
  highlight($(form).find('#toemail-filter'), '');  
   
  if($('#toemail-filter').val() != ''){
	  isEmail($(form).find('#toemail-filter'));
	  highlight($(form).find('#toname-filter'), '');
  }
  if($('#toname-filter').val() != ''){
	  	highlight($(form).find('#toemail-filter'), '');
  		isEmail($(form).find('#toemail-filter'));
  }
  
  if($('#toemail-filter-2').val() != ''){
	  isEmail($(form).find('#toemail-filter-2'));
	  highlight($(form).find('#toname-filter-2'), '');
  }
  if($('#toname-filter-2').val() != ''){
	  	highlight($(form).find('#toemail-filter-2'), '');
  		isEmail($(form).find('#toemail-filter-2'));
  }
  
  if($('#toemail-filter-3').val() != ''){
	  isEmail($(form).find('#toemail-filter-3'));
	  highlight($(form).find('#toname-filter-3'), '');
  }
  if($('#toname-filter-3').val() != ''){
	  	highlight($(form).find('#toemail-filter-3'), '');
  		isEmail($(form).find('#toemail-filter-3'));
  }
  
  if($('#toemail-filter-4').val() != ''){
	  isEmail($(form).find('#toemail-filter-4'));
	  highlight($(form).find('#toname-filter-4'), '');
  }
  if($('#toname-filter-4').val() != ''){
	  	highlight($(form).find('#toemail-filter-4'), '');
  		isEmail($(form).find('#toemail-filter-4'));
  }
  
  checkemailValueSame('email-field');
  isrouteExist($(form).find('#transport_mode'),$(this));
  highlight($(form).find('#transport_mode'), '');
  
 
  
  if(ExistSuccess == 'Exist'){
	  success.push(false);
  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This Supplier Route already exists.</div>';
  }else{
	  success.push(true); 
	  alert_required = oldalert;
  }   
  var check_fields = (success.indexOf(false) > -1);
  /**
  * update edit-vgm-route
  */
  if($(this).hasClass('edit-supplier-mail-route')){

    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {
      $.ajax({
        type: 'POST',
        url: '../'+suppRouteId+'/update',
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
   if($(this).hasClass('create-supplier-mail-route')){
     if(check_fields === true){
       $('html, body').animate({ scrollTop: 0 }, 400);
       $('form').find('#response').empty().prepend(alert_required).fadeIn();
     } else {
       $.ajax({
         type: 'POST',
         url: path+'/add',
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
$('.delete-route').click(function(e) {
	e.preventDefault();
	
	var delete_url = $(this).attr('href'),
		route_id = $(this).data('route-id'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
	
	BootstrapDialog.confirm('Are you sure you want to delete this Supplier Route Email ?', function(result){
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
					BootstrapDialog.show({title: 'VGM Route', message : 'Unable to delete this Route. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		} 
	});
});
});//end of document ready