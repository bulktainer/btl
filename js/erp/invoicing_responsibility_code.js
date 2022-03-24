$('.update-invres-code,.add-invres-code').click(function(e){
	
  e.preventDefault();  
  
  var form = '#'+$(this).closest('form').attr('id'),
  success = [],
  inv_responsibility_id = $('input[name="inv_responsibility_id"]').val(),
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
highlight($(form).find('#inv_responsibility_name'), '');
highlight($(form).find('#inv_responsibility_code'), '');

var check_fields = (success.indexOf(false) > -1);

	if($(this).hasClass('add-invres-code')){
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
	
	if ($(this).hasClass('update-invres-code')) {
	    if (check_fields === true) {
	      $('html, body').animate({
	        scrollTop: 0
	      }, 400);
	      $('form').find('.response').empty().prepend(alert_required).fadeIn();
	    } else {
	      $.ajax({
	        type: 'POST',
	        url: '../' + inv_responsibility_id + '/edit/',
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

$(document).on('click', '.delete-inv-responsibility-code', function (e) {

	  e.preventDefault();
	  var delete_url = $(this).data('href'),
	  invoicing_responsibility_id = $(this).data('invoicing-responsibility-id'),
	  invoicing_responsibility_code = $(this).data('invoicing-responsibility-code'),
	    path = $(this).attr('data-path'),
	    $this = $(this),
	    return_url = window.location.href;
	  if ($('#returnpath').val()) {
	    return_url = $('#returnpath').val();
	  }

	  BootstrapDialog.confirm('Are you sure you want to delete this Invoicing Responsibility Code?', function (result) {
	  
	    if (result) {
	      $.ajax({
	        type: 'POST',
	        url: delete_url,
	        data: {
	          'invoicing_responsibility_id': invoicing_responsibility_id,
	          'invoicing_responsibility_code':invoicing_responsibility_code
	        },
	        success: function (response) {
	        	if(response==''){
		          BootstrapDialog.show({
			            title: 'Invoicing Responsibility Code',
			            message:"This Invoicing Responsibility Code can't be  deleted, as its already assigned.",
			            buttons: [{
			              label: 'Close',
			              action: function (dialogRef) {
			                dialogRef.close();
			              }
			            }],
			            cssClass: 'small-dialog',
			          });
	        	}
	        	else{
	        	localStorage.setItem('response', response);
	        	window.location.href = path + '/index';
	        	}
	         
	        },
	        error: function (response) {
	          BootstrapDialog.show({
	            title: 'Invoicing Responsibility Code',
	            message: 'Unable to delete this Invoicing Responsibility Code. Please try later.',
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
