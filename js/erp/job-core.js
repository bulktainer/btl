$(document).on('change', '.custom-page-pagesize', function(e) {
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('#job-filter-form').submit();
});
$(document).ready(function(){
	
	  /**
	   * check if next test due is between one month
	   * DM Jan-16-2016
	   */
	/*$("#j_tank_no").change(function(){
			$.ajax({  
				type: "POST", 
				cache: false, 
				url: appHome+'/job/common_ajax',
				dataType: "text",
				data: ({
					'action_type':'check_tank_next_test_due',
					'tankno' : $(this).val()
				}),  
				success: function(result)
					{ 
						if(result != ''){
							BootstrapDialog.show({
	     		        		   type: BootstrapDialog.TYPE_DANGER,
	     		                   title: 'Warning',
	     		                   message: result,
	     		                   buttons: [{
	     		                     label: 'Close',
	     		                     action: function(dialogItself){
	     		                         dialogItself.close();
	     		                     }
	     		                 }]
	     		               });
						}
					}  
			});
			return false;
		});*/
 // $("#customer_consignee").autocomplete({
	// 			      source:  appHome+'/job/get_customer_list',
	// 			      minLength: 2,
	// 			      type: "GET",
	// 			      success: function (event, ui) {
				    	 
	// 			      },
	// 				  select: function (event, ui) {
	// 					$(this).val(ui.item.label);
	// 					$('#cust_name').val(ui.item.label);
	// 					$('#cust_id').val(ui.item.value);
	// 					return false;
	// 				  }
	// 			  });		
	
$('#search_box_bttn').click(function(){
    $('#search_box_bttn i').toggleClass('fa-search-minus fa-search-plus');
    $('.search_box').slideToggle("slow");
    $('#response,#response_count').slideToggle("fast"); 
});

var ExistSuccess = 'Ok';
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var oldalert = alert_required;


$('#btn-job-back').click(function(e){
	var action = appHome+'/job/backbutton';
	$('#form-job-plan-data').attr('action',action);
	$('#form-job-plan-data').submit();
});
$('#btn-job-discard').click(function(e){
	e.preventDefault();
	 BootstrapDialog.show({
         type: BootstrapDialog.TYPE_DANGER,
         title: 'Confirmation',
         message: 'Are you sure want to Discard?',
         buttons: [{
		             label: 'Close',
		             action: function(dialogItself){
		                 dialogItself.close();
		             }
		         },{
	             label: 'Ok',
	             cssClass: 'btn-danger',
	             action: function(dialogItself){
	            	 window.location.replace(appHome+'/job/live/view');
	             }
         }]
     });
	
});

/**
* create job in first page from quote number
*/
$('#btn-job-quote,#btn-save-job-data,#btn-job-save').click(function(e){
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
  
  //check whether it is string or not
  function notNumber(field){
	  if(field.val() != ''){
		  var t =  !isNaN(parseFloat(field.val())) && isFinite(field.val());
		  if(t){
			  $(field).parent().removeClass('highlight');
		        success.push(true);
		  }else{
			  $(field).parent().addClass('highlight');
		        success.push(false);
		  }
	  }
  } 

  function isquoteValid() {
	ExistSuccess = [];
	
	  $.ajax({
	        type: 'POST', 
	        url: appHome+'/job/common_ajax',
	        async : false,
	        data: {
	        	'action_type' : 'check_quoteno_valid',
	        	'quote_no'	  : $('#quote-number').val()
			},
	        success: function(response){
	        	if(response == 0){
	        		ExistSuccess = 'Exist'
	        		$($('#quote-number')).parent().addClass('highlight');
	        	}else{
	        		ExistSuccess = 'Ok'
	        		$($('#quote-number')).parent().removeClass('highlight');
	        	}
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	  });
  }
  // step 1/3 validation start-------------------------------
  if($(this).hasClass('btn-job-quote')){
	  highlight($('#quote-number'), '');
	  if($('#quote-number').val() != ''){
		  //function for chech quote number valid
		  isquoteValid();
	  }
	  if(ExistSuccess == 'Exist'){
		  success.push(false);
	  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Invalid Quote Number.</div>';
	  }else{
		  success.push(true); 
		  alert_required = oldalert;
	  }   
	  var check_fields = (success.indexOf(false) > -1);
	
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	    	 $('#form-job-quote-no').submit();
	     }
  }
  // step 1/3 validation end-------------------------------
  //step 2/3 validation start------------------------------
  if($(this).hasClass('btn-save-job-data')){
  	  highlight($('#j_ord_date'), ''); 
	  highlight($('#j_cust_ord'), '');
	  if($('#j_type').val() != 'R'){
	  	highlight($('#j_weight_reqd'), '');
	  }
	  highlight($('#j_coll_date'), '');
	  highlight($('#j_del_date'), '');
	  highlight($('#j_sail_date'), '');
	  notNumber($('#j_weight_reqd'));
	  if($('#sea_type_name').val()=='Deep Sea'){
	  	highlight($('#demtk_customer'), '');
	  }
	    var check_fields = (success.indexOf(false) > -1);
		
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     }else if($('#safe_secure').val() == 'show'){
			  	highlight($('#doc_type'), ''); 
			  	highlight($('#gb_mrn'), '');
			  	highlight($('#customer_consignor'), '');
			  	highlight($('#customer_consignee'), '');
			  	highlight($('#company_name_consignor'), '');
			  	highlight($('#company_name_consignee'), '');
			  	highlight($('#consignor_adress1'), '');
			  	highlight($('#consignor_adress2'), '');
			  	highlight($('#consignor_town'), '');
			  	highlight($('#consignor_state'), '');
			  	highlight($('#consignor_postcode'), '');
			  	highlight($('#consignor_country'), '');
			  	highlight($('#consignee_adress1'), '');
			  	highlight($('#consignee_adress2'), '');
			  	highlight($('#consignee_town'), '');
			  	highlight($('#consignee_state'), '');
			  	highlight($('#consignee_postcode'), '');
			  	highlight($('#consignee_country'), '');
			  	highlight($('#eori_consignor'), '');
			  	highlight($('#eori_consignee'), '');
			  	highlight($('#num_packages'), '');
			  	highlight($('#un_package_code'), '');
			  	highlight($('#goods_description'), '');
	  			var check_ss_fields = (success.indexOf(false) > -1);
			  	if(check_ss_fields === true){
			  		BootstrapDialog.confirm('Some Safety and Security fields are still blank! Do you want to continue?', function(result){
			    		if(result){
			    			$('#form-job-data').submit();
			    		}
			  		});
			  	}else{
			  		$('#form-job-data').submit();
			  	}
	  }else{
	  	$('#form-job-data').submit();
	  }
  }
  //step 2/3 validation end--------------------------------
  //step 3/3 validation start------------------------------
  if($(this).hasClass('btn-job-date-time-save')){
	  
	  $(".datepicker_intermediate").each(function() {
		    var idname = $(this).attr('id');
		    highlight($('#'+idname), ''); 
		});
	  var check_fields = (success.indexOf(false) > -1);
		
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	    	 $('#form-job-plan-data').submit();
	    	 $('#btn-job-save,#btn-job-back,#btn-job-discard').attr('disabled','disabled');
	    	 $('#btn-job-save').html('Accept <i class="fa fa-refresh fa-spin"></i>');
	     }
  }
  //step 3/3 validation end--------------------------------
     
});

$('.job_change_status').click(function(e){
	e.preventDefault();
	var jobNo = $(this).attr('data-id');
	var changeTo = $(this).attr('data-job-change-to');
	var message = 'Are you sure want to move <strong>'+jobNo+'</strong> to '+changeTo.charAt(0).toUpperCase() + changeTo.slice(1)+' ?';
	
	if(changeTo == 'live'){
		var mtype = BootstrapDialog.TYPE_SUCCESS;
		var mButton = 'btn-success';
	}else if(changeTo == 'archive'){
		var mtype = BootstrapDialog.TYPE_PRIMARY;
		var mButton = 'btn-primary';
	}else{
		var mtype = BootstrapDialog.TYPE_DANGER;
		var mButton = 'btn-danger';
		var message = 'Are you sure want to delete the job <strong>'+jobNo+'</strong> ?';
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
	             action: function(dialogItself){
	            	 $.ajax({
	     		        type: 'POST',
	     		        timeout:60000, //1 min
	     		        url: appHome+'/job/common_ajax',
	     		        data: {
	     		      	  'jobNo' : jobNo,
	     		      	  'action_type' : 'change_job_status',
	     		      	  'changeTo' : changeTo
	     		        },
	     		        beforeSend: function() {
	     		        	$('.bootstrap-dialog-footer-buttons > .'+mButton).html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		     		        $('.bootstrap-dialog-footer-buttons > .'+mButton).attr('disabled','disabled');
	     		        },
	     		        success: function(response){
	     		        	var parsedJson = $.parseJSON(response);
	     		        	if(parsedJson.status == 'error'){
	     		        		dialogItself.close();
	     		        		BootstrapDialog.show({
	     		        		   type: BootstrapDialog.TYPE_DANGER,
	     		                   title: 'Warning',
	     		                   message: parsedJson.msg,
	     		                   buttons: [{
	     		                     label: 'Close',
	     		                     action: function(dialogItself){
	     		                         dialogItself.close();
	     		                     }
	     		                 }]
	     		               });
	     		        	}else{
	     		        		dialogItself.close();
	     		        		localStorage.setItem('response', parsedJson.msg);
	     		        		location.reload();
	     		        		$('html, body').animate({ scrollTop: 0 }, 400);
	     		        	}
	     		        	$('.bootstrap-dialog-footer-buttons > .btn-danger').html("OK");
	     		        	$('.bootstrap-dialog-footer-buttons > .btn-danger').removeAttr('disabled');
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
if($('#tank-plan-list tr').length > 10){
	DoubleScroll(document.getElementById('doublescroll'));
}  

$('.tank_plan_txt_fld').click(function() {
	$('#tank_fld_update_modal .highlight').removeClass('highlight');
	var fldname  = $(this).data('field-name');
	var fldval 	 = $.trim($(this).text());
	var row_rum = $('.tank_plan_txt_fld').closest('tr').index($(this).closest('tr'));
	var plan_id =  $(this).closest('tr').data('tr-plan-id');
	//console.log($('#eachActivity_'+plan_id).val());
	$('#num_row').val(row_rum);
	$('#plan__id').val(plan_id);
	
	$("#model_activity").val($.trim($(this).closest('tr').find('td :eq(0)').text()));
	$("#model_tankno").val($.trim($(this).closest('tr').find('td :eq(3)').text()));	
	
	$("#plan_update_weight").hide();
	$("#tank_time_fld").hide();
	
	$(this).addClass('cell-heilight');
	
	if(fldname == "note"){
		$('#tank_fld_update_modal_label').text('Notes');
		$('#fld_name').val('note')
		$('#plan_update_note').show();
		$('#plan_update_bookref').hide();
		$('#plan_time').hide();
		$('#plan_update_note').val(fldval);
		
	} else if(fldname == "time"){
		if(fldval.length == 5){
			if(fldval.substring(2, 3) == '-'){
				fldval = fldval + '-00'; 
			}else{
				fldval = fldval + ':00'; 
			}
		}
		$('#tank_fld_update_modal_label').text('Time');
		$('#fld_name').val('time')
		$('#plan_update_note').hide();
		$('#plan_update_bookref').hide();
		$('#plan_time').show();
		$('#plan_time').val(fldval);
		
	} else {
		$('#tank_fld_update_modal_label').text('Booking Ref');
		$('#fld_name').val('bookref')
		$('#plan_update_bookref').show();
		$('#plan_update_note').hide();
		$('#plan_time').hide();
		$('#plan_update_bookref').val(fldval);
	}
});

$('.delete-tank-plan-job').click(function() {
	var removeTr =  $(this).closest('tr');
	 BootstrapDialog.show({
         type: BootstrapDialog.TYPE_DANGER,
         title: 'Confirmation',
         message: 'Are you sure want to delete ?' ,
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
	            	 if($('#tank-plan-list tr').length == 2){
	            		 $('#tank-plan-list').animate( {backgroundColor:'red'}, 200).fadeOut(600,function() {
		            		$('#tank-plan-list').remove();
		            		$('#del-response').html('<div class="alert alert-warning">Sorry, there are no Tank Plans Found. </div>');
		            	 }); 
	            	 }else{
	            		$(removeTr).animate( {backgroundColor:'red'}, 200).fadeOut(600,function() {
	            		    $(removeTr).remove();
	            	    }); 
	            	 }
	            	 
	             }
         }]
     });
});

$('.fld_update_submit').click(function() {

	var plan_id = $('#plan__id').val();
	var num_row = $('#num_row').val();
	var fld_name = $('#fld_name').val();
	var fld_name_lable = "";
	var fld_val = "";
	var fld_ctrl = "";
	var fld_weight = "";
	var fld_time = "";
	var css_classname = "";
	var title_text = "";
	var error = 0;
	//var update_fld_path = $('#update-checkbox').val();
	
	var planJsonData = $('#eachActivity_'+plan_id).val();
	var myObject = JSON.parse( planJsonData );
	
	if(fld_name == "note"){
		fld_ctrl = $('#plan_update_note');
		fld_val = $.trim($('#plan_update_note').val());
		fld_name_lable = "Notes";
		fld_val = fld_val.replace(/"/g, "'");
		myObject.pl_notes = fld_val;
		$('.tank_note').eq(num_row).text(fld_val);
		
	} else if(fld_name == "time"){
		fld_ctrl = $('#plan_time');
		fld_val = $.trim($('#plan_time').val());
		fld_name_lable = "Time";
		if(fld_val == ''){
			fld_val = "00:00";
		}
		if(fld_val.length >= 5){
			fld_val = fld_val.substring(0, 5);
		}
		myObject.pl_time = $.trim(fld_val);
		$('.tank_time').eq(num_row).text(fld_val);
	} else {
		fld_ctrl = $('#plan_update_bookref');
		fld_val = $.trim($('#plan_update_bookref').val());
		fld_name_lable = "Book Ref";
		fld_val = fld_val.replace(/"/g, "'");
		myObject.pl_booking_ref = fld_val;
		$('.tank_book_ref').eq(num_row).text(fld_val);
	}
	if(error == 0){
		//parse json start
		$('#eachActivity_'+plan_id).val(JSON.stringify(myObject));
		$('.tank_plan_txt_fld').removeClass('cell-heilight');
		//parse json end
		$('#tank_fld_update_modal').modal('toggle');
	}
	
});


/**
 * limit the control
 */
$(".multi-sel-ctrl").change(function () {
	var optioncount = $(this).find('option:selected').length;
	var optlimit = 25;
	var count = 1;
	var $this = $(this);
	
    if(optioncount > optlimit) {
    	$(this).find('option:selected').each(function(){
    		if(count > optlimit){
    			$(this).prop('selected',false);
    		}
    		count +=1;
    	})
    	BootstrapDialog.show({title: 'Customer Limt', message : 'Selection is limited to 25 items only.',
			 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
		});
    	$(".multi-sel-ctrl").multiselect('refresh');
    }
});

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

/**
 * function for calculate demtk date after ETA OR ARVD
 */
function calculateDemtkDate(dateValue){
  
	var masterData = $('#job_master_data').val();
	var days = 0;
	if($('#job_master_data').length > 0 && masterData != "" && $('.datepicker_DEMTK').length > 0){
		var jsonData = jQuery.parseJSON( masterData );
		if(jsonData.sea_type_id == 2){
			days = ($.isNumeric(jsonData.j_free_days)) ? parseInt(jsonData.j_free_days) : 0;
		}
		var dateArr = dateValue.split("/");
		var dateformatArr = btl_default_date_format.split("/");
		dateValue = dateArr[dateformatArr.indexOf("yy")]+'-'+dateArr[dateformatArr.indexOf("mm")]+'-'+dateArr[dateformatArr.indexOf("dd")];
	    var date = new Date(dateValue);

	    if(!isNaN(date.getTime())){
	        date.setDate(date.getDate() + days);
	        var finalDate = date.toInputFormat();
	        var finalDateArr = finalDate.split("-");
	        var resultArr = new Array();
            resultArr[dateformatArr.indexOf("yy")] = finalDateArr[0];
            resultArr[dateformatArr.indexOf("mm")] = finalDateArr[1];
            resultArr[dateformatArr.indexOf("dd")] = finalDateArr[2];
	        finalDate = resultArr[0]+'/'+resultArr[1]+'/'+resultArr[2];
	        $('.datepicker_DEMTK').val(finalDate);
	        var hiddenFirstTdChild = $('.datepicker_DEMTK').closest('tr').find(':first-child input[name="eachActivity[]"]'); 
	        var planJsonData = hiddenFirstTdChild.val();
	     	var myObject = JSON.parse( planJsonData );
	     	myObject.pl_date = finalDate;
	     	hiddenFirstTdChild.val(JSON.stringify(myObject));
	    }
   }
}
	
$(".datepicker_ETA,.datepicker_ARVD,.datepicker_demurrage").change(function () {
	//var dateValue = $(this).val();
	// getting first ARVD/ETA date from plan
	if($('.datepicker_demurrage').length > 0){
		var dateValue = $('.datepicker_demurrage').val();
	}else if($('.datepicker_ARVD').length > 0){
		var dateValue = $('.datepicker_ARVD').val();
	}else if($('.datepicker_ETA').length > 0){
		var dateValue = $('.datepicker_ETA').val();
	}else{
		var dateValue = "";
	}
	if(dateValue != ""){
		calculateDemtkDate(dateValue);
	}
});

$(".datepicker_TIP,.datepicker_CTIP,.datepicker_TIPRE").change(function () {
	if($(this).val() != ""){
		$('.datepicker_AVLB').val($(this).val());

		var hiddenFirstTdChild = $('.datepicker_AVLB').closest('tr').find(':first-child input[name="eachActivity[]"]'); 
	    var planJsonData = hiddenFirstTdChild.val();
	    var myObject = JSON.parse( planJsonData );
	    myObject.pl_date = $(this).val();
	    hiddenFirstTdChild.val(JSON.stringify(myObject));
	}
});

Date.prototype.toInputFormat = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
 };

 if($('#job_master_data').length > 0){
	if($('.datepicker_demurrage').length > 0){
		var dateValue = $('.datepicker_demurrage').val();
	}else if($('.datepicker_ARVD').length > 0){
		var dateValue = $('.datepicker_ARVD').val();
	}else if($('.datepicker_ETA').length > 0){
		var dateValue = $('.datepicker_ETA').val();
	}else{
		var dateValue = "";
	}
	if(dateValue != ""){
		calculateDemtkDate(dateValue);
	}
 }
	
});//end of document ready
$('#tank_fld_update_modal').on('hidden.bs.modal', function(){
	$('.cell-heilight').removeClass('cell-heilight');
});

$(document).on('change', '.datepicker_intermediate', function(e) {
	var plan_id =  $(this).closest('tr').data('tr-plan-id');
	var planJsonData = $('#eachActivity_'+plan_id).val();
	var myObject = JSON.parse( planJsonData );
	myObject.pl_date = $(this).val();
	$('#eachActivity_'+plan_id).val(JSON.stringify(myObject));
});

//for manage delivery poit and loading point filter
$('#delivery_filter,#collection_filter').change(function(e){
	var city = $(this).val();
	var id   = $(this).attr('id');
		$.ajax({
	        type: 'POST',
	        url: appHome+'/job/common_ajax',
	        data: {
	          'city'  : city,
	          'id'	  : id,
	          'action_type' : 'get_loading_point'
	        },beforeSend: function() {
	        	        var opt = '<option value="">All</option>';
		     		    $('#job_filter').attr('disabled','disabled');
		     		    if(id == 'collection_filter') {
		     		    	   $('#collection_code_filter').html(opt);
		     		    	   $('#collection_code_filter').attr('disabled','disabled');
		        		}else if(id == 'delivery_filter'){
		        			 $('#delivery_code_filter').html(opt);
		        			 $('#delivery_code_filter').attr('disabled','disabled');
		        		}
		        		$('.chosen').chosen().trigger("chosen:updated");
		     		    
		    },
	        success: function(response){
	      	var obj = $.parseJSON(response);
	        var opt = '<option value="">All</option>';
	        		$.each(obj,function(index, data){ //console.log(index, data);
	        		opt += '<option value="'+data.val+'">'+data.txt+'</option>';
	        		});
	        		if(id == 'collection_filter') {
	        			$('#collection_code_filter').html(opt);
	        			$('#collection_code_filter').removeAttr('disabled','disabled');
	        		}else if(id == 'delivery_filter'){
	        			$('#delivery_code_filter').html(opt);
	        			$('#delivery_code_filter').removeAttr('disabled','disabled');
	        		}
	        		$('#job_filter').removeAttr('disabled','disabled');
	        		$('.chosen').chosen().trigger("chosen:updated");
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	    })
});

$(document).on('click', '#reroute-submit', function(e) {

	        var j_num = $('#j_num_val').val();
	        var new_quote_no = $('#new_quote_no').val();
			$.ajax({  
				type: "POST", 
				cache: false, 
				url: appHome+'/re_route/common_ajax',
				dataType: "text",
				data: ({
					'action_type':'re_route_job',
					'new_quote_no' : new_quote_no,
					'jobno' : j_num
				}),  
				success: function(result)
					{
				    if(result == 'false') {
						var msg = '<div class="alert alert-danger alert-dismissable">'+
							'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'+
							'<i class="fa fa-exclamation-triangle"></i>'+ 
							'<strong>Uh oh!</strong>Invalid Quote Number</div>';
						$('#response_reroute').empty().prepend(msg).fadeIn();
			        }else if(result == 'true'){
                        var msg = '<div class="alert alert-success alert-dismissable">'+
							'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'+
							'<i class="fa fa-thumbs-o-up"></i>'+ 
							'<strong>Success!</strong>Reroute Successfully</div>';
						$('#response_reroute').empty().prepend(msg).fadeIn();
				        $('#new_quote_no').val('');
			        }
			        else if(result == 'cust'){
                        var msg = '<div class="alert alert-danger alert-dismissable">'+
							'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'+
							'<i class="fa fa-exclamation-triangle"></i>'+ 
							'<strong>Uh oh!</strong>Re-route is not possible, Customer found to be different</div>';
						$('#response_reroute').empty().prepend(msg).fadeIn();
				        $('#new_quote_no').val('');
			        }
			         else if(result == 'div'){
                        var msg = '<div class="alert alert-danger alert-dismissable">'+
							'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'+
							'<i class="fa fa-exclamation-triangle"></i>'+ 
							'<strong>Uh oh!</strong>Re-route is not possible, Product division found to be different</div>';
						$('#response_reroute').empty().prepend(msg).fadeIn();
				        $('#new_quote_no').val('');
			        }
			        else if(result == 'inv'){
                        var msg = '<div class="alert alert-danger alert-dismissable">'+
							'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'+
							'<i class="fa fa-exclamation-triangle"></i>'+ 
							'<strong>Uh oh!</strong>Cannot Re-route,  Job is Already Invoiced</div>';
						$('#response_reroute').empty().prepend(msg).fadeIn();
				        $('#new_quote_no').val('');
			        }else if(result == 'linked-su'){
                        var msg = '<div class="alert alert-danger alert-dismissable">'+
							'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'+
							'<i class="fa fa-exclamation-triangle"></i>'+ 
							'<strong>Uh oh!</strong>Cannot Re-route,  Job is Already Linked to Summary Invoice</div>';
						$('#response_reroute').empty().prepend(msg).fadeIn();
				        $('#new_quote_no').val('');
			        }
					}  
			});
			return false;
		});

$(document).on('change', '#gb_declarant', function(e) {
	var dclr_val =  $(this).val();
	var readonly =  $("#readonly").val();
    if(dclr_val == 'Customer' && readonly == 'readonly'){
    	$("input[name='gb_mrn']").removeAttr("readonly"); 
    	$("#gb_eu").val("GB_EU"); 
    }else{
    	$("input[name='gb_mrn']").attr("readonly", "readonly");
    	$("#gb_eu").val(""); 
    }
});

if($("#company_name_consignee").length > 0){
	$("#company_name_consignee").autocomplete({
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
}

  
// $(document).on('blur', '#company_name_consignee', function(e) {
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
             $("#company_name_consignee").val(response.consig_name);
             $("#consignee_adress1").val(response.consig_addr1);
             $("#consignee_adress2").val(response.consig_addr2);
             $("#consignee_town").val(response.consig_town);
             $("#consignee_state").val(response.consig_state);
             $("#consignee_postcode").val(response.consig_postcode);
             $("#eori_consignee").val(response.consig_eori);
             $("#consignee_country").val(response.consig_country);
		},
        error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
            }
    });

}
