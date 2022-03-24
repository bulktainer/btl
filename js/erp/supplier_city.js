$(document).ready(function(){
	
	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
	
	//To do the pagination while we change the count of the result
	$(document).on('change', '.custom-page-pagesize', function (e) {
		 var pagelimit = $(this).val();
		 $('#pagesize').val(pagelimit);
		 $('.city_core').submit();
	});
	
	//Delet particular city
	$(document).on('click','.delete-city',function(e){
		e.preventDefault();
		var delete_url 	= $(this).attr('href'),
			city_id 	= $(this).data('city-id'),
			return_url 	= window.location.href;
			
		BootstrapDialog.confirm('Are you sure you want to delete this City?', function(result){
			if(result) {
				$.ajax({
					type : 'POST',
					url  : delete_url,
					data :{
						'city_id' : city_id
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
	* city edit and update
	*/
	$('.create-city,.edit-city').click(function(e){
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
	  function isCityNameExists(city,iso,button) {
		ExistSuccess = [];
		if(button.hasClass('edit-city')){
	  		var type = "update";
	  	}
	  	if(button.hasClass('create-city')){
	  		var type = "create";
	  	}
		var cityname = $('#city_name').val();
		var countryiso 	= $('#country').val();
		
		if(type == "create" && cityname !="" && countryiso !=""){
			  $.ajax({
			        type: 'POST',
			        url: appHome+'/supplier-city/common_ajax',
			        async : false,
			        data: {
						'cityname' 		: cityname,
						'countryiso'	: countryiso,
						'action_type' 	: 'citynameexist'
					},
			        success: function(response){
			        var obj = JSON.parse(response);
			        	if(obj.name == 'yes'){
			        		ExistSuccess = 'Exist'
			        		$(city).parent().addClass('highlight');
			        	}else{
			        		ExistSuccess = 'Ok'
				        	$(city).parent().removeClass('highlight');
			        	}
			        },
			        error: function(response){
			          $('html, body').animate({ scrollTop: 0 }, 400);
			          $('form').find('#response').empty().prepend(alert_error).fadeIn();
			        }
			  });
		}
	  }

	  highlight($(form).find('#city_name'), '');
	  highlight($(form).find('#country'), '');
	  highlight($(form).find('#latitude'), '');
	  highlight($(form).find('#longitude'), '');

	  if($('#city_name').val() != '' ){
		  isCityNameExists($(form).find('#city_name'), $(form).find('#country'), $(this)); //function for check city name exist or not
	  }
	  
	  if(ExistSuccess == 'Exist'){
		  success.push(false);
	  	  alert_required =  '<div class="alert alert-danger alert-dismissable">'
	  		  					+'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
	  		  					+'<i class="fa fa-exclamation-triangle"></i>'
	  		  					+'<strong>Uh oh!</strong> This City name already exists in the same country.</div>';
	  }else{
		  success.push(true);
		  alert_required = oldalert;
	  }

	  var check_fields = (success.indexOf(false) > -1);
	  console.log(success);

	  /**
	  * update edit-vgm-route
	  */
	  if($(this).hasClass('edit-city')){
		 var city_id = $('#city_id').val();
	    if(check_fields === true){
	      $('html, body').animate({ scrollTop: 0 }, 400);
	      $('form').find('#response').empty().prepend(alert_required).fadeIn();
	    } else {
	    	$(this).prop('disabled','disabled');
	      $.ajax({
	        type: 'POST',
	        url: appHome+'/supplier-city/'+city_id+'/update',
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
	   if($(this).hasClass('create-city')){

	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	       $(this).prop('disabled','disabled');
	       $.ajax({
	         type: 'POST',
	         url: appHome+'/supplier-city/add',
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