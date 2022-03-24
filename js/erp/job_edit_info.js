$(document).ready(function(){
	fillCurrencyByCustomer();
	//view job infomation
	$(document).on('click', '.view_job_edit_info', function(e){ 
		$('.view_small_loader').show();
		$('.reset_values').html('');
		var po_num = $(this).data('id');
		$.ajax({ 
			type: 'POST',
			dataType: 'json',
			url: appHome+'/job/common_ajax',
			data: {
				'po_number' 	: po_num,
				'action_type' 	: 'get_job_info'
				  },
			success: function(response){
				$('.view_small_loader').hide();
				if(response != ""){
					$('#modal_job_num').html(response.j_number);
					$('#modal_cust_order').html(response.j_cust_ord);
					$('#modal_sea_type').html(response.sea_type);
					
					
					if(response.sea_type == 'Deep Sea'){
						$('.orgin-free-tr').show();
						$('#modal_origin_free_days').html(response.j_prdem_fdays);
						$('#modal_origin_rate').html(response.j_instructions_del);
						$('#modal_demtk_cust').html(response.j_demtk_cust);
						$('#modal_imco_terms').html(response.demtk_name);
					}else{
						$('.orgin-free-tr').hide();
						$('#modal_origin_free_days').html('');
						$('#modal_origin_rate').html('');
						$('#modal_demtk_cust').html('');
						$('#modal_imco_terms').html('');
					}
					$('#modal_free_days').html(response.j_free_days);
					$('#modal_demurrage').html(response.j_demurrage_after_free_days);
					$('#modal_demurrage_cur').html(response.j_demurrage_curr);
					$('#modal_required_weight').html(response.j_weight_reqd);
					$('#modal_loaded_weight').html(response.j_loaded_weight);
					$('#modal_collection_ref').html(response.j_coll_ref);
					$('#modal_delivery_ref').html(response.j_del_ref);
					$('#modal_customer_edi_ref').html(response.j_cust_edi_ref);
					$('#modal_description').html(response.j_description);
					$('#modal_int_instru').html(response.j_instructions);
					$('#modal_load_instru').html(response.j_instructions_load);
					$('#modal_ship_instru').html(response.j_instructions_ship);
					$('#modal_delivery_instru').html(response.j_instructions_del);
				}
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	});
	//updating the job information
	$(document).on('click','.update_job_info',function(e){
		e.preventDefault();
		var success = [];
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
		$('.highlight').removeClass('highlight');
		
		highlight($('#required_weight'), '');
		highlight($('#loaded_weight'), '');

		if($('#sea_type').val() == 2 && $('#demtk_customer').val().trim() != ""){
			highlight($('#demurrage_currency'), '');
		}
		
		var check_fields = (success.indexOf(false) > -1);
		
		if(check_fields === true){
	        $('html, body').animate({ scrollTop: 0 }, 400);
	        $('form').find('#response').empty().prepend(alert_required).fadeIn();
	      } else {
	    	$(this).attr('disabled','disabled');
	    	var jobNum = $('#job_no').val();
	        $.ajax({
	          type: 'POST',
	          url: '../'+jobNum+'/update',
	          data: $('#job-cost-form').serialize().replace(/%5B%5D/g, '[]'),
	          success: function(response){
	            window.location.href = $('#returnpath').val();
	            localStorage.setItem('response', response);
	            $(this).removeAttr('disabled');
	          },
	          error: function(response){
	        	$(this).removeAttr('disabled');
	            $('html, body').animate({ scrollTop: 0 }, 400);
	            $('form').find('#response').empty().prepend(alert_error).fadeIn();
	          }
	        });
	      }
	});
});//End of document ready

// On change currency
$(document).on('change', '#demurrage_currency', function(){
	//fillCustomerByCurrency();
});

/**
* function for fill recharge currency
*/
function fillCustomerByCurrency(){
	var currency = $('#demurrage_currency').val();
	if(currency != ""){
		$.ajax({
		    type: 'POST',
		    url: appHome+'/job/common_ajax',
		    data: {
		      'currency'	: currency,
		      'action_type' : 'get_customers_by_currency'
		    },
		    success: function(response){
		    	$('#demtk_customer').html(response).chosen().trigger("chosen:updated");;
		    }
		});
	}
}

// On change demtk customer
$(document).on('change', '#demtk_customer', function(){
	fillCurrencyByCustomer();
});

/**
* function for fill recharge currency
*/
function fillCurrencyByCustomer(){
	var customer = $('#demtk_customer').val();
	var currency = $('#hdn_currency').val();
	if(customer != ""){
		$.ajax({
		    type: 'POST',
		    url: appHome+'/job/common_ajax',
		    data: {
		      'customer'	: customer,
		      'currency'	: currency,
		      'action_type' : 'get_currency_by_customer'
		    },
		    success: function(response){
		    	$('#demurrage_currency').html(response).chosen().trigger("chosen:updated");
		    }
		});
	}
}
