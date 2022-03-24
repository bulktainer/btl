<h2>Access Control (Userwise)</h2>

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

    <div class="form-horizontal">
        <div class="panel panel-default">
          <div class="panel-body">
          	<form method="POST" action="">
              <fieldset>
              	  <div class="form-group">
                      <div class="col-sm-6">
                       <?php multicolum_filter_serverside_option_group_disabled_all('Users', 'user_set', $user_list, false); ?> 
                      </div>
                  </div>
                  <div>
                  <div class="form-group">
                      <label class="col-sm-2 control-label " for="product">Modules</label>
                      <div class="col-sm-4">
                        <input type="checkbox" name="module_all" id="module_all"><strong>&nbsp;All</strong><br>
                    </div>
                  </div>			
              </fieldset>
            </form>        
          </div>
        </div>

        <p class="alert alert-info"><strong>Note :</strong> <strong>Restricted Access</strong> users have permission only to the selected modules. But <strong>Full Access</strong> users have permission to all the modules by default.</p>

        <?php if($module_list) { 
          $module_group = array();
          foreach ($module_list as $key => $value) { 
            $menu_name = str_replace(' ', '_', $key);
            $menu_name = str_replace('&', '_', $menu_name); ?>

            <div class="panel panel-default">
              <div class="panel-body">
                <fieldset>
                  <legend id="status_btn" data-toggle="collapse" data-target="#<?php echo $menu_name;?>"class="scroll-up-btn div-plus"><?php echo $key; ?>
                      <a class="pull-right" >
                        <i class="fa fa-plus-circle"></i>
                    </a>
                  </legend>
                  <div id="<?php echo $menu_name;?>" class="check_validation panel-collapse collapse">
                     <?php
                      $class = "col-md-10 col-sm-10 module-sub";
                      foreach ($value as $module_id => $name) {  

                        if(!empty($group_list[$module_id])){
                          if(!in_array($group_list[$module_id], $module_group)){ 
                              $sub_menu = $group_list[$module_id];
                              $sub_menu = str_replace(' ', '_', $sub_menu);
                              $sub_menu = str_replace('&', '_', $sub_menu);
                            ?>
                            <!--<div class="module-section text-right">
                              <hr>
                              <input type="checkbox" data-group="<?php echo $sub_menu; ?>" name="sub_<?php echo $sub_menu; ?>"  class="sub_<?php echo $sub_menu; ?> sub_head"><strong>&nbsp;Check All</strong>
                            </div> -->
                             
                          <?php 
                            $module_group[] = $group_list[$module_id];
                          }
                        }

                        if($name['type'] == "menu"){
                          
                          if($name['level2'] > 0){
                              $class = 'col-sm-offset-2 col-sm-10 module-sub';
                          } elseif($name['level1'] > 0){
                              $class = 'col-sm-offset-1 col-sm-10 module-sub';
                          } else {
                              $class = "col-sm-10 module-sub";
                          }                       

                        } else {

                          if($name['level2'] > 0){
                              $class = 'col-sm-offset-3 col-sm-9 module-sub';
                          } elseif($name['level1'] > 0){
                              $class = 'col-sm-offset-2 col-sm-10 module-sub';
                          } else {
                              $class = "col-sm-offset-1 col-sm-10 module-sub";
                          } 

                        }
                      ?>

                      <div class="<?php echo $class; ?>">
                         <input type="checkbox" name="module_set" data-module="<?php echo $key; ?>" 
                         class ="menu_<?php echo $menu_name; ?> module_set middle_<?php echo $sub_menu;?>" value="<?php echo $module_id;?>"  id="module_<?php echo $module_id; ?>">
                            <strong <?php echo ($name['type'] == "menu") ? 'class="text-primary"' : ''; ?>>
                              &nbsp;<?php echo str_pad($name['moduleId'], 4, '0', STR_PAD_LEFT) . ' | ' . $name['name']; 
                                  if($name['mcomment'] != "") {
                                      echo " (" . $name['mcomment'] . ")";
                                  }
                              ?>
                            </strong>
                      </div>

                    <?php }?>                  
                  </div> <!-- scroll up/down -->
                </fieldset>
              </div> <!-- panel-body -->
            </div>
        <?php } 
        }
        ?>
        <div class="form-group form-buttons">
          <button class="btn btn-success create_user_privilege" title="Create" disabled>
            <span class="glyphicon glyphicon-ok-sign"></span> Update
          </button>
        </div>
    </div>

</div>