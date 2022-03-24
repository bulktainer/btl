<?php require_once('Connections/Bulktest.php'); 
//For not expiring the login
extendSessionValues($Bulktest); ?>
<?php
if (!function_exists("GetSQLValueString")) {
function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") 
{
  if (PHP_VERSION < 6) {
    $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;
  }

  $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);

  switch ($theType) {
    case "text":
      $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;    
    case "long":
    case "int":
      $theValue = ($theValue != "") ? intval($theValue) : "NULL";
      break;
    case "double":
      $theValue = ($theValue != "") ? doubleval($theValue) : "NULL";
      break;
    case "date":
      $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;
    case "defined":
      $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
      break;
  }
  return $theValue;
}
}
session_start();
if (! isset($_SESSION['MM_Username'])){
	header("Location: " . HOME . "erp.php/login");
	exit;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><!-- InstanceBegin template="/Templates/Core.dwt.php" codeOutsideHTMLIsLocked="false" -->
<head>
<LINK REL="SHORTCUT ICON" HREF="./images/favicon.ico">
<!-- InstanceBeginEditable name="doctitle" -->
<title>Bulktainer Logistics ERP Login</title>

<!-- InstanceEndEditable -->
<link href="<?php echo BTL_STYLE_CSS; ?>" rel="stylesheet" type="text/css" />
<link href="css/jquery-ui-1.7.3.custom.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js/jquery.min.js"></script>
<!--<script type="text/javascript" src="../js/jquery-ui.min.js"></script>-->
<script type="text/javascript" src="js/plugins.js"></script>
<script type="text/javascript" src="js/hoverIntent.js"></script>
<script type="text/javascript" src="js/superfish.js"></script>
<script type="text/javascript" src="js/supersubs.js"></script>
<script type="text/javascript" src="js/scripts.js"></script>
<script type="text/javascript"> 
    $(document).ready(function(){ 
        $("ul.sf-menu").supersubs({ 
            minWidth:    12,   // minimum width of sub-menus in em units 
            maxWidth:    27,   // maximum width of sub-menus in em units 
            extraWidth:  1     // extra width can ensure lines don't sometimes turn over 
                               // due to slight rounding differences and font-family 
        }).superfish();  // call supersubs first, then superfish, so that subs are 
                         // not display:none when measuring. Call before initialising 
                         // containing tabs for same reason. 
		
    }); 
</script>
</head>
<body>
<?php require_once('include/menu.php'); ?>
<div id="content" class="container_12 rounded">
  
  <div class="grid_12"><!-- InstanceBeginEditable name="EditRegion" -->
        <?php if (BTL_CUSTOM_WELCOME == "FALSE") : ?>
        <p align="center"><img src="<?php echo BTL_CUSTOM_WELCOME_IMAGE; ?>" <?php echo BTL_CUSTOM_WELCOME_IMAGE_SIZE; ?> /></p>
        <?php else : ?>
        	<!-- PLACE FOR CUSTOM WELCOME PAGE -->
            
            <div class="welcome">Welcome</div>
            
		<?php endif; ?>	
		<!-- InstanceEndEditable --></div>
  
  <div class="clear"></div>
</div>
<div id="footer" class="container_12 topborder">
  <div class="grid_6"><?php echo BTL_COPY_RIGHT; ?></div>
  <div class="grid_6" style="text-align:right;"><?php echo BTL_ABOUT_CONTACT_LNK; ?></div>
</div>
</body>
<!-- InstanceEnd --></html>