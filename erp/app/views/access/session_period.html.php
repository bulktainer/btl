<h2>Session Period</h2>

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
  <form method="POST" id="session_form" name="session_form">
    <div class="form-horizontal">
      <div class="panel panel-default">
        <div class="panel-body">
          <fieldset>
            <div class="form-group">
              <div class="col-sm-6" id="session_period_users">
                <?php multicolum_filter_serverside('Users', 'user_id', $user_list, array($_GET['user_id'])); ?> 
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label " for="session_time">Session Period<br>(in minutes)</label>
              <div class="col-sm-4">
                <input type="text" name="session_period" id="session_period" class="form-control" onkeypress="return NumberValues(this,event);" value="<?php echo $user_data ? $user_data->session_period : '';?>">
              </div>
              <div class="col-sm-5 alert alert-info alert-dismissable" style="padding: 7px 35px 6px 7px;">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                  Average session period of selected users is shown in the textbox
                 </div>
              </div>
              <input type="hidden" id="action_type" name="action_type" value="save_session_period"/>
              <input type="hidden" id="returnpath" name="returnpath" value="<?php echo HOME.'erp.php/access/session-period' ?>"/>
              <input type="hidden" id="edit_user_id" name="edit_user_id" value="<?php echo $_GET['user_id'] ?>"/>
            </div>			
          </fieldset>       
      </div>
    </div>

    <div class="form-group form-buttons">
      <button class="btn btn-success save_session_period" title="Save">
        <span class="glyphicon glyphicon-ok-sign"></span> Save
      </button>
      <a href="/<?php echo BTL_URL_PREFIX; ?>erp.php/access/session-period" class="reset btn btn-primary col-sm-2" title="Reset"><span class="glyphicon glyphicon-refresh"></span> Reset</a>
    </div>
  </form> 
  </div>
</div>
