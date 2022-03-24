<?php

namespace Btl\Helpers\SupplierCosts;


function extra_is_checked($extra, $quote, $supplier_cost) {
  if(!$quote) {
    return;
  }

  $quote_extras = $quote->customer_quote_cost_extras;
  $filtered = array_filter($quote_extras, function($qe) use($extra, $supplier_cost) {
    return $qe->supp_costs_extras_id == $extra->id && $qe->supp_cost_id == $supplier_cost->id;
  });

  echo empty($filtered) ? '' : 'checked="checked"';
}


function obthc_cost_div($other_costs,$currencies)
{
	$divcount = count($other_costs);
	$otherdiv_pos = "first";
	
	$other_itm_count = 1;
	
	?>
		  <input id="obthc-other-count" value="<?php echo $divcount > 0 ? $divcount + 1 : 1; ?>" type="hidden" />
          
          <?php foreach ((object) $other_costs as $other_cost) :
	          if ($other_itm_count == 1)
	          {
	          		$otherdiv_pos = "first";
	          } else {
	          		$otherdiv_pos = "middle";
	          }
	          
	          $other_itm_count += 1;
          ?>       
                 
		 <div class="form-group" data-otherdiv-pos="<?php echo $otherdiv_pos; ?>" data-otherdiv-container="obthc-other" data-otherdiv-count-controller="obthc-other-count" data-other-sample="obthc-div">
             <label for="obthc_other_cost" class="col-sm-2 control-label">Other</label>
             <div class="col-sm-2">
                  <input class="form-control deepsea-calc-fld" name="obthc_other_cost[]" placeholder="" type="text" onKeyPress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off"  onpaste="return false;" maxlength="11" value="<?php echo $other_cost->cost; ?>">
                  <input name="obthc_other_cost_type[]" value="<?php echo $other_cost->cost_type; ?>" type="hidden">
             </div>
             <div class="col-sm-2">
                  <select name="obthc_other_curr_id[]" class="form-control deepsea-calc-fld" data-placeholder="Please select">
				        <?php echo options_from_collection_for_select($currencies, 'cur_id', 'cur_name', $other_cost->currency_id); ?> 
				  </select>
             </div>
             <div class="col-sm-2">                    
                  <input class="form-control" name="obthc_other_comm[]" placeholder="eg Docs" value="<?php echo $other_cost->comment; ?>" type="text" onpaste="return false;" maxlength="100">                 
             </div>
             <div class="col-sm-3">
                  <a class="btn btn-success other-add-btn" style="display: none;"><span class="glyphicon glyphicon-plus-sign"></span></a>
                  <a class="btn btn-danger other-sub-btn deepsea-calc-sub-btn"><span class="glyphicon glyphicon-minus-sign"></span></a>
             </div>
          </div>	                 
                 
          <?php endforeach; 
          
	          if ($divcount > 0)
	          {
	          	$otherdiv_pos = "last";
	          }
          ?>       
                 
          <div class="form-group" data-otherdiv-pos="<?php echo $otherdiv_pos; ?>" data-otherdiv-container="obthc-other" data-otherdiv-count-controller="obthc-other-count" data-other-sample="obthc-div">
             <label for="obthc_other_cost" class="col-sm-2 control-label">Other</label>
             <div class="col-sm-2">
                  <input class="form-control deepsea-calc-fld" name="obthc_other_cost[]" placeholder="" type="text" onKeyPress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off"  onpaste="return false;" maxlength="11">
                  <input name="obthc_other_cost_type[]" value="obthc" type="hidden">
             </div>
             <div class="col-sm-2">
                  <select name="obthc_other_curr_id[]" class="form-control deepsea-calc-fld" data-placeholder="Please select">
				        <?php echo options_from_collection_for_select($currencies, 'cur_id', 'cur_name', false); ?> 
				  </select>
             </div>
             <div class="col-sm-2">                    
                  <input class="form-control" name="obthc_other_comm[]" placeholder="eg Docs" value="" type="text" onpaste="return false;" maxlength="100">                 
             </div>
             <div class="col-sm-3">
                  <a class="btn btn-success other-add-btn"><span class="glyphicon glyphicon-plus-sign"></span></a>
                  <a class="btn btn-danger other-sub-btn deepsea-calc-sub-btn"><span class="glyphicon glyphicon-minus-sign"></span></a>
             </div>
          </div>	
	<?php 
}


function mf_cost_div($other_costs,$currencies)
{
	$divcount = count($other_costs);
	$otherdiv_pos = "first";

	$other_itm_count = 1;

	?>
		  <input id="mf-other-count" value="<?php echo $divcount > 0 ? $divcount + 1 : 1; ?>" type="hidden" />
          
          <?php foreach ((object) $other_costs as $other_cost) :
	          if ($other_itm_count == 1)
	          {
	          		$otherdiv_pos = "first";
	          } else {
	          		$otherdiv_pos = "middle";
	          }
	          
	          $other_itm_count += 1;
          ?>       
                 
		 <div class="form-group" data-otherdiv-pos="<?php echo $otherdiv_pos; ?>" data-otherdiv-container="mf-other" data-otherdiv-count-controller="mf-other-count" data-other-sample="mf-div">
             <label for="mfc_other_cost" class="col-sm-2 control-label">Other</label>
             <div class="col-sm-2">
                  <input class="form-control deepsea-calc-fld" name="mf_other_cost[]" placeholder="" type="text" onKeyPress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off"  onpaste="return false;" maxlength="11" value="<?php echo $other_cost->cost; ?>">
	              <input name="mf_other_cost_type[]" value="<?php echo $other_cost->cost_type; ?>" type="hidden">
             </div>
             <div class="col-sm-2">
				  <select name="mf_other_curr_id[]" class="form-control deepsea-calc-fld" data-placeholder="Please select">
			        	<?php echo options_from_collection_for_select($currencies, 'cur_id', 'cur_name', $other_cost->currency_id); ?> 
			      </select>
             </div>
             <div class="col-sm-2">                    
                  <input class="form-control" name="mf_other_comm[]" placeholder="eg Docs" value="<?php echo $other_cost->comment; ?>" type="text" onpaste="return false;" maxlength="100">                 
             </div>
             <div class="col-sm-3">
                  <a class="btn btn-success other-add-btn" style="display: none;"><span class="glyphicon glyphicon-plus-sign"></span></a>
                  <a class="btn btn-danger other-sub-btn deepsea-calc-sub-btn"><span class="glyphicon glyphicon-minus-sign"></span></a>
             </div>
          </div>	                 
                 
          <?php endforeach; 
          
	          if ($divcount > 0)
	          {
	          	$otherdiv_pos = "last";
	          }
          ?>       
                 
          <div class="form-group" data-otherdiv-pos="<?php echo $otherdiv_pos; ?>" data-otherdiv-container="mf-other" data-otherdiv-count-controller="mf-other-count" data-other-sample="mf-div">
             <label for="mfc_other_cost" class="col-sm-2 control-label">Other</label>
             <div class="col-sm-2">
                  <input class="form-control deepsea-calc-fld" name="mf_other_cost[]" placeholder="" type="text" onKeyPress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off"  onpaste="return false;" maxlength="11">
	              <input name="mf_other_cost_type[]" value="mf" type="hidden">
             </div>
             <div class="col-sm-2">
                  <select name="mf_other_curr_id[]" class="form-control deepsea-calc-fld" data-placeholder="Please select">
			        <?php echo options_from_collection_for_select($currencies, 'cur_id', 'cur_name', false); ?> 
			      </select>
             </div>
             <div class="col-sm-2">                    
                  <input class="form-control" name="mf_other_comm[]" placeholder="eg Docs" value="" type="text" onpaste="return false;" maxlength="100">                 
             </div>
             <div class="col-sm-3">
                  <a class="btn btn-success other-add-btn"><span class="glyphicon glyphicon-plus-sign"></span></a>
                  <a class="btn btn-danger other-sub-btn deepsea-calc-sub-btn"><span class="glyphicon glyphicon-minus-sign"></span></a>
             </div>
          </div>	
	<?php 
}


function dthc_cost_div($other_costs,$currencies)
{
	$divcount = count($other_costs);
	$otherdiv_pos = "first";

	$other_itm_count = 1;

	?>
		  <input id="dthc-other-count" value="<?php echo $divcount > 0 ? $divcount + 1 : 1; ?>" type="hidden" />
          
          <?php foreach ((object) $other_costs as $other_cost) :
	          if ($other_itm_count == 1)
	          {
	          		$otherdiv_pos = "first";
	          } else {
	          		$otherdiv_pos = "middle";
	          }
	          
	          $other_itm_count += 1;
          ?>       
                 
		 <div class="form-group" data-otherdiv-pos="<?php echo $otherdiv_pos; ?>" data-otherdiv-container="dthc-div" data-otherdiv-count-controller="dthc-other-count" data-other-sample="dthc-div">
             <label for="dthc_other_cost" class="col-sm-2 control-label">Other</label>
             <div class="col-sm-2">
	              <input class="form-control deepsea-calc-fld" name="dthc_other_cost[]" placeholder="" type="text" onKeyPress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off"  onpaste="return false;" maxlength="11" value="<?php echo $other_cost->cost; ?>">
	              <input name="dthc_other_cost_type[]" value="<?php echo $other_cost->cost_type; ?>" type="hidden">
             </div>
             <div class="col-sm-2">
			      <select name="dthc_other_curr_id[]" class="form-control deepsea-calc-fld" data-placeholder="Please select">
					    <?php echo options_from_collection_for_select($currencies, 'cur_id', 'cur_name', $other_cost->currency_id); ?>
				  </select>
             </div>
             <div class="col-sm-2">                    
                  <input class="form-control" name="dthc_other_comm[]" placeholder="eg Docs" value="<?php echo $other_cost->comment; ?>" type="text" onpaste="return false;" maxlength="100">                 
             </div>
             <div class="col-sm-3">
                  <a class="btn btn-success other-add-btn" style="display: none;"><span class="glyphicon glyphicon-plus-sign"></span></a>
                  <a class="btn btn-danger other-sub-btn deepsea-calc-sub-btn"><span class="glyphicon glyphicon-minus-sign"></span></a>
             </div>
          </div>	                 
             
          <?php endforeach; 
          
	          if ($divcount > 0)
	          {
	          	$otherdiv_pos = "last";
	          }
          ?>       
                 
          <div class="form-group" data-otherdiv-pos="<?php echo $otherdiv_pos; ?>" data-otherdiv-container="dthc-div" data-otherdiv-count-controller="dthc-other-count" data-other-sample="dthc-div">
             <label for="dthc_other_cost" class="col-sm-2 control-label">Other</label>
             <div class="col-sm-2">
                  <input class="form-control deepsea-calc-fld" name="dthc_other_cost[]" placeholder="" type="text" onKeyPress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off"  onpaste="return false;" maxlength="11">
                  <input name="dthc_other_cost_type[]" value="dthc" type="hidden">
             </div>
             <div class="col-sm-2">
                  <select name="dthc_other_curr_id[]" class="form-control deepsea-calc-fld" data-placeholder="Please select">
				     <?php echo options_from_collection_for_select($currencies, 'cur_id', 'cur_name', false); ?> 
				  </select>
             </div>
             <div class="col-sm-2">                    
                  <input class="form-control" name="dthc_other_comm[]" placeholder="eg Docs" value="" type="text" onpaste="return false;" maxlength="100">                 
             </div>
             <div class="col-sm-3">
                  <a class="btn btn-success other-add-btn"><span class="glyphicon glyphicon-plus-sign"></span></a>
                  <a class="btn btn-danger other-sub-btn deepsea-calc-sub-btn"><span class="glyphicon glyphicon-minus-sign"></span></a>
             </div>
          </div>	
	<?php 
}

