<?php
if($form == 'edit'){
	$path = '..';
	$user_btn = 'Update';
	$user_title = 'Edit';
	$btn_class = 'edit-user';
}else {
	$path = '../user';
	$user_btn = 'Create';
	$user_title = 'Create';
	$btn_class = 'create-user';
}
$currentUserDisable = ($_SESSION['MM_Username'] == $userModel->username) ? ' disabled="disabled" ' : '';
?>
<style>
.multiselect-container{
    max-height:145px !important;
}
</style>
<h3 class="title"> <?php echo $user_title; ?> User </h3>

<form class="form-horizontal tab-pane fade in active" id="vgm-form" role="form" method="post">

  <div id="response"></div>

  <input type="hidden" name="hidden-username" id="hidden-username" value="<?php echo $userModel->username; ?>" />
  <input type="hidden" name="returnpath" id="returnpath" value="<?php echo $_SESSION['user_return_url']; ?>" />
  <input type="hidden" name="form-type" id="form-type" value="<?php echo $form; ?>" />
   <input type="hidden" name="hidden-user-id" id="hidden-user-id" value="<?php echo $userModel->user_id; ?>" />
  <div class="panel panel-default">
    <div class="panel-body">
      <fieldset>
        <legend>Status</legend>
        <?php $userStatus = $userModel->is_active; ?>
        <div class="radio">
        	<label><input type="radio" style="margin-top: 2px;" <?php echo $currentUserDisable; ?> class="approved-status" <?php echo ($userStatus == 1) ? 'checked' : ''; ?> value="1" name="user-status">&nbsp;Active</label>
       	</div>
       	<div class="radio">
        	<label><input type="radio" style="margin-top: 2px;" <?php echo $currentUserDisable; ?> class="approved-status" <?php echo ($userStatus != 1) ? 'checked' : ''; ?> value="0" name="user-status">&nbsp;Inactive</label>
       	</div>
      </fieldset>
    </div>
  </div>
        
  <div class="panel panel-default">
    <div class="panel-body">
      <fieldset>
        <legend>User Details</legend>

		 <div class="form-group">
	           <label class="col-sm-2 control-label required" for="product">Full Name</label>
	           <div class="col-sm-4">
	             <input type="text" name="user-fullname" placeholder="Full Name" id="user-fullname" value="<?php echo $userModel->full_name; ?>" class="form-control filter-input-fld" maxlength="30"  autocomplete="on" />
	           </div>
		 </div>
		 <div class="form-group">
	           <label class="col-sm-2 control-label " for="product">Company</label>
	           <div class="col-sm-4">
	             <input type="text" name="user-companyname" placeholder="Company" id="user-companyname" value="<?php echo $userModel->company; ?>" class="form-control filter-input-fld" maxlength="30"  autocomplete="on" />
	           </div>
		 </div>
		 <div class="form-group">
	           <label class="col-sm-2 control-label required" for="product">Email</label>
	           <div class="col-sm-4">
	             <input type="text" name="user-email" placeholder="Email" id="user-email" value="<?php echo $userModel->email; ?>" class="form-control filter-input-fld" maxlength="40"  autocomplete="on" />
	           </div>
		 </div>
		 <div class="form-group">
	           <label class="col-sm-2 control-label " for="product">Telephone</label>
	           <div class="col-sm-4">
	             <input type="text" name="user-telephone" placeholder="Telephone" id="user-telephone" value="<?php echo $userModel->tel; ?>" class="form-control filter-input-fld" maxlength="20"  autocomplete="on" />
	           </div>
		 </div>
		 <div class="form-group">
	           <label class="col-sm-2 control-label " for="product">Access Permission</label>
	           <div class="col-sm-4">
	             <select name="user-access" id="user-access" class="form-control filter chosen">
		                <option value="fa" <?php echo $userModel->access == 'fa' ? 'selected' : ''; ?> >Full Access</option>
		                <option value="ra" <?php echo $userModel->access == 'ra' ? 'selected' : ''; ?> >Restricted Access</option>
	             </select>	
	           </div>
		 </div>
		 <?php 
		 $destination_array = explode(',', $userModel->u_cust_code);
		// print_r( $destination_array);
		 ?>
		
		<div class="form-group tank-group-div user-custcode">
               <div class="col-md-6 col-sm-6">         
	           <?php multicolum_filter_serverside_tank_customers('Customer', 'user-customercode', $custCode, $destination_array,false); ?>
	         </div> 
		 </div>
		 <?php $disabled = ($form != 'add') ? ' disabled="disabled" ' : ''; ?>
		 <div class="form-group">
	           <label class="col-sm-2 control-label required" for="product">Username</label>
	           <div class="col-sm-4">
	             <input type="text"  <?php echo $disabled; ?> autocomplete="off" onpaste="return false;" name="user-username" placeholder="Username" id="user-username" value="<?php echo $userModel->username; ?>" class="form-control filter-input-fld" maxlength="20"/>
	           </div>
		 </div>
		 <!-- <?php // if($form != 'add'): ?>
		 <hr>
		 <div class="form-group">
	           <label class="col-sm-2 control-label " for="product">Change Password</label>
	           <div class="col-sm-4">
	             <input type="checkbox" id="confirm_change_password" name="confirm_change_password" value="1">
	           </div>
		 </div>
		 <?php // endif;?> -->
		<?php if($form == 'add'): ?>
			<div class="form-group changepass">
			   <label class="col-sm-2 control-label required" for="product">Password</label>
			   <div class="col-sm-4">
			     <input type="password"  <?php echo $disabled; ?> autocomplete="off" onpaste="return false;" name="user-password" placeholder="Password" id="user-password" class="form-control filter-input-fld" maxlength="18" />
			   </div>
			</div>
			<div class="form-group changepass">
			   <label class="col-sm-2 control-label required" for="product">Confirm Password</label>
			   <div class="col-sm-4">
			     <input type="password"  <?php echo $disabled; ?> autocomplete="off" onpaste="return false;" name="user-cpassword" placeholder="Confirm Password" id="user-cpassword" class="form-control filter-input-fld" maxlength="18"/>
			   </div>
			</div>
		<?php endif; ?>
		 <div class="form-group tank-group-div">
            <div class="col-md-6 col-sm-6">
				<?php  multicolum_filter_serverside_tank_customers('Team', 'team-form', $team_list, $teamArr,false); ?> 
	        </div> 
		 </div>
		<?php // if($_SESSION['is_admin'] == 1){ ?>
			<!-- <div class="form-group">
		        <label class="col-sm-2 control-label " for="product">2FA User</label>
		            <div class="col-sm-4">
		             	<input type="checkbox" id="is_double_verification" name="is_double_verification" value="1" <?php // echo $userModel->is_double_verification == 1 ? "checked" : "";?>>
		        </div>
			</div> -->
		<?php //} ?> 
      </fieldset>
    </div> <!-- panel-body -->
  </div> <!-- panel -->
  
  <div class="form-group form-buttons">
		<button class="btn btn-success <?php echo $btn_class; ?>" data-path="<?php echo $path; ?>">
			<span class="glyphicon glyphicon-ok-sign"></span>&nbsp<?php echo $user_btn; ?>
		</button>
			<br/>
			<br/> 
		<a href="<?php echo $_SESSION['user_return_url']; ?>" class="btn btn-default">
			<span class="glyphicon glyphicon-circle-arrow-left"></span> Go Back
		</a>
  </div>
</form>
