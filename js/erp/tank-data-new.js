
$(document).ready(function(){

	var ExistSuccess = 'Ok';
	var invalidTank = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;

$('.create-Tank-data,.edit-Tank-data').click(function(e){
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
	  //email validation
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
	  
	  function isDataExist(text,button){
		  ExistSuccess = [];
		  
		  if(button.hasClass('edit-Tank-data')){
		  		var type = "update";
		  	}
		  	if(button.hasClass('create-Tank-data')){
		  		var type = "create";
		  	}
			  $.ajax({
			        type: 'POST', 
			        url: appHome+'/tank_master/common_ajax', 
			        async : false,
			        data: {
						'type' : type,
						'action_type' : 'check_tank_dd_data_exist',
						'data_type' : $('#data_type').val(),
						'tank_data_value' : $('#tank-data-value').val(),
						'tankDataId' : $('#tank_data_id').val()
					},
			        success: function(response){
			        	if(response > 0){
			        		ExistSuccess = 'Exist'
			        		$(text).parent().addClass('highlight');
			        	}else{
			        		ExistSuccess = 'Ok'
			        		$(text).parent().removeClass('highlight');
			        	}
			        },
			        error: function(response){
			          $('html, body').animate({ scrollTop: 0 }, 400);
			          $('form').find('#response').empty().prepend(alert_error).fadeIn();
			        }
			  });
	  }
	  /**
	   * numeric check
	   */
	  function isNumeric(value) {
		  var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
		  var str =value.val();
		  if(str.charAt(0) == '.'){
			  str = '0'+str;
		  }
		  if((numberRegex.test(str)) && (str >= 0)) {
			  $(value).parent().removeClass('highlight');
			  success.push(true);
		  }else{		  
			  $(value).parent().addClass('highlight');
		      success.push(false);
		  }  
		}
	  
	  if($('#data_type').val() == 'tank_allocation_override_permission'){
		  var tankDataValue =  $('#data_type_user');
	  }else{
		  var tankDataValue =  $('#tank-data-value');
	  }
	  highlight(tankDataValue, '');
	  
	  if(tankDataValue.val().trim() != '' && $('#data_type').val() == 'tank_height'){
		  isNumeric(tankDataValue, '');
	  }
	  if(tankDataValue.val().trim() != '' &&  $('#data_type').val() == 'tank_width'){
		  isNumeric(tankDataValue, '');
	  }
	  if(tankDataValue.val().trim() != '' &&  $('#data_type').val() == 'tank_length'){
		  isNumeric(tankDataValue, '');
	  }
	  if(tankDataValue.val().trim() != '' &&  $('#data_type').val() == 'compartments'){
		  isNumeric(tankDataValue, '');
	  }
	  if(tankDataValue.val().trim() != '' &&  $('#data_type').val() == 'tank_test_date_expiry_mail'){
		  isEmail(tankDataValue, '');
	  }
	  
	  var check_fields = (success.indexOf(false) > -1);
	  if(check_fields === false && $('#data_type').val() != 'tank_allocation_override_permission'){
		  isDataExist(tankDataValue,$(this));
	  }
	  
	  if(ExistSuccess == 'Exist'){
		  success.push(false);
	  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank data already exists.</div>';
	  }else{
		  success.push(true); 
		  alert_required = oldalert;
	  }
	  
	  var check_fields = (success.indexOf(false) > -1);
	  
	  /**
	   * create-tank-data
	   */
	   if($(this).hasClass('create-Tank-data')){
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	       $.ajax({
	         type: 'POST',
	         url: path+'/add-datatype',
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
    * update tank data
    */
    if($(this).hasClass('edit-Tank-data')){
  	var tank_data_id = $('#tank_data_id').val();
      if(check_fields === true){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_required).fadeIn();
      } else {
        $.ajax({
          type: 'POST',
          url: '../'+tank_data_id+'/update-tank-data',
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

//Delete tank
$('.delete-Tank-data').click(function(e) {
	e.preventDefault();
	
	var delete_url = $(this).attr('href'),
	tank_did  	= $(this).data('tank-did'),
	tank_type 	= $(this).data('tank-type'),
	tank_value 	= $(this).data('tank-value'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
	
	BootstrapDialog.confirm('Are you sure you want to delete this Tank data ?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				url: appHome+'/tank_master/common_ajax',
				data: {
					'action_type'  : 'delete_tank_data',
					   'tank_did'  : tank_did,
					   'tank_type' : tank_type,
					   'tank_value': tank_value},
				success: function(response){
					//location.reload();
					window.location.href = return_url;
					localStorage.setItem('response', response);
				},
				error: function(response){
					BootstrapDialog.show({title: 'VGM Route', message : 'Unable to delete this Tank. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		} 
	});
});

$('.create-Tank-save,.edit-Tank-update').click(function(e){
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
	  
	  /**
	   * function for validation in radio
	   */
	   function highlightRadio(fieldname){
		  
		  var radioTotal = $("input[type='radio'][name='"+fieldname+"']").length;
		  var checkedTotal = $("input[type='radio'][name='"+fieldname+"']:checked").length;
		  
		  if(checkedTotal == 0){
			  $("input[type='radio'][name='"+fieldname+"']").closest('.radio-validation-div').addClass('highlight-custome');
		      success.push(false);
		  }else{
			  $("input[type='radio'][name='"+fieldname+"']").closest('.radio-validation-div').removeClass('highlight-custome');
		      success.push(true);
		  }
	  }
	  
	  /**
	   * tank number valid or not
	   */
	  function tankNumberValid(txt){
		  var numReg = /^[a-zA-z]{4}[0-9]{6}\/[0-9]{1}$/;
		  var tno = txt.val();
		  if(numReg.test(tno)){
			  invalidTank = 'Ok';
			  $(txt).parent().removeClass('highlight');
			  success.push(true);
		  }else{		  
			  invalidTank = 'tankInvalid';
			  $(txt).parent().addClass('highlight');
		      success.push(false);
		  }
	  }
	  /**
	   * numeric check
	   */
	  function isNumeric(value) {
		  var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
		  var str =value.val();
		  if(str.charAt(0) == '.'){
			  str = '0'+str;
		  }
		  if((numberRegex.test(str)) && (str >= 0)) {
			  $(value).parent().removeClass('highlight');
			  success.push(true);
		  }else{		  
			  $(value).parent().addClass('highlight');
		      success.push(false);
		  }  
		  var check_fields = (success.indexOf(false) > -1);
		}
	  
	  /**
	   * tank number exist or not
	   */
	  function istankExist(tankNo,button) {
		ExistSuccess = [];
		  
		if(button.hasClass('edit-Tank-update')){
	  		var type = "update";
	  	}
	  	if(button.hasClass('create-Tank-save')){
	  		var type = "create";
	  	}
		var tankNumber = tankNo.val();
		var tank_id = $('#tank_id').val();
		
		  $.ajax({
		        type: 'POST', 
		        url: path+'/tank_exist',
		        async : false,
		        data: {
					'tankNumber' : tankNumber,
					'tank_id'	: tank_id,
					'type'	   : type
				},
		        success: function(response){
		        	if(response > 0){
		        		ExistSuccess = 'Exist';
		        		$(tankNo).parent().addClass('highlight');        		
		        	}else{
		        		ExistSuccess = 'Ok';
		        		$(tankNo).parent().removeClass('highlight');
		        	}
		        },
		        error: function(response){
		          $('html, body').animate({ scrollTop: 0 }, 400);
		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
		  });
	  }  
		  //page 1  
		  highlight($('#tank_no'), '');
		  highlight($('#tank_capacity'), '');
		  
		 
		  highlight($('#tank_length'), '');
		  highlight($('#tank_width'), '');
		  highlight($('#tank_height'), '');
		  highlight($('#tank_division'), '');
		  highlight($('#tank_weight'), '');
		  highlight($('#tank_compartments'), '');
		  highlight($('#tank_business_type'), '');
		  highlight($('#tank_catwalk'), '');
		  highlight($('#tank_t_number'), '');
		  highlight($('#tank-mot-date'), '');
		  highlight($('#tank_next_mot_date'), '');
		  highlight($('#tank_prev_test_date'), '');
		  highlight($('#tank_next_mot_type'), '');
		  highlight($('#tank_iso_code'), '');
		  highlightRadio('vapour_connection_position');
		  highlightRadio('liquid_connection_position');
		  highlightRadio('tank_syphon');
		  highlightRadio('tank_baffles');
		  highlightRadio('tank_handrail');
		  highlightRadio('tank_electric_tank');
		  if($.trim($('#tank_steam_area').val()) != ''){
			  isNumeric($('#tank_steam_area'), '');
		  }
		  if($.trim($('#tank_storm_covers').val()) != ''){
			  isNumeric($('#tank_storm_covers'), '');
		  }
		  
		  isNumeric($('#tank_weight'), '');
		  isNumeric($('#tank_length'), '');
		  isNumeric($('#tank_width'), '');
		  isNumeric($('#tank_height'), '');
		  isNumeric($('#tank_capacity'), '');
		  if($.trim($('#tank_steam_area').val()) != ''){
			  isNumeric($('#tank_steam_area'), '');
		  }
		
		  if($.trim($('#tank_no').val()) != ''){
			  //function for chech tank no exist
			  istankExist($('#tank_no'),$(this));
		  }
		  if($.trim($('#tank_no').val()) != ''){
			  tankNumberValid($('#tank_no'));
		  }
		  if($('#tank_business_type').val() == 'MAN'){
			  highlight($('#tank_ownership_id'), '');
		  }
		  if($('#tank_business_type').val() == 'DED'){
			  highlight($('#tank_customer_group'), '');
		  }
	  if(ExistSuccess == 'Exist'){
		  success.push(false);
		  $($('#tank_no')).parent().addClass('highlight');   
	  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank No already exists.</div>';
	  }else if(invalidTank == 'tankInvalid'){
		  success.push(false);
	  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank Number must match a pattern ABCU123456/7 ! Please, re-enter</div>';
	  }else{
		  success.push(true); 
		  alert_required = oldalert;
	  }   
	  var check_fields = (success.indexOf(false) > -1);
	  /**
	  * update edit-vgm-route
	  */
	  if($(this).hasClass('edit-Tank-update')){
		var tank_id = $('#tank_id').val();
	    if(check_fields === true){
	      $('html, body').animate({ scrollTop: 0 }, 400);
	      $('form').find('#response').empty().prepend(alert_required).fadeIn();
	    } else {
	      $(this).attr('disabled','disabled');
	      $.ajax({
	        type: 'POST',
	        url: '../'+tank_id+'/update',
	        data: $('#tank-core-data-page1').serialize().replace(/%5B%5D/g, '[]'),
	        success: function(response){
	          window.location.href = $('#returnpath').val();
	          localStorage.setItem('response', response);
	        },
	        error: function(response){
	        	 $(this).removeAttr('disabled');
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	      });
	    }
	  }
	  
	   if($(this).hasClass('create-Tank-save')){
		      if(check_fields === true){
		        $('html, body').animate({ scrollTop: 0 }, 400);
		        $('form').find('#response').empty().prepend(alert_required).fadeIn();
		      } else {
		       $(this).attr('disabled','disabled');
		       $.ajax({
		         type: 'POST',
		         url: path+'/add',
		         data: $('#tank-core-data-page1').serialize().replace(/%5B%5D/g, '[]'),
		         success: function(response){
		        	 var tankno = $('#tank_no').val();
		        window.location.href = appHome+'/tank_master/index?sort=&sorttype=&page_name=tank-core-index&tank-filter='+tankno+'&tank-division=&tank-type=&tank-status=all';
		           localStorage.setItem('response', response);
		         },
		         error: function(response){
		           $(this).removeAttr('disabled');
		           $('html, body').animate({ scrollTop: 0 }, 400);
		           $('form').find('#response').empty().prepend(alert_error).fadeIn();
		         }
		       });
		      }
	   }
	   
	});
$('.view-tank').on('click',function(e) {
	var id = $(this).attr('data-id');
	$.ajax({
		type: "POST", 
		async: false, 
		url: appHome+'/tank_master/common_ajax', 
		dataType: "json",
		data: ({
			'tank_id' : id,
			'action_type' : 'view_tank'
		}),  
		success: function(response)
		{ 
			$('#tank_status').html(response.tank_status);
			$('#tank_tank_no').html(response.tank_no);
			$('#tank_capacity').html(response.tank_capacity);
			$('#tank_capacity2').html(response.tank_capacity2);
			$('#tank_capacity3').html(response.tank_capacity3);
			$('#tank_capacity4').html(response.tank_capacity4);
			$('#tank_dimensions').html(response.tank_dim);			
			$('#tank_weight').html(response.tank_weight);
			$('#tank_division').html(response.tank_division);
			$('#tank_length').html(response.tank_length);
			$('#tank_width').html(response.tank_width);
			$('#tank_height').html(response.tank_height);
			$('#tank_potvalue').html(response.tank_potvalue);
			$('#tank_iso_code').html(response.tank_iso_code);
			$('#tank_baffle_type').html(response.tank_baffle_type);
			$('#tank_prev_test_date').html(response.tank_prev_test_date);
			
			$('#tank_compartments').html(response.tank_compartments); 
			$('#tank_businesstype').html(response.tank_businesstype); 
			$('#tank_tatwalk').html(response.tank_tatwalk); 
			$('#tank_t_number').html(response.tank_t_number); 
			$('#tank_mot_date').html(response.tank_mot_date); 
			$('#tank_next_mot_date').html(response.tank_next_mot_date); 
			$('#tank_next_mot_type').html(response.tank_next_mot_type);		
			$('#tank_electric_type').html(response.tank_electric_type); 
			$('#tank_inspection_date').html(response.tank_inspection_date); 
			$('#tank_manlids').html(response.tank_manlids);
			
			$('#tank_bottom_valve_type').html(response.tank_bottom_valve_type); 
			$('#tank_top_valve_manufacturer').html(response.tank_top_valve_manufacturer);
			$('#tank_next_mot_type').html(response.tank_next_mot_type);
			$('#tank_bottom_valve_size').html(response.tank_bottom_valve_size); 
			$('#tank_bottom_outlet_type').html(response.tank_bottom_outlet_type); 
			$('#tank_top_valve_type').html(response.tank_top_valve_type); 
			$('#tank_top_uutlet_type').html(response.tank_top_uutlet_type); 
			$('#tank_airline_outlet_type').html(response.tank_airline_outlet_type); 
			$('#tank_discharge').html(response.tank_discharge);
			$('#tank_steam_area').html(response.tank_steam_area);
			$('#tank_manufacture_date').html(response.tank_manufacture_date);
			$('#tank_manufacture').html(response.tank_manufacture_name);

			$('#tank_created_by').html(response.tank_created_by);
			$('#tank_created_on').html(response.tank_created_on);
			$('#tank_group_view').html(response.tank_customer_group);
			$('#tank_normal_capasity').html(response.tank_normal_capasity);
			$('#tank_normal_capacity2').html(response.tank_normal_capacity2);
			$('#tank_normal_capacity3').html(response.tank_normal_capacity3);
			$('#tank_normal_capacity4').html(response.tank_normal_capacity4);
			$('#baffle_compartment_size').html(response.baffle_compartment_size);
			
			$('#tank_top_outlet_type').html(response.tank_top_outlet_type);
			$('.tank_ownership_new').html(response.tank_ownership_new);			
			$('#tank_capacity_total').html(response.tank_capacity + response.tank_capacity2 + response.tank_capacity3 + response.tank_capacity4);
			$('#tank_normal_capacity_total').html(response.tank_normal_capasity + response.tank_normal_capacity2 + response.tank_normal_capacity3 + response.tank_normal_capacity4);
			$('#tank_complete').html(response.tank_complete);
			$('#tank_allow_feed').html(response.tank_allow_feed);
			$('#tank_yet_to_alocate').html(response.tank_yet_to_alocate);
			if(response.is_tank_semi_dedicated == 1){
				$('.is_tank_semi_dedicated').html(' Yes');
			}else{
				$('.is_tank_semi_dedicated').html(' No');
			}
			
			if(response.tank_syphon_tube == 1){
				$('#tank_syphon_tube').html(' Yes');
			}else{
				$('#tank_syphon_tube').html(' No');
			}
			
			if(response.tank_storm_covers != 0 && response.tank_storm_covers != ''){
				$('#tank_storm_covers').html(' Yes');
			}else{
				$('#tank_storm_covers').html(' No');
			}
			
			if(response.tank_syphon == 1){
				$('#tank_syphon').html(' Yes');
			}else{
				$('#tank_syphon').html(' No');
			}
			
			if(response.tank_handrail == 1){
				$('#tank_handrail').html(' Yes');
			}else if(response.tank_handrail == 2){
				$('#tank_handrail').html(' Unknown');
			}else{
				$('#tank_handrail').html(' No');
			}
			
			if(response.tank_electric_tank_check == 1){
				$('#tank_electric_tank_check').html(' Yes');
			}else{
				$('#tank_electric_tank_check').html(' No');
			}	

			if(response.tank_baffles == 1){
				$('#tank_baffles').html(' Yes');
				$('.baffleSizeType').show();
			}else{
				$('#tank_baffles').html(' No');
				$('.baffleSizeType').hide();
			}

			if(response.tank_steam_coils == 1){
				$('#tank_steam_coils').html(' Yes');
			}else{
				$('#tank_steam_coils').html(' No');
			}
			
		}  
	});
	
});

//Delete tank
$('.delete-Tank').click(function(e) {
	e.preventDefault();
	
	var delete_url = $(this).attr('data-href'),
		tank_id = $(this).data('tank-id'),
		tank_no = $(this).attr('data-tank-num'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
		
	 BootstrapDialog.show({
         type: BootstrapDialog.TYPE_DANGER,
         closable : false,
         title: "Confirmation (<strong>"+tank_no+"</strong>)",
         message: "Are you sure want to delete this Tank ?",
         buttons: [{
		             label: 'Close',
		             action: function(dialogItself){
		                 dialogItself.close();
		             }
		         },{
	             label: 'Ok',
	             cssClass: 'btn-danger',
	             action: function(dialogItself){
	 				$.ajax({
						type: 'POST',
						url: delete_url,
						timeout: 90000,
		  		       beforeSend: function() {
				        	$('.bootstrap-dialog-footer-buttons > .btn-danger').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		    		        $('.bootstrap-dialog-footer-buttons > .btn-danger').attr('disabled','disabled');
				        },
						data: {
							'tank_id' : tank_id
						},
						success: function(response){
							dialogItself.close();
							window.location.href = return_url;
							localStorage.setItem('response', response);
						},
						error: function(response){
							BootstrapDialog.show({title: 'Warning', message : 'Unable to delete this Tank. Please try later.',
								 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
							});
						}
					});
	             }
         }]
     });
	});

$(document).on('click', '.tank_core_change_status', function(e) {
    e.preventDefault();
   var tankNo = $(this).attr('data-id');
   if($(this).hasClass('tank_core_change_status')){
       var changeTo = $(this).attr('data-quote-change-to');   
       var tank = $(this).attr('data-tank-num');   
   }
   var message = 'Are you sure want to move <strong>'+tank+'</strong> to '+changeTo.charAt(0).toUpperCase() + changeTo.slice(1);+' ?';
   
   if(changeTo == 'live'){
       var mtype = BootstrapDialog.TYPE_SUCCESS;
       var mButton = 'btn-success';
   }else if(changeTo == 'archive'){
       var mtype = BootstrapDialog.TYPE_PRIMARY;
       var mButton = 'btn-primary';
   }else{
       var mtype = BootstrapDialog.TYPE_DANGER;
       var mButton = 'btn-danger';
   }
    BootstrapDialog.show({
        type: mtype,
        closable : false,
        title: 'Confirmation',
        message: message,
        buttons: [{
                    label: 'Close',
                    action: function(dialogItself){
                        dialogItself.close();
                    }
                },{
                label: 'Ok',
                cssClass: mButton,
                action: function(){
                    $.ajax({
                       type: 'POST',
                       url: appHome+'/tank_master/common_ajax',
                       data: {
                         'tankNo' : tankNo,
                         'tank' : tank,
                         'action_type' : 'change_tank_status',
                         'changeTo' : changeTo
                       },
                      beforeSend: function() {
                           $('.bootstrap-dialog-footer-buttons > .'+mButton).html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
                           $('.bootstrap-dialog-footer-buttons > .'+mButton).attr('disabled','disabled');
                       },
                       success: function(response){
                           
                          localStorage.setItem('response', response);
                          location.reload();
                           
                       },
                       error: function(response){
                         $('html, body').animate({ scrollTop: 0 }, 400);
                         $('form').find('#response').empty().prepend(alert_error).fadeIn();
                       }
                 });
                }
        }]
    });
   
});


$('.add-manufacture').on('click',function(e) {
	$('#tank_manufacture_id,#tank-new-manufacture-name').val('');
	$('.chosen').trigger("chosen:updated");
	$('.existing-manufacture-div').hide();
	$('.new-manufacture-div').show();	
	$('#tank-manufacture-validation').val('new');
});
//To save thew new manufacturer name to the database and to keep the new name as selected
$('.save-manufacture').on('click',function(e) {
	var manufacturename=$('#tank-new-manufacture-name').val(); 
	highlight($('#tank-new-manufacture-name'), '');
	function highlight(field, empty_value){ 
	    if(field.length > 0){
	      if(field.val().trim() === empty_value){
	        $(field).parent().addClass('highlight');
	      } else {
	        $(field).parent().removeClass('highlight');   
	$.ajax({
	    type: 'POST',
	    url: appHome+'/tank_master/common_ajax',
	    data: {
	      'dataFieldName' 	: manufacturename,
	      'dataType'		: 'Tank_Manufacture',
	      'dataName'		: 'Tank Manufacture',
	      'action_type' 	: 'tank_data_name'
	    },
	    success: function(response){
	       data = JSON.parse(response)
	       if(response)
	    	   {
	    		$('.new-manufacture-div').hide();
	    		$('.existing-manufacture-div').show();
	    		var div_data="<option value="+data.key+' selected="selected"'+">"+data.value+"</option>";
	    		$(div_data).appendTo('#tank_manufacture_id'); 
	    		$('.chosen').trigger("chosen:updated");
	    	   }
	    },
	    error: function(response){
	     alert('Error Occured');
	    }
	});
	      }
	    }
	  }
	});

$('.add-manufacture-close').on('click',function(e) {
	$('#tank_manufacture_id,#tank-new-manufacture-name').val('');
	$('#tank-manufacture-validation').val('existing');
	$('.new-manufacture-div').hide();
	$('.existing-manufacture-div').show();	
});

$('.add-ownership').on('click',function(e) {
	$('#tank-ownership-new,#tank-new-ownership-name').val('');
	$('.chosen').trigger("chosen:updated");
	$('.existing-ownership-div').hide();
	$('.new-ownership-div').show();	
	$('#tank-ownership-validation').val('new');
});

$('.save-ownership').on('click',function(e) {
	var manufacturename=$('#tank-new-ownership-name').val(); 
	highlight($('#tank-new-ownership-name'), '');
	function highlight(field, empty_value){
	    if(field.length > 0){
	      if(field.val().trim() === empty_value){
	        $(field).parent().addClass('highlight');
	      } else {
	        $(field).parent().removeClass('highlight');   
	$.ajax({
	    type: 'POST',
	    url: appHome+'/tank_master/common_ajax',
	    data: {
	      'dataFieldName' 	: manufacturename,
	      'dataType'		: 'Tank_Ownership',
	      'dataName'		: 'Tank Ownership',
	      'action_type' 	: 'tank_data_name'
	    },
	    success: function(response){
	       data = JSON.parse(response)
	       if(response)
	    	   {
	    		$('.new-ownership-div').hide();
	    		$('.existing-ownership-div').show();
	    		var div_data="<option value="+data.key+' selected="selected"'+">"+data.value+"</option>";
	    		$(div_data).appendTo('#tank_ownership_id'); 
	    		$('.chosen').trigger("chosen:updated");
	    	   }
	    },
	    error: function(response){
	     alert('Error Occured');
	    }
	});
	      }
	    }
	  }
	});

$('.add-ownership-close').on('click',function(e) {
	$('#tank-ownership-new,#tank-new-ownership-name').val('');
	$('#tank-ownership-validation').val('existing');
	$('.new-ownership-div').hide();
	$('.existing-ownership-div').show();	
});
$('#file_to_upload').change(function(){
	var file = document.getElementById('file_to_upload').files[0];
	$('#fileSize,#fileType,#fileExist').show();
	if (file) {
	  var fileSize = 0;
	  if (file.size > 1024 * 1024)
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	  else
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
	  
	  var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
	  
	  var extension = fname.substr( (fname.lastIndexOf('.') +1) );
	  var attachable_type = $('#attachable_type').val();
	 
	  var randomNumber = Math.floor(Math.random()*90000) + 10000;
	  document.getElementById('fileName').value = randomNumber+'_'+fname;
	  document.getElementById("fileName").select(fname);
	  if(attachable_type == 'Tank_gallery'){
		  var ImageArray = ['jpg','jpeg','gif','png']
		  if($.inArray(extension,ImageArray) < 0){
			  document.getElementById('fileSize').innerHTML = '<span style="color:red;">Warning : <br>- Unsupported File</span>';
			  document.getElementById('fileType').innerHTML = '<span style="color:red;">- Please Choose an Image file(.jpeg,.jpg,.gif,.png)</span>';
			  $("#upload_btn").attr('disabled','disabled');
			  return false;
		  }
	  }

	  document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
	  document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
	}
	
	var file_cntrl = $('#file_to_upload');
	if(file_cntrl.val() != "" )
	{
		$("#upload_btn").removeAttr('disabled');
	}		
		$('#upload-progress-bar').css('width','0%');
		$('#upload-progress-bar').data('aria-valuenow','0');
		$('#upload-progress-bar').html('');
});

$(".click-view-tank-image").live('click', function(e){
	var path = $(this).attr('data-view-path');
	$('.tank-image-modal').attr('src',path);
});
/**
 * document file uplad function
 */
$(document).on('click','#upload_btn',function(){ 
//function documentFileUpload() {
	
	var filename = $("#fileName").val();
	var filenameCtrl = $("#fileName");
	
	if(filename.trim() != ''){
			uploadPath = $("#fileUploadPath").val();
			
			if(!$('#file_to_upload')[0]) {
				return false;
			}
		
			if(!$('#file_to_upload').val()) {
				$("#upload_btn").attr('disabled','disabled');
				return false;
			}
			
			var fd = new FormData();
			fd.append("file_to_upload", $('#file_to_upload')[0].files[0]);
			fd.append("attachable_id", $('input[name="attachable_id"]').val());
			fd.append("attachable_type", $('#attachable_type').val());
			fd.append("new_file_name", $('#fileName').val());
			fd.append("tank_file_description", $('#tank_file_upload_textarea').val());
		
			var xhr = new XMLHttpRequest();
		
			// file received/failed
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
						$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
						xhr.addEventListener("load", documentFileUploadComplete, false);
						$('#progress_num_uf').addClass(xhr.status == 200 ? "success" : "failure");
					
				}
			};

			xhr.upload.addEventListener("progress", documentFileUploadProgress, false);
			xhr.addEventListener("load", documentFileUploadComplete, false);
			xhr.addEventListener("error", documentFileUploadFailed, false);
			xhr.addEventListener("abort", documentFileUploadCanceled, false);
			xhr.open("POST", uploadPath);
			xhr.send(fd);
	
		}else{
			filenameCtrl.val('');
			filenameCtrl.focus();
		}
});
/**
 * process function
 * @param evt
 */
function documentFileUploadProgress(evt) {
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progress_num_uf').show();
	$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
	$('#upload-progress-bar').css('width',percentComplete.toString()+ '%');
	$('#upload-progress-bar').data('aria-valuenow',percentComplete.toString());
	$('#upload-progress-bar').html(percentComplete.toString() + '%');
}

/**
 * when upload is failed
 * @param evt
 */
function documentFileUploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

/**
 * if uplad is cancel
 * @param evt
 */
function documentFileUploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}

/**
 * upload complete
 * @param evt
 */
function documentFileUploadComplete(evt) {
	var id = $('#attachable_id').val();
	var type = $('#attachable_type').val();
	if(type == 'Tank'){
		var typeData = 'tank_doc';
	}else if(type == 'Tank_gallery'){
		var typeData = 'tank_gallery';
	}else if(type == 'Tank_periodic_test'){
		var typeData = 'tank_periodic_test';
	}else{
		var typeData = 'on_hire_agreement_doc';
	}
	tankFileList(id,type);
	$('#progress_num_uf,#fileSize,#fileType,#fileExist').delay(2000).fadeOut('slow');
	$('.docs-icon[data-id="'+ id +'"][data-upload-type="'+ typeData +'"]').find('.fa').removeClass().addClass('fa fa-file');
}

// file upload functio end--------------------------
/**
 * document list in popup
 */
function tankFileList(id,type){
	var url = appHome+'/tank_master/common_ajax';
	$.ajax({  
		type: "POST", 
		cache: false, 
		url: url,  
		dataType: "text",
		data: ({
			'id' :id,
			'type' : type,
			'action_type' : 'list_upload_docs',
			'pageType' : $('#page-type').val()
		}),  
		beforeSend: function() {
            // setting a timeout
        	$('#fileAttachment').html("<td colspan='5'><div class='text-center'><img src="+$('#loaderpath').val()+"></div></td>");
        },
		success: function(result)
		{ 
			$("#file_to_upload").val("");
			$("#fileName,#tank_file_upload_textarea").val("");
			$("#upload_btn").attr('disabled','disabled');
			
			$('#fileAttachment').html(result);
			
			$("#fileAttachment-table").tablesorter(); 
			$("#fileAttachment-table").trigger("update"); 
	    	var sorting = [[1,0]]; 
	    	$("#fileAttachment-table").trigger("sorton",[sorting]);
			$('#fileAttachment-table').tablesorter({
		         widthFixed: true,
		         widgets: ['zebra', 'filter'],
		         widgetOptions: {
		           filter_reset: '.reset'
		         },
		    })
		    $('.tablesorter-filter-row').hide();
		}  
	});
}

$('.file-upload-btn').on('click',function(e) {
	var id = $(this).attr('data-id');
	var upload_type = $(this).attr('data-upload-type');
	var modal_title = $(this).attr('data-modal-title');
	var tankNo = $(this).parent().siblings(":first").text();
	if(upload_type == 'tank_doc'){
		var type = 'Tank';
		$('#FileUpModalLabel').html('Documents -Tank:'+tankNo);
	}else if(upload_type == 'tank_gallery'){
		var type = 'Tank_gallery';
		$('#FileUpModalLabel').html('Tank Gallery :'+tankNo);
	}else if(upload_type == 'tank_periodic_test'){
		var type = 'Tank_periodic_test';
		$('#FileUpModalLabel').html('Tank Periodic Test :'+tankNo);
	}
	else{
		var type = 'Tank_on_hire';
		$('#FileUpModalLabel').html('On hire Agreement Documents -Tank:'+tankNo);
	}
	
	tankFileList(id,type);
	$("#upload_btn").attr('disabled','disabled');
	$('#file_to_upload').val('');
	$('#progress_num_uf').hide();
	$('#file_desc,#JobfileName').val('');
	$('#fileSize,#fileType,#fileExist').html('');
	
});

var page_type = $('#page-type');
if(page_type.length && page_type.attr('data-page-type') == 'tank-master-page1'){
	  tankFileList($('#attachable_id').val(),'Tank');
}

$(".delete-tank-doc").live('click', function(e){
	e.preventDefault();	
	$this = $(this);
	var up_fileInfo = $this.data();
	var deleteType = up_fileInfo.upload_type;
	var file_deletePath = appHome+'/tank_master/common_ajax';
	var attachid = 0;
	var siFileListCount = 0;
	var docidArr = up_fileInfo.docid.split("-");
	var tankId = $('#attachable_id').val();

	BootstrapDialog.confirm('Are you sure you want to delete this document ?', function(result){
		if(result == true) {
			$.ajax({
				type: "POST", 
				async: false, 
				url: file_deletePath, 
				dataType: "html",
				data: ({
					'docid' : docidArr[1],
					'tableType' : docidArr[0],
					'deleteType' : deleteType,
					'tankId' : tankId,
					'action_type' : 'delete_tank_docs'
				}),  
				success: function(response)
				{ 
					
					if(response == 'success') {
						//remove icons
						$this.parents('tr').remove();

						tp_file_list = $(".tp-file-list tr").length;
						if (tp_file_list == 2)
						{
							$("#emptyFilesTr").removeClass();
							var id = $('#attachable_id').val();
							$('.docs-icon[data-id="'+ id +'"][data-upload-type="'+deleteType+'"]').find('.fa').removeClass().addClass('fa fa-file-o');
						}

	
					}else{
						BootstrapDialog.show({title: 'Error', message : 'Error occured Please try agan later.',
							 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
						});
					}
				}  
			});
		}
	});		
	
});

//tank number new format start ----------------------------------------
//SET CURSOR POSITION
$.fn.setCursorPosition = function(pos) {
this.each(function(index, elem) {
  if (elem.setSelectionRange) {
    elem.setSelectionRange(pos, pos);
  } else if (elem.createTextRange) {
    var range = elem.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
});
return this;
};	

$.fn.getCursorPosition = function() {  
  var el = $(this).get(0);  
  var pos = 0;  
  if ('selectionStart' in el) {  
      pos = el.selectionStart;  
  } else if ('selection' in document) {  
      el.focus();  
      var Sel = document.selection.createRange();  
      var SelLength = document.selection.createRange().text.length;  
      Sel.moveStart('character', -el.value.length);  
      pos = Sel.text.length - SelLength;  
  }  
  return pos;  
}  

/**
 * its for change _ to each key pressed
 */
$('#tank_no').keydown(function(evt) {
	
	var TankNo = $('#tank_no').val();
	var firstIndex = TankNo.indexOf('_');
	var currPostion = $('#tank_no').getCursorPosition();
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	
	if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 96 && charCode <= 122)){
		if(firstIndex !=  -1){			
			var newString = TankNo.slice(0, firstIndex) + TankNo.slice(firstIndex + 1);	
			$('#tank_no').val(newString);
			$('#tank_no').setCursorPosition(firstIndex);
		}
	}else if(charCode == 8){ //8 - back space
		if(currPostion == 11){
			var underscore = "/";
		}else{
			var underscore = "_";
		}
		var newString = [TankNo.slice(0, currPostion), underscore, TankNo.slice(currPostion)].join('');
		if(currPostion == 0){
			newString = newString.substring(1);
		}
		$('#tank_no').val(newString);
		$('#tank_no').setCursorPosition(currPostion);
	}else if(charCode == 46){ //8 - back space
		//if(!$.browser.mozilla)
			currPostion = currPostion +1;
		
		if(currPostion == 11){
			var underscore = "/";
		}else{
			var underscore = "_";
		}
		var newString = [TankNo.slice(0, currPostion), underscore, TankNo.slice(currPostion)].join('');
		$('#tank_no').val(newString);
		$('#tank_no').setCursorPosition(currPostion - 1);
	}
});

/**
 * if it work in crome issue in delete key press
 * so its work only in mozilla
 */
$('#tank_no').keyup(function(evt) {
	if($.browser.mozilla){
		var TankNo = $('#tank_no').val();
		var firstIndex = TankNo.indexOf('_');
		var currPostion = $('#tank_no').getCursorPosition();
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		
		 if(charCode == 46 && TankNo != ''){ //46 - delete
				if(currPostion == 10){
					var underscore = "/";
				}else{
					var underscore = "_";
				}
				var newString = TankNo.slice(0, currPostion) + TankNo.slice(currPostion + 1);
				newString = [newString.slice(0, currPostion), underscore, newString.slice(currPostion)].join('');
				$('#tank_no').val(newString);
				$('#tank_no').setCursorPosition(currPostion);
			}else if(charCode == 46 && TankNo == ''){
				$('#tank_no').val('__________/_');
				$('#tank_no').setCursorPosition(0);
			}
	}
});
/**
 * change cursor position
 */
$('#tank_no').on('click focus',function(e) {
	var TankNo = $('#tank_no').val();
	var firstIndex = TankNo.indexOf('_');
	if(TankNo == '__________/_')
		$('#tank_no').setCursorPosition(firstIndex);
	
});

$("input[type='radio']").click(function(){
    $(this).closest('.radio-validation-div').removeClass('highlight-custome');    
});

/**
 * limit the control
 */
$(".multi-sel-ctrl").change(function () {
	var optioncount = $(this).find('option:selected').length;
	var optlimit = 25;
	var count = 1;
	var $this = $(this);
	
    if(optioncount > optlimit) {
    	$(this).find('option:selected').each(function(){
    		if(count > optlimit){
    			$(this).prop('selected',false);
    		}
    		count +=1;
    	})
    	BootstrapDialog.show({title: 'Customer Limt', message : 'Selection is limited to 25 items only.',
			 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
		});
    	$(".multi-sel-ctrl").multiselect('refresh');
    }
});

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
			
			if (checked === true && element.val() != '') {
				 element.parent().multiselect('deselect', '');
				 element.parent().multiselect('refresh');
			 }
			 if (checked === true && element.val() == '') {
				 element.parent().val('');
				 element.parent().multiselect('refresh');
			 }
			 if(checked === false && element.parent().val() == null){
				 element.parent().val('');
				 element.parent().multiselect('refresh');
			 }
		}
	});
	}
	$('.tmp-input-ctrl').remove();//This control is for not showing old select box
	
	$(document).on('change', '.custom-page-pagesize', function(e) {
		var pagelimit = $(this).val();
		$('#pagesize').val(pagelimit);
		$('.tank-core-form').submit();
	});
	
	$(document).on('change', '#tank_business_type', function(e) {
		if($('#tank_business_type').val() == 'SPOT'){
			$("#tank_is_semi_ded").attr("disabled", false);
		}else{
			$("#tank_is_semi_ded").attr("disabled", true);
		}
		
	});
	
	$(document).on('change', '#tank_length', function() {
		isoCode();
	
	});
	function isoCode(){
		var len = $('#tank_length').val();
		if(len != "" && len != null)
		{
			var with2Decimals = len.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
			var flag = 0;
			var isocode = '';
			$(".iso-code").each(function() {
			    var isolen = $(this).data('length');
			    if(isolen == with2Decimals){
			    	isocode = $(this).data('code');
			    }
			});
			$('#tank_iso_code').val(isocode);
			$('.chosen').trigger("chosen:updated");
		}
	}
	
	//Autocomplete function to fetch the tank numbers
	 if($("#tank-filter").length > 0){
		 
		 $("#tank-filter").autocomplete({
		      source:  appHome+'/tank_master/get_tankNum',
		      minLength: 2,
		      type: "GET",
		      success: function (event, ui) {
		    	
		      },
			  select: function (event, ui) {
				$(this).val(ui.item.label);
				return false;
			  },
			  change: function (event, ui) {
		         if (ui.item === null) {
		        	 	 BootstrapDialog.show({title: 'Error', message : 'Not a valid Tank. Please try again.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
		             $(this).val('');
		         }
			  }
		  });
	}

});//end of document ready