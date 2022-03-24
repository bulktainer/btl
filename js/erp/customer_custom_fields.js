$('#customer-select').change(function(){
	getCustomFields();
});

above_id = null;
custom_field_id = null;
var something_went_wrong_alert = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, Please try again.</div>';

function getCustomFields(){
	$('.overlay-complete-loader').show();
	$('.custom-fields-div').html('');
	alert_error = "Something went wrong, Please try again."
	if($('#customer-select').val()){
		$.ajax({
			type: 'POST',
			url: appHome+'/customer-portal/custom-fields/common-ajax',
			data: {
				'customer_id'  : $('#customer-select').val(),
				'action_type' : 'get_table_data'
			},
			success: function(response){
				if(response){
					$('.overlay-complete-loader').hide();
					$('.custom-fields-div').html(response);
					makeFieldsRowsDraggable();
				}
				else {
					$('#response').empty().prepend(something_went_wrong_alert).fadeIn();
				}
			},
			error: function(response){
			  $('html, body').animate({ scrollTop: 0 }, 400);
			  $('.overlay-complete-loader').hide();
			  $('#response').empty().prepend(something_went_wrong_alert).fadeIn();
			}
		});
	}
	else{
		$('.overlay-complete-loader').hide();
	}
}

$(document).on('click', '.create-btn', function(e){
	e.preventDefault();
	if(e.target.localName == "a" || e.target.localName == "button") target = e.target;
	else target = e.target.parentElement;
	above_id = target.dataset.field_id;
	custom_field_id = null;
	$('#add_or_edit_form').trigger("reset");
	$('#save-custom-field').removeAttr("disabled");
	$('#create_or_edit_response').empty();
	$('.highlight').removeClass('highlight');
	$('#add_custom_field').modal('show')
});
$(document).on('click', '.edit-btn', function(e){
	e.preventDefault();
	let target = null;
	if(e.target.localName == "a") target = e.target;
	else target = e.target.parentElement;
	custom_field_id = target.dataset.field_id;
	$('#add_or_edit_form').trigger("reset");
	$('#save-custom-field').removeAttr("disabled");
	$('#field_name').val(target.dataset.field_name);
	$('#field_type').val(target.dataset.field_type);
	$('#create_or_edit_response').empty();
	$('.highlight').removeClass('highlight');
	$('#add_custom_field').modal('show');
});

$('#save-custom-field').click(function(e){
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	
	$('form').find('#create_or_edit_response').empty().fadeIn();
	$('.highlight').removeClass('highlight');
	  e.preventDefault();
	  var form = '#'+$(this).closest('form').attr('id');
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
	  
		  
		  //To highlight the required field
		  highlight($(form).find('#field_name'), '');
		  highlight($(form).find('#field_type'), '');
		 
		  
		  
		var check_fields = (success.indexOf(false) > -1);
	
		//To create the custom field
		if(check_fields === true){
			$('form').find('#create_or_edit_response').empty().prepend(alert_required).fadeIn();
			return;
		}
		$(this).prop('disabled','disabled');
		if(custom_field_id){
			$.ajax({
				type: 'POST',
				url: appHome+'/customer-portal/custom-fields/common-ajax',
				data: {
					'action_type' : 'update_custom_field',
					'field_id': custom_field_id,
					'field_name': $('#field_name').val(),
					'field_type': $('#field_type').val()
				},
				success: function(response){
					if(response){
						let res = JSON.parse(response);
						if(res.success){
							getCustomFields();
							$('#add_custom_field').modal('hide');
						}
						else if(res.error){
							$('#save-custom-field').removeAttr("disabled");
							$('#create_or_edit_response').empty().prepend(res.error).fadeIn();
						}
						else{
							$('#save-custom-field').removeAttr("disabled");
							$('#create_or_edit_response').empty().prepend(something_went_wrong_alert).fadeIn();
						}
					}
					else {
						$('#save-custom-field').removeAttr("disabled");
						$('#create_or_edit_response').empty().prepend(something_went_wrong_alert).fadeIn();
					}
				},
				error: function(response){
					$('#save-custom-field').removeAttr("disabled");
					$('#create_or_edit_response').empty().prepend(something_went_wrong_alert).fadeIn();
				}
			});
		}
		else{
				$.ajax({
					type: 'POST',
					url: appHome+'/customer-portal/custom-fields/common-ajax',
					data: {
						'customer_id'  : $('#customer-select').val(),
						'action_type' : 'save_custom_field',
						'above_id': above_id,
						'field_name': $('#field_name').val(),
						'field_type': $('#field_type').val()
					},
					success: function(response){
						if(response){
							let res = JSON.parse(response);
							if(res.success){
								getCustomFields();
								$('#add_custom_field').modal('hide');
							}
							else if(res.error){
								$('#save-custom-field').removeAttr("disabled");
								$('#create_or_edit_response').empty().prepend(res.error).fadeIn();
							}
							else{
								$('#save-custom-field').removeAttr("disabled");
								$('#create_or_edit_response').empty().prepend(something_went_wrong_alert).fadeIn();
							}
						}
						else {
							$('#save-custom-field').removeAttr("disabled");
							$('#create_or_edit_response').empty().prepend(something_went_wrong_alert).fadeIn();
						}
					},
					error: function(response){
						$('#save-custom-field').removeAttr("disabled");
						$('#create_or_edit_response').empty().prepend(something_went_wrong_alert).fadeIn();
					}
				});
			
				
			}
		   
	});

	$(document).on('click','.delete-field',function(e){
		e.preventDefault();
		$('#response').empty();
		BootstrapDialog.confirm('Are you sure you want to delete this custom field?', function(result){
			if(result) {
				if(e.target.localName == "a") target = e.target;
				else target = e.target.parentElement;
				custom_field_id = target.dataset.field_id;
				$.ajax({
					type: 'POST',
					url: appHome+'/customer-portal/custom-fields/common-ajax',
					data: {
						'action_type' : 'checkCustomFieldAlreadyUsed',
						'field_id': custom_field_id
					},
					success: function(response){
						if(response > 0){
								BootstrapDialog.confirm('This field is already used in some of the declaration. Do you want to continue?', function(res){
									if(res){
										deleteCustomField(custom_field_id);
									}
								});
						}
						else{
							deleteCustomField(custom_field_id);
						}
					},
					error: function(response){
						$('html, body').animate({ scrollTop: 0 }, 400);
						$('#response').empty().prepend(something_went_wrong_alert).fadeIn();
					}
				});
			}
		});

		function deleteCustomField(custom_field_id){
			$.ajax({
				type: 'POST',
				url: appHome+'/customer-portal/custom-fields/common-ajax',
				data: {
					'action_type' : 'delete_custom_field',
					'field_id': custom_field_id
				},
				success: function(response){
					if(response){
						getCustomFields();
					}
					else {
						$('html, body').animate({ scrollTop: 0 }, 400);
						$('#response').empty().prepend(something_went_wrong_alert).fadeIn();
					}
				},
				error: function(response){
					$('html, body').animate({ scrollTop: 0 }, 400);
					$('#response').empty().prepend(something_went_wrong_alert).fadeIn();
				}
			});
		}
	});
	$(document).on('change','.status_update_checkbox',function(e){
		e.preventDefault();
		var new_status_text = "Inactive";
		status = 0;
		if($(this).is(':checked')) {
			new_status_text = "Active";
			status = 1;
		}
		$('#response').empty();
		BootstrapDialog.confirm('Are you sure you want to change staus to '+new_status_text+'?', function(result){
			if(result) {
	
				custom_field_id = e.target.dataset.field_id;
				$.ajax({
					type: 'POST',
					url: appHome+'/customer-portal/custom-fields/common-ajax',
					data: {
						'action_type' : 'change_status_custom_field',
						'field_id': custom_field_id,
						'status': status
					},
					success: function(response){
						if(response){
							getCustomFields();
						}
						else {
							if(status == 1){
								$(e.target).removeAttr('checked');
							}
							else{
								$(e.target).attr('checked', 'checked');
							}
							$('html, body').animate({ scrollTop: 0 }, 400);
							$('#response').empty().prepend(something_went_wrong_alert).fadeIn();
						}
					},
					error: function(response){
						if(status == 1){
							$(e.target).removeAttr('checked');
						}
						else{
							$(e.target).attr('checked', 'checked');
						}
						$('html, body').animate({ scrollTop: 0 }, 400);
						$('#response').empty().prepend(something_went_wrong_alert).fadeIn();
					}
				});
			}
			else{
				
				if(status == 1){
					$(e.target).removeAttr('checked');
				}
				else{
					$(e.target).attr('checked', 'checked');
				}
			}
		});
	});

	function makeFieldsRowsDraggable(){
		$('#field_tbody').sortable({
			items: 'tr',
			cursor: 'pointer',
			axis: 'y',
			dropOnEmpty: false,
			start: function (e, ui) {
				// console.log(e)
			},
			stop: function (e, ui) {
				var idsInOrder = $("#field_tbody").sortable('toArray', { attribute: 'data-field-id' });
				let idsInOrderIndex = idsInOrder.findIndex(el => el == $(ui.item).data().fieldId) + 1;
				$('#field_tbody-loader').show();
				$.ajax({
					type: 'POST',
					url: appHome+'/customer-portal/custom-fields/common-ajax',
					data: {
						'field_id' : $(ui.item).data().fieldId,
						'sort_order' : idsInOrderIndex,
						'action_type' : 'changeOrdering'
					},
					async : false,
					success: function(response){
						let order_tds = $('.order_td');
						setTimeout(() => {
							
							order_tds.each((index, el) => {
								$(el).html(index + 1);
							});
						}, 100);
						$('#field_tbody-loader').hide();
					},
					error: function(response){
						$('html, body').animate({ scrollTop: 0 }, 400);
						$('#response').empty().prepend(something_went_wrong_alert).fadeIn();
						$('#field_tbody-loader').hide();
					}
				});
				
			}
		});
	}

