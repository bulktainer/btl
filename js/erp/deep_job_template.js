var previous_valid_date = '';
$('#status_btn').click(function(){
    $('#status_btn i').toggleClass('fa-minus-circle fa-plus-circle');    
});
$('#customer_details_btn').click(function(){
    $('#customer_details_btn i').toggleClass('fa-minus-circle fa-plus-circle');
}); 
$('#imco_terms_btn').click(function(){
    $('#imco_terms_btn i').toggleClass('fa-minus-circle fa-plus-circle');
});
$('#quote_details_btn').click(function(){
    $('#quote_details_btn i').toggleClass('fa-minus-circle fa-plus-circle');
});
$('#instruction_details_btn').click(function(){
    $('#instruction_details_btn i').toggleClass('fa-minus-circle fa-plus-circle');
}); 
$('#tmode_details_btn').click(function(){
    $('#tmode_details_btn i').toggleClass('fa-minus-circle fa-plus-circle');
}); 
$('#tank_details_btn').click(function(){
    $('#tank_details_btn i').toggleClass('fa-minus-circle fa-plus-circle');
});
$('#surcharge_details_btn').click(function(){
    $('#surcharge_details_btn i').toggleClass('fa-minus-circle fa-plus-circle');
}); 
$('#quote_cost_details_btn').click(function(){
    $('#quote_cost_details_btn i').toggleClass('fa-minus-circle fa-plus-circle');
});

$('#linked_btn').click(function(){
	$('#linked_btn i').toggleClass('fa-minus-circle fa-plus-circle');
});
$(document).on('click', '.jobtemplate_comments,.jobtemplate_instructions,.jobtemplate_notes, .hauler-comments', function(e) {
	 e.preventDefault();
	$('#job_template_comments_text').css('border','1px solid #ccc');
	var data = $(this).attr('data-item');
	var id = $(this).attr('data-id');
	
	if($(this).hasClass('hauler-comments')){
		var suppName = $(this).data('haulagesupplier');
		if(data == ""){
			data = suppName; 
		}
	}
	
	$('#job_template_comments_id').val(id);
	$('#job_template_comments_text').val(data);
});

$(document).on('click', '.open-logs', function(e) {
       	e.preventDefault();
       	var title ="";
       	var buttonLabel="";
       	var labeltext="";
       	var formType = $(this).data('type');
       	if(formType == 'comment'){
       	  	title 		= "Quote Transport Modes";
       	  	buttonLabel = "Save Comments";
       	  	labeltext   = "Comments"; 
       	  	$("#job_template_comments_text").attr('maxlength','500');
       	}else if(formType == 'instructions'){
       	  	title = "Instructions";
       	  	buttonLabel = "Save Instructions";
       	  	labeltext   = "Instructions"; 
       	  	$("#job_template_comments_text").attr('maxlength','500');
		}else if(formType == 'haulercomment'){
       	  	title = "Haulier Comment";
       	  	buttonLabel = "Save Comment";
       	  	labeltext   = "Comment";
       	  	$("#job_template_comments_text").attr('maxlength','128'); 
       	}else{
       		title = "Notes";
       		buttonLabel = "Save Notes";
       		labeltext   = "Notes"; 
       		$("#job_template_comments_text").attr('maxlength','30');
       	}
       	$(".modal-title").html(title);
       	$('#type').val(formType);
       	$("#submit_job_template_comments").html(buttonLabel);
       	$("#labeltext").html(labeltext);
       	$("#type").val(formType);
       	$("#job_template_comments").modal('show');
    });    

function autoCheckETA(){
	if($('.is_dimurrage_radio:checked').length == 0){
		var isShipFind = false;
		var ETAfound = false;
		$('.is_dimurrage_radio').each(function(){
    		var activity = $(this).attr('data-activity');
    		if((activity == 'SHIP' || activity == 'CSHIP')){
    			isShipFind = true;
    		}
    		if(isShipFind && (activity == 'ETA' || activity == 'ARVD') && !ETAfound){
    			$(this).attr('checked',true);
    			ETAfound = true; // taking the first ETA
    			updateETAtoDB($(this));
    		} 
  		});
	}
}

function updateETAtoDB(currVar){
	var tempId = currVar.attr('data-tempid');
	$('.is_dimurrage_radio').attr('disabled', true);
	$.ajax({
		    url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
		    type: 'post',
		    dataType: 'html',
		    data : {
		    		'tempid' : tempId,
		    		'quoteNumber' : $('#customer_quote_id').val(),
	      	  		'randomNumber' : $('#random_number').val(),
		    		'action_type' : 'update_demurrage_start'
		    },
		    success: function(data) {
		    	$('.is_dimurrage_radio').attr('disabled', false);
		    },
		    error: function(data) {
		    	$('.is_dimurrage_radio').attr('disabled', false);
		    },
		  });
}

$(document).on('click', '.is_dimurrage_radio', function(e) {
	updateETAtoDB($(this));
});

$(document).on('click', '#submit_job_template_comments', function(e) {
	e.preventDefault();
	var text = $('#job_template_comments_text').val().trim();
	var id   = $('#job_template_comments_id').val();
	var type = $('#type').val();
	if(type == 'comment'){
		action_type = 'update_jobtemplate_comments';
	}else if(type == 'instructions'){
		action_type = 'update_jobtemplate_instruction';
	}else if(type == 'haulercomment'){
		action_type = 'update_haulier_comment';	
	}else{
		action_type = 'update_jobtemplate_notes';
	}

		$.ajax({
		    url: appHome+'/jobtemplate-quotes/common_ajax',
		    type: 'post',
		    dataType: 'html',
		    data : {
		    		'text' : text,
		    		'id'   : id,
		    		'action_type' : action_type
		    },
		    success: function(data) {
		    	$("[data-toggle=tooltip]").tooltip();
		    	var aItem = $('.jobtemplate_comments[data-id="' + id +'"]');
		    	var bItem = $('.jobtemplate_instructions[data-id="' + id +'"]');
		    	var cItem = $('.jobtemplate_notes[data-id="' + id +'"]');
				var hItem = $('.hauler-comments[data-id="' + id +'"]');
		    	if(text == ""){
		    		var addclass = ' fa fa-comment ';
		    		var removeClass = ' fa fa-plus-circle '; 
		    	}else{
		    		var addclass = ' fa fa-plus-circle ';
		    		var removeClass = ' fa fa-comment '; 
		    	}
		    	if(action_type=='update_jobtemplate_comments'){
		    			aItem.attr('data-item',text);
			    		$('.jobtemplate_comments[data-id="' + id +'"] i').attr('data-original-title',text);
			    		$('.jobtemplate_comments[data-id="' + id +'"] i').removeClass(addclass).addClass(removeClass+' tooltip-icon');		    		
		    	}
		    	else if(action_type == 'update_jobtemplate_instruction'){
		    			bItem.attr('data-item',text);
			    		$('.jobtemplate_instructions[data-id="' + id +'"] i').attr('data-original-title',text);
			    		$('.jobtemplate_instructions[data-id="' + id +'"] i').removeClass(addclass).addClass(removeClass+' tooltip-icon');
		        }
				else if(action_type == 'update_haulier_comment'){
		    			hItem.attr('data-item',text);
			    		$('.hauler-comments[data-id="' + id +'"] i').attr('data-original-title',text);
			    		$('.hauler-comments[data-id="' + id +'"] i').removeClass(addclass).addClass(removeClass+' tooltip-icon');
		        }
		    	else if(action_type=='update_jobtemplate_notes'){
		    			cItem.attr('data-item',text);
			    		$('.jobtemplate_notes[data-id="' + id +'"] i').attr('data-original-title',text);
			    		$('.jobtemplate_notes[data-id="' + id +'"] i').removeClass(addclass).addClass(removeClass+' tooltip-icon');
			    }

		    	$('#job_template_comments').modal('hide');
		    }
		  });
});
$('.internal_quote_modal').click(function() {
	$('#internal_quote_text').css('border','1px solid #ccc');
	var data = $(this).attr('data-item');
	var id = $(this).attr('data-id');
	$('#model_quote_id').val(id);
	$('#internal_quote_text').val(data);
});

$('#search_box_bttn').click(function(){
    $('#search_box_bttn i').toggleClass('fa-search-minus fa-search-plus');
    $('.search_box').slideToggle("slow");
    $('#response,#response_count').slideToggle("fast"); 
});

$('#submit_internal_quote_note').click(function() {
	var text = $('#internal_quote_text').val().trim();
	var id = $('#model_quote_id').val();
		$.ajax({
		    url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
		    type: 'post',
		    dataType: 'html',
		    data : {
		    		'text' : text,
		    		'id' : id,
		    		'action_type' : 'update_internal_quote'
		    },
		    success: function(data) {
		    	var aItem = $('.internal_quote_modal[data-id="' + id +'"]');
		    	if(text != ''){
		    		aItem.attr('data-item',text);
			    	$('.internal_quote_modal[data-id="' + id +'"] i').attr('data-original-title',text);
			    	$('.internal_quote_modal[data-id="' + id +'"] i').removeClass('fa fa-plus-circle').addClass('fa fa-comment tooltip-icon');
		    	}else{
		    		aItem.attr('data-item','');
			    	$('.internal_quote_modal[data-id="' + id +'"] i').attr('data-original-title','');
		    		$('.internal_quote_modal[data-id="' + id +'"] i').removeClass('fa fa-comment tooltip-icon').addClass('fa fa-plus-circle');
		    	}
		    	$('#customer_quote_internal_quote_modal').modal('hide');
		    }
		  });
});

	/**
	 * customer tank days refrsh button
	 * DM-28-Nov-2017
	 */
	$('.btn-refresh-tank-days').click(function(e) {
	    e.preventDefault();
	    $('#customer_tank_paid_days').attr('data-paid-update','yes');
	    calculateCustomerPaidTankDays();
    });

$('#btn_edit_supp_cost').click(function() {
 $('.highlight').removeClass('highlight');
  var success = [];
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
	
$('.chosen').chosen().trigger("chosen:updated");
	
var temp_id = $('#temp_quote_id').val();
var activity = $('#additional_cost_activity').val();
var from_address_code = $('#from_address_code').val();
//var mid_address_code = $('#mid_address_code').val();
var to_address_code = $('#to_address_code').val();


if($('#transport_mode_edit').val() == 'Haulage'){
	var from_city = $('#from_city').val();
	var mid_city = $('#mid_city_new').val();
	var to_city = $('#to_city').val();
}else{
	var from_city = '';
	var mid_city = '';
	var to_city = '';
}

var supprate_additional_cost = $('#supprate_cost_additional').val();
var currencyID = $('#additional_cost_currency_modal').val();
var temp_cost_type = $('#temp_cost_type').val();

if(temp_cost_type == 'ACOST'){
	 var success = [];
	//validation start----
	  highlight($('#additional_cost_activity'), ''); 
	  highlight($('#supprate_cost_additional'), ''); 
	  highlight($('#additional_cost_currency_modal'), '');
	  highlight($('#additional_cost_from_a_code'), '');
	  highlight($('#additional_cost_to_a_code'), '');
	  var check_fields = (success.indexOf(false) > -1);
	  if(check_fields == true){
			$('#edit_supplier_cost').animate({ scrollTop: 0 }, 400);
			$('#responseEdit').empty().prepend(alert_required).fadeIn();
			return false;
		}
	//validation end----
	  
	var json = JSON.stringify({		
		temp_id : temp_id,
		activity : activity,
		supplier : $('#acost_supplier_edit').val(),
		supprate_additional_cost : supprate_additional_cost,
		currency : currencyID,
		temp_cost_type : temp_cost_type,
		selected_curr : $('#currency').val(),
		from_address_code : $('#additional_cost_from_a_code').val(),
		to_address_code : $('#additional_cost_to_a_code').val()
	  });
	  
}else if(temp_cost_type == 'AACTIVITY'){
	
	highlight($('#additional_activity_from_a_code'), ''); 
	highlight($('#additional_activity_to_a_code'), ''); 
	var json = JSON.stringify({
		temp_id : temp_id,
		activity : activity,
		temp_cost_type : temp_cost_type,
		from_address_code : $('#additional_activity_from_a_code').val(),
		to_address_code : $('#additional_activity_to_a_code').val(),
		supplier : $('#aactivity_supplier_edit').val(),
	  });
	
}else if(temp_cost_type == 'EXTRACOST'){
	
	var success = [];
	//validation start----
	  highlight($('#extra_cost_activity_edit'), ''); 
	  highlight($('#supprate_extra_cost_edit'), ''); 
	  highlight($('#extracost_supplier_edit'), '');
	  highlight($('#extra_cost_currency_edit'), '');
	  var check_fields = (success.indexOf(false) > -1);
	  if(check_fields == true){
			$('#edit_supplier_cost').animate({ scrollTop: 0 }, 400);
		    $('#responseEdit').empty().prepend(alert_required).fadeIn();
			return false;
	  }
	//validation end----	
	var json = JSON.stringify({
		temp_id : temp_id,
		temp_cost_type : temp_cost_type,
		activity : $('#extra_cost_activity_edit').val(),
		from_address_code : $('#additional_extra_from_a_code').val(),
		to_address_code : $('#additional_extra_to_a_code').val()
		//extraCost : $('#supprate_extra_cost_edit').val(),
		//supplier : $('#extracost_supplier_edit').val(), 
		//selected_curr : $('#extra_cost_currency_edit').val()
	  });
	
}else{
	var success = [];
	/*if(($('#transport_mode_edit').val() == 'Haulage') && ($('#additional_cost_activity').chosen().val() == 'LOAD')){
		highlight($('#mid_address_code'), '');	
		highlight($('#to_address_code'), '');
	}else if(($('#transport_mode_edit').val() == 'Haulage') && ($('#additional_cost_activity').chosen().val() == 'TIP')){
		highlight($('#mid_address_code'), '');	
		highlight($('#from_address_code'), '');		
	}*/
	 highlight($('#additional_cost_activity'), ''); 
	 var check_fields = (success.indexOf(false) > -1);
	if(check_fields == true){
		$('#edit_supplier_cost').animate({ scrollTop: 0 }, 400);
	    $('#responseEdit').empty().prepend(alert_required).fadeIn();
		return false;
	}
		  

	var json = JSON.stringify({
		temp_id : temp_id,
		activity : activity,
		from_address_code : from_address_code,
		//mid_address_code : mid_address_code,
		to_address_code : to_address_code,
		from_city : from_city,
		mid_city : mid_city,
		to_city : to_city,
		temp_cost_type : temp_cost_type
	  });
}


$('#customer_tank_paid_days').attr('data-paid-update','yes');
$.ajax({
    url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
    type: 'post',
    dataType: 'html',
    data : {
    		'json' : json,
    		'action_type' : 'update_supp_rate'
    },
    success: function(data) {
    	$('#edit_supplier_cost').modal('toggle');
    	getsupplierlist(0);
    	initOrderingNew();
    	update_tank_days();
        update_quote_costs();
    }
  });

	
	
});

function checkIMO(product_id){
	 $.ajax({
		 	url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
		 	dataType: 'json',
		 	type: 'post',
		    data : {
		    		'action_type' : 'imo_check',
		    		'product_id' : product_id
		    },
		    success: function(data) {
		      $('.form-group').find('.form-notice').hide(),
		      $('#is_hazardous_product').val('false');
		      if(data.hazardous) {
		    	  $('.form-group').find('.form-notice').show();
		    	  $('#is_hazardous_product').val('true');
		      }
		    }
		  });
}
/**
* product IMO check
*/
$('#quote-form').on('change', 'select#product', function(e) {
	
  var $this = $(this),
      product_id = $this.find(':selected').val();
  checkIMO(product_id);

  // fill business type and quote div
  $.ajax({
	    url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
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
	    	var arrData = data.split('|');
	    	 $('#job_template_type').chosen().val(arrData[1]).trigger("chosen:updated");
	    	 $('#job_template_type').trigger("change");//To apply the Bussiness type changes
	    	 if(arrData[0] != ''){
	    		 $('#job_quote_div_disable').attr('disabled', 'disabled');
	    		 $('#job_quote_div_disable').data('chosen').search_field_disabled();
	    		 $('#job_quote_div_disable').chosen().val(arrData[0]).trigger("chosen:updated"); 	
	    	 }else{
	    		 $('#job_quote_div_disable').attr('disabled', false); 
	    		 $('#job_quote_div_disable').chosen().val('').trigger("chosen:updated"); 	
	    	 }
	    	 if(arrData[2] >= 20){	
		    	 $('#heating-alert-box').removeClass('hidden');
	         }
	         else{
	           $('#heating-alert-box').addClass('hidden'); 
	         }	    	 
	    	 $('#job_quote_div').val(arrData[0]);
	    	 $('.product_loader').hide();
	    }
	  });
});

/**
* product is compactable for particular process
*/
/*$('#quote-form').on('change', 'select#job_template_type,select#job_quote_div', function(e) {
  var $this = $(this),
      type = $this.find(':selected').val(),
      selectboxid = $this.attr('id');
  if( $('#product').val() != ''){
	// fill business type and quote div
	  $.ajax({
		    url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
		    type: 'post',
		    dataType: 'html',
		    data : {
		    		'action_type' : 'compatible_type_quote',
		    		'type' : type,
		    		'selectboxid' : selectboxid,
		    		'product_id' : $('#product').val()
		    },
		    success: function(data) {	    	
		    	if(data == 0){
		    		BootstrapDialog.show({title: 'Job Template', message : 'The selected product is not compatible with the selected division. Please check the product and division you have chosen.'});
		    		//alert('')
		    	}
		    }
		  });
  }
  
});*/

/**
* route search/filtering
*/
$('.get_routes').on('change', 'select', function(e){

  var $form = $(this).parents('form.get_routes'),
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
	    value: $('#tank_type').find(':selected').val()
	  });
  }
  if(transport_mode_id == 7){
	  form_data.push({
		    name: "terms",
		    value: $('#terms-search').find('option:selected').text()
		  }); 
	  form_data.push({
		    name: "currency",
		    value: $('#currency').find('option:selected').text()
		  }); 
  }

  form_data.push({
    name: "product_id",
    value: $('#product').find(':selected').val()
  });
  
  
  //value for render route to job template page
  form_data.push({
	    name: "render_type",
	    value: 'job_template'
	  });

  form_data.push({
	    name: "edit_sc_id",
	    value: $('#t_mode_edit_id').val()
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
      //if the table exist show the drop downs div
      if($('.transmode-table').length > 0){
    	  $('#common-address').show();
      }
      $('.radio-transport-mode-route[value="'+ $('#t_mode_edit_id').val() +'"]').attr('checked',true);
    },
    error: function(response){
      $table_wrapper.append(alert_error).fadeIn();
      $(".quote-transportmode-ajax").hide();
    }
  });
});


/**
 * Re-calculates total quote cost
 */
function update_total_cost() {
  var total_tank_cost = parseFloat($('#total_tank_cost').val()),
  supplier_costs_total = parseFloat($('#supplier_costs_total').val()),
  margin = parseFloat($('#margin').val());
  var calculated_surcharge = parseFloat($('#calculated_surcharge').val());

  total_tank_cost = isNaN(total_tank_cost) ? 0 : total_tank_cost;
  supplier_costs_total = isNaN(supplier_costs_total) ? 0 : supplier_costs_total;
  margin = isNaN(margin) ? 0 : margin;
  calculated_surcharge = isNaN(calculated_surcharge) ? 0 : calculated_surcharge;

  //$('#total_quote_cost').val((total_price + margin).toFixed(2)); 
  $('#total_cost').val((supplier_costs_total + total_tank_cost).toFixed(2)); 
  update_rounded_cost();
  update_new_margin()
}


/**
 * Re-calculcate rounded quote cost
 */
function update_rounded_cost() {
  var surcharge_rate = 0.00;
  var total_cost = parseFloat($('#total_cost').val()),
      cost_adjustment = parseFloat($('#cost_adjustment').val()),
      //rounded_cost = Math.ceil(total_cost/5) * 5;
  cost_adjustment = isNaN(cost_adjustment) ? 0 : cost_adjustment;
  
  //var grandToatal =  rounded_cost+cost_adjustment;
  //new calcultions 
  //by new calculation everting will be taken as same above
  var grandToatal =  parseFloat($('#rounded_quote_cost').val());
  var rounded_cost =  parseFloat($('#rounded_quote_cost').val());
  grandToatal = isNaN(grandToatal) ? 0 : grandToatal;
  rounded_cost = isNaN(rounded_cost) ? 0 : rounded_cost;
  var grandToatalCopy = grandToatal;
  //$('[name="rounded_quote_cost"]').val(grandToatal.toFixed(2));
  $('#rounded_cost').val(rounded_cost.toFixed(2));
  
	// calculate supp rate charges
	var surcharge = parseFloat($('#fuel_surcharge_amount').val());
	surcharge = isNaN(surcharge) ? 0 : surcharge;
	
	var fuel_surcharge_percentage = $('#fuel_surcharge_percentage').val();
	fuel_surcharge_percentage = isNaN(fuel_surcharge_percentage) ? 0 : fuel_surcharge_percentage;
	 
	 if(surcharge != '' || fuel_surcharge_percentage != ''){
		 if(surcharge == '' || surcharge == 0){
			 var surcharge_rate = grandToatal * (fuel_surcharge_percentage / 100);
			 grandToatal *= 1 + (fuel_surcharge_percentage / 100);
		 }else{
			 grandToatal += surcharge
			 var surcharge_rate = surcharge;
		 }
	 }
	 $('#calculated_surcharge').val(surcharge_rate.toFixed(2));
	 $('#total_customer_rate').val((grandToatalCopy + surcharge_rate).toFixed(2)); 

}

/**
 * Re-calculcate rounded quote cost
 */
function calculate_margin_by_surcharge() {
  var surcharge_rate = 0.00;
  //margin ccalcunation new start----------------------
  var total_cost_new = parseFloat($('#rounded_quote_cost').val());
	var default_total_cost = parseFloat($('#total_cost').val());
	var currentMargin =  parseFloat($('#margin').val());
	var calculated_surcharge = parseFloat($('#calculated_surcharge').val());
	
	total_cost_new = isNaN(total_cost_new) ? 0 : total_cost_new;
	default_total_cost = isNaN(default_total_cost) ? 0 : default_total_cost;
	currentMargin = isNaN(currentMargin) ? 0 : currentMargin;
	calculated_surcharge = isNaN(calculated_surcharge) ? 0 : calculated_surcharge;
	
	var oldMargin = total_cost_new - default_total_cost;
	//margin ccalcunation new end----------------------
	
  //new calcultions 
  //by new calculation everting will be taken as same above
  var grandToatal =  parseFloat($('#rounded_quote_cost').val());
  var rounded_cost =  parseFloat($('#rounded_quote_cost').val());
  grandToatal = isNaN(grandToatal) ? 0 : grandToatal;
  rounded_cost = isNaN(rounded_cost) ? 0 : rounded_cost;
  
  //$('[name="rounded_quote_cost"]').val(grandToatal.toFixed(2));
  $('#rounded_cost').val(rounded_cost.toFixed(2));
  
	// calculate supp rate charges
	var surcharge = parseFloat($('#fuel_surcharge_amount').val());
	surcharge = isNaN(surcharge) ? 0 : surcharge;
	
	var fuel_surcharge_percentage = $('#fuel_surcharge_percentage').val();
	fuel_surcharge_percentage = isNaN(fuel_surcharge_percentage) ? 0 : fuel_surcharge_percentage;
	 
	 if(surcharge != '' || fuel_surcharge_percentage != ''){
		 if(surcharge == '' || surcharge == 0){
			 var surcharge_rate = grandToatal * (fuel_surcharge_percentage / 100);
			 grandToatal *= 1 + (fuel_surcharge_percentage / 100);
		 }else{
			 grandToatal += surcharge
			 var surcharge_rate = surcharge;
		 }
	 }
	 var finalMargin = oldMargin + surcharge_rate;
	 $('#calculated_surcharge').val(surcharge_rate.toFixed(2));
	 $('#margin').val(finalMargin.toFixed(2)); 
	 update_new_margin();

}

$(window).on('load', update_rounded_cost);


function decimalNumberJobtemplate(data) {
	var re = /^-?\d+(\.\d{1,2})?$/;
    var result = 0;
    
    if(data.value != "")
    {
	    result = parseFloat(data.value).toFixed(2);
	    
	    if(!re.test(data.value))
	    {
	    	if(result != 'NaN'){
	    		$(data).val(result);
	    	} else {
	    		$(data).val('');
	    	}
	    } else {
	    	if(result == 0) $(data).val(0);
	    	if(result > 99999999) {
	    		alert('You have exceeded the maximum limit!\n Your entered value will be truncated to 8 digits.');
	    		result = result.substring(0, 8);
	    	} else if(result < -9999999) {
	    		alert('You have crossed the minimum allowable limit!\n Your entered value will be truncated to 7 digits.');
	    		result = result.substring(0, 8);
	    	} 
	    	 result = parseFloat(result).toFixed(2);
	    	 $(data).val(result);
	    }
    }
    //update_quote_costs();
    update_rounded_cost();
}

    
/**
 * Re-calculates quote sub-totals
 */
function update_quote_costs() {
  var margin = parseFloat($('#margin').val()),
      tank_days = parseInt($('#tank_days').val()),
      imco_free_tank_days = parseInt($('#job_template_cust_free_days').val()),
      origin_days = parseInt($('#jt_prdem_cust_free_days').val()),
      repo_tank_days = parseInt($('#tank_repo_days').val()),
      tank_days_custom = parseInt($('#tank_days_adjustment').val());
  	  tank_days_custom = isNaN(tank_days_custom) ? 0 : tank_days_custom;
  	  imco_free_tank_days = isNaN(imco_free_tank_days) ? 0 : imco_free_tank_days;
  	  origin_days = isNaN(origin_days) ? 0 : origin_days;
  	  repo_tank_days = isNaN(repo_tank_days) ? 0 : repo_tank_days;
  
  var tank_rate_per_day = parseFloat($('#rate_per_day').val()),
  	  tank_days = tank_days += origin_days,	
      tank_days = tank_days += tank_days_custom,
      tank_days = tank_days += imco_free_tank_days,
      tank_days = tank_days += repo_tank_days,
      tank_cost = tank_days * tank_rate_per_day,
      currency = $('#currency').chosen().val(),
      total_price = 0,
      supplier_costs_total = 0,
      additional_costs = 0,
      converted_tank_cost;
  //	var surcharge = parseFloat($('#fuel_surcharge_amount').val());
 // 	surcharge = isNaN(surcharge) ? 0 : surcharge;
  //alert(tank_rate_per_day);

  if(currency === undefined){
    converted_tank_cost = perform_conversion(tank_cost, btl_default_currency_id, $('#supplier-costs').attr('data-currency'));
  } else {
    converted_tank_cost = perform_conversion(tank_cost, btl_default_currency_id, currency);
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
 // total_price += surcharge;

  // add-up tank costs
  converted_tank_cost = parseFloat(converted_tank_cost).toFixed(2);

  $('#total_tank_cost,#total_tank_cost_new').val(converted_tank_cost);
  total_price += parseFloat(converted_tank_cost);

  if($('#page').attr('data-url') == 'customer-quotes') {
	$('#tank_imco_free_days').val(imco_free_tank_days);
	$('#tank_origin_free_days').val(origin_days);
    $('#supplier_costs_total,#supplier_costs_total_new').val(supplier_costs_total.toFixed(2));
    $('#saved-cost').val(total_price.toFixed(2));
    $('#total_cost').val(total_price.toFixed(2));
    
    $('#tank_days_total').val(tank_days)
    

    update_total_cost();
  }
};

if( $('input[name="customer_quote_id"]').val() == 0  && $('#pageType').val() == 'new') 
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

$('#rate_per_day, #tank_days,#cost_adjustment').on('input propertychange paste', function(){
  update_quote_costs();
});


/**
* update total quote cost on margin change
*/
//$('#margin').on('input propertychange paste', update_total_cost);

$('#tank_days_adjustment,#job_template_cust_free_days,#jt_prdem_cust_free_days,#tank_repo_days').on('input propertychange paste', update_quote_costs);
//$('#fuel_surcharge_amount,#fuel_surcharge_percentage').on('input propertychange paste', update_quote_costs);
$('#fuel_surcharge_amount,#fuel_surcharge_percentage').on('change propertychange paste', calculate_margin_by_surcharge);
//$('#total_cost').on('input propertychange paste', update_total_cost);
$('#rounded_quote_cost').on('change propertychange paste', update_new_margin);

if($('#page').attr('data-url') == 'customer-quotes') {
  if($('#currency').length) {
    update_tank_days();
    update_quote_costs();
  }
}

/**
 * 
 */
function update_new_margin(){

	var total_cost_new = parseFloat($('#rounded_quote_cost').val());
	var default_total_cost = parseFloat($('#total_cost').val());
	var currentMargin =  parseFloat($('#margin').val());
	var calculated_surcharge = parseFloat($('#calculated_surcharge').val());
	
	total_cost_new = isNaN(total_cost_new) ? 0 : total_cost_new;
	default_total_cost = isNaN(default_total_cost) ? 0 : default_total_cost;
	currentMargin = isNaN(currentMargin) ? 0 : currentMargin;
	calculated_surcharge = isNaN(calculated_surcharge) ? 0 : calculated_surcharge;
	
	var calculated_margin = calculated_surcharge + total_cost_new - default_total_cost;
	$('#margin').val(calculated_margin.toFixed(2));
	update_rounded_cost();
}

function update_tank_days() {
	  var $tank_days = $('#tank_days').val(),
      total_tank_days = 0;

  $('#supplier-costs').find('input[name="days_in_transit"]').each(function(){
    total_tank_days += Number($(this).val());
  });
  
  if(total_tank_days == 0 && $('#total_tank_days_from_db').val() > 0 ){
	  //$('#is_tank_update').val('yes');
	  total_tank_days = $('#total_tank_days_from_db').val();
  }

  if($('#is_tank_update').val() == 'yes'){
	 $('#tank_days').val(total_tank_days);  
  }
};


$('#customer_quote_modal').on('hidden.bs.modal', function(){
  $("#transport_mode option:first-child").attr('selected', 'selected');
  $('#modal-supplier-costs-table').empty();
  $('.modal-form').hide();
});
/**
 * remove close in choosen ds -job-template
 */
$('#terms-search').change(function(){
	if($(this).val() == ''){
		$(this).val('DR-PR').trigger("chosen:updated");
		// $('.chosen').chosen().trigger("chosen:updated");
	}
});
$('#terms').change(function(){
	if( $(this).val() == 5 ){ //oncarriage(PR-DR)
		$('#job_template_cust_free_days,#job_template_cust_free_days_amount').val('0');

		$('.imco-div').hide(100);
		$('.demtk-import-div').show(100);
	}else{
		$('#demtk_include_import_job').attr('checked',false);
		$('.imco-div').show(100);
		$('.demtk-import-div').hide(100);
	}
});
/**
 * Selecting a transport mode...
 */
$(document).on('change','#transport_mode', function(){
  // drop down operations common	
  $('#common-address').hide();
  $('.activity-selector,.address-selector').val('').trigger("chosen:updated"); 
  //$('#customer_quote_modal .chosen').chosen().trigger("chosen:updated");
   
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
      url: appHome+'/supplier-costs/search',
      data: [{
        name: "product_id",
        value: $('#product').find(':selected').val(),        
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
  var currency_id = $('#currency').val();
  $('#additional_cost_currency,#extra_cost_currency').val(currency_id);
  $('#additional_cost_currency,#extra_cost_currency').chosen().val(currency_id).trigger("chosen:updated");
  	
  $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
  currency_name = $currency.attr('data-label');

  if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
	 $('.modal_currency i').removeClass().html("").addClass('fa currency-fa fa-' + currency_name.toLowerCase());
  }
  else {
	  $('.modal_currency i').removeClass().addClass('fa currency-fa').html(currency_name.toUpperCase());
 }

});

$(document).on('change', '.custom-page-pagesize', function(e) {
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('#job-template-list').submit();
});

$(document).on('click', '.jobtemplate-select-all', function(e) {
	 $('#hidden-checked-qno').val('');
	var checkedval = [];
	var status = this.checked; // "select all" checked status
   $('.change-supplier-rate').each(function(){ //iterate all listed checkbox items
       this.checked = status; //change ".checkbox" checked status
       if(status == true){
       	var qno = $(this).attr('data-id');
       	checkedval.push(qno);
       }
       
   });
   $('#hidden-checked-qno').val(checkedval);
	
});

$(document).on('click', '.change-supplier-rate', function(e) {
	$('#hidden-checked-qno').val('');
	$('.jobtemplate-select-all').prop('checked',false);
	var checkedval = [];
	$('.change-supplier-rate:checked').each(function(){ //iterate all listed checkbox items
		var selqno = $(this).attr('data-id');
		checkedval.push(selqno);
        
    });
   $('#hidden-checked-qno').val(checkedval);
	
});
//check
$(document).on('click', '#apply_new_supp_rates', function(e) {		
	
	var cnnos = $('#hidden-checked-qno').val();
	if(cnnos != ''){
		$('#apply_new_supp_rates').attr('disabled','disabled');
		$('#apply_new_supp_rates').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Apply Supplier Costs Manually");
		 $.ajax({
		      type: 'POST',
		      timeout: 90000,
		      url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
		      data: {
		    	  'cnnos': cnnos,
				  'action_type' : 'supplier_rate_apply'
		      },
		     beforeSend: function() {
		            // setting a timeout
		    	 $('.full_relative').show();
		     },
		      success: function(response) {		    	  
		    	  location.reload();
		    	  localStorage.setItem('response', response);
		    	  $('.full_relative').hide();
		      },
		      error: function(response){
 		          $('html, body').animate({ scrollTop: 0 }, 400);
 		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
 		        }
		    });
	}else{
		$('html, body').animate({ scrollTop: 0 }, 400);
         $('#response').empty().prepend('<div class="alert alert-danger alert-dismissable"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please Select any Checkbox</div>').fadeIn();
		
	}
}); 

//automatically apply supp rate
$(document).on('click', '#apply_new_supp_rates_automatically', function(e) {		
	
		$('#apply_new_supp_rates_automatically').attr('disabled','disabled');
		$('#apply_new_supp_rates_automatically').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Apply");
		 $.ajax({
		      type: 'POST',
		      timeout: 90000,
		      url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
		      data: {
				  'action_type' : 'supplier_rate_apply_automatically'
		      },
		     beforeSend: function() {
		            // setting a timeout
		    	 $('.full_relative').show();
		     },
		      success: function(response) {	
		    	  
		    	  location.reload();
		    	  localStorage.setItem('response', response);
		    	  $('.full_relative').hide();
		      },
		      error: function(response){
 		          $('html, body').animate({ scrollTop: 0 }, 400);
 		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
 		        }
		    });
});

$(document).on('click', '.job_template_change_status,.delete-job-template', function(e) {
	 e.preventDefault();
	var quoteNo = $(this).attr('data-id');
	if($(this).hasClass('job_template_change_status')){
		var changeTo = $(this).attr('data-quote-change-to');
		var flag = 1;
	}else{
		var changeTo = 'trash';
		var flag = 0;
	}
	var message = 'Are you sure want to move <strong>'+quoteNo+'</strong> to '+changeTo.charAt(0).toUpperCase() + changeTo.slice(1);+' ?';
	
	if(changeTo == 'live'){
		var mtype = BootstrapDialog.TYPE_SUCCESS;
		var mButton = 'btn-success';
	}else if(changeTo == 'archive'){
		var mtype = BootstrapDialog.TYPE_PRIMARY;
		var mButton = 'btn-primary';
	}else if(changeTo == 'pending'){
		var mtype = BootstrapDialog.TYPE_WARNING;
		var mButton = 'btn-warning';
	}else{
		var mtype = BootstrapDialog.TYPE_DANGER;
		var mButton = 'btn-danger';
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
	     		        url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
	     		        data: {
	     		      	  'quoteNo' : quoteNo,
	     		      	  'action_type' : 'change_quote_status',
	     		      	  'changeTo' : changeTo
	     		        },
	     		       beforeSend: function() {
	     		        	$('.bootstrap-dialog-footer-buttons > .'+mButton).html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		     		        $('.bootstrap-dialog-footer-buttons > .'+mButton).attr('disabled','disabled');
	     		        },
	     		        success: function(response){
	     		        	if(flag == 1){
	     		        		location.reload();
	     		        	}else{
	     		        		window.location.href = getDsReturnPath();
	     		        	}
	     		            localStorage.setItem('response', response);
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

/**
 * When a new cost is added to a quote...
 */
$(document).on('click', '#add-supplier-cost', function(e) {
	var prevetSubmit = 0;
	$('#total_tank_days_from_db').val(0);
	$('#is_tank_update').val('yes');
	//$('.chosen').chosen().trigger("chosen:updated");
  var success = [];
  
  function functionSendMail(supp_cost_id, quote){
		$.ajax({
	        type: 'POST',
	        url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
	        data: {
	      	  'quote' : quote,
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
  }
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
  var l = 1;
  if($('.transmode-table-main tbody .supplier-row').length > 0){
	var larr = $(".transmode-table-main tbody .supplier-row").map(function() {
		return $(this).attr('data-trorder');
	}).get();//get all data values in an array
	if(larr.length > 0){
		var l = Math.max.apply(Math, larr) + 1;//find the highest value from them
	}
  }
  
  var business_type = $('#job_template_type').val();
  if(business_type == 'REPO'){
  	transport_mode = $('.repo-control').val();
  }
  else{
  	transport_mode = $('.normal').val();
  }

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
				$('#customer_quote_modal').animate({ scrollTop: 0 }, 400);
				$('#responseCreate').empty().prepend(alert_required).fadeIn();
				return false;
		 }
	//validation end----
	  
	  var json = JSON.stringify({
		  transport_mode: transport_mode,
		  table_row_count : l,
		  quoteNumber : $('#customer_quote_id').val(),
		  randomNumber : $('#random_number').val(),
		  activity : $('#activity').val(),
		  supplier : $("#acost_supplier").val(),
		  additionalCost : $('#supprate_additional_cost').val(),
		  additionalCurrency : $("#additional_cost_currency").val(),
		  selected_curr : $('#currency').val(),
		  from_address : $('#acost-from-address').val(),
		  to_address : $('#acost-to-address').val(),
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
				$('#customer_quote_modal').animate({ scrollTop: 0 }, 400);
				$('#responseCreate').empty().prepend(alert_required).fadeIn();
				return false;
		 }
	  //validation end----
	  var json = JSON.stringify({
		  transport_mode: transport_mode,
		  table_row_count : l,
		  quoteNumber : $('#customer_quote_id').val(),
		  randomNumber : $('#random_number').val(),
		  activity : $('#additional_activity_no_cost').val(),
		  from_address : $('#aactivity-from-address').val(),
		  to_address : $('#aactivity-to-address').val(),
		  supplier : $('#aactivity_supplier').val(),
	  });
	  saveToTable(json);
  }else if(transport_mode == 'EXTRACOST'){
	  
	  var checkedData = [];	 
	  var success = [];
	  
	  $('.supplierextracostCheckbox:checked:not(:disabled)').each(function(){
		  checkedData.push({'id':$(this).val(),
			  				'transportMode':$(this).attr('data-transport-id'), 
			  				'supp_id':$(this).attr('data-supp_id'),
			  				'data_currency':$(this).attr('data-currency'),
			  				'data_curr_id':$(this).attr('data-curr-id'),
			  				'cost_type_id':$(this).attr('data-cost-type-id')
			  			   });
	  });
	  //validation start----
	  highlight($('#extracost_activity'), ''); 
	  highlight($('#extracost_supplier'), '');
	  highlight($('#extracost-from-address'), '');
	  highlight($('#extracost-to-address'), '');
	  var check_fields = (success.indexOf(false) > -1);
		  
	  if(check_fields == true){
			$('#customer_quote_modal').animate({ scrollTop: 0 }, 400);
			$('#responseCreate').empty().prepend(alert_required).fadeIn();
			return false;
	 }
	  var selectedCheck = $('input[name="supplier_cost_checkbox"]:checked').not(":disabled");
	// return if no cost has been selected
		if(!selectedCheck.length) {
		    return false;
		}
	  
	  //validation end----
	  var json = JSON.stringify({
		  transport_mode: transport_mode,
		  table_row_count : l,
		  quoteNumber : $('#customer_quote_id').val(),
		  randomNumber : $('#random_number').val(),
		  activity : $('#extracost_activity').val(),
		  checkedData : checkedData,
		  supplier : $('#extracost_supplier').val(), 
		  selected_curr : $('#currency').val(),
		  from_address : $('#extracost-from-address').val(),
		  to_address : $('#extracost-to-address').val(),
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
	  if(transport_mode == 7){
		  highlight($('#terms-search'), '');
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
	  var supplier_cost_id = selected.val();
	// check to see if the cost has already been added to the quote
	  supplier_costs.find('input[name="supplier_cost_ids[]"]').each(function(){
		  var costType = $(this).attr('data-cost-type');
		  
	    if((supplier_cost_id === $(this).val() && costType == '')){
	      error = 1;
	    }
	  });
	  
	  // check if item is invalid
	  if(validCount == 'invalid' && $('#t_mode_edit_id').val() != supplier_cost_id) {
		  BootstrapDialog.confirm('Invalid Supplier Rate Selected. Do you wish to proceed ?', function(result){
			  if(result) {
				  var suppid = selected.parents('tr').find( "td:eq(1)" ).find('[name="supplier_cost_ids[]"]').val();
				  var quote = $('#supplier_cost_quote_id').attr('data-temp-quote-id');
				  if($('#form_type').val() == 'edit'){
					//functionSendMail(suppid, quote);
				  }else{
					$('#hidden-expire-id').val($('#hidden-expire-id').val()+','+suppid);
				  }
				  $('#hidden_mail_send').val('invalid');
				  selected.attr('data-valid','');
				  $('#add-supplier-cost').trigger('click');
			  } 
		  });
		  return false;
	  }
	  
	  var json = JSON.stringify({
		  supplier_cost_id: supplier_cost_id,
		  product_id: $('#product').val(),
		  hazardous: $('#is_hazardous_product').val(),
		  transport_mode: transport_mode,
		  tank_type : $('#tank_type').val(),
		  tank_state : $('#tank_state_'+transport_mode).val(),
		  table_row_count : l,
		  quoteNumber : $('#customer_quote_id').val(),
		  randomNumber : $('#random_number').val(),
		  selected_curr : $('#currency').val(),
		  finalCost : finalCost,
		  from_address : $('#common-from-address').val(),
		  to_address : $('#common-to-address').val(),
		  activity : $('#common-ativity').val(),
		  imco_terms : $('#terms-search').val()
	  });
	  // the cost already exists as a part of this quote, display error and return
	  // checking only for adding costs
	  if(error !== 0 && $('#t_mode_edit_id').val() != supplier_cost_id) {
		 
		  if(transport_mode == 1){
			  BootstrapDialog.show({
			      title: 'Uh oh!',
			      type: BootstrapDialog.TYPE_DANGER,
			      message: 'This Supplier Rate has already been added to the Job Template, please select a different one to continue.',
			      buttons: [{
			        label: 'OK',
			        action: function(dialogItself){
			          dialogItself.close();
			        }
			      }]
			    });
			  return false;
		  }else{
			  var message = 'This Supplier Rate has already been added to the Job Template, do you want to proceed?';
			  BootstrapDialog.confirm(message, function(result){
				  if(result){					  
					  saveToTable(json);
				  }
			  }); 
		  }
		  
	  }else{
		  saveToTable(json);
	  }

  }

  function saveToTable(json){
  	  $('#add-supplier-cost').attr('disabled',true);
  	  var updateId = $('#add-supplier-cost').attr('update-id');
	  $('#customer_tank_paid_days').attr('data-paid-update','yes');
	  var nextRowId = $('.supplier-row[data-temp-quote-id="'+updateId+'"]').next('.supplier-row').attr('data-temp-quote-id');
	  	$.ajax({
		      type: 'POST',
		      url: appHome+'/jobtemplate-quotes-deepsea/save_supp_cost',
		      //async : false,
		      data: {
		    	  'json': json,
		    	  'nextRowId' : (nextRowId != undefined) ? nextRowId : 0,
		    	  'updateId' : updateId,
		      },
		      success: function(response) {
		    	  	$('#customer_quote_modal').modal('toggle');
		    	  	getsupplierlist(0);
				  	initOrderingNew();
				  	update_tank_days();
				  	update_quote_costs();
		      }
		});
  }
//end save to table------------------------------------------

});

$(document).on('click', '.edit_supplier_rate', function(e){
	var temp_id = $(this).attr('data-id');
	var options = $("#hidden_select_code > option").clone();
	var cities = $("#hidden_supp_city > option").clone();
	var hidden_supplier = $("#hidden_supplier > option").clone();
	
	var selectedValFrom = $(this).attr('data-from-code');
	var selectedValTo = $(this).attr('data-to-code');
	//var selectedValMid = $(this).attr('data-mid-code');
	
	var selectedValfromTown = $(this).attr('data-from-town');
	var selectedValMidTown = $(this).attr('data-mid-town');
	var selectedValToTown = $(this).attr('data-to-town');
	
	$.ajax({
        type: 'POST',
        url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
        data: {
      	  'temp_id' : temp_id,
      	  'action_type' : 'get_supp_edit_data',
      	  'currency' : $('#currency').val()
        },
        beforeSend: function() {
            // setting a timeout
        	$('#edit_supplier_rate').html("<div class='text-center'><img src="+$('#loaderpath').val()+"></div>");
        },
        success: function(response){
        	$('#edit_supplier_rate').html(response);
        	$('.copy_address_code').append(options);
        	$('.copy_city').append(cities);
        	
        	$('.chosen').chosen().trigger("chosen:updated");
        	$('.to-code').val(selectedValTo);
        	$('.from-code').val(selectedValFrom);
        	
        	$('.from-city').val(selectedValfromTown);
        	$('.mid-city').val(selectedValMidTown);
        	$('.to-city').val(selectedValToTown);
        	
        	//$('.mid-code').val(selectedValMid);
        	$('.chosen').chosen().trigger("chosen:updated");
        	$('.loader').html("");
        	
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
  });
	
});

$(document).on('change', '#customer', function(e){
	var cCode = $('#customer').val();
	var teamId = $('#customer').find(':selected').data('teamid');

	$('#hidden-team-id').val(0);
	$('#team_id').val(teamId).trigger('chosen:updated');
	$('.team_name_loader').hide();
	$('.default_team_msg').addClass('hidden');
	/*if(cCode != ''){
		$.ajax({
	        type: 'POST',
	        url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
	        data: {
	      	  'cCode' : cCode,
	      	  'action_type' : 'get_supp_team_name',
	        },
	        beforeSend: function() {
	            // setting a timeout
	        	$('.team_name_loader').show();
	        },
	        success: function(response){
	        	$('#hidden-team-id').val(response);
	        	$('#team_id').val(response).trigger('chosen:updated');
	        	$('.team_name_loader').hide();
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	  });
	}else{
		$('#team_id').val('');
		$('#hidden-team-id').val('');
	}*/
	
});

$(document).on('change', '#team_id', function(e){
	if($(this).val() != $('#customer').find(':selected').data('teamid')){
		$('.default_team_msg').removeClass('hidden');
		$('#hidden-team-id').val(1);
	}else{
		$('.default_team_msg').addClass('hidden');
		$('#hidden-team-id').val(0);
	}
});

$(document).on('click', '#save_extras', function(e){
	
	 var success = [];
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

	var l = $('.transmode-table-main tbody').find('tr').length;
	l = l+1;
	var checkedData = [];	 
	var success = [];
	var supp_idCommon = '';
	var activtyCommon = ''; 
	
	 
	
	var selected = $('input[name="supplier_cost_checkbox"]:checked').not(":disabled"),
    supplier_costs = $('#supplier-costs'),
    supplier_costs_table = supplier_costs.find('.transmode-table-main'),
    error = 0;
	// return if no cost has been selected
	if(!selected.length) {
	    return false;
	}
	var finalCost = selected.attr('data-final-rate');
	var supplier_cost_id = selected.val();
	// check to see if the cost has already been added to the quote
	supplier_costs.find('input[name="supplier_cost_ids[]"]').each(function(){
	 var costType = $(this).attr('data-cost-type');
	  
    if((supplier_cost_id === $(this).val() && costType == 'EXTRACOST')){
      error = 1;
    }
});
	// the cost already exists as a part of this quote, display error and return
  if(error !== 0) {
    BootstrapDialog.show({
      title: 'Uh oh!',
      type: BootstrapDialog.TYPE_DANGER,
      message: 'This Supplier Rate has already been added to the Job Template, please select a different one to continue.',
      buttons: [{
        label: 'OK',
        action: function(dialogItself){
          dialogItself.close();
        }
      }]
    });

	return false;
}
	  
	  $('.supplierextracostCheckbox:checked:not(:disabled)').each(function(){
		  checkedData.push({'id':$(this).val(),
			  				'transportMode':$(this).attr('data-transport-id'), 
			  				'supp_id':$(this).attr('data-supp_id'),
			  				'data_currency':$(this).attr('data-currency'),
			  				'data_curr_id':$(this).attr('data-curr-id'),
			  				'cost_type_id':$(this).attr('data-cost-type-id')
			  			   });
		  supp_idCommon = $(this).attr('data-supp-code');
		  activtyCommon = $('#extracost_activity_plus').val();
	  });
	  
	  highlight($('#extracost_activity_plus'), '');
	  highlight($('#extracost-from-address-plus'), '');
	  highlight($('#extracost-to-address-plus'), '');
	  
	  var check_fields = (success.indexOf(false) > -1);
	  if(check_fields === false){	  
	  
		  var json = JSON.stringify({
			  transport_mode: 'EXTRACOST',
			  table_row_count : l,
			  quoteNumber : $('#customer_quote_id').val(),
			  randomNumber : $('#random_number').val(),
			  activity : activtyCommon,
			  checkedData : checkedData,
			  supplier : supp_idCommon, 
			  selected_curr : $('#currency').val(),
			  from_address : $('#extracost-from-address-plus').val(),
			  to_address : $('#extracost-to-address-plus').val(),
			  
		  });
		  $('#customer_tank_paid_days').attr('data-paid-update','yes');
		  $.ajax({
		      type: 'POST',
		      url: appHome+'/jobtemplate-quotes-deepsea/save_supp_cost',
		      async : false,
		      data: {
		    	  'json': json
		      },
		      success: function(response) {
		    	  $('#customer_quote_extras_modal').modal('toggle');
		    	  
		      }
		    });
		  getsupplierlist(0);
		  initOrderingNew();
		  update_tank_days();
		  update_quote_costs();
	  }

	
});
//new
$(document).on('click', '.get-extra-cost-icon', function(e){

	$('.activity-selector,.address-selector,#extracost_activity_plus').val('').trigger("chosen:updated"); 	
	$('#responseCreate,#modal-supplier-costs-extras-table').html('');
	var supp_id = $(this).attr('data-supp-id');
	var transportmodeID = $(this).attr('data-transport-mode');
	var activity = $(this).attr('data-activity');
	if(supp_id != '' && transportmodeID != ''){
		$.ajax({
	        type: 'POST',
	        url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
	        data: {
	      	  'supp_id' : supp_id,
	      	  'transportmodeID' : transportmodeID,
	      	  'activity' : activity,
	      	  'action_type' : 'get_supp_extra_cost',
	      	  'currency' : $('#currency').val()
	        },
	        beforeSend: function() {
	            // setting a timeout
	        	$('#modal-supplier-costs-extras-table').html("<div class='text-center'><img src="+$('#loaderpath').val()+"></div>");
	        },
	        success: function(response){
	        	$('#modal-supplier-costs-extras-table').html(response);

	        var supplier_costs = $('#supplier-costs table');
	      	// check to see if the cost has already been added to the quote
	      	supplier_costs.find('.extracost-disable-EXTRACOST').each(function(){
	      		 
		      	var costTypeId = $(this).attr('data-extracost-id');
		      	$('.supplierextracostCheckbox[data-cost-type-id='+costTypeId+']').attr('checked',true);
		      	$('.supplierextracostCheckbox[data-cost-type-id='+costTypeId+']').attr("disabled", true);
		      		 //alert($(this).val());
	      	  });
	        	//$('.chosen').chosen().trigger("chosen:updated");
	        	$('.loader').html("");
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	  });
	}else{
		$('#modal-supplier-costs-extras-table').html('');
	}


});

$(document).on('change', '#extracost_supplier', function(e){
	$('#responseCreate').html('');
	var supp_id = $(this).val();
	var isEditMode = $('#t_mode_edit_id').val();
	if(supp_id != ''){
		$.ajax({
	        type: 'POST',
	        url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
	        data: {
	      	  'supp_id' : supp_id,
	      	  'action_type' : 'get_supp_extra_cost',
	      	  'currency' : $('#currency').val(),
	      	  'isEditMode' : isEditMode
	        },
	        beforeSend: function() {
	            // setting a timeout
	        	$('#extracost-supp-rate').html("<div class='text-center'><img src="+$('#loaderpath').val()+"></div>");
	        },
	        success: function(response){
	        	$('#extracost-supp-rate').html(response);
	            var supplier_costs = $('#supplier-costs');
	      		// check to see if the cost has already been added to the quote
	      	  	supplier_costs.find('input[name="supplier_cost_ids[]"]').each(function(){
		      		var costType = $(this).attr('data-cost-type');
		      		
		      	    if(($('#extracostcheckbox-'+$(this).val()).val() == $(this).val() && costType == 'EXTRACOST')){
		      	    	$('#extracostcheckbox-'+$(this).val()).attr('checked',true);
		      	    	$('#extracostcheckbox-'+$(this).val()).attr("disabled", true);
		      	    }
		      	 });
	      	  	if(isEditMode != ""){ //override in edit mode
	      	  		$('#extracostcheckbox-'+isEditMode).attr('checked',true);
		      		$('#extracostcheckbox-'+isEditMode).attr("disabled", false);
	      	  	}
	        	//$('.chosen').chosen().trigger("chosen:updated");
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


});


/**
* delete supplier cost from transport modes // delete-supplier-cost-tansport-mode
*/
$(document).on('click', '.delete_supplier_cost_jobtemplate', function(e){
	$('#is_tank_update').val('yes');
  e.preventDefault();
  var table = $(this).closest('table'),
      row = $(this).closest('tr'),
      message = 'Are you sure you want to delete this record?';
  var temp_quote_id = row.attr('data-temp-quote-id');
  var quoteNumber = $('#customer_quote_id').val();

  BootstrapDialog.confirm(message, function(result){
    if(result) {
    	$('#total_tank_days_from_db').val(0)
    	$('#customer_tank_paid_days').attr('data-paid-update','yes');
    	$.ajax({
		        type: 'POST',
		        url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
		        data: {
		      	  'temp_quote_id' : temp_quote_id,
		      	  'action_type' : 'delete_job_template_suppCost',
		      	  'quoteNumber' : quoteNumber,
		      	  'randomNumber' : $('#random_number').val()
		        },
		        async : false,
		        success: function(response){
		        },
		        error: function(response){
		          $('html, body').animate({ scrollTop: 0 }, 400);
		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
	      });
      getsupplierlist(0);
      initOrderingNew();
      update_tank_days();
      update_quote_costs();

    }
   
    if($('.supplier-row').length == 0){
    	
    	$('#tank_days').val(0);
    }
    	
    
  });
});

var old_required = alert_required;

$('#no_end_validity').click(function(e){
	$('#customer_surcharge_date_to').parent().removeClass('highlight');
});

/**
* save / update customer quote
*/
$('.save-job-template, .update-job-template').click(function(e){
	
	$('#activity_validation_var').val('yes');
	
	$("#supplier-rates-table-form td").css('border-top','1px solid #ddd');
	$("#supplier-rates-table-form td").css('border-bottom','1px solid #ddd');
	$("#supplier-rates-table-form td").css('border-left','none');
	$("#supplier-rates-table-form td").css('border-right','none');
	
  e.preventDefault();

  	//var form = '#'+$(this).closest('form').attr('id'),
  	var form = '#quote-form',
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
  
  highlight($(form).find('#product'), '');  
  highlight($(form).find('#job_template_type'), ''); 
  highlight($(form).find('#job_quote_div_disable'), ''); 
  highlight($(form).find('#customer'), '');
  highlight($(form).find('#job_template_status'), ''); 
  highlight($(form).find('#job_template_type'), ''); 
  highlight($(form).find('#collection'), '');
  highlight($(form).find('#demtk_customer'), '');
  highlight($(form).find('#delivery'), '');
  highlight($(form).find('#currency'), '');
  highlight($(form).find('#job_template_cust_free_days'), '');
  highlight($(form).find('#tank_hire_currency'), '');
  highlight($(form).find('#terms'), '');
  
  highlight($(form).find('#rounded_quote_cost'), '');
  highlight($(form).find('#cost_adjustment'), '');
  highlight($(form).find('#rounded_cost'), ''); 
  highlight($(form).find('#rate_per_day'), '');
  highlight($(form).find('#margin'),''); 
  highlight($(form).find('#supplier_costs_total'),''); 
  
  notNumber($(form).find('#fuel_surcharge_amount'));
  notNumber($(form).find('#fuel_surcharge_percentage'));
  
  if($('#cur_mes').text() != ""){
	  success.push(false);
	  $('#currency').parent().addClass('highlight');
	  alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Customer code does not match currency selected.</div>';
  }else{
	  success.push(true);
	  $('#currency').parent().removeClass('highlight');
	  alert_required = old_required;
  }
 /* notNumber($(form).find('#rate_per_day'));
  notNumber($(form).find('#rounded_cost'));
 notNumber($(form).find('#cost_adjustment')); 
 notNumber($(form).find('#rounded_quote_cost')); 
 notNumber($(form).find('#margin')); 
 notNumber($(form).find('#supplier_costs_total'));
  */
  
  /*highlight($(form).find('#quote_number'), '');
  highlight($(form).find('#product'), '');
  highlight($(form).find('#tank_type'), '');
  highlight($(form).find('#currency'), '');
  highlight($(form).find('#tank_days'), '');
  highlight($(form).find('#total_cost'), '');
  highlight($(form).find('#total_quote_cost'), '');*/

  /**
   * Route validation
   */
  if($('[name="new_start_city[active]"]').val() === 'yes') {
    highlight($(form).find('[name="new_start_city[country_id]"]'), '');
    highlight($(form).find('[name="new_start_city[name]"]'), '');
  } else {
	//highlight($(form).find('#start_city'), '');  
  }

  if($('[name="new_destination_city[active]"]').val() === 'yes') {
    highlight($(form).find('[name="new_destination_city[country_id]"]'), '');
    highlight($(form).find('[name="new_destination_city[name]"]'), '');
  } else {
	//highlight($(form).find('#destination_city'), '');  
  }
  
  //check if surcharge is entered
  var valSurPer = parseFloat($('#fuel_surcharge_percentage').val());
  var valSurRate = parseFloat($('#fuel_surcharge_amount').val());
  if(valSurPer > 0 || valSurRate > 0){
	  highlight($(form).find('#surcharge_type'), '');
	  highlight($(form).find('#haulage_surcharge_date_from'), '');
  }
  if($('#haulage_surcharge_date_from').val() != "" && !$('#no_end_validity').is(':checked')){
	//highlight($(form).find('#customer_surcharge_date_to'), '');
  }
  
  // activity validation start---------------------

  var check_fields = (success.indexOf(false) > -1);
 
if(($("#supplier-rates-table-form td[data-from-td]").length > 0) && check_fields == false){
		 
	 $("#supplier-rates-table-form td[data-from-td='-']").each(function(){
	      $(this).css('border','2px solid red');
	      $(this).attr('title','From Address Required');
	      success.push(false);
		  $('#tmode_details_btn i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
		  $('#tmode_btn_div').slideDown("slow");
	 });
		 
}
if(($("#supplier-rates-table-form td[data-to-td]").length > 0) && check_fields == false){
	 
	 $("#supplier-rates-table-form td[data-to-td='-']").each(function(){
	      $(this).css('border','2px solid red');
	      success.push(false);
	      $(this).attr('title','To Address Required');
	       $('#tmode_details_btn i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
		   $('#tmode_btn_div').slideDown("slow");
	});
	 
 }
if(($("#supplier-rates-table-form td[data-activity-td]").length > 0) && check_fields == false){
	  $("#supplier-rates-table-form td[data-activity-td='-']").each(function(){
	      $(this).css('border','2px solid red');
	      success.push(false);
	      $(this).attr('title','Activity Required');
		  $('#tmode_details_btn i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
		  $('#tmode_btn_div').slideDown("slow");
	  });	  
  }

/*//check if first haullage is LOAD and other haullages are TIP
var objTmodeData = $("#supplier-rates-table-form td[data-activity-tmode=1]");
if((objTmodeData.length > 0) && check_fields == false){
	var halFlag = 1;	
	$(objTmodeData).each(function(){	
		if(($(this).data('activity-td') != 'LOAD') && (halFlag == 1)){
			$(this).css('border','2px solid red');
			$(this).attr('title','Invalid Activity');
		    success.push(false);
			$('#tmode_details_btn i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
			$('#tmode_btn_div').slideDown("slow");
			
		}else if(($(this).data('activity-td') != 'TIP') && (halFlag > 1)){			
		    $(this).css('border','2px solid red');
		    $(this).attr('title','Invalid Activity');
		    success.push(false);
			$('#tmode_details_btn i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
			$('#tmode_btn_div').slideDown("slow");
		}
	halFlag++;		
	});	 
}
 alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required information below.</div>';
  // activity validation end---------------------
*/  
  var check_fields = (success.indexOf(false) > -1);	
  /**
  * save customer quote
  */
  if($(this).hasClass('save-job-template')){
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
      
      $(".check_validation").each(function() {
          var higilightCount = $(this).find('.highlight').length;
         	if(higilightCount > 0){
         		var topElement = $(this).closest(":has(legend)").find('a i');
         		topElement.removeClass('fa-minus-circle').addClass('fa-plus-circle');
         		 $(this).addClass("in");
         	}
      }); 
      
    } else {
    	var etamessage = etasrWarningMessage();
    		etamessage += demurrageeMessage();
		if(etamessage !=""){
			BootstrapDialog.show({
						type: BootstrapDialog.TYPE_DANGER,
						title: 'Confirmation',
						message: etamessage,
						buttons: [{
							label: 'OK',
							cssClass: 'btn-danger',
							action: function (dialogItself) {
								dialogItself.close();
							}
						}]
					});
		}else{
			  $('.save-job-template').attr('disabled', true);
		      $.ajax({
		        type: 'POST',
		        url: path+'/add',
		        data: $(form).serialize(),
		        success: function(response){
		          window.location.href = getDsReturnPath();
		          localStorage.setItem('response', response);
		        },
		        error: function(response){
		          $('.save-job-template').attr('disabled', false);
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
  if($(this).hasClass('update-job-template')){

    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
      
      $(".check_validation").each(function() {
          var higilightCount = $(this).find('.highlight').length;
         	if(higilightCount > 0){
         		var topElement = $(this).closest(":has(legend)").find('a i');
         		topElement.removeClass('fa-minus-circle').addClass('fa-plus-circle');
         		$(this).slideDown("slow");
         	}
      }); 
      
    } else {

    	var etamessage = etasrWarningMessage();
    	    etamessage += demurrageeMessage();
		if(etamessage !="" ){
			BootstrapDialog.show({
						type: BootstrapDialog.TYPE_DANGER,
						title: 'Confirmation',
						message: etamessage,
						buttons: [{
							label: 'OK',
							cssClass: 'btn-danger',
							action: function (dialogItself) {
								dialogItself.close();
							}
						}]
					});
		}else{
			  $('.update-job-template').attr('disabled', true);
		      $.ajax({
		        type: 'POST',
		        url: '../'+customer_quote_id+'/update',
		        data: $(form).serialize().replace(/%5B%5D/g, '[]'),
		        success: function(response){
		        	window.location.href = getDsReturnPath();
		            localStorage.setItem('response', response);
		        },
		        error: function(response){
		          $('.update-job-template').attr('disabled', false);
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

  // perform db query
  $.ajax({
    type: 'GET',
    url: appHome+'/supplier-costs/extras/'+supplier_id+'&'+customer_quote_id+'&'+supplier_cost_id,
    success: function(response){
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

 function getDsReturnPath(){
 	if($('#returnpath').length > 0 && $('#returnpath').val() != ""){
 		return $('#returnpath').val();
 	}else{
 		return appHome+'/jobtemplate-quotes-deepsea/index';
 	}
 }
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

$('#save_extras').on('click', function(e){/*
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

    var extra_actual_cost = $(this).closest('tr').find('td:eq(2)').html();
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
*/});


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
  $('#modal-customer-quote-cost-info').empty();
  
  var customer_quote_id = $(this).attr('data-quote');
  $('html, body').animate({ scrollTop: 0 }, 400);

  $.ajax({
    type: 'GET',
    url: appHome+'/customer-quotes/customer-quote-cost-info/'+customer_quote_id,
    success: function(response){
      $('#modal-customer-quote-cost-info').empty().append(response).show();
      $('.table')
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
      
      update_quote_costs();
      
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

function switch_currency_icons(currency, currency_icon, applyexchange) {
	
	
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
  //ajaxSwitchCurrency();
  getsupplierlist(applyexchange);
	initOrderingNew();
	 update_tank_days();
   update_quote_costs();
  
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
		  new_value = new_value.toFixed(2);
		  
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
	
	Number.prototype.toFixedDown = function(digits) {
	    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
	        m = this.toString().match(re);
	    return m ? parseFloat(m[1]) : this.valueOf();
	};
	
  var rate = get_rate(currency_from, currency_to);
  if(!rate) {
    alert('Error. No exchange rate found.');
    return false;
  }

  var roundedCost = parseFloat(value * rate);
  roundedCost = roundedCost.toFixedDown(3);
  var converted_cost = (roundedCost).toFixed(2);
  return isNaN(converted_cost) ? 0 : converted_cost;
}


/**
 * On page load...
 */
if($('#page').attr('data-url') == 'customer-quotes') {
  // Setup currency icons
  var new_currency = $('#currency').chosen().val();
  $('#previous_currency').attr('data-currency', '2');

  if(new_currency !== 2) {
    switch_currency_icons($('#currency'), 'currency-fa',0);
    $('#previous_currency').attr('data-currency', new_currency);
  }

  /**
   * IMCO currnecy for deep sea change
   */
  $('#tank_hire_currency').on('change', function() {
		
	  var currency_id = $(this).chosen().val(),
	      $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
	      currency_name = $currency.attr('data-label');

	  if(!$currency.length) {
	    alert('Error. Currency not found.');
	    return false;
	  }
	  if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
	  	$(".tank-hire-curr" ).removeClass().html("").addClass('tank-hire-curr no-change-curr fa currency-fa fa-'+currency_name);
	  }
	  else {
	  	$(".tank-hire-curr" ).removeClass().html(currency_name.toUpperCase()).addClass('tank-hire-curr no-change-curr fa currency-fa');
	  }
  });
$(document).on('change', '#demtk_customer', function(){
	getAllCurrenciesByDEMTKCustomers('change');
	  /*var optionData = $('option:selected', $('#demtk_customer')).attr('data-customer-currency').toUpperCase();
	  $("#tank_hire_currency option:contains("+optionData+")").attr('selected', 'selected').trigger("chosen:updated");
	  if (currency_having_symbols.indexOf(optionData.toUpperCase()) >= 0) {
		  	$(".no-change-curr" ).removeClass().html("").addClass('no-change-curr fa currency-fa fa-'+optionData.toLowerCase());
		  }
		  else {
		  	$(".no-change-curr" ).removeClass().html(optionData.toUpperCase()).addClass('no-change-curr fa currency-fa');
		  }*/

  });
  
  
  
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
      //exchange_rates();
      //exchange_rates_additionalCosts();
      //exchange_rates_extraCost();
      update_quote_costs();
      switch_currency_icons($('#currency'), 'currency-fa',1);
    }
  });
}

/**
 * When the quote currency is changed...
 */
$(document).on("change", "#additional_cost_currency,#extra_cost_currency,#additional_cost_currency_modal",function() {
   var currency_id = $(this).chosen().val(),
	   $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
	   currency_name = $currency.attr('data-label');
   
   if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
	   $('.modal_currency i').removeClass().html("").addClass('fa currency-fa fa-' + currency_name.toLowerCase());
	  }
	  else {
		  $('.modal_currency i').removeClass().addClass('fa currency-fa').html(currency_name.toUpperCase());
	  }
   
 });


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
      converted_additional_cost = converted_additional_cost.toFixed(2);
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
  if(!$('#quote-form').length) {
    return;
  }

  function initOrdering() {/*
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
  */}

  initOrderingNew();
  $('table').on('btlContentChange', initOrderingNew);

  function highlightRow() {
    var $this = $(this);
    $this.css({ outline: '2px dashed rgba(0, 255, 0, 0.8)' });
    setTimeout(function() {
      $this.css({ outline: 'none' });
    }, 1000);
  }

  $('table').on('click', 'a.order--down', function(e) {
    e.preventDefault();
    $('#customer_tank_paid_days').attr('data-paid-update','yes');
    var $this = $(this),
        $row = $this.parents('.supplier-row'),
        $nextRow = $row.next();
    saveOdering($row.attr('data-temp-quote-id'),$nextRow.attr('data-temp-quote-id'),$row.index(),'down');
    $nextRow.after($row); 
    highlightRow.call($row);
    initOrderingNew();
    
  });

  $('table').on('click', 'a.order--up', function(e) {
    e.preventDefault();
    $('#customer_tank_paid_days').attr('data-paid-update','yes');
    var $this = $(this),
        $row = $this.parents('.supplier-row'),
        $nextRow = $row.prev();
    saveOdering($row.attr('data-temp-quote-id'),$nextRow.attr('data-temp-quote-id'),$row.index(),'up');
    $nextRow.before($row);
    highlightRow.call($row);
    initOrderingNew();
  });
  
  /**
   * Add new entry on-the-fly functionality
   */
  $('form').on('click', 'a.add-entry', function(e) {
    e.preventDefault();

    var $this = $(this),
        $fieldGroup = $this.parents('.form-group'),
        $newFields = $fieldGroup.find('.new-fields'),
        $existingFields = $fieldGroup.find('.existing-fields').find('.col-sm-3'),
        $checkBox = $fieldGroup.find('input.new_fields');

    if($newFields.is(':visible')) {
      $checkBox.val('no');
      $newFields.hide();
      $existingFields.show();
      $this.html('Add');
      $fieldGroup.next('.country-div').show();
      $this.parents('.form-group').next('.form-group-second').find('.chosen option[value=""]').attr("selected","selected").trigger("chosen:updated");
      $this.parents('.form-group').find('.chosen option[value=""]').attr("selected","selected").trigger("chosen:updated");
      return false;
    }

    $newFields.show();
    $checkBox.val('yes');
    $newFields.find('.chosen').trigger('chosen:updated');
    $newFields.find('.chosen-container').css({ width: '100%' });
    $existingFields.hide();
    $this.html('Cancel');
    
    $fieldGroup.next('.country-div').hide();
  });
  
}());

$(document).on('click', '.addtransmodebtn', function(e){
	var jt_type = $('#job_template_type').val();
	if(jt_type == 'REPO'){
		$('.none-repo-job').hide();
		$('.repo-job').show();
	}
	else{
		$('.none-repo-job').show();
		$('.repo-job').hide();
	}
	resetTmodeButtonvalues('add', 0);
	
});
$(document).ready(function() {
	
	if($("#country-list").val() !== undefined) {
		$(".country-selector").html($("#country-list").html());
		
	}
	if($('#product').val() != ''){
		checkIMO($('#product').val());
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
		checkSupplierRateExpiration();
		
		$('#job_template_type').trigger("change");//To apply the Bussiness type changes
		jobFileList(0);
});

/**
 * change in Checkbox JT
 */
$(document).on('click', '.checkbox-temp-jt', function(e){
	
	var thisVal = $(this).is(':checked') ? 1 : 0;
	var tempId = $(this).attr('data-tempid');
	$.ajax({
	    url: appHome+'/jobtemplate-quotes/common_ajax',
	    type: 'post',
	    dataType: 'html',
	    data : {
	    		'currentVal' : thisVal,
	    		'tempId' : tempId,
	    		'action_type' : 'update_plan_type'
	    },
	    success: function(data) {}
	  });
});

$(document).on('click', '.show-supplier', function(e){
	var thisVal = $(this).is(':checked') ? 1 : 0;
	
	if(thisVal == 1){
		$(this).parents('tr').find('.hauler-comments i').show();
	}else{
		$(this).parents('tr').find('.hauler-comments i').hide();
	}
	
	var tempId = $(this).attr('data-tempid');
	$.ajax({
	    url: appHome+'/jobtemplate-quotes/common_ajax',
	    type: 'post',
	    dataType: 'html',
	    data : {
	    		'currentVal' : thisVal,
	    		'tempId' : tempId,
	    		'action_type' : 'update_show_haulage'
	    },
	    success: function(data) {}
	  });
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
		url:'../customer-quotes/rate-feedback-update/'+quote_id,
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

//Recalculation
$('.recal-customer-quote').click(function(){
	update_tank_days();
	exchange_rates();
    exchange_rates_additionalCosts();
    exchange_rates_extraCost();
    update_quote_costs();
    switch_currency_icons($('#currency'), 'currency-fa',0);
    
    BootstrapDialog.show({type: BootstrapDialog.TYPE_SUCCESS, title: 'Recalculation', message : 'Successfully calculated.'});
    $('html, body').animate({ scrollTop: 2200 }, 400);
});
function getsupplierlist(applyrate){
	var h = 0;
	//ajax for filling old supplier rate
    $.ajax({
        type: 'POST',
        url: appHome+'/jobtemplate-quotes-deepsea/supplier_rate_list',
        data: {
      	  'customer_quote_id' : $("#customer_quote_id").val(),
      	  'currency' : $('#currency').val(),
      	  'randomNumber' : $('#random_number').val(),
      	  'applyrate' : applyrate,
      	  'quote_status' : $('#quote_status').val()
        },
        beforeSend: function() {
            // setting a timeout
        	//$('.transmode-table-main tbody').html("<td colspan='15' align='center'><div class='text-center'><img src="+$('#loaderpath').val()+"></div></td>");
        	$('.btl_relative').show();
        },
        async : false,
        success: function(response){        	
        	if(response != '')
        		$('#supplier-costs').removeClass('hidden');
        	else
        		$('#supplier-costs').addClass('hidden');
        	 
      		$('.transmode-table-main tbody').html(response); 
      		h = $('.supplier-rate-loader').height();
      		$('.btl_overlay').height(h);      		
        	$('.btl_relative').hide();
        	//red border for activity td
        	$("[data-toggle=tooltip]").tooltip();
        	if($('#activity_validation_var').val() == 'yes'){
        		$("#supplier-rates-table-form td[data-activity-td='-']").each(function(){
        	      $(this).css('border','2px solid red');
        	      $(this).attr('title','Activity Required');
        		});
        		$("#supplier-rates-table-form td[data-from-td='-']").each(function(){
          	      $(this).css('border','2px solid red');
          	      $(this).attr('title','From Address Required');
          		});
        		$("#supplier-rates-table-form td[data-to-td='-']").each(function(){
          	      $(this).css('border','2px solid red');
          	      $(this).attr('title','To Address Required');
          		});
        		
        		/*//check if first haullage is LOAD and other haullages are TIP
        		var objTmodeData1 = $("#supplier-rates-table-form td[data-activity-tmode=1]");
        		if(objTmodeData1.length > 1){
        			var halFlag1 = 1;	
        			$(objTmodeData1).each(function(){	
        				if(($(this).data('activity-td') != 'LOAD') && (halFlag1 == 1)){
        					$(this).css('border','2px solid red');
        					$(this).attr('title','Invalid Activity');
        					
        				}else if(($(this).data('activity-td') != 'TIP') && (halFlag1 > 1)){			
        				    $(this).css('border','2px solid red');
        				    $(this).attr('title','Invalid Activity');
        				}
        			halFlag1++;		
        			});	 
        		}*/
        		
        	}
        	autoCheckETA();
			makeSupplierRowsDraggable();
        	
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          $('.btl_relative').hide();
        }
      });
}

function initOrderingNew() {
    var $supplierRows = $('#supplier-costs').find('.supplier-row');
    $supplierRows.find('.order').css({ visibility: 'visible' });
    $supplierRows.first().children('td:first').find('.order--up').css({ visibility: 'hidden' });
    
    $supplierRows.last().children('td:first').find('.order--down').css({ visibility: 'hidden' });
   /* $supplierRows.each(function() {
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
    });*/
    autoCheckETA();
    calculateCustomerPaidTankDays();
  }

/**
 * DM-07-Jun-2017
 * function for find tank paid days
 */
function calculateCustomerPaidTankDays(){
	var TotalTankDays = 0;
	var flag = tipFlag = 0;
	 $('#supplier-rates-table-form .supplier-row').each(function(i,elem) {
		 var eachActivity = $(this).find('td[data-activity-td]').data('activity-td');
		 var eachTankDays = $(this).find('td[data-tank-days]').data('tank-days');
		 if(eachActivity == 'LOAD' || eachActivity == 'CLOAD'){
			 flag = 1;
		 }
		 if(flag == 1){ // calulate days after LOAD Activity
			 TotalTankDays = TotalTankDays + eachTankDays;
			 
			 console.log('each tank : '+eachTankDays+' || total : '+TotalTankDays);
		 }
		 if(eachActivity == 'TIP' || eachActivity == 'CTIP'){ // stop after TIP Activity
			 flag = 0;
			 tipFlag = 1;
		 }
	 });
	 if(flag == 0 && tipFlag == 0){ // if no tip set 'Customer tank paid days' blank
		 TotalTankDays = 0;
	 }
	 if(TotalTankDays > 0){
		 TotalTankDays = TotalTankDays + 1;
	 }
	 if($('#customer_tank_paid_days').attr('data-paid-update') == 'yes'){
			$('#customer_tank_paid_days').val(TotalTankDays);
	 }
}

function saveOdering(selSuppId,neibourSuppId,index,direction){
	
	 $.ajax({
	        type: 'POST',
	        url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
	        data: {
	      	  'selSuppId' : selSuppId,
	      	  'neibourSuppId' : neibourSuppId,
	      	  'index' : index,
	      	  'direction' : direction,
	      	  'action_type' : 'saveOdering',
	      	  'quoteNumber' : $('#customer_quote_id').val(),
	      	  'randomNumber' : $('#random_number').val()
	        },
	        async : false,
	        success: function(response){
	      	 
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	      });
}


$(document).ready(function(){
	  var addressoptions = $("#hidden_select_code > option").clone();
	  $('.address-selector').append(addressoptions);  
	  var activityoptions = $("#hidden_activity_code > option").clone();
	  $('.activity-selector').append(activityoptions);
	  
	  var hidden_supplier = $("#hidden_supplier > option").clone();
	  $('.supplier-selector').append(hidden_supplier);
	
	function DoubleScroll(element) {
        var scrollbar= document.createElement('div');
        scrollbar.appendChild(document.createElement('div'));
        scrollbar.style.overflow= 'auto';
        scrollbar.style.overflowY= 'hidden';
        scrollbar.firstChild.style.width= element.scrollWidth+'px';
        scrollbar.firstChild.style.paddingTop= '1px';
        scrollbar.firstChild.appendChild(document.createTextNode('\xA0'));
        scrollbar.onscroll= function() {
            element.scrollLeft= scrollbar.scrollLeft;
        };
        element.onscroll= function() {
            scrollbar.scrollLeft= element.scrollLeft;
        };
        element.parentNode.insertBefore(scrollbar, element);
    }
	if($('#bor_table tr').length > 10){
		DoubleScroll(document.getElementById('doublescroll'));
	}  
	//demtk customer currency 
	if($('#demtk_customer').val() != ''){
		getAllCurrenciesByDEMTKCustomers('load');
	}
});


/*function ajaxSwitchCurrency(){
	
	$.ajax({
        type: 'POST',
        url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
        data: {
          'currency'	: $('#currency').val(),	
      	  'action_type' : 'changeCurrency',
      	  'quoteNumber' : $('#customer_quote_id').val(),
      	  'randomNumber' : $('#random_number').val()
        },
        async : false,
        success: function(response){
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
      });
}*/

function fillCity(get,resultElement,loaderClass){
	var getValue = get.val();
	$.ajax({
        type: 'POST',
        url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
        data: {
          'getValue'	: getValue,
          'action_type' : 'get_city_from_address'
        },
        async : false,
        beforeSend: function() {
            // setting a timeout
        	$('.'+loaderClass).show();
        },
        success: function(response){
        	var obj = $.parseJSON(response);
        	if(obj.status == 'new'){
        		$('.existing-fields select').find('optgroup[label="'+obj.country+'"]').append('<option value="'+obj.id+'">'+obj.name+'</option>');
        		$(resultElement).val(obj.id).trigger("chosen:updated");	
        	}else{
        		$(resultElement).val(obj.id).trigger("chosen:updated");
        	}
        	
        	//$('.chosen').chosen().trigger("chosen:updated");
        	$('.'+loaderClass).hide();
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
      });
}

$(document).on('change', '#collection', function(e) {
	var collection = $(this).val();
	fillCity($(this),$('#start_city'),'start_city_loader');
});
$(document).on('change', '#delivery', function(e) {
	var collection = $(this).val();
	fillCity($(this),$('#destination_city'),'end_city_loader');
});

$(document).on('change', '#job_quote_div_disable', function(e) {
	var quote_div = $(this).val();
$('#job_quote_div').val(quote_div);
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
	$('#common-ativity').val(activitySave).trigger("chosen:updated");
	//auto select activity end-----------------------
	
	var value = $(this).val();
	var btnText = $('#add-supplier-cost').text();
	$.ajax({
        type: 'POST',
        url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
        data: {
          'value'	: value,
          'action_type' : 'get_common_add_act'
        },
	    beforeSend: function() {
	            // setting a timeout
	    	$('#add-supplier-cost').attr('disabled',true);
	    	 $('#add-supplier-cost').html('<i class="fa fa-refresh fa-spin"></i> '+btnText);
	     },
        success: function(response){
        	var obj = $.parseJSON(response);
        	$('#add-supplier-cost').attr('disabled',false);
        	$('#common-from-address').val(obj.fromAddress).trigger("chosen:updated");
        	$('#common-to-address').val(obj.toAddress).trigger("chosen:updated");
        	$('#add-supplier-cost').html('<span class="fa fa-plus"></span> '+btnText);
        	
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
      });
});
$('.create-deep-sea-job').css('cursor', 'pointer');
//check
$(document).on('click', '.create-deep-sea-job', function(e) {	
	var quote_number = $(this).data('qnumber');
	var url = $(this).data('href');
	$.ajax({
	  type: 'POST',
	  timeout: 90000,
	  url: appHome+'/jobtemplate-quotes/common_ajax',
	  data: {
		  'quote_number': quote_number,
		  'action_type' : 'check_archive_supplier'
	  },
	  success: function(response) {	
	  	    if(response != ''){
		  	  BootstrapDialog.show({
		            type: BootstrapDialog.TYPE_SUCCESS,
		            title: 'Warning - Archived Supplier',
		            size: BootstrapDialog.SIZE_SMALL,
		            message: response,
		            closable: false,
		            buttons: [{
			                    label: 'Close',
			                    action: function(dialogItself){
			                        dialogItself.close();
			                        //window.location.href = url;
			                    }
			                 }]
		        }); 
		    }
		    else{
		    	window.location.href = url;
		    }	    	  
	  },
	  error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	});

}); 

// Info column used for check supplier rate expired or not
function checkSupplierRateExpiration(){
	$('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
	$(".tooltip").remove();
	var quote_numbers = [];
	var title = [];
	$('.doc-spinner').each(function() {
	    var quote_number = $(this);
	    quote_numbers.push($(this).data('quote-number'));
	});

	if(quote_numbers.length > 0){
		$.ajax({
			type: 'POST',
			dataType: "json",
			url: appHome+'/jobtemplate-quotes/common_ajax',
		    data: {
					'quote_numbers' : quote_numbers,
					'action_type' : 'check_supplier_rate_expire',
				  },
			success: function(response){
				if(response){
					$.each(response, function(key, value) {
						var changeElement = $('.doc-spinner[data-quote-number="'+key+'"]');
						if(value){
							changeElement.addClass("fa fa-exclamation-triangle").removeClass("fa-spinner fa-spin");
							changeElement.attr('data-original-title', value);
						}
						else{
							changeElement.removeClass("fa-spinner fa-spin");
						}
					});
				}
				$('.fa-spinner').removeClass("fa-spinner fa-spin"); 
			}
		});
	}else{
		$('.fa-spinner').removeClass("fa-spinner fa-spin");
	}

}


/**
   * function for get all customers of currency
*/
function getAllCurrenciesByDEMTKCustomers(type='load'){
  	var customer = $('#demtk_customer').val();
  	var currency_id = $('#hdn_demtk_currency').val();
  	var form_type = $('#form_type').val();

  	if(customer != ""){
		$.ajax({
		    type: 'POST',
		    url: appHome+'/customer-quotes/common_ajax',
		    data: {
		      'customer'	: customer,
		      'type'		: type,
		      'action_type' : 'get_all_currencies_by_customer',
		      'currency_id' : currency_id
		    },
		    success: function(response){
		    	$('#tank_hire_currency').html(response).chosen().trigger("chosen:updated");
		    	$('#tank_hire_currency').trigger("change");
		    }
		});
	}
}
//To apply the Bussiness type changes (in document ready change is triggering)
$(document).on('change', '#job_template_type', function() {
	if(($(this).val() == 'SPOT') || ($(this).val() == 'TPT')){
		$("#tank_group").val("");
		$("#tank_group").prop('disabled',true).trigger('chosen:updated');
	}else{
		$("#tank_group").prop('disabled',false).trigger('chosen:updated')
	}
	if($(this).val() == 'DED'){
		$('.allow_sp').show();
	}else{
		$('#allow_spot').prop('checked', false);
		$('.allow_sp').hide();
	}
	updateRepoChanges();
});

/*
	File upload JS
*/
function fileSelected() {
	var file = document.getElementById('fileToUpload').files[0];
	if (file) {
	  var fileSize = 0;
	  if (file.size > 1024 * 1024)
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	  else
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
	
		var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
		document.getElementById('fileName').value = fname;
		document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
		document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
	}
}

function uploadFile() {
	$('#feedback').hide();
	var fd = new FormData();
	fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
	fd.append("fileName", document.getElementById('fileName').value);
	fd.append("fileDesc", document.getElementById('fileDesc').value);
	fd.append("fileQuoteNumber", document.getElementById('quote_number').value);
	fd.append("method", document.getElementById('form_type').value);
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	xhr.open("POST", appHome + '/jobtemplate-quotes-deepsea/job-template-file-upload');
	xhr.send(fd);
}

function uploadProgress(evt) {
	if (evt.lengthComputable) {
	  var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	  document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
	}
	else {
	  document.getElementById('progressNumber').innerHTML = 'unable to compute';
	}
}

function uploadComplete(evt) {
	/* This event is raised when the server sends back a response */
	//alert(evt.target.responseText);
	$('#feedback').html(evt.target.responseText).fadeIn();
	$('#feedback').delay(3000).slideUp();
	//If success show uploaded files list
	if((evt.target.responseText).indexOf("alert-success") > 0){
		jobFileList(1);	
	}
}

function uploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}

function jobFileList($uploaded){
	var quote_number = $("#quote_number").val() ;

	var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
  	var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';

    $("#files_btn_div_list").html(ajaxLoader);
	
	$.ajax({
		type: "POST",
		cache: false,
		url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
		dataType: "text",
		data: ({
			'action_type':'job_template_file_list',
			'quote_number': quote_number
		}), 
		success: function(result){ 
			$("#files_btn_div_list").html(result);
			$('#fileName').val('');
			$('#fileDesc').val('');
			$('#fileToUpload').val('');
		}  
	});
}

//To delete the corresponding file
$(document).on('click', '.delete-jt-file', function(e){
    e.preventDefault();
    var file_id = $(this).attr('data-id');
    var path = $(this).attr('data-path');

    BootstrapDialog.confirm('Are you sure you want to delete this file?', function(result){
        if(result) {
          var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
		  var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';

		  $("#files_btn_div_list").html(ajaxLoader);

          $.ajax({
            type: 'POST',
            url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
            data: {
            	'file_id' : file_id,
            	'path' : path,
            	'action_type' : 'delete_job_template_file'
            },
            success: function(response){
            	jobFileList(0);
            },
            error: function(response){
              $('html, body').animate({ scrollTop: 0 }, 400);
              $('form').find('#response').empty().prepend(alert_error).fadeIn();
            }
          });
        }
    });
});

function updateRepoChanges(){
	var new_q_type = $('#job_template_type').val();
	new_q_type = new_q_type.charAt(0);
	var old_q_type = $('#old_q_type').val();
	var business_types = ['D','M','S'];

	if(business_types.indexOf(old_q_type) != -1 && new_q_type == 'R'){
		var message = 'Are you sure want to change the Business type?(It will affect tank days and customer base rate)';
		var mButton = 'btn-warning';
		 BootstrapDialog.show({
	         type: BootstrapDialog.TYPE_WARNING,
	         title: 'Confirmation',
	         message: message,
	         buttons: [{
			             label: 'No',
			             action: function(dialogItself){
			                 dialogItself.close();
			             }
			        },{
		            label: 'Yes',
		            cssClass: mButton,
		            action: function(dialogItself){
		            	$('#hide_tank_days').val($('#tank_days').val());
		            	$('#hide_customer_rate').val($('#rounded_quote_cost').val());
		            	$('#rounded_quote_cost').val(0.00);
						$('#rounded_quote_cost').attr('readonly', true);
						$('#tank_days').attr('readonly', true); 
						$('#tank_days').val(0);
						$('#old_q_type').val(new_q_type);
						update_quote_costs();
						dialogItself.close();
		            }
	         }]
	    });
	}
	else if(old_q_type == 'R' && business_types.indexOf(new_q_type) != -1){
		var message = 'Are you sure want to change the Business type? ';
		var mButton = 'btn-warning';
		
		BootstrapDialog.show({
	         type: BootstrapDialog.TYPE_WARNING,
	         title: 'Confirmation',
	         message: message,
	         buttons: [{
			             label: 'No',
			             action: function(dialogItself){
			                 dialogItself.close();
			             }
			        },{
		            label: 'Yes',
		            cssClass: mButton,
		            action: function(dialogItself){
		            	$('#tank_days').val($('#hide_tank_days').val());
		            	$('#rounded_quote_cost').val($('#hide_customer_rate').val());
						$('#rounded_quote_cost').attr('readonly', false);
						update_quote_costs();
						$('#old_q_type').val(new_q_type);
						dialogItself.close();
		            }
	         }]
	    });
	}
	else if((old_q_type == 'R' || old_q_type == '') && new_q_type == 'R'){
		$('#rounded_quote_cost').val(0.00);
		$('#rounded_quote_cost').attr('readonly', true);
		$('#tank_days').val(0);
		$('#old_q_type').val(new_q_type);
	}
	else if(old_q_type == '' && new_q_type != 'R'){
		$('#rounded_quote_cost').attr('readonly', false);
		$('#old_q_type').val(new_q_type);
	}
} 

$(document).on('click','.edit_supplier_rate_new', function(){
	var jt_type = $('#job_template_type').val();
	if(jt_type == 'REPO'){
		$('.none-repo-job').hide();
		$('.repo-job').show();
	}
	else{
		$('.none-repo-job').show();
		$('.repo-job').hide();
	}
});

$(document).on('click','.jt-cost-info', function(){ 
	$('#modal-jt-cost-info').html('<div class="text-center"><i class="fa fa-spinner fa-spin" style="font-size:65px"></i></div>');
	var quoteno = $(this).attr('data-quote');
	$('.jt-no-info-span').html('#'+quoteno);
	$.ajax({
		type: 'POST',
		url: appHome+'/jobtemplate-quotes/common_ajax',
		data: {
			'quote_no' : quoteno,
			'sea_type' : $(this).attr('data-quotetype'),
			'action_type' : 'get_jt_info'
		},
		success: function(response){
			$('#modal-jt-cost-info').html(response);
		},
		error: function(response){
		  $('html, body').animate({ scrollTop: 0 }, 400);
		  $('form').find('#response').empty().prepend(alert_error).fadeIn();
		}
	  });
});

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
			var idsInOrder = $("#transportmode-tbody").sortable('toArray', { attribute: 'data-temp-quote-id' });
			let idsInOrderIndex = idsInOrder.findIndex(el => el == $(ui.item).data().tempQuoteId) + 1;
			// if(idsInOrderIndex != $(ui.item).data().qeOrder){
				$('#transportmode-tbody-loader').show();
				$.ajax({
					type: 'POST',
					url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
					data: {
						'selSuppId' : $(ui.item).data().tempQuoteId,
						'index' : idsInOrderIndex,
						'action_type' : 'changeOrdering',
						'quoteNumber' : $('#customer_quote_id').val(),
							'randomNumber' : $('#random_number').val()
					},
					async : false,
					success: function(response){
						$('#transportmode-tbody-loader').hide();
					},
					error: function(response){
						$('html, body').animate({ scrollTop: 0 }, 400);
						$('form').find('#response').empty().prepend(alert_error).fadeIn();
						$('#transportmode-tbody-loader').hide();
					}
				});
				initOrderingNew();
			// }
		}
	});
}

$(function() {
	if($('#page_name').val() == "deep-sea-job-temp"){

		//Dropzone class
		var myDropzone = new Dropzone("body", {
			url: "#",
			// acceptedFiles: "image/*,application/pdf",
			maxFiles : 1, 
			previewsContainer: "#files_btn_div",
			disablePreviews: true,
			autoProcessQueue: false,
			uploadMultiple: false,
			clickable: false,
			init : function() {
	
				myDropzone = this;
		
				//Restore initial message when queue has been completed
				this.on("drop", function(event) {
					if(event.dataTransfer.files.length > 0){
						fileInput = document.getElementById("fileToUpload"); 
						fileInput.files = event.dataTransfer.files;
						//window.location.href = "#file_list_panel";
						document.getElementById("file_list_panel").scrollIntoView();
						$("#file_list_panel").css("background-color", "#bdbdbd");
						setTimeout(() => {
							$("#file_list_panel").css("background-color", "unset");
						}, 800);
						fileSelected();
						setTimeout(() => {
							// uploadFile(); to automatic upload
							myDropzone.removeAllFiles( true );
						}, 200);
					}
	
				});
		
			}
		});
	}
});

//Function for End Date Undisclosed
$(document).on('change','#no_end_validity', function(){
    if($(this).prop("checked")){
    	previous_valid_date = $('input[name="surcharge_date_to"]').val();
		$('input[name="surcharge_date_to"]').attr('readonly','true');		
		$('input[name="surcharge_date_to"]').datepicker( "option", "disabled", true );
		$('input[name="surcharge_date_to"]').hide();
		$("#dummy_date").show();
		$('input[name="surcharge_date_to"]').val($("#max_validity").val());
	} else {
		$('input[name="surcharge_date_to"]').removeAttr('readonly');
		$('input[name="surcharge_date_to"]').datepicker( "option", "disabled", false );
		$("#dummy_date").hide();
		$('input[name="surcharge_date_to"]').show();
		$('input[name="surcharge_date_to"]').val(previous_valid_date);
	}
});
// $(document).on('change', '#customer', function(e){
// 	var customer = $("#customer").val();
// 	var product = $("#product").val();
// 	if(customer){

// 		$.ajax({
// 			type: 'POST',
// 			   url: appHome+'/jobtemplate-quotes/common_ajax',
// 			   dataType: 'text',
// 			data: {
// 				'customer' :  customer,
// 				'product'  : product,
// 				'action_type' : 'getCustomerProducts'
// 			},
// 			success: function(response){
// 				$("#product").empty().append(response).trigger("chosen:updated");
// 				$('#product').change();
// 			},
// 			error: function(response){
// 				$('html, body').animate({ scrollTop: 0 }, 400);
// 				$('form').find('#response').empty().prepend(alert_error).fadeIn();
// 				}
// 		});
// 	}
// });

$(function(){
	var path = window.location.pathname;
	var pos = path.indexOf('create-jobtemplate')
	if( $('#form_type').val() == "edit" || $('#form_type').val() == "duplicating" || pos >= 0){
	   var product_id = $('select#product option:selected').val();
       getTypeQuote(product_id);
	}
});

function getTypeQuote(product_id){
	 $.ajax({
	    url: appHome+'/jobtemplate-quotes-deepsea/common_ajax',
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
	    	var arrData = data.split('|');
	    	 if(arrData[2] >= 20){	
		    	 $('#heating-alert-box').removeClass('hidden');
	         }
	         else{
	           $('#heating-alert-box').addClass('hidden'); 
	         }	    	 
	    	
	    	 $('.product_loader').hide();
	    }
	  });
}
