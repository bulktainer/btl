$(document).ready(function(){
localStorage.clear();
	
var success = [];	
var requiredFields = ['gm_name'];
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';

function validateField(field) {
    if(field.length){
      if(field.val() === ''){
        $(field).parent().addClass('highlight');
        success.push(false);
      } else {
        $(field).parent().removeClass('highlight');
        success.push(true);
      }
    }
}

function highlight(field, empty_value){
    if(field.length > 0){
      if(field.val() === empty_value){
        $(field).parent().addClass('highlight');
      success.push(false);
    } else {
      $(field).parent().removeClass('highlight');
      success.push(true);
    }
  }
}

function highlight_ary(field, empty_value){
	field.each(function(){
		if($(this).length > 0){
	      if($(this).val().trim() === empty_value){
	        $(this).parent().addClass('highlight');
	        success.push(false);
	      } else {
	        $(this).parent().removeClass('highlight');
	        success.push(true);
	      }
	    }	
	})	
}

//To create and edit the activity
$('.create-geofence, .edit-geofence').click(function(e){
	e.preventDefault();
	$('.highlight').removeClass('highlight');
	success = [];
	
	var form = $('#'+$(this).closest('form').attr('id'));
	var path = $("#path").val()

	//Required field validation
    for(var i = 0; i < requiredFields.length; i++) {
      var $field = form.find('[name="'+requiredFields[i]+'"]');
      validateField($field);
    }
	//GeoFence name validation
	highlight_ary($('input[id^=geofence_name]'), '');
	

	var check_fields = (success.indexOf(false) > -1);
	
   // Edit
   if($(this).hasClass('edit-geofence')){
		 var gmid = $('#gm_id').val();
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	       $(this).prop('disabled','disabled');
	       $.ajax({
	         type: 'POST',
	         url: path + '/' + gmid +'/edit',
	         data: $(form).serialize().replace(/%5B%5D/g, '[]'),
	         success: function(response){
	           window.location.href = $('#returnpath').val();
	           localStorage.setItem('response', response);
	         },
	         error: function(response){
	           $('html, body').animate({ scrollTop: 0 }, 400);
	           $('form').find('#response').empty().prepend(alert_error).fadeIn();
	         }
	       });
	     }
   }

   // Create
  if($(this).hasClass('create-geofence')){
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	       $(this).prop('disabled','disabled');
	       $.ajax({
	         type: 'POST',
	         url: path + '/create',
	         data: $(form).serialize().replace(/%5B%5D/g, '[]'),
	         success: function(response){
	           window.location.href = $('#returnpath').val();
	           localStorage.setItem('response', response);
	         },
	         error: function(response){
	           $('html, body').animate({ scrollTop: 0 }, 400);
	           $('form').find('#response').empty().prepend(alert_error).fadeIn();
	         }
	       });
	     }
	}

  });

	//To delete the corresponding field
	$('.delete-geofence').on('click', function(e) {
	  e.preventDefault();
	  var id = $(this).attr('data-geofence-id'),
	      path = $("#path").val();
	
	  BootstrapDialog.confirm('Are you sure you want to delete this GeoFence?', function(result){
	    if(result) {
	      $.ajax({
	        type: 'POST',
	        url: path + '/delete',
	        data: {gm_id : id},
	        success: function(response){
	          window.location.href = path+'/index';
	          localStorage.setItem('response', response);
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	      });
	    }
	  });
	});

});//end of document ready


//Page size change
$('.custom-page-pagesize').change(function(e){
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('#search-form').submit();
});
