<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="shortcut icon" href="<?php echo HOME; ?>images/favicon.ico">

    <title>Bulktainer Logistics ERP</title>
	
    <link href="<?php echo HOME; ?>css/jquery-ui-1.10.4.ui.min.css" rel="stylesheet" />
    <link href="<?php echo HOME; ?>css/erp/bootstrap.min.css" rel="stylesheet" />
    <link href="<?php echo HOME; ?>css/erp/bootstrap-dialog.css" rel="stylesheet" />
    <link href="<?php echo HOME; ?>css/erp/chosen.min.css" rel="stylesheet" />
    <link href="<?php echo HOME . BTL_BASE_CSS; ?>" rel="stylesheet" />
    
    <?php echo $GLOBALS["_css_scripts"]; ?>
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet" />

    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>
  	<?php require_once('include/menu.php'); ?>
    <div id="content" class="container_12 container rounded <?php echo $class == 'size-90percent' ? 'custom-container' : ''; ?>">
      <div class="grid_12">
        <?php if(!empty($errors)) : ?>
          <?php foreach($errors as $error) : ?>
            <div class="alert alert-danger">
              <?php echo $error; ?>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>

        <?php if(!empty($message)) : ?>
          <div class="alert alert-success">
            <?php echo $message; ?>
          </div>
        <?php endif; ?>

        <?= content(); ?>
      </div> <!-- grid_12 -->

      <div class="clear"></div>
    </div>

    <div id="footer" class="container_12 topborder">
      <div class="grid_6"><?php echo BTL_COPY_RIGHT; ?></div>
      <div class="grid_6" style="text-align:right;">
        <?php echo BTL_ABOUT_CONTACT_LNK; ?>
      </div>
    </div> <!-- footer -->

    <!-- BTL general scripts -->
    <script src="<?php echo HOME; ?>js/jquery.min.js"></script>
    <script src="<?php echo HOME; ?>js/hoverIntent.js"></script>
    <script src="<?php echo HOME; ?>js/supersubs.js"></script>
    <script src="<?php echo HOME; ?>js/superfish.js"></script>

    <script>
      var appHome = '<?php echo HOME; ?>erp.php';

      $(function() {
        $("ul.sf-menu").supersubs({
          minWidth: 12,
          maxWidth: 27,
          extraWidth: 1
        }).superfish();
      });

      var currency_having_symbols = ["<?php echo str_replace('_','","', BTL_CURRENCY_WITH_SYMBOL); ?>"];
      var btl_default_currency_id = <?php echo BTL_DEF_CURRENCY_ID; ?>;
      var btl_default_date_format = <?php echo '"'.BTL_DEF_DATE_FORMAT.'"'; ?>;
      var btl_default_branch = <?php echo '"'.BRANCH.'"'; ?>;
      var btl_common_func = <?php echo '"'.BTL_ENABLE_COMMON_FUNC.'"'; ?>;
      var btl_email_regex = /^\w+([\.\+-]?\w+)+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,15}|[0-9]{1,3})(\]?)$/
    </script>

    <!-- ERP-specific scripts -->
    <script src="<?php echo HOME; ?>js/erp/vendor/jquery-ui-1.10.4.ui.min.js"></script>
    <script src="<?php echo HOME; ?>js/erp/vendor/bootstrap.min.js"></script>
    <script src="<?php echo HOME; ?>js/erp/vendor/bootstrap-dialog.min.js"></script>
    <script src="<?php echo HOME; ?>js/erp/vendor/chosen.jquery.min.js"></script>

    <?php echo $GLOBALS["_js_scripts"]; ?>
    <script src="<?php echo HOME; ?>js/erp/custom-date.js"></script>
    <script src="<?php echo HOME; ?>js/time-out.js"></script>
    <script src="<?php echo HOME; ?>js/session-manager.js"></script>
  </body>
</html>
