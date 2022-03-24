$(document).ready(function(){
	$("[data-toggle=tooltip]").tooltip();
	 var old_alert = alert_required;
	$('.date-picker').datepicker( {
			 dateFormat: btl_default_date_format,
	        changeMonth: true,
	        changeYear: true,
	});

	$('.custom-page-pagesize').change(function(e){
		var pagelimit = $(this).val();
		$('#pagesize').val(pagelimit);
		$('#search-form').submit();
	});	
	
	 
	$(document).on('click', '.show-extra-cost', function(e) {

		var currecntVar = $(this);
		currecntVar.find('i').toggleClass('fa-plus fa-minus');
		if(currecntVar.attr("is-ajax-send") == 0){
			$('<tr class="sub-tr">'
				+'<td style="background-color: #d8d8d8;" colspan="12" class="text-center">'
					+'<i class="fa fa-spinner fa-spin" style="font-size:16px"></i>'
					+'</td>'
				+'</tr>').insertAfter(currecntVar.closest('tr'));

			var customers = [];
			customers.push(currecntVar.attr('data-customerid'));
			setTimeout(function(){ 
				$.ajax({
			        type: 'POST', 
			        url: appHome+'/summary-invoice/common_ajax',  
			        async : false,
			        data: {
						'customers' : customers,
						'jobId' : currecntVar.attr('data-jobid'),
						'action_type' : 'get-sub-costs-overview'
					},
			        success: function(response){
			        	currecntVar.closest('tr').next('.sub-tr').html('<td colspan="12" class="text-center" style="background-color: #d8d8d8;" >'+response+'</td>');
						currecntVar.attr("is-ajax-send", "1");
						$("[data-toggle=tooltip]").tooltip();
						showCommentMoreLessCommon(50);
						applyTableSort();
						$('[data-toggle="popover"]').popover();
			        }
			  });
		 	}, 100);
		}else{
			currecntVar.closest('tr').next('.sub-tr').toggle('slow');
		}

		
	});

	
	$(document).on('click', '.btn-master-unlink', function(e) {
		e.preventDefault();
		var jobidArr = [], jecidArr = [];

		$(".select_each_job:checked").each(function(){
			var jecid = $(this).attr('data-jecid');
			var jobId = $(this).attr('data-jobid');
			var isjobupdate = $(this).attr('data-isjobupdate');

			if(jecid != "" && jecid != undefined){
				var j = jecid.split(',');
				for (i = 0; i < j.length; ++i) {
				   jecidArr.push(j[i]);
				}
			}
			if(isjobupdate && jobId != undefined){
				jobidArr.push(jobId);
			}
		});
		$(".sub_each_tr:checked").each(function(){
			var jecid = $(this).attr('data-jecid');
			var jobId = $(this).attr('data-jobid');
			var isjobupdate = $(this).attr('data-isjobupdate');

			if(jecid != "" && jecid != undefined){
				jecidArr.push(jecid);
			}
			if(isjobupdate == 1 && jobId != "" && jobId != undefined){
				jobidArr.push(jobId);
			}
		});

		BootstrapDialog.confirm('Are you sure you want to Un-Link this costs?', function(result){
		if(result) {
			$('.btn-master-unlink, .btn-filter-overview').attr('disabled','disabled');
			$('.btn-master-unlink i').removeClass('fa-unlink').addClass('fa-spinner fa-spin');
			$.ajax({
				type: 'POST',
				url: appHome+'/summary-invoice/common_ajax',
				data: {
						'jobidArr' : jobidArr,
						'jecidArr' : jecidArr,
						'action_type' : 'master-unlink-summary-invoice'
				},
				success: function(response){
					if(response == true){
						$('#response').html(alertMsgDiv('Summary Invoice Unlinked Successfully', 'success'));
					}
					getOvervieList('initial-call');
				},
				error: function(response){
					BootstrapDialog.show({title: 'Error', message : 'Error Occured. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
					$('.btn-master-unlink, .btn-filter-overview').attr('disabled','disabled');
					$('.btn-master-unlink i').removeClass('fa-unlink').addClass('fa-spinner fa-spin');
				}
			});
		}
		});
	});
		
	 $(document).on('change', '#customer', function(e) {
		 getAllCurrenciesByCustomer();
	 });

	function getAllCurrenciesByCustomer(){
	  	var customer = $('#customer').val();

	  	if(customer != ""){
			$.ajax({
			    type: 'POST',
			    dataType: 'JSON',
			    url: appHome+'/summary-invoice/common_ajax',
			    data: {
			      'customer'	: customer,
			      'action_type' : 'get_all_currencies_by_customer'
			    },
			    success: function(response){
			    	var optionHtml = '<option value=""></option>';
			    	if (!jQuery.isEmptyObject(response)) {
				        $.each(response, function(i, item) {
							optionHtml += '<option value="'+item.val+'">'+item.text+'</option>';
						});
				    }
			    	$('#currency').html(optionHtml).chosen().trigger("chosen:updated");
			    }
			});
		}else{
			$('#currency').html('<option value=""></option>').chosen().trigger("chosen:updated");
		}
}
	 
	 function isSummaryInvoiceExist(currVariable){
		 var ret = true;
		 $.ajax({
		        type: 'POST', 
		        url: appHome+'/summary-invoice/common_ajax',  
		        async : false,
		        data: {
					'invoice_number' : currVariable.val(),
					'sId' : $('#hidden-summary-id').val(),
					'action_type' : 'summary_invoice_exit'
				},
		        success: function(response){
		        	if(response > 0){
		        		ret = false;
		        	}
		        }
		  });
		 return ret;
	 }
	 $('#btn-summary-inv-next').click(function(e){
		  
		  $('.highlight').removeClass('highlight');
		  e.preventDefault();
		  
		  /*--------------------------validation start---------------------- */
		  var success = [];
		  var billing_office = $("#bill-office").val();
		  if(($('#generate_invoice').is(':checked') == false) && (billing_office!="IB")){
		  	success.push( commonHighlight($('#summary_invoice_number'), '') );
		  }
		  
		  success.push( commonHighlight($('#customer'), '') );
		  success.push( commonHighlight($('#currency'), '') );
		  success.push( commonHighlight($('#summary_po_date'), '') );
		  
		  if($('#summary_invoice_number').val().trim() != ""){
			  var exist  = isSummaryInvoiceExist($('#summary_invoice_number'));
			  if(!exist){
				  success.push(exist);
				  alert_required = alertMsgDiv('Summary Invoice Alerady Exist', 'error');
			  }else{
				  alert_required = old_alert;
			  }
		 }
		 if( isValidationSuccess(success, alert_required) === true ){ //success
		 	$(this).attr('disabled', true);
		 	if($('#hidden-summary-id').val() != ""){
		 		localStorage.setItem('response', alertMsgDiv('Summary Invoice Updated Successfully', 'success'));
		 	}else{
		 		localStorage.setItem('response', alertMsgDiv('Summary Invoice Created Successfully', 'success'));
		 	}
			$('#form-summary-invoice').submit();
		  }
		  /*--------------------------validation end---------------------- */
	});

	$(document).on('change', '.select_each_job', function(e) {
		var checked = $(this).is(':checked');
		var changedCheckboxes = $(this).closest('tr').next('.sub-tr').find('.confirm_checkbox');

		$(changedCheckboxes).prop('checked',false);
        if(checked) {
            $(changedCheckboxes).prop('checked',true);
        }

	});

	$(document).on('change', '.all_accept', function(e) {

        $('#response').empty()
        var checked = $(this).is(':checked');
        $(".confirm_checkbox").prop('checked',false);
        if(checked) {
            //$('.confirm_checkbox').not(".select_one_fright_only").prop('checked',true);
            //$(".select_one_fright_only:first").prop('checked',true);
            $('.confirm_checkbox').prop('checked',true);
        }
        disableButton();
        calculateselectedTotal();
    });


	 

	$(document).on('change', '.sub_each_tr', function(e) {
		if($('#page-type').length > 0 && $('#page-type').val() == 'master-unlink'){
			var jobid = $(this).attr('data-jobid');
			var custID = $(this).attr('data-custid');

			var acceptCount1 = $('.sub_'+custID+'_'+jobid+':checked').length;
			var acceptTotal1 = $('.sub_'+custID+'_'+jobid).length;
			if(acceptCount1 == acceptTotal1){
				$('.tr_'+custID+'_'+jobid).prop('checked',true);
			}else{
				$('.tr_'+custID+'_'+jobid).prop('checked',false);
			}
		}
	});

	$(document).on('change', '#customer_group_filter', function(e) {

		if($(this).val() == ""){
			$("#customer_filter").multiselect('enable');
			$('.customer-label').css('color','black');
		} else {
			$("#customer_filter").multiselect('disable');
			$('.customer-label').css('color','#bdbdbd');
		}
	});


	/*$(document).on('change', '.select_one_fright_only', function(e) {
		if($(this).is(':checked')){
			$(".select_one_fright_only").prop('checked',false);
			$(this).prop('checked',true);
		}else{
			$(this).prop('checked',false);
		}
	});*/

	$(document).on('change', '.confirm_checkbox', function(e) {

		if($('#page-type').val() == "master-unlink"){

			var cuRjId = $(this).attr("data-jobid");
			var checkedjecId = $(this).attr("data-jecid");
			var currStatus = $(this).is(':checked');
			var Type = $(this).attr("data-rtype");
			var flagBit = false;
			var custid = $(this).attr('data-custid');
				
			if(currStatus && Type == 'D_SUMMARY'){
				var trmaxnormalDemtk = parseInt($('.each-unlink-tr[data-cid="'+custid+'"][data-jobid="'+cuRjId+'"]').attr('data-normaldemtk'));
				if(trmaxnormalDemtk > 0 && trmaxnormalDemtk > checkedjecId){
					$(this).attr("checked", false);
					BootstrapDialog.show({title: 'Error', message : 'Normal DEMTK recharge found after this recharge. Please contact your System Administrator.',
						buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'medium-dialog',	
					});
					return false;
				}
			}
			if(Type == 'D_SUMMARY'){

				$( '.confirm_checkbox[data-rtype="D_SUMMARY"][data-jobid="'+cuRjId+'"]' ).each(function( index ) {
				  
					var currjecId = $(this).attr("data-jecid");
					if(currStatus){
						if(parseInt(currjecId) > parseInt(checkedjecId) && !$(this).is(':checked')){
					  		flagBit = true;
					        $(this).attr("checked", false);
					  	}
					}else{
						if(parseInt(currjecId) < parseInt(checkedjecId)){
					        $(this).attr("checked", false);
					  	}
					}
				});
				if(flagBit){
						BootstrapDialog.show({title: 'Error', message : 'Latest DEMTK rechrge missing while selection. Please select latest DEMTK Recharge first.',
							 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'medium-dialog',	
						});
						$(this).attr("checked", false);
						return false;
				}
			}
		}
		$('#response').empty();
	    //accept all checkbox
	    var acceptCount = $('.confirm_checkbox:checked').length;
		var acceptTotal = $('.confirm_checkbox').length;

	    if(acceptCount == acceptTotal){
			$(".all_accept").prop('checked',true);
		}else{
			$(".all_accept").prop('checked',false);
		}
		/*
		var acceptCount = $('.confirm_checkbox:checked').not(".select_one_fright_only").length;
		var acceptTotal = $('.confirm_checkbox').not(".select_one_fright_only").length;

		var singleSelect = $('.select_one_fright_only:checked').length;
		var singleSelectAll = $('.select_one_fright_only').length;

		if($('#page-type').val() == 'link-to-summary'){
			if(acceptCount == acceptTotal && singleSelect == 1){
				$(".all_accept").prop('checked',true);
			}else if(acceptCount == acceptTotal &&  singleSelectAll == 0){
				$(".all_accept").prop('checked',true);
			}else{
				$(".all_accept").prop('checked',false);
			}
		}else{
			if(acceptCount == acceptTotal){
				$(".all_accept").prop('checked',true);
			}else{
				$(".all_accept").prop('checked',false);
			}
		}*/
		
		disableButton();
		calculateselectedTotal();
	});

	$(document).on('click', '.btn-link-selected-inv', function(e) {
		e.preventDefault();
		var jobid = [], jecid = [];
		$(".confirm_checkbox:checked").each(function(){
			jecid.push($(this).data('jecid'));
		    if($(this).data('isjobupdate') == 1){
		    	jobid.push($(this).data('jobid'));
		    }
		});
		BootstrapDialog.confirm('Are you sure you want to Link this costs?', function(result){
		if(result) {
			$('.btn-link-selected-inv').attr('disabled','disabled');
			$('.btn-link-selected-inv i').removeClass('fa-link').addClass('fa-spinner fa-spin');

			 
			$.ajax({
				type: 'POST',
				url: appHome+'/summary-invoice/common_ajax',
				data: {
						'jobid' : jobid,
						'jecid' : jecid,
						'summary-invoice-id' : $('#summary-invoice-id').val(),
						'total_amount' : $('#selected-total').val(),
						'action_type' : 'link-to-summary-invoice'
				},
				success: function(response){
					//location.reload();
					window.location.href = $('#return-url').val();
					localStorage.setItem('response', response);
				},
				error: function(response){
					BootstrapDialog.show({title: 'Error', message : 'Unable to delete. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
					$('.btn-link-selected-inv').attr('disabled',false);
					$('.btn-link-selected-inv i').removeClass('fa-spinner fa-spin').addClass('fa-link');
				}
			});
		} 
		});
	});

	$(document).on('click', '.preview-invoice', function(e) {
		e.preventDefault();
		$('#generate-supplier-invoice').submit();
	});

	$(document).on('click', '.btn-filter-overview', function(e) {
		e.preventDefault();
		getOvervieList('initial-call');
	});

	function getOvervieList(calltype){
		$('.btn-filter-overview, .btn-master-unlink').attr('disabled', true);
		$('.btn-master-unlink i').removeClass('fa-spinner fa-spin').addClass('fa-unlink');
		showBTLloader();
		//$('.render-data').html('<p class="text-center"><i class="fa fa-spinner fa-spin " style="font-size:80px"></i></p>');
		$('#response').empty();
		$.ajax({
				type: 'POST',
				url: appHome+'/summary-invoice/common_ajax',
				data: {
						'filter-data' : $('#form-overview-invoice').serialize(),
						'action_type' : 'get-overview-data',
						'load_type' : calltype,
				},
				success: function(response){
					 //$('.render-data').html(response);
					 htmlRenderWithBTLloader('render-data', response);
					 $('#totalrecords').val($('#hd_totalrecords').val());
					 if($('.each-unlink-tr').length > 0){
					 	$('.btn-export-data').attr('disabled', false);
					 }else{
					 	$('.btn-export-data').attr('disabled', true);
					 }
					 $('.btn-filter-overview').attr('disabled', false);
					 $("[data-toggle=tooltip]").tooltip();
					 applyTableSort();
					 applySortClass();
					 $('[data-toggle="popover"]').popover();
				},
				error: function(response){
					$('.btn-filter-overview').attr('disabled', false);
					BootstrapDialog.show({title: 'Error', message : 'Error Occured. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
	}

//Pagination button
$(document).on('click', '.first-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getOvervieList('initial-call');
});


//Pagination button
$(document).on('click', '.last-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getOvervieList('initial-call');
});

//Pagination button
$(document).on('click', '.next-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getOvervieList('initial-call');
});


//Pagination button
$(document).on('click', '.prev-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getOvervieList('initial-call');
});

//Page size change
$(document).on('change', '.page-limit', function(){
	var pageSize = $(this).val();
	$('#pagesize').val(pageSize);
	$('#page').val(0);
	getOvervieList('initial-call');
});

	$(document).on('click', '.complete-summary', function(e) {
		e.preventDefault();
		var success = [];
		success.push( commonHighlightTextarea($('#summ-comments'), '') );

		if( isValidationSuccess(success, alert_required) === true ){ //success
			BootstrapDialog.show({
			   type: BootstrapDialog.TYPE_DANGER,
	           title: 'Warning',
	           message: 'Are you sure you want to Complete this cost?',
	           buttons: [{
				             label: 'Close',
				             action: function(dialogItself){
				                 dialogItself.close();
				             }
					         },{
				           label: 'Ok',
				           cssClass: 'btn-danger',
				           action: function(dialogItself){
				           		$(this).attr('disabled',true);
				           		$(this).html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Ok');
				           		$('.complete-summary').attr('disabled',true);

				          		$.ajax({
									type: 'POST',
									url: appHome+'/summary-invoice/common_ajax',
									data: {
											'summary-invoice-id' : $('#summary-invoice-id').val(),
											'summ-comments' : $('#summ-comments').val(),
											'action_type' : 'complete-summary-invoice',
									},
									success: function(response){
										 dialogItself.close();
										 localStorage.setItem('response', response);
										 location.reload();
									},
									error: function(response){
										$('.complete-summary').attr('disabled',false);
										BootstrapDialog.show({title: 'Error', message : 'Error Occured. Please try later.',
											 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
										});
									}
								});
				           }
				   }]
	       });
		}
	});


	$(document).on('click', '.delete-summary-invoice', function(e) {
		e.preventDefault();
		var id = $(this).attr('data-id');
		 	BootstrapDialog.show({
			   type: BootstrapDialog.TYPE_DANGER,
	           title: 'Warning',
	           message: 'Are you sure you want to delete this Invoice?',
	           buttons: [{
				             label: 'Close',
				             action: function(dialogItself){
				                 dialogItself.close();
				             }
					         },{
				           label: 'Ok',
				           cssClass: 'btn-danger',
				           action: function(dialogItself){
				           		$(this).attr('disabled',true);
				           		$(this).html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Ok');
				          		$.ajax({
									type: 'POST',
									url: appHome+'/summary-invoice/common_ajax',
									data: {
											'inv-id' : id,
											'action_type' : 'delete-summary-invoice'
									},
									success: function(response){
										 dialogItself.close();
										 localStorage.setItem('response', response);
										 location.reload();
									}
								});
				           }
				   }]
	       });
	});

	$(document).on('click', '.reset-summary-link-filter', function(e) {
		e.preventDefault();
		resetSearchFilter();
	});

	$(document).on('click', '.apply-po-filter', function(e) {
		e.preventDefault();
		getunlinkedCostsAjax();
	});

	

	

	$(document).on('click', '.unlink_each', function(e) {
		e.preventDefault();
		var currVariable = $(this);
		var jecid = $(this).attr('data-jecid');
		var eachTotal = parseFloat($(this).attr('data-total'));
		var jobid = $(this).attr('data-jobid');
		var isUpdateJob = $(this).attr('data-isjobupdate');
		

 		BootstrapDialog.show({
			   type: BootstrapDialog.TYPE_DANGER,
	           title: 'Warning',
	           message: 'Are you sure you want to Un-link this costs?',
	           buttons: [{
				             label: 'Close',
				             action: function(dialogItself){
				                 dialogItself.close();
				             }
					         },{
				           label: 'Ok',
				           cssClass: 'btn-danger',
				           action: function(dialogItself){
				           		$(this).attr('disabled',true);
				           		$(this).html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Ok');

				          		$.ajax({
									type: 'POST',
									url: appHome+'/summary-invoice/common_ajax',
									data: {
											'jobid' : jobid,
											'jecid' : jecid,
											'is-job-update' : isUpdateJob,
											'total_amount' : eachTotal,
											'summary-invoice-id' : $('#summary-invoice-id').val(),
											'action_type' : 'un-link-from-summary-invoice'
									},
									success: function(response){
										 dialogItself.close();
										 currVariable.parent().parent('tr').hide(1000, function () {
											currVariable.remove();
											if($('.unlink_each').length == 0){
												location.reload();
											}else{
											 	calculateAllTotal(eachTotal);
											 	getunlinkedCostsAjax();
											 }

										 });
										 
										 
									},
									error: function(response){
										BootstrapDialog.show({title: 'Error', message : 'Unable to Un-link. Please try later.',
											 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
										});
									}
								});
				           }
				   }]
	       });
	});


	function calculateAllTotal(eachTotal){

		var totalTd = ($('#hidden-full-total').length > 0) ? $('#hidden-full-total').val() : 0;
		var convertedTotal = totalTd - eachTotal;
		$('#hidden-full-total').val(convertedTotal);
		$('.total-td').text((convertedTotal).toFixed(2));
	}

	function calculateselectedTotal(){
		var fullTotal = 0;
		var prevTotal = parseFloat($('#prev-total').val());
		if($('.confirm_checkbox:checked').length > 0){
			$(".confirm_checkbox:checked").each(function(){
		    	var total = parseFloat($(this).data('total'));
		    	fullTotal = fullTotal + total;
		  	});
		}
		$('#selected-total').val(fullTotal.toFixed(2));
		$('#invoice-total').val( (prevTotal + fullTotal).toFixed(2) );

	}
	function disableButton(){
		var acceptCount = $('.confirm_checkbox:checked').length;
		if(acceptCount > 0){
			$('.btn-link-selected-inv, .btn-master-unlink').removeAttr('disabled');
		}else{
			$('.btn-link-selected-inv, .btn-master-unlink').attr('disabled','disabled');
		}
	}

	function resetSearchFilter(){
		$('#collection_country_filter,#delivery_country_filter,#product_filter,#customer_group_filter').val('').chosen().trigger("chosen:updated");
		$("#customer_filter").multiselect('enable');
		$("#customer_filter").val($('#po__main_cust_id').val());
		$("#customer_filter").multiselect('refresh');
		$('#date_from,#date_to,#job_order_number,#plan_booking_reference').val('');
		getunlinkedCostsAjax();
	}

	function getunlinkedCostsAjax(){

		showBTLloader();
		$('.apply-po-filter').attr('disabled', true);

		var customers = [];
		var jobFromC = "";
		var jobToC = "";
		var prodId = "";
		var fromDate = "";
		var toDate = "";
		var jobOrderNo = "";
		var planBookingRef = "";
		var customerGroupId ="";
		var poCurrId  = "";

		if($('#customer_group_filter').length > 0 && $('#customer_group_filter').val() != ""){
			customerGroupId = $('#customer_group_filter').val();
			customers = [];
		}else if($('#customer_filter').length > 0 && ($('#customer_group_filter').length > 0 && $('#customer_group_filter').val() == "")){
			customers = $('#customer_filter').val();
			customerGroupId = "";
		}
		if($('#collection_country_filter').length > 0){
			jobFromC = $('#collection_country_filter').val();
		}
		if($('#delivery_country_filter').length > 0){
			jobToC = $('#delivery_country_filter').val();
		}
		if($('#product_filter').length > 0){
			prodId = $('#product_filter').val();
		}
		if($('#date_from').length > 0){
			fromDate = $('#date_from').val();
		}
		if($('#date_to').length > 0){
			toDate = $('#date_to').val();
		}
		if($('#job_order_number').length > 0){
			jobOrderNo = $('#job_order_number').val();
		}
		if($('#plan_booking_reference').length > 0){
			planBookingRef = $('#plan_booking_reference').val();
		}
		if($('#po_curr_id').length > 0){
			poCurrId = $('#po_curr_id').val();
		}
		$.ajax({
				type: 'POST',
				url: appHome+'/summary-invoice/common_ajax',
				data: {
						'summary-invoice-id' : $('#summary-invoice-id').val(),
						'page-type' : $('#page-type').val(),
						'action_type' : 'get-unlinked-costs-ajax',
						'customers' : customers, 
						'jobFromC' : jobFromC,
						'jobToC' : jobToC,
						'prodId' : prodId,
						'fromDate' : fromDate,
						'toDate' : toDate,
						'jobOrderNo' : jobOrderNo,
						'planBookingRef' : planBookingRef,
						'customerGroupId' : customerGroupId,
						'poCurrId' : poCurrId
				},
				success: function(response){	
					$('.apply-po-filter').attr('disabled', false);				 
					htmlRenderWithBTLloader('costs-from-ajax', response);
					$("[data-toggle=tooltip]").tooltip();
					
					if($('.each-costs-tr').length > 0){
						$('.complete-summary, .preview-invoice').attr('disabled', false);
						$('.edit-master-data').attr('href', '#');
						$('.edit-master-data').css('cursor', 'not-allowed');
						$('.edit-master-data').css('background-color', '#9fd89f');
					}else{
						$('.complete-summary, .preview-invoice').attr('disabled', true);
					}
					showCommentMoreLessCommon(50);
					calculateselectedTotal();
					applyTableSort();
					$('[data-toggle="popover"]').popover();
				},
				error: function(response){
					$('.apply-po-filter').attr('disabled', false);	
					BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
	}
	if($('#page-type').val() == 'link-to-summary' || $('#page-type').val() == 'edit' ){
		getunlinkedCostsAjax();
	}
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
	$('.tmp-input-ctrl').remove();
	}

	function applyTableSort(){
		$(".tablesorter").tablesorter({
						 cssHeader:'sortheader',
						 cssAsc:'headerSortUp',
						 cssDesc:'headerSortDown',
						 dateFormat: "ddmmyyyy",
						 widgets: ["saveSort"],
					    widgetOptions : {
					      // if false, the sort will not be saved for next page reload
					      saveSort : true
					    },
						 headers: { 
				            '.no-sort' : {
						        sorter: false, parser: false
						    }
				        }
					});
	}
	calculateselectedTotal();

	$(document).on('click', '.btl-ajax-sort', function(e) {
		getOvervieList('initial-call');
	});


	function applySortClass(){
		$('.center-cell').removeClass('sortClass-th');
		$('a[data-sort="'+$('#sort').val()+'"]').parent('th').addClass('sortClass-th');
		if($('#sorttype').val() == 'asc'){
			var imgUrl = 'fa fa-lg fa-sort-asc';
			var title = 'Ascending';
		}else{
			var imgUrl = 'fa fa-lg fa-sort-desc';
			var title = 'Descending';
		}
		var ImgSrc  = $('a[data-sort="'+$('#sort').val()+'"]').siblings('.fa');
		ImgSrc.removeClass().addClass(imgUrl);
		ImgSrc.attr('title',title);
	}


	$(document).on('click', '.sortClass', function(){
	
		if($('.norecords').length != 1 ){
			$('.center-cell').removeClass('sortClass-th');
			$(this).parent('th').addClass('sortClass-th');
			var sort = $(this).attr('data-sort');
			var sort_type = $(this).attr('data-sort-type');
			if($('#sort').val() == sort){
				if($('#sorttype').val() == 'asc')
					$('#sorttype').val('desc');
				else
					$('#sorttype').val('asc');
			}else{
				$('#sort').val(sort);
				$('#sorttype').val(sort_type);
			}
			$('#response').empty();
			getOvervieList('initial-call');
		}
	});

    $(document).on('change','#customer',function(){
 	   	var billing_office =$(this).find(':selected').attr('data-val-office');
 	   	var formtype = $("#form-type").val();
 	   	if((billing_office==="IB")&&(formtype==="add")){
 	   			$("#bill-office").val("IB");
 	   			$("#summary-invoice-text").hide();
 	   	}else{
 	   	        $("#bill-office").val(billing_office);
 	   		   	$("#summary-invoice-text").show();
 	   		   	if((billing_office==="IB")&&(formtype==="edit")){
 	   		   		$('#summary_invoice_number').attr('readonly','readonly');
 	   		   	}else{
 	   		   		$('#summary_invoice_number').removeAttr('readonly');
 	   		   	}
 	   } 	   
    });

    var billing_office =$(this).find(':selected').attr('data-val-office');
 	var formtype = $("#form-type").val();
 	if((billing_office==="IB")&&(formtype==="edit")){
 	    $('#summary_invoice_number').attr('readonly','readonly');
 	}else{
 	   	$('#summary_invoice_number').removeAttr('readonly');
 	}
 	if((billing_office==="IB")&&(formtype==="add")){
 	    $("#summary-invoice-text").hide();
 	}
	if(($('#generate_invoice').is(':checked') == true) && (formtype==="edit")){
		 $('#summary_invoice_number').attr('readonly','readonly');
		 $("#customer").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
	}else{
		$('#summary_invoice_number').removeAttr('readonly');
	}
	//Auto genarate invoice number
	$('#generate_invoice').change(function() {
        if(this.checked) {
			$('#summary_invoice_number').val('');
            $('#summary_invoice_number').attr('readonly','readonly');
        }else{
			$('#summary_invoice_number').removeAttr('readonly');
		}
    });
});
