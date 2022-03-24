$(document).ready(function(){
	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
	
	$('.po_type_section').hide();
	$('.po_subtype_section').hide();
	
	$(function() {
	    $('.abrev_space').on('keypress', function(e) {
	        if (e.which == 32)
	            return false;
	    });
	});
	$('#po_area_abbre,#po_type_abbre,#po_subtype_abbre').blur(function(e){
		var val = $(this).val();
		$(this).val(removeSpaces(val));	
	});
	
	function removeSpaces(string) { 
		 return string.split(' ').join('');
	}
	
	//function to hide the div in onchange of the drop down
	function dropdownchange(){
        if($('#purchase-access').val() == 'po_area') {
            $('.po_area_section').show(); 
        } else {
            $('.po_area_section').hide(); 
        }
        if($('#purchase-access').val() == 'po_type') {
            $('.po_type_section').show(); 
        } else {
            $('.po_type_section').hide(); 
        }
        if($('#purchase-access').val() == 'po_subtype') {
            $('.po_subtype_section').show();
            $('.country_cur').hide();
            
            if($("#purchase_type_dd option:selected").text() == "VAT"){
        		$('.country_cur').show();
        	}else{
        		$('.country_cur').hide();
        		$('#sub_currency').val("");
                $('.chosen').chosen().trigger("chosen:updated");
        	}
            
            $(document).on('change', '#purchase_type_dd', function (e) {
            	if($("#purchase_type_dd option:selected").text() == "VAT"){
            		$('.country_cur').show();
            	}else{
            		$('.country_cur').hide();
            		$('#sub_currency').val("");
                    $('.chosen').chosen().trigger("chosen:updated");
            	}
      		});
        } else {
            $('.po_subtype_section').hide(); 
        }
    
	}
	    $('#purchase-access').change(function(){
	    	dropdownchange();
	    });
	    dropdownchange();
	$('.create-cust-group,.edit-cust-group').click(function(e){
		  $('.highlight').removeClass('highlight');
		  e.preventDefault();
		  var form = '#'+$(this).closest('form').attr('id'),
		      success = [],
		     path = $(this).attr('data-path');
		  var groupId = $('#po_group_id').val();
		  var poSection = $('#purchase-access').val();
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
		  
		  function isgroupNameExist(newGroup,newAbbre,button) {
			ExistSuccess = [];
			  
			if(button.hasClass('edit-cust-group')){
		  		var type = "update";
		  	}
		  	if(button.hasClass('create-cust-group')){
		  		var type = "create";
		  	}
		  	
		  	var groupId = $('#po_group_id').val();
			var groupname = newGroup.val();
			var groupAbbre = newAbbre.val();
			var poSection = $('#purchase-access').val();
			 
			  $.ajax({
			        type: 'POST', 
			        url: appHome+'/purchase/common_ajax',
			        async : false,
			        data: {
						'groupId'	   	: groupId,
						'groupname'		: groupname,
						'groupAbbre' 	: groupAbbre,
						'poSection' 	: poSection,
						'type'	   		: type,
						'action_type'   : 'group_name_exist'
					},
			        success: function(response){
			        	if(response > 0){ 
			        		ExistSuccess = 'Exist'
			        		$(newGroup).parent().addClass('highlight');	
			        		$(newAbbre).parent().addClass('highlight');	
			        	}else{
			        		ExistSuccess = 'Ok'
			        		$(newGroup).parent().removeClass('highlight');
			        		$(newAbbre).parent().addClass('highlight');	
			        	}
			        },
			        error: function(response){
			          $('html, body').animate({ scrollTop: 0 }, 400);
			          $('form').find('#response').empty().prepend(alert_error).fadeIn();
			        }
			  });
		  }
		  if(poSection == 'po_area')
		  { 
		  	highlight($(form).find('#po_area_name'), '');
		  	highlight($(form).find('#po_area_abbre'), '');
			
		  	if($('#po_area_name').val() != '' || $('#po_area_name').val() != '')
		  	{
			  isgroupNameExist($(form).find('#po_area_name'),$(form).find('#po_area_abbre'),$(this));
		  	}
		  }
		  else if(poSection == 'po_type')
		  {
			  highlight($(form).find('#purchase_area'), '');
			  highlight($(form).find('#po_type_name'), '');
			  highlight($(form).find('#po_type_abbre'), '');
				
			  if($('#po_type_name').val() != '' || $('#po_type_abbre').val() != '')
			  	{
				  isgroupNameExist($(form).find('#po_type_name'),$(form).find('#po_type_abbre'),$(this));
			  	}  
		  }
		  else if(poSection == 'po_subtype')
		  {   
			  highlight($(form).find('#purchase_type_dd'), '');
			  highlight($(form).find('#po_subtype_name'), '');
			  highlight($(form).find('#po_subtype_abbre'), '');
			  if($("#purchase_type_dd option:selected").text() == "VAT"){
				  highlight($(form).find('#sub_currency'), '');
			  }
			  if($('#po_subtype_name').val() != '' || $('#po_subtype_abbre').val() != '')
			  	{
				  isgroupNameExist($(form).find('#po_subtype_name'),$(form).find('#po_subtype_abbre'),$(this));
			  	}
			if($('#purchase_type_dd :selected').parent().attr('label') == "Tank Lease"){
				highlight($(form).find("#tank_lease_po_sub_type_division"), "");
			}
			else{
				$('#tank_lease_po_sub_type_division').val("");
			}
		  }
		  if(ExistSuccess == 'Exist'){
			  success.push(false);
		  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This Group Name or Abbreviation already exists.</div>';
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
		        url: '../'+groupId+'/groupUpdate',
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
		         url: path+'/purchasegroupadd',
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
	
	//view purchase order area
	$(document).on('click', '.view_product', function(e){ 
	//$('.view_product').click(function(e) {
		$('.view_small_loader').show();
		$('.reset_values').html('');
		var po_id = $(this).data('id');
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: appHome+'/purchase/common_ajax',
			data: {
				'po_id' : po_id,
				'action_type' : 'get_po_detail'
				  },
			success: function(response){
				$('.view_small_loader').hide();
				if(response != ""){
					$('#modal_area_name').html(response.po_area_name);
					$('#modal_area_abbreviation').html(response.po_area_abbreviation);
					$('#modal_area_status').html(response.po_area_status);
					
					
				}
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	});
	//view purchase order type
	$(document).on('click', '.view_product_type', function(e){ 
	//$('.view_product_type').click(function(e) {
		$('.view_small_loader').show();
		$('.reset_values').html('');
		var po_id = $(this).data('id');
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: appHome+'/purchase/common_ajax',
			data: {
				'po_id' : po_id,
				'action_type' : 'get_po_type_detail'
				  },
			success: function(response){ 
				$('.view_small_loader').hide();
				if(response != ""){ 
					$('#modal_area_type_name').html(response.po_area_name);
					$('#modal_type_name').html(response.po_type_name);
					$('#modal_type_abbreviation').html(response.po_type_abbreviation);
					$('#modal_type_status').html(response.po_type_status);
					
					
				}
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	});
	//view purchase order sub type
	$(document).on('click', '.view_product_subtype', function(e){ 
		$('.view_small_loader').show();
		$('.reset_values').html('');
		var po_id = $(this).data('id');
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: appHome+'/purchase/common_ajax',
			data: {
				'po_id' : po_id,
				'action_type' : 'get_po_subtype_detail'
				  },
			success: function(response){ 
				$('.view_small_loader').hide();
				if(response != ""){ 
					$('#modal_area_subtype_name').html(response.po_area_name);
					$('#modal_type_name_sub').html(response.po_type_name);
					$('#modal_subtype_name').html(response.po_subtype_name);
					$('#modal_subtype_abbreviation').html(response.po_subtype_abbreviation);
					$('#modal_subtype_status').html(response.po_subtype_status);
					if(response.po_subtype_currency != 'NO'){
						$(".po_sub_cur").show();
						$('#modal_subtype_currency').html(response.po_subtype_currency);
					}else{
						$(".po_sub_cur").hide();
					}
				}
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	});
	
	//Delete purchase order
	$(document).on('click', '.delete-po-btn', function(e){ 
	//$('.delete-po-btn').click(function(e) {
		e.preventDefault();
		
		var delete_url = $(this).attr('href'),
			po_id = $(this).data('prod-id'),
			$this = $(this),
			return_url = window.location.href;
		var group=$('#group-name').val();
		if($('#returnpath').val()) {
			return_url = $('#returnpath').val();
		}
		
		BootstrapDialog.confirm('Are you sure you want to delete this Purchase Order ?', function(result){
			if(result) {
				$.ajax({
					type: 'POST',
					url: delete_url,
					data: {'po_id' : po_id,
					'group' : group	
					},
					success: function(response){
						//window.location.href = return_url;
						location.reload();
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
	
	$(document).on('change', '.custom-page-pagesize', function (e) {
		  var pagelimit = $(this).val();
		 $('#pagesize').val(pagelimit);
		  $('.purchase-form').submit();
		});

		$(document).on("change", "#purchase_type_dd", function (e) {
			var label=$('#purchase_type_dd :selected').parent().attr('label');
			purchaseTypeChangeFn(label)
		});
		function purchaseTypeChangeFn(label){
			if(label == "Tank Lease"){
				$('.tank_lease_po_sub_type_division_area').show();
			}
			else{
				$('.tank_lease_po_sub_type_division_area').hide();
			}
		}
		purchaseTypeChangeFn($('#purchase_type_dd :selected').parent().attr('label'));
	
});