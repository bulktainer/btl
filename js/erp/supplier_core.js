var initializeOnce = false;

$(document).ready(function(){
	//For supplier matrix new tabs
	if(location.hash != ""){
		$('.nav-tabs a[href="' + location.hash + '"]').tab('show');
		if(location.hash == '#supp_QSSHE'){
			$('.menu-tabs').hide();
			$('#menu-qsshe').show();
		}
		else if(location.hash == '#supp_Accounts'){
			$('.menu-tabs').hide();
			$('#menu-accounts').show();
		}
		else if(location.hash == '#supp_Invoicing'){
			$('.menu-tabs').hide();
			$('#menu-invoicing').show();
		}
		else if(location.hash == '#supp_Operation'){
			$('.menu-tabs').hide();
			$('#menu-operations').show();
		}
		else if(location.hash == '#supp_Procurement'){
			$('.menu-tabs').hide();
			$('#menu-procurement').show();
		}
	} else {
		$('.menu-tabs').hide();
		$('#menu-general').show();
	}
});
$(document).ready(function(){
	
	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
	
	//To do the pagination while we change the count of the result
	$(document).on('change', '.custom-page-pagesize', function (e) {
		 var pagelimit = $(this).val();
		 $('#pagesize').val(pagelimit);
		 $('.supplier_core').submit();
	});

	//To view the details of the corresponding supplier
	$(document).on('click','.view_supplier',function(e){
		e.preventDefault();
		$('.view_small_loader').show();
		$('.reset_values').html('');
		var supp_id = $(this).data('id');
		$.ajax({
			type	: 'POST',
			dataType: 'json',
			url		: appHome+'/supplier-core/common_ajax',
			data	:{
				'supp_id' 		: supp_id,
				'action_type' 	: 'get_supplier_details'
				},
			success	:function(response){
				$('.view_small_loader').hide();
				if(response != ""){
					$('#modal_sup_code').html(response.supplierCode);
					$('#modal_sup_name').html(response.supplierName);
					$('#modal_sup_dep').html(response.supplerDeptCode);
					$('#modal_sup_num').html(response.supplierNumCode);
					$('.sagecode').remove();
					var html = '';
					$.each(response.sage_currency_info, function(key, value){
						html += '<tr class ="sagecode">'
		     							+'<td width="25%"><strong>Sage Code</strong></td>'
		     							+'<td width="25%"><span id="modal_sage_code" class="reset_values">'+value.sage_code+'</span></td>'
		     						+'</tr>';
					
						html += '<tr class ="sagecode">'
		     							+'<td width="25%"><strong>Currency</strong></td>'
		     							+'<td width="25%"><span id="modal_bak_acount" class="reset_values">'+value.currency+'</span></td>'
		     					+'</tr>';
						
					});
					$(html).insertAfter($('.nominalcode').closest('tr'));

					$('#modal_sup_vat').html(response.supplierVatRate);
					$('#modal_sup_resp').html(response.supplierResponseName);
					$('#modal_sup_bill').html(response.supplerBillOffic);
					$('#modal_sup_arch').html(response.supplierArchive);
					$('#modal_sup_email').html(response.supplierEmail);
					$('#modal_sup_reg').html(response.supplierRegion);
					$('#modal_cmr_name').html(response.cmr_area);
				}
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	});
	
	/**
	* Supplier edit and update
	*/
	$('.create-supplier,.edit-supplier').click(function(e){
	  $('.highlight').removeClass('highlight');
	  e.preventDefault();
	  var form = '#'+$(this).closest('form').attr('id'),
	      success = [],
	      path = $(this).attr('data-path'),
		  current_tab = $("#current_tab").val();

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

	function highlight_ary(field, empty_value){
		field.each(function(){
			if($(this).length > 0){
		      if($(this).val().trim() === empty_value){
		        $(this).parent().addClass('highlight');
		        success.push(false);
		      } else {
		        $(this).parent().removeClass('highlight');
		        success.push(true);
		      }
		    }	
		})	
	  }

	  //function to check whether the supplier code exist
	  function isSupplierCodeExists(suppcode,button) {
		ExistSuccess = [];
		if(button.hasClass('edit-supplier')){
	  		var type = "update";
	  	}
	  	if(button.hasClass('create-supplier')){
	  		var type = "create";
	  	}
		var supplierCode = $('#supplier_code').val();
		
		if(type == "create" && supplierCode !=""){
			  $.ajax({
			        type: 'POST',
			        url: appHome+'/supplier-core/common_ajax',
			        async : false,
			        data: {
						'suppliercode' 	: supplierCode,
						'action_type' 	: 'supplierCodeExist'
					},
			        success: function(response){
			        	if(response > 0){
			        		ExistSuccess = 'Exist'
			        		$(suppcode).parent().addClass('highlight');
			        	}else{
			        		ExistSuccess = 'Ok'
				        	$(suppcode).parent().removeClass('highlight');
			        	}
			        },
			        error: function(response){
			          $('html, body').animate({ scrollTop: 0 }, 400);
			          $('form').find('#response').empty().prepend(alert_error).fadeIn();
			        }
			  });
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

	//Gemeral tab
	//var tabs = ['#supp_QSSHE','#supp_Accounts','#supp_Invoicing','#supp_Operation'];
	//if(current_tab == "#supp_general" || ($(this).hasClass('create-supplier') && jQuery.inArray(current_tab, tabs))){
		  highlight($(form).find('#supplier_code'), '');
		  highlight($(form).find('#supplier_name'), '');
		  highlight($(form).find('#region'), '');
		  highlight($(form).find('#invoice_response'), '');
		  highlight($(form).find('#nominal_code'), '');
		  $(".sage_code").each(function() {
			    highlight($(this), '');
		  });
		  $(".currency").each(function() {
				highlight($(this), '');
	      });
		  highlight($(form).find('#vat_rate'), '');
		  highlight($(form).find('#billing_office'), '');
	
		  if($('#supplier_code').val() != '' ){
			  isSupplierCodeExists($(form).find('#supplier_code'),$(this)); //function for chech Supplier cost exist or not
		  }
		  if($('#supplier_email').val() != ''){
		  	isEmail($(form).find('#supplier_email'));
	  	  }
	//}
	//End of General tab
	
	//QSSHE tab
	if(current_tab == "#supp_QSSHE"){
		 var primary_address_check = 0;
	     var supp_type_count = 0;
		 $(".supp_type_cs").each(function(){
			var $prefix = $(this).attr("data-addCsPrefix");
			if($(this).prop("checked")){
				supp_type_count += 1;
				highlight_ary($('input[id^='+$prefix+'sq_contact_person]'), '');
				highlight_ary($('input[id^='+$prefix+'sq_contact_number]'), '');
				highlight_ary($('input[id^='+$prefix+'sq_emergency_number1]'), '');
				highlight_ary($('input[id^='+$prefix+'sq_company]'), '');
				highlight_ary($('input[id^='+$prefix+'sq_addr1]'), '');
				highlight_ary($('input[id^='+$prefix+'sq_town]'), '');
				highlight_ary($('select[id^='+$prefix+'sq_country]'), '');
				
				$('input[id^='+$prefix+'sq_email]').each(function(){
					if($(this).val() != ''){
						isEmail($(this));	
					}	
				});
				
				$('input[id^='+$prefix+'sq_primary_address]').each(function(){
					if($(this).prop("checked")){
						primary_address_check += 1;	
					}	
				});
				
				//This is to open Supplier type divs if it is closed
				$('legend[id^='+ $prefix + 'btn]').each(function(){
					if($(this).find('i').hasClass('fa fa-plus-circle')){
						$(this).trigger("click")	
					}	
				});
				
			} else {
				//This is to close Supplier type divs if it is open
				$('legend[id^='+ $prefix + 'btn]').each(function(){
					if($(this).find('i').hasClass('fa fa-minus-circle')){
						$(this).trigger("click")	
					}	
				});
			}
		 });
	
	     if(primary_address_check == 0 && supp_type_count > 0){
			success.push(false);
			$(".primary-addr-error").text("Set Primary Address in any selected Supplier type");
			/*BootstrapDialog.show({title: 'Warning', message : 'Please set Primary Address in any of the selected Supplier type',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});*/
		 } else {
			$(".primary-addr-error").text("");
		 }
		if($('#director_override').is(':checked')){
			highlight($(form).find('#ref_period'), '');
			highlight($(form).find('#director'), '');
		}

	}
	//End of QSSHE tab
	  
	//Accounts tab
	if(current_tab == "#supp_Accounts"){
		  highlight($(form).find('#sa_depart_code'), '');
		  highlight($(form).find('#sa_nominal_code'), '');
		  highlight($(form).find('#sa_vat_rate'), '');
		  highlight($(form).find('#sa_billing_office'), '');
		  highlight_ary($('input[id^=sa_sage_code]'), '');
		  highlight_ary($('select[id^=sa_currency]'), '');

		  if($('#sa_email').val() != ''){
		  	isEmail($(form).find('#sa_email'));
	  	  }
	}

	//Invoicing tab
	if(current_tab == "#supp_Invoicing"){
		  highlight($(form).find('#si_depart_code'), '');
		  highlight($(form).find('#si_nominal_code'), '');
		  highlight($(form).find('#si_vat_rate'), '');
		  highlight($(form).find('#si_billing_office'), '');
		  highlight_ary($('input[id^=si_sage_code]'), '');
		  highlight_ary($('select[id^=si_currency]'), '');

		  if($('#si_email').val() != ''){
		  	isEmail($(form).find('#si_email'));
	  	  }
	}

	//Operations tab
	if(current_tab == "#supp_Operation"){
		highlight($(form).find('#so_contact_person'), '');
		highlight($(form).find('#so_contact_number'), '');
		highlight($(form).find('#so_emergency_number1'), '');
		highlight($(form).find('#so_company'), '');
		highlight($(form).find('#so_addr1'), '');
		highlight($(form).find('#so_town'), '');
		highlight($(form).find('#so_country'), '');

		if($('#so_email').val() != ''){
		  	isEmail($(form).find('#so_email'));
	  	}
	}
	
	  if(ExistSuccess == 'Exist'){
		  success.push(false);
	  	  alert_required =  '<div class="alert alert-danger alert-dismissable">'
	  		  					+'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
	  		  					+'<i class="fa fa-exclamation-triangle"></i>'
	  		  					+'<strong>Uh oh!</strong> This Supplier Code already exists.</div>';
	  }else{
		  success.push(true);
		  alert_required = oldalert;
	  }
	  var check_fields = (success.indexOf(false) > -1);
	  
	  /**
	  * update edit-supplier
	  */
	  if($(this).hasClass('edit-supplier')){
		 var supplier_id = $('#supplier_id').val();
	    if(check_fields === true){
	      $('html, body').animate({ scrollTop: 0 }, 400);
	      $('form').find('#response').empty().prepend(alert_required).fadeIn();
	    } else {
	    	$(this).prop('disabled','disabled');
	      $.ajax({
	        type: 'POST',
	        url: appHome+'/supplier-core/'+supplier_id+'/update',
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
	   * create-supplier
	   */
	   if($(this).hasClass('create-supplier')){
		   console.log(check_fields);
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	       $(this).prop('disabled','disabled');
	       $.ajax({
	         type: 'POST',
	         url: appHome+'/supplier-core/add',
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
	
	//Delete particular country
	$(document).on('click','.delete-supplier',function(e){
		e.preventDefault();
		var delete_url 		= $(this).attr('href'),
			supplier_id		= $(this).data('supplier-id'),
			supplier_code	= $(this).data('supplier-code'),
			supplier_tab	= $(this).data('supplier-tab'),
			return_url 		= window.location.href;
		BootstrapDialog.confirm('Are you sure you want to delete this Supplier ('+supplier_tab+' item)?', function(result){
			if(result) {
				$.ajax({
					type : 'POST',
					url  : delete_url,
					data :{
						'supplier_id' 	: supplier_id,
						'supplier_code'	: supplier_code,
						'supplier_tab'	: supplier_tab
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
});

// Change supplier status
$(document).on('click', '.supplier_change_status', function(e) {
	e.preventDefault();
	var supp_id = $(this).attr('data-id');
	var change_to = $(this).attr('data-supplier-change-to');
	var supp_code = $(this).attr('data-supp-code');
		
	var message = 'Are you sure, you want to move the supplier to '+change_to.charAt(0).toUpperCase() + change_to.slice(1)+' ?';
	
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
	     		        url: appHome+'/supplier-core/common_ajax',
	     		        data: {
	     		      	  'supp_id' : supp_id,
	     		      	  'action_type' : 'change_supplier_status',
	     		      	  'change_to' : change_to,
	     		      	  'supp_code' : supp_code
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

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	 //e.target // active tab
     //e.relatedTarget // previous tab
	var previousTab = e.relatedTarget.getAttribute('href');
	var currentTab = e.target.getAttribute('href');
	if(currentTab != "#supp_general") {
		$("#current_tab").val(currentTab);
	}
	$(previousTab).hide();
	$(currentTab).show();
})

//Plus / Minus button
$('#supplier-form').on('click', '.scroll-up-btn', function(e) {
    $(this).find('i').toggleClass('fa-minus-circle fa-plus-circle');    
});

//Set Primary Address
$('.sq_primary_address').click(function(){
	if($(this).prop('checked')){
		$('.sq_primary_address').prop('checked',false);
		$(this).prop('checked',true);
	}    
});

$('#supp_haulier, #supp_cleaning, #supp_depot, #supp_agent_fr_forwd, #supp_other').change(function(){
	//$('#supp_type_haulier_div, #supp_type_cleaning_div, #supp_type_depot_div, #supp_type_agent_fr_forwd_div, #supp_type_other_div')
	var supptype = "." + $(this).attr('id') + "_cls";
	var supptypechecked = $(this).prop('checked');
	$(supptype).each(function(){
		supptypediv = "#" + $(this).attr('id');
		if(supptypechecked){
			$(supptypediv).show();
		} else {
			$(supptypediv).hide();
		}
	});
});

//Warning
$('.supp_type_cs').change(function(){
	if(!$(this).prop('checked') && $("#supplier_id").val() != ""){
		BootstrapDialog.show({title: 'Warning', message : 'Please note that unchecking will remove the details of this supplier type while saving.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
	}    
	
	//Set record count of selected supplier type
	if($(this).prop('checked')){
		$totalrecords = $('.plusminuscls[data-checkbx="' + $(this).attr('id') + '"]').length;
		$(this).val($totalrecords);
	} else {
		$(this).val(0);
	}
})



$(document).on('click', '.sortClass', function(){
    
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

    qsshe_listing();
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


function qsshe_listing(){
    var path = $("#listing-path").val(); 

    var h = $('.overlay-complete-loader').height();
    if(h == 0) { h = 100; }
    $('.btl_overlay').height(h); 
    $('.btl_relative').show(); 

    $.ajax({
      type: 'POST',
      url: path,
      data: $('form').serialize(),
      success: function(response){
        $("#qsshe-list").html(response);
        $('.btl_relative').hide();

        $("#totalrecords").val($("#totalrecordcount").val()); 
        $("#rec-count").text($("#totalrecordcount").val());

        if($("#archive_status").val() == "1"){
           $("#btn-move-archive").html("<i aria-hidden='true' style='font-size:14px' class='fa fa-archive'></i> Move to Live");
           $("#btn-move-archive").attr('data-move-to','Live');    
        } else {
           $("#btn-move-archive").html("<i aria-hidden='true' style='font-size:14px' class='fa fa-archive'></i> Move to Archive");
           $("#btn-move-archive").attr('data-move-to','Archive');
        }
        applySortClass();
      },
      error: function(response){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_error).fadeIn();
        $('.btl_relative').hide();
      }
    });
}


if($("#page-name").val() == "qsshe-listing"){
    qsshe_listing();

    //Pagination button
    $(document).on('click', '.first-page, .last-page, .next-page, .prev-page', function(){
      var pageNumber = $(this).data('pagenumber');
      $('#page').val(pageNumber);
      qsshe_listing();
    });

    //Page size change
    $(document).on('change', '.page-limit', function(){
      var pageSize = $(this).val();
      $('#pagesize').val(pageSize);
      qsshe_listing();
    });
}

//Qsshe Listing Page Filger 
$('#qsshe-filter').on('click', function(e) {
      e.preventDefault();
      $("#page").val(0);
      qsshe_listing();
});

//Multi select controller
$(document).ready(function(){
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
});

//PLUS - MINUS BUTTON - CLONE FIRST ITEM AND STORE IN MEMORY
var haulierHtml = "";
var cleanHtml = "";
var depotHtml = "";
var agentHtml = "";
var othterHtml = "";

//Plus button 
$('.sup-type-add-btn').live('click',function(){
	var dataLoc = $(this).parent().data('checkbx');
	var dataPosition = $(this).parent().data('pos');
	var newLov = "";
	var newHtml = "";
	
	var datas = $("#"+dataLoc).data();
	var cloneDiv = datas.div;
	var items = datas.items.toString().split();
	var sourceHtml = ""; //$("#"+cloneDiv).clone(); //[0].outerHTML;

	var current_count = $("#"+dataLoc).val();
	 	current_count = parseInt(current_count);
		current_count++;
	$("#"+dataLoc).val(current_count);
		
	datas.count += 1;
	items.push(datas.count);
	datas.items = items.toString();
	
	switch(datas.stype) {
	  case 1:
		if(haulierHtml == ""){
			haulierHtml = $("#"+cloneDiv).clone()[0].outerHTML;
			sourceHtml = haulierHtml;
		} else {
			sourceHtml = haulierHtml;	
		}
	    break;
	  case 2:
		if(cleanHtml == ""){
			cleanHtml = $("#"+cloneDiv).clone()[0].outerHTML;
			sourceHtml = cleanHtml;	
		} else {
			sourceHtml = cleanHtml;	
		}
	    break;
	  case 3:
		if(depotHtml == ""){
			depotHtml = $("#"+cloneDiv).clone()[0].outerHTML;
			sourceHtml = depotHtml;	
		} else {
			sourceHtml = depotHtml;	
		}
	    break;
	  case 4:
		if(agentHtml == ""){
			agentHtml = $("#"+cloneDiv).clone()[0].outerHTML;
			sourceHtml = agentHtml;	
		} else {
			sourceHtml = agentHtml;	
		}
	    break;
	  case 5:
		if(othterHtml == ""){
			othterHtml = $("#"+cloneDiv).clone()[0].outerHTML;
			sourceHtml = othterHtml;
		} else {
			sourceHtml = othterHtml;	
		}
	    break;
	} 
	
	//sourceHtml = sourceHtml[0].outerHTML;
	sourceHtml = sourceHtml.replace(/_item0/g, '_item'+datas.count);
	sourceHtml = sourceHtml.replace(/\[0\]/g, '['+datas.count+']');
	sourceHtml = sourceHtml.replace(/_0__chosen/g, '_'+datas.count+'__chosen');
	sourceHtml = sourceHtml.replace(/data-pos="1"/g, 'data-pos="'+datas.count+'"');
	sourceHtml = sourceHtml.replace(/disabled/g, '');
	
	$(this).parents('.panel-default').after(sourceHtml);
	
	newLov = cloneDiv.replace('_item0','_item'+datas.count);
	newHtml = $("#" + newLov);
	
	newHtml.find('input').val('');
	newHtml.find(':checked').prop('checked',false);
	
	newHtml.find(".chosen-container").remove();
	newHtml.find('select').show();
	newHtml.find('select').val('');
	newHtml.find('select').chosen();
	newHtml.children().find('.sup-type-add-btn').show();
	
	$(this).hide();
	
 });

 //Minus button 
 $('.sup-type-sub-btn').live('click',function(){
	var dataLoc = $(this).parent().data('checkbx');
	var dataPosition = $(this).parent().data('pos');
	var datas = $("#"+dataLoc).data();
	var items = datas.items.toString().split(',');
	var curr_position = items.indexOf(dataPosition.toString()) + 1;
	var prev_position = items.indexOf(items[curr_position - 1]) + 1;
	var prev_item = items[curr_position - 2];
	var next_item = items[curr_position + 2];
	var next_position = items.indexOf(items[curr_position + 1]);
	
	if((curr_position > 1 && curr_position < items.length) || (items.length > 1 && curr_position == 1) ){
		$(this).parents('.panel-default').remove();
	} else if(curr_position == 1){
		$('.plusminuscls[data-checkbx="'+dataLoc+'"]').find('.sup-type-add-btn').show();
	} else {
		$(this).parents('.panel-default').remove();
		$('.plusminuscls[data-pos="'+prev_item+'"][data-checkbx="'+dataLoc+'"]').find('.sup-type-add-btn').show();
	}
	
	if(items.length != 1){
		items.splice(curr_position-1,1);
		datas.items = items.toString();
		
		var current_count = $("#"+dataLoc).val();
		 	current_count = parseInt(current_count);
			current_count--;
		$("#"+dataLoc).val(current_count);
	}
	
 });

// Multiple currency management
$(document).on("click", ".currency-add-btn", function(e){
	$(this).hide();
	html = '<div class="form-group new-row">'
		        +'<label class="col-sm-2 control-label required" for="product">Sage Code</label>'
	            +'<div class="col-sm-4">'
	            +'<input type="text" name="sage_code[]" placeholder="Sage Code" id="sage_code" '
	            +'value="" class="form-control filter-input-fld sage_code" maxlength="32" ' 
	            +'autocomplete="on" />'
	            +'</div>'
        		+'<label class="col-sm-1 control-label required" >Currency</label>'
        		+'<div class="col-sm-2">'
				+'<select name="currency[]" id="currency" class="chosen form-control currency" '
              		+'data-placeholder="Please select">'
              		+$("#hdn_account").val()
              		+'</select>'
            	+'</div>'
		        +'<div class="col-sm-2">'
		           	+'<a class="btn btn-success currency-add-btn" title="Add"><span class="glyphicon glyphicon-plus-sign"></span></a> '
		           	+'<a class="btn btn-danger currency-sub-btn" title="Remove"><span class="glyphicon glyphicon-minus-sign"></span></a>'
		        +'</div>'
	        +'</div>';

	$(".currency-group").append(html);
	if ($('.currency option').length == 0) {
		$(".currency").empty().append($("#hdn_account").val());
	}
	$(".currency").chosen().trigger("chosen:updated");
	hideMinusButtonSingle();
	removeSelectedCurrency();
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
function removeSelectedCurrency(){
	$(".currency").each(function(){
		var account = $(this).val();
		if(account.length!=0){ 
			$('.currency').not(this).find('option[value="' + account + '"]').remove();
			$('.currency').chosen().trigger("chosen:updated");
		}
	});
}
$(document).on("click", ".currency-sub-btn", function(e){
	if($('.currency-sub-btn').length > 1){
		$(this).closest('.new-row').remove();
	}
	hideMinusButtonSingle();
	removeSelectedCurrency();
});
$(document).on("change", ".currency", function(e){
	removeSelectedCurrency();
});

//Start : Sage code multi text box with +/-
//Requirement container div with class class="multi-div" 
//		id="<this is root>" 
//	 	data-root="<this above id>" 
//	 	data-itemdiv="<this is repeatable div>"
//	 	data-varname = "<any name. This will be the object element to store the html>"; 
// 		data-count="<total count of item div>"
//		data-pos = "<elements position in the room>" : This is store in the + symbol element
//		After configuring above use below js

var multiDivHtml = {};

//Plus button 
$('.sa-sag-add-btn').live('click',function(){
	var data = $(this).parents('.multi-div').data();
	var div_root = data.root;
	var div_parent = data.itemdiv;
	var div_varname = data.varname;
	var div_pos = $(this).data('pos');
	var sourceHtml = ""; 
	var lastDivCopy = $("." + div_parent).length;
	var div_count = data.count+1;
	var currencyClass = data.classname;
	
	$(this).parents('.multi-div').data('count',div_count);
	
	if(multiDivHtml[div_varname] == undefined){
		multiDivHtml[div_varname] = $("."+div_parent).clone()[0].outerHTML;
		sourceHtml = multiDivHtml[div_varname];
	} else {
		sourceHtml = multiDivHtml[div_varname];	
	}

	sourceHtml = sourceHtml.replace(/\[\d*\]/g,'['+ div_count +']');
	sourceHtml = sourceHtml.replace(/_0__chosen/g, '_' + div_count + '__chosen'); //Handling chosen
	
	$('#' + div_root).append(sourceHtml);
	$("." + div_parent).eq(lastDivCopy).find(".chosen-container").remove(); //Handling chosen
	$("." + div_parent).eq(lastDivCopy).find('select').show(); //Handling chosen	
	$("." + div_parent).eq(lastDivCopy).find('select').val(''); //Handling chosen
	$("." + div_parent).eq(lastDivCopy).find('select').chosen(); //Handling chosen
	$("." + div_parent).eq(lastDivCopy).find('input').val(''); 
	$("." + div_parent).eq(lastDivCopy).find('.sa-sag-add-btn').data('pos',div_count);
	$("." + div_parent).eq(lastDivCopy).find('.sa-sag-add-btn').show();
	$("." + div_parent).eq(lastDivCopy).find('.sa-sag-sub-btn').show();
	
	$(this).hide();
	$(this).next('.sa-sag-sub-btn').show();
	
	//Need to show currency in single dd box
	removeChoosenSelectedCurrency(currencyClass);
 });

 //Minus button 
 $('.sa-sag-sub-btn').live('click',function(){
	var data = $(this).parents('.multi-div').data();
	var div_parent = data.itemdiv;
	var _this_div = $(this).parents('.' + div_parent);
	var next = _this_div.next('.' + div_parent).length;
	var prev = _this_div.prev('.' + div_parent).length;
	var div_count = $('.' + div_parent).length;
	var currencyClass = data.classname;
	
	if((prev > 0 && next > 0) || (prev == 0 && next > 0)   ){
		if(div_count == 2){
			_this_div.next('.' + div_parent).find('.sa-sag-sub-btn').hide();
		}
		_this_div.remove();
	} else if(prev > 0 && next == 0) {
		_this_div.prev('.' + div_parent).find('.sa-sag-add-btn').show();
		if(div_count == 2){
			_this_div.prev('.' + div_parent).find('.sa-sag-sub-btn').hide();
		}
		_this_div.remove();
	}
	
	//Need to show currency in single dd box
	removeChoosenSelectedCurrency(currencyClass);
 });
//End : Sage code multi text box with +/-

//Start : Function to show currency in single dd box
function removeChoosenSelectedCurrency(classname){
	var valarray = [];
	
	$("." + classname).each(function(){
		valarray.push($(this).val());
	});
	
	$("." + classname).each(function(){
		var currentVal = $(this).val();
		var _this = $(this);
		_this.find("option").show();
		
		$.each(valarray, function( key, value ) {
			if(value != currentVal){
				_this.find("option[value='" + value + "']").hide();
			}
		});
	});
	
	$("." + classname).trigger("chosen:updated");
}

$(document).on("change", ".sa_currency", function(e){
	removeChoosenSelectedCurrency('sa_currency');
});

$(document).on("change", ".si_currency", function(e){
	removeChoosenSelectedCurrency('si_currency');
});

$(document).ready(function(){
	if($("#pagetype").val() == "supplier-matrix-form"){
		removeChoosenSelectedCurrency('sa_currency');
		removeChoosenSelectedCurrency('si_currency');
	}
});
//End : Function to show currency in single dd box

//Team File upload
function fileSelected() {
	var file = document.getElementById('fileToUpload').files[0];
	if (file) {
	  var fileSize = 0;
	  if (file.size > 1024 * 1024)
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	  else
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
	
		var supplier_id = document.getElementById('supplier_id').value;
		var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
		document.getElementById('fileName').value = supplier_id+'-'+fname;
		document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
		document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
	}
}

function uploadFile() {
	$('#feedback').hide();
	var fd = new FormData();
	fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
	fd.append("fileName", document.getElementById('fileName').value);
	fd.append("fileDesc", document.getElementById('fileDesc').value);
	fd.append("fileSupplierId", document.getElementById('supplier_id').value);
	fd.append("expiry_date", document.getElementById('expiry_date').value);
	fd.append("qsshe-filetype", $('#qsshe-filetype').val());
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	xhr.open("POST", appHome + '/supplier-core/upload-supplier-qsshe-file');
	xhr.send(fd);
	resetUploadBar();
}

function resetUploadBar(){
	$('#progressJobPage').hide();
	$('#job-progress-bar').css('width','0%');
	$('#job-progress-bar').data('aria-valuenow','0');
	$('#job-progress-bar').data('aria-valuemax','0');
	$('#job-progress-bar').html('0%');
	$('.fileSize,.fileType').html('');
	getExpiryDate()
	$('.upload-btn-custome').attr('disabled',false);
	$('.upload-btn-custome').html('Upload');
}

function uploadProgress(evt) {
	$('.upload-btn-custome').attr('disabled',true);
	$('.upload-btn-custome').html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Upload');
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progressJobPage').show();
	$('#job-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
	$('#job-progress-bar').css('width',percentComplete.toString()+ '%');
	$('#job-progress-bar').data('aria-valuenow',percentComplete.toString());
	$('#job-progress-bar').html(percentComplete.toString() + '%');
	/*if (evt.lengthComputable) {
	  var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	  document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
	}
	else {
	  document.getElementById('progressNumber').innerHTML = 'unable to compute';
	}*/
}

function uploadComplete(evt) {
	/* This event is raised when the server sends back a response */
	//alert(evt.target.responseText);
	$('#feedback').html(evt.target.responseText).fadeIn();
	$('#feedback').delay(3000).slideUp();
	//If success show uploaded files list
	if((evt.target.responseText).indexOf("alert-success") > 0){
		qssheFileListingFun(1);
		if($('#job-filetype').val() != ""){ 

			if((evt.target.responseText).indexOf("Zoom") > 0){
				var existingType = $('#qsshe-filetype').val();
				$(".qsshe-filetype").find('[value="'+existingType+'"]').remove();
			}
			getRequestDocList();
			$('#qsshe-filetype').val('');
		}
		$('#fileName,#fileToUpload,#fileDesc').val('');
		$('#fileCustomerAccess').val(0);
		setTimeout(function(){ resetUploadBar(); }, 2000);

	}else{
		$('#job-progress-bar').removeClass('progress-bar-success').addClass('progress-bar-danger');
		setTimeout(function(){ resetUploadBar(); }, 2000);
	}
	//$('#form1')[0].reset();
}

function uploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}

qssheFileListingFun = function($uploaded){
		var $supplier_id = $("#supplier_id").val() ;

		if($uploaded == 1){
			$("#form-btn-colorbox").html('<i class="fa fa-refresh fa-spin"></i> Refreshing file list').attr("disabled")
			$("#form-btn-colorbox").prop('disabled', true);
		}
		$.ajax({
				type: "POST",
				cache: false,
				url: appHome+'/supplier-core/common_ajax',
				dataType: "text",
				data: ({
					'action_type':'supplier_qsshe_files_list',
					'supp_id': $supplier_id
				}), 
				success: function(result)
				{ 
					$("#files_btn_div_list").html(result);
					resetUploadBar();

					$("#form-btn-colorbox").colorbox({href: function(){
						var url = $(this).parents('div').data('target');
						//ar ser = $(this).parents('form').serialize();
						var ser = [];
						var files = $('input[type="checkbox"][name="files\\[\\]"]:checked');
                        files.each(function( index ) {
                           ser.push('files[]='+$(this).val());
                        });
                         var qry = ser.join("&") + '&supp_id=' +$('#supplier_id').val();
				    return url+'?'+qry;
					}, width:'80%', height:"90%", iframe:true});

					$('a.colorbox').colorbox({iframe:true, width:'80%', height:'90%'});

					if($uploaded == 1){
						$("#form-email-files .table tr:nth-last-child(2)").css("background-color", "#dff0d8");	
						
						setTimeout(function () {
							$("#form-email-files .table tr:nth-last-child(2)").css("background-color", "#fff");
					    }, 3000);
					}
					getExpiryDate();
				}  
		});
}
showEmailRec = function ($showlastMailRec) {
		var $supp_id = $("#supplier_id").val() ;
		var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
		var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';

		$("#emailrec_btn_div").html(ajaxLoader);

		$.ajax({
			type: "POST",
			cache: false,
			url: appHome+'/supplier-core/common_ajax',
			dataType: "text",
			data: ({
				'action_type':'email_record',
				'supp_id': $supp_id
			}), 
			success: function(result)
			{ 
				$("#emailrec_btn_div").html(result);
				$('a.colorbox').colorbox({iframe:true, width:'80%', height:'90%'});

				if($showlastMailRec == 1){
					$('#form-email-feedback').hide().html('<p class="alert alert-success">Mailed Successfully!!!</p>').fadeIn();
					$('#form-email-feedback').delay(3000).slideUp();
					
					$("#emailrec_btn_div .table tr:nth-last-child(1)").css("background-color", "#dff0d8");	
					
					setTimeout(function () {
						$("#emailrec_btn_div .table tr:nth-last-child(1)").css("background-color", "#fff");
				    }, 3000);
					
					$('html, body').animate({scrollTop: $("#form-email-feedback").offset().top - 150 }, 200);
				}
			}  
		});

	}
function getRequestDocList(){
	$('#request_btn_div_list').html('<i class="fa fa-spinner fa-spin" style="font-size:150px;" ></i>');
}

function loadInitialQssheData(){
	     qssheFileListingFun(0);
	     showEmailRec(0)
	     setDropzoneField();

}
//Email Records
		$('#emailrec_btn').click(function(e){
			if($("#emailrec_btn_div").html() == ""){
				showEmailRec(0);
			}
		});
$('.delete-row').live('click',function(e) {
			var pageName = $('#page_name').val();	
			e.preventDefault();
			var id = $(this).data('id');
			var parent = $(this).parent().parent();
			if (confirm('Are you sure you want to delete the row with ID '+id+'? This cannot be undone')) {
				var action = $(this).data('action');
				$.ajax({  
					type: "POST",  
					url: appHome + '/supplier-core/common_ajax',  
					dataType: "text",
					data: "action_type="+action+"&id="+id,
					beforeSend: function() {
					  $(parent).find("td").css({
						  'color': '#fff',
						  'background-color': '#cc0000'
					  })
					},  
					success: function(result)
					{ 
							if(result=='1') {
								$(parent).fadeOut(1000, function() {
									$(this).remove();
									
								}
							);
								
						} else {
							//alert(result);
							$(parent).find("td").css({
								  'color': '',
								  'background-color': ''
							})
						}
					}  
				});
			}
		});

$('.file-upload-btn-tank').live('click',function(e) {
	var id = $(this).attr('data-id');
	var type = $('#doc_type_filter :selected').val();
	supplierQssheFileList(id,type)
	
});
function supplierQssheFileList(id,type){
	var url = appHome+'/supplier-core/common_ajax';
	$.ajax({
		type: "POST",
		cache: false,
		url: url,
		dataType: "text",
		data: ({
			'id' :id,
			'type' : type,
			'action_type' : 'list_upload_docs'
		}),
		beforeSend: function() {
            // setting a timeout
        	$('#fileAttachmenttank').html("<td colspan='5'><div class='text-center'><img src="+$('#loaderpath').val()+"></div></td>");
        },
		success: function(result)
		{
			
			
			$('#fileAttachmenttank').html(result);
			
			$("#fileAttachment-table").tablesorter();
			$("#fileAttachment-table").trigger("update");
	    	var sorting = [[1,0]];
	    	$("#fileAttachment-table").trigger("sorton",[sorting]);
			$('#fileAttachment-table').tablesorter({
		         widthFixed: true,
		         widgets: ['zebra', 'filter'],
		         widgetOptions: {
		           filter_reset: '.reset'
		         },
		    })
		    
		}
	});
}

$('.showmore_new').live('click', function(e) {
			e.preventDefault();
			var elemid = '#'+$(this).data('id');
			var elem = $(this);		
			$(elemid).toggle("", function () {
				$(elemid).is(":hidden") ? $(elem).html('Show <i class="fa fa-plus"><i>') : $(elem).html('Hide <i class="fa fa-minus"><i>');
			});
});

if($("#pagetype").val() == 'supplier-matrix-form'){ qssheFileListingFun(0); }

/* Supplier QSSHE template page start*/
$(document).on('click','.save-supp-qsshe-template',function(e){
	$(this).find('.fa').removeClass('fa-save').addClass('fa-spinner fa-spin');
	$(this).attr('disabled', true);
	e.preventDefault();
	$.ajax({
		type	: 'POST',
		url		: appHome+'/qsshe-template/save-template',
		data: $('#qsshe-template-form').serialize().replace(/%5B%5D/g, '[]'),
		success	:function(response){
			 window.location.href = $('#returnpath').val();
	         localStorage.setItem('response', response);
		},
		error: function(response){
			$(this).find('.fa').removeClass('fa-spinner fa-spin').addClass('fa-save');
			$(this).attr('disabled', false);
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});

		}
	});
});
$('.accordion-toggle').click(function() {
     $(".icon-pos", this).toggleClass("glyphicon-minus-sign glyphicon-plus-sign");
});
/* Supplier QSSHE template page end */


function getExpiryDate(){
	$.ajax({
				type: "POST",
				cache: false,
				url: appHome+'/supplier-core/common_ajax',
				dataType: "text",
				data: ({
					'action_type':'get_doc_expiry_date'
				}), 
				success: function(result)
				{ 
                   $('#expiry_date').val(result);		
				}  
		});
}

$(function(){
    	setTimeout(function(){
          if($('#current_tab').val() == '#supp_QSSHE') {
          	loadInitialQssheData();
          } 
    	},500)
})

function setDropzoneField(){
	Dropzone.autoDiscover = false;
	
      if($('#file_list_panel').length > 0 && initializeOnce == false){
			initializeOnce = true;
			//Dropzone class
			var myDropzone = new Dropzone("body", {
				url: "#",
				// acceptedFiles: "image/*,application/pdf",
				maxFiles : 1, 
				previewsContainer: "#files_btn_div",
				disablePreviews: true,
				autoProcessQueue: false,
				uploadMultiple: false,
				clickable: false,
				init : function() {
		
					myDropzone = this;
			
					//Restore initial message when queue has been completed
					this.on("drop", function(event) {
						if(event.dataTransfer.files.length > 0){
						fileInput = document.getElementById("fileToUpload"); 
						fileInput.files = event.dataTransfer.files;
						window.location.href = "#file_list_panel";
						$("#file_list_panel").css("background-color", "#bdbdbd");
						setTimeout(() => {
							$("#file_list_panel").css("background-color", "unset");
						}, 800);
						fileSelected();
						setTimeout(() => {
							// uploadFile(); to automatic upload
							myDropzone.removeAllFiles( true );
						}, 200);
		
		              }
					});
			
				}
			});
		}

}	

$(document).on('click', '.sq_previous_data', function() {
    var prev = $(this).parents('.panel-default').prev();
	var curr  = $(this).parents('.panel-default');

	for(let i=0; i<10; i++) {
	  	if(prev.css('display') == "none"){
			prev = prev.prev();
		}

		if(prev.attr('id') == undefined){
			break;
		} 
	}

	if(prev.attr('id') != undefined && $(this).prop("checked")){
		curr.find("input[id*='sq_contact_person']").val(prev.find("input[id*='sq_contact_person']").val());
		curr.find("input[id*='sq_company']").val(prev.find("input[id*='sq_company']").val());
		curr.find("input[id*='sq_contact_number']").val(prev.find("input[id*='sq_contact_number']").val());
		curr.find("input[id*='sq_addr1']").val(prev.find("input[id*='sq_addr1']").val());
		curr.find("input[id*='sq_emergency_number1']").val(prev.find("input[id*='sq_emergency_number1']").val());
		curr.find("input[id*='sq_addr2']").val(prev.find("input[id*='sq_addr2']").val());
		curr.find("input[id*='sq_emergency_number2']").val(prev.find("input[id*='sq_emergency_number2']").val());
		curr.find("input[id*='sq_emergency_number3']").val(prev.find("input[id*='sq_emergency_number3']").val());
		curr.find("input[id*='sq_emergency_number4']").val(prev.find("input[id*='sq_emergency_number4']").val());
		curr.find("input[id*='sq_email']").val(prev.find("input[id*='sq_email']").val());
		curr.find("input[id*='sq_town']").val(prev.find("input[id*='sq_town']").val());
		curr.find("input[id*='sq_state']").val(prev.find("input[id*='sq_state']").val());
		curr.find("input[id*='sq_postcode']").val(prev.find("input[id*='sq_postcode']").val());
		curr.find("select[id*='sq_country']").val(prev.find("select[id*='sq_country']").val()).chosen().trigger('chosen:updated');
	}
	
	$(this).prop('checked',false);
});

//Group Supplier div
$(document).on('change', '#supp_relation', function (e) {
	if($(this).prop("checked")){
		$("#sup_parent_div").hide();
	} else {
		$("#sup_parent_div").show();
	}
});
	