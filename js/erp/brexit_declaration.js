$(document).ready(function(){

/************************************************************** Pradeep ****************************************************************/

$(document).on('click', '#generate-xml', function(e){
	var return_path = $("#job-url").val();
	var generate_xml_url = $(this).attr('data-path');
	var successMessage = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> Generated XML</div>';
	var _this = $(this);
	
	_this.html('<span class="fa fa-refresh fa-spin"></span> Generate XML');
	_this.attr('disabled', 'disabled');
	
	$.ajax({
        type: 'GET',
        url: generate_xml_url,
        data: {},
        success: function(response){
			response = JSON.parse(response);
			
			if(response.status == "success"){
				localStorage.setItem('response', successMessage);
				window.location.href = return_path;
				_this.html('<span class="glyphicon glyphicon-ok-sign"></span> Generate XML');
				_this.removeAttr('disabled');	
			} else {
				alertError = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> '+ response.message +'</div>';
				$('html, body').animate({ scrollTop: 0 }, 400);
	          	$('#response').empty().prepend(alertError).fadeIn();
				_this.html('<span class="glyphicon glyphicon-ok-sign"></span> Generate XML');
				_this.removeAttr('disabled');
				console.log(response);
			}
        },
        error: function(response){
        	$('html, body').animate({ scrollTop: 0 }, 400);
          	$('form').find('#response').empty().prepend(alert_error).fadeIn();
			_this.html('<span class="glyphicon glyphicon-ok-sign"></span> Generate XML');
			_this.removeAttr('disabled');
        }
    });

})

var $material_tr = "";

//Edit material
$(document).on('click', '.manage-material', function(e){

	$material_tr = $(this);
	
	$("#inv_item_id_modal").val($(this).siblings(".inv_item_id").val());
	$("#inv_item_inv_id_modal").val($(this).siblings(".inv_item_inv_id").val());
	$("#item_type_modal").val('UPDATE');
	$("#invoice_item_vehicle_container_number").val($(this).siblings(".invoice_item_vehicle_container_number_ar").val());
	$("#invoice_item_material_description").val($(this).siblings(".invoice_item_material_description_ar").val());
	$("#invoice_item_pkg_number").val($(this).siblings(".invoice_item_pkg_number_ar").val());
	$("#invoice_item_pkg_kind").val($(this).siblings(".invoice_item_pkg_kind_ar").val());
	$("#invoice_item_unit_value").val($(this).siblings(".invoice_item_unit_value_ar").val());
	$("#invoice_item_unit_value_currency").val($(this).siblings(".invoice_item_unit_value_currency_ar").val());
	$("#invoice_item_hs_code").val($(this).siblings(".invoice_item_hs_code_ar").val());
	$("#invoice_item_recipe_code").val($(this).siblings(".invoice_item_recipe_code_ar").val());
	$("#invoice_item_net_weight").val($(this).siblings(".invoice_item_net_weight_ar").val());
	$("#invoice_item_countr_origin").val($(this).siblings(".invoice_item_countr_origin_ar").val());
	$("#invoice_item_isdualuse").val($(this).siblings(".invoice_item_isdualuse_ar").val());
	$("#invoice_item_is_licence_reqd").val($(this).siblings(".invoice_item_is_licence_reqd_ar").val());
	$("#invoice_item_licence_no").val($(this).siblings(".invoice_item_licence_no_ar").val());
	$("#invoice_item_pref_scheme").val($(this).siblings(".invoice_item_pref_scheme_ar").val());
	$("#invoice_item_pref_supporting_doc").val($(this).siblings(".invoice_item_pref_supporting_doc_ar").val());
	$("#invoice_item_pref_quota").val($(this).siblings(".invoice_item_pref_quota_ar").val());

	$("#equipment_material_modal").modal('show');
})

//Material modal after hide function
$('#equipment_material_modal').on('hidden.bs.modal', function(){
	$defautValues = $("#material-data").data();
	
	$("#inv_item_id_modal").val('');
	$("#inv_item_inv_id_modal").val('');
	$("#item_type_modal").val('ADD');
	$("#invoice_item_vehicle_container_number").val($defautValues.container_number);
	$("#invoice_item_material_description").val($defautValues.material_description);
	$("#invoice_item_pkg_number").val($defautValues.pkg_number);
	$("#invoice_item_pkg_kind").val($defautValues.pkg_kind);
	$("#invoice_item_unit_value").val('');
	$("#invoice_item_unit_value_currency").val('');
	$("#invoice_item_hs_code").val('');
	$("#invoice_item_recipe_code").val('');
	$("#invoice_item_net_weight").val($defautValues.net_weight);
	$("#invoice_item_countr_origin").val($defautValues.countr_origin);
	$("#invoice_item_isdualuse").val('');
	$("#invoice_item_is_licence_reqd").val('');
	$("#invoice_item_licence_no").val('');
	$("#invoice_item_pref_scheme").val('');
	$("#invoice_item_pref_supporting_doc").val('');
	$("#invoice_item_pref_quota").val('');
});

//Add & Update 
$(document).on('click', '#material-save', function(e){
	
	$('.highlight').removeClass('highlight');
     e.preventDefault();
	 var success = [];

		function highlight(field, empty_value){
		    if(field.length > 0){
		      if(field.val() === empty_value){
		        $(field).parent().addClass('highlight');
	        	success.push(false);
	      	  } else {
	        	$(field).parent().removeClass('highlight');
	        	success.push(true);
	      		}
	    	}
  		}

	highlight($('#invoice_item_vehicle_container_number'), '');
	//highlight($('#invoice_item_material_description'), '');
	highlight($('#invoice_item_pkg_number'), '');
	highlight($('#invoice_item_pkg_kind'), '');
	highlight($('#invoice_item_unit_value'), '');
	highlight($('#invoice_item_unit_value_currency'), '');
	highlight($('#invoice_item_hs_code'), '');
	highlight($('#invoice_item_net_weight'), '');
	highlight($('#invoice_item_countr_origin'), '');
	highlight($('#invoice_item_isdualuse'), '');
	highlight($('#invoice_item_is_licence_reqd'), '');
	highlight($('#invoice_item_pref_scheme'), '');
	
	if($('#invoice_item_pkg_number').val()== "0"){
		$('#invoice_item_pkg_number').parent().addClass('highlight');
		success.push(false);
	}	    
	var check_fields = (success.indexOf(false) > -1);
		if(check_fields == false){
			$('#equipment_material_modal').animate({ scrollTop: 0 }, 400);
			$('#equipment_material_modal').modal('hide');
	 	

	if($("#item_type_modal").val() == "ADD"){
		$("#material-table").append(
			'<tr class="rw_data">' +
                '<td>' + $("#invoice_item_vehicle_container_number").val() + '</td>' + 
      	        '<td>' + $("#invoice_item_material_description").val() + '</td>' +
      	        '<td>' + $("#invoice_item_pkg_number").val() + '</td>' +
      	        '<td>' + $("#invoice_item_unit_value_currency").val() + '</td>' +
      	        '<td>' + $("#invoice_item_unit_value").val() + '</td>' +
      	        '<td class="action_td">' +
      	        	'<a href="javascript:void(0)" title="Edit materials" class="manage-material"><span class="fa fa-pencil"></span></a> ' +
					'<a href="javascript:void(0)" title="Delete material" class="delete-material delete-icon"><i class="fa fa-trash-o"></i></a>' +
					
					'<input class="inv_item_id" 	name="inv_item_id[]" type="hidden" value="' + $("#inv_item_id_modal").val() + '" />' +
                    '<input class="inv_item_inv_id" name="inv_item_inv_id[]" type="hidden" value="' + $("#inv_item_inv_id_modal").val() + '" />' +
                    '<input class="item_type" 	name="item_type[]" type="hidden" value="' + $("#item_type_modal").val() + '" />' +
                    '<input class="invoice_item_vehicle_container_number_ar" name="invoice_item_vehicle_container_number_ar[]" type="hidden" value="'+ $("#invoice_item_vehicle_container_number").val() + '" />' +
                    '<input class="invoice_item_material_description_ar" name="invoice_item_material_description_ar[]" type="hidden" value="'+ $("#invoice_item_material_description").val() + '" />' +
                    '<input class="invoice_item_pkg_number_ar" 	name="invoice_item_pkg_number_ar[]" type="hidden" value="' + $("#invoice_item_pkg_number").val() + '" />' +
                    '<input class="invoice_item_pkg_kind_ar" 	name="invoice_item_pkg_kind_ar[]" type="hidden" value="' + $("#invoice_item_pkg_kind").val() + '" />' +
                    '<input class="invoice_item_unit_value_ar" 	name="invoice_item_unit_value_ar[]" type="hidden" value="' + $("#invoice_item_unit_value").val() + '" />' +
                    '<input class="invoice_item_unit_value_currency_ar" name="invoice_item_unit_value_currency_ar[]" type="hidden" value="' + $("#invoice_item_unit_value_currency").val() + '" />' +
                    '<input class="invoice_item_hs_code_ar" 	name="invoice_item_hs_code_ar[]" type="hidden" value="' + $("#invoice_item_hs_code").val() + '" />' +
                    '<input class="invoice_item_recipe_code_ar" 	name="invoice_item_recipe_code_ar[]" type="hidden" value="' + $("#invoice_item_recipe_code").val() + '" />' +
                    '<input class="invoice_item_net_weight_ar" 	name="invoice_item_net_weight_ar[]" type="hidden" value="' + $("#invoice_item_net_weight").val() + '" />' +
                    '<input class="invoice_item_countr_origin_ar" 	name="invoice_item_countr_origin_ar[]" type="hidden" value="' + $("#invoice_item_countr_origin").val() + '" />' +
                    '<input class="invoice_item_isdualuse_ar" 	name="invoice_item_isdualuse_ar[]" type="hidden" value="' + $("#invoice_item_isdualuse").val() + '" />' +
                    '<input class="invoice_item_is_licence_reqd_ar" name="invoice_item_is_licence_reqd_ar[]" type="hidden" value="' + $("#invoice_item_is_licence_reqd").val() + '" />' +
                    '<input class="invoice_item_licence_no_ar" 	name="invoice_item_licence_no_ar[]" type="hidden" value="' + $("#invoice_item_licence_no").val() + '" />' +
                    '<input class="invoice_item_pref_scheme_ar" 	name="invoice_item_pref_scheme_ar[]" type="hidden" value="' + $("#invoice_item_pref_scheme").val() + '" />' +
                    '<input class="invoice_item_pref_supporting_doc_ar" name="invoice_item_pref_supporting_doc_ar[]" type="hidden" value="' + $("#invoice_item_pref_supporting_doc").val() + '" />' +
                    '<input class="invoice_item_pref_quota_ar" 	name="invoice_item_pref_quota_ar[]" type="hidden" value="'+ $("#invoice_item_pref_quota").val() + '" />' +
      	        '</td>' +
          	  '</tr>' 	
		);
		
		$("#no-rec-tr").remove();
		
	} else {
		$material_tr.parents().find('td').eq(0).text($("#invoice_item_vehicle_container_number").val());
		$material_tr.parents().find('td').eq(1).text($("#invoice_item_material_description").val());
		$material_tr.parents().find('td').eq(2).text($("#invoice_item_pkg_number").val());
		$material_tr.parents().find('td').eq(3).text($("#invoice_item_unit_value_currency").val());
		$material_tr.parents().find('td').eq(4).text($("#invoice_item_unit_value").val());
		
		$material_tr.siblings(".inv_item_id").val($("#inv_item_id_modal").val());
		$material_tr.siblings(".inv_item_inv_id").val($("#inv_item_inv_id_modal").val());
		$material_tr.siblings(".item_type").val('UPDATE');
		$material_tr.siblings(".invoice_item_vehicle_container_number_ar").val($("#invoice_item_vehicle_container_number").val());
		$material_tr.siblings(".invoice_item_material_description_ar").val($("#invoice_item_material_description").val());
		$material_tr.siblings(".invoice_item_pkg_number_ar").val($("#invoice_item_pkg_number").val());
		$material_tr.siblings(".invoice_item_pkg_kind_ar").val($("#invoice_item_pkg_kind").val());
		$material_tr.siblings(".invoice_item_unit_value_ar").val($("#invoice_item_unit_value").val());
		$material_tr.siblings(".invoice_item_unit_value_currency_ar").val($("#invoice_item_unit_value_currency").val());
		$material_tr.siblings(".invoice_item_hs_code_ar").val($("#invoice_item_hs_code").val());
		$material_tr.siblings(".invoice_item_recipe_code_ar").val($("#invoice_item_recipe_code").val());
		$material_tr.siblings(".invoice_item_net_weight_ar").val($("#invoice_item_net_weight").val());
		$material_tr.siblings(".invoice_item_countr_origin_ar").val($("#invoice_item_countr_origin").val());
		$material_tr.siblings(".invoice_item_isdualuse_ar").val($("#invoice_item_isdualuse").val());
		$material_tr.siblings(".invoice_item_is_licence_reqd_ar").val($("#invoice_item_is_licence_reqd").val());
		$material_tr.siblings(".invoice_item_licence_no_ar").val($("#invoice_item_licence_no").val());
		$material_tr.siblings(".invoice_item_pref_scheme_ar").val($("#invoice_item_pref_scheme").val());
		$material_tr.siblings(".invoice_item_pref_supporting_doc_ar").val($("#invoice_item_pref_supporting_doc").val());
		$material_tr.siblings(".invoice_item_pref_quota_ar").val($("#invoice_item_pref_quota").val());
	}
}
})

//Delete
$(document).on('click', '.delete-material', function(e){
	var _this = $(this);
	
	BootstrapDialog.confirm('Are you sure you want to delete this material data ?', function(result){
		if(result) {
			_this.siblings(".item_type").val('DELETE');
			_this.parents('tr').hide();
		} 
	}); 
	
})


function getYourCode($partycode, $compay, $town, $target){
	$code = "";
    
    if($partycode != ""){
        $code = "BTL-" + $partycode;
    } else {
		$code = "BTL-";
		$code += $compay.replaceAll(" ", "").substring(0, 3); 
		$code += $town.replaceAll(" ", "").substring(0, 3);
    }
    
	$target.val($code.toLocaleUpperCase());
}

$(document).on('change', '#jss_consignee_partycode, #jss_consignee_compay, #jss_consignee_region', function(){
	$code = getYourCode($("#jss_consignee_partycode").val(), $("#jss_consignee_compay").val(), $("#jss_consignee_region").val(), $("#jss_consignee_yourcode"));
});
	
$(document).on('change', '#jss_consignor_partycode, #jss_consignor_compay, #jss_consignor_region', function(){
	$code = getYourCode($("#jss_consignor_partycode").val(), $("#jss_consignor_compay").val(), $("#jss_consignor_region").val(), $("#jss_consignor_yourcode"));
});	

//Change code on load 
$code = getYourCode($("#jss_consignee_partycode").val(), $("#jss_consignee_compay").val(), $("#jss_consignee_region").val(), $("#jss_consignee_yourcode"));
$code = getYourCode($("#jss_consignor_partycode").val(), $("#jss_consignor_compay").val(), $("#jss_consignor_region").val(), $("#jss_consignor_yourcode"));

/************************************************************** Nakul ****************************************************************/







/************************************************************** Midhun ****************************************************************/
$(document).on('click', '#view_documents', function(e){
	e.preventDefault();
	
	var job_number = $('#job_number').val();
	$.ajax({
		type: 'POST',
		url: appHome+'/brexit/common-ajax',
		data: {
			'job_number' : job_number,
			'action_type' : 'get_documents_list'
			  },
		success: function(response){
			if(response){
				$('#job_files_section').html(response);
				$('#brexit_files').modal('show');
			}
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});
});

$(document).on('click', '.submit-zip', function(e){
	e.preventDefault();
	var successMessage = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> Zip file submitted</div>';
	var job_number = $('#job_number').val();
	var return_path = $('#job-url').val();
	var _this = $(this);
	_this.html('<span class="fa fa-refresh fa-spin"></span> Submit XML');
	_this.attr('disabled', 'disabled');
	
	$.ajax({
		type: 'POST',
		url: appHome+'/brexit/common-ajax',
		data: {
			'job_number' : job_number,
			'process_type' : $('#form_type').val(),
			'action_type' : 'get_supporting_documents_list'
		},
		success: function(response){
			if(response){
				if(response == 'success'){
					localStorage.setItem('response', successMessage);
					window.location.href = return_path;
					_this.html('<span class="glyphicon glyphicon-ok-sign"></span> Submit XML');
					_this.removeAttr('disabled');	
				}
				else{
					alertError = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong>Some error occured. Please try again.</div>';
					_this.html('<span class="glyphicon glyphicon-ok-sign"></span> Submit XML');
					_this.removeAttr('disabled');	
					$('html, body').animate({ scrollTop: 0 }, 400);
	          		$('#response').empty().prepend(alertError).fadeIn();
				}
			}
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
			_this.html('<span class="glyphicon glyphicon-ok-sign"></span> Submit XML');
			_this.removeAttr('disabled');
		}
	});
});

$(document).on('click', '#business_error_btn', function(){
    $('#business_error_btn i').toggleClass('fa-minus-circle fa-plus-circle');    
});

$(document).on('click', '#schema-error-btn', function(){
    $('#schema-error-btn i').toggleClass('fa-minus-circle fa-plus-circle');    
});





/************************************************************** Bijoy ****************************************************************/

$('.save-import-declaration,.edit-import-declaration').click(function(e){
		  $('.highlight').removeClass('highlight');
		  e.preventDefault();
		  var form = '#'+$(this).closest('form').attr('id'),
		      success = [],
		     path = $(this).attr('data-path');
		  var return_path = $("#job-url").val();

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
		   
			if($("#xml_req").val() == "xml_required"){
				highlight($(form).find('#invoice_import_export_entry_type'), '');
				highlight($(form).find('#invoice_code'), '');
			    highlight($(form).find('#declaration_type'), '');
				highlight($(form).find('#invoice_number'), '');
			    highlight($(form).find('#invoice_named_place'), '');
				highlight($(form).find('#shipment_vehicle_name'), '');
			}
			
		    highlight($(form).find('#invoice_your_ref'), '');
			highlight($(form).find('#jss_consignor_compay'), '');
		    highlight($(form).find('#jss_consignee_compay'), '');
		    highlight($(form).find('#invoice_cpc'), '');
		    highlight($(form).find('#shipment_date_arrive_departure'), '');
		    highlight($(form).find('#shipment_shippingline'), '');
		    highlight($(form).find('#shipment_port'),'');
		    //highlight($(form).find('#shipment_inland_transport_type'), '');
		    highlight($(form).find('#shipment_transport_type'), '');
		    highlight($(form).find('#shipment_outer_pkg_total'), '');
		    highlight($(form).find('#shipment_outer_pkg_type'), '');
			if($('#form_type').val() == "import"){
				highlight($(form).find('#invoice_use_post_var_accounting'), '');
				highlight($(form).find('#shipment_disptach_country'), '');
			} else {
				highlight($(form).find('#shipment_destination_country'), '');
			}
		  	
			if($('#material-table .rw_data').length == 0){
				BootstrapDialog.show({title: 'Warning', message : 'Please enter atleast one equipment detail!',
				buttons: [{
				             label: 'OK',
				             action: function(dialogItself){
				                 dialogItself.close();
				             }
				         }]
				});
				success.push(false);
			}else{
				success.push(true);
			}
		  var check_fields = (success.indexOf(false) > -1);
		  
		  /**
		   * create-vgm-route
		   */
		   if($(this).hasClass('save-import-declaration')){
		     if(check_fields === true){
		       $('html, body').animate({ scrollTop: 0 }, 400);
		       $('form').find('#response').empty().prepend(alert_required).fadeIn();
		     } else { 
		       $.ajax({
		         type: 'POST',
		         url: path+'/declarationCreate',
		         data: $(form).serialize().replace(/%5B%5D/g, '[]'),
		         success: function(response){
		         window.location.href = return_path;
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
		
	$(document).on('change', '#invoice_cpc', function(){
		ctc_discription();
	});
	if(($('#form').val() == "edit") || ($('#form').val() == "add")){
		ctc_discription();
	}
	function ctc_discription(){
		var excat_val = $("#invoice_cpc").val();
		var excat_cpc = $("#invoice_cpc  option:selected").text();
		if((excat_val != null) && (excat_val != "")){
			var result = excat_cpc.match(/\((.*)\)/);
			$('#cpc_code_label').html(result[1]);
		}
	}
	
	$(document).on('click', '.add_new_eqip', function(){
		$("#invoice_item_pref_scheme").val('EUR1INV');
		if($("#jss_consignor_eori_no").val() != ""){
				$("#invoice_item_pref_supporting_doc").val($("#jss_consignor_eori_no").val());
			}else{
				$("#invoice_item_pref_supporting_doc").val('EORI');
			}
	});
/************************************************************** Anoop ****************************************************************/

	
});//End of document ready

$("#jss_consignee_compay").autocomplete({
				      source:  appHome+'/consignees/get_consignees',
				      minLength: 2,
				      type: "GET",
				      success: function (event, ui) {
				    	 
				      },
					  select: function (event, ui) {
						$(this).val(ui.item.label);
						$('#hdn_consig_name').val(ui.item.label);
						$('#hdn_consig_code').val(ui.item.value);
						var consignee = $("#hdn_consig_code").val();
						getConsigneeData(consignee);
						return false;
					  },
					  change: function (event, ui) {
				
					  }
});
  
// $(document).on('blur', '#jss_consignee_compay', function(e) {
// 	var consignee = $("#hdn_consig_code").val();
// 	getConsigneeData(consignee);
	
    
// });

function getConsigneeData(consignee){

	$.ajax({
    	type: 'POST',
   		url: appHome+'/consignees/common_ajax',
   		dataType: 'json',
    	data: {
    		'consignee'    :  consignee,
            'action_type'  : 'get_consignees'
    	},
   		success: function(response){
             $("#jss_consignee_compay").val(response.consig_name);
             $("#jss_consignee_addr1").val(response.consig_addr1);
             $("#jss_consignee_region").val(response.consig_town);
             $("#jss_consignee_postcode").val(response.consig_postcode);
             $("#jss_consignee_eori_no").val(response.consig_eori);
             $("#jss_consignee_country").val(response.consig_country);
             $("#jss_consignee_partycode").val(consignee);
		},
        error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
            }
    });

}
