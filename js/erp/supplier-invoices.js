// JavaScript Document
var old_alert = alert_required;
var alert_check =  '<div class="alert alert-danger alert-dismissable">'
					+'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><i class="fa fa-exclamation-triangle"></i>'
						+'<strong>Uh oh!</strong> Please select the Supplier query checkbox.'
							+'</div>';
var alert_success = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-thumbs-o-up"></i>&nbsp;<strong>Success!</strong>&nbsp;Email sent successfully !!!</div>';
var alert_warning =  '<div class="alert alert-danger alert-dismissable">'
					+'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><i class="fa fa-exclamation-triangle"></i>'
						+'<strong>Uh oh!</strong> Some error occured. Please check the mail address.'
							+'</div>';
function checkValidJobNo(job_no, buttonFrom){
	var retflag = false;
	var msg = "";
	if(!job_no) {
		  if(buttonFrom == "jobcosting-btn" || buttonFrom == "jobpage-btn"){
			msg = 'You must enter a job number first!';
		  } else {
			msg = 'You must select a job number first!';
		  }
		  BootstrapDialog.show({title: 'Warning', message : msg});
		  $('#supp_inv_jobno').focus(); 
		  retflag = false;
	  }else{
			$.ajax({
				type: 'POST',
				async: false,
				url: appHome+'/supplier-invoices/common_ajax',
				data: {
					'action_type' : 'check_valid_job',
					'job_no' : job_no,
				},
				beforeSend: function() {
		            // setting a timeout
					switch(buttonFrom) {
					  case "jobcosting-btn":
						  $('#supp_inv_managecosts').html("<i style='font-size:14px' class='fa fa-refresh fa-spin'></i> Job Costing");
					    break;
					  case "jobpage-btn":
						  $('#supp_inv_jobpage').html("<i style='font-size:14px' class='fa fa-refresh fa-spin'></i> Job Page");
					    break;
					  case "jobpage-modal-btn":
						  $('#show-job-cost').html("<i style='font-size:14px' class='fa fa-refresh fa-spin'></i> Job Page");
					    break;
					  case "jobcosting-modal-btn":
						  $('#addto-job-cost').html("<i style='font-size:14px' class='fa fa-refresh fa-spin'></i> Job Costing");
					    break;  
					} 
					
		        },
				success: function(response){
		        	switch(buttonFrom) {
					  case "jobcosting-btn":
						  $('#supp_inv_managecosts').html("Job Costing");
					      break;
					  case "jobpage-btn":
						  $('#supp_inv_jobpage').html("Job Page");
					      break;
					  case "jobpage-modal-btn":
						  $('#show-job-cost').html("<span class='glyphicon glyphicon-info-sign'></span> Job Page");
					    break;
					  case "jobcosting-modal-btn":
						  $('#addto-job-cost').html("<span class='glyphicon glyphicon-plus-sign'></span> Job Costing");
					    break;  
					} 
		        	
					if(response > 0){
						retflag = true;
					}else{
						BootstrapDialog.show({title: 'Warning', message : 'Invalid Job ref.'});
						$('#supp_inv_jobno').focus(); 
						retflag = false;
					}
				}
			});
	  }
	return retflag;
}

function checkValidPoNo(po_no){
	var retflag = false;
	if(!po_no) {
		  BootstrapDialog.show({title: 'Warning', message : 'You must enter a po number first!'});
		  $('#supp_inv_pono').focus(); 
		  retflag = false;
	  }else{
			$.ajax({
				type: 'POST',
				async: false,
				url: appHome+'/supplier-invoices/common_ajax',
				data: {
					'action_type' : 'valid_po',
					'po_no' : po_no,
				},
				beforeSend: function() {
		            // setting a timeout
		        	$('#supp_inv_managepo').html("<i style='font-size:14px' class='fa fa-refresh fa-spin'></i> Allocate To Purchase Order");
		        },
				success: function(response){
					$('#supp_inv_managepo').html("Allocate To Purchase Order");
					if(response > 0){
						po_val = response;
						retflag = true;
					}else{
						BootstrapDialog.show({title: 'Warning', message : 'Invalid po ref.'});
						$('#supp_inv_pono').focus(); 
						retflag = false;
					}
				}
			});
	  }
	return po_val;
}


$('#supp_inv_managecosts, #addto-job-cost').on('click', function(e) {
  e.preventDefault();
 
  var job_no = "";
  var buttonFromd = $(this).attr('data-frombutton');

  if(buttonFromd == "jobcosting-btn"){
	  job_no = $('#supp_inv_jobno').val().trim();
	  if(checkRepoJobNo(job_no) == 'false'){return false;};
  } else {
	  job_no = $("input[name='job_cost_radio']:checked").val();
	  $('#supp_inv_jobno').val(job_no);
  }
  
  if(!checkValidJobNo(job_no, buttonFromd)){return false;};
  
  
  var inv_no = $('#invoice_number').val();
  var amount_net = $('#amount_net').val();
  var booking_date = $('#_booking_date').val();
  var inv_date = $('#_invoice_date').val();
  var currency = $('#currency option:selected').text();
  var supplierArr = $('#supplier option:selected').text().split('|');
  var supplier = encodeURIComponent(supplierArr[0].trim());
  var path = $('#btlpath').val();
  var inv_id = $(this).attr('data-id');
  var suppCurrName = $('#supp-curr-hidden').attr('data-suppcurname');
  
  var url = path+'erp.php/job-cost/index?id='+job_no+'&inv_id='+inv_id+'&supplier_inv_no='+inv_no+'&supplier_inv_amount='+amount_net+'&supplier_inv_date='+ inv_date +'&booking_date='+ booking_date +'&currency='+currency+'&supplier_code='+supplier+'&supp_cur_name='+suppCurrName;

  var win = window.open(url, '_blank');
  win.focus();
});

$('#supp_inv_jobpage').on('click', function(e) {
	  e.preventDefault();
	  var job_no = $('#supp_inv_jobno').val().trim();
	  if(!checkValidJobNo(job_no, "jobpage-btn")){return false;};
	  var path = $('#btlpath').val();
	  var url = path+'erp.php/job/'+job_no + '/detail';
	  var win = window.open(url, '_blank');
	  win.focus();
});

$('#job-tank-filter').on('click', function(e) {
	  e.preventDefault();
	  var tank_no = $('#supp_inv_tanknumber').val().trim();
	  var from_date = $('#supp_job_date_from').val().trim();
	  var to_date = $('#supp_job_date_to').val().trim();
	  
	  if(tank_no != ""){
		  $.ajax({
				type: 'POST',
				async: false,
				url: appHome+'/supplier-invoices/common_ajax',
				data: {
					'action_type' : 'get_tank_jobs',
					'tank_no' : tank_no,
					'from_date' : from_date,
					'to_date' : to_date
				},
				beforeSend: function() {
					$("#model-ajax").removeClass('hidden');
		        },
				success: function(response){
		        	$("#model-ajax").addClass('hidden');
		        	$("#modal-job-costs-table").html(response);
				}
			});		  
	  }
});

$('#job_search_modal').on('hidden.bs.modal', function(){
	$("#modal-job-costs-table").html('');
	$('#supp_inv_tanknumber').val('');
	$('#supp_job_date_from').val('');
	$('#supp_job_date_to').val('');
});


$('#show-job-cost').on('click', function(e) {
	  e.preventDefault();
	  var job_no = $("input[name='job_cost_radio']:checked").val();
	  if(job_no == undefined){
		  job_no = "";
	  }
	  if(!checkValidJobNo(job_no, "jobpage-modal-btn")){return false;};
	  var path = $('#btlpath').val();
	  var url = path+'erp.php/job/'+job_no + '/detail';
	  var win = window.open(url, '_blank');
	  win.focus();
});

//Autocomplete function to fetch the tank numbers
if($("#supp_inv_tanknumber").length > 0){
	
	 $("#supp_inv_tanknumber").autocomplete({
	      source:  appHome+'/tank/get_tank_no_list',
	      minLength: 2,
	      type: "GET",
	      success: function (event, ui) {},
		  select: function (event, ui) {
	    	event.preventDefault();
			$(this).val(ui.item.label);
			$('#hdn_tank_num').val(ui.item.label);
			return false;
		  },
		  focus: function(event, ui) {
		        event.preventDefault();
		        $(this).val(ui.item.label);
		  },
		  change: function (event, ui) {
	         if (ui.item === null) {
	        	 	 BootstrapDialog.show({title: 'Error', message : 'Not a valid Tank',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
	            $(this).val('');
	            $('#hdn_tank_num').val('');
	         }
		  }
	  });
}

//allocate to purchase order
$('#supp_inv_managepo').on('click', function(e) {
  e.preventDefault();

  var po_no = $('#supp_inv_pono').val().trim();
  var po_num = checkValidPoNo(po_no);

  
if(!po_num){return false;};
  
  var inv_no = $('#invoice_number').val();
  var amount_net = $('#amount_net').val();
  var booking_date = $('#_booking_date').val();
  var inv_date = $('#_invoice_date').val();
  var currency = $('#currency option:selected').text();
  var supplierArr = $('#supplier option:selected').text().split('|');
  var supplier = encodeURIComponent(supplierArr[0].trim());
  var path = $(this).attr('data-path');
  var inv_id = $(this).attr('data-id');
  var suppCurrName = $('#supp-curr-hidden').attr('data-suppcurname');
  var url = path+'erp.php/purchase_order/'+po_num+'/poedit?id='+po_num+'&inv_id='+inv_id+'&supplier_inv_no='+inv_no+'&supplier_inv_amount='+amount_net+'&supplier_inv_date='+ inv_date +'&booking_date='+ booking_date +'&currency='+currency+'&supplier_code='+supplier+'&supp_cur_name='+suppCurrName;;
  var win = window.open(url, '_blank');
  win.focus();

});


// $('#currency').on('change', function() {
// 	matchSupplierCurrInv();
// });

$('#supplier').on('change', function() {
  
  var supplier_id = $(this).val();
  if(!supplier_id) {
    return false;
  }
  
  $.ajax({
    url: appHome+'/supplier-invoices/get_supplier_vat_rate',
    type: "POST",
    dataType: "text",
    data: ({
        'supplier_id': supplier_id
      })
  })
  .done( function( res ) {
	  var myObj = JSON.parse(res);
	  $('#billing_office').val(myObj.billing_ofc);
      $('#amount_vat').val(myObj.vatrate);
      $('#supp-curr-hidden').val(myObj.supp_currency);
	  $(".currency").empty().append(myObj.supp_currency);	  
	  $(".currency").chosen().trigger("chosen:updated");
      //$('#currency').val(myObj.supp_currency).chosen().trigger("chosen:updated");
	 // matchSupplierCurrInv();
      updateSupplierAmount($(this).attr("id"));
  })
  .fail(function (request, status, error) {
    alert('Couldn\'t get the VAT rate. Please check manually');
  })
  .always(function() {
    //...
  });
  
});

function matchSupplierCurrInv(){
	  if(($('#supp-curr-hidden').val() != "") && ($('#currency').val() != "") && ($('#supp-curr-hidden').val() != $('#currency').val())){
		  $('.supplier-paste-curr').html('<strong>WARNING!</strong> Invoice currency different to Supplier currency');
	  }else{
		  $('.supplier-paste-curr').html('');
	  }
}

function updateSupplierAmount(change_feild){
	var net = parseFloat($('#amount_net').val());
    var vat = parseFloat($('#amount_vat').val());
    var vat_val = isNaN(parseFloat($('#amount_vat_new').val())) ? 0 :parseFloat($('#amount_vat_new').val());
    var vat_new = (change_feild == 'amount_vat_new') ? vat_val : isNaN((net*vat)/100) ? 0 :((net*vat)/100);
    var total = net + vat_new;
    total = total ? total.toFixed(2) : '';
    if(change_feild != 'amount_vat_new') {
    	$('#amount_vat_new').val(vat_new);
    }
    $('#amount_total').val(total);
}
$('#amount_net,#amount_vat,#amount_vat_new').keyup(function() {
	updateSupplierAmount($(this).attr("id"));
});

$('#supp_inv_reloadcosts').on('click', function(e) {
  
  e.preventDefault();
  
  var inv_id = $(this).attr('data-id');
  var inv_amt = $('#amount_net').val();
    
  if(!inv_id || !inv_amt) {
    alert('A net amount must be entered');
    if(!inv_amt) {
      $('#amount_net').focus();
    }
    return false;
  }
  
  $.ajax({
    url: '../generate_supplier_inv_job_costs',
    type: "POST",
    dataType: "html",
    data: ({
        'supplier_invoice_id': inv_id,
        'invoice_amount' : inv_amt
      })
  })
  .done( function( res ) {
    //console.log(res);
    if(res.length === 0) {
      alert('No costs found for the given invoice number');	
    } else {
      $('#supp_inv_jobcosts_ctn').hide().html(res).fadeIn('slow');
      //$('#supp_inv_pocosts_ctn').hide().html(res).fadeIn('slow');
    }

  })
  .fail(function (request, status, error) {
    alert('Error in retrieving Job Costs');
  })
  .always(function() {
    //$('.preloader').fadeOut();
  });
  
});


/**
* update supplier invoice
*/
$('.update-supplier-invoice, .save-supplier-invoice').click(function(e){
  e.preventDefault();

  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      supplier_invoice_id = $('input[name="supplier_invoice_id"]').val(),
      path = $(this).attr('data-path');

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
  
  function checkSpecialCharacters(field){
	 
	  if(field.val().indexOf(",") == -1) {
		  $(field).parent().removeClass('highlight');
	        success.push(true);
	        alert_required = old_alert;
		}else{
	        $(field).parent().addClass('highlight');
	        success.push(false);
	        alert_required = '<div class="alert alert-danger alert-dismissable">'
								+'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><i class="fa fa-exclamation-triangle"></i>'
									+'<strong>Uh oh!</strong> Comma is not supported for the Invoice number.'
										+'</div>';
		}
  }
  
  highlight($(form).find('#supplier'), '');
  highlight($(form).find('#currency'), '');
  highlight($(form).find('#invoice_number'), '');
  highlight($(form).find('#amount_net'), '');
  highlight($(form).find('#amount_vat'), '');
  highlight($(form).find('#amount_total'), '');
  highlight($(form).find('#_invoice_date'), '');
  if($(form).find('#invoice_number').val().trim() != ""){
	  checkSpecialCharacters($(form).find('#invoice_number'));
  }

  var check_fields = (success.indexOf(false) > -1);

  /**
  * Add supplier invoice
  */
  if($(this).hasClass('save-supplier-invoice')){
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('.response').empty().prepend(alert_required).fadeIn();
    } else {
      
      $.ajax({
        type: 'POST',
        url: path+'/add/',
        data: $(form).serialize().replace(/%5B%5D/g, '[]'),
        success: function(response){
          
          var arr = response.split('#');
          
          if(arr[0] > 0) {
            window.location.href = path+'/'+arr[0]+'/edit';
            localStorage.setItem('response', arr[1]);
          } else {
            BootstrapDialog.alert(arr[1]);          
          }
          //window.location.href = path+'/index';
          //console.log(response);
          
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('.response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  }
  

  /**
  * update supplier invoice
  */
  if($(this).hasClass('update-supplier-invoice')){
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('.response').empty().prepend(alert_required).fadeIn();
    } else {
      $.ajax({
        type: 'POST',
        url: '../'+supplier_invoice_id+'/update/',
        data: $(form).serialize().replace(/%5B%5D/g, '[]'),
        success: function(response){
          //window.location.href = path+'/index';
          if($('#returnpath').val() != ""){
        	  window.location.href = $('#returnpath').val();
          }else{
        	  window.location.href = path+'/index'; 
          }
          localStorage.setItem('response', response);
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('.response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  }
});


//Delete supplier invoice
$('.delete-supplier-invoice').click(function(e) {
	e.preventDefault();
	
	var delete_url = $(this).data('href'),
		supplier_invoice_id = $(this).data('supplier-invoice-id'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
	
	BootstrapDialog.confirm('Are you sure you want to delete this Supplier Invoice?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				url: delete_url,
				data: {'supplier_invoice_id' : supplier_invoice_id},
				success: function(response){
					//location.reload();
					window.location.href = return_url;
					localStorage.setItem('response', response);
				},
				error: function(response){
					BootstrapDialog.show({title: 'Supplier Invoice', message : 'Unable to delete this Invoice. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		} 
	});
});


/**
* edit supplier cost extra
*/
$('.edit-supplier-inv-docs').on('click', function(e) {
  e.preventDefault();

  var popup = $('#supplier_invoice_docs_modal');
  var invoice_id = $(this).attr('data-id');
  
  //alert(invoice_id);
  
	  $(".panel-upload").show();
	  $(this).addClass('active-docs-icon');
	  $('.supp-close-button').html('<span class="glyphicon glyphicon-remove-circle"></span> Close');
  
	$(popup).find('.panel-upload').removeClass('hidden')

  $(popup).find('#supp_inv_id').val(invoice_id);
	$(popup).find('#attachable_id').val(invoice_id);
	
	$.ajax({
		type: 'POST',
		url: 'generate-attachment-table-rows',
		data: {
			'attachable_id' : invoice_id,
			'attachable_type' : 'SupplierInvoice'
		},
		success: function(response){
			if(response) {
				$('#attachment-rows').html(response);
				$('#attachments').removeClass('hidden');
			} else {
				$('#attachment-rows').html("");
				$('#attachments').addClass('hidden');
			}
		},
		error: function(response){
			alert('Oops! Error in generating existing file attachments');
		}
	});

  //$(popup).find('.update-supplier-extra').attr('data-row', row);
  $(popup).modal('show');
});

/**
* view cost associated with 
*/
$('.view_cost_btn').on('click', function(e) {
	
 $('.loadershow').show();
 $('#invoice_details_div').html('');
  e.preventDefault();
  var invoice_id = $(this).attr('data-id');
	
	$.ajax({
		type: 'POST',
		url: appHome+'/supplier-invoices/common_ajax',
		data: {
			'action_type' : 'get_jobcost_invoice',
			'invoice_id' : invoice_id,
		},
		success: function(response){
			$('.loadershow').hide();
			if(response != "") {
				$('#invoice_details_div').html(response);				
			} else {
				var msg = '<div class="alert alert-danger">'
							+'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'
							+'<i class="fa fa-exclamation-circle"></i> <strong>Sorry</strong>, there are no Costs associated with this invoice.'
							+'</div>';
				$('#invoice_details_div').html(msg);	
			}
		},
		error: function(response){
			alert('Oops! Error occured');
		}
	});

  //$(popup).find('.update-supplier-extra').attr('data-row', row);
 // $(popup).modal('show');
});

/**
 * added for implement sorting
 * DM-14/Nov/2017 
 */
$(document).ready(function(){
	
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
		$('html, body').animate({
	        'scrollTop' : $("#doublescroll").position().top
	    });
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
	}
	$('.tmp-input-ctrl').remove();
	if($('#supplier').val() != ''){
		getSupplierDetails($('#supplier').val());
	}
	getEmailRecords();
});

/**
 * added for implement sorting
 * DM-14/Nov/2017 
 */
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
		$('.supp-invoice-form').submit();
	}
});

/**
 * added for implement sorting
 * DM-14/Nov/2017 
 */
$(document).on('change', '.custom-page-pagesize', function(e) {
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('.supp-invoice-form').submit();
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
if($('#doublescroll table tr').length > 10){
	DoubleScroll(document.getElementById('doublescroll'));
} 

/**
 * add comment
 * DM-29/jan/2018
 */
$(document).on('click', '.suppler_invoice_comment', function(e) {
	var data_original_title = $(this).attr('data-original-title');
	$('#comment_view').val(data_original_title);
	$('#supplier_invoice_id').val($(this).attr('data-invoice-id'));
});

$(document).on('click', '.submit_comment_invoice', function(e) {
	
	var supplier_invoice_id = $('#supplier_invoice_id').val();
	var comment_view = $('#comment_view').val().trim();
	
	$.ajax({
		type: 'POST',
		url: appHome+'/supplier-invoices/common_ajax',
		data: {
			'action_type' : 'save_inv_comment',
			'invoice_id' : supplier_invoice_id,
			'comment' : comment_view
		},
		success: function(response){
			var suppler_inv_element = $('.suppler_invoice_comment[data-invoice-id="' + supplier_invoice_id + '"]');
			suppler_inv_element.attr('data-original-title',comment_view)
			if(comment_view != ""){
				suppler_inv_element.removeClass('fa-plus-circle fa-comment').addClass('fa-comment');
			}else{
				suppler_inv_element.removeClass('fa-plus-circle fa-comment').addClass('fa-plus-circle');
			}
		},
		error: function(response){
			alert('Oops! Error occured');
		}
	});
});

$(document).on('mouseout', '.red-tooltip', function(){
		$( this ).tooltip('hide');
		$('#hover_last').val('');
	});

//get_invoice_process_log

$(document).on('mouseover', '.view_log_btn', function(e) {
	var job_id = $(this).attr('data-id');
	var jc_id = $(this).attr('data-jc_id');
	var acitity = $(this).attr('data-activity');
	var name_id = $(this).attr('data-name-id');
	var is_ajax = $(this).attr('data-isAjaxCall');
	if(is_ajax == 0 )
		{
	$.ajax({
		type: 'POST',
		url: appHome+'/supplier-invoices/common_ajax',
		beforeSend: function() {
			$('#'+name_id).attr('data-isajaxcall','1');
			$('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
	    	var TooltipHtml = "<table class ='table table-condensed tooltip-table' style='font-size:10px;border-collapse: unset;background-color:#ddd;margin:0px;align:center;'>";
	    	TooltipHtml += "<th style='border:1px solid #ddd;background-color:white;'>"+'Updated on'+"</th>"
	    	TooltipHtml += "<th style='border:1px solid #ddd;text-align:center;background-color:white;'>"+'Updated by'+"</th>"
	    	TooltipHtml += "<th style='border:1px solid #ddd;background-color:white;'>"+'Actual Currency'+"</th>"
	    	TooltipHtml += "<th style='border:1px solid #ddd;background-color:white;'>"+'Actual Amount'+"</th></tr>"
	    
			TooltipHtml += "<tr>"
			TooltipHtml += "<td colspan='5'><div><i class='fa fa-spinner fa-spin' style='font-size: 18px;'></i></div></td>"	
			TooltipHtml += "</tr>"
	    	 TooltipHtml += "</table>";
	    	 $('#'+name_id).attr('data-original-title',TooltipHtml);
	    	 $('#'+name_id).tooltip('show');	
      	},
		data: {
			'action_type' : 'get_invoice_process_log',
			'job_id' : job_id,
			'acitity' : acitity,
			'jc_id' :jc_id,
		},
		success: function(response){
			$('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
			var data = JSON.parse(response);
	    	var TooltipHtml = "<table class ='table table-condensed tooltip-table' style='font-size:10px;border-collapse: unset;background-color:#ddd;margin:0px;text-align:center;'>";
	    	TooltipHtml += "<th style='border:1px solid #ddd;background-color:white;'>"+'Updated on'+"</th>"
	    	TooltipHtml += "<th style='border:1px solid #ddd;text-align:center;background-color:white;'>"+'Updated by'+"</th>"
	    	TooltipHtml += "<th style='border:1px solid #ddd;background-color:white;'>"+'Actual Currency'+"</th>"
	    	TooltipHtml += "<th style='border:1px solid #ddd;background-color:white;'>"+'Actual Amount'+"</th></tr>"
	    		
			$(data).each(function(i,val)
					 {
				TooltipHtml += "<tr>"
					    $.each(val,function(key,val)
					  {
			    			TooltipHtml += "<td style='border: 1px solid #ddd;background-color:white;'>"+val+"</td>"; 
					  });
				TooltipHtml += "</tr>"
					});
	    	 TooltipHtml += "</table>";
	    	 $('#'+name_id).attr('data-original-title',TooltipHtml);
	    	 $('#'+name_id).tooltip('show');
		},
		error: function(response){
			alert('Oops! Error occured');
		}
	});
}
});


//get_po_invoice_process_log

$(document).on('mouseover', '.view_po_log_btn', function(e) {
	
	var po_no = $(this).attr('data-id');
	var po_id = $(this).attr('data-poid');
	var name_id = $(this).attr('data-name-id');
	var is_ajax = $(this).attr('data-isAjaxCall');
	if(is_ajax == 0 )
		{
	$.ajax({
		type: 'POST',
		url: appHome+'/supplier-invoices/common_ajax',
		beforeSend: function() {
			$('#'+name_id).attr('data-isajaxcall','1');
			$('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
	    	var TooltipHtml = "<table class ='table table-condensed tooltip-table' style='font-size:10px;border-collapse: unset;background-color:#ddd;margin:0px;align:center;'>";
	    	TooltipHtml += "<th style='border:1px solid #ddd;background-color:white;'>"+'Updated on'+"</th>"
	    	TooltipHtml += "<th style='border:1px solid #ddd;text-align:center;background-color:white;'>"+'Updated by'+"</th>"
	    	TooltipHtml += "<th style='border:1px solid #ddd;background-color:white;'>"+'Actual Currency'+"</th>"
	    	TooltipHtml += "<th style='border:1px solid #ddd;background-color:white;'>"+'Actual Amount'+"</th></tr>"
	    
			TooltipHtml += "<tr>"
			TooltipHtml += "<td colspan='5'><div><i class='fa fa-spinner fa-spin' style='font-size: 18px;'></i></div></td>"	
			TooltipHtml += "</tr>"
	    	 TooltipHtml += "</table>";
	    	 $('#'+name_id).attr('data-original-title',TooltipHtml);
	    	 $('#'+name_id).tooltip('show');	
      	},
		data: {
			'action_type' : 'get_po_invoice_process_log',
			'po_no' : po_no,
			'po_id' : po_id,
		},
		success: function(response){
			$('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
			var data = JSON.parse(response);
	    	var TooltipHtml = "<table class ='table table-condensed tooltip-table' style='font-size:10px;border-collapse: unset;background-color:#ddd;margin:0px;align:center;'>";
	    	TooltipHtml += "<th style='border:1px solid #ddd;background-color:white;'>"+'Updated on'+"</th>"
	    	TooltipHtml += "<th style='border:1px solid #ddd;text-align:center;background-color:white;'>"+'Updated by'+"</th>"
	    	TooltipHtml += "<th style='border:1px solid #ddd;background-color:white;'>"+'Actual Currency'+"</th>"
	    	TooltipHtml += "<th style='border:1px solid #ddd;background-color:white;'>"+'Actual Amount'+"</th></tr>"
	    		
			$(data).each(function(i,val)
					 {
				TooltipHtml += "<tr>"
					    $.each(val,function(key,val)
					  {
			    			TooltipHtml += "<td style='border: 1px solid #ddd;background-color:white;'>"+val+"</td>"; 
					  });
				TooltipHtml += "</tr>"
					});
	    	 TooltipHtml += "</table>";
	    	 $('#'+name_id).attr('data-original-title',TooltipHtml);
	    	 $('#'+name_id).tooltip('show');
		},
		error: function(response){
			alert('Oops! Error occured');
		}
	});
}
});

/**
 * Send Supplier Query
 */
$(document).on('click', '#send_supplier_query', function(e) {
	e.preventDefault();
	$('#supplier_query_notes').css('border-color', '#ccc');
	var form = '#'+$(this).closest('form').attr('id'),
      success = [];

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

  	highlight($(form).find('#supplier'), '');
  	highlight($(form).find('#supplier_query_notes'), '');
  	highlight($(form).find('#invoice_number'), '');
  
  
  	var check_fields = (success.indexOf(false) > -1);


	if(check_fields === true){
		$('html, body').animate({ scrollTop: 0 }, 400);
		$('form').find('.response').empty().prepend(alert_required).fadeIn();
		if($('#supplier_query_notes').val().trim() == ''){
			$('#supplier_query_notes').css('border-color', 'red');
		}
	} 
	else if($('#supp_query').prop('checked') == false){
		$('#supp_query').css('outline-color', 'red');
		$('#supp_query').css('outline-style', 'solid');
		$('#supp_query').css('outline-width', 'thin');
        $('html, body').animate({ scrollTop: 0 }, 400);
	  	$('form').find('.response').empty().prepend(alert_check).fadeIn();
    }
	else {
		$('#to_name').val($('#supplier_name').val());
		$('#to_email').val($('#supplier_email').val());
		var message = $('#supplier_query_notes').val();
		//var message_body = $('#message_body').val();
		$('#message').val(message);
		var invoice_number = $('#invoice_number').val();
		$('#subject').val('Supplier Invoice Query #'+invoice_number);
		$('#message-div').html('');
		$('.cc_email').val('');
		$('#supplier_mail').modal('show');
      	/**/
    }
	
});

$(document).on('change', '#supplier', function(){

	var supplier_id = $(this).val();
	getSupplierDetails(supplier_id);
});

function getSupplierDetails(supplier_id){
	
	$.ajax({
        type: 'POST',
        url: appHome+'/supplier-invoices/common_ajax',
        data: {
        	'supplier_id' : supplier_id,
  			'action_type' : 'get_supplier_email'
        },
        success: function(response){
          	if(response){
          		response = JSON.parse(response);
          		$('#supplier_name').val(response.name);
          		$('#supplier_email').val(response.email);
          	}       
        },
        error: function(response){
          	$('html, body').animate({ scrollTop: 0 }, 400);
          	$('form').find('.response').empty().prepend(alert_error).fadeIn();
        }
  	});	
}

$(document).on('click', '.send_primary', function(e){
	e.preventDefault();
	sendSupplierQueryMail();

});

function sendSupplierQueryMail(){
	var cc_email = [];
	var button = $('.send_primary');
	button.find('span').addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');
	
	$.ajax({
        type: 'POST',
        url: appHome+'/supplier-invoices/common_ajax',
        data: {
        	'supplier_id' : $('#supplier').val(),
        	'supplier_name' : $('#supplier_name').val(),
        	'supplier_email' : $('#to_email').val(),
  			'message' : $('#message').val().trim(),
  			'cc_email1' : $('#cc_email1').val(),
  			'cc_email2' : $('#cc_email2').val(),
  			'cc_email3' : $('#cc_email3').val(),
  			'invoice_id' : $('#invoice_id').val(),
  			'subject' : $('#subject').val(),
  			'action_type' : 'send_supplier_query',
        },
        success: function(response){
        	if(response){
          		response = JSON.parse(response);
          		if(response.status == 1){
          			$('#message-div').html(alert_success);
          			$('#invoice_id').val(response.invoice_id);
          			getEmailRecords();
          		}
          		else{
          			$('#message-div').html(alert_warning);
          			getEmailRecords();
          		}
          		
          	}
          	else{
          		$('#message-div').html(alert_warning);
          		getEmailRecords();
          	}    
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('.response').empty().prepend(alert_error).fadeIn();
        }
  	});
}

function getEmailRecords(){
	var button = $('.send_primary');
	if($('#invoice_id').val() != 0){
		$.ajax({
	        type: 'POST',
	        url: appHome+'/supplier-invoices/common_ajax',
	        data: {
	  			'invoice_id' : $('#invoice_id').val(),
	  			'action_type' : 'get_email_records',
	        },
	        success: function(response){
	          $('.record-table tbody').html(response);   
	          $('a.colorbox').colorbox({iframe:true, width:'80%', height:'90%'});
	          button.find('span').removeClass("fa fa-spinner fa-spin");
          	  button.removeAttr('disabled');
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('.response').empty().prepend(alert_error).fadeIn();
	        }
	  	});
	}
	else{
		$('.record-table tbody').html('<tr><td align="center"colspan="8"><strong>No email records found</strong></td></tr>');
	}
}

$(document).on('click', '.reply-section', function(e){
	var record_id = $(this).data('record-id');
	getEmailRecordDetails(record_id);
});

function sendSupplierQuerReplyMail(){
	var cc_email = [];
	$('.cc_email').each(function () {  
    	cc_email.push($(this).val());  
    });

	$.ajax({
        type: 'POST',
        url: appHome+'/supplier-invoices/common_ajax',
        data: {
        	'supplier_id' : $('#supplier').val(),
        	'supplier_name' : $('#supplier_name').val(),
        	'supplier_email' : $('#to_email').val(),
  			'message' : $('#message').val().trim(),
  			'cc_email' : cc_email,
  			'invoice_id' : $('#invoice_id').val(),
  			'subject' : $('#subject').val(),
  			'action_type' : 'send_supplier_query',
        },
        success: function(response){
          getEmailRecords();       
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('.response').empty().prepend(alert_error).fadeIn();
        }
  	});
}


function getEmailRecordDetails(record_id){
	
	$('.cc_email').val('');

	$.ajax({
        type: 'POST',
        url: appHome+'/supplier-invoices/common_ajax',
        data: {
        	'record_id' : record_id,
  			'action_type' : 'get_email_record_details'
        },
        success: function(response){
          	if(response){
          		response = JSON.parse(response);
          		$('#to_name').val(response.name);
          		$('#to_email').val(response.email);
          		$('#subject').val(response.subject);
				$('#message').val('');
				if(response.cc_email1){
					$('#cc_email1').val(response.cc_email1);
				}
				if(response.cc_email2){
					$('#cc_email2').val(response.cc_email2);
				}
				if(response.cc_email3){
					$('#cc_email3').val(response.cc_email3);
				}
				$('#message-div').html('');
				$('#supplier_mail').modal('show');
          	}       
        },
        error: function(response){
          	$('html, body').animate({ scrollTop: 0 }, 400);
          	$('form').find('.response').empty().prepend(alert_error).fadeIn();
        }
  	});	
}

$(document).on('click', '#emailrec_btn', function(){
	$('#emailrec_btn i').toggleClass('fa-minus-circle fa-plus-circle');
});

$(document).on('click','.jobcost_radio', function(){
	var job_type = $(this).data('business-type');
	var tank_number = $('#supp_inv_tanknumber').val();
	var pl_date = $(this).data('plan-date');
	var pl_time = $(this).data('plan-time');
	var pl_id = $(this).data('plan-id');
	var supplier_invoice_id = $('#supplier_invoice_id').val();

	if($(this).is(":checked") && job_type == 'R') {
		getValidNextJobNumber(tank_number, pl_date, pl_time, pl_id, supplier_invoice_id);
		$('#addto-job-cost').attr("disabled", true);
		//$(this).prop('checked', false); 	
  	}
  	else{
  		$('#addto-job-cost').attr("disabled", false);
  	}
}); 

function getValidNextJobNumber(tank_number, pl_date, pl_time, pl_id, supplier_invoice_id){
	
	$.ajax({
        type: 'POST',
        url: appHome+'/supplier-invoices/common_ajax',
        data: {
        	'tank_number' : tank_number,
        	'pl_date'     : pl_date,
        	'pl_time'	  : pl_time,
        	'pl_id'		  : pl_id,
        	'supplier_invoice_id' : supplier_invoice_id,
  			'action_type' : 'get_next_valid_job_number'
        },
        success: function(job_number){
        	if(job_number != ''){
	        	BootstrapDialog.show({
			        type: BootstrapDialog.TYPE_WARNING,
			        title: 'REPO Job',
			        message: 'Current Job is REPO, would you like to go to next job <a target="_blank" href="'+appHome+'/job-cost/index?id='+job_number+'">'+job_number+'</a>',
			        buttons: [{
						label: 'OK',
						action: function(dialogItself){
						 	dialogItself.close();
						}
					}]
			    });
			}
			else{
				$('#in_query').attr('checked', true);
				BootstrapDialog.show({
			        type: BootstrapDialog.TYPE_WARNING,
			        title: 'REPO Job',
			        message: 'The tank does not have any other valid jobs other than REPO jobs',
			        buttons: [{
						label: 'OK',
						action: function(dialogItself){
						 	dialogItself.close();
						}
					}]
			    });
			}  
        },
        error: function(response){
        	// error 
        }
  	});

}

function checkRepoJobNo(job_no, buttonFrom){
	if(job_no){
		$.ajax({
			type: 'POST',
			async: false,
			url: appHome+'/supplier-invoices/common_ajax',
			data: {
				'action_type' : 'check_repo_job',
				'job_no' : job_no,
			},
			success: function(response){	        	
				if(response){
					response = JSON.parse(response);
					if(response.is_repo == 1){
						if(response.job_number != ''){
							BootstrapDialog.show({
						        type: BootstrapDialog.TYPE_WARNING,
						        title: 'REPO Job',
						        message: 'Current Job is REPO, would you like to go to next job <a target="_blank" href="'+appHome+'/job-cost/index?id='+response.job_number+'">'+response.job_number+'</a>',
						        buttons: [{
									label: 'OK',
									action: function(dialogItself){
									 	dialogItself.close();
									}
								}]
						    });
						}
						else{
							$('#in_query').attr('checked', true);
							BootstrapDialog.show({
						        type: BootstrapDialog.TYPE_WARNING,
						        title: 'REPO Job',
						        message: 'The tank does not have any other valid jobs other than REPO jobs',
						        buttons: [{
									label: 'OK',
									action: function(dialogItself){
									 	dialogItself.close();
									}
								}]
						    });
						}
						status = false;
					}
					else{
						status = true;
					}
				}
			}
		});
		return status;
	}
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
							newFileSelected(null);
							setTimeout(() => {
								// newUploadFile(null); to automatic upload
								myDropzone.removeAllFiles( true );
							}, 200);
						}
		
		
					});
			
				}
			});
		}
		
	if($("#drag_and_drop_on_modal").val()){
			Dropzone.autoDiscover = false;
			//Dropzone class
			var myDropzone = new Dropzone("#supplier_invoice_docs_modal", {
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
							newFileSelected(null);
							setTimeout(() => {
								// newUploadFile(null); to automatic upload
								myDropzone.removeAllFiles( true );
							}, 200);
						}
		
		
					});
			
				}
			});
		}
});
