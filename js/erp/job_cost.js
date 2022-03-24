
$(document).ready(function(){
	
	$('.view_log_detail').css( 'cursor', 'pointer' );
	$('.view_log_detail').click(function(){
	    $($(this)).find('i').toggleClass('fa-minus-circle fa-plus-circle');    
	    $(this).closest('tr').next().toggle();
	});
	
	$('#response').empty().prepend(localStorage.getItem('response')).fadeIn();
	localStorage.clear();
	
	if($("#country-list").val() !== undefined) {
		$(".country-selector").html($("#country-list").html());
		
	}
	var addressoptions = $("#hidden_select_code > option").clone();
	$('.address-selector').append(addressoptions);  
	var activityoptions = $("#hidden_activity_code > option").clone();
	$('.activity-selector').append(activityoptions);
	var hidden_supplier = $("#hidden_supplier > option").clone();
	$('.supplier-selector').append(hidden_supplier);

	var actual_currency = $('#currency').val();
	var year_week = $('#jobcost_year_week').val();
	if(year_week != ''){
		getExchangeRates(actual_currency, year_week);
	}

	if($('#activity').val() == 'REPO'){
		$('.supplier-block').hide();
	}

$('#transport_mode').change(function(){

	  // drop down operations common	
	 $('#overspend_jobcost').html('0.00');
	  $('#common-address').hide();
	  $('.activity-selector,.address-selector,.supplier-selector').val(''); 
	  $('select[name=start_city]').val('');
	  $('select[name=start-country]').val('');
	  $('select[name=destination_city]').val('');
	  $('select[name=destination-country]').val('');
	  $('.chosen').chosen().trigger("chosen:updated");
	   
	  $('.highlight').removeClass('highlight');
	  $('#supprate_additional_cost').val('');
	  $('#extracost-supp-rate,#responseCreate').html('');
	  $('.modal-form').hide();
	  $('#modal-supplier-costs-table').empty();

	  var transport_mode_id = $(this).find('option:selected').val(),
	      transport_mode_value = $(this).find('option:selected').text().toLowerCase();
	 
	  
	  transport_mode_value = transport_mode_value.replace('short sea shipping', 'shipping');
	  transport_mode_value = transport_mode_value.replace('deep sea shipping', 'ds-shipping');
	  transport_mode_value = transport_mode_value.replace('additional cost', 'additionalcost');
	  transport_mode_value = transport_mode_value.replace('additional activity', 'additionalactivity');
	  transport_mode_value = transport_mode_value.replace('extra cost', 'extracost');
	  if(transport_mode_id !== '') {
	    var $selected = $('.'+transport_mode_value+'-modal');
	    $selected.find('input[name="transport_mode_id"]').val(transport_mode_id);
	    $selected.show().find('.chosen').chosen('destroy').chosen(chosen_options);    
	  }
	  
	  if(transport_mode_id === '6') {
	    $.ajax({
	      type: 'POST',
	      url: appHome+'/job-cost/search',
	      data: [{
	        name: "product_id",
	        value: $('#product').val(),
	      },
	      {
	        name: "transport_mode_id",
	        value: transport_mode_id
	      },
	      {
	          name: "render_type",
	          value: 'job_template'
	        }], 
	      success: function(response) {
	        $('#modal-supplier-costs-table').empty().append(response).show();
	        $('.transmode-table')
	          .tablesorter({
	            widthFixed: true,
	            widgets: ['zebra', 'filter'],
	            widgetOptions: {
	              filter_reset: '.reset'
	            }
	          })
	          .tablesorterPager({
	            container: $('.custom-pagination'),
	            output: 'Records {startRow} to {endRow} (Total {totalRows} Results) - Page {page} of {totalPages}',
	            removeRows: false,
	            size: 25
	          });
	        
	        	//if the table exist show the drop downs div
	        	if($('.transmode-table').length > 0){
	        		$('#common-address').show();
	        	}
	      }
	    });

	  }
	  var currency_id = $('#additional_cost_currency').val();
	  $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
	  currency_name = $currency.attr('data-label');

	  if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
		 $('.modal_currency i').removeClass().html("").addClass('fa currency-fa fa-' + currency_name.toLowerCase());
	  }
	  else {
		  $('.modal_currency i').removeClass().addClass('fa currency-fa').html(currency_name.toUpperCase());
	 }

	});

/**
* route search/filtering
*/
$('.get_routes').on('change', 'select', function(e){
	getRoute(this);
});

if(($('#transport_mode').val() != '') && ($('#page_type').val() == 'change_supplier_route') ){
	$('#transport_mode').change();
	if($('#dd_datas').val() != ''){
		var obj = JSON.parse($('#dd_datas').val());
		$('select[name=start_city]').val(obj.start_town_id);
		$('select[name=start-country]').val(obj.pl_from_country);
		
		$('select[name=mid_city]').val(obj.mid_town_id);
		$('select[name=mid-country]').val(obj.pl_mid_country);
		
		$('select[name=destination_city]').val(obj.end_town_id);
		$('select[name=destination-country]').val(obj.pl_to_country);
		$('#terms-search').val(obj.qe_imco_terms);
		
		var tmode = $('#transport_mode').val();
		if(tmode == 1){ //Haulage
			var classModel = 'haulage-modal';
		}else if(tmode == 2){ //Rail
			var classModel = 'rail-modal';
		}else if(tmode == 3){ //Short Sea Shipping
			var classModel = 'shipping-modal';
		}else if(tmode == 4){ //Barge
			var classModel = 'barge-modal';
		}else if(tmode == 5){ //Shunt
			var classModel = 'shunt-modal';
		}else if(tmode == 6){ //cleaning
			var classModel = 'cleaning-modal';
		}else if(tmode == 7){ //Deep Sea Shipping
			var classModel = 'ds-shipping-modal';
		}
		
		var autoselectbox = $('.'+classModel+' #start_city');
		if($.isNumeric(tmode)){
			getRoute(autoselectbox);
			$('.activity-selector').val(obj.activity);
			$('.from-address').val(obj.from_address_code);
			$('.to-address').val(obj.to_address_code);
		}else if(tmode == 'ACOST' || tmode == 'AACTIVITY'){
			$('.activity-selector').val(obj.activity);
			$('.supplier-selector').val(obj.supplier);
			$('.from-address').val(obj.from_address_code);
			$('.to-address').val(obj.to_address_code);
			$('#additional_cost_currency').val(obj.qe_curr);
			if(obj.hasOwnProperty('qe_curr')){
				switch_specific_currency_icons(obj.qe_curr,'currency-fa');
			}
			
		}else if(tmode == 'EXTRACOST'){
			$('.activity-selector').val(obj.activity);
			$('.supplier-selector').val(obj.supplier);
			$('.from-address').val(obj.from_address_code);
			$('.to-address').val(obj.to_address_code);
			var extraSupp = $('#extracost_supplier').val().trim();
			if(extraSupp != ''){
				get_extra_cost(extraSupp);
			}
		}
		
		$('.chosen').chosen().trigger("chosen:updated");
	}

}

//Autocomplete function to fetch the tank numbers
if($("#po_rec_number").length > 0){
	 $("#po_rec_number").autocomplete({
	      source:  appHome+'/purchase_order/get_po_no_list',
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
        	 	 BootstrapDialog.show({title: 'Error', message : 'Not a valid PO. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
        	 	 });
        	 	 $('#po_rec_number').val('');
	         }
		  }
	  });
}

$('#other_activity').attr('disabled','disabled');
$('.multi_other_checkbox').attr('disabled','disabled');

});
/*multiple recharge*/

$(document).on('click', '#cancel-multi-recharge', function(e){
	e.preventDefault();
	window.location.href = $('#returnpath').val();
});
$(document).on('click', '.add-job-cost-modal', function(){
	$('#add-job-cost-recharge').html("");
	$.ajax({
		type: 'POST',
		url: appHome+'/job-cost/common_ajax',
		beforeSend: function() {
            // setting a timeouttank-plan-edit-modal-detail
        	$('#add-job-cost-recharge').html("<div class='text-center'><i class='fa fa-spinner fa-spin' style='font-size:100px'></i></div>");
        	},
	    data: {
	    	    'job_no' : $('#job_no_recharge').val(),
				'action_type' : 'add-job-cost-recharge',
			  },
		success: function(response){
			$('#add-job-cost-recharge').html(response);
			$('.datepicker').datepicker({
			    dateFormat: "dd/mm/yy",
			    changeMonth: true,
			    changeYear: true,
			    inline: true,
			    startDate: 0
			});
			$('.chosen').chosen().trigger("chosen:updated");
			$('.chosen-container').css({width:'100%'});
			
		}
	});
	
});
$(document).on('click', '.add-po-cost-modal', function(e){
	e.preventDefault();alert('ddd');
	$('#add-job-cost-recharge').html("");
	$.ajax({
		type: 'POST',
		url: appHome+'/purchase_order/common_ajax',
		beforeSend: function() {
            // setting a timeouttank-plan-edit-modal-detail
        	$('#add-po-cost-recharge').html("<div class='text-center'><i class='fa fa-spinner fa-spin' style='font-size:100px'></i></div>");
        	},
	    data: {
	    	    'job_no' : $('#po_no_recharge').val(),
				'action_type' : 'add-po-cost-recharge',
			  },
		success: function(response){
			$('#add-po-cost-recharge').html(response);
			$('.datepicker').datepicker({
			    dateFormat: "dd/mm/yy",
			    changeMonth: true,
			    changeYear: true,
			    inline: true,
			    startDate: 0
			});
			$('.chosen').chosen().trigger("chosen:updated");
			$('.chosen-container').css({width:'100%'});
			
		}
	});
	
});

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
$(document).on('click', '.save-multiple-recharge-btn', function(e) {
	e.preventDefault();
	 success = [];
	 data = [];
	 cost_ids = [];
	var current_id = $('#current_id').val();
	var data = current_id.split(',');
	$.each( data, function( key, value ) {
    	if($('#recharge_amount_'+value).val() != 0){
    		highlight($('#reason_code_for_acc_manager_'+value), '');
			if(!$('#multi_no_recharge_'+value).is(':checked')){
    			highlight($('#recharge_to_another_customer_'+value), '');
			}
    	}
	});
	$('.multi_no_checkbox:checked').each(function() {
		cost_ids.push($(this).attr('data-costid'));
	});
	$.each(cost_ids, function( key, value ) {
    	highlight($('#reason_code_for_acc_manager_'+value), '');
	});
	
	var check_fields = (success.indexOf(false) > -1);
    if(check_fields === false){
    	var form = '#'+$(this).closest('form').attr('id');
		$('.save-multiple-recharge-btn').attr('disabled', true);

     $.ajax({
						type: 'POST',
						url: appHome+'/job-cost/apply-multi-recharge',
						data: $(form).serialize().replace(/%5B%5D/g, '[]'),
						success: function(responseString){
						window.location.href = $('#returnpath').val();
                        localStorage.setItem('response', responseString);
							// location.reload();
							// localStorage.setItem('response', responseString);	
						},
						error: function(response){
							$('.save-multiple-recharge-btn').attr('disabled', false);
						}
			    });

    }
	
	
}); 
$(document).on('change', '.multi_currency', function(){
	  	var currency_id = $(this).chosen().val();
	  	var id = $(this).attr('data-id');
	  	switch_specific_currency_icons(currency_id,'estimated-currency-'+id);
		//fillCustomerByCurrency(id);
		getAllCustomersByCurrency(id);
	  	var actual_currency = $(this).val();
		var year_week = $('#jobcost_year_week').val();
		getExchangeRates(actual_currency, year_week);
  }); 

$(document).on('change', '#currency', function(){
	  	var currency_id = $(this).chosen().val();
	  	switch_specific_currency_icons(currency_id,'estimated-currency');
	  	var inputRadioval = $('input[name=optradio]:checked').val();
	  	if(inputRadioval == 'recharge' || inputRadioval == 'link_to_po_summary_inv'){
		  	//fillCustomerByCurrency();
		  	getAllCustomersByCurrency();
	  	}
	  	var actual_currency = $(this).val();
		var year_week = $('#jobcost_year_week').val();
		getExchangeRates(actual_currency, year_week);
  });
  $('#recharge_to_another_customer').on('change', function() {
	  var customer_code = $(this).chosen().val();
	  if($(this).val() == ''){
		 $("#billing_office").val('');
	  }else{
         	fillBillingOfficeForCustomer(customer_code);
	  }
  });
  $('#awaiting_currency').on('change', function() {
	  var currency_id = $(this).chosen().val();
	  switch_specific_currency_icons(currency_id,'awaiting-currency');
  });
  $('#actual_currency').on('change', function() {
	  var currency_id = $(this).chosen().val();
	  switch_specific_currency_icons(currency_id,'actual-currency-change');
	  matchSupplierCurr();
  });
  
  $('#additional_cost_currency').on('change', function() {
	  var currency_id = $(this).chosen().val();
	  switch_specific_currency_icons(currency_id,'currency-fa');
	  calculateDifference(0);
  });
  
  $(document).on('change', '#extracost_supplier', function(e){
		var supp_id = $(this).val();
		get_extra_cost(supp_id);
  });
  
  $(document).on('keyup', '#supprate_additional_cost', function(e){
	  calculateDifference(0);
});
  $(document).on('click', '.supplierextracostCheckbox', function(e){
	  calculateDifference($(this));
});
  

  function calculateDifference(selectedAmount){
	  
  	var selectedJobCostElement = $('input[name=selected_job_cost]:checked');
  	var selectedJobCost = selectedJobCostElement.attr('data-jobcost-amount');
  	var selectedJobcostCurr = selectedJobCostElement.attr('data-jobcost-currency');
  	
	var transportMode = $('#transport_mode').val();
	if(transportMode == 'ACOST'){
		var selectedAmountValue = parseFloat($('#supprate_additional_cost').val());
		var selectedCurrency = $('#additional_cost_currency').val();
	}else if(transportMode =='EXTRACOST'){
		var selectedAmountValue = parseFloat(selectedAmount.attr('data-currency'));
		var selectedCurrency = selectedAmount.attr('data-curr-id');
	}else{
		var selectedAmountValue = parseFloat(selectedAmount.attr('data-final-rate'));
		var selectedCurrency = selectedAmount.attr('data-rate-currency');
	}
  	
  	if(selectedJobcostCurr != selectedCurrency){
  		var exchangeRate = parseFloat($(".exchange-rate[data-from='" + selectedCurrency + "'][data-to='" + selectedJobcostCurr + "']").attr('data-rate'));
  		var ConvertedAmount = exchangeRate * selectedAmountValue;
  	}else{
  		var ConvertedAmount = selectedAmountValue;
  	}
  	ConvertedAmount = ConvertedAmount.toFixed(2)
  	var difference = ConvertedAmount - selectedJobCost;
  	
  	if(isNaN(difference)){
  		difference = 0;
  	}
  	if(difference >= 0){
  		var spanDiff = '<span style="color:red">'+difference.toFixed(2)+'</span>'
  	}else{
  		var spanDiff = '<span style="color:green">'+difference.toFixed(2)+'</span>'
  	}
  	$('#overspend_jobcost').html(spanDiff);
  }
  
  function get_extra_cost(supp_id){
		$('#responseCreate').html('');
		if(supp_id != ''){
			$.ajax({
		        type: 'POST',
		        url: appHome+'/job-cost/common_ajax',
		        data: {
		      	  'supp_id' : supp_id,
		      	  'action_type' : 'get_supp_extra_cost',
		      	  'currency' : $('#currency').val()
		        },
		        beforeSend: function() {
		            // setting a timeout
		        	$('#extracost-supp-rate').html("<div class='text-center'><img src="+$('#loaderpath').val()+"></div>");
		        },
		        success: function(response){
		        	$('#extracost-supp-rate').html(response);
		            var supplier_costs = $('#supplier-costs');
		      	// check to see if the cost has already been added to the quote
		      	  supplier_costs.find('input[name="supplier_cost_ids[]"]').each(function(){/*
		      		var costType = $(this).attr('data-cost-type');
		      		
		      	    if(($('#extracostcheckbox-'+$(this).val()).val() == $(this).val() && costType == 'EXTRACOST')){
		      	    	$('#extracostcheckbox-'+$(this).val()).attr('checked',true);
		      	    	$('#extracostcheckbox-'+$(this).val()).attr("disabled", true);;
		      	    }
		      	  */});
		        	
		        	
		        	
		        	$('.chosen').chosen().trigger("chosen:updated");
		        	$('.loader').html("");
		        },
		        error: function(response){
		          $('html, body').animate({ scrollTop: 0 }, 400);
		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
		  });
		}else{
			$('#extracost-supp-rate').html('');
		}
  }
  /**
   * function for getting route 
   * @param currentVariable
   */
  function getRoute(currentVariable){
	  $('#overspend_jobcost').html('0.00');
	var $form = $(currentVariable).parents('form.get_routes'),
	      $table_wrapper = $('#modal-supplier-costs-table'),
	      form_data = $form.serializeArray();
	  var transport_mode_id = $('#transport_mode').find('option:selected').val();
	  if(transport_mode_id !== '6') {
		  form_data.push({
		    name: "hazardous_product",
		    value: $('#is_hazardous_product').val()
		  });
		
		  form_data.push({
		    name: "tank_type",
		    value: $('#tank_type').val()
		  });
	  }

	  if($('#supplier_dd_chosen:visible').length != 0){
		  form_data.push({
			    name: "supp_code",
			    value: $('#supplier_dd').val()
			  });
	  }
	  form_data.push({
	    name: "product_id",
	    value: $('#product').val()
	  });
	  
	  $(".quote-transportmode-ajax").show();

	  $.ajax({
	    type: 'POST',
	    url: appHome+'/job-cost/search',
	    data: form_data,
	    success: function(response){
	      $table_wrapper.empty().append(response).show();
	      $('.transmode-table')
	        .tablesorter({
	          widthFixed: true,
	          widgets: ['zebra', 'filter'],
	          widgetOptions: {
	            filter_reset: '.reset'
	          }
	        })
	        .tablesorterPager({
	          container: $('.custom-pagination'),
	          output: 'Records {startRow} to {endRow} (Total {totalRows} Results) - Page {page} of {totalPages}',
	          removeRows: false,
	          size: 25
	        });
	      $('.table').find("[data-toggle=tooltip]").tooltip({ placement: 'bottom'});
	      $(".quote-transportmode-ajax").hide();
	      if($('.transmode-table').length > 0){
	    	  $('#common-address').show();
	      }else{
	    	  $('#common-address').hide();
	      }
	    },
	    error: function(response){
	      $table_wrapper.append(alert_error).fadeIn();
	      $(".quote-transportmode-ajax").hide();
	    }
	  });
	  changeDefaultAddressCodes();
  }


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
  
  /**
   * function for fill recharge currency
   */
  function fillCustomerByCurrency(recharge = ''){
	  var currency = (recharge != '') ? $('#multi_currency_'+recharge).val() : $('#currency').val();
	  if(currency != ""){
	  $.ajax({
	        type: 'POST',
	        url: appHome+'/job-cost/common_ajax',
	        data: {
	          'currency'	: currency,
	          'action_type' : 'get_customers_by_currency'
	        },
		    beforeSend: function() {
		    	$('<i class="fa fa-spinner fa-spin"></i>').insertAfter($('#recharge_to_another_customer').parent());
		     },
	        success: function(response){
	        	if(recharge != '') {
                  $('#recharge_to_another_customer_'+recharge).html(response).chosen().trigger("chosen:updated");
	        	}else{
	        		$('#recharge_to_another_customer').html(response).chosen().trigger("chosen:updated");
	        		$("#billing_office").val('');
			}
	        	
	        	$('.fa-spinner').remove();
	        }
	      });
	  }
  }
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
  
  function matchSupplierCurr(){
	  if(($('#supplier-currency').val() != "") && ($('#actual_currency').val() != "") && ($('#supplier-currency').val() != $('#actual_currency').val())){
		  $('.supplier-paste-curr').html('<strong>WARNING!</strong> Invoice currency different to Supplier currency');
	  }else{
		  $('.supplier-paste-curr').html('');
	  }
  }
  
  $('#paste_supplier_invoice').on('click', function(e) {
	  	e.preventDefault();
	   
	    var supplier_inv_id = $(this).data('supplier-inv-id'); 
	    var supplier_inv_no = $(this).data('supplier-inv-no'); 
	    //var supplier_inv_amount = $(this).data('supplier-inv-amount'); 
	    var supplier_inv_date = $(this).data('supplier-inv-date');
	    var supplier_inv_bookingdate = $(this).data('supplier-inv-bookingdate');
	    var supplier_inv_currency = $(this).data('supplier-inv-currency');
	    var supp_cur_name	= $(this).data('supplier-currname');
	    var supplier_inv_supplier = $(this).data('supplier-inv-supplier');
	    var supplier_inv_actamt = $(this).data('supplier-inv-amt');
	    var supplier_inv_code = $(this).data('supplier-inv-code');
	    var jc_comment	= $(this).data('jc-comment');
	    var is_parent = $(this).data('is-parent');
	    var prev_jc_id = $(this).data('prev-jc-id');
	    var total_amount = $(this).data('total-amount');
	    $('#invoice_no_ref').val(supplier_inv_id);
	    $('#invoice_no').val(supplier_inv_no);
	    //$('#styjc_act_amount').val(supplier_inv_amount);
	    $('#booking_date').val(supplier_inv_bookingdate);
	    $('#invoice_date').val(supplier_inv_date);
	    $('#actual_currency').val(supplier_inv_currency);
	    $('#supplier-currency').val(supp_cur_name.toUpperCase());
	    $('#supplier').val(supplier_inv_supplier);
	    $('#is_parent').val(is_parent);
	    $('#prev_jc_id').val(prev_jc_id);
	    $('#total_amount').val(total_amount);
	    if(jc_comment != ""){
	    	$('#job_cost_comments').val(jc_comment);
	    }
	    if(supplier_inv_code == 1) {
	    	$('#actual_amount').prop('readonly', true);
	    	$('#actual_amount').val(supplier_inv_actamt);
	    }
	    else{
	    	$('#actual_amount').val('0.00');
	    }
	    switch_specific_currency_icons(supplier_inv_currency,'actual-currency-change');
	    $('.chosen').chosen().trigger("chosen:updated");
	    matchSupplierCurr();
	    //$('html, body').animate({ scrollTop: 0 }, 400);
	    // actual currency changes
	    var mode = $('#mode').val();
	    if(mode == 'add'){
	    	$('#currency').val(supplier_inv_currency);
	    	$('.chosen').chosen().trigger("chosen:updated");
	    	switch_specific_currency_icons(supplier_inv_currency, 'actual-currency-change');
			switch_specific_currency_icons(supplier_inv_currency, 'estimated-currency');
	    }
	  });
  
  /**
   * cancel job 
   */
  $('.cancel-job-cost').click(function(e){
	  e.preventDefault();
	  var plan_id = $('#plan_id').val();
	  if(plan_id == ''){
		  BootstrapDialog.show({
			   type: BootstrapDialog.TYPE_DANGER,
	           title: 'Warning',
	           message: 'Are you sure you want to cancel creating new record?',
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
				        	          url: appHome+'/job-cost/common_ajax',
				        	          beforeSend: function() {
					     		        	$('.bootstrap-dialog-footer-buttons > .btn-danger').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
						     		        $('.bootstrap-dialog-footer-buttons > .btn-danger').attr('disabled','disabled');
					     		        },
				        	          data: {
				        	        	  	'attachable_id' : $('#attachable_id').val(),
				        	        	  	'action_type' : 'delete_attachents'
				        	        	  	},
				        	          success: function(response){
				        	        	window.location.replace($('#returnpath').val());
				        	            //localStorage.setItem('response', response);
				        	          }
				        	        });
				          	
				           }
				   }]
	       });
	  }else{
		  window.location.replace($('#returnpath').val());
	  }
	  
  });
  
  /**
  * save / update
  */
   $(document).on('click', '.save-job-cost,.update-job-cost', function(e){
  //$('.save-job-cost,.update-job-cost').click(function(e){
    $('.highlight').removeClass('highlight');
    e.preventDefault();
    var form = '#'+$(this).closest('form').attr('id'),
        success = [],
        plan_id = $('input[name="plan_id"]').val(),
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
    
    //check whether it is string or not
    function notNumber(field){
  	  if(field.val() != ''){
  		  var t =  !isNaN(parseFloat(field.val())) && isFinite(field.val());
  		  if(t){
  			  $(field).parent().removeClass('highlight');
  		        success.push(true);
  		  }else{
  			  $(field).parent().addClass('highlight');
  		        success.push(false);
  		  }
  	  }
    }
    
    highlight($('#job_no'), '');
    highlight($('#activity'), '');
    //highlight($('#element_code'), '');
    if($('#activity').val() != 'REPO'){
    	highlight($('#supplier'), '');
    }
    highlight($('#currency'), '');
    highlight($('#actual_currency'), '');
    notNumber($('#invoice_no_ref'), '');
    //notNumber($('#element_code'), '');

    var check_fields = (success.indexOf(false) > -1);
    var estimated_currency = $('#currency').val().trim();
    var actual_currency = $('#actual_currency').val().trim();
    actual_currency_key = actual_currency.toLowerCase();
    var estimated_amount = $('#estimated_amt').val().trim();
    var actual_amount = $('#actual_amount').val().trim();
    var recharge_amount = $('#recharge_amount').val();
    var recharge_currency = $('#recharge_currency').val();
    var recharge_type = $('#recharge_type').val();
    var exchange_json = ($('#exchange_rate_json').val() != '') ? JSON.parse($('#exchange_rate_json').val()) : '';
    var wait_currency = $('#wait_currency').val();
    var wait_amount = $('#wait_amount').val();
    var default_currency = $('#default_currency').val();
    var wait_date = $('#wait_date').val();
    var recharge_date = $('#recharge_date').val();
    var reason_code_for_overspend = $('#reason_code_for_overspend').val();

    var overspend = 0;
    var job_actual_amt = 0;
    var job_recharge_amt = 0;
    if(actual_amount != 0){
		if(actual_currency != estimated_currency){
		  	job_actual_amt = actual_amount * (1/(exchange_json[actual_currency_key]));
		}
		else{
		  job_actual_amt = actual_amount;
		}
	}

	if(recharge_type == "A"){
		wait_currency = wait_currency != undefined &&  wait_currency != null ?  wait_currency : default_currency;
		wait_currency_key = wait_currency.toLowerCase();
	    if(estimated_currency != wait_currency){
	    	job_recharge_amt = wait_amount * (1/exchange_json[wait_currency_key]);
	    	
	  	}
	    else{
	    	job_recharge_amt = wait_amount;
	  	}
	}else{
		if(recharge_amount != 0){
			
	  		recharge_currency = recharge_currency ? recharge_currency : default_currency;
	  		recharge_currency = recharge_currency.toLowerCase();
	  		if(recharge_currency != estimated_currency){
		    		job_recharge_amt = recharge_amount *(1/exchange_json[recharge_currency]);
		  	}
		    else{
		    	job_recharge_amt = recharge_amount;
		    }
		}
		else{
			job_recharge_amt = 0;
		}             
	}
	overspend = (job_actual_amt - job_recharge_amt) - estimated_amount;
    /**
    * update edit-vgm-route
    */
    if($(this).hasClass('update-job-cost')){

      if(check_fields === true){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_required).fadeIn();
      } 
      else if(overspend > 0 && reason_code_for_overspend == ''){
      	highlight($('#reason_code_for_overspend'), '');
    	$('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_required).fadeIn();
      }
      else {
    	$(this).attr('disabled','disabled');  
        $.ajax({
          type: 'POST',
          url: '../'+plan_id+'/update',
          data: $(form).serialize().replace(/%5B%5D/g, '[]'),
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
    }
    
    /**
     * create-vgm-route
     */
     if($(this).hasClass('save-job-cost')){
        if(check_fields === true){
        	$('html, body').animate({ scrollTop: 0 }, 400);
        	$('form').find('#response').empty().prepend(alert_required).fadeIn();
        } 
        else if(overspend > 0 && reason_code_for_overspend == ''){
      		highlight($('#reason_code_for_overspend'), '');
    		$('html, body').animate({ scrollTop: 0 }, 400);
        	$('form').find('#response').empty().prepend(alert_required).fadeIn();
        }
        else {
			$(this).attr('disabled','disabled');  
			$.ajax({
				type: 'POST',
				url: appHome+'/job-cost/add',
				data: $(form).serialize().replace(/%5B%5D/g, '[]'),
				success: function(response){
					if($('#render-type').val() == 'ajax'){
						$('#add_job_cost_modal').modal('toggle');
						var table = $('.multiple-recharge-table');
						table.children('tbody').append(response);
						$('.chosen').chosen().trigger("chosen:updated");
					}else{
						window.location.href = $('#returnpath').val();
				 		localStorage.setItem('response', response);
					}
				$(this).removeAttr('disabled');
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
  $(document).on('click', '.radio-transport-mode-route', function(e) {
		
		var transport_mode = $('#transport_mode').val();
		// auto select activity start-----------------------
		if(transport_mode == 2 && $('#tank_state_2').val() == 'loaded'){
			activitySave = 'RAILL';
		}else if(transport_mode == 2 && $('#tank_state_2').val() == 'empty'){
			activitySave = 'RAILE';
		}else if(transport_mode == 7){ 
			activitySave = 'SHIP';
		}else if(transport_mode == 3 && $('#tank_state_3').val() == 'empty'){
			activitySave = 'SETY';
		}else if(transport_mode == 6){
			activitySave = 'CLEAN';
		}else{
			activitySave = '';
		}
		//$('#common-ativity').val(activitySave);	
		//auto select activity end-----------------------
		
		var value = $(this).val();
		calculateDifference($(this));
		if(transport_mode == 2 || transport_mode == 3){
		$.ajax({
	        type: 'POST',
	        url: appHome+'/job-cost/common_ajax',
	        data: {
	          'value'	: value,
	          'action_type' : 'get_common_add_act'
	        },
		    beforeSend: function() {
		            // setting a timeout
		    	$('#add-supplier-cost').attr('disabled',true);
		    	 $('#add-supplier-cost').html('<i class="fa fa-refresh fa-spin"></i> Add Transport Mode');
		     },
	        success: function(response){
	        	var obj = $.parseJSON(response);
	        	$('#add-supplier-cost').attr('disabled',false);
	        	$('#common-from-address').val(obj.fromAddress);
	        	$('#common-to-address').val(obj.toAddress);	        	
	        	$('.chosen').chosen().trigger("chosen:updated");
	        	$('#add-supplier-cost').html('<span class="fa fa-plus"></span> Add Transport Mode');
	        	
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	      });
		}else{
			changeDefaultAddressCodes();
		}
		
	});
  
  function changeDefaultAddressCodes(){
	  var ddefaultjson = $('#dd_datas').val();
	  if(ddefaultjson != ""){
		  var obj = JSON.parse(ddefaultjson);
			$('.activity-selector').val(obj.activity);
			$('.from-address').val(obj.from_address_code);
			$('.to-address').val(obj.to_address_code)
	  }
	  $('.chosen').chosen().trigger("chosen:updated");
  }
  

  /**
   * When a new cost is added to a quote...
   */
  $(document).on('click', '#add-supplier-cost', function(e) {
  	var prevetSubmit = 0;
  	var job_cost_id_from_job = '';
    var success = [];
    
    /*function functionSendMail(supp_cost_id){
  		$.ajax({
  	        type: 'POST',
  	        url: appHome+'/jobtemplate-quotes/common_ajax',
  	        data: {
  	      	  'supp_cost_id' : supp_cost_id,
  	      	  'action_type' : 'Send_mail_to_supp',
  	        },
  	        beforeSend: function() {
  	        	$('.bootstrap-dialog-footer-buttons > .btn-primary').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> OK");
  	        	$('.bootstrap-dialog-footer-buttons > .btn-primary').attr('disabled','disabled');
  	        },
  	        success: function(response){
  	        	var parsed_data = JSON.parse(response);
  	        	if(parsed_data.status == 'success'){
  	        		BootstrapDialog.show({
  							                type: BootstrapDialog.TYPE_SUCCESS,
  							                title: 'Email Notification',
  							                size: BootstrapDialog.SIZE_SMALL,
  							                message: parsed_data.feedback,
  							                buttons: [{
  									                    label: 'Close',
  									                    action: function(dialogItself){
  									                        dialogItself.close();
  									                    }
  									                 }]
  							            }); 
  	        	}
  	        	$('.bootstrap-dialog-footer-buttons > .btn-primary').html("OK");
  	        	$('.bootstrap-dialog-footer-buttons > .btn-primary').removeAttr('disabled');
  	        },
  	        error: function(response){
  	        	$('html, body').animate({ scrollTop: 0 }, 400);
  	        	$('form').find('#response').empty().prepend(alert_error).fadeIn();
  	        }
  	  });
    }*/
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
    e.preventDefault();
    var transport_mode = $('#transport_mode').val();
    job_cost_id_from_job = $('input[name=selected_job_cost]:checked').val()

    if(transport_mode == 'ACOST'){
  	  var success = [];
  	//validation start----
  		  highlight($('#activity'), ''); 
  		  highlight($('#acost-from-address'), '');
  		  highlight($('#acost-to-address'), '');
  		  highlight($('#supprate_additional_cost'), ''); 
  		  highlight($('#additional_cost_currency'), '');
  		  var check_fields = (success.indexOf(false) > -1);
  		  if(check_fields == true){
  				$('#responseCreate').empty().prepend(alert_required).fadeIn();
  				return false;
  		 }
  	//validation end----
  	  
  	  var json = JSON.stringify({
  		 transport_mode: transport_mode,
  		  plan_id : $('#plan_id').val(),
  		  activity : $('#activity').val(),
  		  supplier : $("#acost_supplier").val(),
  		  finalCost : $('#supprate_additional_cost').val(),
  		  selected_curr : $("#additional_cost_currency").val(),
  		  //selected_curr : $('#currency').val(),
  		  from_address : $('#acost-from-address').val(),
  		  to_address : $('#acost-to-address').val(),
  		  comment : $('#job-cost-comment').val(),
  		  reason_code : $('#job-cost-reason-code').val(),
  		  job_cost_id : job_cost_id_from_job
  	  });
  	  saveToTable(json);
    }else if(transport_mode == 'AACTIVITY'){
  	  var success = [];
  	  //validation start----
  	  
  		  highlight($('#additional_activity_no_cost'), ''); 
  		  highlight($('#aactivity-from-address'), ''); 
  		  highlight($('#aactivity-to-address'), ''); 
  		  var check_fields = (success.indexOf(false) > -1);
  		  if(check_fields == true){
  				$('#responseCreate').empty().prepend(alert_required).fadeIn();
  				return false;
  		 }
  	  //validation end----
  	  var json = JSON.stringify({
  		  transport_mode: transport_mode,
  		  plan_id : $('#plan_id').val(),
  		  supplier : $('#aactivity_supplier').val(),
  		  activity : $('#additional_activity_no_cost').val(),
  		  from_address : $('#aactivity-from-address').val(),
  		  to_address : $('#aactivity-to-address').val(),
  		  selected_curr : '',
		  finalCost : 0,
		  comment : $('#job-cost-comment').val(),
		  reason_code : $('#job-cost-reason-code').val(),
		  job_cost_id : job_cost_id_from_job
  	  });
  	  saveToTable(json);
    }else if(transport_mode == 'EXTRACOST'){
  	  
  	  var checkedData = [];	 
  	  var success = [];  	  
  	  var extraselected = $('.supplierextracostCheckbox:checked');
  	  if(!extraselected.length) {
		    return false;
	  }
  	  var finalCost = extraselected.attr('data-currency');
	  var route_currency = extraselected.attr('data-curr-id');
	  
  	  //validation start----
  	  highlight($('#extracost_activity'), ''); 
  	  highlight($('#extracost_supplier'), '');
  	  highlight($('#extracost-from-address'), '');
  	  highlight($('#extracost-to-address'), '');
  	  var check_fields = (success.indexOf(false) > -1);
  		  
  	  if(check_fields == true){
  			$('#responseCreate').empty().prepend(alert_required).fadeIn();
  			return false;
  	 }
  	// return if no cost has been selected
  		
  	  
  	  //validation end----
  	  var json = JSON.stringify({
  		 transport_mode: transport_mode,
  		  plan_id : $('#plan_id').val(),
  		  activity : $('#extracost_activity').val(),
  		  selected_curr : route_currency,
		  finalCost : finalCost,
  		  supplier : $('#extracost_supplier').val(), 
  		  selected_curr : $('#currency').val(),
  		  from_address : $('#extracost-from-address').val(),
  		  to_address : $('#extracost-to-address').val(),
  		  comment : $('#job-cost-comment').val(),
  		  reason_code : $('#job-cost-reason-code').val(),
  		  job_cost_id : job_cost_id_from_job,
  		  supplier_cost_id: extraselected.val(),
  	  });
  	  saveToTable(json);
  	  
    }else{
  	  var success = [];
  	  var selected = $('input[name="supplier_cost"]:checked'),
        supplier_costs = $('#supplier-costs'),
        supplier_costs_table = supplier_costs.find('.transmode-table-main'),
        error = 0;
  	  // return if no cost has been selected
  	  if(!selected.length) {
  		    return false;
  	  }	 
  	  highlight($('#common-ativity'), ''); 
  	  highlight($('#common-from-address'), '');	
  	  highlight($('#common-to-address'), '');	
  	  var check_fields = (success.indexOf(false) > -1);
  	  
  	  if(check_fields == true){
  			$('#customer_quote_modal').animate({ scrollTop: 0 }, 400);
  			$('#responseCreate').empty().prepend(alert_required).fadeIn();
  			return false;
  	 }
  	  
  	  var finalCost = selected.attr('data-final-rate');
  	  var validCount = selected.attr('data-valid');
  	  var supplier_route = selected.attr('data-supplier-code');
  	  var route_currency = selected.attr('data-rate-currency');
  	  var supplier_cost_id = selected.val();
  	// check to see if the cost has already been added to the quote
  	  supplier_costs.find('input[name="supplier_cost_ids[]"]').each(function(){
  		  var costType = $(this).attr('data-cost-type');
  		  
  	    if((supplier_cost_id === $(this).val() && costType == '')){
  	      error = 1;
  	    }
  	  });
  	 
  	  // check if item is invalid
  	  if(validCount == 'invalid') {
  		  BootstrapDialog.confirm('Invalid Supplier Rate Selected. Do you wish to proceed ?', function(result){
  			  if(result) {
  				  var suppid = selected.parents('tr').find( "td:eq(1)" ).find('[name="supplier_cost_ids[]"]').val();
  				  //functionSendMail(suppid);				  
  				  selected.attr('data-valid','');
  				  $('#add-supplier-cost').trigger('click');
  			  } 
  		  });
  		  return false;
  	  }
  	  
  	  var json = JSON.stringify({
  		  transport_mode: transport_mode,
  		  plan_id : $('#plan_id').val(),
  		  supplier_cost_id: supplier_cost_id,
  		  product_id: $('#product').val(),
  		  hazardous: $('#is_hazardous_product').val(),
  		  transport_mode: transport_mode,
  		  tank_type : $('#tank_type').val(),
  		  tank_state : $('#tank_state_'+transport_mode).val(),
  		  selected_curr : route_currency,
  		  finalCost : finalCost,
  		  from_address : $('#common-from-address').val(),
  		  to_address : $('#common-to-address').val(),
  		  activity : $('#common-ativity').val(),
  		  supplier : supplier_route,
  		  comment : $('#job-cost-comment').val(),
  		  reason_code : $('#job-cost-reason-code').val(),
  		  job_cost_id : job_cost_id_from_job
  	  });
  	  // the cost already exists as a part of this quote, display error and return
  	  saveToTable(json);
    }

    function saveToTable(json){
  	  $.ajax({
  	      type: 'POST',
  	      url: appHome+'/job-cost/save_supp_cost',
  	      async : false,
  	      data: {
  	    	  'json': json
  	      },
  	      success: function(response) {
  	    	 window.location.replace(appHome+'/job/'+$('#job_number').val()+'/detail#plan');
             localStorage.setItem('response', response);
  	    	  
  	      }
  	    });
    }
  //end save to table------------------------------------------

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
				 $('#recharge_invoice_comments,#internal_recharge_comment').val('');
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
         job_cost_id = $('input[name="job_cost_id"]').val();
     
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
	     if($('#job_cost_activity').val() == 'TKDAY'){
	     	highlight($('#daily_rate'), '');
	     	highlight($('#tank_days'), '');
	     }
     }else if(optradio == 'awating_final_action'){
    	 highlight($('#awaiting_amount'), '');
    	 highlight($('#await_daily_rate'), '');
	     highlight($('#await_tank_days'), '');
     }else if(optradio == 'po_recharge'){
    	 highlight($('#po_rec_number'), '');
    	 
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
			applyRecharge(job_cost_id, form);
		} 
	   }
   });

  function applyRecharge(job_cost_id, form){
  	$('.save-recharge-btn').attr('disabled','disabled');
  	$.ajax({
		       type: 'POST',
		       url: appHome+'/job-cost/'+job_cost_id+'/recharge',
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
  
  $('textarea').focus(function(){
	  $('textarea').css('border','1px solid #ccc');
  });
  
  
  $("#paste_supplier_invoice").on("click", function(){
	  $("#isprocessed").val("1");
	}); 

/*
*	Supplier change event
*/  
$(document).on('change', '#supplier', function(){
	var supplier = $('#supplier').val();
	var mode = $('#mode').val();
	if(mode == 'add'){
		getSupplierCurrency(supplier);
	}
});
//slush
$("#activity,#reason_code_for_overspend").on("change", function(){
	var option = $('option:selected', $("#activity")).attr('data-val');
	var activity = $('option:selected', $("#activity")).val();
	var reason = $('#reason_code_for_overspend').val();
	var tank_spot = $('#slush_hidden').val();
	var parent_cost_id = $('#parent_cost_id').val();
	
	if(tank_spot == 1 && option == 1 && parent_cost_id == '') {
	  	$('#act_slush_val').attr("disabled", false);
	    if(reason == 'EMPTY' && (activity == 'DEPST' || activity == 'QYRNT')){
			$('#act_slush_val').prop("checked", true);
	    }else {
	        $('#act_slush_val').prop("checked", false);	
	    }
	    if(reason == 'FULL'){
	    	$('#act_slush_val').prop("checked", false);	
	    	$('#act_slush_val').attr("disabled", true);
	    }
	}else{
	        $('#act_slush_val').attr("disabled", true);
	      	$('#act_slush_val').removeAttr("checked");
	}
	checkDEPST($("#activity"));
});
    
function checkDEPST(currElem){
		var activity = currElem.val();
		if($.inArray(activity, ['DEPST','QYRNT']) !== -1){
			$('#reason_code_for_overspend option:not([value="FULL"]):not([value="EMPTY"])').attr('disabled','disabled');
		}else{
			$('#reason_code_for_overspend option').removeAttr('disabled');
		}
		$('#reason_code_for_overspend').chosen().trigger("chosen:updated");
}
// Get supplier currency
function getSupplierCurrency(supplier){

	$.ajax({
		type: 'POST',
		url: appHome+'/purchase_order/common_ajax',
		data: {
		  'action_type' : 'get_supp_currency',
		  'supp': supplier
		},
		success: function(currency) {
			if(currency){
				currency = currency.toUpperCase();
			}
			else{
				currency = 'EUR';
			}

			$('#currency').val(currency);
			$('#actual_currency').val(currency);
			$('.chosen').chosen().trigger("chosen:updated");
			switch_specific_currency_icons(currency,'actual-currency-change');
			switch_specific_currency_icons(currency,'estimated-currency');
		}
  	});
}

/**
 * Get Exchange rate of currency
*/
function getExchangeRates(actual_currency, year_week){

	$.ajax({
        type: 'POST',
        url: appHome+'/job-cost/common_ajax',
        data: {
          'actual_currency' : actual_currency,
          'year_week': year_week,
          'action_type' : 'get_currency_exchangerate'
        },
        success: function(response){
        	if(response){
        		var obj = JSON.parse(response);
        		$('#exchange_rate_json').val(response);
        	}
        }
    });
}

/**
   * function for get all customers of currency
   */
  function getAllCustomersByCurrency(recharge = ''){
	  var currency = (recharge != '') ? $('#multi_currency_'+recharge).val() : $('#currency').val();
	  if(currency != ""){
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
	        	if(recharge != '') {
                  $('#recharge_to_another_customer_'+recharge).html(response).chosen().trigger("chosen:updated");
	        	}else{
	        		$('#recharge_to_another_customer').html(response).chosen().trigger("chosen:updated");
	        		$("#billing_office").val('');
	        	}
	        	$('.fa-spinner').remove();
	        }
	      });
	  }
  }

 $(document).ready(function() {
    $("#selectAll").change(function() {     
        if($(this).is(":checked")) {
           $(".multi_checkbox").prop('checked', true);
        }
        else {
            $(".multi_checkbox").prop('checked', false);
        }
    });   
    $(document).on('change', '.multi_checkbox', function(e){
        if(!$(this).is(":checked")){
         	$("#selectAll").prop('checked', false);
        }
        if($(".multi_checkbox:checked").length == $(".multi_checkbox").length) {
            $("#selectAll").prop('checked', true);
        }
        
    });
 });

$(document).on('keyup', '.update-value', function(e){
	updateRechargeAmount();
});

function updateRechargeAmount(){
	var option = $('.recharge_radio:checked').val();
	if(option == 'awating_final_action'){
		var daily_rate = $('#await_daily_rate').val();
		var tank_days = $('#await_tank_days').val();

		if(daily_rate != '' && tank_days != '' && daily_rate != '-' && tank_days != '-'){
			var recharge_amount = daily_rate*tank_days;
			$('#awaiting_amount').val(recharge_amount.toFixed(2));
		}
		else{
			$('#awaiting_amount').val(0.00);
		}
	}
	else{
		var daily_rate = $('#daily_rate').val();
		var tank_days = $('#tank_days').val();
		if(daily_rate != '' && tank_days != '' && daily_rate != '-' && tank_days != '-'){
			var recharge_amount = daily_rate*tank_days;
			$('#recharge_amount').val(recharge_amount.toFixed(2));
		}
		else{
			$('#recharge_amount').val(0.00);
		}
	}
}

$(document).on('click', '.recharge_radio', function(e){
	$('#await_daily_rate').val(0.00.toFixed(2));
	$('#await_tank_days').val('');
	$('#daily_rate').val(0.00.toFixed(2));
	$('#tank_days').val('');
	$('#awaiting_amount').val(0.00.toFixed(2));
	$('#recharge_amount').val(0.00.toFixed(2));
});

$(document).on('keyup', '.multi-change', function(e){
	var cost_id = $(this).data('id');
	updateMultiRechargeAmount(cost_id);
});

function updateMultiRechargeAmount(cost_id){
	var daily_rate = $('#recharge_rate_'+cost_id).val();
	var tank_days = $('#recharge_tank_days_'+cost_id).val();
	if(daily_rate != '' && tank_days != '' && daily_rate != '-' && tank_days != '-'){
		var recharge_amount = daily_rate*tank_days;
		$('#recharge_amount_'+cost_id).val(recharge_amount.toFixed(2));
		$('.recharge_amount').trigger('change');
	}
	else{
		$('#recharge_amount_'+cost_id).val(0.00);
	}
}

 /*
*	Supplier change event
*/  
$(document).on('change', '#activity', function(){
	var activity = $('#activity').val();
	
	if(activity == 'REPO'){
		$('.supplier-block').hide();
		sea_type = $('#sea_type').val();
		if(sea_type == 1){
			currency = 'EUR';
		}
		else{
			currency = 'USD';
		}
		$('#currency').val(currency);
		$('#actual_currency').val(currency);
		$('.chosen').chosen().trigger("chosen:updated");
		switch_specific_currency_icons(currency,'actual-currency-change');
		switch_specific_currency_icons(currency,'estimated-currency');
	}
	else{
		$('.supplier-block').show();
	}
});

$(document).on('click', '.lock_cost', function(e){
	e.preventDefault();
	jc_id = $('#plan_id').val();
	if($('#visible_text').text() == 'Lock'){
		$('#visible_text').text('Unlock');
		jc_is_lock = 1;
	}
	else{
		$('#visible_text').text('Lock');
		jc_is_lock = 0;
	}
	lockJobCost(jc_id, jc_is_lock);
})

function lockJobCost(jc_id, jc_is_lock){
	$.ajax({
        type: 'POST',
        url: appHome+'/job-cost/common_ajax',
        data: {
          'jc_id'	: jc_id,
          'jc_is_lock' : jc_is_lock,
          'action_type' : 'lock_job_cost'
        },
	    beforeSend: function() {
	    	$('.lock_cost').find('span').removeClass().addClass("fa fa-spinner fa-spin");
 			$('.lock_cost').attr('disabled','disabled');
	    },
        success: function(response){
        	$('.lock_cost').find('span').removeClass("fa fa-spinner fa-spin");
         	$('.lock_cost').removeAttr('disabled');
        },
        error: function(response){
        	$('.lock_cost').find('span').removeClass("fa fa-spinner fa-spin");
         	$('.lock_cost').removeAttr('disabled');
        }
    });
}
  
$(document).on('change','#no_recharge',function(){
	if($(this).is(":checked")) {
	   $(".multi_no_checkbox").prop('checked', true);
	   $('.multi_no_checkbox').trigger('change');
	}
	else {
		$(".multi_no_checkbox").prop('checked', false);
		$('.multi_no_checkbox').trigger('change');
	}
});   
$(document).on('change', '.multi_no_checkbox', function(e){
	var cost_id = $(this).data('costid');
	if(!$(this).is(":checked")){
		$("#no_recharge").prop('checked', false);
		disableRechargeOptions(cost_id,false);
	}
	else{
		disableRechargeOptions(cost_id,true);
	}
	if($(".multi_no_checkbox:checked").length == $(".multi_no_checkbox").length) {
		$("#no_recharge").prop('checked', true);
	}
	
});

$(document).on('change','#other_activity',function(){
	if($(this).is(":checked")) {
	   $(".multi_other_checkbox").prop('checked', true);
	}
	else {
		$(".multi_other_checkbox").prop('checked', false);
	}
});   
$(document).on('change', '.multi_other_checkbox', function(e){
	if(!$(this).is(":checked")){
		 $("#other_activity").prop('checked', false);
	}
	if($(".multi_other_checkbox:checked").length == $(".multi_other_checkbox").length) {
		$("#other_activity").prop('checked', true);
	}
	
});

function disableRechargeOptions(cost_id,status){
	$status = 0;
	if(status){
		$('#multi_currency_'+cost_id).attr('disabled','disabled');
		$('#recharge_to_another_customer_'+cost_id).attr('disabled','disabled');
		$('#recharge_amount_'+cost_id).attr('disabled','disabled');
		$('#multi_summary_'+cost_id).attr('disabled','disabled');
		$('#selectAll').attr('disabled','disabled');
		$('#recharge_type_'+cost_id).val('no_recharge');
		$('.save-multiple-recharge-btn').attr('disabled',false);
		$('#other_activity').attr('disabled',false);
		$('#multi_is_other_activity_'+cost_id).attr('disabled',false);
		$('#recharge_rate_'+cost_id).attr('disabled','disabled');
		$('#recharge_tank_days_'+cost_id).attr('disabled','disabled');		
		$('.chosen').chosen().trigger("chosen:updated");
	}
	else{
		$('#multi_currency_'+cost_id).attr('disabled',false);
		$('#recharge_to_another_customer_'+cost_id).attr('disabled',false);
		$('#recharge_amount_'+cost_id).attr('disabled',false);
		$('#multi_summary_'+cost_id).attr('disabled',false);
		$('#selectAll').attr('disabled',false);
		$('#recharge_type_'+cost_id).val('recharge');

		$('.recharge_amount').each(function() {
			if($(this).val() != 0){
				status = 1;
			}
		});
		if(status != 0){
			$('.save-multiple-recharge-btn').attr('disabled',false);
		}
		else{
			$('.save-multiple-recharge-btn').attr('disabled', 'disabled');
		}
		$('#other_activity').attr('disabled','disabled');
		$('#multi_is_other_activity_'+cost_id).attr('disabled','disabled');
		$('.chosen').chosen().trigger("chosen:updated");
		$('#recharge_rate_'+cost_id).attr('disabled',false);
		$('#recharge_tank_days_'+cost_id).attr('disabled',false);		
	}
	
}
