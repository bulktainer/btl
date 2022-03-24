<h2>System Modules</h2>

<div id="response"></div>
<div id="feedback"></div>
  <a href='<?php echo HOME."erp.php/access/module-create"; ?>' class='btn btn-info btn-block'><span class="glyphicon glyphicon-plus-sign"></span> Add New Module</a>
  <br>
  
  <div class="form-horizontal">
    <div class="panel panel-default">
      <div class="panel-body">
      	<form method="get" action="">
          <fieldset>
            <legend>Filter Results</legend>
              
			   <div class="form-group">
		           <label class="col-sm-2 control-label" for="product">Module</label>
		           <div class="col-sm-3">
		             <input type="text" name="module-filter" id="module-filter" class="form-control filter-input-fld" maxlength="50" value="<?php echo filter_input(INPUT_GET, 'module-filter', FILTER_SANITIZE_STRING); ?>" autocomplete="on" />
		           </div>
		      </div> 
			  <div class="form-group">
		           <label class="col-sm-2 control-label" for="product">Group</label>
		           <div class="col-sm-3">
		             <input type="text" name="group-filter" id="group-filter" class="form-control filter-input-fld" maxlength="50" value="<?php echo filter_input(INPUT_GET, 'group-filter', FILTER_SANITIZE_STRING); ?>" autocomplete="on" />
		           </div>
		      </div> 
		      <div class="form-group">
		           <label class="col-sm-2 control-label " for="product">Status</label>
		           <div class="col-sm-3">
		             <select name="module-status" id="module-status" class="form-control filter chosen">
			           <option value="active" <?php echo $_GET['module-status'] == 'active' ? 'selected' : ''; ?> >Active</option>
			           <option value="inactive" <?php echo $_GET['module-status'] == 'inactive' ? 'selected' : ''; ?> >Inactive</option>
		             </select>	
		           </div>
			 </div>

	           <div class="form-group">
	              <label class="col-sm-2 control-label"></label>
	              <div class="col-sm-5">
	                <button type="submit" class="btn btn-success" ><span class="glyphicon glyphicon-filter"></span> Filter</button>
	              </div>
	              <div class="col-sm-3 pull-right">
	              	<a href="/<?php echo BTL_URL_PREFIX; ?>erp.php/access/module-index" class="reset btn btn-primary"><span class="glyphicon glyphicon-refresh"></span> Reset Search Filters</a>
	              </div>
	           </div>

          </fieldset>
        </form>        
      </div>
    </div>
  </div>
 <input type="hidden" name="pagesize" id="pagesize" value="<?php echo $pagination['limit']; ?>" />
<?php if($module_data) { ?>

  <?php pagination($pagination); ?>
    <div style="width: 100%;overflow-x: auto;">
	<table class="table table-bordered table-hover thick-table">
	  <thead>
	    <tr>
	      <th class="td-with-border center-cell">Id</th>
	      <th class="td-with-border center-cell">Type</th>
	      <th class="td-with-border center-cell">Module</th>
	      <th class="td-with-border center-cell">Group</th>
	      <th class="td-with-border center-cell">Title</th>
	      <th class="td-with-border center-cell">URL</th>
	      <th class="td-with-border center-cell">Main menu order</th>
	      <th class="td-with-border center-cell">Sub menu order1</th>
	      <th class="td-with-border center-cell">Sub menu order2</th>
	      <th class="td-with-border center-cell">Function order</th>
	      <th class="td-with-border center-cell">Access Code</th>
	      <th class="td-with-border center-cell">Status</th>
	      <th class="td-with-border center-cell"></th>
	    </tr>
	  </thead>
	  <tbody>
	    <?php foreach($module_data as $eachList) : 
	    	$trClass = ($eachList->is_active == 0) ? 'class="danger"' : '';
	    ?>
	      <tr <?php echo $trClass; ?>>
	        <td width="5%">
	        	<?php echo $eachList->module_id; ?>
	        </td>
	        <td width="5%">
	        	<?php echo ucfirst($eachList->type); ?>
	        </td>
	        <td width="10%">
	        	<?php echo ucfirst($eachList->module); ?>
	        </td>
	        <td width="10%">
	        	<?php echo ucfirst($eachList->groupname); ?>
	        </td>
	        <td width="10%">
	        	<?php echo ucfirst($eachList->description); ?>
	        </td>
	        <td width="20%" class="split-word">
	        	<?php echo $eachList->url; ?>
	        </td>

			<td width="5%">
	        	<?php echo $eachList->menu_level_0; ?>
	        </td>
	        <td width="5%">
	        	<?php echo $eachList->menu_level_1; ?>
	        </td>
	        <td width="5%">
	        	<?php echo $eachList->menu_level_2; ?>
	        </td>
	        <td width="5%">
	        	<?php echo $eachList->function_order; ?>
	        </td>
			<td width="10%">
	        	<?php echo ucfirst($eachList->access_code); ?>
	        </td>
	        <td width="4%">
	        	<?php echo ($eachList->is_active == 1) ? "Yes" : "No"; ?>
	        </td>
	        <td width="3%" class="center-cell">
	          <a href="<?php echo path_to("/access/".$eachList->module_id."/module-edit"); ?>" title="Edit VGM Route" class="edit-icon"><span class="glyphicon glyphicon-pencil"></span></a>&nbsp;
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
	  <i class="fa fa-exclamation-circle"></i> <strong>Sorry</strong>, there are no Modules.
	</div>
<?php } ?>