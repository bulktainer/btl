<h2>Activities</h2>

<div id="response"></div>
<div id="feedback"></div>

<?php if(in_array($_SESSION['MM_Username'], $userList)){ ?>
  <a href='<?php echo HOME."erp.php/activity/create"; ?>' title="Add New Activity" class='btn btn-info btn-block' ><span class="glyphicon glyphicon-plus-sign" ></span>  Add New Activity</a>
  <br>
<?php } ?>
  <div class="form-horizontal">
    <div class="panel panel-default">
      <div class="panel-body">
      	<form method="get" id="search-form" action="">
          <fieldset>
            <legend>Filter Results</legend>
             
			    <div class="form-group">
		           <label class="col-sm-2 control-label" for="activity-filter">Activity Name</label>
		           <div class="col-sm-3">
		             <input type="text" name="activity-filter" id="activity-filter" style="text-transform: uppercase;" class="form-control filter-input-fld" maxlength="5" value="<?php echo filter_input(INPUT_GET, 'activity-filter', FILTER_SANITIZE_STRING); ?>" autocomplete="on" />
		           </div>
		        </div> 
			   
			    <div class="form-group">
		              <label class="col-sm-2 control-label" for="status-filter">Status</label>
		              <div class="col-sm-3">
		                <select name="status-filter" id="status-filter" class="form-control filter center-selected">
			                <option value="" <?php echo !isset($_GET["status-filter"]) ? 'selected' : ''; ?>>All</option> 
			                <option value="0" <?php echo (filter_input(INPUT_GET, 'status-filter', FILTER_SANITIZE_STRING) == '0') ? 'selected' : ''; ?> >Live</option>
			                <option value="1" <?php echo filter_input(INPUT_GET, 'status-filter', FILTER_SANITIZE_STRING) == '1' ? 'selected' : ''; ?> >Archive</option>
		                </select>	
		              </div>
		        </div>
		      
            <div class="form-group">
              <label class="col-sm-2 control-label"></label>
              <div class="col-sm-5">
                <button type="submit" class="btn btn-success" title="Filter"><span class="glyphicon glyphicon-filter"></span> Filter</button>
              </div>
              <div class="col-sm-3 pull-right">
              	<a href="/<?php echo BTL_URL_PREFIX; ?>erp.php/activity/index" class="reset btn btn-primary" title="Reset Search Filters"><span class="glyphicon glyphicon-refresh"></span> Reset Search Filters</a>
              </div>
            </div>
          </fieldset>
          <input type="hidden" name="pagesize" id="pagesize" value="<?php echo $pagination['limit']; ?>" />
        </form>        
      </div>
    </div>
  </div>

<?php 



if($activityList) { ?>

  <?php pagination($pagination,true); ?>
    <div style="width: 100%;overflow-x: auto;">
	<table class="table table-condensed table-bordered table-hover">
	  <thead>
	    <tr>
	      <th class="td-with-border center-cell">Activity</th>
	      <th class="td-with-border center-cell">Planning</th>
	      <th class="td-with-border center-cell">Quote</th>
	      <th class="td-with-border center-cell">Cost Page</th>
	      <th class="td-with-border center-cell">Reason</th>
	      <th class="td-with-border center-cell">Rechargeable</th>
	      <th class="td-with-border center-cell">Operational Review</th>
	      <th class="td-with-border center-cell">Slush</th>
	      <th class="td-with-border center-cell">Description</th>
	      <th class="td-with-border center-cell">Nominal</th>
	   	  <th class="td-with-border center-cell">Tracking Point</th>
	   	  <th class="td-with-border center-cell">Last Activity</th>
	      <th class="td-with-border center-cell">Action</th>
	    </tr>
	  </thead>
	  <tbody>
	    <?php foreach($activityList as $eachList) : 
	    ?><?php //echo $trClass; ?>
	      <tr >
	        <td width="8%">
	        	<?php echo $eachList->act_activity; ?>
	        </td>
	        <td width="8%">
	        	<?php echo $eachList->act_planning; ?>
	        </td>
	        <td width="8%">
	        	<?php echo $eachList->act_quote; ?>
	        </td>
	        <td width="8%">
	        	<?php echo $eachList->act_costpage; ?>
	        </td>
	        <td width="8%">
	        	<?php echo $eachList->act_reason_code; ?>
	        </td>
	        <td width="8%" >
	        	<?php echo $eachList->act_rechargeable_col; ?>
	        </td>
	        <td width="8%" >
	        	<?php echo $eachList->act_operational_review_col; ?>
	        </td>
	        <td width="9%" >
	        	<?php echo $eachList->act_slush_val; ?>
	        </td>
	        <td width="9%" >
	        	<?php echo $eachList->act_description; ?>
	        </td>
	        <td width="8%">
	        	<?php echo $eachList->act_nominal; ?>
	        </td>
			<td width="8%">
			
	        	<?php echo $eachList->tracking_point_name; ?>
	        </td>
	        <td width="8%">
	        	<?php echo $eachList->last_activity_name; ?>
	        </td>
	        <td style="min-width: 100px">
	        <?php if(in_array($_SESSION['MM_Username'], $userList)){ ?> 
	         	<a href="<?php echo path_to("/activity/".$eachList->act_activity_id."/edit"); ?>" title="Edit Activity"><span class="fa fa-pencil"></span></a>&nbsp;
		        <a class="view_activity" href="" title="View Activity" data-id="<?php echo $eachList->act_activity_id; ?>" data-toggle="modal" data-target="#activity_view_modal">
		         	<span class="fa fa-eye"></span>
		        </a>
		        <?php if ($eachList->act_is_archived == 0): ?> 
		        	<a class="activity_change_status" title="Archive" href="#" data-activity-change-to ="archive" data-id="<?php echo $eachList->act_activity_id; ?>" data-activity="<?php echo $eachList->act_activity; ?>">
		        		 <i class="fa fa-archive" style="font-size:14px" aria-hidden="true"></i>   	
		        	</a>
		        <?php else: ?>	        	
		        	<a class="activity_change_status" title="Make Live" href="#" data-activity-change-to ="live"  data-id="<?php echo $eachList->act_activity_id; ?>" data-activity="<?php echo $eachList->act_activity; ?>">
		        		 <i class="fa fa-archive" style="font-size:14px;color:green" aria-hidden="true"></i>   	
		        	</a>
		        <?php endif; ?>
	         <?php }
	         else{ ?>
	         	<a class="view_activity" href="" title="View Activity" data-id="<?php echo $eachList->act_activity_id; ?>" data-toggle="modal" data-target="#activity_view_modal">
		         	<span class="fa fa-eye"></span>
		        </a>
	         <?php } ?>
	        </td>
	      </tr>
	    <?php endforeach; ?>
	  </tbody>
	</table>
	</div>

	<?php pagination($pagination,true); ?>

<?php } else { ?>

	<br />
	<div class="alert alert-warning alert-dismissable">
	  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
	  <i class="fa fa-exclamation-circle"></i> <strong>Sorry</strong>, there are no Activity.
	</div>
<?php } ?>
<!--To view a pop up on view -->
<div class="modal fade" id="activity_view_modal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Activity Details&nbsp;<span class="view_small_loader" style="display: none;"><img src="<?php echo HOME; ?>images/ajax.gif"/></span></h4>
      </div>
        <div class="modal-body">
        	<div class="table-responsive">
		    <table class="table table-striped table-condensed table-bordered table-hover thick-table">
			  <thead>
			    <tr>
		          <th>Field</th>
		          <th>Field Value</th>
		          
			    </tr>
			  </thead>
			  <tbody>
			  	 <tr>
			     	<td width="25%"><strong>Activity</strong></td>
			     	<td width="25%" colspan="3"><span id="modal_act_activity" class="reset_values"></span></td>
			     </tr>
			     <tr>
			     	<td width="25%"><strong>Planning</strong></td>
			     	<td width="25%"><span id="modal_act_planning" class="reset_values"></span></td>
			     	
			     </tr>
			     <!-- <tr>
			     	<td width="25%"><strong>Moving</strong></td>
			     	<td width="25%"><span id="modal_act_moving" class="reset_values"></span></td>
			     	
			     </tr> -->
			     <tr>
			     	<td width="25%"><strong>Quote</strong></td>
			     	<td width="25%"><span id="modal_act_quote" class="reset_values"></span></td>
			     	
			     </tr>
			     <tr>
			     	<td width="25%"><strong>Cost Page</strong></td>
			     	<td width="25%"><span id="modal_act_costpage" class="reset_values"></span></td>
			     	
			     </tr>
			     <tr>
			     	<td width="25%"><strong>Reason</strong></td>
			     	<td width="25%"><span id="modal_act_reason" class="reset_values"></span></td>
			     	
			     </tr>
			     <tr>
			     	<td width="25%"><strong>Rechargeable</strong></td>
			     	<td width="25%"><span id="modal_act_rechargeable" class="reset_values"></span></td>
			     	
			     </tr>
			     <tr>
			     	<td width="25%"><strong>Operational Review</strong></td>
			     	<td width="25%"><span id="modal_act_review" class="reset_values"></span></td>
			     	
			     </tr>
			     <tr>
			     	<td width="25%"><strong>Description</strong></td>
			     	<td width="25%"><span id="modal_act_description" class="reset_values"></span></td>
			     	
			     </tr>
			     <tr>
			     	<td width="25%"><strong>Nominals</strong></td>
			     	<td width="25%"><span id="modal_act_nominal" class="reset_values"></span></td>
			     	
			     </tr>
			     <tr>
			     	<td width="25%"><strong>Tracking Point</strong></td>
			     	<td width="25%"><span id="modal_act_tracking" class="reset_values"></span></td>
			     	
			     </tr>
			     <tr>
			     	<td width="25%"><strong>Last Activity</strong></td>
			     	<td width="25%"><span id="modal_last_activity" class="reset_values"></span></td>
			     </tr>
			   </tbody>
			</table> 
			</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default link-btn" data-dismiss="modal" title="Close"><span class="glyphicon glyphicon-remove-circle"></span> Close</button>
        </div>
    </div>
  </div>
</div>