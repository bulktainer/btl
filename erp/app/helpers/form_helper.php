<?php

// ----------------------------------------------------------------------------
function tag_options($options = array()) {
  if(empty($options)) {
    return false;
  }

  $attrs = array();
  foreach($options as $k => $v) {
    if($v == '') {
      continue;
    }

    $attrs[] = $k.'="'.$v.'"';
  }

  return " ".implode(' ', $attrs);
}

// ----------------------------------------------------------------------------
function content_tag($name, $content, $params = array()) {
  $attrs = tag_options($params);
  return "<{$name}{$attrs}>{$content}</{$name}>\n";
}

// ----------------------------------------------------------------------------
function options_for_select($container, $selected = false) {
  $elements = array();
  // $selected = $params['selected'];
  // $disabled = $params['disabled'];

  foreach($container as $c) {
    $attrs = array();
    $attrs['selected'] = $c['value'] == $selected ? "selected" : "";
    // $attrs['disabled'] = $disabled;
    $attrs['value'] = $c['value'];

    $elements[] = content_tag('option', $c['content'], $attrs);
  }

  return implode("\n", $elements);
}

// ----------------------------------------------------------------------------
function options_from_collection_for_select($collection, $value_method, $text_method, $selected = false, $unique = false,$dataArr = array()) {
  $options = array();
  $collected = array();

  foreach($collection as $c) {
    if($unique) {
      if(in_array($c->{$value_method}, $collected)) {
        continue;
      }

      $collected[] = $c->{$value_method};
    }

    $options[] = array(
      'value' => $c->{$value_method},
      'content' => $c->{$text_method}
    );
  }
  if(!empty($dataArr)) {
        return options_for_select_attr($options, $selected,$dataArr);
  }else{
        return options_for_select($options, $selected);
  }
  
}
/* DM 30-nov-2016
 * function for fill option from select
 */
function option_for_select_from_associative_array($options,$selected,$firstElement = true,$defaultText = ''){
	$option = '';
	if($firstElement){
		$option .= '<option value="">'.$defaultText.'</option>';
	}
	if(!empty($options)){
		foreach($options as $key => $eachOption){
			$selectedVal = ($selected == $key) ? 'selected' : '';
			$option .= '<option value="'.$eachOption.'" '.$selectedVal.'>'.$eachOption.'</option>';
		}
	}
	return $option;
}

// ----------------------------------------------------------------------------
function option_groups_from_collection_for_select($collection, $group_method, $group_label_method, $option_key_method, $option_value_method, $selected_key = false) {
  $elements = array();
  foreach($collection as $c) {
    $option_tags = options_from_collection_for_select(
      $c->{$group_method}, $option_key_method, $option_value_method, $selected_key);

    if($option_tags != '') {
      $elements[] = content_tag('optgroup', $option_tags, array('label' => $c->{$group_label_method}));
    }
  }

  return implode("\n", $elements);
}

// ----------------------------------------------------------------------------
function select_tag($field, $option_tags, $options = array(), $required = '') {
  $field_name = format_field($field);

  echo '
    <label for="'.$field_name.'" class="col-sm-2 control-label '. $required .'">
      '.$field.'
    </label>
    <div class="col-sm-3">
      <select id="'.$field_name.'" name="'.$field_name.'" class="chosen form-control" data-placeholder="Please select">
        <option value=""></option>
        '.$option_tags.'
      </select>
    </div>';
}

// ----------------------------------------------------------------------------
function select_tag_custome_label_name($field, $option_tags, $options = array(), $required = '',$label) {
	$field_name = format_field($field);
	echo '
	<label for="'.$field_name.'" class="col-sm-2 control-label '. $required .'">
	'.$label.'
	</label>
	<div class="col-sm-3">
	<select id="'.$field_name.'" name="'.$field_name.'" class="chosen form-control" data-placeholder="Please select">
	<option value=""></option>
	'.$option_tags.'
	</select>
	</div>';
}

// ----------------------------------------------------------------------------
function select_tag_custom_for_job_template($field, $option_tags, $options = array(), $required = '',$extraOption) {
	$field_name = format_field($field);

	echo '
	<label for="'.$field_name.'" class="col-sm-2 control-label '. $required .'">
	'.$field.'
	</label>
	<div class="col-sm-3">
	<select id="'.$field_name.'" name="'.$field_name.'" class="chosen form-control normal" data-placeholder="Please select">
	<option value=""></option>
	'.$option_tags.$extraOption.'
	</select>
	</div>';
}

/* DM 11-May-2016
 * function for fill option from select whith different key and value
*/
function option_for_select_from_associative_array_diff_key($options,$selected,$firstElement = true,$defaultText = ''){
	$option = '';
	if($firstElement){
		$option .= '<option value="">'.$defaultText.'</option>';
	}
	if(!empty($options)){
		foreach($options as $key => $eachOption){
			$selectedVal = ($selected == $key) ? 'selected' : '';
			$option .= '<option value="'.$key.'" '.$selectedVal.'>'.$eachOption.'</option>';
		}
	}
	return $option;
}

//options with data atributes
function options_for_select_attr($container, $selected = false,$dataArr = array()) {
  $elements = array();
  // $selected = $params['selected'];
  // $disabled = $params['disabled'];
  foreach($container as $c) {
    $attrs = array();
    $attrs['selected'] = $c['value'] == $selected ? "selected" : "";
    // $attrs['disabled'] = $disabled;
    if(!empty($dataArr)) { 
        $attrs['data-val'] = $dataArr[$c['value']];
    }
    $attrs['value'] = $c['value'];
    $elements[] = content_tag('option', $c['content'], $attrs);
  }
  return implode("\n", $elements);
}

/* DM 26-May-2020
 * Create radio button
 */
function create_radio_button($name,$options,$selected="", $className="", $noSelection = false){
    
    if(!empty($options)){
        foreach($options as $key => $eachOption){
            $selectedVal = ($selected == $key && !$noSelection) ? ' checked="checked" ' : '';
            $option .= '<label><input type="radio" class="'.$className.'" name="'.$name.'" value="'.$key.'" '.$selectedVal.'/>'.$eachOption.'&nbsp;&nbsp;</label>';
        }
    }
    return $option;
}

// Option group drop down ----------------------------------------------------------------------------
function option_from_find_by_sql($recordset, $group_name, $val, $text, $selected_key = false) {
  $elements = array();
  $prevGroup = "";
  
  foreach($recordset as $c) {

     if($group_name && $prevGroup != $c->{$group_name}){
          if($prevGroup != ""){
              $elements[] = "</optgroup>"; 
          }
          $elements[] = '<optgroup label="' . $c->{$group_name} . '">';
          $prevGroup = $c->{$group_name};
      }

      $selected = ($c->{$val} == $selected_key) ? "selected" : "";
      $elements[] = '<option value="'. $c->{$val} . '" ' .  $selected . '>' . $c->{$text} . '</option>';
  }

  if($group_name && $prevGroup != ""){
      $elements[] = "</optgroup>";  
  }

  return implode("\n", $elements);
}


function btlDefaultLoader($divClass){

  echo ' <div class="overlay-complete-loader">
            <div class="btl_relative" style="display: none;">
              <div class="btl_loaderfix">
                <div class="btl_loadrow"><img src="'.HOME.'images/ajax-loader-btl.gif"/></div>
              </div>
              <div class="btl_overlay"></div>
            </div> 
          <div style="width: 100%;overflow-x: auto;">
          <div class="'.$divClass.'"></div>
          </div>
        </div>';

}


function findPreviousRechargeType($jsonData){
  $retmsg  = ' title="Select" ';
  if(trim($jsonData) != ""){
    $d = json_decode($jsonData, true);
    if(array_key_exists('recharge_type', $d)){
      if($d['recharge_type'] == 'SUMMARY'){
        $retmsg  = ' title="Previous recharge is a Summary Recharge" disabled checked ';
      }else if($d['recharge_type'] == 'DEMTK'){
        $retmsg  = ' title="Previous recharge is a DEMTK Recharge" disabled ';
      }
    }
  }
  echo $retmsg;
}

/**
    tankplan icon
*/
function tankPlanExpireIconInfo($currDate, $expireDate, $motType){
    $planFirstDate = strtotime($currDate);
    $nextTestDate = strtotime($expireDate);
    $returnMsg = "";
    $nextTestDateDisplay = date("d/m/Y", $nextTestDate);

    $monthDiff = '+'.TANK_EXP_DEFAULT_DAYS.' day';
    $final = date("Y-m-d", strtotime($monthDiff, $planFirstDate));

    if($planFirstDate >= $nextTestDate){
      $returnMsg = '<img class="red-tooltip info-hover-img" data-html="true" src="'.HOME.'images/Tank_expired.png" width="24px;"  data-notes="Test Date Expired: '.$nextTestDateDisplay .' / '.$motType.'">';
    }else if((strtotime($final) >= $nextTestDate) && ($planFirstDate <= $nextTestDate)){

      $nextPerodicday = (int) (abs($planFirstDate - $nextTestDate)/60/60/24);
      $returnMsg = '<img class="red-tooltip info-hover-img" data-html="true" src="'.HOME.'images/Tank_expire_coming.png" width="24px;"  data-notes="'.$nextTestDateDisplay .' / '.$motType.' (within <strong>'.$nextPerodicday.'</strong> days)">';
    }
    return $returnMsg;
}

function summaryPODEMTKBadge($rechargeType, $demtk_hover_date, $job_curr_name, $jecTotal, $count = 1){

  $curr = show_currency_html(strtolower($job_curr_name) , ' currency-fa');
  if($rechargeType == "D_SUMMARY" && $demtk_hover_date != "" && $count == 1){ 
     
     $hoverData = json_decode($demtk_hover_date, true);
     if(!empty($hoverData)){
      $hoverData = $hoverData['from'] .' - '. $hoverData['to'];
    } 

     echo '<span  data-placement="top" 
                  data-toggle="popover" 
                  data-trigger="hover" 
                  data-content="'.$hoverData.'" 
                  class="badge" 
                  style="color: black;background-color: rgb(253 234 99);cursor: pointer;">'.$curr .'&nbsp;'.number_format($jecTotal, 2).'</span>';
    }else{
      echo $curr.'&nbsp;'.number_format($jecTotal, 2);
    }
}

function renderQssheModal(){
  echo '<div class="modal fade" id="qsshe_model" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog cust-small-modal">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title qsshe-job-span"></h4>
              </div>
                <div class="modal-body">
                 <div class="form-horizontal">
                    <div  id="qsshe-plan-div"></div>
                </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default link-btn" data-dismiss="modal"><span class="glyphicon glyphicon-remove-circle"></span> Close</button>
                </div>
            </div>
          </div>
        </div>';
}


function renderCommonMsg($msg, $type, $returntype = "ajax"){

  if($type == 'error'){
   $retM =  ' <div class="alert alert-danger alert-dismissable">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong>'.$msg.'
          </div>';
  }else{
    $retM =  '<div class="alert alert-success alert-dismissable">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong>'.$msg.'
          </div>';
  }
  if($returntype == 'ajax'){ echo $retM; }else{ return $retM; }
}

/* DM 15-Dec-2020
 * function for fill option from select whith different key and value as key
 */
function option_for_select_from_associative_array_diff_key_value($options,$selected,$firstElement = true,$defaultText = ''){
    $option = '';
    if($firstElement){
        $option .= '<option value="">'.$defaultText.'</option>';
    }
    if(!empty($options)){
        foreach($options as $key => $eachOption){
            $selectedVal = ($selected == $key) ? 'selected' : '';
            $option .= '<option value="'.$key.'" '.$selectedVal.'>'.$key.'</option>';
        }
    }
    return $option;
}

/* DM 15-Dec-2020
 * function for fill option from select with different key and value as key+value
 */
function option_for_select_from_associative_array_with_key_value($options,$selected,$firstElement = true,$defaultText = ''){
    $option = '';
    if($firstElement){
        $option .= '<option value="">'.$defaultText.'</option>';
    }
    if(!empty($options)){
        foreach($options as $key => $eachOption){
            $selectedVal = ($selected == $key) ? 'selected' : '';
            $option .= '<option value="'.$key.'" '.$selectedVal.'>'.$key.'('.$eachOption.')'.'</option>';
        }
    }
    return $option;
}

function suppliercostNameurl($tname,$detailName, $costid, $validTo, $dateFrom=""){

  $dateFrom = strtotime($dateFrom);
  $validTo = strtotime($validTo);
  $today = strtotime(date('Y-m-d'));

  if(in_array($tname, array('Haulage', 'Rail', 'Shipping', 'Barge', 'Shunt', 'Cleaning', 'DS_Shipping'))){

    $cname = explode('|',iconDesignforExtendJT($tname));
    if(!empty($costid)){
          if($validTo < $today){
            $transport_mode_link = '<i class="fa fa-exclamation-triangle" style="color:'.$cname[0].';" title="'.$cname[1].'"></i><a href="'.HOME.'erp.php/supplier-costs/'.strtolower($tname).'?id='.$costid.'&archive_status=2" title="View Supplier Rates" target="_blank" style="color:'.$cname[0].';text-decoration:none; !important">&nbsp;'.htmlentities($detailName);
          }else{
            $transport_mode_link = '<a href="'.HOME.'erp.php/supplier-costs/'.strtolower($tname).'?id='.$costid.'&archive_status=2" title="View Supplier Rates" target="_blank">'.htmlentities($detailName);
          }
    }else{
      $transport_mode_link = '<i class="fa fa-exclamation-triangle" style="color:'.$cname[0].';" title="'.$cname[1].'"></i><span title="Supplier rate not available">&nbsp;'.htmlentities($detailName).'</span>';
    }
  }else{
    $transport_mode_link = htmlentities($detailName);
  }
  return $transport_mode_link;
}

function renderoncarriageDiv($jobNo, $isOncarrage = 0, $pageType = 'job'){
  $title = ($isOncarrage) ? 'Import' : 'Oncarriage';
  if($pageType == 'job'){
    $class = 'oncarriagejobtable';
    $url = HOME.'erp.php/job/'.$jobNo.'/detail';
  }else{
    $class = 'oncarriagejobcosttable';
    $url = HOME.'erp.php/job-cost/index?id='.$jobNo;
    
  }
  echo '<div class="panel panel-default">
        <div class="panel-body">
          <fieldset>      
            <legend id="oncarriagejob_btn" data-jobno="'.$jobNo.'" class="scroll-up-btn collapsed" data-toggle="collapse" data-target="#oncarriagejob_btn_div">'.$title.' Job <a href="'.$url.'" target="_blank">'.$jobNo.'</a>
                <a class=" pull-right">
                  <i class="fa fa-plus-circle"></i>
              </a>
          </legend>
          </fieldset>
          <div id="oncarriagejob_btn_div" class="panel-collapse collapse" style="height: 30px;"> 
            <div id="'.$class.'" style="width: 100%;overflow-x: auto;"></div>
          </div>
        </div>
    </div>';
}
function options_from_collection_for_select_with_data_attributes($collection, $value_method, $text_method, $selected = false, $dataAttributes = []) {
  $html = "";
  foreach($collection as $c) {
    
    $arr = array(
      'value' => $c->{$value_method},
      'selected' => $c->{$value_method} == $selected ? "selected" : ""
    );
    foreach ($dataAttributes as $key => $column) {
      $arr['data-'.$key] = $c->{$column};
    } 
    $html .= content_tag('option', $c->{$text_method}, $arr);
  }
  return $html;
  
}
function options_from_collection_for_select_with_data_attributes_for_multi($collection, $value_method, $text_method, $selected = [], $dataAttributes = []) {
  $html = "";
  foreach($collection as $c) {
    
    $arr = array(
      'value' => $c->{$value_method},
      'selected' => in_array($c->{$value_method}, $selected)? "selected" : ""
    );
    foreach ($dataAttributes as $key => $column) {
      $arr['data-'.$key] = $c->{$column};
    } 
    $html .= content_tag('option', $c->{$text_method}, $arr);
  }
  return $html;
  
}