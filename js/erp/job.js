var jobFileListingFun = "";
var showEmailRec = "";
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var alert_success = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-thumbs-o-up"></i><strong>Success!</strong><br>The Tank Plan was successfully created !!!</div>';
var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
var alert_authorise = 'You do not have permission to perform this action.';
$(document).ready(function(){
	$('.save-instruction').hide();
	$('.cancel-instruction').hide();
	getRequestDocList();
	if($('#is-multi-disable').val() == 'yes'){
		$("#cust_code_filter").multiselect({
			enableCaseInsensitiveFiltering: true,
			enableFiltering: true,
			maxHeight: 200,
			buttonWidth: '100%'
		});
		
		$("#cust_code_filter").multiselect('disable');
	}
	
	
	$('#customer_group_job').change(function(e){
		$("#cust_code_filter").val("");
		$("#cust_code_filter").multiselect("refresh");

		if($(this).val() == ""){
			$("#cust_code_filter").multiselect('enable');
		} else {
			$("#cust_code_filter").multiselect('disable');
		}
	});


	$('#form-jobnote-job').submit(function() {
		var data = $(this).serialize();
		
		$.ajax({  
			type: "POST",
			cache: false,
			url: appHome+'/job/common_ajax',
			dataType: "text",
			data: ({
				'action_type':'add_job_note',
				'data': data
			}), 
			success: function(result)
				{ 
					if(result=='1') {
						
						$('#form-jobnotes-feedback').hide().html('<p class="alert alert-success">Job note added</p>').fadeIn();
						$('#form-jobnotes-feedback').delay(3000).slideUp();
						showJobNotesNew($('#notejobid').val(),1);
					} else {
						$('#form-jobnotes-feedback').html(result);
					}
				}  
		});
		return false;
	});

	$('.edit-instruction').click(function() {
		//alert($(this).next('input').attr('id'));
		//alert($(this).next().find('.random_insturctions').val());
		$(this).parent().next().find('.random_insturctions').removeAttr("readonly");
		var instructions = $(this).parent().next().find('.random_insturctions').val();
		$(this).parent().next().find('.save-instruction').show();
		$(this).parent().next().find('.cancel-instruction').show();
		// return false;
	});

	$('.save-instruction').click(function() { 
		var instructions = $(this).parent().find('.random_insturctions').val();
		var ptid  = $(this).data('ptid');
		$.ajax({  
			type: "POST",
			cache: false,
			url: appHome+'/job/common_ajax',
			dataType: "text",
			data: ({
				'action_type':'update_instructions',
				'instructions': instructions,
				'ptid': ptid
			}), 
			success: function(result)
				{ 
					if(result=='success') {
						$('.save-instruction').parent().find('.random_insturctions').prop('readonly', true);
						$('.save-instruction').hide();
						$('.cancel-instruction').hide();
					}
				}  
		});
	});

	$('.cancel-instruction').click(function() { 
		$('.save-instruction').parent().find('.random_insturctions').prop('readonly', true);
		$('.save-instruction').hide();
		$('.cancel-instruction').hide();
	});

	/*  Find the Prev / Next jov info */
	function getprevjobDetails(){

		var jobNo = $("#job_number").val();
		$("#prev_btn_div").html('<div class="text-center"><i class="fa fa-spinner fa-spin" style="font-size:26px"></i></div>');
		$.ajax({  
			type: "POST",
			cache: false,
			url: appHome+'/job-cost/common_ajax',
			dataType: "json",
			data: ({
				'action_type':'find_prev_next_job',
				'job_no': jobNo,
			}), 
			success: function(result)
				{ 
					var prevNo = result.previous_job;
					var nextNo = result.next_job;
					var prevDiv = "",nextDiv = "", planNos = "";

					if(prevNo != "-"){
						var prevDiv = 'href="'+appHome+'/job/'+result.previous_job+'/detail"';
						planNos += result.previous_job+',';
					}
					planNos += jobNo+',';
					if(nextNo != "-"){
						var nextDiv = 'href="'+appHome+'/job/'+result.next_job+'/detail"';
						planNos += result.next_job+',';
					}
					planNos = planNos.replace(/,*$/, "");
					var res =   '<a '+prevDiv+' target="_blank">'
								    +'<span class="badge badge-pill badge-secondary p-n-span" style="min-width: 110px;text-align: left;padding-bottom: 1px">Prev Job : <span class="prev_job_name">'+result.previous_job+'</span></span>'
								+'</a>&nbsp;'
								+'<a '+nextDiv+' target="_blank">'
								    +'<span class="badge badge-pill badge-secondary p-n-span" style="min-width: 110px;text-align: left;padding-bottom: 1px">Next Job : <span class="prev_job_name">'+result.next_job+'</span></span>'
								+'</a>&nbsp;'
								+'<a href="'+appHome+'/tank/index?period-filter=&amp;jobno-filer='+planNos+'" target="_blank">'
								    +'<span class="badge badge-pill badge-secondary p-n-span" style="min-width: 110px;text-align: center;padding-bottom: 1px;">Tank Plan</span>'
								+'</a>';
					$('#prev_btn_div').html(res);
				}  
		});
	}

	function showPlanTableByAjax(job_num, $showlastplan){
		$.ajax({  
			type: "POST", 
			cache: false, 
			url: appHome+'/job/common_ajax',
			dataType: "html",
			data: ({
				'action_type':'show_tank_plan',
				'job_num':job_num
			}),
			success: function(result){ 
				$('#oncarriagejobtable').hide().html(result).fadeIn('slow');
				getDamagedIcon();
				$('.booked-status').chosen({allow_single_deselect: false}).trigger("chosen:updated");
				$('.booked-status').next('.chosen-container-single').css({"width":"100%"});
			},
			error: function(){
				$('#oncarriagejobtable').hide().html('<p class="error">Sorry but an unexpected error occured.</p>').fadeIn('slow');
			}
		});	
		return false;
	}

	/*  Display Job Notes table on Job page */
	function showJobNotesNew(jobid, $showlastNote) 
	{
		$.ajax({  
			type: "POST", 
			cache: false, 
			url: appHome+'/job/common_ajax',
			dataType: "html",
			data: ({
				'action_type':'show_job_notes',
				'id':jobid
			}),
			success: function(result)
				{ 
					$('#job_notes_table').hide().html(result).fadeIn('slow');
					$("#jobnote").val('');
					if($showlastNote == 1){
						$("#job_notes_table .table tr:last td").css("background-color", "#dff0d8");
					}
				},
			error: function()
				{
					$('#job_notes_table').hide().html('<p class="error">Sorry but an unexpected error occured.</p>').fadeIn('slow');
				}

		});	
		
		return false;	
	}

	jobFileListingFun = function($uploaded){
		var $job_number = $("#job_number").val() ;

		if($uploaded == 1){
			$("#form-btn-colorbox").html('<i class="fa fa-refresh fa-spin"></i> Refreshing file list').attr("disabled")
			$("#form-btn-colorbox").prop('disabled', true);
		}
		$("#files_btn_div_list").html(ajaxLoader);
		$.ajax({
				type: "POST",
				cache: false,
				url: appHome+'/job/common_ajax',
				dataType: "text",
				data: ({
					'action_type':'job_file_list',
					'job_num': $job_number
				}), 
				success: function(result)
				{ 
					$("#files_btn_div_list").html(result);
					resetUploadBar();

					$("#form-btn-colorbox").colorbox({href: function(){
						var url = $(this).parents('form').data('target');
						var ser = $(this).parents('form').serialize();
				    return url+'?'+ser;
					}, width:'80%', height:"90%", iframe:true});

					$('a.colorbox').colorbox({iframe:true, width:'80%', height:'90%'});

					if($uploaded == 1){
						$("#form-email-files .table tr:nth-last-child(2)").css("background-color", "#dff0d8");	
						
						setTimeout(function () {
							$("#form-email-files .table tr:nth-last-child(2)").css("background-color", "#fff");
					    }, 3000);
					}
				}  
		});

	}


	showEmailRec = function ($showlastMailRec) {
		var $job_number = $("#job_number").val() ;
		var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
		var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';

		$("#emailrec_btn_div").html(ajaxLoader);

		$.ajax({
			type: "POST",
			cache: false,
			url: appHome+'/job/common_ajax',
			dataType: "text",
			data: ({
				'action_type':'email_record',
				'job_num': $job_number
			}), 
			success: function(result)
			{ 
				$("#emailrec_btn_div").html(result);
				$('a.colorbox').colorbox({iframe:true, width:'80%', height:'90%'});

				if($showlastMailRec == 1){
					$('#form-email-feedback').hide().html('<p class="alert alert-success">Mailed Successfully!!!</p>').fadeIn();
					$('#form-email-feedback').delay(3000).slideUp();
					
					$("#emailrec_btn_div .table tr:nth-last-child(1)").css("background-color", "#dff0d8");	
					
					setTimeout(function () {
						$("#emailrec_btn_div .table tr:nth-last-child(1)").css("background-color", "#fff");
				    }, 3000);
					
					$('html, body').animate({scrollTop: $("#form-email-feedback").offset().top - 150 }, 200);
				}
			}  
		});

	}


	//Start : Job page changes
	if($("#page_name").val() == "job-edit"){
		var $job_number = $("#job_number").val() ;
		var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
		var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';

		$("label:contains('DEMTK Process')").each(function() {
          	 $(this).parent('td').parent('tr').children().eq(0).find('a').text('');
        });

		//Start : Ajax load Note, File and Email Records 
		$("#job_notes_table").html(ajaxLoader);
		showJobNotesNew($job_number,0);
	
		$("#files_btn_div_list").html(ajaxLoader);
		jobFileListingFun(0);
	
		showEmailRec(0);
		//End : Ajax load Note, File and Email Records 

		//Date picker
	 	$('.datepicker').datepicker({
            dateFormat: btl_default_date_format,
            changeMonth: true,
            changeYear: true,
            inline: true,
            startDate: 0
        });

	 	//Plus / Minus button
		$('.scroll-up-btn').click(function(){
		    $(this).find('i').toggleClass('fa-minus-circle fa-plus-circle');    
		});

		$('#prev_btn').click(function(e){
			if($("#prev_btn_div").html() == ""){
				getprevjobDetails();
			}
		});

		//Oncarriage Job
		$('#oncarriagejob_btn').click(function(e){
			if($("#oncarriagejobtable").html() == ""){
				$("#oncarriagejobtable").html(ajaxLoader);
				showPlanTableByAjax($(this).data('jobno'),0);
			}
		});

		//Job Note
		$('#notes_btn').click(function(e){
			if($("#job_notes_table").html() == ""){
				$("#job_notes_table").html(ajaxLoader);
				showJobNotesNew($job_number,0);
			}
		});

		//Job File List
		$('#files_btn').click(function(e){
			if($("#files_btn_div_list").html() == ""){
				$("#files_btn_div_list").html(ajaxLoader);
				jobFileListingFun(0);

			}
		});

		//Email Records
		$('#emailrec_btn').click(function(e){
			if($("#emailrec_btn_div").html() == ""){
				showEmailRec(0);
			}
		});
		
		//Show more of file list
		$('.showmore_new').live('click', function(e) {
			e.preventDefault();
			var elemid = '#'+$(this).data('id');
			var elem = $(this);		
			$(elemid).toggle("", function () {
				$(elemid).is(":hidden") ? $(elem).html('Show <i class="fa fa-plus"><i>') : $(elem).html('Hide <i class="fa fa-minus"><i>');
			});
		});

		//Delete file and job notes 
		$('.delete-row').live('click',function(e) {
			var pageName = $('#page_name').val();	
			var plan_id = $(this).attr('data-plan-files-id');
			e.preventDefault();
			var id = $(this).data('id');
			var userid = $(this).data('uid');
			var parent = $(this).parent().parent();
			var action = $(this).data('action');
			BootstrapDialog.confirm('Are you sure you want to delete the row with ID '+id+'?  This cannot be undone', function(result){
				if(result) {
					$.ajax({  
						type: "POST",  
						url: appHome + '/job/common_ajax',  
						dataType: "text",
						data: "action_type="+action+"&id="+id+"&uid="+userid,
						beforeSend: function() {
					  	$(parent).find("td").css({
						  	'color': '#fff',
						  	'background-color': '#cc0000'
					  	})
						},  
						success: function(result)
						{ 
							if(result=='1') {
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
								
							} else if(result == '2') {
								
								$(parent).find("td").css({
								'color': '',
								'background-color': ''
						    	})
								BootstrapDialog.show({  
									    title: 'Deletion Denied',
										message: alert_authorise,
										buttons: [ 
											{
											label: 'Close',
											action: function(dialogItself){
												dialogItself.close();
											}
										}]
									});
							}else {
								$(parent).find("td").css({
								  'color': '',
								  'background-color': ''
								})
							}
						}  
					});
			    }
		    });
		});


	}

	$(document).on('click', '#link_jobs_summary_area', function(e) {
		var jobnumber_id = $('#job_number').val();
		var bit_value = $("#link_jobs_summary_area").is(':checked') ? 1 : 0;
		
		$.ajax({
	        type: 'POST', 
	        url: appHome+'/job/common_ajax',
	        async : false,
	        data: {
	        	'action_type' : 'update_job_link_summarty_bit',
	        	'jobnumber' : jobnumber_id,
	        	'bit_value'	  : bit_value
			},
	        success: function(response){

	        },
	        error: function(response){
	        	BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update . Try again later.'});
				if(bit_value == 1) {
					$this.prop('checked', false);
				} else {
					$this.prop('checked', true);
				}
	        }
	  });
	});

	function getRandomNumber(){
		return Math.floor(Math.random() * 99999)
	}

	$(document).on('click', '.get-qsshe-list', function(e) {

		var planId = $(this).data('plan_id');
		var jobnumber = $(this).data('jobno');
		var supplier = $(this).data('supplier');

		$("#current_supplier_id").val(supplier);		
		$('.qsshe-job-span').html('QSSHE #'+jobnumber);
		var qsshe_apply = $(this).data('qsshe-apply');
		$('#qsshe_file-div').show();
		$.ajax({
	        type: 'POST', 
	        url: appHome+'/qsshe/common_ajax',
	        async : false,
	        data: {
	        	'action_type' : 'get_qsshe_list',
	        	'planId' : planId,
				'qsshe_apply' : qsshe_apply
			},
	        success: function(response){
	        	$('#qsshe-plan-div').html(response);
	        	$('.poupover-plan').popover({ trigger: "hover" });
				var dummyid = $('.qsshe_event_radio:checked').data('qsshe_id');
				var evtno = $('.qsshe_event_radio:checked').data('qsshe_event_number');
				var randumNumber = getRandomNumber();
				
				if(typeof dummyid == "undefined"){
					$('#hidden-qsshe-id,#hidden-qsshe-number').val(randumNumber); 
				}else{
					$('#hidden-qsshe-id').val(dummyid); 
					$('#hidden-qsshe-number').val(evtno); 
				}
	        	qssheFileListingFun();
				claimListFun(planId);
	        },
	        error: function(response){
	        	BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update . Try again later.'});
	        }
	  	});
	});

	$(document).on('click', '.add-new-qsshe', function(e) {
		$('.qsshe-list-pannel').hide();
		$('#qsshe_job_files_list').hide();
		$('.qsshe-add-pannel').show();
		$('#q_files_btn_div').show();
		$('#hidden-qsshe-id,#hidden-qsshe-number').val(getRandomNumber()); 
	});

	$(document).on('click', '.back-qshe-button', function(e) {
		$('.qsshe-list-pannel').show();
		$('.qsshe-add-pannel').hide();
		$('#q_files_btn_div').show();
		$('#hidden-qsshe-id').val($('.qsshe_event_radio:checked').data('qsshe_id')); 
		$('#hidden-qsshe-number').val($('.qsshe_event_radio:checked').data('qsshe_event_number')); 	
		$('#qsshe_job_files_list').show();
	});


	$(document).on('click', '.red-border', function(e) {
		$(this).removeClass('red-border');
	});
	$(document).on('click', '.customer-complaint', function(e) {
		$('.customer-complaint').parent().css('color', 'black');
	});
	$(document).on('click', '.save-qsshe-btn', function(e) {
		//var type = $('#event-type').val();
		var type  = $('input[name="customer-complaint"]:checked').val();

		e.preventDefault();
		if(type != undefined){
			saveQsshe();
		}else{
			$('.customer-complaint').parent().css('color', 'red');
		}
	});
	
	//End : Job page changes
	getJobTemplateDocuments();
});

function saveQsshe(){
	//var type = $('#event-type').val();
	var type  = $('input[name="customer-complaint"]:checked').val();
	var edetails = $('#event-details').val();
	var planId = $('#qsshe-planid').val();
	var jobNo = $('#job_number').val();
	var qssheid = $('#hidden-qsshe-id').val();
	var qssheno = $('#hidden-qsshe-number').val();
	$('#qsshe_model').modal('hide');
	$('.envelop-'+planId).removeClass('fa-envelope').addClass('fa-spinner fa-spin');

	$.ajax({
	        type: 'POST', 
	        url: appHome+'/qsshe/common_ajax',
	        dataType: "json",
	        data: {
	        	'action_type' : 'save_qsshe',
	        	'planId' : planId,
	        	'type' : type,
	        	'edetails' : edetails,
	        	'jobNo' :  jobNo,
				'qssheid' :  qssheid,
				'qssheno' :  qssheno,
			},
	        success: function(response){

	        	$('.envelop-'+planId).removeClass('fa-spinner fa-spin').addClass('fa-envelope');
	        	if(response.type == 'success'){
	        		BsMsgType = BootstrapDialog.TYPE_SUCCESS;
	        		$('.envelop-'+planId).css('color','red');
	        		$('.envelop-'+planId).closest('.get-qsshe-list').data('qsshe-apply','1');   		
	        	}else{
	        		BsMsgType = BootstrapDialog.TYPE_DANGER;
	        		$('.envelop-'+planId).css('color','#e8a707');
	        	}
				BootstrapDialog.show({title: 'QSSHE', message : response.msg,type: BsMsgType});
	        },
	        error: function(response){
	        	BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update . Try again later.'});
	        }
	  	});
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
	fd.append("jobFileType", $('#job-filetype').val());
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	xhr.open("POST", appHome + '/job/jobF-fle-upload');
	xhr.send(fd);
	resetUploadBar();
}

function resetUploadBar(){

	$('#progressJobPage').hide();
	$('#job-progress-bar').css('width','0%');
	$('#job-progress-bar').data('aria-valuenow','0');
	$('#job-progress-bar').data('aria-valuemax','0');
	$('#job-progress-bar').html('0%');
	$('.fileSize,.fileType').html('');
	$('.upload-btn-custome').attr('disabled',false);
	$('.upload-btn-custome').html('Upload');
}

function uploadProgress(evt) {
	$('.upload-btn-custome').attr('disabled',true);
	$('.upload-btn-custome').html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Upload');
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progressJobPage').show();
	$('#job-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
	$('#job-progress-bar').css('width',percentComplete.toString()+ '%');
	$('#job-progress-bar').data('aria-valuenow',percentComplete.toString());
	$('#job-progress-bar').html(percentComplete.toString() + '%');
	/*if (evt.lengthComputable) {
	  var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	  document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
	}
	else {
	  document.getElementById('progressNumber').innerHTML = 'unable to compute';
	}*/
}

function uploadComplete(evt) {
	/* This event is raised when the server sends back a response */
	//alert(evt.target.responseText);
	$('#feedback').html(evt.target.responseText).fadeIn();
	$('#feedback').delay(3000).slideUp();
	//If success show uploaded files list
	if((evt.target.responseText).indexOf("alert-success") > 0){
		jobFileListingFun(1);
		if($('#job-filetype').val() != ""){ 

			if((evt.target.responseText).indexOf("Zoom") > 0){
				var existingType = $('#job-filetype').val();
				$(".job-filetype").find('[value="'+existingType+'"]').remove();
			}
			getRequestDocList();
			$('#job-filetype').val('');
		}
		$('#fileName,#fileToUpload,#fileDesc').val('');
		$('#fileCustomerAccess').val(0);

	}else{
		$('#job-progress-bar').removeClass('progress-bar-success').addClass('progress-bar-danger');
		setTimeout(function(){ resetUploadBar(); }, 2000);
	}
	//$('#form1')[0].reset();
}

function uploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}

// ----------------------------Request Doc in job page start -----------------------------
$(document).on('click', '.red-border', function(e) {
	$(this).removeClass('red-border');
});

$(document).on('click', '.request-new-doc-btn', function(e) {
	$('.red-border').removeClass('red-border');
	var jobTank = $('#job_tankno').val();
	var supplier = $('#job-suppliers').val();
	var jobNo = $('#job_number').val();
	var status = $('#job-filetype-modal').val().trim();

	var succ = true;

	if(supplier == ""){
		$('#job-suppliers').addClass('red-border');
		succ = false;
	}
	if(status == ""){
		$('#job-filetype-modal').addClass('red-border');
		succ = false;
	}

	if(succ){
		var btnHtml = $('.request-new-doc-btn').html();
		var btnHtml2 = $('.request-doc-btn').html();
		$('.request-new-doc-btn,.request-doc-btn').attr('disabled', true);
		$('.request-new-doc-btn,.request-doc-btn').append('&nbsp;<i class="fa fa-spinner fa-spin"></i>');

		setTimeout(function(){
			$.ajax({  
				type: "POST",  
				url: appHome + '/job/common_ajax',  
				dataType: "json",
				data: ({
					'action_type':'save_job_request',
					'jobTank' : jobTank,
					'supplier' : supplier,
					'jobNo' : jobNo,
					'status' : status,
					'jobId' : $('#job-id-modal').val(),
				}), 
				success: function(result){ 
					$("#doc-req-response").html(alertMsgDivJob(result.message, result.type));

					if(result.newOption != ""){
						$('#job-filetype').append(result.newOption);
					}

					$('#requestDocModal').modal('hide');
					$('.request-new-doc-btn,.request-doc-btn').attr('disabled', false);
					$('.request-new-doc-btn').html(btnHtml);
					$('.request-doc-btn').html(btnHtml2);
					getRequestDocList();
					getDocTypeDDValues($('#job-id-modal').val()); //function in file-upload.js
				},
				error: function(){ 
					BootstrapDialog.show({title: 'Error', message : 'Somthing went wrong.'}); 

					$('.request-new-doc-btn,.request-doc-btn').attr('disabled', false);
					$('.request-new-doc-btn').html(btnHtml);
					$('.request-doc-btn').html(btnHtml2);

				}  
			});
		}, 100);
	}else{
		return false;
	}
});

function getRequestDocList(){

	var jobNo = $('#job_number').val();
	$('#request_btn_div_list').html('<i class="fa fa-spinner fa-spin" style="font-size:150px;" ></i>');
	$.ajax({  
			type: "POST",  
			url: appHome + '/job/common_ajax',  
			dataType: "text",
			data: ({
				'action_type':'get_request_doc_list',
				'jobNo' : jobNo,
			}), 
			success: function(result){ 
				$('#request_btn_div_list').html(result);

			},
			error: function(){ BootstrapDialog.show({title: 'Error', message : 'Somthing went wrong.'}); } 
		});
}

$(document).on('change', '#job-req-status-modal', function(e) {
	$('#doc-type-reject-comment').val('');
	if($(this).val() == 'Rejected'){
		$('.reject-comment-row').removeClass('hidden');
	}else{
		$('.reject-comment-row').addClass('hidden');
	}
});
$(document).on('click', '.btn-job-change-status', function(e) {
	$('#job-req-status-modal').val($(this).attr('data-status'));
	$('.request-change-status-btn').attr('data-reqid', $(this).attr('data-reqid'));
	$('#selected-doc-type').val($(this).attr('data-typeid'));
	$('#doc-type-reject-comment').val('');
	$('.reject-comment-row').addClass('hidden');
});



$(document).on('keypress', '#doc-type-reject-comment', function(e) {
	$('#doc-type-reject-comment').css('border', '1px solid #ccc');
});
$(document).on('click', '.request-change-status-btn', function(e) {

	var reqId = $(this).attr('data-reqid');
	var status = $('#job-req-status-modal').val();
	var rejectComment = $('#doc-type-reject-comment').val().trim();

	if(status == "Rejected"){
		if(rejectComment == ""){
			$('#doc-type-reject-comment').css('border', '1px solid red');
			return false;
		}
	}
	$('#requestChangeStatusModal').modal('toggle');
	$('.btn-job-change-status[data-reqid="'+reqId+'"] .badge').html('<i class="fa fa-spinner fa-spin"></i>');
	$.ajax({  
			type: "POST",  
			url: appHome + '/job/common_ajax',  
			dataType: "text",
			data: ({
				'action_type':'req_change_status',
				'reqid' : reqId,
				'status' : status,
				'rejectComment' : rejectComment,
				'jobTank' : $('#job_tankno').val(),
			}), 
			success: function(result){
				if (result.trim() != ""){
					$("#doc-req-response").html(result);
					getRequestDocList();

					var jobFileType = $('#selected-doc-type').val();
					if(status == 'Uploaded'){ // if uploaded it will only remove the current option
						$(".job-filetype").find('[value="'+jobFileType+'"]').remove();
					}else { // if return back to other option get all other types
						getDocTypeDDValues($('#job-id-modal').val()); //function in file-upload.js
					}
				}else{
					$('.btn-job-change-status[data-reqid="'+reqId+'"] .badge').html(status);
				}
				
			},
			error: function(){ 
				BootstrapDialog.show({title: 'Error', message : 'Somthing went wrong.'}); 
				getRequestDocList();
			} 
		});
});

$(document).on('click', '.request-doc-btn', function(e) {
	e.preventDefault();
	$('#job-suppliers,#job-filetype-modal,#hdn_doc_type_id').val('');

});

$(document).on('click', '.view-response-log', function(e) {

	$.ajax({  
			type: "POST",  
			url: appHome + '/job/common_ajax',  
			dataType: "text",
			data: ({
				'action_type':'get_response_log',
				'reqid' : $(this).attr('data-reqid'),
			}), 
			success: function(result){ 
				$(".view-request-log").html(result);
				$("[data-toggle=tooltip]").tooltip();
			},
			error: function(){ 
				BootstrapDialog.show({title: 'Error', message : 'Somthing went wrong.'}); 
			} 
		});
});


$(document).ready(function(){

	 if($("#job-filetype-modal").length > 0){
			 $("#job-filetype-modal").autocomplete({
			      source:  appHome+'/job/get_job_doc_type',
			      minLength: 1,
			      type: "GET",
				  select: function (event, ui) {
					$(this).val(ui.item.label);
					return false;
				  }
			  });
	 }
 });

function alertMsgDivJob(msg, msgType){

  if(msgType == 'success'){
    var classType = "alert-success";
    var msgType = "Success!";
    var exclamation = "fa fa-thumbs-o-up";
  }else{
    var classType = "alert-danger";
    var msgType = "Uh oh!";
    var exclamation = "fa fa-exclamation-triangle";
  }
	return '<div class="alert '+classType+' alert-dismissable">'
				+'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'
				+'<i class="'+exclamation+'"></i> <strong>'+msgType+'</strong> '+ msg +'</div>';
}


// ----------------------------Request Doc in job page end -----------------------------

function getJobTemplateDocuments() {
	
	var $job_number = $("#job_number").val() ;
	var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
	var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';

	$("#job_template_div").html(ajaxLoader);

	$.ajax({
		type: "POST",
		url: appHome+'/job/common_ajax',
		data: ({
			'action_type': 'job_template_documents',
			'job_number': $job_number
		}), 
		success: function(result){ 
			$("#job_template_div").html(result);

			$("#template-form-btn-colorbox").colorbox({href: function(){
				var url = $(this).parents('form').data('target');
				var ser = $(this).parents('form').serialize();
		    	return url+'?'+ser;
			}, width:'80%', height:"90%", iframe:true});

			$('a.colorbox').colorbox({iframe:true, width:'80%', height:'90%'});
		},
		error: function(response){
        	$('#form-template-feedback').hide().html('<p class="error">Sorry but an unexpected error occured.</p>').fadeIn('slow');
        } 
	});
}


//To delete the corresponding file
$(document).on('click', '.delete-jt-job-file', function(e){
    e.preventDefault();
    var file_id = $(this).attr('data-id');

    BootstrapDialog.confirm('Are you sure you want to delete this file?', function(result){
        if(result) {
          $.ajax({
            type: 'POST',
            url: appHome+'/job/common_ajax',
            data: {
            	'file_id' : file_id,
            	'action_type' : 'delete_job_template_document'
            },
            success: function(response){
            	getJobTemplateDocuments();
            },
            error: function(response){
              $('html, body').animate({ scrollTop: 0 }, 400);
              $('form').find('#response').empty().prepend(alert_error).fadeIn();
            }
          });
        }
    });
});

$(document).on('click', '#save_hidden_activity', function(e){
	e.preventDefault();
	var qe_ids = [];
	var quote = {};
	$('.check_activities:checked').each(function () {
       	qe_ids.push($(this).val());
  	});

    success = [];

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
	$.each(qe_ids, function(key, value){
		highlight($('#date_'+value), '');
		quote[value] = $('#date_'+value).val();
	})
  	
  	var check_fields = (success.indexOf(false) > -1); 

  	if(check_fields === true){
   		$('#response_msg').empty().prepend(alert_required).fadeIn();
    }
    else{
    	saveHiddenActivities(quote, qe_ids);
    }
});



function saveHiddenActivities(quote, qe_ids){
	var job_number = $("#job_number").val();
	var button = $('#save_hidden_activity');
 	button.attr('disabled','disabled');
 	button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
	
	$.ajax({
        type: 'POST',
        url: appHome+'/tank/common_ajax',
        data: {
        	'quote' : quote,
        	'qe_ids' : qe_ids,
        	'job_number' : job_number,
        	'action_type' : 'save_hidden_activities'
        },
        success: function(response){
        	button.find('span').removeClass("fa fa-spinner fa-spin");
         	button.removeAttr('disabled');
         	$('#hidden_activities').modal('hide');
        	window.location.reload();
            localStorage.setItem('response', response);
        },
        error: function(response){
        	$('html, body').animate({ scrollTop: 0 }, 400);
          	$('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
    });
}

/**
* datepicker
*/
$(document).on('click', '.input-group-addon', function(e){
	$(this).parent().find('.datepicker').trigger('focus');
})

$('.datepicker').datepicker({
	dateFormat: btl_default_date_format,
	changeMonth: true,
	changeYear: true,
	inline: true,
	startDate: 0
});

$(document).on('click', '.date-input-icon', function(e){
	$(this).parent().find('.date-input').trigger('focus');
});

$(document).on('click', '.create_all', function(e){
	var status = this.checked; 
	$('.check_activities').each(function(){ 
		this.checked = status; 
	});
});

$(document).on('click', '#save_ss,#update_ss', function(e){
	e.preventDefault();
	var alert_success = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-thumbs-o-up"></i>Successfully saved !!!</div>';
	var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
	$.ajax({
		      	url: appHome +'/job/save_update_js',
		     	type: 'POST',
		     	dataType: "json",
		      	data : $("#form_jss").serialize().replace(/%5B%5D/g, '[]'),
		      	success: function(response){
		          		if(response.status == "success"){
		           			$('html, body').animate({ scrollTop: 0 }, 400);
              				$('#response2').empty().prepend(alert_success).fadeIn();
		           		}else{
		           			$('html, body').animate({ scrollTop: 0 }, 400);
              				$('#response2').empty().prepend(alert_error).fadeIn();
		           		}
		           		$('#j_id').val(response.j_id);
		           		$('#update_status').val(response.update_status);
		           		if(response.update_status == 'update'){
		           			$('#save_ss').html('Update');
		           		}

		        },
		      error: function(response){}
		    }); 
});

$(document).on('click', '#eu_edit', function(e){
	$('.eu-display-text').hide();
	$('#j_eu_status').show();
	$('#j_eu_declarant').show();
});

$(document).on('click', '#gb_edit', function(e){
	$('.gb-display-text').hide();
	$('#j_gb_status').show();
	$('#j_gb_declarant').show();
});

$(document).on('change', '.eu_declare_value', function(){
	var name = $(this).attr('id');
	var value = $(this).val();
	saveDeclareParameters(name, value);	
});

$(document).on('change', '.gb_declare_value', function(){
	var name = $(this).attr('id');
	var value = $(this).val();
	saveDeclareParameters(name, value);	
});

function saveDeclareParameters(name, value){

	var job_number = $("#job_number").val();
	var declaration_type = $('#declaration_type').val();
	var eori_consignor = $('#eori_consignor').val();
	var gb_declarant = $('#gb_declarant').val();

	$.ajax({
        type: 'POST',
        url: appHome+'/job/common_ajax',
        data: {
        	'name' : name,
        	'value' : value,
        	'job_number' : job_number,
        	'declaration_type' : declaration_type,
        	'eori_consignor' : eori_consignor,
        	'gb_declarant' : gb_declarant,
        	'action_type' : 'save_declaration_paramters'
        },
        success: function(response){
   			window.location.reload();
        },
        error: function(response){
        	$('html, body').animate({ scrollTop: 0 }, 400);
          	$('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
    });
}

$(document).on('click', '#inco_edit_btn', function(e){
	$('.inco-text').hide();
	$('#invoice_terms').show();
});

$('#invoice_terms').live('change',function(){
	var job_number = $(this).attr("data-job");
	var old_inco = $(this).attr("data-old");
	var inco =  $(this).val();
	var alert_success = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-thumbs-o-up"></i>Successfully saved !!!</div>';
	var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
	BootstrapDialog.confirm('Do you want to update INCO Terms?', function(result){
   	if(result) {
          
   			 	$.ajax({
        				type: 'POST',
        				url: appHome+'/job/common_ajax',
        				data: {
        					'job_number' : job_number,
        					'inco'  	 : inco,
        					'action_type':'update_inco_jobinfo'
        				},
        				success: function(response){
        					window.location.reload();			
            				localStorage.setItem('response', alert_success);
            				$('html, body').animate({ scrollTop: 0 }, 400);
        				},
        				error: function(response){
        				$('html, body').animate({ scrollTop: 0 }, 400);
          				$('form').find('#response').empty().prepend(alert_error).fadeIn();
        		}
    		});
        }else{

        	$('#invoice_terms').val(old_inco);
        }
    });
});

//Show more of file list
$(document).on('click', '.show_mail_info', function(e){
	e.preventDefault();
	var elemid = '#'+$(this).data('id');
	var elem = $(this);		
	$(elemid).toggle("", function () {
		$(elemid).is(":hidden") ? $(elem).html('Show <i class="fa fa-plus"><i>') : $(elem).html('Hide <i class="fa fa-minus"><i>');
	});
});

if($('#company_name_consignee').length > 0){
$("#company_name_consignee").autocomplete({
				      source:  appHome+'/consignees/get_consignees',
				      minLength: 2,
				      type: "GET",
				      success: function (event, ui) {
				    	 
				      },
					  select: function (event, ui) {
						$(this).val(ui.item.label);
						$('#hdn_consig_name').val(ui.item.label);
						$('#hdn_consig_code').val(ui.item.value);
						var consignee = $("#hdn_consig_code").val();
						getConsigneeData(consignee);
						return false;
					  },
					  change: function (event, ui) {
				
					  }
});
}

function getConsigneeData(consignee){

	$.ajax({
    	type: 'POST',
   		url: appHome+'/consignees/common_ajax',
   		dataType: 'json',
    	data: {
    		'consignee'    :  consignee,
            'action_type'  : 'get_consignees'
    	},
   		success: function(response){
             $("#company_name_consignee").val(response.consig_name);
             $("#consignee_adress1").val(response.consig_addr1);
             $("#consignee_adress2").val(response.consig_addr2);
             $("#consignee_town").val(response.consig_town);
             $("#consignee_state").val(response.consig_state);
             $("#consignee_postcode").val(response.consig_postcode);
             $("#eori_consignee").val(response.consig_eori);
             $("#consignee_country").val(response.consig_country);
		},
        error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
            }
    });

}

function getSealsData(){
	$.ajax({  
		type: "POST",
		cache: false,
		url: appHome+'/job/common_ajax',
		dataType: "text",
		data: ({
			'action_type':'get_seals_by_job_no',
			'job_no': $("#job_number").val()
		}), 
		success: function(result)
		{ 
			$('#seals_td').html(result);
		}  
	});
	
}

$(document).ready(function(){
	
	if($("#j_seals_required").is(':checked')){
		getSealsData();
	}
	else{
		$('#seals_td').html("");
	}

	document.addEventListener('weight_n_time_update', function (e) {
		if(e.detail.job_no == $("#job_number").val()){
			if($("#j_seals_required").is(':checked')){
				getSealsData();
			}
		}
	}, false);
});

$(document).on('click','.repo_plan_modal',function(){
	$('.red-border').removeClass('red-border');
	repo_from_town = $(this).data('pl_from_code');
	$('#repo_from_town').val(repo_from_town);
	$('#repo_modal').modal('show');
	$('#repo_to_town').val('');
	$('#repo_supplier').val('');
	$('#repo-response').empty();
	$('.add-repo-plan').attr('data-jobno', $(this).parents('tr').attr('tr-data-jobno'));
	getRepoSupplier($(this));
	setTimeout(function() {
        $('#repo_to_town').focus();
    }, 500);
});

function getRepoSupplier(element){
	var pl_date = element.data('pl_date');
	$('#tip_plan_date').val(pl_date);
	var pl_time_format = element.data('pl_time_format');
	var pl_time = element.data('pl_time');
	$('#pl_tankno').val(element.data('pl_tankno'));
	$('#pl_time').val(pl_time);
	$('#pl_time_format').val(pl_time_format);

	$.ajax({
    	type: 'POST',
   		url: appHome+'/job/common_ajax',
    	data: {
    		'job_number' : $('#job_number').val(),
    		'pl_date' : pl_date,
    		'pl_time' : pl_time,
    		'pl_time_format' : pl_time_format,
            'action_type' : 'get_repo_supplier'
    	},
   		success: function(response){
   			if(response != ''){
   				$('#repo_supplier').val(response);
   			}
		},
        error: function(response){
            $('#repo-response').empty().prepend(alert_error).fadeIn();
        }
	});
}

$(document).on('click','.add-repo-plan',function(e){
	var alert_warning = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please enter a valid address.</div>';
	$('.red-border').removeClass('red-border');
	e.preventDefault();
    success = [];
     
	function highlight(field, empty_value){
		if(field.length > 0){
			if(field.val().trim() === empty_value){
				$(field).addClass('red-border');
				success.push(false);
			} else {
				$(field).removeClass('red-border');
				success.push(true);
			}
		}
	}

	

	//To highlight the required field
	highlight($('#repo_from_town'), '');
	highlight($('#repo_to_town'), '');
	highlight($('#repo_supplier'), '');

	var check_fields = (success.indexOf(false) > -1);  
	if(check_fields === true){
		$('html, body').animate({ scrollTop: 0 }, 400);
		$('#repo-response').empty().prepend(alert_required).fadeIn();
	} else {
		repo_type = $(this).data('name');
		var jobNo = $(this).attr('data-jobno');
		$.ajax({
	    	type: 'POST',
	   		url: appHome+'/job/common_ajax',
	    	data: {
	    		'repo_from_town' : $('#repo_from_town').val().trim(),
	    		'repo_to_town' : $('#repo_to_town').val().trim(),
	            'action_type' : 'check_valid_address'
	    	},
	   		success: function(response){
	   			if(response == 'ok'){
	   				addRepoPlans(repo_type, jobNo);
	   			}
	   			else{
	   				$('html, body').animate({ scrollTop: 0 }, 400);
					$('#repo-response').empty().prepend(alert_warning).fadeIn();
	   			}
			},
	        error: function(response){
	            $('#repo-response').empty().prepend(alert_error).fadeIn();
	        }
		});
	}
});

function addRepoPlans(repo_type, jobNo){
	var pl_date = $('#tip_plan_date').val();
	var repo_from_town = $('#repo_from_town').val();
	var repo_to_town = $('#repo_to_town').val();
	var repo_supplier = $('#repo_supplier').val();
	var pl_tankno = $('#pl_tankno').val();
	var pl_time = $('#pl_time').val();
	var pl_time_format = $('#pl_time_format').val();

	$.ajax({
    	type: 'POST',
   		url: appHome+'/job/common_ajax',
    	data: {
    		'job_number' : jobNo, //$('#job_number').val(),
    		'pl_date' : pl_date,
    		'repo_from_town' : repo_from_town,
    		'repo_to_town' : repo_to_town,
    		'repo_supplier' : repo_supplier,
    		'repo_type' : repo_type,
    		'pl_tankno' : pl_tankno,
    		'pl_time' : pl_time,
    		'pl_time_format' : pl_time_format,
            'action_type' : 'add_repo_plans'
    	},
   		success: function(response){
   			$('#repo_modal').modal('hide');
   			window.location.reload();	
   			$('html, body').animate({ scrollTop: 0 }, 400);
   			if(response == 'success'){	
            	localStorage.setItem('response', alert_success);
   			}
   			else{
   				localStorage.setItem('response', alert_error);
   			}
		},
        error: function(response){
        	$('#repo_modal').modal('hide');
   			window.location.reload();	
   			$('html, body').animate({ scrollTop: 0 }, 400);
            localStorage.setItem('response', alert_error);
        }
	});
}

//Autocomplete function to fetch the Town
$(document).on('keydown.autocomplete', '#repo_from_town, #repo_to_town', function() {
    $(this).autocomplete({source:  appHome+'/tank/autocomp_town',
	      minLength: 2,
	      type: "GET",
	      success: function (event, ui) {},
		  select: function (event, ui) {
	    	event.preventDefault();
			$(this).val(ui.item.value);
			return false;
		  },
		  focus: function(event, ui) {
		      event.preventDefault();
		      $(this).val(ui.item.value);
		  },
		  change: function (event, ui) {
	         if (ui.item === null) {
	        	 	BootstrapDialog.show({title: 'Error', message : 'Not a valid Town',
					buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
	            $(this).val('');
	         }
		  }
	});
});

// QSSHE file upload
/**-------------------------------------fileupload start ------*/
function qssheUploadFile() {
	$('#q_feedback').hide();
	$('#qsshe_job_files_list').show();

	var fd = new FormData();
	fd.append("fileToUpload", document.getElementById('qsshe_file_to_upload').files[0]);
	fd.append("filename", document.getElementById('qsshe_file_name').value);
	fd.append("fileDesc", document.getElementById('qsshe_file_desc').value);
	fd.append("hidden-qsshe-id", document.getElementById('hidden-qsshe-id').value);
	fd.append("hidden-qsshe-number", document.getElementById('hidden-qsshe-number').value);
	fd.append("include-doc-capa", ( ($('#include-doc-capa').is(':checked')) ? 1 : 0) );
	fd.append("include-doc-capa", ( ($('#include-doc-capa').is(':checked')) ? 1 : 0) );
	fd.append("action_type", 'qsshe-file-upload');
	//fd.append("method", document.getElementById('form_type').value);
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", qssheUploadProgress, false);
	xhr.addEventListener("load", qssheUploadComplete, false);
	xhr.addEventListener("error", qssheUploadFailed, false);
	xhr.addEventListener("abort", qssheUploadCanceled, false);
	xhr.open("POST", appHome + '/qsshe/common_ajax');
	xhr.send(fd);
	qssheResetUploadBar();
}

function qssheUploadProgress(evt) {
	$('.upload-qsshe-files').attr('disabled',true);
	$('.upload-qsshe-files').html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Upload');
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#qsshe_progress_job_page').show();
	$('#qsshe_job-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
	$('#qsshe_job-progress-bar').css('width',percentComplete.toString()+ '%');
	$('#qsshe_job-progress-bar').data('aria-valuenow',percentComplete.toString());
	$('#qsshe_job-progress-bar').html(percentComplete.toString() + '%');
}

function qssheResetUploadBar(){
	$('#qsshe_progress_job_page').hide();
	$('#qsshe_job-progress-bar').css('width','0%');
	$('#qsshe_job-progress-bar').data('aria-valuenow','0');
	$('#qsshe_job-progress-bar').data('aria-valuemax','0');
	$('#jqsshe_job-progress-bar').html('0%');
	$('#qsshe_file_size,#qsshe_file_type').html('');
	$('.upload-qsshe-files').attr('disabled',false);
	$('.upload-qsshe-files').html('Upload');
	$('#qsshe_file_to_upload,#qsshe_file_name,#qsshe_file_desc').val('');
	$('#include-doc-capa').attr('checked', false);
}

function qssheUploadComplete(evt) {
	/* This event is raised when the server sends back a response */
	//alert(evt.target.responseText);
	$('#qsshe_feedback').html(evt.target.responseText).fadeIn();
	$('#qsshe_feedback').delay(3000).slideUp();
	//If success show uploaded files list
	if((evt.target.responseText).indexOf("alert-success") > 0){
	 	qssheFileListingFun();
	 	qssheResetUploadBar();
	}else{
		$('#qsshe_job-progress-bar').removeClass('progress-bar-success').addClass('progress-bar-danger');
		setTimeout(function(){ qssheResetUploadBar(); }, 2000);
	}
}

function qssheUploadFailed(evt) {
  	alert("There was an error attempting to upload the file.");
}

function qssheUploadCanceled(evt) {
  	alert("The upload has been canceled by the user or the browser dropped the connection.");
}

/*
  File upload JS
*/
function qssheFileSelected() {
  var file = document.getElementById('qsshe_file_to_upload').files[0];
  if (file) {
    var fileSize = 0;
    if (file.size > 1024 * 1024)
    fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
    else
    fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
  
    var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
    document.getElementById('qsshe_file_name').value = fname;
    document.getElementById('qsshe_file_size').innerHTML = 'Size: ' + fileSize;
    document.getElementById('qsshe_file_type').innerHTML = 'Type: ' + file.type;
    $('.upload-qsshe-files').attr('disabled', false);
  }
}

qssheFileListingFun = function(){
    $.ajax({
        type: "POST",
        cache: false,
        url: appHome+'/qsshe/common_ajax',
        dataType: "text",
        data: ({
          'action_type':'qsshe_job_file_list',
          'qsshe_id': $('#hidden-qsshe-id').val(),
          'qsshe_no': $('#hidden-qsshe-number').val(),
        }), 
        success: function(result){ 
        	$('#q_files_btn_div').show();
          	$("#qsshe_job_files_list").html(result);
        }  
  	});
}

$(document).on('click','.qsshe_event_radio', function(){
	$('#hidden-qsshe-id').val($('.qsshe_event_radio:checked').data('qsshe_id')); 
	$('#hidden-qsshe-number').val($('.qsshe_event_radio:checked').data('qsshe_event_number')); 
	qssheFileListingFun();
});


$(document).on('click', '.delete-qsshe-row', function(e) {
	var pageName = $('#page_name').val(); 
	e.preventDefault();
	var id = $(this).data('id');
	var parent = $(this).parent().parent();
	var action = $(this).data('action');
	var current = $(this);

	BootstrapDialog.confirm('Are you sure you want to delete the row with ID '+id+'? This cannot be undone', function(result) {
	  	if(result){
		    $.ajax({  
		      	type: "POST",  
		      	url: appHome + '/qsshe/common_ajax',  
		      	dataType: "text",
		      	data: "action_type="+action+"&id="+id,
		      	beforeSend: function() {
		        	$(parent).find("td").css({ 'color': '#fff','background-color': '#cc0000' })
		      	},  
		      	success: function(result1){ 
			        if(result1 == 1) {
			            $(parent).fadeOut(1000, function() { 
			              	parent.remove(); 
			              	if($('.qsshe-doc-tr').length == 0){ 
			              		$('.qsshe-doc-last-tr').remove(); 
			              	}
			            });
			        } else {
			          $(parent).find("td").css({ 'color': '', 'background-color': ''  })
			        }
		      	}  
		    });
	  	}
	});
});

$(document).on('click', '.is-capa-include', function(e) {
    var curr = $(this);

    var cur_status = ( curr.is(':checked') ) ? 1 : 0;
    var value = curr.val();
    var value_s = ( curr.is(':checked') ) ? false : true;
    BootstrapDialog.confirm('Are you sure you want to apply this?', function(result) {
      	if(result){
          	$.ajax({
              	type: 'POST', 
              	url: appHome+'/qsshe/common_ajax',
              	data: {
                	'action_type' : 'change_file_status',
                	'cur_status' : cur_status,
                	'file_id' : value
              	},
              	success: function(response){
                	$('#qsshe_feedback').html(response).fadeIn();
                	$('#qsshe_feedback').delay(3000).slideUp();
              	},
              	error: function(response){
                	BootstrapDialog.show({title: 'Failed to Update', message : 'Failed to Update . Try again later.'});
              	}
          	});
      	}else{
          	curr.attr('checked', value_s);
      	}
    });
});

Dropzone.autoDiscover = false;

$(function() {
	if($('#page_name').val() == "job-edit"){

		//Dropzone class
		var myDropzone = new Dropzone("body", {
			url: "#",
			// acceptedFiles: "image/*,application/pdf",
			maxFiles : 1, 
			previewsContainer: "#files_btn_div",
			disablePreviews: true,
			autoProcessQueue: false,
			uploadMultiple: false,
			clickable: false,
			init : function() {
	
				myDropzone = this;
		
				//Restore initial message when queue has been completed
				this.on("drop", function(event) {
					if(event.dataTransfer.files.length > 0){
						fileInput = document.getElementById("fileToUpload"); 
						fileInput.files = event.dataTransfer.files;
						//window.location.href = "#file_list_panel";
						document.getElementById("file_list_panel").scrollIntoView();
						$("#file_list_panel").css("background-color", "#bdbdbd");
						setTimeout(() => {
							$("#file_list_panel").css("background-color", "unset");
						}, 800);
						fileSelected();
						setTimeout(() => {
							// uploadFile(); to automatic upload
							myDropzone.removeAllFiles( true );
						}, 200);
					}
	
				});
		
			}
		});
	}
});

//Delete extra cost
$('.delete-extra-cost-new').live('click', function (e) {
	e.preventDefault();
	$extraCostId = $(this).attr("data-extra-id");
	var planId = $(this).attr("data-planid");
	var curRow = $(this).closest('tr').data('rowid');
	
	BootstrapDialog.confirm('Are you sure you want to delete this Extra Cost ?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				//async : false,
				url: appHome+'/job/common_ajax',
			    data: {
						'extraCostId' : $extraCostId,
						'action_type' : 'delete_extra_costs_byId_new',
					  },
				success: function(responseString){
					response = JSON.parse(responseString);
					if(response.status == 'success'){
						$("#rowid_" + curRow).hide();
						$("#responseExtra").html('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> Extra cost was deleted successfully.</div>')
						if(planId != ""){
							$('#plantable tbody [tr-data-planid="'+planId+'"]').remove();
						}
					}
				}
			});
		} 
	});
	
});

$(document).on('click', '.claim-raise-btn', function(){
	var _this		= $(this);
	var pl_id 		= $('#qsshe-planid').val(); 
	var j_number 	= $("#job_number").val();
	var job_id		= $("#job_id").val();
	var sea_type_id = $("#sea_type_id").val();
	var supp_id 	=	$("#current_supplier_id").val();
	
	$.ajax({
		type: 'POST',
		url: appHome+'/job/common_ajax',
		beforeSend: function() {
			_this.attr('disabled',true);
			_this.html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Yes&nbsp;&nbsp; ');
        },
	    data: {
			'pl_id' 	  : pl_id,
			'j_number'    : j_number, 
			'job_id'	  : job_id,
			'sea_type_id' : sea_type_id,
			'supp_id'	  : supp_id,
			'action_type' : 'add_claim',
		},
		success: function(response) {
			$('#main-claim-div').html(response);
			_this.data('pl_has_claim',1);
			$('.get-qsshe-list[data-plan_id="' + pl_id + '"]').find('.fa-envelope').css('color','red');
		}
	});

});


claimListFun = function(planId){
	$.ajax({
			type: 'POST',
			url: appHome+'/job/common_ajax',
			beforeSend: function() {
	        	//$('#main-claim-div').html("<div class='text-center'><i class='fa fa-spinner fa-spin' style='font-size:100px'></i></div>");
	        },
		    data: {
				'pl_id' 	  : planId,
				'action_type' : 'claims_list',
			},
			success: function(response) {
				$('#main-claim-div').html(response);
			}
	});
}
$(document).on('click', '#je_comments_edit_btn', function(e){
	$('.je_comments').hide();
	$('#save-je-comments-btn').show();
	$('#je_comments_edit_btn').css('display', 'none');
	$('#je_comments_edit').show();
});
$(document).on('click', '#je_comments_cancel', function(e){
	$('.je_comments').show();
	$('#save-je-comments-btn').hide();
	$('#je_comments_edit_btn').css('display', 'block');
	$('#je_comments_edit').hide();
});
$(document).on('click', '#je_comments_save', function(){
	var value = $('#je_comments_edit').val();
	saveJobReviewNotes(value);	
});
function saveJobReviewNotes(value){

	var job_id = $("#job_id").val();
	var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
	$.ajax({
        type: 'POST',
        url: appHome+'/job/common_ajax',
        data: {
        	'je_comments': value,
        	'je_job_id'  : job_id,
        	'action_type': 'update_job_review_comment'
        },
        success: function(response){
   			window.location.reload();
        },
        error: function(response){
        	$('html, body').animate({ scrollTop: 0 }, 400);
          	$('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
    });
}

function setStatusSaveButton(id,oldValue,suggested_id){
	 
	var fieldId = "#"+id;
	var newValue = $(fieldId).val();
    BootstrapDialog.confirm('Are you sure to change the suggested charge status?', function(result){
        if(result) {
          	$.ajax({
	            type: 'POST',
	            url: appHome+'/suggested-charge/common-ajax',
	            data: {
	            	'suggested_id' : suggested_id,
	            	'status': newValue,
	            	'action_type' : 'save_suggested_charge_status'
	            },
	            success: function(response){
	              	localStorage.setItem('response', response);
	              	$('form').find('#response').empty().prepend(response).fadeIn();
	            },
	            error: function(response){
	              	$('html, body').animate({ scrollTop: 0 }, 400);
	              	//$('form').find('#response').empty().prepend(alert_error).fadeIn();
	            }
            });
        }
        else{
        	$(fieldId).val(oldValue);
        	//$('.chosen').chosen().trigger("chosen:updated");
        }
    });
}