/**
* product IMO check + SG + UNNO
*/
$('#quote-form').on('change', 'select#product', function(e) {
	
  var $this = $(this),
      product_id = $this.find(':selected').val();

  // fill business type and quote div
  $.ajax({
	    url: appHome+'/customer-quotes/common_ajax',
	    type: 'post',
	    dataType: 'html',
	    data : {
	    		'action_type' : 'get_type_quote',
	    		'product_id' : product_id
	    },
	    beforeSend: function() {
            // setting a timeout
        	$('.product_loader').show();
        },
	    success: function(data) {	
	    	var parsed_data = JSON.parse(data);
	    	 $('#quote_business_type').val(parsed_data.division);
	    	 $('#quote_business_type').chosen().val(parsed_data.division).trigger("chosen:updated");
	    	 $('.form-product-sg').html(parsed_data.prod_sg);
	    	 $('.form-product-unno').html(parsed_data.prod_unno);
	    	 $('.product_loader').hide();
         if(parsed_data.prod_melt_point_to >= 20){
           $('#heating-alert-box').removeClass('hidden');
         }
         else{
           $('#heating-alert-box').addClass('hidden'); 
         }
	    }
	  });
});



/**
* product IMO check
*/
$('#quote-form').on('change', 'select#product', function(e) {
  var $this = $(this),
      product_id = $this.find(':selected').val();
  $('#old_value_is_hazardous_product').val($('#is_hazardous_product').val());

  $.ajax({
    url: appHome+'/products/'+product_id+'/imo_check',
    type: 'get',
    dataType: 'json',
    async : false,
    success: function(data) {
      var $notice = $this.parents('.form-group').find('.form-notice').hide(),
          $hazardous_field = $('#is_hazardous_product').val('false');
      if(data.hazardous) {
        $notice.show();
        $hazardous_field.val('true');
      }
      if(data.not_available){
        $('#hazardous_product_status_not_avail').val(1);
      }
      else{
        $('#hazardous_product_status_not_avail').val(0);
      }
    }
  });
  
  if($('#old_value_is_hazardous_product').val() != $('#is_hazardous_product').val()) {
	  var cost_count = $('.transmode-table-main tr').length;
	  if(cost_count > 1) {
		  BootstrapDialog.show({title: 'Warning', message : 'This product change will affect the supplier rate selections. So please change the supplier rates selection also.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],			 	
		  });
		  $('html, body').animate({ scrollTop: $("#supplier-costs").offset().top }, 400);
	  }
  }
  
});


/**
* route search/filtering
*/
$('.get_routes').on('change', 'select, input[type="checkbox"]', function(e){
	var $form =  $(this).parents('form.get_routes');

	$('#tm_page').val(1);
	//$('#tm_pagesize').val();
	$('#tm_totalrecords').val(0);
	$('#modal-supplier-costs-table').empty();
	
	transportModeFilter($form);
});

$('#modal-supplier-costs-table').on('change', '.custom-page-pagesize', function(e){
	var transport_mode_id = $("#transport_mode").val(),
	 	$form = $('[data-tm="' + transport_mode_id + '"]').find('form.get_routes');

	$('#tm_page').val(1);
	$('#tm_pagesize').val($(this).val());
	$('#tm_totalrecords').val(0);
	$('#modal-supplier-costs-table').empty();
	
	transportModeFilter($form);
});

$('#modal-supplier-costs-table').on('click', '.first, .next, .last, .prev', function(e){
	var transport_mode_id = $("#transport_mode").val(),
		 _this = $(this),
	 	$form = $('[data-tm="' + transport_mode_id + '"]').find('form.get_routes');

	$('#tm_page').val(_this.data('val'));
	//$('#tm_pagesize').val();
	$('#tm_totalrecords').val(_this.siblings('.custom-page-pagesize').data('totalrecords'));

	transportModeFilter($form);
});

$('#deep_sea_search').click(function(){
	var transport_mode_id = $("#transport_mode").val(),
	 	$form = $('[data-tm="' + transport_mode_id + '"]').find('form.get_routes');

	$('#tm_page').val(1);
	//$('#tm_pagesize').val();
	$('#tm_totalrecords').val(0);
    $('#modal-supplier-costs-table').empty();

	transportModeFilter($form);
});

function transportModeFilter($form){
	var transport_mode_id = $("#transport_mode").val();
	var $table_wrapper = $('#modal-supplier-costs-table');
    var form_data = $form.serializeArray();

	if(transport_mode_id !== '6') {
	  form_data.push({
	    name: "hazardous_product",
	    value: $('#is_hazardous_product').val()
	  });
	
	  form_data.push({
	    name: "tank_type",
	    value: $('#tank_type').find(':selected').val()
	  });
	}
	
	if(transport_mode_id == '7'){
	  form_data.push({
	    name: "terms",
	    value: $('#terms-search').val()
	  });
	  form_data.push({
	    name: "currency",
	    value: $('#currency :selected').text()
	  }); 
	}
	
	form_data.push({
	   name: "product_id",
	   value: $('#product').find(':selected').val()
	});
	  
	form_data.push({
	   name: "cquote_curr",
	   value: $('#currency').find(':selected').val()+'-'+$('#currency').find(':selected').text()
	});
  
	form_data.push({
	   name: "page",
	   value: $('#tm_page').val()
	});

	form_data.push({
	   name: "pagesize",
	   value: $('#tm_pagesize').val()
	});

	form_data.push({
	   name: "totalrecords",
	   value: $('#tm_totalrecords').val()
	});

  	$(".quote-transportmode-ajax").show();

	$.ajax({
	    type: 'POST',
	    url: appHome+'/supplier-costs/search',
	    data: form_data,
	    success: function(response){
	      $table_wrapper.empty().append(response).show();
	      $('.transmode-table')
	        .tablesorter({
			  cssHeader:'sortheader',
			  cssAsc:'headerSortUp',
			  cssDesc:'headerSortDown',
	          widthFixed: true,
	          widgets: ['zebra', 'filter'],
	          widgetOptions: {
	            filter_reset: '.reset'
	          }
	        });
	      $('.table').find("[data-toggle=tooltip]").tooltip({ placement: 'bottom'});
	      $(".quote-transportmode-ajax").hide();
	    },
	    error: function(response){
	      $table_wrapper.append(alert_error).fadeIn();
	      $(".quote-transportmode-ajax").hide();
	    }
	});
}


/**
 * DM-08-Jan-2018
 * 
 */
function calculateTankAdditionalInfo(){
	
	if($('#number_of_loads').length > 0){
		var number_of_loads = $('#number_of_loads').val().trim();
		var rounded_quote_cost = $('input[name=rounded_quote_cost]').val().trim();
		var margin = $('#margin').val().trim();
		var tank_days = $('#total_days').val().trim();
		//var tank_days_adjustment = $('#tank_days_adjustment').val().trim();
		
		number_of_loads = (number_of_loads != "" && !isNaN(number_of_loads)) ? number_of_loads : 0;
		rounded_quote_cost = (rounded_quote_cost != "" && !isNaN(rounded_quote_cost)) ? rounded_quote_cost : 0;
		margin = (margin != "" && !isNaN(margin)) ? margin : 0 ;
		//tank_days_adjustment = (tank_days_adjustment != "" && !isNaN(tank_days_adjustment)) ? tank_days_adjustment : 0 ;
		tank_days = (tank_days != "" && !isNaN(tank_days)) ? tank_days : 0 ;
		
		var revenue_per_annum = (rounded_quote_cost * number_of_loads).toFixed(2);
		var margin_per_annum = (margin * number_of_loads).toFixed(2);
		var no_of_tanks_required = ((parseInt(tank_days) * parseInt(number_of_loads) ) / 280).toFixed(2);
		 
		$('.revenue_per_annum').html(revenue_per_annum);
		$('.margin_per_annum').html(margin_per_annum);
		$('.no_of_tanks_required').html(Math.ceil(no_of_tanks_required));
	}
}

/**
 * Re-calculates total quote cost
 */
function update_total_cost() {
  var total_price = parseFloat($('#total_cost').val()),
      margin = parseFloat($('#margin').val()),
      tank_rental = parseFloat($('#tank_rental').val());

  total_price = isNaN(total_price) ? 0 : total_price;
  margin = isNaN(margin) ? 0 : margin;
  tank_rental = isNaN(tank_rental) ? 0 : tank_rental;

  $('#total_quote_cost').val((total_price + tank_rental + margin).toFixed(2));
  update_rounded_cost();
}


/**
 * Re-calculcate rounded quote cost
 */
function update_rounded_cost() {
  var total_cost = parseFloat($('#total_quote_cost').val()),
      rounded_cost = Math.ceil(total_cost/5) * 5;

  $('[name="rounded_quote_cost"]').val(rounded_cost.toFixed(2));
  calculateTankAdditionalInfo(); // Added DM-09-Jan-2018
}

$(window).on('load', update_rounded_cost);


/**
 * Re-calculates quote sub-totals
 */
function update_quote_costs() {
  var margin = parseFloat($('#margin').val()),
      tank_days = parseInt($('#tank_days').val()),
      customer_free_days = parseInt($('#customer_free_days').val()),
      repo_days = parseInt($('#repo_days').val()),
      origin_free_days_from_above = parseInt($('#origin_free_days_from_above').val()),
      tank_days_custom = parseInt($('#tank_days_adjustment').val()),
      tank_rate_per_day = parseFloat($('#rate_per_day').val()),
      tank_days = tank_days += (tank_days_custom + customer_free_days + repo_days + origin_free_days_from_above),
      tank_cost = tank_days * tank_rate_per_day,
      currency = $('#currency').chosen().val(),
      total_price = 0,
      supplier_costs_total = 0,
      additional_costs = 0,
      converted_tank_cost,
      total_additional_and_supp_cost = 0;

  if(currency === undefined){
    converted_tank_cost = perform_conversion(tank_cost, 3, $('#supplier-costs').attr('data-currency'));
  } else {
    converted_tank_cost = perform_conversion(tank_cost, 3, currency);
  }

  $('input[name="additional_cost_converted[]"]').each(function(){
    additional_costs += parseFloat($(this).val());
  });

  total_price += additional_costs;

  // add-up supplier cost prices
  $('#supplier-costs').find('.price').each(function() {
    var price = parseFloat($(this).html());
    supplier_costs_total += isNaN(price) ? 0 : price;
  });

  //extra items total
  $('.supplier-cost-extra-item span').each(function() {
	  var extra_price = parseFloat($(this).html());
	  supplier_costs_total += isNaN(extra_price) ? 0 : extra_price;
  });
  
  total_price += supplier_costs_total;
  total_additional_and_supp_cost = supplier_costs_total + additional_costs;

  // add-up tank costs
  converted_tank_cost = parseFloat(converted_tank_cost).toFixed(2);
  
  

  $('#total_tank_costs').val(converted_tank_cost);
  $('#tank_rental').val(converted_tank_cost);

  total_price += parseFloat(converted_tank_cost);

  if($('#page').attr('data-url') == 'customer-quotes/deep-sea') {
    $('#supplier_costs_total').val(supplier_costs_total.toFixed(2));

    $('#saved-cost').val(total_price.toFixed(2));
    $('#total_cost').val(total_additional_and_supp_cost.toFixed(2));

	if($(".approved").prop('checked') == true){
    	var diff_amt = parseFloat($('#total_cost').val()) -  parseFloat($('#sub_tot').val());
      var exist_tank_rent = parseFloat($('#tank_rental').val()) -  parseFloat($('#existing_tank_rent').val());
		  var margin	 = parseFloat($('#margin').val()) - parseFloat(diff_amt) - parseFloat(exist_tank_rent);

		$('#margin').val(parseFloat(margin.toFixed(2)));
    $('#sub_tot').val(parseFloat($('#total_cost').val()));
		$('#existing_tank_rent').val(parseFloat($('#tank_rental').val()));
	}
    update_total_cost();
  }
};

if( $('input[name="customer_quote_id"]').val() == "" ) 
{
	tank_type($('#tank_type').chosen().val());
}

function tank_type(value) {
  if(value == '20ft'){
    $('#rate_per_day').val('15');
  }
  if(value == "swap"){
    $('#rate_per_day').val('20');
  }
  
  update_tank_days();
  update_quote_costs();
}

$('#tank_type').change(function(){
  tank_type($(this).chosen().val());
});

$('#rate_per_day, #tank_days').on('input propertychange paste', function(){
  update_quote_costs();
});


/**
* update total quote cost on margin change
*/
$('#margin').on('input propertychange paste', update_total_cost);

$('#tank_days_adjustment').on('input propertychange paste', update_quote_costs);
$('#total_cost').on('input propertychange paste', update_total_cost);

if($('#page').attr('data-url') == 'customer-quotes/deep-sea') {
  if($('#currency').length) {
    update_tank_days();
    update_quote_costs();
  }
}

function update_tank_days() {
  var $tank_days = 0,
  	  $total_tank_days = 0,
      $customer_free_days = $('#customer_free_days').val(),
      $repo_days = $('#repo_days').val(),
      $tank_days_adjustment = $('#tank_days_adjustment').val();
  
  var $cq_prdem_cust_free_days = $('#cq_prdem_cust_free_days').val();
  

  $('#supplier-costs').find('input[name="days_in_transit"]').each(function(){
	  $tank_days += Number($(this).val());
  });

  $total_tank_days = Number($customer_free_days) + Number($repo_days) + Number($tank_days_adjustment) + $tank_days + Number($cq_prdem_cust_free_days);

  $('#tank_days').val($tank_days);
  $('#free_days_from_above').val($customer_free_days);
  $('#total_days').val($total_tank_days);
};

$('#customer_quote_modal').on('hidden.bs.modal', function(){
  $("#transport_mode option:first-child").attr('selected', 'selected');
  $('#modal-supplier-costs-table').empty();
  $('#tm_pagesize').val($('#tm_pagesize').data('defsize'));
  $('.modal-form').hide();
});


/**
 * Selecting a transport mode...
 */
$('#transport_mode').change(function(){
  $('.modal-form').hide();
  $('#modal-supplier-costs-table').empty();
  $('#tm_pagesize').val($('#tm_pagesize').data('defsize'));

  var transport_mode_id = $(this).find('option:selected').val(),
      transport_mode_value = $(this).find('option:selected').text().toLowerCase();
  
  transport_mode_value = transport_mode_value.replace('short sea shipping', 'shipping');
  transport_mode_value = transport_mode_value.replace('deep sea shipping', 'ds-shipping');

  if(transport_mode_id !== '') {
    var $selected = $('.'+transport_mode_value+'-modal');
    $selected.find('input[name="transport_mode_id"]').val(transport_mode_id);
    $selected.show().find('.chosen').chosen('destroy').chosen(chosen_options);
  }

  if(transport_mode_id === '6') {
	var $form = $('[data-tm="' + transport_mode_id + '"]').find('form.get_routes');
	
	$('#tm_page').val(1);
	$('#tm_pagesize').val($(this).val());
	$('#tm_totalrecords').val(0);
	
	transportModeFilter($form);
  }

});


/**
 * When a new cost is added to a quote...
 */
$(document).on('click', '#add-supplier-cost', function(e) {

  e.preventDefault();

  var selected = $('input[name="supplier_cost"]:checked'),
      supplier_costs = $('#supplier-costs'),
      supplier_costs_table = supplier_costs.find('.transmode-table-main'),
      error = 0;

  // return if no cost has been selected
  if(!selected.length) {
    return false;
  }

  var supplier_cost_id = selected.val();

  // check to see if the cost has already been added to the quote
  supplier_costs.find('input[name="supplier_cost_ids[]"]').each(function(){
    if(supplier_cost_id === $(this).val()){
      error = 1;
    }
  });

  // the cost already exists as a part of this quote, display error and return
  if(error !== 0) {
    BootstrapDialog.show({
      title: 'Uh oh!',
      type: BootstrapDialog.TYPE_DANGER,
      message: 'This Supplier Rate has already been added to the Customer Quote, please select a different one to continue.',
      buttons: [{
        label: 'OK',
        action: function(dialogItself){
          dialogItself.close();
        }
      }]
    });

    return false;
  }

  if (selected.data('valid') == "invalid") {
	  BootstrapDialog.confirm('This item is expired. Do you wish to proceed ?', function(result){
		  if(result) {
			  selected.data('valid','');
			  $('#add-supplier-cost').trigger('click');
		  } 
	  });
	  return false;
  }
  
  var $cost = selected.closest('tr'),
      quote_id = $('input[name="customer_quote_id"]').val(),
      quote_currency = $('#currency').chosen().val(),
      $cost_price = $cost.find('span.price'),
      cost_currency = $cost_price.attr('data-original-currency'),
      total_tankdays = $cost_price.attr('data-total-tank-days'),
      cost_value = parseFloat($cost_price.attr('data-original')),
      $cost_comm = $cost.find('span.comment'),
      $cost_comments = $cost_comm.attr('data-comment'), 
      $cost_validity = $cost.find('span.validity'),
      $cost_from = $cost_validity.attr('data-datefrom'),
      $cost_to = $cost_validity.attr('data-dateto'),
      deepsea_json_part = [],
      json = "";

  $trans_mode_id = $cost.find('input[name="trans_mode_id"]').val();

  if($trans_mode_id == "7") {
	  $cost.find('td:eq(3)').after('<td class="center-cell"></td>;');
	  $cost.find('td:eq(9)').remove();
	  $cost.find('td:eq(7)').remove();
	  $(".tmp-item-div").remove();
	  $(".supplier-cost-ds-list").removeClass("hide");
	  $(".supplier-cost-list-90px").removeClass();
	  $(".supplier-cost-ds-name-list").remove();
	  
	  total_tankdays = $cost.find('input[name="days_in_transit"]').val();
	  
	  $cost.find('.supplier-cost-ds-item').each(function() {
			var $this = $(this),
	        	from_value = $this.attr('data-original'),
	        	from_currency = $this.attr('data-original-currency'),
	        	to_currency = $('#currency').chosen().val(),
	        	cost_description = $this.attr('data-cost-description'),
	        	json_row = {};
			
			new_value = perform_conversion(from_value, from_currency, to_currency);
			$this.find('span').text(parseFloat(new_value).toFixed(2));
			
			json_row.amount = from_value;
			json_row.converted_amount = new_value;
			json_row.description = cost_description;
			json_row.base_currency = from_currency;
			json_row.terms = $('#terms-search').val();
			deepsea_json_part.push(json_row);
	  });

	  json = JSON.stringify({
		    supplier_cost_id: supplier_cost_id,
		    tank_state: $('#tank_state_ds').find(':selected').val(),
		    amount: 0,
		    tank_days: total_tankdays,
		    converted_amount: 0,
		    json_data : deepsea_json_part 
	  });
	  var tank_state_new = $('#tank_state_ds').val();
  } else {
	  if(cost_currency != quote_currency) {
		    cost_value = perform_conversion(cost_value, cost_currency, quote_currency);
	  }
	  cost_value = parseFloat(cost_value).toFixed(2);
	  /**
	     * Start tank_state_new
	     * 16/Nov/2016 fixing invalid tank state from modal window
	     */
	    if($('#transport_mode').val() == 1){ // haullage
	  	  var tank_state_new = $('.haulage_tank_state').val();
	    }else if($('#transport_mode').val() == 2){ // Rail
	  	  var tank_state_new = $('.rail_tank_state').val();
	    }else if($('#transport_mode').val() == 3){ // Short sea
	  	  var tank_state_new = $('.short_sea_tank_state').val();
	    }else if($('#transport_mode').val() == 4){ // barge
	  	  var tank_state_new = $('.barge_tank_state').val();
	    }
      else if($('#transport_mode').val() == 7){ // barge
        var tank_state_new = $('#tank_state_ds').val();
      }else{
	      var tank_state_new = '';
	    }
	    /**
	     * End tank_state_new
	     */
	  json = JSON.stringify({
	    supplier_cost_id: supplier_cost_id,
	    tank_state: tank_state_new,
	    amount: parseFloat($cost_price.attr('data-original')),
	    tank_days: total_tankdays,
	    converted_amount: cost_value,
      comment : $cost_comments,
      dateFrom : $cost_from,
      dateTo : $cost_to

	  });
	  
  }
  
  $cost.find('input[name="supplier_cost_data[]"]').val(json);
  $cost.find('td').eq(5).after('<td>'+tank_state_new.substr(0,1).toUpperCase()+tank_state_new.substr(1)+'</td>');
  supplier_costs_table.children('tbody').append('<tr class="supplier-row new-row">'+$cost.html()+'</tr>');
  supplier_costs_table.find('td:last').remove();
  supplier_costs_table.find('td:last').after('<td class="center-cell"><a href="#" class="delete-supplier-cost-tansport-mode delete-icon" title="Delete rate"><i class="fa fa-trash-o"></i></a></td>');
  supplier_costs_table.find('td').removeClass('hidden');
  supplier_costs_table.find('span').removeClass('hidden');
  supplier_costs_table.find('td > .tname-inside-td').remove();
  supplier_costs_table.find('td > .tname-inside-td-link').removeClass('hidden');
  $('[data-toggle="tooltip"]').tooltip();

  $('.add-extras').each(function(){
    $(this).attr('data-quote', quote_id);
  });

  supplier_costs_table.trigger('update');

  $('#customer_quote_modal').modal('hide');

  $('#supplier-costs').find('.table').show();

  if(supplier_costs.hasClass('hidden')){
    supplier_costs.removeClass('hidden').fadeIn();
  }

  // update last row
  if($trans_mode_id == "7") {
	  $('.transmode-table-main').find('tr.new-row:last-child')
	    .find('td:first').show().end()
	    .trigger('btlContentChange');
  } else {
	  $('.transmode-table-main').find('tr.new-row:last-child')
	    .find('.convert-rate').text(cost_value).end()
	    .find('td:first').show().end()
	    .trigger('btlContentChange');
  }
  
  selected.closest('table').remove();
  
  switch_currency_icons($('#currency'), 'currency-fa');

  update_tank_days();
  update_quote_costs();
});

/**
* delete supplier cost from transport modes // delete-supplier-cost-tansport-mode
*/
$(document).on('click', '.delete-supplier-cost-tansport-mode, .delete-additional-cost', function(e){
  e.preventDefault();
  var table = $(this).closest('table'),
      row = $(this).closest('tr'),
      message = 'Are you sure you want to delete this record?';

  BootstrapDialog.confirm(message, function(result){
    if(result) {

      row.remove();
      $('.table').trigger('update');

      if($('#additional-costs').find('tbody').find('tr').length === 0){
        $('#additional-costs').addClass('hidden');
      }

      if($('#supplier-costs').find('.table tr').length === 0){
        // table.closest('.panel').hide();
        $('#supplier-costs').find('.table').hide();
      }

      update_tank_days();
      update_quote_costs();

    }
  });
});

var old_required = alert_required;

/**
* save / update customer quote
*/
$('.save-customer-quote, .update-customer-quote').click(function(e){
  e.preventDefault();

  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      customer_quote_id = $('input[name="customer_quote_id"]').val(),
      path = $(this).attr('data-path');

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

  highlight($(form).find('#customer'), '');
  highlight($(form).find('#quote_number'), '');
  highlight($(form).find('#number_of_loads'), '');
  highlight($(form).find('#product'), '');
  highlight($(form).find('#tank_type'), '');
  highlight($(form).find('#tank_days'), '');
  highlight($(form).find('#total_cost'), '');
  highlight($(form).find('#total_quote_cost'), '');
  
  highlight($(form).find('#valid_until'), '');
  highlight($(form).find('#customer_free_days'), '');
  
  if($('#cur_mes').text() != ""){
	  success.push(false);
	  $('#currency').parent().addClass('highlight');
	  alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Customer code does not match currency selected.</div>';
  }else{
	  success.push(true);
	  $('#currency').parent().removeClass('highlight');
	  alert_required = old_required;
  }
  highlight($(form).find('#currency'), '');
  /**
   * Route validation
   */
  if($('[name="new_start_city[active]"]').val() === 'yes') {
    highlight($(form).find('[name="new_start_city[country_id]"]'), '');
    highlight($(form).find('[name="new_start_city[name]"]'), '');
  } else {
	highlight($(form).find('#start_city'), '');  
  }

  if($('[name="new_destination_city[active]"]').val() === 'yes') {
    highlight($(form).find('[name="new_destination_city[country_id]"]'), '');
    highlight($(form).find('[name="new_destination_city[name]"]'), '');
  } else {
	highlight($(form).find('#destination_city'), '');  
  }
  
  var check_fields = (success.indexOf(false) > -1);
  
  /**
  * save customer quote
  */
  if($(this).hasClass('save-customer-quote')){
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {
      if($('#hazardous_product_status_not_avail').val() == 1){
        BootstrapDialog.confirm('Product Hazardous status has not been confirmed .Do you want to continue?', function(result){
          if(result) {
            $.ajax({
              type: 'POST',
              url: path+'/add',
              data: $(form).serialize(),
              success: function(response){
                window.location.href = path+'/index?'+$('input[name="returnpath"]').val();
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
        $.ajax({
          type: 'POST',
          url: path+'/add',
          data: $(form).serialize(),
          success: function(response){
            window.location.href = path+'/index?'+$('input[name="returnpath"]').val();
            localStorage.setItem('response', response);
          },
          error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
          }
        });
      }
    }
  }

  /**
  * update customer quote
  */
  if($(this).hasClass('update-customer-quote')){

    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {
      if($('#hazardous_product_status_not_avail').val() == 1){
        BootstrapDialog.confirm('Product Hazardous status has not been confirmed .Do you want to continue?', function(result){
          if(result) {
            $.ajax({
              type: 'POST',
              url: '../'+customer_quote_id+'/update',
              data: $(form).serialize().replace(/%5B%5D/g, '[]'),
              success: function(response){
                window.location.href = path+'/index?'+$('input[name="returnpath"]').val();
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
        $.ajax({
          type: 'POST',
          url: '../'+customer_quote_id+'/update',
          data: $(form).serialize().replace(/%5B%5D/g, '[]'),
          success: function(response){
            window.location.href = path+'/index?'+$('input[name="returnpath"]').val();
            localStorage.setItem('response', response);
          },
          error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
          }
        });
      }
    }
  }
});


/**
* delete customer quote
*/
$('.delete-customer-quote').click(function(e){
  e.preventDefault();

  var customer_quote_id = $(this).attr('data-id');
  var path = $(this).attr('data-path');

  BootstrapDialog.confirm('Are you sure you want to delete this Customer Quote?', function(result){
    if(result) {
      $.ajax({
        type: 'POST',
        url: path+'/'+customer_quote_id+'/delete',
        data: $('form').serialize(),
        success: function(response){
          window.location.href = path+'/index';
          localStorage.setItem('response', response);
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  });
});


/**
* add extras to supplier cost for transport modes
*/
$(document).on('click', '.add-extras', function(e) {
  e.preventDefault();

  var $this = $(this),
      $parent = $this.parents('.supplier-row, .new-row'),
      supplier_id = $this.attr('data-supplier'),
      supplier_cost_id = $this.attr('data-suppliercost'),
      customer_quote_id = $this.attr('data-quote');

  if(customer_quote_id === '') {
    customer_quote_id = 0;
  }

  $parent.addClass('active-extras-modal');
  $('#modal-supplier-costs-extras-table').empty();

  var cquote_currency = $('#currency').find(':selected').val()+'-'+$('#currency').find(':selected').text();
  
  // perform db query
  $.ajax({
    type: 'GET',
    beforeSend: function() {
        // setting a timeout
    	$('.product_loader').show();
    },
    url: appHome+'/supplier-costs/extras/'+supplier_id+'&'+customer_quote_id+'&'+supplier_cost_id+'&'+cquote_currency,
    success: function(response){
      $('.product_loader').hide();
      $('#modal-supplier-costs-extras-table').append(response).show();
      checkExtraSelection();
    },
    error: function(response){
      $('#customer_quote_extras_modal').find('.modal-body').empty().append(alert_error).fadeIn();
    }
  });

  $('#save_extras').attr('data-extras', supplier_cost_id);
});

/**
 * When the cost extras modal is shown...
 */
function checkExtraSelection() {
  var extras_id = $('#save_extras').attr('data-extras');
  $('input[name="extras_checkbox"]').each(function(){
    var extras_val = $(this).attr('id');
    $(this).attr('id', 'extras-checkbox-'+extras_id+'-'+extras_val);
  });
  
  $('.extras_checkbox').each(function(){
	  $(this).prop('checked', false);
  });

  var chosen_extras = $('#extras-'+extras_id).val();
  if(chosen_extras.length > 0){
    var extras_arr = chosen_extras.split(',');
    for(i = 0; i < extras_arr.length; i++){
      $('#extras-checkbox-'+extras_id+'-'+extras_arr[i]).prop('checked', true);
    }
  }
}


/**
 * When an extras checkbox is changed...
 */

$(window).on('change', '.extras_checkbox', function() {
if($(this).hasClass('checked')){
    $(this).removeClass('checked');
  } else {
    $(this).addClass('checked');
  }
});

$('#save_extras').on('click', function(e){
  e.preventDefault();

  var supplier_cost_extras_ids = [],
  	  supplier_cost_extras_rate_ids = [],
      extras_id = $(this).attr('data-extras'),
      current_line_item = $('tr.active-extras-modal');
  
  $('.extras_checkbox').each(function(){
    var is_checked = $(this).is(':checked'),
        cost = $(this).attr('data-cost'),
        from_currency = $(this).attr('data-currency'),
        to_currency = $('#currency').chosen().val(),
        extra_item = $(this).attr('data-item-name'),
        extra_item_tooltip = "",
        already_saved = $(this).attr('data-saved');

    if (extra_item.length >= 23) {
    	extra_item_tooltip = extra_item; 
    	extra_item = extra_item.substr(0,23) + '...';
    }  
    
    var new_cost = perform_conversion(cost, from_currency, to_currency);

    var extra_actual_cost = $(this).closest('tr').find('.extra-supp-need-cost').html();
    var sc_extras_id = $(this).val();
    
    current_line_item.find('.supplier-cost-extra-item-' + sc_extras_id).remove();
    if($(this).is(':checked')){
    	current_line_item.find('.supplier-cost-extra-list-title').removeClass('hide');
    	current_line_item.find('.supplier-cost-extra-name')
    		.append('<div class="one-line-item supplier-cost-extra-item-' + sc_extras_id + '" data-toggle="tooltip" title="'+extra_item_tooltip+'">'
    			+ extra_item +'</div>');
    	current_line_item.find('.supplier-cost-extra-cost')
    		.append('<div class="supplier-cost-extra-item supplier-cost-extra-item-' + sc_extras_id + '" data-original="'
    				+cost+'" data-original-currency="'
    				+from_currency+'" ><i class="fa currency-fa fa-gbp"></i> <span>'
    				+ parseFloat(new_cost).toFixed(2) +'</span></div>');
    	current_line_item.find('.supplier-cost-extra-actual-cost')
    		.append('<div class="supplier-cost-extra-item-' + sc_extras_id + '">'+ extra_actual_cost +'</div>');
    	
        supplier_cost_extras_ids.push(sc_extras_id);
        supplier_cost_extras_rate_ids.push(sc_extras_id+'R'+cost+'R'+ parseFloat(new_cost).toFixed(2) +'R'+from_currency);
        
        $('.one-line-item').tooltip({ placement: 'bottom'});
    } 
    current_line_item.find('.deleted_extra_item').remove();

    //apply_line_item_cost_change(new_cost, from_currency, already_saved);
  });

  if(supplier_cost_extras_ids == "") {
	  current_line_item.find('.supplier-cost-extra-list-title').addClass('hide');
  }

  update_quote_costs();
  switch_currency_icons($('#currency'), 'currency-fa');
  
  $('#extras-'+extras_id).val(supplier_cost_extras_ids);
  $('#extras_data-'+extras_id).val(supplier_cost_extras_rate_ids);

  $('#customer_quote_extras_modal').modal('hide');
});


/**
 * Change a line item's price upon the addition/removal of a cost extra
 */
function apply_line_item_cost_change(cost, currency_from, already_saved) {
  var current_line_item = $('tr.active-extras-modal').find('span.price'),
      currency_to = current_line_item.attr('data-original-currency'),
      delta = perform_conversion(cost, currency_from, currency_to),
      current_value = parseFloat(current_line_item.attr('data-original'));

  current_line_item.attr('data-original', current_value + parseFloat(delta));
  exchange_rates();
  update_quote_costs();
}


/**
 * When the cost extras modal is closed...
 */
$('#customer_quote_extras_modal').on('hidden.bs.modal', function() {
  var extras_id = $('#save_extras').attr('data-extras'),
      chosen_extras = $('#extras-'+extras_id);

  $('.active-extras-modal').removeClass('active-extras-modal');

  if(chosen_extras.val() == '' || chosen_extras.val() == 0){
    $('.extra-icon-'+extras_id).removeClass('glyphicon-ok-sign').addClass('glyphicon-remove-circle');
    $('.extra-icon-'+extras_id).attr('title','No extras applied to this cost.');
  } else {
    $('.extra-icon-'+extras_id).removeClass('glyphicon-remove-circle').addClass('glyphicon-ok-sign');
    $('.extra-icon-'+extras_id).attr('title','There are extras applied to this cost.');
  }
});

/**
* modal cancel button update table pagination
*/
$(document).on('click', '.cancel', function(){
  var supplier_costs_table = $('#supplier-costs').find('.table');
  supplier_costs_table.trigger('update');
});


$('.customer-quote-cost-info').click(function(e){
  e.preventDefault();
  $('.big_loader').show();
  $('#modal-customer-quote-cost-info').empty();
  
  var customer_quote_id = $(this).attr('data-quote');
  var quote_type = $(this).data('quote-tyle');
  $('html, body').animate({ scrollTop: 0 }, 400);

  $.ajax({
    type: 'GET',
    url: appHome+'/customer-quotes/customer-quote-cost-info/'+customer_quote_id + '&' + quote_type,
    success: function(response){
      $('.big_loader').hide();
      $('#modal-customer-quote-cost-info').empty().append(response).show();
      $('#supplier-costs .table')
        .tablesorter({
          widthFixed: true,
          widgets: ['zebra', 'filter'],
          widgetOptions: {
            filter_reset: '.reset'
          }
        });
        /*.tablesorterPager({
          container: $('.custom-pagination'),
          output: 'Records {startRow} to {endRow} (Total {totalRows} Results) - Page {page} of {totalPages}',
          removeRows: false,
          size: 25
        });*/
      
      //update_quote_costs();
      
    },
    error: function(response){
      $('#modal-customer-quote-cost-info').find('.modal-body').empty().append(alert_error).fadeIn();
    }
  });
});

if($('.checkbox-approved').attr('data-value') == '1' || $('.approved-status').is(':checked')){
  $('.checkbox-approved').show();
}

if($('.approved-status').is(':checked')) {
  $('.checkbox-approved').show();
}

if($('.draft-status').is(':checked')) {
  $('.checkbox-approved').hide();
  $('.approved').attr('checked', false);
}

$('.approved-status').on('click', function() {
  if($(this).is(':checked')) {
    $('.checkbox-approved').show();
  }
});

$('.draft-status').on('click', function() {
  if($(this).is(':checked')) {
    $('.checkbox-approved').hide();
    $('.approved').attr('checked', false);
  }
});


/**
 * Switches currency icon classes
 */

function switch_currency_icons(currency, currency_icon) {
  var currency_id = currency.chosen().val(),
      $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
      currency_name = $currency.attr('data-label');

  if(!$currency.length) {
    alert('Error. Currency not found.');
    return false;
  }

  if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
  	$('.'+currency_icon).not( ".no-change-curr" ).removeClass().html("").addClass('fa '+currency_icon+' fa-'+currency_name);
  }
  else {
  	$('.'+currency_icon).not( ".no-change-curr" ).removeClass().html(currency_name.toUpperCase()).addClass('fa '+currency_icon);
  }
  
}


/**
 * Converts all prices on a page to the given currency
 */
function exchange_rates() {
  $('.convert-rate').each(function() {
    var $this = $(this),
        from_value = $this.attr('data-original'),
        from_currency = $this.attr('data-original-currency'),
        to_currency = $('#currency').chosen().val(),
        new_value, old_value,old_json,new_json;

    old_value = $this.text().trim();
    new_value = perform_conversion(from_value, from_currency, to_currency);
    new_value = parseFloat(new_value).toFixed(2);
    $this.text(new_value);
    
    var json_cost_data = $this.parents('tr').find('input[name="supplier_cost_data[]"]');
    old_json = json_cost_data.val();
    new_json = old_json.replace('"converted_amount":"'+old_value+'"','"converted_amount":"'+new_value+'"' );
    new_json = new_json.replace('"converted_amount":'+old_value,'"converted_amount":'+new_value);
    
    old_value = parseFloat(old_value) * 100;
    old_value = parseInt(old_value) / 100;
    //these replaces are required because values are storing in different format
    new_json = new_json.replace('"converted_amount":'+old_value,'"converted_amount":'+new_value);
    new_json = new_json.replace('.00.00','.00');
    
    json_cost_data.val(new_json);
    
  });
  
 
  $('.supplier-cost-ds-cost').each(function() {
	  var deepsea_json_part = [],
	  	  json = "",
	  	  json_cost_data = $(this).parents('tr').find('input[name="supplier_cost_data[]"]'),
	  	  new_value,
		  old_json = json_cost_data.val();
	  	  var Jsonobj = JSON.parse(old_json);
	  $(this).find('.supplier-cost-ds-item').each(function() {
		  
		  var $this = $(this),
	    	from_value = $this.attr('data-original'),
	    	from_currency = $this.attr('data-original-currency'),
	    	to_currency = $('#currency').chosen().val(),
	    	cost_description = $this.attr('data-cost-description'),
	    	json_row = {};
			
			new_value = perform_conversion(from_value, from_currency, to_currency);
			$this.find('span').text(parseFloat(new_value).toFixed(2));
			
			//refill term data
			if(Jsonobj.json_data.length > 0){
				var newTerm = Jsonobj.json_data[0].terms;
			}
			
			json_row.amount = from_value;
			json_row.converted_amount = new_value;
			json_row.description = cost_description;
			json_row.base_currency = from_currency;
			json_row.terms = newTerm;
			
			deepsea_json_part.push(json_row);
	  });

	  Jsonobj.json_data = deepsea_json_part;
	  json = JSON.stringify(Jsonobj);
	  json_cost_data.val(json);
  });
  
  
  $('input[name="extras_data[]"').each(function(){
	  var $this = $(this),
	  to_currency = $('#currency').chosen().val(),
	  extra_data = $this.val(),
	  result = ""; 
	  
	  if(extra_data != "0" && extra_data != ""){
		  var single_extras_item = extra_data.split(',');
		  var single_extras_count = single_extras_item.length;
		  
		  for(i = 0; i < single_extras_count; i++){
			  var single_extras_item_detail = single_extras_item[i].split('R');
			  var single_extras_item_detail_count = single_extras_item_detail.length;
			  if(single_extras_item_detail_count == 4){
				  var itm_extra_id = single_extras_item_detail[0],
					  itm_extra_cost = single_extras_item_detail[1],
					  itm_extra_converted_cost = 0,
					  itm_extra_cur_id = single_extras_item_detail[3];
				  
				  itm_extra_cost = parseFloat(itm_extra_cost).toFixed(2);
				  itm_extra_converted_cost = perform_conversion(itm_extra_cost, itm_extra_cur_id, to_currency);
				  itm_extra_converted_cost = parseFloat(itm_extra_converted_cost).toFixed(2);
				  
				  result = result + "," + itm_extra_id + "R" + itm_extra_cost + "R" + itm_extra_converted_cost + "R" + itm_extra_cur_id;
			  }
		  }
	  }
	  result = result.substring(1);
	  $this.val(result);
  });
  
  
}

function exchange_rates_additionalCosts() {
	
	  $('input[name="additional_cost_converted[]"]').each(function(){
		  var $this = $(this);
		  var from_currency_name = $this.siblings('input[name="additional_cost_currency[]"]');
		  var from_currency = $('[data-label="' + from_currency_name.val() + '"]').data('id');
		  var to_currency = $('#currency').chosen().val();
		  var to_currency_name = $('#currency').chosen().find(':selected').text();
		  var from_value = $this.siblings('input[name="additional_cost[]"]').val();
		  var new_value = perform_conversion(from_value, from_currency, to_currency);
		  new_value = parseFloat(new_value).toFixed(2);
		  
		  $this.val(new_value);
		  $this.parents('tr').find('[name="adtnl_cost[]"]').text(new_value);
	  });
}

function exchange_rates_extraCost() {
	
	$('.supplier-cost-extra-item').each(function() {
		var $this = $(this),
        	from_value = $this.attr('data-original'),
        	from_currency = $this.attr('data-original-currency'),
        	to_currency = $('#currency').chosen().val();
		
		new_value = perform_conversion(from_value, from_currency, to_currency);
		$this.find('span').text(parseFloat(new_value).toFixed(2));
	});
} 

function exchange_rates_deepSeaCost() {
	
	$('.supplier-cost-ds-item').each(function() {
		var $this = $(this),
        	from_value = $this.attr('data-original'),
        	from_currency = $this.attr('data-original-currency'),
        	to_currency = $('#currency').chosen().val();
		
		new_value = perform_conversion(from_value, from_currency, to_currency);
		$this.find('span').text(parseFloat(new_value).toFixed(2));
	});
} 

/**
 * Gets the exchange rate between the given currency IDs
 */
function get_rate(currency_from, currency_to) {
  var $rate = $('[data-from="'+currency_from+'"][data-to="'+currency_to+'"]');

  if(currency_from == currency_to) {
    return 1;
  }

  return $rate.length ? $rate.attr('data-rate') : false;
}


/**
 * Converts a value from one currency to another
 */
function perform_conversion(value, currency_from, currency_to) {
  var rate = get_rate(currency_from, currency_to);
  if(!rate) {
    alert('Error. No exchange rate found.');
    return false;
  }

  var converted_cost = (value * rate).toFixed(2);
  return isNaN(converted_cost) ? 0 : converted_cost;
}


/**
 * On page load...
 */
if($('#page').attr('data-url') == 'customer-quotes/deep-sea') {
  // Setup currency icons
  var new_currency = $('#currency').chosen().val();
  $('#previous_currency').attr('data-currency', '2');

  if(new_currency !== 2) {
    switch_currency_icons($('#currency'), 'currency-fa');
    $('#previous_currency').attr('data-currency', new_currency);
  }


  /**
  * When the quote currency is changed...
  */
  $('#currency').on('change', function() {
    var $this = $(this),
        new_currency = $this.chosen().val();

    var previous_currency = $('#previous_currency').attr('data-currency');
    $('#previous_currency').attr('data-currency', new_currency);

    $('#cost_currency').chosen().val(new_currency).trigger("chosen:updated");

    if(previous_currency !== new_currency) {
      exchange_rates();
      exchange_rates_additionalCosts();
      exchange_rates_deepSeaCost();
      exchange_rates_extraCost();
      update_quote_costs();
       switch_currency_icons($('#currency'), 'currency-fa');
    }
  });
}

$('#cost_currency').on('change', function() {
	  var $this = $(this),
	      additional_cost_fa = "#additional-cost-fa",
	      additional_currency = $this.chosen().val();

	  var currency_name = $(this).find("option:selected").text().toUpperCase();
	  
	  if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
	  	$(additional_cost_fa).removeClass().html("").addClass('fa currency-fa fa-' + currency_name.toLowerCase());
	  }
	  else {
	  	$(additional_cost_fa).removeClass().addClass('fa currency-fa').html(currency_name);
	  }
	  
	  $(this).trigger("chosen:updated");
});



$('#add-additional-cost').click(function(e){
  e.preventDefault();
  var description = $('#additional-description-capture').val(),
      cost = $('#additional-cost-capture').val(),
      message,
      quote_currency = $('#currency').chosen().val(),
      quote_currency_txt = $('#currency').chosen().find(':selected').text(),
      additional_currency = $('#cost_currency').chosen().val(),
      additional_currency_txt = $('#cost_currency').chosen().find(':selected').text(),
      additional_currency_symbol="",
      quote_currency_symbol="",
      currency = $('.currency-meta[data-id="'+additional_currency+'"]'),
      currency_name = currency.attr('data-label');

  if(description === '' || cost === ''){
    BootstrapDialog.show({
      title: 'Uh oh!',
      type: BootstrapDialog.TYPE_DANGER,
      message: 'Please fill in both fields to add an Additional Cost.',
      buttons: [{
        label: 'OK',
        action: function(dialogItself){
          dialogItself.close();
        }
      }]
    });
  }

  if(description !== '' && cost !== ''){
    cost = parseInt(cost).toFixed(2);
    converted_additional_cost = cost;
    var quote_currency_name,
        additional_currency_name;
    
    if(quote_currency != additional_currency){
      converted_additional_cost = perform_conversion(cost, additional_currency, quote_currency);
      converted_additional_cost = parseFloat(converted_additional_cost).toFixed(2);
    }

    if (currency_having_symbols.indexOf(quote_currency_txt.toUpperCase()) >= 0) {
    	quote_currency_name = quote_currency_txt.toLowerCase();
    	quote_currency_symbol = "";
	}
	else {
		quote_currency_name = quote_currency_txt.toLowerCase();
		quote_currency_symbol = quote_currency_txt.toUpperCase();
	}
    
    if (currency_having_symbols.indexOf(additional_currency_txt.toUpperCase()) >= 0) {
    	additional_currency_name = additional_currency_txt.toLowerCase();
    	additional_currency_symbol = "";
	}
	else {
		additional_currency_name = additional_currency_txt.toLowerCase();
		additional_currency_symbol = additional_currency_txt.toUpperCase();
	}
    
    $('#additional-costs').find('tbody').append('<tr><td><input type="hidden" name="additional_description[]" value="'+description+'" />'+description+'</td><td><input type="hidden" name="additional_cost[]" value="'+cost+'" /><input type="hidden" name="additional_cost_converted[]" value="'+converted_additional_cost+'" /><input type="hidden" name="additional_cost_currency[]" value="'+additional_currency_name+'" /><i id="additional-cost-fa" class="fa fa-'+additional_currency_name+'">'+additional_currency_symbol+'</i>&nbsp;'+cost+'</td><td><i class="fa currency-fa fa-'+quote_currency_name+'">'+quote_currency_symbol+'</i>&nbsp;<span name="adtnl_cost[]">'+converted_additional_cost+'</span></td><td class="center-cell"><a href="#" title="Delete Additional Cost" class="delete-additional-cost delete-icon"><i class="fa fa-trash-o"></i></a></td></tr>');
    $('#additional-costs').removeClass('hidden');

    update_quote_costs();

    $('#additional-description-capture').val('');
    $('#additional-cost-capture').val('');
  }
});


var docIcon = {};

//Show a modal of quote files
$('.customer_quote_files_info').click(function(e){
  e.preventDefault();

  docIcon = $(this);
  var customer_quotes_id = $(this).data('quoteid');

  $('html, body').animate({ scrollTop: 0 }, 400);

  $.ajax({
    type: 'GET',
    url: appHome+'/customer-quotes/customer-quotes-files-info/'+customer_quotes_id,
    success: function(response){
      $('#modal-customer_quote_files_info').empty().append(response).show();
    },
    error: function(response){
      $('#modal-customer_quote_files_info').find('.modal-body').empty().append(alert_error).fadeIn();
    }
  });
});


//Delete a Customer quote File
$('.customer_quote_files-hug').on('click', ('.delete-customer_quote_files'), function(e) {
	e.preventDefault();

	var table = $(this).closest('table')
			row = $(this).closest('tr'),
			id = $(this).data('id'),
			path = $(this).data('path');
			root = $(this).data('root');

	BootstrapDialog.confirm('Are you sure you want to delete Document #'+id+'?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				url: root+'/deleteFile',
				data: {
					'id' : id,
					'path' : path
				},
				success: function(response){
					row.remove();
					if(table.find('tbody > tr').length == 0) {
							$('#customer-quotes-files').addClass('hidden');
							docIcon.hide();
					}
				},
				error: function(response){
					$('html, body').animate({
						scrollTop: $("#feedback").offset().top
					}, 700);
					$('#feedback').empty().prepend(alert_error).fadeIn();
				}
			});
		}
	});
});

/**
 * Supplier cost reordering
 */
(function() {
  $(document).ready(function(){
    if($('#form_type').val() == "add" || $('#form_type').val() == "edit") makeSupplierRowsDraggable();
  });
  
  if(!$('#quote-form').length) {
    return;
  }

  function initOrdering() {
    var $supplierRows = $('#supplier-costs').find('.supplier-row');
    $supplierRows.find('.order').css({ visibility: 'visible' });
    $supplierRows.each(function() {
      var $this = $(this),
          $dataField = $this.find('[name="supplier_cost_data[]"]'),
          data = JSON.parse($dataField.val());
      if($this.index() === 0) {
        $this.find('.order--up').css({ visibility: 'hidden' });
      }
      if($this.index() == $supplierRows.length - 1) {
        $this.find('.order--down').css({ visibility: 'hidden' });
      }

      // rewrite order values
      data.order = $this.index();
      $dataField.val(JSON.stringify(data));
    });
  }

  function makeSupplierRowsDraggable(){
    $('#transportmode-tbody').sortable({
      items: 'tr',
      cursor: 'pointer',
      axis: 'y',
      dropOnEmpty: false,
      start: function (e, ui) {
        // console.log(e)
      },
      stop: function (e, ui) {
        initOrdering();
      }
    });
  }

  initOrdering();
  $('table').on('btlContentChange', initOrdering);

  function highlightRow() {
    var $this = $(this);
    $this.css({ outline: '2px dashed rgba(0, 255, 0, 0.8)' });
    setTimeout(function() {
      $this.css({ outline: 'none' });
    }, 1000);
  }

  $('table').on('click', 'a.order--down', function(e) {
    e.preventDefault();
    var $this = $(this),
        $row = $this.parents('.supplier-row'),
        $nextRow = $row.next();
    $nextRow.after($row);
    highlightRow.call($row);
    initOrdering();
  });

  $('table').on('click', 'a.order--up', function(e) {
    e.preventDefault();
    var $this = $(this),
        $row = $this.parents('.supplier-row'),
        $nextRow = $row.prev();
    $nextRow.before($row);
    highlightRow.call($row);
    initOrdering();
  });
}());

$('.reset').on('click', function(e) {
	$('.multi-sel-ctrl').val('');
	$('.multi-sel-ctrl').multiselect('refresh');
});

$(document).ready(function() {
	if($("#country-list").val() !== undefined) {
		$(".country-selector").html($("#country-list").html());
	}
	
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
					if($(this.$select).attr('id') == 'fromtown-filter'){
						$('#fromtown-part-filter').val('');
					}else if($(this.$select).attr('id') == 'totown-filter'){
						$('#totown-part-filter').val('');
					}
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
});

$('.quote_rate_feedback').click(function() {
	var quote_id = $(this).data('quote_id');
	var row_rum = $('.quote_rate_feedback').closest('tr').index($(this).closest('tr'));
	
	$('#num_row').val(row_rum);
	$('#feedback_quote_id').val(quote_id);
	$('#rate_feedback').val($(this).attr('data-original-title'));
	if($('#rate_feedback').val() == ""){
		$("#fb_del_button").attr('disabled','disabled');
	} else {
		$("#fb_del_button").removeAttr('disabled');
	}
});

$('.feedback_submit').click(function() {
	var quote_id = $('#feedback_quote_id').val();
	var num_row = $('#num_row').val();
	var feedback = $('#rate_feedback').val();
	
	if($(this).data('action_type') == "delete") {
		feedback = "";
	} else if ($.trim(feedback) == ""){
		BootstrapDialog.show({title: 'Customer Quote Rate Feedback', message : 'Please enter your feedback.',
			buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close(); $("#rate_feedback").focus();}}],cssClass: 'small-dialog',	
		});
		return false;
	}
	
	$.ajax({
		url:'../../customer-quotes/rate-feedback-update/'+quote_id,
		type: 'post',
		data: [{name:'rate_feedback', value:feedback}],
		success:function(data){
			var parsed_data = JSON.parse(data);
			if(parsed_data.status == "success") {
				$('.quote_rate_feedback').eq(num_row).attr("data-original-title",parsed_data.feedback);
				if(feedback != "") {
					$('.quote_rate_feedback').eq(num_row).removeClass().addClass("quote_rate_feedback fa fa-comment tooltip-icon");
				} else {
					$('.quote_rate_feedback').eq(num_row).removeClass().addClass("quote_rate_feedback fa fa-plus-circle quote_rate_feedback_plus_circle");
				}
			}
			else {
				BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update customer rate feedback. Try again later.'});
			}
		}
	});
});


$('#customer_free_days').change(function(){
	$('#free_days_from_above').val( $(this).val() );
});

$('#cq_prdem_cust_free_days').change(function(){
	$('#origin_free_days_from_above').val( $(this).val() );
});

$('#customer_free_days, #cq_prdem_cust_free_days, #repo_days, #tank_days_adjustment').change(function(){
	update_tank_days();
    update_quote_costs();
});

/*
$('#terms').change(function(){
	var ds_cost_count = $(".supplier-cost-ds-cost").length;
	if(ds_cost_count > 0) {
		BootstrapDialog.show({title: 'Warning', message : 'Changing Terms will affect the Deep Sea supplier cost selections. So please change the Deep Sea supplier costs also.',
			 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],			 	
		});
		$('html, body').animate({ scrollTop: $("#supplier-costs").offset().top }, 400);
	}
});
*/

//Recalculation
$('.recal-customer-quote').click(function(){
	update_tank_days();
	exchange_rates();
    exchange_rates_additionalCosts();
    exchange_rates_extraCost();
    update_quote_costs();
    switch_currency_icons($('#currency'), 'currency-fa');
    
    BootstrapDialog.show({type: BootstrapDialog.TYPE_SUCCESS, title: 'Recalculation', message : 'Successfully calculated.'});
    $('html, body').animate({ scrollTop: 3000 }, 400);
});

$(document).ready(function() {
	$('#number_of_loads').on('change', function() {
		calculateTankAdditionalInfo();
	});
});

$(function() {
  if($('#page_name').val() == "deep-sales-quote"){

    //Dropzone class
    var myDropzone = new Dropzone("body", {
      url: "#",
      // acceptedFiles: "image/*,application/pdf",
      maxFiles : 1, 
      previewsContainer: "#form1",
      disablePreviews: true,
      autoProcessQueue: false,
      uploadMultiple: false,
      clickable: false,
      init : function() {
  
        myDropzone = this;
    
        //Restore initial message when queue has been completed
        this.on("drop", function(event) {
        if(event.dataTransfer.files.length > 0){
          fileInput = document.getElementById("file_to_upload"); 
          fileInput.files = event.dataTransfer.files;
           $('#upload_btn').prop("disabled", false);
          //window.location.href = "#file_list_panel";
          document.getElementById("file_list_panel").scrollIntoView();
          $("#file_list_panel").css("background-color", "#bdbdbd");
          setTimeout(() => {
            $("#file_list_panel").css("background-color", "unset");
          }, 800);

          setTimeout(() => {
            // suppInvoiceUploadFile(); to automatic upload
            myDropzone.removeAllFiles( true );
          }, 200);
  
  		 }
        });
    
      }
    });
  }
});

$(function(){
if( $('#form_type').val() == "edit" || $('#form_type').val() == "duplicating"){
  var product_id = $('select#product option:selected').val();
  getTypeQuote(product_id);
}
});

function getTypeQuote(product_id){
  $.ajax({
      url: appHome+'/customer-quotes/common_ajax',
      type: 'post',
      dataType: 'html',
      data : {
          'action_type' : 'get_type_quote',
          'product_id' : product_id
      },
      beforeSend: function() {
            // setting a timeout
          $('.product_loader').show();
        },
      success: function(data) { 
        var parsed_data = JSON.parse(data);
         $('.product_loader').hide();
         if(parsed_data.prod_melt_point_to >= 20){
           $('#heating-alert-box').removeClass('hidden');
         }
         else{
           $('#heating-alert-box').addClass('hidden'); 
         }
      }
    });
}
