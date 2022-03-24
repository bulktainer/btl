
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var alert_success = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-thumbs-o-up"></i>Successfully sent !!!</div>';

$(document).on('click', '#send_message', function(e){
	e.preventDefault();
	sendZoomMessage();
});

function sendZoomMessage(){
	$('.highlight').removeClass('highlight');
	var form = '#send-form',
	  success = [];

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

	highlight($(form).find('#channel'), '');
  highlight($(form).find('#message'), '');
	var check_fields = (success.indexOf(false) > -1);

    if(check_fields === true){
    	$('html, body').animate({ scrollTop: 0 }, 400);
    	$('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {
    	$('#send_message').find('span').addClass("fa fa-spinner fa-spin");
        $('#send_message').attr('disabled','disabled');
        // var appHome = '<?php echo HOME; ?>erp.php'; 
    	var member = $('#member').val();
    	if(member == ''){
    		send_type = 'channel';
    	}
    	else{
    		send_type = 'all';
    	}
    	$.ajax({
    		type: 'POST',
        	url: appHome+'/zoom/common_ajax',
       		data: {
       			'channel' : $('#channel').val(),
       			'message' : $('#message').val(), 
       			'action_type'  : 'send_zoom_client_message',
       			'send_type'    : send_type,
            'member'       : member, 
       		},
        	success: function(response){
          		$('#send_message').find('span').removeClass("fa fa-spinner fa-spin");
          		$('#send_message').removeAttr('disabled');
              $('#message').val('');
              $("#member").prop("selectedIndex", 0).val(); 
              $('.chosen').chosen().trigger("chosen:updated");
          		$('#response').html(alert_success);
        	},
        	error: function(response){
          		$('html, body').animate({ scrollTop: 0 }, 400);
          		$('form').find('#response').empty().prepend(alert_error).fadeIn();
        	}
        });
    }
}