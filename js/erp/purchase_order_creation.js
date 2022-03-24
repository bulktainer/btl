$(document).ready(function(){
	
	$(document).on('click', '.show-po-total', function(e){
		if($('#form_type').val() == 'live' 
			&& $("#total_div").length > 0 
			&& $("#total_div").attr("data-issendajax") == 0){
			
			getTotalAmount(); //Get total amount
		}
	});
	
	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
	//To focus on the date picker
	$(document).on('click', '.show-date-pic', function(e){
	    $('#po_date').focus();
	});
	
	var purchase_id = $('#po_number').val();
	var main_page = $('#main_page').val();
	if (typeof purchase_id  !== "undefined" && main_page == 'main_page'){
		noteview(purchase_id);
	}
	/*if($('#filtter').val() == 'inddex'){
		if($('#po_area-filter').val() != ''){
			poTypeFromArea();
		}
		
		if($('#htype').val()!= ''){
			var htype = $('#htype').val();
			poTypeFromArea();
			$("#po_type-filter").val(htype);
			$('.chosen').chosen().trigger("chosen:updated");
		}
		
		if($('#po_type-filter').val() != ''){
			getSubtypeFromType();
		}
		
		if($('#hsubtype').val()!= ''){
			var hsubtype = $('#hsubtype').val();
			getSubtypeFromType();
			$("#po_subtype-filter").val(hsubtype);
			$('.chosen').chosen().trigger("chosen:updated");
		}
	}*/
	//Add note in the page
	$('.addnote').click(function (e) {
		e.preventDefault();
		var note 		= $('#purchasenotes').val();
		var purchase_id = $(this).data('purchase-id');
		var username 	= $('#username').val();
		if(note.trim() == ''){
			document.getElementById("purchasenotes").style.borderColor = "red";
		}else{
			document.getElementById("purchasenotes").style.borderColor = "#ddd";
		$.ajax({
			type: 'POST',
			url: appHome + '/purchase_order/common_ajax',
			async: false,
			data: {
				'action_type': 'add_note',
				'id': purchase_id,
				'note': note,
				'username': username
			},
			success: function (response) {


				noteview(response);

				$('#responsenote').hide().html('<p class="alert alert-success">Purchase Order Note added</p>').fadeIn();
				$('#responsenote').delay(3000).slideUp();
			},
			error: function (response) {
				alert("error");
			}
		});
		}

	});
	//For viewing the note
	function noteview(purchase_id) {

		$.ajax({
			type: 'POST',
			dataType : 'JSON',
			url: appHome + '/purchase_order/common_ajax',
			async: false,
			data: {
				'action_type': 'notefetch',
				'id': purchase_id
			},
			success: function (response) { 
				$('#purchasenotes').val(""); 
				tddata = "";
				 var count = Object.keys(response).length;
				  if (count > 0) {
					$.each(response, function (i, item) {
						tddata += '<tr id="' + 'aa' + response.id + '">' +

							'<td class="text-left" >' + item.purchase_order_id + '</td>' +
							'<td class="text-left style="word-break: break-all" >' + item.notes + '</td>' +
							'<td class="text-left" >' + item.userid + '</td>' +
							'<td class="text-left" >' + item.date_added + '</td>' +
							'<td class="text-center" ><a style="color:red" class="delete_note" data-id="' + item.id + '" href="javascript:void(0);" title="Delete Document"><i class="fa fa-trash-o"></i></a></td>' +


							'</tr>';

					});
				} else {
					tddata += '<tr id="emptyFilesTr" class="">' +
						'<td style="text-align:center;" colspan="6"><p class="alert alert-warning" style="margin-bottom:0;">No files found.</p></td>' +
						'</tr>';
				}
				$('#ProductFileAttachment11').html(tddata);


			},
			error: function (response) {
				alert("error");

			}
		});
	}
	
	/* For displaying month and year only */
	$(function() {
	    $('.date-picker').datepicker( {
	        changeMonth: true,
	        changeYear: true,
	        showButtonPanel: true,
	        yearRange: "2018:2099",
	        dateFormat: 'MM yy',
	        onClose: function(dateText, inst) { 
	        function isDonePressed(){
	                            return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
	                        	}
	        if (isDonePressed()){

	                            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
	                            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
	                            $(this).datepicker('setDate', new Date(year, month, 1));
	                            }
	            }
	    });
	});
	//po number creation
	$('.btn-po-number').click(function(e){
		  var success = [];
		  $('.highlight').removeClass('highlight');
		  e.preventDefault();

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
		  
		// validation start-------------------------------
		  if($(this).hasClass('btn-po-number')){
			  e.preventDefault();
			  if($('#tempORpo').val() != "Template"){
				  highlight($('#po_temp_id'), '');
			  }
			  highlight($('#po_date'), '');
			  if($('#po_date').val() != ''){
				  //function for chech quote number valid
				  isDateValid();
			  }
			  if(ExistSuccess == 'Exist'){
				  success.push(false);
			  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This date is already used for creating PO.</div>';
			  }else if(ExistSuccess == 'ExistTemp'){
				  success.push(false);
			  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Invalid PO Template ID.</div>';
			   
			  }else if(ExistSuccess == 'dateFormat'){
				  success.push(false);
			  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Invalid Date Format.</div>';
			   
			  }else if(ExistSuccess == 'NoPermission'){
				  success.push(false);
			  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> No permisssion To Access The Template.</div>';
			   
			  }
			  else{
				  success.push(true); 
				  alert_required = oldalert;
			  }   
			  var check_fields = (success.indexOf(false) > -1);
			//console.log(check_fields);
			     if(check_fields === true){
			       $('html, body').animate({ scrollTop: 0 }, 400);
			       $('form').find('#response').empty().prepend(alert_required).fadeIn();
			     } else {
			    	 $('#form-btn-po-number').submit();
			     }
		  }
		  
		  function isDateValid() {
				ExistSuccess = [];
				
				  $.ajax({
				        type: 'POST', 
				        url: appHome+'/purchase_order/common_ajax',
				        async : false,
				        data: {
				        	'action_type' : 'check_pono_valid',
				        	'po_date'	  : $('#po_date').val(),
				        	'po_temp_id'  : $('#po_temp_id').val(),
				        	'po_type'  	  : $('#potype').val()
						},
				        success: function(response){ 
				        	if(response == 'exist'){
				        		ExistSuccess = 'Exist'
				        		$('#po_date').parent().addClass('highlight');
				        	}else if(response == 'existTemp'){
				        		ExistSuccess = 'ExistTemp'
				        		$('#po_temp_id').parent().addClass('highlight');
				        	}else if(response == 'dateformat'){
				        		ExistSuccess = 'dateFormat'
					        	$('#po_date').parent().addClass('highlight');
				        	}else if(response == 'noPermission'){ 
				        		ExistSuccess = 'NoPermission'
						        	$('#po_temp_id').parent().addClass('highlight');
						    }
				        	else{
				        		ExistSuccess = 'Ok'
				        		$('#po_number').val(response);	
				        		$($('#po_date')).parent().removeClass('highlight');
				        		$('#po_temp_id').parent().removeClass('highlight');
				        	}
				        },
				        error: function(response){
				          $('html, body').animate({ scrollTop: 0 }, 400);
				          $('form').find('#response').empty().prepend(alert_error).fadeIn();
				        }
				  });
			  }
		  
	});
		  
	
	$('#currency').on('change', function() {
		  var currency_id = $(this).chosen().val();
		  switch_specific_currency_icons(currency_id,'estimated-currency');
		  if($('input[name=optradio]:checked').val() == 'recharge'){
			  //fillCustomerByCurrency();
			  getAllCustomersByCurrency();
		  }
	  });
	$('#actual_currency').on('change', function() {
		  var currency_id = $(this).chosen().val();
		  switch_specific_currency_icons(currency_id,'actual-currency-change');
		 
	  });
	$('#foreign_currency').on('change', function() {
		  var currency_id = $(this).chosen().val();
		  switch_specific_currency_icons(currency_id,'foreign-currency-change');
		 
	  });
	function switch_specific_currency_icons(currency_id,change_class){
		  var $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
	      currency_name = $currency.attr('data-label');

		  if(!$currency.length) {
		    alert('Error. Currency not found.');
		    return false;
		  }
		  if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
		  	$("."+change_class ).removeClass().html("").addClass(change_class+' fa currency-fa fa-'+currency_name);
		  }
		  else {
		  	$("."+change_class ).removeClass().html(currency_name.toUpperCase()).addClass(change_class+' fa currency-fa');
		  }
	  }
	/**
	   * function for fill recharge currency
	   */
	  function fillCustomerByCurrency(){
		  var currency 		= $('#currency').val();
		  var bill_office 	= $('#billing_office').val();
		  var is_equipment 	= $('#is_equipment').val();
		  if(currency != ""){
		  $.ajax({
		        type: 'POST',
		        url: appHome+'/purchase_order/common_ajax',
		        data: {
		          'currency'		: currency,
		          'billing_office'	: bill_office,
		          'is_equipment'	: is_equipment,
		          'action_type' 	: 'get_customers_by_currency'
		        },
			    beforeSend: function() {
			    	$('<i class="fa fa-spinner fa-spin"></i>').insertAfter($('#recharge_to_another_customer').parent());
			     },
		        success: function(response){
		        	$('#recharge_to_another_customer').html(response).chosen().trigger("chosen:updated");;
		        	$('.fa-spinner').remove();
		        }
		      });
		  }
	  }
	$('#paste_supplier_invoice').on('click', function(e) {
	  	e.preventDefault();
	    var supplier_inv_id = $(this).data('supplier-inv-id'); 
	    var supplier_inv_no = $(this).data('supplier-inv-no'); 
	    var supplier_inv_date = $(this).data('supplier-inv-date');
	    var supplier_inv_bookingdate = $(this).data('supplier-inv-bookingdate');
	    var supplier_inv_currency = $(this).data('supplier-inv-currency');
	    var supp_cur_name	= $(this).data('supplier-currname');
	    var supplier_inv_supplier = $(this).data('supplier-inv-supplier');
	    var code_identify		  = $(this).data('code-identify');
	    var supp_amount		  	  = $(this).data('amount');
	    
	    $("#isprocessed").val("1");
	    $('#invoice_no_ref').val(supplier_inv_id);
	    $('#invoice_no').val(supplier_inv_no);
	    $('#booking_date').val(supplier_inv_bookingdate);
	    $('#invoice_date').val(supplier_inv_date);
	    $('#actual_currency').val(supplier_inv_currency);
	    $('#supplier-currency').val(supp_cur_name.toUpperCase());
	    $('#supplier').val(supplier_inv_supplier);
	    if(code_identify == "1"){
	    	$('#actual_amount').val(supp_amount);
	    	$("#actual_amount").attr('readonly','readonly');
	    }else{
	    	$('#actual_amount').val('0.00');
	    }
	    switch_specific_currency_icons(supplier_inv_currency,'actual-currency-change');
	    $('.chosen').chosen().trigger("chosen:updated");
	    matchSupplierCurr();
	    /*$("#currency").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
    	$("#actual_currency").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);*/
	  });
  
	
	/**
	  * save / update section
	  */
	  $('.save-po-cost,.update-po-cost').click(function(e){

	    $('.highlight').removeClass('highlight');
	    e.preventDefault();
	    var form = '#'+$(this).closest('form').attr('id'),
	        success = [],
	        po_id = $('input[name="po_id"]').val(),
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
	    
	    highlight($('#po_no'), '');
	    //highlight($('#activity'), '');
	    highlight($('#supplier'), '');
	    highlight($('#currency'), '');
	    highlight($('#actual_currency'), '');
	    if($('#po_area').val() == 'MR'){
	    	//highlight($('#po_type'), '');
		    highlight($('#tank_num'), '');
		   
		    $('.com_est').each(function(){
		    	      highlight($(this), '');
		    	    
		    });
		    $('.com_sub').each(function(){
		    	      highlight($(this), '');
		    });
		    $('.com_type').each(function(){
	    	      highlight($(this), '');
	    });
	    }
	    if($('#po_vat_type').val() == 'VAT'){
	    	highlight($('#foreign_currency'), '');
	    }
	    
	    /*if($('#po_area').val() != "Accounts"){
		    if(($('#equip_number').val() != "") || ($('#equip_number').val() != undefined)){
		    	highlight($('#equip_subtype'), '');
		    }
	    }*/
	    if($('#equip_subtype').length > 0){
	    	highlight($('#equip_subtype'), '');
	    }

	    if($('#po_area').val() == "Accounts"){
	    	highlight($('#activity'), '');
	    	if($('#po_vat_type').val() != 'VAT'){
	    		highlight($('#cost_centre'), '');
	    	}
	    }

	    if($('#po_area').val() == 'ClaimsInsurance'){
	    	highlight($('#po_insurence_type'), '');
	    }
		if($('#po_area').val() == 'Tank Lease'){
			// highlight($('#contractor'), "");
			// $('.com_est').each(function(){
			// 	highlight($(this), '');
			// });
			// $('.tank_lease_sub_type').each(function(){
			// 	highlight($(this), '');
			// 	if($(this).find("option:selected").data().division.trim() == "Lease Costs"){
			// 		highlight($($(this).closest('.tank_lease_row')).find(".lease_cost_from_date"), "");
			// 		highlight($($(this).closest('.tank_lease_row')).find(".lease_cost_to_date"), "");
			// 	}
			// });
			// $('.com_type').each(function(){
			// 	highlight($(this), '');
			// });
		}
	    var check_fields = (success.indexOf(false) > -1);
	    /**
	    * update edit-vgm-route
	    */
	    if($(this).hasClass('update-po-cost')){
	      if(check_fields === true){
	        $('html, body').animate({ scrollTop: 0 }, 400);
	        $('form').find('#response').empty().prepend(alert_required).fadeIn();
	      } else {
	    	$(this).attr('disabled','disabled');  
	        $.ajax({
	          type: 'POST',
	          url: '../'+po_id+'/update',
	          data: $(form).serialize().replace(/%5B%5D/g, '[]'),
	          success: function(response){
	            window.location.href = $('#returnpath').val();
	            localStorage.setItem('response', response);
	            $(this).removeAttr('disabled');
	          },
	          error: function(response){
	        	$(this).removeAttr('disabled');
	            $('html, body').animate({ scrollTop: 0 }, 400);
	            $('form').find('#response').empty().prepend(alert_error).fadeIn();
	          }
	        });
	      }
	    }
	    
	    /**
	     * create-vgm-route
	     */
	     if($(this).hasClass('save-po-cost')){
	       if(check_fields === true){
	         $('html, body').animate({ scrollTop: 0 }, 400);
	         $('form').find('#response').empty().prepend(alert_required).fadeIn();
	       } else {
	    	 $(this).attr('disabled','disabled');  
	         $.ajax({
	           type: 'POST',
	           url: appHome+'/purchase_order/add',
	           data: $(form).serialize().replace(/%5B%5D/g, '[]'),
	           success: function(response){
	             window.location.href = $('#returnpath').val();
	             localStorage.setItem('response', response);
	             $(this).removeAttr('disabled');
	           },
	           error: function(response){
	        	 $(this).removeAttr('disabled');
	             $('html, body').animate({ scrollTop: 0 }, 400);
	             $('form').find('#response').empty().prepend(alert_error).fadeIn();
	           }
	         });
	       }
	     }
	  });
	
	  /**
	   * Selecting recharge type 
	   */
	  $(document).on('click', '.recharge_radio', function(e) {
			 $('.highlight').removeClass('highlight');
		     $('textarea').css('border','1px solid #ccc');
		     $('input[type="checkbox"]').css('outline','none'); 
			 if($(this).val() == 'recharge'){
				 $('.recharge_pannel').show();
				 $('.not_recharge_pannel,.awaiting_final_action').hide();
			 }else if($(this).val() == 'not_recharge'){
				 $('.not_recharge_pannel').show();
				 $('.recharge_pannel,.awaiting_final_action').hide();
			 }else{
				 $('.awaiting_final_action').show();
				 $('.recharge_pannel,.not_recharge_pannel').hide();
			 }
	   });
	  
	  
	  /**
	   * save / update
	   */
	  $(document).on('click', '.save-recharge-btn', function(e) {

	     $('.highlight').removeClass('highlight');
	     e.preventDefault();
	     var optradio = $('input[name=optradio]:checked').val();
	     var category = $('#category').val();
	     //var form = '#'+$(this).closest('form').attr('id')
	     var form = '#rechare-form',
	         success = [],
	         po_cost_id = $('input[name="po_cost_id"]').val();

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
	   
	     if(optradio == 'recharge'){
		     highlight($('#currency'), '');
		     highlight($('#recharge_amount'), '');
		     highlight($('#recharge_to_another_customer'), '');
		     highlight($('#reason_code_for_acc_manager'), '');
		     if(category == 'Eqmt'){
		     	highlight($('#invoice_actual_date'), '');
		     }
	     }else if(optradio == 'awating_final_action'){
	    	 highlight($('#actual_currency'), '');
	    	 highlight($('#awaiting_amount'), '');
	     }else{
	    	
	    	 highlight($('#not_reason_code_for_acc_manager'), '');
	     }
	       var check_fields = (success.indexOf(false) > -1);

		   if(check_fields === true){
		     $('html, body').animate({ scrollTop: 0 }, 400);
		     $('#response').empty().prepend(alert_required).fadeIn();
		   } else {
			 $(this).attr('disabled','disabled');  
		     $.ajax({
		       type: 'POST',
		       url: appHome+'/purchase_order/'+po_cost_id+'/recharge',
		       data: $(form).serialize().replace(/%5B%5D/g, '[]'),
		       success: function(response){
		         window.location.href = $('#returnpath').val();
		         localStorage.setItem('response', response);
		       },
		       error: function(response){
		    	 $(this).removeAttr('disabled');
		         $('html, body').animate({ scrollTop: 0 }, 400);
		         $('#response').empty().prepend(alert_error).fadeIn();
		       }
		     });
		   }
	   });
	  
	//view purchase order template
		$(document).on('click', '.view_po', function(e){ 
		//$('.view_product').click(function(e) {
			$('.view_small_loader').show();
			$('.reset_values').html('');
			var po_id = $(this).data('id');
			var po_estmate 	= $(this).data('estmate');
			var po_actual	= $(this).data('actual');
			var po_recovered= $(this).data('recovered');
			var po_net		= $(this).data('net');
			var po_type		= $(this).data('type');
			var tankNum 	= $(this).parents('tr').find("td:eq(2)").html();
			var po_subtype	= $(this).data('subtype');
			var po_for_cur	= $(this).data('foreigncur');
			var po_for_amt	= $(this).data('foreignamt');
			var supplier	= $(this).data('supplier');
			$.ajax({ 
				type: 'POST',
				dataType: 'json',
				url: appHome+'/purchase_order/common_ajax',
				data: {
					'po_id' : po_id,
					'action_type' : 'get_po_detail'
					  },
				success: function(response){
					$('.view_small_loader').hide();
					if(response != ""){
						$('#modal_po_number').html(response.po_number);
						$('#modal_area_name').html(response.po_area_name);
						$('#modal_type_name').html(po_type);
						$('#modal_sub_type_name').html(po_subtype);
						$('#modal_month').html(response.po_month);
						$('#modal_year').html(response.po_year);
						$('#modal_tank_num').html(tankNum);
						$('#modal_estimated').html(po_estmate);
						$('#modal_actual').html(po_actual);
						$('#modal_recovered').html(po_recovered);
						$('#modal_net').html(po_net);
						if(po_for_cur != "" ){
							$('.subtype_vat').show();
							$('#modal_for_cur').html(po_for_cur);
							$('#modal_for_amt').html(po_for_amt);
						}else{
							$('.subtype_vat').hide();
						}
						$('#modal_supplier_name').html(supplier);
					}
				},
				error: function(response){
					BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		});
		
		
		//view purchase order template
		$(document).on('click', '.view_email_details', function(e){ 
		//$('.view_product').click(function(e) {
			$('.view_small_loader').show();
			$('.reset_values').html('');
			var po_id = $(this).data('id');
			$.ajax({ 
				type: 'POST',
				dataType: 'json',
				url: appHome+'/purchase_order/common_ajax',
				data: {
					'po_id' : po_id,
					'action_type' : 'show_email_detail'
					  },
				success: function(response){
					$('.view_small_loader').hide();
					if(response != ""){
						$('#modal_sender_name').html(response.po_email_from_name);
						$('#modal_to_email').html(response.po_email_to_email);
						$('#modal_date_time').html(response.po_email_date);
						$('#modal_subject').html(response.po_email_subject);
						$('#modal_message').html(response.po_email_message);
						$('#modal_attachement').html(response.po_email_file);
						
					}
				},
				error: function(response){
					BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		});
		
		$(document).on('click', '.job_template_change_status', function(e) {
			e.preventDefault();
			var poNumber =$(this).attr('data-ponumber');
			var poNo = $(this).attr('data-id');
			if($(this).hasClass('job_template_change_status')){
				var changeTo = $(this).attr('data-quote-change-to');
				var flag = 1;
			}else{
				var changeTo = 'live';
				var flag = 0;
			}
			var message = 'Are you sure want to move #<strong>'+poNumber+'</strong> to '+changeTo.charAt(0).toUpperCase() + changeTo.slice(1)+' ?';
			
			if(changeTo == 'live'){
				var mtype = BootstrapDialog.TYPE_SUCCESS;
				var mButton = 'btn-success';
			}else if(changeTo == 'archive'){
				var mtype = BootstrapDialog.TYPE_PRIMARY;
				var mButton = 'btn-primary';
			}
			else{
				var mtype = BootstrapDialog.TYPE_DANGER;
				var mButton = 'btn-danger';
			}
			 BootstrapDialog.show({
		         type: mtype,
		         title: 'Confirmation',
		         message: message,
		         buttons: [{
				             label: 'No',
				             action: function(dialogItself){
				                 dialogItself.close();
				             }
				         },{
			             label: 'Yes',
			             cssClass: mButton,
			             action: function(){
			            	 $.ajax({
			     		        type: 'POST',
			     		        url: appHome+'/purchase_order/common_ajax',
			     		        data: {
			     		      	  'poNo' : poNo,
			     		      	  'poNumber' : poNumber,
			     		      	  'action_type' : 'change_po_status',
			     		      	  'changeTo' : changeTo
			     		        },
			     		       beforeSend: function() {
			     		        	$('.bootstrap-dialog-footer-buttons > .'+mButton).html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
				     		        $('.bootstrap-dialog-footer-buttons > .'+mButton).attr('disabled','disabled');
			     		        },
			     		        success: function(response){
			     		        	if(flag == 1){
			     		        		location.reload();
			     		        	}else{
			     		        		window.location.href = appHome+'/purchase_order/index';
			     		        	}
			     		            localStorage.setItem('response', response);
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
		
		//Delete purchase order
		/*$(document).on('click', '.delete-po-btn', function(e){ 
		//$('.delete-po-btn').click(function(e) {
			e.preventDefault();
			
			var delete_url = $(this).attr('href'),
				po_id = $(this).data('prod-id'),
				$this = $(this),
				return_url = window.location.href;
			
			if($('#returnpath').val()) {
				return_url = $('#returnpath').val();
			}
			
			BootstrapDialog.confirm('Are you sure you want to delete this Purchase Order ?', function(result){
				if(result) {
					$.ajax({
						type: 'POST',
						url: delete_url,
						data: {'po_id' : po_id,
					//	'group' : group	
						},
						success: function(response){ 
							if(response == 'used'){
								BootstrapDialog.show({
		     		        		   type: BootstrapDialog.TYPE_DANGER,
		     		                   title: 'Warning',
		     		                   message: "This PO can\'t be deleted because there are supplier invoices associated with this PO",
		     		                   buttons: [{
		     		                     label: 'Close',
		     		                     action: function(dialogItself){
		     		                         dialogItself.close();
		     		                     }
		     		                 }]
		     		               });
							}else{
								window.location.href = return_url;
								localStorage.setItem('response', response);
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
		}); */
		
		//file upload start---------------------------------------
		
		
		$(document).on('click', '.delete_note', function (e) {
			var doc_id = $(this).data('id');
			var purchase_id = $('#po_number').val();
			BootstrapDialog.show({
				type: BootstrapDialog.TYPE_DANGER,
				title: 'Confirmation',
				message: 'Are you sure want to Delete?',
				buttons: [{
					label: 'Close',
					action: function (dialogItself) {
						dialogItself.close();
					}
				}, {
					label: 'Ok',
					cssClass: 'btn-danger',
					action: function (dialogItself) {
						dialogItself.close();
						$.ajax({
							type: 'POST',
							url: appHome + '/purchase_order/common_ajax',
							data: {
								'doc_id': doc_id,
								'purchafunction highlightse_id': purchase_id,
								'action_type': 'delete_note'
							},
							success: function (response) {
								noteview(response);

								$('#responsenote').hide().html('<p class="alert alert-success">Purchase Order Note Deleted</p>').fadeIn();
								$('#responsenote').delay(3000).slideUp();

							},
							error: function (response) {
								alert("error");

							}
						});
					}
				}]
			});
		});

		
		//view purchase order mail
		$(document).on('click', '.send_primary,.send_legacy', function(e){ 
		//$('.view_product').click(function(e) { 
			
			e.preventDefault();
			
			$('.highlight').removeClass('highlight');
			
			  var form = '#'+$(this).closest('form').attr('id'),
			      success = [];
			var choos_class = $(this).hasClass('send_primary');
			if(choos_class == true){
				cho_class='send_primary';
			}else{
				cho_class='send_legacy';
			}
			
			var po_cost_id = $('#cost_id').val();
			var mainform = $('#mainform').val();
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
			highlight($(form).find('#to_name1'), '');
			highlight($(form).find('#to_email1'), '');
			if($('#to_email1').val() != ''){
				  isEmail($(form).find('#to_email1'));
				  highlight($(form).find('#to_name1'), '');
			  }
			  if($('#to_name1').val() != ''){
				  	highlight($(form).find('#to_email1'), '');
			  		isEmail($(form).find('#to_email1'));
			  }
			  if($('#to_email2').val() != ''){
				  isEmail($(form).find('#to_email2'));
				  highlight($(form).find('#to_name2'), '');
			  }
			  if($('#to_name2').val() != ''){
				  	highlight($(form).find('#to_email2'), '');
			  		isEmail($(form).find('#to_email2'));
			  }
			  if($('#to_email3').val() != ''){
				  isEmail($(form).find('#to_email3'));
				  highlight($(form).find('#to_name3'), '');
			  }
			  if($('#to_name3').val() != ''){
				  	highlight($(form).find('#to_email3'), '');
			  		isEmail($(form).find('#to_email3'));
			  }
			  
			  if(ExistSuccess == 'Exist'){
				  success.push(false); 
			  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This VGM Route already exists.</div>';
			  }else{
				  success.push(true); 
				  alert_required = oldalert;
			  } 
			 
			  var check_fields = (success.indexOf(false) > -1);
			  if(check_fields === true){
			      $('html, body').animate({ scrollTop: 0 }, 400);
			      $('form').find('#response').empty().prepend(alert_required).fadeIn();//alert("inside");
			    } else {
			    	$('.send_primary').attr('disabled','disabled');
					$('.send_legacy').attr('disabled','disabled');
					$('.loader').addClass("fa fa-spinner fa-spin");    	
			var form1=$(this).parents('form.email_form');
			var	form_data = form1.serializeArray();
			var return_url = window.location.href;
			form_data.push({
			    name: "mainform",
			    value: mainform,
			  });
			form_data.push({
			    name: "chosen_class",
			    value: cho_class,
			  });
			form_data.push({
			    name: "action_type",
			    value: 'send_email_detail',
			  });
			$.ajax({ 
				type: 'POST',
				//dataType: 'json',
				url: appHome+'/purchase_order/common_ajax',
				data: form_data,
				success: function(response){ 
	        		BootstrapDialog.show({ 
							                type: BootstrapDialog.TYPE_SUCCESS,
							                title: 'Email Notification',
							                size: BootstrapDialog.SIZE_SMALL,
							                message: response,
							                buttons: [{
									                    label: 'Close',
									                    action: function(dialogItself){
									                        dialogItself.close();
									                        window.location.href = return_url;
									                    }
									                 }]
							            }); 
	        	
				},
				error: function(response){
					BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
			    }
		});
			//function to disable the send buttons
			$(document).on('click', '.checkattach', function(e){ 
				
				if($('.checkattach').is(":checked")){
					
					
					$('.send_primary').removeAttr('disabled');
					$('.send_legacy').removeAttr('disabled');
					
				}else{
					
					$('.send_primary').attr('disabled','disabled');
					$('.send_legacy').attr('disabled','disabled');
				}
			});
			
			
			//To autofill the name field in the email
			if($(".to_namee").length > 0)
			{
			$(".to_namee").autocomplete({
			      source:  appHome+'/purchase_order/getname_email',
			      minLength: 2,
			      type: "GET",
			      select : function (event, ui) {
			            var item = ui.item; 
			           // var obj = JSON.parse(ui);alert(obj.name);
			            if(item) {
			            	var id = $(this).data('email');
			            	
			                $(this).val(item.name);
			                $('#'+id).val(item.email);
			            }
			        }
			    });
		
			}
			
		//view purchase order email for repaly and email
		$(document).on('click', '.view_email', function(e){ 
		//$('.view_product').click(function(e) {
			$('.highlight').removeClass('highlight');
			$('.send_primary').attr('disabled','disabled');
			$('.send_legacy').attr('disabled','disabled');
			$('.reset_v').val('');
			$('.view_small_loader').show();
			$('.reset_values').html('');
			var po_cost_id = $(this).data('id');
			$('#cost_id').val(po_cost_id);
			$.ajax({ 
				type: 'POST',
				dataType: 'json',
				url: appHome+'/purchase_order/common_ajax',
				data: {
					'po_cost_id' : po_cost_id,
					'action_type' : 'get_file_upload'
					  },
				success: function(response){ 
					$('.view_small_loader').hide();
					$('.file_tr_list').remove();
					tddata = "";
					var t=0;
					if(response != ""){
						$.each(response.doc, function(i, item) { 
			
								if($('#subject').val()==''){
									$('#subject').val(item.docs_name);
								}
								t=t+1;
								tddata += '<tr class="file_tr_list">'+
								'<td width="25%"><strong>File '+t+'</strong></td>'+
								'<td width="25%"><label><input type="checkbox" class="checkattach" name="files[]" value="'+item.docs_path+'"> &nbsp'+item.docs_path+' </label></td>';
								tddata += '</tr>';
							
						});
						
					}else{
						tddata +='<tr id="emptyFilesTr" class="">'+
									'<td style="text-align:center;" colspan="6"><p class="alert alert-warning" style="margin-bottom:0;">No files found.</p></td>'+
								 '</tr>';
					}

					$('#mytable tr:last').before(tddata);
					$('#message').val(response.to_message);
				},
				error: function(response){
					BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		});
		
		
		//view purchase order email for repaly and email
		$(document).on('click', '.view_email_replay', function(e){ 
		//$('.view_product').click(function(e) {
			$('.highlight').removeClass('highlight');
			$('.send_primary').attr('disabled','disabled');
			$('.send_legacy').attr('disabled','disabled');
			$('.reset_v').val('');
			
			$('.view_small_loader').show();
			$('.reset_values').html('');
			var po_id = $(this).data('id');
			var email_id=$(this).data('emailid');
			$.ajax({ 
				type: 'POST',
				dataType: 'json',
				url: appHome+'/purchase_order/common_ajax',
				data: {
					
					'po_id' : po_id,
					'email_id':email_id,
					'action_type' : 'give_email_replay'
					  },
				success: function(response){ 
					$('.view_small_loader').hide();
					$('.file_tr_list').remove();
					tddata = "";
					var t=0;
					if(response != ""){ 
						$.each(response.doc, function(i, item) { 
							
								if($('#subject').val()==''){
									$('#subject').val(item.docs_name);
								}
								t=t+1;
								tddata += '<tr class="file_tr_list">'+
								'<td width="25%"><strong>File '+t+'</strong></td>'+
								'<td width="25%"><label><input type="checkbox" class="checkattach" name="files[]" value="'+item.docs_path+'"> &nbsp'+item.docs_path+' </label></td>';
						 
								tddata += '</tr>';
							
						});
						$('#to_name1').val(response.to_name);
						$('#to_email1').val(response.to_email);
						$('#subject').val(response.to_subject);
						$('#message').val(response.to_message);
						
					}else{
						tddata +='<tr id="emptyFilesTr" class="">'+
									'<td style="text-align:center;" colspan="6"><p class="alert alert-warning" style="margin-bottom:0;">No files found.</p></td>'+
								 '</tr>';
					}

					$('#mytable tr:last').before(tddata);
					
				},
				error: function(response){
					BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		});
		
		
		
		//view purchase order email for repaly and email
		$(document).on('click', '.view_selected_email', function(e){ 
		//$('.view_product').click(function(e) {
			$('.highlight').removeClass('highlight');
			$('.send_primary').removeAttr('disabled');
			$('.send_legacy').removeAttr('disabled');
			$('.reset_v').val('');
			
			var foot_message=$('#fmessage').val();
			var regex = /<br\s*[\/]?>/gi;
			var footer_message=foot_message.replace(regex, "\n");
			$('.file_tr_list').remove();
			var sel_email = $('#form_type').val();
			$('#mainform').val(sel_email);
			//alert(a);
		    var newArray= new Array();
		    tddata = "";
			var t=0;
			$("input:checkbox[name=files]:checked").each(function(){
			    newArray.push($(this).val());
			});
			
			var firstvalue=newArray[0];
			var items = firstvalue.split('/');
			var firstitem = items[3];
			if($('#subject').val()==''){
				$('#subject').val(firstitem);
			}
			$.each(newArray, function(i, item) {
				
				t=t+1;
				tddata += '<tr class="file_tr_list">'+
				'<td width="25%"><strong>File '+t+'</strong></td>'+
				'<td width="25%"><input type="text" name="files[]" class="form-control" value="'+item+'" readonly></td>';
				tddata += '</tr>';
				});
			$('#mytable tr:last').before(tddata);
			$('#message').val(footer_message);
		});
		$(document).on('change', '.custom-page-pagesize', function (e) {
			  var pagelimit = $(this).val();
			 $('#pagesize').val(pagelimit);
			  $('.po-form').submit();
			});
		
		$(document).on('change', '#po_area-filter', function (e) {
			var poarea = $('#po_area-filter').val();
			//$('#po_type-filter optgroup[label="M&R"]:not(option').attr('disabled',true)   ;
			$('#po_type-filter').val('');
			$('#po_subtype-filter').val('');
			$('#po_type-filter optgroup').removeAttr("disabled");
			$('#po_subtype-filter optgroup').removeAttr("disabled");
			if(poarea != ""){
				$('#po_type-filter optgroup:not(optgroup[label="'+poarea+'"])').attr('disabled',true);
			}else{
				$('#po_type-filter optgroup').removeAttr("disabled");
			}
			$('.chosen').chosen().trigger("chosen:updated");

			costFilters('c');
			});
			costFilters('l');
		
		$(document).on('change', '#po_type-filter', function (e) {
			var potype 		= $('#po_type-filter').val();
			var potypeval 	= potype.split('|');
			var potypevalue = potypeval[2];
			//$('#po_type-filter optgroup[label="M&R"]:not(option').attr('disabled',true)   ;
			$('#po_subtype-filter').val('');
			$('#po_subtype-filter optgroup').removeAttr("disabled");
			if(potypevalue != ""){
				$('#po_subtype-filter optgroup:not(optgroup[label="'+potypevalue+'"])').attr('disabled',true);
			}else{
				$('#po_subtype-filter optgroup').removeAttr("disabled");
			}
			if(potype == ""){
				$('#po_subtype-filter optgroup').removeAttr("disabled");
			}
			$('.chosen').chosen().trigger("chosen:updated");
			
		});
		/*$(document).on('change', '#po_area-filter', function (e) {
			$('.posubtype_val').html('');
			$('#tank_num,#hdn_tank_id,#hdn_tank_num').val('');
			poTypeFromArea();
			});
		
		function poTypeFromArea(){
			var area = $('#po_area-filter').val();
			var type = $('#json_type').val();
			var obj = $.parseJSON(type);
	        var opt = '<option value=""></option>';
			$.each(obj[area],function(index, data){
	    		opt += '<option value="'+index+'">'+data+'</option>';
	    		$('.potype_val').html(opt);
			});
	    	$('.chosen').chosen().trigger("chosen:updated");
		}
		$(document).on('change', '#po_type-filter', function (e) {
			$('.posubtype_val').html('');
			getSubtypeFromType();
    	});
	
		function getSubtypeFromType(){
			var type = $('#po_type-filter').val();
			var subtype = $('#json_subtype').val();
			var obj = $.parseJSON(subtype);
			var opt = '<option value=""></option>';
	  		$.each(obj[type],function(index, data){
	  			if(data != null && ' '){
			  		opt += '<option value="'+index+'">'+data+'</option>';
			  		$('.posubtype_val').html(opt);
	  			}
	  		});
	  		$('.chosen').chosen().trigger("chosen:updated");
		}*/
		
		$('.view-modal-invoice').click(function(){
			var doc_id = $(this).attr('data-doc-id')
			$('#invoice_doc_id').val(doc_id);
			$('#invoice_doc_name').val($('.doc_a_href'+doc_id).text());
		});
	
	$('.update-invoice-name').click(function(){
		
		var docname = $('#invoice_doc_name').val().trim();
		var doc_id = $('#invoice_doc_id').val();
		if(docname != ""){
			$.ajax({
				type: 'POST',
				url: appHome+'/purchase_order/common_ajax',
			    data: {
						'doc_id' : doc_id,
						'docname'  : docname,
						'action_type' : 'rename_invoice_doc',
					  },
				success: function(response){
					if(response == 'exist'){
						BootstrapDialog.show({title: 'Failed to update', message : 'Filename Already Exist.'});
					}else if(response == 'success'){
						
						var exisitngName = $('.doc_a_href'+doc_id).attr('href');
						var p = exisitngName.substr(0, exisitngName.lastIndexOf("/")+1);
						$('.doc_a_href'+doc_id).text(docname);
						$('.doc_a_href'+doc_id).attr('href', p+docname);
						$('.doc_download'+doc_id).attr('href', p+docname);
						
					}
				}
			});
		}
	});


		$(document).on('click', '.view_recharge_history', function(e){ 
			//$('.view_product').click(function(e) {
				$('.view_small_loader').show();
				$('.reset_values').html('');
				var po_recharge_id = $(this).data('id');
				
				$.ajax({ 
					type: 'POST',
					dataType: 'json',
					url: appHome+'/purchase_order/common_ajax',
					data: {
						'po_recharge_id' : po_recharge_id,
						'action_type' : 'get_po_recharge_detail'
						  },
					success: function(response){
						$('.view_small_loader').hide();
						if(response != ""){
							$('#modal_date').html(response.po_extra_cost_date);
							$('#modal_description').html(response.po_rech_comments);
							$('#modal_value').html(response.po_recharge_amt);
							$('#modal_currency').html(response.po_rech_currency);
							$('#modal_user').html(response.po_created_by);
							$('#modal_customer_code').html(response.po_rech_cust_code);
							
						}
					},
					error: function(response){
						BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
							 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
						});
					}
				});
			});
			
		$(document).on('click', '.delete-po-rech-list', function (e) {
			e.preventDefault();
			var currt = $(this);
			var recharge_id = currt.data('recharge-id');
			BootstrapDialog.show({
				type: BootstrapDialog.TYPE_DANGER,
				title: 'Confirmation',
				message: 'Are you sure want to Delete?',
				buttons: [{
					label: 'Close',
					action: function (dialogItself) {
						dialogItself.close();
					}
				}, {
					label: 'Ok',
					cssClass: 'btn-danger',
					action: function (dialogItself) {
						dialogItself.close();
						$.ajax({
							type: 'POST',
							url: appHome + '/purchase_order/common_ajax',
							data: {
								'recharge_id': recharge_id,
								'action_type': 'delete_recharge'
							},
							success: function (response) {
								currt.parents("tr").remove();
								$('#rechargemess').hide().html('<p class="alert alert-success">Purchase Order Extra Cost Deleted</p>').fadeIn();
								$('#rechargemess').delay(3000).slideUp();
								
							},
							error: function (response) {
								alert("error");

							}
						});
					}
				}]
			});
		});
		
		 $('.save-po-extra-cost,.update-po-extra-cost').click(function(e){

			    $('.highlight').removeClass('highlight');
			    e.preventDefault();
			    var form = '#'+$(this).closest('form').attr('id'),
			        success = [],
			        extra_cost_id = $('input[name="extra_cost_id"]').val(),
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
			    
			    highlight($('#extra_cost_date'), '');
			    highlight($('#extra_cost_value'), '');
			    highlight($('#extra_cost_currency'), '');
			    highlight($('#extra_cost_customer'), '');
			    
			    var check_fields = (success.indexOf(false) > -1);
			    /**
			    * update edit-extra-cost
			    */
			    if($(this).hasClass('update-po-extra-cost')){
			      if(check_fields === true){
			        $('html, body').animate({ scrollTop: 0 }, 400);
			        $('form').find('#response').empty().prepend(alert_required).fadeIn();
			      } else {
			    	 
			        $.ajax({
			          type: 'POST',
			          url: '../'+extra_cost_id+'/update_extra_cost',
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
			     * create-vgm-route
			     */
			     if($(this).hasClass('save-po-extra-cost')){
			       if(check_fields === true){
			         $('html, body').animate({ scrollTop: 0 }, 400);
			         $('form').find('#response').empty().prepend(alert_required).fadeIn();
			       } else {
			    	  
			         $.ajax({
			           type: 'POST',
			           url: appHome+'/purchase_order/addextracost',
			           data: $(form).serialize().replace(/%5B%5D/g, '[]'),
			           success: function(response){
			             window.location.href = $('#returnpath').val();
			             localStorage.setItem('response', response);
			             var bottom = $(document).height() - $(window).height();
			             $('html, body').animate({ scrollTop: bottom }, 400);
			             
			           },
			           error: function(response){
			        	 $('html, body').animate({ scrollTop: 0 }, 400);
			             $('form').find('#response').empty().prepend(alert_error).fadeIn();
			           }
			         });
			       }
			     }
			  });
		
		 //Autocomplete function to fetch the tank numbers
		 if($("#tank_num").length > 0){
			 if(($('#filtter').val() == 'inddex') && ($('#filtter').length > 0)){
			 
				 $(this).val('');
	             $('#hdn_tank_num').val('');
				 $('#hdn_tank_id').val('');
			 }
				 
				 $("#tank_num").autocomplete({
				      source:  appHome+'/purchase_order/get_tank_no_list',
				      minLength: 2,
				      type: "GET",
				      success: function (event, ui) {
				    	 
				      },
					  select: function (event, ui) {
						$(this).val(ui.item.label);
						$('#hdn_tank_num').val(ui.item.label);
						$('#hdn_tank_id').val(ui.item.value);
						return false;
					  },
					  change: function (event, ui) {
						  if(($('#job_costpage_new').val() == 'job_costpage_new') && ($('#job_costpage_new').length > 0)){
					         if (ui.item === null) {
					        	 	 BootstrapDialog.show({title: 'Error', message : 'Not a valid Tank. Please try later.',
									 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
								});
					             $(this).val('');
					             $('#hdn_tank_num').val('');
								 $('#hdn_tank_id').val('');
					         }
					         
						  }
					  }
				  });
		 }
		 if($('#po_area').val() == 'MR'){
			 if($('#po_type' != "")){
				 $("#estimated_amt").attr('readonly','readonly');
			 }
			 
			 if($('#po_type').length == 0){
				 $("#estimated_amt").removeAttr('readonly');
				 //$('.sub_list_display').hide();
			 }
		 }
		 /*$(document).on('change', '#po_type', function (e) {
			 var removeArr = new Array();
			 $('.new_row').find('#sub_est_id').each(function(){
				   
					 var cost_id = $(this).val();
					 if(cost_id != 'new'){
						 var idx = $.inArray(cost_id, removeArr);
							if (idx == -1) {
								removeArr.push( cost_id );
							}
							changeArr = $.grep(changeArr, function(value) {
								  return value != cost_id;
							});
							$('#mr_sub_delete').val(removeArr);
							$('#mr_sub_change').val(changeArr); 
					 }
						
				});
			 $('#estimated_amt').val('0.00');
			 $('.new_row').remove();
			 $('.panel_div').show();
			 $('.sub_list_display').show();
			 $(this).hide();
			 var subtypeval = getSubtypeListMR();
			 $('.sub_option').empty();
			 $('.sub_option').append(subtypeval);
	     });*/
		 
		/*if($('#po_type').val() != "" && $('#po_type').val() != undefined){
			$('.panel_div').show();
			$('.sub_list_display').show();
			$('.other-add-btn').hide();
			$('.other-add-btn').last().show();console.log($("select").hasClass("manlid_material"));
			disable_subtype();
			
		}*/
		
		$('.subtype_drop').each(function() {
			if($('#new_po').val() != 1){
			    var sel_sub = $(this).find("option:selected" ).text();
				var sub_check = sel_sub.includes("MANLID");
				if(sub_check == true){
					$(this).closest('.new_row').find('.man_material').show();
				}else{
					$(this).closest('.new_row').find('.man_material').hide();
					$(this).closest('.new_row').find('.man_material').val('');
				}
			}else{
				
				var po_subarray = ["PRESURETST","STEAMCLTST","VACUMTST","HYDROTST",
			"VISINSPTN","EIR","CALLOUT","PHOTOREQ","SINGLELFT","HAULAGE","OTGENMTC","DECREN","NUTSBOLT","SWINGBOLT","OTHPRTCST",
			"BOTVALDAM","DAMINSP","DAMRECH","OTHDAM","MANCLEAN","OTHCLEAN","GPSFIT","FULHAND","REPAINT","RENUMBER","STACKPIPE",
			"TOPDISCH","DECCHAR","OTHMODIC","PITDAM","SHLDAM","LADDAM","HANDAM"];
            if(jQuery.inArray($(this).val(), po_subarray) !== -1){
            	//$(this).closest('.new_row').find('.specific_detail').prop('disabled', 'disabled');
            	$(this).closest('.new_row').find('.specific_detail').css('pointer-events', 'none');
            	$(this).closest('.new_row').find('.specific_detail').css('background-color', '#eee');
            }else{
            	//$(this).closest('.new_row').find('.specific_detail').prop('disabled', false);
            	$(this).closest('.new_row').find('.specific_detail').css('pointer-events', 'auto');
            	$(this).closest('.new_row').find('.specific_detail').css('background-color', '#fff');
            }
				var subarray = ["SWINGBOLT","MANCLEAN","CLADDING"];
		            if(jQuery.inArray($(this).val(), subarray) !== -1){
		            	$(this).closest('.new_row').find('.sub_quantity').val('');
		            	$(this).closest('.new_row').find('.sub_quantity').show();
		            	$(this).closest('.new_row').find($(".subs_quantity option")).prop("disabled", false);
		            	if($(this).val() == "SWINGBOLT"){
		            		$(this).closest('.new_row').find($(".subs_quantity option[value='9'],.subs_quantity option[value='10']")).attr("disabled","disabled");
		            	}else if($(this).val() == "MANCLEAN"){
		            		$(this).closest('.new_row').find($(".subs_quantity option[value='6'],.subs_quantity option[value='7'],.subs_quantity option[value='8'],.subs_quantity option[value='9'],.subs_quantity option[value='10']")).attr("disabled","disabled");
		            	}
		            	
					}else{
						$(this).closest('.new_row').find('.sub_quantity').hide();
						$(this).closest('.new_row').find('.sub_quantity').val('');
					}

			}
		});



		$('.specific_detail').each(function() {
			 var subarray = ["PTFE3","PTFE5","STT3","STT5","BFVALGASK","BFVALSEAL"];
			 
	            if(jQuery.inArray($(this).val(), subarray) !== -1){
	            	$(this).closest('.new_row').find('.spec_quantity').show();
	            	 $(this).closest('.new_row').find($(".specific_quantity option")).prop("disabled", false);
	            	if(($(this).val() == "BFVALGASK") || ($(this).val() == "BFVALSEAL")){
	            		$(this).closest('.new_row').find($(".specific_quantity option[value='3'],.specific_quantity option[value='4'],.specific_quantity option[value='5']")).attr("disabled","disabled");
	            	}
	            	
				}else{
					$(this).closest('.new_row').find('.spec_quantity').hide();
					$(this).closest('.new_row').find('.specific_quantity').val('');
				}
		});
			/*function getSubtypeFromType(){
				var type = $('#po_type').val();
				var subtype = $('#json_subtype').val();
				var obj = $.parseJSON(subtype);
				var opt = '<option value=""></option>';
				
			    if(type in obj){
			  		$.each(obj[type],function(index, data){
			  			if(data != null && ' '){
					  		opt += '<option value="'+index+'">'+data+'</option>';
			  			}
			  		});
			    }
			    $('.posubtype_value').html(opt);
		  		$('.chosen').chosen().trigger("chosen:updated");
			}*/
		
			$('.other-add-btn').live('click',function(){
				$('.panel_div').show();
				$('.panel_div').show();
				$('.sub_list_display').show();
				$(this).hide();
				if($('#new_po').val() == 1){
					var subtypeval = getCostSubtypeList();
				}else{
					var subtypeval = getSubtypeListMR();
				}
				$('.sub_option').append(subtypeval);
				
				disable_subtype();
				$(".sub_list_display").animate({
			        scrollTop: $(".sub_list_display").offset().top},
			        'slow');
				hideMinusButtonSingle();
			});
			
			function getSubtypeListMR(){
				var type = $('#po_type').val();
				var subtype = $('#json_subtype').val();
				var obj = $.parseJSON(subtype);
				var stype = $('#json_type').val();
				var typeobj = $.parseJSON(stype);
				
				var opt = '<div class="form-group new_row">'
   		         
   		         
		         
		         +'<div class="col-sm-1 col-md-1">'
		         +'<input id="sub_est_id" name="sub_est_id[]" type="hidden" value="new" />'
		         +' <select name="stype[]" class="form-control stype com_type" placeholder="Please select">';
				
				opt += '<option value="">Please select</option>';
			    
			  		$.each(typeobj,function(index, data){
			  			if(data != null && ' '){
					  		opt += '<option value="'+index+'"';
					  		if(index == type){
					  			opt += 'selected';
					  		}
					  		opt += '>'+data+'</option>';
			  			}
			  		});
			    
			    opt += '</select>'
			    +'</div>'
		         +'<div class="col-sm-2 col-md-2">'
		         +' <select name="sub_subtype[]" class="form-control subtype_drop com_sub" placeholder="Please select">';
				
				opt += '<option value="">Please select</option>';
			    if(type in obj){
			  		$.each(obj[type],function(index, data){
			  			if(data != null && ' '){
					  		opt += '<option value="'+index+'">'+data+'</option>';
			  			}
			  		});
			    }
			    opt += '</select>'
			    	
			    	+'<select name="manlid_material[]" class="form-control man_material" style="display: none;">'
			    	+'<option value="">Please select</option>'
			    	+'<option value="PTFE">PTFE</option>'
			    	+'<option value="Tanktype(SST)">Tanktype (SST)</option>'
			    	+'</select>'
			    	+'</div>'
			    	+'<div class="col-sm-2 col-md-2">'
			    	+'<input id="recom_price_id" name="recom_price_id[]" class="form-control" type="hidden" maxlength="7" />'
			    	+'<input id="recommended_cost" name="recommended_cost[]" class="form-control sty" type="text" placeholder ="Cost" maxlength="7" autocomplete="on" onkeypress="return NumberValues(this,event);" readonly/>'
			        +'</div>'
			    	+'<div class="col-sm-2 col-md-2">'
			    	+'<input id="sub_est_amt" name="sub_est_amt[]" class="form-control cal_sub_est_amount com_est sty" type="text" placeholder ="Cost" maxlength="7" autocomplete="on" onkeypress="return NumberValues(this,event);" />'
			        +'</div>'
			    	+'<div class="col-sm-2 col-md-2">'
			    	+'<input id="sub_act_amt" name="sub_act_amt[]" class="form-control cal_act_amount sty" type="text" placeholder ="Cost" maxlength="7" autocomplete="on" onkeypress="return NumberValues(this,event);" />'
			        +'</div>'
			    	+'<div class="col-sm-2 col-md-2">'
			        +'<input id="sub_comt" name="sub_comt[]" class="form-control" type="text" placeholder ="Comments" maxlength="40"/>'
			        +'</div>'
			    	+'<div class="col-sm-1 col-md-1">'
			    	+'<a class="btn btn-success other-add-btn" ><span class="glyphicon glyphicon-plus-sign"></span></a> '
			    	+'<a class="btn btn-danger other-sub-btn cal_dif_est_amount"><span class="glyphicon glyphicon-minus-sign"></span></a>'
			    	+'</div>'
			    	+'</div>';
			    return opt;
			}

			function getCostSubtypeList(){
				var type = $('#cost_type').val();
				var subtype = $('#json_cost_subtype').val();
				var obj = $.parseJSON(subtype);
				var stype = $('#json_cost_type').val();
				var typeobj = $.parseJSON(stype);
				
				var opt = '<div class="form-group new_row">'
		         +'<div class="col-sm-2 col-md-2">'
		         +'<input id="sub_est_id" name="sub_est_id[]" type="hidden" value="new" />'
		         +' <select name="stype[]" class="form-control stype com_type" placeholder="Please select">';
				
				opt += '<option value="">Please select</option>';
			    
			  		$.each(typeobj,function(index, data){
			  			if(data != null && ' '){
					  		opt += '<option value="'+index+'"';
					  		if(index == type){
					  			opt += 'selected';
					  		}
					  		opt += '>'+data+'</option>';
			  			}
			  		});
			    
			    opt += '</select>'
			    +'</div>'
		         +'<div class="col-sm-2 col-md-2">'
		         +' <select name="sub_subtype[]" class="form-control subtype_drop com_sub" placeholder="Please select">';
				
				opt += '<option value="">Please select</option>';
			    if(type in obj){
			  		$.each(obj[type],function(index, data){
			  			if(data != null && ' '){
					  		opt += '<option value="'+index+'">'+data+'</option>';
			  			}
			  		});
			    }
			    opt += '</select>'
			    		+'<div class="sub_quantity" style="display: none;">'
                              +'<label class="text-center">Qty</label>'
                              +'<select name="sub_quantity[]" class="form-control subs_quantity" placeholder="Please select">'
                                +'<option value="1" >1</option>'
                                +'<option value="2">2</option>'
                                +'<option value="3">3</option>'
                                +'<option value="4">4</option>'
                                +'<option value="5">5</option>'
                                +'<option value="6">6</option>'
                                +'<option value="7">7</option>'
                                +'<option value="8">8</option>'
                                +'<option value="9">9</option>'
                                +'<option value="10">10</option>'
                              +'</select>'
                        +'</div>'
			    	+'</div>'
			         +'<div class="col-sm-2 col-md-2">'
			         +' <select name="specific_detail[]" class="form-control specific_detail" placeholder="Please select">';
					
					opt += '<option value="">Please select</option>';
				    opt += '</select>'
				    	+'<div class="spec_quantity" style="display: none;">'
                              +'<label class="text-center">Qty</label>'
                              +'<select name="specific_quantity[]" class="form-control specific_quantity" placeholder="Please select">'
                                +'<option value="1" >1</option>'
                                +'<option value="2">2</option>'
                                +'<option value="3">3</option>'
                                +'<option value="4">4</option>'
                                +'<option value="5">5</option>'
                              +'</select>'
                        +'</div>'
			    	+'</div>'
			    	+'<div class="col-sm-1 col-md-1">'
			    	+'<input id="recom_price_id" name="recom_price_id[]" class="form-control" type="hidden" maxlength="7" />'
			    	+'<input id="recommended_cost" name="recommended_cost[]" class="form-control sty" type="text" placeholder ="Cost" maxlength="7" autocomplete="on" onkeypress="return NumberValues(this,event);" readonly/>'
			        +'</div>'
			    	+'<div class="col-sm-1 col-md-1">'
			    	+'<input id="sub_est_amt" name="sub_est_amt[]" class="form-control cal_sub_est_amount com_est sty" type="text" placeholder ="Cost" maxlength="7" autocomplete="on" onkeypress="return NumberValues(this,event);" />'
			        +'</div>'
			    	+'<div class="col-sm-1 col-md-1">'
			    	+'<input id="sub_act_amt" name="sub_act_amt[]" class="form-control cal_act_amount sty" type="text" placeholder ="Cost" maxlength="7" autocomplete="on" onkeypress="return NumberValues(this,event);" />'
			        +'</div>'
			    	+'<div class="col-sm-2 col-md-2">'
			        +'<input id="sub_comt" name="sub_comt[]" class="form-control" type="text" placeholder ="Comments" maxlength="40"/>'
			        +'</div>'
			    	+'<div class="col-sm-1 col-md-1">'
			    	+'<a class="btn btn-success other-add-btn" ><span class="glyphicon glyphicon-plus-sign"></span></a> '
			    	+'<a class="btn btn-danger other-sub-btn cal_dif_est_amount"><span class="glyphicon glyphicon-minus-sign"></span></a>'
			    	+'</div>'
			    	+'</div>';
			    return opt;
			}
			
			function getSubFromType(){
				var type = $('#po_type').val();
				var subtype = $('#json_subtype').val();
				var obj = $.parseJSON(subtype);
				var opt = '<option value="">Please select</option>';
			    if(type in obj){
			  		$.each(obj[type],function(index, data){
			  			if(data != null && ' '){
					  		opt += '<option value="'+index+'">'+data+'</option>';
			  			}
			  		});
			    }
			    return opt;
			}

			function getCostSubFromType(){
				var type = $('#cost_type').val();
				var subtype = $('#json_cost_subtype').val();
				var obj = $.parseJSON(subtype);
				var opt = '<option value="">Please select</option>';
			    if(type in obj){
			  		$.each(obj[type],function(index, data){
			  			if(data != null && ' '){
					  		opt += '<option value="'+index+'">'+data+'</option>';
			  			}
			  		});
			    }
			    return opt;
			}

			function getCostSpecific(){
				var type = $('#cost_sub_type').val();
				var subtype = $('#json_cost_specific').val();
				var obj = $.parseJSON(subtype);
				var opt = '<option value="">Please select</option>';
			    if(type in obj){
			  		$.each(obj[type],function(index, data){
			  			if(data != null && ' '){
					  		opt += '<option value="'+index+'">'+data+'</option>';
			  			}
			  		});
			    }
			    return opt;
			}
			$('.other-sub-btn').live('click',function(){
				if($('.other-sub-btn').length > 1){
					$(this).parents('div').eq(1).remove();
					$('.other-add-btn').last().show();
					disable_subtype();
					hideMinusButtonSingle();
				}
				
			});
			hideMinusButtonSingle();
			//Function to hide the minus button when single plus button is present
			function hideMinusButtonSingle(){
				if($('.other-add-btn').length == 1){
					$('.other-sub-btn').hide();
				}else{
					$('.other-sub-btn').show();
				}
			}
			
			$('.cal_sub_est_amount').live('change',function(){
				var sum_est = calculate_estmate_total();
				$('#estimated_amt').val(sum_est);
			});
			
			$('.cal_act_amount').live('change',function(){
				var sum_act = calculate_acual_total();
				$('#actual_amount').val(sum_act);
			});
			if($('#po_area').val() == "MR"){
				$('.cal_sub_est_amount,.cal_act_amount,.actul_amount').live('change',function(){
					actual_estimate_amount_equal();
				});
			}
			
			$('.stype').live('change',function(){
				if($('#new_po').val() == 1){
					$('#cost_type').val($(this).val());
					var subtypeval = getCostSubFromType();
					$(this).closest('.new_row').find('.subtype_drop').empty();
					$(this).closest('.new_row').find('.specific_detail').empty();
					$(this).closest('.new_row').find('.subtype_drop').append(subtypeval);
					//disable_subtype();
					$(this).closest('.new_row').find('.sub_quantity').hide();
					$(this).closest('.new_row').find('.sub_quantity').val('');

					var selected_values = new Array();
					$(".stype option:selected").each(function(){
					var tmpval = 0;
					tmpval = $(this).val();
					if(tmpval != ""){
						selected_values.push(tmpval);
					}
					});
					//var idx = $.inArray('CLEANING', selected_values);
					
					if(($('#tank_num').val() != "") && (jQuery.inArray("CLEANING", selected_values) !== -1)){
						$('.prodresp').show();
						$.ajax({
						        type: 'POST',
						        url: appHome+'/purchase_order/common_ajax',
						        data: {
						          'tankid'		: $('#hdn_tank_id').val(),
						          'action_type' : 'get_product_name'
						        },
						       
						        success: function(response){
						        	var obj = $.parseJSON(response);
						        	var opt = '<option value="">Unknown</option>';
						        		$.each(obj,function(index, data){ //console.log(index, data);
						        		opt += '<option value="'+data.id+'">'+data.name+'</option>';
						        		});
						        			$('#prod_response').html(opt);
						        		
						        	$('.chosen').chosen().trigger("chosen:updated");
						        	
						        },
						        error: function(response){
						          $('html, body').animate({ scrollTop: 0 }, 400);
						          $('form').find('#response').empty().prepend(alert_error).fadeIn();
						        }
						      });
					}else{
						$('.prodresp').hide();
						var opt = '<option value="">Unknown</option>';
						$('#prod_response').html(opt);
						$('.chosen').chosen().trigger("chosen:updated");
					}
					
				}else{
					$('#po_type').val($(this).val());
					var subtypeval = getSubFromType();
					$(this).closest('.new_row').find('.subtype_drop').empty();
					$(this).closest('.new_row').find('.subtype_drop').append(subtypeval);
					disable_subtype();
				}	
				
			});
			
			if($('#sub_est_id').val() == "" || $('#sub_est_id').val() == undefined){
				 $('.panel_div').hide();
			 }
			
			$(document).on('click', '.cal_dif_est_amount', function(e){ 
				var sum_est = calculate_estmate_total();
				$('#estimated_amt').val(sum_est);
				var sum_act = calculate_acual_total();
				$('#actual_amount').val(sum_act);
			});
			
			if(($('#form_type').val() == 'edit') || ($('#form_type').val() == 'duplicate')){
				if($('#new_po').val() != 1){
					disable_subtype();
				}
				
				$('.other-add-btn').hide();
				$('.other-add-btn').last().show();
				var changeArr = new Array();
				$('.comm_sub_cls').live('change',function(){
					var cost_id = $(this).attr("data-costid");
					var idx = $.inArray(cost_id, changeArr);
					if (idx == -1) {
						changeArr.push( cost_id );
					}
					$('#mr_sub_change').val(changeArr);
				});
				
				var removeArr = new Array();
				$('.remove_edit').live('click',function(){
					var cost_id = $(this).attr("data-costid");
					var idx = $.inArray(cost_id, removeArr);
					if (idx == -1) {
						removeArr.push( cost_id );
					}
					changeArr = $.grep(changeArr, function(value) {
						  return value != cost_id;
					});
					$('#mr_sub_delete').val(removeArr);
					$('#mr_sub_change').val(changeArr);
				});
			}
			
		//Function to calculate the total estimate amount
			function calculate_estmate_total(){
				var sub_val = new Array();
				var sub_val_total = 0;
				$('input[name="sub_est_amt[]"]').each(function(){
					var tmpval = 0;
					tmpval = $(this).val();
					if($.trim(tmpval) == ""){ tmpval = 0; } else {tmpval = parseFloat(tmpval).toFixed(2);}
					sub_val.push(tmpval);
				});
				for (i = 0; i < sub_val.length; i++) {
					if (sub_val[i] != 0)
						{
						sub_val_total += parseFloat(sub_val[i]);
						}
				}
				return sub_val_total.toFixed(2);
			}
			
			//Function to calculate the total actual amount
			function calculate_acual_total(){
				var act_val = new Array();
				var act_val_total = 0;
				$('input[name="sub_act_amt[]"]').each(function(){
					var tmpval = 0;
					tmpval = $(this).val();
					if($.trim(tmpval) == ""){ tmpval = 0; } else {tmpval = parseFloat(tmpval).toFixed(2);}
					act_val.push(tmpval);
				});
				for (i = 0; i < act_val.length; i++) {
					if (act_val[i] != 0)
						{
						act_val_total += parseFloat(act_val[i]);
						}
				}
				return act_val_total.toFixed(2);
			}
			
			//Function to check whether the actual and estimate amount are equal
			function actual_estimate_amount_equal(){
				var est_amt = parseFloat($('#estimated_amt').val());
				var act_amt = parseFloat($('#actual_amount').val());
				if(est_amt == act_amt && act_amt != 0){
					BootstrapDialog.show({
						type: BootstrapDialog.TYPE_DANGER,
						title: 'Confirmation',
						message: 'Do you want to paste the "Cost To Estimate" to "Cost To Actual" ?',
						buttons: [{
							label: 'NO',
							action: function (dialogItself) {
								dialogItself.close();
							}
						}, {
							label: 'YES',
							cssClass: 'btn-danger',
							action: function (dialogItself) {
								dialogItself.close();
								var i = 0;
								$('input[name="sub_est_amt[]"]').each(function(){
									var tmpval = 0;
									tmpval = $(this).val();
									
									$('input[name="sub_act_amt[]"]').eq(i).val(tmpval);
									i++;
								});
								
							}
						}]
					});
				}
			}
			$('.subtype_drop').live('change',function(){
				if($('#new_po').val() == 1){
					$('#cost_sub_type').val($(this).val());
					var subtypeval = getCostSpecific();
					$(this).closest('.new_row').find('.specific_detail').empty();
					$(this).closest('.new_row').find('.specific_detail').append(subtypeval);
					//disable_subtype();
					
					$(this).closest('.new_row').find('.spec_quantity').hide();
					$(this).closest('.new_row').find('.specific_quantity').val('');
					var subarray = ["SWINGBOLT","MANCLEAN","CLADDING"];
		            if(jQuery.inArray($(this).val(), subarray) !== -1){
		            	$(this).closest('.new_row').find('.sub_quantity').val('');
		            	$(this).closest('.new_row').find('.sub_quantity').show();
		            	 $(this).closest('.new_row').find($(".subs_quantity option")).prop("disabled", false);
		            	if($(this).val() == "SWINGBOLT"){
		            		$(this).closest('.new_row').find($(".subs_quantity option[value='9'],.subs_quantity option[value='10']")).attr("disabled","disabled");
		            	}else if($(this).val() == "MANCLEAN"){
		            		$(this).closest('.new_row').find($(".subs_quantity option[value='6'],.subs_quantity option[value='7'],.subs_quantity option[value='8'],.subs_quantity option[value='9'],.subs_quantity option[value='10']")).attr("disabled","disabled");
		            		$(this).closest('.new_row').find('#recommended_cost').attr('data-recost',0);
		            	}
		            	
					}else{
						$(this).closest('.new_row').find('.sub_quantity').hide();
						$(this).closest('.new_row').find('.sub_quantity').val('');
					}
				}else{
					var sel_sub = $(this).find("option:selected" ).text();
					var sub_check = sel_sub.includes("MANLID");
					if(sub_check == true){
						$(this).closest('.new_row').find('.man_material').show();
					}else{
						$(this).closest('.new_row').find('.man_material').hide();
						$(this).closest('.new_row').find('.man_material').val('');
					}
					disable_subtype();
				}
				
			});
			
			//Disable selected values of drop down
			function disable_subtype(){
				var selected_values = new Array();
				var full_values = new Array();
				/*if($('#new_po').val() == 1){
					$(".specific_detail option:selected").each(function(){
					var tmpval = 0;
					tmpval = $(this).val();
					if(tmpval != ""){
						selected_values.push(tmpval);
					}
				});
				
					$(".specific_detail").each(function(){
						var cur_sel_val = $(this).find("option:selected").val();
						for (i = 0; i < selected_values.length; i++) {
							if (selected_values[i] != cur_sel_val){
								$(this).find("option[value='"+selected_values[i]+"']").prop('disabled',true);
							}
						}
					});
				}else{*/
				if($('#new_po').val() != 1){
					$(".subtype_drop option:selected").each(function(){
					var tmpval = 0;
					tmpval = $(this).val();
					if(tmpval != ""){
						selected_values.push(tmpval);
					}
				});
				
					$(".subtype_drop").each(function(){
						var cur_sel_val = $(this).find("option:selected").val();
						for (i = 0; i < selected_values.length; i++) {
							if (selected_values[i] != cur_sel_val){
								$(this).find("option[value='"+selected_values[i]+"']").prop('disabled',true);
							}
						}
					});
				}
				//}
				
				
			}
			
			$(document).on('change', '#supplier', function(e){
				
				if($('#supplier').val() == ""){
					/*$("#currency").prop('disabled',false).trigger('chosen:updated');
					$("#actual_currency").prop('disabled',false).trigger('chosen:updated');*/
					
				}else{
					getSuppCurrency();//To get the currency of supplier
					if($('#po_area').val() == "MR"){
						getRecomentedCost();//To get the multiple recommented cost in po costing
						getListBySupplier();

					}
				}
			});
			
			//changes related to sorting
			if($('#sort').length > 0 && $('#sort').val() != ''){
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
				/*$('html, body').animate({
			        'scrollTop' : $("#doublescroll").position().top
			    });*/
			}
			
			//Autocomplete function to fetch the tank numbers
			 if($("#equipment_num").length > 0){
				
				 $("#equipment_num").autocomplete({
				      source:  appHome+'/purchase_order/get_equipment_no_list',
				      minLength: 2,
				      type: "GET",
				      success: function (event, ui) {
				    	 
				      },
					  select: function (event, ui) {
						$(this).val(ui.item.label);
						//$('#hdn_tank_num').val(ui.item.label);
						//$('#hdn_tank_id').val(ui.item.value);
						return false;
					  },
					  change: function (event, ui) {
				         if (ui.item === null) {
				        	 	 BootstrapDialog.show({title: 'Error', message : 'Not a valid Equipment Number. Please try later.',
								 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
							});
				             $(this).val('');
				             //$('#hdn_tank_num').val('');
							 //$('#hdn_tank_id').val('');
				         }
					  }
				  });
			}
			 if(($('#po_vat_type').val() == 'VAT') && ($('#form_type').val() == 'add')){
			    	var currency_name = $('#sub_curreny_vat').val();
			    	switch_specific_currency_icons(currency_name,'foreign-currency-change');
			 }
			 if(($('#po_vat_type').val() == "VAT") && (($('#invoice_date').val() != "") || ($('#paste_supplier_invoice').data('supplier-inv-date') != undefined))){
				 //$("#foreign_currency").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
				 $(document).on('change', '#actual_amount', function(e){
					 $actual_amt = $(this).val();
					 var foreignCur = $('#foreign_currency').val().toLowerCase();
					 if(($('#exchange_rates').val() == '') || ($('#exchange_rates').val() == 'null')){
						BootstrapDialog.show({
					        type: BootstrapDialog.TYPE_DANGER,
					        title: 'Warning',
					        message: "Foreign amount conversion can't happen as the exchange rate not available at the provided invoice date",
					        buttons: [{
							             label: 'Close',
							             action: function(dialogItself){
							                 dialogItself.close();
							             }
							         }]
						});
					 }else{
					 var obj 		= JSON.parse($('#exchange_rates').val());
					 Object.keys(obj).forEach(function(key) {
						 if(key  == foreignCur){
						  var rate        = obj[key];
						  var rate_total  = $actual_amt * rate;
						  var rate_amount = rate_total.toFixed(2);
						  $('#foreign_amount').val(rate_amount);
						  }
						});
					}
				 });
			 }
			 
			 function DoubleScroll(element) {
			        var scrollbar= document.createElement('div');
			        scrollbar.appendChild(document.createElement('div'));
			        scrollbar.style.overflow= 'auto';
			        scrollbar.style.overflowY= 'hidden';
			        scrollbar.firstChild.style.width= element.scrollWidth+'px';
			        scrollbar.firstChild.style.paddingTop= '1px';
			        scrollbar.firstChild.appendChild(document.createTextNode('\xA0'));
			        scrollbar.onscroll= function() {
			            element.scrollLeft= scrollbar.scrollLeft;
			        };
			        element.onscroll= function() {
			            scrollbar.scrollLeft= element.scrollLeft;
			        };
			        element.parentNode.insertBefore(scrollbar, element);
			    }
				if($('#bor_table tr').length > 10){
					DoubleScroll(document.getElementById('doublescroll'));
				} 
	});//end of document ready

	$(document).on('click', '.unlik-job-cost', function(e){ 
		
		var jc_id = $(this).attr('data-jobcostid');
		
		BootstrapDialog.show({
	         type: BootstrapDialog.TYPE_DANGER,
	         title: 'Confirmation',
	         message: 'Are you sure want to Un-link this cost?',
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
		            			url: appHome+'/purchase_order/common_ajax',
		            			data: {
		            				'action_type' : 'unlink_cost_from_job',
		            				'jc_id' : jc_id
		            				  },
		            			success: function(response){
		            					$('.unlik-job-cost[data-jobcostid="'+jc_id+'"]').parents('tr').fadeOut(500, function() {
		            						$('.unlik-job-cost[data-jobcostid="'+jc_id+'"]').parents('tr').remove();
		            					});
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

	$(document).on('click', '.checkmail', function(e){ 
		if($('.checkmail').is(":checked")){
			$('#view_selected_email').removeAttr('disabled');
		}else{
			$('#view_selected_email').attr('disabled','disabled');
		}
	});
	$(document).on('click', '.delete_document', function(e){ 
		var doc_id = $(this).data('id');
		var doc_type = $(this).data('type');

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
	            			url: appHome+'/purchase_order/common_ajax',
	            			data: {
	            				'doc_id' : doc_id,
	            				'action_type' : 'delete_document',
	            				'document_type' : doc_type
	            				  },
	            			success: function(response){
	            				if(doc_type == 'cust-invoice'){
	            					$('.delete_document[data-id="'+doc_id+'"]').parents('tr').fadeOut(500, function() {
	            						$('.delete_document[data-id="'+doc_id+'"]').parents('tr').remove();
	            					});
	            				}else{
	            					var purchase_id = $('#file_upload_prod_id').val();
		            				uploadList(purchase_id);
	            				}
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





function uploadList(purchase_id){
	
	$('.loadershow').show();
	$formType = $('#form_type').val();
	$('#fileSize,#fileType').html('');
	$("#upload_btn").attr('disabled',true);
	$('#upload-progress-bar').css('width','0%');
	$('#upload-progress-bar').data('aria-valuenow','0');
	$('#upload-progress-bar').html('');
	$('.highlight').removeClass('highlight');
	var po_id = $('#cur_po_id').val();
	var page_identify = $('#po_main_page').val();
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: appHome+'/purchase_order/common_ajax',
		beforeSend: function() {
            // setting a timeout
        	},
		data: {
			'purchase_id' : purchase_id,
			'po_id'	: po_id,
			'page_identify' : page_identify,
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
			if(page_identify == 'po_costpage' && $('#upload_btn').length == 0){
				del_class = '';
				mousepointer = "cursor: not-allowed;color:#e9a3a3;";
			}
			tddata = "";
			if ( response.length > 0 ) {
				$.each(response, function(i, item) {
					tddata += '<tr>'+
								'<td><a target="_blank" href="'+item.prePath+'">'+item.filePath+'</a></td>'+
								'<td class="text-left" >'+item.docs_description+'</td>'+
								
								'<td class="text-left" >'+item.docDate+'</td>';
					if($formType == 1){
						tddata += '<td class="text-center" ><input type="checkbox" class="checkmail" name="files" value="'+item.filePath+'"></td>';
					}
					tddata +=	'<td class="text-center" ><a target="_blank" title="Download Document" href="'+item.filePath+'"><i class="fa fa-download"></i></a></td>'+
								'<td class="text-center" ><a style="'+mousepointer+'" class="'+del_class+'" data-id="'+item.docs_id+'" href="javascript:void(0);" title="Delete Document"><i class="fa fa-trash-o"></i></a></td>'+								
							 '</tr>';
				});
				if($formType == 1){
					tddata +='<tr>'+
					 '<td colspan="3">&nbsp;</td>'+
					 '<td class="text-center" colspan="3" style="white-space:nowrap"><a class="view_selected_email btn btn-primary" id="view_selected_email" href="" title="Email selected files" data-id="'+purchase_id+'" data-toggle="modal" data-target="#product_view_modal" disabled><i class="fa fa-mail-forward"></i> Email selected files</td>'+
					 '</tr>';
				}
			}else{
				tddata +='<tr id="emptyFilesTr" class="">'+
							'<td style="text-align:center;" colspan="6"><p class="alert alert-warning" style="margin-bottom:0;">No files found.</p></td>'+
						 '</tr>';
			}
			$('#PurchaseFileAttachment').html(tddata);
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
			fd.append("purchase_id", $('#file_upload_prod_id').val());
			fd.append("new_file_type", $('#doctype').val());
			fd.append("new_file_name", $('#fileName').val());
			fd.append("new_po_id", $('#cur_po_id').val());
			fd.append("new_file_discription", $('#fileDesc').val());
			fd.append("new_page_id", $('#po_main_page').val());
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
	var purchase_id = $('#file_upload_prod_id').val();
	$("#upload_btn").attr('disabled',true);
	setTimeout( function(){
				  uploadList(purchase_id);
				  $('#progress_num_uf').hide();
			  }, 1000);
}
$( document ).ready(function() {
	var page_identify = $('#po_main_page').val();
	if(page_identify == "main_page" || page_identify == "po_costpage"){
		uploadList($('#file_upload_prod_id').val());
	}
	/*if($('#supplier').val() == 'TBC'){
		$("#currency").prop('disabled',false).trigger('chosen:updated');
		$("#actual_currency").prop('disabled',false).trigger('chosen:updated');
	}*/

});
$('#actual_currency').on('change', function() {
	  var currency_id = $(this).chosen().val(); 
	  matchSupplierCurr();
});
function matchSupplierCurr(){
	  if(($('#supplier-currency').val() != "") && ($('#actual_currency').val() != "") && ($('#supplier-currency').val() != $('#actual_currency').val())){
		  $('.supplier-paste-curr').html('<strong>WARNING!</strong> Invoice currency different to Supplier currency');
	  }else{
		  $('.supplier-paste-curr').html('');
	  }
}
$('#estimated_amt,#actual_amount,#foreign_amount').on('click', function() {
	if($(this).val() == '0.00'){	
		$(this).val('');
	}
});
$('#extra_cost_currency').on('change', function() {
	  var currency_id = $(this).chosen().val();
	  fillCustomerByCurrencyChange();
	  
});
/**
 * function for fill recharge currency
 */
function fillCustomerByCurrencyChange(){
	  var currency = $('#extra_cost_currency').val();
	  if(currency != ""){
	  $.ajax({
	        type: 'POST',
	        url: appHome+'/purchase_order/common_ajax',
	        data: {
	          'currency'	: currency,
	          'action_type' : 'get_customers_by_currency',
	        },
		    beforeSend: function() {
		    	$('<i class="fa fa-spinner fa-spin"></i>').insertAfter($('#extra_cost_customer').parent());
		     },
	        success: function(response){
	        	$('#extra_cost_customer').html(response).chosen().trigger("chosen:updated");;
	        	$('.fa-spinner').remove();
	        }
	      });
	  }
}

/*
* Calculate taotal amount
*/
function getTotalAmount(){
	var formData = $('.po-form').serialize();
	 $.ajax({
	        type: 'POST',
	        timeout: 90000, //90 sec
	        url: appHome+'/purchase_order/common_ajax',
	        data: {
	      	  'action_type' : 'get_total_amount',
	      	  'formData' : formData,
	      	  'is_live' : 'live',
	      	},
	       beforeSend: function() {
	    	   $('.full_loadrow').show();
	    	   $('.average-rate,.average-target-rate').html('');
	    	   $('#total_div').attr("data-issendajax",1);
	        },
	        success: function(response){
	        	var jsonObj = JSON.parse(response);
	        	//$('.total-count').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" >'+jsonObj.count+'</span>');
	        	$('.estimate-total').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" ><i class="fa fa-'+jsonObj.currency.toLowerCase()+'"></i> '+(jsonObj.estimate_total).toFixed(2)+'</span>');
	        	$('.actual-total').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" ><i class="fa fa-'+jsonObj.currency.toLowerCase()+'"></i> '+(jsonObj.actual_total).toFixed(2)+'</span>');
	        	$('.recovered-total').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" ><i class="fa fa-'+jsonObj.currency.toLowerCase()+'"></i> '+(jsonObj.recovered_total).toFixed(2)+'</span>');
	        	$('.net-total').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" ><i class="fa fa-'+jsonObj.currency.toLowerCase()+'"></i> '+(jsonObj.net_total).toFixed(2)+'</span>');
	        	if(jsonObj.subtype_curr != ""){
	        		$('.foreign-total').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" >'+jsonObj.subtype_curr+' '+(jsonObj.foreign_total).toFixed(2)+'</span>');
	        	}
	        	$('.full_loadrow').hide();
	        },
	        error: function(response){
	        }
	  });
}

/*if(($('#form_type').val() == 'edit') || ($('#form_type').val() == 'duplicate')){
	$("#currency").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
	$("#actual_currency").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
}*/
/*
 * Get currency from Supplier
 */
function getSuppCurrency(){
	var supp = $('#supplier').val();
	 $.ajax({
	        type: 'POST',
	        url: appHome+'/purchase_order/common_ajax',
	        data: {
	      	  'action_type' : 'get_supp_currency',
	      	  'supp' 		: supp,
	      	},
	        success: function(response){
	        	$('#currency').val(response).chosen().trigger("chosen:updated");
	        	$('#currency').trigger("change");
	        	$('#actual_currency').val(response).chosen().trigger("chosen:updated");
	        	$('#actual_currency').trigger("change");
	        	/*$("#currency").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
	        	$("#actual_currency").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
	        	if(supp == 'TBC'){
					$("#currency").prop('disabled',false).trigger('chosen:updated');
					$("#actual_currency").prop('disabled',false).trigger('chosen:updated');
				}*/
	        	if(($('#po_vat_type').val() == "VAT") && ($('#invoice_date').val() != "")){
					getExchangeRateByDate();//To get the exchange rate accourding to the supplier invoice date 
				}
	        }
	  });
}

$(document).on('click', '.sortClass', function(e) {
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
		$('.po-form').submit();
	}
});

$(document).on('click', '.supplier-amount-change', function(e) {
	$('.td-supplier').html($(this).attr("data-supplier"));
	$('.td-estamt').html($(this).attr("data-estamt"));
	$('#po-actual-amt').val($(this).attr("data-actamt"));
	$('#selected-invno').val($(this).attr('data-invno'));
	$('#selected-invdate').val($(this).attr('data-invdate'));
	$('#selected-invid').val($(this).attr('data-invid'));
	$('#selected-supplier').val($(this).attr('data-supplier'));
	$('#selected-id').val($(this).attr('data-id'));
	$('#selected-actamt').val($(this).attr('data-actamt'));
	$('#selected-poid').val($(this).attr('data-poid'));
	$('#selected-curr').val($(this).attr('data-curr'));
	$('#selected-actamt-curr').val($(this).attr('data-actamt-curr'));
	$('#booking-date').val($(this).attr('data-supplier-inv-bookingdate'));
});

$(document).on('click','.po_cost_edit', function(e){
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

$('.jc_move_close').click(function(){ 
	  location.reload();
});

$('#number-search').change(function(){
    $('#number-search-btn').removeAttr('disabled');
});

$('#po-actual-amt').keyup(function(){
	var actamt = $('#po-actual-amt').val();
	var selamt = $('#selected-actamt').val();
	actamt = actamt.replace(/,/g,"");
	selamt = selamt.replace(/,/g,"");
	if(parseInt(actamt) >  parseInt(selamt) ) {
		 BootstrapDialog.show({title: 'Warning', message : 'The Actual Amount could not be greater than the existing amount  '+$('#selected-actamt').val()  });
		  $('#po-actual-amt').focus(); 
		  $('#po-actual-amt').val($('#selected-actamt').val());
	}
});

$(document).on('click', '#number-search-btn', function(e) {
	var number  = $('#number-search').val().trim();
	var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
	
	if(numberRegex.test(number)) {
	   var jobORpo	= "job";
	}else{
		
		var jobORpo	= "po";
	}
	
	var check 	= checkWhetherValidNo(number);
	if(check && number != ''){
		  var jc_id 			= $('#selected-id').val();
		  var po_id 			= $('#selected-poid').val();
		  var inv_no 			= $('#selected-invno').val();
		  var amount_select 	= $('#selected-actamt').val();
		  var amount_net 		= $('#po-actual-amt').val();
		  var inv_date 			= $('#selected-invdate').val();
		  var currency 			= $('#selected-curr').val();
		  var supplier 			= $('#selected-supplier').val();
		  var inv_id 			= $('#selected-invid').val();
		  var entered_po_id		= $('#entered-po-num').val();
		  var actual_currency	= $('#selected-actamt-curr').val();
		  var booking_date		= $('#booking-date').val();
		  var actamt_net 		= $('#po-actual-amt').val();
		  var selamt 			= $('#selected-actamt').val();
		  actamt_net 			= actamt_net.replace(/,/g,"");
		  selamt 				= selamt.replace(/,/g,"");
		  $('#number-search-btn').attr('disabled', 'disabled');
		  if(jobORpo		== "po"){
			  var url = appHome+'/purchase_order/'+entered_po_id+'/poedit?id='+entered_po_id+'&cost_id='+jc_id+'&inv_id='+inv_id+'&supplier_inv_no='+inv_no+'&supplier_inv_amount='+actamt_net+'&actual_amount='+selamt+'&supplier_inv_date='+ inv_date +'&currency='+currency+'&supplier_code='+supplier+'&supp_cur_name='+currency+'&actual_cur_name='+actual_currency+'&joORpo='+jobORpo+'&code='+1+'&sourcefrom=po';
		  }else if(jobORpo	== "job"){
			  var url = appHome+'/job-cost/index?id='+entered_po_id+'&inv_id='+inv_id+'&supplier_inv_no='+inv_no+'&supplier_inv_amount='+actamt_net+'&supplier_inv_date='+ inv_date +'&booking_date='+ booking_date +'&currency='+currency+'&supplier_code='+supplier+'&code='+1+'&jc_id='+jc_id+'&actamt='+selamt+'&actual_cur_name='+actual_currency+'&joORpo='+jobORpo+'&sourcefrom=po';
		  }
		  var win = window.open(url, '_blank');
		  win.focus();
	}
	
});

function checkWhetherValidNo(po_no){
	var retflag = false;
	if(!po_no) {
		  BootstrapDialog.show({title: 'Warning', message : 'Please enter the job number or PO number!'});
		  $('#number-search').focus(); 
		  retflag = false;
	  }else{
			$.ajax({
				type	: 'POST',
				async	: false,
				url		: appHome+'/purchase_order/common_ajax',
				data	: {
							'action_type' 	: 'check_valid_po_job_number',
							'po_no' 		: po_no,
						  },
				beforeSend: function() {
		            // setting a timeout
		        	$('#number-search-btn').html("<i style='font-size:14px' class='fa fa-refresh fa-spin'></i>");
		        },
				success: function(response){
					var jsonObj = JSON.parse(response);
					if(jsonObj.count > 0){
						$('#number-search-btn').html('<i class="fa fa-search"></i>Search');
						$('#entered-po-num').val(jsonObj.id);
						retflag = true;
					}else{
						BootstrapDialog.show({title: 'Warning', message : 'Invalid PO number or Job number.'});
						$('#number-search-btn').html('<i class="fa fa-search"></i>');
						$('#number-search').focus(); 
						retflag = false;
					}
				}
			});
	  }
	return retflag;
}

//To find the exchange rate by the help of invoice date in supplier invoice pasting section
function getExchangeRateByDate(){
	var sup_date 	= $('#invoice_date').val();
	var currency 	= $('#actual_currency').val();
	
	$.ajax({
        type: 'POST',
        url	: appHome+'/purchase_order/common_ajax',
        data: {
      	  'action_type' 	: 'get_exchange_rate_by_date',
      	  'sup_date' 		: sup_date,
      	  'sup_currency' 	: currency
      	},
        success: function(response){
        	$('#exchange_rates').val("");
        	$('#exchange_rates').val(response);
        	$('#actual_amount').trigger("change");
        }
  });
}


/**
   * function for get all customers of currency
*/
/*function getAllCustomersByCurrency(){
  	var currency = $('#currency').val();
  	if(currency != ""){
	  	$.ajax({
	        type: 'POST',
	        url: appHome+'/job-cost/common_ajax',
	        data: {
	          'currency'	: currency,
	          'action_type' : 'get_all_customers_by_recharge_currency'
	        },
		    beforeSend: function() {
		    	$('<i class="fa fa-spinner fa-spin"></i>').insertAfter($('#recharge_to_another_customer').parent());
		     },
	        success: function(response){
	        	$('#recharge_to_another_customer').html(response).chosen().trigger("chosen:updated");;
	        	$('.fa-spinner').remove();
	        }
	    });
  	}
}*/
/**
  * function for fill recharge currency
*/
function getAllCustomersByCurrency(){
	var currency 		= $('#currency').val();
	var bill_office 	= $('#billing_office').val();
	var is_equipment 	= $('#is_equipment').val();
	if(currency != ""){
		$.ajax({
		    type: 'POST',
		    url: appHome+'/purchase_order/common_ajax',
		    data: {
		      'currency'		: currency,
		      'billing_office'	: bill_office,
		      'is_equipment'	: is_equipment,
		      'action_type' 	: 'get_all_customers_by_recharge_currency'
		    },
		    beforeSend: function() {
		    	$('<i class="fa fa-spinner fa-spin"></i>').insertAfter($('#recharge_to_another_customer').parent());
		     },
		    success: function(response){
		    	$('#recharge_to_another_customer').html(response).chosen().trigger("chosen:updated");;
		    	$('.fa-spinner').remove();
		    }
		});
	}
}
//to fill the recommended cost
$(document).on('change', '.subtype_drop', function(e){
		var current_class 	= $(this);
		var sub_id 			= $(this).val();
		var sub_name 		= $(this).find("option:selected" ).text();
		var supplier 		= $('#supplier').val();
		var newPO 			= $('#new_po').val();
		if(newPO == 1){
			/*var cost_subarray = ["25YEARTEST","5YEARTEST","PRESURETST","STEAMCLTST","VACUMTST","HYDROTST",
			"VISINSPTN","EIR","SINGLELFT","NITROGNTST","CLADDING","WALKWAY","DATAPLATE","DOCMNTHOLD",
			"FULHAND","FULREP","GPSFIT","STACKPIP","TOPDISINST"];*/
			$(this).closest('.new_row').find('#recommended_cost').val('0.00');
			$(this).closest('.new_row').find('#recom_price_id').val('0');
			var cost_subarray = ["25YEARTEST","5YEARTEST","PRESURETST","STEAMCLTST","VACUMTST","HYDROTST",
			"VISINSPTN","EIR","SINGLELFT","SWINGBOLT","FULHAND"];

			var po_subarray = ["PRESURETST","STEAMCLTST","VACUMTST","HYDROTST",
			"VISINSPTN","EIR","CALLOUT","PHOTOREQ","SINGLELFT","HAULAGE","OTGENMTC","DECREN","NUTSBOLT","SWINGBOLT","OTHPRTCST",
			"BOTVALDAM","DAMINSP","DAMRECH","OTHDAM","MANCLEAN","OTHCLEAN","GPSFIT","FULHAND","REPAINT","RENUMBER","STACKPIPE",
			"TOPDISCH","DECCHAR","OTHMODIC","PITDAM","SHLDAM","LADDAM","HANDAM"];
            if(jQuery.inArray(sub_id, po_subarray) !== -1){
            	//$(this).closest('.new_row').find('.specific_detail').prop('disabled', 'disabled');
            	$(this).closest('.new_row').find('.specific_detail').css('pointer-events', 'none');
            	$(this).closest('.new_row').find('.specific_detail').css('background-color', '#eee');
            }else{
            	//$(this).closest('.new_row').find('.specific_detail').prop('disabled', false);
            	$(this).closest('.new_row').find('.specific_detail').css('pointer-events', 'auto');
            	$(this).closest('.new_row').find('.specific_detail').css('background-color', '#fff');
            }
			
			if((supplier != "") && (sub_id !="") && (jQuery.inArray(sub_id, cost_subarray) !== -1)){
			$.ajax({
				type	: 'POST',
				url		: appHome + '/purchase_order/common_ajax',
				async	: false,
				data	: {
					'action_type'	: 'get_recommended_cost',
					'sub_id'		: sub_id,
					'sub_name'		: sub_name,
					'supplier'		: supplier,
					'newPO'			: newPO
				},
				success: function (response) {
					var jsonObj = JSON.parse(response);
					$(current_class).parent().next().next().find('#recommended_cost').val(jsonObj.price);
					$(current_class).parent().next().next().find('#recom_price_id').val(jsonObj.id);
					$(current_class).parent().next().next().find('#recommended_cost').attr('data-recost',jsonObj.price);
					//$('.subs_quantity').trigger("change");
				},
				error: function (response) {
					alert("error");
				}
			});
		  }
		}else{
			if((supplier != "") && (sub_name !="")){
			$.ajax({
				type	: 'POST',
				url		: appHome + '/purchase_order/common_ajax',
				async	: false,
				data	: {
					'action_type'	: 'get_recommended_cost',
					'sub_id'		: sub_id,
					'sub_name'		: sub_name,
					'supplier'		: supplier,
					'newPO'			: newPO
				},
				success: function (response) {
					var jsonObj = JSON.parse(response);
					$(current_class).parent().next().find('#recommended_cost').val(jsonObj.price);
					$(current_class).parent().next().find('#recom_price_id').val(jsonObj.id);
				},
				error: function (response) {
					alert("error");
				}
			});
		  }
		}
		
	});
	

	//to fill the recommended cost
$(document).on('change', '.specific_detail', function(e){
		var current_class 	= $(this);
		var sub_id 			= $(this).val();
		var sub_name 		= $(this).find("option:selected" ).text();
		var supplier 		= $('#supplier').val();
		var newPO 			= $('#new_po').val();
		if(newPO == 1){

			var subarray = ["PTFE3","PTFE5","STT3","STT5","BFVALGASK","BFVALSEAL"];
	            if(jQuery.inArray(sub_id, subarray) !== -1){
	            	$(this).closest('.new_row').find('.specific_quantity').val('');
	            	$(this).closest('.new_row').find('.spec_quantity').show();
	            	$(this).closest('.new_row').find($(".specific_quantity option")).prop("disabled", false);
	            	if((sub_id == "BFVALGASK") || (sub_id == "BFVALSEAL")){
	            		$(this).closest('.new_row').find($(".specific_quantity option[value='3'],.specific_quantity option[value='4'],.specific_quantity option[value='5']")).attr("disabled","disabled");
	            	}
	            	
				}else{
					$(this).closest('.new_row').find('.subs_quantity').val(1);
					$(this).closest('.new_row').find('.spec_quantity').hide();
					$(this).closest('.new_row').find('.specific_quantity').val('');
				}
			if((sub_id != "BTL") && (sub_id != "LEASE")){
				$(this).closest('.new_row').find('#recommended_cost').val('0.00');
				$(this).closest('.new_row').find('#recom_price_id').val('0');
			}
			
			var cost_subarray = ["PTFE3","PTFE5","STT3","STT5","FVGASKET","FVHANDLE","FVORING","FVPOPPET",
			"FVPREPLAT","BFVALGASK","BFVALSEAL","OUTCAPRNW","AIRVALSL","AIRBALVAL","PRVSEAL","PRESGUGE",
			"TEMPGUGE","DATAPLATE","DOCMNTHOLD","ACIDWASH","CAUSTWASH","CLDETWASH","HOTDETWASH","EXTCLCHE",
			"EXTCLWAT","EXTDEGLU"];

			var c_typearr = ["DATAPLATE","DOCMNTHOLD"];
			var diff 	  = "";
			if(jQuery.inArray(sub_id, c_typearr) !== -1){
				diff 	  = "yes";
			}
			
			var cladidsarr 		= $.parseJSON($('#cladJSON').val());
			var walkidsarr 		= $.parseJSON($('#walkJSON').val());
			var tankbufidsarr 	= $.parseJSON($('#tankbufJSON').val());
			var ifExcist = '';

			if((jQuery.inArray(sub_id, cladidsarr) !== -1) || (jQuery.inArray(sub_id, walkidsarr) !== -1) || (jQuery.inArray(sub_id, tankbufidsarr) !== -1)){
				ifExcist = 'yes';
			}

			if((supplier != "") && (sub_id !="") && ((jQuery.inArray(sub_id, cost_subarray) !== -1) || (ifExcist == 'yes'))){
			$.ajax({
				type	: 'POST',
				url		: appHome + '/purchase_order/common_ajax',
				async	: false,
				data	: {
					'action_type'	: 'get_specific_recommended_cost',
					'sub_id'		: sub_id,
					'sub_name'		: sub_name,
					'supplier'		: supplier,
					'newPO'			: newPO,
					'other'			: ifExcist,
					'diff'			: diff
				},
				success: function (response) {
					var jsonObj = JSON.parse(response);
					$(current_class).parent().next().find('#recommended_cost').val(jsonObj.price);
					$(current_class).parent().next().find('#recom_price_id').val(jsonObj.id);
					$(current_class).parent().next().find('#recommended_cost').attr('data-recost',jsonObj.price);
					//$('.specific_quantity').trigger("change");
				},
				error: function (response) {
					alert("error");
				}
			});
		  }
		}
		
	});

	function getRecomentedCost(){
		var selected_values = new Array();
		var specific_values = new Array();
		var other 			= new Array();
		var newPo 			= $('#new_po').val();
		var ifExcist 		= '';

        $('.subtype_drop').each(function() {
           selected_values.push($(this).find("option:selected").val());

           if(($(this).find("option:selected").val() == 'CLADDING') ||($(this).find("option:selected").val() == 'WALKWAY') || ($(this).find("option:selected").val() == 'TNKBUFER'))
           {
           		$(this).val('');
           		$(this).closest('.new_row').find('.specific_detail').val('');
           		$(this).closest('.new_row').find('#recommended_cost').val(0);
           		$(this).closest('.new_row').find('#recom_price_id').val(0);
           		$(this).closest('.new_row').find('.subs_quantity').val(1);
				$(this).closest('.new_row').find('.sub_quantity').hide();
           }
        });
		if(newPo == 1){
			var cladidsarr 		= $.parseJSON($('#cladJSON').val());
			var walkidsarr 		= $.parseJSON($('#walkJSON').val());
			var tankbufidsarr 	= $.parseJSON($('#tankbufJSON').val());
			
			$('.specific_detail').each(function() {
           		specific_values.push($(this).find("option:selected").val());

           		if((jQuery.inArray($(this).find("option:selected").val(), cladidsarr) !== -1) || (jQuery.inArray($(this).find("option:selected").val(), walkidsarr) !== -1) || (jQuery.inArray($(this).find("option:selected").val(), tankbufidsarr) !== -1)){
				ifExcist = 'yes';
				other.push(ifExcist);
			}else{
				ifExcist = 'no';
				other.push(ifExcist);
			}



        	});
        	
        	var specificjson = JSON.stringify({ specific_values	});
        	var otherjson    = JSON.stringify({ other });
			

			
		}
		var json = JSON.stringify({ selected_values	});
		
		$.ajax({
				type	: 'POST',
				url		: appHome + '/purchase_order/common_ajax',
				async	: false,
				data	: {
					'action_type'	: 'get_recommended_cost_full',
					'json'			: json,
					'supplier'		: $('#supplier').val(),
					'newPO' 		: newPo,
					'specificjson'	: specificjson,
					'other'			: ifExcist,
					'otherjson'		: otherjson
				},
				success: function (response) {
					var jsonObj = JSON.parse(response);
						$('.subs_quantity').val(1);
						$('.specific_quantity').val(1);
						$.each(jsonObj.price, function(key, value) {
							$(".recom_cost :eq("+key+")").val(value);
						});
						$.each(jsonObj.id, function(key, value) {
							$(".recom_id :eq("+key+")").val(value);
						});
				},
				error: function (response) {
					alert("error");
				}
			});
	}

	$(document).on('change', '#cost_type', function(e) {
		var po_area_name = $(this).val();
		$('#specific_details').empty();
		fillCostSubtype($(this),$('#cost_type'),'cost_type_loader');
	});

	$(document).on('change', '#cost_sub_type', function(e) {
		var po_area_name = $(this).val();
		fillCostSubtype($(this),$('#cost_sub_type'),'specific_type_loader');
	});

	function fillCostSubtype(get,resultElement,loaderClass){
		var getValue = get.val();
		var loadClass = loaderClass;
		$.ajax({
	        type: 'POST',
	        url: appHome+'/purchase_order/common_ajax',
	        data: {
	          'getValue'	: getValue,
	          'loadClass'	: loadClass,
	          'action_type' : 'get_subtype_from_cost'
	        },
	       // async : false,
	        beforeSend: function() {
	            // setting a timeout
	        	$('.'+loaderClass).show();
	        },
	        success: function(response){
	        	var obj = $.parseJSON(response);
	        	var opt = '<option value=""></option>';
	        		$.each(obj,function(index, data){ //console.log(index, data);
	        		opt += '<option value="'+data.id+'">'+data.name+'</option>';
	        		});
	        		if(loadClass == 'cost_type_loader'){
	        			$('.cost_sub_type').html(opt);
	        		}
	        		else{
	        			$('.specific_details').html(opt);
	        		}
	        		
	        	$('.chosen').chosen().trigger("chosen:updated");
	        	$('.'+loaderClass).hide();
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	      });
	}
	//To hide and show cost filters
	function costFilters(t){
		if($('#po_area-filter').val() == "M&R"){
				$(".old_new_po").show();

			}else{
				$(".old_new_po").hide();
				$('.cost_dd_all').val('').chosen().trigger("chosen:updated");
			}
			if($('#filtter').val() == 'inddex'){ changeFilterSubtypeDD(t); }
	}

	$(document).on('change', '#po_old_new', function(e) {
		changeFilterSubtypeDD('c');
	});

	function changeFilterSubtypeDD(t){
		if(t == 'c'){ $('#cost_type,#specific_details,#cost_sub_type,#po_type-filter,#po_subtype-filter').val(''); }
		if($('#po_area-filter').val() == "M&R" && $('#po_old_new').val() == '1'){
			$('#cost_type,#specific_details,#cost_sub_type').attr('disabled', false).chosen().trigger("chosen:updated");
			$('#po_type-filter,#po_subtype-filter').attr('disabled', true).chosen().trigger("chosen:updated");
		}else{
			$('#cost_type,#specific_details,#cost_sub_type').attr('disabled', true).chosen().trigger("chosen:updated");
			$('#po_type-filter,#po_subtype-filter').attr('disabled', false).chosen().trigger("chosen:updated");
		}
	}

	$(document).on('change', '.specific_quantity,.subs_quantity', function(e) {
		
		if(($('#supplier').val() != "") && ($(this).val() != "") && ($(this).closest('.new_row').find('#recommended_cost').attr('data-recost') !="") && ($(this).closest('.new_row').find('#recommended_cost').attr('data-recost') != undefined)){
			var tot = parseFloat($(this).val()) * parseFloat($(this).closest('.new_row').find('#recommended_cost').attr('data-recost'));
			$(this).closest('.new_row').find('#recommended_cost').val(parseFloat(tot));
		}

	});

	function getListBySupplier(){
		var restval  = $('#json_cost_specific').val();
		var prestval = JSON.parse(restval);
		$.ajax({
				type	: 'POST',
				url		: appHome + '/purchase_order/common_ajax',
				async	: false,
				data	: {
					'action_type'	: 'get_values_by_supplier',
					'supplier'		: $('#supplier').val()
				},
				success: function (response) {
					var res = JSON.parse(response);
					$.each(res.allValues, function( index, value ) {
    				prestval[index] = value;
					});
					var finalval = JSON.stringify(prestval);
					$('#json_cost_specific').val(finalval);
					$('#cladJSON').val(JSON.stringify(res.clad));
					$('#walkJSON').val(JSON.stringify(res.walk));
					$('#tankbufJSON').val(JSON.stringify(res.tkbuf));
				},
				error: function (response) {
					alert("error");
				}
			});
	}

	$('#file_to_upload').change(function(){

		fileSelectionChanged();
	});

	function fileSelectionChanged(){
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
		if($("#drag_and_drop_on").val()){
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
								fileSelectionChanged();
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
						var po 	= $('#ins_num').val();
						$.ajax({
							type		: "POST",
							url			: appHome+'/purchase_order/common_ajax',
							data		: ({
											'action_type' 	: 'update_po_insurance_costing',
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
	$(document).ready(function(){
		multiselectInit();
	});

	$('.tank-lease-cost-add-btn').live('click',function(){
		$('.panel_div').show();
		$('.sub_list_display').show();
		$(this).hide();
		var subtypeval = getCostTypesForTankLease();
		$('.sub_option').append(subtypeval);
		$('#sub_list_display').animate({
			scrollTop: $('#sub_list_display').get(0).scrollHeight
		}, 1000);
		hideMinusButtonForTankLease();
		multiselectInit();
		$('.lease_cost_from_date, .lease_cost_to_date, .tank_lease_charge_date').datepicker({
			dateFormat: btl_default_date_format,
			changeMonth: true,
			changeYear: true,
			inline: true,
			startDate: 0
		});
	});

	function hideMinusButtonForTankLease(){
		if($('.tank-lease-cost-add-btn').length == 1){
			$('.tank-lease-cost-sub-btn').hide();
		}else{
			$('.tank-lease-cost-sub-btn').show();
		}
	}

	function getCostTypesForTankLease(){
		var type = $(".stype")[0].value;
		var stype = $('#json_type').val();
		var typeobj = $.parseJSON(stype);
		tank_index = tank_index + 1;
		var opt = '<div class="tank_lease_row"><input type="hidden" name="tank_index[]" value="'
		+tank_index+'">'
		opt += '<div class="form-group row">'
			
			
		 
		 +'<div class="col-sm-1 col-md-1" style="padding-left: 5px; padding-right: 5px;">'
		 +'<input id="sub_est_id" name="sub_est_id[]" type="hidden" value="new" />'
		 +' <select name="stype[]" class="form-control stype com_type" placeholder="Please select" style="padding-left:2; padding-right:2">';
		
			  $.each(typeobj,function(index, data){
				  if(data != null && ' '){
					  opt += '<option value="'+index+'"';
					  if(index == type){
						  opt += 'selected';
					  }
					  opt += '>'+data+'</option>';
				  }
			  });
		
		opt += '</select>'
		+'</div>'
		 +'<div class="col-sm-2 col-md-2">'
		 +' <select name="sub_subtype[]" class="form-control tank_lease_sub_type" placeholder="Please select">';
		
		opt += '<option value="">Please select</option>';
		poSubType.forEach((el) => {
			opt += '<option data-division="'+el.tank_lease_po_sub_type_division+ '" value="'+el.po_subtype_id+'">'+el.po_subtype_name+'</option>';
		});
		
		opt += '</select>'
			
			+'</div>'
			+'<div class="col-sm-2 col-md-2">'
			+'<div class="non_least_cost_tanks">'
			+'<select style="display:none" name="tanks['
			+ tank_index
			+'][]" class="multi-sel-ctrl form-control filter tanks_select" multiple size="1">';
			tanks.forEach((el) => {
				opt += '<option value="'+el.tank_id+'" data-charge-starts-from="'
							+el.tank_lease_charge_starts_from+'" data-daily-rate="'
							+el.tank_lease_daily_rate+'" data-on-hire-costs="'
							+el.l_hire_cost
							+'">'+el.tank_no+'</option>';
			});
			opt += '</select>'
			+'</div>' 
			+'<input type="text" class="tmp-input-ctrl form-control" value="" disabled />'
			+'<input style="display: none;" type="text" class="lease_cost_area lease_cost_disable_area form-control" value="" disabled />'
			+'</div>'
			+'<div class="col-sm-2 col-md-2">'
			+'<input id="sub_est_amt" name="sub_est_amt[]" class="form-control cal_sub_est_amount com_est sty" type="text" placeholder ="Cost" maxlength="7" autocomplete="on" onkeypress="return NumberValues(this,event);"/>'
			+'</div>'
			+'<div class="col-sm-2 col-md-2">'
			+'<input id="sub_act_amt" name="sub_act_amt[]" class="form-control cal_act_amount sty" type="text" placeholder ="Cost" maxlength="7" autocomplete="on" onkeypress="return NumberValues(this,event);" />'
			+'</div>'
			+'<div class="col-sm-2 col-md-2">'
			+'<input id="sub_comt" name="sub_comt[]" class="form-control" type="text" placeholder ="Comments" maxlength="40"/>'
			+'</div>'
			+'<div class="col-sm-1 col-md-1 add-po-cost-area">'
			+'<a class="btn btn-success tank-lease-cost-add-btn" ><span class="glyphicon glyphicon-plus-sign"></span></a> '
			+'<a class="btn btn-danger tank-lease-cost-sub-btn cal_dif_est_amount"><span class="glyphicon glyphicon-minus-sign"></span></a>'
			+'</div>'
			+'</div>'
			+ '<div class="lease_cost_area row" style="display: none; margin-bottom: 15px;">'
			+ '<div class="col-sm-2 col-md-2">'
			+	'<div class="input-group">'
			+		  '<input type="text" '
			+		  'class="datepicker form-control filter-input-fld date-validate-only lease_cost_from_date"'
			+		  'name="lease_date_from[]"'
			+		  'value="" '
			+		  'placeholder="From Date" '
			+		  'maxlength="10" '
			+		  'onpaste="return false;" '
			+		  'autocomplete="off"> '
			+		  '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>'
			+	'</div>'
			+'</div>'
			+'<div class="col-sm-2 col-md-2">'
			+	'<div class="input-group">'
			+		  '<input type="text" '
			+		  'class="datepicker form-control filter-input-fld date-validate-only lease_cost_to_date"'
			+		  'name="lease_date_to[]"'
			+		  'value="" '
			+		  'placeholder="To Date" '
			+		  'maxlength="10" '
			+		  'onpaste="return false;" '
			+		  'autocomplete="off"> '
			+		  '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>'
			+	'</div>'
			+	'</div>'
			+   '<div class="col-md-8">'
			+		'<table class="table table-striped table-bordered table-hover tablesorter hide-filters thick-table least_cost_tanks_table " '
			+				'id="plantable" style="margin-top: 0;">'
			+			'<thead>'
			+				'<tr>'
			+					'<th class="center-cell" width="5%">'
			+						'#'
			+						'<br>'
			+						'<input type="checkbox" class="select-all-tanks" checked>'
			+					'</th>'
			+					'<th class="center-cell" width="5%">Tank Number</th>'
			+					'<th class="center-cell" width="5%">Daily rate</th>'
			+					'<th class="center-cell" width="5%">Date Charging from</th>'
			+					'<th class="center-cell" width="5%">Days charged</th>'
			+					'<th class="center-cell" width="5%">Total charged</th>'
			+				'</tr>'
			+			'</thead>'
			+			'<tbody class="tank_lease_tbody" data-index="'+tank_index+'">';
			if(tanks.length > 0){
				tanks.forEach((el, index) => {
					days_charged = 0;
					total_charged = 0.00;
					opt += '<tr class="parent-tank-row">'
											+	'<td class="center-cell" width="5%">'
											+ 		(index + 1) 
											+ 		'<br> <input type="checkbox" name="least_cost_tank_check['+tank_index+'][]" class="least_cost_tank_check" checked>'
											+ 		' <input type="hidden" class="least_cost_tank_check_value"'
											+       '   name="least_cost_tank_check_val['+tank_index+'][]" value="0">'
											+	'</td>'
											+	'<td class="center-cell" width="20%">'
											+	'<input type="hidden" name="least_cost_tank_id['+tank_index+'][]" '
											+	'value="'+el.tank_id+'">'
											+		el.tank_no
											+	'</td>'
											+	'<td class="center-cell" width="15%">'
											+		'<input type="text" '
											+			'class="form-control daily_rate" '
											+			'name="least_cost_daily_rate['
											+            tank_index
											+			'][]"' 
											+			'value="'
											+				(el.tank_lease_daily_rate  ? el.tank_lease_daily_rate : 0.00)
											+			'" onkeypress="return NumberValues(this,event);" />'
											+	'</td>'
											+	'<td class="center-cell" width="25%">'
											+		'<div class="input-group">'
											+			'<input type="text" '
											+				'class="datepicker form-control filter-input-fld date-validate-only tank_lease_charge_date " '
											+				'name="least_cost_charge_date['+tank_index+'][]"  '
											+				'placeholder="Charge Date"  maxlength="10" '
											+				'value="'
											+				(el.tank_lease_charge_starts_from? getFormattedDate(el.tank_lease_charge_starts_from.toString().substring(0, 10)): "")
											+					'">'
											+			'<span class="input-group-addon">'
											+				'<span class="glyphicon glyphicon-calendar"></span>'
											+			'</span>'
											+		'</div>'
											+	'</td>'
											+	'<td class="center-cell" width="15%">'
											+		'<input class="form-control days_charged" type="text" name="least_cost_charge_days['+tank_index+'][]" '
											+			'value="'
											+             days_charged
											+		     '" readonly>'
											+	'</td>'
											+	'<td class="center-cell" width="20%">'
											+		'<input class="form-control total_charged" type="text" name="least_cost_charge_total['+tank_index+'][]" '
											+		'value="'+total_charged+'" readonly>'
											+	'</td>'
											+'</tr>';
				});
			}
			else{
				opt += '<tr>'
										+		'<td colspan="6" class="text-center">No tanks found.</td>'
									 	+'</tr>';
			}
			
			opt += 			'</tbody>'
			+		'</table>'
			+'</div>'
		+'</div>'
			+'</div>';
		return opt;
	}

	$('.tank-lease-cost-sub-btn').live('click',function(){
		if($('.tank-lease-cost-sub-btn').length > 1){
			$(this).closest('.tank_lease_row').remove();
			$('.tank-lease-cost-add-btn').last().show();
			hideMinusButtonForTankLease();
		}
		
	});

	function multiselectInit() {
		if($(".tanks_select").length != 0){
			$(".tanks_select").multiselect({
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
	}

	$('#contractor').change(function(){
		$.ajax({
			type: 'POST',
			url: appHome + '/purchase_order/common_ajax',
			async: false,
			data: {
				'action_type': 'get_tanks_by_contract_no',
				'contract_no': $('#contractor').val()
			},
			success: function (response) {
				tanks = JSON.parse(response);
				changeTanksOptions();
				$('.tanks_select').change();
			},
			error: function (response) {
				
			}
		});
	});

	function changeTanksOptions() {
		let options = "";
		let lease_tank_table_data = "";
		tanks.forEach((el, index) => {
			options += '<option value="'+el.tank_id+'" data-charge-starts-from="'
						+el.tank_lease_charge_starts_from+'" data-daily-rate="'
						+el.tank_lease_daily_rate+'" data-on-hire-costs="'
						+el.l_hire_cost
						+'">'+el.tank_no+'</option>';
		});
		
		$('.tank_lease_tbody').each(function () {
			lease_tank_table_data = "";
			tank_index_lease = $(this).data().index;
			day_from = $(this).closest('.tank_lease_row').find(".lease_cost_from_date").val();
			to_date = $(this).closest('.tank_lease_row').find(".lease_cost_to_date").val();
			if(tanks.length > 0){
				tanks.forEach((el, index) => {
					days_charged = 0;
					converted_charged_date = (el.tank_lease_charge_starts_from? getFormattedDate(el.tank_lease_charge_starts_from.toString().substring(0, 10)): "");
					days_charged = getDayDiffrence(day_from, to_date, converted_charged_date);
					total_charged = days_charged * (el.tank_lease_daily_rate  ? parseFloat(el.tank_lease_daily_rate) : 0.00);
					lease_tank_table_data += '<tr class="parent-tank-row">'
											+	'<td class="center-cell" width="5%">'
											+ 		(index + 1) 
											+ 		'<br> <input type="checkbox" name="least_cost_tank_check['+tank_index_lease+'][]" class="least_cost_tank_check" checked>'
											+ 		' <input type="hidden" class="least_cost_tank_check_value"'
											+       '   name="least_cost_tank_check_val['+tank_index_lease+'][]" value="0">'
											+	'</td>'
											+	'<td class="center-cell" width="20%">'
											+	'<input type="hidden" name="least_cost_tank_id['+tank_index_lease+'][]" '
											+	'value="'+el.tank_id+'">'
											+		el.tank_no
											+	'</td>'
											+	'<td class="center-cell" width="15%">'
											+		'<input type="text" '
											+			'class="form-control daily_rate" '
											+			'name="least_cost_daily_rate['
											+            tank_index_lease
											+			'][]"' 
											+			'value="'
											+				(el.tank_lease_daily_rate  ? el.tank_lease_daily_rate : 0.00)
											+			'" onkeypress="return NumberValues(this,event);" />'
											+	'</td>'
											+	'<td class="center-cell" width="25%">'
											+		'<div class="input-group">'
											+			'<input type="text" '
											+				'class="datepicker form-control filter-input-fld date-validate-only tank_lease_charge_date " '
											+				'name="least_cost_charge_date['+tank_index_lease+'][]"  '
											+				'placeholder="Charge Date"  maxlength="10" '
											+				'value="'
											+				converted_charged_date
											+					'">'
											+			'<span class="input-group-addon">'
											+				'<span class="glyphicon glyphicon-calendar"></span>'
											+			'</span>'
											+		'</div>'
											+	'</td>'
											+	'<td class="center-cell" width="15%">'
											+		'<input class="form-control days_charged" type="text" name="least_cost_charge_days['+tank_index_lease+'][]" '
											+			'value="'
											+             days_charged
											+		     '" readonly>'
											+	'</td>'
											+	'<td class="center-cell" width="20%">'
											+		'<input class="form-control total_charged" type="text" name="least_cost_charge_total['+tank_index_lease+'][]" '
											+		'value="'+total_charged+'" readonly>'
											+	'</td>'
											+'</tr>';
				});
			}
			else{
				lease_tank_table_data += '<tr>'
										+		'<td colspan="6" class="text-center">No tanks found.</td>'
									 	+'</tr>';
			}
			$(this).html(lease_tank_table_data);
			$('.tank_lease_charge_date').datepicker({
				dateFormat: btl_default_date_format,
				changeMonth: true,
				changeYear: true,
				inline: true,
				startDate: 0
			});
		});
		$('.tanks_select').html(options);
		$('.tanks_select').multiselect('destroy');
		multiselectInit();
	}

	$(document).on('change', '.tanks_select, .lease_cost_from_date, .lease_cost_to_date', function(){
		calculateTankLeaseCharges($(this).closest('.tank_lease_row'));
	});

	$(document).on('change', '.tank_lease_sub_type', function(){
		sub_type_text = $(this).find("option:selected").data().division.trim();
		let row = $(this).closest('.tank_lease_row');
		if(sub_type_text == "Lease Costs"){
			$(row).find('.lease_cost_area').show();
			$(row).find('.non_least_cost_tanks').hide();
		}
		else{
			$(row).find('.lease_cost_area').hide();
			$(row).find('.non_least_cost_tanks').show();
			$(row).find('.lease_cost_from_date').val("");
			$(row).find('.lease_cost_to_date').val("");
		}
		calculateTankLeaseCharges(row);
	});

	function calculateTankLeaseCharges(row){
		var select = $(row).find(".tanks_select");
		var least_cost_table = $(row).find(".least_cost_tanks_table");
		var subtype_drop = $(row).find(".tank_lease_sub_type");
		var cal_sub_est_amount = $(row).find(".cal_sub_est_amount");
		sub_type_text = $(subtype_drop).val() ? $(subtype_drop).find("option:selected").data().division.trim(): "";
		sub_est_amount = 0;
		if(sub_type_text == "Lease Costs"){
			let total_charged_arr = $(least_cost_table).find(".total_charged" );
			let days_charged_array = $(least_cost_table).find(".days_charged" );
			let tank_lease_charge_date = $(least_cost_table).find(".tank_lease_charge_date" );
			let daily_rate = $(least_cost_table).find(".daily_rate" );
			let least_cost_tank_check_value = $(least_cost_table).find(".least_cost_tank_check_value" );
			day_from = $(row).find(".lease_cost_from_date")[0].value;
			day_to = $(row).find(".lease_cost_to_date")[0].value;
			$(least_cost_table).find(".least_cost_tank_check" ).each(function(index, el) {
				days_charged = getDayDiffrence(day_from, day_to, tank_lease_charge_date[index].value);
				total_charged = days_charged * (daily_rate[index].value  ? parseFloat(daily_rate[index].value) : 0.00);
				$(days_charged_array[index]).val(days_charged);
				$(total_charged_arr[index]).val(total_charged);
				$(least_cost_tank_check_value[index]).val($(el).prop("checked")? 1: 0)
				if($(el).prop("checked")){
					sub_est_amount += (total_charged_arr[index].value? parseFloat(total_charged_arr[index].value): 0.00);
				}
			});
			$(cal_sub_est_amount).val(sub_est_amount);
			$(cal_sub_est_amount).change();
		}
		else if(sub_type_text == "On-Hires" || sub_type_text == "Survey Costs") {
			$(select).find("option:selected" ).each(function() {
				let dat_arr = $(this).data();
				sub_est_amount += (dat_arr.onHireCosts? parseFloat(dat_arr.onHireCosts) : 0.00);
			});
			$(cal_sub_est_amount).val(sub_est_amount);
			$(cal_sub_est_amount).change();
		} 
	}
	date_format_array = btl_default_date_format.split("/");
	date_index = date_format_array.findIndex(el => el == "dd");
	month_index = date_format_array.findIndex(el => el == "mm");
	year_index = date_format_array.findIndex(el => el == "yy");

	function getDayDiffrence(from_date, to_date, charge_starting_from){
		diffDays = 0;
		
		if((from_date) && to_date)
		{
			date_1_array = from_date.split("/");
			date_2_array = to_date.split("/");
			charge_starts_from_array = charge_starting_from.split("/");
			date1 = new Date(date_1_array[year_index], date_1_array[month_index] - 1, date_1_array[date_index]);
			const date2 = new Date(date_2_array[year_index], date_2_array[month_index] - 1, date_2_array[date_index]);
			const charge_starts_from = charge_starting_from? new Date(charge_starts_from_array[year_index], charge_starts_from_array[month_index] - 1, charge_starts_from_array[date_index]): null;
			if(charge_starts_from && charge_starts_from > date1) date1 = charge_starts_from;
			if(date2 >= date1){
				const diffTime = Math.abs(date2 - date1);
				diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
			}
		}
		return diffDays;
	}

	$(document).on("click", ".select-all-tanks", function () {
		row = $(this).closest(".least_cost_tanks_table");
		checked = $(this).prop("checked");
		$(row).find(".least_cost_tank_check").attr("checked", checked);
		calculateTankLeaseCharges($(this).closest(".tank_lease_row"));
	});

	$(document).on("click", ".least_cost_tank_check", function () {
		row = $(this).closest(".least_cost_tanks_table");
		if($(row).find(".least_cost_tank_check").length == $(row).find(".least_cost_tank_check:checked").length){
			$(row).find(".select-all-tanks").attr("checked", true);
		}
		else{
			$(row).find(".select-all-tanks").attr("checked", false);
		}
		calculateTankLeaseCharges($(this).closest(".tank_lease_row"));
	});

	$(document).on("change", ".tank_lease_charge_date, .daily_rate", function () {
		calculateTankLeaseCharges($(this).closest(".tank_lease_row"));
	});

	$('#claim-link-btn').hide();
	$(document).on('click', '#insurancepo', function(e) {
		if($('.claimpo:checked').length < 1){
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
					$(".claimpo").each(function() {
						if ( $(this).prop('checked') ) {
							if (typeof $(this).data('id') !== 'undefined') {
								var id  = $(this).attr("data-id");
								if($('#po_area').val() == "MR"){
									var val = $(this).closest('div').next('div').find(":selected").val();
								}else{
									var val = $(this).closest('td').next('td').find(":selected").val();
								}
								obj[id] = val;
							}
						}
					});
						
						var ids = JSON.stringify(obj);
						var claimid 	= $('#ins_sub_id').val();
						if($('#po_area').val() == "MR"){
							$.ajax({
								type		: "POST",
								url			: appHome+'/purchase_order/common_ajax',
								data		: ({
												'action_type' 	: 'update_claim_sub_costing',
												'ids'		  	: ids,
												'main_id'		: $('#ins_main_id').val(),
												'sub_id'		: $('#ins_sub_id').val(),
												'cost_id'		: $('#po_id').val()
											}),  
								success: function(response){
									if(response == "success"){
										window.location.href = appHome+'/claim/'+claimid+'/edit';
									}	
								}  
							});
						}else{
							$.ajax({
								type		: "POST",
								url			: appHome+'/purchase_order/common_ajax',
								data		: ({
												'action_type' 	: 'update_claim_costing',
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
				}
			}]
		});	
	});