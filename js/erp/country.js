$(document).ready(function(){
	
	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
	
	//To do the pagination while we change the count of the result
	$(document).on('change', '.custom-page-pagesize', function (e) {
		 var pagelimit = $(this).val();
		 $('#pagesize').val(pagelimit);
		 $('.country_core').submit();
	});
	
	//To view the details of the corresponding country
	$(document).on('click','.view_country',function(e){
		$('.view_small_loader').show();
		$('.reset_values').html('');
		var country_id = $(this).data('id');
		$.ajax({
			type	: 'POST',
			dataType: 'json',
			url		: appHome+'/country/common_ajax',
			data	:{
				'country_id' 	: country_id,
				'action_type' 	: 'get_country_details'
				},
			success	:function(response){
				$('.view_small_loader').hide();
				if(response != ""){
					$('#modal_contry_name').html(response.name);
					$('#modal_iso').html(response.iso);
					$('#modal_printable_name').html(response.printable_name);
					$('#modal_iso3').html(response.iso3);
					$('#modal_numcode').html(response.numcode);
				}
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	});
	
	//Delet particular country
	$(document).on('click','.delete-country',function(e){
		e.preventDefault();
		var delete_url 	= $(this).attr('href'),
			country_id 	= $(this).data('country-id'),
			country_iso	= $(this).data('iso'),
			return_url 	= window.location.href;
		BootstrapDialog.confirm('Are you sure you want to delete this Country?', function(result){
			if(result) {
				$.ajax({
					type : 'POST',
					url  : delete_url,
					data :{
						'country_id' 	: country_id,
						'country_iso'	: country_iso
					},
					success: function(response){
						window.location.href = return_url;
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
	
	/**
	* country edit and update
	*/
	$('.create-country,.edit-country').click(function(e){
	  $('.highlight').removeClass('highlight');
	  e.preventDefault();
	  var form = '#'+$(this).closest('form').attr('id'),
	      success = [],
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
	  //function to check whether the customer name or iso excist
	  function isCountrynameIsoExists(country,iso,button) {
		ExistSuccess = [];
		if(button.hasClass('edit-country')){
	  		var type = "update";
	  	}
	  	if(button.hasClass('create-country')){
	  		var type = "create";
	  	}
		var countryname = $('#country_name').val();
		var countryiso 	= $('#country_iso').val();
		
		if(type == "create" && countryname !="" && countryiso !=""){
			  $.ajax({
			        type: 'POST',
			        url: appHome+'/country/common_ajax',
			        async : false,
			        data: {
						'countryname' 	: countryname,
						'countryiso'	: countryiso,
						'action_type' 	: 'countrynameexist'
					},
			        success: function(response){
			        var obj = JSON.parse(response);
			        	if(obj.name == 'yes'){
			        		ExistSuccess = 'Exist'
			        		$(country).parent().addClass('highlight');
			        	}else{
			        		ExistSuccess = 'Ok'
				        	$(country).parent().removeClass('highlight');
			        	}
			        	if(obj.iso == 'yes'){
			        		ExistSuccess = 'Exist'
				        	$(iso).parent().addClass('highlight');
			        	}else{
			        		ExistSuccess = 'Ok'
			        		$(iso).parent().removeClass('highlight');
			        	}
			        },
			        error: function(response){
			          $('html, body').animate({ scrollTop: 0 }, 400);
			          $('form').find('#response').empty().prepend(alert_error).fadeIn();
			        }
			  });
		}
	  }

	  
	  
	  highlight($(form).find('#country_name'), '');
	  highlight($(form).find('#country_iso'), '');
	  highlight($(form).find('#printable_name'), '');
	  highlight($(form).find('#country_iso3'), '');
	  highlight($(form).find('#country_numcode'), '');
	  
	  
	  if($('#country_name').val() != '' ){
		  isCountrynameIsoExists($(form).find('#country_name'),$(form).find('#country_iso'),$(this)); //function for chech country name or iso exist or not
	  }
	  
	  if(ExistSuccess == 'Exist'){
		  success.push(false);
	  	  alert_required =  '<div class="alert alert-danger alert-dismissable">'
	  		  					+'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
	  		  					+'<i class="fa fa-exclamation-triangle"></i>'
	  		  					+'<strong>Uh oh!</strong> This Country name or ISO already exists.</div>';
	  }else{
		  success.push(true);
		  alert_required = oldalert;
	  }
	  var check_fields = (success.indexOf(false) > -1);
	  console.log(success);
	  /**
	  * update edit-vgm-route
	  */
	  if($(this).hasClass('edit-country')){
		 var country_id = $('#country_id').val();
	    if(check_fields === true){
	      $('html, body').animate({ scrollTop: 0 }, 400);
	      $('form').find('#response').empty().prepend(alert_required).fadeIn();
	    } else {
	    	$(this).prop('disabled','disabled');
	      $.ajax({
	        type: 'POST',
	        url: appHome+'/country/'+country_id+'/update',
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
	   if($(this).hasClass('create-country')){
		   console.log(check_fields);
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	       $(this).prop('disabled','disabled');
	       $.ajax({
	         type: 'POST',
	         url: appHome+'/country/add',
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
});//end of document ready