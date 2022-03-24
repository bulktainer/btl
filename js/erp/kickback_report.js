$(document).ready(function(){

	$(document).on('change', '.confirm_checkbox', function() {
		$('#response').empty()
	    var checked = $(this).is(':checked');
	    var myClass = $(this).attr("class").split(' ');
	    var tr = $(this).closest('tr');
	    tr.removeClass('success danger');
	    $("."+myClass[0]).prop('checked',false);
	    if(checked) {
	        $(this).prop('checked',true);
	        if(myClass[2] == 'accept'){
	        	var className = 'success';
	        }
	        if(myClass[2] == 'deny'){
	        	var className = 'danger';
	        }
	        tr.addClass(className);
	    }
	    //accept all checkbox
		var acceptCount = $('.accept:checked').length;
		var acceptTotal = $('.accept').length;
		if(acceptCount == acceptTotal){
			$(".all_accept").prop('checked',true);
		}else{
			$(".all_accept").prop('checked',false);
		}
		//denyall all checkbox
		var acceptCount = $('.deny:checked').length;
		var acceptTotal = $('.deny').length;
		if(acceptCount == acceptTotal){
			$(".all_deny").prop('checked',true);
		}else{
			$(".all_deny").prop('checked',false);
		}
	});

	$(document).on('change', '.all_no_recharge', function() {
		$('#response').empty()
		var checked = $(this).is(':checked');
	    $(".confirm_checkbox").prop('checked',false);
	    if(checked) {
	        $('.confirm_checkbox').prop('checked',true);
	    }
	});

	$(document).on('change', '.all_deny', function() {
		$('#response').empty()
		$('.each_tr').removeClass('success danger');
		var checked = $(this).is(':checked');
	    $(".confirm_checkbox,.all_accept").prop('checked',false);
	    if(checked) {
	        $('.deny').prop('checked',true);
	        $('.each_tr').addClass('danger');
	    }
	});

	$(document).on('change','.all_accept', function() {
		$('#response').empty()
		$('.each_tr').removeClass('success danger');
		var checked = $(this).is(':checked');
	    $(".confirm_checkbox,.all_deny").prop('checked',false);
	    if(checked) {
	        $('.accept').prop('checked',true);
	        $('.each_tr').addClass('success');
	    }
	});
	
	$(document).on('click', '#modal_btn_click', function(e){
		$('.highlight').removeClass('highlight');
		var acceptCount = $('.confirm_checkbox:checked').length;
		$('.selected-count').html(acceptCount);
		if(acceptCount == 0){
			$('#btn-apply-no-recharge').attr('disabled','disabled');
		}else{
			$('#btn-apply-no-recharge').removeAttr('disabled','disabled');
		}
		$('#btn-apply-no-recharge').html('<span class="glyphicon glyphicon-ok-circle"></span>&nbsp;<span>Apply</span>');
		$('#recharge_aganist_other_act').attr('checked', false);
		$('#not_recharge_comments,#po_rec_number,#po_rec_id').val('');
		$('#not_reason_code_for_acc_manager').val('');
		$('#not_reason_code_for_acc_manager').chosen().trigger("chosen:updated");
	});
	
	$(document).on('click', '#btn-apply-no-recharge', function(e){
		var jobcostData = [];
		$('.confirm_checkbox:checked').each(function(){
			jobcostData.push({'jc_id':$(this).attr('data-jc-id')});
		});
		if($('#po_rec_number:visible').length > 0 && $('#po_rec_number').val() == ""){
			$('#po_rec_number').parent().addClass('highlight');
			return false;
		}else if($('#not_reason_code_for_acc_manager:visible').length > 0 && $('#not_reason_code_for_acc_manager').val() == ""){
			$('#not_reason_code_for_acc_manager').parent().addClass('highlight');
			return false;
		}
		if (jobcostData.length != 0) {
			var notRechargeComments = $('#not_recharge_comments').val();
			var notReasonCodeForAccManager = $('#not_reason_code_for_acc_manager').val();
			var rechargeAganistOtherAct = $('#recharge_aganist_other_act:checked').length;
			
			if($('#po_rec_number:visible').length > 0 && $('#po_rec_number').val() != ""){
				var poRecNumber = $('#po_rec_number').val(); 
				var poRecId = $('#po_rec_id').val();
			}else{
				var poRecNumber = ""; 
				var poRecId = "";
			}
			
			$.ajax({
  	          type: 'POST',
  	          url: appHome+'/kickback-report/common_ajax',
  	          async : false,
  	          beforeSend: function() {
   		        	$('#btn-apply-no-recharge').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
	     		    $('#btn-apply-no-recharge').attr('disabled','disabled');
   		        },
  	          data: {
  	        	  	'jobcostData' : JSON.stringify({jobcostData}),
  	        	  	'action_type' : 'upadate_no_recharge_toall',
  	        	  	'notRechargeComments' : notRechargeComments,
  	        	  	'notReasonCodeForAccManager' : notReasonCodeForAccManager,
  	        	  	'rechargeAganistOtherAct' : rechargeAganistOtherAct,
  	        	  	'cost_type' : $('#cost_type').val(),
	        	  	'poRecNumber' : poRecNumber,
	        	  	'poRecId' : poRecId,
	        	  	'display_format' : $('#display_format').val()
  	        	  	},
  	          success: function(response){
  	          	$.each(jobcostData, function(index, value) {  
					$('.chk_'+value.jc_id).closest('tr').remove();      
				});
  	          	$('#modal_no_recharge,#modal_link_po').modal('hide');
  	          	$('#response').html(response);
  	            // localStorage.setItem('response', response);
  	            $('html, body').animate({ scrollTop: 0 }, 400);
  	          }
  	        });
		}
	});

	$(document).on('click', '#apply_confirm', function(e){
		e.preventDefault();
		var acceptCount = $('.confirm_checkbox:checked').length;
		if(acceptCount > 0){
			
			var jobcostData = [];
			// var jcIds = [];
			  $('.confirm_checkbox:checked').each(function(){
				  if($(this).hasClass('accept')){
					  var type='accept';
				  }
				  if($(this).hasClass('deny')){
					  var type='deny'; 
				  }
				  jobcostData.push({'type':type,
		  							 'jc_id':$(this).attr('data-jc-id')
		  			   				});
				  // jcIds.push($(this).attr('data-jc-id'));
				  
			  });
			  BootstrapDialog.show({
				   type: BootstrapDialog.TYPE_INFO,
		           title: 'Confirmation',
		           message: 'Are you sure you want to apply changes?',
		           buttons: [{
					             label: 'Close',
					             action: function(dialogItself){
					                 dialogItself.close();
					             }
						         },{
					           label: 'Ok',
					           cssClass: 'btn-info',
					           action: function(dialogItself){
					        	$.ajax({
					        	          type: 'POST',
					        	          url: appHome+'/kickback-report/common_ajax',
					        	          async : false,
					        	          beforeSend: function() {
						     		        	$('.bootstrap-dialog-footer-buttons > .btn-info').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
							     		        $('.bootstrap-dialog-footer-buttons > .btn-info').attr('disabled','disabled');
						     		        },
					        	          data: {
					        	        	  	'jobcostData' : JSON.stringify({jobcostData}),
					        	        	  	'action_type' : 'update_business_manager'
					        	        	  	},
					        	          success: function(response){
					        	        	$.each(jobcostData, function(index, value) {  
											    $('.chk_'+value.jc_id).closest('tr').remove();      
											});
					        	            dialogItself.close();
					        	            $('#response').html(response);
					        	            $('html, body').animate({ scrollTop: 0 }, 400);
					        	          }
					        	        });
					           }
					   }]
		       });
		}else{
			var msg = '<div class="alert alert-danger alert-dismissable">'+
						'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'+
						'<i class="fa fa-exclamation-triangle"></i>'+ 
						'<strong>Uh oh!</strong> Please Select any Jobcosts.</div>';
			$('html, body').animate({ scrollTop: 0 }, 400);
	        $('#response').empty().prepend(msg).fadeIn();
		}
	});
	
	/* removed 10-Oct-2017
	 * function fillDropdownCodes(){
		  var operational  = $('#operational_overspend_check:checkbox:checked').length > 0;
		  var reason  = $('#recharge_code_check:checkbox:checked').length > 0;
		  var bothoption = '',o_option = '',r_option = '',final_option = '';
		  var selected = $('#hidden-recharge-activity').val();
		  $("#hidden-recharge-activity option").each(function(){
				   var rechargeable_option = $(this).data('rechargeable');
				   var operational_option = $(this).data('operational');
				   var val = $(this).val();
				   if(operational && reason && ( rechargeable_option == 1 || operational_option == 1)){
					   bothoption += '<option>'+val+'</option>'; 
				   }
				   if(operational && operational_option == 1){
					   o_option += '<option>'+val+'</option>'; 
				   }
				   if(reason && rechargeable_option == 1){
					   r_option += '<option>'+val+'</option>'; 
				   }
		  });
		 if(operational && reason){
			 final_option = bothoption;
		 }else if(operational){
			 final_option = o_option;
		 }else if(reason){
			 final_option = r_option;
		 }
		 if(final_option != ''){
			 $('#rechargable_code_filter').removeAttr('disabled');
		 }else{
			 $('#rechargable_code_filter').prop('disabled','disabled');
		 }
		 final_option = '<option value="all" >All</option>'+final_option;
		 $('#rechargable_code_filter').html(final_option);
		 $('#rechargable_code_filter').val(selected);
		 $('.chosen').chosen().trigger("chosen:updated");
	}*/
	
	  /* removed 10-Oct-2017
	   * $('.activity-code-check').click(function(e){
		  $('#hidden-recharge-activity').val('all');
		  fillDropdownCodes();
	  });*/
	
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
	
	if($('#kick_table tr').length > 10){
		DoubleScroll(document.getElementById('doublescroll'));
	}
	/**
	 * multi select option for customers
	 */
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
	$('.tmp-input-ctrl').remove();//This control is for not showing old select box
	// fillDropdownCodes(); //removed 10-Oct-2017

	$(document).on('click', '#search_filter', function(e){
		e.preventDefault();
		$('#export_pdf').val('no');
		var form = '#'+$(this).closest('form').attr('id'),
		success = [];

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

		highlight($(form).find('#date_from'), '');
		highlight($(form).find('#date_to'), '');

		var check_fields = (success.indexOf(false) > -1);
		if(check_fields === true){
		    $('html, body').animate({ scrollTop: 0 }, 400);
		    $('form').find('#response').empty().prepend(alert_required).fadeIn();
		} 
		else{
			$('.full_loadrow').show();
			var form = '#'+$(this).closest('form').attr('id');
			$('#page').val(1);
			$('#response').empty();
			getKickBackReport(form);
			$('.count-table').show();
		}
	});

	//Get kickback report
	function getKickBackReport(form){ 
		var h = $('.overlay-complete-loader').height();
		if(h == 0) { h = 100; }
		$('.btl_overlay').height(h);  
		$('.btl_relative').show();
		var button = $('#search_filter');
		button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
	 	button.attr('disabled','disabled');
	 	var display_format = $('#display_format').val();
	 	
		$.ajax({ 
	        type: 'POST',
	        url: appHome+'/kickback-report/ajax-get-kickback-report',
	        data: $(form).serialize(),
	        success: function(response){
	        	// $('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
	        	$('.btl_relative').hide();
	        	$('.report-div').html(response);
	        	$("[data-toggle=tooltip]").tooltip();
	        	button.find('span').removeClass("fa fa-spinner fa-spin").addClass("glyphicon glyphicon-filter");
	         	button.removeAttr('disabled');
	         	$('.kick-button').removeAttr("disabled");
	         	if(display_format == 'level_2_no_recharge'){
	         		$('#apply_confirm').show();
	         		$('#modal_btn_click').hide();
	         	}
	         	else if(display_format == 'no_action_but_overspend'){
	         		$('#modal_btn_click').show();
	         		$('#apply_confirm').hide();
	         		if($('#cost_type').val() == 2){
	         			$('#modal_btn_click').attr('title', 'Link-PO');
	         			$('#modal_btn_click').text('Link-PO');
	         			$('#modal_btn_click').attr('data-target', '#modal_link_po');
	         		}else{
	         			$('#modal_btn_click').attr('title', 'Apply No Recharge');
	         			$('#modal_btn_click').text('Apply No Recharge');
	         			$('#modal_btn_click').attr('data-target', '#modal_no_recharge');
	         		}
	         	}
	         	else if(display_format == 'awaiting_final_action' && $('#cost_type').val() == 1){
	         		$('#modal_btn_click').attr('title', 'Apply No Recharge');
	         		$('#modal_btn_click').text('Apply No Recharge');
	         		$('#modal_btn_click').attr('data-target', '#modal_no_recharge');
	         		$('#modal_btn_click').show();
	         		$('#apply_confirm').hide();
	         	}
	         	else{
	         		$('#modal_btn_click').hide();
	         		$('#apply_confirm').hide();
	         	}
	         	getCount();
	         	addParserSort();
	         	addParserSortActualComments();
	         	initializeSorter();

				if($('#kick_table tr').length > 10){
					DoubleScroll(document.getElementById('doublescroll'));
				}
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	          button.find('span').removeClass().addClass("glyphicon glyphicon-filter");
	       	  button.removeAttr('disabled');
	      	 
	        }
	    });
	} 

	function getCount(){
		var hiddenCount = $('#hidden_count').val();
		/* changed code */
		if(hiddenCount != "" || hiddenCount != undefined){
			var jsonObj = JSON.parse(hiddenCount);
			var totalOverspentAmt = jsonObj.total_overspend;
			var totalCount = jsonObj.records_count;
			var teamHtml = "";
			var aManager = "";
			
			$('.total-overspend').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);"><i class="fa fa-eur"></i>&nbsp;'+totalOverspentAmt+'</span>');
			$('.total-count').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" >'+totalCount+'</span>');
			if(jsonObj.teams.length != 0){
				$.each(jsonObj.teams, function (tindex, tdata) {
					teamHtml += '<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" >'+tindex+' : '+tdata+'</span>&nbsp;';
			    })
			    $('.team-names').html(teamHtml);
			}
			if(jsonObj.a_manger.length != 0){
				$.each(jsonObj.a_manger, function (aindex, adata) {

					if (jsonObj.a_manger_inactive != null && jsonObj.a_manger_inactive.hasOwnProperty(aindex)) {
						var bc = '#ef6969';
					}else{
						var bc = 'rgb(63, 143, 63)';
					}
					aManager += '<span class="badge" style="color: rgb(255, 255, 255);background-color: '+bc+';" >'+aindex+' : '+adata+'</span>&nbsp;';
			    })
			    $('.acc-manager-names').html(aManager);
			}
		}
	}

	$(document).on('click', '.btn_more', function(){ 
		var page = $('#page').val();
		page = parseInt(page) + 1;
		$('#page').val(page);
		var form = '#search-form';
		var button = $('.btn_more');
		button.find('span').addClass("fa fa-spinner fa-spin");
	 	button.attr('disabled','disabled');
		$('#response').empty();
		getKickBackReportLoadData(form);
		$('.count-table').show();
	});

	//Get kickback report
	function getKickBackReportLoadData(form){ 
		var h = $('.overlay-complete-loader').height();
		if(h == 0) { h = 100; }
		$('.btl_overlay').height(h);  
		$('.btl_relative').show();
		var button = $('#search_filter');
		button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
	 	button.attr('disabled','disabled');
	 	$("#hidden_count").remove();
	 	
		$.ajax({ 
	        type: 'POST',
	        url: appHome+'/kickback-report/ajax-get-kickback-report-load-data',
	        data: $(form).serialize(),
	        success: function(response){
	        	$('.btl_relative').hide();
	        	$('.count-tr').remove();
	        	$('.btn_more').removeAttr('disabled');
	        	$('.btn_more').find('span').removeClass("fa fa-spinner fa-spin")
	        	$('#kick_table tbody tr:last').after(response);
	        	$("[data-toggle=tooltip]").tooltip();
	        	button.find('span').removeClass("fa fa-spinner fa-spin").addClass("glyphicon glyphicon-filter");
	         	button.removeAttr('disabled');
	         	
	         	getCount();
	         	addParserSort();
	         	addParserSortActualComments();
	         	initializeSorter();

				//Resort table
				var resort = true;
				$('.tablesorter').trigger("update", [resort]);
				var count = $('#rec_count').val();
				var page_size = $('#page_size').val();
				if(parseInt(count) < parseInt(page_size)){
					$('.view-list').remove();
				}
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	          button.find('span').removeClass().addClass("glyphicon glyphicon-filter");
	       	  button.removeAttr('disabled');
	      	 
	        }
	    });
	} 

	// $(document).on('change', '#display_format', function(){
	// 	var display_format = $(this).val();
	// 	if(display_format == 'level_2_no_recharge'){
	// 		$('#apply_confirm').show();
	// 		$('#modal_btn_click').hide();
	// 	}
	// 	else if(display_format == 'no_action_but_overspend'){
	// 		$('#modal_btn_click').show();
	// 		$('#apply_confirm').hide();
	// 	}
	// }); 
	
	if($("#po_rec_number").length > 0){
		 $("#po_rec_number").autocomplete({
		      source:  appHome+'/purchase_order/get_po_no_list',
		      minLength: 2,
		      type: "GET",
		      success: function (event, ui) {
		    	 
		      },
			  select: function (event, ui) {
				$(this).val(ui.item.label);
				$('#po_rec_id').val(ui.item.value);
				return false;
			  },
			  change: function (event, ui) {
		         if (ui.item === null) {
	        	 	 BootstrapDialog.show({title: 'Error', message : 'Not a valid PO. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
	        	 	 });
	        	 	 $('#po_rec_number').val('');
		         }
			  }
		  });
	}

	function addParserSort(){
		$.tablesorter.addParser({ 
		    // set a unique id 
		    id: 'comments', 
		    is: function(s) { 
		      // return false so this parser is not auto detected 
		      return false; 
		    }, 
		    format: function(s, table, cell, cellIndex) { 
		      // get data attributes from $(cell).attr('data-something');
		      // check specific column using cellIndex
		      var data = $(cell).attr('data-comments');
		      if(data != undefined && data != ''){
		      	return $(cell).attr('data-comments');
		      }
		      else{
		      	data = '';
		      	return data;
		      }
		    }, 
		    // set type, either numeric or text 
		    type: 'text' 
	  });
	}

	function addParserSortActualComments(){
		$.tablesorter.addParser({ 
		    // set a unique id 
		    id: 'actual_comments', 
		    is: function(s) { 
		      // return false so this parser is not auto detected 
		      return false; 
		    }, 
		    format: function(s, table, cell, cellIndex) { 
		      // get data attributes from $(cell).attr('data-something');
		      // check specific column using cellIndex
		      var data = $(cell).attr('data-actual-comments');
		      if(data != undefined && data != ''){
		      	return $(cell).attr('data-actual-comments');
		      }
		      else{
		      	data = '';
		      	return data;
		      }
		    }, 
		    // set type, either numeric or text 
		    type: 'text' 
	  });
	}
});//end of document ready

$(document).on('click','.commercial_comment_modal', function(){
	$('#commerial_comments_text').css('border','1px solid #ccc');
	var data = $(this).attr('data-item');
	var id = $(this).attr('data-id');
	$('#model_jc_id').val(id);
	$('#commerial_comments_text').val(data);
	if(data == ''){
		$('#delete_comments').prop('disabled',true);
	}
	else{
		$('#delete_comments').prop('disabled',false);
	}
});


$(document).on('click','#submit_comments', function(){
	updateCommercialComments();
});

$(document).on('click','#delete_comments', function(){
	$('#commerial_comments_text').val('');
	var message = 'Are you sure, you want to delete this commercial comments?';

	BootstrapDialog.show({
         type: BootstrapDialog.TYPE_DANGER,
         title: 'Confirmation',
         message: message,
         buttons: [{
		             label: 'Close',
		             action: function(dialogItself){
		                 dialogItself.close();
		             }
		         },{
	             label: 'Ok',
	             cssClass: 'btn-success',
	             action: function(dialogItself){
					updateCommercialComments();
					 dialogItself.close();
				} 
		}]
    });
});

function updateCommercialComments(){
	var text = $('#commerial_comments_text').val().trim();
	var id = $('#model_jc_id').val();
	
	$.ajax({
	    url: appHome+'/kickback-report/common_ajax',
	    type: 'POST',
	    dataType: 'html',
	    data : {
	    		'text' : text,
	    		'id' : id,
	    		'action_type' : 'update_commercial_comments'
	    },
	    success: function(data) {
	    	var aItem = $('.commercial_comment_modal[data-id="' + id +'"]');
	    	if(text != ''){
	    		aItem.attr('data-item',text);
		    	$('.commercial_comment_modal[data-id="' + id +'"] i').attr('data-original-title',text);
		    	$('.commercial_comment_modal[data-id="' + id +'"] i').removeClass('fa fa-plus-circle').addClass('fa fa-comment tooltip-icon');
		    	$('.jobcost_'+id).attr('data-comments',text);
	    	}else{
	    		aItem.attr('data-item','');
		    	$('.commercial_comment_modal[data-id="' + id +'"] i').attr('data-original-title','');
	    		$('.commercial_comment_modal[data-id="' + id +'"] i').removeClass('fa fa-comment tooltip-icon').addClass('fa fa-plus-circle');
	    		$('.jobcost_'+id).attr('data-comments',text);
	    	}
	    	$('#jc_commercial_comments_modal').modal('hide');
	    	var resort = true;
			$('.tablesorter').trigger("update", [resort]);
	    }
	});
}

function initializeSorter(){
	$(".tablesorter").tablesorter({
		 cssHeader:'sortheader',
		 cssAsc:'headerSortUp',
		 cssDesc:'headerSortDown',
		 dateFormat: "ddmmyyyy",
		 headers: { 
            '.no-sort' : {
		        sorter: false, parser: false
		    },
		    '.comments-sort' : { 
		    	sorter: 'comments'
		    },
		    '.actual-comments-sort' : {
		    	sorter: 'actual_comments'
		    }
        }
	});
}
