<input type="hidden" id="phphServerTimeOut" name="phphServerTimeOut" value="<?php echo ini_get("session.gc_maxlifetime"); ?>" />
<input type="hidden" id="login-username" name="login-username" value="<?php echo $_SESSION['MM_Username']; ?>" />
<div id="header" class="container_12"><img src="<?php echo HOME; ?><?php echo BTL_LOGO; ?>" alt="" <?php echo BTL_LOGO_SIZE; ?> />
  <div class="headerlinks1">
    <p align="right">
	<?php echo $_SESSION['MM_FullName'];
	if ($_SESSION['MM_UserGroup']=="fa") 
	  echo " (Access:Full)";
	else
	  echo " (Access:Restricted)";
	?>
	<a href="<?php echo HOME . "erp.php/auth/logout"; ?>">Log out</a></p>
    <p align="right">Database: 
	<?php  
	if(BTL_ENV == 'production' || BTL_ENV == 'usa-production')
		echo " Production";
	elseif(BTL_ENV == 'staging')
	  echo " Staging";
	else
	  echo " Test";
	?>
    </p>
  </div>
</div>

<?php
if(!isset($_SESSION['menu_html'])){
  $_SESSION['menu_html'] = getMenuList($Bulktest);
  echo $_SESSION['menu_html'];
}
else{
  echo $_SESSION['menu_html'];
}
?>