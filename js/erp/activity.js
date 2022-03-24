$(document).ready(function(){
	
var ExistSuccess = 'Ok';
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var oldalert = alert_required;
	
	//Radio button function to always check any one in recharge and review
	$('#activity_recharge,#activity_review').change(function () {
		var act_rechargeable = $('#activity_recharge').prop('checked');
		var act_operational_review = $('#activity_review').prop('checked');
		var checkbox_id = ($(this).attr('id') == 'activity_recharge') ? 'activity_review' : 'activity_recharge';
		if(act_rechargeable == false && act_operational_review == false){
			$('#'+checkbox_id).attr('checked',true);
		}
	});
	

//To view the details of selected items in popup
$('.view_activity').click(function(e) {
	$('.view_small_loader').show();
	$('.reset_values').html('');
	var act_id = $(this).data('id');
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: appHome+'/activity/common_ajax',
		data: {
			'act_id' : act_id,
			'action_type' : 'get_activity_detail'
			  },
		success: function(response){
			$('.view_small_loader').hide();
			if(response != ""){
				$('#modal_act_activity').html(response.act_activity);
				$('#modal_act_planning').html(response.act_planning);
				// $('#modal_act_moving').html(response.act_moving);
				$('#modal_act_quote').html(response.act_quote);
				$('#modal_act_costpage').html(response.act_costpage);
				$('#modal_act_reason').html(response.act_reason);
				$('#modal_act_rechargeable').html(response.act_reachargeable);
				$('#modal_act_review').html(response.act_operationalreview);
				$('#modal_act_description').html(response.act_description);
				$('#modal_act_nominal').html(response.act_nominal);
				$('#modal_act_tracking').html(response.tracking_point);
				
			}
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});
});


//To delete the corresponding field
$('.delete-activity-btn').on('click', function(e) {
      e.preventDefault();
      var id = $(this).attr('data-act-id'),
          path = $(this).attr('data-path');

      BootstrapDialog.confirm('Are you sure you want to delete this Activity?', function(result){
        if(result) {
          $.ajax({
            type: 'POST',
            url: path+'/'+id+'/delete',
            data: $('form').serialize(),
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

//To create and edit the activity
$('.create-activity,.edit-activity').click(function(e){
	$('.highlight').removeClass('highlight');
	  e.preventDefault();
	  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
     
      path = $(this).attr('data-path');
	  function highlight(field, empty_value){
		    if(field.length > 0){
		      if(field.val().trim() === empty_value){
		        $(field).parent().addClass('highlight');
		        success.push(false);
		      } else {
		        $(field).parent().removeClass('highlight');
		        success.push(true);
		      }
		    }
		  }
	  
	  //Function to check whether the user name exist
	  function isActivityNameExists(user,button) {
			ExistSuccess = [];
			if(button.hasClass('edit-activity')){
		  		var type = "update";
		  	}
		  	if(button.hasClass('create-activity')){
		  		var type = "create";
		  	}
			var activityname = $('#activity-name').val();
			
			if(type == "create"){
				  $.ajax({
				        type: 'POST', 
				        url: appHome+'/activity/common_ajax',  
				        async : false,
				        data: {
							'activityname' : activityname,
							'type'	   : type,
							'action_type' : 'activitynameexist'
						},
				        success: function(response){
				        	if(response > 0){
				        		ExistSuccess = 'Exist'
				        		$(user).parent().addClass('highlight');
				        	}else{
				        		ExistSuccess = 'Ok'
				        		$(user).parent().removeClass('highlight');
				        	}
				        },
				        error: function(response){
				          $('html, body').animate({ scrollTop: 0 }, 400);
				          $('form').find('#response').empty().prepend(alert_error).fadeIn();
				        }
				  });
			}
		  }

		  if($('#activity-name').val() != '' ){
			isActivityNameExists($(form).find('#activity-name'),$(this)); //function for chech activityname exist or not
		  }
		  
		  //To highlight the required field
		  highlight($(form).find('#activity-name'), '');
		  highlight($(form).find('#activity_description'), '');
		 
		  
		  if($('#form-type').val() == 'add'){
			  highlight($(form).find('#activity-name'), '');
			  highlight($(form).find('#activity_description'), '');
		  }
		  if($('#form-type').val() == 'edit'){
			  highlight($(form).find('#activity-name'), '');
			  highlight($(form).find('#activity_description'), '');
		  }
	 
	  
	  
	var check_fields = (success.indexOf(false) > -1);
	  console.log(success);
	  
	  
	   // To edit the activity
	  
	   if($(this).hasClass('edit-activity')){
		   var activityid = $('#hidden-activityid').val();
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	     	$(this).prop('disabled','disabled');
	       $.ajax({
	         type: 'POST',
	         url: appHome+'/activity/'+activityid+'/update',
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
	   
	//To create the activity
	if($(this).hasClass('create-activity')){
		   console.log(check_fields);
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	       $(this).prop('disabled','disabled');
	       $.ajax({
	         type: 'POST',
	         url: appHome+'/activity/add',
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


});//end of document ready

$(document).on('click', '.activity_change_status', function(e) {
	e.preventDefault();
	var activityId = $(this).attr('data-id');
	var changeTo = $(this).attr('data-activity-change-to');
	var activity = $(this).attr('data-activity');
		
	var message = 'Are you sure, you want to move the activity <strong>'+activity+'</strong> to '+changeTo.charAt(0).toUpperCase() + changeTo.slice(1)+' ?';
	
	if(changeTo == 'live'){
		var mtype = BootstrapDialog.TYPE_SUCCESS;
		var mButton = 'btn-success';
	}else{
		var mtype = BootstrapDialog.TYPE_PRIMARY;
		var mButton = 'btn-primary';
	}

	BootstrapDialog.show({
         type: mtype,
         title: 'Confirmation',
         message: message,
         buttons: [{
		             label: 'Close',
		             action: function(dialogItself){
		                 dialogItself.close();
		             }
		         },{
	             label: 'Ok',
	             cssClass: mButton,
	             action: function(){
	            	 $.ajax({
	     		        type: 'POST',
	     		        url: appHome+'/activity/common_ajax',
	     		        data: {
	     		      	  'activityId' : activityId,
	     		      	  'action_type' : 'change_activity_status',
	     		      	  'changeTo' : changeTo,
	     		      	  'activity' : activity
	     		        },
	     		       beforeSend: function() {
	     		        	$('.bootstrap-dialog-footer-buttons > .'+mButton).html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		     		        $('.bootstrap-dialog-footer-buttons > .'+mButton).attr('disabled','disabled');
	     		        },
	     		        success: function(response){
	     		        	location.reload();
	     		            localStorage.setItem('response', response);
	     		        },
	     		        error: function(response){
	     		          $('html, body').animate({ scrollTop: 0 }, 400);
	     		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	     		        }
	     		  });
	            }
         }]
     });
	
});
//Page size change
$('.custom-page-pagesize').change(function(e){
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('#search-form').submit();
});