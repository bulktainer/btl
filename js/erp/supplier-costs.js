(function() {
  localStorage.clear();

  var success = [],
      transportModes = {
        shipping: {
          requiredFields: ['supplier', 'currency', 'awaiting_days', 'days_in_transit', 'from_date', 'to_date']
        },
        rail: {
          requiredFields: ['supplier', 'currency', 'awaiting_days', 'days_in_transit', 'from_date', 'to_date']
        },
        barge: {
          requiredFields: ['supplier', 'currency', 'awaiting_days', 'days_in_transit', 'from_date', 'to_date']
        },
        haulage: {
          requiredFields: ['supplier', 'currency', 'days_in_transit', 'from_date', 'to_date']
        },
        shunt: {
          requiredFields: ['supplier', 'currency', 'awaiting_days', 'days_in_transit', 'from_date', 'to_date']
        },
        cleaning: {
          requiredFields: ['supplier', 'currency', 'product', 'amount', 'from_date', 'to_date']
        },
        ds_shipping: {
            requiredFields: ['supplier', 'days_in_transit', 'from_date', 'to_date', 'awaiting_transit', 'from_country', 'to_country']
        },
      },
      alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>',
      alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required & correct information below.</div>';


  /**
  * on form change
  */
  // get height on page load and adjust accordingly
  $(window).load(function() {
    var active = $('.tab-pane.active').height();
    $('.tab-content').css('height', active+'px');
  });

  $('.nav-form li a').click(function (e) {
    e.preventDefault();
    var id = $(this).attr('href');
    var height = $(id).height()+100;
    $('.tab-content').css('height', height+'px');

    $(this).tab('show');

    $('.tab-pane').css('z-index', 0);
    $(id).css('z-index', 999);
    //currency(id, $(id).find('select[name="currency"]').val());
  });

  /**
  * on currency change
  */
  $('#currency').change(function() {
    var currency = $(this).val();
    var fa = $('#cost-form').find('.input-group-addon .fa');
    var currency_name = $(this).find("option:selected").text().toUpperCase();

    if (currency_having_symbols.indexOf(currency_name) >= 0) {
    	$(fa).removeClass().addClass('fa fa-' + currency_name.toLowerCase() ).html("");
    }
    else {
    	$(fa).removeClass().addClass('fa').html(currency_name);
    }
    
  });
  $('#currency').trigger('change');

  function validateField(field) {
    if(field.length){
      if(field.val() === ''){
        $(field).parent().addClass('highlight');
        success.push(false);
      } else {
        $(field).parent().removeClass('highlight');
        success.push(true);
      }
    }
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

  function validateForm($button) {
    var $this = $button
        $form = $this.closest('form'),
        transportMode = $form.find('input[name="transport_mode"]').attr('data-name'),
        has_updated = 0,
        supplier_cost_id = $('input[name="supplier_cost_id"]').val(),
        path = $this.attr('data-path'),
        requiredFields = transportModes[transportMode].requiredFields,
        returnPath = path + '/' + $form.attr('data-transport-mode-name') + '?' + $('input[name="returnpath"]').val();

    success = [];
    var mode ='#'+$("#transport_mode").data('name')+'_fuel_surcharge_date';
    var modefrom ='#'+$("#transport_mode").data('name')+'_fuel_surcharge_from_date';
    var datemode ='#'+$("#transport_mode").data('name')+'_caf_surcharge_date';
    var datefrommode ='#'+$("#transport_mode").data('name')+'_caf_surcharge_from_date';
    var fuelpercentage = $("#fuel_surcharge_percentage").val();
    var fuelamount =$("#fuel_surcharge_amount").val();
    var cafpercentage = $("#caf_surcharge_percentage").val();
    var cafamount = $("#caf_surcharge_amount").val();

    if((fuelpercentage != 0)||(fuelamount != 0)) {
       highlight($(mode), '');
       highlight($(modefrom), '');
       if(fuelpercentage != 0){
          $("#fuel_surcharge_amount").parent().removeClass('highlight');
       }else if(fuelamount != 0){
          $("#fuel_surcharge_percentage").parent().removeClass('highlight');
       }
    }
    else if((fuelpercentage=='' || fuelpercentage==0) && (fuelamount =='' || fuelamount == 0)) {
       $(mode).parent().removeClass('highlight');
       $(modefrom).parent().removeClass('highlight');
       $("#fuel_surcharge_percentage").parent().removeClass('highlight');
       $("#fuel_surcharge_amount").parent().removeClass('highlight');
    }

    if((cafpercentage != 0) ||(cafamount != 0)){
      highlight($(datemode), '');
      highlight($(datefrommode), '');
      if(cafpercentage != 0){
          $("#caf_surcharge_amount").parent().removeClass('highlight');
       }else if(cafamount != 0){
          $("#caf_surcharge_percentage").parent().removeClass('highlight');
       }
    }
    else if((cafpercentage=='' || cafpercentage==0 ) && (cafamount=='' || cafamount==0)) {
       $(datemode).parent().removeClass('highlight');
       $(datefrommode).parent().removeClass('highlight');
       $("#caf_surcharge_percentage").parent().removeClass('highlight');
       $("#caf_surcharge_amount").parent().removeClass('highlight');
    }

    if (transportMode != "ds_shipping" && transportMode != "cleaning"){
        if($(mode).val() != "" && $(modefrom).val() !=""){
            validate_ds_date_fields(modefrom, mode);
        }

        if($(datemode).val() != "" && $(datefrommode).val() !=""){
            validate_ds_date_fields(datefrommode, datemode);
        }
    }

    if (transportMode == "ds_shipping")
    {
        calculatePage();
        validate_other_fields();
        validate_ds_date_fields('#shipping_from_date', '#shipping_to_date');
    } else {
	
        var validfromdate = '#'+$("#transport_mode").data('name')+'_from_date';
        var validtodate = '#'+$("#transport_mode").data('name')+'_to_date';
        validate_ds_date_fields(validfromdate, validtodate);
    }

    for(var i = 0; i < requiredFields.length; i++) {
      var $field = $form.find('[name="'+requiredFields[i]+'"]');
      validateField($field);
    }


    /**
     * Route validation
     */
    if($('[name="new_start_city[active]"]').val() === 'yes') {
      validateField($('[name="new_start_city[country_id]"]'));
      validateField($('[name="new_start_city[name]"]'));
    } else {
      $('#start_city').parent().removeClass('highlight');
      if($('#start_city').val() === '') {
        success.push(false);
        $('#start_city').parent().addClass('highlight');
      }
    }

    if($('[name="new_mid_city[active]"]').val() === 'yes') {
      validateField($('[name="new_mid_city[country_id]"]'));
      validateField($('[name="new_mid_city[name]"]'));
    } else {
      $('#mid_city').parent().removeClass('highlight');
      if($('#mid_city').val() === '') {
        success.push(false);
        $('#mid_city').parent().addClass('highlight');
      }
    }

    if($('[name="new_destination_city[active]"]').val() === 'yes') {
      validateField($('[name="new_destination_city[country_id]"]'));
      validateField($('[name="new_destination_city[name]"]'));
    } else {
      $('#destination_city').parent().removeClass('highlight');
      if($('#destination_city').val() === '') {
        success.push(false);
        $('#destination_city').parent().addClass('highlight');
      }
    }
    checkSupplierRate();
    function checkSupplierRate(){
      if(
        (transportMode == "haulage" || transportMode == "cleaning" || transportMode == "shunt") &&
        (!$('#amount').val() || $('#amount').val() <= 0)
        ){
          
        $('#amount').parent().addClass('highlight');
        success.push(false);
      }
      else if((transportMode == "haulage" || transportMode == "cleaning" || transportMode == "shunt")){
        $('#amount').parent().removeClass('highlight');
        success.push(true);
      }

      if(
        (transportMode == "shipping" || transportMode == "rail" || transportMode == "barge") ){
         loaded_weight_input = $("input[name=loaded_rate]");
         empty_weight_input = $("input[name=empty_rate]");
         swap_loaded_weight_input = $("input[name=loaded_swap_rate]");
         swap_empty_weight_input = $("input[name=empty_swap_rate]");
         other_1_loaded_weight_input = $("input[name=loaded_other_1_rate]");
         other_1_empty_weight_input = $("input[name=empty_other_1_rate]");
         other_2_loaded_weight_input = $("input[name=loaded_other_2_rate]");
         other_2_empty_weight_input = $("input[name=empty_other_2_rate]");
         imo_loaded_weight_input = $("input[name=loaded_imo_surcharge]");
         imo_empty_weight_input = $("input[name=empty_imo_surcharge]");
         
         if(!(
          (loaded_weight_input && loaded_weight_input.val() > 0) || 
          (empty_weight_input && empty_weight_input.val() > 0) || 
          (swap_loaded_weight_input && swap_loaded_weight_input.val() > 0) || 
          (swap_empty_weight_input && swap_empty_weight_input.val() > 0) || 
          (other_1_loaded_weight_input && other_1_loaded_weight_input.val() > 0) || 
          (other_1_empty_weight_input && other_1_empty_weight_input.val() > 0) || 
          (other_2_loaded_weight_input && other_2_loaded_weight_input.val() > 0) || 
          (other_2_empty_weight_input && other_2_empty_weight_input.val() > 0) || 
          (imo_loaded_weight_input && imo_loaded_weight_input.val() > 0) || 
          (imo_empty_weight_input && imo_empty_weight_input.val() > 0) 
           
           )){
            loaded_weight_input.parent().addClass('highlight');
            empty_weight_input.parent().addClass('highlight');
            swap_loaded_weight_input.parent().addClass('highlight');
            swap_empty_weight_input.parent().addClass('highlight');
            other_1_loaded_weight_input.parent().addClass('highlight');
            other_1_empty_weight_input.parent().addClass('highlight');
            other_2_loaded_weight_input.parent().addClass('highlight');
            other_2_empty_weight_input.parent().addClass('highlight');
            imo_loaded_weight_input.parent().addClass('highlight');
            imo_empty_weight_input.parent().addClass('highlight');
            success.push(false);
         }
         else{
          loaded_weight_input.parent().removeClass('highlight');
          empty_weight_input.parent().removeClass('highlight');
          swap_loaded_weight_input.parent().removeClass('highlight');
          swap_empty_weight_input.parent().removeClass('highlight');
          other_1_loaded_weight_input.parent().removeClass('highlight');
          other_1_empty_weight_input.parent().removeClass('highlight');
          other_2_loaded_weight_input.parent().removeClass('highlight');
          other_2_empty_weight_input.parent().removeClass('highlight');
          imo_loaded_weight_input.parent().removeClass('highlight');
          imo_empty_weight_input.parent().removeClass('highlight');
            success.push(true);
         }
      }

      if(transportMode == "ds_shipping" && (!$('#ocean_freight_cost').val() || $('#ocean_freight_cost').val() <= 0)){
        $('#ocean_freight_cost').parent().addClass('highlight');
        success.push(false);
      }
      else if(transportMode == "ds_shipping"){
        $('#amount').parent().removeClass('highlight');
        success.push(true);
      }

      

    }


    var check_fields = (success.indexOf(false) > -1);

    /**
    * save supplier cost
    */
    if($this.hasClass('save-supplier-cost')){
      if(check_fields){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_required).fadeIn();
        $('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  
      } else {
		//Removing disabling so that to pass value to save function 
	  	$('input[name="to_date"]').removeAttr("disabled");

        $.ajax({
          type: 'POST',
          url: path+'/add',
          data: $form.serialize(),
          success: function(response){
            window.location.href = returnPath;
            localStorage.setItem('response', response);
          },
          error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
            $('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  
          }
        });
      }
    }

    /**
    * update supplier cost
    */
    if($this.hasClass('update-supplier-cost')){
      if(check_fields){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_required).fadeIn();
        $('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  
      } else {
            var transMode = $('input[name="transport_mode"]').val();
            var confirmation_required = ['1','3','7'];
            if(confirmation_required.includes(transMode)){
	           if($("#new-rates").val() == "0"){
	                BootstrapDialog.show({
						message:'Do you want to save old rates in History table?', 
						title:'Confirmation', 
						buttons: [
						{
	                		label: ' Yes ',
	                		cssClass: 'btn-primary',
			                action: function(dialogItself){
			                      $("#new-rates").val(1);
								  $(".new-deepsea-rate").html('<span class="glyphicon glyphicon-remove-sign"></span> Cancel New Rate</a>');
								  $(".new-historic-rate").attr("disabled","disabled");
								  historicDateChecking($this, $form, supplier_cost_id, returnPath);
								  dialogItself.close();
			                }
						},
						{
			                label: ' No ',
			                action: function(dialogItself){
			                    dialogItself.close();
								udateSupplierCost($this, $form, supplier_cost_id, returnPath);
			                }
	            		}]
				 	});
              } else {
                historicDateChecking($this, $form, supplier_cost_id, returnPath)
              }

            } else {
              udateSupplierCost($this, $form, supplier_cost_id, returnPath)
            }
      }
    }
  }

   //Check current and latest historic date before saving
   function historicDateChecking($this, $form, supplier_cost_id, returnPath){
	   var newValidityDateCheck = false;
	   var message = "";

	   if($("#original_no_end_validity").val() == 0){
			//FROM DATE > ORIGINAL TO DATE 
			newValidityDateCheck = (getJsDateObj($('input[name="from_date"]').val()) > getJsDateObj($("#original-to-date").val()));
			message = "The new date range should be greater than previous 'To' date (" + $("#original-to-date").val() + ")";
	   } else {
			//FROM DATE > ORIGINAL FROM DATE
			newValidityDateCheck = (getJsDateObj($('input[name="from_date"]').val()) > getJsDateObj($("#original-from-date").val()));
			message = "The new date range should be greater than previous 'From' date (" + $("#original-from-date").val() + ")";
	   }

	  if(newValidityDateCheck || $("#new-rates").val() == "2" ){ //direct history save || From < Original to/from  
		  udateSupplierCost($this, $form, supplier_cost_id, returnPath);
	  } else {
		setNewValidDates();
		highlight($('#shipping_to_date'), '');
		highlight($('#shipping_from_date'), '');
		highlight($('input[name="from_date"]'), '');
		highlight($('input[name="to_date"]'), '');
	
		$('html, body').animate({ scrollTop: 0 }, 400);
		$('form').find('#response').empty().prepend(alert_error).fadeIn();
		$('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  
		
		BootstrapDialog.show({
	        message: message,
			type: BootstrapDialog.TYPE_WARNING,
			size : BootstrapDialog.SIZE_NORMAL,
	            buttons: [ {
	                label: 'Close',
	                action: function(dialogItself){
	                    dialogItself.close();
	                }
	            }]
	        });
		
	  }
  }

  function udateSupplierCost($this, $form, supplier_cost_id, returnPath){
      $this.html('<span class="fa fa-refresh fa-spin"></span> Save Supplier Rate');
      $this.attr("disabled","disabled");
      $(".duplicate-supplier-cost").attr("disabled","disabled");
      $(".delete-supplier-cost").attr("disabled","disabled");

	  //Removing disabling so that to pass value to update function 
	  $('input[name="from_date"]').removeAttr("disabled");
	  $('input[name="to_date"]').removeAttr("disabled");
	  $('input[name="latest_from_date"]').removeAttr("disabled");
	  $('input[name="latest_to_date"]').removeAttr("disabled");

      $.ajax({
          type: 'POST',
          url: '../'+supplier_cost_id+'/update',
          data: $form.serialize().replace(/%5B%5D/g, '[]'),
          success: function(response){
            window.location.href = returnPath;
            localStorage.setItem('response', response);
          },
          error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
            $('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  

            $this.html('<span class="glyphicon glyphicon-ok-sign"></span> Save Supplier Rate');
            $this.removeAttr("disabled");
            $(".duplicate-supplier-cost").removeAttr("disabled");
            $(".delete-supplier-cost").removeAttr("disabled");
          }
        });
  }

  function setupEventHandlers() {
    // Saving/Updating
    $('.save-supplier-cost, .update-supplier-cost').on('click', function(e) {
      e.preventDefault();
      validateForm($(this));
      return false;
    });

    // Deleting
    $('.delete-supplier-cost').on('click', function(e) {
      e.preventDefault();
      var id = $(this).attr('data-id'),
          path = $(this).attr('data-path');

      BootstrapDialog.confirm('Are you sure you want to delete this Supplier Rate?', function(result){
        if(result) {
          $.ajax({
            type: 'POST',
            url: path+'/'+id+'/delete',
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


  }
  
  function validate_other_fields()
  {
  	$('input[name="obthc_other_comm[]"]').each(function(){
      	var obthc_com_val = $(this).val();
      	var obthc_com_cost = $(this).parents(' div.form-group').find('input[name="obthc_other_cost[]"]').val();
      	if ($.trim(obthc_com_val) == "" && obthc_com_cost != "" && obthc_com_cost != 0)
      	{
      		success.push(false);
      		$(this).parent().addClass('highlight');
      	} else {
      		$(this).parent().removeClass('highlight');
      	}
      });
  	$('input[name="obthc_other_cost[]"]').each(function(){
      	var obthc_com_cost = $(this).val();
      	var obthc_com_val = $(this).parents('div.form-group').find('input[name="obthc_other_comm[]"]').val();
      	if ($.trim(obthc_com_val) != "" && (obthc_com_cost == ""))
      	{
      		success.push(false);
      		$(this).parent().addClass('highlight');
      	} else {
      		$(this).parent().removeClass('highlight');
      	}
      });
  	
  	
      $('input[name="mf_other_comm[]"]').each(function(){
      	var obthc_com_val = $(this).val();
      	var obthc_com_cost = $(this).parents(' div.form-group').find('input[name="mf_other_cost[]"]').val();
      	if ($.trim(obthc_com_val) == "" && obthc_com_cost != "" && obthc_com_cost != 0)
      	{
      		success.push(false);
      		$(this).parent().addClass('highlight');
      	} else {
      		$(this).parent().removeClass('highlight');
      	}
      });
      $('input[name="mf_other_cost[]"]').each(function(){
        	var obthc_com_cost = $(this).val();
        	var obthc_com_val = $(this).parents(' div.form-group').find('input[name="mf_other_comm[]"]').val();
        	if ($.trim(obthc_com_val) != "" && (obthc_com_cost == ""))
        	{
        		success.push(false);
        		$(this).parent().addClass('highlight');
        	} else {
        		$(this).parent().removeClass('highlight');
        	}
        });
      
      
      $('input[name="dthc_other_comm[]"]').each(function(){
      	var obthc_com_val = $(this).val();
      	var obthc_com_cost = $(this).parents(' div.form-group').find('input[name="dthc_other_cost[]"]').val();
      	if ($.trim(obthc_com_val) == "" && obthc_com_cost != "" && obthc_com_cost != 0)
      	{
      		success.push(false);
      		$(this).parent().addClass('highlight');
      	} else {
      		$(this).parent().removeClass('highlight');
      	}
      });
      $('input[name="dthc_other_cost[]"]').each(function(){
        	var obthc_com_cost = $(this).val();
        	var obthc_com_val = $(this).parents('div.form-group').find('input[name="dthc_other_comm[]"]').val();
        	if ($.trim(obthc_com_val) != "" && (obthc_com_cost == ""))
        	{
        		success.push(false);
        		$(this).parent().addClass('highlight');
        	} else {
        		$(this).parent().removeClass('highlight');
        	}
        });
      
  }
  
  
  function validate_ds_date_fields(fromdate, todate)
  {
	  var frm_dt = $(fromdate);
	  var to_dt = $(todate);
  
	  if(to_dt.val() != "" && frm_dt.val() != "") {
		  var dt1 = Date_Check(frm_dt);
		  var dt2 = Date_Check(to_dt);
		  
		  if(!dt1)
		  {
			  success.push(false);
			  frm_dt.parent().next().text('Invalid Date.');
			  frm_dt.parent().addClass('highlight');
		  } else {
			  frm_dt.parent().next().text('');
			  frm_dt.parent().removeClass('highlight');
		  }
		  
		  if(!dt2)
		  {
			  success.push(false);
			  to_dt.parent().next().text('Invalid Date.');
			  to_dt.parent().addClass('highlight');
		  } else {
			  to_dt.parent().next().text('');
			  to_dt.parent().removeClass('highlight');
		  }
		  
		  if(dt1 == true && dt2 == true)
		  {
			  if(!checkIsValidDateRange(frm_dt.val(),to_dt.val())) {
				  success.push(false);
				  to_dt.parent().next().text('To-date should be greater than From-date.');
				  to_dt.parent().addClass('highlight');
			  } else {
				  to_dt.parent().next().text('');
				  to_dt.parent().removeClass('highlight');
			  }
		  }
	  }
  }
  
  
  (function() {
    setupEventHandlers();
  })();


$(".new-deepsea-rate").click(function (e) {
    e.preventDefault();
    var buttonval = $("#new-rates");

    if(buttonval.val() != "1"){
        buttonval.val(1);
        $(this).html('<span class="glyphicon glyphicon-remove-sign"></span> Cancel New Rate</a>');
		$(".new-historic-rate").attr("disabled","disabled");
    } else {
        buttonval.val(0);
        $(this).html('<span class="glyphicon glyphicon-plus-sign"></span> Add New Rate</a>');
		$(".new-historic-rate").removeAttr("disabled");
    }
	setNewValidDates();
});

function setNewValidDates(){
	var buttonval = $("#new-rates");
	if(buttonval.val() == "0"){
		$('input[name="to_date"]').val($("#original-to-date").val());
		$('input[name="from_date"]').val($("#original-from-date").val());
		if($("#original_no_end_validity").val() == 1){
			$('input[name="to_date"]').hide();
			$("#dummy_date").show();
			$('#no_end_validity').prop("checked", true);
			$('input[name="to_date"]').attr('readonly','true');	
			$('input[name="to_date"]').datepicker( "option", "disabled", true );
		}
    } else if(buttonval.val() == "1"){
		var newfromDate = "";
		if($('#no_end_validity').prop("checked")){
			//newfromDate = getAddedDate($("#original-from-date").val(),30,"dd/mm/yyyy");
			$('input[name="to_date"]').val($("#max_validity").val());
			$('input[name="from_date"]').val('');
		} else {
			if($("#original_no_end_validity").val() == 0){
				newfromDate = getAddedDate($("#original-to-date").val(),1,"dd/mm/yyyy");
				$('input[name="to_date"]').val('');
				$('input[name="from_date"]').val(newfromDate);	
			} else {
				newfromDate = getAddedDate($("#original-from-date").val(),30,"dd/mm/yyyy");
				$('input[name="to_date"]').val('');
				$('input[name="from_date"]').val(newfromDate);
			}
		}
    }
}

//freight rate history
$('#history_btn').click(function(e){
    $('#history_btn i').toggleClass('fa-minus-circle fa-plus-circle');
    var supp_cost_id = $('input[name="supplier_cost_id"]').val();

    if($.trim($("#supp_cost_history_div").text()) == ""){
        $("#supp_cost_history_div").html('<div align="center"><img src="' + appHome  +  '/../images/ajax-loader-large.gif"></div>');

        $.ajax({
          type: 'POST',
          url: appHome + '/supplier-costs/common_ajax',
          data: {
            'action_type' : 'supp_cost_history_logs',
            'supp_id' : supp_cost_id,
            'from' : 'edit-page'
          },
          success: function(response){
            $("#supp_cost_history_div").html(response);
            $('#ajax_status').val(1);
            $('[data-toggle="tooltip"]').tooltip({ placement: 'right'});
          },
          error: function(response){
            BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
               buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',  
            });
          }
        });
    }

});

/**
 * DM-31-May-2018
 */
  $('form').on('click', '[name="new_product[prod_tank_type_desc]"]', function(e) {
		  if($(this).attr('checked')){
			  $('.new-primay-class').show();
		  }else{
			  $('.new-primay-class').hide();
		  }
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

})();


function $id(id) {
	return document.getElementById(id);
}

/**
 * File upload JS
 */
function fileSelected(e) {
	var file = $id('file_to_upload').files[0];
	if (file) {
	  var fileSize = 0;
	  if (file.size > 1024 * 1024)
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	  else
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

	  var cost_id = $('input[name="supplier_cost_id"]').val();
	  $('#file_size').html('Size: ' + fileSize);
	  $('#file_type').html('Type: ' + file.type);
	}
}

function uploadFile(e) {

	var supplier_cost_id = $('input[name="supplier_cost_id"]').val();

	if(!$id('file_to_upload').files[0]) {
		return false;
	}

	var fd = new FormData();
	fd.append("file_to_upload", $id('file_to_upload').files[0]);
	fd.append("file_desc", $('#file_desc').val());
	fd.append("supplier_cost_id", supplier_cost_id);

	var xhr = new XMLHttpRequest();

	// file received/failed
	xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4) {
					$('#progress_num').addClass(xhr.status == 200 ? "success" : "failure");
			}
	};

	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	xhr.open("POST", '../upload');
	xhr.send(fd);
}
function uploadFiles(e) {
  var $error = false;
  var successMessage = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong>Files Uploaded Successfully.</div>';
  if($("#selectmode").val() === "yes"){
      var select_quote_msg = "<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><i class='fa fa-exclamation-triangle'></i> <strong>Uh oh!</strong> Please select a Cost from lisitng for upload.</div>";
      var checkedval = [];
      $('.each-check-cost:checked').each(function(){ //iterate all listed checkbox items
          var selected_costs = $(this).attr('data-cost-id');
          checkedval.push(selected_costs);
      });
      checkedval = $.unique(checkedval);
      console.log(checkedval);
      $("#costs_ids").val(checkedval);
      if(checkedval.length == 0){
        $("#disp_msgs").empty().prepend(select_quote_msg).fadeIn();
          $error = true;
      }
  }
  var supplier_cost_id = $('input[name="costs_ids"]').val();
  if($error == false){
    if(!$id('file_to_upload').files[0]) {
      var empty_msg = "<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><i class='fa fa-exclamation-triangle'></i> <strong>Uh oh!</strong> Please select a file.</div>";
      $("#disp_msgs").empty().prepend(empty_msg).fadeIn();
      return false;
    }

    var fd = new FormData();
    for(const file of  file_to_upload.files){
      fd.append("file_to_upload[]",file);
    }
    fd.append("file_desc", $('#file_desc').val());
    fd.append("supplier_cost_ids",supplier_cost_id);

    var xhr = new XMLHttpRequest();

    // file received/failed
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4) {
          $('#progress_num').addClass(xhr.status == 200 ? "success" : "failure");
      }
    };
    xhr.onprogress = function () {
      console.log('LOADING', xhr.readyState); // readyState will be 3
      $(".upload_doc").attr("disabled","disabled");
      $("#upload_doc").find('i').removeClass().addClass("fa fa-spinner fa-spin");
    };
    
    xhr.open("POST", './commonUpload');
    xhr.send(fd);
    xhr.onload = function () {
      if (xhr.status === 200) {
        //$(".upload_doc").removeAttr("disabled");
        window.location.reload();
        localStorage.setItem('response', successMessage);
        $('html, body').animate({ scrollTop: 0 }, 400);
      } else {
        alert('Something went wrong uploading the file.');
      }
    };
  }

}
function uploadProgress(evt) {
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progress_num').show().html(percentComplete.toString() + '%');
}

function uploadComplete(evt) {
	// clear the form
	$('.file-upload-fieldset').find('input:text, input:file').val('');
	$('#file_size').empty();
	$('#file_type').empty();

	// fade out the progress indicator for added sexiness
	$('#progress_num').delay(2000).fadeOut('slow');

	var row = JSON.parse(evt.target.responseText);

	$('#supplier-cost-files').removeClass('hidden');

	var table = $('.table-supplier-cost-files');
	table.children('tbody').append(
				'<tr class="new-ajax-row success">' +
					'<td>'+row.id+'</td>' +
					'<td><a href="'+row.path+'" target="_blank" title="View/Download file">'+row.path+'</a></td>' +
					'<td class="td_file_desc">'+row.description+'</td>' +
					'<td><a href="#" '+ 
                     'data-fileid="'+row.id+'" ' +
                     'data-toggle="modal" ' +
                     'data-target="#doc_edit_desc" ' +
                     'title="Edit Description" ' +
                     'class="edit-doc-desc">' +
                     '<span style="font-size:14px" class="glyphicon glyphicon-pencil"></span></a>' +
          '</td>' +
          '<td>'+row.date_added+'</td>' +
					'<td><a href="'+row.path+'" target="_blank" title="View/Download file"><i class="fa fa-download"></i></a></td>' +
					'<td class="center-cell"><a href="#" title="Delete Document" class="delete-supplier-cost-file delete-icon" data-root=".." data-id="'+row.id+'" data-path="'+row.path+'"><i class="fa fa-trash-o"></i></a></td>' +
				'</tr>');

	// add hidden field so that files can be updated with a cost ID
	$('.file-upload-fieldset').append('<input type="hidden" name="files-to-update[]" value="'+row.id+'" />');

	var delay = setTimeout(function(){
		$('.new-ajax-row').removeClass('success');
	},2000);

  // Refresh tab-content height
  $('.tab-content').css({ height: $('.tab-pane').height() });
}

function uploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}




// Delete a Supplier Cost File
$('.supplier-cost-files-hug').on('click', ('.delete-supplier-cost-file'), function(e) {
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
							$('#supplier-cost-files').addClass('hidden');
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

// Show a modal of cost files
$('.supplier_cost_files_info').click(function(e){
  e.preventDefault();

  var supplier_cost_id = $(this).data('cost');

  $('html, body').animate({ scrollTop: 0 }, 400);

  $.ajax({
    type: 'GET',
    url: appHome+'/supplier-costs/supplier-cost-files-info/'+supplier_cost_id,
    success: function(response){
      $('#modal-supplier-cost-files-info').empty().append(response).show();
      /*$('.table')
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
        });*/
    },
    error: function(response){
      $('#modal-supplier-cost-files-info').find('.modal-body').empty().append(alert_error).fadeIn();
    }
  });
});



$('.tbl-uplod-history').click(function(e){
	var info = jQuery.parseJSON($(this).attr('data-json-string'));
	var msgtype = $(this).attr('data-type');
	var infoMsg = "";
	
	$(info).each(function(index,data){
		if(msgtype == 'Success List'){
			infoMsg += '<span class="badge">#'+data+'</span>&nbsp;';
		}else{
			if(data.hasOwnProperty('route')){
				infoMsg += '<strong>'+data.route+"</strong><br>";
			}
			if(data.hasOwnProperty('msg')){
				infoMsg += data.msg+"<br>";
			}
			infoMsg += '<hr>';
		}
	});
	
	BootstrapDialog.show({
		type: (msgtype == 'Success List') ? BootstrapDialog.TYPE_SUCCESS : BootstrapDialog.TYPE_DANGER,
	    title: msgtype,
	    message: infoMsg
	});
});

/*$(".surch-tooltip").hover(function(){
    $('#hover_last').val($(this).attr('data-costid'));
    hoverPopup($(this));
});

$(".surch-tooltip").mouseout(function(){
    $( this ).tooltip('hide');
    $(".tooltip").tooltip('hide');
    $('#hover_last').val('');
});*/

$('#supp_cost_history_div, #doublescroll').on('hover', '.surch-tooltip', function(e) {
    $('#hover_last').val($(this).attr('data-costid'));
    hoverPopup($(this));
});
  
$('#supp_cost_history_div, #doublescroll').on('mouseout', '.surch-tooltip', function(e) {
    $( this ).tooltip('hide');
    $(".tooltip").tooltip('hide');
    $('#hover_last').val('');
});

$(document).scroll(function(){
    $(".tooltip").tooltip('hide');
});

function hoverPopup(currentElement){
    $(".tooltip").remove();
    var jsonData = JSON.parse(currentElement.attr('data-popupdetails')); 
    var tankplanTooltipHtml = "<table style='font-size:10px;border-collapse: unset;background-color:#ddd;border-radius:3px;margin:1px;align:center;'>";
    $.each(jsonData, function(i, obj) {
      if(i != 'show_loader'){
        tankplanTooltipHtml += "<tr><td style='border-bottom:1px solid #ddd;background-color:white;'>"+obj.col1+"</td>";
        tankplanTooltipHtml += "<td style='border-bottom:1px solid #ddd;background-color:white;'>"+obj.col2+"</td>";
        tankplanTooltipHtml += "<td style='border-bottom:1px solid #ddd;background-color:white;'>"+obj.col3+"</td>";
        tankplanTooltipHtml += "<td style='border-bottom:1px solid #ddd;background-color:white;'>"+obj.col4+"</td>";
        tankplanTooltipHtml += "<td style='border-bottom:1px solid #ddd;background-color:white;'>"+obj.col5+"</td>";
        tankplanTooltipHtml += "<td style='border-bottom:1px solid #ddd;background-color:white;'>"+obj.col6+"</td></tr>";
      }
    });
    
    if(jsonData.hasOwnProperty('show_loader') && jsonData.show_loader == true){
    	tankplanTooltipHtml += "<tr><td  colspan='2' class='center-cell' style='background-color:black;'>"+imageUrl+"</td></tr>";
    }
    tankplanTooltipHtml += "</table>";
    
    currentElement.attr('data-original-title',tankplanTooltipHtml);
    if($('#hover_last').val() == currentElement.attr('data-costid')){
    	currentElement.tooltip('show');
    }
}

$('#doublescroll').on('hover', '.rate-validity-tooltip', function(e) {
    $('#hover_last').val($(this).attr('data-costid'));
    rv_hoverPopup($(this));
});
  
$('#doublescroll').on('mouseout', '.rate-validity-tooltip', function(e) {
    $( this ).tooltip('hide');
    $(".tooltip").tooltip('hide');
    $('#hover_last').val('');
});

function rv_hoverPopup(currentElement){
    $(".tooltip").remove();
	var fromdate = currentElement.attr('data-from');
	var todate = currentElement.text();
	if(todate == ""){
		todate = "NULL";
	}

	var tankplanTooltipHtml = "<table style='font-size:10px;border-collapse: unset;background-color:#ddd;border-radius:3px;margin:1px;align:center;'>";
	tankplanTooltipHtml += "<tr><td style='border-bottom:1px solid #ddd;background-color:white;'>FROM:</td>";
    tankplanTooltipHtml += "<td style='border-bottom:1px solid #ddd;background-color:white;'>"+fromdate+"</td>";
    tankplanTooltipHtml += "<td style='border-bottom:1px solid #ddd;background-color:white;'>TO:</td>";
    tankplanTooltipHtml += "<td style='border-bottom:1px solid #ddd;background-color:white;'>"+todate+"</td></tr>";
    tankplanTooltipHtml += "</table>";
    
    currentElement.attr('data-original-title',tankplanTooltipHtml);
    if($('#hover_last').val() == currentElement.attr('data-costid')){
    	currentElement.tooltip('show');
    }
}

$('.cost-tr').click(function (e) { 
    var $this = $(this);
    var costid = $(this).data('cid');
    var param = $(this).data('param');
    var ajax_called = $(this).data('ajax');
    var transport_mode = $("#transport-mode").val();
    var total_filter = "";
    var currency_filter = "";  

    if(transport_mode == 7){
        total_filter = $("#total-filter").val();
        currency_filter = $("#currency-filter").val();
    }

    $(this).find('span').toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
    if(ajax_called == 0){
        $('.cost-history-class[data-cid="' + costid + '"][data-param="' + param + '"]').toggle();
        $('.cost-history-class[data-cid="' + costid + '"][data-param="' + param + '"] td').html("<div align='center'><img src='" + appHome  +  "/../images/ajax.gif'></div>");

        $.ajax({
          type: 'POST',
          url: appHome + '/supplier-costs/common_ajax',
          data: {
            'action_type' : 'supp_cost_history_logs',
            'supp_id' : costid,
            'param' : param,
            'total_filter' : total_filter,
            'currency_filter' : currency_filter,
            'from' : 'list-page'
          },
          success: function(response){
             renderHistDataInListing($this,response,costid,param,transport_mode);
          },
          error: function(response){}
        });

    } else {
        $('.cost-history-class[data-cid="' + costid + '"][data-param="' + param + '"]').toggle();  
    }
});

function renderHistDataInListing($this,response,costid,param,transport_mode){

  if(transport_mode == "3"){

     $parameters = ["Loaded 20ft",
                    "Loaded Swap",
                    "Loaded Other #1",
                    "Loaded Other #2",
                    "Empty 20ft",
                    "Empty Swap",
                    "Empty Other #1",
                    "Empty Other #2"
                  ];

     $.each( $parameters, function(param_key, param_value) {
        var rowcount = 0;
        $('.cost-history-class[data-cid="' + costid + '"][data-param="' + param_value + '"] td').html(response);
        $('.cost-tr[data-cid="' + costid + '"][data-param="' + param_value + '"]').data('ajax','1');
        
        $tableObject = $('.cost-history-class[data-cid="' + costid + '"][data-param="' + param_value + '"] table  > tbody  > tr');
        $tableObject.each(function(rowid, row) {
            if($(this).data('historyparam') != param_value){
              $(this).remove();
            } else {
              ++rowcount;
            }
        });

        if(rowcount == 0){
          $emptyMessage = '<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-exclamation-circle"></i> <strong>Sorry</strong>, there are no Supplier Rates History.</div>';
          $('.cost-history-class[data-cid="' + costid + '"][data-param="' + param_value + '"] td').html($emptyMessage);
        }

     });

  } else {
      $('.cost-history-class[data-cid="' + costid + '"][data-param="' + param + '"] td').html(response);
      $this.data('ajax','1');
  }
  $('[data-toggle="tooltip"]').tooltip({ placement: 'right'});

}


$("#expand-history").click(function (e) { 
	e.preventDefault();
	
	var current_cost_id = "";
	var previous_cost_id = "";
	var open_status = false;
	
	if($(this).find('span').hasClass('glyphicon-minus')){
		open_status = true;
	}
		
	$(this).find('span').toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
	
	$(".cost-tr").each(function(){
		var inner_open_status = false;
		if($(this).find('span').hasClass('glyphicon-plus')){
			inner_open_status = true;
		}	
		
		if(open_status ^ inner_open_status){
			current_cost_id = $(this).data('cid');
			if(current_cost_id != previous_cost_id){
				previous_cost_id = current_cost_id;
				$(this).trigger('click');	
				
			} else {
				var costid = $(this).data('cid');
	    		var param = $(this).data('param');
				var ajax_called = $(this).data('ajax');
				$(this).find('span').toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
				$('.cost-history-class[data-cid="' + costid + '"][data-param="' + param + '"]').toggle();
				if(ajax_called == 0){
	        		$('.cost-history-class[data-cid="' + costid + '"][data-param="' + param + '"] td').html("<div align='center'><img src='" + appHome  +  "/../images/ajax.gif'></div>");
				}
			}
		}
	});
	
});

//Open expand history button only if history rates are present in the listing
if($('#expand-history').length == 1){
	if($('.cost-tr').length > 0){
		$('#expand-history').show();
	}
}

$('#bulkUpload_supplier').change(function (e) {
    e.preventDefault();
    var id = $('#bulkUpload_supplier').val();

    $.ajax({
      type: 'POST',
      url: appHome + '/supplier-costs/common_ajax',
      async: false,
      data: {
        'action_type': 'getHistoryUpload',
        'linkId' :id
      },
      success: function (response) {
    	tddata = "";
        if (response.length > 0) {
          var objJSON = JSON.parse(response);
          $.each(objJSON, function (i, item) {
            tddata += '<tr id="' + 'aa' + item.id + '">' +
              '<td>' + item.uploaded_type + '</td>' +
              '<td>' + item.uploaded_by + '</td>' +
              '<td>' + item.uploaded_at_formatted + '</td>' +
              '<td align="center"> <a href = "' + item.reference_ids + ' "> <i class="fa fa-file-o"></i> </a></td>'+
              '</tr>';
          });
        } else {
          tddata += '<tr id="emptyFilesTr" class="">' +
            '<td style="text-align:center;" colspan="6"><p class="alert alert-warning" style="margin-bottom:0;">No files found.</p></td>' +
            '</tr>';
        }
        $('#previousHistory').html(tddata);
      },
      error: function (response) {}
    });
  });

  $(document).on('click', '.quote-status-move-all', function(e) {
     var status = this.checked;
     $('.each-check-cquote').each(function(){ 
         this.checked = status; //change ".checkbox" checked status
     });
  });
 
  $(document).on('change', '.each-check-cquote', function(e) {
      var selqno = $(this).attr('data-cost-id');
      var checked =   $(this).is(':checked');
      
      if(checked){
         $('.ref_check_'+selqno).prop('checked',true);
       } else {
         $('.ref_check_'+selqno).prop('checked',false);
       }
  });
  
  $(document).on('click', '.each-check-cquote', function(e) {
	  if($('.each-check-cquote:checked').length == $('.each-check-cquote').length){
	      $('.quote-status-move-all').prop('checked',true);
	  } else {
	      $('.quote-status-move-all').prop('checked',false);
	  }
  });
  
  $(document).on('click', '#btn-move-cquote-status', function(e) {
      e.preventDefault();
     
      var checkedval = [];
      $('.each-check-cquote:checked').each(function(){ //iterate all listed checkbox items
        var selqno = $(this).attr('data-cost-id');
        checkedval.push(selqno);
      });
      checkedval = $.unique(checkedval);
      
	  var move = $(this).attr('data-move-to');
	  var mButton = 'btn btn-primary';
	  if(checkedval.length > 0)
	  {
		  BootstrapDialog.show({
	          type: BootstrapDialog.TYPE_PRIMARY,
	          title: 'Confirmation ('+checkedval.length+' Supplier Rates)',
	          message: 'Are you sure you want to move these rates to '+move+' ?',
	          buttons: [{
	                   label: 'Close',
	                   action: function(dialogItself){
	                       dialogItself.close();
	                   }
	               },{
	                 label: 'Ok',
	                 cssClass: mButton,
	                 action: function(){
	                   var clickbtn = $(this);
	                   $.ajax({
	                      type: 'POST',
	                      url: appHome+'/supplier-costs/common_ajax',
	                      data: {
	                        'cquoteNo' : JSON.stringify({checkedval}),
	                        'move' : move,
	                        'action_type' : 'change_supplier_status',
	                      },
	                     beforeSend: function() {
	                      clickbtn.html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
	                      clickbtn.attr('disabled','disabled');
	                      },
	                      success: function(response){
	                         localStorage.setItem('response', response);
	                         $('.supplier-cost-form').submit();
	
	                      },
	                      error: function(response){
	                        $('html, body').animate({ scrollTop: 0 }, 400);
	                        $('form').find('#response').empty().prepend(alert_error).fadeIn();
	                      }
	                });
	                 }
	          }]
		  }); 
	  
	  }
	  
  });


  $('#btn-move-export-status').click(function(e){
		e.preventDefault();
		$("input[name='history-data']").prop('checked',true)
		var mode = $(this).attr('data-mode');
		var modeid = $(this).attr('data-modeid');
	  	var filter= $(".supplier-cost-form").serialize();
	  	var checkedval = [];
	    $('.each-check-cquote:checked').each(function(){ //iterate all listed checkbox items
	        var selqno = $(this).attr('data-cost-id');
	        checkedval.push(selqno);
	    });
	    var suppid = $.unique(checkedval);
	    var exportAll = false;
		
	    //if(suppid.length == 0){
			$('#supplier_cost_modal').modal('show');
			$(document).on('click', '#supplier_cost_btn', function(e) {
				e.preventDefault();
				var history = $("input[name='history-data']:checked").val();
		
				$('#supplier_cost_modal').modal('hide');
				document.location.href = appHome+'/supplier-costs/csv/exportStatus?filter= '+filter + '&tmode='+ mode + '&tmodeId=' + modeid + '&suppcostlist=' + suppid + '&ifhistory=' + history;
			});
			/*BootstrapDialog.show({
		        type: BootstrapDialog.TYPE_PRIMARY,
		        title: 'Confirmation',
		        message: 'This will export all costs of selected Supplier. Do you want to continue?',
		        buttons: [{
				             label: 'Close',
				             action: function(dialogItself){
				                 dialogItself.close();
				             }
				         },{
			             label: 'Ok',
			             cssClass: 'btn-primary',
			             action: function(dialogItself){
				        	 document.location.href = appHome+'/supplier-costs/csv/exportStatus?filter= '+filter + '&tmode='+ mode + '&tmodeId=' + modeid + '&suppcostlist=' + suppid;
				        	 dialogItself.close();
			             }
		        }]
		    });
	    } else {
		    $('#supplier_cost_modal').modal('hide');
	    	document.location.href = appHome+'/supplier-costs/csv/exportStatus?filter= '+filter + '&tmode='+ mode + '&tmodeId=' + modeid + '&suppcostlist=' + suppid + '&ifhistory=' + history;
		}*/
  });

	 
  if($("#cpu-status").length) {
	  $.ajax({
         type: 'POST',
         url: appHome+'/supplier-costs/common_ajax',
         data: {
                  'action_type' : 'progress_function',
               },
         beforeSend: function() {},
         success: function(response){
        	 if(response != ""){
        		 var objProcc = JSON.parse(response)
            	 var proceed_flag = "green-dot";
        		 var process_css = "text-success";
        		 var memory_css = "text-success";
        		 
        		 if(objProcc.load_last1min >= 80){
        			 proceed_flag = "red-dot";
        			 process_css = 'text-danger';
        		 }
        		 if(parseInt(objProcc.total_free_memory) <= 500 && objProcc.total_free_memory.includes("MB")){
        			 memory_css = 'text-danger';
        		 }
        		 
        		 var result = '<table class="table table-condensed table-striped table-bordered table-hover">';
        		 	 result += '<tr><th colspan="4" style="text-align:center">Server Status</th></tr>';
        			 result += '<tr><td>CPU Load </td><td class="'+process_css+'">'+objProcc.load_last1min+'%</td><td>Total Memory </td><td>'+objProcc.total_memory+'</td></tr>';
        			 result += '<tr><td>Process </td><td>'+objProcc.process_count+'</td><td>Used Memory </td><td>'+objProcc.total_used_memory+'</td></tr>';
        			 result += '<tr><td>Disk use </td><td>'+objProcc.disk_usage+'</td><td>Free Memory </td><td class="'+memory_css+'">'+objProcc.total_free_memory+'</td></tr>';
        			 result += '<tr><td>Status </td><td><div class="'+proceed_flag+'"></div></td><td>Memory Usage </td><td class="'+memory_css+'">'+objProcc.memory_usage+'</td></tr>';
        			 result += '</table>';
        		 
        		 $("#cpu-status").html(result);
        	 }
         },
         error: function(response){}
	  });
  }
  
 function highlight_import(field, empty_value){
     if(field.length > 0){
        if(field.val() === empty_value){
            $(field).parent().addClass('highlight');
        } else {
          $(field).parent().removeClass('highlight');
        }
     }
 }

 function validatedata(){
   var success = [];
   var supp = $('#bulkUpload_supplier').val();
   var tmode = $('#transport_mode').val();
   var browse_button = $('#file').val();
   
   if(supp==''){
	   highlight_import($(bulkUpload_supplier), '');
	   $('#bulkUpload_supplier').attr('required', true);  
   }
   if(tmode==''){
	   highlight_import($(transport_mode), '');
	   $('#transport_mode').attr('required', true);
   }
   if(browse_button==''){
	   highlight_import($(file), '');
	   $('#file').attr('required', true);
   }
 }

$(document).on('click', '.edit-doc-desc', function(e) {
      e.preventDefault();
      $("#edit_file_desc,#edit_file_desc_id").val('');
      $('.btn-update-desc').attr('disabled',false);

      var desc = $(this).closest('td').prev('.td_file_desc').text().trim();
      var decId = $(this).attr('data-fileid');
      $("#edit_file_desc").val(desc);
      $("#edit_file_desc_id").val(decId);
});

 $(document).on('click', '.close-update-desc', function(e) {
    $('#doc_edit_desc').modal('toggle');
 });

 $(document).on('click', '.btn-update-desc', function(e) {
      e.preventDefault();
      var id  = $("#edit_file_desc_id").val()
      var des = $("#edit_file_desc").val().trim();
      $('.btn-update-desc').attr('disabled',true);
      $.ajax({
            type: 'POST',
            url: appHome+'/supplier-costs/common_ajax',
            data: {
              'desc' : des ,
              'desc_id' : id,
              'action_type' : 'update_cost_desc'
                },
            success: function(response){
              $('.edit-doc-desc[data-fileid="'+id+'"]').parent('td').prev('.td_file_desc').text(des);
              $('#doc_edit_desc').modal('toggle');
              $('.btn-update-desc').attr('disabled',false);
            },
            error: function(response){
              BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
                 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',  
              });
            }
      });
});

var end_date_undisclosed_val = false;

$(".new-historic-rate").click(function (e) {
    e.preventDefault();
    var buttonval = $("#new-rates");

    if(buttonval.val() != "2"){
        buttonval.val(2);
        $(this).html('<span class="glyphicon glyphicon-remove-sign"></span> Cancel New Historic Rate / Amend Current Validity</a>');
		$("#dt_adjust_main_div").show();
		$(".new-deepsea-rate").attr("disabled","disabled");
		$("#supplier-cost-file-upload-dive").hide();
		$(".add-entry").hide();
		
		$('input[name="from_date"]').val('');
		$('input[name="to_date"]').val('');
		
		var maximumDate = getAddedDate($("#original-from-date").val(),-1,"dd/mm/yyyy");
		$('input[name="from_date"], input[name="to_date"]').datepicker( "option", "maxDate", maximumDate );
		
		$("label[for='to_date']").text('Previous Valid Until Date');
		$("label[for='from_date']").text('Previous From Date');
		$("label[for='dates']").eq(0).text('Previous Dates');
		
		$('input[name="to_date"]').removeAttr('readonly');
		$('input[name="to_date"]').datepicker( "option", "disabled", false );
		$("#dummy_date").hide();
		$('input[name="to_date"]').show();
		//if($('#original_no_end_validity').val() == "1"){
		//	end_date_undisclosed_val = true;	
		//}
		  
		$('#no_end_validity').prop("checked",false);
		$('#no_end_validity').attr('disabled',true);

    } else {
        buttonval.val(0);
        $(this).html('<span class="glyphicon glyphicon-plus-sign"></span> Add New Historic Rate / Amend Current Validity</a>');
		$("#dt_adjust_main_div").hide();
		$(".new-deepsea-rate").removeAttr("disabled");
		
		$('input[name="from_date"]').removeAttr('readonly');
		$('input[name="latest_from_date"]').removeAttr('readonly');
		$('input[name="latest_to_date"]').removeAttr('readonly');
		
		$('input[name="from_date"]').datepicker( "option", "disabled", false );
		$('input[name="latest_from_date"]').datepicker( "option", "disabled", false );
		$('input[name="latest_to_date"]').datepicker( "option", "disabled", false );
		
		$("#adjust_hist_date").prop("checked",false);
		$("#dt_adjust_div").hide();
		$("#latest_from_date").val('');
		$("#latest_to_date").val('');
		
		$("#supplier-cost-file-upload-dive").show();
		$(".add-entry").show();
		
		$('input[name="from_date"], input[name="to_date"]').datepicker( "option", "maxDate", "+10Y" );
		
		$("label[for='to_date']").text('Valid Until Date');
		$("label[for='from_date']").text('From Date');
		$("label[for='dates']").eq(0).text('Dates');
		
		$('#no_end_validity').removeAttr('disabled');
		$('#no_end_validity').prop("checked", end_date_undisclosed_val);
		if(end_date_undisclosed_val){
			$('input[name="to_date"]').attr('readonly');
			$('input[name="to_date"]').datepicker( "option", "disabled", true );
			$('input[name="to_date"]').hide();
			$("#dummy_date").show();
		}
		
		$('input[name="from_date"]').val($("#original-from-date").val());
		$('input[name="to_date"]').val($("#original-to-date").val());
    }
});

var lastMinDt = "-10Y";
var lastMaxDt = "+10Y";
$("#adjust_hist_date").click(function (e) {
	if($(this).prop("checked")){
		$("#dt_adjust_div").show();
		
		$('input[name="from_date"]').attr('readonly','true');
		$('input[name="latest_from_date"]').attr('readonly','true');
		$('input[name="latest_to_date"]').attr('readonly','true');
		$('input[name="to_date"]').datepicker( "option", "disabled", false );
		
		$('input[name="from_date"]').datepicker( "option", "disabled", true );
		$('input[name="latest_from_date"]').datepicker( "option", "disabled", true );
		$('input[name="latest_to_date"]').datepicker( "option", "disabled", true );
		
		$("#latest_from_date").val($("#original-from-date").val());
		$("#latest_to_date").val($("#original-to-date").val());
		$('input[name="from_date"]').val($("#original-from-date").val());
		$('input[name="to_date"]').val($("#original-to-date").val());
		
		//Set min/max date
		var minimumDate = getAddedDate($("#original-from-date").val(),0,"dd/mm/yyyy");
		var maximumDate = getAddedDate($("#original-to-date").val(),-1,"dd/mm/yyyy");
			lastMinDt = $('input[name="to_date"]').datepicker( "option", "minDate");
			lastMaxDt = $('input[name="to_date"]').datepicker( "option", "maxDate");
		$('input[name="to_date"]').datepicker( "option", "minDate", minimumDate );
		$('input[name="to_date"]').datepicker( "option", "maxDate", maximumDate );
		
	} else {
		$('input[name="from_date"]').removeAttr('readonly');
		$('input[name="latest_from_date"]').removeAttr('readonly');
		$('input[name="latest_to_date"]').removeAttr('readonly');
		
		$('input[name="from_date"]').datepicker( "option", "disabled", false );
		$('input[name="latest_from_date"]').datepicker( "option", "disabled", false );
		$('input[name="latest_to_date"]').datepicker( "option", "disabled", false );
		
		$("#dt_adjust_div").hide();
		$("#latest_from_date").val('');
		$("#latest_to_date").val('');
		
		$('input[name="from_date"]').val('');
		$('input[name="to_date"]').val('');
		
		$('input[name="to_date"]').datepicker( "option", "minDate", lastMinDt );
		$('input[name="to_date"]').datepicker( "option", "maxDate", lastMaxDt );
		
		$('input[name="to_date"]').removeAttr('readonly');
		$('input[name="to_date"]').datepicker( "option", "disabled", false );
	}
});


$('input[name="to_date"]').change(function (e) {
	if($("#adjust_hist_date").prop("checked")){
		 var newfromDate = getAddedDate($(this).val(),1,"dd/mm/yyyy");
		 $('input[name="latest_from_date"]').val(newfromDate);
	}
});


function defaultMinMaxDateRange(){
	
	if($("#hist-date-json").length != 0){
		var hist_date_json = $("#hist-date-json").val();
		if($.inArray($("#transport_mode").val(), [ '1', '3', '7']) != -1 && hist_date_json != '{}'){
			
			var disabledArr = JSON.parse(hist_date_json);
			
			$('input[name="to_date"], input[name="from_date"]').datepicker( "option", "beforeShowDay",  function(date){
		        // For each calendar date, check if it is within a disabled range.
		        for(i=0;i<disabledArr.length;i++){
		            // Get each from/to ranges
		            var From = disabledArr[i].from.split("/");
		            var To = disabledArr[i].to.split("/");
		            // Format them as dates : Year, Month (zero-based), Date
		            var FromDate = new Date(From[2],From[1]-1,From[0]);
		            var ToDate = new Date(To[2],To[1]-1,To[0]);
		
		            // Set a flag to be used when found
		            var found=false;
		            // Compare date
		            if(date>=FromDate && date<=ToDate){
		                found=true;
		                return [false, "warning"]; // Return false (disabled) and the "red" class.
		            }
		        }
		        
		        //At the end of the for loop, if the date wasn't found, return true.
		        if(!found){
		            return [true, ""]; // Return true (Not disabled) and no class.
		        }
		    });
			
			if(disabledArr.length == 5){
				minimumDate = getAddedDate(disabledArr[4].from,0,"dd/mm/yyyy");
				$('input[name="from_date"], input[name="to_date"]').datepicker( "option", {"minDate": minimumDate});		
			} else {
				$('input[name="from_date"], input[name="to_date"]').datepicker( "option", {"minDate": '-10Y'});
			}
			
			$('input[name="from_date"], input[name="to_date"]').datepicker( "option", {"maxDate": '+10Y'});
		}
		 
	}

}

//Set minimum date limit for Update of Haulage / Shor Sea / Deep Sea 
$(document).ready(function(){
	defaultMinMaxDateRange();

	if($('#original_no_end_validity').val() == "1"){
		end_date_undisclosed_val = true;	
	}
	
	//If no end validity then disable 'valid to' date picker and set its correct value
	if($('#no_end_validity').prop("checked")){
		$('input[name="to_date"]').hide();
		$("#dummy_date").show();
		$('input[name="to_date"]').attr('readonly','true');	
		$('input[name="to_date"]').datepicker( "option", "disabled", true );
		$('input[name="to_date"]').val($("#original-to-date").val());
	}
   $("#costidshead").hide();
   $(".cost_ids").hide();
});


//Function for End Date Undisclosed 
var previous_valid_unditl_date = "";

$('#no_end_validity').change(function() {
    if($(this).prop("checked")){
		previous_valid_unditl_date = $('input[name="to_date"]').val();
		$('input[name="to_date"]').attr('readonly','true');		
		$('input[name="to_date"]').datepicker( "option", "disabled", true );
		$('input[name="to_date"]').hide();
		$("#dummy_date").show();
		$('input[name="to_date"]').val($("#max_validity").val());
	} else {
		$('input[name="to_date"]').removeAttr('readonly');
		$('input[name="to_date"]').datepicker( "option", "disabled", false );
		$("#dummy_date").hide();
		$('input[name="to_date"]').show();
		$('input[name="to_date"]').val(previous_valid_unditl_date);
	}
});

$(".duplicate-direction").click(function (e) {
    e.preventDefault();
    var buttonval = $("#rate-direction-duplication");

    if(buttonval.val() != "1"){
        buttonval.val(1);
        $(this).html('<span class="glyphicon glyphicon-remove-sign"></span> Cancel direction duplication</a>');
		$(".new-historic-rate").attr("disabled","disabled");
    } else {
        buttonval.val(0);
        $(this).html('<span class="glyphicon glyphicon-refresh"></span> Duplicate rate for both directions');
		$(".new-historic-rate").removeAttr("disabled");
    }

});

  $(document).on('click', '.check-all', function(e) {

    var status = this.checked; // "select all" checked status
     $('.each-check-cost').each(function(){ //iterate all listed checkbox items
         this.checked = status; //change ".checkbox" checked status
         if(status == true){
          var qno = $(this).attr('data-cquote-id');
         }
     });
  });
  
  $(document).on('click', '.each-check-cost', function(e) {
    if($('.each-check-cost:checked').length == $('.each-check-cost').length){
      $('.check-all').prop('checked',true);
    }else{
      $('.check-all').prop('checked',false);
    }
    var selqno = $(this).attr('data-cost-id');
    var checked =   $(this).is(':checked');
      
    if(checked){
         $('.ref_checks_'+selqno).prop('checked',true);
    } else {
         $('.ref_checks_'+selqno).prop('checked',false);
    }

  });

$("#upld_doc").click(function (e) {
   e.preventDefault();
  if($("#selectmode").val() === "yes"){
      $("#confirm_upload_modal").modal('show');
  }else{
    // $("#confirm_upload_modal").modal('show');
    BootstrapDialog.show({
          type: BootstrapDialog.TYPE_DANGER,
          title: 'Confirmation',
          message: "Would you like to upload document(s) to all displayed rates?",
          buttons: [{
                  label: 'Yes',
                  cssClass: 'btn-success',
                  action: function(dialogItself){
                    $("#confirm_upload_modal").modal('show');
                     dialogItself.close();
                  }
              },{
                label: 'NO',
                cssClass: 'btn-danger',
                action: function(dialogItself){
                  $("#costidshead").show();
                  $(".cost_ids").show();
                  $("#selectmode").val("yes");
                  dialogItself.close();
              }
         }]
    });
  }
  

});
$('#confirm_upload_modal').on('hidden.bs.modal', function () {
      $("#disp_msg").empty();
      $("#upload_doc").find('i').removeClass().addClass("fa fa-upload");
      $(".upload_doc").removeAttr("disabled");
      $("#file_to_upload").val("");
      $("#file_size").val("");
      $("#file_type").val(""); 

});
