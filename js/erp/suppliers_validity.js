/**
* save / update supplier
*/
var alert_extraitem_save = '<div id="response"><div class="alert alert-success alert-dismissable"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> The Supplier Extra cost was successfully saved.</div></div>';
var alert_extraitem_delete = '<div id="response"><div class="alert alert-success alert-dismissable"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> The Supplier Extra cost item was successfully deleted.</div></div>';

/**
 * Switches currency icon classes
 */

function switch_currency_icons(currency, currency_icon) {
	
  var currency_id = currency.val(),
      $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
      currency_name = $currency.attr('data-label');
  if(!$currency.length) {
    alert('Error. Currency not found.');
    return false;
  }

  if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
  	$('.'+currency_icon).removeClass().html("").addClass('fa '+currency_icon+' fa-'+currency_name);
  }
  else {
  	$('.'+currency_icon).removeClass().html(currency_name.toUpperCase()).addClass('fa '+currency_icon);
  }
  
}

/**
 * function for select all checkboxes
 */
function checkboxSelectall(){
	setTimeout(
			  function() 
			  {
				    var checked = $('.customervalidity_checkbox:visible:checked').length;
					var Unchecked = $('.customervalidity_checkbox:visible').length;
					if((checked == Unchecked) && (Unchecked > 0) && (checked > 0)){
						$('.customervalidity-select-all').prop('checked',true);
					}else{
						$('.customervalidity-select-all').prop('checked',false);
					}
			  }, 50);
	if($('.customervalidity_checkbox:checked').length > 0){
		$('.delete-selected-rates').removeAttr('disabled');
	}else{
		$('.delete-selected-rates').attr('disabled','disabled');
	}
}
//for preventing page loading from one page to another 27-oct-2016
$(document).ready(function(){
	
    
	  /**
	  * When the quote currency is changed...
	  */
	  $('#validity_currency').on('change', function() {
	      switch_currency_icons($('#validity_currency'), 'currency-fa');
	  });
	
	$("#div-disable-a-link .custom-pagination a").removeAttr('href');	
	$("#div-disable-a-link .custom-pagination a").attr('onclick','checkboxSelectall()');
	$(document).on('click', '.customervalidity_checkbox', function(e) {
		checkboxSelectall();
	});
	    
/**
 * select all option in listing page
 */
$(document).on('click', '.customervalidity-select-all', function(e) {
	var status = this.checked; // "select all" checked status
	$('.customervalidity_checkbox:visible').each(function(){ //iterate all listed checkbox items
       this.checked = status; //change ".checkbox" checked status     
   });
	if($('.customervalidity_checkbox:checked').length > 0){
		$('.delete-selected-rates').removeAttr('disabled');
	}else{
		$('.delete-selected-rates').attr('disabled','disabled');
	}
});
function containsAll(needles, haystack){ 
	  var flag = false;
	  for(var i = 0 , len = needles.length; i < len; i++){
	     if($.inArray(needles[i], haystack) != -1){
	    	 flag = true;
	    	 break
	     }
	  }
	  return flag;
}	
/**
* fuel surcharges
*/
function get_supplier_costs(supplier_id, transport_mode){
	
	var disabledArray = ["3", "7", "2"];
  	if(containsAll(disabledArray, transport_mode)){
  		$('.date-extra-info').addClass('glyphicon glyphicon-info-sign');
  	}else{
  		$('.date-extra-info').removeClass('glyphicon glyphicon-info-sign');
  	}
  	if($('.custome-page-size-js').length > 0){
  		var page_size = $('.custome-page-size-js').val();
  	}else{
  		var page_size = 50;
  	}
  $.ajax({
    type: 'POST',
    data : {
    	'supplier_id' : supplier_id,
    	'transport_mode' : transport_mode,
    	'from_date'	: $('#date_from').val(),
    	'to_date'	: $('#date_to').val(),
    	'page_size'  : page_size
    },
    timeout: 120000,
    beforeSend: function() {
        // setting a timeout
	 $('.full_relative').show();
    },
    url: appHome+'/suppliers-validity/supplier-costs',
    success: function(response){
      $('#fuel_surcharges_table').empty().append(response);
      $("#div-disable-a-link .custom-pagination a").removeAttr('href');
      $("#div-disable-a-link .custom-pagination a").attr('onclick','checkboxSelectall()');

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
          //size: 50
        });
      $('.table').trigger('pageSize', $('.custome-page-size-js').val());
      $('.full_relative').hide();
      checkboxSelectall();
      $("#rate_perantage,#_supplier_validity_date,#_supplier_validity_date_from,#validity_amount").val('');
      $('#validity_currency').val(1);
      switch_currency_icons($('#validity_currency'), 'currency-fa');
    },
    error: function(response){
      $('#fuel_surcharges_form').find('.modal-body').empty().append(alert_error).fadeIn();
    }
  });
}

/**
* on transport mode change
*/
$('.btn_get_list').click(function(){
	var supplier_id = $('#supplier_id').val();
	var transport_mode = $('#transport_mode').val();
	if(transport_mode != null){
	  get_supplier_costs(supplier_id, transport_mode);
	}else{
	  $('#fuel_surcharges_table').empty();
	}
});

$('#transport_mode').change(function(){
	  var supplier_id = $('#supplier_id').val();
	  var transport_mode = $('#transport_mode').val();
	  if(transport_mode != null){
		  get_supplier_costs(supplier_id, transport_mode);
	  }else{
		  $('#fuel_surcharges_table').empty();
	  }
 });


$('#validity_amount').change(function(){
	if( $(this).val() != '')
		$(this).val( parseFloat($(this).val()) ); 
});

$('#rate_perantage').change(function(){
	  var percentage = parseFloat($(this).val());
	  if(percentage > 100){
		  $(this).val('100.00');
	  }
	  if(percentage < -100){
		  $(this).val('-100.00');
	  }
	  
});

/**
* save / update supplier
*/
$('.save-supplier_validity').click(function(e){
$('.highlight').removeClass('highlight');
$('.multiselect').css('border-color','#ccc');
  e.preventDefault();

  var success = [],
      supplier_id = $('input[name="supplier_id"]').val(),
      transport_mode = $('#transport_mode').val();

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

  if($('#transport_mode').val() == null){
	  var multi_t_mode = true;
	  $('.multiselect').css('border-color','red');
  }else{
	  var multi_t_mode = false;
  }
  
  if($('#rate_perantage').val() == '' && $('#_supplier_validity_date').val() == '' && $('#validity_amount').val() == ''){
	  highlight($('#rate_perantage'), '');
	  highlight($('#_supplier_validity_date'), ''); 
	  highlight($('#validity_amount'), ''); 
  }
  

  var supplier_cost_ids = [];
  $('input[name="supplier_cost_id[]"]:checked').each(function(){
    supplier_cost_ids.push($(this).val());
  });
  
  var check_fields = (success.indexOf(false) > -1);

  if(check_fields === true || multi_t_mode === true){
    $('html, body').animate({ scrollTop: 0 }, 400);
    $('.response').empty().prepend(alert_required).fadeIn();
  } else if(supplier_cost_ids.length === 0){
	  alert_required = '<div class="alert alert-danger alert-dismissable"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please select any Supplier Rate.</div>';
	    $('html, body').animate({ scrollTop: 0 }, 400);
	    $('.response').empty().prepend(alert_required).fadeIn();
  }else{
      $.ajax({
        type: 'POST',
        url: appHome+'/suppliers-validity/update-supplier-validity',
        timeout: 120000, 
        data: {
        	'supplier_cost_ids' : JSON.stringify(supplier_cost_ids),
        	'supplier_id' : supplier_id,
        	'transport_mode' : transport_mode,
        	'rate_perantage' : $('#rate_perantage').val(),
        	'supplier_validity_date_from' : $('#_supplier_validity_date_from').val(),
        	'supplier_validity_date' : $('#_supplier_validity_date').val(),
        	'currency_id' : $('#validity_currency').val(),
        	'validity_amount' : $('#validity_amount').val()
        },
        beforeSend: function() {
            // setting a timeout
    	 $('.full_relative').show();
        },
        success: function(response){
          get_supplier_costs(supplier_id, transport_mode);
          $('.response').empty().prepend(response).fadeIn();
          $('.full_relative').hide();
        },
        error: function(response){
          $('.response').empty().prepend(alert_error).fadeIn();
        }
      });
      $('html, body').animate({ scrollTop: 0 }, 400);
    }
});

/**
 * limit the control
 */
$(".multi-sel-ctrl").change(function () {
	$('.multiselect').css('border-color','#ccc');
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
			
		}
	});
	}
	$('.tmp-input-ctrl').remove();//This control is for not showing old select box
	/**
	 * custome page size
	 * dm-12-Mar-2018
	 */
	$(document).on('change', '.custome-page-size-js', function(e) {
		  var supplier_id = $('#supplier_id').val();
		  var transport_mode = $('#transport_mode').val();
		  if(transport_mode != null){
			  get_supplier_costs(supplier_id, transport_mode);
		  }else{
			  $('#fuel_surcharges_table').empty();
		  }
	});
	$(document).on('click', '.delete-selected-rates', function(e) {
		var supplier_cost_ids = [];
		
		var selectedItems = $('.customervalidity_checkbox:checked').length;
		 BootstrapDialog.show({
	         type: BootstrapDialog.TYPE_DANGER,
	         title: 'Confirmation ('+selectedItems+' Selected)',
	         message: 'Are you sure you want to delete selected Supplier Rates?',
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
			       		  $('input[name="supplier_cost_id[]"]:checked').each(function(){
			      		    supplier_cost_ids.push($(this).val());
			      		  });
			      	      $.ajax({
			      	          type: 'POST',
			      	          url: appHome+'/suppliers-validity/common_ajax',
			      	          timeout: 120000, 
			      	          data: {
			      	          	'supplier_cost_ids' : JSON.stringify(supplier_cost_ids),
			      	          	'action_type' : 'delete_supplier_route'
			      	          },
			      	          beforeSend: function() {
			      	              // setting a timeout
			      	      	 $('.full_relative').show();
			      	          },
			      	          success: function(response){
			      	        	var supplier_id = $('#supplier_id').val();
			      	    		var transport_mode = $('#transport_mode').val();
			      	            get_supplier_costs(supplier_id, transport_mode);
			      	            $('.response').empty().prepend(response).fadeIn();
			      	            $('html, body').animate({ scrollTop: 0 }, 400);
			      	            $('.full_relative').hide();
			      	          },
			      	          error: function(response){
			      	            $('.response').empty().prepend(alert_error).fadeIn();
			      	          }
			      	        });
		             }
	         }]
	     });
	});
    $('#_supplier_validity_date_from,#_supplier_validity_date').on('change', function(){
 	   var frm_dt = $('#_supplier_validity_date_from');
 	   var to_dt = $('#_supplier_validity_date');

 	   var dt1 = Date_Check(frm_dt);
 	   var dt2 = Date_Check(to_dt);

 	   if(dt1 == true && dt2 == true)
 		{
 			if(!checkIsValidDateRange(frm_dt.val(),to_dt.val())) {
 				 BootstrapDialog.show({title: 'Warning', message : "'To date' should be greater than 'From date'."});
 				$('#_supplier_validity_date_from,#_supplier_validity_date').val('');
 			}
 		}
     });
});