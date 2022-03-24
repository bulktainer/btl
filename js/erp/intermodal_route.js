$(document).ready(function(){
	
var ExistSuccess = 'Ok';
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var oldalert = alert_required;
	
/**
* update edit-intermodal-route
*/
$('.edit-intermodal-route,.create-intermodal-route').click(function(e){
  $('.highlight').removeClass('highlight');
  e.preventDefault();
  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      intermodal_id = $('input[name="intermodal_id"]').val(),
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

  function isrouteExist(fromTown,toTown,supplier,button) {
	ExistSuccess = [];
	  
	if(button.hasClass('edit-intermodal-route')){
  		var type = "update";
  	}
  	if(button.hasClass('create-intermodal-route')){
  		var type = "create";
  	}
	var fromTownVal = fromTown.val();
	var toTownVal = toTown.val();
	var supplierVal = supplier.val();
	var intermodalID = $('#intermodal_id').val();
	
	  $.ajax({
	        type: 'POST', 
	        url: path+'/route_exist',
	        async : false,
	        data: {
				'fromTown' : fromTownVal,
				'toTown'   : toTownVal,
				'supplier' : supplierVal,
				'intermodalID'	   : intermodalID,
				'type'	   : type
			},
	        success: function(response){
	        	if(response > 0){
	        		ExistSuccess = 'Exist'
	        		$(fromTown).parent().addClass('highlight');
	        		$(toTown).parent().addClass('highlight');
	        		$(supplier).parent().addClass('highlight');	        		
	        	}else{
	        		ExistSuccess = 'Ok'
	        		$(fromTown).parent().removeClass('highlight');
	        		$(toTown).parent().removeClass('highlight');
	        		$(supplier).parent().removeClass('highlight');
	        	}
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	  });
  }
  
  //highlight($(form).find('#toname-filter'), '');
  //highlight($(form).find('#toemail-filter'), '');
  highlight($(form).find('#supplier'), '');
  highlight($(form).find('#from_town'), '');
  highlight($(form).find('#to_town'), '');
  highlight($(form).find('#option-filter'), '');
  //isEmail($(form).find('#toemail-filter'));
  
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

  if($('#from_town').val() != '' && $('to_town').val() != '' && $('#supplier').val() != ''){
	  //function for chech intermodal route exist or not
	  isrouteExist($(form).find('#from_town'),$(form).find('#to_town'),$(form).find('#supplier'),$(this));
  }
  if(ExistSuccess == 'Exist'){
	  success.push(false);
  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This Intermodal Route already exists.</div>';
  }else{
	  success.push(true); 
	  alert_required = oldalert;
  }   
  var check_fields = (success.indexOf(false) > -1);
  /**
  * update edit-intermodal-route
  */
  if($(this).hasClass('edit-intermodal-route')){

    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {
      $.ajax({
        type: 'POST',
        url: '../'+intermodal_id+'/update',
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
   * create-intermodal-route
   */
   if($(this).hasClass('create-intermodal-route')){
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

//Delete Intermodal Route
$('.delete-intermodal-route').click(function(e) {
	e.preventDefault();
	
	var delete_url = $(this).attr('href'),
		route_id = $(this).data('route-id'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
	
	BootstrapDialog.confirm('Are you sure you want to delete this Intermodal Route ?', function(result){
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
					BootstrapDialog.show({title: 'Intermodal Route', message : 'Unable to delete this Intermodal Route. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		} 
	});
});
});//end of document ready