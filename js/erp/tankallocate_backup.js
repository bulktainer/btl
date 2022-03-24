
$('#response').empty().prepend(localStorage.getItem('response')).fadeIn();
localStorage.clear();


$(document).ready (function(){
	
$('#refresh-page').click( function(e){
		e.preventDefault();
		location.reload();
});
 
$('#change-tank').click( function(e){
	e.preventDefault();
	if($('#prev-avlb-change').val() == "" && $('#j_tank_no').val() != "TBC"){
		$('#prev-avlb-change').parent().addClass('highlight')
		return false;
	}
    var form = '#'+$(this).closest('form').attr('id');
    return_url = $(this).closest('form').attr('action');
    $(this).attr('disabled','disabled');
    $(this).html("Next <i style='font-size:18px' class='fa fa-refresh fa-spin'></i> ");
        $.ajax({
            type: 'POST',
            url: appHome+'/tank-allocate/update',
            async: false,
            data: $(form).serialize().replace(/%5B%5D/g, '[]'),
            success: function(response){
                window.location.href = return_url;
                localStorage.setItem('response1', response);
            },
            error: function(response){
                BootstrapDialog.show({title: 'Error', message : 'Unable to change. Please try later.',
                     buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',  
                });
            }
        });
  });

$(".change-jobs-tank").change(function(){
	$('#is_send_mail_expire').val('no');
	$('#change-tank,#btn-save-job-data').removeAttr('disabled');
	var tankNo = $(this).val();
	if(tankNo != "TBC"){
	if($('#page-type').val() == 'tank-allocate-page'){
		var job_weight_req = $('#weight_required').val();
	}else{
		var job_weight_req = ($('#j_weight_reqd').val().trim() != "") ? $('#j_weight_reqd').val() : 0 ;
	}
	var product_tank_capasity_arr = $('#product_tank_capasity').val().split("|");
	var product_tank_capasity = {max: product_tank_capasity_arr[1],
								 min: product_tank_capasity_arr[0] };
	var electric_tank = $(this).find(':selected').data('electric-tank');
    $.ajax({  
        type: "POST", 
        async: false, 
        url: appHome+'/tank-allocate/common_ajax', 
        dataType: "text",
        data: ({
               'action_type'    :'check_tank_ullage',
               'job_weight_req' : job_weight_req,
               'prod_sg'        : $('#prod_sg').val(),
               'tank_capacity'	: $(this).find(':selected').data('capacity'),
               'is_baffeled' 	: $(this).find(':selected').data('baffeled'),
               'is_hazards_prod': $('#is_hazards_prod').val(),
               'tankno' : tankNo,
               'product_tank_capasity' : product_tank_capasity
            }),  
            success: function(result) { 
            	var jsonArr = $.parseJSON(result);
                $('.feedback').html(jsonArr.msg);
                if(jsonArr.not_allowed == true){
                	
                	$('#change-tank,#btn-save-job-data').attr('disabled','disabled');
                }else{
                	$('#change-tank,#btn-save-job-data').removeAttr('disabled');
                }
        		//for electric tank issue
    		    if(electric_tank=='yes'){
	    			BootstrapDialog.confirm('<b>WARNING!</b> This tank is fitted with an electric heating system. Are you sure it is suitable for this Order? ', function(result){
	    				if(!result) {
	    						location.reload();
	    				}
	    			});
		    	}
            }
        });
	}else{
		$('.feedback').html('');
	}
        return false;
});

$(".change-jobs-tank").change(function(){
	if($('#page-type').val() == 'tank-allocate-page'){
		$('#is_send_mail_expire').val('no');
		var tankNo = $(this).val();
		if(tankNo != "TBC"){
			$('.prev-job-span').html('<img src="'+appHome+'/../images/ajax.gif" />');
			setTimeout(function(){
		        $.ajax({  
		            type: "POST", 
		            async: false,
		            url: appHome+'/tank-allocate/common_ajax', 
		            dataType: "text",
		            data: ({
		                'action_type':'check_tank_next_test_due',
		                'job_no' : $('#job_no').val(),
		                'tankno' : tankNo
		            }),  
		            success: function(result)
		                { 
		                    var jsonData = $.parseJSON(result);
		
		                    var msg = '';
		                    if(jsonData.next_perodictest_due != ''){
		                        msg = '<p style="color:red">'+jsonData.next_perodictest_due+' </p>';
		                        	var json = JSON.stringify({		
		                        		next_perodictest_date : jsonData.next_perodictest_date,
		                        		next_perodictest_day  : jsonData.next_perodictest_day,
		                        		tankNo : tankNo,
		                        		job_no : $('#job_no').val()
		                        	  });
		                        $('#is_send_mail_expire').val(json);
		                    }
		                    $('.appendmsg').append(msg);
		                    
		                    if(jsonData.hazards_alert_msg != ''){
		                        var hazards_alert_msg = '<p style="margin-bottom: 0px;" class="alert alert-danger alert-dismissable">'+jsonData.hazards_alert_msg+' </p>';
		                         BootstrapDialog.show({
		                             type: BootstrapDialog.TYPE_DANGER,
		                             title: 'Warning (<strong>'+tankNo+'</strong>)',
		                             message: hazards_alert_msg,
		                             buttons: [{
		                                         label: 'Close',
		                                         action: function(dialogItself){
		                                             dialogItself.close();
		                                         }
		                                     }]
		                         });
		                    }
		                    //jsonData.hazards_alert == 'hazards' - changesd in new request
		                    if(jsonData.hasOwnProperty('override_permision') && jsonData.override_permision != 'yes'){
		                    	$('#change-tank').attr('disabled','disabled');
		                    }
		                    if(jsonData.previous_job_no != ""){
		                    	$('.prev-job-span').html('#'+jsonData.previous_job_no);
		                    	$('#prev-job-no').val(jsonData.previous_job_no);
		                    }else{
		                    	$('.prev-job-span').html('');
		                    	$('#prev-job-no').val('');
		                    }
		                }  
		        	});
			   }, 200);
	        }else{
	        	 $('#j_tank_no').val('TBC');
	             $('.chosen').chosen().trigger("chosen:updated");
	             $('.feedback').text("");
	             $('.prev-job-span').html('');
             	 $('#prev-job-no').val('');
	        }
        return false;
	}
    });
});

/**
 * function for find recent AVLB count
 */
// $(document).on('change', ".change-jobs-tank", function(e) {
$(".change-jobs-tank").change(function(){
	checkPreviousAVLBActivityCount($(this));
});

//Check AVLB activity count
function checkPreviousAVLBActivityCount(currentElement){
	var tankNo = currentElement.val().trim();
	
	if(tankNo != "TBC" && tankNo != ""){
        $.ajax({  
            type: "POST", 
            url: appHome+'/tank-allocate/common_ajax',
            dataType: "html", 
            data: ({
                'action_type':'check_prev_avlb_activity_count',
                'tank_no' : tankNo,
                'job_no' : "",
            }),  
            success: function(result){ 
            	if(result && result != undefined){  
            		var result = JSON.parse(result);
            		if(result.length > 1){ 		
	                    BootstrapDialog.show({
					        type: BootstrapDialog.TYPE_DANGER,
					        closable: false,
					        title: "Warning",
					        message: "More than one AVLB activity found. So the AVLB will not be updated to ETYC/ETYD.",
					        buttons: [{
							            label: 'Cancel',
							            action: function(dialogItself){
							                dialogItself.close();
							                $('#j_tank_no').val('TBC');
								        	$('.chosen').chosen().trigger("chosen:updated");
								        	$('.feedback').text("");
							            }
							        },
							        {		
						            	label: 'Ok',
						            	cssClass: 'btn btn-danger',
						            	action: function(dialogItself){
						            		dialogItself.close();
				                		}  
				        			}
				        	],
				       	})
				    }
				    else{
				    	$('#prev_avlb_planid').val(result[0]);
				    }
			    }
			},
        	error: function(result){ 
        		$('#j_tank_no').val('TBC');
	        	$('.chosen').chosen().trigger("chosen:updated");
	        	$('.feedback').text("");
        	}
    	});
    }
    else{
    	$('#j_tank_no').val('TBC');
        $('.chosen').chosen().trigger("chosen:updated");
        $('.feedback').text("");
    }
    return false;
};
