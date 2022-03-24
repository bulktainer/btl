<div id="response"></div>
<div class="panel panel-default">
    <div class="panel-body">
      	<form id="login" name="login" method="POST" action="<?php echo $loginFormAction; ?>">
          	<fieldset>
          		<div class="col-md-4"></div>
				<div class="col-md-4">
		          	<div class="form-group">
			            <label class="col-md-4 control-label" for="username">Username</label>
			            <div class="col-md-8">
							<input name="username" class="form-control" type="text" id="username" style="width:100%;" placeholder="username" autocomplete="off" required>
			            </div>
			        </div>
			    
			        <div class="form-group">
			            <label class="col-md-4 control-label" style="margin-top: 4px;" for="password">Password</label>
			            <div class="col-md-8">
			            	<input name="password" class="form-control" type="password" placeholder="password" style="width:100%; margin-top:4px;" id="password"  autocomplete="off" required>
			            </div>
			        </div>
			        <div class="form-group" id="passCodeDiv" style="display: none;">
			        	<label class="col-md-4 control-label" style="margin-top: 4px;" for="code">Passcode
			        	</label>
			        	<div class="col-md-8">
			        		<input name="code" class="form-control input-masked" type="text" placeholder="Pass code" style="width:100%;margin-top:4px;" id="code"  autocomplete="off" >
			        	</div>
		            </div>
			      	<div class="form-group">
			      		<div class="col-md-4"></div>
			            <div class="col-md-8">
			            	<input type="submit" class="btn btn-success" name="Submit" value="Submit" title="Submit" style="margin-top:10px;width:100%;">
			            </div>
			        </div>
			      	<div class="form-group">
			      		<div class="col-md-4"></div>
			            <div class="col-md-8">
			            	<br>
			            	<a href="<?php echo HOME.'erp.php/auth/forgot-password' ?>" class="control-label" title="Forgot Password">Forgot Password</a>
			            </div>
			        </div>
		    	</div>
          	</fieldset>
        </form>  
    </div>
</div>
