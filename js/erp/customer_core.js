$(document).ready(function(){
	
	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;

	if ($('.account_type option').length == 0) {
		$(".account_type").empty().append($("#hdn_account").val()).chosen().trigger("chosen:updated");
	}
	removeSelectedAccount();
	//To do the pagination while we change the count of the result
	$(document).on('change', '.custom-page-pagesize', function (e) {
		 var pagelimit = $(this).val();
		 $('#pagesize').val(pagelimit);
		 $('.customer_core').submit();
	});
	
	$(document).on('change', '#bill_office', function (e) {
		 $('#invoice_date option').attr('disabled',false);
		 if($(this).val() == 'IB'){
			 $('#invoice_date option[value="first"]').attr('disabled',true);
			 $('#invoice_date').val('invoice');
		 }
		 $('#invoice_date').chosen().trigger("chosen:updated");
	});
	
	if($('#form_type').val() == "Create"){
		uploadList($('#file_upload_cust_id').val());//Show the uploaded file
	}
	
	if($('#cust_id').val() != ""){
		uploadList($('#file_upload_cust_id').val());//Show the uploaded file
	}
	
	$('.upload-doc-btn').click(function(){
			uploadList($('#file_upload_cust_id').val());//Show the uploaded file
	});
	
	$('.doc-uploaded').click(function(){
		var cust_id = $(this).data('id');
		uploadList(cust_id);//Show the uploaded file
	});
	
	//To view the details of the corresponding customer
	$(document).on('click','.view_customer',function(e){
		$('.view_small_loader').show();
		$('.reset_values').html('');
		var cust_id = $(this).data('id');
		$.ajax({
			type	: 'POST',
			dataType: 'json',
			url		: appHome+'/customer/common_ajax',
			data	:{
				'customer_id' : cust_id,
				'action_type' : 'get_customer_details'
				},
			success	:function(response){
				$('.view_small_loader').hide();
				if(response != ""){
					$('#modal_cust_status').html(response.cust_status);
					$('#modal_cust_code').html(response.cust_code);
					$('#modal_team_name').html(response.team_name);
					$('#modal_cust_name').html(response.cust_name);
					$('#modal_cust_addr1').html(response.cust_addr1);
					$('#modal_cust_addr2').html(response.cust_addr2);
					$('#modal_cust_town').html(response.cust_town);
					$('#modal_cust_state').html(response.cust_state);
					$('#modal_cust_postcode').html(response.cust_postcode);
					$('#modal_country_name').html(response.country_name);
					$('#modal_cust_contact').html(response.cust_contact);
					$('#modal_cust_tel').html(response.cust_tel);
					//$('#modal_cust_fax').html(response.cust_fax);
					$('#modal_cust_email').html(response.cust_email);
					$('#modal_cust_vatno').html(response.cust_vatno);
					$('#modal_cust_vat').html(response.cust_vat);
					$('#modal_cust_approved').html(response.cust_approved);
					var html = '';
					$.each(response.currency_info, function(key, value){
						html += '<tr>'
		     							+'<td width="25%"><strong>Sage Code</strong></td>'
		     							+'<td width="25%"><span id="modal_sage_code" class="reset_values">'+value.sage_code+'</span></td>'
		     						+'</tr>';
					
						html += '<tr>'
		     							+'<td width="25%"><strong>Bank Account</strong></td>'
		     							+'<td width="25%"><span id="modal_bak_acount" class="reset_values">'+value.bank_account+'</span></td>'
		     					+'</tr>';
						
					});
					$(html).insertAfter($('.approve').closest('tr'));
					$('#modal_c_billing_office').html(response.c_billing_office);
					$('#modal_payment_terms').html(response.payment_terms);
					$('#modal_full_name').html(response.full_name);
					$('#modal_group_name').html(response.group_name);
					$('#modal_invoice_date_type').html(response.invoice_date_type);

				}
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	});
	
	//Create and update the customer
	$('.create-customer,.edit-customer').click(function(e){
		$('.highlight').removeClass('highlight');
		e.preventDefault();
		var form = '#'+$(this).closest('form').attr('id'),
	      success = [],
	      username = $('input[name="hidden-username"]').val(),
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
		
		
		//To check whether the customer name exist or not
		function isCustomerNameExists(customer,button){
			ExistSuccess = [];
			if(button.hasClass('edit-customer')){
		  		var type = "update";
		  	}
		  	if(button.hasClass('create-customer')){
		  		var type = "create";
		  	}
		  	var customername  = $('#cust_code').val();
		  	if(type == "create"){
				  $.ajax({
				        type: 'POST', 
				        url: appHome+'/customer/common_ajax',  
				        async : false,
				        data: {
							'customername' 	: customername,
							'type'	   		: type,
							'action_type' 	: 'customer_name_exist'
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
		
		highlight($(form).find('#cust_code'), '');
		highlight($(form).find('#team'), '');
		highlight($(form).find('#cust_name'), '');
		highlight($(form).find('#cust_address1'), '');
		highlight($(form).find('#town'), '');
		highlight($(form).find('#post_code'), '');
		highlight($(form).find('#country'), '');
		highlight($(form).find('#contact'), '');
		highlight($(form).find('#telephone'), '');
		//highlight($(form).find('#fax'), '');
		highlight($(form).find('#email'), '');
		highlight($(form).find('#cust_eori'), '');
		highlight($(form).find('#vat_no'), '');
		highlight($(form).find('#vat_rate'), '');
		$(".sage_code").each(function() {
					highlight($(this), '');
		});
		$(".bank_account").each(function() {
					highlight($(this), '');
		});
		highlight($(form).find('#payment_team'), '');
		highlight($(form).find('#account_manager'), '');
		highlight($(form).find('#cust_group'), '');
		
		isEmail($(form).find('#email'));

		$(".invoice-email").each(function() {
		    if($(this).val().trim() != ""){
		    	isEmail($(this));
		    }
		});
		
		if($('#cust_code').val() != '' ){
			isCustomerNameExists($(form).find('#cust_code'),$(this)); //function for chech customer name exist or not
		}
		
		if(ExistSuccess == 'Exist'){
			  success.push(false);
		  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This Customer Code already exists.</div>';
		  }else{
			  success.push(true); 
			  alert_required = oldalert;
		  }   
		  var check_fields = (success.indexOf(false) > -1);
		  
		  /**
		   * To create the new customer code
		   */
		   if($(this).hasClass('create-customer')){
		     if(check_fields === true){
		       $('html, body').animate({ scrollTop: 0 }, 400);
		       $('form').find('#response').empty().prepend(alert_required).fadeIn();
		     } else {
		       $.ajax({
		         type: 'POST',
		         url: path+'/customer-add',
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
		    * To edit and update the customer
		    */
		    if($(this).hasClass('edit-customer')){
		  	 
		      if(check_fields === true){
		        $('html, body').animate({ scrollTop: 0 }, 400);
		        $('form').find('#response').empty().prepend(alert_required).fadeIn();
		      } else {
		      	//$(this).prop('disabled','disabled');
		    	  $cust_id = $('#cust_id').val();
		        $.ajax({
		          type: 'POST',
		          url: appHome+'/customer/'+$cust_id+'/customer-update',
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
	//To delete the customer details
	$(document).on('click','.delete-customer',function(e){
		e.preventDefault();
		var delete_url 	= $(this).attr('href'),
			cust_id 	= $(this).data('cust-id'),
			cust_code 	= $(this).data('cust-code'),
			return_url 	= window.location.href;
		BootstrapDialog.confirm('Are you sure you want to delete this Customer?', function(result){
			if(result) {
				$.ajax({
					type : 'POST',
					url  : delete_url,
					data :{
						'cust_id' 	: cust_id,
						'cust_code'	: cust_code
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
	
	//Delete uploaded document
	$(document).on('click', '.delete-upload_files', function(e){ 
		e.preventDefault();
		
		var att_id = $(this).data('attid'),
			file_id = $(this).data('fileid'),
			custm_id = $(this).data('custid'),
			$this = $(this);
		
		BootstrapDialog.confirm('Are you sure you want to delete this document ?', function(result){
			if(result) {
				$.ajax({
					type: 'POST',
					url: appHome+'/customer/common_ajax',
					data: {
						'att_id'  		: att_id,
						'file_id' 		: file_id,
						'action_type' 	: 'delete_document_uploaded'
					},
					success: function(response){
						if(($('#file_upload_cust_id').val() != "") &&($('#file_upload_cust_id').val() != undefined) ){
							uploadList($('#file_upload_cust_id').val());
						}
						else{
							uploadList(custm_id);
						}
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
	
});//end of document ready

//Function to Upload the file
function uploadList(cust_id){
	
	$('.loadershow').show();
	$('#fileSize,#fileType').html('');
	$("#upload_btn").attr('disabled',true);
	$('#upload-progress-bar').css('width','0%');
	$('#upload-progress-bar').data('aria-valuenow','0');
	$('#upload-progress-bar').html('');
	$('.highlight').removeClass('highlight');
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: appHome+'/customer/common_ajax',
		beforeSend: function() {
            // setting a timeout
        	},
		data: {
			'cust_id' 	  : cust_id,
			'action_type' : 'get_document_list'
			  },
		success: function(response){
			$('.loadershow').hide();
			$('.product-pannel-file-list').show();
			$("#fileName").val('');
			$("#file_to_upload").val('');
			$("#fileDesc").val('');



			tddata = "";
			if ( response.length > 0 ) {
				$.each(response, function(i, item) {
					tddata += '<tr>'+
								'<td><a target="_blank" href="'+item.prePath+'">'+item.filePath+'</a></td>'+
								'<td class="text-left" >'+item.docs_description+'</td>'+
								'<td class="text-left" >'+item.docDate+'</td>';
					tddata +=	'<td class="text-center" ><a target="_blank" title="Download Document" href="'+item.prePath+'"><i class="fa fa-download"></i></a></td>'+
								'<td class="text-center" ><a style="color:red" class="delete-upload_files"  data-attid="'+item.attId+'" data-fileid="'+item.fileId+'" data-path="'+item.filePath+'" data-custid="'+item.attachableId+'" href="javascript:void(0);" title="Delete Document"><i class="fa fa-trash-o"></i></a></td>'+								
							 '</tr>';
				});
			}else{
				tddata +='<tr id="emptyFilesTr" class="">'+
							'<td style="text-align:center;" colspan="6"><p class="alert alert-warning" style="margin-bottom:0;">No files found.</p></td>'+
						 '</tr>';
			}
			$('#fileAttachments').html(tddata);
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});
}

// Change equipment status
$(document).on('click', '.customer_change_status', function(e) {
	e.preventDefault();
	var cust_id = $(this).attr('data-id');
	var change_to = $(this).attr('data-customer-change-to');
	var cust_code = $(this).attr('data-cust-code');
		
	var message = 'Are you sure, you want to move the customer to '+change_to.charAt(0).toUpperCase() + change_to.slice(1)+' ?';
	
	if(change_to == 'live'){
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
	     		        url: appHome+'/customer/common_ajax',
	     		        data: {
	     		      	  'cust_id' : cust_id,
	     		      	  'action_type' : 'change_customer_status',
	     		      	  'change_to' : change_to,
	     		      	  'cust_code' : cust_code
	     		        },
	     		       beforeSend: function() {
	     		        	$('.bootstrap-dialog-footer-buttons > .'+mButton).html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		     		        $('.bootstrap-dialog-footer-buttons > .'+mButton).attr('disabled','disabled');
	     		        },
	     		        success: function(response){
	     		        	location.reload();
	     		            localStorage.setItem('response', response);
	     		            $('html, body').animate({ scrollTop: 0 }, 400);
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

$("#telephone, #fax").keypress(function(e){
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

// Multiple currency management
$(document).on("click", ".currency-add-btn", function(e){
	$(this).hide();
	html = '<div class="form-group new-row">'
		        +'<label class="col-sm-2 control-label required" for="product">'
		           	+'<a class="btn btn-success currency-add-btn pull-left" title="Add">'
		           	+'<span class="glyphicon glyphicon-plus-sign"></span></a>'
		           	+'<a class="btn btn-danger currency-sub-btn pull-left icon-space" title="Remove">'
		           	+'<span class="glyphicon glyphicon-minus-sign"></span></a>'
		        +'Sage Code</label>'
	            +'<div class="col-sm-4">'
	            +'<input type="text" name="sage_code[]" placeholder="Sage Code" id="sage_code" '
	            +'value="" class="form-control filter-input-fld sage_code" maxlength="32" ' 
	            +'autocomplete="on" />'
	            +'</div>'
        		+'<label class="col-sm-2 control-label required" >Bank Account</label>'
        		+'<div class="col-sm-4">'
              	+'<select name="bank_account[]" id="bank_account" class="chosen form-control account_type bank_account" '
              	+'data-placeholder="Please select bank account">'
              		+$("#hdn_account").val()
              		+'</select>'
            	+'</div>'
	        +'</div>';
	$(".currency-group").append(html);
	if ($('.account_type option').length == 0) {
		$(".account_type").empty().append($("#hdn_account").val());
	}
	$(".account_type").chosen().trigger("chosen:updated");
	hideMinusButtonSingle();
	removeSelectedAccount();
});

$(document).on("click", ".currency-sub-btn", function(e){
	if($('.currency-sub-btn').length > 1){
		$(this).closest('.new-row').remove();
	}
	hideMinusButtonSingle();
	removeSelectedAccount();
});

function hideMinusButtonSingle(){
	if($('.currency-add-btn').length == 1){
		$('.currency-sub-btn').hide();
		$('.currency-add-btn').show();
	}else{
		$('.currency-sub-btn').show();
		$('.currency-add-btn').last().show();
	}
}

$(document).on('change', '#bill_office', function(){
	getAllBankAccountsByBillingOffice();
});
/**
   * function for get all customers of currency
*/
function getAllBankAccountsByBillingOffice(type='load'){
  	var billing_office = $('#bill_office').val();

  	if(billing_office != ""){
		$.ajax({
		    type: 'POST',
		    url: appHome+'/customer/common_ajax',
		    data: {
		      'billing_office'	: billing_office,
		      'action_type' : 'get_all_bank_accounts_by_billing',
		    },
		    success: function(response){
		    	$('.account_type').empty().html(response).chosen().trigger("chosen:updated");
		    	$("#hdn_account").val(response);
		    }
		});
	}
}

$(document).on('change', '.account_type', function(e){
	var account = $(this).val();
	$('.account_type').not(this).find('option[value="' + account + '"]').remove();
	$('.account_type').chosen().trigger("chosen:updated");
});

function removeSelectedAccount(){
	$(".account_type").each(function(){
		var account = $(this).val();
		if(account.length!=0){
			$('.account_type').not(this).find('option[value="' + account + '"]').remove();
			$('.account_type').chosen().trigger("chosen:updated");
		}
	});
}

 $(document).on('click', '.add-ccontact', function(e) {
      e.preventDefault();
      var lastnameCount = parseInt($('.invoicecontact-actions-div:last').attr('data-count')) + 1;
      if($('.invoicecontact-actions-div').length >= 6){
        BootstrapDialog.show({title: 'Warning', message : 'Exceeds maximum length. Please contact your System Administrator'});
        return false;
      }else{

        $(this).parents('.invoicecontact-actions-div').clone().insertAfter(".invoicecontact-actions-div:last");
        $(this).hide();

        $('.invoicecontact-actions-div:last').attr('data-count', lastnameCount);
        $('.invoice-email:last').attr('name','invoice-contact['+lastnameCount+'][email]');
        $('.invoice-email-id:last').attr('name','invoice-contact['+lastnameCount+'][id]');
        $('.invoice-email-id:last').val(0);
        $('.invoice-email:last').val('');
     	}
     });

 	$(document).on('click', '.remove-ccontact', function(e) {
      e.preventDefault();
      if($('.invoicecontact-actions-div').length > 1){
        var curId = $(this).parents('.invoicecontact-actions-div').find('.invoice-email-id').val();
        $('#invoicecontact-del-id').val( $('#invoicecontact-del-id').val()+','+curId );
        $(this).parents('.invoicecontact-actions-div').remove();
        $('.add-ccontact:last').show();
      }

     });
