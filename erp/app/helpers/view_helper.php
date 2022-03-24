<?php

// Generate a link ------------------------------------------------------------
function link_to($text, $address, $params = array()) {
  $address = path_to($address);
  $class = array_key_exists("class", $params) ? $params['class'] : "";
  echo "<a href='{$address}' class='{$class}'>
          {$text}</a>";
}


// Generate a path ------------------------------------------------------------
function path_to($url) {
  return HOME."erp.php".$url;
}


// Pretty date ----------------------------------------------------------------
function pretty_date($date) {
  return empty($date) ? "" : date(BTL_DEF_VIEW_DATE, strtotime($date));
}

// Pretty date with full year----------------------------------------------------------------
function pretty_date_full($date) {
	return empty($date) ? "" : date(BTL_DEF_VIEW_DATE, strtotime($date));
}

// Wrapped td text with tooltip ----------------------------------------------------------------
function td_text_wrap($data, $size) {
	$data_len = strlen($data);
	$data_tooltip = "";
	$data_text = $data;
	if ($data_len > $size)
	{
		$data_tooltip = $data;
		$data_text = substr($data, 0, $size);
		$data_text .= "&nbsp;<span class='fa fa-pull-right fa-caret-right fa-lg text-danger'></span>";
	}
	
	echo "<div data-toggle='tooltip' data-original-title='" . $data_tooltip . "'>" . trim($data_text) . "</div>";
}

// Wrapped td text with tooltip ----------------------------------------------------------------
// $cap_letter_size = desired size * 0.8181
function td_charsize_text_wrap($data, $cap_letter_size) {
	$data_len = strlen($data);
	$data_tooltip = "";
	$data_text = $data;
	$size = $cap_letter_size;
	
	if($data_len > $cap_letter_size)
	{
		$data_check_str = substr($data, 0, $cap_letter_size + 10);
		$data_check_str_count = strlen($data_check_str);
		$data_cap_count = strlen(preg_replace('![^A-Z]+!', '', $data_check_str));
		$data_thin_letter_count = strlen(preg_replace('![^Ijti1. ]+!', '', $data_check_str));
		//Note : Lower case letter occupy 0.8181% of upper case letter and itI1 etc will occupy 0.45% of upper case letter.
		$data_actual_len = (($data_check_str_count - $data_cap_count - $data_thin_letter_count) * 0.8181) + $data_cap_count + ($data_thin_letter_count * 0.45);
		$data_actual_len = floor($data_actual_len);
		
		if($data_actual_len > $cap_letter_size)
		{
			$size = $data_check_str_count - round($data_actual_len - $cap_letter_size);
			
		} else {
			$size = $data_check_str_count;
		}
	}
	
	if ($data_len > $size)
	{
		$data_tooltip = $data;
		$data_text = substr($data, 0, $size);
		$data_text .= "&nbsp;<span class='fa fa-pull-right fa-caret-right fa-lg text-danger'></span>";
	}

	echo "<div data-toggle='tooltip' data-original-title='" . $data_tooltip . "'>" . trim($data_text) . "</div>";
}


//Tool tip lenght limit
function get_tooltip_text($data)
{
	$data_len = strlen($data);
	$data_tooltip = $data;
	
	if($data_len > 250)
	{
		$data_tooltip = substr($data, 0, 250) . "...";
	}
	
	return $data_tooltip;
}

//Get PR-DR for listing page------------------------------------------------------------
function get_prdr_list_val($data, $curr, $with_tank_cost) {
	$mfCost = 0;
	$obthcCost = 0;
	$dthcCost = 0;
	$prprCost = 0;
	$drprCost = 0;
	$drdrCost = 0;
	$prdrCost = 0;
	$tankCost = 0;
	
	if($curr == 1){
		$mfCost = $data->main_freight_total_eur;
		$obthcCost = $data->obthc_total_eur;
		$dthcCost = $data->dthc_terminal_total_eur;
		$prprCost = $data->pr_pr_eur;
		$drprCost = $data->dr_pr_eur;
		$drdrCost = $data->dr_dr_eur;
		$prdrCost = $data->pr_dr_eur;
		$tankCost = $data->tank_days_cost_eur;
	} else if ($curr == 3){
		$mfCost = $data->main_freight_total_usd;
		$obthcCost = $data->obthc_total_usd;
		$dthcCost = $data->dthc_terminal_total_usd;
		$prprCost = $data->pr_pr_usd;
		$drprCost = $data->dr_pr_usd;
		$drdrCost = $data->dr_dr_usd;
		$prdrCost = $data->pr_dr_usd;
		$tankCost = $data->tank_days_cost_usd;
	} else if ($curr == 2){
		$mfCost = $data->main_freight_total_gbp;
		$obthcCost = $data->obthc_total_gbp;
		$dthcCost = $data->dthc_terminal_total_gbp;
		$prprCost = $data->pr_pr_gbp;
		$drprCost = $data->dr_pr_gbp;
		$drdrCost = $data->dr_dr_gbp;
		$prdrCost = $data->pr_dr_gbp;
		$tankCost = $data->tank_days_cost_gbp;
	}
	
	if($with_tank_cost == 2) //1 = without tank cost , 2 = with tank cost
	{
		$prprCost = $prprCost + $tankCost;
		$drprCost = $drprCost + $tankCost;
		$drdrCost = $drdrCost + $tankCost;
		$prdrCost = $prdrCost + $tankCost;
	}
	
	if($dthcCost == 0)
	{
		$prdrCost = 0;
		$drdrCost = 0;
	}
	
	if($obthcCost == 0)
	{
		$drprCost = 0;
		$drdrCost = 0;
	}
	
	$result = array('prpr'=>$prprCost, 'drpr'=>$drprCost, 'drdr'=>$drdrCost, 'prdr'=>$prdrCost);
	
	return $result;
}

// Currency -------------------------------------------------------------------
function currency($amount) {
  return sprintf("%.2f", $amount);
}


// Supplier cost fuel surcharge -----------------------------------------------
function cost_fuel_surcharge($cost) {
  if(!empty($cost->fuel_surcharge_amount)) {
    return $cost->currency->cur_html.currency($cost->fuel_surcharge_amount);
  } elseif(!empty($cost->fuel_surcharge_percentage)) {
    return $cost->fuel_surcharge_percentage."%";
  }
  return "&nbsp;";
}

// function for calculate baf and caf without toll 
function sur_charge_amount($cost ,$amount_override = false, $cur_html = ""){
   if($cur_html ==""){
       $cur_html = $cost->currency->cur_html;
   }

   $amt = $amount_override;
   $amount = 0;
   $amount_override =($cost->amount == 0 ? $amt : $cost->amount) ;
   $result = "";
	
  //BAF amount
  if(!empty($cost->fuel_surcharge_amount) && ($cost->fuel_surcharge_amount != 0 )) {
    $amount = $cost->fuel_surcharge_amount;
  } elseif(!empty($cost->fuel_surcharge_percentage)) {
    $amount = $amount_override * (($cost->fuel_surcharge_percentage) / 100);

  }
  
  //CAF amount
  if(!empty($cost->caf_surcharge_amount) && ($cost->caf_surcharge_amount != 0 )) {
    $amount = $amount + $cost->caf_surcharge_amount;
  } elseif(!empty($cost->caf_surcharge_percentage)) {
    $amount = $amount + ($amount_override * (($cost->caf_surcharge_percentage) / 100));
  } 

  if($amount != 0){
  	$result = $cur_html .currency(round($amount,2));
  }
  return $result;
}


// Supplier cost total amount -------------------------------------------------
function cost_total_amount($cost, $amount_override = false, $cur_html = "", $transport_mode = "") {
  if($cur_html == ""){
    $cur_html = $cost->currency->cur_html;
  }
  if($transport_mode == ""){
 	 $transport_mode = $cost->transport_mode->id;
  }
  if(!$amount_override) {
    $amount_override = $cost->amount;
  }

  //BAF amount
  if(!empty($cost->fuel_surcharge_amount)) {
    $amount = $amount_override + $cost->fuel_surcharge_amount;
  } elseif(!empty($cost->fuel_surcharge_percentage)) {
    $amount = $amount_override + ($amount_override * (($cost->fuel_surcharge_percentage) / 100));
  } else {
    $amount = $amount_override;
  }
  
  //CAF amount
  if(!empty($cost->caf_surcharge_amount)) {
    $amount = $amount + $cost->caf_surcharge_amount;
  } elseif(!empty($cost->caf_surcharge_percentage)) {
    $amount = $amount + ($amount_override * (($cost->caf_surcharge_percentage) / 100));
  } 
  
  //Toll amount
  if(!empty($cost->toll)) {
    $amount = $amount + $cost->toll;
  }

  if($transport_mode == 4) {
    if(!empty($cost->low_water_surcharge)) {
      $amount += $cost->low_water_surcharge;
    }

    if(!empty($cost->high_water_surcharge)) {
      $amount += $cost->high_water_surcharge;
    }
  }

  $currency_symbol = $cur_html;
  return $currency_symbol.currency(round($amount,2));
}


//Split the text with specified length
function textSpliter ($text, $limit){
	$result = array();
	$pos = 0;
	$prepos = 0;
	$txt_len = strlen($text);

	while($pos = stripos($text, ' ', $pos+$limit)){
		$splited_text = substr($text, $prepos, $pos - $prepos);
		array_push($result, trim($splited_text));
		$prepos = $pos;
	}

	$splited_text = substr($text, $prepos, $txt_len - $prepos);
	array_push($result, trim($splited_text));

	return $result;
}

function excelCellTextLineHeight($text, $limit, $lnBreak)
{
	$result = 0;
	$txtArray = explode($lnBreak, $text);
	
	foreach($txtArray as $textItem)
	{
		$pos = 0;
		$prepos = 0;
		$lineCheck = 0;
		$txt_len = strlen($textItem);
		
		while($pos = stripos($textItem, ' ', $pos+$limit)){
			$result +=1;
			$prepos = $pos;
			$lineCheck = 1;
		}
		if(($txt_len - $prepos) > 5){
			$result +=1;
			$lineCheck = 1;
		}
		if($lineCheck == 0){
			$result +=1;
		}
	}

	if($result == 0){
		$result = -1; //-ve height value will be ignored by phpexcel
	}
	
	return $result;
}

function removeSlashes($text) {
	$result = $text;

	if (get_magic_quotes_gpc()){
		$result = stripslashes($text);
	}

	return $result;
}

/*
	Function for new line text area values
*/
function phpWordTextareaNewLineCustom($tc1, $textlines = "", $fancyTableFontStyle3 = ""){

	$textlinesArr = array_filter(explode("\n", $textlines));

	for ($i = 0; $i < sizeof($textlinesArr); $i++) {
	    $tc1->addText(trim($textlinesArr[$i]), $fancyTableFontStyle3);
	}
	return $tc1;
}

/* Function for Customer Portal Traffic Light */
function getTrafficLight($class_color){
   	if($class_color == 'RED'){
	   $req_dt_style ="style='background-color:red; color:white'";
   	}elseif($class_color == 'AMBER'){
	   $req_dt_style ="style='background-color:#FFBF00;color:black'";
   	}elseif($class_color == 'GREEN'){
	   $req_dt_style ="style='background-color:green; color:white'";
   	}
	return $req_dt_style;
}
