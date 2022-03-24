<h2>Access Control (Modulewise)</h2>

<div id="response"></div>
<div id="feedback"></div>
<br>
 
<div class="overlay-complete-loader">
     <div class="btl_relative" style="display: none;">
        <div class="btl_loaderfix">
          <div class="btl_loadrow"><img src="<?php echo HOME; ?>images/ajax-loader.gif"/></div>
        </div>
        <div class="btl_overlay"></div>
     </div> 

      <p class="alert alert-info"><strong>Note :</strong> <strong>Restricted Access</strong> users have permission only to the selected modules. But <strong>Full Access</strong> users have permission to all the modules by default.</p>

      <div class="form-horizontal">
          <div class="panel panel-default">
            <div class="panel-body">
            	<form id="module-form" method="POST">
                <fieldset>
                	<div class="form-group">
                     <div class="col-md-6 col-sm-6">   
      					       <?php multicolum_filter_serverside_option_group_disabled_all('Module', 'module_id', $module_list); ?> 
      				        </div>
      			      </div>
            			<div class="form-group">
                    <div class="col-md-2 col-sm-2 control-label"> 
                   		<label>Users</label>
                   	</div>
                    <div class="col-md-10 col-sm-10">
                   	<?php if($user_list) { ?>
                      <div class="col-md-12 col-sm-12">
                   		 <input type="checkbox" name="user_list" id="user_all"><strong> &nbsp;All</strong>
                      </div>
                      <br>
                   		<?php
                      $access = "";
                   		foreach ($user_list as $each) {  
                          if($access != $each->access){
                              if($each->access == 'fa'){
                                  echo "<div class='col-md-10 col-sm-10'><br><h4>Full Access Users</h4><br>&nbsp;</div>";
                              } else {
                                  echo "<div class='col-md-10 col-sm-10'><br><h4>Restricted Access Users</h4><br>&nbsp;</div>";
                              }
                          }
                        ?>
                        <div class="col-md-3 col-sm-3">
                   			  <input type="checkbox" name="user_list" class ="user_list <?php echo ($each->access == 'ra') ? 'user-ra' : 'user-fa'; ?>" id="user_<?php echo $each->user_id?>" value="<?php echo $each->user_id?>"> <strong>&nbsp;<?php echo $each->name; ?></strong>
                        </div>
                   		<?php 
                          $access = $each->access;
                        } 	
                   	} ?>
      			        </div>
                    
            			</div>		

                  <div class="form-group form-buttons">
            				<button class="btn btn-success create_privilege" title="Update" disabled>
            					<span class="glyphicon glyphicon-ok-sign"></span> Update
            				</button>
            		  </div>

                </fieldset>
              </form>        
            </div>
          </div>
      </div>

</div>