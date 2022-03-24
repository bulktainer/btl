<h2>User Accounts</h2>

<div id="response"></div>
<div id="feedback"></div>
<div class="form-horizontal">
    <div class="panel panel-default">
      	<div class="panel-body">
      		<form method="get" action="" autocomplete="off" id="unlock-form">
          		<fieldset>
            		<legend>Filter Results</legend>
				   	<div class="form-group">
			           <label class="col-sm-2 control-label" for="product">Name</label>
			           <div class="col-sm-4">
			             <input type="text" name="fullname-filter" id="fullname-filter" class="form-control filter-input-fld" maxlength="50" value="<?php echo filter_input(INPUT_GET, 'fullname-filter', FILTER_SANITIZE_STRING); ?>" autocomplete="off" />
			           </div>
			      	</div> 
				  	<div class="form-group">
			           	<label class="col-sm-2 control-label" for="product">Email</label>
			           	<div class="col-sm-4">
			             	<input type="text" name="email-filter" id="email-filter" class="form-control filter-input-fld" maxlength="50" value="<?php echo filter_input(INPUT_GET, 'email-filter', FILTER_SANITIZE_STRING); ?>" autocomplete="off" />
			           	</div>
			      	</div> 
			     	<div class="form-group">
		           		<label class="col-sm-2 control-label " for="product">Status</label>
		           		<div class="col-sm-4">
		             		<select name="user-status" id="user-status" class="form-control filter chosen">
		               			<option></option>
			           			<option value="active" <?php echo $_GET['user-status'] == 'active' ? 'selected' : ''; ?> >Active</option>
			           			<option value="inactive" <?php echo $_GET['user-status'] == 'inactive' ? 'selected' : ''; ?> >Inactive</option>
			           			<option value="locked" <?php echo $_GET['user-status'] == 'locked' ? 'selected' : ''; ?> >Locked</option>
			           			<option value="2fa" <?php echo $_GET['user-status'] == '2fa' ? 'selected' : ''; ?> >2FA User</option>
		             		</select>	
		           		</div>
		 			</div>
            		<div class="form-group">
              			<label class="col-sm-2 control-label"></label>
             			 <div class="col-sm-5">
                			<button type="submit" class="btn btn-success" ><span class="glyphicon glyphicon-filter"></span> Filter</button>
              			</div>
              			<div class="col-sm-3 pull-right">
              				<a href="/<?php echo BTL_URL_PREFIX; ?>erp.php/access/account-unlock" class="reset btn btn-primary" title="Reset Search Filters"><span class="glyphicon glyphicon-refresh"></span> Reset Search Filters</a>
              			</div>
            		</div>
         		</fieldset>
         		<input type="hidden" name="pagesize" id="pagesize" value="<?php echo $pagination['limit']; ?>" />
        	</form>        
     	</div>
    </div>
</div>
<?php if($users_list) { ?>
	<?php pagination($pagination, true); ?>
	    <div style="width: 100%;overflow-x: auto;">
			<table class="table table-condensed table-bordered table-hover">
			  	<thead>
				    <tr>
					    <th class="td-with-border center-cell">Full Name</th>
					    <th class="td-with-border center-cell">Company</th>
					    <th class="td-with-border center-cell">Email</th>
					    <th class="td-with-border center-cell">Status</th>
					    <th class="td-with-border center-cell">2FA User</th>
					    <th class="td-with-border center-cell">Lock Status</th>
					    <th class="td-with-border center-cell">Locked Date</th>
					    <th class="td-with-border center-cell">Session Period <br>(Minutes)</th> 
					    <th class="td-with-border center-cell">Action</th> 
				    </tr>
			  	</thead>
			  	<tbody>
			    	<?php foreach($users_list as $user) : 
				    	$trClass = ($user->is_active == 1) ? 'success' : 'danger'; ?>
				      	<tr class="<?php echo $trClass; ?>">
					        <td width="7%">
					        	<?php echo ucfirst($user->full_name); ?>
					        </td>
					        <td width="7%">
					        	<?php echo ucfirst($user->company); ?>
					        </td>
					        <td width="7%">
					        	<?php echo $user->email; ?>
					        </td>
					        <td width="7%" class="center-cell">
					        	<input type="checkbox" <?php echo ($user->is_active == 1) ? 'checked' : ''; ?> data-currentstatus="<?php echo ($user->is_active == 1) ? 'active' : 'inactive'; ?>" data-username="<?php echo $user->username; ?>" class="active_checkbox" />
					        </td>
					        <td width="7%" class="center-cell">
					        	<input type="checkbox" <?php echo ($user->is_double_verification == 1) ? 'checked' : ''; ?> data-currentstatus="<?php echo ($user->is_double_verification == 1) ? 'active' : 'inactive'; ?>" data-user_id="<?php echo $user->user_id; ?>" class="double_check" />
					        </td>
					        <td width="7%" class="center-cell">
					        	<?php if($user->is_locked == 1){ ?>
					        		<input type="checkbox" checked data-user_id="<?php echo $user->user_id; ?>" class="unlock_check" title="Unlock" />
					        	<?php } else{ ?>
					        		<input type="checkbox" disabled data-user_id="<?php echo $user->user_id; ?>" class="unlock_check" />
					        	<?php } ?>
					        </td>
					        <td width="7%" class="lock_date_<?php echo $user->user_id;?>">
					        	<?php echo $user->locked_date ? date(BTL_DEF_VIEW_DATE, strtotime($user->locked_date)) : ''; ?>
					        </td>
					        <td width="7%">
					        	<?php echo $user->session_period ? $user->session_period : ''; ?>
					        </td>
					         <td width="7%" class="center-cell">
					        	<a href="<?php echo path_to("/access/session-period?user_id=".$user->user_id); ?>" title="Edit Session Period"><span class="glyphicon glyphicon-pencil"></span></a>
					        </td>
				      	</tr>
			    	<?php endforeach; ?>
			  	</tbody>
			</table>
		</div>
	<?php pagination($pagination, true); ?>
<?php } else { ?>
	<br />
	<div class="alert alert-warning alert-dismissable">
	  	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
	  	<i class="fa fa-exclamation-circle"></i> <strong>Sorry</strong>, there are no User.
	</div>
<?php } ?>
