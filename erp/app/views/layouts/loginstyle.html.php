<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<link rel="shortcut icon" href="<?php echo HOME; ?>images/favicon.ico">
<!-- TemplateBeginEditable name="doctitle" -->
<title>Bulktainer Logistics ERP System</title>
<meta name="description" content="" />
<meta name="keywords" content="" />
<!-- TemplateEndEditable -->
<link href="<?php echo HOME .BTL_STYLE_CSS; ?>" rel="stylesheet" type="text/css" />
<link href="<?php echo HOME; ?>css/erp/bootstrap.min.css" rel="stylesheet" />
<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet" />
<style>
  .highlight input, .highlight select, .highlight textarea, .highlight .input-group-addon, .highlight .chosen-container-single .chosen-single {
    border: 1px solid #ff0000;
  }

  .highlight .input-group-addon {
    border-left: none;
    background: #F2DEDE;
  }

  .highlight .input-group-addon:first-child {
    border-left: 1px solid #ff0000;
    border-right: none;
  }

  li {
    margin-left: 32px;
    list-style-type:disc;
  }
</style>
<?php echo $GLOBALS["_css_scripts"]; ?>
<script type="text/javascript" src="<?php echo HOME; ?>js/jquery.min.js"></script>
<script type="text/javascript" src="<?php echo HOME; ?>js/hoverIntent.js"></script>
<script type="text/javascript" src="<?php echo HOME; ?>js/superfish.js"></script>
<script type="text/javascript" src="<?php echo HOME; ?>js/supersubs.js"></script>
<script src="<?php echo HOME; ?>js/erp/vendor/bootstrap.min.js"></script>
<?php echo $GLOBALS["_js_scripts"]; ?>
<script type="text/javascript"> 
    var appHome = '<?php echo HOME; ?>erp.php';
    var btl_email_regex = /^\w+([\.\+-]?\w+)+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,15}|[0-9]{1,3})(\]?)$/;
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
<div id="header" class="container_12"><img src="<?php echo HOME.BTL_LOGO; ?>" alt="" <?php echo BTL_LOGO_SIZE; ?> /> 
</div>
<div id="nav" class="container_12 rounded">
</div>
<div id="content" class="container_12 rounded">  
<div class="grid_12"><!-- TemplateBeginEditable name="EditRegion" -->
    <?php if(!empty($errors)) : ?>
            <div class="alert alert-danger alert-dismissable">
              <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
              <i class="fa fa-exclamation-triangle"></i>
              <?php echo $errors; ?>
            </div>
        <?php endif; ?> 

        <?= content(); ?>
<!-- TemplateEndEditable -->
</div>
  <div class="clear"></div>
</div>
<div id="footer" class="container_12 topborder">
  <div class="grid_6"><?php echo BTL_COPY_RIGHT; ?></div>
  <div class="grid_6" style="text-align:right;"><?php echo BTL_ABOUT_CONTACT_LNK; ?></div>
</div>
</body>
</html>