$(document).ready(function(){

	$('.uppercase').keyup(function(){
        $(this).val($(this).val().toUpperCase());
    });

	if($('.more').length > 0){ showCommentMoreLessCommon(150); }
	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
	var ar_required_fields = [];
	var ar_required_date_fields = [];
	var $ai_statement_json = [];
	var $ext_ref_json = [];
	var $routingc_json = [];
	var $seals_json = [];
	var $prod_doc_json = [];
	var $declaration_items_json = [];
	var $item_tax_lines_json = [];
	var $item_prev_docs_json = [];
	var $item_packages_json = [];
	var $item_containers_json = [];
	var $item_ai_stmt_json = [];
	var $item_prod_doc_json = [];
	var success = []
	
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
		
	$(document).on('change', '.custom-page-pagesize', function (e) {
		  var pagelimit = $(this).val();
		  $('#pagesize').val(pagelimit);
		  $('.declaration-form').submit();
	});

	$(document).on('click', '.view-detail-tr', function (e) {
		var did = $(this).data('did')
		$(this).find('span').toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
		$('.portal-show-detail-class[data-did="' + did + '"]').toggle();
	});

	$(document).on('click', '#expand-declaration', function (e) {
		e.preventDefault();
		if($(this).find('span').hasClass('glyphicon-plus')){
			$(this).find('span').removeClass('glyphicon-plus glyphicon-minus').addClass('glyphicon-minus');
			$('.view-detail-tr').find('span').removeClass('glyphicon-plus glyphicon-minus').addClass('glyphicon-minus');
			$('.portal-show-detail-class').show();
		}else{
			$(this).find('span').removeClass('glyphicon-plus glyphicon-minus').addClass('glyphicon-plus');
			$('.view-detail-tr').find('span').removeClass('glyphicon-plus glyphicon-minus').addClass('glyphicon-plus');
			$('.portal-show-detail-class').hide();
		}
	});

	$(document).on('click', '.view-item-details', function (e) {
		var curr = 	$(this);
		var did = curr.attr('data-did');
		curr.find('span').toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
		curr.parent().next('.portal-item-show-detail-class').toggle();
		if(curr.attr('isajaxsent') == 0){
			$.ajax({
				url:appHome+'/customer-portal/common_ajax',
				type: 'post',
				data: {
							'did' 		   : did,
							'action_type'  : 'get_lisitng_item_details'
					  },
				success:function(data){
					curr.parent().next('.portal-item-show-detail-class').html(data);
					curr.attr('isajaxsent',1);
				}
			});
		}
	});

	$(document).on('click', '.view-custom-details', function (e) {
		var curr = 	$(this);
		var did = curr.attr('data-did');
		var custid = curr.attr('data-custid');
		var consorid = curr.attr('data-consorid');
		var consigeeid = curr.attr('data-consigeeid');
		curr.find('span').toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
		curr.parent().next('.portal-custom-show-detail-class').toggle();
		if(curr.attr('isajaxsent') == 0){
			$.ajax({
				url:appHome+'/customer-portal/common_ajax',
				type: 'post',
				data: {
							'did' 		   : did,
							'custid'	   : custid,
							'action_type'  : 'get_lisitng_custom_details'
					  },
				success:function(data){
					curr.parent().next('.portal-custom-show-detail-class').html(data);
					curr.attr('isajaxsent',1);
				}
			});
		}
	});



	$(document).on('click', '.add_new_comments', function (e) {
		  $('#notes').val('');
		  var portal_id = $(this).data("id") ;
		  var comment_type = $(this).attr("data-comment-type");
		  var value_yes = $(this).attr("data-value");

		  $('#portal-id').val(portal_id);
		  $('#comment-type').val(comment_type);
		  $('#comment-value').val(value_yes);

		  if(value_yes == "yes"){
		  	$.ajax({
				url:appHome+'/customer-portal/common_ajax',
				type: 'post',
				data: {
							'id' 		   : portal_id,
							'comment_type' : comment_type,
							'action_type'  : 'get_comment'
					  },
				success:function(data){
					if(data){
						$('#notes').val(data);
					}
					
				}
			});
		  }
	});

	$(document).on('click', '.new_comments_submit', function (e) {
	var id 				= $('#portal-id').val();
	var comment_type 	= $('#comment-type').val();
	var comment_notes 	= $('#notes').val();

		$.ajax({
			url:appHome+'/customer-portal/common_ajax',
			type: 'post',
			data: {
						'id' 		   : id,
						'comment_type' : comment_type,
						'comments'     : comment_notes,
						'action_type'  : 'save_comment'
				  },
			success:function(data){
				$('#notes').val('');
				if(comment_type == 'customerVisible'){
					$('#cusv'+id).html(comment_notes);
				}else if(comment_type == 'internal')	{
					$('#cusi'+id).html(comment_notes);
				}
	
				$('#customer_note_modal').modal('hide');
				$('#responsenote').hide().html('<p class="alert alert-success">Note added</p>').fadeIn();
				$('#responsenote').delay(3000).slideUp();
			}
		});
	});

	var $customer_cost_obj = "";
	$(document).on('click', '.customer_add_cost', function (e) {
		$customer_cost_obj = $(this);
		cus_id = $(this).data("id") ;
		$('#cost').val($(this).attr("data-value"));
		$('#cus_id').val(cus_id);
	});

	$(document).on('click', '.new_cost_submit', function (e) {
		var id 		= $('#cus_id').val();
		var cost 	= $('#cost').val();
		
		$.ajax({
			url:appHome+'/customer-portal/common_ajax',
			type: 'post',
			data: {
						'id' 		   : id,
						'cost'		   : cost,
						'action_type'  : 'save_cost'
				  },
			success:function(data){
				$customer_cost_obj.attr("data-value",cost); 
				$('#customer_cost_modal').modal('hide');
				$('#responsenote').hide().html('<p class="alert alert-success">Cost added</p>').fadeIn();
					$('#responsenote').delay(3000).slideUp();
			}
		});
	});

	//Delete
	$(document).on('click', '.delete-cus-btn', function(e){ 
		e.preventDefault();
		
		var delete_url = $(this).attr('href'),
			cus_id = $(this).data('cus-id'),
			$this = $(this),
			return_url = window.location.href;
		
		BootstrapDialog.confirm('Are you sure you want to delete?', function(result){
			if(result) {
				$.ajax({
					type: 'POST',
					url: delete_url,
					data: {'cus_id' : cus_id
					},
					success: function(response){
						window.location.reload();
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

	//view declaration portal
	$(document).on('click', '.view_customer_portal', function(e){ 
		$('.view_small_loader').show();
		$('.reset_values').html('');
		var cus_id = $(this).data('id');
		$.ajax({ 
			type: 'POST',
			dataType: 'json',
			url: appHome+'/customer-portal/common_ajax',
			data: {
				'cus_id' : cus_id,
				'action_type' : 'view_cust_detail'
				  },
			success: function(response){
				$('.view_small_loader').hide();
				if(response != ""){
					$('#modal_cus_name').html(response.cus_name);
					$('#modal_consigname').html(response.consigname);
					$('#modal_consigneename').html(response.consigneename);
					$('#modal_customer_reference').html(response.customer_reference);
					$('#modal_request_type').html(response.request_type);
					$('#modal_date_received').html(response.date_received);
					$('#modal_date_required_by').html(response.date_required_by);
					$('#modal_container').html(response.container);
					$('#modal_container_type').html(response.container_type);
					$('#modal_goods').html(response.goods);
					$('#modal_cust_vis_comment').html(response.cust_vis_comment);
					$('#modal_internal_comment').html(response.internal_comment);
					$('#modal_number_of_items').html(response.number_of_items);
					$('#modal_cost').html(response.cost);
					$('#modal_date_invoiced').html(response.date_invoiced);

					$('#modal_template_id').html(response.template_id);
					$('#modal_record_type').html(response.record_type);
					$('#modal_docs_received').html(response.docs_received);
					$('#modal_date_cleared').html(response.date_cleared);
					$('#modal_external_job_reference').html(response.external_job_reference);
					$('#modal_declarant_badge').html(response.declarant_badge);
					$('#modal_declaration_badge_location_iata_port_code').html(response.declaration_badge_location_iata_port_code);
					$('#modal_declaration_badge_location_ocean_port_code').html(response.declaration_badge_location_ocean_port_code);
					$('#modal_declaration_currency').html(response.declaration_currency);
					$('#modal_declaration_type').html(response.declaration_type);
					$('#modal_sub_division').html(response.sub_division);
					$('#modal_customs_summary_time').html(response.customs_summary_time);
					$('#modal_declaration_status').html(response.declaration_status);
					$('#modal_trader_reference').html(response.trader_reference);
					$('#modal_representation').html(response.representation);
					$('#modal_declaration_ucr').html(response.declaration_ucr);
					$('#modal_declaration_ucr_part').html(response.declaration_ucr_part);
					$('#modal_master_ucr').html(response.master_ucr);
					$('#modal_dispatch_country').html(response.dispatch_country);
					$('#modal_dispatch_country_fec_indicator').html(response.dispatch_country_fec_indicator);
					$('#modal_transport_country').html(response.transport_country);
					$('#modal_transport_country_fec_indicator').html(response.transport_country_fec_indicator);
					$('#modal_transport_identity').html(response.transport_identity);
					$('#modal_invoice_currency').html(response.invoice_currency);
					$('#modal_invoice_amount').html(response.invoice_amount);
					$('#modal_border_transport_mode').html(response.border_transport_mode);
					$('#modal_inland_transport_mode').html(response.inland_transport_mode);
					$('#modal_goods_location_country').html(response.goods_location_country);
					$('#modal_goods_location_port_iata_port').html(response.goods_location_port_iata_port);
					$('#modal_goods_location_port_ocean_port').html(response.goods_location_port_ocean_port);
					$('#modal_goods_location_shed').html(response.goods_location_shed);
					$('#modal_first_deferment_prefix').html(response.first_deferment_prefix);
					$('#modal_first_deferment_number').html(response.first_deferment_number);
					$('#modal_second_deferment_prefix').html(response.second_deferment_prefix);
					$('#modal_second_deferment_number').html(response.second_deferment_number);
					$('#modal_registered_consignee').html(response.registered_consignee);
					$('#modal_government_contractor').html(response.government_contractor);
					$('#modal_warehouse_premises_identity_number').html(response.warehouse_premises_identity_number);
					$('#modal_warehouse_premises_name').html(response.warehouse_premises_name);
					$('#modal_warehouse_premises_street').html(response.warehouse_premises_street);
					$('#modal_warehouse_premises_city').html(response.warehouse_premises_city);
					$('#modal_warehouse_premises_post_code').html(response.warehouse_premises_post_code);
					$('#modal_warehouse_premises_country_code').html(response.warehouse_premises_country_code);
					$('#modal_supervising_office_name').html(response.supervising_office_name);
					$('#modal_supervising_office_street').html(response.supervising_office_street);
					$('#modal_supervising_office_city').html(response.supervising_office_city);
					$('#modal_supervising_office_post_code').html(response.supervising_office_post_code);
					$('#modal_supervising_office_country_code').html(response.supervising_office_country_code);
					$('#modal_airport_of_loading_iata_port').html(response.airport_of_loading_iata_port);
					$('#modal_airport_of_loading_ocean_port').html(response.airport_of_loading_ocean_port);
					$('#modal_air_transport_costs').html(response.air_transport_costs);
					$('#modal_freight_charge_currency').html(response.freight_charge_currency);
					$('#modal_freight_charge_amount').html(response.freight_charge_amount);
					$('#modal_freight_apportionment_code').html(response.freight_apportionment_code);
					$('#modal_allowable_discount_currency').html(response.allowable_discount_currency);
					$('#modal_allowable_discount_amount').html(response.allowable_discount_amount);
					$('#modal_allowable_discount_percentage').html(response.allowable_discount_percentage);
					$('#modal_allowable_discount_not_specified').html(response.allowable_discount_not_specified);
					$('#modal_insurance_currency').html(response.insurance_currency);
					$('#modal_insurance_amount').html(response.insurance_amount);
					$('#modal_other_charges_currency').html(response.other_charges_currency);
					$('#modal_other_charges_amount').html(response.other_charges_amount);
					$('#modal_vat_adjustment_currency').html(response.vat_adjustment_currency);
					$('#modal_vat_adjustment_amount').html(response.vat_adjustment_amount);
					$('#modal_reason_for_amendment').html(response.reason_for_amendment);
					$('#modal_cus_final_cost').html(response.cus_final_cost);
					$('#modal_cus_final_cost_cur').html(response.cus_final_cost_cur);

					$('#modal_destination_country').html(response.destination_country_code);
					$('#modal_destination_fec_indicator').html(response.destination_country_fec_indicator);
					$('#modal_transport_payment_method').html(response.transport_charges_payment_method);
					$('#modal_transport_identity_inland').html(response.transport_identity_inland);
					$('#modal_goods_arrived_inland').html(response.goods_arrived_inland);
					$('#modal_goods_departure_inland').html(response.goods_departure_inland);
					$('#modal_goods_departure_date').html(response.goods_departure_date);
					$('#modal_custom_office_of_exit').html(response.customs_office_of_exit);
					$('#modal_registered_consigor').html(response.registered_consignor);
					
					$('#modal_commercial_invoice_no').html(response.commercial_invoice_no);
					$('#modal_commercial_invoice_currency').html(response.commercial_invoice_currency);
					$('#modal_statement').html(response.statement);
				}
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	});

	//Change status to Archive/Live
	$(document).on('click', '.customer_change_status', function(e){ 
		e.preventDefault();
		
		var declaration_id = $(this).data('id');
		var from_status = $(this).data('changeto');
		
		if(from_status == 'archive'){
			var mtype = BootstrapDialog.TYPE_PRIMARY;
			var mButton = 'btn-primary';
			var message = 'Are you sure you want to archive this record ?'
		}else{
			var mtype = BootstrapDialog.TYPE_SUCCESS;
			var mButton = 'btn-success';
			var message = 'Are you sure you want to make this record Live ?'
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
								url:appHome+'/customer-portal/common_ajax',
								data: {'declaration_id' : declaration_id
									  ,'from_status' : from_status
									  ,'action_type'  : 'change_status'
								},
								beforeSend: function() {
					     		        	$('.bootstrap-dialog-footer-buttons > .'+mButton).html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
						     		        $('.bootstrap-dialog-footer-buttons > .'+mButton).attr('disabled','disabled');
					     		        },
								success: function(response){
									window.location.reload();
									localStorage.setItem('response', response);
								},
								error: function(response){
									BootstrapDialog.show({title: 'Error', message : 'Unable to changes status. Please try later.',
										 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
									});
								}
							});
		             }
	         }]
	     });

	});


	/**
	* Customer Portal edit and update
	*/
	$('.create-import-declaration, .edit-import-declaration').click(function(e){
	  $('.highlight').removeClass('highlight');
	  e.preventDefault();
	  var form = '#declaration-form';
	   success = [];

	  $.each(ar_required_fields, function(index, value){
			var inputelement = $('#' + $.trim(value));
			highlight(inputelement, '');
	  });

	  $.each(ar_required_date_fields, function(index, value){
			var inputelement = $('#' + $.trim(value));
			highlight(inputelement, '');
	  });

	  $.each(validationElements, function(index, value){
		validateDeclarationElements(value.name);
	  });

	  //Store multi data into input 
	  $("#ai_statement_json").val(encodeURI(JSON.stringify($ai_statement_json)));
	  $("#ext_ref_json").val(encodeURI(JSON.stringify($ext_ref_json)));
	  $("#prod_doc_json").val(encodeURI(JSON.stringify($prod_doc_json)));
	  $("#routing_country_json").val(encodeURI(JSON.stringify($routingc_json)));
	  $("#seals_json").val(encodeURI(JSON.stringify($seals_json)));

	  var check_fields = (success.indexOf(false) > -1);
	  
	  /**
	  * update edit-customer portal
	  */
	  if($(this).hasClass('edit-import-declaration')){
			var declaration_id = $('#declaration_id').val();
			var portal_type = $("#portal_type").val();
	
		    if(check_fields === true){
		      $('html, body').animate({ scrollTop: 0 }, 400);
		      $('form').find('#response').empty().prepend(alert_required).fadeIn();
		    } else {
		      $(this).prop('disabled','disabled');
		      $.ajax({
		        type: 'POST',
		        url: appHome + '/customer-portal/' + portal_type + '/' + declaration_id + '/update',
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
	  * create customer portal
	  */
	  if($(this).hasClass('create-import-declaration')){
		   	 var declaration_id = $('#declaration_id').val();
			 var portal_type = $("#portal_type").val();
			 var save_and_continue = this.dataset.save_and_continue;
		     if(check_fields === true){
		       $('html, body').animate({ scrollTop: 0 }, 400);
		       $('form').find('#response').empty().prepend(alert_required).fadeIn();
		     } else {
		       $(this).prop('disabled','disabled');
		       $.ajax({
		         type: 'POST',
		         url: appHome + '/customer-portal/' + portal_type + '/create',
		         data: $(form).serialize().replace(/%5B%5D/g, '[]'),
		         success: function(response){
					 response = JSON.parse(response)
					 if(save_and_continue == 1){
						window.location.href = ($('#edit_path').val()).replace('declaration_id', response.declaration_id);
					 }
					 else{
						 window.location.href = $('#returnpath').val();
					 }
		           localStorage.setItem('response', response.message);
		         },
		         error: function(response){
		           $('html, body').animate({ scrollTop: 0 }, 400);
		           $('form').find('#response').empty().prepend(alert_error).fadeIn();
		         }
		       });
		     }
	  }

	
	});

	/**
	* Load time change 
	*/
	if($("#page").val() == "edit"){
		ar_required_fields 	  = $("#required_fields").val().split(',');
		ar_required_date_fields  = $("#required_date_fields").val().split(',');

		$.each(ar_required_fields, function(index, value){
			var inputelement = $.trim(value);
			$("#"+inputelement).prev('label').addClass('required');
		});
		
		$.each(ar_required_date_fields, function(index, value){
			var inputelement = $.trim(value);
			$("#"+inputelement).parent('div').prev('label').addClass('required');
		});
	}

	//Autocomplete Trader
	if($("#trader_eori").length > 0){
		$("#trader_eori").autocomplete({
		      source:  appHome+'/customer-portal/get_trader',
		      minLength: 2,
		      type: "GET",
		      success: function (event, ui) {},
			  select: function (event, ui) {
			    	event.preventDefault();
					$(this).val(ui.item.label);
					$("#trader_select").show();
					$("#hdn_trader_name").val(ui.item.name);
					$("#hdn_trader_id").val(ui.item.value);
					$("#trader_id").val(ui.item.value);
					$("#trader_eori_number").val(ui.item.trader_identification_number);
					$("#trader_name").val(ui.item.name);
					$("#trader_street").val(ui.item.street);
					$("#trader_city").val(ui.item.city);
					$("#trader_post").val(ui.item.post_code);
					$("#trader_country").val(ui.item.country_code).trigger("chosen:updated");
					$("#trader_short_code").val(ui.item.short_code);
					$("#trader_cust_code").val(ui.item.btl_cus_code);
					return false;
			  },
			  focus: function(event, ui) {
			        //event.preventDefault();
			        //$(this).val(ui.item.label);
					//$("#trader_select").show();
			  },
			  change: function (event, ui) {
		         if (ui.item === null) {
		            $("#hdn_trader_name").val('');
					$("#hdn_trader_id").val('');
					
					$("#trader_id").val("");
					$("#trader_eori_number").val("");
					$("#trader_name").val('');
					$("#trader_street").val('');
					$("#trader_city").val('');
					$("#trader_post").val('');
					$("#trader_country").val('').trigger("chosen:updated");
					$("#trader_short_code").val('');
					$("#trader_cust_code").val('');
					$("#trader_select").hide();
		         }
			  }
		});
	}

	//Deactivate of modal
	$('#trader_modal').on('hidden.bs.modal', function(){
	  	$("#hdn_trader_name").val('');
		$("#hdn_trader_id").val('');
		
		$("#trader_id").val('');
		$("#trader_eori_number").val('');
		$("#trader_eori").val('');
		$("#trader_name").val('');
		$("#trader_street").val('');
		$("#trader_city").val('');
		$("#trader_post").val('');
		$("#trader_country").val('').trigger("chosen:updated");
		$("#trader_short_code").val('');
		$("#trader_cust_code").val('');
		$("#trader_select").hide();
				
	  	$('#trader_modal').modal('hide');
	});

	//Activate modal
	var $trader_obj = "";
	$(document).on('click', '.get-trader', function (e) {
		$trader_obj = $(this);
		$data = $trader_obj.prev('.trader_name').data();
		if($trader_obj.prev('.trader_name').attr('id') == 'customer_trader_name' && $("#page_type").val() == "edit"){
			$('#trader_save').hide();
			$('#trader-select-auto').hide();
			$("#trader_clean").hide();
			$('.trader-modal-input').attr("readonly", "readonly");
			$('.trader-modal-select').attr("disabled", "disabled");
		}
		else{
			$('#trader_save').show();
			$('#trader-select-auto').show();
			$("#trader_clean").show();
			$('.trader-modal-input').removeAttr("readonly");
			$('.trader-modal-select').removeAttr("disabled");
		}
		$("#hdn_trader_name").val($data.name);
		$("#hdn_trader_id").val($data.trader_id);
		
		$("#trader_eori").val('');
		$("#trader_id").val($data.trader_id);
		$("#trader_eori_number").val($data.eori);
		$("#trader_name").val($data.name);
		$("#trader_street").val($data.street);
		$("#trader_city").val($data.city);
		$("#trader_post").val($data.post);
		$("#trader_country").val($data.country).trigger("chosen:updated");
		$("#trader_short_code").val($data.short_code);
		$("#trader_cust_code").val($data.cust_code);
		$('#response_trader_modal').html('');
		$('#trader_modal').modal('show');
	});
	
	//Select Trader 	
	$(document).on('click', '#trader_select', function (e) {
		$trader_obj.parent('div').find('.trader_id').val($("#hdn_trader_id").val());
		$trader_obj.parent('div').find('.trader_name').val($("#hdn_trader_name").val());
		
		$data = $trader_obj.prev('.trader_name').data();
		$data.trader_id = $("#hdn_trader_id").val();
		$data.name = $("#trader_name").val(); 
		$data.eori = $("#trader_eori_number").val();
		$data.street = $("#trader_street").val();
		$data.city = $("#trader_city").val();
		$data.post = $("#trader_post").val();
		$data.country = $("#trader_country").val();
		$data.short_code = $("#trader_short_code").val();
		$data.cust_code = $("#trader_cust_code").val();

		$('#trader_modal').modal('hide');
	});
	
	//Clear selection
	$(document).on('click', '#trader_clean', function (e) {
		$("#hdn_trader_name").val('');
		$("#hdn_trader_id").val('');
		
		$("#trader_eori").val("");
		$("#trader_id").val("");
		$("#trader_eori_number").val("");
		$("#trader_name").val('');
		$("#trader_street").val('');
		$("#trader_city").val('');
		$("#trader_post").val('');
		$("#trader_country").val('').trigger("chosen:updated");
		$("#trader_short_code").val('');
		$("#trader_cust_code").val('');
		$("#trader_select").hide();
	});
	
	//Trader Save/Update  	
	$(document).on('click', '#trader_save', function (e) {

		success = [];
		$('#trander-form .highlight').removeClass('highlight');
		$.each(traderValidationArr, function(index, value){
			validateDeclarationElements(value.name, 'trader');
		});
		var check_fields = (success.indexOf(false) > -1);
		if(check_fields !== true){
			//action_type : manage_trader
			$.ajax({
		         type: 'POST',
		         url: appHome + '/customer-portal/common_ajax',
		         data: $("#trander-form").serialize().replace(/%5B%5D/g, '[]'),
		         success: function(response){
					var parsed_data = JSON.parse(response);
					$trader_obj.parent('div').find('.trader_id').val(parsed_data.trader_id);
					$trader_obj.parent('div').find('.trader_name').val($("#trader_name").val());
					
					$data = $trader_obj.prev('.trader_name').data();
					$data.trader_id = parsed_data.trader_id;
					$data.name = $("#trader_name").val(); 
					$data.eori = $("#trader_eori_number").val();
					$data.street = $("#trader_street").val();
					$data.city = $("#trader_city").val();
					$data.post = $("#trader_post").val();
					$data.country = $("#trader_country").val();
					$data.short_code = $("#trader_short_code").val();
					$data.cust_code = $("#trader_cust_code").val();
					
					$('#trader_modal').modal('hide');
					
					$('#response').empty().html('<p class="alert alert-success">Trader Updated successfully</p>').fadeIn().fadeOut(5000);
		         },
		         error: function(response){
		           $('html, body').animate({ scrollTop: 0 }, 400);
		           $('form').find('#response').empty().prepend(alert_error).fadeIn().fadeOut(5000);
		         }
		    });
		}
		else{
			var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
			$('#trader_modal').animate({ scrollTop: 0 }, 'slow');
			$('#response_trader_modal').empty().prepend(alert_required).fadeIn();
		}
	});

	function listAiStatementJson(){
		if($ai_statement_json == ""){
			$ai_statement_json = $("#ai_statement_json").val();
			if($ai_statement_json != ""){
				$ai_statement_json = decodeURIComponent($ai_statement_json);
				$ai_statement_json = JSON.parse($ai_statement_json);
			}
		}
		
		$("#ai-statement-table tbody tr").remove();
		$count = 0;
		$.each($ai_statement_json, function(index, data) {
			if(data.flag != 'DELETE' && data.flag != 'NEW-DELETE'){
				$td = "<tr>";
				$td += "<td>" + data.code + "</td>";
				$td += "<td>" + data.text + "</td>";
				$td += "<td class='center-cell'><a class='multi-edit' data-view='ai_statement' data-id='" + data.row_id + "' href='javascript:void(0)' title='Edit'><span class='fa fa-pencil'></span></a> ";
				$td += "<a class='delete-icon multi-delete' data-view='ai_statement' data-id='" + data.row_id + "' href='javascript:void(0)' title='Delete'><i class='fa fa-trash-o'></i></a>";
				$td += "</td></tr>";
				
				$("#ai-statement-table tbody").append($td);
				$count++;
			}
    	});
		 
		if($count == 0){
			$("#ai-statement-table tbody").append('<tr id="no-rec-tr"><td class="center-cell" colspan="3">No records found.</td></tr>');		
		}
	}
	
	function listExternalRefJson(){
		if($ext_ref_json == ""){
			$ext_ref_json = $("#ext_ref_json").val();
			if($ext_ref_json != ""){
				$ext_ref_json = decodeURIComponent($ext_ref_json);
				$ext_ref_json = JSON.parse($ext_ref_json);
			}
		}
		
		$("#external-ref-table tbody tr").remove();
		$count = 0;
		$.each($ext_ref_json, function(index, data) {
			if(data.flag != 'DELETE' && data.flag != 'NEW-DELETE'){
				$td = "<tr>";
				$td += "<td>" + data.external_reference + "</td>";
				$td += "<td class='center-cell'><a class='multi-edit' data-view='ext_ref' data-id='" + data.row_id + "' href='javascript:void(0)' data-id='' title='Edit'><span class='fa fa-pencil'></span></a> ";
				$td += "<a class='delete-icon multi-delete' data-view='ext_ref' data-id='" + data.row_id + "' href='javascript:void(0)' data-id='' title='Delete'><i class='fa fa-trash-o'></i></a>";
				$td += "</td></tr>";
				
				$("#external-ref-table tbody").append($td);
				$count++;
			}
    	});
		
		if($count == 0){
			$("#external-ref-table tbody").append('<tr id="no-rec-tr"><td class="center-cell" colspan="2">No records found.</td></tr>');		
		}
		 
	}

	function listSealsJson(){
		if($seals_json == ""){
			$seals_json = $("#seals_json").val();
			if($seals_json != ""){
				$seals_json = decodeURIComponent($seals_json);
				$seals_json = JSON.parse($seals_json);
			}
		}
		$("#seals-table tbody tr").remove();
		$count = 0;
		$.each($seals_json, function(index, data) {
			if(data.flag != 'DELETE' && data.flag != 'NEW-DELETE'){
				$td = "<tr>";
				$td += "<td>" + data.seal + "</td>";
				$td += "<td class='center-cell'><a class='multi-edit' data-view='seals' data-id='" + data.row_id + "' href='javascript:void(0)' data-id='' title='Edit'><span class='fa fa-pencil'></span></a> ";
				$td += "<a class='delete-icon multi-delete' data-view='seals' data-id='" + data.row_id + "' href='javascript:void(0)' data-id='' title='Delete'><i class='fa fa-trash-o'></i></a>";
				$td += "</td></tr>";

				$("#seals-table tbody").append($td);
				$count++;
			}
		});

		if($count == 0){
			$("#seals-table tbody").append('<tr id="no-rec-tr"><td class="center-cell" colspan="2">No records found.</td></tr>');		
		}
	}

	function listRoutingCountryJson(){
		if($routingc_json == ""){
			$routingc_json = $("#routing_country_json").val();
			if($routingc_json != ""){
				$routingc_json = decodeURIComponent($routingc_json);
				$routingc_json = JSON.parse($routingc_json);
			}
		}
		$("#routing-country-table tbody tr").remove();
		$count = 0;
		$.each($routingc_json, function(index, data) {
			if(data.flag != 'DELETE' && data.flag != 'NEW-DELETE'){
				$td = "<tr>";
				$td += "<td>" + data.routing_country_name + "</td>";
				$td += "<td class='center-cell'><a class='multi-edit' data-view='routing_counties' data-id='" + data.row_id + "' href='javascript:void(0)' data-id='' title='Edit'><span class='fa fa-pencil'></span></a> ";
				$td += "<a class='delete-icon multi-delete' data-view='routing_counties' data-id='" + data.row_id + "' href='javascript:void(0)' data-id='' title='Delete'><i class='fa fa-trash-o'></i></a>";
				$td += "</td></tr>";

				$("#routing-country-table tbody").append($td);
				$count++;
			}
		});

		if($count == 0){
			$("#routing-country-table tbody").append('<tr id="no-rec-tr"><td class="center-cell" colspan="2">No records found.</td></tr>');		
		}

	}
	
	function listProdDocJson(){
		if($prod_doc_json == ""){
			$prod_doc_json = $("#prod_doc_json").val();
			if($prod_doc_json != ""){
				$prod_doc_json = decodeURIComponent($prod_doc_json);
				$prod_doc_json = JSON.parse($prod_doc_json);
			}
		}
		
		$("#produced-doc-modal-table tbody tr").remove();
		$count = 0;
		$.each($prod_doc_json, function(index, data) {
			if(data.flag != 'DELETE' && data.flag != 'NEW-DELETE'){
				$td = "<tr>";
				$td += "<td>" + data.code + "</td>";
				$td += "<td>" + data.status + "</td>";
				$td += "<td>" + data.reference + "</td>";
				$td += "<td class='center-cell'>" + data.part + "</td>";
				$td += "<td class='center-cell'>" + data.quantity + "</td>";
				$td += "<td>" + data.reason + "</td>";
				$td += "<td class='center-cell'><a class='multi-edit' data-view='prod_doc' data-id='" + data.row_id + "' href='javascript:void(0)' data-id='' title='Edit'><span class='fa fa-pencil'></span></a> ";
				$td += "<a class='delete-icon multi-delete' data-view='prod_doc' data-id='" + data.row_id + "' href='javascript:void(0)' data-id='' title='Delete'><i class='fa fa-trash-o'></i></a>";
				$td += "</td></tr>";
				
				$("#produced-doc-modal-table tbody").append($td);
				$count++;
			}
    	});
		
		if($count == 0){
			$("#produced-doc-modal-table tbody").append('<tr id="no-rec-tr"><td class="center-cell" colspan="8">No records found.</td></tr>');		
		}
		 
	}
	
	//List Json data 
	if($("#page").val() == "edit"){
		listAiStatementJson();
		listExternalRefJson();
		listProdDocJson();	
		listRoutingCountryJson();
		listSealsJson();
	}

	$(document).on('click', '.multi-edit', function (e) {
		var modaldata = $(this).data();		
		
		if(modaldata.view == "ai_statement"){
			$("#ai-id").val(modaldata.id);
			$("#ai-code").val($ai_statement_json[modaldata.id].code);
			$("#ai-text").val($ai_statement_json[modaldata.id].text);
			$("#ai-declaration-statement-id").val($ai_statement_json[modaldata.id].declaration_ai_statement_id);
			$('#ai_statement_modal').modal('show');
			
		} else if(modaldata.view == "ext_ref"){
			$("#external-reference-id").val(modaldata.id);
			$("#external-reference").val($ext_ref_json[modaldata.id].external_reference);
			$("#declaration_ext_ref_id").val($ext_ref_json[modaldata.id].declaration_ext_ref_id);
			$('#exterbak_ref_modal').modal('show');
			
		} else if(modaldata.view == "prod_doc"){
			$("#produced-doc-id").val(modaldata.id);
			$("#produced-doc-code").val($prod_doc_json[modaldata.id].code);
			$("#produced-doc-status").val($prod_doc_json[modaldata.id].status);
			$("#produced-doc-reference").val($prod_doc_json[modaldata.id].reference);
			$("#produced-doc-part").val($prod_doc_json[modaldata.id].part);
			$("#produced-doc-quantity").val($prod_doc_json[modaldata.id].quantity);
			$("#produced-doc-reason").val($prod_doc_json[modaldata.id].reason);
			$("#declaration_prod_doc_id").val($prod_doc_json[modaldata.id].declaration_prod_doc_id);
			$('#produced_doc_modal').modal('show');

		}else if(modaldata.view == "routing_counties"){
			$("#routing-counties-id").val(modaldata.id);
			$("#routing_country").val($routingc_json[modaldata.id].routing_country).trigger("chosen:updated");
			$("#declaration_rc_id").val($routingc_json[modaldata.id].declaration_rc_id);
			$('#routing_country_modal').modal('show');

		}else if(modaldata.view == "seals"){
			$("#declaration_seal_id").val(modaldata.id);
			$("#seals-text").val($seals_json[modaldata.id].seal);
			$("#seals_declaration_id").val($seals_json[modaldata.id].seals_declaration_id);
			$('#seals_modal').modal('show');
		}

	});


	$(document).on('click', '.multi-delete', function (e) {
		var modaldata = $(this).data();		
		
		if(modaldata.view == "ai_statement"){
			$ai_statement_json[modaldata.id].flag = ($ai_statement_json[modaldata.id].declaration_ai_statement_id == "") ? "NEW-DELETE" : "DELETE";
			listAiStatementJson();
		} else if(modaldata.view == "ext_ref"){
			$ext_ref_json[modaldata.id].flag = ($ext_ref_json[modaldata.id].declaration_ext_ref_id == "") ? "NEW-DELETE" : "DELETE";
			listExternalRefJson();
		} else if(modaldata.view == "prod_doc"){
			$prod_doc_json[modaldata.id].flag = ($prod_doc_json[modaldata.id].declaration_prod_doc_id == "") ? "NEW-DELETE" : "DELETE";
			listProdDocJson();		
		} else if(modaldata.view == "routing_counties"){
			$routingc_json[modaldata.id].flag = ($routingc_json[modaldata.id].declaration_rc_id == "") ? "NEW-DELETE" : "DELETE";
			listRoutingCountryJson();
		}else if(modaldata.view == "seals"){
			$seals_json[modaldata.id].flag = ($seals_json[modaldata.id].declaration_seal_id == "") ? "NEW-DELETE" : "DELETE";
			listSealsJson();
		}

	});

	$(document).on('click', '.multi-save', function (e) {
		var modaldata = $(this).data();
		var row_id = 0;
		success = [];
	
		//Validation
		$('.modal-body .highlight').removeClass('highlight');
		
		if(modaldata.view == "ai_statement"){
			$.each(aiSmtValidation, function(index, value){
				validateDeclarationElements(value.name, 'ai_statement');
			});
			
		} else if(modaldata.view == "ext_ref"){
			$.each(extReferenceValidation, function(index, value){
				validateDeclarationElements(value.name, 'ext_ref');
			});
			
		} else if(modaldata.view == "prod_doc"){
			$.each(prodDocsValidation, function(index, value){
				validateDeclarationElements(value.name, 'prod_doc');
			});
			
		} else if(modaldata.view == "routing_counties"){
			highlight($('#routing_country'), '');
		}else if(modaldata.view == "seals"){
			$.each(sealsValidation, function(index, value){
				validateDeclarationElements(value.name, 'seals');
			});
		}
		
		var check_fields = (success.indexOf(false) > -1);
		
		//Saving to Json
		if(modaldata.view == "ai_statement" && check_fields !== true){
			if($("#ai-id").val() == ""){
				row_id = $ai_statement_json.length;
				$ai_statement_json.push(
					{"row_id":row_id
						, "code":$("#ai-code").val()
						, "text":$("#ai-text").val()
						, "flag":"NEW"
						, "declaration_ai_statement_id" : ""
					}
				);
			} else {
				row_id = $("#ai-id").val();
				$ai_statement_json[row_id].flag = ($("#ai-declaration-statement-id").val() == "") ? "NEW" : "UPDATE";
				$ai_statement_json[row_id].code = $("#ai-code").val();
				$ai_statement_json[row_id].text = $("#ai-text").val();
				$ai_statement_json[row_id].declaration_ai_statement_id = $("#ai-declaration-statement-id").val();
			}
			
			listAiStatementJson();
			$('#ai_statement_modal').modal('hide');
			
		} else if(modaldata.view == "ext_ref" && check_fields !== true){
			if($("#external-reference-id").val() == ""){
				row_id = $ext_ref_json.length;
				$ext_ref_json.push(
					{"row_id" : row_id
						, "external_reference" : $("#external-reference").val()
						, "flag":"NEW"
						, "declaration_ext_ref_id" : ""
					}
				);
			} else {
				row_id = $("#external-reference-id").val();
				$ext_ref_json[row_id].flag = ($("#declaration_ext_ref_id").val() == "") ? "NEW" : "UPDATE";
				$ext_ref_json[row_id].external_reference = $("#external-reference").val();
				$ext_ref_json[row_id].declaration_ext_ref_id = $("#declaration_ext_ref_id").val();
			}
			
			listExternalRefJson();
			$('#exterbak_ref_modal').modal('hide');
			
		} else if(modaldata.view == "prod_doc" && check_fields !== true){
			if($("#produced-doc-id").val() == ""){
				row_id = $prod_doc_json.length;
				$prod_doc_json.push(
					{"row_id" : row_id
						, "flag":"NEW"
						, "code" : $("#produced-doc-code").val()
						, "status" : $("#produced-doc-status").val()
						, "reference" : $("#produced-doc-reference").val()
						, "part" : $("#produced-doc-part").val()
						, "quantity" : $("#produced-doc-quantity").val()
						, "reason" : $("#produced-doc-reason").val()
						, "declaration_prod_doc_id" : $("#produced-doc-id").val()
					}
				);
			} else {
				row_id 								= $("#produced-doc-id").val();
				$prod_doc_json[row_id].flag 		= ($("#produced-doc-id").val() == "") ? "NEW" : "UPDATE";
				$prod_doc_json[row_id].code 		= $("#produced-doc-code").val();
				$prod_doc_json[row_id].status 		= $("#produced-doc-status").val();
				$prod_doc_json[row_id].reference 	= $("#produced-doc-reference").val();
				$prod_doc_json[row_id].part 		= $("#produced-doc-part").val();
				$prod_doc_json[row_id].quantity 	= $("#produced-doc-quantity").val();
				$prod_doc_json[row_id].reason 		= $("#produced-doc-reason").val();
				$prod_doc_json[row_id].declaration_prod_doc_id 	= $("#declaration_prod_doc_id").val();
			}

			listProdDocJson();	
			$('#produced_doc_modal').modal('hide');	

		}else if(modaldata.view == "routing_counties" && check_fields !== true){
			if($("#routing-counties-id").val() == ""){
				row_id = $routingc_json.length;
				$routingc_json.push(
					{	"row_id" : row_id
						, "routing_country" : $("#routing_country").val()
						, "flag":"NEW"
						, "declaration_rc_id" : $("#declaration_rc_id").val()
						, "routing_country_name" : $("#routing_country option:selected").text()
					}
				);
			} else {
				row_id = $("#routing-counties-id").val();
				$routingc_json[row_id].flag = ($("#declaration_rc_id").val() == "") ? "NEW" : "UPDATE";
				$routingc_json[row_id].routing_country = $("#routing_country").val();
				$routingc_json[row_id].declaration_rc_id = $("#declaration_rc_id").val();
				$routingc_json[row_id].routing_country_name = $("#routing_country option:selected").text()
			}
			listRoutingCountryJson();
			$('#routing_country_modal').modal('hide');

		}else if(modaldata.view == "seals" && check_fields !== true){
			if($("#declaration_seal_id").val() == ""){
				row_id = $seals_json.length;
				$seals_json.push(
					{	"row_id" : row_id
						, "flag":"NEW"
						, "seal" : $("#seals-text").val()
						, "seals_declaration_id" : $("#seals_declaration_id").val()
					}
				);
			} else {
				row_id = $("#declaration_seal_id").val();
				$seals_json[row_id].flag = ($("#seals_declaration_id").val() == "") ? "NEW" : "UPDATE";
				$seals_json[row_id].seal = $("#seals-text").val();
				$seals_json[row_id].seals_declaration_id = $("#seals_declaration_id").val();
			}
			listSealsJson();
			$('#seals_modal').modal('hide');
		}
		else{
			var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
			if(modaldata.view == "ai_statement"){
				$('#ai_statement_modal').animate({ scrollTop: 0 }, 'slow');
				$('#response_ai_statement_modal').empty().prepend(alert_required).fadeIn();
			}
			else if(modaldata.view == "ext_ref"){
				$('#exterbak_ref_modal').animate({ scrollTop: 0 }, 'slow');
				$('#response_exterbak_ref_modal').empty().prepend(alert_required).fadeIn();
			}
			else if(modaldata.view == "prod_doc"){
				$('#produced_doc_modal').animate({ scrollTop: 0 }, 'slow');
				$('#response_produced_doc_modal').empty().prepend(alert_required).fadeIn();
			}
			else if(modaldata.view == "routing_counties"){
				$('#routing_country_modal').animate({ scrollTop: 0 }, 'slow');
				$('#response_routing_country_modal').empty().prepend(alert_required).fadeIn();
			}
			else if(modaldata.view == "seals"){
				$('#seals_modal').animate({ scrollTop: 0 }, 'slow');
				$('#response_seals_modal').empty().prepend(alert_required).fadeIn();
			}
		}

	});
	
	
	//Deactivate of modal
	$('#ai_statement_modal, #exterbak_ref_modal, #produced_doc_modal,#routing_country_modal,#seals_modal').on('hidden.bs.modal', function(){
		$("#ai-code").val('');
		$("#ai-text").val('');
		$("#ai-id").val('');
		
		$("#external-reference").val('');
		$("#external-reference-id").val('');
		
		$("#produced-doc-code").val('');
		$("#produced-doc-status").val('');
		$("#produced-doc-reference").val('');
		$("#produced-doc-part").val('');
		$("#produced-doc-quantity").val('');
		$("#produced-doc-reason").val('');
		$("#produced-doc-id").val('');

		$("#routing-counties-id").val('');
		$("#routing_country").val('').trigger("chosen:updated");

		$("#declaration_seal_id").val('');
		$("#seals-text").val('');
		
		$('.modal-body .highlight').removeClass('highlight');
	});

	//Open Item module
	$(document).on('click', '#btn-item-detail', function (e) {
		var url = $(this).data().url;		
		
		BootstrapDialog.confirm('Leaving this page will discard any unsaved changes.', function(result){
			if(result) {
				window.location.href = url;
			}
		});

	});

	/* Item Model */
	
	//Select item Table
	$('#item-modal-table').on('click', 'tbody tr', function(event) {
		$(this).addClass('rowselection').siblings().removeClass('rowselection');
		
		//Show Item detail 
		var modaldata = $(this).find('.multi-edit-item').data();
		
		if(modaldata){
			$("#active_item_rowid").val($declaration_items_json[modaldata.id].row_id);
			$("#active_item_itemid").val($declaration_items_json[modaldata.id].item_id);
			
			$("#td_item_number").text($declaration_items_json[modaldata.id].item_number);
			$("#td_commodity_code").text($declaration_items_json[modaldata.id].commodity_code);
			$("#td_commodity_code_supplemental").text($declaration_items_json[modaldata.id].commodity_code_supplemental);
			$("#td_goods_description").text($declaration_items_json[modaldata.id].goods_description);
			$("#td_origin_country").text($declaration_items_json[modaldata.id].origin_country);
			
			td_origin_country_fec_indicator = '';
			if($declaration_items_json[modaldata.id].origin_country_fec_indicator != ""){
				td_origin_country_fec_indicator = ($declaration_items_json[modaldata.id].origin_country_fec_indicator == 1) ? 'Yes' : 'No'; 		
			} 
			$("#td_origin_country_fec_indicator").text(td_origin_country_fec_indicator);
			
			$("#td_cpc").text($declaration_items_json[modaldata.id].cpc);
			$("#td_preference_code").text($declaration_items_json[modaldata.id].preference_code);
			$("#td_quota").text($declaration_items_json[modaldata.id].quota);
			$("#td_price").text($declaration_items_json[modaldata.id].price);
			$("#td_net_mass").text($declaration_items_json[modaldata.id].net_mass);
			
			td_net_mass_fec_indicator = '';
			if($declaration_items_json[modaldata.id].net_mass_fec_indicator != ""){
				td_net_mass_fec_indicator = ($declaration_items_json[modaldata.id].net_mass_fec_indicator == 1) ? 'Yes' : 'No'; 		
			} 
			$("#td_net_mass_fec_indicator").text(td_net_mass_fec_indicator);
			
			$("#td_statistical_value").text($declaration_items_json[modaldata.id].statistical_value);
			$("#td_supplementary_units").text($declaration_items_json[modaldata.id].supplementary_units);
			
			td_supplementary_units_fec_indicator = '';
			if($declaration_items_json[modaldata.id].supplementary_units_fec_indicator != ""){
				td_supplementary_units_fec_indicator = ($declaration_items_json[modaldata.id].supplementary_units_fec_indicator == 1) ? 'Yes' : 'No'; 		
			}
			$("#td_supplementary_units_fec_indicator").text(td_supplementary_units_fec_indicator);
			
			$("#td_valuation_method").text($declaration_items_json[modaldata.id].valuation_method);
			$("#td_valuation_adjustment").text($declaration_items_json[modaldata.id].valuation_adjustment);
			$("#td_valuation_adjustment_percentage").text($declaration_items_json[modaldata.id].valuation_adjustment_percentage);
			$("#td_gross_mass").text($declaration_items_json[modaldata.id].gross_mass);
			$("#td_third_quantity").text($declaration_items_json[modaldata.id].third_quantity);
			$("#td_consignor_id").text($declaration_items_json[modaldata.id].consignor_id);
			$("#td_consignee_id").text($declaration_items_json[modaldata.id].consignee_id);
			$("#td_supervising_office_name").text($declaration_items_json[modaldata.id].supervising_office_name);
			$("#td_supervising_office_street").text($declaration_items_json[modaldata.id].supervising_office_street);
			$("#td_supervising_office_city").text($declaration_items_json[modaldata.id].supervising_office_city);
			$("#td_supervising_office_post_code").text($declaration_items_json[modaldata.id].supervising_office_post_code);
			$("#td_supervising_office_country_code").text($declaration_items_json[modaldata.id].supervising_office_country_code);
			
			$("#td_un_dangerous_goods").text($declaration_items_json[modaldata.id].un_dangerous_goods);
			$("#td_dispatch_country").text($declaration_items_json[modaldata.id].dispatch_country);
			$("#td_destination_country").text($declaration_items_json[modaldata.id].destination_country);

			td_destination_country_fec_indicator = '';
			if($declaration_items_json[modaldata.id].destination_country_fec_indicator != ""){
				td_destination_country_fec_indicator = ($declaration_items_json[modaldata.id].destination_country_fec_indicator == 1) ? 'Yes' : 'No'; 		
			}
			$("#td_destination_country_fec_indicator").text($declaration_items_json[modaldata.id].destination_country_fec_indicator);
			$("#td_transport_charges_payment_method").text($declaration_items_json[modaldata.id].transport_charges_payment_method);
			
			$("#td_commercial_invoice_no").text($declaration_items_json[modaldata.id].commercial_invoice_no);
			$("#td_commercial_invoice_currency").text($declaration_items_json[modaldata.id].commercial_invoice_currency);
			$("#td_statement").text($declaration_items_json[modaldata.id].statement);

			$("#item-detail-panel").show();
			
			listItemTaxLinesJson();
			listItemPrevDocsJson();
			listItemPackagesJson();
			listItemContainersJson();
			listItemAiStmtJson();
			listItemProdDocJson();
		} else {
			$("#item-detail-panel").hide();
			$("#active_item_rowid").val(-1);
			$("#active_item_itemid").val(-1);
		}

	});

	//List Json data 
	if($("#page").val() == "item-edit"){
		listItemDeclarationJson();
		$('#item-modal-table tbody tr').eq(0).trigger('click');//For selecting first item by default
		
		//Autocomplete Trader
		$("#consignor_id, #consignee_id").autocomplete({
		      source:  appHome+'/customer-portal/get_consignee',
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
			        //$(this).val(ui.item.label);
			  },
			  change: function (event, ui) {
		         if (ui.item === null) {
		            $(this).val(0);
		         }
			  }
		});	
		
	}
	
	function listItemDeclarationJson(){
		if($declaration_items_json == ""){
			if($("#declaration_items_json").val() != ""){
				$declaration_items_json = $("#declaration_items_json").val();
				$declaration_items_json = decodeURIComponent($declaration_items_json);
				$declaration_items_json = JSON.parse($declaration_items_json);
			}
		}
		
		$("#item-modal-table tbody tr").remove();
		$count = 0;
		$.each($declaration_items_json, function(index, data) {
			if(data.flag != 'DELETE' && data.flag != 'NEW-DELETE' ){
				$td = "<tr>";
				$td += "<td>" + data.item_number + "</td>";
				$td += "<td>" + data.commodity_code + "</td>";
				$td += "<td class='td-break'>" + data.goods_description + "</td>";
				$td += "<td>" + data.origin_country + "</td>";
				$td += "<td>" + data.price + "</td>";
				$td += "<td>" + data.net_mass + "</td>";
				$td += "<td class='center-cell'><a class='multi-edit-item' data-view='declaration_items' data-id='" + data.row_id + "' href='javascript:void(0)' title='Edit'><span class='fa fa-pencil'></span></a> ";
				$td += "<a class='delete-icon multi-delete-item' data-view='declaration_items' data-id='" + data.row_id + "' href='javascript:void(0)' title='Delete'><i class='fa fa-trash-o'></i></a>";
				$td += "</td></tr>";
				
				$("#item-modal-table tbody").append($td);
				$count++;
			}
    	});
		 
		if($count == 0){
			$("#item-modal-table tbody").append('<tr id="no-rec-tr"><td class="center-cell" colspan="7">No records found.</td></tr>');		
		}
	}
	
	function listItemTaxLinesJson(){
		if($item_tax_lines_json == ""){
			if($("#item_tax_lines_json").val() != ""){
				$item_tax_lines_json = $("#item_tax_lines_json").val();
				$item_tax_lines_json = decodeURIComponent($item_tax_lines_json);
				$item_tax_lines_json = JSON.parse($item_tax_lines_json);
			}
		}
		
		$("#item_tax_lines_table tbody tr").remove();
		$count = 0;
		$activeItemRowId = $("#active_item_rowid").val();
		$active_item_itemid = $("#active_item_itemid").val();

		$.each($item_tax_lines_json, function(index, data) {
			if(data.item_id == $active_item_itemid && data.row_itemid == -1){
				data.row_itemid = $activeItemRowId;
			}
			
			if(data.flag != 'DELETE' && data.flag != 'NEW-DELETE' && data.row_itemid == $activeItemRowId){
				$td = "<tr>";
				$td += "<td>" + data.type + "</td>";
				$td += "<td>" + data.base_amount + "</td>";
				$td += "<td>" + data.base_quantity + "</td>";
				$td += "<td>" + data.rate + "</td>";
				$td += "<td>" + data.override_code + "</td>";
				$td += "<td>" + data.amount + "</td>";
				$td += "<td>" + data.method_of_payment + "</td>";
				$td += "<td class='center-cell'><a class='multi-edit-item' data-view='item_tax_lines' data-id='" + data.row_id + "' href='javascript:void(0)' title='Edit'><span class='fa fa-pencil'></span></a> ";
				$td += "<a class='delete-icon multi-delete-item' data-view='item_tax_lines' data-id='" + data.row_id + "' href='javascript:void(0)' title='Delete'><i class='fa fa-trash-o'></i></a>";
				$td += "</td></tr>";
				
				$("#item_tax_lines_table tbody").append($td);
				$count++;
			}
    	});
		 
		if($count == 0){
			$("#item_tax_lines_table tbody").append('<tr id="no-rec-tr"><td class="center-cell" colspan="8">No records found.</td></tr>');		
		}
	}
	
	function listItemPrevDocsJson(){
		if($item_prev_docs_json == ""){
			if($("#item_prev_docs_json").val() != ""){
				$item_prev_docs_json = $("#item_prev_docs_json").val();
				$item_prev_docs_json = decodeURIComponent($item_prev_docs_json);
				$item_prev_docs_json = JSON.parse($item_prev_docs_json);
			}
		}
		
		$("#item_prev_docs_table tbody tr").remove();
		$count = 0;
		$activeItemRowId = $("#active_item_rowid").val();
		$active_item_itemid = $("#active_item_itemid").val();
			
		$.each($item_prev_docs_json, function(index, data) {
			if(data.item_id == $active_item_itemid && data.row_itemid == -1){
				data.row_itemid = $activeItemRowId;
			}
			
			if(data.flag != 'DELETE' && data.flag != 'NEW-DELETE' && data.row_itemid == $activeItemRowId){
				$td = "<tr>";
				$td += "<td>" + data.document_class + "</td>";
				$td += "<td>" + data.type + "</td>";
				$td += "<td>" + data.reference + "</td>";
				$td += "<td class='center-cell'><a class='multi-edit-item' data-view='item_prev_docs' data-id='" + data.row_id + "' href='javascript:void(0)' title='Edit'><span class='fa fa-pencil'></span></a> ";
				$td += "<a class='delete-icon multi-delete-item' data-view='item_prev_docs' data-id='" + data.row_id + "' href='javascript:void(0)' title='Delete'><i class='fa fa-trash-o'></i></a>";
				$td += "</td></tr>";
				
				$("#item_prev_docs_table tbody").append($td);
				$count++;
			}
    	});
		 
		if($count == 0){
			$("#item_prev_docs_table tbody").append('<tr id="no-rec-tr"><td class="center-cell" colspan="4">No records found.</td></tr>');		
		}
	}
	
	function listItemContainersJson(){
		if($item_containers_json == ""){
			if($("#item_containers_json").val() != ""){
				$item_containers_json = $("#item_containers_json").val();
				$item_containers_json = decodeURIComponent($item_containers_json);
				$item_containers_json = JSON.parse($item_containers_json);
			}
		}

		$("#item_containers_table tbody tr").remove();
		$count = 0;
		$activeItemRowId = $("#active_item_rowid").val();
		$active_item_itemid = $("#active_item_itemid").val();
			
		$.each($item_containers_json, function(index, data) {
			if(data.item_id == $active_item_itemid && data.row_itemid == -1){
				data.row_itemid = $activeItemRowId;
			}
			
			if(data.flag != 'DELETE' && data.flag != 'NEW-DELETE' && data.row_itemid == $activeItemRowId){
				$td = "<tr>";
				$td += "<td>" + data.number + "</td>";
				$td += "<td class='center-cell'><a class='multi-edit-item' data-view='item_containers' data-id='" + data.row_id + "' href='javascript:void(0)' title='Edit'><span class='fa fa-pencil'></span></a> ";
				$td += "<a class='delete-icon multi-delete-item' data-view='item_containers' data-id='" + data.row_id + "' href='javascript:void(0)' title='Delete'><i class='fa fa-trash-o'></i></a>";
				$td += "</td></tr>";
				
				$("#item_containers_table tbody").append($td);
				$count++;
			}
    	});
		 
		if($count == 0){
			$("#item_containers_table tbody").append('<tr id="no-rec-tr"><td class="center-cell" colspan="2">No records found.</td></tr>');		
		}
	}
	
	function listItemPackagesJson(){
		if($item_packages_json == ""){
			if($("#item_packages_json").val() != ""){
				$item_packages_json = $("#item_packages_json").val();
				$item_packages_json = decodeURIComponent($item_packages_json);
				$item_packages_json = JSON.parse($item_packages_json);
			}
		}

		$("#item_packages_table tbody tr").remove();
		$count = 0;
		$activeItemRowId = $("#active_item_rowid").val();
		$active_item_itemid = $("#active_item_itemid").val();
			
		$.each($item_packages_json, function(index, data) {
			if(data.item_id == $active_item_itemid && data.row_itemid == -1){
				data.row_itemid = $activeItemRowId;
			}
			
			if(data.flag != 'DELETE' && data.flag != 'NEW-DELETE' && data.row_itemid == $activeItemRowId){
				$td = "<tr>";
				$td += "<td>" + data.kind + "</td>";
				$td += "<td>" + data.marks + "</td>";
				$td += "<td>" + data.number_of_packages + "</td>";
				$td += "<td class='center-cell'><a class='multi-edit-item' data-view='item_packages' data-id='" + data.row_id + "' href='javascript:void(0)' title='Edit'><span class='fa fa-pencil'></span></a> ";
				$td += "<a class='delete-icon multi-delete-item' data-view='item_packages' data-id='" + data.row_id + "' href='javascript:void(0)' title='Delete'><i class='fa fa-trash-o'></i></a>";
				$td += "</td></tr>";
				
				$("#item_packages_table tbody").append($td);
				$count++;
			}
    	});
		 
		if($count == 0){
			$("#item_packages_table tbody").append('<tr id="no-rec-tr"><td class="center-cell" colspan="4">No records found.</td></tr>');		
		}
	}
	
	
	function listItemAiStmtJson(){
		if($item_ai_stmt_json == ""){
			if($("#item_ai_stmt_json").val() != ""){
				$item_ai_stmt_json = $("#item_ai_stmt_json").val();
				$item_ai_stmt_json = decodeURIComponent($item_ai_stmt_json);
				$item_ai_stmt_json = JSON.parse($item_ai_stmt_json);
			}
		}

		$("#item_ai_stmt_table tbody tr").remove();
		$count = 0;
		$activeItemRowId = $("#active_item_rowid").val();
		$active_item_itemid = $("#active_item_itemid").val();
			
		$.each($item_ai_stmt_json, function(index, data) {
			if(data.item_id == $active_item_itemid && data.row_itemid == -1){
				data.row_itemid = $activeItemRowId;
			}
			
			if(data.flag != 'DELETE' && data.flag != 'NEW-DELETE' && data.row_itemid == $activeItemRowId){
				$td = "<tr>";
				$td += "<td>" + data.code + "</td>";
				$td += "<td>" + data.text + "</td>";
				$td += "<td class='center-cell'><a class='multi-edit-item' data-view='item_ai_stmt' data-id='" + data.row_id + "' href='javascript:void(0)' title='Edit'><span class='fa fa-pencil'></span></a> ";
				$td += "<a class='delete-icon multi-delete-item' data-view='item_ai_stmt' data-id='" + data.row_id + "' href='javascript:void(0)' title='Delete'><i class='fa fa-trash-o'></i></a>";
				$td += "</td></tr>";
				
				$("#item_ai_stmt_table tbody").append($td);
				$count++;
			}
    	});
		 
		if($count == 0){
			$("#item_ai_stmt_table tbody").append('<tr id="no-rec-tr"><td class="center-cell" colspan="3">No records found.</td></tr>');		
		}
	}
	
	function listItemProdDocJson(){
		if($item_prod_doc_json == ""){
			if($("#item_prod_doc_json").val() != ""){
				$item_prod_doc_json = $("#item_prod_doc_json").val();
				$item_prod_doc_json = decodeURIComponent($item_prod_doc_json);
				$item_prod_doc_json = JSON.parse($item_prod_doc_json);
			}
		}
		
		$("#item_prod_doc_table tbody tr").remove();
		$count = 0;
		$activeItemRowId = $("#active_item_rowid").val();
		$active_item_itemid = $("#active_item_itemid").val();
			
		$.each($item_prod_doc_json, function(index, data) {
			if(data.item_id == $active_item_itemid && data.row_itemid == -1){
				data.row_itemid = $activeItemRowId;
			}
			
			if(data.flag != 'DELETE' && data.flag != 'NEW-DELETE' && data.row_itemid == $activeItemRowId){
				$td = "<tr>";
				$td += "<td>" + data.code + "</td>";
				$td += "<td>" + data.status + "</td>";
				$td += "<td>" + data.reference + "</td>";
				$td += "<td>" + data.part + "</td>";
				$td += "<td>" + data.quantity + "</td>";
				$td += "<td>" + data.reason + "</td>";
				$td += "<td class='center-cell'><a class='multi-edit-item' data-view='item_prod_doc' data-id='" + data.row_id + "' href='javascript:void(0)' title='Edit'><span class='fa fa-pencil'></span></a> ";
				$td += "<a class='delete-icon multi-delete-item' data-view='item_prod_doc' data-id='" + data.row_id + "' href='javascript:void(0)' title='Delete'><i class='fa fa-trash-o'></i></a>";
				$td += "</td></tr>";
				
				$("#item_prod_doc_table tbody").append($td);
				$count++;
			}
    	});
		 
		if($count == 0){
			$("#item_prod_doc_table tbody").append('<tr id="no-rec-tr"><td class="center-cell" colspan="7">No records found.</td></tr>');		
		}
	}
	
	$(document).on('click', '.multi-edit-item', function (e) {
		var modaldata = $(this).data();		
		
		if(modaldata.view == "declaration_items"){
			$("#item_details_id").val(modaldata.id);
			$("#item_id").val($declaration_items_json[modaldata.id].item_id);
			$("#item_number").val($declaration_items_json[modaldata.id].item_number);
			$("#commodity_code").val($declaration_items_json[modaldata.id].commodity_code);
			$("#commodity_code_supplemental").val($declaration_items_json[modaldata.id].commodity_code_supplemental);
			$("#goods_description").val($declaration_items_json[modaldata.id].goods_description);
			$("#origin_country").val($declaration_items_json[modaldata.id].origin_country).trigger("chosen:updated");
			$("#origin_country_fec_indicator").val($declaration_items_json[modaldata.id].origin_country_fec_indicator).trigger("chosen:updated");
			$("#cpc").val($declaration_items_json[modaldata.id].cpc);
			$("#preference_code").val($declaration_items_json[modaldata.id].preference_code);
			$("#quota").val($declaration_items_json[modaldata.id].quota);
			$("#price").val($declaration_items_json[modaldata.id].price);
			$("#net_mass").val($declaration_items_json[modaldata.id].net_mass);
			$("#net_mass_fec_indicator").val($declaration_items_json[modaldata.id].net_mass_fec_indicator).trigger("chosen:updated");
			$("#statistical_value").val($declaration_items_json[modaldata.id].statistical_value);
			$("#supplementary_units").val($declaration_items_json[modaldata.id].supplementary_units);
			$("#supplementary_units_fec_indicator").val($declaration_items_json[modaldata.id].supplementary_units_fec_indicator).trigger("chosen:updated");
			$("#valuation_method").val($declaration_items_json[modaldata.id].valuation_method).trigger("chosen:updated");
			$("#valuation_adjustment").val($declaration_items_json[modaldata.id].valuation_adjustment).trigger("chosen:updated");
			$("#valuation_adjustment_percentage").val($declaration_items_json[modaldata.id].valuation_adjustment_percentage);
			$("#gross_mass").val($declaration_items_json[modaldata.id].gross_mass);
			$("#third_quantity").val($declaration_items_json[modaldata.id].third_quantity);
			$("#consignor_id").val($declaration_items_json[modaldata.id].consignor_id);
			$("#consignee_id").val($declaration_items_json[modaldata.id].consignee_id);
			$("#supervising_office_name").val($declaration_items_json[modaldata.id].supervising_office_name);
			$("#supervising_office_street").val($declaration_items_json[modaldata.id].supervising_office_street);
			$("#supervising_office_city").val($declaration_items_json[modaldata.id].supervising_office_city);
			$("#supervising_office_post_code").val($declaration_items_json[modaldata.id].supervising_office_post_code);
			$("#supervising_office_country_code").val($declaration_items_json[modaldata.id].supervising_office_country_code).trigger("chosen:updated");

			$("#un_dangerous_goods").val($declaration_items_json[modaldata.id].un_dangerous_goods);
			$("#dispatch_country").val($declaration_items_json[modaldata.id].dispatch_country).trigger("chosen:updated");
			$("#destination_country").val($declaration_items_json[modaldata.id].destination_country).trigger("chosen:updated");
			$("#destination_country_fec_indicator").val($declaration_items_json[modaldata.id].destination_country_fec_indicator).trigger("chosen:updated");
			$("#transport_charges_payment_method").val($declaration_items_json[modaldata.id].transport_charges_payment_method);
			
			$("#commercial_invoice_no").val($declaration_items_json[modaldata.id].commercial_invoice_no);
			$("#commercial_invoice_currency").val($declaration_items_json[modaldata.id].commercial_invoice_currency).trigger("chosen:updated");
			$("#statement").val($declaration_items_json[modaldata.id].statement);

			$('#item_details_modal').modal('show');
			enabledisableExpImpvalues();
		} else if(modaldata.view == "item_tax_lines"){
			$("#tax_details_id").val(modaldata.id);
			$("#tax_id").val($item_tax_lines_json[modaldata.id].tax_line_id);
			$("#type").val($item_tax_lines_json[modaldata.id].type);
			$("#base_amount").val($item_tax_lines_json[modaldata.id].base_amount);
			$("#base_quantity").val($item_tax_lines_json[modaldata.id].base_quantity);
			$("#rate").val($item_tax_lines_json[modaldata.id].rate);
			$("#override_code").val($item_tax_lines_json[modaldata.id].override_code);
			$("#amount").val($item_tax_lines_json[modaldata.id].amount);
			$("#method_of_payment").val($item_tax_lines_json[modaldata.id].method_of_payment);
			
			$('#item_tax_lines_modal').modal('show');
		} else if(modaldata.view == "item_prev_docs"){
			$("#previous_details_id").val(modaldata.id);
			$("#previous_id").val($item_prev_docs_json[modaldata.id].prev_doc_id);
			$("#document_class").val($item_prev_docs_json[modaldata.id].document_class);
			$("#types").val($item_prev_docs_json[modaldata.id].type);
			$("#reference").val($item_prev_docs_json[modaldata.id].reference);
			
			$('#item_prev_docs_modal').modal('show');
		} else if(modaldata.view == "item_containers"){
			$("#container_details_id").val(modaldata.id);
			$("#container_id").val($item_containers_json[modaldata.id].container_id);
			$("#number").val($item_containers_json[modaldata.id].number);
			
			$('#item_containers_modal').modal('show');
		} else if(modaldata.view == "item_prod_doc"){
			$("#product_document_details_id").val(modaldata.id);
			$("#produced_document_id").val($item_prod_doc_json[modaldata.id].prod_doc_id);
			$("#code").val($item_prod_doc_json[modaldata.id].code);
			$("#status").val($item_prod_doc_json[modaldata.id].status);
			$("#references").val($item_prod_doc_json[modaldata.id].reference);
			$("#part").val($item_prod_doc_json[modaldata.id].part);
			$("#quantity").val($item_prod_doc_json[modaldata.id].quantity);
			$("#reason").val($item_prod_doc_json[modaldata.id].reason);
			
			$('#item_prod_doc_modal').modal('show');
		} else if(modaldata.view == "item_ai_stmt"){
			$("#ai_details_id").val(modaldata.id);
			$("#ai_statement_id").val($item_ai_stmt_json[modaldata.id].ai_stmt_id);
			$("#codes").val($item_ai_stmt_json[modaldata.id].code);
			$("#text").val($item_ai_stmt_json[modaldata.id].text);
						
			$('#item_ai_stmt_modal').modal('show');
		} else if(modaldata.view == "item_packages"){
			$("#package_details_id").val(modaldata.id);
			$("#package_id").val($item_packages_json[modaldata.id].package_id);
			$("#kind").val($item_packages_json[modaldata.id].kind);
			$("#numbers").val($item_packages_json[modaldata.id].number_of_packages);
			$("#mark").val($item_packages_json[modaldata.id].marks);
			
			$('#item_packages_modal').modal('show');
		}

	})
	
	$(document).on('click', '.multi-delete-item', function (e) {
		var modaldata = $(this).data();		
		
		if(modaldata.view == "declaration_items"){
			$declaration_items_json[modaldata.id].flag = ($declaration_items_json[modaldata.id].item_id == "") ? "NEW-DELETE" : "DELETE";
			listItemDeclarationJson();
			$("#active_item_rowid").val('');
			$("#active_item_itemid").val('');
		
			$("#item-detail-panel").hide();
		} else if(modaldata.view == "item_tax_lines"){
			$item_tax_lines_json[modaldata.id].flag = ($item_tax_lines_json[modaldata.id].item_id == "") ? "NEW-DELETE" : "DELETE";
			listItemTaxLinesJson();
			$('#item_tax_lines_modal').modal('hide');
		} else if(modaldata.view == "item_prev_docs"){
			$item_prev_docs_json[modaldata.id].flag = ($item_prev_docs_json[modaldata.id].item_id == "") ? "NEW-DELETE" : "DELETE";
			listItemPrevDocsJson();
			$('#item_prev_docs_modal').modal('hide');
		} else if(modaldata.view == "item_containers"){
			$item_containers_json[modaldata.id].flag = ($item_containers_json[modaldata.id].item_id == "") ? "NEW-DELETE" : "DELETE";
			listItemContainersJson();
			$('#item_containers_modal').modal('hide');
		} else if(modaldata.view == "item_prod_doc"){
			$item_prod_doc_json[modaldata.id].flag = ($item_prod_doc_json[modaldata.id].item_id == "") ? "NEW-DELETE" : "DELETE";
			listItemProdDocJson();
			$('#item_prod_doc_modal').modal('hide');
		} else if(modaldata.view == "item_ai_stmt"){
			$item_ai_stmt_json[modaldata.id].flag = ($item_ai_stmt_json[modaldata.id].item_id == "") ? "NEW-DELETE" : "DELETE";
			listItemAiStmtJson();
			$('#item_ai_stmt_modal').modal('hide');
		} else if(modaldata.view == "item_packages"){
			$item_packages_json[modaldata.id].flag = ($item_packages_json[modaldata.id].item_id == "") ? "NEW-DELETE" : "DELETE";
			listItemPackagesJson();
			$('#item_packages_modal').modal('hide');
		}

	});

	$(document).on('click', '.item_details_modal', function (e) {
		if($('#item_details tr').length >= 99){
			BootstrapDialog.show({draggable: true, type: BootstrapDialog.TYPE_WARNING, title: '<i class="fa fa-exclamation-triangle"></i> Limit Exceeds', message : '<strong>Allow only Maximum 99 Items.</strong>',
										 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
									});
		}else{
			$('#item_details_modal').modal('show');
			enabledisableExpImpvalues();
		}
	});
	
	//Items of item modal
	$('#item_details_modal, #item_tax_lines_modal, #item_prev_docs_modal, #item_containers_modal, #item_prod_doc_modal, #item_ai_stmt_modal, #item_packages_modal').on('hidden.bs.modal', function(){
		//Item
		$("#item_details_id").val('');
		$("#item_id").val('');
		$("#item_number").val('');
		$("#commodity_code").val('');
		$("#commodity_code_supplemental").val('');
		$("#goods_description").val('');
		$("#origin_country").val('').trigger("chosen:updated");
		$("#origin_country_fec_indicator").val('').trigger("chosen:updated");
		$("#cpc").val('');
		$("#preference_code").val('');
		$("#quota").val('');
		$("#price").val('');
		$("#net_mass").val('');
		$("#net_mass_fec_indicator").val('').trigger("chosen:updated");
		$("#statistical_value").val('');
		$("#supplementary_units").val('');
		$("#supplementary_units_fec_indicator").val('').trigger("chosen:updated");
		$("#valuation_method").val('').trigger("chosen:updated");
		$("#valuation_adjustment").val('').trigger("chosen:updated");
		$("#valuation_adjustment_percentage").val('');
		$("#gross_mass").val('');
		$("#third_quantity").val('');
		$("#consignor_id").val('');
		$("#consignee_id").val('');
		$("#supervising_office_name").val('');
		$("#supervising_office_street").val('');
		$("#supervising_office_city").val('');
		$("#supervising_office_post_code").val('');
		$("#supervising_office_country_code").val('').trigger("chosen:updated");

		$("#un_dangerous_goods,#transport_charges_payment_method").val('');
		
		$("#commercial_invoice_no").val('');
		$("#commercial_invoice_currency").val('');
		$("#statement").val('');
		
		$("#dispatch_country,#destination_country,#destination_country_fec_indicator").val('').trigger("chosen:updated");

		//Tax Line		
		$("#tax_details_id").val('');
		$("#tax_id").val('');
		$("#type").val('');
		$("#base_amount").val('');
		$("#base_quantity").val('');
		$("#rate").val('');
		$("#override_code").val('');
		$("#amount").val('');
		$("#method_of_payment").val('');
			
		//Previous documents
		$("#previous_details_id").val('');
		$("#previous_id").val('');
		$("#document_class").val('');
		$("#types").val('');
		$("#reference").val('');
		
		//Containers
		$("#container_details_id").val('');
		$("#container_id").val('');
		$("#number").val('');
		
		//Produced documents
		$("#product_document_details_id").val('');
		$("#produced_document_id").val('');
		$("#code").val('');
		$("#status").val('');
		$("#references").val('');
		$("#part").val('');
		$("#quantity").val('');
		$("#reason").val('');
		
		//AI statement
		$("#ai_details_id").val('');
		$("#ai_statement_id").val('');
		$("#codes").val('');
		$("#text").val('');
		
		//Packages
		$("#package_details_id").val('');
		$("#package_id").val('');
		$("#kind").val('');
		$("#numbers").val('');
		$("#mark").val('');
		
		$('.modal-body .highlight').removeClass('highlight');
	});
	
	
	$(document).on('click', '.multi-save-item', function (e) {
		var modaldata = $(this).data();
		var row_id = 0;
		success = [];
		
		var $activeItemRowId = $("#active_item_rowid").val();
		var $active_item_itemid = $("#active_item_itemid").val();
	
		//Validation
		$('.modal-body .highlight').removeClass('highlight');
		if(modaldata.view == "declaration_items"){
			$.each(itemValidationArray, function(index, value){
				validateItemElements(value.name, 'declaration_items');
			  });
			
		} else if(modaldata.view == "item_tax_lines"){
			$.each(itemTaxLineValidation, function(index, value){
				validateItemElements(value.name, 'item_tax_lines');
			});
	
		} else if(modaldata.view == "item_prev_docs"){
			$.each(itemPrevDocsValidation, function(index, value){
				validateItemElements(value.name, 'item_prev_docs');
			});

		} else if(modaldata.view == "item_containers"){
			$.each(itemContainersValidation, function(index, value){
				validateItemElements(value.name, 'item_containers');
			});
			
		} else if(modaldata.view == "item_prod_doc"){
			$.each(itemProdDocsValidation, function(index, value){
				validateItemElements(value.name, 'item_prod_doc');
			});
			
		} else if(modaldata.view == "item_ai_stmt"){	
			$.each(itemAiSmtValidation, function(index, value){
				validateItemElements(value.name, 'item_ai_stmt');
			});
		} else if(modaldata.view == "item_packages"){
			$.each(itemPackagesValidation, function(index, value){
				validateItemElements(value.name, 'item_packages');
			});
			
		} 

		var check_fields = (success.indexOf(false) > -1);
		
		//Saving to Json
		if(modaldata.view == "declaration_items" && check_fields !== true){
			if($("#item_id").val() == ""){
				row_id = $declaration_items_json.length;
				$("#item_id").val('ITEM'+row_id); //Dummy id
				$declaration_items_json.push(
					{"row_id":row_id
						, "item_id":$("#item_id").val()
						, "item_number":$("#item_number").val()
						, "commodity_code":$("#commodity_code").val()
						, "commodity_code_supplemental":$("#commodity_code_supplemental").val()
						, "goods_description":$("#goods_description").val()
						, "origin_country":$("#origin_country").val()
						, "origin_country_fec_indicator":$("#origin_country_fec_indicator").val()
						, "cpc":$("#cpc").val()
						, "preference_code":$("#preference_code").val()
						, "quota":$("#quota").val()
						, "price":$("#price").val()
						, "net_mass":$("#net_mass").val()
						, "net_mass_fec_indicator":$("#net_mass_fec_indicator").val()
						, "statistical_value":$("#statistical_value").val()
						, "supplementary_units":$("#supplementary_units").val()
						, "supplementary_units_fec_indicator":$("#supplementary_units_fec_indicator").val()
						, "valuation_method":$("#valuation_method").val()
						, "valuation_adjustment":$("#valuation_adjustment").val()
						, "valuation_adjustment_percentage":$("#valuation_adjustment_percentage").val()
						, "gross_mass":$("#gross_mass").val()
						, "third_quantity":$("#third_quantity").val()
						, "consignor_id":$("#consignor_id").val()
						, "consignee_id":$("#consignee_id").val()
						, "supervising_office_name":$("#supervising_office_name").val()
						, "supervising_office_street":$("#supervising_office_street").val()
						, "supervising_office_city":$("#supervising_office_city").val()
						, "supervising_office_post_code":$("#supervising_office_post_code").val()
						, "supervising_office_country_code":$("#supervising_office_country_code").val()

						, "un_dangerous_goods":$("#un_dangerous_goods").val()
						, "dispatch_country":$("#dispatch_country").val()
						, "destination_country":$("#destination_country").val()
						, "destination_country_fec_indicator":$("#destination_country_fec_indicator").val()
						, "transport_charges_payment_method":$("#transport_charges_payment_method").val()
						
						, "commercial_invoice_no":$("#commercial_invoice_no").val()
						, "commercial_invoice_currency":$("#commercial_invoice_currency").val()
						, "statement":$("#statement").val()
						
						, "flag":"NEW"
					}
				);
			} else {
				row_id = $("#item_details_id").val();
				$declaration_items_json[row_id].flag = ($("#item_id").val().substring(0,4) == "ITEM") ? "NEW" : "UPDATE";
				
				$declaration_items_json[row_id].item_id = $("#item_id").val();
				$declaration_items_json[row_id].item_number = $("#item_number").val();
				$declaration_items_json[row_id].commodity_code = $("#commodity_code").val();
				$declaration_items_json[row_id].commodity_code_supplemental = $("#commodity_code_supplemental").val();
				$declaration_items_json[row_id].goods_description = $("#goods_description").val();
				$declaration_items_json[row_id].origin_country = $("#origin_country").val();
				$declaration_items_json[row_id].origin_country_fec_indicator = $("#origin_country_fec_indicator").val();
				$declaration_items_json[row_id].cpc = $("#cpc").val();
				$declaration_items_json[row_id].preference_code = $("#preference_code").val();
				$declaration_items_json[row_id].quota = $("#quota").val();
				$declaration_items_json[row_id].price = $("#price").val();
				$declaration_items_json[row_id].net_mass = $("#net_mass").val();
				$declaration_items_json[row_id].net_mass_fec_indicator = $("#net_mass_fec_indicator").val();
				$declaration_items_json[row_id].statistical_value = $("#statistical_value").val();
				$declaration_items_json[row_id].supplementary_units = $("#supplementary_units").val();
				$declaration_items_json[row_id].supplementary_units_fec_indicator = $("#supplementary_units_fec_indicator").val();
				$declaration_items_json[row_id].valuation_method = $("#valuation_method").val();
				$declaration_items_json[row_id].valuation_adjustment = $("#valuation_adjustment").val();
				$declaration_items_json[row_id].valuation_adjustment_percentage = $("#valuation_adjustment_percentage").val();
				$declaration_items_json[row_id].gross_mass = $("#gross_mass").val();
				$declaration_items_json[row_id].third_quantity = $("#third_quantity").val();
				$declaration_items_json[row_id].consignor_id = $("#consignor_id").val();
				$declaration_items_json[row_id].consignee_id = $("#consignee_id").val();
				$declaration_items_json[row_id].supervising_office_name = $("#supervising_office_name").val();
				$declaration_items_json[row_id].supervising_office_street = $("#supervising_office_street").val();
				$declaration_items_json[row_id].supervising_office_city = $("#supervising_office_city").val();
				$declaration_items_json[row_id].supervising_office_post_code = $("#supervising_office_post_code").val();
				$declaration_items_json[row_id].supervising_office_country_code = $("#supervising_office_country_code").val();

				$declaration_items_json[row_id].un_dangerous_goods = $("#un_dangerous_goods").val();
				$declaration_items_json[row_id].dispatch_country = $("#dispatch_country").val();
				$declaration_items_json[row_id].destination_country = $("#destination_country").val();
				$declaration_items_json[row_id].destination_country_fec_indicator = $("#destination_country_fec_indicator").val();
				$declaration_items_json[row_id].transport_charges_payment_method = $("#transport_charges_payment_method").val();
				
				$declaration_items_json[row_id].commercial_invoice_no = $("#commercial_invoice_no").val();
				$declaration_items_json[row_id].commercial_invoice_currency = $("#commercial_invoice_currency").val();
				$declaration_items_json[row_id].statement = $("#statement").val();
			}
			
			listItemDeclarationJson();
			$('#item-modal-table [data-id="' + row_id + '"]').parents().trigger('click');
			$("#active_item_rowid").val(row_id); //Set new value
			$("#active_item_itemid").val($("#item_id").val());
			
			$("#item-detail-panel").show();
			$('#item_details_modal').modal('hide');	
			
		} else if(modaldata.view == "item_tax_lines" && check_fields !== true){
			if($("#tax_id").val() == ""){
				row_id = $item_tax_lines_json.length;
				$item_tax_lines_json.push(
					{"row_id":row_id
						, "tax_line_id":-1
						, "item_id": $active_item_itemid
						, "row_itemid" : -1
						, "type":$("#type").val()
						, "base_amount":$("#base_amount").val()
						, "base_quantity":$("#base_quantity").val()
						, "rate":$("#rate").val()
						, "override_code":$("#override_code").val()
						, "amount":$("#amount").val()
						, "method_of_payment":$("#method_of_payment").val()
						, "flag":"NEW"
					}
				);
			} else {
				row_id = $("#tax_details_id").val();
				$item_tax_lines_json[row_id].flag = ($("#tax_id").val() == -1) ? "NEW" : "UPDATE";
				
				$item_tax_lines_json[row_id].type = $("#type").val();
				$item_tax_lines_json[row_id].base_amount = $("#base_amount").val();
				$item_tax_lines_json[row_id].base_quantity = $("#base_quantity").val();
				$item_tax_lines_json[row_id].rate = $("#rate").val();
				$item_tax_lines_json[row_id].override_code = $("#override_code").val();
				$item_tax_lines_json[row_id].amount = $("#amount").val();
				$item_tax_lines_json[row_id].method_of_payment = $("#method_of_payment").val();
			}
			
			listItemTaxLinesJson();
			$('#item_tax_lines_modal').modal('hide');
		} else if(modaldata.view == "item_prev_docs" && check_fields !== true){
			if($("#previous_id").val() == ""){
				row_id = $item_prev_docs_json.length;
				$item_prev_docs_json.push(
					{"row_id":row_id
						, "prev_doc_id":-1
						, "item_id": $active_item_itemid
						, "row_itemid" : -1
						, "document_class":$("#document_class").val()
						, "type":$("#types").val()
						, "reference":$("#reference").val()
						, "flag":"NEW"
					}
				);
			} else {
				row_id = $("#previous_details_id").val();
				$item_prev_docs_json[row_id].flag = ($("#previous_id").val() == -1) ? "NEW" : "UPDATE";
				
				$item_prev_docs_json[row_id].document_class = $("#document_class").val();
				$item_prev_docs_json[row_id].type = $("#types").val();
				$item_prev_docs_json[row_id].reference = $("#reference").val();
			}
			
			listItemPrevDocsJson();
			$('#item_prev_docs_modal').modal('hide');
		} else if(modaldata.view == "item_containers" && check_fields !== true){
			if($("#container_id").val() == ""){
				row_id = $item_containers_json.length;
				$item_containers_json.push(
					{"row_id":row_id
						, "container_id":-1
						, "item_id": $active_item_itemid
						, "row_itemid" : -1
						, "number":$("#number").val()
						, "flag":"NEW"
					}
				);
			} else {
				row_id = $("#container_details_id").val();
				$item_containers_json[row_id].flag = ($("#container_id").val() == -1) ? "NEW" : "UPDATE";
				$item_containers_json[row_id].number = $("#number").val();
			}
			
			listItemContainersJson();
			$('#item_containers_modal').modal('hide');
		} else if(modaldata.view == "item_prod_doc" && check_fields !== true){
			if($("#produced_document_id").val() == ""){
				row_id = $item_prod_doc_json.length;
				$item_prod_doc_json.push(
					{"row_id":row_id
						, "prod_doc_id":-1
						, "item_id": $active_item_itemid
						, "row_itemid" : -1
						, "code":$("#code").val()
						, "status":$("#status").val()
						, "reference":$("#references").val()
						, "part":$("#part").val()
						, "quantity":$("#quantity").val()
						, "reason":$("#reason").val()
						, "flag":"NEW"
					}
				);
			} else {
				row_id = $("#product_document_details_id").val();
				$item_prod_doc_json[row_id].flag = ($("#produced_document_id").val() == -1) ? "NEW" : "UPDATE";
				
				$item_prod_doc_json[row_id].code = $("#code").val();
				$item_prod_doc_json[row_id].status = $("#status").val();
				$item_prod_doc_json[row_id].reference = $("#references").val();
				$item_prod_doc_json[row_id].part = $("#part").val();
				$item_prod_doc_json[row_id].quantity = $("#quantity").val();
				$item_prod_doc_json[row_id].reason = $("#reason").val();
			}
			
			listItemProdDocJson();
			$('#item_prod_doc_modal').modal('hide');
		} else if(modaldata.view == "item_ai_stmt" && check_fields !== true){
			if($("#ai_statement_id").val() == ""){
				row_id = $item_ai_stmt_json.length;
				$item_ai_stmt_json.push(
					{"row_id":row_id
						, "ai_stmt_id":-1
						, "item_id": $active_item_itemid
						, "row_itemid" : -1
						, "code":$("#codes").val()
						, "text":$("#text").val()
						, "flag":"NEW"
					}
				);
			} else {
				row_id = $("#ai_details_id").val();
				$item_ai_stmt_json[row_id].flag = ($("#ai_statement_id").val() == -1) ? "NEW" : "UPDATE";
				
				$item_ai_stmt_json[row_id].code = $("#codes").val();
				$item_ai_stmt_json[row_id].text = $("#text").val();
			}
			
			listItemAiStmtJson();
			$('#item_ai_stmt_modal').modal('hide');
		} else if(modaldata.view == "item_packages" && check_fields !== true){
			if($("#package_id").val() == ""){
				row_id = $item_packages_json.length;
				$item_packages_json.push(
					{"row_id":row_id
						, "package_id":-1
						, "item_id": $active_item_itemid
						, "row_itemid" : -1
						, "kind":$("#kind").val()
						, "number_of_packages":$("#numbers").val()
						, "marks":$("#mark").val()
						, "flag":"NEW"
					}
				);
			} else {
				row_id = $("#package_details_id").val();
				$item_packages_json[row_id].flag = ($("#package_id").val() == -1) ? "NEW" : "UPDATE";
				
				$item_packages_json[row_id].kind = $("#kind").val();
				$item_packages_json[row_id].number_of_packages = $("#numbers").val();
				$item_packages_json[row_id].marks = $("#mark").val();
			}
			
			listItemPackagesJson();
			$('#item_packages_modal').modal('hide');
		}  
		else{
			var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
			if(modaldata.view == "declaration_items"){
				$('#item_details_modal').animate({ scrollTop: 0 }, 'slow');
				$('#response_item_details_modal').empty().prepend(alert_required).fadeIn();
			}
			else if(modaldata.view == "item_tax_lines"){
				$('#item_tax_lines_modal').animate({ scrollTop: 0 }, 'slow');
				$('#response_item_tax_lines_modal').empty().prepend(alert_required).fadeIn();

			}
			else if(modaldata.view == "item_prev_docs"){
				$('#item_prev_docs_modal').animate({ scrollTop: 0 }, 'slow');
				$('#response_item_prev_doc_modal').empty().prepend(alert_required).fadeIn();

			}
			else if(modaldata.view == "item_containers"){
				$('#item_containers_modal').animate({ scrollTop: 0 }, 'slow');
				$('#response_item_containers_modal').empty().prepend(alert_required).fadeIn();

			}
			else if(modaldata.view == "item_prod_doc"){
				$('#item_prod_doc_modal').animate({ scrollTop: 0 }, 'slow');
				$('#response_item_prod_doc_modal').empty().prepend(alert_required).fadeIn();

			}
			else if(modaldata.view == "item_ai_stmt"){
				$('#item_ai_stmt_modal').animate({ scrollTop: 0 }, 'slow');
				$('#response_item_ai_stmt_modal').empty().prepend(alert_required).fadeIn();

			}
			else if(modaldata.view == "item_packages"){
				$('#item_packages_modal').animate({ scrollTop: 0 }, 'slow');
				$('#response_item_packages_modal').empty().prepend(alert_required).fadeIn();

			}
		}
		

	});
	
	$('textarea').live('blur',function() {
	    if($(this).val() === '' && !$(this).hasClass('datepicker') && !$(this).hasClass('filter-input-fld')){
	      $(this).parent().addClass('highlight');
	    } else {
	      $(this).parent().removeClass('highlight');
	    }
	});


	/**
	* Customer Portal item save/update
	*/
	$('#submit-item-declaration').click(function(e){
	  	$('.highlight').removeClass('highlight');
	  	e.preventDefault();
		var returnPath = $(this).data().path;
		var declaration_id = $('#declaration_id').val();
		var portal_type = $("#portal_type").val();
		
		//Store multi data into input 
		$("#declaration_items_json").val(encodeURI(JSON.stringify($declaration_items_json)));
		$("#item_tax_lines_json").val(encodeURI(JSON.stringify($item_tax_lines_json)));
		$("#item_prev_docs_json").val(encodeURI(JSON.stringify($item_prev_docs_json)));
		$("#item_packages_json").val(encodeURI(JSON.stringify($item_packages_json)));
		$("#item_containers_json").val(encodeURI(JSON.stringify($item_containers_json)));
		$("#item_ai_stmt_json").val(encodeURI(JSON.stringify($item_ai_stmt_json)));
		$("#item_prod_doc_json").val(encodeURI(JSON.stringify($item_prod_doc_json)));

	    $(this).prop('disabled','disabled');
		$.ajax({
		    type: 'POST',
		    url: appHome + '/customer-portal/' + portal_type + '/' + declaration_id + '/items',
		    data: $("#declaration-item-form").serialize().replace(/%5B%5D/g, '[]'),
		    success: function(response){
		      window.location.href = returnPath;
		      localStorage.setItem('response', response);
		    },
		    error: function(response){
		      $('html, body').animate({ scrollTop: 0 }, 400);
		      $('form').find('#response').empty().prepend(alert_error).fadeIn();
		    }
		});
	
	});
	

	$(document).on('click', '#btn-import-sequioa', function (e) {
		e.preventDefault();
		$('#import-sequioa').modal('show');
	});
    
    $(document).on('click', '#btn-import-seq', function (e) {
      	e.preventDefault();
        var form = '#import-seq-form';
		success = [];
		
		highlight($(form).find('#declaration_ucr_val'), '');
		
		var check_fields = (success.indexOf(false) > -1);
		
	    if(check_fields != true) {
			$("#btn-import-seq").find('i').removeClass().addClass("fa fa-spinner fa-spin");
			var declaration_ucr = $("#declaration_ucr_val").val();
		    var declaration_ucr_part = $("#declaration_ucr_part_val").val();
			var declaration_id = $("#declaration_id").val();
			var template_id = $("#template_id").val();
			var custom_type = $("#custom_type").val();
			var request_type = $("#request_type").val();
			
		    $.ajax({
		        type: 'POST',
		        url: appHome+'/customer-portal/common_ajax',
		        data: {
					'declaration_ucr' 	: declaration_ucr,
					'declaration_ucr_part': declaration_ucr_part,
					'declaration_id' : declaration_id,
					'template_id' : template_id,
					'custom_type' : custom_type,
					'request_type' : request_type,
					'action_type' : 'import_sequoia'
				},
		        success: function(response){
		        	response = JSON.parse(response);
					if(response.status == "success"){
						$('html, body').animate({ scrollTop: 0 }, 400);
						successMessage = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> '+ response.message +'</div>';
						localStorage.setItem('response', successMessage);
						window.location.reload();
					} else {
						alertError = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> '+ response.message +'</div>';
						$('#import-sequioa').modal('hide');
						$('html, body').animate({ scrollTop: 0 }, 400);
	          			$('#response').empty().prepend(alertError).fadeIn();
					}
		        },
		        error: function(response){
		           $('html, body').animate({ scrollTop: 0 }, 400);
		           $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
		    });
		}

	});
	

	$('#import-sequioa').on('hidden.bs.modal', function () {
      	$("#btn-import-seq").find('i').removeClass().addClass("fa fa-check-circle");
		$("#declaration_ucr_val").val("");
		$("#declaration_ucr_part_val").val("");
      	$('.modal-body .highlight').removeClass('highlight');
    });


    $(document).on('click', '#btn-submit-sequioa', function (e) {
        e.preventDefault();
		var declaration_id = $("#declaration_id").val();
		$("#btn-submit-sequioa").find('i').removeClass().addClass("fa fa-spinner fa-spin");
		$("#btn-submit-sequioa").attr('disabled', true);
		$.ajax({
		    type: 'POST',
		    url: appHome+'/customer-portal/common_ajax',
		    data: {
							'declaration_id': declaration_id,
							'request-type' : $('#saved-req-type').val(),
							'importcount' : $("#import_count").val(),
							'action_type' 	: 'submit_sequoia'
			},
		    success: function(response){
		        	response = JSON.parse(response);
		        	$("#btn-submit-sequioa").find('i').removeClass("fa fa-spinner fa-spin");
					$("#btn-submit-sequioa").attr('disabled', false);

		        	$('#response').html(response.message);
		        	$('html, body').animate({ scrollTop: 0 }, 400);

					if(response.status == "success"){
						expandLog();
						getuplodadedSquiaDoc();
					}
		        },
		        error: function(response){
				   $("#btn-submit-sequioa").attr('disabled', false);
		           $('html, body').animate({ scrollTop: 0 }, 400);
		           $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
		    });
		

	});

	$(document).on('click', '.expand_log', function (e) {
        e.preventDefault();
		expandLog();
	});

	$(document).on('click', '.expand_file', function (e) {
        e.preventDefault();
		getuplodadedSquiaDoc();
	});

	function expandLog(){
		var declaration_id = $("#declaration_id").val();
		$.ajax({
		    type: 'POST',
		    url: appHome+'/customer-portal/common_ajax',
		    data: {
					'declaration_id': declaration_id,
					'action_type' 	: 'get_log_info'
			},
		    success: function(response){
		        	$('#log_div').html(response);
		        	$('#loginfo_btn').removeClass('expand_log');
		        },
		        error: function(response){
		           $('html, body').animate({ scrollTop: 0 }, 400);
		           $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
		    });
	}

	function getuplodadedSquiaDoc(){
		var declaration_id = $("#declaration_id").val();
		$.ajax({
		    type: 'POST',
		    url: appHome+'/customer-portal/common_ajax',
		    data: {
					'declaration_id': declaration_id,
					'action_type' 	: 'get_file_info'
			},
		    success: function(response){
		        	$('#file_div').html(response);
		        	$('#fileinfo_btn').removeClass('expand_file');
		        },
		        error: function(response){
		           $('html, body').animate({ scrollTop: 0 }, 400);
		           $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
		});
	}

	//Plus / Minus button
	$('.scroll-up-btn').click(function(){
		    $(this).find('i').toggleClass('fa-minus-circle fa-plus-circle');    
	});

	$(document).on('change', '#request_type', function(e){

		var imp = $('#declaration_type').attr('data-imp').split(',');
		var exp = $('#declaration_type').attr('data-exp').split(',');
		var savedVal = $('#declaration_type').attr('data-selected');
		$('#declaration_type').val('');
		$('#declaration_type option').removeClass('hide');

		if($(this).val() == 1){ //EXPORT
			$.each(imp, function( index, value ) {
			  $('#declaration_type option[value="'+value+'"]').addClass('hide');;
			});
		}else if($(this).val() == 2){ //IMPORT
			$.each(exp, function( index, value ) {
			  $('#declaration_type option[value="'+value+'"]').addClass('hide');;
			});
		}
		if(!$('#declaration_type option[value="'+savedVal+'"]').hasClass('hide')){
			$('#declaration_type').val(savedVal);
		}
		$('#declaration_type').trigger("chosen:updated");
		$('#sub_division').val('');
		$('#sub_division').trigger("chosen:updated");
		enabledisableExpImpvalues();
	});
	var form_type = $('#form_type').val();
	var request_type = $('#request_type').val();

	function validateItemElements(name, type = 'declaration_items'){
		let vArray = [];
		if(type == 'item_tax_lines'){
			vArray = itemTaxLineValidation;
		}
		else if(type == 'item_prev_docs'){
			vArray = itemPrevDocsValidation;
		}
		else if(type == 'item_containers'){
			vArray = itemContainersValidation;
		}
		else if(type == 'item_prod_doc'){
			vArray = itemProdDocsValidation;
		}
		else if(type == 'item_ai_stmt'){
			vArray = itemAiSmtValidation;
		}
		else if(type == 'item_packages'){
			vArray = itemPackagesValidation;
		}
		else{
			vArray = itemValidationArray;
		}
		let index = vArray.findIndex(el => el.name == name);
		if(index > -1){
			var regex = request_type == 2? vArray[index].importRegexPattern :vArray[index].exportrRegexPattern;
			let value = $('#'+vArray[index].input_id).val().trim();
			$('#'+vArray[index].input_id).val(value);
			
			if(name == 'supervisingOfficeName'){
				if($('#supervising_office_name').val().trim() != '' && $('#supervising_office_country_code').val() == ''){
					$('#supervising_office_country_code').parent().addClass('highlight');
					success.push(false);
					return false;
				}

				if($('#supervising_office_name').val().trim() == '' && (
					$('#supervising_office_street').val() != '' ||
					$('#supervising_office_city').val() != '' ||
					$('#supervising_office_post_code').val() != '' ||
					$('#supervising_office_country_code').val() != '')){

					$('#supervising_office_name').parent().addClass('highlight');
					if($('#supervising_office_country_code').val() == '') {
						$('#supervising_office_country_code').parent().addClass('highlight');
					}
					success.push(false);
					return false;
				}
			}

			if(vArray[index].base == 'integer' || vArray[index].base == 'double'){
				if(
					(vArray[index].minOccurs && !value) ||
					(value && (isNaN(value) || 
					value < vArray[index].minValue ||
					value > vArray[index].maxValue))
				) {
					$('#'+vArray[index].input_id).parent().addClass('highlight');
					success.push(false);
					return false;
				}
			}
			else if(vArray[index].base == 'string'){
				if(
					(vArray[index].minOccurs && !value)
					|| (value && !(regex.test(value) || 
									(vArray[index].defaultValue && value == vArray[index].defaultValue)
								)
						)
				) {
					$('#'+vArray[index].input_id).parent().addClass('highlight');
					success.push(false);
					return false;
				}
			}
		}
		return true;
	}
	
	if(form_type == "item_add_form" && (request_type == 1 || request_type == 2)){
		let array = [];
		array.push(...itemValidationArray);
		array.push(...itemTaxLineValidation);
		array.push(...itemPrevDocsValidation);
		array.push(...itemContainersValidation);
		array.push(...itemProdDocsValidation);
		array.push(...itemAiSmtValidation);
		array.push(...itemPackagesValidation);
		array.forEach((el)=> {
			$('#'+el.input_id).addClass('tooltip-inputs');
			if(el.maxlength) $('#'+el.input_id).attr('maxlength', el.maxlength);
			if(el.maxValue) $('#'+el.input_id).attr('data-max-value', el.maxValue);
			if(el.minOccurs == 1) $('#'+el.input_id).parent().find('label').addClass('required');
			else $('#'+el.input_id).parent().find('label').removeClass('required');
			if(request_type == 1){
				$('#'+el.input_id).attr('data-original-title', el.exportTitle)
			}
			else if(request_type == 2){
				$('#'+el.input_id).attr('data-original-title', el.importTitle)
			}
			if(el.base == "double"){
				$('#'+el.input_id).attr('data-decimal-point', el.decimal_point);
			}
		});

		$(".tooltip-inputs").tooltip();
	}

	if(form_type == "declaration_add_or_edit_form"){
		let array = [];
		array.push(...validationElements);
		array.push(...prodDocsValidation);
		array.push(...sealsValidation);
		array.push(...extReferenceValidation);
		array.push(...aiSmtValidation);
		array.push(...traderValidationArr);
		array.forEach((el)=> {
			$('#'+el.input_id).addClass('tooltip-inputs');
			if(el.minOccurs == 1) $('#'+el.input_id).parent().find('label').addClass('required');
			else $('#'+el.input_id).parent().find('label').removeClass('required');
			if(el.maxlength) $('#'+el.input_id).attr('maxlength', el.maxlength);
			if(el.maxValue) $('#'+el.input_id).attr('data-max-value', el.maxValue);
			$('#'+el.input_id).attr('data-original-title', el.tooltipTitle)
			
			if(el.base == "double"){
				$('#'+el.input_id).attr('data-decimal-point', el.decimal_point);
			}
		});
		$(".tooltip-inputs").tooltip();
	}

	function validateDeclarationElements(name, type = 'main'){
		let vArray = [];
		if(type == 'seals'){
			vArray = sealsValidation;
		}
		else if(type == 'prod_doc'){
			vArray = prodDocsValidation;
		}
		else if(type == 'ext_ref'){
			vArray = extReferenceValidation;
		}
		else if(type == 'ai_statement'){
			vArray = aiSmtValidation;
		}
		else if(type == 'trader'){
			vArray = traderValidationArr;
		}
		else{
			vArray = validationElements;
		}
		let index = vArray.findIndex(el => el.name == name);

		if(index > -1){
			var regex = vArray[index].regexPattern;
			let value = $('#'+vArray[index].input_id).val().trim();
			$('#'+vArray[index].input_id).val(value);

			if(name == 'supervisingOfficeName'){
				if($('#supervising_office_name').val().trim() != '' && $('#supervising_office_country_code').val() == ''){
					$('#supervising_office_country_code').parent().addClass('highlight');
					success.push(false);
					return false;
				}

				if($('#supervising_office_name').val().trim() == '' && (
					$('#supervising_office_street').val() != '' ||
					$('#supervising_office_city').val() != '' ||
					$('#supervising_office_post_code').val() != '' ||
					$('#supervising_office_country_code').val() != '')){

					$('#supervising_office_name').parent().addClass('highlight');
					if($('#supervising_office_country_code').val() == '') {
						$('#supervising_office_country_code').parent().addClass('highlight');
					}
					success.push(false);
					return false;
				}
			}

			if(vArray[index].base == 'integer' || vArray[index].base == 'double'){
				if(
					(vArray[index].minOccurs && !value) ||
					(value && (isNaN(value) || 
					value < vArray[index].minValue ||
					value > vArray[index].maxValue))
				) {
					$('#'+vArray[index].input_id).parent().addClass('highlight');
					success.push(false);
					return false;
				}
			}
			else if(vArray[index].base == 'string'){
				if(
					(vArray[index].minOccurs && !value)
					|| (value && !(regex.test(value) || 
									(vArray[index].defaultValue && value == vArray[index].defaultValue)
								)
						)
				) {
					$('#'+vArray[index].input_id).parent().addClass('highlight');
					success.push(false);
					return false;
				}
			}
		}
		return true;
	}
	
	$(document).on('change', '#declaration_type', function(e){
		var declarationTYpe = $(this).val();
		if(declarationTYpe != ""){
			$('#sub_division option').addClass('hide');
			$('#sub_division option[data-subtype="'+ declarationTYpe +'"]').removeClass('hide');
		} else {
			$('#sub_division option').removeClass('hide');
		}
		
		if($('#sub_division :selected').data('subtype') != declarationTYpe){
			$('#sub_division').val('');
		}
		
		$('#sub_division').trigger("chosen:updated");
	});

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
	if($('#doublescroll table tr').length > 5){
		DoubleScroll(document.getElementById('doublescroll'));
	}
	if($('#page').val() == 'edit'){
		enabledisableExpImpvalues();
	}

	if($("#goods_location_port_iata_port").length > 0 || $("#declaration_badge_location_iata_port_code").length > 0 || $('#airport_of_loading_iata_port').length > 0 || $('#port_of_arrival').length > 0){
    		$("#goods_location_port_iata_port,#declaration_badge_location_iata_port_code,#airport_of_loading_iata_port, #port_of_arrival").autocomplete({
		      source:  appHome+'/customer-portal/get_iatacode',
		      minLength: 1,
		      type: "GET",
		      success: function (event, ui) {},
			  select: function (event, ui) {
			    	event.preventDefault();
					$(this).val(ui.item.value);
					return false;
			  },
			  focus: function(event, ui) {
			        event.preventDefault();
			        $(this).val(ui.item.label);
			  },
			  change: function (event, ui) {
		         if (ui.item === null) {
		            $("this").val('');
		         }
			  }
		});	
    }
    
	if($("#goods_location_port_ocean_port").length > 0 || $('#declaration_badge_location_ocean_port_code').length > 0 || $('#airport_of_loading_ocean_port').length > 0){
    		$("#goods_location_port_ocean_port,#declaration_badge_location_ocean_port_code,#airport_of_loading_ocean_port").autocomplete({
		      source:  appHome+'/customer-portal/get_unlocodes',
		      minLength: 1,
		      type: "GET",
		      success: function (event, ui) {},
			  select: function (event, ui) {
			    	event.preventDefault();
					$(this).val(ui.item.value);
					return false;
			  },
			  focus: function(event, ui) {
			        event.preventDefault();
			        $(this).val(ui.item.label);
			  },
			  change: function (event, ui) {
		         if (ui.item === null) {
		            $("this").val('');
		         }
			  }
		});	
    } 

	if($('#page').val() == 'edit' && $('#page_type').val() == 'edit') $('.datetimepicker').datetimepicker({format: date_time_format});

	/*
	$(document).on('click', '#btn-link-job', function (e) {
		e.preventDefault();
		$("#btn-link-job-ok").find('i').removeClass().addClass("fa fa-check-circle");
      	$('.modal-body .highlight').removeClass('highlight');
		$('#link-job-modal').modal('show');
	});

	$(document).on('click', '#btn-link-job-ok', function (e) {
		var declaration_id 	= $("#declaration_id").val();
		var job_number 		= $("#declaration_job").val();
		var job_ref_id 		= $("#declaration_job_id").val();
		var declaration_ucr = $("#declaration_ucr_job_link").val();
		success = [];
		
		highlight($('#declaration_job'), '');
		highlight($('#declaration_ucr_job_link'), '');
		
		var check_fields = (success.indexOf(false) > -1);
		if(check_fields !== true){
			$("#btn-link-job-ok").find('i').removeClass().addClass("fa fa-spinner fa-spin");
			
			$.ajax({
				url:appHome+'/customer-portal/common_ajax',
				type: 'post',
				data: {
						'declaration_id' : declaration_id,
						'declaration_ucr' : declaration_ucr,
						'job_number' : job_number,
						'job_ref_id' : job_ref_id,
						'action_type' : 'link_job'
					  },
				success: function(response){
		        	response = JSON.parse(response);
					if(response.status == "success"){
						alertMessage = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> '+ response.message +'</div>';
						window.location.reload();
						localStorage.setItem('response', alertMessage);
					} else {
						alertMessage = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> '+ response.message +'</div>';
					}
					$('html, body').animate({ scrollTop: 0 }, 400);
					$('#response').empty().prepend(alertMessage).fadeIn();
					$('#link-job-modal').modal('hide');
		        },
		        error: function(response){
		           $('html, body').animate({ scrollTop: 0 }, 400);
		           $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
			});
		}
	  	
	});*/
	

});//End of document ready

function enabledisableExpImpvalues(){
		var arrdata = JSON.parse($('#import_export_hidden_values').val());
		var exptype = $('#request_type').val();
		if(exptype == 1){ //EXPORT
			disableEnableArr(arrdata.IMPORT,true);
			disableEnableArr(arrdata.EXPORT,false);
			$('.routing-seals-div').show();
		}else if(exptype == 2){ //Import
			disableEnableArr(arrdata.EXPORT,true);
			disableEnableArr(arrdata.IMPORT,false);
			$('.routing-seals-div').hide();
		}else{ //all enable
			disableEnableArr(arrdata.EXPORT,false);
			disableEnableArr(arrdata.IMPORT,false);
			$('.routing-seals-div').show();
		}
	}

	function disableEnableArr(arr,typeAct){
		$.each(arr, function( index, value ) {
			if(typeAct == true){
				$('#'+value).val('');
				if($('#'+value).hasClass('datepicker')){
					$('#'+value).datepicker( "destroy" );
				}
			}else{
				if($('#'+value).hasClass('datepicker')){
					$('#'+value).datepicker({
					    dateFormat: btl_default_date_format,
					    changeMonth: true,
					    changeYear: true,
					    inline: true,
					    startDate: 0
					});
				}
			}

		   if($('#'+value).hasClass('chosen')){
		   		$('#'+value).attr('disabled', typeAct).trigger("chosen:updated");
		   }else{
		   		$('#'+value).attr('readonly',typeAct);
		   }
		});
	}

	function decimalNumberCustomerPortal(data) {
		var re = /^-?\d+(\.\d{1,2})?$/;
		var result = 0;
		let max_value = data.dataset.maxValue? data.dataset.maxValue: 99999999;
		var decimal_point = data.dataset.decimal_point? data.dataset.decimal_point: 2;
		if(data.value != "")
		{
			result = parseFloat(data.value).toFixed(decimal_point);
			if(!re.test(data.value))
			{
				if(result != 'NaN'){
					$(data).val(result);
				} else {
					$(data).val('');
				}
			} else {
				if(result == 0) $(data).val(0);
				if(parseFloat(result) > parseFloat(max_value)) {
					alert('You have exceeded the maximum limit!\n Your entered value will be truncated to maximum limit.');
					result = max_value;
				}
				$(data).val(result);
			}
		}
	
	}

	function NonDecimalNumberCustomerPortal(data) {
		var re = /^-?\d+(\.\d{1,2})?$/;
		var result = 0;
		let max_value = data.dataset.maxValue? data.dataset.maxValue: 99999999;
		if(data.value != "")
		{
			result = parseInt(data.value);
			
			if(!re.test(data.value))
			{
				if(result != 'NaN'){
					$(data).val(result);
				} else {
					$(data).val('');
				}
			} else {
				if(result == 0) $(data).val(0);
				if(result > max_value) {
					alert('You have exceeded the maximum limit!\n Your entered value will be truncated to maximum limit.');
					result = max_value;
				}
				result = parseInt(result);
				$(data).val(result);
			}
		}
	}
	
	
	if($("#page").val() == "edit"){
		//Autocomplete
		$("#declaration_job").autocomplete({
			  source: function(request, response) {
				 	$.ajax({
							url: appHome + '/customer-portal/common_ajax',
				            dataType: "json",
				            data: {
				                term : request.term,
								cust_id : $("#customer_trader_id").val(),
								action_type : 'get_jobs_to_link'
				            },
				            success: function(data) {
				                response(data);
				            }
				        });
				  },
		
		      minLength: 1,
		      type: "POST",
		      success: function (event, ui) {},
			  select: function (event, ui) {
		    	event.preventDefault();
				$(this).val(ui.item.label);
				$("#declaration_job_id").val(ui.item.value);
				return false;
			  },
			  focus: function(event, ui) {
			        event.preventDefault();
			        $(this).val(ui.item.label);
			  },
			  change: function (event, ui) {
		         if (ui.item === null) {
		            $(this).val('');
						$("#declaration_job_id").val('');
						BootstrapDialog.show({title: 'Error', message : 'Not a valid Job Number',
							 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',
						});
		         }
			  }
		  });
	}
	
	
$(document).on('click', '#table_row_filter_btn', function (e) {
	var params = [];
	var url = '';
	var qry_param_arr = [];
	var url_qry = '';
	$(".popup-values").each(function(index, element) {
		var id = $(element).attr('name');
		if(id == 'sort-type'){
                  params[id] = $( "input[name='"+id+"']"+ ":checked").val();
		}
		else if(id == 'template_id_filter' || id == 'number_of_items_filter' || id == 'cost_filter'){
              var filVal = $(element).val();
              if(filVal.indexOf('>=') != -1){
              	params[id] = filVal.replace('>=','gteq');
              }
			  else if(filVal.indexOf('<=') != -1 ){
			  	params[id] = filVal.replace('<=','lteq');
			  }		  
			  else if(filVal.indexOf('>') != -1){
			  	params[id] = filVal.replace('>','gt');
			  }			  
			  else if(filVal.indexOf('<') != -1){
			  	params[id] = filVal.replace('<','lt');
			  }			  
			  else if(filVal.indexOf('=') != -1 ){
			  	params[id] = filVal.replace('=','eq');
			  }
			  
		}
		else{
		  params[id] = $(element).val();	
		}
		
	});
	params['pagesize'] = $('#pagesize').val();
	console.log(params);
    for (var key in params)
    {
    	if(key == 'url_field'){
         url = appHome+ params[key];
    	}
    	else if(key == 'color_filter[]'){
    		for(i=0;i<params[key].length;i++){
    			qry_param_arr.push(key+'='+params[key][i]);
    		}
    	}
    	else{
    	 qry_param_arr.push(key+'='+params[key]);	
    	}
    }
    url_qry = qry_param_arr.join('&');
    url += '?' + url_qry;
    window.location.href = url;
});

function togglePopupFilters(){
	var scrollWidth = $('#scrollDiv div').width();
	if($('#filterToggler').hasClass('filter-expand')){
		$('.popup a .popup-values').removeClass('form-control');
		$('#filterToggler').removeClass('filter-expand');
		$('#filterToggler').html("<i class='fa fa-compress'></i>");
		$('#scrollDiv div').css('width',(scrollWidth * 2.8));
	}
	else{
		$('.popup a .popup-values').addClass('form-control');
		$('#filterToggler').addClass('filter-expand');
		$('#filterToggler').html("<i class='fa fa-expand'></i>");
		$('#scrollDiv div').css('width',(scrollWidth / 2.8));
	}
}

//save 
$('#save_params').click(function(e){
	$('.highlight').removeClass('highlight');
	e.preventDefault();
	var form = '#traffic_params_form';
	success = []; 
	highlight($(form).find('#lower_limit'), '');
	highlight($(form).find('#upper_limit'), '');
	//highlight for form validations
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
	var msg_alert =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>'; 
	var success_msg = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Parameters Saved Successfully.</div>' ;
	var lower_val = $("#lower_limit").val();
	var higher_val = $("#upper_limit").val();
	if(higher_val<=lower_val){
		success.push(false);
		msg_alert =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh! Lower Limit must be lower than higher limit.</strong>.</div>';
	}	      
	var check_fields = (success.indexOf(false) > -1);
	if(check_fields === true){
		  $(form).find('#traffic-response').empty().prepend(msg_alert).fadeIn();
	} else {		
		$.ajax({
				type: 'POST',
				url: appHome+'/customer-portal/common_ajax',
				data: {
					'lower' :lower_val,
					'higher':higher_val,
					'action_type':'set_traffic_light_params'
				},
				success: function(response){
					$('#trafficLightSettings').modal('hide');
					window.location.reload();
					$('html, body').animate({ scrollTop: 0 }, 400);
					$('#response').empty().html(success_msg).fadeIn();			
				},
				error: function(response){
					$('#create_new_customer_modal').modal('hide');
					$('html, body').animate({ scrollTop: 0 }, 400);
					$('#response').empty().html(alert_error).fadeIn();
			    }
		});
	}
});

$(document).ready(function(){
	if($(".multi-sel-ctrl").length > 0){
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
				 if(checked === false && element.parent().val() == null ){
					 element.parent().val('');
					 element.parent().multiselect('refresh');
				 }
			}
	  });
	}
	$('.tmp-input-ctrl').remove();
	$('#color_filter').addClass('popup-values');
});
$('#trafficLightSettings').on('hidden.bs.modal', function (e) {
       $("#traffic-response").empty();
	   $('.highlight').removeClass('highlight');
}); 
