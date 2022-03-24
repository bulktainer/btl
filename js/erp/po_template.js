$(document).ready(function(){
	/* For displaying month and year only */
	$(function() {
	    $('.date-picker').datepicker( {
	        changeMonth: true,
	        changeYear: true,
	        showButtonPanel: true,
	        dateFormat: 'MM yy',
	        onClose: function(dateText, inst) { 
	        function isDonePressed(){
	                            return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
	                        }
	        if (isDonePressed()){

	                            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
	                            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
	                            $(this).datepicker('setDate', new Date(year, month, 1));
	                             console.log('Done is pressed')

	                        }
	            }
	    });
	});
	if(($('#filtter').val() == 'inddex') && ($('#category').val() != 'Eqmt')){
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
	}
	/**
	* Create & edit-po-template
	*/
	$('.edit-po-template,.create-po-template').click(function(e){
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
	  if($('#is_equipment_po').val() == 1){
		  highlight($(form).find('#equipment_number'), '');
		  highlight($(form).find('#billing_office'), '');
	  }else if($("#po_type option:selected").text() == 'VAT'){
		  highlight($(form).find('#po_subtype'), '');
	  }else{
		  highlight($(form).find('#po_area	'), '');
		  if(($('#po_area').val() != 3) && ($('#po_area').val() != 8)){
			  highlight($(form).find('#po_type'), '');  
		  }
	  }
	  /*if($("#po_type").find("option:selected" ).text() == "VAT"){
		  highlight($(form).find('#po_subtype'), '');
	  }*/
	  highlight($(form).find('#date_MY'), '');
	  
	  var check_fields = (success.indexOf(false) > -1);
	  var prod_id = $('#po_temp_id').val();
	  /**
	  * update edit-vgm-route
	  */
	  if($(this).hasClass('edit-po-template')){

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
	          $('.edit-po-templater').attr('disabled',false);
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	      });
	    }
	  }
	  
	  /**
	   * create-PO_template
	   */
	   if($(this).hasClass('create-po-template')){
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	    	$(this).attr('disabled',true);
	       $.ajax({
	         type: 'POST',
	         url: path+'/potemplateadd',
	         data: $(form).serialize().replace(/%5B%5D/g, '[]'),
	         success: function(response){
	           window.location.href = $('#returnpath').val();
	           localStorage.setItem('response', response);
	         },
	         error: function(response){
	        	 $('.create-po-template').attr('disabled',false);
	           $('html, body').animate({ scrollTop: 0 }, 400);
	           $('form').find('#response').empty().prepend(alert_error).fadeIn();
	         }
	       });
	     }
	   }
	});
	
	//view purchase order template
	$(document).on('click', '.view_product', function(e){ 
	//$('.view_product').click(function(e) {
		$('.view_small_loader').show();
		$('.reset_values').html('');
		var po_id = $(this).data('id');
		$.ajax({ 
			type: 'POST',
			dataType: 'json',
			url: appHome+'/potemplate/common_ajax',
			data: {
				'po_id' : po_id,
				'action_type' : 'get_po_detail'
				  },
			success: function(response){
				$('.view_small_loader').hide();
				if(response != ""){
					$('#modal_area_name').html(response.po_area_name);
					$('#modal_type_name').html(response.po_type_name);
					$('#modal_sub_type_name').html(response.po_subtype_name);
					
					
				}
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	});
	//Disable type and subtype when area is M&R
	$(document).on('change', '#po_area', function(e){
		if(($('#po_area').val() == 3) || ($('#po_area').val() == 8)){
			$("#po_type").prop("disabled", true);
			$("#po_subtype").prop("disabled", true);
		}else{
			$("#po_type").prop("disabled", false);
			$("#po_subtype").prop("disabled", false);
		}
	});
	
	//Delete purchase order
	$(document).on('click', '.delete-po-btn', function(e){ 
	//$('.delete-po-btn').click(function(e) {
		e.preventDefault();
		
		var delete_url = $(this).attr('href'),
			po_id = $(this).data('prod-id'),
			$this = $(this),
			return_url = window.location.href;
		if($('#returnpath').val()) {
			return_url = $('#returnpath').val();
		}
		
		BootstrapDialog.confirm('Are you sure you want to delete this Purchase Order Template?', function(result){
			if(result) {
				$.ajax({
					type: 'POST',
					url: delete_url,
					data: {'po_id' : po_id
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
	
	function fillCity(get,resultElement,loaderClass){
		var getValue = get.val();
		var loadClass = loaderClass;
		$.ajax({
	        type: 'POST',
	        url: appHome+'/potemplate/common_ajax',
	        data: {
	          'getValue'	: getValue,
	          'loadClass'	: loadClass,
	          'action_type' : 'get_type_from_area'
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
	        		if(loadClass == 'end_type_loader'){
	        			$('.potypenm').html(opt);
	        		}
	        		else{
	        			$('.posubtypenm').html(opt);
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

	$(document).on('change', '#po_area', function(e) {
		var po_area_name = $(this).val();
		$('#po_subtype').empty();
		fillCity($(this),$('#po_type'),'end_type_loader');
		$('.addtional_field').hide();
		$('.subtype_hide').show();
	});
	$(document).on('change', '#po_type', function(e) {
		var po_type_name = $(this).val();
		fillCity($(this),$('#po_subtype'),'end_subtype_loader');
		if(($("#po_area option:selected").text() == 'Accounts') && ($("#po_type option:selected").text() != 'VAT')){
			$('.addtional_field').show();
			$('.subtype_hide').hide();
			$(".activity_detail").find("tr:gt(0)").remove();
		}else{
			$('.addtional_field').hide();
			$('.subtype_hide').show();
		}
	});
	
	if(($("#po_area option:selected").text() == 'Accounts') && ($("#po_type option:selected").text() != 'VAT')){
		$('.addtional_field').show();
		$('.subtype_hide').hide();
	}else{
		$('.addtional_field').hide();
		$('.subtype_hide').show();
	}
	//To make the type read only when template costs are present 
	if($('.activity_detail tr').length > 1){
		$("#po_type option:not(:selected)").attr('disabled', true).trigger('chosen:updated');
		$("#billing_office option:not(:selected)").attr('disabled', true).trigger('chosen:updated');
	}
	
	$(document).on('click', '.job_template_change_status', function(e) {
		 e.preventDefault();
		var poNo = $(this).attr('data-id');
		if($(this).hasClass('job_template_change_status')){
			var changeTo = $(this).attr('data-quote-change-to');
			var flag = 1;
		}else{
			var changeTo = 'live';
			var flag = 0;
		}
		var message = 'Are you sure want to move #<strong>'+poNo+'</strong> to '+changeTo.charAt(0).toUpperCase() + changeTo.slice(1)+' ?';
		
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
		     		        url: appHome+'/potemplate/common_ajax',
		     		        data: {
		     		      	  'poNo' : poNo,
		     		      	  'action_type' : 'change_quote_status',
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
		     		        		window.location.href = appHome+'/jobtemplate-quotes/index';
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
	$(document).on('change', '.custom-page-pagesize', function (e) {
		  var pagelimit = $(this).val();
		  $('#pagesize').val(pagelimit);
		  $('.potemplate-form').submit();
		});
	
	$(document).on('change', '#po_area-filter', function (e) {
		$('.posubtype_val').html('');
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
	}
	if($('#is_equipment_po').val() == 1){
		$('#equipment_po').show();
		$('#other_po').hide();
		if($('#billing_office').val() != ""){
			equipmentSupplier($('#billing_office').val());
		}
		$(document).on('change', '#billing_office', function (e) {
			var billing_office = $(this).val();
			
			$('#equipment_number').empty();
			if(billing_office != ""){
				equipmentTypeFromArea($(this),'equipment_loader');
				equipmentSupplier(billing_office);
			}else{
				$('#equipment_number').empty();
			}
			$('.chosen').chosen().trigger("chosen:updated");
	    	});
		$('.addtional_field').show();
		$('.subtype_hide').hide();
	}
	/*$(document).on('change', '#is_equipment_po', function (e) {
		if($(this).is(":checked")) {
			$('#equipment_po').show();
			$('#other_po').hide();
			$('#is_equipment_po').val(1);
			$(document).on('change', '#billing_office', function (e) {
				var billing_office = $(this).val();
				
				$('#equipment_number').empty();
				if(billing_office != ""){
					equipmentTypeFromArea($(this),'equipment_loader');
				}else{
					$('#equipment_number').empty();
				}
				$('.chosen').chosen().trigger("chosen:updated");
		    	});
		}else{
			$('#is_equipment_po').val(0);
			$('#other_po').show();
			$('#equipment_po').hide();
		}
	});*/
	
	function equipmentTypeFromArea(get,loaderClass){
		var getValue = get.val();
		var loadClass = loaderClass;
		$.ajax({
	        type: 'POST',
	        url: appHome+'/potemplate/common_ajax',
	        data: {
	          'getValue'	: getValue,
	          'action_type' : 'equipment_type_from_area'
	        },
	       // async : false,
	        beforeSend: function() {
	            // setting a timeout
	        	$('.'+loaderClass).show();
	        },
	        success: function(response){
	        	var obj = $.parseJSON(response);
	        	var opt = '<option value=""></option>';
	        		$.each(obj,function(index, data){
	        		opt += '<option value="'+data.id+'">'+data.name+'</option>';
	        		});
	        		
	        			$('#equipment_number').html(opt);
	        		
	        		
	        	$('.chosen').chosen().trigger("chosen:updated");
	        	$('.'+loaderClass).hide();
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	      });
	}
	
	//Autocomplete function to fetch the tank numbers
	 if($("#equipment_num").length > 0){
		
		 $("#equipment_num").autocomplete({
		      source:  appHome+'/potemplate/get_equipment_no_list',
		      minLength: 2,
		      type: "GET",
		      success: function (event, ui) {
		    	 
		      },
			  select: function (event, ui) {
				$(this).val(ui.item.label);
				//$('#hdn_tank_num').val(ui.item.label);
				$('#equipment_id').val(ui.item.value);
				return false;
			  },
			  change: function (event, ui) {
		         if (ui.item === null) {
		        	 	 BootstrapDialog.show({title: 'Error', message : 'Not a valid Equipment Number. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
		             $(this).val('');
		             //$('#hdn_tank_num').val('');
					 $('#equipment_id').val('');
		         }
			  }
		  });
	}
	 
	 $(document).on('change', '#supplier', function(e){
			
			if($('#supplier').val() == ""){
				$("#currency").prop('disabled',false).trigger('chosen:updated');
				$("#actual_currency").prop('disabled',false).trigger('chosen:updated');
				
			}else{
				getSuppCurrency();//To get the currency of supplier
			}
	 });
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
	 	        	$("#currency").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
	 	        	if(supp == 'TBC'){
	 					$("#currency").prop('disabled',false).trigger('chosen:updated');
	 				}
	 	        	
	 	        }
	 	  });
	 }
	 
	 $('#currency').on('change', function() {
		  var currency_id = $(this).chosen().val();
		  switch_specific_currency_icons(currency_id,'estimated-currency');
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
	 $(document).on('click', '.view_new_template', function () {
		 $('.reset_values').val('');
		 $('.highlight').removeClass('highlight');
		 $('.chosen').chosen().trigger("chosen:updated");
	 });
	 $(document).on('click', '#savecost', function (e) {
		 e.preventDefault();
		 $('.highlight').removeClass('highlight');
		 var success = [];
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
		 
		 if((($("#po_area option:selected").text() == 'Accounts') && ($("#po_type option:selected").text() != 'VAT')) || ($('#is_equipment_po').val() == 1)){
			  highlight($('#template_new_view_modal').find('#activity'), '');
			  highlight($('#template_new_view_modal').find('#subtype'), '');
			  highlight($('#template_new_view_modal').find('#supplier'), '');
			  highlight($('#template_new_view_modal').find('#estimated_amt'), '');
			  highlight($('#template_new_view_modal').find('#currency'), '');
			  if(($("#po_area option:selected").text() == 'Accounts') && ($("#po_type option:selected").text() != 'VAT')){
				  highlight($('#template_new_view_modal').find('#cost_centre'), '');
			  }
			  
		 }
		 var check_fields = (success.indexOf(false) > -1);
		 if(check_fields === true){
			      
		 } else {
			var db_activity_id 				= $('#db_detail_id').val();
		 	var activity 					= $('#activity').val();
			var sub_type 					= $('#subtype').val();
			var supplier 					= $('#supplier').val();
			var estimate_amt 				= $('#estimated_amt').val();
			var currency 					= $('#currency').val();
			var cost_centre 				= $('#cost_centre').val();
			var sub_type_text				= $("#subtype option:selected").text();
			var cost_centre_text			= $("#cost_centre option:selected").text();
			var whetherEdited				= $('#db_edited').val();
			
		    var obj							= JSON.stringify({
		    									id 					: db_activity_id,
										    	activity 			: activity,
										    	sub_type 			: sub_type,
										    	supplier 			: supplier,
										    	estimate_amt 		: estimate_amt,
										    	currency 			: currency,
										    	cost_centre 		: cost_centre,
										    	sub_type_text 		: sub_type_text,
										    	cost_centre_text 	: cost_centre_text,
										    	whether_edit 		: whetherEdited
		    								  });
		    
		    if($('#whichtype').val() == ''){
		    	formType = "new";
		    	if($(".activity_detail tr:last td a").attr("data-identify-id") == undefined){
		    		var newClas			= $('.newRow').length + 1;
		    	}else{
		    		var row_id			= $(".activity_detail tr:last td a").attr("data-identify-id");
		    		var newClas			= parseInt(row_id) + 1;
		    	}
		    	
		    }else{
		    	formType = "edit";
		    	var newClas			= $('#cost_detail_id').val();
		    }
		    newClass			= 'newJson_'+newClas;
		    tddata				= jsonrow(obj,newClass,newClas,formType);	
		    
		    if($('#whichtype').val() == ''){
		    	$('.activity_detail tr:last').after(tddata);
		    }else{
		    	var rowid = $('#whichtype').val();
		    	$("."+rowid).parent().parent().html(tddata);
		    }
		    $("#template_new_view_modal").modal('hide');
		}
	 });
	 var deletearray = [];
	 $(document).on('click', '.delete_costing_new', function () {
		 
		 var class_name = $(this);
		 var details_id = $(this).attr("data-id");
		 
		 deletearray.push(details_id);
		 $('#deletedid').val(deletearray);
		 BootstrapDialog.show({
		      title: 'Uh oh!',
		      type: BootstrapDialog.TYPE_DANGER,
		      message: 'Are you sure you want to delete ?',
		      buttons: [{
		             label: 'No',
		             action: function(dialogItself){
		                 dialogItself.close();
		             }
		         },{
		        label: 'Yes',
	            cssClass:'btn-danger',
		        action: function(dialogItself){
		        	class_name.parent().parent().remove();
		        	dialogItself.close();
		        }
		      }]
		    });
	 });
	 $(document).on('click', '.edit_cost_new', function () {
		 $('.reset_values').val('');
		 $('.chosen').chosen().trigger("chosen:updated");
		 var str  		= $(this).attr("data-identify");
		 var curClass	=  str.replace("edit", "new");//alert(curClass);
		 var curid		=  $(this).attr("data-identify-id");
		 var getValue	= $("."+curClass).val();
		 var jsonValues	= JSON.parse(getValue);
		 var dbDetailId	=  $(this).attr("data-detail-id");
		 
		 $('#activity').val(jsonValues["activity"]);
		 $('#subtype').val(jsonValues["sub_type"]);
		 $('#supplier').val(jsonValues["supplier"]);
		 $('#supplier').trigger('change');
		 $('#estimated_amt').val(jsonValues["estimate_amt"]);
		 $('#currency').val(jsonValues["currency"]);
		 $('#cost_centre').val(jsonValues["cost_centre"]);
		 $('.chosen').chosen().trigger("chosen:updated");
		 $('#whichtype').val(str);
		 $('#cost_detail_id').val(curid);
		 $('#db_detail_id').val(dbDetailId);
		 if(dbDetailId != ""){
			 $('#db_edited').val("edited");
		 }
	 });
	 
	 function jsonrow(obj,newClass,newClas,$formType){
		 var jsonValues	= JSON.parse(obj);
		 var amount		= parseFloat(jsonValues["estimate_amt"]).toFixed(2);
		 var tddata 	= "";
			 if($formType == 'new'){
				 tddata +=  '<tr>';
			 }
			 	tddata += 
			'<td class="text-left">'+
			'<input type="hidden" name="cost_detail[]" id="cost_detail" class="'+newClass+' newRow" value=\''+obj+'\'>'+jsonValues["activity"]+'</td>'+
			'<td class="text-left" >'+jsonValues["sub_type_text"]+'</td>'+
			'<td class="text-left" >'+jsonValues["supplier"]+'</td>'+
			'<td class="text-right" >'+amount+'</td>'+
			'<td class="text-left" >'+jsonValues["currency"]+'</td>';
			if($('#is_equipment_po').val() == 0){ 	
				tddata += '<td class="text-left">'+jsonValues["cost_centre_text"]+'</td>';
			}
				tddata += '<td class="text-center">'+
			'<a class="edit_cost_new editJson_'+newClas+'" id="edit_cost_new" href="" data-identify="editJson_'+newClas+'" data-identify-id="'+newClas+'" title="View PO Template" data-toggle="modal" data-target="#template_new_view_modal"><i class="fa fa-pencil"></i></a>&nbsp;&nbsp;'+
			'<a style="color:red" class="delete_costing_new" data-id="" href="javascript:void(0);" title="Delete Document"><i class="fa fa-trash-o"></i></a></td>';
			if($formType == 'new'){
				tddata += '</tr>';
			}
			return tddata;
	 }
	 //To get the subtype accourding to the billing office
	 function equipmentSupplier(billOffice){
			
			$.ajax({
		        type: 'POST',
		        url: appHome+'/potemplate/common_ajax',
		        data: {
		          'billingOffice'	: billOffice,
		          'action_type' 	: 'equipment_supplier'
		        },
		        success: function(response){
		        	var obj = $.parseJSON(response);
		        	var opt = '<option value=""></option>';
		        		$.each(obj,function(index, data){
		        		opt += '<option value="'+data.id+'">'+data.name+'</option>';
		        		});
		        		$("#supplier").empty().append(opt);
		        	$('.chosen').chosen().trigger("chosen:updated");
		        },
		        error: function(response){
		          $('html, body').animate({ scrollTop: 0 }, 400);
		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
		      });
		}
});
