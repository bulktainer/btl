/**
* add/update bank account
*/
$('.update-bank-account, .add-bank-account').click(function(e){
  e.preventDefault();

  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      bank_account_id = $('input[name="bank_account_id"]').val(),
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
  
  highlight($(form).find('#title'), '');
  highlight($(form).find('#bank'), '');
  highlight($(form).find('#iban'), '');
  highlight($(form).find('#swift'), '');
  highlight($(form).find('#sort_code'), '');
  highlight($(form).find('#account_number'), '');
  highlight($(form).find('#currency'), '');

  var check_fields = (success.indexOf(false) > -1);

  /**
  * Add bank account
  */
  if($(this).hasClass('add-bank-account')){
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
  if($(this).hasClass('update-bank-account')){
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
$('.delete-bank-account').click(function(e) {
	e.preventDefault();
	
	var delete_url = $(this).data('href'),
		bank_account_id = $(this).data('bank-account-id'),
    path = $(this).attr('data-path'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
    	
	BootstrapDialog.confirm('Are you sure you want to delete this Bank Account?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				url: delete_url,
				data: {'bank_account_id' : bank_account_id},
				success: function(response){
					//location.reload();
          window.location.href = path+'/index';
					localStorage.setItem('response', response);
				},
				error: function(response){
					BootstrapDialog.show({title: 'Bank Account', message : 'Unable to delete this Bank Account. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		} 
	});
});
