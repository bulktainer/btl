<h2>Users</h2>

<div id="response"></div>
<div id="feedback"></div>
  <a href='<?php echo HOME."erp.php/user/create"; ?>' class='btn btn-info btn-block'><span class="glyphicon glyphicon-plus-sign"></span> Add New User</a>
  <br>
  
  <div class="form-horizontal">
    <div class="panel panel-default">
      <div class="panel-body">
      	<form method="get" action="">
          <fieldset>
            <legend>Filter Results</legend>
              <?php //sort_filter_serverside_cust('Supplier', 'supplier-filter', $supplier_list, filter_input(INPUT_GET, 'supplier-filter', FILTER_SANITIZE_STRING)); ?>  
			  <?php //sort_filter_serverside_cust('From Town', 'from_town-filter', $from_town_list, filter_input(INPUT_GET, 'from_town-filter', FILTER_SANITIZE_STRING)); ?>
			  <?php //sort_filter_serverside_cust('To Town', 'to_town-filter', $to_town_list, filter_input(INPUT_GET, 'to_town-filter', FILTER_SANITIZE_STRING)); ?>
			   <div class="form-group">
		           <label class="col-sm-2 control-label" for="product">Name</label>
		           <div class="col-sm-3">
		             <input type="text" name="fullname-filter" id="fullname-filter" class="form-control filter-input-fld" maxlength="50" value="<?php echo filter_input(INPUT_GET, 'fullname-filter', FILTER_SANITIZE_STRING); ?>" autocomplete="on" />
		           </div>
		      </div> 
			  <div class="form-group">
		           <label class="col-sm-2 control-label" for="product">Email</label>
		           <div class="col-sm-3">
		             <input type="text" name="email-filter" id="email-filter" class="form-control filter-input-fld" maxlength="50" value="<?php echo filter_input(INPUT_GET, 'email-filter', FILTER_SANITIZE_STRING); ?>" autocomplete="on" />
		           </div>
		      </div> 
		      <div class="form-group">
	           <label class="col-sm-2 control-label " for="product">Status</label>
	           <div class="col-sm-3">
	             <select name="user-status" id="user-status" class="form-control filter chosen">
	               <option></option>
		           <option value="active" <?php echo $_GET['user-status'] == 'active' ? 'selected' : ''; ?> >Active</option>
		           <option value="inactive" <?php echo $_GET['user-status'] == 'inactive' ? 'selected' : ''; ?> >Inactive</option>
	             </select>	
	           </div>
		 </div>
            <div class="form-group">
              <label class="col-sm-2 control-label"></label>
              <div class="col-sm-5">
                <button type="submit" class="btn btn-success" ><span class="glyphicon glyphicon-filter"></span> Filter</button>
              </div>
              <div class="col-sm-3 pull-right">
              	<a href="/<?php echo BTL_URL_PREFIX; ?>erp.php/user/index" class="reset btn btn-primary"><span class="glyphicon glyphicon-refresh"></span> Reset Search Filters</a>
              </div>
            </div>
          </fieldset>
        </form>        
      </div>
    </div>
  </div>
 <input type="hidden" name="pagesize" id="pagesize" value="<?php echo $pagination['limit']; ?>" />
<?php if($usersList) { ?>

  <?php pagination($pagination); ?>
    <div style="width: 100%;overflow-x: auto;">
	<table class="table table-condensed table-bordered table-hover">
	  <thead>
	    <tr>
	      <th class="td-with-border center-cell">Full Name</th>
	      <th class="td-with-border center-cell">Company</th>
	      <th class="td-with-border center-cell">email</th>
	      <th class="td-with-border center-cell">Telephone</th>
	      <th class="td-with-border center-cell">Access</th>
	      <th class="td-with-border center-cell">Status</th>
	      <th class="td-with-border center-cell">Action</th>
	    </tr>
	  </thead>
	  <tbody>
	    <?php foreach($usersList as $eachList) : 
	    	$trClass = ($eachList->is_active == 1) ? 'success' : 'danger';
	    ?>
	      <tr class="<?php echo $trClass; ?>">
	        <td width="7%">
	        	<?php echo ucfirst($eachList->full_name); ?>
	        </td>
	        <td width="7%">
	        	<?php echo ucfirst($eachList->company); ?>
	        </td>
	        <td width="7%">
	        	<?php echo $eachList->email; ?>
	        </td>
	        <td width="7%">
	        	<?php echo $eachList->tel; ?>
	        </td>
	        <td width="7%">
	        	<?php echo $eachList->access_detail; ?>
	        </td>
	        <td width="7%" class="center-cell">
	        	<?php $currentUserDisable = ($_SESSION['MM_Username'] == $eachList->username) ? ' disabled="disabled" ' : ''; ?>
	        	<input type="checkbox" <?php echo $currentUserDisable; ?> <?php echo ($eachList->is_active == 1) ? 'checked' : ''; ?> data-currentstatus="<?php echo ($eachList->is_active == 1) ? 'active' : 'inactive'; ?>" data-username="<?php echo $eachList->username; ?>" class="active_checkbox" />
	        </td>
	        <td width="4%" class="center-cell">
	          <a href="<?php echo path_to("/user/".$eachList->user_id."/edit"); ?>" title="Edit User" class="edit-icon"><span class="glyphicon glyphicon-pencil"></span></a>&nbsp;

	          <?php if($_SESSION['is_admin'] == 1 && $eachList->is_admin == 1){ ?>
	          	<a href="<?php echo path_to("/user/".$eachList->user_id."/reset-password"); ?>" title="Change Password" class="edit-password-icon"><span class="glyphicon glyphicon-user"></span></a>&nbsp;
	          <?php } 
	          else if($eachList->is_admin != 1){ ?>
	          	<a href="<?php echo path_to("/user/".$eachList->user_id."/reset-password"); ?>" title="Change Password" class="edit-password-icon"><span class="glyphicon glyphicon-lock"></span></a>&nbsp;
	          <?php } ?>
	        </td>
	      </tr>
	    <?php endforeach; ?>
	  </tbody>
	</table>
	</div>

	<?php pagination($pagination); ?>

<?php } else { ?>

	<br />
	<div class="alert alert-warning alert-dismissable">
	  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
	  <i class="fa fa-exclamation-circle"></i> <strong>Sorry</strong>, there are no User.
	</div>
<?php } ?>
