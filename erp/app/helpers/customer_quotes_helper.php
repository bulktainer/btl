<?php

namespace Btl\Helpers\CustomerQuotes;


function cost_extras_status_icon($cost, $quote_extras = array()) {
  $class = 'extra-icon-'.$cost->supplier_cost->id;

  if(cost_has_applied_extras($cost, $quote_extras)) {
    $class .= ' glyphicon-ok-sign';
    $title = 'There are extras applied to this cost.';
  } else {
    $class .= ' glyphicon-remove-circle';
    $title = 'No extras applied to this cost.';
  }

  echo '
    <span class="glyphicon '.$class.'" title="'.$title.'"></span>';
}


function cost_extras_add_remove_icon($cost, $quote = false) {
  $cost_extras = $cost->supplier_cost->supplier->cost_extras;
  if(empty($cost_extras)) {
    render_no_extras_icon();
    return;
  }

  if(extras_available_for_cost($cost, $cost_extras)) {
    $id = $quote ? $quote->id : '';

    echo '
      <a href="#"
          class="add-extras extras-'.$cost->supplier_cost->id.'"
          data-toggle="modal"
          data-target="#customer_quote_extras_modal"
          data-quote="'.$id.'"
          data-supplier="'.$cost->supplier_cost->supplier_id.'"
          data-suppliercost="'.$cost->supplier_cost->id.'">

        <span data-toggle="tooltip" title="Add / remove extra cost." class="glyphicon glyphicon-plus-sign extra-icon"></span>

      </a>';
    return;
  }

  render_no_extras_icon();
}


function extras_available_for_cost($cost, $extras) {
  return true;
}


function cost_has_applied_extras($cost, $extras) {
  $applied_extras = array_filter($extras, function($e) use($cost) {
    return $e->supp_cost_id == $cost->supplier_cost->id;
  });

  $supp_costs_extras_ids = array();
  foreach ($applied_extras as $applied_extras_row) {
  	array_push($supp_costs_extras_ids, $applied_extras_row->supp_costs_extras_id);
  }
  
  $result = false;
  if(!empty($supp_costs_extras_ids)) {
  	$sce_count = \SupplierCostsExtra::count(array('conditions' => array('id in (?)', $supp_costs_extras_ids)));
  	if($sce_count > 0) {
  		$result = true;
  	}
  }
  
  return $result;
}


function render_no_extras_icon() {
  $title = 'No extras available.';
  echo '
    <span class="glyphicon glyphicon-ban-circle" title="'.$title.'"></span>';
}


function search_result_add_remove_icon($result, $extras_ids) {
  $filtered = array_filter($extras_ids, function($e) use($result) {
    return $e->supplier_id == $result->supp_id;
  });

  if(empty($filtered)) {
    echo '
      <span class="glyphicon glyphicon-ban-circle"></span>';
    return;
  }

	echo '
    <a href="#"
        class="add-extras extras-'.$result->supplier_cost_id.'"
        data-toggle="modal"
        data-target="#customer_quote_extras_modal"
        data-quote=""
        data-supplier="'.$result->supp_id.'"
        data-suppliercost="'.$result->supplier_cost_id.'">

      <span class="glyphicon glyphicon-plus-sign extra-icon"></span>

    </a>';
}


function render_filters($quotes) {
  $customers = array();
  $start_cities = array();
  $start_countries = array();
  $end_cities = array();
  $end_countries = array();

  foreach($quotes as $quote) {
    if(!in_array($quote->customer->cust_name, $customers, true)){
      array_push($customers, $quote->customer->cust_name);
    }
    if(!in_array($quote->start_city->name, $start_cities, true)){
      array_push($start_cities, $quote->start_city->name);
    }
    if(!in_array($quote->start_city->country->iso, $start_countries, true)){
      array_push($start_countries, $quote->start_city->country->iso);
    }
    if(!in_array($quote->end_city->name, $end_cities, true)){
      array_push($end_cities, $quote->end_city->name);
    }
    if(!in_array($quote->end_city->country->iso, $end_countries, true)){
      array_push($end_countries, $quote->end_city->country->iso);
    }
  }

  sort($customers);
  sort($start_cities);
  sort($start_countries);
  sort($end_cities);
  sort($end_countries);

  sort_filter('Customer', '1', $customers);
  sort_filter('Start City', '2', $start_cities);
  sort_filter('Start Country', '3', $start_countries);
  sort_filter('End City', '3', $end_cities);
  sort_filter('End Country', '4', $end_countries);
}


function supplier_costs_total($quote) {
  return array_reduce($quote->customer_quote_costs, function($i, $cost) {
    return $i += $cost->converted_amount;
  });
}


function tank_cost_total($quote) {
  $tank_days = array_reduce($quote->customer_quote_costs, function($i, $cost) {
    return $i += $cost->tank_days;
  });

  return ($tank_days + $quote->tank_days_adjustment) * $quote->rate_per_day;
}

function tank_cost_total_exchanged_rate($quote_costs, $quote, $basCurrName) {
	$result = 0;
	$tank_days = 0;
	
	$base_cur_id = \Currency::get_currency_id($basCurrName);
	$nonbase_cur_id = ($quote->currency->cur_id != null || $quote->currency->cur_id != '') ? $quote->currency->cur_id : $base_cur_id;  
	
	if($quote_costs) {
		foreach($quote_costs as $cost) {
			$total_tank_days = '';
			$total_tank_days = $cost->supplier_cost->days_in_transit + $cost->supplier_cost->days_awaiting_transit;
			if($total_tank_days != null || $total_tank_days != '') {
				$tank_days += $total_tank_days; 
			}
		}
	}
	
	$result = ($tank_days + $quote->tank_days_adjustment) * $quote->rate_per_day;
	$exchange =  \ExchangeRate::get_exchange_rate($base_cur_id, $nonbase_cur_id, date('Y-m-d'));
	
	if(count($exchange) > 0) {
		$exchange_rate = $exchange[0]->exch_rate;
	} else {
		$exchange_rate = 1;
	}
	
	$result = $result * $exchange_rate;
	$result = number_format($result,2,'.','');
	
	return $result;
	
}

function supplier_costs_extras_with_rates_converted($supplierCostsExtras, $customer_quote) {
	$result = array();
	
	$createdate = date_format($customer_quote->created_at, 'Y-m-d');
	$modifieddate = date_format($customer_quote->modified_at, 'Y-m-d');
	$nonbase_cur_id = $customer_quote->currency_id; 
	
	if($modifieddate) {
		$date = $modifieddate;
	} elseif($createdate) {
		$date = $createdate;
	} else {
		$date = date('Y-m-d');
	}
	
	foreach($supplierCostsExtras as $sce) {
		$rowdata = array();
		$rowdata['supp_cost_id'] = $sce->supp_cost_id;
		$rowdata['supp_costs_extras_id'] = $sce->supp_costs_extras_id;
		$rowdata['cur_id'] = $sce->cur_id;
		$rowdata['name'] = $sce->name;
		$rowdata['cost'] = $sce->cost;
		$rowdata['converted_amount'] = $sce->converted_amount;
		$rowdata['cur_name'] = $sce->cur_name;
		$rowdata['deleteditem'] = $sce->deleteditem;
		
		if ($sce->converted_amount == ""){
			$converted_amount = \ExchangeRate::get_convert_rate($sce->cost, $sce->cur_id, $nonbase_cur_id, $date);
			$rowdata['converted_amount'] = $converted_amount ;
		} else {
			$rowdata['converted_amount'] = $sce->converted_amount;
		}
		
		array_push($result, (object) $rowdata);
	}
	
	$result = (object) $result;
	
	return $result;
}
