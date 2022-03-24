/**
 * 
 */

function suppInvoiceUploadFile(e) {

	uploadPath = $("#fileUploadPath").val();
	
	if(!$('#file_to_upload')[0]) {
		return false;
	}

	if(!$('#file_to_upload').val()) {
		$("#upload_btn").attr('disabled','disabled');
		return false;
	}
	
	var fd = new FormData();
	fd.append("file_to_upload", $('#file_to_upload')[0].files[0]);
	fd.append("file_desc", $('#file_desc').val());
	fd.append("attachable_id", $('input[name="attachable_id"]').val());
	fd.append("attachable_type", $('input[name="attachable_type"]').val());

	var xhr = new XMLHttpRequest();

	// file received/failed
	xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4) {
					$('#progress_num_si').addClass(xhr.status == 200 ? "success" : "failure");
			}
	};

	xhr.upload.addEventListener("progress", suppInvoiceUploadProgress, false);
	xhr.addEventListener("load", suppInvoiceUploadComplete, false);
	xhr.addEventListener("error", suppInvoiceUploadFailed, false);
	xhr.addEventListener("abort", suppInvoiceUploadCanceled, false);
	xhr.open("POST", uploadPath);
	xhr.send(fd);
}

function suppInvoiceUploadProgress(evt) {
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	if($('#job_costpage_new').val() == 'job_costpage_new'){
		$('#progress_num_si').show();
		$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
		$('#upload-progress-bar').css('width',percentComplete.toString()+ '%');
		$('#upload-progress-bar').data('aria-valuenow',percentComplete.toString());
		$('#upload-progress-bar').html(percentComplete.toString() + '%');
	}else{
		$('#progress_num_si').show().html(percentComplete.toString() + '%');
	}
	
}

function suppInvoiceUploadComplete(evt) {

	// clear the form
	$("#file_to_upload").val("");
	$("#file_desc").val("");
	$("#upload_btn").attr('disabled','disabled');
	
	// fade out the progress indicator for added sexiness
	$('#progress_num_si').delay(2000).fadeOut('slow');

	var row = JSON.parse(evt.target.responseText);

	var table = $('.si-file-list');
	table.children('tbody').append(
				'<tr class="new-ajax-row success">'
				+ '<td>'+ row.id +'</td>'
				+ '<td><a href="' + row.path + '" target="_blank" title="View /Download file">' + row.path + '</a></td>'
				+ '<td><div class="wrap-td-texts-200">' + row.description + '</div></td>'
				+ '<td>'+row.created_at+'</td>'
				+ '<td style="white-space:nowrap"><a href="#" title="Delete Supplier Invoice" class="delete-supplier_invoice_files" data-fileid="' + 0 + '" data-attid="' + row.id + '" data-path="' + row.path + '" ><i class="fa fa-trash-o"></i> Delete</a></td>'
				+ '</tr>');

	var siFileListCount = $(".si-file-list tr").length;
	if (siFileListCount > 2)
	{
		$("#emptyFilesTr").removeClass().addClass('hide');
	}
	
	var delay = setTimeout(function(){
		$('.new-ajax-row').removeClass('success');
	},2000);

  // Refresh tab-content height
  $('.tab-content').css({ height: $('.tab-pane').height() });
}

function suppInvoiceUploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

function suppInvoiceUploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}


function showCommentMoreLess(){
    var showChar = 25;  // How many characters are shown by default
    var lesstext = "<i class='fa fa-minus-circle'></i>";
    $('.more').each(function() {
        var content = $(this).html();
        var moretext = '<i class="fa fa-plus-circle comment-show red-tooltip" data-html="true" data-comment="'+content+'"></i>';
        if(content.length > showChar) {
           var c = content.substr(0, showChar);
           var h = content.substr(showChar, content.length - showChar);
		   var html = c + '<span class="morecontent"><span>' + h + '</span><a href="" class="morelink" more-data="'+content+'">' + moretext + '</a></span>';
           $(this).html(html);
        }
        
    });

    $(document).on("click",".morelink", function(){      
        if($(this).hasClass("less")) {
            $(this).removeClass("less");
            var content = $(this).attr('more-data');
    	    var moretext = '<i class="fa fa-plus-circle comment-show red-tooltip" data-html="true" data-comment="'+content+'"></i>';
            $(this).html(moretext);
        } else {

            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
}

$(document).on('hover', '.comment-show', function(){
	hoverPopup($(this));
});
$(document).on('mouseout', '.red-tooltip', function(){
	
	$( this ).tooltip('hide');
		
});

function hoverPopup(currentElement){
	$('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
	$(".tooltip").remove();
	var data = currentElement.attr('data-comment');
    var tankplanTooltipHtml = "<table style='max-width:fit-content !important;font-size:10px;border-collapse: unset;background-color:#ddd;border-radius:3px;margin:1px;align:center;'>";	
    tankplanTooltipHtml += "<tr><td class='center-cell' style='max-width:200px;background-color:white;text-align: justify;'>"+data+"</td></tr>";
    tankplanTooltipHtml += "</table>";
    currentElement.attr('data-original-title',tankplanTooltipHtml);
    currentElement.tooltip('show');
}


$(document).ready(function(){
	$('.supplier-invoice-btn').click(function(){
		var $this = $(this);
		var attachid = $this.data('id');
		var si_files = $('[data-attachid="'+attachid+'"]');
		var si_file_list = $("#suppInvFileList");
		var si_file_list_html = "";
		var filePrefix = $("#filePrefix").val();
		
		si_files.each(function(){
			var thisFile = $(this);

			si_file_list_html +='<tr class="file-row">'
								+ '<td>'+ thisFile.data('attid') +'</td>'
								+ '<td><a class="delete-supplier_invoice_download_lnk" href="' + filePrefix + thisFile.data('path') + '" target="_blank" title="View /Download file">' + thisFile.data('path') + '</a></td>'
								+ '<td>' + thisFile.data('date') + '</td>'
								+ '<td><a href="' + filePrefix + thisFile.data('path') + '" target="_blank" title="View /Download file"><i class="fa fa-download"></i></a></td>'
								+ '<td class="center-cell"><a href="#" title="Delete Supplier Invoice" class="delete-supplier_invoice_files" data-fileid="' + thisFile.data('fileid') + '" data-attid="' + thisFile.data('attid') + '" data-path="' + thisFile.data('path') + '" ><i class="fa fa-trash-o"></i></a></td>'
								+'</tr>';
		});
		
		si_file_list.html(si_file_list_html);
		
	});

    showCommentMoreLess();
	
	$(".delete-supplier_invoice_files").live('click', function(e){
		e.preventDefault();
		
		$this = $(this);
		si_fileInfo = $this.data();
		file_deletePath = $("#fileDelPath").val();
		attachid = 0;
		siFileListCount = 0;

		BootstrapDialog.confirm('Are you sure you want to delete #'+si_fileInfo.attid+'?', function(result){
			if(result == true) {
				$.ajax({
					type: "POST", 
					cache: false, 
					url: file_deletePath, 
					dataType: "json",
					data: ({
						'aid' : si_fileInfo.attid,
						'path': si_fileInfo.path
					}),  
					success: function(response)
					{ 
						
						if(response.result === 'success') {
							//remove icons
							$this.parents('tr').remove();
							
							attachid = $('[data-attid="'+si_fileInfo.attid+'"][data-fileid="'+si_fileInfo.fileid+'"]').data('attachid');
							$('[data-attid="'+si_fileInfo.attid+'"][data-fileid="'+si_fileInfo.fileid+'"]').remove();
		
							if ($('[data-attachid="' + attachid + '"]').length == 0) {
								$('[data-id="'+ attachid +'"][data-info="DEL"]').remove();
							}
		
							siFileListCount = $(".si-file-list tr").length;
							if (siFileListCount == 2)
							{
								$("#emptyFilesTr").removeClass();
							}
		
						}
					}  
				});
			}
		});		
		
	});
	
	
	$('#file_to_upload').change(function(){
		var file_cntrl = $('#file_to_upload');
		if(file_cntrl.val() != "" )
		{
			$("#upload_btn").removeAttr('disabled');
		}
	});
  
  //$('#response').empty().prepend(localStorage.getItem('response')).fadeIn();
  //localStorage.clear();	
  
  	$(document).on('click','.supplier-amount-change', function(){
	  	var x = $(this).parent('td').find("td:eq(3)").text();
  	});

function getnetPrevJobInfo(curr_job_no){
    //var curr_job_no =  $('#da_job_number').val();
	$.ajax({
			type	: 'POST',
			dataType: "json",
			url		: appHome+'/job-cost/common_ajax',
			data	: {
						'action_type' 	: 'find_prev_next_job',
						'job_no' 		: curr_job_no, //$('#da_job_number').val(),
					  },
			success : function(response){
				$('.prev_job_name').text(response.previous_job);
				$('.curr_job_name').text(curr_job_no);
				$('.next_job_name').text(response.next_job);
			},
			error : function(){
				$('.prev_job_name').text('-');
				$('.next_job_name').text('-');
			}
		});
}
$('.p-n-span').click(function(){
	var txt = $(this).find('span').text().trim();
	if(txt != '-' && txt != ''){
		$('#job-number-search').val(txt);
	}
});


//move job cost to one job to another job   -start
$(document).on('click', '.supplier-amount-change', function(){

	$('#job-selected-invno').val($(this).attr('data-invno'))
	$('#job-selected-actdate').val($(this).attr('data-actdate'))
	$('#job-selected-invdate').val($(this).attr('data-invdate'))
	$('#job-selected-invid').val($(this).attr('data-invid'))
	$('#job-selected-activity').val($(this).attr('data-activity'))
	$('#job-selected-supplier').val($(this).attr('data-supplier'))
	$('#job-selected-id').val($(this).attr('data-id'))
	$('#job-selected-actamt').val($(this).attr('data-actamt'))
	$('#job-actual-amt').val($(this).attr('data-actamt'))
	$('#job-selected-curr').val($(this).attr('data-curr'))
	$('#job-selected-is-parent').val($(this).attr('data-is-parent'))
	$('#job-selected-parent-cost-id').val($(this).attr('data-parent-cost-id'))
	$('.td-activity').html($(this).attr('data-activity'));
	$('.td-supplier').html($(this).attr('data-supplier'));
	$('.td-estamt').html($(this).attr('data-estamt'));
	$('.td-actamt').html($(this).attr('data-actamt'));

	getnetPrevJobInfo($(this).attr('data-jobno'));
});
$(document).on('click','.job_cost_edit', function(e){
	e.preventDefault();
	var url = $(this).attr('href');
	if( $(this).attr('data-invno')) {
		BootstrapDialog.show({
	         type: BootstrapDialog.TYPE_DANGER,
	         title: 'Warning',
	         message: 'Invoice already exists on this cost',
	         buttons: [{
			             label: 'Cancel',
			             action: function(dialogItself){
			                 dialogItself.close();
			             }
			         },{
		             label: 'Proceed',
		             cssClass: 'btn-danger',
		             action: function(dialogItself){
		             	    dialogItself.close();
	 			            window.location.href = url;
		            }
	        }]
	        });
	}else{
		 window.location.href = url;
	}
});

$('#job-number-search-btn').click(function(){
	  var jnumber = $('#job-number-search').val().trim();
	  var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
		
		if(numberRegex.test(jnumber)) {
		   var jobORpo	= "job";
		}else{
			
			var jobORpo	= "po";
		}
	  var check = checkValidJobNo(jnumber);
	  if(check && jnumber != ''){

  var jc_id = $('#job-selected-id').val();
  var inv_no = $('#job-selected-invno').val();
  var jc_id = $('#job-selected-id').val();
  var amount_select = $('#job-selected-actamt').val();
  var amount_net = $('#job-actual-amt').val();
  var booking_date = $('#job-selected-actdate').val();
  var inv_date = $('#job-selected-invdate').val();
  var currency = $('#job-selected-curr').val();
  var supplier = $('#job-selected-supplier').val();
  var inv_id =$('#job-selected-invid').val();
  var entered_po_id		= $('#entered-po-num').val();
  var suppCurrName = $('#supp-curr-hidden').attr('data-suppcurname');
  var is_parent = $('#job-selected-is-parent').val();
  var parent_cost_id = $('#job-selected-parent-cost-id').val();
  $('#job-number-search-btn').attr('disabled', 'disabled');
  if(jobORpo	== "job"){
	  var url = $(this).data('path')+jnumber+'&inv_id='+inv_id+'&supplier_inv_no='+inv_no+'&supplier_inv_amount='+amount_net+'&supplier_inv_date='+ inv_date +'&booking_date='+ booking_date +'&currency='+currency+'&supplier_code='+supplier+'&code='+1+'&jc_id='+jc_id+'&actamt='+amount_select+'&sourcefrom=job&is_parent='+is_parent+'&parent_cost_id='+parent_cost_id;
  }else if(jobORpo	== "po"){
	  var url = appHome+'/purchase_order/'+entered_po_id+'/poedit?id='+entered_po_id+'&cost_id='+jc_id+'&inv_id='+inv_id+'&supplier_inv_no='+inv_no+'&supplier_inv_amount='+amount_net+'&actual_amount='+amount_select+'&supplier_inv_date='+ inv_date +'&currency='+currency+'&supplier_code='+supplier+'&supp_cur_name='+currency+'&actual_cur_name='+currency+'&joORpo='+jobORpo+'&code='+1+'&sourcefrom=job';
  }
  var win = window.open(url, '_blank');
  win.focus();
	  }
  });

$('#job-number-search').change(function(){
    $('#job-number-search-btn').removeAttr('disabled');
	$('#move_job_cost').attr('disabled', 'disabled');
	$('#add_job_cost').attr('disabled', 'disabled');
});

$('#job-actual-amt').keyup(function(){
	if(parseInt($('#job-actual-amt').val()) >  parseInt($('#job-selected-actamt').val()) ) {
		 BootstrapDialog.show({title: 'Warning', message : 'The Actual Amount could not be greater than the existing amount  '+$('#job-selected-actamt').val()  });
		  $('#job-actual-amt').focus(); 
		  $('#job-actual-amt').val($('#job-selected-actamt').val());
	}
});
//move job cost  add_job_cost
$('.jc_move_close').click(function(){ 
	  location.reload();
});
/*function checkValidJobNo(job_no){
	var retflag = false;
	if(!job_no) {
		  BootstrapDialog.show({title: 'Warning', message : 'Please enter the job number!'});
		  $('#job-number-search').focus(); 
		  retflag = false;
	  }else{
			$.ajax({
				type: 'POST',
				async: false,
				url: appHome+'/job-cost/common_ajax',
				data: {
					'action_type' : 'check_valid_job',
					'job_no' : job_no,
				},
				beforeSend: function() {
		            // setting a timeout
		        	$('#job-number-search-btn').html("<i style='font-size:14px' class='fa fa-refresh fa-spin'></i>");
		        },
				success: function(response){
					
					if(response > 0){
						$('#job-number-search-btn').html('<i class="fa fa-search"></i>Search');
						retflag = true;
					}else{
						BootstrapDialog.show({title: 'Warning', message : 'Invalid Job number.'});
						$('#job-number-search-btn').html('<i class="fa fa-search"></i>');
						$('#job-number-search').focus(); 
						retflag = false;
					}
				}
			});
	  }
	return retflag;
}*/

function checkValidJobNo(po_no){
	var retflag = false;
	if(!po_no) {
		  BootstrapDialog.show({title: 'Warning', message : 'Please enter the job number or PO number!'});
		  $('#job-number-search').focus();
		  retflag = false;
	  }else{
			$.ajax({
				type	: 'POST',
				async	: false,
				url		: appHome+'/job-cost/common_ajax',
				data	: {
							'action_type' 	: 'check_valid_po_job_number',
							'po_no' 		: po_no,
						  },
				beforeSend: function() {
		            // setting a timeout
		        	$('#job-number-search-btn').html("<i style='font-size:14px' class='fa fa-refresh fa-spin'></i>");
		        },
				success: function(response){
					var jsonObj = JSON.parse(response);
					if(jsonObj.count > 0){
						$('#job-number-search-btn').html('<i class="fa fa-search"></i>Search');
						$('#entered-po-num').val(jsonObj.id);
						retflag = true;
					}else{
						BootstrapDialog.show({title: 'Warning', message : 'Invalid PO number or Job number.'});
						$('#job-number-search-btn').html('<i class="fa fa-search"></i>');
						$('#job-number-search').focus(); 
						retflag = false;
					}
				}
			});
	  }
	return retflag;
}

});

$(document).on('click', '.show-invoice-tr', function(e) {	
    $(this).find('span').toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
    $(this).closest('tr').toggleClass('activeRow');

	if ( $( this ).closest('tr').hasClass( "activeRow" ) ) {
	 	$('.activeRow').next('tr.invoice-tr').show();
	 	$('.activeRow').next().next('tr.invoice-tr').show();
	}
	else{
	 	//$( this ).closest('tr').next().next('tr.invoice-tr').hide();
	 	$( this ).closest('tr').next('tr.invoice-tr').hide();
	}

    class_name = $(this).find('span').attr('class');
    if(class_name == 'glyphicon glyphicon-minus'){
	    // sub costing
	    is_parent = $(this).data('is-parent');
	    parent_cost_id = $(this).data('parent-cost-id');
	    is_ajax = $(this).data('is-ajax');
	    if(is_parent == 1 && is_ajax == 0){
	    	$.ajax({
				type	: 'POST',
				async	: false,
				url		: appHome+'/job-cost/common_ajax',
				data	: {
							'action_type' 	 : 'get_sub_costing_details',
							'parent_cost_id' : parent_cost_id,
							'job_number' 	 : $(this).attr('data-jobno'), //$('#da_job_number').val()
				},
				success: function(response){
					$('#row_'+parent_cost_id).after('<tr><td colspan="18" class="sub_'+parent_cost_id+'"></td></tr>');
					$('.sub_'+parent_cost_id).html(response);
					$('#cost_'+parent_cost_id).data('is-ajax', "1");
					showSubCommentMoreLess();
				}
			});
		}
		else if(is_ajax == 1 && is_parent == 1){
			$('.sub_'+parent_cost_id).show();
		}
	}
	else{
		$('.sub_'+parent_cost_id).hide();
	}
});

$(document).on('click','#user_btn', function(e){
    $('#user_btn i').toggleClass('fa-minus-circle fa-plus-circle');
}); 

$(document).on('click','#jc_div_view', function(e){
    $('#jc_div_view i').toggleClass('fa-minus-circle fa-plus-circle');
}); 

$(document).on('click','#user_btn', function(){
	var ajax_status = $('#ajax_status').val();
	var appHome = '<?php echo HOME; ?>erp.php';
	if(ajax_status == 0){
		getJobCostUserLogs();
	}
});

//multiple recharge
$(document).ready(function(){
	$("#enable-multi-recharge").prop("checked", false);
	if($("#multiple-recharge").length < 1) {
		$('#enable-multi-recharge').attr('disabled','disabled');
	}
});
var reqArray = []; // for requered 
$(document).on('change','.recharge_amount', function(){
	$('.save-multiple-recharge-btn').removeAttr('disabled');
	reqArray.push($(this).attr('data-id'));
	$('#current_id').val(reqArray);
});
$(document).on('change','#enable-multi-recharge', function(){
	$('.normal-recharge-td').toggle();
	$('.multiple-recharge-td').toggle();
	$('#multiple-recharge-btn').toggle();
	$(".multiple-recharge").prop("checked", false);
	$('#multiple-recharge-btn').attr('disabled','disabled'); 
});
$(document).on('change','.multiple-recharge', function(){
	if($('.multiple-recharge:checkbox:checked').length > 0){
		$('#multiple-recharge-btn').removeAttr('disabled');
	}else{
		$('#multiple-recharge-btn').attr('disabled','disabled');
	} 
});


function getJobCostUserLogs(){

	var url = $('#common_ajax').val();
	
	$.ajax({
		type: 'POST',
		url: url,
		data: {
			'action_type' : 'job_cost_user_logs',
			'job_number' : $('#da_job_number').val()
		},
		success: function(response){
			$("#document_btn_div").html(response);
			$('#ajax_status').val(1);
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});
}
//multipaste
$(document).on('click', '#multiple_paste_jobcost', function(e) {
	  var jnumber = $(this).data('jobno');
	  var suppname = $(this).data('supp');
	  var actamt = $(this).data('actamt');
	  $('.ajax-loader').show();
			    $.ajax({
						type: 'POST',
						url: appHome+'/job-cost/common_ajax',
						beforeSend: function() {
							$('#job-number-search-btn').html('<i class="fa fa-spinner fa-spin"></i>');
					          	},
					   		data: {
									'jnumber' : jnumber,
									'actamt' : actamt,
									'suppname' : suppname,
									'action_type' : 'multiple_paste_jobcost',
									
								  },
						success: function(responseString){
							if(responseString){
								$('.ajax-loader').hide();
								$('.job-cost-list-multipaste').html(responseString);
							}	
						}
			    });
});
/*$(document).on('change', '.multipaste_actamt', function(e) {
	var actamt = $('#multipastehidden').val();
	var total_amt = 0;
	$('.multipaste_actamt').each(function() {
         total_amt = parseInt(total_amt) + parseInt($(this).val());
	});
	if(parseInt(total_amt) > parseInt(actamt)) {
		var msg = '<div class="alert alert-danger">'
							+'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'
							+'<i class="fa fa-exclamation-circle"></i> <strong>Sorry</strong>,'
							+'</div>';
	    $('#multipaste-jobcost-response').html(msg);
	    $('#multipaste-update').attr('disabled','disabled');  
	}else{
        $('#multipaste-jobcost-response').empty();
		$('#multipaste-update').removeAttr('disabled');
	}

});*/

$(document).on('click', '#multipaste-update', function(e) {
	$('#response').empty().prepend(localStorage.getItem('response')).fadeIn();
	localStorage.clear();
	//var inputs = $('#multipaste-jobcost-form :input');
	data_array = $("#multipaste-jobcost-form").serialize().replace(/%5B%5D/g, '[]');
	 $.ajax({
						type: 'POST',
						url: appHome+'/job-cost/update_multipaste_jobcost',
						data: $("#multipaste-jobcost-form").serialize().replace(/%5B%5D/g, '[]'),
						success: function(responseString){
							 location.reload();
							 localStorage.setItem('response', responseString);	
						}
			    });
});

$(document).on('click', '.supplier-invoice-btn', function(e) {
	var $this = $(this);
	var jcid = $this.data('id');
	$('#suppInvFileListNew').html('<tr class="file-row"><td colspan="5"><div class="text-center"><i style="font-size:50px;" class="fa fa-spinner fa-spin"></i></div></td></tr>');
	$.ajax({
			type	: 'POST',
			url		: appHome+'/job-cost/common_ajax',
			data	: {
						'action_type' 	: 'get_job_cost_files',
						'jcid' 		: jcid,
					  },
			success : function(response){
				$('#suppInvFileListNew').html(response);
			},
			error : function(){

			}
		});

});

$(document).on('click', '.sub-invoice-tr', function(e) {	
    $(this).find('span').toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
    $(this).closest('tr').next('.sublist-invoice-tr').toggle('slow');
});

function showSubCommentMoreLess(){
    var showChar = 20;  // How many characters are shown by default
    var lesstext = "<i class='fa fa-minus-circle'></i>";
    $('.sub_more').each(function() {
        var content = $(this).html();
        var moretext = '<i class="fa fa-plus-circle comment-show red-tooltip" data-html="true" data-comment="'+content+'"></i>';
        if(content.length > showChar) {
           var c = content.substr(0, showChar);
           var h = content.substr(showChar, content.length - showChar);
		   var html = c + '<span class="sub_morecontent"><span>' + h + '</span><a href="" class="sub_morelink" more-data="'+content+'">' + moretext + '</a></span>';
           $(this).html(html);
        }
        
    });

    $(document).on("click",".sub_morelink", function(e){   
		e.preventDefault();   
	    if($(this).hasClass("less")) {
	        $(this).removeClass("less");
	        var content = $(this).attr('more-data');
		    var moretext = '<i class="fa fa-plus-circle comment-show red-tooltip" data-html="true" data-comment="'+content+'"></i>';
	        $(this).html(moretext);
	    } else {

	        $(this).addClass("less");
	        $(this).html(lesstext);
	    }
	    $(this).parent().prev().toggle();
	    $(this).prev().toggle();
	    return false;
	});
}

$(document).on('click','#oncarriagejob_btn', function(e){
    $('#oncarriagejob_btn i').toggleClass('fa-minus-circle fa-plus-circle');
}); 


$('#oncarriagejob_btn').click(function(e){
	if($("#oncarriagejobcosttable").html() == ""){
		$("#oncarriagejobcosttable").html('<div class="text-center"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i></div>');
		showOncarrageJobCost($(this).attr('data-jobno'));
	}
});

function showOncarrageJobCost(job_num){
	$.ajax({  
			type: "POST", 
			cache: false, 
			url: appHome+'/job-cost/common_ajax',
			dataType: "html",
			data: ({
				'action_type':'show_job_cost_table',
				'job_num':job_num
			}),
			success: function(result){ 
				$('#oncarriagejobcosttable').hide().html(result).fadeIn('slow');
			},
			error: function(){
				$('#oncarriagejobcosttable').hide().html('<p class="error">Sorry but an unexpected error occured.</p>').fadeIn('slow');
			}
		});	
		return false;
}
if($('#oncarriagejob_btn').length > 0){ $('#oncarriagejob_btn').trigger('click'); }

$(document).on('click', '.add-job-cost', function(e){

	var jobno = $(this).data('jobno');
	var oncarragejob = $(this).data('oncarragejob');
	if(oncarragejob != ""){
		var msgdiv = '<div class="ondemurragejob-div"><p style="text-align: center;"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i><p></div>';
  		BootstrapDialog.show({
  			title: 'Confirmation',
  			type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: false, // <-- Default value is false
            draggable: false, // <-- Default value is false
            message: msgdiv,
            onshow: function(dialog) {
	                dialog.getButton('ondemurrage-btn-ok').disable();
	            },
            buttons: [{
            	id: 'ondemurrage-btn-ok',
                label: 'OK',
                icon: 'glyphicon glyphicon-ok-sign',       
		        cssClass: 'btn-warning',
		        
                action: function(dialogRef) {
                	var rad = dialogRef.getModalBody().find('[name="add-plan-select-job"]:checked');
                	dialogRef.close();
					window.location.href = rad.attr('data-href');
                }
            },
            {
                label: 'Cancel',
                icon: 'glyphicon glyphicon-remove-circle', 
                action: function(dialogRef) {
                    dialogRef.close();
                }
            }]
    	});
    	setTimeout(function(){ 
    		//ajax function for get msg start
	    	$.ajax({
				type: 'POST',
				url: appHome+'/job/common_ajax',
				data: {
					'jobno' : jobno,
					'action_type' : 'get_oncarriage_msg',
					'callfrom' : 'jobcost',
					'oncarragejob' : oncarragejob
				},
				success: function(response){
					$('.ondemurragejob-div').html(response);
					$('#ondemurrage-btn-ok').removeClass('disabled');
					$('#ondemurrage-btn-ok').attr('disabled', false);
				},
				error: function(response){
					$('.ondemurragejob-div').html('Failed to Fetch details. Try again later.');
				}
			});
			//ajax function for get msg end
    	 }, 1000);

    	
	}else{
		window.location.href = appHome+'/job-cost/'+jobno+'/create';
	}
});
$('#insurance-po-btn').hide();
$(document).on('click', '#insurancepo', function(e) {
	if($('.insurance_po:checked').length < 1){
		$('#insurance-po-btn').hide();
	}else{
		$('#insurance-po-btn').show();
	}
});

$(document).on('click', '#insurance-po-btn', function(e) {
	e.preventDefault();
	
	BootstrapDialog.show({
		type: BootstrapDialog.TYPE_PRIMARY,
		title: 'Confirmation',
		message: 'Are you sure want to link to Insurance PO?',
		buttons: [{
			label: 'Close',
			action: function (dialogItself) {
				dialogItself.close();
			}
		}, {
			label: 'Ok',
			cssClass: 'btn-primary',
			action: function (dialogItself) {
				dialogItself.close();
				var obj = {};
				$(".insurance_po").each(function() {
					if ( $(this).prop('checked') ) {
						if (typeof $(this).data('id') !== 'undefined') {
							var id  = $(this).attr("data-id");
							var val = $(this).closest('td').next('td').find(":selected").val();
							obj[id] = val;
						}
					}
					});
					
					var ids = JSON.stringify(obj);
					var po 	= $('#ins_num').val()
					$.ajax({
						type		: "POST",
						url			: appHome+'/job-cost/common_ajax',
						data		: ({
										'action_type' 	: 'update_job_insurance_costing',
										'ids'		  	: ids,
										'main_id'		: $('#ins_main_id').val(),
										'sub_id'		: $('#ins_sub_id').val()
									}),  
						success: function(response){
							if(response == "success"){
								window.location.href = appHome+'/insurancepo/create?po_number='+po;
							}	
						}  
					});
			}
		}]
	});

	

		
});

$('#claim-link-btn').hide();
$(document).on('click', '#claimpo', function(e) {
	if($('.claim_po:checked').length < 1){
		$('#claim-link-btn').hide();
	}else{
		$('#claim-link-btn').show();
	}
});

$(document).on('click', '#claim-link-btn', function(e) {
	e.preventDefault();
	
	BootstrapDialog.show({
		type: BootstrapDialog.TYPE_PRIMARY,
		title: 'Confirmation',
		message: 'Are you sure want to link to Claim?',
		buttons: [{
			label: 'Close',
			action: function (dialogItself) {
				dialogItself.close();
			}
		}, {
			label: 'Ok',
			cssClass: 'btn-primary',
			action: function (dialogItself) {
				dialogItself.close();
				var obj = {};
				$(".claim_po").each(function() {
					if ( $(this).prop('checked') ) {
						if (typeof $(this).data('id') !== 'undefined') {
							var id  = $(this).attr("data-id");
							var val = $(this).closest('td').next('td').find(":selected").val();
							obj[id] = val;
						}
					}
					});
					
					var ids = JSON.stringify(obj);
					var claimid 	= $('#ins_sub_id').val()
					$.ajax({
						type		: "POST",
						url			: appHome+'/job-cost/common_ajax',
						data		: ({
										'action_type' 	: 'update_job_claim_costing',
										'ids'		  	: ids,
										'main_id'		: $('#ins_main_id').val(),
										'sub_id'		: $('#ins_sub_id').val()
									}),  
						success: function(response){
							if(response == "success"){
								window.location.href = appHome+'/claim/'+claimid+'/edit';
							}	
						}  
					});
			}
		}]
	});		
});