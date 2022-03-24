$(document).ready(function(){
		var sortval = $('#sortval').val();
		if(sortval != 0) {
			    var val = parseInt(sortval.match(/\d+/))  + 1;
			    var asc_desc = ($('#sortvalload').val() == 1) ? 0 : 1;
			    if( asc_desc == 1) {
			    	$(sortval).removeClass($('#sortvalclass').val());
			    	$(sortval).addClass('fa-angle-double-right');
			    }else{
			    	$(sortval).removeClass($('#sortvalclass').val());
			    	$(sortval).addClass('fa-angle-double-left');
			    }
			    $(sortval).show();
				$('#kicktable').tablesorter({
		         dateFormat: "ddmmyyyy",
		         sortList: [[ val, asc_desc ]],
		         headers: {
				      '.sort-disable' : {
				        sorter: false
				      }
				    }
		        });
		}else{
			$('#kicktable').tablesorter({
		         dateFormat: "ddmmyyyy",
		           headers: {
				      '.sort-disable' : {
				        sorter: false
				      }
				    }
		        });
		}
	$(".confirm_checkbox").change(function() {
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
	$(".all_no_recharge").change(function() {
		$('#response').empty()
		var checked = $(this).is(':checked');
	    $(".confirm_checkbox").prop('checked',false);
	    if(checked) {
	        $('.confirm_checkbox').prop('checked',true);
	    }
	});
	$(".all_deny").change(function() {
		$('#response').empty()
		$('.each_tr').removeClass('success danger');
		var checked = $(this).is(':checked');
	    $(".confirm_checkbox,.all_accept").prop('checked',false);
	    if(checked) {
	        $('.deny').prop('checked',true);
	        $('.each_tr').addClass('danger');
	    }
	});
	$(".all_accept").change(function() {
		$('#response').empty()
		$('.each_tr').removeClass('success danger');
		var checked = $(this).is(':checked');
	    $(".confirm_checkbox,.all_deny").prop('checked',false);
	    if(checked) {
	        $('.accept').prop('checked',true);
	        $('.each_tr').addClass('success');
	    }
	});
	
	
	
	$('#modal_btn_click').click(function(e){
		$('.highlight').removeClass('highlight');
		var acceptCount = $('.confirm_checkbox:checked').length;
		$('.selected-count').html(acceptCount);
		if(acceptCount == 0){
			$('#btn-apply-no-recharge').attr('disabled','disabled');
		}else{
			$('#btn-apply-no-recharge').removeAttr('disabled','disabled');
		}
		$('#recharge_aganist_other_act').attr('checked', false);
		$('#not_recharge_comments,#po_rec_number,#po_rec_id').val('');
		$('#not_reason_code_for_acc_manager').val('');
		$('.chosen').chosen().trigger("chosen:updated");
	});
	
	$('#btn-apply-no-recharge').click(function(e){
		var jobcostData = [];
		$('.confirm_checkbox:checked').each(function(){
			jobcostData.push({'jc_id':$(this).attr('data-jc-id')});
		});
		if($('#po_rec_number').length > 0 && $('#po_rec_number').val() == ""){
			$('#po_rec_number').parent().addClass('highlight');
			return false;
		}else if($('#not_reason_code_for_acc_manager').length > 0 && $('#not_reason_code_for_acc_manager').val() == ""){
			$('#not_reason_code_for_acc_manager').parent().addClass('highlight');
			return false;
		}
		
		var notRechargeComments = ($('#not_recharge_comments').length > 0) ? $('#not_recharge_comments').val() : "";
		var notReasonCodeForAccManager = ($('#not_reason_code_for_acc_manager').length > 0) ? $('#not_reason_code_for_acc_manager').val() : "";
		var rechargeAganistOtherAct = ($('#recharge_aganist_other_act:checked').length > 0) ? 1 : 0;
		var poRecNumber = ($('#po_rec_number').length > 0) ? $('#po_rec_number').val() : ""; 
		var poRecId = ($('#po_rec_id').length > 0) ? $('#po_rec_id').val() : "";
		
		if (jobcostData.length != 0) {
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
  	        	  	'poRecId' : poRecId
  	        	  	
  	        	  	},
  	          success: function(response){
  	          	$('#modal_no_recharge').modal('hide');
  	           	$('#search-form').submit();
  	            localStorage.setItem('response', response);
  	            $('html, body').animate({ scrollTop: 0 }, 400);
  	          }
  	        });
		}
	});

	$('#apply_confirm').click(function(e){
		e.preventDefault();
		var acceptCount = $('.confirm_checkbox:checked').length;
		if(acceptCount > 0){
			
			var jobcostData = [];
			  
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
					        	        	location.reload();
					        	            localStorage.setItem('response', response);
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
	/**
	* filter results
	*/
	$('.filter-results').click(function(e){
	  e.preventDefault();

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
	      } else {
	    	  $('.full_loadrow').show();
	    	  $('.count-table').hide();
	    	  $("form").submit();
	      }
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
	
	if($('#bor_table tr').length > 10){
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
	
	var hiddenCount = $('#hidden_count').val();
	var defcurrency = $('#default-currency').val();
	if(hiddenCount != ""){
		var jsonObj = JSON.parse(hiddenCount);
	}
	var totalOverspentAmt = jsonObj.total_overspend;
	var totalCount = jsonObj.records_count;
	var teamHtml = "";
	var aManager = "";
	
	$('.total-overspend').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);"><i class="fa '+defcurrency+'"></i>&nbsp;'+totalOverspentAmt+'</span>');
	$('.total-count').html('<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" >'+totalCount+'</span>');
	if(jsonObj.teams.length != 0){
		$.each(jsonObj.teams, function (tindex, tdata) {
			teamHtml += '<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" >'+tindex+' : '+tdata+'</span>&nbsp;';
	    })
	    $('.team-names').html(teamHtml);
	}
	if(jsonObj.a_manger.length != 0){
		$.each(jsonObj.a_manger, function (aindex, adata) {
			aManager += '<span class="badge" style="color: rgb(255, 255, 255);background-color: rgb(63, 143, 63);" >'+aindex+' : '+adata+'</span>&nbsp;';
	    })
	    $('.acc-manager-names').html(aManager);
	}
$('.sortclass').css( 'cursor', 'pointer' );

//Autocomplete function to fetch the tank numbers
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
	  
});

//end of document ready
$(document).on('click', '.sortclass', function(){
	var idval = "#"+$(this).data('val');
	var sortval = $('#sortval').val();
	if(sortval == '0'){
		$('#sortval').val(idval);
		$(idval).show();
	}else{
		$(sortval).hide();
		$('#sortval').val(idval);
		$(idval).show();
	}
	$(idval).toggleClass('fa-angle-double-left fa-angle-double-right');
	if($(idval).hasClass('fa-angle-double-left')){
        $('#sortvalload').val(1);
        $('#sortvalclass').val('fa-angle-double-right');
	}else{
		$('#sortvalload').val(0);
		$('#sortvalclass').val('fa-angle-double-left');
	}
});




	
