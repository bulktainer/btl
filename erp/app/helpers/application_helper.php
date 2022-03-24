<?php

/* format values ------------------------------------------------------------*/
function format_field($field){
  $field = strtolower($field);
  $field = str_replace(' ', '_', $field);
  return $field;
}

function format_placeholder($field){
  $field = str_replace('_', ' ', $field);
  return $field;
}

/* buttons ------------------------------------------------------------------*/
function add_record_btn($section = '') {
  echo '<button type="submit" class="btn btn-info" name="add_record"><span class="glyphicon glyphicon-plus-sign"></span> Add Rate</button>';
}

function delete_rate(){
  echo '<a href="#" class="delete-rate" title="Delete rate"><span class="glyphicon glyphicon-trash"></span></a>';
}

function delete_all_rates_btn(){
  echo '<button type="submit" class="btn btn-danger pull-right delete-all-rates"><span class="glyphicon glyphicon-trash"></span> Delete all rates</button>';
}

function save_form_btns($is_update, $update_or_save_btn, $btn_name, $id, $name, $path, $root, $supplier = false, $backPath = ""){
  echo '<div class="form-group form-buttons">';
    echo '<button class="btn btn-success disabled disable-before-load '.$update_or_save_btn.'" data-path="'.$path.'"><span class="glyphicon glyphicon-ok-sign"></span> Save '.$name.'</button>&nbsp;';
    if($is_update == 1){
      if($supplier == false){
        echo '<a href="'.path_to('/'.$root.'/'.$id.'/duplicate').'" title="Duplicate '.$name.'" class="btn btn-warning disabled disable-before-load duplicate-'.$btn_name.' duplicate-icon" data-path="'.$path.'" data-id="'.$id.'"><i class="fa fa-files-o"></i> Duplicate '.$name.'</a>';
        echo '<a href="'.path_to('/'.$root.'/'.$id.'/delete').'" title="Delete '.$name.'" class="btn btn-danger pull-right disabled disable-before-load delete-'.$btn_name.' delete-icon" data-path="'.$path.'" data-id="'.$id.'"><i class="fa fa-trash-o"></i> Delete '.$name.'</a>';
      }
    }
    if($backPath == ""){ $backPath = path_to('/'.$root.'/index'); }
    echo '<br /><br /><a href="'.$backPath.'" class="btn btn-default link-btn disabled disable-before-load goback-'.$btn_name.'"><span class="glyphicon glyphicon-circle-arrow-left"></span> Go Back</a>';
  echo '</div>';
}

/* format fields ------------------------------------------------------------*/
function dates($field, $options = array(), $section = ""){
  echo '<div class="form-group">';
    echo '<label for="'.format_field($field).'" class="col-sm-2 control-label">'.$field.'</label>';
    foreach($options as $key => $key_value){
      echo '<div class="col-sm-3">';
        echo '<div class="input-group">';
          echo '<input type="text" class="datepicker form-control '.format_field($key).'" name="'.format_field($key).'" id="'.$section.'_'.format_field($key).'" placeholder="'.format_placeholder($key).'" value="'.format_placeholder($key_value).'" />';
          echo '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
        echo '</div>';
        echo '<span class="text-danger"></span>';
      echo '</div>';
    }
  echo '</div>';
}

function datesJobTemplate($field, $options, $section){
	//echo '<label for="'.format_field($field).'" class="col-sm-2 control-label">'.$field.'</label>';
	foreach($options as $key => $key_value){
		echo '<div class="col-sm-3">';
		echo '<div class="input-group">';
		echo '<input type="text" class="datepicker form-control '.format_field($key).'" name="'.format_field($key).'" id="'.$section.'_'.format_field($key).'" placeholder="'.format_placeholder($key).'" value="'.format_placeholder($key_value).'" />';
		echo '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
		echo '</div>';
		echo '</div>';
	}
}


function text($field, $placeholder, $value, $validation){
  echo '<div class="form-group">';
    if(is_array($field)){
      $count = 0;
      foreach($field as $key => $key_value){
        $count++;
        if($count == 1){
          echo '<label for="'.$key.'" class="col-sm-2 control-label">'.$key.'</label>';
        }
        foreach($key_value as $key_val => $val){
          echo '<div class="col-sm-3">';
          if($count == 1){
            $placeholder = str_replace('Fuel surcharge percentage', '%', $key_val);
            echo '<div class="input-group">';
              echo '<input type="text" class="form-control" id="'.format_field($key_val).'" name="'.format_field($key_val).'" placeholder="'.format_placeholder($placeholder).'" value="'.$val.'"  '.$validation.' />';
              echo '<span class="input-group-addon">%</span>';
            echo '</div>';
          } elseif($count == 2) {
            echo '<div class="input-group">';
            echo '<span class="input-group-addon"><i class="fa fa-gbp"></i></span><input type="text" class="form-control" id="'.format_field($key_val).'" name="'.format_field($key_val).'" placeholder="'.format_placeholder($key_val).'" value="'.$val.'" '.$validation.'/>';
            echo '</div>';
          }
          echo '<span class="text-danger"></span>';
          echo '</div>';
        }
      }
    } else {
      echo '<label for="'.format_field($field).'" class="col-sm-2 control-label">'.$field.'</label>';
      echo '<div class="col-sm-2">';
      echo '<input type="text" class="form-control" id="'.format_field($field).'" name="'.format_field($field).'" placeholder="'.format_placeholder($placeholder).'" value="'.$value.'" '.$validation.' />';
      echo '</div>';
    }
  echo '</div>';
}

function text_with_currency($field, $placeholder, $value, $currency,$currAditionalClass=''){
	echo '<div class="form-group">';
	if(is_array($field)){
		$count = 0;
		foreach($field as $key => $key_value){
			$count++;
			if($count == 1){
				echo '<label for="'.$key.'" class="col-sm-2 control-label">'.$key.'</label>';
			}
			foreach($key_value as $key_val => $val){
				echo '<div class="col-sm-3">';
				if($count == 1){
					$placeholder = str_replace('Fuel surcharge percentage', '%', $key_val);
					echo '<div class="input-group">';
					echo '<input type="text" class="form-control" id="'.format_field($key_val).'" name="'.format_field($key_val).'" placeholder="'.format_placeholder($placeholder).'" value="'.$val.'" />';
					echo '<span class="input-group-addon">%</span>';
					echo '</div>';
				} elseif($count == 2) {
					echo '<div class="input-group">';
					echo '<span class="input-group-addon">';
					show_currency($currency, $currAditionalClass);
					echo '</span><input type="text" maxlength="13" class="form-control" id="'.format_field($key_val).'" name="'.format_field($key_val).'" placeholder="'.format_placeholder($key_val).'" value="'.$val.'" />';
					echo '</div>';
				}
				echo '</div>';
			}
		}
	} 
	echo '</div>';
}

/**
 * for job template function
 * @param unknown_type $field
 * @param unknown_type $placeholder
 * @param unknown_type $value
 * @param unknown_type $currency
 * @param unknown_type $currAditionalClass
 */
function text_with_currency_jobtemplate($field, $placeholder, $value, $currency,$currAditionalClass=''){
	echo '<div class="form-group">';
	if(is_array($field)){
		$count = 0;
		foreach($field as $key => $key_value){
			$count++;
			if($count == 1){
				echo '<label for="'.$key.'" class="col-sm-2 control-label">'.$key.'</label>';
			}
			foreach($key_value as $key_val => $val){
				echo '<div class="col-sm-3">';
				if($count == 1){
					$placeholder = str_replace('Fuel surcharge percentage', '%', $key_val);
					echo '<div class="input-group">';
					echo '<input type="text" 
								class="form-control"
								maxlength="6" 
								onkeypress="return NumberValues(this,event);"
								id="'.format_field($key_val).'" 
								name="'.format_field($key_val).'" 
								placeholder="'.format_placeholder($placeholder).'" 
								value="'.$val.'" />';
					echo '<span class="input-group-addon">%</span>';
					echo '</div>';
				} elseif($count == 2) {
					echo '<div class="input-group">';
					echo '<span class="input-group-addon">';
					show_currency($currency, $currAditionalClass);
					echo '</span><input type="text" maxlength="13" 
						              	onkeypress="return NumberValues(this,event);"
									    onchange="return decimalNumberJobtemplate(this);" 
										class="form-control" 
										id="'.format_field($key_val).'" 
										name="'.format_field($key_val).'" 
										placeholder="'.format_placeholder('Surcharge Amount').'" 
										value="'.$val.'" />';
					echo '</div>';
				}
				echo '</div>';
			}
		}
	}
	echo '</div>';
}



function textarea($field, $placeholder, $value, $readonly){
  echo '<div class="form-group">';
    echo '<label for="'.format_field($field).'" class="col-sm-2 control-label">'.$field.'</label>';
    echo '<div class="col-sm-8">';
      echo '<textarea class="form-control" id="'.format_field($field).'" name="'.format_field($field).'" placeholder="'.format_placeholder($placeholder).'" '.$readonly.'>'.$value.'</textarea>';
    echo '</div>';
  echo '</div>';
}

function cust_lable_textarea($label, $field, $placeholder, $value, $readonly){
	echo '<div class="form-group">';
	echo '<label for="'.format_field($field).'" class="col-sm-2 control-label">'.$label.'</label>';
	echo '<div class="col-sm-8">';
	echo '<textarea class="form-control" id="'.format_field($field).'" name="'.format_field($field).'" placeholder="'.format_placeholder($placeholder).'" '.$readonly.'>'.$value.'</textarea>';
	echo '</div>';
	echo '</div>';
}

/**
 * DM-Mar-2017
 * for job template default text
 * @param unknown_type $label
 * @param unknown_type $field
 * @param unknown_type $placeholder
 * @param unknown_type $value
 * @param unknown_type $readonly
 */
function cust_lable_textarea_job_template($label, $field, $placeholder, $value, $readonly){
	echo '<div class="form-group">';
	echo '<label for="'.format_field($field).'" class="col-sm-2 control-label">'.$label.'</label>';
	echo '<div class="col-sm-10">';
	echo '<textarea rows="5" cols="100" class="form-control" id="'.format_field($field).'" name="'.format_field($field).'" placeholder="'.format_placeholder($placeholder).'" '.$readonly.'>'.$value.'</textarea>';
	echo '</div>';
	echo '</div>';
}

function cost_text($field, $placeholder, $value, $readonly) {
  echo '<div class="form-group">';
    echo '<label for="'.format_field($field).'" class="col-sm-2 control-label">'.$field.'</label>';
    echo '<div class="col-sm-2">';
      echo '<div class="input-group">';
        echo '<span class="input-group-addon"><i class="fa fa-gbp currency-fa"></i></span><input type="text" class="form-control" id="'.format_field($field).'" name="'.format_field($field).'" placeholder="0" value="'.$value.'" '.$readonly.' />';
      echo '</div>';
    echo '</div>';
  echo '</div>';
}

function cost_text_with_currency($field, $currency, $placeholder, $value, $readonly) {
	echo '<div class="form-group">';
	echo '<label for="'.format_field($field).'" class="col-sm-2 control-label">'.$field.'</label>';
	echo '<div class="col-sm-3">';
	echo '<div class="input-group">';
	if(has_symbol($currency)) {
		echo '<span class="input-group-addon"><i class="fa fa-'.$currency.' currency-fa"></i></span><input type="text" class="form-control" id="'.format_field($field).'" name="'.format_field($field).'" placeholder="0" value="'.$value.'" '.$readonly.' />';
	} else {
		echo '<span class="input-group-addon"><i class="fa currency-fa">'.strtoupper($currency).'</i></span><input type="text" class="form-control" id="'.format_field($field).'" name="'.format_field($field).'" placeholder="0" value="'.$value.'" '.$readonly.' />';
	}
	echo '</div>';
	echo '</div>';
	echo '</div>';
}

function has_symbol($currency) {
	$currency_having_symbols = explode("_", BTL_CURRENCY_WITH_SYMBOL);
	
	return in_array(strtoupper($currency),$currency_having_symbols);
}

function show_currency($currency, $addtional_class="") {
	if(has_symbol($currency)){
		echo '<i class="fa fa-' . strtolower($currency) . ' ' .$addtional_class. '"></i>';
	} else {
		echo '<i class="fa ' . $addtional_class . '">'.strtoupper($currency) .'</i>';
	}
}

function show_currency_html($currency, $addtional_class="") {
	$result = "";
	if(has_symbol($currency)){
		$result = '<i class="fa fa-' . strtolower($currency) . ' ' .$addtional_class. '"></i>';
	} else {
		$result = '<i class="fa ' . $addtional_class . '">'.strtoupper($currency) .'</i>';
	}
	return $result;
}

/* format table form --------------------------------------------------------*/
function new_record($type, $field, $options, $value){
  if($type == "select"){
    echo '<div>';
    if(is_array($options)){
      echo '<select id="new_'.format_field($field).'" name="new_'.format_field($field).'[]" class="form-control">';
      foreach($options as $key => $key_value){
        echo '<option value="'.$key.'">'.$key_value.'</option>';
      }
      echo '</select>';
    }
    echo '</div>';
  }

  if($type == "cost"){
    echo '<div class="input-group">';
      echo '<span class="input-group-addon"><i class="fa fa-gbp"></i></span><input type="number" class="form-control" min="0" step="0.01" max="2500" id="new_'.format_field($field).'" name="new_'.format_field($field).'[]" placeholder="0" value="'.$value.'" />';
    echo '</div>';
  }

  if($type == "text"){
    echo '<input type="text" class="form-control" id="new_'.format_field($field).'" name="new_'.format_field($field).'[]" placeholder="" value="'.$value.'" />';
  }

  if($type == "textarea"){
    echo '<textarea class="input-lg" id="new_'.format_field($field).'" name="new_'.format_field($field).'[]">'.$value.'</textarea>';
  }
}

/* inline editing -----------------------------------------------------------*/
function edit_record($type, $field, $options, $value){
  if($type == "select"){
    echo '<div class="'.$type.'">';

      echo '<div class="current_value">';
        echo '<p data-type="'.$type.'" data-name="'.format_field($field).'"><span class="value">'.$value.'</span> <span class="glyphicon glyphicon-pencil"></span></p>';
      echo '</div>';

      if(is_array($options)){
        echo '<select id="'.format_field($field).'" name="'.format_field($field).'[]" class="form-control new_record">';
        foreach($options as $key => $key_value){
          $selected = '';
          if($key == $value){
            $selected = 'selected="selected"';
          }
          echo '<option value="'.$key.'"'.$selected.'>'.$key_value.'</option>';
        }
        echo '</select>';
      }
    echo '</div>';
  }

  if($type == "cost"){
    echo '<div class="input-group">';
      echo '<p class="edit" data-type="'.$type.'" data-name="'.format_field($field).'" data-value="'.$value.'"><i class="fa gbp"></i> <span class="value">'.$value.'</span> <span class="glyphicon glyphicon-pencil"></span></p>';
      echo '<input type="hidden" name="'.format_field($field).'[]" value="'.$value.'" />';
    echo '</div>';
  }

  if($type == "text" || $type == "textarea"){
    echo '<p class="edit" data-type="'.$type.'" data-name="'.format_field($field).'" data-value="'.$value.'">';
    if($type == 'cost'){
      echo '<i class="fa gbp"></i> ';
    }
    echo '<span class="value">'.$value.'</span> <span class="glyphicon glyphicon-pencil"></span></p>';
    echo '<input type="hidden" name="'.format_field($field).'[]" value="'.$value.'" />';
  }
}

/* format results -----------------------------------------------------------*/
function get_results($array){
  $keys = array_keys($array);
  $count = count(array_shift(array_values($array)));
  $counter = 1;

  for ($i = 0; $i < $count; $i++) {
    $result = array();
    echo $counter++.'. ';
    foreach ($keys as $key) {
      $result[$key] = $array[$key][$i];
    }

    foreach($result as $row){
      echo $row.' ';
    }
    echo '<br />';
  }
}

/* alert messages -----------------------------------------------------------*/
function error_msg() {
  echo '<div class="alert alert-danger alert-dismissable">';
    echo '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
    echo '<strong>Uh oh!</strong> Please make sure you have entered all of the required information below.';
  echo '</div>';
}

function success_msg() {
  echo '<div class="alert alert-success alert-dismissable">';
    echo '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
    echo '<strong>Success!</strong> The following has been successfully saved.';
  echo '</div>';
}


// urlGen ----------------------------------------------------------------------
function urlGen($params) {
  $urlData = parse_url($_SERVER['REQUEST_URI']);
  parse_str($urlData['query'], $query);
  $query = array_merge($query, $params);
  return $urlData['path'].'?'.http_build_query($query);
}

/* pagination ----------------------------------------------------------------*/
function pagination_transportmode($data, $show=false) {
    $first_page = 1;
    $last_page = $data['total_pages'];
    $current_page = $data['page'];
    $next_page = $data['next_page'];
    $prev_page = $data['prev_page'];
    $total_pages = $data['total_pages'];
    $min = $data['min'];
    $max = $data['max'];
    $total = $data['total'];
    $limit = $data['limit'];
    
    if($total_pages > 1) :
    ?>
  <div class="custom-pagination">
    <a href="javascript:void(0)" data-val="<?php echo $first_page; ?>" class="first enabled" title="First">
      <span class="glyphicon glyphicon-step-backward"></span>
    </a>
    <a href="javascript:void(0)" data-val="<?php echo $prev_page; ?>" class="prev enabled" title="Previous">
      <span class="glyphicon glyphicon-backward"></span>
    </a>
    <div class="pagedisplay">
      Records <?php echo $min; ?> to <?php echo $max; ?> (Total <?php echo $total; ?> Results) - Page <?php echo $current_page; ?> of <?php echo $total_pages; ?>
    </div>
    <a href="javascript:void(0)" data-val="<?php echo $next_page; ?>" class="next enabled" title="Next">
      <span class="glyphicon glyphicon-forward"></span>
    </a>
    <a href="javascript:void(0)" data-val="<?php echo $last_page; ?>" class="last enabled" title="Last">
      <span class="glyphicon glyphicon-step-forward"></span>
    </a>
    <?php if($show == false) : ?>
    <select class="pagesize">
      <option value="25"> per page</option>
    </select>
    <?php else : ?>
    <select class="custom-page-pagesize" data-totalrecords="<?php echo $total; ?>">
      <option value="10" <?php echo ($limit == 10) ? 'selected' : ''; ?> > 10 </option>
      <option value="25" <?php echo ($limit == 25) ? 'selected' : ''; ?> > 25 </option>
      <option value="50" <?php echo ($limit == 50) ? 'selected' : ''; ?> > 50 </option>
      <option value="100" <?php echo ($limit == 100) ? 'selected' : ''; ?> > 100 </option>
      <option value="250" <?php echo ($limit == 250) ? 'selected' : ''; ?> > 250 </option>
    </select>
    <?php endif; ?>
  </div>
<?php endif;
}

/* pagination ----------------------------------------------------------------*/
function pagination($data, $show=false) {
  $first_page = urlGen(array('page' => 1));
  $last_page = urlGen(array('page' => $data['total_pages']));
  $current_page = $data['page'];
  $next_page = urlGen(array('page' => $data['next_page']));
  $prev_page = urlGen(array('page' => $data['prev_page']));
  $total_pages = $data['total_pages'];
  $min = $data['min'];
  $max = $data['max'];
  $total = $data['total'];
  $limit = $data['limit'];
?>
  <div class="custom-pagination">
    <a href="<?php echo $first_page; ?>" class="first enabled" title="First">
      <span class="glyphicon glyphicon-step-backward"></span>
    </a>
    <a href="<?php echo $prev_page; ?>" class="prev enabled" title="Previous">
      <span class="glyphicon glyphicon-backward"></span>
    </a>
    <div class="pagedisplay">
      Records <?php echo $min; ?> to <?php echo $max; ?> (Total <?php echo $total; ?> Results) - Page <?php echo $current_page; ?> of <?php echo $total_pages; ?>
    </div>
    <a href="<?php echo $next_page; ?>" class="next enabled" title="Next">
      <span class="glyphicon glyphicon-forward"></span>
    </a>
    <a href="<?php echo $last_page; ?>" class="last enabled" title="Last">
      <span class="glyphicon glyphicon-step-forward"></span>
    </a>
    <?php if($show == false) : ?>
    <select class="pagesize">
      <option value="25"> per page</option>
    </select>
    <?php else : ?>
    <select class="custom-page-pagesize">
      <option value="10" <?php echo ($limit == 10) ? 'selected' : ''; ?> > 10 </option>
      <option value="25" <?php echo ($limit == 25) ? 'selected' : ''; ?> > 25 </option>
      <option value="50" <?php echo ($limit == 50) ? 'selected' : ''; ?> > 50 </option>
      <option value="100" <?php echo ($limit == 100) ? 'selected' : ''; ?> > 100 </option>
      <option value="250" <?php echo ($limit == 250) ? 'selected' : ''; ?> > 250 </option>
    </select>
    <?php endif; ?>
  </div>
<?php }


/* filters -------------------------------------------------------------------*/
function filter_reset(){
  echo '<div class="reset btn btn-primary"><span class="glyphicon glyphicon-refresh"></span> Reset Search Filters</div>';
}

function show_filters(){
  echo '<div class="show-filters btn btn-info"><span class="glyphicon glyphicon-sort"></span> View Search Filters</div>';
}

function sort_filter($name, $column, $array){
  echo '<div class="form-group">';
    echo '<label class="col-sm-2 control-label" for="'.$name.'">'.$name.'</label>';
    echo '<div class="col-sm-3">';
      echo '<select class="chosen form-control filter">';
        echo '<option data-filter-column="1" data-filter-text="">All</option>';
        foreach($array as $item){
          echo '<option data-filter-column="'.$column.'" data-filter-text="'.$item.'">'.$item.'</option>';
        }
      echo '</select>';
    echo '</div>';
  echo '</div>';
}

function sort_filter_serverside($label, $name, $array, $current=false){
  echo '<div class="form-group">';
    echo '<label class="col-sm-2 control-label" for="'.$name.'">'.$label.'</label>';
    echo '<div class="col-sm-3">';
      echo '<select name="'.$name.'" id="'.$name.'" class="chosen form-control filter">';
        echo '<option value="">All</option>';
        foreach($array as $item){
					$selected = $item->val == $current ? ' selected="selected"' : '';
          echo '<option value="'.$item->val.'"'.$selected.'>'.$item->txt.'</option>';
        }
      echo '</select>';
    echo '</div>';
  echo '</div>';
}

function sort_filter_serverside_cust($label, $name, $array, $current=false, $labelClass='col-sm-2', $ctrlClass='col-sm-3',$all_opt=true){
	echo '<div class="form-group">';
		echo '<label class="'.$labelClass.' control-label" for="'.$name.'">'.$label.'</label>';
			echo '<div class="'.$ctrlClass.'">';
			echo '<select name="'.$name.'" id="'.$name.'" class="chosen form-control filter">';
			if ($all_opt){
				echo '<option value="">All</option>';
			}
				foreach($array as $item){
					$selected = $item->val == $current ? ' selected="selected"' : '';
					echo '<option value="'.$item->val.'"'.$selected.'>'.$item->txt.'</option>';
				}
			echo '</select>';
		echo '</div>';
	echo '</div>';
}

function multicolum_filter_serverside($label, $name, $array, $current=array()){
	echo '<div class="form-group">';
	echo '<label class="col-sm-4 control-label" for="'.$name.'">'.$label.'</label>';
	echo '<div class="col-sm-8">';
	echo '<select style="display:none;" name="'.$name.'[]" id="'.$name.'" class="multi-sel-ctrl form-control filter reset-filter" multiple size="1">';
	if((count($current) > 0 && $current[0] == "") || count($current) == 0) {
		echo '<option value="" selected="selected">All</option>';
	} else {
		echo '<option value="" >All</option>';
	}
	foreach($array as $item){
		$selected = "";
		if(is_array($current)){
			foreach($current as $cur_item){
				if($item->val == $cur_item){
					$selected = ' selected="selected"';
				}
			}
		}
		echo '<option value="'.$item->val.'"'.$selected.'>'.$item->txt.'</option>';
	}
	echo '</select>';
	echo '<input type="text" class="tmp-input-ctrl form-control" value="" disabled /></div>';
	echo '</div>';
}

/**
 * function for create multi select box
 * @param unknown_type $label
 * @param unknown_type $name
 * @param unknown_type $array
 * @param unknown_type $current
 */
function multicolum_filter_selectbox($name, $array, $current=array()){

	echo '<select style="display:none" name="'.$name.'[]" id="'.$name.'" class="multi-sel-ctrl form-control filter" multiple size="1">';
	if((count($current) > 0 && $current[0] == "") || count($current) == 0) {
		echo '<option value="" selected="selected">All</option>';
	} else {
		echo '<option value="" >All</option>';
	}
	foreach($array as $item){
		$selected = "";
		if(is_array($current)){
			foreach($current as $cur_item){
				if($item->val == $cur_item){
					$selected = ' selected="selected"';
				}
			}
		}
		echo '<option value="'.$item->val.'"'.$selected.'>'.$item->txt.'</option>';
	}
	echo '</select>';
	echo '<input type="text" class="tmp-input-ctrl form-control" value="" disabled />';

}


/**
 * disable particular item
 * created by Nov-10-2016 DM
 * @param unknown_type $label
 * @param unknown_type $name
 * @param unknown_type $array
 * @param unknown_type $current
 */
function multicolum_filter_serverside_disable_selected($label, $name, $array, $current=array()){
	echo '<div class="form-group">';
	echo '<label class="col-sm-4 control-label" for="'.$name.'">'.$label.'</label>';
	echo '<div class="col-sm-8">';
	echo '<select style="display:none;" name="'.$name.'[]" id="'.$name.'" class="multi-sel-ctrl form-control filter" multiple size="1">';
	/* if((count($current) > 0 && $current[0] == "") || count($current) == 0) {
		echo '<option value="" selected="selected">All</option>';
	} else {
	echo '<option value="" >All</option>';
	} */
	foreach($array as $item){
		$selected = "";
		if(is_array($current)){
			foreach($current as $cur_item){
				if($item->val == $cur_item){
					$selected = ' selected="selected" disabled';
				}
			}
		}
		echo '<option value="'.$item->val.'"'.$selected.' >'.$item->txt.'</option>';
	}
	echo '</select>';
	echo '<input type="text" class="tmp-input-ctrl form-control" value="" disabled /></div>';
	echo '</div>';
}

function validate_date($valid_from, $valid_to, $today, $is_title=false){
  if($is_title){
    $title = ' title=" Rate valid upto '.date(BTL_DEF_VIEW_DATE, strtotime($valid_to)).'" style="cursor: pointer;"';
  }
  else{
    $title = '';
  }
  if(($today >= $valid_from) && ($today <= $valid_to)){
    return '<span class="glyphicon glyphicon-ok-circle glyphicon-modal"><span class="hide">0</span></span>';
  } else {
    return '<span class="glyphicon glyphicon-warning-sign glyphicon-modal"'.$title.'><span class="hide">1</span></span>';
  }
}

function getRateExtendIcon($title = ' title="Extended Rate" '){
  return '<i '.$title.' class="fa fa-exclamation-triangle" style="cursor: pointer;color: #ed9632;font-size: 16px;"><span class="hide">1</span></i>';
}

function iconDesignforExtendJT($tname){
    if( in_array($tname, array('Haulage', 'Shunt', 'Cleaning')) ){
      $cname = '#ed9632';  $vtitle = 'Validity extended';
    }else{
      $cname = 'red'; $vtitle = 'Validity Expired';
    }
    return $cname.'|'.$vtitle;
}

/* Haulage-Cleaning-Shunt */
function extendsupportmode($id){
  return ( in_array($id, array(1,5,6)) ) ? true : false;
}

function validate_date_with_surcharge_dt($cost, $today, $is_title=false, $transport_mode_id=""){
  $valid_dt = true;
  $title = '';
  // if($is_title){
  //   $title = ' title="'.date(BTL_DEF_VIEW_DATE, strtotime($cost->valid_from)).' - '.date(BTL_DEF_VIEW_DATE, strtotime($cost->valid_to)).'" style="cursor: pointer;"';
  // }
  // else{
  //   $title = '';
  // }
  $eIcon = "";
  if($transport_mode_id != "" && extendsupportmode($transport_mode_id)){ 
      $eIcon  = ' (Extended)';
  }

  if(!empty($cost)){
	  if(!(($today >= $cost->valid_from) && ($today <= $cost->valid_to))){
	  	$valid_dt = false;
      if($is_title){
        $title = ' title="Rate valid upto '.date(BTL_DEF_VIEW_DATE, strtotime($cost->valid_to)).$eIcon.'" ';
      }
	  } 
	  else if(!empty($cost->fuel_surcharge_date) && $today > $cost->fuel_surcharge_date){
	  	$valid_dt = false;
      if($is_title){
        $title = ' title="BAF Rate valid upto '.date(BTL_DEF_VIEW_DATE, strtotime($cost->fuel_surcharge_date)).$eIcon.'" ';
      }
	  }
	  else if(!empty($cost->caf_surcharge_date) && $today > $cost->caf_surcharge_date){
	  	$valid_dt = false;
      if($is_title){
        $title = ' title="CAF Rate valid upto '.date(BTL_DEF_VIEW_DATE, strtotime($cost->caf_surcharge_date)).$eIcon.'" ';
      }
	  }
  } else {
  	$valid_dt = false;
  }
  
  if($valid_dt){
    return '<span class="glyphicon glyphicon-ok-circle glyphicon-modal"><span class="hide">0</span></span>';
  } else {

    if($eIcon != ""){ //Haulage-Cleaning-Shunt
      return getRateExtendIcon($title);
    }else{ 
      return '<span class="glyphicon glyphicon-warning-sign glyphicon-modal"'.$title.' style="cursor: pointer;"><span class="hide">1</span></span>';
    }

  }
}

function valid_date_check($valid_from, $valid_to, $today){
	if(($today >= $valid_from) && ($today <= $valid_to)){
		return true;
	} else {
		return false;
	}
}

function form_status($form, $status, $approved,$pageType = ''){
  echo '<div class="panel panel-default">';
    echo '<div class="panel-body">';
      echo '<fieldset>';
        echo '<legend>Status</legend>';
        echo '<div class="radio">';
          echo '<label>';
            if($form == 'duplicating') {
              echo '<input type="radio" name="status" value="approved" class="approved-status" style="margin-top: 2px;" />';
            } else {
              if($status !== "draft" && $status != ''){
                echo '<input type="radio" name="status" value="approved" class="approved-status" style="margin-top: 2px;" checked />';
              } else {
                echo '<input type="radio" name="status" value="approved" class="approved-status" style="margin-top: 2px;" />';
              }
            }
            echo 'This cost is approved';
          echo '</label>';
        echo '</div> <!-- radio -->';
        echo '<div class="radio">';
          echo '<label>';
            if($form == 'duplicating'){
              echo '<input type="radio" name="status" value="draft" class="draft-status" style="margin-top: 2px;" checked />';
            } else {
              if($status == "draft"){
                echo '<input type="radio" name="status" value="draft" class="draft-status" style="margin-top: 2px;" checked />';
              } else {
                echo '<input type="radio" name="status" value="draft" class="draft-status" style="margin-top: 2px;" />';
              }

              if($status == ''){
                echo '<input type="radio" name="status" value="draft" class="draft-status" style="margin-top: 2px;" checked />';
              }
            }
            echo 'This cost is a draft';
          echo '</label>';
        echo '</div> <!-- radio -->';
 
        if($form != 'duplicating'){
          $state = 'show';
        } else {
          $state = 'hide';
        }
		if($pageType != 'supp-rate-page'){
        echo '<div class="checkbox-approved" data-value="'.$approved.'" data-state="'.$state.'">';
          echo '<hr />';
          echo '<label>';
            if($approved == '1') { 
              $checked = 'checked';
            }
            echo '<input type="checkbox" name="approved" value="1" style="margin-top: 2px;" class="approved" '.$checked.' />';
            echo '&nbsp;&nbsp;This customer quote is approved';
          echo '</label>';
        echo '</div> <!-- radio -->';
		}
      echo '</fieldset>';
    echo '</div> <!-- panel-body -->';
  echo '</div> <!-- panel -->';
}


function supplier_user_logs($user_logs){

	if(isset($user_logs) && count($user_logs) > 0) { 
	?>
	<div class="panel panel-default">
		<div class="panel-body">
			<fieldset>
				<legend>User Logs</legend>
				<div style="max-height: 300px;overflow: hidden;overflow-y: auto;">
				    <table class="table table-striped table-bordered">
				        <thead>
				            <tr>
				                <th width="10%"> Revision</th>
				                <th width="50%"> Name</th>
				                <th width="40%"> Date</th>
				            </tr>
				        </thead>
				        <tbody>
					        <?php 
						        $rev_count = count($user_logs);
						        foreach($user_logs as $user_log) {
							        echo '<tr>';
							        echo '<td>' . $rev_count . '</td>';
							        echo '<td>' . $user_log->full_name . '</td>';
							        echo '<td>' . date('jS F Y, g:i a',strtotime($user_log->date_modified)) . '</td>';
							        echo '</tr>';
							        $rev_count -= 1;
						        }
						     ?>
				        </tbody>
				    </table>			
				</div>	
			</fieldset>
		</div>
		<!-- panel-body -->
	</div>
	<?php } 	
}


/* calculate minute difference if time range-----------------------------------------*/
function get_range_in_minutes($load_n_del_times){
	
	$time1=0;
	$time2=0;
	
	$timerange = explode('-', $load_n_del_times);
	if(count($timerange) == 2){
		$time1 = calc_minute($timerange[0]);
		$time2 = calc_minute($timerange[1]);
	}elseif(count($timerange) == 1){
		$time1 = calc_minute($timerange[0]);
	}
		
	$result = abs(floor($time1 - $time2));
	
	return $result;
}

/* calculate minute from HHMM formated value ----------------------- */
function calc_minute($load_n_del_time){
	$hour1 = substr($load_n_del_time,0,2);
	$min1  = substr($load_n_del_time,2,4);
	$result = $hour1 * 60 + $min1;
	return $result;
}
/**
 * DM-3-Feb-2016
 * repalce " to '
 * @param string $str
 */
if(!function_exists('replacedoubletosingle')){
	function replacedoubletosingle($str){
		return preg_replace('~/{10,}~','/',str_replace(array('"','\\'),array("'",'/'), ($str))); // Modify DM-19-Jul-2017
	}
}

/**
 * DM-25-Apr-2017
 * function for create multi select box
 * @param unknown_type $label
 * @param unknown_type $name
 * @param unknown_type $array
 * @param unknown_type $current
 */
function multicolum_filter_selectbox_without_all($name, $array, $current=array()){

	echo '<select style="display:none" name="'.$name.'[]" id="'.$name.'" class="multi-sel-ctrl form-control filter modal-controls" multiple size="1">';
	/* if((count($current) > 0 && $current[0] == "") || count($current) == 0) {
		echo '<option value="" selected="selected">All</option>';
	} else {
		echo '<option value="" >All</option>';
	} */
	foreach($array as $item){
		$selected = "";
		if(is_array($current)){
			foreach($current as $cur_item){
				if($item->val == $cur_item){
					$selected = ' selected="selected"';
				}
			}
		}
		echo '<option value="'.$item->val.'"'.$selected.'>'.$item->txt.'</option>';
	}
	echo '</select>';
	echo '<input type="text" class="tmp-input-ctrl form-control" value="" disabled />';

}

function sort_filter_serverside_cust_group($label, $name, $current, $labelClass='col-sm-2', $ctrlClass='col-sm-3',$option_type){
	
	$coreGroup = Btl\Helpers\getGroupNames();
	echo '<div class="form-group">';
	echo '<label class="'.$labelClass.' control-label" for="'.$name.'">'.$label.'</label>';
	echo '<div class="'.$ctrlClass.'">';
	echo '<select name="'.$name.'" id="'.$name.'" class="chosen form-control filter" data-custType="'.$option_type.'">';
		$option = '<option value="" ></option>';
		
		foreach($coreGroup AS $valuesCore){
			$option .= '<option value="'.$valuesCore->group_id.'"';
			$option .= ($current == $valuesCore->group_id) ? "selected" : '';
			$option .= ">$valuesCore->group_name</option>";
		}
		echo $option;
	echo '</select>';
	echo '</div>';
	echo '</div>';
}
/**
 * DM-17-Jan-2018
 * repalce " to '
 * @param string $str
 */
if(!function_exists('replaceHtmlCustome')){
	function replaceHtmlCustome($str){
		return 
		preg_replace('/\s*([>])\s*/', ' > ',
			preg_replace('/\s*([<])\s*/', ' < ', 
				str_replace(array('<','>','"'),array(" < "," > ","'"),($str))
			)
		); // Modify DM-17-Jan-2018
	}
}
/**
 * Function for creating multi coulmn
 * @param unknown_type $label
 * @param unknown_type $name
 * @param unknown_type $array
 * @param unknown_type $current
 */
function multicolum_filter_serverside_option_group($label, $name, $array, $current=array(), $firstLabel="col-sm-4", $secondLabel="col-sm-8"){
	echo '<div class="form-group">';
	echo '<label class="'.$firstLabel.' control-label" for="'.$name.'">'.$label.'</label>';
	echo '<div class="'.$secondLabel.'">';
	echo '<select name="'.$name.'[]" id="'.$name.'" class="multi-sel-ctrl form-control filter reset-filter hidden" multiple size="1">';
	if((count($current) > 0 && $current[0] == "") || count($current) == 0) {
		echo '<option value="" selected="selected">All</option>';
	} else {
		echo '<option value="" >All</option>';
	}
	foreach($array as $itemKey => $item){
		$selected = "";
		if(!is_array($item)){
			if(is_array($current)){
				foreach($current as $cur_item){
					if($itemKey == $cur_item){
						$selected = ' selected="selected"';
					}
				}
			}
			echo '<option value="'.$itemKey.'"'.$selected.'>'.$item.'</option>';
		}else{
			if(!empty($item)){
				echo '<optgroup label="'.$itemKey.'">';
				foreach($item as $option_grp_key => $option_grp_val){
					$selected1 = '';
					$combinedKey = strtolower($itemKey).'_'.$option_grp_key;
					if(is_array($current)){
						foreach($current as $cur_item1){
							if($combinedKey == $cur_item1){
								$selected1 = ' selected="selected"';
							}
						}
					}
					echo '<option value="'.$combinedKey.'"'.$selected1.'>'.$option_grp_val.'</option>';
				}
				echo '</optgroup>';
			}
		}

	}
	echo '</select>';
	echo '<input type="text" class="tmp-input-ctrl form-control" value="" disabled /></div>';
	echo '</div>';
}

/**
 * function for full loader
 */
function fullLoader($displayType = false){
	$style = '';
	if($displayType) { $style = "style=display:none"; }
	
	$loader = '  <div class="full_loader " '.$style.'>
						<div class="full_loaderfix">
						  <div class="full_loadrow"><img src="'.HOME.'images/ajax-loader.gif"/></div>
						</div>
						<div class="full_overlay"></div>
				  </div>';
	echo $loader;
}
/**
 * DM Dec 16 Used in tank-core data
 * @param unknown_type $label
 * @param unknown_type $name
 * @param unknown_type $array
 * @param unknown_type $current
 */
function multicolum_filter_serverside_tank_customers($label, $name, $array, $current=array(),$selectAll = true){
    echo '<div class="form-group">';
    echo '<label class="col-sm-4 control-label" for="'.$name.'">'.$label.'</label>';
    echo '<div class="col-sm-8">';
    echo '<select style="display:none" name="'.$name.'[]" id="'.$name.'" class="multi-sel-ctrl form-control filter" multiple size="1">';
    if($selectAll){
        if((count($current) > 0 && $current[0] == "") || count($current) == 0) {
            echo '<option value="" selected="selected">All</option>';
        } else {
            echo '<option value="" >All</option>';
        }
    }
    
    foreach($array as $item){
        $selected = "";
        if(is_array($current)){
	        foreach($current as $cur_item){
	            if($item->val == $cur_item){
	                $selected = ' selected="selected"';
	            }
	        }
        }
        echo '<option value="'.$item->val.'"'.$selected.'>'.$item->txt.'</option>';
    }
    echo '</select>';
    echo '<input type="text" class="tmp-input-ctrl form-control" value="" disabled /></div>';
    echo '</div>';
}
//find exchange rate
function getExchangeRate($base_curr_id, $nonbase_curr_id, $date)
{
  $sql = "SELECT
        e.exch_rate,
        c.cur_html
      FROM
        exchange_rates AS e
      INNER JOIN
        currency AS c
        ON c.cur_id = $nonbase_curr_id
      WHERE
        e.curr_id_base = $base_curr_id
        AND e.curr_id_nonbase = $nonbase_curr_id
        AND e.exch_date = (
          SELECT MAX(exch_date)
          FROM exchange_rates
          WHERE exch_date <= '$date'
        )";  
  $res = Currency::find_by_sql($sql);  
  $row = $res; 
  return $row;    
}

function getJobsEstCost($j_number, $cur_id, $date,$currencyKeys = array(),$addManuallyCheckbox = null)
{
  $sql = "SELECT
        jc.jc_est_amount,
        c.cur_id,
        jc.jc_act_amount,
        ac.cur_id AS actual_currency_id,
        jc.jc_is_change_supplier
      FROM
        job_costs AS jc
      LEFT JOIN
        currency AS c
        ON c.cur_name = jc.jc_curr
      LEFT JOIN 
        currency AS ac
        ON ac.cur_name = jc.jc_act_curr
      WHERE
        jc.j_number = $j_number
        AND jc.jc_is_change_supplier <> 2
        AND jc.jc_activity <> 'DEMTK'"; //added 24-Oct-2017
          
  $res = Job::find_by_sql($sql);
  $total = 0;
  $overAmountTotal = 0; // old supplier amount after change supplier
 foreach ($res as $key => $row)  { 

   $est = $row->jc_est_amount;
   $est_cur_id = $row->cur_id;
   $jc_act_amount = $row->jc_act_amount;
   $actual_currency_id = $row->actual_currency_id;
   $jc_is_change_supplier = $row->jc_is_change_supplier;
   
    
    if($est_cur_id != $cur_id) {



      if(array_key_exists($est_cur_id.'-'.$cur_id, $currencyKeys) && $addManuallyCheckbox == 1){
        $exch_rate = array($currencyKeys[$est_cur_id.'-'.$cur_id]);
      }else{

        $exch_rate = getExchangeRate($est_cur_id, $cur_id, $date);
      }


      
      $exch_rate_val = $exch_rate[0]->exch_rate;
      if(!$exch_rate_val) {
       $exch_rate_val = 0;
      } else {
        $total += ($exch_rate_val * $est);  
      }
    } else {
      $total += $est; 
    }

    //calculate additional cost start----------------------------
    if($jc_is_change_supplier == 1){
            if($actual_currency_id != $cur_id) {
        if(array_key_exists($actual_currency_id.'-'.$cur_id, $currencyKeys) && $addManuallyCheckbox == 1){
         
          $exch_rate_actual = array($currencyKeys[$actual_currency_id.'-'.$cur_id]);
          
        }else{
        
          $exch_rate_actual = getExchangeRate($actual_currency_id, $cur_id, $date);
        }
        list($exch_rate_val_actual) = $exch_rate_actual;
        if($exch_rate_val_actual) {
          $overAmountTotal += ($exch_rate_val_actual * $jc_act_amount);
        }
      } else {
        $overAmountTotal += $jc_act_amount;
      }
    }


    //calculate additional cost end----------------------------
  }
  $total = $total - $overAmountTotal;
    //$total += ($act == '0.00') ? $est : $act;
  return $total;  
}

function getJobsExtraCost($j_number, 
              $cur_id, $date,
              $currencyKeys = array(),
              $addManuallyCheckbox = null, 
              $demtkCustomer = "",
              $cur_symbol,
              $job_extra_cost_arr = array()){
  
  $sql = "SELECT
        jec.jec_value,
        c.cur_id,
        trim(jec.rec_to_another_cust) AS rec_to_another_cust
      FROM
        job_extra_costs AS jec
      LEFT JOIN
        currency AS c
        ON c.cur_name = jec.jec_curr
      WHERE
        jec.j_number = $j_number AND (jec.jec_rec_type IS NULL OR jec.jec_rec_type='DEMTK') ORDER BY FIELD(jec.rec_to_another_cust,'$demtkCustomer') DESC ";
          
  $res = Job::find_by_sql($sql);
 
  
  $total = 0;
   foreach ($res as $key => $row) { 


    $val = $row->jec_value;
    $jec_cur_id = $row->cur_id;
    $customerCode =  $row->rec_to_another_cust;

    $exchangeVal = 0;
    $eachCustArr = array();
    //echo "$j_number - $val<br />";




    if($jec_cur_id != $cur_id) {
      
      //echo "$j_number - $val<br />";

      if(array_key_exists($jec_cur_id.'-'.$cur_id, $currencyKeys) && $addManuallyCheckbox == 1){

        $exch_rate = array($currencyKeys[$jec_cur_id.'-'.$cur_id]);
      }else{
        $exch_rate = getExchangeRate($jec_cur_id, $cur_id, $date);
      }
  

      $exch_rate_val = $exch_rate[0]->exch_rate;
      if(!$exch_rate_val) {
        $exch_rate_val = 0;
      } else {
        $exchangeVal = ($exch_rate_val * $val);
      }
    } else {
      $exchangeVal = $val;
    }
    $total += $exchangeVal;


    
    $job_extra_cost_arr['cust'][$customerCode]['html'] .= $cur_symbol.number_format($exchangeVal,2).'<br>';
    $job_extra_cost_arr['cust'][$customerCode]['values_explode'] .= $exchangeVal.'|';
    $job_extra_cost_arr['cust'][$customerCode]['each_revenue_total'] += $exchangeVal;
  }
  if(array_key_exists('total', $job_extra_cost_arr)){
    $job_extra_cost_arr['total'] = $job_extra_cost_arr['total'] + $total;
  }else{
    $job_extra_cost_arr['total'] = $total;
  }

  return $job_extra_cost_arr; 
}
function getJobSurchargeTotal($j_number, $cur_id, $date,$currencyKeys = array(),$addManuallyCheckbox = null)
{
  
  $sql = "SELECT
  jec.jec_value,
  c.cur_id
  FROM
  job_extra_costs AS jec
  LEFT JOIN
  currency AS c
  ON c.cur_name = jec.jec_curr
  WHERE
  jec.j_number = $j_number AND jec.is_surcharged=1 LIMIT 1";
  $res = Job::find_by_sql($sql) ;
  

  $total = 0;
  foreach ($res as $key => $row) {
   
      $val = $row->jec_value;
      $jec_cur_id = $row->cur_id;

     if($jec_cur_id != $cur_id) {
      if(array_key_exists($jec_cur_id.'-'.$cur_id, $currencyKeys) && $addManuallyCheckbox == 1){
        $exch_rate = array($currencyKeys[$jec_cur_id.'-'.$cur_id]);
      }else{
        $exch_rate = getExchangeRate($jec_cur_id, $cur_id, $date);
      }
      $exch_rate_val = $exch_rate[0]->exch_rate;
      if(!$exch_rate_val) {
        $exch_rate_val = 0;
      } else {
        $total += ($exch_rate_val * $val);
      }
    } else {

      $total += $val;
    }
    //$total += $val; //LIVE
  }
  return $total;
}
function getJobsActualCost_seperete($j_number, 
                  $cur_id, 
                  $date, 
                  $reporting_date,
                  $currencyKeys = array(),
                  $addManuallyCheckbox = null,
                  $returnCustArr = array(),
                  $j_cust_code = ""){

  $demtkAmt = 0;
  $demtkWhere = " AND jc.jc_activity<>'DEMTK' ";
  $sql = "SELECT
        jc.jc_est_amount,
        jc.jc_act_amount,
        jc.jc_act_date,
        c.cur_id AS act_cur_id,
        if(jec.rec_to_another_cust <> '',jec.rec_to_another_cust,'$j_cust_code') AS rec_to_another_cust,
        jc.jc_activity
      FROM
        job_costs AS jc
      LEFT JOIN
        currency AS c
        ON c.cur_name = jc.jc_act_curr
      LEFT JOIN 
        job_extra_costs AS jec ON jec.jec_id=jc.jc_recharge_id 
      WHERE
        jc.j_number = $j_number 
        AND jc.jc_is_change_supplier IN (0) $demtkWhere ";
    
  $res =  Job::find_by_sql($sql) ;



  

  $total = 0;
  foreach ($res as $key => $row) {
 
    $est = $row->jc_est_amount;
    $act = $row->jc_act_amount;
    $jc_act_date = $row->jc_act_date;
    $act_cur_id = $row->act_cur_id;
    $customerCode = $row->rec_to_another_cust;
    $activityCode = $row->jc_activity;


  
    if($reporting_date == 'booking-date') {
      $date = $jc_act_date ? $jc_act_date : $date;
    }
    $val = ($act == '0.00') ? $est : $act;
  
    if($act_cur_id != $cur_id) {

      if(array_key_exists($act_cur_id.'-'.$cur_id, $currencyKeys) && $addManuallyCheckbox == 1){

        $exch_rate = array($currencyKeys[$act_cur_id.'-'.$cur_id]);
      }else{
        $exch_rate = getExchangeRate($act_cur_id, $cur_id, $date);
      }
      
      $exch_rate_val =  $exch_rate[0]->exch_rate;

      
      if(!$exch_rate_val) {
       $exch_rate_val = 0;
      } else {
        $val =  ($exch_rate_val * $val);
      }
    }

    $total += $val;
    /* if($activityCode == 'DEMTK'){
      $demtkAmt = $val;
    } */
    $returnCustArr[$customerCode]['each_job_cost'] .= $val.'|'; 
    $returnCustArr[$customerCode]['job_cost_total'] += $val;
  }
  //$total = $total - $demtkAmt; // DMTK amount is not considering in jobcost total right side
  $returnArr['customer'] = $returnCustArr;
  $returnArr['total'] = $total;
  return $returnArr;
}

/**
 * function without form class
 * @param unknown_type $label
 * @param unknown_type $name
 * @param unknown_type $array
 * @param unknown_type $current
 * @param unknown_type $labelClass
 * @param unknown_type $ctrlClass
 * @param unknown_type $all_opt
 */

function sort_filter_serverside_cust_type2($label, $name, $array, $current=false, $labelClass='col-sm-2', $ctrlClass='col-sm-3',$all_opt=true){
	echo '<label class="'.$labelClass.' control-label" for="'.$name.'">'.$label.'</label>';
	echo '<div class="'.$ctrlClass.'">';
	echo '<select name="'.$name.'" id="'.$name.'" class="chosen form-control filter">';
	if ($all_opt){
		echo '<option value="">All</option>';
	}
	foreach($array as $item){
		$selected = $item->val == $current ? ' selected="selected"' : '';
		echo '<option value="'.$item->val.'"'.$selected.'>'.$item->txt.'</option>';
	}
	echo '</select>';
	echo '</div>';
}

function select3DField($data, $name, $selected, $pleasechoose = 'Please choose...', $onchange = false, $class='', $multi=false)
{
	$id = $name;
	$name = $multi ? $name."[]" : $name;
	$return =  "<select name=\"$name\" id=\"$id\" "
	.($onchange ? 'onchange="this.form.submit()"' : '')
	.($multi ? ' multiple="multiple" size="20"' : '')
	." class=\"$class\">\n";
	$return .= $pleasechoose ? '<option value="0">'.$pleasechoose.'</option>' : '';
	if(is_array($data)) {
		foreach($data as $row) {
			list($val, $txt) = $row;
				
			if($multi && is_array($selected) && in_array($val, $selected)) {
				$return .= "<option value=\"$val\" selected=\"selected\">$txt</option>\n";
			} elseif($val==$selected) {
				$return .= "<option value=\"$val\" selected=\"selected\">$txt</option>\n";
			} else {
				$return .= "<option value=\"$val\">$txt</option>\n";
			}
		} // end loop
	}
	$return .= "</select>\n";
	return $return;
}

//Tank Plan Pagination
/* pagination ----------------------------------------------------------------*/
function pagination_plan($data, $show=false) {
	$current_page = $data['page'];
	$total_pages = $data['total_pages'];
	$min = $data['min'];
	$max = $data['max'];
	$total = $data['total'];
	$limit = $data['limit'];
	?>
  <div class="custom-pagination">
    <a href="javascript:void(0)" class="first enabled first-page" title="First" data-pagenumber="1">
      <span class="glyphicon glyphicon-step-backward"></span>
    </a>
    <a href="javascript:void(0)" class="prev enabled prev-page" title="Previous" data-pagenumber="<?php echo $data['prev_page']?>">
      <span class="glyphicon glyphicon-backward"></span>
    </a>
    <div class="pagedisplay">
      Records <?php echo $min; ?> to <?php echo $max; ?> (Total <?php echo $total; ?> Results) - Page <?php echo $current_page; ?> of <?php echo $total_pages; ?>
    </div>
    <a href="javascript:void(0)" class="next enabled next-page" title="Next"  data-pagenumber="<?php echo $data['next_page']?>">
      <span class="glyphicon glyphicon-forward"></span>
    </a>
    <a href="javascript:void(0)" class="last enabled last-page" data-pagenumber="<?php echo $data['total_pages']?>" title="Last">
      <span class="glyphicon glyphicon-step-forward"></span>
    </a>
    <?php if($show == false) : ?>
    <select class="pagesize">
      <option value="25"> per page</option>
    </select>
    <?php else : ?>
    <select class="custom-page-pagesize page-limit">
      <option value="10" <?php echo ($limit == 10) ? 'selected' : ''; ?> > 10 </option>
      <option value="25" <?php echo ($limit == 25) ? 'selected' : ''; ?> > 25 </option>
      <option value="50" <?php echo ($limit == 50) ? 'selected' : ''; ?> > 50 </option>
      <option value="100" <?php echo ($limit == 100) ? 'selected' : ''; ?> > 100 </option>
      <option value="250" <?php echo ($limit == 250) ? 'selected' : ''; ?> > 250 </option>
      <option value="500" <?php echo ($limit == 500) ? 'selected' : ''; ?> > 500 </option>
    </select>
    <?php endif; ?>
  </div>
<?php }

/*
* 
*/
function sort_filter_serverside_cust_group_new($label, $name, $current, $labelClass='col-sm-2', $ctrlClass='col-sm-3',$option_type){
  
  $coreGroup = Btl\Helpers\getGroupNames();
  echo '<label class="'.$labelClass.' control-label" for="'.$name.'">'.$label.'</label>';
  echo '<div class="'.$ctrlClass.'">';
  echo '<select name="'.$name.'" id="'.$name.'" class="chosen form-control filter" data-custType="'.$option_type.'">';
    $option = '<option value="" ></option>';
    
    foreach($coreGroup AS $valuesCore){
      $option .= '<option value="'.$valuesCore->group_id.'"';
      $option .= ($current == $valuesCore->group_id) ? "selected" : '';
      $option .= ">$valuesCore->group_name</option>";
    }
    echo $option;
  echo '</select>';
  echo '</div>';
}

//Get actual cost conversion
function getJobsActualCostRev1($costArray, $j_number, $cur_id, $date, $reporting_date="",$currencyKeys = array(),$addManuallyCheckbox = null)
{
  $total = 0;

  foreach($costArray as $row) {
    list($job_number, $est, $act, $jc_act_date, $act_cur_id) = $row;

    if($reporting_date == 'booking-date') {
      $date = $jc_act_date ? $jc_act_date : $date;
    }
    
    $val = ($act == '0.00') ? $est : $act;  
    if($act_cur_id != $cur_id) {
      if(array_key_exists($act_cur_id.'-'.$cur_id, $currencyKeys) && $addManuallyCheckbox == 1){
        $exch_rate = array($currencyKeys[$act_cur_id.'-'.$cur_id]);
      }else{
        $exch_rate = getExchangeRate($act_cur_id, $cur_id, $date);
        if($exch_rate){
          $exch_rate = array($exch_rate[0]->exch_rate);
        }
      }
      
      list($exch_rate_val) = $exch_rate;
      if(!$exch_rate_val) {
        echo '<tr><td colspan="11"><p class="alert alert-error">error getting actual cost exchange value for '.$j_number.'</p></td></tr>';
        $exch_rate_val = 0;
      } else {
        $total += ($exch_rate_val * $val);
      }
    } else {
      $total += $val; 
    }
  } 
  return $total;  
}

//Get extra cost conversion
function getJobsExtraCostRev1($costArray, $j_number, $cur_id, $date, $currencyKeys = array(), $addManuallyCheckbox = null, 
  $demtkCustomer = "", $cur_symbol="", $job_extra_cost_arr = array()){

  $total = 0;
  
  foreach($costArray as $row) { 
    list($job_number, $val, $jec_cur_id,$customerCode) = $row;

    $exchangeVal = 0;
    $eachCustArr = array();
    if($jec_cur_id != $cur_id) {
      if(array_key_exists($jec_cur_id.'-'.$cur_id, $currencyKeys) && $addManuallyCheckbox == 1){
        $exch_rate = array($currencyKeys[$jec_cur_id.'-'.$cur_id]);
      }else{
        $exch_rate = getExchangeRate($jec_cur_id, $cur_id, $date);
        if($exch_rate){
          $exch_rate = array($exch_rate[0]->exch_rate);
        }
      }
      // echo "<br>rate old - ".$exch_rate;
      list($exch_rate_val) = $exch_rate;
      if(!$exch_rate_val) {
        echo '<tr><td colspan="11"><p class="alert alert-error">error getting extra cost exchange value for '.$j_number.'</p></td></tr>';
        $exch_rate_val = 0;
      } else {
        $exchangeVal = ($exch_rate_val * $val);
      }
    } else {
      $exchangeVal = $val;
    }
    $total += $exchangeVal;
    
    $job_extra_cost_arr['cust'][$customerCode]['html'] .= $cur_symbol.number_format($exchangeVal,2).'<br>';
    $job_extra_cost_arr['cust'][$customerCode]['values_explode'] .= $exchangeVal.'|';
    $job_extra_cost_arr['cust'][$customerCode]['each_revenue_total'] += $exchangeVal;
  }
  if(array_key_exists('total', $job_extra_cost_arr)){
    $job_extra_cost_arr['total'] = $job_extra_cost_arr['total'] + $total;
  }else{
    $job_extra_cost_arr['total'] = $total;
  }
  return $job_extra_cost_arr; 
}

function multiselect_dropdown($array, $name, $selected, $pleasechoose = 'Please choose...', $onchange = false, $class='', $multi=false)
{
  $id = $name;
  $name = $multi ? $name."[]" : $name;
  
  $return =  "<select name=\"$name\" id=\"$id\" "
        .($onchange ? 'onchange="this.form.submit()"' : '')
        .($multi ? ' multiple="multiple" size="15"' : '')
        ." class=\"$class\">\n";
  $return .= $pleasechoose ? '<option value="">'.$pleasechoose.'</option>' : ''; 
  if(is_array($array)) {
    foreach($array as $value) {
      if($multi && in_array($value->val, $selected)) {
        $return .= "<option selected=\"selected\">$value->val</option>\n"; 
      } elseif($value->val == $selected){
        $return .= "<option selected=\"selected\">$value->val</option>\n"; 
      } else { 
        $return .= "<option>$value->val</option>\n"; 
      }
    } // end loop
  } 
  $return .= "</select>\n"; 
  return $return;
}

//Get actual cost conversion
function getJobsActualCostByRate($costArray, $j_number, $cur_id, $date, $reporting_date="",$currencyKeys = array(),$addManuallyCheckbox = null, $exchange_data, $plan_year_week, $currency_list)
{
  $total = 0;
  foreach($costArray as $row) {
    list($job_number, $est, $act, $jc_act_date, $act_cur_id, $year_week) = $row;

    if($reporting_date == 'booking-date') {
      $date = $jc_act_date ? $jc_act_date : $date;
      $plan_year_week =  $year_week ?  $year_week : $plan_year_week;
    }
    
    $val = ($act == '0.00') ? $est : $act;  
    if($act_cur_id != $cur_id) {
      if(array_key_exists($act_cur_id.'-'.$cur_id, $currencyKeys) && $addManuallyCheckbox == 1){
        $exch_rate = array($currencyKeys[$act_cur_id.'-'.$cur_id]);
      }else{
        foreach ($exchange_data as $key => $value) {
          if($value['curr_id_base'] == $act_cur_id && $value['yearweek'] == $plan_year_week){
            $result_key = $key;
            break;
          }
        }
        
        if($result_key){
          $data = $exchange_data[$result_key];
        }
        $currency = $currency_list[$cur_id];
        $currency = strtolower($currency);

        if($data[$currency]){
          $exch_rate = $data[$currency];
        } 
      }
      if(!$exch_rate) {
        echo '<tr><td colspan="11"><p class="alert alert-error">error getting actual cost exchange value for '.$j_number.'</p></td></tr>';
        $exch_rate = 0;
      } else {
        $total += ($exch_rate * $val);
      }
    } else {
      $total += $val; 
    }
  } 
  return $total;  
}

//Get extra cost conversion new
function getJobsExtraCostByRate($costArray, $j_number, $cur_id, $date, $currencyKeys = array(), $addManuallyCheckbox = null, 
  $demtkCustomer = "", $cur_symbol="", $job_extra_cost_arr = array(),$exchange_data, $plan_year_week, $currency_list){

  $total = 0;
  
  foreach($costArray as $row) { 
    list($job_number, $val, $jec_cur_id, $customerCode, $year_week) = $row;

    $plan_year_week =  $year_week ?  $year_week : $plan_year_week;
    
    $exchangeVal = 0;
    $eachCustArr = array();
    if($jec_cur_id != $cur_id) {
      if(array_key_exists($jec_cur_id.'-'.$cur_id, $currencyKeys) && $addManuallyCheckbox == 1){
        $exch_rate = array($currencyKeys[$jec_cur_id.'-'.$cur_id]);
      }else{
        foreach ($exchange_data as $key => $value) {
          if($value['curr_id_base'] == $jec_cur_id && $value['yearweek'] == $plan_year_week){
            $result_key = $key;
            break;
          }
        }
        
        if($result_key){
          $data = $exchange_data[$result_key];
        }
        $currency = $currency_list[$cur_id];
        $currency = strtolower($currency);

        if($data[$currency]){
          $exch_rate = $data[$currency];
        } 
      }
      if(!$exch_rate) {
        echo '<tr><td colspan="11"><p class="alert alert-error">error getting extra cost exchange value for '.$j_number.'</p></td></tr>';
        $exchangeVal = 0;
      } else {
        $exchangeVal = ($exch_rate * $val);
      }
    } else {
      $exchangeVal = $val;
    }
    $total += $exchangeVal;
    
    $job_extra_cost_arr['cust'][$customerCode]['html'] .= $cur_symbol.number_format($exchangeVal,2).'<br>';
    $job_extra_cost_arr['cust'][$customerCode]['values_explode'] .= $exchangeVal.'|';
    $job_extra_cost_arr['cust'][$customerCode]['each_revenue_total'] += $exchangeVal;
  }
  if(array_key_exists('total', $job_extra_cost_arr)){
    $job_extra_cost_arr['total'] = $job_extra_cost_arr['total'] + $total;
  }else{
    $job_extra_cost_arr['total'] = $total;
  }
  return $job_extra_cost_arr; 
}

//Get exchange rate by yearweek
function getExchangeRateByArray($base_curr_id, $nonbase_curr_id,$plan_year_week, $exchange_data, $currency_list=array()){

  try{
    $exch_date = 0;
    foreach ($exchange_data as $key => $value) {
      if($value['curr_id_base'] == $base_curr_id && $value['yearweek'] == $plan_year_week){
        $result_key = $key;
        break;
      }
    }
    
    if($result_key){
      $data = $exchange_data[$result_key];
    }
    $currency = $currency_list[$nonbase_curr_id];
    $currency = strtolower($currency);

    if($data[$currency]){
      $exch_rate = $data[$currency];
    }
    return $exch_rate;
  }
  catch(Exception $e){
    //Excepton
    return $exch_rate;
  }
}

/**
 * Function for creating multi coulmn all option disabled
 * @param unknown_type $label
 * @param unknown_type $name
 * @param unknown_type $array
 * @param unknown_type $current
 */
function multicolum_filter_serverside_option_group_disabled_all($label, $name, $array, $combinevalue =true, $option=array(), $current=array()){

  $requited = '';
  $degaultOption ="Please select";
  $disabled = '';

  if(isset($option['required']) && $option['required'] == true){
      $requited = ' required ';
  }
  if(isset($option['default-option'])){
      $degaultOption = $option['default-option'];
  }
  if(isset($option['disabled']) && $option['disabled'] == 'disabled'){
      $disabled = $option['disabled'];
  }

  echo '<div class="form-group">';
  echo '<label class="col-sm-4 control-label ' . $requited . ' " for="'.$name.'">'.$label.'</label>';
  echo '<div class="col-sm-8">';
  echo '<select name="'.$name.'[]" id="'.$name.'" class="chosen form-control filter reset-filter" ' . $disabled . '>';
  
  echo '<option value="">'.$degaultOption.'</option>';

  foreach($array as $itemKey => $item){
    $selected = "";
    if(!is_array($item)){
      foreach($current as $cur_item){
        if($itemKey == $cur_item){
          $selected = ' selected="selected"';
        }
      }
      echo '<option value="'.$itemKey.'"'.$selected.'>'.$item.'</option>';
    }else{
      if(!empty($item)){
        echo '<optgroup label="'.$itemKey.'">';
        foreach($item as $option_grp_key => $option_grp_val){
          $selected1 = '';
          if($combinevalue){
            $combinedKey = strtolower($itemKey).'_'.$option_grp_key;  
          }else{
            $combinedKey = $option_grp_key;
          }
          
          foreach($current as $cur_item1){
            if($combinedKey == $cur_item1){
              $selected1 = ' selected="selected"';
            }
          }
          echo '<option value="'.$combinedKey.'"'.$selected1.'>'.$option_grp_val.'</option>';
        }
        echo '</optgroup>';
      }
    }

  }
  echo '</select>';
  //echo '<input type="text" class="tmp-input-ctrl form-control" value="" disabled /></div>';
  echo '</div>';
  echo '</div>';
}

function btlBasepath(){
  if(defined("BTL_URL_PREFIX") && BTL_URL_PREFIX != "") {
        $file_path = $_SERVER['DOCUMENT_ROOT'] . "/" . substr(BTL_URL_PREFIX, 0,-1);
    } else {
        $file_path = $_SERVER['DOCUMENT_ROOT'];
    }
  return $file_path;
}

function getBTLMailEngine(){

  if(BTL_SERVER_TYPE == 'LIVE'){
        $transport = Swift_SmtpTransport::newInstance(BTL_EMAIL_HOST_NEW, BTL_EMAIL_PORT_NEW, BTL_DEFAULT_EMAIL_ENCR);
  }else{
        $transport = Swift_SmtpTransport::newInstance(BTL_EMAIL_HOST, BTL_EMAIL_PORT,BTL_DEFAULT_EMAIL_ENCR)
                                        ->setUsername(BTL_EMAIL_USER)
                                        ->setPassword(BTL_EMAIL_PASS);
  }
  return Swift_Mailer::newInstance($transport);
}


function multicolum_filter_serverside_associative($name, $array, $current=array(), $valueOnly = false,$selectAll = true){
  
  echo '<select style="display:none" name="'.$name.'[]" id="'.$name.'" class="multi-sel-ctrl form-control filter" multiple size="1">';
  if($selectAll){
      if((count($current) > 0 && $current[0] == "") || count($current) == 0) {
          echo '<option value="" selected="selected">All</option>';
      } else {
          echo '<option value="" >All</option>';
      }
  }
  
  foreach($array as $keyItem => $item){
    $currentValue = ($valueOnly) ? $item : $keyItem;
    $selected = "";
    if(is_array($current)){
      foreach($current as $cur_item){
          if($currentValue == $cur_item){
              $selected = ' selected="selected"';
          }
      }
    }
    echo '<option value="'.$currentValue.'"'.$selected.'>'.$item.'</option>';
  }
  echo '</select>';
  echo '<input type="text" class="tmp-input-ctrl form-control" value="" disabled />';
}

function multicolum_filter_serverside_associative_select_all($name, $array, $current=array(), $valueOnly = false){
  
  echo '<select style="display:none" name="'.$name.'[]" id="'.$name.'" class="multi-select-all form-control filter" multiple size="1">';
  foreach($array as $keyItem => $item){
    $currentValue = ($valueOnly) ? $item : $keyItem;
    $selected = "";
    if(is_array($current)){
      foreach($current as $cur_item){
          if($currentValue == $cur_item){
              $selected = ' selected="selected"';
          }
      }
    }
    echo '<option value="'.$currentValue.'"'.$selected.'>'.$item.'</option>';
  }
  echo '</select>';
  echo '<input type="text" class="tmp-input-ctrl form-control" value="" disabled />';
}

function bookedDropDown($selected){
    echo '<option value="0">&nbsp;</option>';
    echo '<option value="2" ' . (($selected == 2) ? 'selected' : '') . '>PRE-ADV</option>';
    echo '<option value="1" ' . (($selected == 1) ? 'selected' : '') . '>SENT</option>';
    echo '<option value="3" ' . (($selected == 3) ? 'selected' : '') . '>RCVD</option>';
}
