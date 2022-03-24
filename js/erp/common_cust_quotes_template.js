$(document).ready(function() {
	// if($('#form_type').val() == 'edit'){
	// 	$("#currency").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
	// }
	if($('#customer').val() !=""){
		//get_cur_by_customer("loaded");
		getAllCurrenciesByCustomer('load');
	}
	$(document).on('change', '#customer', function (e) {
		//get_cur_by_customer("changed");
		getAllCurrenciesByCustomer('change');
	});
	
	$(document).on('change', '#currency', function (e) {
		//get_currency();
	});
	
	function get_cur_by_customer(fun_type){
		$('#cur_mes').text("");
		var cust_code = $('#customer').val();
		var form_type = $('#form_type').val();
		var type_name = $('#type_name').val();
		
			$.ajax({
		        type: 'POST',
		        url: appHome+'/customer-quotes/common_ajax',
		        data: {
		          'cust_code'	: cust_code,
		          'type'		: type_name,
		          'action_type' : 'get_currency_by_customers'
		        },
		        success: function(response){
		        	if(fun_type != "loaded"){
		        		$('#currency').val(response).chosen().trigger("chosen:updated");
		        		$('#currency').trigger("change");
		        		$('#cur_mes').text("");
		        		$('#demurrage_currency').val(response).chosen().trigger("chosen:updated");
		        		$('#demurrage_currency').trigger("change");
		        	}
		        	$('#cust_cur').val(response);
		        	if(fun_type == "loaded"){
		        		get_currency();
		        	}
		        	if(form_type == 'edit'){
		        		$("#currency").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
		        	}
		        }
		      });
	}
	
	function get_currency(){
		if($('#customer').val() != ""){
			if($('#currency').val() != $('#cust_cur').val()){
				$('#cur_mes').text("Customer code does not match currency selected");
			}else{
				$('#cur_mes').text("");
			}
		}
	}

	$('#pre_demurage_btn').click(function(){
    	$('#pre_demurage_btn i').toggleClass('fa-minus-circle fa-plus-circle');
	});
   /**
   * PRDEM currnecy for deep sea change
   */
   //$('#demurrage_currency').on('change', function() {
   	$(document).on('change', '#demurrage_currency', function(){
	    var currency_id = $(this).chosen().val(),
	        $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
	        currency_name = $currency.attr('data-label');

	    if(!$currency.length) {
	      alert('Error. Currency not found.');
	      return false;
	    }
	    if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
	      $(".demurrage-curr").removeClass().html("").addClass('demurrage-curr fa fa-'+currency_name);
	    }
	    else {
	      $(".demurrage-curr").removeClass().html(currency_name.toUpperCase()).addClass('demurrage-curr fa');
	    }
    });
});

/**
  * Get currency by sage code
*/
function get_currency_by_cust_sage_code(fun_type){
	$('#cur_mes').text("");
	var cust_currency_id = $('#customer').val();
	var form_type = $('#form_type').val();
	var type_name = $('#type_name').val();
	
	$.ajax({
        type: 'POST',
        url: appHome+'/customer-quotes/common_ajax',
        data: {
          'cust_currency_id'	: cust_currency_id,
          'type'		: type_name,
          'action_type' : 'get_currency_by_customer_sage_code'
        },
        success: function(response){
        	if(response){
	        	if(fun_type != "currency_load"){
	        		$('#currency').val(response).chosen().trigger("chosen:updated");
	        		$('#currency').trigger("change");
	        		$('#cur_mes').text("");
	        		$('#demurrage_currency').val(response).chosen().trigger("chosen:updated");
		        	$('#demurrage_currency').trigger("change");
	        	}
	        	$('#cust_cur').val(response);
	        	if(fun_type == "currency_load"){
	        		get_currency();
	        	}
	        	if(form_type == 'edit'){
	        		$("#currency").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
	        	}
	        }
        }
    });
}

/**
   * function for get all customers of currency
*/
function getAllCurrenciesByCustomer(type='load'){
  	var customer = $('#customer').val();
  	var currency_id = $('#hdn_currency').val();
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
		    	$('#currency').html(response).chosen().trigger("chosen:updated");
		    	$('#currency').trigger("change");
		    	$('#demurrage_currency').html(response).chosen().trigger("chosen:updated");
		        $('#demurrage_currency').trigger("change");
		    	// if(form_type == 'edit'){
	      //   		$("#currency").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
	      //   	}
		    }
		});
	}
}

//Create and update the customer
$('.create-customer').click(function(e){
  $('.highlight').removeClass('highlight');
  e.preventDefault();
  var form = '#customer_detail';
  success = []; 
  highlight($(form).find('#cust_code'), '');
  highlight($(form).find('#team'), '');
  highlight($(form).find('#cust_name'), '');
  highlight($(form).find('#country'), '');
  highlight($(form).find('#bill_office'), '');
  highlight($(form).find('#bank_account'), '');
  //highlight for form validations
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
  //To check whether the customer name exist or not
  function isCustomerNameExists(customer){
    ExistSuccess = [];
    var customername  = $('#cust_code').val();
      $.ajax({
              type: 'POST', 
              url: appHome+'/customer/common_ajax',  
              async : false,
              data: {
              'customername'  : customername,
              'type'          : 'create',
              'action_type'   : 'customer_name_exist'
            },
            success: function(response){
              if(response > 0){
                ExistSuccess = 'Exist'
                $('#cust_code').parent().addClass('highlight');
                
              }else{
                    ExistSuccess = 'Ok'
                    $('#cust_code').parent().removeClass('highlight');
                  }
              },
              error: function(response){
                $('html, body').animate({ scrollTop: 0 }, 400);
                $('form').find('#response').empty().prepend(alert_error).fadeIn();
              }
          });        
    } 
    if($('#cust_code').val() != '' ){
      isCustomerNameExists($(form).find('#cust_code'),$(this)); //function for chech customer name exist or not
    if(ExistSuccess == 'Exist'){
      success.push(false);
      alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Duplicate Customer Code.</div>';       
    }else{
      success.push(true);
      success_msg = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Customer Data Saved Successfully.</div>' 
    } 
    }  
    var check_fields = (success.indexOf(false) > -1);
      
    /**
     * To create the new customer code
    */
    if($(this).hasClass('create-customer')){
      if(check_fields === true){
        $(form).find('#response').empty().prepend(alert_required).fadeIn();
      } else {
        $.ajax({
                type: 'POST',
                url: appHome+'/customer-quotes/customer-add',
                data: $(form).serialize().replace(/%5B%5D/g, '[]'),
                success: function(response){
                var obj = JSON.parse(response);
                var button = $('.create-customer');
                button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
 	            button.attr('disabled','disabled');
                $(form).find('#response').empty().prepend(success_msg).fadeIn();
		        $('#customer').find('option:selected').remove();
		        var html = "<option value="+obj.id+" selected>"+obj.cust_name+"</option>";
		        $('#customer').append(html);
		        var prod_customer_html = "<option value="+obj.id+" selected>"+obj.cust_name+" ("+obj.cust_code+")"+"</option>";
		        $('#prod_customer_ids').append(prod_customer_html);
            $("#prod_customer_ids").multiselect('rebuild');
            $("#prod_customer_ids").multiselect( 'refresh' );
     			$('.chosen').chosen().trigger("chosen:updated");     			
     			$('#currency').find('option:selected').remove();
		        var html = "<option value="+obj.cur_id+" selected>"+obj.cur_name+"</option>";
		        $('#currency').append(html);
     			$('.chosen').chosen().trigger("chosen:updated");
     			$("#currency").trigger('change');
                $('#create_new_customer_modal').modal('hide');
              },
              error: function(response){
              $('#create_new_customer_modal').modal('hide');
              $('html, body').animate({ scrollTop: 0 }, 400);
              $('form').find('#response').empty().prepend(alert_error).fadeIn();
             }
           });
        }
      }
    });

$('#create_new_customer_modal').on('hidden.bs.modal', function () {
    $('#create_new_customer_modal form')[0].reset();
    $('.chosen').chosen().trigger("chosen:updated");
    $("#customer_detail").find('#response').empty();
    $('.create-customer').removeAttr('disabled');
    $('.highlight').removeClass('highlight');
    $('.create-customer').find('span').removeClass("fa fa-spinner fa-spin");
});

$(document).on('change', '#bill_office', function(){
  getAllBankAccountsByBillingOffice();
});
/**
   * function for getting all bank accounts
*/
function getAllBankAccountsByBillingOffice(){
    var billing_office = $('#bill_office').val();

    if(billing_office != ""){
    $.ajax({
        type: 'POST',
        url: appHome+'/customer-quotes/common_ajax',
        data: {
          'billing_office'  : billing_office,
          'action_type'     :'get_all_bank_account_by_billing',
        },
        success: function(response){
          $('.currency_type').empty().html(response).chosen().trigger("chosen:updated");
        }
    });
  }
}

/* function called in SS and DS js**/

function resetTmodeButtonvalues(mode, id){

  $('#responseCreate,#exisitng-cost-details').html('');
  $('#common-address').hide();
  $('#add-supplier-cost').attr('update-id',id);
  $('#t_mode_edit_id').val(''); //for reseting the extra cost values
  $('.supplierextracostCheckbox').attr('checked',false);

  if(mode == 'edit'){
    $("#transport_mode").val('').trigger('chosen:updated');
    $('#add-supplier-cost').html('<span class="glyphicon glyphicon-plus-sign"></span>&nbsp;Update Transport Mode');
  }else{
    $("#common-to-address,#common-ativity,#common-from-address,#transport_mode").val('').trigger('chosen:updated');
    $('#add-supplier-cost').html('<span class="glyphicon glyphicon-plus-sign"></span>&nbsp;Add Transport Mode');
  }
    $('#add-supplier-cost').attr('disabled',false);

}

$(document).on('click', '.edit_supplier_rate_new', function(e){

  var temp_id = $(this).attr('data-id');
  $('.tmode-loader').html('<i class="fa fa-spinner fa-spin" style="font-size:20px"></i>');
  resetTmodeButtonvalues('edit', temp_id);

  $('#responseCreate').html();

  setTimeout(function(){ 
    $.ajax({
          type: 'POST',
          url: appHome+'/jtcommon-quotes/common_ajax',
          dataType: 'json',
          data: {
            'temp_id' : temp_id,
            'c_name' : $('#currency').find('option:selected').text(),
            'action_type' : 'get_supp_edit_data_new',
           // 'currency' : $('#currency').val()
          },
          beforeSend: function() {
              // setting a timeout
            $('.tmode-loader').html('<i class="fa fa-spinner fa-spin" style="font-size:20px"></i>');
          },
          success: function(response){

            if(response.t_mode != ""){
              $('#exisitng-cost-details').html(response.exttingtable);
              var jt_type = $('#job_template_type').val();
              if(jt_type == 'REPO'){
                $('.repo-control').chosen().val(response.t_mode).trigger("chosen:updated");
                $('.repo-control').trigger("change");
              }
              else{
                $('.normal').chosen().val(response.t_mode).trigger("chosen:updated");
                $('.normal').trigger("change");
              }
              $.each(response.modal, function( index, value ) {
                $('.'+response.modal_name+' #'+index).val(value).trigger("chosen:updated");
              });
              
              if(response.triggerclass != ""){
                $('#t_mode_edit_id').val(response.qe_cost_type_id);
                if(response.modal_name == 'extracost-modal'){
                  $('.'+response.modal_name+' #extracost_activity').val(response.activity).trigger("chosen:updated");
                  $('.'+response.modal_name+' #extracost_supplier').val(response.supplier).trigger("chosen:updated");
                  $('.'+response.modal_name+' #extracost-from-address').val(response.from_address).trigger("chosen:updated");
                  $('.'+response.modal_name+' #extracost-to-address').val(response.to_address).trigger("chosen:updated");
                  $('#'+response.triggerclass).trigger("change");
                }else{ //for all the other costs
                  $("#common-address #common-ativity").val(response.activity).trigger("chosen:updated");
                  $("#common-address #common-from-address").val(response.from_address).trigger("chosen:updated");
                  $("#common-address #common-to-address").val(response.to_address).trigger("chosen:updated");
                  $('.'+response.modal_name+' .get_routes '+' #'+response.triggerclass).trigger("change");
                }
              }else if(response.modal_name == 'additionalcost-modal'){
                $('.'+response.modal_name+' #acost_supplier').val(response.supplier).trigger("chosen:updated");
                $('.'+response.modal_name+' #activity').val(response.activity).trigger("chosen:updated");
                $('.'+response.modal_name+' #acost-from-address').val(response.from_address).trigger("chosen:updated");
                $('.'+response.modal_name+' #acost-to-address').val(response.to_address).trigger("chosen:updated");

                $('.'+response.modal_name+' #additional_cost_currency').val(response.qe_curr_id).trigger("chosen:updated");
                $('.'+response.modal_name+' #supprate_additional_cost').val(response.qe_amount);
                $('.'+response.modal_name+' .modal_currency i').removeClass().addClass('fa currency-fa fa-'+response.curr_name);
              
              }else if(response.modal_name == 'additionalactivity-modal'){
                $('.'+response.modal_name+' #aactivity_supplier').val(response.supplier).trigger("chosen:updated");
                $('.'+response.modal_name+' #additional_activity_no_cost').val(response.activity).trigger("chosen:updated");
                $('.'+response.modal_name+' #aactivity-from-address').val(response.from_address).trigger("chosen:updated");
                $('.'+response.modal_name+' #aactivity-to-address').val(response.to_address).trigger("chosen:updated");
              } 
              $('.tmode-loader').html('');
            }
          },
          error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
          }
    });
  }, 500); // call after half second

});

//ETAS and ETAR acitivity checking in transport mode
function etasrWarningMessage(){
  //var activityset = [];
  var etasstr = '';
  var etarstr = '';
  var message = "";
  var eactivity = "";
  $( ".activitynm" ).each(function() {
    var data = $( this ).attr('data-activity-td');
    var seatype = $( this ).attr('data-seatype');
    //activityset.push(data);//Storing the activity list to an array
    var nextActivity = $( this ).parent('.supplier-row').next('.supplier-row').find('.activitynm').attr('data-activity-td');
    if( !$( this ).parent('.supplier-row').find('.checkbox-temp-jt').is(':checked') ){
      if(seatype == 1){
         eactivity = "ETAS";
          if( (data == 'SHIP' || data == 'SETY' || data == 'BARGE') && (nextActivity != 'ETAS') ){
            etasstr += data+',';
          }else if( (data == 'RAILL' || data == 'RAILE') && (nextActivity != 'ETAR') ){
            etarstr += data+',';
          }
      }else{
        eactivity = "ETA";
        if( (data == 'SHIP' || data == 'SETY' || data == 'BARGE') && (nextActivity != 'ETA') ){
            etasstr += data+',';
          }else if( (data == 'RAILL' || data == 'RAILE') && (nextActivity != 'ETAR') ){
            etarstr += data+',';
          }
      }
    }
  });

  if(etasstr != ""){
      message = "The <strong>"+ etasstr.slice(0, -1) +"</strong> dosen't have <strong>"+eactivity+"</strong> activity. Please add the activity before continuing.<br>";
    }
  if(etarstr != ""){
      message += "\n The <strong>"+ etarstr.slice(0, -1) +"</strong> dosen't have <strong>ETAR</strong> activity.Please add the activity before continuing.<br>";
    }
/*
  var etasactivity = ['SHIP','SETY','BARGE'];
  var etaractivity = ['RAILL','RAILE'];
  var combined_arr = {SHIP : 'ETAS',SETY : 'ETAS',BARGE : 'ETAS',RAILL : 'ETAR',RAILE : 'ETAR'};
  var comb_present = [];
  $.each(combined_arr, function(key, value) {
      if($('[data-activity-td="'+key+'"]').parent('tr').next('tr').find('[data-activity-td="'+value+'"]').length == 0){
    comb_present.push(key);
    }
  });
    
    var common = $.grep(comb_present, function(element) {
        return $.inArray(element, activityset ) !== -1;
    });
    
    var commonetas = $.grep(common, function(element) {
        return $.inArray(element, etasactivity ) !== -1;
    });
    
    var message = "";
    if(commonetas.length != 0){
      message = "The "+ commonetas.toString() +" dosen't have ETAS activity.";
    }
    
    var commonetar = $.grep(common, function(element) {
        return $.inArray(element, etaractivity ) !== -1;
    });
    if(commonetar.length != 0){
      message += "\n The "+commonetar.toString()+" dosen't have ETAR activity.";
    }*/
  return message;
}

/*
  Function for validation ARVD/ETA demuraage from is missing missing
*/
function demurrageeMessage(){
  var m = "";
  if(!$(".is_dimurrage_radio").is(":checked") && ($(".activitynm[data-activity-td='ARVD']").length > 0 || $(".activitynm[data-activity-td='ETA']").length > 0) ){
    m = "<strong>Demurrage From</strong> is needed. Please select it before continuing. <br>";
  }
  return m;
}

$(document).ready(function () {
  $('#product').change(function(){
		show_386 = $(this).find(':selected').attr('data-prod_show_sp386');
    if(show_386) {
      $('.sp_386_div').show();
    }
    else{
      $('.sp_386_div').hide();
    }
    if($('#product_note_show_div')){
      prod_note = "";
      if($(this).val() && $(this).find(':selected').attr('data-pn_prod_specific_note')) prod_note = $(this).find(':selected').attr('data-pn_prod_specific_note');
      $('#product_note_show_div').html(prod_note);
    }
	});
  if($("#product").find(':selected').attr('data-prod_show_sp386')){
    $('.sp_386_div').show();
  }
  if($('#product_note_show_div')){
    $('#product_note_show_div').html($("#product").find(':selected').attr('data-pn_prod_specific_note'));
  }
});

$('#add_product').click(function () {
  $('.new-primay-class').hide();
  $('#add_product_response').empty();
  $("#prod_customer_ids").multiselect('select', []);
  
  $('#add_product_modal_form').trigger('reset');
  $("#prod_customer_ids").multiselect( 'refresh' );
  $("#prod_division").trigger("chosen:updated");
  $("#prod_bus_type").trigger("chosen:updated");
  $("#hazardous_product").trigger("chosen:updated");
  if($('#customer').val()){
    $("#prod_customer_ids").multiselect('select', [$('#customer').val()]);
  }
  $('#add_product_modal').modal("show");

});

$('#add_product_modal').on('change', '[name="hazardous_product"]', function (e) {
  if ($(this).val() == 1) {
    $('.new-primay-class').show();
  } else {
    $('.new-primay-class').hide();
  }
});

$('#create-product').click(function (e) {
  e.preventDefault();
  var form = '#add_product_modal_form';
  var button = $('#create-product');
  button.attr('disabled', true);
  success = [];
  ExistSuccess = "";
  highlight($(form).find('#prod_name'), '');
  highlight($(form).find('#hazardous_product'), '');
  //highlight for form validations
  function highlight(field, empty_value) {
    if (field.length > 0) {
      if (field.val().trim() === empty_value) {
        $(field).parent().addClass('highlight');
        success.push(false);
      } else {
        $(field).parent().removeClass('highlight');
        success.push(true);
      }
    }
  }

  function isproductExist(prod_name) {
    ExistSuccess = [];

    var type = "create";
    var pname = prod_name.val();
    var custArr = []
    $( "#prod_customer_ids option:selected" ).each(function() {
      custArr.push($( this ).val());
    });
    var customers = custArr.join(',');
    $.ajax({
      type: 'POST',
      async: false,
      url: appHome + '/products/common_ajax',
      data: {
        'action_type': 'productname_exist',
        'prod_id': null,
        'pname': pname,
        'type': type,
        'customers': customers
      },
      success: function (response) {
        if (response > 0) {
          ExistSuccess = 'Exist'
          $(prod_name).parent().addClass('highlight');
        } else {
          ExistSuccess = 'Ok'
          $(prod_name).parent().removeClass('highlight');
        }
      },
      error: function (response) {
        button.attr('disabled', false);
        $(form).find('#add_product_response').empty().prepend(alert_error).fadeIn();
      }
    });
  }

  if($('#prod_name').val() != ''){
	  isproductExist($(form).find('#prod_name'));
  }
  if(ExistSuccess == 'Exist'){
    
	  success.push(false);
    alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This Product already exists for the selected customers.</div>';
  }else{
	  success.push(true); 
	  alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
  } 

  var check_fields = (success.indexOf(false) > -1);

  if (check_fields === true) {
    button.attr('disabled', false);
    $(form).find('#add_product_response').empty().prepend(alert_required).fadeIn();
  } else {
    $.ajax({
      type: 'POST',
      url: appHome + '/products/common_ajax',
      data: $(form).serialize().replace(/%5B%5D/g, '[]'),
      
      success: function (response) {
        $(form).find('#add_product_response').empty().prepend('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Product Data Saved Successfully.</div>' ).fadeIn();
        button.removeAttr('disabled');
        $('#product').append(response);
        $('#product').trigger("chosen:updated");
        $('#product').change();
        $('#add_product_modal').modal('hide');
      },
      error: function (response) {
        button.attr('disabled', false);
        $(form).find('#response').empty().prepend(alert_error).fadeIn();
      }
    });
  }


});
$(document).on('change','#haulage_surcharge_date_from,#customer_surcharge_date_to', function (e) {
     var pre_dt = $('#haulage_surcharge_date_from');
     var next_dt = $('#customer_surcharge_date_to');
     var dt1 = Date_Check(pre_dt);
     var dt2 = Date_Check(next_dt);
     if(dt1 == true && dt2 == true){
      if(!checkIsValidDateRange(pre_dt.val(),next_dt.val())) {
        BootstrapDialog.show({title: 'Warning', message : " 'To date' should be greater than 'From date'."});
        $( "#customer_surcharge_date_to" ).datepicker('setDate','');
      }
    }
});
