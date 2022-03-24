/**
* add/update bank account
*/
$('.add-currency, .update-currency').click(function(e){
  e.preventDefault();

  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      bank_account_id = $('input[name="bank_account_id"]').val(),
      path = $(this).attr('data-path');
 
  success.push(highlight($(form).find('#currency-name'), ''));
  success.push(highlight($(form).find('#currency-desc'), ''));
  success.push(highlight($(form).find('#currency-symbol'), ''));
  var check_fields = (success.indexOf(false) > -1);

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
  /**
  * Add bank account
  */
  if($(this).hasClass('add-currency')){
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
  

  /**
  * update supplier invoice
  */
  if($(this).hasClass('update-currency')){
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('.response').empty().prepend(alert_required).fadeIn();
    } else {
      $.ajax({
        type: 'POST',
        url: '../'+bank_account_id+'/update/',
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
});


// Delete bank account
$('.delete_btn').click(function(e) {
	e.preventDefault();
	
	var delete_url 	= $(this).attr('href'),
	currency_id 	= $(this).data('currency-id'),
    path 			= $(this).attr('data-path'),
	$this 			= $(this),
	return_url 		= window.location.href;
    	
	BootstrapDialog.confirm('Are you sure you want to delete this Currency?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				url: delete_url,
				data: {'currency_id' : currency_id},
				success: function(response){
					window.location.href = return_url;
					localStorage.setItem('response', response);
				},
				error: function(response){
					BootstrapDialog.show({title: 'Bank Account', message : 'Unable to delete this Currency. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		} 
	});
});
