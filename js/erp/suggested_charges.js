var previous_valid_unditl_date = "";
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var alert_success = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-thumbs-o-up"></i>  <strong>Success!</strong> Suggested charges saved successfully</div>';
var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
var alert_date = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure that you have entered Valid From and Valid To Information correctly.</div>';
//Page size change
$(document).on('change','.custom-page-pagesize',function(){
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	if($('#pagename').val() == 'listing'){
		$('#suggested_charge_form').submit();
	}
	if($('#pagename').val() == 'reviewlisting'){
		$('#suggested_charge_review_form').submit();
	}
});

$(document).on('change','#charge_currency',function(e){
	var pagename = $("#pagename").val();
	if(pagename != 'listing' && pagename != 'reviewlisting'){
		var currency_id = $(this).chosen().val();
		switch_specific_currency_icons(currency_id,'actual-currency-change');
	}
});
$(function() {
	if($('.multi-sel-ctrl').length){
		$('.multi-sel-ctrl').multiselect({
	            enableCaseInsensitiveFiltering: true,
	            enableFiltering: true,
	            buttonWidth: '100%',
	            maxHeight: 200,
	            onChange: function(element, checked) {
	                element.parent().multiselect('refresh');
	                if (checked === true && element.val() != '') {
	                     element.parent().multiselect('deselect', '');
	                     element.parent().multiselect('refresh');
	                 }
	                 if (checked === true && element.val() == '') {
	                     element.parent().val('');
	                     element.parent().multiselect('refresh');
	                 }
	                 if(checked === false && element.parent().val() == null){
	                     element.parent().val(0);
	                     element.parent().multiselect('refresh');
	                 }
	            }
	    });
	    $('.tmp-input-ctrl').remove();
	}
});
/**
   * function for auto switch currency icons
   * @param currency_id
   * @param change_class
   * @returns {Boolean}
*/
function switch_specific_currency_icons(currency_id,change_class){
	  var $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
      currency_name = $currency.attr('data-label');

	  if(!$currency.length) {
	    alert('Error. Currency not found.');
	    return false;
	  }
	  if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
	  	$("."+change_class ).removeClass().html("").addClass(change_class+' fa currency-fa fa-'+currency_name);
	  }
	  else {
	  	$("."+change_class ).removeClass().html(currency_name.toUpperCase()).addClass(change_class+' fa currency-fa');
	  }
}

$(document).on('click','.create-charge,.edit-charge',function(e){
	$('.highlight').removeClass('highlight');
	e.preventDefault();
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

	function highlight_textarea(field, empty_value){
    	if(field.length > 0){
            if(field.val().trim() === empty_value){
            	$(field).css('border','1px solid red'); 
               	success.push(false);
            } else {
               	$(field).css('border','1px solid #ccc'); 
               	success.push(true);
            }
        } 
    }

	//To highlight the required field
	highlight($(form).find('#suggested_name'), '');
	highlight_textarea($(form).find('#suggested_description'), '');
	highlight($(form).find('#charge_currency'), '');
	highlight($(form).find('#charge_amount'), '');
	highlight($(form).find('#valid_from'), '');
	highlight($(form).find('#activity_id'), '');
	if($("#no_end_validity").prop('checked') == true){
        $('#valid_to').val($("#max_validity").val());
	}
	highlight($(form).find('#valid_to'), '');
	
	valid_from = $('#valid_from').val();
    valid_to = $('#valid_to').val();
	
	var check_fields = (success.indexOf(false) > -1);	
	// To edit the suggested charges
    if($(this).hasClass('edit-charge')){
	    var sug_charge_id = $('#sug_charge_id').val();
     	if(check_fields === true){
       		$('html, body').animate({ scrollTop: 0 }, 400);
       		$('form').find('#response').empty().prepend(alert_required).fadeIn();
     	} else if(!checkIsValidDateRange(valid_from, valid_to)){
     		$('html, body').animate({ scrollTop: 0 }, 400);
       		$('form').find('#response').empty().prepend(alert_date).fadeIn();
     	}else{
     		$(this).prop('disabled','disabled');
	       	$.ajax({
	        	type: 'POST',
	         	url: appHome+'/suggested-charge/'+sug_charge_id+'/update',
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
	   
	//To create the suggested charges
	if($(this).hasClass('create-charge')){
	    if(check_fields === true){
	    	$('html, body').animate({ scrollTop: 0 }, 400);
	       	$('form').find('#response').empty().prepend(alert_required).fadeIn();
	    } else if(!checkIsValidDateRange(valid_from, valid_to)){
     		$('html, body').animate({ scrollTop: 0 }, 400);
       		$('form').find('#response').empty().prepend(alert_date).fadeIn();
     	} else{
	       	$(this).prop('disabled','disabled');
	       	$.ajax({
	         	type: 'POST',
	         	url: appHome+'/suggested-charge/add',
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

//To delete the suggested charge
$(document).on('click','.delete-charge',function(e){
    e.preventDefault();
    var id = $(this).attr('data-charge-id');
    var charge_status = '';

    $.ajax({
     	type: 'POST',
     	url: appHome+'/suggested-charge/common-ajax',
     	async : false,
     	data: {
     		'sug_charge_id' : id,
     		'action_type' : 'job_suggested_exist'
     	},
     	success: function(response){
       		if(response>0){
       			charge_status = 'exist';
       		}else{
       			charge_status = 'ok';
       		}
     	},
     	error: function(response){
       		charge_status = 'ok';
     	}
    });

    if(charge_status == 'ok'){
	    BootstrapDialog.confirm('Are you sure you want to delete this Suggested charge?', function(result){
	        if(result) {
	          	$.ajax({
		            type: 'POST',
		            url: appHome+'/suggested-charge/'+id+'/delete',
		            data: {},
		            success: function(response){
		              	window.location.href = appHome+'/suggested-charge/index';
		              	localStorage.setItem('response', response);
		            },
		            error: function(response){
		              	$('html, body').animate({ scrollTop: 0 }, 400);
		              	$('form').find('#response').empty().prepend(alert_error).fadeIn();
		            }
	            });
	        }
	    });
	}
	else{
		BootstrapDialog.show({
			type: BootstrapDialog.TYPE_WARNING,
			title: "Warning",
			message: "The suggested charge shouldn't get deleted if its allocated to a job",			buttons: [{
	            label: "Close",
	            action: function(dialogItself){
	                dialogItself.close();
	                 
	            }
			}]
     	});
	}
});

$(document).on('click','.create-trigger',function(){
	$('.highlight').removeClass('highlight');
	var charge_id = $(this).data('charge_id');
	$('#sug_charge_id').val(charge_id);
	$('.modal-controls').val('');
	$('.modal-controls').trigger("chosen:updated");
	$('#mode').val('create');
	$('#save_trigger').prop('disabled',false);
	$('#trigger-response').empty();
	$('.country-select').hide();
	$('.customer-select').hide();
	$('.product-select').hide();
	$('.template-select').show();
	$('#trigger_modal').modal('show');
});

$(document).on('click','#save_trigger',function(e){
	$('.highlight').removeClass('highlight');
	e.preventDefault();
	var form = '#'+$(this).closest('form').attr('id'),
    success = [];
     
    var country_id = '';
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

	function highlight_dropdown(field, empty_value){
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

	//To highlight the required field
	highlight($(form).find('#trigger_key'), '');
	var trigger_key = $('#trigger_key').val();
	if(trigger_key == 'CUSTOMER'){
		highlight_dropdown($(form).find('#customer_id'), '');
	}
	else if(trigger_key == 'PRODUCT'){
		highlight_dropdown($(form).find('#product_id'), '');
	}
	else if(trigger_key == 'FROM_COUNTRY' || trigger_key == 'TO_COUNTRY'){
		highlight_dropdown($(form).find('#country_id'), '');
	}
	else{
		highlight($(form).find('#trigger_value'), '');
	}

	var check_fields = (success.indexOf(false) > -1);
	var is_error = false;

	if(check_fields === true){
	    $('html, body').animate({ scrollTop: 0 }, 400);
	    $('#trigger-response').empty().prepend(alert_required).fadeIn();
	} else {
       	$(this).prop('disabled','disabled');
       	
       	var mode = $('#mode').val();
       	var trigger_id = $('#trigger_id').val();
       	var sug_charge_id = $('#sug_charge_id').val();

       	if(trigger_key == 'CUSTOMER'){
       		var trigger_value = $('#customer_id').val();
       		// if(trigger_operator == '=' &&$('select#customer_id').val().length >1){
       		// 	BootstrapDialog.show({size: BootstrapDialog.SIZE_SMALL,title: 'Failed to save', message : 'Please select IN as Trigger Operator and try again'});
       		// 	is_error = true;
       		// }

       	}
       	else if(trigger_key == 'PRODUCT'){
       		var trigger_value = $('select#product_id').val();
       		// if(trigger_operator == '=' && $('select#product_id').val().length >1){
       		// 	BootstrapDialog.show({size: BootstrapDialog.SIZE_SMALL,title: 'Failed to save', message : 'Please select IN as Trigger Operator and try again'});
       		// 	is_error = true;
       		// }
       	}
       	else if(trigger_key == 'FROM_COUNTRY' || trigger_key == 'TO_COUNTRY'){
       		var trigger_value = $('select#city_id').val();
       		country_id = $('#country_id').val();
       	}
       	else{
       		var trigger_value = $('#trigger_value').val();
       	}

       	if(!is_error){
	       	$.ajax({
	         	type: 'POST',
	         	url: appHome+'/suggested-charge/common-ajax',
	         	data: {
	         		'mode' : mode,
	         		'trigger_id' : trigger_id,
	         		'sug_charge_id' : sug_charge_id,
	         		'trigger_key' : trigger_key,
	         		'trigger_value' : trigger_value,
	         		'country_id' : country_id,
	         		'action_type' : 'save_trigger'
	         	},
	         	success: function(response){
	         		$(this).prop('disabled',false);
	           		$('#response').empty().prepend(response).fadeIn();
	           		$('#trigger_modal').modal('hide');
	           		getTriggerList(sug_charge_id);
	         	},
	         	error: function(response){
	         		$(this).prop('disabled',false);
	           		$('html, body').animate({ scrollTop: 0 }, 400);
	           		$('#trigger-response').empty().prepend(alert_error).fadeIn();
	         	}
	       });
	    }else{
	    	$(this).prop('disabled',false);
	    }
    }
});

$(document).on('click','.trigger_list',function(e){
	$('.trigger_list').closest('tr').removeClass('success');
	var sug_charge_id = $(this).data('charge_id');
	$(this).closest('tr').addClass('success');
	getTriggerList(sug_charge_id);
	$('html, body').animate({ scrollTop: $('body').height() }, 400);
});

// $(document).on('change','#trigger_operator',function(e){
// 	var trigger_operator = $('#trigger_operator').val();
// 	var trigger_value = $('#trigger_value').val();
//  	if (trigger_operator == '='){
// 	 	$("#trigger_value").attr('maxlength','6');
// 	 	if(trigger_value){
// 	 		$("#trigger_value").val(trigger_value.substring(0, 6));
// 			$trigg_val =  $('#trigger_value').val();
// 			var str = $trigg_val.replace(/,\s*$/, "");;
// 			$('#trigger_value').val(str);
// 	 	}
	 	
// 	}else{
// 		$("#trigger_value").attr('maxlength','40');
// 	}
// });


// $(document).on('keypress','#trigger_value',function(e){
// 	var trigger_value = $('#trigger_value').val();
// 	var trigger_operator = $('#trigger_operator').val(); 
//  	if (trigger_operator == '='){
// 	 	$("#trigger_value").attr('maxlength','6');
// 	 	if(trigger_value){
// 	 		$("#trigger_value").val(trigger_value.substring(0, 6));
// 			$trigg_val =  $('#trigger_value').val();
// 			var str = $trigg_val.replace(/,\s*$/, "");
// 			$('#trigger_value').val(str);
// 	 	}
	 	
// 	}
// });

function getTriggerList(sug_charge_id){
	$.ajax({
     	type: 'POST',
     	url: appHome+'/suggested-charge/common-ajax',
     	data: {
     		'sug_charge_id' : sug_charge_id,
     		'action_type' : 'get_triggers'
     	},
     	success: function(response){
       		$('.trigger_section').html(response);
     	},
     	error: function(response){
       		$('html, body').animate({ scrollTop: 0 }, 400);
       		$('#trigger-response').empty().prepend(alert_error).fadeIn();
     	}
    });
}

$(document).on('click','.edit-trigger',function(){
	$('.highlight').removeClass('highlight');
	var trigger_id = $(this).data('trigger_id');
	var charge_id = $(this).data('charge_id');
	var trigger_value = $(this).data('trigger_value').toString();
	var trigger_key = $(this).data('trigger_key');
	var trigger_country_id = $(this).data('trigger_country_id');
	$('#trigger_id').val(trigger_id);
	$('#sug_charge_id').val(charge_id);
	$('#trigger_key').val(trigger_key);
	$('#trigger_key').trigger("chosen:updated");
	$('#mode').val('edit');
	$('#save_trigger').prop('disabled',false);
	$("#trigger-response").empty();
	if(trigger_key == 'CUSTOMER'){
		$('.template-select').hide();
		$('.customer-select').show();
		$('.product-select').hide();
		if(trigger_value.includes(",") == true){
			trigger_value = trigger_value.split(",");
		}
		$('#customer_id').val(trigger_value);
		$("#customer_id").trigger("chosen:updated");;
		$('.country-select').hide();
	}
	else if(trigger_key == 'PRODUCT'){
		$('.template-select').hide();
		$('.customer-select').hide();
		$('.product-select').show();
		if(trigger_value.includes(",") == true){
			trigger_value = trigger_value.split(",");
		}
		$('#product_id').val(trigger_value);
		$("#product_id").trigger("chosen:updated");
		$('.country-select').hide();
	}
	else if(trigger_key == 'FROM_COUNTRY' || trigger_key == 'TO_COUNTRY'){
		$('.template-select').hide();
		$('.customer-select').hide();
		$('.product-select').hide();
		$('#city_id').val(trigger_value);
		$('#country_id').val(trigger_country_id);
		$('#city_id').trigger("chosen:updated");
		$('#country_id').trigger("chosen:updated");
		$('.country-select').show();
	}
	else{
		$('.template-select').show();
		$('.customer-select').hide();
		$('.product-select').hide();
		$('#trigger_value').val(trigger_value);
		$('.country-select').hide();
	}
	$('#trigger_modal').modal('show');
});

$(document).on('click','#charges_btn',function(){
    $('#charges_btn i').toggleClass('fa-minus-circle fa-plus-circle');    
});

//To delete the suggested charge
$(document).on('click','.delete-trigger',function(e){
    e.preventDefault();
    var trigger_id = $(this).attr('data-trigger_id');
    var charge_id = $(this).attr('data-charge_id');

    BootstrapDialog.confirm('Are you sure you want to delete this Suggested charge trigger?', function(result){
        if(result) {
          	$.ajax({
	            type: 'POST',
	            url: appHome+'/suggested-charge/common-ajax',
	            data: {
	            	'trigger_id' : trigger_id,
					'charge_id'  : charge_id,
	            	'action_type' : 'delete_trigger'
	            },
	            success: function(response){
	            	$('#response').empty().prepend(response).fadeIn();
	              	getTriggerList(charge_id);
	            },
	            error: function(response){
	              	$('html, body').animate({ scrollTop: 0 }, 400);
	              	$('form').find('#response').empty().prepend(alert_error).fadeIn();
	            }
            });
        }
    });
});

function split( val ) {
    return val.split( /,\s*/ );
}
function extractLast( term ) {
  	return split( term ).pop();
}
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
// $(document).ready(function(){
	$("#trigger_value")
      // don't navigate away from the field on tab when selecting an item
      .on( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
          event.preventDefault();
        }
      })
      .autocomplete({
        minLength: 2,
        type: "GET",
        source: function( request, response ) {
        	var charge_id = $('#sug_charge_id').val();
            // delegate back to autocomplete, but extract the last term
            $.getJSON(appHome+'/suggested-charge/autocomp_quote', { charge_id : charge_id,term : extractLast( request.term )},response);
        },
        focus: function() {
          // prevent value inserted on focus
          return false;
        },
        select: function( event, ui ) {
          var terms = split( this.value );
          // remove the current input
          terms.pop();
          // add the selected item
          terms.push( ui.item.value );
          // add placeholder to get the comma-and-space at the end
          // terms.push( "" );
          var terms = terms.filter(onlyUnique);
          this.value = terms.pop();
		 //  var trigger_operator = $("#trigger_operator").val();
		 //  if(trigger_operator == "="){
   //        	this.value = terms.slice(0,-1);
		 //  }else{
			// this.value = terms.join( ", " );
		 //  }
          return false;
        }
    });
// });


function setStatusSaveButton(id,oldValue,suggested_id){
	 
	var fieldId = "#"+id;
	var newValue = $(fieldId).val();
    BootstrapDialog.confirm('Are you sure to change the suggested charge status?', function(result){
        if(result) {
          	$.ajax({
	            type: 'POST',
	            url: appHome+'/suggested-charge/common-ajax',
	            data: {
	            	'suggested_id' : suggested_id,
	            	'status': newValue,
	            	'action_type' : 'save_suggested_charge_status'
	            },
	            success: function(response){
	              	localStorage.setItem('response', response);
	              	$('form').find('#response').empty().prepend(response).fadeIn();
					window.location.reload();
	            },
	            error: function(response){
	              	$('html, body').animate({ scrollTop: 0 }, 400);
	              	//$('form').find('#response').empty().prepend(alert_error).fadeIn();
	            }
            });
        }
        else{
        	$(fieldId).val(oldValue);
        	$('.chosen').chosen().trigger("chosen:updated");
        }
    });
}

//Function for End Date Undisclosed 
$(document).on('change','#no_end_validity',function(e){
	
if($(this).prop("checked")){
	    previous_valid_unditl_date = $('input[name="valid_to"]').val();
		$('input[name="valid_to"]').attr('readonly','true');		
		$('input[name="valid_to"]').datepicker( "option", "disabled", true );
		$('input[name="valid_to"]').hide();
		$("#dummy_date").show();
		$('#valid_to').val($("#max_validity").val());
} else {
		$('input[name="valid_to"]').removeAttr('readonly');
		$('input[name="valid_to"]').datepicker( "option", "disabled", false );
		$("#dummy_date").hide();
		$('input[name="valid_to"]').show();
		$('input[name="valid_to"]').val(previous_valid_unditl_date);
}
});

$(document).on('change','#trigger_key',function(e){
	var trigger_key = $(this).val();
	if(trigger_key == 'JOB_TEMPLATE' || trigger_key == ''){
		$('.template-select').show();
		$('.customer-select').hide();
		$('.product-select').hide();
		$('.country-select').hide();
	}
	else if(trigger_key == 'CUSTOMER'){
		$('.template-select').hide();
		$('.customer-select').show();
		$('.product-select').hide();
		$('.country-select').hide();
	}
	else if(trigger_key == 'PRODUCT'){
		$('.template-select').hide();
		$('.customer-select').hide();
		$('.product-select').show();
		$('.country-select').hide();
	}
	else if(trigger_key == 'FROM_COUNTRY' || trigger_key == 'TO_COUNTRY'){
		$('.template-select').hide();
		$('.customer-select').hide();
		$('.product-select').hide();
		$('.country-select').show();
		$('#city_id').val('');
		$('#country_id').val('');
		$('#city_id').trigger("chosen:updated");
		$('#country_id').trigger("chosen:updated");
	}
});

/**
* Selecting recharge type 
*/
$(document).on('click', '.recharge_radio', function(e) {
	$('.highlight').removeClass('highlight');
	$('textarea').css('border','1px solid #ccc');
	$('input[type="checkbox"]').css('outline','none'); 
	if($(this).val() == 'recharge' || $(this).val() == 'link_to_po_summary_inv' ){
	 	$('.recharge_pannel').show();
	 	$('.not_recharge_pannel,.awaiting_final_action, .po_recharge_pannel').hide();
	 	if($(this).val() == 'link_to_po_summary_inv'){
		 	$('.recharge-comments').hide();
	 	}else{
		 	$('.recharge-comments').show();
	 	}
	}else if($(this).val() == 'not_recharge'){
	 	$('.not_recharge_pannel').show();
	 	$('.recharge_pannel,.awaiting_final_action, .po_recharge_pannel').hide();
	}else if($(this).val() == 'po_recharge'){
	 	$('.po_recharge_pannel').show();
	 	$('.recharge_pannel,.awaiting_final_action, .not_recharge_pannel').hide();
	}else{
	 	$('.awaiting_final_action').show();
	 	$('.recharge_pannel,.not_recharge_pannel, .not_recharge_pannel').hide();
	}
});

/**
 * save / update
*/
$(document).on('click', '.save-recharge-btn', function(e) {
    $('.highlight').removeClass('highlight');
    e.preventDefault();
    var optradio = $('input[name=optradio]:checked').val();
    var form = '#'+$(this).closest('form').attr('id'),
        success = [],
        job_sug_id = $('input[name="job_sug_id"]').val();
     
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

    function highlight_textarea(field, empty_value){
    	if(field.length > 0){
            if(field.val().trim() === empty_value){
               	$(field).css('border','1px solid red'); 
               	success.push(false);
            } else {
               	$(field).css('border','1px solid #ccc'); 
               	success.push(true);
            }
        } 
    }
     
    function highlight_checkbox(field, empty_value){
    	var id = field.attr('id');
        if($('#'+id+':checkbox:checked').length == 0){            	 
        	$(field).css('outline','1px solid red'); 
           	success.push(false);
        } else {
           	$(field).css('outline','none'); 
           	success.push(true);
        }
    }
     
    if(optradio == 'recharge' || optradio == 'link_to_po_summary_inv'){
	    highlight($('#currency'), '');
	    highlight($('#recharge_amount'), '');
	    highlight($('#recharge_to_another_customer'), '');
	    highlight($('#reason_code_for_acc_manager'), '');
    }else if(optradio == 'awating_final_action'){
    	highlight($('#awaiting_amount'), '');

    }else{
    	// highlight_textarea($('#not_recharge_comments'), ''); //commented on 20-Oct-2017
    	//highlight_checkbox($('#confirm_not_recharged'), '');
    	highlight($('#not_reason_code_for_acc_manager'), '');
    }
    var check_fields = (success.indexOf(false) > -1);

	if(check_fields === true){
	     $('html, body').animate({ scrollTop: 0 }, 400);
	     $('#response').empty().prepend(alert_required).fadeIn();
	} else {
		if((optradio == 'recharge' || optradio == 'link_to_po_summary_inv') && (parseFloat($('#recharge_amount').val()) == 0 || $('#recharge_amount').val() == "")){
			BootstrapDialog.show({
			   type: BootstrapDialog.TYPE_DANGER,
	           title: 'Warning',
	           message: 'Are you sure you want to recharge with zero Amount?',
	           buttons: [{
				             label: 'Close',
				             action: function(dialogItself){
				             	dialogItself.close();
				             }
					         },{
				           label: 'Ok',
				           cssClass: 'btn-danger',
				           action: function(dialogItself){
				           		dialogItself.close();
				           		applyRecharge(job_cost_id, form);
				           }
				   }]
	       });
		}else{
			applyRecharge(job_sug_id, form);
		} 
	}
});

function applyRecharge(job_sug_id, form){
  	$('.save-recharge-btn').attr('disabled','disabled');
  	$.ajax({
       	type: 'POST',
       	url: appHome+'/suggested-charge/'+job_sug_id+'/recharge',
       	data: $(form).serialize().replace(/%5B%5D/g, '[]'),
       	success: function(response){
         	window.location.href = $('#returnpath').val();
         	localStorage.setItem('response', response);
       	},
       	error: function(response){
    	 	$(this).removeAttr('disabled');
         	$('html, body').animate({ scrollTop: 0 }, 400);
         	$('#response').empty().prepend(alert_error).fadeIn();
       	}
	});
}

$(document).on('change','#awaiting_currency', function(){
	var currency_id = $(this).chosen().val();
	switch_specific_currency_icons(currency_id,'awaiting-currency');
});

/**
   * function for auto switch currency icons
   * @param currency_id
   * @param change_class
   * @returns {Boolean}
*/
function switch_specific_currency_icons(currency_id,change_class){
	var $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
    currency_name = $currency.attr('data-label');

	if(!$currency.length) {
	    alert('Error. Currency not found.');
	    return false;
	}
	if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
	  	$("."+change_class ).removeClass().html("").addClass(change_class+' fa currency-fa fa-'+currency_name);
	}
	else {
	  	$("."+change_class ).removeClass().html(currency_name.toUpperCase()).addClass(change_class+' fa currency-fa');
	}
}

$(document).on('change', '#currency', function(){
  	var currency_id = $(this).chosen().val();
  	switch_specific_currency_icons(currency_id,'estimated-currency');
  	var inputRadioval = $('input[name=optradio]:checked').val();
  	if(inputRadioval == 'recharge' || inputRadioval == 'link_to_po_summary_inv'){
	  	getAllCustomersByCurrency();
  	}
    // var actual_currency = $(this).val();
	// var year_week = $('#jobcost_year_week').val();
	// getExchangeRates(actual_currency, year_week);
});

/**
 * function for get all customers of currency
*/
function getAllCustomersByCurrency(){
	var currency = $('#currency').val();
	$.ajax({
	    type: 'POST',
	    url: appHome+'/job-cost/common_ajax',
	    data: {
	      'currency'	: currency,
	      'action_type' : 'get_all_customers_by_recharge_currency'
	    },
	    beforeSend: function() {
	    	$('<i class="fa fa-spinner fa-spin"></i>').insertAfter($('#recharge_to_another_customer').parent());
	    },
	    success: function(response){
	    	if(response) {
	    		$('#recharge_to_another_customer').html(response).chosen().trigger("chosen:updated");
	    		$("#billing_office").val('');
	    	}
	    	$('.fa-spinner').remove();
	    }
	});
}

$(document).on('change','#recharge_to_another_customer',function(){
	var customer_code = $(this).chosen().val();
	if($(this).val() == ''){
		$("#billing_office").val('');
	}else{
        fillBillingOfficeForCustomer(customer_code);
	}
});

/**
 * function for displaying Billing Office for each Customer
*/
function fillBillingOfficeForCustomer(customer_code){
	if(customer_code != ""){
	  	$.ajax({
	        type: 'POST',
	        url: appHome+'/job-cost/common_ajax',
	        data: {
	          'customer_code'	: customer_code,
	          'action_type'     : 'get_billing_office_of_customer'
	        },
		    beforeSend: function() {
		    	$('<i class="fa fa-spinner fa-spin"></i>').insertAfter($('#billing_office').parent());
		     },
	        success: function(response){
	        	$('#billing_office').val(response);
	        	$('.fa-spinner').remove();
	        }
	    });
	}
}

$(document).on('change', '#country_id', function(e){
	var country_id = $(this).val();
	if(country_id != ""){
		$('#city_id option').hide();
		$('#city_id option[data-country-id="'+ country_id +'"]').show();
	} else {
		$('#city_id option').show();
	}
	
	if($('#city_id :selected').data('country-id') != country_id){
		$('#city_id').val('');
	}
	$('.chosen').chosen().trigger("chosen:updated");
	
});

// Change equipment status
$(document).on('click', '.suggested_charge_status', function(e) {
	e.preventDefault();
	var sug_charge_id = $(this).attr('data-id');
	var change_to = $(this).attr('data-suggested-charge-to');

	var message = 'Are you sure, you want to move the suggested charge to '+change_to.charAt(0).toUpperCase() + change_to.slice(1)+' ?';
	
	if(change_to == 'live'){
		var mtype = BootstrapDialog.TYPE_SUCCESS;
		var mButton = 'btn-success';
	}else{
		var mtype = BootstrapDialog.TYPE_PRIMARY;
		var mButton = 'btn-primary';
	}

	BootstrapDialog.show({
        type: mtype,
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
	     		       url: appHome+'/suggested-charge/common-ajax',
	     		        data: {
	     		      	  'sug_charge_id' : sug_charge_id,
	     		      	  'action_type' : 'change_charge_status',
	     		      	  'change_to' : change_to
	     		        },
	     		       beforeSend: function() {
	     		        	$('.bootstrap-dialog-footer-buttons > .'+mButton).html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		     		        $('.bootstrap-dialog-footer-buttons > .'+mButton).attr('disabled','disabled');
	     		        },
	     		        success: function(response){
	     		        	location.reload();
	     		            localStorage.setItem('response', response);
	     		            $('html, body').animate({ scrollTop: 0 }, 400);
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

// Change equipment status
$(document).on('click', '.trigger_charge_status', function(e) {
	e.preventDefault();
	var trigger_id = $(this).attr('data-id');
	var change_to = $(this).attr('data-suggested-charge-to');
	var charge_id = $(this).attr('data-charge-id');

	var message = 'Are you sure, you want to move the suggested charge trigger to '+change_to.charAt(0).toUpperCase() + change_to.slice(1)+' ?';
	
	if(change_to == 'live'){
		var mtype = BootstrapDialog.TYPE_SUCCESS;
		var mButton = 'btn-success';
	}else{
		var mtype = BootstrapDialog.TYPE_PRIMARY;
		var mButton = 'btn-primary';
	}

	BootstrapDialog.show({
        type: mtype,
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
	     		        url: appHome+'/suggested-charge/common-ajax',
	     		        data: {
	     		      	  'trigger_id' : trigger_id,
	     		      	  'action_type' : 'change_trigger_status',
	     		      	  'change_to' : change_to,
						  'charge_id' : charge_id
	     		        },
	     		       beforeSend: function() {
	     		        	$('.bootstrap-dialog-footer-buttons > .'+mButton).html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		     		        $('.bootstrap-dialog-footer-buttons > .'+mButton).attr('disabled','disabled');
	     		        },
	     		        success: function(response){
	     		        	location.reload();
	     		            localStorage.setItem('response', response);
	     		            $('html, body').animate({ scrollTop: 0 }, 400);
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

$(document).on('click','.head-bar',function(){
	$('.list-head').removeClass('active');
	$(this).parent('li').addClass('active');
});