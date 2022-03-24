
//Added DM-31-oct-2017 implement logout alert  in all pages Start--------------------
function isMyScriptLoaded(url) {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
    	var fullEachUrl = scripts[i].src;
    	var lastslashindex = fullEachUrl.lastIndexOf('/');
    	var result= fullEachUrl.substring(lastslashindex  + 1)
        if (result == url) return true;
    }
    return false;
}

var checktimoutUrl = 'time-out.js';
if(!isMyScriptLoaded(checktimoutUrl)){
	var imported = document.createElement('script');
	imported.src = 'js/'+checktimoutUrl;
	document.head.appendChild(imported);
}
//Added DM-31-oct-2017 implement logout alert  in all pages End--------------------

// JavaScript Document
(function ($) {
  $.fn.forcecomplete = function (opt) {
    var $t = $(this);
    $.expr[':'].textEquals = function (a, i, m) {
      return $(a).text().match("^" + m[3] + "$");
    };
    // Call autocomplete() with our modified select/focus callbacks
    $t.autocomplete($.extend(opt, {
      change: function (event, ui) {
        var matches = false;
        $(".ui-autocomplete li").each(function () {
          if ($(this).text() == $t.val()) {
            matches = true;
            if ($(this).text() == "No Matches Found") {
              $(this).val('');
			  //alert('asdasdasd');
            }
            return false;
          }
        });
        if ((!matches) | ($t.val() == "No Matches Found")) {
          $(this).val('');
		  
        }
      }
    }))
    .live('keydown', function (e) {
      var keyCode = e.keyCode || e.which;
      //if TAB or RETURN is pressed and the text in the textbox does not match a suggestion, set the value of the textbox to the text of the first suggestion
      if ((keyCode == 9 || keyCode == 13) && ($(".ui-autocomplete li:textEquals('" + $t.val() + "')").size() == 0)) {
        $t.val($(".ui-autocomplete li:first").text());
        if ($t.val() == "No Matches Found") {
          $t.val('');
		  
        }
      }
    });
  };
})(jQuery);


$(document).ready(function(){ 
		
	$("#quote_div").change(function(){
		$.ajax({  
			type: "POST", 
			cache: false, 
			url: "ajax.php",  
			dataType: "text",
			data: ({
				'action':'check_prod_division',
				'division' : $(this).val(),
				'product': $('#quote_product').val()
			}),  
			success: function(result)
				{ 
					if(result === '0') {
						alert('The selected product is not compatible with the selected division. Please check the product and division you have chosen.');
					}
				}  
		});
		return false;
	});
	
	$("#quote_product").change(function(){
		$thisProd = $(this);
		
		$.ajax({  
			type: "POST", 
			cache: false, 
			url: "ajax.php",  
			dataType: "text",
			data: ({
				'action':'get_prod_division_and_bus_type',
				'product' : $(this).val()
			}),  
			success: function(result)
				{ 
					var err_weight = 0; 
					var err = '';
					var res = result.split('|');
					if(res[0] == 'CHEM' || res[0] == 'FOOD' || res[0] == 'FEED') {
						$('#quote_div').val(res[0]);
					} else {
						err = "Error: Unable to determine the product's division\n";
						err_weight = 2;
					}
					switch(res[1]) {
						case 'SPOT' :
							$('#quote_type').val('SPOT');
							break;
						case 'DED' :
							$('#quote_type').val('DED');
							break;
						case 'MAN' :
							$('#quote_type').val('MAN');
							break;
						default :
							err += 'Error: unable to determine the product\'s business type';
						err_weight += 1;
					}
					$('#Submit').removeAttr('disabled');
					if(err) {
						if(err_weight >= 2){
							err += '\n\nPlease select a different product.';
							$thisProd.focus();
							$('#Submit').attr('disabled','disabled');
						}
						alert(err);
					}
				}  
		});
		return false;
	});
	
	$("#quote_type").change(function(){
		$.ajax({  
			type: "POST", 
			cache: false, 
			url: "ajax.php",  
			dataType: "text",
			data: ({
				'action':'check_prod_business_type',
				'type' : $(this).val(),
				'product': $('#quote_product').val()
			}),  
			success: function(result)
				{ 
					if(result === '0') {
						alert('The selected product is not compatible with the selected business type. Please check the product and business type you have chosen.');
					}
				}  
		});
		return false;
	});
  
  
  // Calculate and shot the ullage percentage when a tank is selected in chEquip.php
  $(".change-jobs-tank").change(function(){
	  var electric_tank = $(this).find(':selected').data('electric-tank');
		$.ajax({  
			type: "POST", 
			cache: false, 
			url: "ajax.php",  
			dataType: "text",
			async: false,
			data: ({
				'action':'check_tank_ullage',
		        'job_weight_req' : $('#weight_required').val(),
		        'prod_sg' : $('#prod_sg').val(),
		        'tank_capacity' : $(this).find(':selected').data('capacity'),
		        'tankno' : $(this).val(),
		        'is_baffeled' : $(this).find(':selected').data('baffeled'),
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
		return false;
	});
  
	// Calculate the previous job DM-02-Jul-2018
	$(".change-jobs-tank").change(function(){
	  findPreviousJob($(this),'function-call');
	  findTankExpire($(this),'function-call');
	  checkLastActivityAddress($(this));
	  /*if($('#has_permission_prev_job').val() == 1){
	  	checkPreviousAVLBActivityCount($(this));
	  }*/
	  return false;
  });
  
  if($('#page-type').val() == 'old-tank-allocation' ){
	//call for page load
	findPreviousJob($('#current-tank-hidden'),'page-load');  
  }
  
  $('.btn-tank-allocation-old').click(function(e) {
	  if($('#has_permission_prev_job').val() == 1){
		  e.preventDefault();
		  if(($('#prev-avlb-change').val() == "") && ($('#j_tank_no').val() != "TBC")){
			  $('#prev-avlb-change').css('border','1px solid red');
		  }else{
			  $('#form1').submit();
		  }
	  }
  });
  $("#prev-avlb-change").change(function(){
	  
	  if($(this).val() == ""){
		  $(this).css('border','1px solid red');
	  }else{
		  $(this).css('border','1px solid rgb(149, 149, 149)');
	  }
  });
	
	
	$("#sea_type_id").change(function(){
		if($(this).val() == 2) {
			$(".deep_sea_data").fadeIn("slow");
		} else {
			$(".deep_sea_data").fadeOut("slow");
		}
	});
	
	
	/*
		Generic function for deleting a database row
	------------------------------------------------------------------------------------------------------*/
	$('.delete-row').live('click',function(e) {
		var pageName = $('#page_name').val();	
		var plan_id = $(this).attr('data-plan-files-id');
		e.preventDefault();
		var id = $(this).data('id');
		var parent = $(this).parent().parent();
		if (confirm('Are you sure you want to delete the row with ID '+id+'? This cannot be undone')) {
			var action = $(this).data('action');
			$.ajax({  
				type: "POST",  
				url: "ajax.php",  
				dataType: "text",
				data: "action="+action+"&id="+id,
				beforeSend: function() {
				  //parent.animate({'backgroundColor':'#fb6c6c'},300);
				  $(parent).find("td").css({
					  'color': '#fff',
					  'background-color': '#cc0000'
				  })
				},  
				success: function(result)
					{ 
						if(result=='1') {
							/*$(e.target).closest('tr').fadeOut(300, function() {
								$(this).remove();
								}
							);*/
							$(parent).fadeOut(1000, function() {
								$(this).remove();
									if(pageName = 'job-edit' && plan_id != '' && plan_id != undefined){
										var plancount = $(".delete-row[data-plan-files-id='" + plan_id + "']").length;
										if(plancount == 0){
											$(".file-upload-btn[data-id='" + plan_id + "'] i").removeClass('fa-file').addClass('fa-file-o');
										}
									}
								}
							);
							//parent.remove();
						} else {
							alert(result);
							$(parent).find("td").css({
								  'color': '',
								  'background-color': ''
							  })
						}
					}  
			});
		}
	});
	
	// change job file sending subject line to the click filename
	$('.subject-selector').click(function(e) {
		e.preventDefault();
		var subject = $(this).data('subject');
		$('#subject-line').val(subject);
		$('.subject-selector').show();
		$(this).fadeOut();
	});
	
	
	
	/*
		Generic function for deleting a database row
	------------------------------------------------------------------------------------------------------*/
	$('#form-jobnote').submit(function() {
		var data = $(this).serialize();
		
		$.ajax({  
			type: "POST",
			cache: false,
			url: "ajax.php",  
			dataType: "text",
			data: ({
				'action':'add_job_note',
				'data': data
			}), 
			success: function(result)
				{ 
					if(result=='1') {
						
						$('#form-jobnotes-feedback').hide().html('<p class="alert alert-success">Job note added</p>').fadeIn();
						$('#form-jobnotes-feedback').delay(3000).slideUp();
						showJobNotes($('#notejobid').val());
					} else {
						$('#form-jobnotes-feedback').html(result);
					}
				}  
		});
		return false;
	});
	
	/*
	Validate chosen tank number select field against prod division and prod T numbers
	when creating a job and editing a job
	*/
	
	/*$("#j_tank_no").change(function(){
				
		var elem = $(this);
		
		$.ajax({  
			type: "POST", 
			cache: false, 
			url: "ajax.php",  
			dataType: "text",
			data: ({
				'action':'check_tanktoprod_division',
				'tank' : $(this).val(),
				'product' : $('#j_product').val()
			}),  
			success: function(result)
				{ 
					if(result != 1) {
						alert(result);
						$(elem).val('TBC');
					}
				}  
		});
		return false;
	});*/


	$("#form-btn-colorbox").colorbox({href: function(){
		var url = $(this).parents('form').data('target');
		var ser = $(this).parents('form').serialize(); //alert(url+'?'+ser);
    return url+'?'+ser;
	}, width:'80%', height:"90%", iframe:true});
  
  
  $(".btn-email-invoices").on("click", function(e){
      e.preventDefault();
      $('#form-new-checkbox-value').attr('action', "email-invoice.php").attr('method', 'post').submit();
  });
	
	$('.showmore').click(function(e) {
		e.preventDefault();
		var elemid = '#'+$(this).data('id');
		var elem = $(this);		
		$(elemid).toggle("", function () {
			$(elemid).is(":hidden") ? $(elem).html('Show <i class="icon-plus"></i>') : $(elem).html('Hide <i class="icon-minus"></i>');
		});
	});
	
	$('a.colorbox').colorbox({iframe:true, width:'80%', height:'90%'});
	
	 $(".chosen-select").chosen({no_results_text: "Oops, nothing found!"}); 
	 
	 $(".tablesorter").tablesorter({
		 cssHeader:'sortheader',
		 cssAsc:'headerSortUp',
		 cssDesc:'headerSortDown',
		 /*headers: { 
            0: {sorter: false}, 
            1: {sorter: false},
			2: {sorter: false},
			3: {sorter: false},
			4: {sorter: false},
			6: {sorter: false}
        }*/
	 }); 

});


/*  Display Job Notes table on Job page */
function showJobNotes(jobid) 
{
	$.ajax({  
		type: "POST", 
		cache: false, 
		url: "ajax.php",  
		dataType: "html",
		data: ({
			'action':'show_job_notes',
			'id':jobid
		}),
		success: function(result)
			{ 
				$('#job_notes_table').hide().html(result).fadeIn('slow');
			},
		error: function()
			{
				$('#job_notes_table').hide().html('<p class="error">Sorry but an unexpected error occured.</p>').fadeIn('slow');
			}
			
	});	
	
	return false;	
}


/*
File upload JS
*/
function fileSelected() {
	var file = document.getElementById('fileToUpload').files[0];
	if (file) {
	  var fileSize = 0;
	  if (file.size > 1024 * 1024)
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	  else
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
	
		var jobnum = document.getElementById('fileJobNum').value;
		var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
	  document.getElementById('fileName').value = jobnum+'-'+fname;
	  document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
	  document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
	}
}

function uploadFile() {
	$('#feedback').hide();
	var fd = new FormData();
	fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
	fd.append("fileName", document.getElementById('fileName').value);
	fd.append("fileDesc", document.getElementById('fileDesc').value);
	fd.append("fileJobNum", document.getElementById('fileJobNum').value);
	fd.append("fileCustomerAccess", document.getElementById('fileCustomerAccess').value);
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	xhr.open("POST", "uploadfile.php");
	xhr.send(fd);
}

function uploadProgress(evt) {
	if (evt.lengthComputable) {
	  var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	  document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
	}
	else {
	  document.getElementById('progressNumber').innerHTML = 'unable to compute';
	}
}

function uploadComplete(evt) {
	/* This event is raised when the server sends back a response */
	//alert(evt.target.responseText);
	$('#feedback').html(evt.target.responseText);
	$('#feedback').slideDown();
	//$('#form1')[0].reset();
}

function uploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
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
				url: $('#tank-prev-job-url').val(),  
				dataType: "html",
				beforeSend: function() {
					$('.prev-job-span').html('<img src="images/ajax.gif" />');
					$('.btn-tank-allocation-old').attr('disabled',true);
			    },
				data: ({
						'action_type':'check_previous_job',
						'pljobno' : $('#job_no').val(),
						'plTankNo' : currentVal,
						'callType' : callType,
						'prev_tank_number' : $('#prev_tank_number').val(),
						'is_permission' : $('#has_permission_prev_job').val(),
						
				}),  
				success: function(result){
					$('.btn-tank-allocation-old').attr('disabled',false);
					var parsedJson = $.parseJSON(result);
					if(!$.isEmptyObject(parsedJson.prev_job)){
						var prevJobNo = '#'+parsedJson.prev_job.value;
					}else{
						var prevJobNo = "";
					}
					$('.prev-job-span').html(prevJobNo);
					$('#prev-job-no').val(prevJobNo.replace("#", ""))
					if(callType == 'page-load'){
						$('#prev-allocate-job-no').val(prevJobNo.replace("#", ""));
					}
					//else{
						if(!$.isEmptyObject(parsedJson.avlb_etyc)){
							var avlbMsg = parsedJson.avlb_etyc.avlb;
							var etycMsg = parsedJson.avlb_etyc.etyc;
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
            async: false,
            url: $('#tank-prev-job-url').val(), 
            dataType: "html", 
            data: ({
                'action_type':'check_tank_test_warning',
                'job_no' : jobNumber,
                'tankno' : tankNo
            }),  
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
                         $('#j_tank_no').val('TBC');
				         $('.chosen').chosen().trigger("chosen:updated");
				         $('.feedback').text("");
				         $('.prev-job-span').html('');
				     	 $('#prev-job-no').val('');
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
};


//Find tank test date
function checkLastActivityAddress(currentElement){

	var jobNumber = $('#job_no').val().trim();
	var tankNo = currentElement.val().trim();
	if(tankNo != "TBC" && tankNo != ""){
        $.ajax({  
            type: "POST", 
            url: $('#tank-prev-job-url').val(), 
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
							                $('#j_tank_no').val('TBC');
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
};

/*
 * 
///Check AVLB activity count
function checkPreviousAVLBActivityCount(currentElement){
	console.log(currentElement)
	var jobNumber = $('#job_no').val().trim();
	var tankNo = currentElement.val().trim();
	if(tankNo != "TBC" && tankNo != ""){
        $.ajax({  
            type: "POST", 
            url: $('#tank-prev-job-url').val(), 
            dataType: "html", 
            data: ({
                'action_type':'check_prev_avlb_activity_count',
                'job_no' : jobNumber,
                'tank_no' : tankNo
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
				    else{
				    	$('#prev-avlb-planid').val(result[0]);
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
};
*/

/*!
* TableSorter 2.17.4 min - Client-side table sorting with ease!
* Copyright (c) 2007 Christian Bach
*/
!function(g){g.extend({tablesorter:new function(){function d(){var b=arguments[0],a=1<arguments.length?Array.prototype.slice.call(arguments):b;if("undefined"!==typeof console&&"undefined"!==typeof console.log)console[/error/i.test(b)?"error":/warn/i.test(b)?"warn":"log"](a);else alert(a)}function v(b,a){d(b+" ("+((new Date).getTime()-a.getTime())+"ms)")}function p(b){for(var a in b)return!1;return!0}function n(b,a,c){if(!a)return"";var h,e=b.config,r=e.textExtraction||"",k="",k="basic"===r?g(a).attr(e.textAttribute)|| a.textContent||a.innerText||g(a).text()||"":"function"===typeof r?r(a,b,c):"function"===typeof(h=f.getColumnData(b,r,c))?h(a,b,c):a.textContent||a.innerText||g(a).text()||"";return g.trim(k)}function t(b){var a=b.config,c=a.$tbodies=a.$table.children("tbody:not(."+a.cssInfoBlock+")"),h,e,r,k,l,m,g,u,p,q=0,s="",t=c.length;if(0===t)return a.debug?d("Warning: *Empty table!* Not building a parser cache"):"";a.debug&&(p=new Date,d("Detecting parsers for each column"));for(e=[];q<t;){h=c[q].rows;if(h[q])for(r= a.columns,k=0;k<r;k++){l=a.$headers.filter('[data-column="'+k+'"]:last');m=f.getColumnData(b,a.headers,k);u=f.getParserById(f.getData(l,m,"sorter"));g="false"===f.getData(l,m,"parser");a.empties[k]=f.getData(l,m,"empty")||a.emptyTo||(a.emptyToBottom?"bottom":"top");a.strings[k]=f.getData(l,m,"string")||a.stringTo||"max";g&&(u=f.getParserById("no-parser"));if(!u)a:{l=b;m=h;g=-1;u=k;for(var A=void 0,x=f.parsers.length,z=!1,F="",A=!0;""===F&&A;)g++,m[g]?(z=m[g].cells[u],F=n(l,z,u),l.config.debug&&d("Checking if value was empty on row "+ g+", column: "+u+': "'+F+'"')):A=!1;for(;0<=--x;)if((A=f.parsers[x])&&"text"!==A.id&&A.is&&A.is(F,l,z)){u=A;break a}u=f.getParserById("text")}a.debug&&(s+="column:"+k+"; parser:"+u.id+"; string:"+a.strings[k]+"; empty: "+a.empties[k]+"\n");e[k]=u}q+=e.length?t:1}a.debug&&(d(s?s:"No parsers detected"),v("Completed detecting parsers",p));a.parsers=e}function x(b){var a,c,h,e,r,k,l,m,y,u,p,q=b.config,s=q.$table.children("tbody"),t=q.parsers;q.cache={};if(!t)return q.debug?d("Warning: *Empty table!* Not building a cache"): "";q.debug&&(m=new Date);q.showProcessing&&f.isProcessing(b,!0);for(r=0;r<s.length;r++)if(p=[],a=q.cache[r]={normalized:[]},!s.eq(r).hasClass(q.cssInfoBlock)){y=s[r]&&s[r].rows.length||0;for(h=0;h<y;++h)if(u={child:[]},k=g(s[r].rows[h]),l=[],k.hasClass(q.cssChildRow)&&0!==h)c=a.normalized.length-1,a.normalized[c][q.columns].$row=a.normalized[c][q.columns].$row.add(k),k.prev().hasClass(q.cssChildRow)||k.prev().addClass(f.css.cssHasChild),u.child[c]=g.trim(k[0].textContent||k[0].innerText||k.text()|| "");else{u.$row=k;u.order=h;for(e=0;e<q.columns;++e)"undefined"===typeof t[e]?q.debug&&d("No parser found for cell:",k[0].cells[e],"does it have a header?"):(c=n(b,k[0].cells[e],e),c="no-parser"===t[e].id?"":t[e].format(c,b,k[0].cells[e],e),l.push(c),"numeric"===(t[e].type||"").toLowerCase()&&(p[e]=Math.max(Math.abs(c)||0,p[e]||0)));l[q.columns]=u;a.normalized.push(l)}a.colMax=p}q.showProcessing&&f.isProcessing(b);q.debug&&v("Building cache for "+y+" rows",m)}function z(b,a){var c=b.config,h=c.widgetOptions, e=b.tBodies,r=[],k=c.cache,d,m,y,u,n,q;if(p(k))return c.appender?c.appender(b,r):b.isUpdating?c.$table.trigger("updateComplete",b):"";c.debug&&(q=new Date);for(n=0;n<e.length;n++)if(d=g(e[n]),d.length&&!d.hasClass(c.cssInfoBlock)){y=f.processTbody(b,d,!0);d=k[n].normalized;m=d.length;for(u=0;u<m;u++)r.push(d[u][c.columns].$row),c.appender&&(!c.pager||c.pager.removeRows&&h.pager_removeRows||c.pager.ajax)||y.append(d[u][c.columns].$row);f.processTbody(b,y,!1)}c.appender&&c.appender(b,r);c.debug&&v("Rebuilt table", q);a||c.appender||f.applyWidget(b);b.isUpdating&&c.$table.trigger("updateComplete",b)}function C(b){return/^d/i.test(b)||1===b}function D(b){var a,c,h,e,r,k,l,m=b.config;m.headerList=[];m.headerContent=[];m.debug&&(l=new Date);m.columns=f.computeColumnIndex(m.$table.children("thead, tfoot").children("tr"));e=m.cssIcon?'<i class="'+(m.cssIcon===f.css.icon?f.css.icon:m.cssIcon+" "+f.css.icon)+'"></i>':"";m.$headers.each(function(d){c=g(this);a=f.getColumnData(b,m.headers,d,!0);m.headerContent[d]=g(this).html(); r=m.headerTemplate.replace(/\{content\}/g,g(this).html()).replace(/\{icon\}/g,e);m.onRenderTemplate&&(h=m.onRenderTemplate.apply(c,[d,r]))&&"string"===typeof h&&(r=h);g(this).html('<div class="'+f.css.headerIn+'">'+r+"</div>");m.onRenderHeader&&m.onRenderHeader.apply(c,[d]);this.column=parseInt(g(this).attr("data-column"),10);this.order=C(f.getData(c,a,"sortInitialOrder")||m.sortInitialOrder)?[1,0,2]:[0,1,2];this.count=-1;this.lockedOrder=!1;k=f.getData(c,a,"lockedOrder")||!1;"undefined"!==typeof k&& !1!==k&&(this.order=this.lockedOrder=C(k)?[1,1,1]:[0,0,0]);c.addClass(f.css.header+" "+m.cssHeader);m.headerList[d]=this;c.parent().addClass(f.css.headerRow+" "+m.cssHeaderRow).attr("role","row");m.tabIndex&&c.attr("tabindex",0)}).attr({scope:"col",role:"columnheader"});B(b);m.debug&&(v("Built headers:",l),d(m.$headers))}function E(b,a,c){var h=b.config;h.$table.find(h.selectorRemove).remove();t(b);x(b);H(h.$table,a,c)}function B(b){var a,c,h=b.config;h.$headers.each(function(e,r){c=g(r);a="false"=== f.getData(r,f.getColumnData(b,h.headers,e,!0),"sorter");r.sortDisabled=a;c[a?"addClass":"removeClass"]("sorter-false").attr("aria-disabled",""+a);b.id&&(a?c.removeAttr("aria-controls"):c.attr("aria-controls",b.id))})}function G(b){var a,c,h=b.config,e=h.sortList,r=e.length,d=f.css.sortNone+" "+h.cssNone,l=[f.css.sortAsc+" "+h.cssAsc,f.css.sortDesc+" "+h.cssDesc],m=["ascending","descending"],y=g(b).find("tfoot tr").children().add(h.$extraHeaders).removeClass(l.join(" "));h.$headers.removeClass(l.join(" ")).addClass(d).attr("aria-sort", "none");for(a=0;a<r;a++)if(2!==e[a][1]&&(b=h.$headers.not(".sorter-false").filter('[data-column="'+e[a][0]+'"]'+(1===r?":last":"")),b.length)){for(c=0;c<b.length;c++)b[c].sortDisabled||b.eq(c).removeClass(d).addClass(l[e[a][1]]).attr("aria-sort",m[e[a][1]]);y.length&&y.filter('[data-column="'+e[a][0]+'"]').removeClass(d).addClass(l[e[a][1]])}h.$headers.not(".sorter-false").each(function(){var b=g(this),a=this.order[(this.count+1)%(h.sortReset?3:2)],a=b.text()+": "+f.language[b.hasClass(f.css.sortAsc)? "sortAsc":b.hasClass(f.css.sortDesc)?"sortDesc":"sortNone"]+f.language[0===a?"nextAsc":1===a?"nextDesc":"nextNone"];b.attr("aria-label",a)})}function L(b){if(b.config.widthFixed&&0===g(b).find("colgroup").length){var a=g("<colgroup>"),c=g(b).width();g(b.tBodies[0]).find("tr:first").children("td:visible").each(function(){a.append(g("<col>").css("width",parseInt(g(this).width()/c*1E3,10)/10+"%"))});g(b).prepend(a)}}function M(b,a){var c,h,e,f,d,l=b.config,m=a||l.sortList;l.sortList=[];g.each(m,function(b, a){f=parseInt(a[0],10);if(e=l.$headers.filter('[data-column="'+f+'"]:last')[0]){h=(h=(""+a[1]).match(/^(1|d|s|o|n)/))?h[0]:"";switch(h){case "1":case "d":h=1;break;case "s":h=d||0;break;case "o":c=e.order[(d||0)%(l.sortReset?3:2)];h=0===c?1:1===c?0:2;break;case "n":e.count+=1;h=e.order[e.count%(l.sortReset?3:2)];break;default:h=0}d=0===b?h:d;c=[f,parseInt(h,10)||0];l.sortList.push(c);h=g.inArray(c[1],e.order);e.count=0<=h?h:c[1]%(l.sortReset?3:2)}})}function N(b,a){return b&&b[a]?b[a].type||"":""} function O(b,a,c){var h,e,d,k=b.config,l=!c[k.sortMultiSortKey],m=k.$table;m.trigger("sortStart",b);a.count=c[k.sortResetKey]?2:(a.count+1)%(k.sortReset?3:2);k.sortRestart&&(e=a,k.$headers.each(function(){this===e||!l&&g(this).is("."+f.css.sortDesc+",."+f.css.sortAsc)||(this.count=-1)}));e=a.column;if(l){k.sortList=[];if(null!==k.sortForce)for(h=k.sortForce,c=0;c<h.length;c++)h[c][0]!==e&&k.sortList.push(h[c]);h=a.order[a.count];if(2>h&&(k.sortList.push([e,h]),1<a.colSpan))for(c=1;c<a.colSpan;c++)k.sortList.push([e+ c,h])}else{if(k.sortAppend&&1<k.sortList.length)for(c=0;c<k.sortAppend.length;c++)d=f.isValueInArray(k.sortAppend[c][0],k.sortList),0<=d&&k.sortList.splice(d,1);if(0<=f.isValueInArray(e,k.sortList))for(c=0;c<k.sortList.length;c++)d=k.sortList[c],h=k.$headers.filter('[data-column="'+d[0]+'"]:last')[0],d[0]===e&&(d[1]=h.order[a.count],2===d[1]&&(k.sortList.splice(c,1),h.count=-1));else if(h=a.order[a.count],2>h&&(k.sortList.push([e,h]),1<a.colSpan))for(c=1;c<a.colSpan;c++)k.sortList.push([e+c,h])}if(null!== k.sortAppend)for(h=k.sortAppend,c=0;c<h.length;c++)h[c][0]!==e&&k.sortList.push(h[c]);m.trigger("sortBegin",b);setTimeout(function(){G(b);I(b);z(b);m.trigger("sortEnd",b)},1)}function I(b){var a,c,h,e,d,k,g,m,y,n,t,q=0,s=b.config,w=s.textSorter||"",x=s.sortList,z=x.length,B=b.tBodies.length;if(!s.serverSideSorting&&!p(s.cache)){s.debug&&(d=new Date);for(c=0;c<B;c++)k=s.cache[c].colMax,g=s.cache[c].normalized,g.sort(function(c,d){for(a=0;a<z;a++){e=x[a][0];m=x[a][1];q=0===m;if(s.sortStable&&c[e]=== d[e]&&1===z)break;(h=/n/i.test(N(s.parsers,e)))&&s.strings[e]?(h="boolean"===typeof s.string[s.strings[e]]?(q?1:-1)*(s.string[s.strings[e]]?-1:1):s.strings[e]?s.string[s.strings[e]]||0:0,y=s.numberSorter?s.numberSorter(c[e],d[e],q,k[e],b):f["sortNumeric"+(q?"Asc":"Desc")](c[e],d[e],h,k[e],e,b)):(n=q?c:d,t=q?d:c,y="function"===typeof w?w(n[e],t[e],q,e,b):"object"===typeof w&&w.hasOwnProperty(e)?w[e](n[e],t[e],q,e,b):f["sortNatural"+(q?"Asc":"Desc")](c[e],d[e],e,b,s));if(y)return y}return c[s.columns].order- d[s.columns].order});s.debug&&v("Sorting on "+x.toString()+" and dir "+m+" time",d)}}function J(b,a){b[0].isUpdating&&b.trigger("updateComplete");g.isFunction(a)&&a(b[0])}function H(b,a,c){var h=b[0].config.sortList;!1!==a&&!b[0].isProcessing&&h.length?b.trigger("sorton",[h,function(){J(b,c)},!0]):(J(b,c),f.applyWidget(b[0],!1))}function K(b){var a=b.config,c=a.$table;c.unbind("sortReset update updateRows updateCell updateAll addRows updateComplete sorton appendCache updateCache applyWidgetId applyWidgets refreshWidgets destroy mouseup mouseleave ".split(" ").join(a.namespace+ " ")).bind("sortReset"+a.namespace,function(c,e){c.stopPropagation();a.sortList=[];G(b);I(b);z(b);g.isFunction(e)&&e(b)}).bind("updateAll"+a.namespace,function(c,e,d){c.stopPropagation();b.isUpdating=!0;f.refreshWidgets(b,!0,!0);f.restoreHeaders(b);D(b);f.bindEvents(b,a.$headers,!0);K(b);E(b,e,d)}).bind("update"+a.namespace+" updateRows"+a.namespace,function(a,c,d){a.stopPropagation();b.isUpdating=!0;B(b);E(b,c,d)}).bind("updateCell"+a.namespace,function(h,e,d,f){h.stopPropagation();b.isUpdating= !0;c.find(a.selectorRemove).remove();var l,m;l=c.find("tbody");m=g(e);h=l.index(g.fn.closest?m.closest("tbody"):m.parents("tbody").filter(":first"));var p=g.fn.closest?m.closest("tr"):m.parents("tr").filter(":first");e=m[0];l.length&&0<=h&&(l=l.eq(h).find("tr").index(p),m=m.index(),a.cache[h].normalized[l][a.columns].$row=p,e=a.cache[h].normalized[l][m]="no-parser"===a.parsers[m].id?"":a.parsers[m].format(n(b,e,m),b,e,m),"numeric"===(a.parsers[m].type||"").toLowerCase()&&(a.cache[h].colMax[m]=Math.max(Math.abs(e)|| 0,a.cache[h].colMax[m]||0)),H(c,d,f))}).bind("addRows"+a.namespace,function(h,e,d,f){h.stopPropagation();b.isUpdating=!0;if(p(a.cache))B(b),E(b,d,f);else{e=g(e);var l,m,v,u,x=e.filter("tr").length,q=c.find("tbody").index(e.parents("tbody").filter(":first"));a.parsers&&a.parsers.length||t(b);for(h=0;h<x;h++){m=e[h].cells.length;u=[];v={child:[],$row:e.eq(h),order:a.cache[q].normalized.length};for(l=0;l<m;l++)u[l]="no-parser"===a.parsers[l].id?"":a.parsers[l].format(n(b,e[h].cells[l],l),b,e[h].cells[l], l),"numeric"===(a.parsers[l].type||"").toLowerCase()&&(a.cache[q].colMax[l]=Math.max(Math.abs(u[l])||0,a.cache[q].colMax[l]||0));u.push(v);a.cache[q].normalized.push(u)}H(c,d,f)}}).bind("updateComplete"+a.namespace,function(){b.isUpdating=!1}).bind("sorton"+a.namespace,function(a,e,d,k){var l=b.config;a.stopPropagation();c.trigger("sortStart",this);M(b,e);G(b);l.delayInit&&p(l.cache)&&x(b);c.trigger("sortBegin",this);I(b);z(b,k);c.trigger("sortEnd",this);f.applyWidget(b);g.isFunction(d)&&d(b)}).bind("appendCache"+ a.namespace,function(a,c,d){a.stopPropagation();z(b,d);g.isFunction(c)&&c(b)}).bind("updateCache"+a.namespace,function(c,e){a.parsers&&a.parsers.length||t(b);x(b);g.isFunction(e)&&e(b)}).bind("applyWidgetId"+a.namespace,function(c,e){c.stopPropagation();f.getWidgetById(e).format(b,a,a.widgetOptions)}).bind("applyWidgets"+a.namespace,function(a,c){a.stopPropagation();f.applyWidget(b,c)}).bind("refreshWidgets"+a.namespace,function(a,c,d){a.stopPropagation();f.refreshWidgets(b,c,d)}).bind("destroy"+ a.namespace,function(a,c,d){a.stopPropagation();f.destroy(b,c,d)}).bind("resetToLoadState"+a.namespace,function(){f.refreshWidgets(b,!0,!0);a=g.extend(!0,f.defaults,a.originalSettings);b.hasInitialized=!1;f.setup(b,a)})}var f=this;f.version="2.17.4";f.parsers=[];f.widgets=[];f.defaults={theme:"default",widthFixed:!1,showProcessing:!1,headerTemplate:"{content}",onRenderTemplate:null,onRenderHeader:null,cancelSelection:!0,tabIndex:!0,dateFormat:"mmddyyyy",sortMultiSortKey:"shiftKey",sortResetKey:"ctrlKey", usNumberFormat:!0,delayInit:!1,serverSideSorting:!1,headers:{},ignoreCase:!0,sortForce:null,sortList:[],sortAppend:null,sortStable:!1,sortInitialOrder:"asc",sortLocaleCompare:!1,sortReset:!1,sortRestart:!1,emptyTo:"bottom",stringTo:"max",textExtraction:"basic",textAttribute:"data-text",textSorter:null,numberSorter:null,widgets:[],widgetOptions:{zebra:["even","odd"]},initWidgets:!0,initialized:null,tableClass:"",cssAsc:"",cssDesc:"",cssNone:"",cssHeader:"",cssHeaderRow:"",cssProcessing:"",cssChildRow:"tablesorter-childRow", cssIcon:"tablesorter-icon",cssInfoBlock:"tablesorter-infoOnly",selectorHeaders:"> thead th, > thead td",selectorSort:"th, td",selectorRemove:".remove-me",debug:!1,headerList:[],empties:{},strings:{},parsers:[]};f.css={table:"tablesorter",cssHasChild:"tablesorter-hasChildRow",childRow:"tablesorter-childRow",header:"tablesorter-header",headerRow:"tablesorter-headerRow",headerIn:"tablesorter-header-inner",icon:"tablesorter-icon",info:"tablesorter-infoOnly",processing:"tablesorter-processing",sortAsc:"tablesorter-headerAsc", sortDesc:"tablesorter-headerDesc",sortNone:"tablesorter-headerUnSorted"};f.language={sortAsc:"Ascending sort applied, ",sortDesc:"Descending sort applied, ",sortNone:"No sort applied, ",nextAsc:"activate to apply an ascending sort",nextDesc:"activate to apply a descending sort",nextNone:"activate to remove the sort"};f.log=d;f.benchmark=v;f.construct=function(b){return this.each(function(){var a=g.extend(!0,{},f.defaults,b);a.originalSettings=b;!this.hasInitialized&&f.buildTable&&"TABLE"!==this.tagName? f.buildTable(this,a):f.setup(this,a)})};f.setup=function(b,a){if(!b||!b.tHead||0===b.tBodies.length||!0===b.hasInitialized)return a.debug?d("ERROR: stopping initialization! No table, thead, tbody or tablesorter has already been initialized"):"";var c="",h=g(b),e=g.metadata;b.hasInitialized=!1;b.isProcessing=!0;b.config=a;g.data(b,"tablesorter",a);a.debug&&g.data(b,"startoveralltimer",new Date);a.supportsDataObject=function(a){a[0]=parseInt(a[0],10);return 1<a[0]||1===a[0]&&4<=parseInt(a[1],10)}(g.fn.jquery.split(".")); a.string={max:1,min:-1,emptyMin:1,emptyMax:-1,zero:0,none:0,"null":0,top:!0,bottom:!1};/tablesorter\-/.test(h.attr("class"))||(c=""!==a.theme?" tablesorter-"+a.theme:"");a.$table=h.addClass(f.css.table+" "+a.tableClass+c).attr({role:"grid"});a.$headers=g(b).find(a.selectorHeaders);a.namespace=a.namespace?"."+a.namespace.replace(/\W/g,""):".tablesorter"+Math.random().toString(16).slice(2);a.$tbodies=h.children("tbody:not(."+a.cssInfoBlock+")").attr({"aria-live":"polite","aria-relevant":"all"});a.$table.find("caption").length&& a.$table.attr("aria-labelledby","theCaption");a.widgetInit={};a.textExtraction=a.$table.attr("data-text-extraction")||a.textExtraction||"basic";D(b);L(b);t(b);a.delayInit||x(b);f.bindEvents(b,a.$headers,!0);K(b);a.supportsDataObject&&"undefined"!==typeof h.data().sortlist?a.sortList=h.data().sortlist:e&&h.metadata()&&h.metadata().sortlist&&(a.sortList=h.metadata().sortlist);f.applyWidget(b,!0);0<a.sortList.length?h.trigger("sorton",[a.sortList,{},!a.initWidgets,!0]):(G(b),a.initWidgets&&f.applyWidget(b, !1));a.showProcessing&&h.unbind("sortBegin"+a.namespace+" sortEnd"+a.namespace).bind("sortBegin"+a.namespace+" sortEnd"+a.namespace,function(c){clearTimeout(a.processTimer);f.isProcessing(b);"sortBegin"===c.type&&(a.processTimer=setTimeout(function(){f.isProcessing(b,!0)},500))});b.hasInitialized=!0;b.isProcessing=!1;a.debug&&f.benchmark("Overall initialization time",g.data(b,"startoveralltimer"));h.trigger("tablesorter-initialized",b);"function"===typeof a.initialized&&a.initialized(b)};f.getColumnData= function(b,a,c,h){if("undefined"!==typeof a&&null!==a){b=g(b)[0];var e,d=b.config;if(a[c])return h?a[c]:a[d.$headers.index(d.$headers.filter('[data-column="'+c+'"]:last'))];for(e in a)if("string"===typeof e&&(b=h?d.$headers.eq(c).filter(e):d.$headers.filter('[data-column="'+c+'"]:last').filter(e),b.length))return a[e]}};f.computeColumnIndex=function(b){var a=[],c=0,h,e,d,f,l,m,p,v,n,q;for(h=0;h<b.length;h++)for(l=b[h].cells,e=0;e<l.length;e++){d=l[e];f=g(d);m=d.parentNode.rowIndex;f.index();p=d.rowSpan|| 1;v=d.colSpan||1;"undefined"===typeof a[m]&&(a[m]=[]);for(d=0;d<a[m].length+1;d++)if("undefined"===typeof a[m][d]){n=d;break}c=Math.max(n,c);f.attr({"data-column":n});for(d=m;d<m+p;d++)for("undefined"===typeof a[d]&&(a[d]=[]),q=a[d],f=n;f<n+v;f++)q[f]="x"}return c+1};f.isProcessing=function(b,a,c){b=g(b);var d=b[0].config,e=c||b.find("."+f.css.header);a?("undefined"!==typeof c&&0<d.sortList.length&&(e=e.filter(function(){return this.sortDisabled?!1:0<=f.isValueInArray(parseFloat(g(this).attr("data-column")), d.sortList)})),b.add(e).addClass(f.css.processing+" "+d.cssProcessing)):b.add(e).removeClass(f.css.processing+" "+d.cssProcessing)};f.processTbody=function(b,a,c){b=g(b)[0];if(c)return b.isProcessing=!0,a.before('<span class="tablesorter-savemyplace"/>'),c=g.fn.detach?a.detach():a.remove();c=g(b).find("span.tablesorter-savemyplace");a.insertAfter(c);c.remove();b.isProcessing=!1};f.clearTableBody=function(b){g(b)[0].config.$tbodies.children().detach()};f.bindEvents=function(b,a,c){b=g(b)[0];var d, e=b.config;!0!==c&&(e.$extraHeaders=e.$extraHeaders?e.$extraHeaders.add(a):a);a.find(e.selectorSort).add(a.filter(e.selectorSort)).unbind(["mousedown","mouseup","sort","keyup",""].join(e.namespace+" ")).bind(["mousedown","mouseup","sort","keyup",""].join(e.namespace+" "),function(c,f){var l;l=c.type;if(!(1!==(c.which||c.button)&&!/sort|keyup/.test(l)||"keyup"===l&&13!==c.which||"mouseup"===l&&!0!==f&&250<(new Date).getTime()-d)){if("mousedown"===l)return d=(new Date).getTime(),/(input|select|button|textarea)/i.test(c.target.tagName)? "":!e.cancelSelection;e.delayInit&&p(e.cache)&&x(b);l=g.fn.closest?g(this).closest("th, td")[0]:/TH|TD/.test(this.tagName)?this:g(this).parents("th, td")[0];l=e.$headers[a.index(l)];l.sortDisabled||O(b,l,c)}});e.cancelSelection&&a.attr("unselectable","on").bind("selectstart",!1).css({"user-select":"none",MozUserSelect:"none"})};f.restoreHeaders=function(b){var a=g(b)[0].config;a.$table.find(a.selectorHeaders).each(function(b){g(this).find("."+f.css.headerIn).length&&g(this).html(a.headerContent[b])})}; f.destroy=function(b,a,c){b=g(b)[0];if(b.hasInitialized){f.refreshWidgets(b,!0,!0);var d=g(b),e=b.config,r=d.find("thead:first"),k=r.find("tr."+f.css.headerRow).removeClass(f.css.headerRow+" "+e.cssHeaderRow),l=d.find("tfoot:first > tr").children("th, td");!1===a&&0<=g.inArray("uitheme",e.widgets)&&(d.trigger("applyWidgetId",["uitheme"]),d.trigger("applyWidgetId",["zebra"]));r.find("tr").not(k).remove();d.removeData("tablesorter").unbind("sortReset update updateAll updateRows updateCell addRows updateComplete sorton appendCache updateCache applyWidgetId applyWidgets refreshWidgets destroy mouseup mouseleave keypress sortBegin sortEnd resetToLoadState ".split(" ").join(e.namespace+ " "));e.$headers.add(l).removeClass([f.css.header,e.cssHeader,e.cssAsc,e.cssDesc,f.css.sortAsc,f.css.sortDesc,f.css.sortNone].join(" ")).removeAttr("data-column").removeAttr("aria-label").attr("aria-disabled","true");k.find(e.selectorSort).unbind(["mousedown","mouseup","keypress",""].join(e.namespace+" "));f.restoreHeaders(b);d.toggleClass(f.css.table+" "+e.tableClass+" tablesorter-"+e.theme,!1===a);b.hasInitialized=!1;delete b.config.cache;"function"===typeof c&&c(b)}};f.regex={chunk:/(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi, chunks:/(^\\0|\\0$)/,hex:/^0x[0-9a-f]+$/i};f.sortNatural=function(b,a){if(b===a)return 0;var c,d,e,g,k,l;d=f.regex;if(d.hex.test(a)){c=parseInt(b.match(d.hex),16);e=parseInt(a.match(d.hex),16);if(c<e)return-1;if(c>e)return 1}c=b.replace(d.chunk,"\\0$1\\0").replace(d.chunks,"").split("\\0");d=a.replace(d.chunk,"\\0$1\\0").replace(d.chunks,"").split("\\0");l=Math.max(c.length,d.length);for(k=0;k<l;k++){e=isNaN(c[k])?c[k]||0:parseFloat(c[k])||0;g=isNaN(d[k])?d[k]||0:parseFloat(d[k])||0;if(isNaN(e)!== isNaN(g))return isNaN(e)?1:-1;typeof e!==typeof g&&(e+="",g+="");if(e<g)return-1;if(e>g)return 1}return 0};f.sortNaturalAsc=function(b,a,c,d,e){if(b===a)return 0;c=e.string[e.empties[c]||e.emptyTo];return""===b&&0!==c?"boolean"===typeof c?c?-1:1:-c||-1:""===a&&0!==c?"boolean"===typeof c?c?1:-1:c||1:f.sortNatural(b,a)};f.sortNaturalDesc=function(b,a,c,d,e){if(b===a)return 0;c=e.string[e.empties[c]||e.emptyTo];return""===b&&0!==c?"boolean"===typeof c?c?-1:1:c||1:""===a&&0!==c?"boolean"===typeof c?c? 1:-1:-c||-1:f.sortNatural(a,b)};f.sortText=function(b,a){return b>a?1:b<a?-1:0};f.getTextValue=function(b,a,c){if(c){var d=b?b.length:0,e=c+a;for(c=0;c<d;c++)e+=b.charCodeAt(c);return a*e}return 0};f.sortNumericAsc=function(b,a,c,d,e,g){if(b===a)return 0;g=g.config;e=g.string[g.empties[e]||g.emptyTo];if(""===b&&0!==e)return"boolean"===typeof e?e?-1:1:-e||-1;if(""===a&&0!==e)return"boolean"===typeof e?e?1:-1:e||1;isNaN(b)&&(b=f.getTextValue(b,c,d));isNaN(a)&&(a=f.getTextValue(a,c,d));return b-a};f.sortNumericDesc= function(b,a,c,d,e,g){if(b===a)return 0;g=g.config;e=g.string[g.empties[e]||g.emptyTo];if(""===b&&0!==e)return"boolean"===typeof e?e?-1:1:e||1;if(""===a&&0!==e)return"boolean"===typeof e?e?1:-1:-e||-1;isNaN(b)&&(b=f.getTextValue(b,c,d));isNaN(a)&&(a=f.getTextValue(a,c,d));return a-b};f.sortNumeric=function(b,a){return b-a};f.characterEquivalents={a:"\u00e1\u00e0\u00e2\u00e3\u00e4\u0105\u00e5",A:"\u00c1\u00c0\u00c2\u00c3\u00c4\u0104\u00c5",c:"\u00e7\u0107\u010d",C:"\u00c7\u0106\u010c",e:"\u00e9\u00e8\u00ea\u00eb\u011b\u0119", E:"\u00c9\u00c8\u00ca\u00cb\u011a\u0118",i:"\u00ed\u00ec\u0130\u00ee\u00ef\u0131",I:"\u00cd\u00cc\u0130\u00ce\u00cf",o:"\u00f3\u00f2\u00f4\u00f5\u00f6",O:"\u00d3\u00d2\u00d4\u00d5\u00d6",ss:"\u00df",SS:"\u1e9e",u:"\u00fa\u00f9\u00fb\u00fc\u016f",U:"\u00da\u00d9\u00db\u00dc\u016e"};f.replaceAccents=function(b){var a,c="[",d=f.characterEquivalents;if(!f.characterRegex){f.characterRegexArray={};for(a in d)"string"===typeof a&&(c+=d[a],f.characterRegexArray[a]=new RegExp("["+d[a]+"]","g"));f.characterRegex= new RegExp(c+"]")}if(f.characterRegex.test(b))for(a in d)"string"===typeof a&&(b=b.replace(f.characterRegexArray[a],a));return b};f.isValueInArray=function(b,a){var c,d=a.length;for(c=0;c<d;c++)if(a[c][0]===b)return c;return-1};f.addParser=function(b){var a,c=f.parsers.length,d=!0;for(a=0;a<c;a++)f.parsers[a].id.toLowerCase()===b.id.toLowerCase()&&(d=!1);d&&f.parsers.push(b)};f.getParserById=function(b){if("false"==b)return!1;var a,c=f.parsers.length;for(a=0;a<c;a++)if(f.parsers[a].id.toLowerCase()=== b.toString().toLowerCase())return f.parsers[a];return!1};f.addWidget=function(b){f.widgets.push(b)};f.hasWidget=function(b,a){b=g(b);return b.length&&b[0].config&&b[0].config.widgetInit[a]||!1};f.getWidgetById=function(b){var a,c,d=f.widgets.length;for(a=0;a<d;a++)if((c=f.widgets[a])&&c.hasOwnProperty("id")&&c.id.toLowerCase()===b.toLowerCase())return c};f.applyWidget=function(b,a){b=g(b)[0];var c=b.config,d=c.widgetOptions,e=[],p,k,l;!1!==a&&b.hasInitialized&&(b.isApplyingWidgets||b.isUpdating)|| (c.debug&&(p=new Date),c.widgets.length&&(b.isApplyingWidgets=!0,c.widgets=g.grep(c.widgets,function(a,b){return g.inArray(a,c.widgets)===b}),g.each(c.widgets||[],function(a,b){(l=f.getWidgetById(b))&&l.id&&(l.priority||(l.priority=10),e[a]=l)}),e.sort(function(a,b){return a.priority<b.priority?-1:a.priority===b.priority?0:1}),g.each(e,function(e,f){if(f){if(a||!c.widgetInit[f.id])f.hasOwnProperty("options")&&(d=b.config.widgetOptions=g.extend(!0,{},f.options,d)),f.hasOwnProperty("init")&&f.init(b, f,c,d),c.widgetInit[f.id]=!0;!a&&f.hasOwnProperty("format")&&f.format(b,c,d,!1)}})),setTimeout(function(){b.isApplyingWidgets=!1},0),c.debug&&(k=c.widgets.length,v("Completed "+(!0===a?"initializing ":"applying ")+k+" widget"+(1!==k?"s":""),p)))};f.refreshWidgets=function(b,a,c){b=g(b)[0];var h,e=b.config,p=e.widgets,k=f.widgets,l=k.length;for(h=0;h<l;h++)k[h]&&k[h].id&&(a||0>g.inArray(k[h].id,p))&&(e.debug&&d('Refeshing widgets: Removing "'+k[h].id+'"'),k[h].hasOwnProperty("remove")&&e.widgetInit[k[h].id]&& (k[h].remove(b,e,e.widgetOptions),e.widgetInit[k[h].id]=!1));!0!==c&&f.applyWidget(b,a)};f.getData=function(b,a,c){var d="";b=g(b);var e,f;if(!b.length)return"";e=g.metadata?b.metadata():!1;f=" "+(b.attr("class")||"");"undefined"!==typeof b.data(c)||"undefined"!==typeof b.data(c.toLowerCase())?d+=b.data(c)||b.data(c.toLowerCase()):e&&"undefined"!==typeof e[c]?d+=e[c]:a&&"undefined"!==typeof a[c]?d+=a[c]:" "!==f&&f.match(" "+c+"-")&&(d=f.match(new RegExp("\\s"+c+"-([\\w-]+)"))[1]||"");return g.trim(d)}; f.formatFloat=function(b,a){if("string"!==typeof b||""===b)return b;var c;b=(a&&a.config?!1!==a.config.usNumberFormat:"undefined"!==typeof a?a:1)?b.replace(/,/g,""):b.replace(/[\s|\.]/g,"").replace(/,/g,".");/^\s*\([.\d]+\)/.test(b)&&(b=b.replace(/^\s*\(([.\d]+)\)/,"-$1"));c=parseFloat(b);return isNaN(c)?g.trim(b):c};f.isDigit=function(b){return isNaN(b)?/^[\-+(]?\d+[)]?$/.test(b.toString().replace(/[,.'"\s]/g,"")):!0}}});var n=g.tablesorter;g.fn.extend({tablesorter:n.construct});n.addParser({id:"no-parser", is:function(){return!1},format:function(){return""},type:"text"});n.addParser({id:"text",is:function(){return!0},format:function(d,v){var p=v.config;d&&(d=g.trim(p.ignoreCase?d.toLocaleLowerCase():d),d=p.sortLocaleCompare?n.replaceAccents(d):d);return d},type:"text"});n.addParser({id:"digit",is:function(d){return n.isDigit(d)},format:function(d,v){var p=n.formatFloat((d||"").replace(/[^\w,. \-()]/g,""),v);return d&&"number"===typeof p?p:d?g.trim(d&&v.config.ignoreCase?d.toLocaleLowerCase():d):d}, type:"numeric"});n.addParser({id:"currency",is:function(d){return/^\(?\d+[\u00a3$\u20ac\u00a4\u00a5\u00a2?.]|[\u00a3$\u20ac\u00a4\u00a5\u00a2?.]\d+\)?$/.test((d||"").replace(/[+\-,. ]/g,""))},format:function(d,v){var p=n.formatFloat((d||"").replace(/[^\w,. \-()]/g,""),v);return d&&"number"===typeof p?p:d?g.trim(d&&v.config.ignoreCase?d.toLocaleLowerCase():d):d},type:"numeric"});n.addParser({id:"ipAddress",is:function(d){return/^\d{1,3}[\.]\d{1,3}[\.]\d{1,3}[\.]\d{1,3}$/.test(d)},format:function(d, g){var p,w=d?d.split("."):"",t="",x=w.length;for(p=0;p<x;p++)t+=("00"+w[p]).slice(-3);return d?n.formatFloat(t,g):d},type:"numeric"});n.addParser({id:"url",is:function(d){return/^(https?|ftp|file):\/\//.test(d)},format:function(d){return d?g.trim(d.replace(/(https?|ftp|file):\/\//,"")):d},type:"text"});n.addParser({id:"isoDate",is:function(d){return/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/.test(d)},format:function(d,g){return d?n.formatFloat(""!==d?(new Date(d.replace(/-/g,"/"))).getTime()||d:"",g):d},type:"numeric"}); n.addParser({id:"percent",is:function(d){return/(\d\s*?%|%\s*?\d)/.test(d)&&15>d.length},format:function(d,g){return d?n.formatFloat(d.replace(/%/g,""),g):d},type:"numeric"});n.addParser({id:"usLongDate",is:function(d){return/^[A-Z]{3,10}\.?\s+\d{1,2},?\s+(\d{4})(\s+\d{1,2}:\d{2}(:\d{2})?(\s+[AP]M)?)?$/i.test(d)||/^\d{1,2}\s+[A-Z]{3,10}\s+\d{4}/i.test(d)},format:function(d,g){return d?n.formatFloat((new Date(d.replace(/(\S)([AP]M)$/i,"$1 $2"))).getTime()||d,g):d},type:"numeric"});n.addParser({id:"shortDate", is:function(d){return/(^\d{1,2}[\/\s]\d{1,2}[\/\s]\d{4})|(^\d{4}[\/\s]\d{1,2}[\/\s]\d{1,2})/.test((d||"").replace(/\s+/g," ").replace(/[\-.,]/g,"/"))},format:function(d,g,p,w){if(d){p=g.config;var t=p.$headers.filter("[data-column="+w+"]:last");w=t.length&&t[0].dateFormat||n.getData(t,n.getColumnData(g,p.headers,w),"dateFormat")||p.dateFormat;d=d.replace(/\s+/g," ").replace(/[\-.,]/g,"/");"mmddyyyy"===w?d=d.replace(/(\d{1,2})[\/\s](\d{1,2})[\/\s](\d{4})/,"$3/$1/$2"):"ddmmyyyy"===w?d=d.replace(/(\d{1,2})[\/\s](\d{1,2})[\/\s](\d{4})/, "$3/$2/$1"):"yyyymmdd"===w&&(d=d.replace(/(\d{4})[\/\s](\d{1,2})[\/\s](\d{1,2})/,"$1/$2/$3"))}return d?n.formatFloat((new Date(d)).getTime()||d,g):d},type:"numeric"});n.addParser({id:"time",is:function(d){return/^(([0-2]?\d:[0-5]\d)|([0-1]?\d:[0-5]\d\s?([AP]M)))$/i.test(d)},format:function(d,g){return d?n.formatFloat((new Date("2000/01/01 "+d.replace(/(\S)([AP]M)$/i,"$1 $2"))).getTime()||d,g):d},type:"numeric"});n.addParser({id:"metadata",is:function(){return!1},format:function(d,n,p){d=n.config; d=d.parserMetadataName?d.parserMetadataName:"sortValue";return g(p).metadata()[d]},type:"numeric"});n.addWidget({id:"zebra",priority:90,format:function(d,v,p){var w,t,x,z,C,D,E=new RegExp(v.cssChildRow,"i"),B=v.$tbodies;v.debug&&(C=new Date);for(d=0;d<B.length;d++)w=B.eq(d),D=w.children("tr").length,1<D&&(x=0,w=w.children("tr:visible").not(v.selectorRemove),w.each(function(){t=g(this);E.test(this.className)||x++;z=0===x%2;t.removeClass(p.zebra[z?1:0]).addClass(p.zebra[z?0:1])}));v.debug&&n.benchmark("Applying Zebra widget", C)},remove:function(d,n,p){var w;n=n.$tbodies;var t=(p.zebra||["even","odd"]).join(" ");for(p=0;p<n.length;p++)w=g.tablesorter.processTbody(d,n.eq(p),!0),w.children().removeClass(t),g.tablesorter.processTbody(d,w,!1)}})}(jQuery);


/*!
	Colorbox v1.4.32 - 2013-10-16
	jQuery lightbox and modal window plugin
	(c) 2013 Jack Moore - http://www.jacklmoore.com/colorbox
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function(e,t,i){function o(i,o,n){var r=t.createElement(i);return o&&(r.id=Z+o),n&&(r.style.cssText=n),e(r)}function n(){return i.innerHeight?i.innerHeight:e(i).height()}function r(e){var t=k.length,i=(z+e)%t;return 0>i?t+i:i}function h(e,t){return Math.round((/%/.test(e)?("x"===t?E.width():n())/100:1)*parseInt(e,10))}function s(e,t){return e.photo||e.photoRegex.test(t)}function l(e,t){return e.retinaUrl&&i.devicePixelRatio>1?t.replace(e.photoRegex,e.retinaSuffix):t}function a(e){"contains"in g[0]&&!g[0].contains(e.target)&&(e.stopPropagation(),g.focus())}function d(){var t,i=e.data(N,Y);null==i?(B=e.extend({},X),console&&console.log&&console.log("Error: cboxElement missing settings object")):B=e.extend({},i);for(t in B)e.isFunction(B[t])&&"on"!==t.slice(0,2)&&(B[t]=B[t].call(N));B.rel=B.rel||N.rel||e(N).data("rel")||"nofollow",B.href=B.href||e(N).attr("href"),B.title=B.title||N.title,"string"==typeof B.href&&(B.href=e.trim(B.href))}function c(i,o){e(t).trigger(i),st.trigger(i),e.isFunction(o)&&o.call(N)}function u(i){q||(N=i,d(),k=e(N),z=0,"nofollow"!==B.rel&&(k=e("."+et).filter(function(){var t,i=e.data(this,Y);return i&&(t=e(this).data("rel")||i.rel||this.rel),t===B.rel}),z=k.index(N),-1===z&&(k=k.add(N),z=k.length-1)),w.css({opacity:parseFloat(B.opacity),cursor:B.overlayClose?"pointer":"auto",visibility:"visible"}).show(),J&&g.add(w).removeClass(J),B.className&&g.add(w).addClass(B.className),J=B.className,B.closeButton?K.html(B.close).appendTo(y):K.appendTo("<div/>"),U||(U=$=!0,g.css({visibility:"hidden",display:"block"}),H=o(lt,"LoadedContent","width:0; height:0; overflow:hidden"),y.css({width:"",height:""}).append(H),O=x.height()+C.height()+y.outerHeight(!0)-y.height(),_=b.width()+T.width()+y.outerWidth(!0)-y.width(),D=H.outerHeight(!0),A=H.outerWidth(!0),B.w=h(B.initialWidth,"x"),B.h=h(B.initialHeight,"y"),H.css({width:"",height:B.h}),Q.position(),c(tt,B.onOpen),P.add(L).hide(),g.focus(),B.trapFocus&&t.addEventListener&&(t.addEventListener("focus",a,!0),st.one(rt,function(){t.removeEventListener("focus",a,!0)})),B.returnFocus&&st.one(rt,function(){e(N).focus()})),m())}function f(){!g&&t.body&&(V=!1,E=e(i),g=o(lt).attr({id:Y,"class":e.support.opacity===!1?Z+"IE":"",role:"dialog",tabindex:"-1"}).hide(),w=o(lt,"Overlay").hide(),F=e([o(lt,"LoadingOverlay")[0],o(lt,"LoadingGraphic")[0]]),v=o(lt,"Wrapper"),y=o(lt,"Content").append(L=o(lt,"Title"),S=o(lt,"Current"),I=e('<button type="button"/>').attr({id:Z+"Previous"}),R=e('<button type="button"/>').attr({id:Z+"Next"}),M=o("button","Slideshow"),F),K=e('<button type="button"/>').attr({id:Z+"Close"}),v.append(o(lt).append(o(lt,"TopLeft"),x=o(lt,"TopCenter"),o(lt,"TopRight")),o(lt,!1,"clear:left").append(b=o(lt,"MiddleLeft"),y,T=o(lt,"MiddleRight")),o(lt,!1,"clear:left").append(o(lt,"BottomLeft"),C=o(lt,"BottomCenter"),o(lt,"BottomRight"))).find("div div").css({"float":"left"}),W=o(lt,!1,"position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"),P=R.add(I).add(S).add(M),e(t.body).append(w,g.append(v,W)))}function p(){function i(e){e.which>1||e.shiftKey||e.altKey||e.metaKey||e.ctrlKey||(e.preventDefault(),u(this))}return g?(V||(V=!0,R.click(function(){Q.next()}),I.click(function(){Q.prev()}),K.click(function(){Q.close()}),w.click(function(){B.overlayClose&&Q.close()}),e(t).bind("keydown."+Z,function(e){var t=e.keyCode;U&&B.escKey&&27===t&&(e.preventDefault(),Q.close()),U&&B.arrowKey&&k[1]&&!e.altKey&&(37===t?(e.preventDefault(),I.click()):39===t&&(e.preventDefault(),R.click()))}),e.isFunction(e.fn.on)?e(t).on("click."+Z,"."+et,i):e("."+et).live("click."+Z,i)),!0):!1}function m(){var n,r,a,u=Q.prep,f=++at;$=!0,j=!1,N=k[z],d(),c(ht),c(it,B.onLoad),B.h=B.height?h(B.height,"y")-D-O:B.innerHeight&&h(B.innerHeight,"y"),B.w=B.width?h(B.width,"x")-A-_:B.innerWidth&&h(B.innerWidth,"x"),B.mw=B.w,B.mh=B.h,B.maxWidth&&(B.mw=h(B.maxWidth,"x")-A-_,B.mw=B.w&&B.w<B.mw?B.w:B.mw),B.maxHeight&&(B.mh=h(B.maxHeight,"y")-D-O,B.mh=B.h&&B.h<B.mh?B.h:B.mh),n=B.href,G=setTimeout(function(){F.show()},100),B.inline?(a=o(lt).hide().insertBefore(e(n)[0]),st.one(ht,function(){a.replaceWith(H.children())}),u(e(n))):B.iframe?u(" "):B.html?u(B.html):s(B,n)?(n=l(B,n),j=t.createElement("img"),e(j).addClass(Z+"Photo").bind("error",function(){B.title=!1,u(o(lt,"Error").html(B.imgError))}).one("load",function(){var t;f===at&&(e.each(["alt","longdesc","aria-describedby"],function(t,i){var o=e(N).attr(i)||e(N).attr("data-"+i);o&&j.setAttribute(i,o)}),B.retinaImage&&i.devicePixelRatio>1&&(j.height=j.height/i.devicePixelRatio,j.width=j.width/i.devicePixelRatio),B.scalePhotos&&(r=function(){j.height-=j.height*t,j.width-=j.width*t},B.mw&&j.width>B.mw&&(t=(j.width-B.mw)/j.width,r()),B.mh&&j.height>B.mh&&(t=(j.height-B.mh)/j.height,r())),B.h&&(j.style.marginTop=Math.max(B.mh-j.height,0)/2+"px"),k[1]&&(B.loop||k[z+1])&&(j.style.cursor="pointer",j.onclick=function(){Q.next()}),j.style.width=j.width+"px",j.style.height=j.height+"px",setTimeout(function(){u(j)},1))}),setTimeout(function(){j.src=n},1)):n&&W.load(n,B.data,function(t,i){f===at&&u("error"===i?o(lt,"Error").html(B.xhrError):e(this).contents())})}var w,g,v,y,x,b,T,C,k,E,H,W,F,L,S,M,R,I,K,P,B,O,_,D,A,N,z,j,U,$,q,G,Q,J,V,X={html:!1,photo:!1,iframe:!1,inline:!1,transition:"elastic",speed:300,fadeOut:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,href:!1,title:!1,rel:!1,opacity:.9,preloading:!0,className:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:void 0,closeButton:!0,fastIframe:!0,open:!1,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",photoRegex:/\.(gif|png|jp(e|g|eg)|bmp|ico|webp)((#|\?).*)?$/i,retinaImage:!1,retinaUrl:!1,retinaSuffix:"@2x.$1",current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",returnFocus:!0,trapFocus:!0,onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1},Y="colorbox",Z="cbox",et=Z+"Element",tt=Z+"_open",it=Z+"_load",ot=Z+"_complete",nt=Z+"_cleanup",rt=Z+"_closed",ht=Z+"_purge",st=e("<a/>"),lt="div",at=0,dt={},ct=function(){function e(){clearTimeout(h)}function t(){(B.loop||k[z+1])&&(e(),h=setTimeout(Q.next,B.slideshowSpeed))}function i(){M.html(B.slideshowStop).unbind(l).one(l,o),st.bind(ot,t).bind(it,e),g.removeClass(s+"off").addClass(s+"on")}function o(){e(),st.unbind(ot,t).unbind(it,e),M.html(B.slideshowStart).unbind(l).one(l,function(){Q.next(),i()}),g.removeClass(s+"on").addClass(s+"off")}function n(){r=!1,M.hide(),e(),st.unbind(ot,t).unbind(it,e),g.removeClass(s+"off "+s+"on")}var r,h,s=Z+"Slideshow_",l="click."+Z;return function(){r?B.slideshow||(st.unbind(nt,n),n()):B.slideshow&&k[1]&&(r=!0,st.one(nt,n),B.slideshowAuto?i():o(),M.show())}}();e.colorbox||(e(f),Q=e.fn[Y]=e[Y]=function(t,i){var o=this;if(t=t||{},f(),p()){if(e.isFunction(o))o=e("<a/>"),t.open=!0;else if(!o[0])return o;i&&(t.onComplete=i),o.each(function(){e.data(this,Y,e.extend({},e.data(this,Y)||X,t))}).addClass(et),(e.isFunction(t.open)&&t.open.call(o)||t.open)&&u(o[0])}return o},Q.position=function(t,i){function o(){x[0].style.width=C[0].style.width=y[0].style.width=parseInt(g[0].style.width,10)-_+"px",y[0].style.height=b[0].style.height=T[0].style.height=parseInt(g[0].style.height,10)-O+"px"}var r,s,l,a=0,d=0,c=g.offset();if(E.unbind("resize."+Z),g.css({top:-9e4,left:-9e4}),s=E.scrollTop(),l=E.scrollLeft(),B.fixed?(c.top-=s,c.left-=l,g.css({position:"fixed"})):(a=s,d=l,g.css({position:"absolute"})),d+=B.right!==!1?Math.max(E.width()-B.w-A-_-h(B.right,"x"),0):B.left!==!1?h(B.left,"x"):Math.round(Math.max(E.width()-B.w-A-_,0)/2),a+=B.bottom!==!1?Math.max(n()-B.h-D-O-h(B.bottom,"y"),0):B.top!==!1?h(B.top,"y"):Math.round(Math.max(n()-B.h-D-O,0)/2),g.css({top:c.top,left:c.left,visibility:"visible"}),v[0].style.width=v[0].style.height="9999px",r={width:B.w+A+_,height:B.h+D+O,top:a,left:d},t){var u=0;e.each(r,function(e){return r[e]!==dt[e]?(u=t,void 0):void 0}),t=u}dt=r,t||g.css(r),g.dequeue().animate(r,{duration:t||0,complete:function(){o(),$=!1,v[0].style.width=B.w+A+_+"px",v[0].style.height=B.h+D+O+"px",B.reposition&&setTimeout(function(){E.bind("resize."+Z,Q.position)},1),i&&i()},step:o})},Q.resize=function(e){var t;U&&(e=e||{},e.width&&(B.w=h(e.width,"x")-A-_),e.innerWidth&&(B.w=h(e.innerWidth,"x")),H.css({width:B.w}),e.height&&(B.h=h(e.height,"y")-D-O),e.innerHeight&&(B.h=h(e.innerHeight,"y")),e.innerHeight||e.height||(t=H.scrollTop(),H.css({height:"auto"}),B.h=H.height()),H.css({height:B.h}),t&&H.scrollTop(t),Q.position("none"===B.transition?0:B.speed))},Q.prep=function(i){function n(){return B.w=B.w||H.width(),B.w=B.mw&&B.mw<B.w?B.mw:B.w,B.w}function h(){return B.h=B.h||H.height(),B.h=B.mh&&B.mh<B.h?B.mh:B.h,B.h}if(U){var a,d="none"===B.transition?0:B.speed;H.empty().remove(),H=o(lt,"LoadedContent").append(i),H.hide().appendTo(W.show()).css({width:n(),overflow:B.scrolling?"auto":"hidden"}).css({height:h()}).prependTo(y),W.hide(),e(j).css({"float":"none"}),a=function(){function i(){e.support.opacity===!1&&g[0].style.removeAttribute("filter")}var n,h,a=k.length,u="frameBorder",f="allowTransparency";U&&(h=function(){clearTimeout(G),F.hide(),c(ot,B.onComplete)},L.html(B.title).add(H).show(),a>1?("string"==typeof B.current&&S.html(B.current.replace("{current}",z+1).replace("{total}",a)).show(),R[B.loop||a-1>z?"show":"hide"]().html(B.next),I[B.loop||z?"show":"hide"]().html(B.previous),ct(),B.preloading&&e.each([r(-1),r(1)],function(){var i,o,n=k[this],r=e.data(n,Y);r&&r.href?(i=r.href,e.isFunction(i)&&(i=i.call(n))):i=e(n).attr("href"),i&&s(r,i)&&(i=l(r,i),o=t.createElement("img"),o.src=i)})):P.hide(),B.iframe?(n=o("iframe")[0],u in n&&(n[u]=0),f in n&&(n[f]="true"),B.scrolling||(n.scrolling="no"),e(n).attr({src:B.href,name:(new Date).getTime(),"class":Z+"Iframe",allowFullScreen:!0,webkitAllowFullScreen:!0,mozallowfullscreen:!0}).one("load",h).appendTo(H),st.one(ht,function(){n.src="//about:blank"}),B.fastIframe&&e(n).trigger("load")):h(),"fade"===B.transition?g.fadeTo(d,1,i):i())},"fade"===B.transition?g.fadeTo(d,0,function(){Q.position(0,a)}):Q.position(d,a)}},Q.next=function(){!$&&k[1]&&(B.loop||k[z+1])&&(z=r(1),u(k[z]))},Q.prev=function(){!$&&k[1]&&(B.loop||z)&&(z=r(-1),u(k[z]))},Q.close=function(){U&&!q&&(q=!0,U=!1,c(nt,B.onCleanup),E.unbind("."+Z),w.fadeTo(B.fadeOut||0,0),g.stop().fadeTo(B.fadeOut||0,0,function(){g.add(w).css({opacity:1,cursor:"auto"}).hide(),c(ht),H.empty().remove(),setTimeout(function(){q=!1,c(rt,B.onClosed)},1)}))},Q.remove=function(){g&&(g.stop(),e.colorbox.close(),g.stop().remove(),w.remove(),q=!1,g=null,e("."+et).removeData(Y).removeClass(et),e(t).unbind("click."+Z))},Q.element=function(){return e(N)},Q.settings=X)})(jQuery,document,window);

/* Chosen v1.1.0 | (c) 2011-2013 by Harvest | MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md */
!function(){var a,AbstractChosen,Chosen,SelectParser,b,c={}.hasOwnProperty,d=function(a,b){function d(){this.constructor=a}for(var e in b)c.call(b,e)&&(a[e]=b[e]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a};SelectParser=function(){function SelectParser(){this.options_index=0,this.parsed=[]}return SelectParser.prototype.add_node=function(a){return"OPTGROUP"===a.nodeName.toUpperCase()?this.add_group(a):this.add_option(a)},SelectParser.prototype.add_group=function(a){var b,c,d,e,f,g;for(b=this.parsed.length,this.parsed.push({array_index:b,group:!0,label:this.escapeExpression(a.label),children:0,disabled:a.disabled}),f=a.childNodes,g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(this.add_option(c,b,a.disabled));return g},SelectParser.prototype.add_option=function(a,b,c){return"OPTION"===a.nodeName.toUpperCase()?(""!==a.text?(null!=b&&(this.parsed[b].children+=1),this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,value:a.value,text:a.text,html:a.innerHTML,selected:a.selected,disabled:c===!0?c:a.disabled,group_array_index:b,classes:a.className,style:a.style.cssText})):this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,empty:!0}),this.options_index+=1):void 0},SelectParser.prototype.escapeExpression=function(a){var b,c;return null==a||a===!1?"":/[\&\<\>\"\'\`]/.test(a)?(b={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},c=/&(?!\w+;)|[\<\>\"\'\`]/g,a.replace(c,function(a){return b[a]||"&amp;"})):a},SelectParser}(),SelectParser.select_to_array=function(a){var b,c,d,e,f;for(c=new SelectParser,f=a.childNodes,d=0,e=f.length;e>d;d++)b=f[d],c.add_node(b);return c.parsed},AbstractChosen=function(){function AbstractChosen(a,b){this.form_field=a,this.options=null!=b?b:{},AbstractChosen.browser_is_supported()&&(this.is_multiple=this.form_field.multiple,this.set_default_text(),this.set_default_values(),this.setup(),this.set_up_html(),this.register_observers())}return AbstractChosen.prototype.set_default_values=function(){var a=this;return this.click_test_action=function(b){return a.test_active_click(b)},this.activate_action=function(b){return a.activate_field(b)},this.active_field=!1,this.mouse_on_container=!1,this.results_showing=!1,this.result_highlighted=null,this.allow_single_deselect=null!=this.options.allow_single_deselect&&null!=this.form_field.options[0]&&""===this.form_field.options[0].text?this.options.allow_single_deselect:!1,this.disable_search_threshold=this.options.disable_search_threshold||0,this.disable_search=this.options.disable_search||!1,this.enable_split_word_search=null!=this.options.enable_split_word_search?this.options.enable_split_word_search:!0,this.group_search=null!=this.options.group_search?this.options.group_search:!0,this.search_contains=this.options.search_contains||!1,this.single_backstroke_delete=null!=this.options.single_backstroke_delete?this.options.single_backstroke_delete:!0,this.max_selected_options=this.options.max_selected_options||1/0,this.inherit_select_classes=this.options.inherit_select_classes||!1,this.display_selected_options=null!=this.options.display_selected_options?this.options.display_selected_options:!0,this.display_disabled_options=null!=this.options.display_disabled_options?this.options.display_disabled_options:!0},AbstractChosen.prototype.set_default_text=function(){return this.default_text=this.form_field.getAttribute("data-placeholder")?this.form_field.getAttribute("data-placeholder"):this.is_multiple?this.options.placeholder_text_multiple||this.options.placeholder_text||AbstractChosen.default_multiple_text:this.options.placeholder_text_single||this.options.placeholder_text||AbstractChosen.default_single_text,this.results_none_found=this.form_field.getAttribute("data-no_results_text")||this.options.no_results_text||AbstractChosen.default_no_result_text},AbstractChosen.prototype.mouse_enter=function(){return this.mouse_on_container=!0},AbstractChosen.prototype.mouse_leave=function(){return this.mouse_on_container=!1},AbstractChosen.prototype.input_focus=function(){var a=this;if(this.is_multiple){if(!this.active_field)return setTimeout(function(){return a.container_mousedown()},50)}else if(!this.active_field)return this.activate_field()},AbstractChosen.prototype.input_blur=function(){var a=this;return this.mouse_on_container?void 0:(this.active_field=!1,setTimeout(function(){return a.blur_test()},100))},AbstractChosen.prototype.results_option_build=function(a){var b,c,d,e,f;for(b="",f=this.results_data,d=0,e=f.length;e>d;d++)c=f[d],b+=c.group?this.result_add_group(c):this.result_add_option(c),(null!=a?a.first:void 0)&&(c.selected&&this.is_multiple?this.choice_build(c):c.selected&&!this.is_multiple&&this.single_set_selected_text(c.text));return b},AbstractChosen.prototype.result_add_option=function(a){var b,c;return a.search_match?this.include_option_in_results(a)?(b=[],a.disabled||a.selected&&this.is_multiple||b.push("active-result"),!a.disabled||a.selected&&this.is_multiple||b.push("disabled-result"),a.selected&&b.push("result-selected"),null!=a.group_array_index&&b.push("group-option"),""!==a.classes&&b.push(a.classes),c=document.createElement("li"),c.className=b.join(" "),c.style.cssText=a.style,c.setAttribute("data-option-array-index",a.array_index),c.innerHTML=a.search_text,this.outerHTML(c)):"":""},AbstractChosen.prototype.result_add_group=function(a){var b;return a.search_match||a.group_match?a.active_options>0?(b=document.createElement("li"),b.className="group-result",b.innerHTML=a.search_text,this.outerHTML(b)):"":""},AbstractChosen.prototype.results_update_field=function(){return this.set_default_text(),this.is_multiple||this.results_reset_cleanup(),this.result_clear_highlight(),this.results_build(),this.results_showing?this.winnow_results():void 0},AbstractChosen.prototype.reset_single_select_options=function(){var a,b,c,d,e;for(d=this.results_data,e=[],b=0,c=d.length;c>b;b++)a=d[b],a.selected?e.push(a.selected=!1):e.push(void 0);return e},AbstractChosen.prototype.results_toggle=function(){return this.results_showing?this.results_hide():this.results_show()},AbstractChosen.prototype.results_search=function(){return this.results_showing?this.winnow_results():this.results_show()},AbstractChosen.prototype.winnow_results=function(){var a,b,c,d,e,f,g,h,i,j,k,l,m;for(this.no_results_clear(),e=0,g=this.get_search_text(),a=g.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),d=this.search_contains?"":"^",c=new RegExp(d+a,"i"),j=new RegExp(a,"i"),m=this.results_data,k=0,l=m.length;l>k;k++)b=m[k],b.search_match=!1,f=null,this.include_option_in_results(b)&&(b.group&&(b.group_match=!1,b.active_options=0),null!=b.group_array_index&&this.results_data[b.group_array_index]&&(f=this.results_data[b.group_array_index],0===f.active_options&&f.search_match&&(e+=1),f.active_options+=1),(!b.group||this.group_search)&&(b.search_text=b.group?b.label:b.html,b.search_match=this.search_string_match(b.search_text,c),b.search_match&&!b.group&&(e+=1),b.search_match?(g.length&&(h=b.search_text.search(j),i=b.search_text.substr(0,h+g.length)+"</em>"+b.search_text.substr(h+g.length),b.search_text=i.substr(0,h)+"<em>"+i.substr(h)),null!=f&&(f.group_match=!0)):null!=b.group_array_index&&this.results_data[b.group_array_index].search_match&&(b.search_match=!0)));return this.result_clear_highlight(),1>e&&g.length?(this.update_results_content(""),this.no_results(g)):(this.update_results_content(this.results_option_build()),this.winnow_results_set_highlight())},AbstractChosen.prototype.search_string_match=function(a,b){var c,d,e,f;if(b.test(a))return!0;if(this.enable_split_word_search&&(a.indexOf(" ")>=0||0===a.indexOf("["))&&(d=a.replace(/\[|\]/g,"").split(" "),d.length))for(e=0,f=d.length;f>e;e++)if(c=d[e],b.test(c))return!0},AbstractChosen.prototype.choices_count=function(){var a,b,c,d;if(null!=this.selected_option_count)return this.selected_option_count;for(this.selected_option_count=0,d=this.form_field.options,b=0,c=d.length;c>b;b++)a=d[b],a.selected&&(this.selected_option_count+=1);return this.selected_option_count},AbstractChosen.prototype.choices_click=function(a){return a.preventDefault(),this.results_showing||this.is_disabled?void 0:this.results_show()},AbstractChosen.prototype.keyup_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),b){case 8:if(this.is_multiple&&this.backstroke_length<1&&this.choices_count()>0)return this.keydown_backstroke();if(!this.pending_backstroke)return this.result_clear_highlight(),this.results_search();break;case 13:if(a.preventDefault(),this.results_showing)return this.result_select(a);break;case 27:return this.results_showing&&this.results_hide(),!0;case 9:case 38:case 40:case 16:case 91:case 17:break;default:return this.results_search()}},AbstractChosen.prototype.clipboard_event_checker=function(){var a=this;return setTimeout(function(){return a.results_search()},50)},AbstractChosen.prototype.container_width=function(){return null!=this.options.width?this.options.width:""+this.form_field.offsetWidth+"px"},AbstractChosen.prototype.include_option_in_results=function(a){return this.is_multiple&&!this.display_selected_options&&a.selected?!1:!this.display_disabled_options&&a.disabled?!1:a.empty?!1:!0},AbstractChosen.prototype.search_results_touchstart=function(a){return this.touch_started=!0,this.search_results_mouseover(a)},AbstractChosen.prototype.search_results_touchmove=function(a){return this.touch_started=!1,this.search_results_mouseout(a)},AbstractChosen.prototype.search_results_touchend=function(a){return this.touch_started?this.search_results_mouseup(a):void 0},AbstractChosen.prototype.outerHTML=function(a){var b;return a.outerHTML?a.outerHTML:(b=document.createElement("div"),b.appendChild(a),b.innerHTML)},AbstractChosen.browser_is_supported=function(){return"Microsoft Internet Explorer"===window.navigator.appName?document.documentMode>=8:/iP(od|hone)/i.test(window.navigator.userAgent)?!1:/Android/i.test(window.navigator.userAgent)&&/Mobile/i.test(window.navigator.userAgent)?!1:!0},AbstractChosen.default_multiple_text="Select Some Options",AbstractChosen.default_single_text="Select an Option",AbstractChosen.default_no_result_text="No results match",AbstractChosen}(),a=jQuery,a.fn.extend({chosen:function(b){return AbstractChosen.browser_is_supported()?this.each(function(){var c,d;c=a(this),d=c.data("chosen"),"destroy"===b&&d?d.destroy():d||c.data("chosen",new Chosen(this,b))}):this}}),Chosen=function(c){function Chosen(){return b=Chosen.__super__.constructor.apply(this,arguments)}return d(Chosen,c),Chosen.prototype.setup=function(){return this.form_field_jq=a(this.form_field),this.current_selectedIndex=this.form_field.selectedIndex,this.is_rtl=this.form_field_jq.hasClass("chosen-rtl")},Chosen.prototype.set_up_html=function(){var b,c;return b=["chosen-container"],b.push("chosen-container-"+(this.is_multiple?"multi":"single")),this.inherit_select_classes&&this.form_field.className&&b.push(this.form_field.className),this.is_rtl&&b.push("chosen-rtl"),c={"class":b.join(" "),style:"width: "+this.container_width()+";",title:this.form_field.title},this.form_field.id.length&&(c.id=this.form_field.id.replace(/[^\w]/g,"_")+"_chosen"),this.container=a("<div />",c),this.is_multiple?this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="'+this.default_text+'" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>'):this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>'+this.default_text+'</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>'),this.form_field_jq.hide().after(this.container),this.dropdown=this.container.find("div.chosen-drop").first(),this.search_field=this.container.find("input").first(),this.search_results=this.container.find("ul.chosen-results").first(),this.search_field_scale(),this.search_no_results=this.container.find("li.no-results").first(),this.is_multiple?(this.search_choices=this.container.find("ul.chosen-choices").first(),this.search_container=this.container.find("li.search-field").first()):(this.search_container=this.container.find("div.chosen-search").first(),this.selected_item=this.container.find(".chosen-single").first()),this.results_build(),this.set_tab_index(),this.set_label_behavior(),this.form_field_jq.trigger("chosen:ready",{chosen:this})},Chosen.prototype.register_observers=function(){var a=this;return this.container.bind("mousedown.chosen",function(b){a.container_mousedown(b)}),this.container.bind("mouseup.chosen",function(b){a.container_mouseup(b)}),this.container.bind("mouseenter.chosen",function(b){a.mouse_enter(b)}),this.container.bind("mouseleave.chosen",function(b){a.mouse_leave(b)}),this.search_results.bind("mouseup.chosen",function(b){a.search_results_mouseup(b)}),this.search_results.bind("mouseover.chosen",function(b){a.search_results_mouseover(b)}),this.search_results.bind("mouseout.chosen",function(b){a.search_results_mouseout(b)}),this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen",function(b){a.search_results_mousewheel(b)}),this.search_results.bind("touchstart.chosen",function(b){a.search_results_touchstart(b)}),this.search_results.bind("touchmove.chosen",function(b){a.search_results_touchmove(b)}),this.search_results.bind("touchend.chosen",function(b){a.search_results_touchend(b)}),this.form_field_jq.bind("chosen:updated.chosen",function(b){a.results_update_field(b)}),this.form_field_jq.bind("chosen:activate.chosen",function(b){a.activate_field(b)}),this.form_field_jq.bind("chosen:open.chosen",function(b){a.container_mousedown(b)}),this.form_field_jq.bind("chosen:close.chosen",function(b){a.input_blur(b)}),this.search_field.bind("blur.chosen",function(b){a.input_blur(b)}),this.search_field.bind("keyup.chosen",function(b){a.keyup_checker(b)}),this.search_field.bind("keydown.chosen",function(b){a.keydown_checker(b)}),this.search_field.bind("focus.chosen",function(b){a.input_focus(b)}),this.search_field.bind("cut.chosen",function(b){a.clipboard_event_checker(b)}),this.search_field.bind("paste.chosen",function(b){a.clipboard_event_checker(b)}),this.is_multiple?this.search_choices.bind("click.chosen",function(b){a.choices_click(b)}):this.container.bind("click.chosen",function(a){a.preventDefault()})},Chosen.prototype.destroy=function(){return a(this.container[0].ownerDocument).unbind("click.chosen",this.click_test_action),this.search_field[0].tabIndex&&(this.form_field_jq[0].tabIndex=this.search_field[0].tabIndex),this.container.remove(),this.form_field_jq.removeData("chosen"),this.form_field_jq.show()},Chosen.prototype.search_field_disabled=function(){return this.is_disabled=this.form_field_jq[0].disabled,this.is_disabled?(this.container.addClass("chosen-disabled"),this.search_field[0].disabled=!0,this.is_multiple||this.selected_item.unbind("focus.chosen",this.activate_action),this.close_field()):(this.container.removeClass("chosen-disabled"),this.search_field[0].disabled=!1,this.is_multiple?void 0:this.selected_item.bind("focus.chosen",this.activate_action))},Chosen.prototype.container_mousedown=function(b){return this.is_disabled||(b&&"mousedown"===b.type&&!this.results_showing&&b.preventDefault(),null!=b&&a(b.target).hasClass("search-choice-close"))?void 0:(this.active_field?this.is_multiple||!b||a(b.target)[0]!==this.selected_item[0]&&!a(b.target).parents("a.chosen-single").length||(b.preventDefault(),this.results_toggle()):(this.is_multiple&&this.search_field.val(""),a(this.container[0].ownerDocument).bind("click.chosen",this.click_test_action),this.results_show()),this.activate_field())},Chosen.prototype.container_mouseup=function(a){return"ABBR"!==a.target.nodeName||this.is_disabled?void 0:this.results_reset(a)},Chosen.prototype.search_results_mousewheel=function(a){var b;return a.originalEvent&&(b=-a.originalEvent.wheelDelta||a.originalEvent.detail),null!=b?(a.preventDefault(),"DOMMouseScroll"===a.type&&(b=40*b),this.search_results.scrollTop(b+this.search_results.scrollTop())):void 0},Chosen.prototype.blur_test=function(){return!this.active_field&&this.container.hasClass("chosen-container-active")?this.close_field():void 0},Chosen.prototype.close_field=function(){return a(this.container[0].ownerDocument).unbind("click.chosen",this.click_test_action),this.active_field=!1,this.results_hide(),this.container.removeClass("chosen-container-active"),this.clear_backstroke(),this.show_search_field_default(),this.search_field_scale()},Chosen.prototype.activate_field=function(){return this.container.addClass("chosen-container-active"),this.active_field=!0,this.search_field.val(this.search_field.val()),this.search_field.focus()},Chosen.prototype.test_active_click=function(b){var c;return c=a(b.target).closest(".chosen-container"),c.length&&this.container[0]===c[0]?this.active_field=!0:this.close_field()},Chosen.prototype.results_build=function(){return this.parsing=!0,this.selected_option_count=null,this.results_data=SelectParser.select_to_array(this.form_field),this.is_multiple?this.search_choices.find("li.search-choice").remove():this.is_multiple||(this.single_set_selected_text(),this.disable_search||this.form_field.options.length<=this.disable_search_threshold?(this.search_field[0].readOnly=!0,this.container.addClass("chosen-container-single-nosearch")):(this.search_field[0].readOnly=!1,this.container.removeClass("chosen-container-single-nosearch"))),this.update_results_content(this.results_option_build({first:!0})),this.search_field_disabled(),this.show_search_field_default(),this.search_field_scale(),this.parsing=!1},Chosen.prototype.result_do_highlight=function(a){var b,c,d,e,f;if(a.length){if(this.result_clear_highlight(),this.result_highlight=a,this.result_highlight.addClass("highlighted"),d=parseInt(this.search_results.css("maxHeight"),10),f=this.search_results.scrollTop(),e=d+f,c=this.result_highlight.position().top+this.search_results.scrollTop(),b=c+this.result_highlight.outerHeight(),b>=e)return this.search_results.scrollTop(b-d>0?b-d:0);if(f>c)return this.search_results.scrollTop(c)}},Chosen.prototype.result_clear_highlight=function(){return this.result_highlight&&this.result_highlight.removeClass("highlighted"),this.result_highlight=null},Chosen.prototype.results_show=function(){return this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.container.addClass("chosen-with-drop"),this.results_showing=!0,this.search_field.focus(),this.search_field.val(this.search_field.val()),this.winnow_results(),this.form_field_jq.trigger("chosen:showing_dropdown",{chosen:this}))},Chosen.prototype.update_results_content=function(a){return this.search_results.html(a)},Chosen.prototype.results_hide=function(){return this.results_showing&&(this.result_clear_highlight(),this.container.removeClass("chosen-with-drop"),this.form_field_jq.trigger("chosen:hiding_dropdown",{chosen:this})),this.results_showing=!1},Chosen.prototype.set_tab_index=function(){var a;return this.form_field.tabIndex?(a=this.form_field.tabIndex,this.form_field.tabIndex=-1,this.search_field[0].tabIndex=a):void 0},Chosen.prototype.set_label_behavior=function(){var b=this;return this.form_field_label=this.form_field_jq.parents("label"),!this.form_field_label.length&&this.form_field.id.length&&(this.form_field_label=a("label[for='"+this.form_field.id+"']")),this.form_field_label.length>0?this.form_field_label.bind("click.chosen",function(a){return b.is_multiple?b.container_mousedown(a):b.activate_field()}):void 0},Chosen.prototype.show_search_field_default=function(){return this.is_multiple&&this.choices_count()<1&&!this.active_field?(this.search_field.val(this.default_text),this.search_field.addClass("default")):(this.search_field.val(""),this.search_field.removeClass("default"))},Chosen.prototype.search_results_mouseup=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c.length?(this.result_highlight=c,this.result_select(b),this.search_field.focus()):void 0},Chosen.prototype.search_results_mouseover=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c?this.result_do_highlight(c):void 0},Chosen.prototype.search_results_mouseout=function(b){return a(b.target).hasClass("active-result")?this.result_clear_highlight():void 0},Chosen.prototype.choice_build=function(b){var c,d,e=this;return c=a("<li />",{"class":"search-choice"}).html("<span>"+b.html+"</span>"),b.disabled?c.addClass("search-choice-disabled"):(d=a("<a />",{"class":"search-choice-close","data-option-array-index":b.array_index}),d.bind("click.chosen",function(a){return e.choice_destroy_link_click(a)}),c.append(d)),this.search_container.before(c)},Chosen.prototype.choice_destroy_link_click=function(b){return b.preventDefault(),b.stopPropagation(),this.is_disabled?void 0:this.choice_destroy(a(b.target))},Chosen.prototype.choice_destroy=function(a){return this.result_deselect(a[0].getAttribute("data-option-array-index"))?(this.show_search_field_default(),this.is_multiple&&this.choices_count()>0&&this.search_field.val().length<1&&this.results_hide(),a.parents("li").first().remove(),this.search_field_scale()):void 0},Chosen.prototype.results_reset=function(){return this.reset_single_select_options(),this.form_field.options[0].selected=!0,this.single_set_selected_text(),this.show_search_field_default(),this.results_reset_cleanup(),this.form_field_jq.trigger("change"),this.active_field?this.results_hide():void 0},Chosen.prototype.results_reset_cleanup=function(){return this.current_selectedIndex=this.form_field.selectedIndex,this.selected_item.find("abbr").remove()},Chosen.prototype.result_select=function(a){var b,c;return this.result_highlight?(b=this.result_highlight,this.result_clear_highlight(),this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.is_multiple?b.removeClass("active-result"):this.reset_single_select_options(),c=this.results_data[b[0].getAttribute("data-option-array-index")],c.selected=!0,this.form_field.options[c.options_index].selected=!0,this.selected_option_count=null,this.is_multiple?this.choice_build(c):this.single_set_selected_text(c.text),(a.metaKey||a.ctrlKey)&&this.is_multiple||this.results_hide(),this.search_field.val(""),(this.is_multiple||this.form_field.selectedIndex!==this.current_selectedIndex)&&this.form_field_jq.trigger("change",{selected:this.form_field.options[c.options_index].value}),this.current_selectedIndex=this.form_field.selectedIndex,this.search_field_scale())):void 0},Chosen.prototype.single_set_selected_text=function(a){return null==a&&(a=this.default_text),a===this.default_text?this.selected_item.addClass("chosen-default"):(this.single_deselect_control_build(),this.selected_item.removeClass("chosen-default")),this.selected_item.find("span").text(a)},Chosen.prototype.result_deselect=function(a){var b;return b=this.results_data[a],this.form_field.options[b.options_index].disabled?!1:(b.selected=!1,this.form_field.options[b.options_index].selected=!1,this.selected_option_count=null,this.result_clear_highlight(),this.results_showing&&this.winnow_results(),this.form_field_jq.trigger("change",{deselected:this.form_field.options[b.options_index].value}),this.search_field_scale(),!0)},Chosen.prototype.single_deselect_control_build=function(){return this.allow_single_deselect?(this.selected_item.find("abbr").length||this.selected_item.find("span").first().after('<abbr class="search-choice-close"></abbr>'),this.selected_item.addClass("chosen-single-with-deselect")):void 0},Chosen.prototype.get_search_text=function(){return this.search_field.val()===this.default_text?"":a("<div/>").text(a.trim(this.search_field.val())).html()},Chosen.prototype.winnow_results_set_highlight=function(){var a,b;return b=this.is_multiple?[]:this.search_results.find(".result-selected.active-result"),a=b.length?b.first():this.search_results.find(".active-result").first(),null!=a?this.result_do_highlight(a):void 0},Chosen.prototype.no_results=function(b){var c;return c=a('<li class="no-results">'+this.results_none_found+' "<span></span>"</li>'),c.find("span").first().html(b),this.search_results.append(c),this.form_field_jq.trigger("chosen:no_results",{chosen:this})},Chosen.prototype.no_results_clear=function(){return this.search_results.find(".no-results").remove()},Chosen.prototype.keydown_arrow=function(){var a;return this.results_showing&&this.result_highlight?(a=this.result_highlight.nextAll("li.active-result").first())?this.result_do_highlight(a):void 0:this.results_show()},Chosen.prototype.keyup_arrow=function(){var a;return this.results_showing||this.is_multiple?this.result_highlight?(a=this.result_highlight.prevAll("li.active-result"),a.length?this.result_do_highlight(a.first()):(this.choices_count()>0&&this.results_hide(),this.result_clear_highlight())):void 0:this.results_show()},Chosen.prototype.keydown_backstroke=function(){var a;return this.pending_backstroke?(this.choice_destroy(this.pending_backstroke.find("a").first()),this.clear_backstroke()):(a=this.search_container.siblings("li.search-choice").last(),a.length&&!a.hasClass("search-choice-disabled")?(this.pending_backstroke=a,this.single_backstroke_delete?this.keydown_backstroke():this.pending_backstroke.addClass("search-choice-focus")):void 0)},Chosen.prototype.clear_backstroke=function(){return this.pending_backstroke&&this.pending_backstroke.removeClass("search-choice-focus"),this.pending_backstroke=null},Chosen.prototype.keydown_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),8!==b&&this.pending_backstroke&&this.clear_backstroke(),b){case 8:this.backstroke_length=this.search_field.val().length;break;case 9:this.results_showing&&!this.is_multiple&&this.result_select(a),this.mouse_on_container=!1;break;case 13:a.preventDefault();break;case 38:a.preventDefault(),this.keyup_arrow();break;case 40:a.preventDefault(),this.keydown_arrow()}},Chosen.prototype.search_field_scale=function(){var b,c,d,e,f,g,h,i,j;if(this.is_multiple){for(d=0,h=0,f="position:absolute; left: -1000px; top: -1000px; display:none;",g=["font-size","font-style","font-weight","font-family","line-height","text-transform","letter-spacing"],i=0,j=g.length;j>i;i++)e=g[i],f+=e+":"+this.search_field.css(e)+";";return b=a("<div />",{style:f}),b.text(this.search_field.val()),a("body").append(b),h=b.width()+25,b.remove(),c=this.container.outerWidth(),h>c-10&&(h=c-10),this.search_field.css({width:h+"px"})}},Chosen}(AbstractChosen)}.call(this);

