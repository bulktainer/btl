$(document).ready(function(){

	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
	
	//Create and update the consignee
	$('.create-consignee,.edit-consignee').click(function(e){
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
		//Email validation
		function isEmail(email) {
			  //var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
			  var regex = btl_email_regex;
			  var t = regex.test(email.val());
			  if(t){
				  $(email).parent().removeClass('highlight');
				  success.push(true);
			  }else{
				  $(email).parent().addClass('highlight');
			        success.push(false);
			  }
		}
		
		
		//To check whether the consignee name exist or not
		function isConsigneeNameExists(customer,button){
			ExistSuccess = [];
			if(button.hasClass('edit-consignee')){
		  		var type = "update";
		  	}
		  	if(button.hasClass('create-consignee')){
		  		var type = "create";
		  	}
		  	var consigneename  = $('#consig_code').val();
		  	if(type == "create"){
				  $.ajax({
				        type: 'POST', 
				        url: appHome+'/consignees/common_ajax',  
				        async : false,
				        data: {
							'consigneename' 	: consigneename,
							'type'	   			: type,
							'action_type' 		: 'consignee_name_exist'
						},
				        success: function(response){
				        	if(response > 0){
				        		ExistSuccess = 'Exist'
				        		$('#cust_code').parent().addClass('highlight');
				        	}else{
				        		ExistSuccess = 'Ok'
				        		$('#cust_code').parent().removeClass('highlight');
				        	}
				        },
				        error: function(response){
				          $('html, body').animate({ scrollTop: 0 }, 400);
				          $('form').find('#response').empty().prepend(alert_error).fadeIn();
				        }
				  });
			}
		  	
		}
		
		highlight($(form).find('#consig_code'), '');
		highlight($(form).find('#consig_name'), '');
		highlight($(form).find('#consig_address1'), '');
		highlight($(form).find('#country'), '');
		highlight($(form).find('#town'), '');
		highlight($(form).find('#post_code'), '');
		highlight($(form).find('#telephone'), '');
		highlight($(form).find('#email'), '');
		
		
		isEmail($(form).find('#email'));
		
		if($('#consig_code').val() != '' ){
			isConsigneeNameExists($(form).find('#consig_code'),$(this)); //function for chech customer name exist or not
		}
		
		if(ExistSuccess == 'Exist'){
			  success.push(false);
		  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This Consignee Code already exists.</div>';
		  }else{
			  success.push(true); 
			  alert_required = oldalert;
		  }   
		  var check_fields = (success.indexOf(false) > -1);
		  
		  /**
		   * To create the new consignee code
		   */
		   if($(this).hasClass('create-consignee')){
		     if(check_fields === true){
		       $('html, body').animate({ scrollTop: 0 }, 400);
		       $('form').find('#response').empty().prepend(alert_required).fadeIn();
		     } else {
		       $.ajax({
		         type: 'POST',
		         url: path+'/add',
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
		   
		   /**
		    * To edit and update the consignee
		    */
		    if($(this).hasClass('edit-consignee')){
		  	 
		      if(check_fields === true){
		        $('html, body').animate({ scrollTop: 0 }, 400);
		        $('form').find('#response').empty().prepend(alert_required).fadeIn();
		      } else {
		    	  var consig_id = $('#consig_id').val();
		        $.ajax({
		          type: 'POST',
		          url: appHome+'/consignees/'+consig_id+'/update',
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

//To delete the consignee details
	$(document).on('click','.delete-consignee',function(e){
		e.preventDefault();
		var delete_url 	= $(this).attr('href'),
			consig_id 	= $(this).data('consig-id'),
			return_url 	= window.location.href;
		BootstrapDialog.confirm('Are you sure you want to delete this Consignee?', function(result){
			if(result) {
				$.ajax({
					type : 'POST',
					url  : delete_url,
					data :{
						'consig_id' 	: consig_id
					},
					success: function(response){
						window.location.href = return_url;
						localStorage.setItem('response', response);
					},
					error: function(response){
						BootstrapDialog.show({title: 'Error', message : 'Unable to delete. Please try later.',
							 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
						});
					}
				});
			}
		});
	});

	//To view the details of the corresponding consignee
	$(document).on('click','.view_consignee',function(e){
		$('.view_small_loader').show();
		$('.reset_values').html('');
		var consig_id = $(this).data('id');
		$.ajax({
			type	: 'POST',
			dataType: 'json',
			url		: appHome+'/consignees/common_ajax',
			data	:{
				'consignee_id' : consig_id,
				'action_type'  : 'view_consignee_details'
				},
			success	:function(response){
				$('.view_small_loader').hide();
				if(response != ""){
					$('#modal_consig_status').html(response.consig_status.toUpperCase());
					$('#modal_consig_code').html(response.consig_code);
					$('#modal_consig_name').html(response.consig_name);
					$('#modal_consig_addr1').html(response.consig_addr1);
					$('#modal_consig_addr2').html(response.consig_addr2);
					$('#modal_consig_town').html(response.consig_town);
					$('#modal_consig_state').html(response.consig_state);
					$('#modal_consig_postcode').html(response.consig_postcode);
					$('#modal_country_name').html(response.consig_country_name);
					$('#modal_consig_contact').html(response.consig_contact);
					$('#modal_consig_tel').html(response.consig_tel);
					$('#modal_consig_email').html(response.consig_email);
					$('#modal_consig_eori').html(response.consig_eori);
					$('#modal_consig_approve').html(response.consig_approve);
				}
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	});

$("#telephone").keypress(function(e){
	var strCheckphone = '0123456789-+() ';
	var key = '';
	var whichCodeNum = (window.Event) ? e.which : e.keyCode;

	if(window.navigator.userAgent.indexOf("MSIE") > -1){
		whichCodeNum = e.keyCode; 
	}
	
	if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter

	key = String.fromCharCode(whichCodeNum);

	if(strCheckphone.indexOf(key) == -1) return false;  // Not a valid key
});

$(document).on('click', '.delete_document', function(e){ 
		var doc_id = $(this).data('id');
		//var doc_type = $(this).data('type');

		BootstrapDialog.show({
         type: BootstrapDialog.TYPE_DANGER,
         title: 'Confirmation',
         message: 'Are you sure want to Delete?',
         buttons: [{
		             label: 'Close',
		             action: function(dialogItself){
		                 dialogItself.close();
		             }
		         },{
	             label: 'Ok',
	             cssClass: 'btn-danger',
	             action: function(dialogItself){
	            	 	dialogItself.close();
	            		$.ajax({
	            			type: 'POST',
	            			url: appHome+'/consignees/common_ajax',
	            			data: {
	            				'doc_id' : doc_id,
	            				'action_type' : 'delete_document'
	            				  },
	            			success: function(response){
	            					var consig_id = $('#file_upload_consig_id').val();
		            				uploadList(consig_id);
	            			},
	            			error: function(response){
	            				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
	            					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
	            				});
	            			}
	            		});;
	             }
         }]
     });
	});
	//if($('#form_type').val() == 'edit'){
		uploadList($('#file_upload_consig_id').val());
	//}
	$('.doc-uploaded').click(function(){
		var consig_id = $(this).data('id');
		uploadList(consig_id);//Show the uploaded file
	});
	
});//end of document ready

/**
 * document file uplad function
 */
function documentFileUpload(e) {


	
	var filename = $("#fileName").val();
	var filenameCtrl = $("#fileName");
	
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
			fd.append("consig_id", $('#file_upload_consig_id').val());
			fd.append("new_file_name", $('#fileName').val());
			fd.append("new_file_discription", $('#fileDesc').val());
			var xhr = new XMLHttpRequest();
		
			// file received/failed
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
						$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
						xhr.addEventListener("load", documentFileUploadComplete, false);
						$('#progress_num_uf').addClass(xhr.status == 200 ? "success" : "failure");
					
				}
			};

			xhr.upload.addEventListener("progress", documentFileUploadProgress, false);
			xhr.addEventListener("load", documentFileUploadComplete, false);
			xhr.addEventListener("error", documentFileUploadFailed, false);
			xhr.addEventListener("abort", documentFileUploadCanceled, false);
			xhr.open("POST", uploadPath);
			xhr.send(fd);
	
		}else{
			filenameCtrl.val('');
			filenameCtrl.focus();
		}
}

/**
 * process function
 * @param evt
 */
function documentFileUploadProgress(evt) {
	
	$("#upload_btn").attr('disabled',true);
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progress_num_uf').show();
	$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
	$('#upload-progress-bar').css('width',percentComplete.toString()+ '%');
	$('#upload-progress-bar').data('aria-valuenow',percentComplete.toString());
	$('#upload-progress-bar').html(percentComplete.toString() + '%');
}

/**
 * when upload is failed
 * @param evt
 */
function documentFileUploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

/**
 * if uplad is cancel
 * @param evt
 */
function documentFileUploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}

/**
 * upload complete
 * @param evt
 */
function documentFileUploadComplete(evt) {
	var consig_id = $('#file_upload_consig_id').val();
	$("#upload_btn").attr('disabled',true);
	setTimeout( function(){
				  uploadList(consig_id);
				  $('#progress_num_uf').hide();
			  }, 1000);
}


function uploadList(consig_id){
	
	$('.loadershow').show();
	$formType = $('#form_type').val();
	$('#fileSize,#fileType').html('');
	$("#upload_btn").attr('disabled',true);
	$('#upload-progress-bar').css('width','0%');
	$('#upload-progress-bar').data('aria-valuenow','0');
	$('#upload-progress-bar').html('');
	$('.highlight').removeClass('highlight');
	
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: appHome+'/consignees/common_ajax',
		beforeSend: function() {
            // setting a timeout
        	},
		data: {
			'consig_id' : consig_id,
			'action_type' : 'get_document_list'
			  },
		success: function(response){
			$('.loadershow').hide();
			$('.product-pannel-file-list').show();
			$("#fileName").val('');
			$("#file_to_upload").val('');
			$("#fileDesc").val('');

			var del_class = 'delete_document';
			var mousepointer = "color:red;";
			if($('#upload_btn').length == 0){
				del_class = '';
				mousepointer = "display: none;";
			}
			tddata = "";
			if ( response.length > 0 ) {
				$.each(response, function(i, item) {
					tddata += '<tr>'+
								'<td><a target="_blank" href="'+item.prePath+'">'+item.fileName+'</a></td>'+
								'<td class="text-left" >'+item.docs_description+'</td>'+
								
								'<td class="text-left" >'+item.docDate+'</td>';
					
					tddata +=	'<td class="text-center" ><a target="_blank" title="Download Document" href="'+item.prePath+'"><i class="fa fa-download"></i></a></td>'+
								'<td class="text-center" ><a style="'+mousepointer+'" class="'+del_class+'" data-id="'+item.docs_id+'" href="javascript:void(0);" title="Delete Document"><i class="fa fa-trash-o"></i></a></td>'+								
							 '</tr>';
				});
				
			}else{
				tddata +='<tr id="emptyFilesTr" class="">'+
							'<td style="text-align:center;" colspan="6"><p class="alert alert-warning" style="margin-bottom:0;">No files found.</p></td>'+
						 '</tr>';
			}
			$('#fileAttachment').html(tddata);
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});
}
	
	//file upload start---------------------------------------
	$(document).on('change','#file_to_upload',function(){
		changeFileToUpload();
	});

	function changeFileToUpload(){
		//$('#file_to_upload').change(function(){

			var file = document.getElementById('file_to_upload').files[0];
			$('#fileSize,#fileType,#fileExist').show();
			if (file) {
			  var fileSize = 0;
			  if (file.size > 1024 * 1024)
				fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
			  else
				fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
			  
			  var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
			  document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
			  document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
			  document.getElementById('fileName').value = Math.floor((Math.random() * 99999) + 10000) +'-'+fname;
			  document.getElementById("fileName").select(fname);
			 
			}
			
			var file_cntrl = $('#file_to_upload');
			var $messageDiv = $('#upMessage'); 
			if(file_cntrl.val() != "" )
			{
				if(file.size > 20971520){
					$messageDiv.show().html('<font color="red">File should be less than 20 MB </font>'); 
					//setTimeout(function(){ $messageDiv.hide().html('');}, 3000);
					$('#upload_btn').attr('disabled','disabled');
				}else{
					$messageDiv.show().html(''); 
					$("#upload_btn").removeAttr('disabled');
				}
	
			}		
				$('#upload-progress-bar').css('width','0%');
				$('#upload-progress-bar').data('aria-valuenow','0');
				$('#upload-progress-bar').html('');
	}

	$(function() {
		if($("#form_type").val() == "Create" || $('#form_type').val() == "edit"){
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