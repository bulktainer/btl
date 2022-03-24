$(document).ready(function(){
	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
	
	$('.reset').click(function(e){
		$(".multi-sel-ctrl").multiselect('enable');
	});
	
	function customerelementselect(){
		if($('#customer_id').length == 1){
			var customerElement = $('#customer_id').attr('id');
		}else if($('#cust_code_filter').length == 1){
			var customerElement = $('#cust_code_filter').attr('id');
		}else if($('#j_cust_code').length == 1){
			var customerElement = $('#j_cust_code').attr('id');
		}else if($('#customer-filter').length == 1){
			var customerElement = $('#customer-filter').attr('id');
		}
		return customerElement;
	}
	
	var customerElement = customerelementselect();
	if($('#is-multi-disable').val() == 'yes'){
		$("#"+customerElement).multiselect({
			enableCaseInsensitiveFiltering: true,
			enableFiltering: true,
			maxHeight: 200,
			buttonWidth: '100%'
			
		});
		$("#"+customerElement).multiselect('disable');
		
		
	}
	
	$('#customer_group').change(function(e){
		
		var customerElement = customerelementselect();
		
		$("#"+customerElement).val("");
		$("#"+customerElement).multiselect('enable');
		$("#"+customerElement).multiselect("refresh");
		var cust_val_type = $(this).data('custtype');
		if(!cust_val_type){
			cust_val_type = 'cust_code';
		}

		var grouptype = $(this).val();

		if(!$.isArray(grouptype)){
			grouptype = [grouptype];
		}

		if($('#old_codeset_home').length > 0){
			var url = $('#old_codeset_home').val();
		}else{
			var url = appHome;
		}
		if(grouptype != "" && grouptype[0] != 0){
			$.ajax({
				type: "POST", 
				timeout: 90000, // sets timeout to 90 sec
				beforeSend: function() {
		        	$('.tank_name_loader').show();
		        },
				url: url+'/jobtemplate-quotes/common_ajax',
				data: ({
					'action_type':'get_customer_from_group',
					'grouptype' : grouptype
				}),  
				success: function(result){ 
					var obj = JSON.parse(result);
					if(!$.isEmptyObject(obj)){
						$("#"+customerElement+" option:selected").removeAttr("selected");
						$.each(obj, function (key, value) {
							var selType = (cust_val_type == 'cust_code') ? value : key;
							$("#"+customerElement+" option[value='" + selType + "']").attr("selected", true);
						})
					}else{
						$("#"+customerElement).val("");
					}
					if($('#old_codeset_home').length == 0){
						$("#"+customerElement).multiselect('disable');
					}
					 $("#"+customerElement).multiselect("refresh");
					 $('.tank_name_loader').hide();
					}  
			});
		}
	
	});
	/**
	* update edit-vgm-route
	*/
	$('.create-cust-group,.edit-cust-group').click(function(e){
	  $('.highlight').removeClass('highlight');
	  e.preventDefault();
	  var form = '#'+$(this).closest('form').attr('id'),
	      success = [],
	      groupId = $('input[name="group_id"]').val(),
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
	  
	  function isgroupNameExist(newGroup,button) {
		ExistSuccess = [];
		  
		if(button.hasClass('edit-cust-group')){
	  		var type = "update";
	  	}
	  	if(button.hasClass('create-cust-group')){
	  		var type = "create";
	  	}
		var groupId = $('#group_id').val();
		var newGroupName = newGroup.val();
		
		  $.ajax({
		        type: 'POST', 
		        url: path+'/common_ajax',
		        async : false,
		        data: {
					'newGroupName' : newGroupName,
					'groupId'	   : groupId,
					'type'	   : type,
					'action_type'   : 'group_name_exist'
				},
		        success: function(response){
		        	if(response > 0){
		        		ExistSuccess = 'Exist'
		        		$(newGroup).parent().addClass('highlight');	        		
		        	}else{
		        		ExistSuccess = 'Ok'
		        		$(newGroup).parent().removeClass('highlight');
		        	}
		        },
		        error: function(response){
		          $('html, body').animate({ scrollTop: 0 }, 400);
		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
		  });
	  }
	  highlight($(form).find('#group-name'), '');

	  if($('#group-name').val() != ''){
		  isgroupNameExist($(form).find('#group-name'),$(this));
	  }
	  if(ExistSuccess == 'Exist'){
		  success.push(false);
	  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This Group Name already exists.</div>';
	  }else{
		  success.push(true); 
		  alert_required = oldalert;
	  }   
	  var check_fields = (success.indexOf(false) > -1);
	  /**
	  * update edit-vgm-route
	  */
	  if($(this).hasClass('edit-cust-group')){

	    if(check_fields === true){
	      $('html, body').animate({ scrollTop: 0 }, 400);
	      $('form').find('#response').empty().prepend(alert_required).fadeIn();
	    } else {
	      $.ajax({
	        type: 'POST',
	        url: '../'+groupId+'/customerGroupUpdate',
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
	   if($(this).hasClass('create-cust-group')){
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	       $.ajax({
	         type: 'POST',
	         url: path+'/customergroupadd',
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
});