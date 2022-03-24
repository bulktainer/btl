
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
	if($('#is_not_dg_valid').val() == 1 && !$('#not_dg_checkbox').is(":checked")){
		$('#not_dg_checkbox').parent('label').css('color', 'red');
		return false;
	}
    var form = '#'+$(this).closest('form').attr('id');
    var return_url = $('#return_page').val();
    $(this).attr('disabled','disabled');
    $(this).html("Next <i style='font-size:18px' class='fa fa-refresh fa-spin'></i> ");
        $.ajax({
            type: 'POST',
            url: appHome+'/tank-allocate/update',
            //async: false,
            data: $(form).serialize().replace(/%5B%5D/g, '[]'),
            success: function(response){

                window.location.href = return_url;
                localStorage.setItem('response1', response);
            },
            error: function(response){
                BootstrapDialog.show({title: 'Error', message : 'Unable to change. Please try later.',
                     buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',  
                });
                $(this).attr('disabled','disabled');
                $(this).html("Next <i style='font-size:18px' class='fa fa-refresh fa-spin'></i> ");
            }
        });
  });

function linkJobUrl(jobNo){
	var prevJobLink = "";
	if(jobNo != "" && jobNo != 0){
		prevJobLink = '<a href="'+appHome+'/job/'+jobNo+'/detail#plan" target="_blank" >#'+jobNo+'</a>';
	}
	return prevJobLink;
}

function isexpiredWarningMsg(curr){

	var mote_date = curr.find(':selected').data('nextmot');
	var mot_type  = curr.find(':selected').data('nextmottype');
	var tank_no   = curr.val();
	var planDate = $('#first_plan_date').val();
	var returnmsg = "";
	
	var currentMot = new Date(mote_date);
	var planDateObj = new Date(planDate)
	var dateAdded = new Date(planDate);

	if(planDateObj > currentMot){
		if(mot_type == '5Yr'){
			returnmsg = 'expired';
		}else if(mot_type == '2.5Yr' && $('#is_dg_job').val() == 1){
			returnmsg = 'expired';
		}else{
			//show new checkbox and textaerea
			$('.dg_tank_div').removeClass('hidden');
			$('#is_not_dg_valid').val(1);

		}
	}
	if(!isNaN(dateAdded.getTime()) && $('#job_sea_type').val() == 2 && returnmsg == ""){
    	dateAdded.setDate(dateAdded.getDate() + parseInt($('#expire_days').val()));
    	if(dateAdded >= currentMot && planDateObj <= currentMot){
    	
    		diff  = new Date(currentMot - planDateObj),
	    	days  = (diff/1000/60/60/24) + 1;
	    	var displayDate = currentMot.getDate() +'/'+ (currentMot.getMonth() + 1) +'/'+ currentMot.getFullYear();
	    	returnmsg = '<li>Tank <strong>'+tank_no+'</strong> test date '+displayDate+' is within <strong>'+days+'</strong> days, are you happy to allocate the tank?</li>';
		}
	}

    return returnmsg;

}

function expireElementreset(){
	$('.dg_tank_div').addClass('hidden');
	$('#not_dg_textarea,#is_not_dg_valid').val('');
	$('#not_dg_checkbox').attr('checked',false);	
	$('#not_dg_checkbox').parent('label').css('color', 'black');
}

function allCallsSingleAjax(curr){
	var electric_tank = curr.find(':selected').data('electric-tank');
	var tankNo = curr.val().trim();
	var jobNumber = $('#job_no').val().trim();
	$('#is_mail_sent').val(0);
	expireElementreset();
	

	if(tankNo != "TBC" && tankNo != ""){
	$.ajax({  
			type: "POST",  
	        url: appHome+'/tank-allocate/common_ajax', 
	        dataType: "text",
	        beforeSend: function() {
	        	$('.prev-job-span, .avlb_etyc_div').html('');
				$('#prev-job-no').val('');
				$('.prev-job-span').html('<i class="fa fa-spinner fa-spin"></i>');
				$('#change-tank').attr('disabled',true);
			},
			data: ({
				'action_type':'tank_allocation_all',

		        'job_weight_req' : $('#weight_required').val(),
		        'prod_sg' : $('#prod_sg').val(),
		        'tank_capacity' : curr.find(':selected').data('capacity'),
		        'tankno' : tankNo,
		        'is_baffeled' : curr.find(':selected').data('baffeled'),
		        'is_hazards' : $('#is_hazards').val(),
		        'prod_tank_capacity_min' : $('#prod_tank_capacity_min').val(),
		        'prod_tank_capacity_max' : $('#prod_tank_capacity_max').val(),

		        'pljobno' : $('#job_no').val(),
				'plTankNo' : curr.val(),
				'callType' : 'function-call',
				'prev_tank_number' : $('#current-tank-hidden').val(),
				'is_permission' : $('#has_permission_prev_job').val(),

				'job_no' : jobNumber,
                //'tankno' : tankNo

                //'job_no' : jobNumber,
                'tank_no' : tankNo
		      
			}),  
			success: function(result)
				{ 
					var parsedJson = $.parseJSON(result);
					var confirmmsg = "";
					$('.feedback').html(parsedJson.ullage);

					confirmmsg += isTankComplete();
					if(electric_tank=='yes'){
						confirmmsg += "<li>This tank is fitted with an electric heating system. Are you sure it is suitable for this Order? </li>";
					}

					var prevJsonArr = parsedJson.previous_job;
					var prevJobNo = "";
					if(!$.isEmptyObject(prevJsonArr.prev_job) && prevJsonArr.prev_job.value != ""){
						prevJobNo = prevJsonArr.prev_job.value;
					}
					$('.prev-job-span').html(linkJobUrl(prevJobNo));
					$('#prev-job-no').val(prevJobNo);

					var avlbMsg = ""; var etycMsg = ""; var msg = "";var prevAvlbCountry = ""; var prevEtycCountry ="";
					if(!$.isEmptyObject(prevJsonArr.avlb_etyc)){
						avlbMsg = prevJsonArr.avlb_etyc.avlb.prev_msg;
						prevAvlbCountry = prevJsonArr.avlb_etyc.avlb.prev_plan_country;
						if(prevAvlbCountry != "" && prevAvlbCountry != $('#plan_country').val()){
							confirmmsg += "<li>Country Mismatch found with Previous <strong>AVLB</strong>. Are you sure want to continue? </li>";
						}
						etycMsg = prevJsonArr.avlb_etyc.etyc.prev_msg;
						prevEtycCountry = prevJsonArr.avlb_etyc.etyc.prev_plan_country;
						if(prevEtycCountry != "" && prevEtycCountry != $('#plan_country').val()){
							confirmmsg += "<li>Country Mismatch found with Previous <strong>ETYC/ETYD</strong>. Are you sure want to continue? </li>";
						}

					}

					if(avlbMsg != "" || etycMsg != ""){
						msg += '<p class="alert alert-warning">';
						if(avlbMsg != ""){ msg += avlbMsg; }
						if(etycMsg != ""){ msg += etycMsg; }
						msg += '</p>';
					}
					$('.avlb_etyc_div').html(msg);

					
					/*var tankTestJsonArr = parsedJson.tank_test_warning;
					if(tankTestJsonArr && tankTestJsonArr != null){
                    
	                    if((tankTestJsonArr.hazards_alert_msg != '' && tankTestJsonArr.status == 'haz_expire') || (tankTestJsonArr.hazards_alert_msg != '' 
	                    	&& tankTestJsonArr.status == 'non_haz_5yr')){
	                        var hazards_alert_msg = '<p style="margin-bottom: 0px;" class="alert alert-danger alert-dismissable">'+tankTestJsonArr.hazards_alert_msg+' </p>';
	                        BootstrapDialog.show({
	                             type: BootstrapDialog.TYPE_DANGER,
	                             closable: false,
	                             title: 'Warning (<strong>'+tankNo+'</strong>)',
	                             message: hazards_alert_msg,
	                             buttons: [{
	                                         label: 'Close',
	                                         action: function(dialogItself){
	                                             dialogItself.close();
	                                         }
	                                     }]
	                         });
	                         resetallValues();
	                    }else{
	                    	if(tankTestJsonArr.next_perodictest_due != ''){
		                        msg = '<p style="color:red;">'+tankTestJsonArr.hazards_alert_msg+'</p>';
		                        $('.appendmsg').append(msg);
		                    }

		                    if(tankTestJsonArr.is_mail_sent == true){
		                    	$('#is_mail_sent').val(1);
		                    	$('#next_test_date').val(tankTestJsonArr.next_perodictest_due);

		                    }
	                    }
                	}*/
                	var tankLastActivity = parsedJson.tank_last_activity_address;
                	if(tankLastActivity != null && tankLastActivity != ""){
    
	            		if(tankLastActivity.status == 'true'){
	            			if(tankLastActivity.syphon == 1){
	            				confirmmsg += '<li>WARNING! You are attempting to allocate a tank with a top liquid connection <b>and syphon tube </b> which will end in a region outside of Europe. Are you sure you want to do this?</li>';
	            			}
	            			else{
	            				confirmmsg += '<li>WARNING! You are attempting to allocate a tank with a top liquid connection which will end in a region outside of Europe. Are you sure you want to do this?</li>';
	            			}
		                    
					    }
			    	}

                	var isExpired = isexpiredWarningMsg(curr);
                	if(isExpired == "expired" || parsedJson.tank_damage.damage_msg != ""){
                		confirmmsg = ""; //only the expiry message needed
                		if(isExpired == "expired"){
                			confirmmsg += "<strong>Tank test date is expired!!..</strong>"; 
                		}
                		if(parsedJson.tank_damage.damage_msg != ""){
                			confirmmsg += parsedJson.tank_damage.damage_msg;
                		}
                		
                		var buttons = [{		
							            	label: 'Close',
							            	cssClass: 'btn btn-default',
							            	action: function(dialogItself){
							            		dialogItself.close();
							            		resetallValues('TBC');
					                		}  
					        			}];
                	}else{
                		confirmmsg += isExpired;
                		var buttons = [{
								            label: 'Cancel',
								            action: function(dialogItself){
								                dialogItself.close();
								                resetallValues($('#current-tank-hidden').val());
								            }
								        },
								        {		
							            	label: 'Ok',
							            	cssClass: 'btn btn-danger',
							            	action: function(dialogItself){
							            		dialogItself.close();
					                		}  
					        			}];
                	}

			    	if(confirmmsg != ""){
			    		BootstrapDialog.show({
						        type: BootstrapDialog.TYPE_DANGER,
						        closable: false,
						        title: "Warning",
						        message: confirmmsg,
						        buttons: buttons,
					       	})
			    	}

			    	$('#change-tank').attr('disabled',false);
                },
                error : function(result){
                	resetallValues('TBC');
                }
		});	
	}else{
		var confirmmsg = isTankComplete();
		if(confirmmsg != ""){
    		BootstrapDialog.show({
			        type: BootstrapDialog.TYPE_DANGER,
			        closable: false,
			        title: "Warning",
			        message: confirmmsg,
			        buttons: [{
					            label: 'Cancel',
					            action: function(dialogItself){
					                dialogItself.close();
					                $('#j_tank_no').val($('#current-tank-hidden').val()).trigger("chosen:updated");
					            }
					        },
					        {		
				            	label: 'Ok',
				            	cssClass: 'btn btn-danger',
				            	action: function(dialogItself){
				            		dialogItself.close();
				            		resetallValues('TBC');
		                		}  
		        			}],
		       	})
    	}else{
			resetallValues('TBC');
    	}
	}
}

function isTankComplete(){
	var ret = "";
	if($("#current-tank-hidden").val() != "" && $("#current-tank-hidden").val() != "TBC" && $('#plan_complete_act').val() != ""){
			ret = "<li>This job has already been completed <strong>("+$('#plan_complete_act').val()+")</strong>. Are you sure you want to remove tank? </li>";
	}
	return ret;
}

function resetallValues(type){
	$('#j_tank_no').val(type);
    $('.chosen').chosen().trigger("chosen:updated");
    $('.feedback,.avlb_etyc_div').text("");
    $('.prev-job-span').html('');
    $('#prev-job-no').val('');
    $('#change-tank').attr('disabled',false);
    $('#is_mail_sent').val(0);
    expireElementreset();
    findPreviousJob($('#j_tank_no'),'function-call');
}

function checkUllage(curr){
	  	var electric_tank = curr.find(':selected').data('electric-tank');
		$.ajax({  
			type: "POST", 
	        //async: false, 
	        url: appHome+'/tank-allocate/common_ajax', 
	        dataType: "text",
			data: ({
				'action_type':'check_tank_ullage',
		        'job_weight_req' : $('#weight_required').val(),
		        'prod_sg' : $('#prod_sg').val(),
		        'tank_capacity' : curr.find(':selected').data('capacity'),
		        'tankno' : curr.val(),
		        'is_baffeled' : curr.find(':selected').data('baffeled'),
		        'is_hazards' : $('#is_hazards').val(),
		        'prod_tank_capacity_min' : $('#prod_tank_capacity_min').val(),
		        'prod_tank_capacity_max' : $('#prod_tank_capacity_max').val()
		      
			}),  
			success: function(result)
				{ 
					$('.feedback').html(result);
					if(electric_tank=='yes'){
						BootstrapDialog.confirm('<b>WARNING!</b> This tank is fitted with an electric heating system. Are you sure it is suitable for this Order? ', function(result){
							if(!result) {
								location.reload();
							}
						});
					}
				}
		});
	  }

/**
 * function for getting previous job in tak allocastion page
 */
function findPreviousJob(currentElement,callType){
	  var currentVal = currentElement.val().trim();
	  $('.prev-job-span, .avlb_etyc_div').html('');
	  $('#prev-job-no').val('');
		  $.ajax({  
				type: "POST", 
				cache: false, 
				//async: false,
				url: appHome+'/tank-allocate/common_ajax',  
				dataType: "html",
				beforeSend: function() {
					$('.prev-job-span').html('<img src="images/ajax.gif" />');
					$('#change-tank').attr('disabled',true);
			    },
				data: ({
						'action_type':'check_previous_job',
						'pljobno' : $('#job_no').val(),
						'plTankNo' : currentVal,
						'callType' : callType,
						'prev_tank_number' : $('#current-tank-hidden').val(),
						'is_permission' : $('#has_permission_prev_job').val(),
						
				}),  
				success: function(result){
					$('#change-tank').attr('disabled',false);
					var parsedJson = $.parseJSON(result);
					
					var prevJobNo = "";
					if(!$.isEmptyObject(parsedJson.prev_job) && parsedJson.prev_job.value != ""){
						var prevJobNo = parsedJson.prev_job.value;
					}
					$('.prev-job-span').html(linkJobUrl(prevJobNo));
					$('#prev-job-no').val(prevJobNo);
					if(callType == 'page-load'){
						$('#prev-allocate-job-no').val(prevJobNo);
					}
					//else{
						if(!$.isEmptyObject(parsedJson.avlb_etyc)){
							var avlbMsg = parsedJson.avlb_etyc.avlb.prev_msg;
							var etycMsg = parsedJson.avlb_etyc.etyc.prev_msg;
						}else{
							var avlbMsg = "";
							var etycMsg = "";
						}
						var msg = "";
						if(avlbMsg != "" || etycMsg != ""){
							msg += '<p class="alert alert-warning">';
							if(avlbMsg != ""){
								msg += avlbMsg;
							}
							if(etycMsg != ""){
								msg += etycMsg;
							}
							msg += '</p>';
						}
						$('.avlb_etyc_div').html(msg);
					//}
				}  
			});
}

//Find tank test date
function findTankExpire(currentElement, callType){

	var tankNo = currentElement.val().trim();
	var jobNumber = $('#job_no').val().trim();
	$('#is_mail_sent').val(0);
	
	if(tankNo != "TBC" && tankNo != ""){
        $.ajax({  
            type: "POST", 
            url: appHome+'/tank-allocate/common_ajax', 
            dataType: "html", 
            data: ({
                'action_type':'check_tank_test_warning',
                'job_no' : jobNumber,
                'tankno' : tankNo
            }),  
            beforeSend: function() {
					$('#change-tank').attr('disabled',true);
			    },
            success: function(result){ 
            	if(result){
                    var jsonData = $.parseJSON(result);
                    var msg = '';
                    
                    if((jsonData.hazards_alert_msg != '' && jsonData.status == 'haz_expire') || (jsonData.hazards_alert_msg != '' 
                    	&& jsonData.status == 'non_haz_5yr')){
                        var hazards_alert_msg = '<p style="margin-bottom: 0px;" class="alert alert-danger alert-dismissable">'+jsonData.hazards_alert_msg+' </p>';
                        BootstrapDialog.show({
                             type: BootstrapDialog.TYPE_DANGER,
                             closable: false,
                             title: 'Warning (<strong>'+tankNo+'</strong>)',
                             message: hazards_alert_msg,
                             buttons: [{
                                         label: 'Close',
                                         action: function(dialogItself){
                                             dialogItself.close();
                                         }
                                     }]
                         });
                         $('#j_tank_no').val($('#current-tank-hidden').val());
				         $('.chosen').chosen().trigger("chosen:updated");
				         $('.feedback').text("");
				         $('.prev-job-span').html('');
				     	 $('#prev-job-no').val('');
				     	 $('#change-tank').attr('disabled',false);
				     	 findPreviousJob($('#j_tank_no'),'function-call');

                    }
                    else{
                    	if(jsonData.next_perodictest_due != ''){
	                        msg = '<p style="color:red;">'+jsonData.hazards_alert_msg+'</p>';
	                        $('.appendmsg').append(msg);
	                    }

	                    if(jsonData.is_mail_sent == true){
	                    	$('#is_mail_sent').val(1);
	                    	$('#next_test_date').val(jsonData.next_perodictest_due);

	                    }
                    }
                }  
        	},
        	error: function(result){ 
        		$('#j_tank_no').val('TBC');
	        	$('.chosen').chosen().trigger("chosen:updated");
	        	$('.feedback,.avlb_etyc_div').text("");
	        	$('.prev-job-span').html('');
	     		$('#prev-job-no').val('');
	     		$('#change-tank').attr('disabled',false);
        	}
    	});
    }
    else{
    	 $('#j_tank_no').val('TBC');
         $('.chosen').chosen().trigger("chosen:updated");
         $('.feedback,.avlb_etyc_div').text("");
         $('.prev-job-span').html('');
     	 $('#prev-job-no').val('');
     	 $('#change-tank').attr('disabled',false);
    }
    return false;
}

//Find tank test date
function checkLastActivityAddress(currentElement){

	var jobNumber = $('#job_no').val().trim();
	var tankNo = currentElement.val().trim();
	if(tankNo != "TBC" && tankNo != ""){
        $.ajax({  
            type: "POST", 
             url: appHome+'/tank-allocate/common_ajax', 
            dataType: "html", 
            data: ({
                'action_type':'check_last_activity_address',
                'job_no' : jobNumber,
                'tank_no' : tankNo
            }),  
            success: function(result){ 
            	if(result){
            		var jsonData = $.parseJSON(result);
            		if(jsonData.status == 'true'){
            			if(jsonData.syphon == 1){
            				msg = 'WARNING! You are attempting to allocate a tank with a top liquid connection <b>and syphon tube </b> which will end in a region outside of Europe. Are you sure you want to do this?';
            			}
            			else{
            				msg = 'WARNING! You are attempting to allocate a tank with a top liquid connection which will end in a region outside of Europe. Are you sure you want to do this?';
            			}
	                    BootstrapDialog.show({
					        type: BootstrapDialog.TYPE_DANGER,
					        closable: false,
					        title: "Warning",
					        message: msg,
					        buttons: [{
							            label: 'Cancel',
							            action: function(dialogItself){
							                dialogItself.close();
							                $('#j_tank_no').val($('#current-tank-hidden').val());
								        	$('.chosen').chosen().trigger("chosen:updated");
								        	$('.feedback').text("");
								        	$('.prev-job-span').html('');
								     		$('#prev-job-no').val('');
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
			    }
			},
        	error: function(result){ 
        		$('#j_tank_no').val('TBC');
	        	$('.chosen').chosen().trigger("chosen:updated");
	        	$('.feedback').text("");
	        	$('.prev-job-span').html('');
	     		$('#prev-job-no').val('');
        	}
    	});
    }
    else{
    	 $('#j_tank_no').val('TBC');
         $('.chosen').chosen().trigger("chosen:updated");
         $('.feedback').text("");
         $('.prev-job-span').html('');
     	 $('#prev-job-no').val('');
    }
    return false;
}

// Calculate the previous job DM-02-Jul-2018
$(".change-jobs-tank").change(function(){
	 allCallsSingleAjax($(this));
	 // checkUllage($(this));
	 //findPreviousJob($(this),'function-call');
	 //findTankExpire($(this),'function-call');
	 // checkLastActivityAddress($(this));
	  return false;
});

$("#prev-avlb-change").change(function(){
	  
	  	if($(this).val() == ""){
		  $(this).css('border','1px solid red');
	  	}else{
		  $(this).css('border','1px solid rgb(149, 149, 149)');
	  	}
});

if($('#cargo_restriction').val() == 1){
	BootstrapDialog.show({
		type: BootstrapDialog.TYPE_DANGER,
		closable: false,
		title: "WARNING!",
		message: "PRIOR CARGO RESTRICTIONS: Has prior cargo approval been received for this order?",
		buttons: [{		
					label: 'Ok',
					cssClass: 'btn btn-danger',
					action: function(dialogItself){
						dialogItself.close();
					}  
				}
		],
	   });
}

});

