<?php
if($form == 'edit'){
	$path = HOME . 'erp.php/access/'. $module_id .'/module-edit';
	$user_btn = 'Update';
	$user_title = 'Edit';
	$btn_class = 'edit-module';
	$disabled = 'disabled';
}else {
	$path = HOME . 'erp.php/access/module-create';
	$user_btn = 'Create';
	$user_title = 'Create';
	$btn_class = 'create-module';
	$disabled = '';
}

?>
<h3 class="title"> <?php echo $user_title; ?> Module </h3>

<form class="form-horizontal tab-pane fade in active" id="access-control-form" role="form" method="post">

  <div id="response"></div>

<div class="overlay-complete-loader">
     <div class="btl_relative" style="display: none;">
        <div class="btl_loaderfix">
          <div class="btl_loadrow"><img src="<?php echo HOME; ?>images/ajax-loader.gif"/></div>
        </div>
        <div class="btl_overlay"></div>
     </div> 

	  <input type="hidden" name="form-type" id="form-type" value="<?php echo $form; ?>" />
	  <input type="hidden" name="group_id" id="group_id" value="" />
	  <input type="hidden" name="module_id_ref" id="module_id_ref" value="" />
	  <input type="hidden" name="url_required" id="url_required" value="NO" />
	  <input type="hidden" name="type_required" id="type_required" value="<?php echo ($form == 'add') ? 'menu' : $moduleModel->type; ?>" />

	  <input type="hidden" name="max-menu_level_0" id="max-menu_level_0" value="<?php echo $menu_level_0; ?>" />

	  <input type="hidden" name="returnpath" id="returnpath" value="<?php echo $_SESSION['user_return_url']; ?>" />
	 
	  <div class="panel panel-default">
	    <div class="panel-body">
	      <fieldset>
	        <legend>Status</legend>
	        <?php $userStatus = $moduleModel->is_active; ?>
	        <div class="radio">
	        	<label><input type="radio" style="margin-top: 2px;" class="approved-status" <?php echo ($moduleModel->is_active == 1) ? 'checked' : ''; ?> value="1" name="module-status">&nbsp;Active</label>
	       	</div>
	       	<div class="radio">
	        	<label><input type="radio" style="margin-top: 2px;" class="approved-status" <?php echo ($moduleModel->is_active != 1) ? 'checked' : ''; ?> value="0" name="module-status">&nbsp;Inactive</label>
	       	</div>
	      </fieldset>
	    </div>
	  </div>
	        
	  <div class="panel panel-default">
	    <div class="panel-body">
	      <fieldset>
	        <legend>Menu/Function Details</legend>

			 <div class="form-group">
		           <div class="col-sm-6">
		             	<?php 
		             		multicolum_filter_serverside_option_group_disabled_all('Module', 'access_module_id', $module_list, false, array("required"=>true,"default-option"=>"New module", "disabled" => $disabled), array($moduleModel->module_id)); 
		             	?> 
		           </div>
			 </div>
			 <div class="form-group">
		           <label class="col-sm-2 control-label " for="access-control">Type</label>
		           <div class="col-sm-4">
		           	<select class="chosen form-control" name="module-type" id="module-type" <?php echo $disabled; ?>>
		           		<?php echo options_from_collection_for_select($module_type, 'value', 'text', $moduleModel->type); ?>
		           	</select>
		           </div>
			 </div>
			 <div class="form-group">
		           <label class="col-sm-2 control-label" for="access-control">Access Code</label>
		           <div class="col-sm-4">
		             <input type="text" name="access_code" placeholder="Access Code" id="access_code" value="<?php echo $moduleModel->access_code; ?>" class="form-control filter-input-fld" maxlength="10"  autocomplete="on" <?php echo ($form == 'edit') ? $disabled : ''; ?> />
		           </div>
			 </div>
			 <div class="form-group">
		           <label class="col-sm-2 control-label required" for="access-control">Menu Title</label>
		           <div class="col-sm-4">
		             <input type="text" name="description" placeholder="Menu title/description" id="description" value="<?php echo $moduleModel->description; ?>" class="form-control filter-input-fld" maxlength="45"  autocomplete="on" />
		           </div>
			 </div>
			 <div class="form-group">
		           <label class="col-sm-2 control-label" for="access-control">URL</label>
		           <div class="col-sm-4">
		             <input type="text" name="module-url" placeholder="URL" id="module-url" value="<?php echo $moduleModel->url; ?>" class="form-control filter-input-fld" maxlength="100"  autocomplete="on" />
		           </div>
			 </div>

			<?php if($form == 'edit') : ?> 
			<div class="form-group">
		           <label class="col-sm-2 control-label required" for="access-control">Main menu order</label>
		           <div class="col-sm-4">
		             <input type="text" name="module-menu_level_0" placeholder="Order of Main Menu" id="module-menu_level_0" value="<?php echo ($form == 'add') ? $menu_level_0 : $moduleModel->menu_level_0; ?>" class="form-control filter-input-fld" maxlength="3"  autocomplete="off" onkeypress="return NumberValues(this,event);" <?php echo $disabled; ?>/>
		           </div>
			 </div>

			 <div class="form-group">
		           <label class="col-sm-2 control-label required" for="access-control">Sub menu order 1</label>
		           <div class="col-sm-4">
		             <input type="text" name="module-menu_level_1" placeholder="Order of Sub Menu" id="module-menu_level_1" value="<?php echo ($form == 'add') ? 0 : $moduleModel->menu_level_1; ?>" class="form-control filter-input-fld" maxlength="3"  autocomplete="off" onkeypress="return NumberValues(this,event);"/>
		           </div>
			 </div>

			 <div class="form-group">
		           <label class="col-sm-2 control-label required" for="access-control">Sub menu order 2</label>
		           <div class="col-sm-4">
		             <input type="text" name="module-menu_level_2" placeholder="Order of sub menu of sub menu" id="module-menu_level_2" value="<?php echo ($form == 'add') ? 0 : $moduleModel->menu_level_2; ?>" class="form-control filter-input-fld" maxlength="3"  autocomplete="off" onkeypress="return NumberValues(this,event);"/>
		           </div>
			 </div>

			 <div class="form-group">
		           <label class="col-sm-2 control-label required" for="access-control">Function order</label>
		           <div class="col-sm-4">
		             <input type="text" name="function-order" placeholder="Order of Function" id="function-order" value="<?php echo ($form == 'add') ? 0 : $moduleModel->function_order; ?>" class="form-control filter-input-fld" maxlength="3"  autocomplete="off" onkeypress="return NumberValues(this,event);"/>
		           </div>
			 </div>

			 <?php else : ?>
			 	<input type="hidden" name="module-menu_level_0" id="module-menu_level_0" value="<?php echo $menu_level_0; ?>" />
				<input type="hidden" name="module-menu_level_1" id="module-menu_level_1" value="0" />
				<input type="hidden" name="module-menu_level_2" id="module-menu_level_2" value="0" />
				<input type="hidden" name="function-order" id="function-order" value="0" />
			 <?php endif; ?> 

			 <div class="form-group">
		           <label class="col-sm-2 control-label" for="access-control">Comments</label>
		           <div class="col-sm-4">
		             <input type="text" name="module-comments" placeholder="Comments" id="module-comments" value="<?php echo $moduleModel->comments; ?>" class="form-control filter-input-fld" maxlength="50"  autocomplete="on" />
		           </div>
			 </div>
			 <div class="form-group">
		           <label class="col-sm-2 control-label " for="access-control">Show Type</label>
		           <div class="col-sm-4">
		           	<select class="chosen form-control" name="show_type" id="show_type">
		           		<?php echo options_from_collection_for_select($show_type, 'value', 'text', $moduleModel->show_type); ?>
		           	</select>
		           </div>
			 </div>

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

</div>