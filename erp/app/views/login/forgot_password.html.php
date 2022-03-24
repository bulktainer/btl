<h2>Forgot Password</h2>
<form id="forgot" name="forgot" method="POST" role="form" class="form-horizontal" autocomplete="false">
	<div id="response"></div>
	<div class="panel panel-default">
	    <div class="panel-body">
          	<fieldset>          		
	          	<div class="form-group">
		            <label class="col-sm-2 control-label required" for="email">Email</label>
		            <div class="col-sm-4">
						<input name="email" class="form-control" type="text" id="email" placeholder="Email" autocomplete="off" maxlength="50">
		            </div>
		        </div>
          	</fieldset>
	    </div>
	</div>
	<div class="form-group" style="margin: 15px">
		<button class="btn btn-success forgot_password" title="Submit">
			<span class="glyphicon glyphicon-ok-sign"></span> Submit
		</button>
		<a href="<?php echo HOME.'erp.php/auth/login';?>" class="btn btn-success back_login" title="Login" style="display: none">
			<span class="glyphicon glyphicon-circle-arrow-left"></span>Login
		</a>
	</div>
</form>

