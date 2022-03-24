$(document).ready(function(){
	
	$('#quote_per_model,#quote_sur_amt_model').on('change propertychange paste', calculateargetRate);
	
	
	function getAverageCount(){
		var quotelist = $('#quotelist').val();
		if(quotelist == 1) {
			var formData = $('.supplier-cost-form').serialize();
			var ctype = $('#customer_quotes_type_hidden').attr('data-seatype');
			$.ajax({
			        type: 'POST',
			        timeout: 90000, //90 sec
			        url: appHome+'/customer-quotes/common_ajax',
			        data: {
			      	  'action_type' : 'get_average_count',
			      	  'formData' : formData,
			      	  'ctype' : ctype
			        },
			       beforeSend: function() {
			    	   $('.full_loadrow').show();
			    	   $('.average-rate,.average-target-rate').html('');
			        },
			        success: function(response){
			        	var jsonObj = JSON.parse(response);
			        	//$('.total-count').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" >'+jsonObj.count+'</span>');
			        	$('.average-rate').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" ><i class="fa fa-'+jsonObj.currency.toLowerCase()+'"></i> '+jsonObj.average_rate+'</span>');
			        	$('.average-target-rate').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" ><i class="fa fa-'+jsonObj.currency.toLowerCase()+'"></i> '+jsonObj.average_target_rate+'</span>');
			        	$('.full_loadrow').hide();
			        },
			        error: function(response){
			        }
			  });
		}
	}
	
	function calculateargetRate(){
		var targetRate = $('#qoute-rate-model').val();
		var surcharge = parseFloat($('#quote_sur_amt_model').val());
		surcharge = isNaN(surcharge) ? 0 : surcharge;
		var surcharge_rate = 0;
		
		var surcharge_percentage = $('#quote_per_model').val();
		surcharge_percentage = isNaN(surcharge_percentage) ? 0 : surcharge_percentage;
		 
		 if(surcharge != '' || surcharge_percentage != ''){
			 if(surcharge == '' || surcharge == 0){
				 surcharge_rate = (parseFloat(targetRate) / (parseFloat(surcharge_percentage)+100)) * 100;
			 }else{
				 surcharge_rate = parseFloat(targetRate) - parseFloat(surcharge);
			 }
		 }
		 
		 $('#quote_sur_amt_model').val(surcharge.toFixed(2));
		 $('#target_quote_rate').val(surcharge_rate.toFixed(2));
		 
	}
	
	function feedbackListModal(){
		 $.ajax({
		        type: 'POST',
		        async : false,
		        url: appHome+'/customer-quotes/common_ajax',
		        data: {
		          'cquoteNo' : $('#feedback_quote_id').val(),
		      	  'action_type' : 'view_feedback_new',
		        },
		       beforeSend: function() {
		    	   $('.full_loadrow').show();
		        },
		        success: function(response){
		        	if(response != ""){
			        	$('.new_feedback_delete_all').removeAttr('disabled');
		        	}else{
		        		$('.new_feedback_delete_all').attr('disabled','disabled');
		        	}
		        	$('.feedbackList').html(response);
		        	$('.full_loadrow').hide();
		        },
		        error: function(response){
		          $('html, body').animate({ scrollTop: 0 }, 400);
		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
		  });
	}
	
	function deleteFeedback(id,cquote,type){
		var num_row = $('#num_row').val();
		BootstrapDialog.show({
	        type: BootstrapDialog.TYPE_DANGER,
	        title: "Confirmation",
	        message: 'Are you sure want to delete ?',
	        buttons: [{
			             label: 'Close',
			             action: function(dialogItself){
			                 dialogItself.close();
			             }
			         },{
		             label: 'Ok',
		             cssClass: 'btn btn-danger',
		             action: function(dialogItself){
		            	 var clickbtn = $(this);
		            	 $.ajax({
			     		        type: 'POST',
			     		        url: appHome+'/customer-quotes/common_ajax',
			     		        async : false,
			     		        data: {
			     		      	  'id' : id,
			     		      	  'cquote' : cquote,
			     		      	  'type' : type,
			     		      	  'action_type' : 'delete_feedback',
			     		        },
			     		       beforeSend: function() {
			     		    	  clickbtn.html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
			     		    	  clickbtn.attr('disabled','disabled');
			     		        },
			     		        success: function(response){
			     		        	dialogItself.close();
			     		        	if($('.count-tr-feedback').length == 1 && type == 'single'){
			     		        		feedbackListModal();
			     		        		$('.quote_rate_feedback').eq(num_row).removeAttr("data-original-title");
							        	$('.quote_rate_feedback').eq(num_row).removeClass().addClass("quote_rate_feedback fa fa-plus-circle quote_rate_feedback_plus_circle");
			     		        	}else if(type == 'single'){
			     		        		feedbackListModal();
			     		        	}else{
			     		        		$('#customer_quote_rate_feedback_modal').modal('hide');	
			     		        		$('.quote_rate_feedback').eq(num_row).removeAttr("data-original-title");
							        	$('.quote_rate_feedback').eq(num_row).removeClass().addClass("quote_rate_feedback fa fa-plus-circle quote_rate_feedback_plus_circle");
			     		        	}
			     		        	getAverageCount();
			     		        },
			     		        error: function(response){
			     		          $('html, body').animate({ scrollTop: 0 }, 400);
			     		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
			     		        }
			     		  });
		             }
	        }]
	    });
	}
	
	$(document).on('click', '.new_feedback_submit', function(e) {
		var clickbtn = $(this);
		var rate_feedback = $('#rate_feedback').val().trim();
		var num_row = $('#num_row').val();
		var jsonData = JSON.stringify({
			 cquoteNo : $('#feedback_quote_id').val(),
			 cquotePer : $('#quote_per_model').val(),
			 cquoteAmt : $('#quote_sur_amt_model').val(),
			 cquoteFeed : rate_feedback,
			 cquoteCurr : $('#feedback_currency').val(),
			 targetRate : $('#target_quote_rate').val(),
			 cquoteRate : $('#qoute-rate-model').val()
		  });
		
		if(rate_feedback != ""){
		   	 $.ajax({
			        type: 'POST',
			        url: appHome+'/customer-quotes/common_ajax',
			        data: {
			      	  'jsonData' : jsonData,
			      	  'action_type' : 'save_feedback_new',
			        },
			       beforeSend: function() {
			    	  clickbtn.html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
			    	  clickbtn.attr('disabled','disabled');
			        },
			        success: function(response){
			        	$('#customer_quote_rate_feedback_modal').modal('hide');	
			        	$('.quote_rate_feedback').eq(num_row).attr("data-original-title",rate_feedback);
			        	$('.quote_rate_feedback').eq(num_row).removeClass().addClass("quote_rate_feedback fa fa-comment tooltip-icon");
			        	getAverageCount();
			        },
			        error: function(response){
			          $('html, body').animate({ scrollTop: 0 }, 400);
			          $('form').find('#response').empty().prepend(alert_error).fadeIn();
			        }
			  });
		}else{
			$('#rate_feedback').css('border','1px solid #d11111');
			$('#rate_feedback').val('');
		}

	});
	
	$(document).on('click', '.delete_feed_single', function(e) {
		var id = $(this).attr('data-feed-id');
		var cquote = $(this).attr('data-cquote-id');
		deleteFeedback(id,cquote,'single');
	});
	
	$(document).on('click', '.new_feedback_delete_all', function(e) {
		var id = $('#feedback_quote_id').val();
		deleteFeedback(id,id,'multiple');
	});
	
	$(document).on('click', '.quote_rate_feedback', function(e) {
		feedbackListModal();
		$('#rate_feedback').css('border','1px solid #ccc');
		$('#rate_feedback').val('');
		var quote_id = $(this).data('quote_id');
		var currency = $(this).data('quote_curr');
		var quote_rate = $(this).data('quote_rate');
		$('#qoute-rate-model,#target_quote_rate').val(quote_rate);
		$('#feedback_currency').val(currency);
		$('#quote_per_model').val(0);
		$('#quote_sur_amt_model').val('0.00');
		
		if (currency_having_symbols.indexOf(currency.toUpperCase()) >= 0) {
			$('.curr-feedback i').removeClass().html("").addClass('fa currency-fa fa-'+currency);
		} else {
			$('.curr-feedback i').removeClass().html(currency.toUpperCase()).addClass('fa '+currency);
		  } 
		
		$('.curr-feedback i').removeClass().addClass('fa currency-fa fa-'+currency+'');
		
		$('.new_feedback_submit').html('<span class="glyphicon glyphicon-ok-sign"></span> Save Rate Feedback');
		$('.new_feedback_submit').removeAttr('disabled');
	});
	
	$(document).on('click', '.approve-draft-completed-status', function(e) {
		e.preventDefault();
		var clickaref = $(this);
		var changeStatusTo = clickaref.attr('data-change-status-to');
		var quote_no = clickaref.attr('data-cquoteno');
		var completeCheck = 0;
		
		if(changeStatusTo == 'Approved'){
			var mButton = 'btn btn-success';
			var typeModel = BootstrapDialog.TYPE_SUCCESS;
			var changeSpanClass = 'glyphicon glyphicon-ok glyphicon-modal';
			var aStatusUpdate = 'Draft';
		}else if(changeStatusTo == 'Draft'){
			var mButton = 'btn btn-primary';
			var typeModel = BootstrapDialog.TYPE_PRIMARY;
			var changeSpanClass = 'glyphicon glyphicon-pencil glyphicon-pencil-draft glyphicon-modal';
			var aStatusUpdate = 'Approved';
		}else if(changeStatusTo == 'Completed'){
			var mButton = 'btn btn-success';
			var typeModel = BootstrapDialog.TYPE_SUCCESS;
			var changeSpanClass = 'glyphicon glyphicon-ok glyphicon-modal';
			var aStatusUpdate = 'Not Completed';
			if($('.'+quote_no+'-app-draft-class').attr('title') == 'Draft'){
				completeCheck = 1
			}
		}else if(changeStatusTo == 'Not Completed'){
			var mButton = 'btn btn-primary';
			var typeModel = BootstrapDialog.TYPE_PRIMARY;
			var changeSpanClass = 'glyphicon glyphicon-remove glyphicon-modal';
			var aStatusUpdate = 'Completed';
		}
		var typeCmsg = "Are you sure want to change the Status to "+changeStatusTo+" ?";
		if(completeCheck == 1){
			BootstrapDialog.show({
		        type: BootstrapDialog.TYPE_DANGER,
		        title: "Warning!",
		        size : BootstrapDialog.SIZE_SMALL,
		        message: 'Customer Quote is not Approved.',
		        buttons: [{
				             label: 'Close',
				             action: function(dialogItself){
				                 dialogItself.close();
				             }
				         }]
		    });
		}else{
			BootstrapDialog.show({
		        type: typeModel,
		        title: "Customer Quote Confirmation (<strong>#"+quote_no+"</strong>)",
		        message: typeCmsg,
		        buttons: [{
				             label: 'Close',
				             action: function(dialogItself){
				                 dialogItself.close();
				             }
				         },{
			             label: 'Ok',
			             cssClass: mButton,
			             action: function(dialogItself){
			            	 var clickbtn = $(this);
			            	 $.ajax({
				     		        type: 'POST',
				     		        url: appHome+'/customer-quotes/common_ajax',
				     		        data: {
				     		      	  'cquoteNo' : quote_no,
				     		      	  'changeStatusTo' : changeStatusTo,
				     		      	  'action_type' : 'change_cquote_approve_status',
				     		        },
				     		       beforeSend: function() {
				     		    	  clickbtn.html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
				     		    	  clickbtn.attr('disabled','disabled');
				     		        },
				     		        success: function(response){
				     		        	dialogItself.close();
				     		        	if(response){
				     		        		
				     		        		if(changeStatusTo == 'Draft' || changeStatusTo == 'Approved'){
				     		        			$('.'+quote_no+'-app-draft-class').attr('data-change-status-to',aStatusUpdate);
				     		        			$('.'+quote_no+'-app-draft-class').attr('title',changeStatusTo);
				     		        			$('.'+quote_no+'-app-draft-class').find("span").removeClass().addClass(changeSpanClass);
				     		        		}else if(changeStatusTo == 'Completed' || changeStatusTo == 'Not Completed'){
				     		        			$('.'+quote_no+'-comp-class').attr('data-change-status-to',aStatusUpdate);
				     		        			$('.'+quote_no+'-comp-class').attr('title',changeStatusTo);
				     		        			$('.'+quote_no+'-comp-class').find("span").removeClass().addClass(changeSpanClass);
				     		        		}
				     		        		
				     		        		if(changeStatusTo == 'Draft'){
				     		        			$('.'+quote_no+'-comp-class').attr('data-change-status-to','Completed');
				     		        			$('.'+quote_no+'-comp-class').attr('title','Not Completed');
				     		        			$('.'+quote_no+'-comp-class').find("span").removeClass().addClass('glyphicon glyphicon-remove glyphicon-modal');
				     		        		}
				     		        	}
				     		        },
				     		        error: function(response){
				     		          $('html, body').animate({ scrollTop: 0 }, 400);
				     		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
				     		        }
				     		  });
			             }
		        }]
		    });
		}
	});
	
	$(document).on('click', '.quote-status-move-all', function(e) {
		var status = this.checked; // "select all" checked status
	   $('.each-check-cquote').each(function(){ //iterate all listed checkbox items
	       this.checked = status; //change ".checkbox" checked status
	       if(status == true){
	       	var qno = $(this).attr('data-cquote-id');
	       }
	   });
	   if($('.each-check-cquote:checked').length > 0){
			$('#btn-move-cquote-status').removeClass('hidden');
		}else{
			$('#btn-move-cquote-status').addClass('hidden');
		}
	});
	
	$(document).on('click', '.each-check-cquote', function(e) {
		if($('.each-check-cquote:checked').length == $('.each-check-cquote').length){
			$('.quote-status-move-all').prop('checked',true);
		}else{
			$('.quote-status-move-all').prop('checked',false);
		}
		if($('.each-check-cquote:checked').length > 0){
			$('#btn-move-cquote-status').removeClass('hidden');
		}else{
			$('#btn-move-cquote-status').addClass('hidden');
		}
		
	});
	
	$(document).on('click', '#btn-move-cquote-status', function(e) {
		 e.preventDefault();
		 
			var checkedval = [];
			$('.each-check-cquote:checked').each(function(){ //iterate all listed checkbox items
				var selqno = $(this).attr('data-cquote-id');
				checkedval.push(selqno);
		    });
		 var move = $(this).attr('data-move-to');
		 var mButton = 'btn btn-primary';
		BootstrapDialog.show({
	        type: BootstrapDialog.TYPE_PRIMARY,
	        title: 'Confirmation ('+checkedval.length+' Customer Quote)',
	        message: 'Are you sure want to move to '+move+' ?',
	        buttons: [{
			             label: 'Close',
			             action: function(dialogItself){
			                 dialogItself.close();
			             }
			         },{
		             label: 'Ok',
		             cssClass: mButton,
		             action: function(){
		            	 var clickbtn = $(this);
		            	 $.ajax({
			     		        type: 'POST',
			     		        url: appHome+'/customer-quotes/common_ajax',
			     		        data: {
			     		      	  'cquoteNo' : JSON.stringify({checkedval}),
			     		      	  'move' : move,
			     		      	  'action_type' : 'change_cquote_status',
			     		        },
			     		       beforeSend: function() {
			     		    	  clickbtn.html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
			     		    	  clickbtn.attr('disabled','disabled');
			     		        },
			     		        success: function(response){
			     		           localStorage.setItem('response', response);
			     		           $('.supplier-cost-form').submit();
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
	if($('#customer_quotes_type_hidden').val() == 'live'){
		getAverageCount();
	}
	$(document).on('click', '.export_modal_btn', function(e) {
		e.preventDefault();
		$('.highlight').removeClass('highlight');
		var $error = false;
		var select_quote_msg = "<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><i class='fa fa-exclamation-triangle'></i> <strong>Uh oh!</strong> Please select a Quote to Export quotation.</div>";
		var export_type      = $("input[name='export-type']:checked").val();
		var select_cust_msg  = "<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><i class='fa fa-exclamation-triangle'></i> <strong>Uh oh!</strong> Please select a Customer to Export quotation.</div>";
		var select_one_msg   = "<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><i class='fa fa-exclamation-triangle'></i> <strong>Uh oh!</strong>Please select only one Customer to Export quotation.</div>";
		var select_one_cust_msg   = "<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><i class='fa fa-exclamation-triangle'></i> <strong>Uh oh!</strong>Please select Quote of same customers.</div>";
		var not_same_cust    = "<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><i class='fa fa-exclamation-triangle'></i> <strong>Uh oh!</strong>Please select same customer.</div>";		
		var	customer_array   = $("#customer_id").val();
		var	q_type           = $("#quote_type").val();

		$("#customer").val(customer_array[0]);
		$("#q_type").val(q_type);

		// if(customer_array == "" || customer_array == "undefined"){
		// 	$('#disp_msg').empty().prepend(select_cust_msg).fadeIn();
		// 	$error = true;
		// }
		// if(customer_array.length > 1 ){
		// 	$('#disp_msg').empty().prepend(select_one_msg).fadeIn();
		// 	 	$error = true;
		// }
		if(export_type==1){
			var multi_diff_cust = 0;
			var checkedval = [];
			var customer_name = [];
			var customer_ids = [];
			var result = true;
			$('.each-check-cquote:checked').each(function(){ //iterate all listed checkbox items
				var selqno    = $(this).attr('data-cquote-id');
				var cust_name = $(this).attr('data-customer');
				var cust_id   = $(this).attr('data-custid');
				customer_name.push(cust_name);
				checkedval.push(selqno);
				customer_ids.push(cust_id);
			});
			$("#quote_n").val(checkedval);
			$("#customer_names").val(customer_name);
			$("#customer_ids").val(customer_ids);
			$("#export_type").val(export_type);
			for (var i = 0; i < customer_name.length - 1; i++) {
    			if (customer_name[i + 1] != customer_name[i]) {
        			multi_diff_cust = 1 ;
				   $("#multi_diff_cust").val(multi_diff_cust);
				  	$error = false;
					break;  
    			}else{
					$("#multi_diff_cust").val(0);
				}
			}
			if(checkedval.length == 0){
				$('#disp_msg').empty().prepend(select_quote_msg).fadeIn();
				$error = true;
			} 
			if($error == false){
			    $('.quote-form').submit();
			}
		}else{
			if($error == false){
				$('#disp_msg').empty();
				$('#export_modal_btn').find('span').removeClass().addClass("fa fa-spinner fa-spin");
 	            $('#export_modal_btn').attr('disabled','disabled');
				$('.supplier-cost-form').submit();
			}
		}	
	});

	$('#export_modal').on('hidden.bs.modal', function () {;
    	$("#disp_msg").empty();
    	//$('.create-customer').find('span').removeClass("fa fa-spinner fa-spin");
    });

    function checkcustomerQuoteExpire(){
		var cid = [];

		$( ".customer-quote-cost-info" ).each(function( index ) {
		  cid.push($(this).attr('data-quote'));
		});

		if(cid.length > 0) {
			$.ajax({
			        type: 'POST',
			        dataType: 'json',
			        url: appHome+'/customer-quotes/common_ajax',
			        data: {
			      	  'action_type' : 'check_supplier_cost_expire',
			      	  'cid' : cid
			        },
			        success: function(response){
			        	if(response.length > 0){
			        		$.each(response, function( index, value ) {
							  $('.customer-quote-cost-info[data-quote="'+value+'"]').css('color','red');
							  $('.customer-quote-cost-info[data-quote="'+value+'"]').attr('title','Suuplier Rate Expired');
							});
			        	}
			        },
			        error: function(response){
			        }
			  });
		}
	}
	checkcustomerQuoteExpire();
});





