$(document).ready(function(){
	
	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
/**
* update edit-vgm-route
*/

$('#from_date').change(function(e){ 
	var datefrom = $("#from_date").val();
	if(datefrom !=''){
	    res = datefrom.split("/");
	    var d = new Date(res[2], res[1] - 1, res[0]); // January 1, 2000
	    d.setFullYear(d.getFullYear() + 5);
	    month =  ("0" + (d.getMonth() + 1)).slice(-2);
	    dateres = d.getDate()+'/'+  month  +'/'+d.getFullYear();
	    $('#to_date').val(dateres);
    } else{
    	$('#to_date').val('');
    }
    });
$('#to_date').on('change', function(){
	   var frm_dt = $('#from_date');
	   var to_dt = $('#to_date');

	   var dt1 = Date_Check(frm_dt);
	   var dt2 = Date_Check(to_dt);

	   if(dt1 == true && dt2 == true)
		{
			if(!checkIsValidDateRange(frm_dt.val(),to_dt.val())) {
				BootstrapDialog.show({title: 'Products', message : "MSDS Valid To Date should be greater than 'MSDS Valid From Date'.", buttons: [{
		        id: 'btn-ok',   
		        icon: 'glyphicon glyphicon-check',       
		        label: 'Ok',
		        cssClass: 'btn-primary',
		        data: {
		            js: 'btn-confirm'
		        },
		        autospin: false,
		        action: function(dialogRef){    
		            dialogRef.close();
		        }
		    	}]}); 
			$('#to_date').val($('#old_val_msds_validto').val());
			}
		}
    });
$('.edit-product-master,.create-product-master').click(function(e){
  $('.highlight').removeClass('highlight');
  e.preventDefault();
  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      prod_id = $('input[name="prod_id"]').val(),
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
  function isproductExist(prod_name,button) {
		ExistSuccess = [];
		  
		if(button.hasClass('edit-product-master')){
	  		var type = "update";
	  	}
	  	if(button.hasClass('create-product-master')){
	  		var type = "create";
	  	}
		var prod_id = $('#file_upload_prod_id').val();
		var pname = prod_name.val();
		var custArr = []
        $( "#prod_customer_ids option:selected" ).each(function() {
          custArr.push($( this ).val());
        });
        var customers = custArr.join(',');
		  $.ajax({
		        type: 'POST', 
		        async : false,
		        url: appHome+'/products/common_ajax',    			
		        data: {
		        	'action_type' : 'productname_exist',
					'prod_id'	  : prod_id,
					'pname'		  : pname,
					'type'	      : type,
					'customers'   : customers
				},
		        success: function(response){
		        	if(response > 0){
		        		ExistSuccess = 'Exist'
		        		$(prod_name).parent().addClass('highlight');
		        	}else{
		        		ExistSuccess = 'Ok'
		        		$(prod_name).parent().removeClass('highlight');
		        	}
		        },
		        error: function(response){
		          $('html, body').animate({ scrollTop: 0 }, 400);
		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
		  });
	  }

  highlight($(form).find('#prod_name'), '');
  highlight($(form).find('#prod_bus_type'), '');
  highlight($(form).find('#prod_tank_type'), '');
  highlight($(form).find('#prod_tank_type_desc'), '');
  highlight($(form).find('#prod_appearance'), '');
  highlight($(form).find('#prod_primary_class'), '');
  highlight($(form).find('#prod_secondary_class'), '');
  highlight($(form).find('#prod_tertiary_class'), '');
  highlight($(form).find('#prod_ship_name'), '');
  highlight($(form).find('#prod_sg'), '');
  //highlight($(form).find('#from_date'), '');
  //highlight($(form).find('#to_date'), '');

  if($.trim($("#prod_flash_point_symbol").val()) != ''){
  	  highlight($(form).find('#prod_flash_point'), '');
  }else{
  	$('#prod_flash_point').parent().removeClass('highlight'); //Remove highlight
    success.push(true);
  }
  if($('#prod_name').val() != ''){
	  //function for chech vgm route exist or not
	  isproductExist($(form).find('#prod_name'),$(this));
  }
  if(ExistSuccess == 'Exist'){
	  success.push(false);
  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This Product already exists for the selected customers.</div>';
  }else{
	  success.push(true); 
	  alert_required = oldalert;
  } 
  
  var check_fields = (success.indexOf(false) > -1);
  /**
  * update edit-vgm-route
  */
  if($(this).hasClass('edit-product-master')){

    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {
      $(this).attr('disabled',true);
      $.ajax({
        type: 'POST',
        url: '../'+prod_id+'/update',
        data: $(form).serialize().replace(/%5B%5D/g, '[]'),
        success: function(response){
          window.location.href = $('#returnpath').val();
          localStorage.setItem('response', response);
        },
        error: function(response){
          $('.edit-product-master').attr('disabled',false);
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  }
  
  /**
   * create-vgm-route
   */
   if($(this).hasClass('create-product-master')){
     if(check_fields === true){
       $('html, body').animate({ scrollTop: 0 }, 400);
       $('form').find('#response').empty().prepend(alert_required).fadeIn();
     } else {
    	$(this).attr('disabled',true);
       $.ajax({
         type: 'POST',
         url: path+'/add',
         data: $(form).serialize().replace(/%5B%5D/g, '[]'),
         success: function(response){
           window.location.href = $('#returnpath').val();
           localStorage.setItem('response', response);
         },
         error: function(response){
        	 $('.create-product-master').attr('disabled',false);
           $('html, body').animate({ scrollTop: 0 }, 400);
           $('form').find('#response').empty().prepend(alert_error).fadeIn();
         }
       });
     }
   }
});

//Delete VGM Route
$('.delete-product-btn').click(function(e) {
	e.preventDefault();
	
	var delete_url = $(this).attr('href'),
		prod_id = $(this).data('prod-id'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
	
	BootstrapDialog.confirm('Are you sure you want to delete this Product ?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				url: delete_url,
				data: {'prod_id' : prod_id},
				success: function(response){
					//location.reload();
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

$(document).on('click', '.delete_document', function(e){ 
	var doc_id = $(this).data('id');
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
	            			url: appHome+'/products/common_ajax',
	            			data: {
	            				'doc_id' : doc_id,
	            				'action_type' : 'delete_document'
	            				  },
	            			success: function(response){
	            				var prod_id = $('#file_upload_prod_id').val();
	            				uploadList(prod_id);
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

$('.view_product').click(function(e) {
	$('.view_small_loader').show();
	$('.reset_values').html('');
	var prod_id = $(this).data('id');
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: appHome+'/products/common_ajax',
		data: {
			'prod_id' : prod_id,
			'action_type' : 'get_product_detail'
			  },
		success: function(response){
			$('.view_small_loader').hide();
			if(response != ""){
				$('#modal_prod_name').html(response.prod_name);
				$('#modal_prod_division').html(response.prod_division);
				$('#modal_prod_bus_type').html(response.prod_bus_type);
				$('#modal_prod_tank_type').html(response.prod_tank_type);
				$('#modal_prod_tank_type_desc').html(response.prod_tank_type_desc);
				$('#modal_prod_flash_point').html(response.prod_flash_point);
				$('#modal_prod_melt_point_from').html(response.prod_melt_point_from);
				$('#modal_prod_melt_point_to').html(response.prod_melt_point_to);
				$('#modal_prod_boil_point_from').html(response.prod_boil_point_from);
				$('#modal_prod_boil_point_to').html(response.prod_boil_point_to);
				$('#modal_prod_sg').html(response.prod_sg);
				$('#modal_prod_heat_min').html(response.prod_heat_min);
				$('#modal_prod_heat_max').html(response.prod_heat_max);
				$('#modal_prod_heat_type').html(response.prod_heat_type);
				$('#modal_prod_appearance').html(response.prod_appearance);
				$('#modal_prod_inert_atmosphere_req').html(response.prod_inert_atm_req? 'Yes': 'No');
				$('#modal_prod_unno').html(response.prod_unno);
				$('#modal_prod_primary_class').html(response.prod_primary_class);
				$('#modal_prod_secondary_class').html(response.prod_secondary_class);
				$('#modal_prod_tertiary_class').html(response.prod_tertiary_class);
				$('#modal_prod_ship_name').html(response.prod_ship_name);
				$('#modal_prod_pk_grp').html(response.prod_pk_grp);
				$('#modal_prod_created_by').html(response.prod_created_by);
				$('#modal_prod_create_date').html(response.prod_create_date);
				$('#modal_prod_amended_by').html(response.prod_amended_by);
				$('#modal_prod_amend_date').html(response.prod_amend_date);
				$('#modal_prod_status').html(response.product_status);
				$('#modal_prod_min_max').html(response.prod_tank_capacity_min+'% / '+response.prod_tank_capacity_max+'%');
				$('#modal_prod_msds_from_date').html(response.prod_msds_from_date);
				$('#modal_prod_msds_to_date').html(response.prod_msds_to_date);
				$('#modal_is_prod_hcdg').html(response.prod_is_hcdg);
				$('#modal_prod_authorised_date').html(response.prod_authorised_date);
				$('#modal_prod_authorised_by').html(response.prod_authorised_by);
				if(response.prod_sg_temperature){
					temperature = response.prod_sg_temperature+' ('+(response.prod_sg_temperature_unit ? response.prod_sg_temperature_unit : '')+')'
				}
				else{
					temperature = '';
				}
				$('#modal_prod_sg_temperature').html(temperature);
			}
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});
});
$('.view_documents').click(function(e) {
	var prod_id = $(this).data('id');
	$('#file_upload_prod_id').val(prod_id);
	$('.modal_span_prod_id').html(prod_id);
	uploadList(prod_id);
});


$('.max-length-limit').change(function(){
	var max_value = parseFloat($(this).data('max-length'));
	var this_value = parseFloat($(this).val());
	if(this_value > max_value){
		$(this).val(max_value);
	}else{
		if(Number.isNaN(this_value)){
			this_value = "";	
		}
		$(this).val(this_value);
	}
});


//file upload end---------------------------------------

$(document).on('click', '.prod_upload_change_customer', function(e){ 
	var cust_id = $(this).attr('data-cust-id');
	var cust_code = $(this).attr('data-cust-code');
	if($("#edit_customer_file_upload option[value="+cust_id+"]").length == 0){
		$('#edit_customer_file_upload').append($("<option></option>").attr("value",cust_id).text(cust_code));
	}
	$('#hidden_change_doc_id').val($(this).attr('data-doc-id'));
	$('#edit_customer_file_upload').chosen().val(cust_id).trigger("chosen:updated");	
});


$(document).on('click', '.btn-change-customer', function(e){ 
	
	var doc_id = $('#hidden_change_doc_id').val();
	var customerName = $('#edit_customer_file_upload option:selected').text();
	if(customerName == ""){
		customerName = "-";
	}
	var customerId = $('#edit_customer_file_upload').val();
	$.ajax({
		type: 'POST',
		url: appHome+'/products/common_ajax',
		data: {
			'customer_code' : customerId,
			'doc_id' : doc_id,
			'action_type' : 'change_uploaded_customer'
			  },
		success: function(response){
			$('.prod_upload_change_customer[data-doc-id="'+doc_id+'"]').parent('td').prev('td').text(customerName);
			$('.prod_upload_change_customer[data-doc-id="'+doc_id+'"]').attr('data-cust-id',customerId);
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});;
});

	$('#prod_primary_class').change(function(){
	   if($('#prod_primary_class').val() == 0 || $('#prod_primary_class').val() == "N/A"){ 
	        $('#prod_tank_capacity_min').val("60");
	        $('#prod_tank_capacity_max').val("98");
	    }else {
	        $('#prod_tank_capacity_min').val("80");
	        $('#prod_tank_capacity_max').val("95");
	    }
	});

	$('#prod_transit_temp').click(function(){
		if($(this).prop('checked') == false){
			$("#temp-control-div").hide();
		}else{
			$("#temp-control-div").show();
		}
	});

	$('#prod_unno').change(function(){
		if($.trim($(this).val()) == "" || $.trim($(this).val().toUpperCase()) == "N/A"){
			$("#dg-info").hide();
		}else{
			$("#dg-info").show();
		}
	});
	if($(".multi-sel-ctrl").length != 0){
		$(".multi-sel-ctrl").multiselect({
			enableCaseInsensitiveFiltering: true,
			enableFiltering: true,
			maxHeight: 200,
			buttonWidth: '100%',
			onChange: function(element, checked) {
				if (checked === true && element.val() != '') {
					 element.parent().multiselect('deselect', '');
					 element.parent().multiselect('refresh');
			   }
			   if (checked === true && element.val() == '') {
			       element.parent().val('');
			       element.parent().multiselect('refresh');
			   }
			   if(checked === false && element.parent().val() == null){
			       element.parent().val('');
			       element.parent().multiselect('refresh');
			   }
			}
		});
	}
	$('.tmp-input-ctrl').remove();
});//end of document ready

function uploadList(prod_id){
	$('.product-pannel-file-list').hide();
	$('.loadershow').show();
	$('#file_to_upload,#fileName,#customer').val('');
	$('#customer').chosen().trigger("chosen:updated")
	$('#fileSize,#fileType').html('');
	$("#upload_btn").attr('disabled',true);
	$('#upload-progress-bar').css('width','0%');
	$('#upload-progress-bar').data('aria-valuenow','0');
	$('#upload-progress-bar').html('');
	$('.highlight').removeClass('highlight');
	var hide_del = (btl_default_branch == 'USA') && (btl_common_func == '1') ? '   pointer-events: none;cursor: default;   ' : '';
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: appHome+'/products/common_ajax',
		beforeSend: function() {
            // setting a timeout
        	//$('#ProductFileAttachment').html("<td colspan='4' class='text-center'><img src="+$('#loaderpath').val()+"></td>");
        },
		data: {
			'prod_id' : prod_id,
			'action_type' : 'get_document_list'
			  },
		success: function(response){
			$('.loadershow').hide();
			$('.product-pannel-file-list').show();
			tddata = "";
			formType = $('#file_upload_prod_id').attr('data-form-type');
			if ( response.length > 0 ) {
				$.each(response, function(i, item) {
					tddata += '<tr id="prod_file_tr_'+item.docs_id+'">'+
								'<td><a target="_blank" href="'+item.filePath+'">'+item.fileName+'</a></td>'+
								'<td class="text-left" >'+item.custCode+'</td>'+
								'<td class="text-center" >'+
								'<a title="Change Customer" data-doc-id="'+item.docs_id+'"  data-cust-id="'+item.cust_id+'"  data-cust-code="'+item.custCode+'" href="javascript:void(0);" class="prod_upload_change_customer" data-toggle="modal" data-target="#prod_change_customer">'+
								'<span class="fa fa-pencil"></span>'+
								'</a></td>'+
								'<td class="text-center" >'+item.docDate+'</td>'+
								'<td class="text-center" ><a target="_blank" title="Download Document" href="'+item.filePath+'"><i class="fa fa-download"></i></a></td>';
					if(formType == "edit") tddata += '<td class="text-center"><input type="checkbox" name="email_files[]" value="'+item.docs_id+'"></td>';
					tddata += '<td class="text-center" ><a style="color:red;'+hide_del+'" class="delete_document" data-id="'+item.docs_id+'" href="javascript:void(0);" title="Delete Document"><i class="fa fa-trash-o"></i></a></td>'+								
							 '</tr>';
				});
				if(formType == "edit"){
					tddata += '<tr> <td colspan="4"></td><td colspan="3" style="white-space:nowrap">'+ 
						  '<button type="button" id="email-sent-btn" class="btn btn-primary" disabled data-prod-id="'+prod_id+
						  '"><i class="fa fa-mail-forward"></i> Email selected files</button>'+
						  '</td></tr>';
				}
			}else{
				tddata +='<tr id="emptyFilesTr" class="">'+
							'<td style="text-align:center;" colspan="'+(formType == 'edit'?7:6)+'"><p class="alert alert-warning" style="margin-bottom:0;">No files found.</p></td>'+
						 '</tr>';
			}
			$('#ProductFileAttachment').html(tddata);
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});
}
/**
 * document file uplad function
 */
function documentFileUpload(e) {
	
	//var filename = $("#fileName").val();
//	var filenameCtrl = $("#fileName");
	
	//if(filename.trim() != ''){
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
			fd.append("prod_id", $('#file_upload_prod_id').val());
			fd.append("prod_customer", $('#customer').val());
			//fd.append("attachable_type", $('input[name="attachable_type"]').val());
			fd.append("new_file_name", $('#fileName').val());
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
	
		//}else{
		//	filenameCtrl.val('');
		//	filenameCtrl.focus();
		//}
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
	var prod_id = $('#file_upload_prod_id').val();
	$("#upload_btn").attr('disabled',true);
	setTimeout( function(){
				  uploadList(prod_id);
				  $('#progress_num_uf').hide();
			  }, 1000);
}
$( document ).ready(function() {
	if($('#file_upload_prod_id').length > 0 && ($('#file_upload_prod_id').attr('data-form-type') == 'edit' || $('#file_upload_prod_id').attr('data-form-type') == 'add')){
		uploadList($('#file_upload_prod_id').val());
	}
	var prev_prod_status = $('#is_live').val();
	$('#is_live').change(function(e){ 
		if(e.target.value == 0){
			if(!confirm('Product status is Not to be carried / Banned, Are you sure?')){
				$('#is_live').val(prev_prod_status).trigger("chosen:updated");
			}
		}
		prev_prod_status = $('#is_live').val();
	});
	$('#prod_tank_type_desc').change(function(){
		permitted = $(this).find(':selected').attr('data-permitted');
		$('#prod_tank_type_desc_permitted').html(permitted);
	});
	$('#prod_tank_type_desc').change();
});

//file upload start---------------------------------------
$('#file_to_upload').change(function(){
	changeFileToUpload();
});

function changeFileToUpload(){
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
	if(file_cntrl.val() != "" )
	{
		$("#upload_btn").removeAttr('disabled');
	}		
		$('#upload-progress-bar').css('width','0%');
		$('#upload-progress-bar').data('aria-valuenow','0');
		$('#upload-progress-bar').html('');
}

$(function() {
	if($("#file_upload_prod_id").data().formType == "add" || $("#file_upload_prod_id").data().formType == "edit"){
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
	if($("#drag_and_drop_files_on_product_index").val()){
		Dropzone.autoDiscover = false;
		//Dropzone class
		var myDropzone = new Dropzone("#FileUpModal", {
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

$('#prod_show_sp386').change(function(){
	if($(this).prop('checked') == true){
		$("#sp386_warning").show();
		BootstrapDialog.show({
			type: BootstrapDialog.TYPE_INFO,
			title: 'Warning', message : 'Has SP386 compliance confirmation document been sent and returned?',
					buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
	}else{
		$("#sp386_warning").hide();
	}
});

	if($(".multi-sel-ctrl").length != 0){
		$(".multi-sel-ctrl").multiselect({
			enableCaseInsensitiveFiltering: true,
			enableFiltering: true,
			maxHeight: 200,
			buttonWidth: '100%',
			onChange: function(element, checked) {
				
				if (checked === true && element.val() != '') {
					if($(this.$select).attr('id') == 'fromtown-filter'){
						$('#fromtown-part-filter').val('');
					}else if($(this.$select).attr('id') == 'totown-filter'){
						$('#totown-part-filter').val('');
					}
					element.parent().multiselect('deselect', '');
					element.parent().multiselect('refresh');
				}
				if (checked === true && element.val() == '') {
					element.parent().val('');
					element.parent().multiselect('refresh');
				}
				if(checked === false && element.parent().val() == null){
					element.parent().val('');
					element.parent().multiselect('refresh');
				}
			}
		});
	}
	$('.tmp-input-ctrl').remove();

	$(document).on('click', 'input[name="email_files[]"]', function() {
		if($("input[name ='email_files[]']:checked").length > 0){
			$('#email-sent-btn').removeAttr('disabled');
		}
		else{
			$('#email-sent-btn').attr('disabled', 'disabled');
		}
	});

	$(document).on('click', '#email-sent-btn', function () {
		var files = $('input[name="email_files[]"]:checked').map(function() {
			return this.value;
		}).get();
		prod_id = $(this).attr('data-prod-id');

		$.ajax({
			type: 'POST', 
			async : false,
			url: appHome+'/products/common_ajax',    			
			data: {
				'action_type' : 'get_job_email_modal_content',
				'prod_id'	  : prod_id,
				'files'		  : files
			},
			success: function(response){
				$('#product_email_form').html(response);
				$('#email-senting-btn').removeAttr('disabled');
				$('#email-modal-close-btn').removeAttr('disabled');
				$('#email-senting-btn').html('Send (Primary)');

				$(".to-name").autocomplete({
					source: appHome + "/job/contact_list",
					minLength: 2,
					type: "GET",
					select: function (event, ui) {
							var item = ui.item;
								if(item) {
									var id = $(this).data('email');
									$(this).val(item.name);
									$("#"+id).val(item.email);
								}
							}
				});
				$('#prod_file_email_modal').modal({
					backdrop: 'static',
					keyboard: false
				});
			},
			error: function(response){
			  $('html, body').animate({ scrollTop: 0 }, 400);
			  $('form').find('#response').empty().prepend(alert_error).fadeIn();
			}
	  	});
		
	});

	$(document).on('click', '.subject-selector', function(e) {
		e.preventDefault();
		var subject = $(this).data('subject');
		$('#subject-line').val(subject);
		$('.subject-selector').show();
		$(this).fadeOut();
	});

	$(document).on('click', '#email-senting-btn', function (e) {
		e.preventDefault();
		
		var form = '#product_email_form';
		success = [];
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

		highlight($(form).find('#from-email'), '');
		highlight($(form).find('#to-name1'), '');
		highlight($(form).find('#to-email1'), '');
		highlight($(form).find('#subject-line'), '');
		highlight($(form).find('#messagebody'), '');

		if($(form).find('input[name="file_ids[]"]').length <= 0) success.push(false);
  
		var check_fields = (success.indexOf(false) > -1);
		/**
		 * update edit-vgm-route
		 */
		if(check_fields === true){
			$('#prod_file_email_modal').animate({ scrollTop: 0 }, 400);
			$(form).find('#email_file_response').empty().prepend(alert_required).fadeIn();
			$('#email-senting-btn').removeAttr('disabled');
		} else {
			
			$(this).attr('disabled', 'disabled');
			$('#email-modal-close-btn').attr('disabled', 'disabled');
			$(this).html('Please wait...');
			formData = new FormData($(form)[0]);
			formData.append('action_type', 'sent_email_files');
			$.ajax({
				type: 'POST', 
				async : false,
				url: appHome+'/products/common_ajax',    			
				data: formData,
				processData: false,
            	contentType: false,
				success: function(response){
					let result = JSON.parse(response);
					if(result.success){
						getEmailRecords();
						$('#prod_file_email_modal').modal('hide');
						document.getElementById('email_recoreder_panel').scrollIntoView();
					}
					else if(result.feedback){
						$('#prod_file_email_modal').animate({ scrollTop: 0 }, 400);
						$(form).find('#email_file_response').empty().prepend(result.feedback).fadeIn();
					}
					else{
						$('#prod_file_email_modal').animate({ scrollTop: 0 }, 400);
						$(form).find('#email_file_response').empty().prepend("<p class=\"alert alert-error\">Something went wrong, Please try again.<\/p>").fadeIn();
					}
					$('#email-senting-btn').removeAttr('disabled');
					$('#email-senting-btn').html('Send (Primary)');
				},
				error: function(response){
					$('#prod_file_email_modal').animate({ scrollTop: 0 }, 400);
					$(form).find('#email_file_response').empty().prepend(alert_required).fadeIn();
					$('#email-senting-btn').removeAttr('disabled');
					$('#email-senting-btn').html('Send (Primary)');
				}
			});
		}

	});

	$(document).ready(function () {
		if($($('#file_upload_prod_id').attr('data-form-type') == "edit")){
			getEmailRecords();
		}
	});
	function getEmailRecords() {
		$('.email_recorder_loadershow').show();
		$.ajax({
			type: "POST",
			cache: false,
			url: appHome+'/products/common_ajax',
			dataType: "text",
			data: ({
				'action_type':'email_record',
				'prod_id': $('input[name="prod_id"]').val()
			}), 
			success: function(result)
			{ 
				$("#email-product-area").html(result);
				$('.email_recorder_loadershow').hide();
			
			},
			error: function () {
				$('.email_recorder_loadershow').hide();
			}  
		});
	}

	$(document).on('click', '.record-product-link', function(e){
		e.preventDefault();
		var element = document.getElementById($(this).attr('data-file-id'));
		if(element) element.scrollIntoView();
	});

	$(document).on('click', '.email-detail', function(e){
		e.preventDefault();
		$.ajax({
			type: "POST",
			cache: false,
			url: appHome+'/products/common_ajax',
			dataType: "text",
			data: ({
				'action_type':'getEmailFileDetails',
				'prod_email_id': $(this).attr('data-prod-email-id')
			}), 
			success: function(result)
			{ 
				$('#mail_view_area').html(result);
				$('#mail_view_modal').modal('show');
			},
			error: function () {
				
			}  
		});
	});

$(function(){
	$('.radio-class').on('change', function(){
		var thisId = $(this).attr('id');
		$('.radio-class').each(function(i, obj) {
            if($(obj).attr('id') != thisId){
            	$(obj).prop('checked',false); 
            } 
         });
	});

	$('#prod_customer_ids').on('change',function(){
		setCustomerList()
	});

	$('.synonym-add-btn').live('click',function(){
        var div_count = $(this).parent().data('count');
        var next_div_count = div_count + 1;
        var current_div_selector = '#synonym-form-'+ div_count;
        var current_div_html = $(current_div_selector).html();
        var next_div_html = current_div_html.replace('data-count="'+div_count+'"','data-count="'+next_div_count+'"')
        next_div_html = next_div_html.replace('synonym-add-btn-'+div_count,'synonym-add-btn-'+next_div_count);
        next_div_html = next_div_html.replace('synonym-sub-btn-'+div_count,'synonym-sub-btn-'+next_div_count);
        next_div_html = '<div class="form-group" id="synonym-form-'+next_div_count+'">'+next_div_html;
        next_div_html += '</div>';
        $('#synonymn-div').append(next_div_html);
        $('#synonym-form-'+ next_div_count+' .synonym-text').val('');
        $(this).hide();
	});
	$('.synonym-sub-btn').live('click',function(){
		var div_count = $(this).parent().data('count');
		var prev_div_count = div_count - 1;
		var current_div_selector = '#synonym-form-'+ div_count;
		if(prev_div_count > 0){
			$(current_div_selector).remove();
			var add_btn_selector = '#synonym-add-btn-'+prev_div_count;
			$(add_btn_selector).show();
		}

	});
  setCustomerList()
})

function setCustomerList(){
	var custArr = []
    $( "#prod_customer_ids option:selected" ).each(function() {
          custArr.push($( this ).text());
     });
	$('#customer_list').html(custArr.join(','));
	
}

