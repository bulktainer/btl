
//Calculation of Deep sea page 
$('.deepsea-calc-fld').live('change',function(){
	calculatePage();
});

//$('.deepsea-calc-sub-btn').live('click',function(){
//	calculatePage();
//});


//Deep sea calculations
function calculatePage()
{
	//var obthc_cost_Base 				= 0;
	//var mf_cost_Base 					= 0;
	//var dthc_cost_Base 				= 0;
	
	var obthc_cost_EUR 					= 0;
	var obthc_cost_USD 					= 0;
	var obthc_cost_GBP 					= 0;
	
	var mf_cost_EUR 					= 0;
	var mf_cost_USD 					= 0;
	var mf_cost_GBP 					= 0;
	
	var dthc_cost_EUR 					= 0;
	var dthc_cost_USD 					= 0;
	var dthc_cost_GBP 					= 0;
	
	var tmpval							= 0;
	var awaiting_transit   				= $('#awaiting_transit').val();
	var days_in_transit    				= $('#days_in_transit').val();
	var total_vessel_days				= 0;
	var internal_rate_per_day			= $('#internal_rate_per_day').val();
	var internal_rate_per_day_curr_id  	= $('#internal_rate_per_day_curr_id').val();
	var internal_rate_per_day_Base 		= 0;
	var internal_rate_per_day_EUR 		= 0;
	var internal_rate_per_day_USD 		= 0;
	var internal_rate_per_day_GBP 		= 0;

	var total_vessel_days_cost_Base 	= 0;
	var total_vessel_days_cost_EUR 		= 0;
	var total_vessel_days_cost_USD 		= 0;
	var total_vessel_days_cost_GBP 		= 0;
	
	var obthc_terminal_cost 			= $('#obthc_terminal_cost').val();
	var obthc_terminal_curr_id  		= $('#obthc_terminal_curr_id').val();
	
	var ocean_freight_cost				= $('#ocean_freight_cost').val();
	var ocean_freight_curr_id			= $('#ocean_freight_curr_id').val();
	var caf_cost						= $('#caf_cost').val();
	var baf_cost						= $('#baf_cost').val();
	var caf_curr_id						= $('#caf_curr_id').val();
	var baf_curr_id						= $('#baf_curr_id').val();
	var imo_cost						= $('#imo_cost').val();
	var imo_curr_id						= $('#imo_curr_id').val();
	
	var dthc_terminal_cost				= $('#dthc_terminal_cost').val();
	var dthc_terminal_curr_id			= $('#dthc_terminal_curr_id').val();
	
	var obtch = new Array();
	var mf = new Array();
	var dthc = new Array();
	
	var obtch_curr = new Array();
	var mf_curr = new Array();
	var dthc_curr = new Array();
	
	//OB THC other cost
	$('input[name="obthc_other_cost[]"]').each(function(){
			tmpval = 0;
			tmpval = $(this).val();
			if($.trim(tmpval) == ""){ tmpval = 0; } else {tmpval = parseFloat(tmpval).toFixed(2);}
			obtch.push(tmpval);
	});
	
	$('select[name="obthc_other_curr_id[]"]').each(function(){
			tmpval = 0;
			tmpval = $(this).val();
			if($.trim(tmpval) == ""){ tmpval = 0; } else {tmpval = parseInt(tmpval);}
			obtch_curr.push(tmpval);
	});
	
	//Main Freight other cost
	$('input[name="mf_other_cost[]"]').each(function(){
			tmpval = 0;
			tmpval = $(this).val();
			if($.trim(tmpval) == ""){ tmpval = 0; } else {tmpval = parseFloat(tmpval).toFixed(2);}
			mf.push(tmpval);
	});
	
	$('select[name="mf_other_curr_id[]"]').each(function(){
			tmpval = 0;
			tmpval = $(this).val();
			if($.trim(tmpval) == ""){ tmpval = 0; } else {tmpval = parseInt(tmpval);}
			mf_curr.push(tmpval);
	});
	
	//D THC other cost
	$('input[name="dthc_other_cost[]"]').each(function(){
			tmpval = 0;
			tmpval = $(this).val();
			if($.trim(tmpval) == ""){ tmpval = 0; } else {tmpval = parseFloat(tmpval).toFixed(2);}
			dthc.push(tmpval);
	});
	
	$('select[name="dthc_other_curr_id[]"]').each(function(){
			tmpval = 0;
			tmpval = $(this).val();
			if($.trim(tmpval) == ""){ tmpval = 0; } else {tmpval = parseInt(tmpval);}
			dthc_curr.push(tmpval);
	});
	
	//get currency
	var eur_id							= 0;
	var usd_id							= 0;
	var gbp_id							= 0;
	//var base_currency					= eur_id;
	$('.currency-meta').each(function(){
		current_cur_name = $(this).attr('data-label');
		if(current_cur_name == "eur") {
			eur_id = $(this).attr('data-id');
		} else if (current_cur_name == "usd") {
			usd_id = $(this).attr('data-id');
		} else if (current_cur_name == "gbp") {
			gbp_id = $(this).attr('data-id');
		}
	});

	//parsing
	if($.trim(awaiting_transit) == ""){ awaiting_transit = 0; } else {awaiting_transit = parseFloat(awaiting_transit).toFixed(2);}
	if($.trim(days_in_transit) == ""){ days_in_transit = 0; } else {days_in_transit = parseFloat(days_in_transit).toFixed(2);}
	if($.trim(internal_rate_per_day) == ""){ internal_rate_per_day = 0; } else {internal_rate_per_day = parseFloat(internal_rate_per_day).toFixed(2);}
	if($.trim(obthc_terminal_cost) == ""){ obthc_terminal_cost = 0; } else {obthc_terminal_cost = parseFloat(obthc_terminal_cost).toFixed(2);}
	if($.trim(ocean_freight_cost) == ""){ ocean_freight_cost = 0; } else {ocean_freight_cost = parseFloat(ocean_freight_cost).toFixed(2);}
	if($.trim(baf_cost) == ""){ baf_cost = 0; } else {baf_cost = parseFloat(baf_cost).toFixed(2);}
	if($.trim(caf_cost) == ""){ caf_cost = 0; } else {caf_cost = parseFloat(caf_cost).toFixed(2);}
	if($.trim(imo_cost) == ""){ imo_cost = 0; } else {imo_cost = parseFloat(imo_cost).toFixed(2);}
	if($.trim(dthc_terminal_cost) == ""){ dthc_terminal_cost = 0; } else {dthc_terminal_cost = parseFloat(dthc_terminal_cost).toFixed(2);}
	
	if($.trim(internal_rate_per_day_curr_id) == ""){ internal_rate_per_day_curr_id = 0; } else {internal_rate_per_day_curr_id = parseInt(internal_rate_per_day_curr_id);}
	if($.trim(obthc_terminal_curr_id) == ""){ obthc_terminal_curr_id = 0; } else {obthc_terminal_curr_id = parseInt(obthc_terminal_curr_id);}
	if($.trim(ocean_freight_curr_id) == ""){ ocean_freight_curr_id = 0; } else {ocean_freight_curr_id = parseInt(ocean_freight_curr_id);}
	if($.trim(baf_curr_id) == ""){ baf_curr_id = 0; } else {baf_curr_id = parseInt(baf_curr_id);}
	if($.trim(caf_curr_id) == ""){ caf_curr_id = 0; } else {caf_curr_id = parseInt(caf_curr_id);}
	if($.trim(imo_curr_id) == ""){ imo_curr_id = 0; } else {imo_curr_id = parseInt(imo_curr_id);}
	if($.trim(dthc_terminal_curr_id) == ""){ dthc_terminal_curr_id = 0; } else {dthc_terminal_curr_id = parseInt(dthc_terminal_curr_id);}
	
	//calculation
	total_vessel_days  = parseInt(awaiting_transit) + parseInt(days_in_transit);
	//Internal Rate per day
	//internal_rate_per_day_Base = perform_conversion(internal_rate_per_day, internal_rate_per_day_curr_id, base_currency); //Conver to base currency EUR
	internal_rate_per_day_EUR = perform_conversion(internal_rate_per_day, internal_rate_per_day_curr_id, eur_id); 
	internal_rate_per_day_USD = perform_conversion(internal_rate_per_day, internal_rate_per_day_curr_id, usd_id);
	internal_rate_per_day_GBP = perform_conversion(internal_rate_per_day, internal_rate_per_day_curr_id, gbp_id);

	//total_vessel_days_cost_Base = (total_vessel_days * internal_rate_per_day_Base).toFixed(2);
	total_vessel_days_cost_EUR = total_vessel_days * internal_rate_per_day_EUR;
	total_vessel_days_cost_USD = total_vessel_days * internal_rate_per_day_USD;
	total_vessel_days_cost_GBP = total_vessel_days * internal_rate_per_day_GBP;

	//OB THC cost
	obthc_cost_EUR = parseFloat(perform_conversion(obthc_terminal_cost, obthc_terminal_curr_id, eur_id));
	for (i = 0; i < obtch.length; i++) {
		if (obtch_curr[i] != 0)
			{
				obthc_cost_EUR += parseFloat(perform_conversion(obtch[i], obtch_curr[i], eur_id));
			}
	}
	obthc_cost_USD = parseFloat(perform_conversion(obthc_terminal_cost, obthc_terminal_curr_id, usd_id));
	for (i = 0; i < obtch.length; i++) {
		if (obtch_curr[i] != 0)
			{
			obthc_cost_USD += parseFloat(perform_conversion(obtch[i], obtch_curr[i], usd_id));
			}
	}
	obthc_cost_GBP = parseFloat(perform_conversion(obthc_terminal_cost, obthc_terminal_curr_id, gbp_id));
	for (i = 0; i < obtch.length; i++) {
		if (obtch_curr[i] != 0)
			{
			obthc_cost_GBP += parseFloat(perform_conversion(obtch[i], obtch_curr[i], gbp_id));
			}
	}
	
	obthc_cost_EUR = parseFloat(obthc_cost_EUR).toFixed(2); 
	obthc_cost_USD = parseFloat(obthc_cost_USD).toFixed(2);
	obthc_cost_GBP = parseFloat(obthc_cost_GBP).toFixed(2);
	
	//obthc_cost_EUR = parseFloat(perform_conversion(obthc_cost_Base, base_currency, eur_id)).toFixed(2); 
	//obthc_cost_USD = parseFloat(perform_conversion(obthc_cost_Base, base_currency, usd_id)).toFixed(2);
	//obthc_cost_GBP = parseFloat(perform_conversion(obthc_cost_Base, base_currency, gbp_id)).toFixed(2);
	
	//Main Freight cost
	mf_cost_EUR = parseFloat(perform_conversion(ocean_freight_cost, ocean_freight_curr_id, eur_id));
	mf_cost_EUR += parseFloat(perform_conversion(baf_cost, baf_curr_id, eur_id));
	mf_cost_EUR += parseFloat(perform_conversion(caf_cost, caf_curr_id, eur_id));
	mf_cost_EUR += parseFloat(perform_conversion(imo_cost, imo_curr_id, eur_id));
	for (i = 0; i < mf.length; i++) {
		if (mf_curr[i] != 0)
			mf_cost_EUR += parseFloat(perform_conversion(mf[i], mf_curr[i], eur_id));
	}
	
	mf_cost_USD = parseFloat(perform_conversion(ocean_freight_cost, ocean_freight_curr_id, usd_id));
	mf_cost_USD += parseFloat(perform_conversion(baf_cost, baf_curr_id, usd_id));
	mf_cost_USD += parseFloat(perform_conversion(caf_cost, caf_curr_id, usd_id));
	mf_cost_USD += parseFloat(perform_conversion(imo_cost, imo_curr_id, usd_id));
	for (i = 0; i < mf.length; i++) {
		if (mf_curr[i] != 0)
			mf_cost_USD += parseFloat(perform_conversion(mf[i], mf_curr[i], usd_id));
	}
	
	mf_cost_GBP = parseFloat(perform_conversion(ocean_freight_cost, ocean_freight_curr_id, gbp_id));
	mf_cost_GBP += parseFloat(perform_conversion(baf_cost, baf_curr_id, gbp_id));
	mf_cost_GBP += parseFloat(perform_conversion(caf_cost, caf_curr_id, gbp_id));
	mf_cost_GBP += parseFloat(perform_conversion(imo_cost, imo_curr_id, gbp_id));
	for (i = 0; i < mf.length; i++) {
		if (mf_curr[i] != 0)
			mf_cost_GBP += parseFloat(perform_conversion(mf[i], mf_curr[i], gbp_id));
	}
	
	mf_cost_EUR = parseFloat(mf_cost_EUR).toFixed(2); 
	mf_cost_USD = parseFloat(mf_cost_USD).toFixed(2); 
	mf_cost_GBP = parseFloat(mf_cost_GBP).toFixed(2);
	
	//mf_cost_EUR = parseFloat(perform_conversion(mf_cost_Base, base_currency, eur_id)).toFixed(2); 
	//mf_cost_USD = parseFloat(perform_conversion(mf_cost_Base, base_currency, usd_id)).toFixed(2); 
	//mf_cost_GBP = parseFloat(perform_conversion(mf_cost_Base, base_currency, gbp_id)).toFixed(2); 
	
	
	//D THC cost
	dthc_cost_EUR = parseFloat(perform_conversion(dthc_terminal_cost, dthc_terminal_curr_id, eur_id));
	for (i = 0; i < dthc.length; i++) {
		if (dthc_curr[i] != 0)
			dthc_cost_EUR += parseFloat(perform_conversion(dthc[i], dthc_curr[i], eur_id));
	}
	dthc_cost_USD = parseFloat(perform_conversion(dthc_terminal_cost, dthc_terminal_curr_id, usd_id));
	for (i = 0; i < dthc.length; i++) {
		if (dthc_curr[i] != 0)
			dthc_cost_USD += parseFloat(perform_conversion(dthc[i], dthc_curr[i], usd_id));
	}
	dthc_cost_GBP = parseFloat(perform_conversion(dthc_terminal_cost, dthc_terminal_curr_id, gbp_id));
	for (i = 0; i < dthc.length; i++) {
		if (dthc_curr[i] != 0)
			dthc_cost_GBP += parseFloat(perform_conversion(dthc[i], dthc_curr[i], gbp_id));
	}
		
	dthc_cost_EUR = parseFloat(dthc_cost_EUR).toFixed(2); 
	dthc_cost_USD = parseFloat(dthc_cost_USD).toFixed(2); 
	dthc_cost_GBP = parseFloat(dthc_cost_GBP).toFixed(2);
	
	//dthc_cost_EUR = parseFloat(perform_conversion(dthc_cost_Base, base_currency, eur_id)).toFixed(2); 
	//dthc_cost_USD = parseFloat(perform_conversion(dthc_cost_Base, base_currency, usd_id)).toFixed(2); 
	//dthc_cost_GBP = parseFloat(perform_conversion(dthc_cost_Base, base_currency, gbp_id)).toFixed(2); 
	
	//Saving
	$('#total_vessel_days').val(total_vessel_days);

	$('#obthc_total_usd').val(obthc_cost_USD);
	$('#obthc_total_eur').val(obthc_cost_EUR);
	$('#obthc_total_gbp').val(obthc_cost_GBP);
	
	$('#main_freight_total_usd').val(mf_cost_USD);
	$('#main_freight_total_eur').val(mf_cost_EUR);
	$('#main_freight_total_gbp').val(mf_cost_GBP);
	
	$('#dthc_terminal_total_usd').val(dthc_cost_USD);
	$('#dthc_terminal_total_eur').val(dthc_cost_EUR);
	$('#dthc_terminal_total_gbp').val(dthc_cost_GBP);
	
	//Summary calculation
	
	var tank_days_cost_usd = roundUP5(parseFloat(total_vessel_days_cost_USD));
	var tank_days_cost_eur = roundUP5(parseFloat(total_vessel_days_cost_EUR));
	var tank_days_cost_gbp = roundUP5(parseFloat(total_vessel_days_cost_GBP));
	
	$('#tank_days_cost_usd').val(tank_days_cost_usd);
	$('#tank_days_cost_eur').val(tank_days_cost_eur);
	$('#tank_days_cost_gbp').val(tank_days_cost_gbp);
	
	//USD
	var pr_pr_usd = roundUP5(parseFloat(mf_cost_USD));
	var dr_pr_usd = roundUP5(parseFloat(mf_cost_USD) + parseFloat(obthc_cost_USD));
	var dr_dr_usd = roundUP5(parseFloat(mf_cost_USD) + parseFloat(obthc_cost_USD) + parseFloat(dthc_cost_USD));
	var pr_dr_usd = roundUP5(parseFloat(mf_cost_USD) + parseFloat(dthc_cost_USD));
		
	$('#pr_pr_usd').val(pr_pr_usd);
	$('#dr_pr_usd').val(dr_pr_usd);
	$('#dr_dr_usd').val(dr_dr_usd);
	$('#pr_dr_usd').val(pr_dr_usd);
	
	$('#pr_pr_wtank_usd').val(parseFloat(pr_pr_usd) + parseFloat(tank_days_cost_usd));
	$('#dr_pr_wtank_usd').val(parseFloat(dr_pr_usd) + parseFloat(tank_days_cost_usd));
	$('#dr_dr_wtank_usd').val(parseFloat(dr_dr_usd) + parseFloat(tank_days_cost_usd));
	$('#pr_dr_wtank_usd').val(parseFloat(pr_dr_usd) + parseFloat(tank_days_cost_usd));
	
	
    //EUR
	var pr_pr_eur = roundUP5(parseFloat(mf_cost_EUR));
	var dr_pr_eur = roundUP5(parseFloat(mf_cost_EUR) + parseFloat(obthc_cost_EUR));
	var dr_dr_eur = roundUP5(parseFloat(mf_cost_EUR) + parseFloat(obthc_cost_EUR) + parseFloat(dthc_cost_EUR));
	var pr_dr_eur = roundUP5(parseFloat(mf_cost_EUR) + parseFloat(dthc_cost_EUR));
		
	$('#pr_pr_eur').val(pr_pr_eur);
	$('#dr_pr_eur').val(dr_pr_eur);
	$('#dr_dr_eur').val(dr_dr_eur);
	$('#pr_dr_eur').val(pr_dr_eur);
	
	$('#pr_pr_wtank_eur').val(parseFloat(pr_pr_eur) + parseFloat(tank_days_cost_eur));
	$('#dr_pr_wtank_eur').val(parseFloat(dr_pr_eur) + parseFloat(tank_days_cost_eur));
	$('#dr_dr_wtank_eur').val(parseFloat(dr_dr_eur) + parseFloat(tank_days_cost_eur));
	$('#pr_dr_wtank_eur').val(parseFloat(pr_dr_eur) + parseFloat(tank_days_cost_eur));
    
	//GBP
	var pr_pr_gbp = roundUP5(parseFloat(mf_cost_GBP));
	var dr_pr_gbp = roundUP5(parseFloat(mf_cost_GBP) + parseFloat(obthc_cost_GBP));
	var dr_dr_gbp = roundUP5(parseFloat(mf_cost_GBP) + parseFloat(obthc_cost_GBP) + parseFloat(dthc_cost_GBP));
	var pr_dr_gbp = roundUP5(parseFloat(mf_cost_GBP) + parseFloat(dthc_cost_GBP));
		
	$('#pr_pr_gbp').val(pr_pr_gbp);
	$('#dr_pr_gbp').val(dr_pr_gbp);
	$('#dr_dr_gbp').val(dr_dr_gbp);
	$('#pr_dr_gbp').val(pr_dr_gbp);
	
	$('#pr_pr_wtank_gbp').val(parseFloat(pr_pr_gbp) + parseFloat(tank_days_cost_gbp));
	$('#dr_pr_wtank_gbp').val(parseFloat(dr_pr_gbp) + parseFloat(tank_days_cost_gbp));
	$('#dr_dr_wtank_gbp').val(parseFloat(dr_dr_gbp) + parseFloat(tank_days_cost_gbp));
	$('#pr_dr_wtank_gbp').val(parseFloat(pr_dr_gbp) + parseFloat(tank_days_cost_gbp));
}


function roundUP5(value)
{
	var result = 0;
	var sign = 1; //For minus value calculations
	
	if(value < 0)
	{
		sign = -1;
		value = value * sign;
	}
	
	if (value > 0 && value <= 1)
	{
		value = 1;
	}
	
	var receive_val = Math.round(value);
	var last_digit = Math.abs(receive_val) % 10; 
	
	switch(last_digit) {
		case 0:	
		case 1:
	    case 2:
	    	result = last_digit * -1;
	    	break;
	    case 3:	
	    case 4:
	    case 5:	
	    	result = 5-last_digit;
	    	break;
	    case 6:
	    case 7:	
	    	result = (last_digit-5)*-1;
	    	break;
	    case 8:
	    case 9:
	    	result = 10-last_digit;
	    	break;
	}
	
	if (receive_val <= 2)
	{
		result = receive_val;
	} else {
		result = receive_val + result;
	}
	
	result = result * sign; //Change the value back to its actual sign.
	
	return result;
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

  var converted_cost = (value * rate);
  return isNaN(converted_cost) ? 0 : converted_cost;
}


//Copy previous raws 
$(document).ready(function() {

	$('.other-add-btn').live('click',function(){
		var otherDivData = $(this).parents('.form-group').data();
		var otherdivCountController = $('#'+otherDivData.otherdivCountController);
		var otherdivCount = otherdivCountController.val();
		otherdivCountController.val(parseInt(otherdivCount)+1);
		
		$(this).parents('.form-group').data("otherdiv-pos","middle");
		$(this).hide();
		$('#addcost-divs').children('.'+otherDivData.otherSample).clone().appendTo( "#"+otherDivData.otherdivContainer);
		$(this).parents('.form-group').next('.form-group').data("otherdiv-pos","last");
		
		$('.tab-content').css({ height: $('.tab-pane').height() });
	});

	$('.other-sub-btn').live('click',function(){
		var otherDivData = $(this).parents('.form-group').data();
		var otherdivCountController = $('#'+otherDivData.otherdivCountController);
		var otherdivCount = otherdivCountController.val();
		var otherdivPos = otherDivData.otherdivPos;
		
		if (otherdivCount == 2 || otherdivPos == 'last')
		{
			$(this).parents('.form-group').prev().children().children('.other-add-btn').show();
			$(this).parents('.form-group').prev().data("otherdiv-pos","last");
		}
		if (otherdivCount != 1)
		{
			$(this).parents('.form-group').remove();
			otherdivCountController.val(parseInt(otherdivCount)-1);
		}
		
		$('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page
		
		calculatePage(); // recalculate the Total.
	});
});


$('#start_city').change(function() {
 var selected = $(':selected', this).closest('optgroup').attr('label');

	$("#from_country option").filter(function() {
	    return this.text == selected; 
	}).attr('selected', true).trigger("chosen:updated");
});

$('#destination_city').change(function() {
 var selected = $(':selected', this).closest('optgroup').attr('label');

	$("#to_country option").filter(function() {
	    return this.text == selected; 
	}).attr('selected', true).trigger("chosen:updated");
});

$('#new_start_country').change(function() {
	 var selected = $(this).val();
	 $('#from_country option[value="' + selected + '"]').attr("selected","selected").trigger("chosen:updated");
});

$('#new_destination_country').change(function() {
	 var selected = $(this).val();
	 $('#to_country option[value="' + selected + '"]').attr("selected","selected").trigger("chosen:updated");
});


$('#imo-options').change(function() {
	var selectval = $(this).val();
	
	if (selectval == "Non IMO Only")
	{
		$('#imo_cost').val('');
		$('#imo-cost-div').hide();
		calculatePage();
		
	} else
	{
		$('#imo-cost-div').show();
	}
	
	$('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page
});

$(document).ready(function(){
	if ($('#imo-options').val() != "IMO Only")
	{
		$('#imo-cost-div').hide();	
	}
});


$('.must-check-date').blur(function(){
		
	var curdate = $(this);
	
	if(curdate.val() != ""){
		
		if(!Date_Check(curdate)) {
			curdate.parent().next().text('Invalid Date.');
		} else {
			curdate.parent().next().text('');
		}
	} else {
		curdate.parent().next().text('');
	}
});

