<h2>Reset Password</h2>
<form id="reset" name="reset" method="POST" role="form" class="form-horizontal" autocomplete="false">
	<div id="response"></div>
	<div class="panel panel-default">
	    <div class="panel-body">
          	<fieldset>
          		<legend>Password Details</legend>
		        <div class="form-group">
		            <label class="col-sm-2 control-label required" for="password">New Password
		           	</label>
		            <div class="col-sm-4">
		            	<input name="new_password" class="form-control" type="password" placeholder="new password" id="new_password"  autocomplete="off" maxlength="45">
		            </div>
		        </div>
		        <div class="form-group">
		            <label class="col-sm-2 control-label required" for="password">Confirm New Password
		           	</label>
		            <div class="col-sm-4">
		            	<input name="confirm_password" class="form-control" type="password" placeholder="confirm password" id="confirm_password"  autocomplete="off" maxlength="45">
		            </div>
		        </div>
          	</fieldset>
	    </div>
	</div>
	<div class="form-group" style="margin: 15px">
		<button class="btn btn-success change_password" title="Reset Password">
			<span class="glyphicon glyphicon-ok-sign"></span>Reset Password
		</button>
			
		<a href="<?php echo HOME.'erp.php/auth/login';?>" class="btn btn-default" title="Go Back">
			<span class="glyphicon glyphicon-circle-arrow-left"></span> Go Back
		</a>
	</div>
	<input type="hidden" id="user_id" name="user_id" value="<?php echo $user_id;?>">
	<input type="hidden" id="type" name="type" value="token">
</form>