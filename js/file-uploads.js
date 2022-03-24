/**
 * 
 */

var docTypeName = "Document";
var pageName = "Customer";

$(document).ready(function(){
	if($('#docTypeName').val()){
		docTypeName = $('#docTypeName').val();
	}
	if($('#page_name').val()){
		pageName = $('#page_name').val();
	}	
});

function documentFileUpload(e) {
	var filename = "";
	var filenameCtrl = "";
	var jobFileType = "";
	if($('#job-filetype-plan').length > 0){
		var jobFileType = $('#job-filetype-plan').val();
	}
	
	if(pageName != 'Customer'){
		filename = $("#JobfileName").val();
		filenameCtrl = $("#JobfileName");
	}else {
		filename = $("#fileName").val();
		filenameCtrl = $("#fileName");
	}
	
	if(filename.trim() != ''){
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
			if($('input[name="file_upload_cust_id"]').val()){
				fd.append("file_upload_cust_id", $('input[name="file_upload_cust_id"]').val());
			}
			if(pageName != 'Customer'){
				fd.append("jobnumber", $('#jobnumber').val()); 
				fd.append("fileCustomerAccess", $('#fileCustomerAccessModal').val());
				fd.append("j_planid", $('#plan_id').val());
				fd.append("fname", filename);
				fd.append("jobFileType", jobFileType);
			}
			var xhr = new XMLHttpRequest();
		
			// file received/failed
			xhr.onreadystatechange = function(e) {

					if (xhr.readyState == 4) {
						try {
							$('#upload_btn').html('&nbsp;Upload');
							$('#upload_btn').attr('disabled',false);
							var resultArr = JSON.parse(xhr.response);
							if(resultArr.status == 'Exists'){ 
								var filePrefix = $('#filePrefix').val();
								var f = filename;
								$('#upload-progress-bar').data('aria-valuenow','0');						
								$('#upload-progress-bar').html('<a href ="'+filePrefix+'/job-files/'+f+'" target="_blank">'+f+'</a>&nbspalready exists. Please rename above.');
								$('#upload-progress-bar').removeClass('progress-bar-success').addClass('progress-bar-danger');
								filenameCtrl.focus();
							} else {
								$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
								xhr.addEventListener("load", tankPlanFileUploadComplete, false);
								$('#progress_num_uf').addClass(xhr.status == 200 ? "success" : "failure");
								$(resultArr.message).insertAfter( "#progress_num_uf" );
								
								setTimeout(function(){ $('.temp-upload-msg').remove(); }, 3000);
								if(jobFileType != "" && resultArr.status == 'success'){

									if((resultArr.message).indexOf("Zoom") > 0){//remove selected item
										$(".job-filetype").find('[value="'+jobFileType+'"]').remove();
									}
									if(pageName == 'job-edit'){
										jobFileListingFun(0);
										getRequestDocList();
									}
								}
							}
					    } catch (e) {
					        return false;
					    }

						}
			};
			if(pageName != 'Customer'){
				xhr.upload.addEventListener("progress", tankPlanFileUploadProgress, false);
				//xhr.addEventListener("load", tankPlanFileUploadComplete, false);
			}else{
				xhr.upload.addEventListener("progress", documentFileUploadProgress, false);
				xhr.addEventListener("load", documentFileUploadComplete, false);
			}
			xhr.addEventListener("error", documentFileUploadFailed, false);
			xhr.addEventListener("abort", documentFileUploadCanceled, false);
			xhr.open("POST", uploadPath);
			xhr.send(fd);
	
		}else{
			filenameCtrl.val('');
			filenameCtrl.focus();
		}
}

function documentFileUploadProgress(evt) {
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progress_num_uf').show().html(percentComplete.toString() + '%');
}

function tankPlanFileUploadProgress(evt){
	$('#upload_btn').attr('disabled',true);
	$('#upload_btn').html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Upload');
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progress_num_uf').show();
	$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
	$('#upload-progress-bar').css('width',percentComplete.toString()+ '%');
	$('#upload-progress-bar').data('aria-valuenow',percentComplete.toString());
	$('#upload-progress-bar').html(percentComplete.toString() + '%');
} 

//function for listing in the tank plan
function tankPlanFileUploadComplete(evt){
	var id = $('#attachable_id').val();
	var jobnumber = $('#jobnumber').val();
	tankplanFileList(id,jobnumber);
	$('#progress_num_uf').delay(2000).fadeOut('slow');
	$('.docs-icon[data-id="'+ id +'"]').find('.fa').removeClass().addClass('fa fa-file');
}

function tankplanFileList(id,jobid){
	var url = $('#docs-list').val();
	var loader = '<tr><td colspan="6" style="text-align:center;"><img src="'+$('.big_loader_path').val()+'" /></td></tr>'
	$('#fileAttachment').html(loader);
	
	$.ajax({  
		type: "POST", 
		cache: false, 
		url: url,  
		dataType: "text",
		data: ({
			'id' :id,
			'jobid' : jobid
		}),  
		success: function(result)
		{ 
			$('#fileAttachment').html(result);
			$('#jobnumber').val(jobid);
			$("#file_to_upload").val("");
			$("#file_desc,#JobfileName,.job-filetype").val("");
			$('#fileSize,#fileType,#fileExist').html('');
			$("#upload_btn").attr('disabled','disabled');
		}  
	});
}

function documentFileUploadComplete(evt) {

	// clear the form
	$("#file_to_upload").val("");
	$("#file_desc,#fileName").val("");
	$("#upload_btn").attr('disabled','disabled');
	
	// fade out the progress indicator for added sexiness
	$('#progress_num_uf').delay(2000).fadeOut('slow');

	var row = JSON.parse(evt.target.responseText);

	var table = $('.si-file-list');
	table.children('tbody').append(
				'<tr class="new-ajax-row success">'
				+ '<td>'+ row.id +'</td>'
				+ '<td><a href="' + row.path + '" target="_blank" title="View /Download file">' + row.path + '</a></td>'
				+ '<td><div class="wrap-td-texts-200">' + row.description + '</div></td>'
				+ '<td>'+row.created_at+'</td>'
				+ '<td style="white-space:nowrap"><a href="#" title="Delete "+docTypeName class="delete-upload_doc_files" data-fileid="' + 0 + '" data-attid="' + row.id + '" data-path="' + row.path + '" ><i class="fa fa-trash-o"></i> Delete</a></td>'
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

function documentFileUploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

function documentFileUploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}

/*
* function called from job.js also

*/
function getDocTypeDDValues(jobId){
	$.ajax({
			type: "POST", 
			url: appHome + '/job/common_ajax', 
			dataType: "text",
			data: ({
				'action_type' : 'get_dtype_opt',
				'jobid': jobId
			}),  
			success: function(response){ 
				$(".job-filetype").html('<option value="">Please Select</option>'+response);
			}  
	});
}

$(document).ready(function(){
	$('.upload-doc-btn').click(function(){
		var $this = $(this);
		var attachid = $this.data('id');
		var up_files = $('[data-attachid="'+attachid+'"]');
		var up_file_list = $("#UpFileFileList");
		var up_file_list_html = "";
		var filePrefix = $("#filePrefix").val();
		
		up_files.each(function(){
			var thisFile = $(this);

			up_file_list_html +='<tr class="file-row">'
								+ '<td>'+ thisFile.data('attid') +'</td>'
								+ '<td><a class="delete-upload_doc_download_lnk" href="' + filePrefix + thisFile.data('path') + '" target="_blank" title="View /Download file">' + thisFile.data('path') + '</a></td>'
								+ '<td>' + thisFile.data('date') + '</td>'
								+ '<td><a href="' + filePrefix + thisFile.data('path') + '" target="_blank" title="View /Download file"><i class="fa fa-download"></i></a></td>'
								+ '<td class="center-cell"><a href="#" title="Delete "+docTypeName class="delete-upload_doc_files" data-fileid="' + thisFile.data('fileid') + '" data-attid="' + thisFile.data('attid') + '" data-path="' + thisFile.data('path') + '" ><i class="fa fa-trash-o"></i></a></td>'
								+'</tr>';
		});
		
		up_file_list.html(up_file_list_html);
		
	});

	$(document).on('click', '.file-upload-btn', function(){
		var id = $(this).attr('data-id');
		var jobid = '0';
		if(pageName == 'job-edit'){
			jobid = $(this).parents('tr').attr('tr-data-jobno');
		}else if(pageName == 'tank-plan-index'){
			jobid = $(this).parents('tr').attr('tr-data-jobno'); //changes due to new columns added in tank plan
		} else {
			jobid = $(this).parents('tr').find('td:eq(3)').text();
		}
		$('#plan_id').val(id);
		tankplanFileList(id,jobid);
		$("#upload_btn").attr('disabled','disabled');
		$('#file_to_upload').val('');
		$('#progress_num_uf').hide();
		$('#file_desc,#JobfileName').val('');
		$('#fileSize,#fileType,#fileExist').html('');
		getDocTypeDDValues($(this).attr('data-jobid'));
		
	});
	
	$(".delete-upload_doc_files").live('click', function(e){
		e.preventDefault();
		
		$this = $(this);
		up_fileInfo = $this.data();
		file_deletePath = $("#fileDelPath").val();
		attachid = 0;
		siFileListCount = 0;

		BootstrapDialog.confirm('Are you sure you want to delete the '+ docTypeName +'#'+up_fileInfo.attid+'?', function(result){
			if(result == true) {
				$.ajax({
					type: "POST", 
					cache: false, 
					url: file_deletePath, 
					dataType: "json",
					data: ({
						'aid' : up_fileInfo.attid,
						'path': up_fileInfo.path
					}),  
					success: function(response)
					{ 
						
						if(response.result === 'success') {
							//remove icons
							$this.parents('tr').remove();
							
							attachid = $('[data-attid="'+up_fileInfo.attid+'"][data-fileid="'+up_fileInfo.fileid+'"]').data('attachid');
							$('[data-attid="'+up_fileInfo.attid+'"][data-fileid="'+up_fileInfo.fileid+'"]').remove();
		
							if ($('[data-attachid="' + attachid + '"]').length == 0) {
								$('[data-id="'+ attachid +'"][data-info="DEL"]').remove();
							}
		
							siFileListCount = $(".si-file-list tr").length;
							if (siFileListCount == 2)
							{
								$("#emptyFilesTr").removeClass();
							}
							
							tp_file_list = $(".tp-file-list tr").length;
							if (tp_file_list == 2)
							{
								var id = $('#attachable_id').val();
								$('.docs-icon[data-id="'+ id +'"]').find('.fa').removeClass().addClass('fa fa-file-o');
							}
							
							if($('#page_name').val() == "job-edit"){
								$('.delete-row[data-id="'+up_fileInfo.attid+'"]').parents('tr').remove();
							}
		
						}
					}  
				});
			}
		});		
		
	});
	
	
	
	
	
});
$('#file_to_upload').change(function(){
	changeFileToUpload();
});
function changeFileToUpload(){
	var file = document.getElementById('file_to_upload').files[0];
		if (file) {
		  var fileSize = 0;
		  if (file.size > 1024 * 1024)
			fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
		  else
			fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
		  
		  var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
		  
		  if(pageName != 'Customer'){
			  document.getElementById('JobfileName').value = $('#jobnumber').val()+'-'+fname;
			  document.getElementById("JobfileName").select(fname);
			  document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
			  document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
		  } else {
			  document.getElementById('fileName').value = $('#jobnumber').val()+'-'+fname;
			  document.getElementById("fileName").select(fname);
		  } 
		 
		}
		
		var file_cntrl = $('#file_to_upload');
		if(file_cntrl.val() != "" )
		{
			$("#upload_btn").removeAttr('disabled');
		}
		if($('#page_name').val() != 'Customer'){
			$('#upload-progress-bar').css('width','0%');
			$('#upload-progress-bar').data('aria-valuenow','0');
			$('#upload-progress-bar').html('');
		}
}
$(function() {
	if((pageName == "Customer" && ($('#form_type').val() == "Create") || ($('#form_type').val() == "edit"))){
			Dropzone.autoDiscover = false;
			//Dropzone class
			var myDropzone = new Dropzone("body", {
				url: "#",
				// acceptedFiles: "image/*,application/pdf",
				maxFiles : 1, 
				previewsContainer: "#file-upload-panel",
				disablePreviews: true,
				autoProcessQueue: false,
				uploadMultiple: false,
				clickable: false,
				init : function() {
		
					myDropzone = this;
			
					//Restore initial message when queue has been completed
					this.on("drop", function(event) {
						if(event.dataTransfer.files.length > 0){
							fileInput = document.getElementById("file_to_upload"); 
							fileInput.files = event.dataTransfer.files;
							document.getElementById("file-upload-panel").scrollIntoView();
							$("#file-upload-panel").css("background-color", "#bdbdbd");
							setTimeout(() => {
								$("#file-upload-panel").css("background-color", "unset");
							}, 800);
							changeFileToUpload();
							setTimeout(() => {
								// documentFileUpload(); to automatic upload
								myDropzone.removeAllFiles( true );
							}, 200);
						}
		
		
					});
			
				}
			});
		}
});

$(function() {
	if($("#drag_and_drop_on_job_tankplan").val()){
		Dropzone.autoDiscover = false;
		//Dropzone class
		var myDropzone = new Dropzone("#FileUpModal", {
			url: "#",
			// acceptedFiles: "image/*,application/pdf",
			maxFiles : 1, 
			previewsContainer: "#uploadModalForm",
			disablePreviews: true,
			autoProcessQueue: false,
			uploadMultiple: false,
			clickable: false,
			init : function() {
	
				myDropzone = this;
		
				//Restore initial message when queue has been completed
				this.on("drop", function(event) {
					if(event.dataTransfer.files.length > 0){
					fileInput = document.getElementById("file_to_upload"); 
					fileInput.files = event.dataTransfer.files;
					document.getElementById("uploadModalForm").scrollIntoView();
					$("#uploadModalForm").css("background-color", "#bdbdbd");
					setTimeout(() => {
						$("#uploadModalForm").css("background-color", "unset");
					}, 800);
					changeFileToUpload(null);
					setTimeout(() => {
						// newUploadFile(null); to automatic upload
						myDropzone.removeAllFiles( true );
					}, 200);
					}
	
				});
		
			}
		});
	}
	if($("#drag_and_drop_on_tankplan_file_upload").val()){
			Dropzone.autoDiscover = false;
			//Dropzone class
			var myDropzone = new Dropzone("#FileUpModal", {
				url: "#",
				// acceptedFiles: "image/*,application/pdf",
				maxFiles : 1, 
				previewsContainer: "#uploadModalForm",
				disablePreviews: true,
				autoProcessQueue: false,
				uploadMultiple: false,
				clickable: false,
				init : function() {
		
					myDropzone = this;
			
					//Restore initial message when queue has been completed
					this.on("drop", function(event) {
						if(event.dataTransfer.files.length > 0){
							fileInput = document.getElementById("file_to_upload"); 
							fileInput.files = event.dataTransfer.files;
							document.getElementById("uploadModalForm").scrollIntoView();
							$("#uploadModalForm").css("background-color", "#bdbdbd");
							setTimeout(() => {
								$("#uploadModalForm").css("background-color", "unset");
							}, 800);
							changeFileToUpload(null);
							setTimeout(() => {
								// newUploadFile(null); to automatic upload
								myDropzone.removeAllFiles( true );
							}, 200);
						}
		
		
					});
			
				}
			});
		}
});
