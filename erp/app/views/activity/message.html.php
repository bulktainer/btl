<?php if($error_msg){ ?>
  <div class="alert alert-danger alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    <i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> <?php echo $error_msg; ?>
  </div>
<?php } ?>

<?php if($success_msg){ ?>
  <div class="alert alert-success alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    <i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> <?php echo $success_msg; ?>
  </div>
<?php } ?>