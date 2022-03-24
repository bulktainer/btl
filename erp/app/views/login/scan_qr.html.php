<div class="panel panel-default">
	<div class="panel-body">
		<div class="panel-heading">
			<h1 class="panel-title">Scan QR</h1>
		</div>
		<div class="panel-body" style="position:relative;">
			<div class="col-md-7 col-sm-7 col-xs-12">
				<?php if($msg == 'pass-err'){ ?>
						  <div class="alert alert-danger alert-dismissable">
						    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
						    <i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Invalid Passcode.
						  </div>
                <?php } ?>
				<img src="<?=$qr_img_link?>">
				<form action="<?php echo HOME; ?>erp.php/auth/set-qr-scanned-flag" method="post"class="form-horizontal" role="form" style="padding-top: 10px;" id="qr_form">
					<div id="response"></div>
					<input type="hidden" name="user_id" value="<?=$user_id?>">
					<div class="form-group">
						<div class="col-sm-2">
							<label>Passcode</label>
						
							<input type="text" name="code" id="code" class="input-masked" required="required">
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-2">
							<button class="btn btn-sm btn-primary" id="btn_continue" name="btn_continue" type="submit">Continue >> </button>
						</div>
					</div>
				</form>
			</div>
			<div class="col-md-5 col-sm-5 col-xs-12">
				<p>Scan the QR code using the Google authenticator app in order to enable 2 Factor authentication.</p>

				<p>After successfully scanning the given QR code, Enter the passcode shown in the Google authenticator app into the text box given below the QR code. Then click continue.</p>

				<p>This is a one-time process. You will be prompted to enter the passcode from the Google Authenticator app along with your credentials while you login from the next time onwards.</p>

				<p>The QR code was already sent as an Email for future use while enabling 2 Factor Authentication.</p>

				<p>Don't forget to save the QR code sent via Email safely in your device so that can be used to import into your device even if your account gets lost from any cause.</p>
			</div>
		</div>
	</div>
</div>
