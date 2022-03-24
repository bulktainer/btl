var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var oldalert = alert_required;

$(document).ready(function(){
	// ready
	$('.chosen').chosen().trigger("chosen:updated");
	var lease_id = $('#hidden-lease-id').val();
	if(lease_id != undefined && lease_id){
		getTankContracts(lease_id);
	}
});

$(document).on('click','.create-lease,.apply_all', function(e){
	$('.highlight').removeClass('highlight');
	e.preventDefault();
	var form = '#'+$(this).closest('form').attr('id'),
    success = [],
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
	  
	//To highlight the required field
	highlight($(form).find('#company_name'), '');
	highlight($(form).find('#contract_number'), '');
	  
	var check_fields = (success.indexOf(false) > -1);

	if($(this).hasClass('apply_all')){
	   	var lease_id = $('#hidden-lease-id').val();
	 	if(check_fields === true){
	   		$('html, body').animate({ scrollTop: 0 }, 400);
	   		$('form').find('#response').empty().prepend(alert_required).fadeIn();
	 	} else {
	 		$(this).prop('disabled','disabled');
	   		$.ajax({
		     	type: 'POST',
		     	url: appHome+'/lease/'+lease_id+'/update',
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
	   
	//To create the activity
	if($(this).hasClass('create-lease')){
	    if(check_fields === true){
	       	$('html, body').animate({ scrollTop: 0 }, 400);
	       	$('form').find('#response').empty().prepend(alert_required).fadeIn();
	    } else {
	       	$(this).prop('disabled','disabled');
	       	$.ajax({
	         	type: 'POST',
	         	url: appHome+'/lease/add',
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

$(document).on('click', '.sortClass', function(e){
	if($('.norecords').length != 1 ){
		$('.center-cell').removeClass('sortClass-th');
		$(this).parent('th').addClass('sortClass-th');
		var sort = $(this).attr('data-sort');
		var sort_type = $(this).attr('data-sort-type');
		if($('#sort').val() == sort){
			if($('#sorttype').val() == 'asc')
				$('#sorttype').val('desc');
			else
				$('#sorttype').val('asc');
		}else{
			$('#sort').val(sort);
			$('#sorttype').val(sort_type);
		}
		$('.lease-core-form').submit();
	}
});


//Delete lease agreements
$(document).on('click', '.delete-lease', function(e){
	e.preventDefault();
	
	var delete_url = $(this).attr('data-href'),
		lease_id = $(this).data('lease-id'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
		
	BootstrapDialog.show({
        type: BootstrapDialog.TYPE_DANGER,
        closable : false,
        title: "Confirmation",
        message: "Are you sure want to delete this Lease Agreement?",
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
						url: delete_url,
						timeout: 90000,
		  		       beforeSend: function() {
				        	$('.bootstrap-dialog-footer-buttons > .btn-danger').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		    		        $('.bootstrap-dialog-footer-buttons > .btn-danger').attr('disabled','disabled');
				        },
						data: {
							'lease_id' : lease_id
						},
						success: function(response){
							dialogItself.close();
							window.location.href = return_url;
							localStorage.setItem('response', response);
						},
						error: function(response){
							BootstrapDialog.show({title: 'Warning', message : 'Unable to delete this Tank. Please try later.',
								 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
							});
						}
					});
	            }
        }]
    });
});

$(document).on('click', '.view_lease', function(){
	$('.view_small_loader').show();
	$('.reset_values').html('');
	var lease_id = $(this).data('id');
	
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: appHome+'/lease/common-ajax',
		data: {
			'lease_id' : lease_id,
			'action_type' : 'get_lease_detail'
		},
		success: function(response){
			$('.view_small_loader').hide();
			if(response != ""){
				$('#modal_company').html(response.lease_company);
				$('#modal_contract_number').html(response.contract_number);
				$('#modal_daily_rate').html(response.daily_rate);
				$('#modal_currency').html(response.currency);
				$('#modal_lease_type').html(response.lease_type);
				$('#modal_lease_term').html(response.lease_term);
				$('#modal_original_hire_date').html(response.original_hire_date);
				$('#modal_hire_cost').html(response.on_hire_cost);
				$('#modal_hire_location').html(response.on_hire_location);
				$('#modal_days_free').html(response.days_free);
				$('#modal_revised_hire_date').html(response.revised_hire_date);
				$('#modal_off_hire_due_date').html(response.off_hire_due_date);
				$('#modal_actual_off_hire_date').html(response.actual_off_hire_date);
				$('#modal_tank_manufacturer').html(response.tank_manufacturer);
				$('#modal_replacement_value').html(response.replacement_value);
				$('#modal_depreciated_rv').html(response.depreciated_rv);
				$('#modal_annual_drv').html(response.annual_drv);
				$('#modal_minimum_drv').html(response.minimum_drv);
				$('#modal_tank_status').html(response.tank_status);
				$('#modal_on_hire_cost_currency_id').html(response.on_hire_cost_currency_id);
				$('#modal_on_hire_is_survey').html(response.on_hire_is_survey);
				$('#modal_on_hire_survey_cost').html(response.on_hire_survey_cost);
				$('#modal_off_hire_location').html(response.off_hire_location);
				$('#modal_bubble_payment_currency_id').html(response.bubble_payment_currency_id);
				$('#modal_bubble_payment_cost').html(response.bubble_payment_cost);
				$('#modal_test_cost_coverage').html(response.test_cost_coverage);
				$('#modal_comments').html(response.comments);
				$('#modal_off_hire_cost_currency_id').html(response.off_hire_cost_currency_id);
				$('#modal_off_hire_is_survey').html(response.off_hire_is_survey);
				$('#modal_off_hire_survey_cost').html(response.off_hire_survey_cost);
				$('#modal_off_hire_cost').html(response.off_hire_cost);
			}
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});
});

$(document).on('change', '#original_hire_date', function(){
	dateCalculation();
});

function dateCalculation() {
	if($("#original_hire_date").val() != ''){
		var days = 0;
		var actual_date = $("#original_hire_date").val();
		var result = actual_date.split("/");
		actual_date = result[1]+"/"+result[0]+"/"+result[2];
		var date = new Date(actual_date);
		if($("#lease_term").val() != ''){
			days = parseInt($("#lease_term").val(), 10);
		}
		

		if(!isNaN(date.getTime())){
			date.setDate(date.getDate() + days);
			var yyyy = date.getFullYear().toString();
	   		var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
	   		var dd  = date.getDate().toString();
	   		off_hire_due_date = (dd[1]?dd:"0"+dd[0]) + "/" +(mm[1]?mm:"0"+mm[0]) + "/"+ yyyy; 
			$("#off_hire_due_date").val(off_hire_due_date);
		} 
		else{
			$("#off_hire_due_date").val('');
		}
	}
	else{
		$("#off_hire_due_date").val('');
	}
}

$(document).on('change', '#lease_term', function(){
	dateCalculation();
});
	
function getTankContracts(lease_id){
	$.ajax({
		type: 'POST',
		url: appHome+'/lease/common-ajax',
		data: {
			'lease_id' : lease_id,
			'action_type' : 'get_lease_tank_contracts'
		},
		success: function(response){
			if(response){
				$('#tank_contracts').html(response);
				var status = response.includes("No Tank Contracts");
				if(status){
					$('.update-lease').attr('disabled', true);
				}
				$('.datepicker').datepicker({
				    dateFormat: btl_default_date_format,
				    changeMonth: true,
				    changeYear: true,
				    inline: true,
				    startDate: 0
				});
				initializeSorter();
			}
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});
}

$(document).on('click','.input-group-addon',function(){
	$(this).parent().find('.datepicker').trigger('focus');
});

$(document).on('click','.update-lease',function(e){
	e.preventDefault();
	var form = '#'+$(this).closest('form').attr('id');
	var lease_id = $('#hidden-lease-id').val();
	$(this).prop('disabled','disabled');

	$.ajax({
     	type: 'POST',
     	url: appHome+'/lease/'+lease_id+'/update-tank-lease',
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
});

$(document).on('change','.tank_lease_original_on_hire_date',function(e){
	findOffHireDate($(this));
});

function findOffHireDate(element) {
	var tank_id = $(element).data('tank_id');
	if($(element).val() != ''){
		var days = 0;
		var actual_date = $(element).val();
		var result = actual_date.split("/");
		actual_date = result[1]+"/"+result[0]+"/"+result[2];
		var date = new Date(actual_date);
		if($(element).data('lease_term') != ''){
			days = parseInt($(element).data('lease_term'), 10);
		}
		
		var free_days = 0;
		if($(element).data('free_days') != ''){
			free_days = parseInt($(element).data('free_days'), 10);
		}

		if(!isNaN(date.getTime())){
			date1 = new Date(date.getTime());
			date.setDate(date.getDate() + days);
			var yyyy = date.getFullYear().toString();
	   		var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
	   		var dd  = date.getDate().toString();
	   		off_hire_due_date = (dd[1]?dd:"0"+dd[0]) + "/" +(mm[1]?mm:"0"+mm[0]) + "/"+ yyyy; 
			$("#tank_lease_off_hire_due_date_"+tank_id).val(off_hire_due_date);
			date1.setDate(date1.getDate() + free_days);
			var ch_yyyy = date1.getFullYear().toString();
	   		var ch_mm = (date1.getMonth()+1).toString(); // getMonth() is zero-based
	   		var ch_dd  = date1.getDate().toString();
	   		charge_starts_from_date = (ch_dd[1]?ch_dd:"0"+ch_dd[0]) + "/" +(ch_mm[1]?ch_mm:"0"+ch_mm[0]) + "/"+ ch_yyyy; 
			$("#tank_lease_charge_starts_from_"+tank_id).val(charge_starts_from_date);
		} 
		else{
			$("#tank_lease_off_hire_due_date_"+tank_id).val('');
			$("#tank_lease_charge_starts_from_"+tank_id).val('');
		}
		
	}
	else{
		$("#tank_lease_off_hire_due_date_"+tank_id).val('');
		$("#tank_lease_charge_starts_from_"+tank_id).val('');
	}
}

$(document).on('change','#tank_lease_status',function(e){
	$(this).attr('title',$(this).val());
});

$(document).on('change','#lease_type',function(e){
	var lease_type = $(this).val();
	if(lease_type == 'Financial Lease'){
		$('.bubble_payment').attr('disabled', false);
	}
	else{
		$('.bubble_payment').attr('disabled', true);
		$('#bubble_payment_currency_id').val(1);
		$('#bubble_payment_cost').val('');
	}
	$('.chosen').chosen().trigger("chosen:updated");
});

//Page size change
$(document).on('change','.custom-page-pagesize',function(){
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('.lease-core-form').submit();
});

//lease table titled input
$(document).on('change','.lease_table_titled_input',function(){
	$(this).attr('title', this.value);
});

$(document).on('change', '#days_free, #original_hire_date', function () {
	if($('#original_hire_date').val()){
		console.log($('#original_hire_date').val())
		var days = 0;
		var actual_date = $("#original_hire_date").val();
		var result = actual_date.split("/");
		actual_date = result[1]+"/"+result[0]+"/"+result[2];
		var date = new Date(actual_date);
		if($("#days_free").val() != ''){
			days = parseInt($("#days_free").val(), 10);
		}
		

		if(!isNaN(date.getTime())){
			date.setDate(date.getDate() + days);
			var yyyy = date.getFullYear().toString();
	   		var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
	   		var dd  = date.getDate().toString();
	   		charge_starts_from = (dd[1]?dd:"0"+dd[0]) + "/" +(mm[1]?mm:"0"+mm[0]) + "/"+ yyyy; 
			$("#charge_starts_from").val(charge_starts_from);
		} 
		else{
			$("#charge_starts_from").val('');
		}
	}
	else{
		$("#charge_starts_from").val('');
	}
});

$(document).on('click','#on_hire_is_survey',function(e){
	if($(this).is(':checked')){
		$('#on_hire_survey_cost').attr('disabled',false);
	}
	else{
		$('#on_hire_survey_cost').val(0);
		$('#on_hire_survey_cost').attr('disabled','disabled');
	}
});

$(document).on('click','#off_hire_is_survey',function(e){
	if($(this).is(':checked')){
		$('#off_hire_survey_cost').attr('disabled',false);
	}
	else{
		$('#off_hire_survey_cost').val(0);
		$('#off_hire_survey_cost').attr('disabled','disabled');
	}
});

function initializeSorter(){
	$(".tablesorter").tablesorter({
		 cssHeader:'sortheader',
		 cssAsc:'headerSortUp',
		 cssDesc:'headerSortDown',
		 dateFormat: "ddmmyyyy",
		 headers: { 
            '.no-sort' : {
		        sorter: false, parser: false
		    },
		    '.tank-sort' : { 
		    	sorter: 'comments'
		    }
        }
	});
}
