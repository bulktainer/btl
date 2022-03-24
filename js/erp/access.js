var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';

$(document).ready(function(){
	
	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
	var success_list = [];
	var alert_success = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-thumbs-o-up"></i>  <strong>Success!</strong> Privileges updated successfully</div>';
		
	// Select all users
	$(document).on('change', '#user_all', function(e){
		var checked;
		if ($(this).is(':checked')) {
			checked = true;
		}
		else{
			checked = false;
		}
	
		$('.user_list').each(function () {
			$(this).attr('checked', checked);
		});    	
	});
	
	// Select all
	$(document).on('change', '.user_list', function(e){	
		var checkCount = $('.user_list:checked').length;
		var checkTotal = $('.user_list').length;
	
		if(checkCount == checkTotal){
			$("#user_all").attr('checked', true);
		}else{
			$("#user_all").attr('checked', false);
		}
	});
	
	// Save module wise privilege
	$(document).on('click', '.create_privilege', function(e){
		e.preventDefault();
	
		var form = '#'+$(this).closest('form').attr('id');
		var modules = $('#module_id').val();	
		var user_ids = [];
	
		$('.user_list').each(function () {
			if ($(this).is(':checked')) {
				user_ids.push($(this).val());
			}
		});
	
		highlight($(form).find('#module_id'), null);
	  	//if(user_ids.length == 0){
	  	//	success_list.push(false);
	  	//}
	
		check_fields = (success_list.indexOf(false) > -1);
		if(check_fields === true){
		      $('html, body').animate({ scrollTop: 0 }, 400);
		      $('#response').empty().prepend(alert_required).fadeIn();
		} 
		else{
			createModulePrivileges(modules, user_ids);
		}
	});
	
	function highlight(field, empty_value){
	    if(field.length > 0){
	      if(field.val() === empty_value){
	        $(field).parent().addClass('highlight');
	        success_list.push(false);
	      } else {
	        $(field).parent().removeClass('highlight');
	        success_list.push(true);
	      }
	    }
	}
	
	// Create user privileges
	function createModulePrivileges(modules, user_ids){
		
		$.ajax({
			type: 'POST',
			url: appHome+'/access/create-module-privileges',
			data: {
				'modules': modules,
				'user_ids': user_ids
			},
			success: function(response){
				if(response && response == 1){
					$('html, body').animate({ scrollTop: 0 }, 400);
					$('#response').empty().prepend(alert_success).fadeIn();
				}
			},
			error: function(response){
				$('html, body').animate({ scrollTop: 0 }, 400);
				$('#response').empty().prepend(alert_error).fadeIn();
			}
		});
	}
	
	// Module change event
	$(document).on('change', '#module_id', function(e){
		var module = $('#module_id').val();
		if(module != ""){
			getPrivilegedUsers(module);	
			$(".create_privilege").prop("disabled",false);
		} else {
			$(".create_privilege").prop("disabled",true);
		}
	});
	
	// Get Privileged Users
	function getPrivilegedUsers(module){
		
		var h = $('.overlay-complete-loader').height();
		if(h == 0) { h = 100; }
		$('.btl_overlay').height(h);  
		$('.btl_relative').show();
	
		$.ajax({
			type: 'POST',
			url: appHome+'/access/get-privilege-users-by-module',
			data: {
				'module': module
			},
			success: function(response){
				if(response && response.length > 0){
					$(".user_list").attr('checked', false);
					$(".user-fa").next().removeClass('label label-success');
					$(".user-fa").next().addClass('label label-success');
					$(".user-ra").next().removeClass('label label-success');

					response = JSON.parse(response);
					for (let i = 0; i < response.length; i++) {
						$("#user_"+response[i]).attr('checked', true);
						if($("#user_"+response[i]).hasClass("user-ra")){
							$("#user_"+response[i]).next().addClass('label label-success');
						} else {
							$("#user_"+response[i]).next().removeClass('label label-success');
						}
					}
				}
	
				$('.btl_relative').hide();
			},
			error: function(response){
				$('html, body').animate({ scrollTop: 0 }, 400);
				$('#response').empty().prepend(alert_error).fadeIn();
				$('.btl_relative').hide();
			}
		});
	}
	
	// Save module wise privilege
	$(document).on('click', '.create_user_privilege', function(e){
		e.preventDefault();
		var form = '#'+$(this).closest('form').attr('id');
		var user_id = $('#user_set').val();	
		var module_ids = [];
		var module_groups = [];
	
		$('.module_set').each(function () {
			if ($(this).is(':checked')) {
				module_ids.push($(this).val());
				if ($.inArray($(this).data('module'), module_groups) == -1)
				{
				  module_groups.push($(this).data('module'));
				}
			}
		});
	
		highlight($(form).find('#user_set'), null);
	  	//if(module_ids.length == 0){
	  	//	success_list.push(false);
	  	//}
	
		check_fields = (success_list.indexOf(false) > -1);
		if(check_fields === true){
		      $('html, body').animate({ scrollTop: 0 }, 400);
		      $('#response').empty().prepend(alert_required).fadeIn();
		} 
		else{
			createUserPrivilege(module_ids, user_id, module_groups);
		}
	});
	
	// Create user privileges
	function createUserPrivilege(modules, user_id, module_groups){
		
		$.ajax({
			type: 'POST',
			url: appHome+'/access/create-user-privileges',
			data: {
				'modules': modules,
				'user_id': user_id,
				'module_groups': module_groups
			},
			success: function(response){
				if(response && response == 1){
					$('html, body').animate({ scrollTop: 0 }, 400);
					$('#response').empty().prepend(alert_success).fadeIn();
				}
			},
			error: function(response){
				$('html, body').animate({ scrollTop: 0 }, 400);
				$('#response').empty().prepend(alert_error).fadeIn();
			}
		});
	}
	
	// Module change event
	$(document).on('change', '#user_set', function(e){
		var user_id = $('#user_set').val();
		var group_label = $('#user_set :selected').parent().attr('label');

		if(user_id != ""){
			getPrivilegedModules(user_id, group_label);	
			$(".create_user_privilege").prop("disabled",false);
		} else {
			$(".create_user_privilege").prop("disabled",true);
		}
	});
	
	// Get Privileged Users
	function getPrivilegedModules(user_id, group_label){
		
		var h = $('.overlay-complete-loader').height();
		if(h == 0) { h = 100; }
		$('.btl_overlay').height(h);  
		$('.btl_relative').show();
	
		$.ajax({
			type: 'POST',
			url: appHome+'/access/get-privilege-modules-by-user',
			data: {
				'user_id': user_id
			},
			success: function(response){
				if(group_label == "Full Access"){
					$(".module_set").next().removeClass('label label-success');
					$(".module_set").next().addClass('label label-success');
				} else {
					$(".module_set").next().removeClass('label label-success');
				}

				if(response && response.length > 0){
					$(".module_set").attr('checked', false);
					response = JSON.parse(response);
					for (let i = 0; i < response.length; i++) {
						$("#module_"+response[i]).attr('checked', true);

						if(group_label == "Full Access"){
							$("#module_"+response[i]).next().removeClass('label label-success');
						} else {
							$("#module_"+response[i]).next().addClass('label label-success');
						}

					}
				}
	
				$('.btl_relative').hide();
			},
			error: function(response){
				$('html, body').animate({ scrollTop: 0 }, 400);
				$('#response').empty().prepend(alert_error).fadeIn();
				$('.btl_relative').hide();
			}
		});
	}
	
	// Select all users
	$(document).on('change', '#module_all', function(e){
		var checked;
		if ($(this).is(':checked')) {
			checked = true;
		}
		else{
			checked = false;
		}
	
		$('.module_set').each(function () {
			$(this).attr('checked', checked);
		});    	
	});
	
	// Select all
	$(document).on('change', '.module_set', function(e){	
		var checkCount = $('.module_set:checked').length;
		var checkTotal = $('.module_set').length;
	
		if(checkCount == checkTotal){
			$("#module_all").attr('checked', true);
		}else{
			$("#module_all").attr('checked', false);
		}
	});
	
	// Select all
	$(document).on('change', '.sub_group', function(e){	
	
		var key = $(this).data('key');
		if ($(this).is(':checked')) {
			$('.menu_'+key).attr('checked', true);
		}
		else{
			$('.menu_'+key).attr('checked', false);
		}
	}); 
	
	// Select all
	$(document).on('change', '.sub_head', function(e){	
	
		var group = $(this).data('group');
		if ($(this).is(':checked')) {
			$('.middle_'+group).attr('checked', true);
		}
		else{
			$('.middle_'+group).attr('checked', false);
		}
	});
	
	$(document).on('click', '.div-plus', function(){
		$(this).find('i').toggleClass('fa-minus-circle fa-plus-circle');
	
	});
	
	
	
	
	$('#access_module_id').change(function(e){
		if($(this).val() == ""){
			$("#module-menu_level_0").val($("#max-menu_level_0").val());
			$("#module-menu_level_1").val(0);
			$("#module-menu_level_2").val(0);
			$("#function-order").val(0);
			$("#module-type").val('menu');
			$('#module-type').trigger("chosen:updated");
			$("#url_required").val("NO");
			$("#type_required").val("menu");
			$("#module_id_ref").val("");
		} else {
			var h = $('.overlay-complete-loader').height();
			if(h == 0) { h = 100; }
			$('.btl_overlay').height(h);  
			$('.btl_relative').show();
			var moduleId = $(this).val();
	
			$.ajax({
				type: 'POST',
				url: appHome+'/access/get-next-module-data',
				data: {
					'module_id': moduleId
				},
				success: function(response){
					if(response && response.length > 0){
						response = JSON.parse(response);
						$("#module-menu_level_0").val(response.menu_level_0);
						$("#module-menu_level_1").val(response.menu_level_1);
						$("#module-menu_level_2").val(response.menu_level_2);
						$("#function-order").val(response.function_order);
						$("#group_id").val(response.group_id);
						$("#module_id_ref").val(response.module_id_ref);
						$("#module-type").val(response.type);
						$('#module-type').trigger("chosen:updated");
						$("#url_required").val(response.url_required);
						$("#type_required").val(response.type);
					}
					$('.btl_relative').hide(); 
				},
				error: function(response){
					$('html, body').animate({ scrollTop: 0 }, 400);
					$('#response').empty().prepend(alert_error).fadeIn();
					$('.btl_relative').hide();
				}
			});
	
		}
	});
	
	/**
	* update module
	*/
	$('.create-module,.edit-module').click(function(e){
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
		 
		highlight($(form).find('#description'), '');
		highlight($(form).find('#module-menu_level_0'), '');
		highlight($(form).find('#module-menu_level_1'), '');
		highlight($(form).find('#module-menu_level_2'), '');
		highlight($(form).find('#function-order'), '');
	
		if($("#url_required").val() == "YES" && $("#module-url").val() == ""){
			$("#module-url").parent().addClass('highlight');
		     success.push(false);
		} else {
			$("#module-url").parent().removeClass('highlight');
		     success.push(true);
		}
	
		if($("#module-type").val() != $("#type_required").val()){
			$("#module-type").parent().addClass('highlight');
		     success.push(false);
		} else {
			$("#module-type").parent().removeClass('highlight');
		     success.push(true);
		}
	
		var check_fields = (success.indexOf(false) > -1);
	
		if(check_fields === true){
		    $('html, body').animate({ scrollTop: 0 }, 400);
		    $('form').find('#response').empty().prepend(alert_required).fadeIn();
		} else {
		    $(this).prop('disabled','disabled');
		    	
		    $.ajax({
		        type: 'POST',
		        url: path,
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
					
		//success.push(false);
	  
	});


	$(document).on('click', '.module_set', function(e){
	
		var group_label = $('#user_set :selected').parent().attr('label');
		if(group_label == "Full Access"){
			if($(this).is(':checked')){
				$(this).next().removeClass('label label-success');
			} else {
				$(this).next().removeClass('label label-success');
				$(this).next().addClass('label label-success');
			}
			
		} else if(group_label == "Restricted Access"){
			if($(this).is(':checked')){
				$(this).next().removeClass('label label-success');
				$(this).next().addClass('label label-success');
			} else {
				$(this).next().removeClass('label label-success');
			}
		}
		
	});


	$(document).on('click', '.user-fa', function(e){
		
		if($("#module_id").val() != ""){
			if($(this).is(':checked')){
				$(this).next().removeClass('label label-success');
			} else {
				$(this).next().removeClass('label label-success');
				$(this).next().addClass('label label-success');
			}
		}
		
	});

	$(document).on('click', '.user-ra', function(e){
		
		if($("#module_id").val() != ""){
			if($(this).is(':checked')){
				$(this).next().removeClass('label label-success');
				$(this).next().addClass('label label-success');
			} else {
				$(this).next().removeClass('label label-success');
			}
		}
		
	});

	if($(".multi-sel-ctrl").length != 0){
		$(".multi-sel-ctrl").multiselect({
			enableCaseInsensitiveFiltering: true,
			enableFiltering: true,
			maxHeight: 170,
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
	$('.tmp-input-ctrl').remove();
getAverageSessionPeriod();

});//end of document ready

$(document).on('click','.active_checkbox', function(e){
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
         	          	$('#response').empty().prepend(alert_error).fadeIn();
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

$(document).on('click','.double_check', function(e){
	var checkbox = $(this);
	if(checkbox.prop('checked') == true){
		checkbox.removeAttr('checked');
	}else{
		checkbox.prop('checked',true);
	}
	var user_id = checkbox.data('user_id');
	if(checkbox.attr('data-currentstatus') == 'active'){
		var updateStatus = 0;
		var updateStatusName = 'inactive';
		var type =BootstrapDialog.TYPE_DANGER;
		var mButton = 'btn-danger';
		var message = 'Are you sure want to disable <strong>Two Factor Authentication</strong> for this user ? ';
	}else{
		var updateStatus = 1;
		var updateStatusName = 'active';
		var type =BootstrapDialog.TYPE_SUCCESS;
		var mButton = 'btn-success';
		var message = 'Are you sure want to enable <strong>Two Factor Authentication</strong> for this user ?';
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
         	        url: appHome+'/access/common-ajax',  
         	        async : false,
         	        data: {
         				'user_id' : user_id,
         				'update_status'	   : updateStatus,
         				'action_type' : 'update_double_verification'
         			},
         	        success: function(response){
         	        	if(response == 1){
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
         	          	$('#response').empty().prepend(alert_error).fadeIn();
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
$(document).on('click','.unlock_check', function(e){
	var checkbox = $(this);
	if(checkbox.prop('checked') == true){
		checkbox.removeAttr('checked');
	}
	var user_id = checkbox.data('user_id');
	
	var update_status = 0;
	var type =BootstrapDialog.TYPE_SUCCESS;
	var mButton = 'btn-danger';
	var message = 'Are you sure want to <strong>Unlock the account</strong> for this user ? ';

	
	BootstrapDialog.show({
        type: type,
        title: 'Confirmation',
        message: message,
        buttons: [{
		    label: 'Close',
		    action: function(dialogItself){
		        dialogItself.close();
		        checkbox.prop('checked',true);   
		    }
		},{
	        label: 'Ok',
	        cssClass: mButton,
	        action: function(dialogItself){
 				var button = this;
                button.disable();
	           	button.spin();
	           	dialogItself.close();

	            $.ajax({
         	        type: 'POST', 
         	        url: appHome+'/access/common-ajax',  
         	        async : false,
         	        data: {
         				'user_id' : user_id,
         				'update_status'	   : update_status,
         				'action_type' : 'unlock_account'
         			},
         	        success: function(response){
         	        	if(response == 1){
         	        		checkbox.removeAttr('checked');
         	        		checkbox.prop('disabled',true);
         	        		$('.lock_date_'+user_id).text('');
         	        	}else{
   	         	    		checkbox.prop('checked',true);
         	        	}
         	        },
         	        error: function(response){
         	          	$('html, body').animate({ scrollTop: 0 }, 400);
         	          	$('#response').empty().prepend(alert_error).fadeIn();
         	    	 	checkbox.prop('checked',true);
         	        }
	         	});
	        }
        }]
    });
});

$(document).on('click','.save_session_period', function(e){
	e.preventDefault();
	$('.highlight').removeClass('highlight');
		
	var form = '#'+$(this).closest('form').attr('id'),
	     success = [];

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
	 
	highlight($(form).find('#session_period'), '');

	var check_fields = (success.indexOf(false) > -1);
	
	if(check_fields === true){
	    $('html, body').animate({ scrollTop: 0 }, 400);
	    $('#response').empty().prepend(alert_required).fadeIn();
	} else {
	    $(this).prop('disabled','disabled');
	    var h = $('.overlay-complete-loader').height();
	    if(h == 0) { h = 100; }
	    $('.btl_overlay').height(h); 
	    $('.btl_relative').show();
	    var edit_user_id = $('#edit_user_id').val();
	    
	    $.ajax({
	        type: 'POST',
	        url: appHome+'/access/common-ajax', 
	        data: $(form).serialize().replace(/%5B%5D/g, '[]'),
	        success: function(response){
	        	$('.btl_relative').hide();
	        	if(edit_user_id){
		        	window.location.href = appHome+'/access/account-unlock'
		          	localStorage.setItem('response', response);
	        	}
	        	else{
	        		window.location.href = $('#returnpath').val();
	        		localStorage.setItem('response', response);
	        	}
	        },
	        error: function(response){
	          	$('html, body').animate({ scrollTop: 0 }, 400);
	          	$('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	    });
	}
})

//Page size change
$(document).on('change','.custom-page-pagesize', function(){
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('#unlock-form').submit();
});



function getAverageSessionPeriod(){
	var user_id = $('#user_id').val();
	$.ajax({
	        type: 'POST',
	        url: appHome+'/access/common-ajax', 
	        data: {
         				'user_id' : user_id,
         				'action_type' : 'get_session_average_time'
         			},
	        success: function(response){
	        	$('#session_period').val(response);
	        },
	        error: function(response){
	          	$('html, body').animate({ scrollTop: 0 }, 400);
	          	$('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	    });
}

$(document).on('change','#session_period_users #user_id', function(e){
    getAverageSessionPeriod()
});
