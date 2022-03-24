<?php
if ($form == 'edit') {
    $path = '..';
    $user_btn = 'Update';
    $activity_title = 'Edit';
    $btn_class = 'edit-activity';
    $disabled = 'readonly';
} else {
    $path = '../activity';
    $user_btn = 'Create';
    $activity_title = 'Create';
    $btn_class = 'create-activity';
    $disabled = '';
}

?>
<!DOCTYPE html>
<html>
<title>Activity</title>
<body>
	<h3 class="title"> <?php echo $activity_title; ?> Activity </h3>

	<form class="form-horizontal tab-pane fade in active" id="activity-form"
		role="form" method="post">

		<div id="response"></div>

		<input type="hidden" name="hidden-activityid" id="hidden-activityid" value="<?php echo $activityModel->act_id; ?>" /> 
		<input type="hidden" name="hidden-activityname" id="hidden-activityname" value="<?php echo $activityModel->activity; ?>" /> 
		<input type="hidden" name="returnpath" id="returnpath" value="<?php echo $_SESSION['user_return_url']; ?>" /> 
		<input type="hidden" name="form-type" id="form-type" value="<?php echo $form; ?>" />


		<div class="panel panel-default">
			<div class="panel-body">
				<fieldset>
					<legend>Activity Details</legend>

					<div class="form-group">
						<label class="col-sm-2 control-label required" for="product">Activity</label>
						<div class="col-sm-4">
							<input type="text" name="activity-name"
								style="text-transform: uppercase;" placeholder="Activity"
								id="activity-name"
								value="<?php echo $activityModel->activity; ?>"
								class="form-control filter-input-fld" maxlength="5"
								autocomplete="on" <?php echo $disabled; ?>/>

						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label " for="product">Planning</label>
						<div class="col-sm-4">

							<input type="checkbox" value="1" name="activity_planning" title="Planning"
								id="is_live"
								<?php echo ($activityModel->planning== 1) ? 'checked' : ''; ?> />
						</div>
					</div>
					<!-- <div class="form-group">
						<label class="col-sm-2 control-label " for="product">Moving</label>
						<div class="col-sm-4">

							<input type="checkbox" value="1" name="activity_moving" title="Moving"
								id="is_live"
								<?php // echo ($activityModel->moving== 1) ? 'checked' : ''; ?> />
						</div>
					</div> -->
					<div class="form-group">
						<label class="col-sm-2 control-label " for="product">Quotations</label>
						<div class="col-sm-4">

							<input type="checkbox" value="1" name="activity_quotation" title="Quotations"
								id="is_live"
								<?php echo ($activityModel->quote== 1) ? 'checked' : ''; ?> />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label " for="product">Reason</label>
						<div class="col-sm-4">
							<input type="checkbox" value="1" name="activity_reason" title="Reason"
								id="is_live"
								<?php echo ($activityModel->act_reason== 1) ? 'checked' : ''; ?> />
						</div>
					</div>

					<div class="form-group">
						<label class="col-sm-2 control-label " for="product">Cost Page</label>
						<div class="col-sm-4">
							<input type="checkbox" value="1" name="activity_costpage" title="Cost Page"
								id="is_live"
								<?php echo ($activityModel->act_cost_page== 1) ? 'checked' : ''; ?> />
						</div>
					</div>

					<div class="form-group">
						<label class="col-sm-2 control-label required" for="product">Description</label>
						<div class="col-sm-4">

							<input type="text" name="activity_description"
								placeholder="Description" id="activity_description"
								value="<?php echo $activityModel->act_desc; ?>"
								class="form-control filter-input-fld" maxlength="20"
								autocomplete="on" />


						</div>
					</div>
					<div class="form-group changepass">
						<label class="col-sm-2 control-label " for="product">Nominal code</label>
						<div class="col-sm-4">


							<input type="text" name="activity_nominal"
								placeholder="Nominal code" id="activity_nominal"
								value="<?php echo $activityModel->act_nominal; ?>"
								class="form-control filter-input-fld" maxlength="10"
								autocomplete="on" />

						</div>
					</div>
					<div class="form-group changepass">
						<label class="col-sm-2 control-label" for="product">Rechargeable
							Activity</label>
						<div class="col-sm-4">
							<input type="checkbox" value="1" name="activity_recharge" title="Rechargeable Activity"
								id="activity_recharge" <?php if($form == 'add'){?> checked
								<?php }else{} ?>
								<?php echo ($activityModel->act_rechargeable== 1) ? 'checked' : ''; ?> />
						</div>
					</div>
					<div class="form-group changepass">
						<label class="col-sm-2 control-label" for="product">Operational
							Review Activity</label>
						<div class="col-sm-4">
							<input type="checkbox" value="1" name="activity_review" title="Operational Review Activity"
								id="activity_review"
								<?php echo ($activityModel->act_operational_review== 1) ? 'checked' : ''; ?> />

						</div>
					</div>
					<div class="form-group changepass">
						<label class="col-sm-2 control-label" for="non-job">Slush</label>
						<div class="col-sm-4">
							<input type="checkbox" value="1" name="act_slush_val" title="Slush"
								id="act_slush_val"
								<?php echo ($activityModel->act_slush== 1) ? 'checked' : ''; ?> />
						</div>
					</div>
					<div class="form-group changepass">
						<label class="col-sm-2 control-label" for="tracking-point">Tracking Point</label>
						<div class="col-sm-4">
							<select name="tracking_point" id="tracking-point" class="form-control filter chosen">
		                		<option value="0" <?php echo $activityModel->tracking_point == '0' ? 'selected' : ''; ?> >From
		                		</option>
		                		<option value="1"<?php echo $activityModel->tracking_point == '1' ? 'selected' : ''; ?> >To
		                		</option>
		                		<option value="2"<?php echo $activityModel->tracking_point == '2' ? 'selected' : ''; ?> >Both
		                		</option>
	             			</select>
						</div>
					</div>
					<div class="form-group changepass">
						<label class="col-sm-2 control-label" for="last_activity">Last Activity</label>
						<div class="col-sm-4">
							<select name="last_activity" id="last_activity" class="form-control filter chosen">
		                		<option value="0" <?php echo $activityModel->last_activity == '0' ? 'selected' : ''; ?> >None
		                		</option>
		                		<option value="1"<?php echo $activityModel->last_activity == '1' ? 'selected' : ''; ?> >Allowed
		                		</option>
		                		<option value="2"<?php echo $activityModel->last_activity == '2' ? 'selected' : ''; ?> >Ignored
		                		</option>
	             			</select>
						</div>
					</div>
				</fieldset>
			</div>
			<!-- panel-body -->
		</div>
		<!-- panel -->

		<div class="form-group form-buttons">
			<button <?php if($form == 'add'){?>title="Create"<?php }else { ?>title="Update"<?php } ?> class="btn btn-success <?php echo $btn_class; ?>"
				data-path="<?php echo $path; ?>">
				<span class="glyphicon glyphicon-ok-sign"></span>&nbsp<?php echo $user_btn; ?>
		</button>
			<br /> <br /> <a href="<?php echo $_SESSION['user_return_url']; ?>" title="Go Back"
				class="btn btn-default"> <span
				class="glyphicon glyphicon-circle-arrow-left"></span> Go Back
			</a>
		</div>

	</form>
</body>
</html>