<?php
namespace Btl\Helpers\StorageCosts;


function surcharge_div($other_costs) {
  	$divcount = count($other_costs);
    if($divcount <= 1){
        $totalCount = 1;
    }else{
        $totalCount = $divcount;
    }
?>
		<input id="surcharge-other-count" value="<?php echo ($divcount > 0 ? $divcount : 1); ?>" type="hidden" />
          
    <?php //foreach ((object) $other_costs as $other_cost) :
     for($other_itm_count = 1; $other_itm_count <= $totalCount; $other_itm_count++) : 

      if ($other_itm_count == 1)
      {
      		$otherdiv_pos = "first";
      } elseif($other_itm_count == $totalCount){
          $otherdiv_pos = "last";
      } else {
      		$otherdiv_pos = "middle";
      }

      if($other_itm_count <= $divcount){
          $sdr_day_from = $other_costs[$other_itm_count-1]->sdr_day_from;
          $sdr_day_to = $other_costs[$other_itm_count-1]->sdr_day_to;
          $sdr_rate = number_format($other_costs[$other_itm_count-1]->sdr_rate,2,".","");
          $sdr_reason = $other_costs[$other_itm_count-1]->sdr_reason;
      } else {
          $sdr_day_from = "";
          $sdr_day_to = "";
          $sdr_rate = "";
          $sdr_reason = "";
      }
    ?>       

     <div class="form-group" data-otherdiv-pos="<?php echo $otherdiv_pos; ?>" data-otherdiv-container="surcharge-other" data-otherdiv-count-controller="surcharge-other-count" data-other-sample="surcharge-div">  
        <label for="surcharge" class="col-sm-2 control-label"></label>
        <div class="col-sm-2">
             <input class="form-control sur_charge_day_from" name="sur_day_from[]" placeholder="" type="text" value="<?php echo $sdr_day_from; ?>" onKeyPress="return NumberValuesOnly(this,event);" onchange="return NonDecimalNumber(this);" autocomplete="off" onpaste="return false;" maxlength="4">
        </div>

        <div class="col-sm-2">
             <input class="form-control sur_charge_day_to" name="sur_day_to[]" placeholder="" type="text" value="<?php echo $sdr_day_to; ?>" onKeyPress="return NumberValuesOnly(this,event);" onchange="return NonDecimalNumber(this);" autocomplete="off"  onpaste="return false;" maxlength="4">
        </div>

        <div class="col-sm-2">
          <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-eur"></i></span>
          <input type="text" class="form-control sur_charge_rate" name="sur_price[]" value="<?php echo $sdr_rate; ?>" onkeypress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off" onpaste="return false;" maxlength="11" />
              </div>
        </div>

        <div class="col-sm-2">
          <input class="form-control sur_charge_reason" name="sur_reason[]" placeholder="" type="text" value="<?php echo $sdr_reason; ?>" autocomplete="off" maxlength="50">
        </div>
        <div class="col-sm-2">
         
              <a class="btn btn-success other-add-btn" <?php echo (($otherdiv_pos == 'first' && $totalCount > 1) || $otherdiv_pos == 'middle') ? 'style="display: none;"' : ''; ?>><span class="glyphicon glyphicon-plus-sign"></span></a>
              <a class="btn btn-danger other-sub-btn"><span class="glyphicon glyphicon-minus-sign"></span></a>
           
        </div>
     </div>
                 
<?php endfor; 
	        
}


function lumpsum_div($other_costs) {
    $divcount = count($other_costs);
    if($divcount <= 1){
        $totalCount = 1;
    }else{
        $totalCount = $divcount;
    }
?>
    <input id="lumpsum-other-count" value="<?php echo $divcount > 0 ? $divcount : 1; ?>" type="hidden" />
          
    <?php //foreach ((object) $other_costs as $other_cost) :
     for($other_itm_count = 1; $other_itm_count <= $totalCount; $other_itm_count++) : 
      
      if ($other_itm_count == 1)
      {
          $otherdiv_pos = "first";
      } elseif($other_itm_count == $totalCount){
          $otherdiv_pos = "last";
      } else {
          $otherdiv_pos = "middle";
      }

      if($other_itm_count <= $divcount){
          $sdr_apply_day = $other_costs[$other_itm_count-1]->sdr_apply_day;
          $sdr_rate = number_format($other_costs[$other_itm_count-1]->sdr_rate,2,".","");
          $sdr_reason = $other_costs[$other_itm_count-1]->sdr_reason;
      } else {
          $sdr_apply_day = "";
          $sdr_rate = "";
          $sdr_reason = "";
      }
    ?>       

     <div class="form-group lumpsum-div" data-otherdiv-pos="<?php echo $otherdiv_pos; ?>" data-otherdiv-container="lumpsum-other" data-otherdiv-count-controller="lumpsum-other-count" data-other-sample="lumpsum-div">   
        <label for="lumpsum" class="col-sm-2 control-label"></label>
        <div class="col-sm-2">
             <input class="form-control lumps_apply_day" name="lumps_apply_day[]" placeholder="" type="text" value="<?php echo $sdr_apply_day; ?>" onKeyPress="return NumberValuesOnly(this,event);" onchange="return NonDecimalNumber(this);" autocomplete="off"  onpaste="return false;" maxlength="4">
        </div>

        <div class="col-sm-2">
          <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-eur"></i></span>
          <input type="text" class="form-control lumps_price" name="lumps_price[]" value="<?php echo $sdr_rate; ?>" onkeypress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off" onpaste="return false;" maxlength="11" />
              </div>
        </div>

        <div class="col-sm-2">
          <input class="form-control lumps_reason" name="lumps_reason[]" placeholder="" type="text" value="<?php echo $sdr_reason; ?>" autocomplete="off" maxlength="50">
        </div>
        <div class="col-sm-2">
            <a class="btn btn-success other-add-btn" <?php echo (($otherdiv_pos == 'first' && $totalCount > 1) || $otherdiv_pos == 'middle') ? 'style="display: none;"' : ''; ?>><span class="glyphicon glyphicon-plus-sign"></span></a>
            <a class="btn btn-danger other-sub-btn"><span class="glyphicon glyphicon-minus-sign"></span></a>
         </div>
     </div>
                
<?php endfor; 
          
}


function dailyrate_div($other_costs) {
    $divcount = count($other_costs);
    if($divcount <= 1){
        $totalCount = 1;
    }else{
        $totalCount = $divcount;
    }
?>
    <input id="dailyrate-other-count" value="<?php echo $divcount > 0 ? $divcount + 1 : 1; ?>" type="hidden" />
          
    <?php //foreach ((object) $other_costs as $other_cost) :
     for($other_itm_count = 1; $other_itm_count <= $totalCount; $other_itm_count++) : 
      
      if ($other_itm_count == 1)
      {
          $otherdiv_pos = "first";
      } elseif($other_itm_count == $totalCount){
          $otherdiv_pos = "last";
      } else {
          $otherdiv_pos = "middle";
      }

      if($other_itm_count <= $divcount){
          $sdr_day_from = $other_costs[$other_itm_count-1]->sdr_day_from;
          $sdr_day_to = $other_costs[$other_itm_count-1]->sdr_day_to;
          $sdr_rate = number_format($other_costs[$other_itm_count-1]->sdr_rate,2,".","");
          if($other_itm_count < $divcount) $hasValue = ($sdr_day_to == "" || $sdr_day_to == "0") ? "no" : "yes";
          else $hasValue = "no";
      } else {
          $sdr_day_from = "";
          $sdr_day_to = "";
          $sdr_rate = "";
          $hasValue = "no";
      }
    ?>       

     <div class="form-group dailyrate-div" data-otherdiv-pos="<?php echo $otherdiv_pos; ?>" data-otherdiv-container="dailyrate-other" data-otherdiv-count-controller="dailyrate-other-count" data-other-sample="dailyrate-div" data-hasvalue="<?php echo $hasValue; ?>">
              
      <label for="daily_rates" class="col-sm-2 control-label"></label>
      <div class="col-sm-2">
           <input class="form-control dailyrate_day_from" name="day_from[]" placeholder="" type="text" value="<?php echo $sdr_day_from; ?>" onKeyPress="return NumberValuesOnly(this,event);" onchange="return NonDecimalNumber(this);" autocomplete="off"  onpaste="return false;" maxlength="4">
      </div>
      <div class="col-sm-2">
           <input class="form-control dailyrate_day_to" name="day_to[]" placeholder="" type="text" value="<?php echo ($sdr_day_to == 0) ? '' : $sdr_day_to; ?>" onKeyPress="return NumberValuesOnly(this,event);" onchange="return NonDecimalNumber(this);" autocomplete="off"  onpaste="return false;" maxlength="4" data-oldvalue="<?php echo $sdr_day_to; ?>">
      </div>
      <div class="col-sm-2">
        <div class="input-group">
           <span class="input-group-addon"><i class="fa fa-eur"></i></span>
           <input type="text" class="form-control dailyrate_rate" name="daily_rates[]" value="<?php echo $sdr_rate; ?>" onkeypress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off" onpaste="return false;" maxlength="11" />
        </div>
      </div>
    </div>
                
<?php endfor; 
          
}

