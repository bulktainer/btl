$(document).ready(function(){
	//DM-Jan-17-2016
	getDamagedIcon();
	$(function () {
		  $('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
	});

	if(localStorage.getItem('response') != null){
		$('.hidden_content').html(localStorage.getItem('response'));
  		var tip_exist = $('#tip_exist').val();
		var activity_job_number = $('#tip_exist').data('jobnumber');
		var order = $('#tip_exist').data('order');
      	displayJobTemplateActivities(tip_exist, activity_job_number, order);


	}
	
	
	function fillHoverByAjax(thisVal, hoverType){
		
		var planId = thisVal.attr('data-planid');
		var activity = thisVal.attr('data-activity');
		var pljobno = thisVal.attr('data-jobno');
		var date = thisVal.closest('tr').children('.tank_date').text();
		var time = thisVal.closest('tr').children('.tank_time').attr('data-full_time');

		$.ajax({
			type: 'POST',
			//async : false,
			url: appHome+'/job/common_ajax',
			beforeSend: function() {
						thisVal.attr('data-isajaxcall','1');
		          	},
		    data: {
					'plan_id' : planId,
					'pljobno'  : pljobno,
					'action_type' : 'check_hover_popup',
					'hoverType' : hoverType,
					'activity' : activity,
					'plan_date' : date,
					'plan_time' : time
				  },
			success: function(responseString){
				//$(".tooltip").remove();
				response = JSON.parse(responseString);
				var existingjson = JSON.parse(thisVal.attr('data-popupdetails'));
				if(existingjson.hasOwnProperty('show_loader')){
					existingjson.show_loader = false;
		    	}
				if(!$.isEmptyObject(response)){
					$.each(response, function(item, obj) {
						var newArr = ({"value" : obj.value, "label" : obj.label});
						existingjson[item] = newArr;
					});
				}
				thisVal.attr('data-popupdetails',JSON.stringify(existingjson));
				hoverPopup(thisVal);
			}
		});
	}
	/**
	 * function for hover popup
	 */
	function hoverPopup(currentElement){
		$('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
		$(".tooltip").remove();
		//$('[data-toggle="tooltip"]').tooltip("destroy");
		var jsonData = JSON.parse(currentElement.attr('data-popupdetails')); 
	
    	var checkGreen = "<td class='center-cell' style='border-bottom:1px solid white;background-color:#ddd;'>" +
    						"<i class='fa fa-check-circle-o' aria-hidden='true' style='font-size:12px;color:green;padding:0px;' aria-hidden='true'></i>" +
    					  "</td>";
    	var checkRed = "<td class='center-cell' style='border-bottom:1px solid white;background-color:#ddd;'>" +
    						"<i class='fa fa-times-circle-o' aria-hidden='true' style='font-size:12px;color:red;padding:0px;' aria-hidden='true'></i>" +
    					  "</td>";
    	var imageUrl = '<img src="'+appHome+'/../images/ajax.gif"/>';
 
    	var tankplanTooltipHtml = "<table style='font-size:10px;border-collapse: unset;background-color:#ddd;border-radius:3px;margin:1px;align:center;'>";
	    	$.each(jsonData, function(i, obj) {
	    		if(i != 'show_loader'){
	    			tankplanTooltipHtml += "<tr><td style='border-bottom:1px solid #ddd;background-color:white;'>"+obj.label+"</td>";
	    			if(obj.hasOwnProperty('viewType')){
	    				if(obj.value == 1 || obj.value == '1'){
	    					tankplanTooltipHtml += checkGreen;
	    				}else{
	    					tankplanTooltipHtml += checkRed;
	    				}
	    			}else{
	    				tankplanTooltipHtml += "<td class='' style='text-align:left;border-bottom:1px solid white;background-color:#ddd;'>"+obj.value+"</td></tr>";
	    			}
    			}
	    	});
	    	if(jsonData.hasOwnProperty('show_loader') && jsonData.show_loader == true){
	    		tankplanTooltipHtml += "<tr><td  colspan='2' class='center-cell' style='background-color:white;'>"+imageUrl+"</td></tr>";
	    	}
    	tankplanTooltipHtml += "</table>";
    	currentElement.attr('data-original-title',tankplanTooltipHtml);
    	if($('#hover_last').val() == currentElement.attr('data-plantype')){
    		currentElement.tooltip('show');
    	}
	}
	$(document).on('mouseout', '.tankno-tooltip,.jobno-tooltip,.tooltip,.product-tooltip', function(){
	//$(".tankno-tooltip,.jobno-tooltip,.tooltip,.product-tooltip").mouseout(function(){
		$(".tooltip").tooltip('hide');
	});
	
	/*$(document).on('click', '.tankno-tooltip', function(e){
		if($('#page_name').val() == "tank-plan-index"){
			e.preventDefault();

			var h = $('.overlay-complete-loader').height();

			if(h == 0) { h = 100; }
			$('.btl_overlay').height(h); 
			$('.btl_relative').show(); 
			var tank_no = $(this).text();
			tank_no = tank_no.split('(')[0].trim();
			setTimeout(function(){ 
				resetFilters();
				$('#tank-filer').val(tank_no);
				//$('#period-filter').val(1);
				$('#page').val(0);
				$('html, body').animate({ scrollTop: 0 }, 400);
				getTankPlans('#search-form');
			}, 100);

			
		}
	});*/
	
	
	$(document).scroll(function(){
		$(".tooltip").tooltip('hide');
	});
	
	// DM-Jan-17-2016	
	$(document).on('hover', '.tankno-tooltip', function(){
	//$(".tankno-tooltip").hover(function(){
		var text = $(this).text().trim();
		if(text != '' && text != 'TBC'){
			$('#hover_last').val($(this).attr('data-plantype'));
			hoverPopup($(this));
			if($(this).attr('data-isAjaxCall') == 0 && $.inArray($(this).attr('data-activity'), ['LOAD','AVLB','TIP','TIPRE','CTIP']) !== -1){
				fillHoverByAjax($(this),'tank_hover');
			}
		}else{
			$(this).attr('title','TBC');
			//$( this ).tooltip('show');
		}
	});
	
	$(document).on('hover', '.jobno-tooltip', function(){
	//$(".jobno-tooltip").hover(function(){
		$('#hover_last').val($(this).attr('data-plantype'));
		hoverPopup($(this));
		
    	if($(this).attr('data-isAjaxCall') == 0 && $(this).attr('data-isSendAjax') == 1){
			fillHoverByAjax($(this),'job_hover');
		}
	});
	
	$(document).on('hover', '.product-tooltip', function(){
	//$(".product-tooltip").hover(function(){
		$('#hover_last').val($(this).attr('data-plantype'));
		hoverPopup($(this));
	});

	$(document).on('hover', '.supplier-tooltip', function(){
		$('#hover_last').val($(this).attr('data-plantype'));
		hoverPopup($(this));
		
    	if($(this).attr('data-isAjaxCall') == 0){
			fillHoverByAjax($(this),'supplier_hover');
		}
	});
	
	$(document).on('hover', '.supplier-tooltip-a', function(){
		$this = $(this).parent('div');
		
		$('#hover_last').val($this.attr('data-plantype'));
		hoverPopup($this);
		
    	if($this.attr('data-isAjaxCall') == 0){
			fillHoverByAjax($this,'supplier_hover');
		}
	});
	
    /*damaged and semi-dedicated changes*/
	$(document).on('hover', '.info-hover', function(){
		$('#hover_last').val($(this).attr('data-planid'));
		hoverIconPopup($(this));   
	});
	$(document).on('hover', '.info-hover-img', function(){
		var datanotes = $(this).attr('data-notes');
        if(datanotes != '') {
        	$(this).css('cursor', 'pointer');
			$('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
			data = "<table style='border-collapse: unset;background-color:#ddd;border-radius:3px;margin:1px;align:center;'><tr>";
			data +="<td class='center-cell' style='background-color:white;'>"+datanotes+"</td>"
			data  += "</tr></table>"
			$(this).attr('data-original-title',data);
			$(this).tooltip('show');
        }
	});
	$(document).on('mouseout', '.red-tooltip', function(){
	//$(".red-tooltip").mouseout(function(){
		$( this ).tooltip('hide');
		$('#hover_last').val('');
	});
	
	/* removed in ajax tank plan listing
	 * if($('#sort').val() != '' && $('#page_name').val() == 'tank-plan-index'){
		alert();
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
	        'scrollTop' : $("#plantable").position().top
	    });
	}*/
	
	$(document).on('click', '.sortClass', function(){
		//$('.sortClass').click(function(e) {
	
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
		getTankPlans('#search-form');
		//$('#search-form').submit();
	}
	// hidden activities
});
	
function changeIconShip(jobNo,fld_weight,resp_msg,from){
	$("#plantable tr").each(function(){
		if($(this).attr('tr-data-activity') == 'SHIP' && $(this).attr('tr-data-jobno') ==  jobNo){
			var plNewID = $(this).attr('tr-data-planid');
			var data_vgm_option = $(this).find('.fld_tank_weight_time a').attr('data-vgm-option');
			var data_vgm_mail_status = $(this).find('.fld_tank_weight_time a').attr('data-vgm-mail-status');
			var data_load_tip_weight = $(this).find('.fld_tank_weight_time a').attr('data-load-tip-weight');

			if(fld_weight != ""){//load_tip_weight based on latest update
				data_load_tip_weight = 1;
				//data_load_tip_weight = (data_load_tip_weight > 2) ? 2 : data_load_tip_weight; 
				$(this).find('.fld_tank_weight_time a').attr('data-load-tip-weight',data_load_tip_weight)
				if(data_vgm_option == 1 && resp_msg.search('Weight : Unable ') < 0 && resp_msg.search('Weight :') > 0){
					data_vgm_mail_status = 1;
					$(this).find('.fld_tank_weight_time a').attr('data-vgm-mail-status',data_vgm_mail_status)	
				}
			}else{
				if(from == 1){
					data_load_tip_weight = 0;
					//data_load_tip_weight = (data_load_tip_weight < 0) ? 0 : data_load_tip_weight; 
					$(this).find('.fld_tank_weight_time a').attr('data-load-tip-weight',data_load_tip_weight)
				}			
			}
			if(data_vgm_mail_status == 1){
    			$css_classname =  'green-icon';
    			$faIcon = 'fa-check';
    			$title_text = "VGM sent to Shipping Line.";
    		} else if(data_vgm_option == 3){
    			$css_classname =  'green-icon';
    			$faIcon = 'fa-check';
    			$title_text = "VGM docs not required.";
    		} else if(data_load_tip_weight > 0 && data_vgm_option == 1){
    			$css_classname =  'orange-icon';
    			$faIcon = 'fa-exclamation';
    			$title_text = "VGM docs generated but mail has not been sent to Customer.";
    		} else if(data_load_tip_weight > 0 && data_vgm_option == 2){
    			$css_classname =  'orange-icon';
    			$faIcon = 'fa-exclamation';
    			$title_text = "Loaded weight entered - VGM not yet sent.";
    		} else if(data_vgm_option == 1 || data_vgm_option == 2){
    			$css_classname =  'red-icon';
    			$faIcon = 'fa-times';
    			$title_text = "";
    		}else if(data_vgm_option == ''){
    			$css_classname =  'red-icon';
    			$faIcon = 'fa-times';
    			$title_text = "No VGM route available.";
    		} else {
    			$css_classname =  'red-icon';
    			$faIcon = 'fa-times';
    			$title_text = "";
    		} 
			var shipicon = '<a href="#"  class="ship-prev-mail" data-vgm-option = "'+data_vgm_option+'" data-vgm-mail-status = "'+data_vgm_mail_status+'" data-load-tip-weight = "'+data_load_tip_weight+'"  data-plan_id="'+plNewID+'" data-toggle="modal" title="'+$title_text+'" data-target="#ship_prevmail"><span class="tank_weight_time '+$css_classname+'"><i class="fa '+$faIcon+'" aria-hidden="true"></i></span></a>';
			$(this).find('.fld_tank_weight_time').html(shipicon);
		}				       
    });	
}

$('.ship-prev-mail').live('click', function (e) {
	$('#vgm-send-data').html('');
	var plan_id = $(this).attr('data-plan_id');
	var vgm_option = $(this).attr('data-vgm-option');
	var mail_status = $(this).attr('data-vgm-mail-status');
	
	var job_number = $(this).closest('tr').attr('tr-data-jobno').trim();
	var tankNo = $(this).closest('tr').attr('tr-data-tankno').trim();
	var currActivity =  $(this).closest('tr').attr('tr-data-activity').trim();
	
	$("#ship_model_jobno").val(job_number);
	$("#ship_model_tankno").val(tankNo);
	if(vgm_option == 1 || vgm_option == 2){
		
		$.ajax({
			type: 'POST',
			url: $('#ship-path').val(),
			beforeSend: function() {
				$('#vgm-send-data').html('<div style="text-align:center;"><img src="'+appHome+'/../images/ajax-loader-large.gif"/></div>');
			},
			data: {
				'plan_id' :plan_id,
				'job_number' : job_number,
				'vgm_option' : vgm_option,
				'mail_status' : mail_status
			},
			success: function(response){
				$('#vgm-send-data').html(response);
			}
		});
	}
});

$('#change_mail_status').live('click', function (e) {
	var update_job_fld_path = $('#update-checkbox').val();
	var status = $(this).is(':checked') ? 1 : 0;
	var plan_id = $(this).attr('data-plan-id');
	var job_id = $(this).attr('data-job-id');
	fld_name_lable = "Mail Status";
	var $this = $(this);
	$.ajax({
		type: 'POST',
		url: update_job_fld_path,
		data: {
			'status' : status,
			'plan_id' : plan_id,
			'field_name' : 'change_vgm_mail_status'
		},
		async : false,
		success: function(response){
			if(response == "success") {
				$(".ship-prev-mail[data-plan_id="+plan_id+"]").attr('data-vgm-mail-status',status);			
				changeIconShip(job_id,'',false,0);
				
			}else{
				BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update '+ fld_name_lable +'. Try again later.'});
				if(manual_add_entry == 1) {
					$this.prop('checked', false);
				} else {
					$this.prop('checked', true);
				}
			}			
		},
		error: function(response){
			BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update '+ fld_name_lable +'. Try again later.'});
			if(manual_add_entry == 1) {
				$this.prop('checked', false);
			} else {
				$this.prop('checked', true);
			}
		}
	});
});

// Update update_checkbox value in tank table
//$('.tank_plan_checkbx').click(function(e) {
$(document).on('change', '.tank_plan_checkbx, .booked-status', function(){
	var update_checkbox = $('#update-checkbox').val(),
			plan_id = $(this).data('planid'),
			field_name = $(this).data('field-name'),
			field_value = 0,
			$this = $(this),
			preval = 0,
			activity = $(this).data('activity');

	if($(this).hasClass('booked-status')){
		field_value = $(this).val();
		preval = $(this).data('preval');
	} else {
		field_value = ($(this).is(':checked')) ? 1 : 0;
	}
	
	var ediCheck = $(this).parents('tr').find('.tank_bookref').data('edi_status');
	var wardingMessage = "";
	if($.inArray(ediCheck, [0, 3, 30]) == -1 && (field_value == 0 || $this.prop('checked') == false)){ //Refer Plan mode for its value 
		wardingMessage = "This will Cancel the Booking and send Cancellation XML.\n\n";  		
	}

	BootstrapDialog.show({
	  	title : 'Confirmation',            
	  	message: wardingMessage + 'Are you sure you want to carry out this operation ?',
	  	spinicon : 'glyphicon glyphicon-refresh glyphicon-spin',
            buttons: [{
                label: 'Cancel',
                action: function(dialogItself){
					if($this.hasClass('booked-status')){
						$this.val(preval).trigger('chosen:updated');
					} else {
						if(field_value == 1) {
							$this.prop('checked', false);
						} else {
							$this.prop('checked', true);
						}
					}
                    dialogItself.close();
                }
            }, {
				label: 'OK',
            	cssClass: 'btn-primary',
				autospin: true,
                action: function(maindialog){

					$.ajax({
						type: 'POST',
						url: update_checkbox,
						data: {
							'field_name' : field_name,
							'field_value' : field_value,
							'plan_id' : plan_id
						},
						success: function(response){
							if(field_name == 'booked'){
								if(activity == 'CLEAN' && field_value == 0){
									$this.parent().parent().addClass("clean-activity");						
								}
								else{
									$this.parent().parent().removeClass('clean-activity');
								}

								if($this.hasClass('booked-status')){
									$this.data('preval', field_value);
									if(field_value == 1 || field_value == 3){
										$this.parents('td').prev('td.haulage-supplier').find('a').removeClass('hide').css('color','green');
									} else if(field_value == 2){
										$this.parents('td').prev('td.haulage-supplier').find('a').removeClass('hide').css('color','orange');
									} else {
										$showsupplier = $this.parents('td').prev('td.haulage-supplier').find('div').data('showsupplier');
										if($showsupplier == 1){
											$this.parents('td').prev('td.haulage-supplier').find('a').removeClass('hide').css('color','red');
										} else {
											$this.parents('td').prev('td.haulage-supplier').find('a').removeClass('hide').addClass('hide');
										}
									}
								}
								
								if($.trim(response) != "success" && $.trim(response) != "failed"){
									BsMsgType = response.search('ailed') < 0 ? BootstrapDialog.TYPE_SUCCESS : BootstrapDialog.TYPE_WARNING;  //Checking failed and Failed in message
									BootstrapDialog.show({
						                type: BsMsgType,
						                title: 'Booking',
						                message : response,
						                buttons: [{
						                    label: ' OK ',
										    action: function(dialog) {
										        dialog.close();
												if($('#page_name').val() == "job-edit"){
												  window.location.reload(true);
												}
											}
						                }]
						            });    
								}
								
							}
							maindialog.close();
						},
						error: function(response){
							if($this.hasClass('booked-status')){
								$this.val(preval).trigger('chosen:updated');
							} else {	
								if(field_value == 1) {
									$this.prop('checked', false);
								} else {
									$this.prop('checked', true);
								}
							}
						}
					});
				}
			}]
	}); 
});

//Page size change
$('.custom-page-pagesize').change(function(e){
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('#search-form').submit();
});

//Delete tank plan
$(document).on('click', '.delete-tank-plan', function(){ 
//$('.delete-tank-plan').click(function(e) {
	//e.preventDefault();
	var delete_url = $(this).data('href'),
		plan_id = $(this).data('plan-id'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
	
	var isBooked = $this.parents('tr').find('[data-field-name="booked"]').prop('checked');
	if(isBooked){
		BootstrapDialog.show({title: 'Delete', message : 'This is a Booked activity. Please Cancel booking before deleting.'});
	} else {
		BootstrapDialog.confirm('Are you sure you want to delete this Tank Plan ?', function(result){
			if(result) {
				$.ajax({
					type: 'POST',
					url: delete_url,
					data: {'plan_id' : plan_id},
					success: function(response){
						if($('#page_name').val() != "tank-plan-index"){
							if($('#page_name').val() == "tank-plan-form" && (return_url == "" || return_url.substr(-4) == "edit")){
								return_url = $('#returnpath-job').val();
							}
							window.location.href = return_url;
							//window.location.reload(true);
							localStorage.setItem('response', response);
				          }else{
				          	 
				        	  $("#response").html(response);
				        	  getTankPlans('#search-form');
				          }
					},
					error: function(response){
						BootstrapDialog.show({title: 'Tank Plans', message : 'Unable to delete this Tank Plan. Please try later.',
							 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
						});
					}
				});
			} 
		});
	}
});

$(document).on('click', '.edit-tank-modal', function(){
	$('#tank-plan-edit-modal-detail').html("");
	$.ajax({
		type: 'POST',
		url: appHome+'/tank/common_ajax',
		beforeSend: function() {
            // setting a timeout
        	$('#tank-plan-edit-modal-detail').html("<div class='text-center'><i class='fa fa-spinner fa-spin' style='font-size:100px'></i></div>");
        	},
	    data: {
				'plan_id' : $(this).data('id'),
				'action_type' : 'edit_plan_by_ajax',
			  },
		success: function(response){
			$('#tank-plan-edit-modal-detail').html(response);
			$('.datepicker').datepicker({
			    dateFormat: "dd/mm/yy",
			    changeMonth: true,
			    changeYear: true,
			    inline: true,
			    startDate: 0
			});

			$('#tank-plan-form .chosen').chosen({allow_single_deselect: true}).trigger("chosen:updated");
			$('.chosen-container').css({width:'100%'});
			if($("#activity").val() == "ETYTR"){
				$(".tank-form-div").hide();
			}
		}
	});
	
});
$(document).on('click', '.show-date-pic', function(e){
	$('#plan_date').focus();
});

$(document).on('change', '#activity', function(){
	if($("#activity").val() == "ETYTR"){
		$(".tank-form-div").hide();
	} else {
		$(".tank-form-div").show();
	}
});

if($('#page_name').val() == "tank-plan-form"){
	if($("#activity").val() == "ETYTR"){
		$(".tank-form-div").hide();
	}
}

if($('#page_name').val() == 'job-edit'){
	$('.booked-status').chosen({allow_single_deselect: false}).trigger("chosen:updated");
	$('.booked-status').next('.chosen-container-single').css({"width":"100%"});
}

var rpoutFunction = function(tpUrl){ 

	var msgdiv = '<div class="col-md-12">Would you like to include one of the following Activities after the <strong>'+$("#activity").val()+'</strong> activity?</div>'+
					'<div class="col-md-3"><br>'+
						'<select class="form-control"';
		if(
			$('#activity').val() == "REPIN" || 
			$('#activity').val() == "CLNAI" ||
			$('#activity').val() == "TESTI" 
			){
			msgdiv += ' multiple';
		}
		msgdiv += ' >';
		if($("#activity").val() == "REPIN"){
			msgdiv+= '<option value="REPAI">REPAI</option>'+
							'<option value="PREST">PREST</option>'+
							'<option value="GASKR">GASKR</option>';
		}
		else if($("#activity").val() == "CLNAI"){
			msgdiv+= '<option value="CLNAD">CLNAD</option>'+
							'<option value="PREST">PREST</option>'+
							'<option value="GASKR">GASKR</option>';
		}
		else if($("#activity").val() == "TESTI"){
			msgdiv+= '<option value="TEST">TEST</option>'+
							'<option value="PREST">PREST</option>'+
							'<option value="GASKR">GASKR</option>';
		}
		else{
			msgdiv+= '<option value="ETYC">ETYC</option>'+
							'<option value="ETYD">ETYD</option>'+
							'<option value="AVLB">AVLB</option>';
		}
		msgdiv+= '</select>'+
					'</div><br><br>';
  	BootstrapDialog.show({
  			title: 'Confirmation',
  			type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: false, // <-- Default value is false
            draggable: false, // <-- Default value is false
            message: msgdiv,
            buttons: [{
                label: 'Yes',
                icon: 'glyphicon glyphicon-ok-sign',       
		        cssClass: 'btn-warning',
                action: function(dialogRef) {
                	var activity = dialogRef.getModalBody().find('select').val();
					if(typeof activity == "string"){
						activity = [activity];
					}
                	$('#selected_rpout').val(JSON.stringify(activity));
                	addUpdateTankPlan(tpUrl);
                    dialogRef.close();
                }
            },
            {
                label: 'No',
                icon: 'glyphicon glyphicon-remove-circle', 
                action: function(dialogRef) {
                	addUpdateTankPlan(tpUrl);
                    dialogRef.close();
                }
            }]
    });
}

/**
* save / update tank plan
*/
$(document).on('click', '.save-tank-plan, .update-tank-plan', function(e){
  
  e.preventDefault();
  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      tank_plan_id = $('input[name="plan_id_edit"]').val(),
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

  highlight($(form).find('#job_no'), '');
  highlight($(form).find('#activity'), '');
  highlight($(form).find('#tank_no'), '');
  highlight($(form).find('#plan_date'), '');
//  highlight($(form).find('#plan_time'), '');
  highlight($(form).find('#from_town'), '');
  highlight($(form).find('#to_town'), '');
  if($.inArray($('#activity').val(), ['ETA','ETAS','ETAR','ARVD']) !== -1){
	  // highlight($(form).find('#tank_status'), '');
  }
//  highlight($(form).find('#supplier'), '');

  var check_fields = (success.indexOf(false) > -1); 
  /**
  * save tank plan
  */
  if($(this).hasClass('save-tank-plan') || $(this).hasClass('update-tank-plan')){
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {
    	var button = $(this);
    	button.find('span').removeClass().addClass("fa fa-refresh fa-spin");
    	button.attr('disabled','disabled');

    	if($(this).hasClass('save-tank-plan')){
    		var tpurl = appHome+'/tank/add';
    	}else if($(this).hasClass('update-tank-plan')){
    		var tpurl = appHome+'/tank/'+tank_plan_id+'/update';
    	}
    	if( ($('#activity').val() != $('#current_activity').val()) && 
				(
					$('#activity').val() == 'RPOUT' ||
					$('#activity').val() == 'CLNAO' ||
					$('#activity').val() == "REPIN" ||
					$('#activity').val() == "CLNAI" ||
					$('#activity').val() == "TESTI" ||
					$('#activity').val() == "TESTO"
				)
			){
		  	rpoutFunction(tpurl);
		    return false;
		}else{
			addUpdateTankPlan(tpurl);
		}
    }
    return false;
  }
});

function addUpdateTankPlan(url){
	$.ajax({
        type: 'POST',
        url: url,
        data: $("#tank-plan-form").serialize().replace(/%5B%5D/g, '[]'),
        success: function(response){
          if($('#page_name').val() != "tank-plan-index"){
        	  window.location.href = $('#returnpath').val();
        	  localStorage.setItem('response', response);
          }else{
        	  $("#response").html(response);
        	  $('#edit_tank_plan_modal').modal('toggle');
        	  getTankPlans('#search-form');
          }
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          button.find('span').removeClass().addClass("glyphicon glyphicon-ok-sign");
      	  button.removeAttr('disabled');
        }
      });
}

$('#job_no').change(function(e) {

	var job_no = $(this).val(),
		$this = $(this),
		$tankno = $("#tank_no");

	if($tankno.val() == "" && job_no != ""){
		$.ajax({
			type: 'POST',
			url: '../tank/tankno-search',
			data: {
				'job_no' : job_no
			},
			success: function(response){
				$("#tank_no").val(response);
			},
			error: function(response){}
		});
	}
	
});

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
    	BootstrapDialog.show({title: 'Tank Plans', message : 'Selection is limited to 25 items only.',
			 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
		});
    	$(".multi-sel-ctrl").multiselect('refresh');
    }
});

$('.reset').click(function(){
	$('.filter-input-fld').val('');
	$('.multi-sel-ctrl').val('');
	$('#period-filter').val('1');
	//$(".multi-sel-ctrl").multiselect('refresh');
	//location.reload();
});

$(document).on('click', '.tank_plan_txt_fld', function(){
//$('.tank_plan_txt_fld').click(function() {
	$(".tank-weight-field").show();
	var plan_id = $(this).data('plan_id');
	var fldname  = $(this).data('field-name');
	var fldval 	 = $.trim($(this).text());
	var row_rum = $('.tank_plan_txt_fld').closest('tr').index($(this).closest('tr'));
	
	$('#num_row').val(row_rum);
	$('#plan__id').val(plan_id);
	
	var jobNumer = $(this).closest('tr').attr('tr-data-jobno').trim();
	var tankNo = $(this).closest('tr').attr('tr-data-tankno').trim();
	var currActivity =  $(this).closest('tr').attr('tr-data-activity').trim();
	
	$("#model_jobno").val(jobNumer);
	$("#model_tankno").val(tankNo);
	$("#curr_activity").val(currActivity);
	
	$('#tank_seals_div').html('');
	$('#loaded_weight_info').hide();
	$('#plan_update_weight').removeAttr('readonly');
	$("#plan_update_weight").hide();
	$("#tank_time_fld").hide();
	$("#tank_bookref_ajax").hide();
	$("#tank_bookref_fld").hide();
	
	$(this).addClass('cell-heilight');
	if(fldname == "note"){ 
		$('#tank_fld_update_modal_label').text('Notes');
		$('#fld_name').val('note')
		$('#plan_update_note').show();
		$('#plan_update_bookref').hide();
		$('#plan_time').hide();
		$('.datapicker_update_div').hide();
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
		$('.datapicker_update_div').hide();
		$('#plan_time').show();
		$('#plan_time').val(fldval);
		
	} else if(fldname == 'plandate'){
		$('#tank_fld_update_modal_label').text('Date');
		$('#fld_name').val('plandate');
		$('#plan_update_note').hide();
		$('#plan_update_bookref').hide();
		$('#plan_time').hide();
		$('.datapicker_update_div').show();
		$('#date_tankplan_update').val(fldval);
	}else {
		var edi_status = $(this).data('edi_status');
		$("#edi_status").val("");
		
		if($.inArray(edi_status, [0,3,30]) == -1){ // IF NOT -> 0 = NoAction/3 = Cancel/ 30 = CancelSumbtted
			var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
			var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';
			$("#tank_bookref_ajax").html(ajaxLoader);
			$("#tank_bookref_ajax").show();
			
			$.ajax({
				type: 'POST',
				url: appHome+'/tank/common_ajax',
				dataType: "json",
				data: {
					'action_type' : 'edi_book_data',
					'plan_id' : plan_id,
					'edi_status' : edi_status
				},
				success: function(response){
					if(response.status == "success"){
						$("#plan_closing_update_date").val(response.pe_closing_date);
						$("#plan_closing_update_time").val(response.pe_closing_time);
						$("#plan_selling_update_date").val(response.pe_sailing_date);
						$("#plan_selling_update_time").val(response.pe_sailing_time);
						$("#plan_update_vessel_name").val(response.pe_vessel_name);
						$("#plan_update_voyage_number").val(response.pe_voyage_number);
						$("#plan_update_plugin").val(response.pe_plugin);
						$("#plan_update_status").val(response.pe_edi_status_text);
						$("#plan_update_booking_note").val(response.pe_booking_note);
						$("#edi_status").val(edi_status);

						$("#tank_bookref_fld").show();
					}
					$("#tank_bookref_ajax").hide();
				},
				error: function(response){
				}
			});
		}
		
		$('#tank_fld_update_modal_label').text('Booking Ref');
		$('#fld_name').val('bookref')
		$('#plan_update_bookref').show();
		$('#plan_update_note').hide();
		$('#plan_time').hide();
		$('.datapicker_update_div').hide();
		$('#plan_update_bookref').val(fldval);
	}
});
$(document).on('click', '.seal-add-btn', function(){
	let html = "";
	html += '<div class="form-group">';
	html += '<label for="message-text" class="col-sm-2 control-label seal-label"></label>';
	html += '<div class="col-sm-6">';
	html += '<input type="text" name="plan_seals[]" class="form-control filter-input-fld" maxlength="15" value="" autocomplete="on" placeholder="Seals"/>';
		
	html += '</div><div class="col-sm-2"><button type="button" class="btn-xs seal-btn"><i class="seal-icon fa "></i></button> </div></div>';
	$("#tank_seals_div").append(html);

	updateSealBtnClasses();
});

$(document).on('click', '.seal-remove-btn', function(){
	this.parentElement.parentElement.remove()
	updateSealBtnClasses();
});

function updateSealBtnClasses(){
	$('.seal-label').html('');
	$('.seal-label:first').html('Seals');

	$('.seal-btn').removeClass("btn-success seal-add-btn");
	$('.seal-btn').addClass("btn-danger seal-remove-btn");
	$('.seal-icon').removeClass("fa-plus");
	$('.seal-icon').addClass("fa-minus");

	$('.seal-btn:last').addClass('btn-success seal-add-btn');
	$('.seal-btn:last').removeClass("btn-danger seal-remove-btn");
	$('.seal-icon:last').removeClass("fa-minus");
	$('.seal-icon:last').addClass("fa-plus");
}

$(document).on('click', '.tank_weight_time', function(){
//$('.tank_weight_time').click(function() {
	$("#tank_bookref_ajax").hide();
	$("#tank_bookref_fld").hide();
	
	$(".tank-weight-field").show();
	$('#loaded_weight_info').hide();
	$('#plan_update_weight').removeAttr('readonly');
	var tpt_activity_list = ['LOAD', 'LOADD', 'LOADR', 'CLOAD'];
	if($(this).data('tank-type') == 'TPT' && $(this).data('job-type') == 'S' 
		&& tpt_activity_list.includes($(this).data('activity')) && 
		!$(this).data('rental-id') && $(this).data('j-inv-status') != 'I') {
		$('#plan_update_weight').attr('readonly', 'readonly');
		$('#loaded_weight_info').show();
	}
	var plan_id = $(this).data('plan_id');
	let seals_activity_array = ['LOAD', 'LOADD', 'LOADR', 'CLOAD'];
	if($(this).data('seals-required') == 1 && seals_activity_array.includes($(this).data('activity'))){
		$("#tank_seals_div").html('');
		$('#jp_seals_required').val(1);
		$.ajax({
			type: 'POST',
			dataType: "json",
			url: appHome+'/tank/common_ajax',
		    data: {
					'plan_id' : plan_id,
					'action_type' : 'get_seals_value',
				  },
				success: function(response){

				let seals = response;
				
				if(!seals) seals = [];

				let html = "";
				if(seals.length){

					seals.forEach((element, index) => {
						let input = $('<input>').attr({
							type: 'text',
							name: 'plan_seals[]',
							class: 'form-control filter-input-fld',
							value: element,
							maxLength: 15,
							placeholder: "Seals",
							autocomplete: "on"
						});
						
						html += '<div class="form-group">';
						if(index == 0) html += '<label for="message-text" class="col-sm-2 control-label seal-label"></label>';
						else html += '<label for="message-text" class="col-sm-2 control-label seal-label"></label>';
						html += '<div class="col-sm-6">';
						html += input[0].outerHTML;
						html += '</div> <div class="col-sm-2"><button type="button" class="btn-xs seal-btn"><i class="seal-icon fa "></i></button> </div></div>';
					});
				}
				else{
					html += '<div class="form-group">';
					html += '<label for="message-text" class="col-sm-2 control-label seal-label"></label>';
					html += '<div class="col-sm-6">';
					html += '<input type="text" name="plan_seals[]" class="form-control filter-input-fld" maxlength="15" value="" autocomplete="on" placeholder="Seals"/>';
						
					html += '</div><div class="col-sm-2"><button type="button" class="btn-xs seal-btn"><i class="seal-icon fa "></i></button> </div></div>';
				}
				
				$("#tank_seals_div").html(html);
				updateSealBtnClasses();
			}
		});
		
	} 
	else{
		$("#tank_seals_div").html('');
		$('#jp_seals_required').val(0);
	} 
	
	var fldname  = $(this).data('field-name');
	var fld_weight  = $(this).data('fld-weight');
	var fld_time  = $(this).data('fld-time');
	var tr_activity = $(this).closest('tr').attr('tr-data-activity');
	
	var row_rum = $('.tank_plan_txt_fld').closest('tr').index($(this).closest('tr'));
	
	$('#num_row').val(row_rum);
	$('#plan__id').val(plan_id);
	$('#plan__id').attr('data-plan-activity', tr_activity);

	var jobNumer = $(this).closest('tr').attr('tr-data-jobno').trim();
	var tankNo = $(this).closest('tr').attr('tr-data-tankno').trim();
	var currActivity =  $(this).closest('tr').attr('tr-data-activity').trim();
	
	$("#model_jobno").val(jobNumer);
	$("#model_tankno").val(tankNo);
	$("#curr_activity").val(currActivity);
	
	if($.inArray(currActivity, ['TIPDR']) !== -1){
		$(".tank-weight-field").hide(); //hide parent weight div
	}
	$("#plan_update_weight").show();
	$("#tank_time_fld").show(); 
	
	$('#fld_name').val(fldname);
	$("#plan_update_weight").val(fld_weight);
	$("#plan_update_time").val(fld_time);
	
	$('#tank_fld_update_modal_label').text('Weight');
	$('#plan_update_note').hide();
	$('#plan_update_bookref').hide();
	$('#plan_time').hide();
	$('.datapicker_update_div').hide();
	
	$(this).addClass('cell-heilight');
});

$('#tank_fld_update_modal').on('hidden.bs.modal', function(){
	$('.cell-heilight').removeClass('cell-heilight');
});

$('.fld_update_submit').click(function() {
	var plan_id = $('#plan__id').val();
	var num_row = $('#num_row').val();
	var fld_name = $('#fld_name').val();
	var currActivity = $("#curr_activity").val()
	var fld_name_lable = "";
	var fld_val = "";
	var fld_ctrl = "";
	var fld_weight = "";
	var fld_time = "";
	var css_classname = "";
	var title_text = "";
	var update_fld_path = $('#update-checkbox').val();
	var plan_activity = $('#plan__id').attr('data-plan-activity');
	var removeClassNames = " fa-times fa-check fa-exclamation fa-spinner fa-spin ";
	var oldClassName = $('.fld_tank_weight_time').eq(num_row).find("a i.fa").attr('class');
	var fld_seals_required = 0;
	var fld_seals = "";

	if(fld_name == "note"){
		fld_ctrl = $('#plan_update_note');
		fld_val = $('#plan_update_note').val();
		fld_name_lable = "Notes";
	} else if(fld_name == "time"){
		fld_ctrl = $('#plan_time');
		fld_val = $('#plan_time').val();
		fld_name_lable = "Time";
	} else if(fld_name == "weight_n_time"){
		fld_name_lable = "Weight/Time";
		fld_val = "";
		fld_weight = $('#plan_update_weight').val();
		fld_time = $('#plan_update_time').val();
		fld_seals_required = $('#jp_seals_required').val();
		var fld_seals = $("input[name='plan_seals[]']")
              .map(function(){
				  if($(this).val()) return $(this).val();
			}).get();
		
		fld_weight = $.trim(fld_weight);
		fld_time = $.trim(fld_time);
	} else if(fld_name == "plandate"){
		fld_ctrl = $('#date_tankplan_update');
		fld_val = $('#date_tankplan_update').val();
		fld_name_lable = "Date";
	}else {
		fld_ctrl = $('#plan_update_bookref');
		fld_val = $('#plan_update_bookref').val();
		fld_name_lable = "Book Ref";
		$("#tank_bookref_ajax").hide();
		$("#tank_bookref_fld").hide();
	}

	var $data = {
			'field_name' : fld_name,
			'field_value' : fld_val,
			'plan_id' : plan_id,
			'field_weight' : fld_weight,
			'field_time' : fld_time,
		};
	if(fld_name == "weight_n_time"){
		$data.j_seals_required = fld_seals_required;
		$data.seals = fld_seals;
	}
	
		
	//Booking contain extra fields only when its EDI booking (no cancel / noaction etc.)	
	var bookingRefChange = false;
	if(fld_name == "bookref"){
		var edi_status = $("#edi_status").val();
		if(edi_status != "" && $.inArray(edi_status, [0,3,30]) == -1){ // IF NOT -> 0 = NoAction/3 = Cancel/ 30 = CancelSumbtted
			$data.pe_closing_date 		= $("#plan_closing_update_date").val();
			$data.pe_closing_time 		= $("#plan_closing_update_time").val();
			$data.pe_sailing_date 		= $("#plan_selling_update_date").val();
			$data.pe_sailing_time 		= $("#plan_selling_update_time").val();
			$data.pe_vessel_name 		= $("#plan_update_vessel_name").val();
			$data.pe_voyage_number 		= $("#plan_update_voyage_number").val();
			$data.pe_plugin 			= $("#plan_update_plugin").val();
			$data.pe_edi_status_text 	= $("#plan_update_status").val();
			$data.pe_booking_note 		= $("#plan_update_booking_note").val();
			$data.edi_status 			= $("#edi_status").val();
			
			bookingRefChange = true;
		}
	}
		
	$.ajax({
		type: 'POST',
		url: update_fld_path,
		beforeSend: function() {
			if(fld_name == "weight_n_time"){
				$('.fld_tank_weight_time').eq(num_row).find("a i.fa").removeClass(removeClassNames).addClass('fa-spinner fa-spin');
			}
		},
		data: $data,
		timeout:60000,
		success: function(response){
			if(response == "success" || fld_name == "weight_n_time" || fld_name == "time" || fld_name == "bookref") {
				if(fld_name == "note"){
					$('.tank_note').eq(num_row).text(fld_val);
				} else if(fld_name == "time"){
					if(fld_val.length >= 5){
						fld_val = fld_val.substring(0, 5);
					}
					$('.tank_time').eq(num_row).text(fld_val);
					
					if($.trim(response) != "success" && $.trim(response) != "failed"){
						BsMsgType = response.search('Successfully') > 0 ? BootstrapDialog.TYPE_SUCCESS : BootstrapDialog.TYPE_WARNING;
						BootstrapDialog.show({title: 'Time', message : response,type: BsMsgType});
						if($('#page_name').val() == "job-edit" && $.trim(response) != "success"){
							jobFileListingFun(1);//declared inside job.js
						}
					}
				} else if(fld_name == "plandate"){
					if(fld_val != ""){
						fld_val = fld_val.split("/");
						if(fld_val[2].length == 4){
							fld_val[2] = fld_val[2].slice(2);
						}
						var new_val = fld_val.join("/");
						$('.tank_date').eq(num_row).text(new_val);
					}
				}
				else if(fld_name == "weight_n_time"){	
					$this_a = $('.fld_tank_weight_time').eq(num_row).find('a');
					$this_a.data('fld-weight',fld_weight);
					$this_a.data('fld-time',fld_time);
					
					var seals_required = $this_a.data('seals-required');
					if(seals_required){
						const event = new CustomEvent('weight_n_time_update', { detail: {job_no: $('#job_number').val()} });
						document.dispatchEvent(event);
					}
					fld_weight = (fld_weight == 0) ? "" : fld_weight;
					if($.inArray(currActivity, ['LOAD', 'LOADD', 'LOADR', 'CLOAD']) !== -1){

						if(fld_weight != "" && fld_time != "" && (!seals_required || (seals_required == 1 && fld_seals != ""))){
							css_classname =  'green-icon';
							title_text = "Weight : " + fld_weight + " / Time : " + fld_time;
							$this_a.find("i.fa").removeClass(removeClassNames).addClass('fa-check');
						} else if(fld_weight == "" && fld_time == "" && (!seals_required || (seals_required == 1 && fld_seals == ""))){
							css_classname =  'red-icon';
							$this_a.find("i.fa").removeClass(removeClassNames).addClass('fa-times');
							title_text = "";
						}else if(fld_time != "" && (!seals_required || (seals_required == 1 && fld_seals != "")) && $.inArray(currActivity, ['LOADD']) !== -1){
								css_classname =  'green-icon';
								title_text = "Time : " + fld_time;
								$this_a.find("i.fa").removeClass(removeClassNames).addClass('fa-check');
						}else {
							css_classname =  'orange-icon';
							$this_a.find("i.fa").removeClass(removeClassNames).addClass('fa-exclamation');
							if(fld_weight == "") {
								title_text = "Time : " + fld_time;
							} else {
								title_text = "Weight : " + fld_weight;
							}
						}
					}
					else if($.inArray(currActivity, ['TIP', 'TIPDR', 'TIPRE']) !== -1){

						if(fld_weight != "" && fld_time != ""){
							css_classname =  'green-icon';
							title_text = "Weight : " + fld_weight + " / Time : " + fld_time;
							$this_a.find("i.fa").removeClass(removeClassNames).addClass('fa-check');
						} else if(fld_weight == "" && fld_time == ""){
							css_classname =  'red-icon';
							$this_a.find("i.fa").removeClass(removeClassNames).addClass('fa-times');
							title_text = "";
						}else if(fld_time != "" && $.inArray(currActivity, ['TIPDR']) !== -1){
								css_classname =  'green-icon';
								title_text = "Time : " + fld_time;
								$this_a.find("i.fa").removeClass(removeClassNames).addClass('fa-check');
						}else {
							css_classname =  'orange-icon';
							$this_a.find("i.fa").removeClass(removeClassNames).addClass('fa-exclamation');
							if(fld_weight == "") {
								title_text = "Time : " + fld_time;
							} else {
								title_text = "Weight : " + fld_weight;
							}
						}
					}
					css_classname = 'tank_weight_time ' + css_classname;
					
					$this_a.attr('title',title_text);
					$this_a.removeClass().addClass(css_classname);
					
					//START change icon in  SHIP activity 
					var jobNo = $('#model_jobno').val(); 
					/*if($('#page_name').val() == 'tank-plan-index') {
						jobNo = $('#model_jobno').val(); 
					} else {
						jobNo =  $('#job_number').val(); 
					}*/
					if($.inArray(currActivity, ['LOAD','LOADR','CLOAD']) !== -1){
						changeIconShip(jobNo,fld_weight,response,1);
					}
					//END change icon in  SHIP activity
					
					//For Job page
					if($('#page_name').val() == 'job-edit' && $('#job_number').val() == jobNo){
						if(($.inArray(currActivity, ['LOAD','LOADR','CLOAD']) !== -1) && $("#j_manual_weight_entry").is(':checked') == false){
							fld_weight = (fld_weight == "") ? 0 : fld_weight;
							$("#loaded_weight").text(fld_weight);
						}
					}
					
					if(response.length > 10){
						BsMsgType = response.search('Unable ') < 0 ? BootstrapDialog.TYPE_SUCCESS : BootstrapDialog.TYPE_WARNING;
						
						if(fld_name == "weight_n_time" && $('#page_name').val() == "job-edit"){
							BootstrapDialog.show({title: 'Time/Weight update', message : response,type: BsMsgType, buttons: [{
				                    label: ' OK ',
								    action: function(dialog) {
								        dialog.close();
										  window.location.reload(true);
									}
				                }]});
						} else {
							BootstrapDialog.show({title: 'Time/Weight update', message : response,type: BsMsgType});
						}
						
					}
				
				} else if(fld_name == "bookref"){
					$('.tank_bookref').eq(num_row).text(fld_val);
						
					if(bookingRefChange){
						BootstrapDialog.show({title: 'Book Ref', message : "Successfully updated booking references.", type: BootstrapDialog.TYPE_SUCCESS, buttons: [{
		                    label: ' OK ',
						    action: function(dialog) {
						        dialog.close();
								if($('#page_name').val() == "job-edit"){
								  	window.location.reload(true);
								} else {
									getTankPlans('#search-form');
								}
							}
		                }]});
					}	
				} 
				
			}else if(fld_name == 'plandate'){
				if(fld_val != ""){
					fld_val = fld_val.split("/");
					if(fld_val[2].length == 4){
						fld_val[2] = fld_val[2].slice(2);
					}
					var new_val = fld_val.join("/");
					$('.tank_date').eq(num_row).text(new_val);
				}
				
				BootstrapDialog.show({title: 'Date Update', message : response,type: BootstrapDialog.TYPE_SUCCESS});
				if(response.indexOf('DEMTK') != -1){
					if($('#page_name').val() == 'tank-plan-index'){
						getTankPlans('#search-form'); 
					}else{
						setTimeout(function(){ location.reload(); }, 3000);
					}
				}else if(response.indexOf('Job Surcharge') != -1 && $('#page_name').val() == 'job-edit'){
					setTimeout(function(){ location.reload(); }, 3000);
				}
			}else {
				BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update '+ fld_name_lable +'. Try again later.'});
			}
		},
		error: function(response){
			BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update '+ fld_name_lable +'. Try again later.'});
		}
	});
	
});

//new job is closed
$('#j_is_closed').click(function() {
	var jobnumber_id = $('#job_number').val();
	var update_job_fld_path = $('#update-job-checkbox').val();
	var manual_add_entry = $("#j_is_closed").is(':checked') ? 1 : 0;
	var current_checkbox = $(this).val();
	var fld_name_lable = " Job Reviewed and Closed ";
	var $this = $(this);
	var textarea = '';
	if(manual_add_entry == 1)
	 textarea = '<textarea class="form-control" name="reason_comment" id ="reason_comment" maxlength="128"  placeholder="Comment..."/></textarea>'; 
	BootstrapDialog.show({
		title: 'Confirmation',
		message: $('<p>Are you sure you want to carry out this operation ?</p><br>'+textarea),
		buttons: [
			{
				label: 'Cancel',
				hotkey: 13, // Enter.
				action: function(dialogRef){
					dialogRef.close();
					if($this.val()!=1 && manual_add_entry == 1 ){ 
						$this.prop('checked', false);
					}else{ 
						$this.prop('checked', true);
					}
				}
			},
			{
				label: 'OK',
				cssClass: 'btn-primary',
				hotkey: 13, // Enter.
				action: function(dialogRef) {
					$.ajax({
						type: 'POST',
						url: update_job_fld_path,
						data: {
							'manual_add_entry' : manual_add_entry,
							'job_number'  : jobnumber_id,
							'je_comments' : $("#reason_comment").val(),
							'current_checkbox' : current_checkbox ,
							'action_type' : 'is_job_closed'
						},
						success: function(response){
						if(response == "failed") {
							BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update '+ fld_name_lable +'. Try again later.'});
							if(manual_add_entry == 1) {
								$this.prop('checked', false);
							} else {
								$this.prop('checked', true);
							}
						}else {
							window.location.reload();
						}
					},
					error: function(response){
						BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update '+ fld_name_lable +'. Try again later.'});
						if(manual_add_entry == 1) {
							$this.prop('checked', false);
						} else {
							$this.prop('checked', true);
						}
					}
				});
				dialogRef.close();
			}
		
		}]
    });
});

$('#j_manual_weight_entry').click(function() {
	var jobnumber_id = $('#job_number').val();
	var update_job_fld_path = $('#update-job-checkbox').val();
	var manual_add_entry = $("#j_manual_weight_entry").is(':checked') ? 1 : 0;
	var fld_name_lable = "Manually Add Weight";
	var $this = $(this);	
	
	$.ajax({
		type: 'POST',
		url: update_job_fld_path,
		data: {
			'manual_add_entry' : manual_add_entry,
			'job_number' : jobnumber_id
		},
		success: function(response){
			if(response == "failed") {
				BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update '+ fld_name_lable +'. Try again later.'});
				if(manual_add_entry == 1) {
					$this.prop('checked', false);
				} else {
					$this.prop('checked', true);
				}
			}
		},
		error: function(response){
			BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update '+ fld_name_lable +'. Try again later.'});
			if(manual_add_entry == 1) {
				$this.prop('checked', false);
			} else {
				$this.prop('checked', true);
			}
		}
	});
	
});

$('#j_seals_required').click(function() {
	var jobnumber_id = $('#job_number').val();
	var update_job_fld_path = $('#update-job-checkbox').val();
	var seals_required = $("#j_seals_required").is(':checked') ? 1 : 0;
	var fld_name_lable = "Seals Required";
	var $this = $(this);	
	
	$.ajax({
		type: 'POST',
		url: update_job_fld_path,
		data: {
			'seals_required' : seals_required,
			'job_number' : jobnumber_id,
			'action_type': 'sealsRequiredUpdate'
		},
		success: function(response){
			if(response == "failed") {
				BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update '+ fld_name_lable +'. Try again later.'});
				if(seals_required == 1) {
					$this.prop('checked', false);
				} else {
					$this.prop('checked', true);
				}
			}
			else{
				location.reload();
			}
		},
		error: function(response){
			BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update '+ fld_name_lable +'. Try again later.'});
			if(seals_required == 1) {
				$this.prop('checked', false);
			} else {
				$this.prop('checked', true);
			}
		}
	});
	
});

$('#fromtown-part-filter').change(function(){
	if($.trim($(this).val()) != "" ){
		$("#fromtown-filter").val('');
		$("#fromtown-filter").multiselect('refresh');
	}
});

$('#totown-part-filter').change(function(){
	if($.trim($(this).val()) != "" ){
		$("#totown-filter").val('');
		$("#totown-filter").multiselect('refresh');
	}
});

$('#tank-filer').change(function(){
	if($('#date_from').val() != '' || $('#date_to').val() != '') {
      $('#period-filter').val('');  
    }else {
     //$('#period-filter').val('1');
    }
});

$('#jobno-filer').change(function(){
	$('#period-filter').val('');
});
$('#date_from,#date_to').change(function(){
    if($('#date_from').val() != '' || $('#date_to').val() != '') {
      $('#period-filter').val('');  
    }
});
$(document).on('click', '.view-tank', function(e){
	var booked_val = $(this).closest('tr').find('td :eq(9)').find('.tank_plan_checkbx').is(':checked') == true ? 'Yes' : 'No';
	var completed_val = $(this).closest('tr').find('td :eq(11)').find('.tank_plan_checkbx').is(':checked') == true ? 'Yes' : 'No';
	
	$("#job-model-job").text( $(this).closest('tr').attr('tr-data-jobno') );
	$("#job-model-activity").text( $(this).closest('tr').find('td :eq(0)').text() );
	//$("#job-model-tankno").text( $('#job_tankno').val() );
	$("#job-model-tankno").text( $(this).closest('tr').find('td :eq(5)').text() );
	$("#job-model-date").text( $(this).closest('tr').find('td :eq(1)').text() );
	$("#job-model-time").text( $(this).closest('tr').find('td :eq(2)').text() );
	$("#job-model-fromcode").text( $(this).closest('tr').find('td :eq(6)').data('tcode') );
	$("#job-model-tocode").text( $(this).closest('tr').find('td :eq(7)').data('tcode') );
	$("#job-model-note").text( $(this).closest('tr').find('td :eq(13)').text() );
	$("#job-model-supplier").text( $(this).closest('tr').find('td :eq(8)').text() );
	$("#job-model-booked").text( booked_val );
	$("#job-model-bookref").text( $(this).closest('tr').find('td :eq(10)').text() );
	$("#job-model-completed").text( completed_val );
	$("#job-model-user").text( $(this).closest('tr').find('td :eq(15)').text() );
});

$('#search_box_bttn').click(function(){
    $('#search_box_bttn i').toggleClass('fa-search-minus fa-search-plus');
    $('.search_box').slideToggle("slow");
    $('#response').slideToggle("fast");
    $('.custom-pagination').slideToggle("fast");
});
/*
$('.edit-linked-job').click(function(){
	$('#link_txt').val($(this).attr('data-link-no'));
	$('.linked_job_div,.invalid_link_msg').hide();
	$('.link_job_div').show();
});

$('.close-edit-link-box').click(function(){
	$('.linked_job_div').show();
	$('.link_job_div,.invalid_link_msg').hide();
});*/

$(document).on('click', '.add-tank-plan', function(e){

	var href = $(this).data('href');
	var jobno = $(this).data('jobno');
	var oncarragejob = $(this).data('oncarragejob');
	var tankno = $(this).data('tankno');
	if(oncarragejob != ""){
		var msgdiv = '<div class="ondemurragejob-div"><p style="text-align: center;"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i><p></div>';
  		BootstrapDialog.show({
  			title: 'Confirmation',
  			type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: false, // <-- Default value is false
            draggable: false, // <-- Default value is false
            message: msgdiv,
            onshow: function(dialog) {
	                dialog.getButton('ondemurrage-btn-ok').disable();
	            },
            buttons: [{
            	id: 'ondemurrage-btn-ok',
                label: 'OK',
                icon: 'glyphicon glyphicon-ok-sign',       
		        cssClass: 'btn-warning',
		        
                action: function(dialogRef) {
                	var rad = dialogRef.getModalBody().find('[name="add-plan-select-job"]:checked');
                	dialogRef.close();
					window.location.href = rad.attr('data-href');
                }
            },
            {
                label: 'Cancel',
                icon: 'glyphicon glyphicon-remove-circle', 
                action: function(dialogRef) {
                    dialogRef.close();
                }
            }]
    	});
    	setTimeout(function(){ 
    		//ajax function for get msg start
	    	$.ajax({
				type: 'POST',
				url: appHome+'/job/common_ajax',
				data: {
					'jobno' : jobno,
					'action_type' : 'get_oncarriage_msg',
					'callfrom' : 'plan',
					'oncarragejob' : oncarragejob
				},
				success: function(response){
					$('.ondemurragejob-div').html(response);
					$('#ondemurrage-btn-ok').removeClass('disabled');
					$('#ondemurrage-btn-ok').attr('disabled', false);
				},
				error: function(response){
					$('.ondemurragejob-div').html('Failed to Fetch details. Try again later.');
				}
			});
			//ajax function for get msg end
    	 }, 1000);

    	
	}else{
		window.location.href = href+'?jnumber='+jobno+'&tanknumber='+tankno;
	}
});

$('.save-link-job').click(function(){

	var jobnumber_id = $(this).data('jobno');
	var jobNo = $(this).data('linkedjob');
	var update_job_fld_path = $('#update-job-checkbox').val();
	BootstrapDialog.confirm('Are you sure you want to Un-link these Jobs ?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				url: update_job_fld_path,
				data: {
					'job_number' : jobnumber_id,
					'action_type' : 'link_job',
					'link_job_number' : jobNo
				},
				success: function(response){
					$('html, body').animate({ scrollTop: 0 }, 400);
					localStorage.setItem('response', response);
					window.location.reload();
				},
				error: function(response){
					BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update. Try again later.'});
				}
			});
		} 
	});
});

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
			url: appHome+'/job/common_ajax',
		    data: {
					'doc_id' : doc_id,
					'docname'  : docname,
					'action_type' : 'rename_invoice_doc',
					'callfrom' : 'plan',
				  },
			success: function(response){
				if(response == 'exist'){
					BootstrapDialog.show({title: 'Failed to update', message : 'Filename Already Exist.'});
				}else if(response == 'success'){
					$('.doc_a_href'+doc_id).text(docname);
				}
			}
		});
	}
});

$('.delete-invoice-job').click(function(){
	var doc_id = $(this).attr('data-doc-id');
	var parent = $(this).parent().parent();
	BootstrapDialog.confirm('Are you sure you want to delete this Invoice ?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				url: appHome+'/job/common_ajax',
				data: {
					'doc_id' : doc_id,
					'action_type' : 'del_invoice_doc',
				},
				beforeSend: function() {
					  $(parent).find("td").css({
						  'color': '#fff',
						  'background-color': '#cc0000'
					  })
					},
				success: function(response){
					if(response == 'success'){
						$(parent).fadeOut(1000, function() {
							$(this).remove();

						});
					}
				}
			});
		} 
	});
});

if($('#page_name').val() == "tank-plan-index" && ($('#tank-filer').val() != "" || $('#jobno-filer').val() != "")){
	getTankPlans('#search-form');
}

$(".act_status").hide();
$(".activityStat").hide();
$(document).on('change', '#activity-filter', function(){
	$(".activityStat").show();
	if($("#activity-filter").val() != ''){
		$(".act_status").show();
	}else{
		$(".act_status").hide();
		$("#activityStatus-filter").val('');
	}
});

});//end of document ready

$(document).on('keypress', 'input,select', function (e) {
	if($('#page_name').val() == 'tank-plan-index'){
		if (e.which == 13) {
	        e.preventDefault();
	        if($(this).attr('id') == 'jobno-filer'){
	        	$('#period-filter').val('');
	        } else if($(this).attr('id') == 'tank-filer'){
	        	//$('#period-filter').val('1');
	        }
	        getTankPlans('#search-form');
	    }
	}
});

$( window ).load(function() {
	if($(".multi-select-all").length != 0){
		$(".multi-select-all").multiselect({
			enableCaseInsensitiveFiltering: true,
			enableFiltering: true,
			maxHeight: 200,
			buttonWidth: '100%',
			includeSelectAllOption: true,
			selectAllText:' All',

		});

	};
	if($(".multi-sel-ctrl").length != 0){
	var activities = $('#activity-filter').val();
	var index = jQuery.inArray('LOAD', activities);
	if(index != -1){
		$('.tank-div').css('display', 'block');
	}
	else{
		$('.tank-div').css('display', 'none');
	}
	$(".multi-sel-ctrl").multiselect({
		enableCaseInsensitiveFiltering: true,
		enableFiltering: true,
		maxHeight: 200,
		buttonWidth: '100%',
		onChange: function(element, checked) {
			/**
			 * update tankplan activities
			 * LOAD -LOADD,LOADR
			 * TIP  -TIPDR,TIPRE 
			 */
			var activities = $('#activity-filter').val();
			var index = jQuery.inArray('LOAD', activities);
			if(index != -1){
				$('.tank-div').css('display', 'block');
			}else{
				$('.tank-div').css('display', 'none');
			}
			if (checked === true && element.val() == 'LOAD' && $(this.$select).attr('id') == 'activity-filter') {
				element.parent().find('option[value="LOADD"]').prop('selected', true);
				element.parent().find('option[value="LOADR"]').prop('selected', true);
				element.parent().multiselect('refresh');
				$('.tank-div').css('display', 'block');
			}
			if (checked === true && element.val() == 'TIP' && $(this.$select).attr('id') == 'activity-filter') {
				element.parent().find('option[value="TIPDR"]').prop('selected', true);
				element.parent().find('option[value="TIPRE"]').prop('selected', true);
				element.parent().multiselect('refresh');
			}

			if($(this.$select).attr('id') == 'tank-spec'){
				
				if(element.val() == 'Baffles'){
					 element.parent().find('option[value="Non-baffled"]').prop('selected', false);
				}
				if(element.val() == 'Non-baffled'){
					 element.parent().find('option[value="Baffles"]').prop('selected', false);
				}
				//Stubbie Stack
				if(element.val() == 'stubbie_stack_y'){
					 element.parent().find('option[value="stubbie_stack_n"]').prop('selected', false);
				}
				if(element.val() == 'stubbie_stack_n'){
					 element.parent().find('option[value="stubbie_stack_y"]').prop('selected', false);
				}
				//Stubbie Stack
				if(element.val() == 'tank_semi_y'){
					 element.parent().find('option[value="tank_semi_n"]').prop('selected', false);
				}
				if(element.val() == 'tank_semi_n'){
					 element.parent().find('option[value="tank_semi_y"]').prop('selected', false);
				}
				element.parent().multiselect('refresh');
			}

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
			 if(checked === false && element.parent().val() == null ){
				 element.parent().val('');
				 element.parent().multiselect('refresh');
			 }
			 //for option group
			 if (checked === true && element.val() != '' && element.parent('optgroup')) {
					 element.parent('optgroup').parent().multiselect('deselect', '');
					 element.parent('optgroup').parent().multiselect('refresh');
			 }
			 if (checked === true && element.val() == '' && element.parent('optgroup')) {
				 element.parent('optgroup').parent().val('');
				 element.parent('optgroup').parent().multiselect('refresh');
			 }
			 if(checked === false && element.parent('optgroup').parent().val() == null && element.parent('optgroup')){
				 element.parent('optgroup').parent().val('');
				 element.parent('optgroup').parent().multiselect('refresh');
			 }
		}
	});
	}
	$('.tmp-input-ctrl').remove();//This control is for not showing old select box
	
	if($("#show_msg").val() == "yes")
	{
		$('#response').empty();
		$('#response').append(localStorage.getItem('response'));
		$('#response1').append(localStorage.getItem('response1'));
		localStorage.clear();
	}
});

/*Get tank plan details */
$(document).on('click', '#tank-filter-submit', function(){ 
	var form = '#'+$(this).closest('form').attr('id');
	$('#page').val(0);
	$('#response').empty();
	
	var array1  = $('#activity-filter').val(),
    array2 = ['ETA','ETAS','ETAR'];

	var common = $.grep(array1, function(element) {
	    return $.inArray(element, array2 ) !== -1;
	});
	getTankPlans(form);
	/*if(common.length == 0){
		getTankPlans(form);
	}else{
		if(($('#tocountry-filter').val().filter(function(v){return v!==''}) != "") && (($('#totown-filter').val().filter(function(v){return v!==''}) != "") || ($('#totown-part-filter').val() != ""))){
			 getTankPlans(form);
		}else{
			BootstrapDialog.show({
				      title: 'Warning!',
				      type: BootstrapDialog.TYPE_WARNING,
				      message: "Select arrival destination first(‘To Country’ and ‘End City’).",
				      buttons: [{
				        label: 'OK',
				        action: function(dialogItself){
				          dialogItself.close();
				        }
				      }]
				    });
		}
	}*/
});

// $('.sortClass').click(function(e) {
// 	if($('.norecords').length != 1 ){
// 		$('.center-cell').removeClass('sortClass-th');
// 		$(this).parent('th').addClass('sortClass-th');
// 		var sort = $(this).attr('data-sort');
// 		var sort_type = $(this).attr('data-sort-type');
// 		if($('#sort').val() == sort){
// 			if($('#sorttype').val() == 'asc')
// 				$('#sorttype').val('desc');
// 			else
// 				$('#sorttype').val('asc');
// 		}else{
// 			$('#sort').val(sort);
// 			$('#sorttype').val(sort_type);
// 		}
// 		$('#search-form').submit();
// 	}
// });

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

function docloaderChange(){

	var plIdArr = [];
	$('.doc-spinner').each(function() {
	    var pl_id = $(this);
	    plIdArr.push($(this).data('plid'));
	});

	/*var exparr = [];
	var exisitCheckArr = [];
	$('.fa-tank-expired').each(function() {
	    var jobId = $(this).data('jobid');
	    if(exisitCheckArr.indexOf(jobId) == -1){
	    	exisitCheckArr.push(jobId);
	    	exparr.push({
	    			job_id 	: jobId,
	    			expdate	: $(this).data('tankexpdate'),
	    			mottype	: $(this).data('mottype'),
	  				});
	    }
	});*/

	if(plIdArr.length > 0){
		$.ajax({
			type: 'POST',
			dataType: "json",
			url: appHome+'/tank/common_ajax',
		    data: {
					'plan_ids' : plIdArr,
					//'tank_exp_arr' : exparr,
					'action_type' : 'fill_doc_icon',
				  },
			success: function(response){

				$.each(response.plan_docs, function(key,value) {
					var changeElement = $('.doc-spinner[data-plid="'+value+'"]');
					changeElement.addClass("fa-file").removeClass("fa-spinner fa-spin");
				}); 
				$('.doc-spinner').addClass("fa-file-o").removeClass("fa-spinner fa-spin");

				//changetankIcons(response.expired_id);
			}
		});
	}
	
}

/*function changetankIcons(jsonData){
	$.each(jsonData, function(key,value) {
		var changeElement = $('.fa-tank-expired[data-jobid="'+key+'"]');
		changeElement.replaceWith(value);
	}); 
	$('.fa-tank-expired').remove();
}*/

function getTankPlans(form){ 
	
	var h = $('.overlay-complete-loader').height();
	if(h == 0) { h = 100; }
	$('.btl_overlay').height(h);  
	$('.btl_relative').show();
	var button = $('#tank-filter-submit');
	button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');
 	
	$.ajax({ 
        type: 'GET',
        url: appHome+'/tank/ajax-get-tank-plans',
        data: $(form).serialize(),
        success: function(response){
			if(response.indexOf("No records found.") != -1){

			  $('#tank-export-excel').attr("disabled", "disabled");

			}else{

				$('#tank-export-excel').removeAttr("disabled");
				
			}
        	$('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
        	$('.btl_relative').hide();
        	$('.plan-div').html(response);
        	button.find('span').removeClass().addClass("glyphicon glyphicon-filter");
         	button.removeAttr('disabled');
         	applySortClass();
         	docloaderChange();
         	docloaderChangeTank();
         	if($('#page_name').val() == "tank-plan-index"){
         		$('#totalrecords').val($('#hd_totalrecords').val());
         	}
			$('.booked-status').chosen({allow_single_deselect: false}).trigger("chosen:updated");
			$('.booked-status').next('.chosen-container-single').css({"width":"100%"});
         	getDamagedIcon();
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          button.find('span').removeClass().addClass("glyphicon glyphicon-filter");
       	  button.removeAttr('disabled');
      	 
        }
    });
}
//excelexport tankplan
$(document).on('click', '#tank-export-excel', function(e){
if($('#totaldata').val() > 4000 ) { 
e.preventDefault();
 BootstrapDialog.show({
      title: 'Warning..!',
      type: BootstrapDialog.TYPE_WARNING,
      message: 'Maximum of 4000 Records can be exported..',
      buttons: [{

        label: 'Close',
        action: function(dialogItself){

          dialogItself.close();
        }
      },{

        label: 'Export Excel',
        action: function(dialogItself){
          $('#search-form').submit();
          dialogItself.close();
        }
      }]
    });

}else{
	$('#search-form').submit();
	
}
});

//Pagination button
$(document).on('click', '.first-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getTankPlans('#search-form');
});


//Pagination button
$(document).on('click', '.last-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getTankPlans('#search-form');
});

//Pagination button
$(document).on('click', '.next-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getTankPlans('#search-form');
});


//Pagination button
$(document).on('click', '.prev-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getTankPlans('#search-form');
});

//Page size change
$(document).on('change', '.page-limit', function(){
	var pageSize = $(this).val();
	$('#pagesize').val(pageSize);
	$('#page').val(0);
	getTankPlans('#search-form');
});

//Reset filters
function resetFilters(){
	var oldPeriodSel = $('#period-filter').val();
	$('#search-form')[0].reset();
	$('#period-filter').val(oldPeriodSel);
	$('.reset-filter').val('');
	$('.reset-filter').multiselect('refresh');
	$('#customer_group').val('').trigger('chosen:updated');
} 

//Get extra cost data
$('.edit-modal-extra').live('click', function (e) {
	e.preventDefault();
	$extraCostId = $(this).attr("data-extra-id");
	$("#extraCostRowNum").val($(this).closest('tr').data('rowid'));
	
	$.ajax({
		type: 'POST',
		//async : false,
		url: appHome+'/job/common_ajax',
	    data: {
				'extraCostId' : $extraCostId,
				'action_type' : 'get_extra_costs_byId',
			  },
		success: function(responseString){
			response = JSON.parse(responseString);
			if(response.status == 'success'){
				$("#extra-cost-id").val(response.jec_id);
				$("#extra-cost-job").val(response.j_number);
				$("#extra-cost-date").val(response.jec_date);
				$("#extra-cost-desc").val(response.jec_desc);
				$("#extra-cost-curr").val(response.jec_curr);
				$("#extra-cost-value").val(response.jec_value);
				if(response.jec_rec_type == "SUMMARY"){
					$('#extra_cost_link_to_summary_invoice').attr('checked', 'checked');
				} 
				else{
					$('#extra_cost_link_to_summary_invoice').removeAttr('checked');
				}
				if(response.jec_linked_summary_id){
					$('#extra_cost_link_to_summary_invoice').attr('disabled', 'disabled');
				}
				else{
					$('#extra_cost_link_to_summary_invoice').removeAttr('disabled');
				}
				$("#extra-cost-value").next("span").remove();
				if(response.read_msg == ""){
					$("#extra-cost-value").attr('readonly', false);
				}else{
					$("#extra-cost-value").attr('readonly', true);
					$('<span style="color:red;">'+response.read_msg+'</span>').insertAfter("#extra-cost-value");
				}
				$("#extra-cost-user").val(response.jec_user);
				$("#extra-cost-custcode").html(response.customer_codes);
				
				$("#extra-cost-curr").attr('disabled','disabled');
				$("#job_extra_edit").modal('show');
			}
		}
	});
	
});

//Add extra cost data
$('.add-extra-cost').live('click', function (e) {
	e.preventDefault();
	$jobNumber = $(this).attr("data-jobnumber");
	
	$("#extra-cost-id").val('');
	$("#extra-cost-job").val($jobNumber);
	$("#extra-cost-date").val('');
	$("#extra-cost-desc").val('');
	$("#extra-cost-curr").val($("#job-currency").val());
	$("#extra-cost-value").val('');
	$("#extra-cost-user").val($("#current-user").val());
	$("#extra-cost-custcode").val($("#job-customer").val());
	
	$("#extra-cost-curr").removeAttr('disabled');
	$("#job_extra_edit").modal('show');
});

//Save extra cost data
$('.save-extra-costs').live('click', function (e) {
	e.preventDefault();
	var re=/^[0-9\s]*$/;
	var saveType = "edit";
	var extraCostRowCount = $("#extraCostRowCount").val();
	var extraCostRowNum = $("#extraCostRowNum").val();
	
	$extraCost = $("#extra-cost-value").val().trim();
	$extraCost = ($extraCost == "")? 0 : $extraCost;
	if($("#extra-cost-id").val() == ""){
		saveType = "add";
	}
	
	var ecostid = $("#extra-cost-id").val();
	var ecostjob = $("#extra-cost-job").val();
	var ecostdate = $("#extra-cost-date").val();
	var ecostdesc = $("#extra-cost-desc").val();
	var ecostcurr = $("#extra-cost-curr").val();
	var ecostval = $("#extra-cost-value").val();
	var ecostuser = $("#extra-cost-user").val();
	var ecostcust = $("#extra-cost-custcode").val();
	
	if (ecostdate == "") {
		BootstrapDialog.show({title: 'Extra Cost', message : 'Enter Date'});
	} else if(!$.isNumeric($extraCost)){
		BootstrapDialog.show({title: 'Extra Cost', message : 'Cost is empty / Invalid cost'});
	} else {
		$.ajax({
			type: 'POST',
			//async : false,
			url: appHome+'/job/common_ajax',
		    data: {
					'saveType' : saveType,
					'extraCostId' : ecostid,
					'extraCostJob' : ecostjob,
					'extraCostDate' : ecostdate,
					'extraCostDesc' : ecostdesc,
					'extraCostCurr' : ecostcurr,
					'extraCost' : ecostval,
					'extraCostUser' : ecostuser,
					'extraCostCust' : ecostcust,
					'action_type' : 'save_extra_costs_byId',
					'extra_cost_link_to_summary_invoice': $('#extra_cost_link_to_summary_invoice').is(":checked")? 1: 0
				  },
			success: function(responseString){
				response = JSON.parse(responseString);
				if(response.status == 'success'){
					$("#job_extra_edit").modal('hide');
					
					if(saveType == "add"){
						extraCostRowCount = parseInt(extraCostRowCount);
						extraCostRowCount++;
						$("#extraCostRowCount").val(extraCostRowCount);
						$("#extraCostTable").append(response.html.replace(/ROW-NUMBER/g, extraCostRowCount));
					} else {
						extraCostRowNum = parseInt(extraCostRowNum);
						$("#rowid_" + extraCostRowNum ).replaceWith(response.html.replace(/ROW-NUMBER/g, extraCostRowNum));
					}
					$("#responseExtra").html('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> Extra cost was added/updated successfully.</div>');
				}
			}
		});
		
	}
	
});

//Delete extra cost
$('.delete-extra-cost').live('click', function (e) {
	e.preventDefault();
	$extraCostId = $(this).attr("data-extra-id");
	var curRow = $(this).closest('tr').data('rowid');
	
	BootstrapDialog.confirm('Are you sure you want to delete this Extra Cost ?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				//async : false,
				url: appHome+'/job/common_ajax',
			    data: {
						'extraCostId' : $extraCostId,
						'action_type' : 'delete_extra_costs_byId',
					  },
				success: function(responseString){
					response = JSON.parse(responseString);
					if(response.status == 'success'){
						$("#rowid_" + curRow).hide();
						$("#responseExtra").html('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> Extra cost was deleted successfully.</div>')
					}
				}
			});
		} 
	});
	
});

$('#customer_group_plan').change(function(e){
		$("#customer-filter").val("");
		$("#customer-filter").multiselect("refresh");

		if($(this).val() == ""){
			$("#customer-filter").multiselect('enable');
		} else {
			$("#customer-filter").multiselect('disable');
		}
});

$('.file-upload-btn-tank').live('click',function(e) {
	var id = $(this).attr('data-id');
	var upload_type = $(this).attr('data-upload-type');
	var modal_title = $(this).attr('data-modal-title');
	var tankNo = $(this).attr('data-tanknum');
	if(upload_type == 'tank_doc'){
		var type = 'Tank';
		$('#FileUpModalLabeltank').html('Documents -Tank:'+tankNo);
	}else if(upload_type == 'tank_gallery'){
		var type = 'Tank_gallery';
		$('#FileUpModalLabel').html('Tank Gallery :'+tankNo);
	}else if(upload_type == 'tank_periodic_test'){
		var type = 'Tank_periodic_test';
		$('#FileUpModalLabel').html('Tank Periodic Test :'+tankNo);
	}
	else{
		var type = 'Tank_on_hire';
		$('#FileUpModalLabel').html('On hire Agreement Documents -Tank:'+tankNo);
	}
	
	tankFileList(id,type);
	$("#upload_btn").attr('disabled','disabled');
	$('#file_to_upload').val('');
	$('#progress_num_uf').hide();
	$('#file_desc,#JobfileName').val('');
	$('#fileSize,#fileType,#fileExist').html('');
	
});

/**
 * document list in popup
 */
function tankFileList(id,type){
	var url = appHome+'/tank-core-new/common_ajax';
	$.ajax({
		type: "POST",
		cache: false,
		url: url,
		dataType: "text",
		data: ({
			'id' :id,
			'type' : type,
			'action_type' : 'list_upload_docs',
			'pageType' : 'listing-page'
		}),
		beforeSend: function() {
            // setting a timeout
        	$('#fileAttachmenttank').html("<td colspan='5'><div class='text-center'><img src="+$('#loaderpath').val()+"></div></td>");
        },
		success: function(result)
		{
			$("#file_to_upload").val("");
			$("#fileName,#tank_file_upload_textarea").val("");
			$("#upload_btn").attr('disabled','disabled');
			
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
		    $('.tablesorter-filter-row').hide();
			$('.delete-tank-doc').hide();
		}
	});
}

function docloaderChangeTank(){

	var plIdArr = [];
	$('.doc-spinner-tank').each(function() {
	    var pl_id = $(this);
	    plIdArr.push($(this).data('tankid'));
	});
	if(plIdArr.length > 0){
		$.ajax({
			type: 'POST',
			dataType: "json",
			url: appHome+'/tank/common_ajax',
		    data: {
					'tank_ids' : plIdArr,
					'action_type' : 'fill_doc_icon_tank',
				  },
			success: function(response){
				$.each(response, function(key,value) {
					var changeElement = $('.doc-spinner-tank[data-tankid="'+value+'"]');
					changeElement.addClass("fa-file").removeClass("fa-spinner fa-spin");
				});
				$('.doc-spinner-tank').addClass("fa-file-o").removeClass("fa-spinner fa-spin");
			}
		});
	}
}

$(".tank_gp").hide();
$(document).on('change', '#businesstype-filter', function() {
	if (($("#businesstype-filter option[value=SPOT]:selected").length > 0) || ($("#businesstype-filter option[value=TPT]:selected").length > 0)){
		$("#tank-group-filer").val("").chosen().trigger("chosen:updated");
		$(".tank_gp").hide();
	}else{
		$(".tank_gp").show();
	}
	if($('#businesstype-filter').val() == ""){
		$("#tank-group-filer").val("").chosen().trigger("chosen:updated");
		$(".tank_gp").hide();
	}
});

function displayJobTemplateActivities(tip_exist, activity_job_number, order){
	
	if(tip_exist == '1'){
		$('.hidden-activities-list').html('');
		var h = $('.overlay-complete-loader').height();
		if(h == 0) { h = 100; }
		$('.btl_overlay').height(h);  
		$('.btl_relative').show();
		$.ajax({
	        type: 'POST',
	        url: appHome+'/tank/common_ajax',
	        data: {
	        	'job_number'  : activity_job_number,
	        	'order'		  : order,
	        	'action_type' : 'view_hidden_activities'
	        },
	        success: function(response){
	        	if(response){
	        		$('#hidden_activities').modal('show');
		        	$('.btl_relative').hide();
		        	$('.hidden-activities-list').html(response);
		        	
		        	$('.datepicker').datepicker({
						dateFormat: btl_default_date_format,
						changeMonth: true,
						changeYear: true,
						inline: true,
						startDate: 0
					});
				}
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	    });
	}
}

$(document).on('click', '.save-plan-filter', function(){

	var texttype = $('#filter-text-id').val().trim();
	var texttypeName = $('#filter-text').val().trim();
	if(texttype != "" && texttypeName != ""){
		$('.save-plan-filter span').removeClass('fa-plus fa-floppy-o fa-search fa-spinner fa-spin').addClass('fa-spinner fa-spin');
		$('.save-plan-filter').attr('disabled', true);
		texttype = texttype.split(',');
		if(texttype[1] == 'search' && texttype[0] != 0){
			getfilterData(texttype[0]);
		}else{
			savefilterData();
		}
	}else{
		$('#filter-text-id').parent().addClass('highlight');
	}
});

function savefilterData(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        url: appHome+'/tank/save_get_filter_data',
        data: $('#search-form').serialize(),
        success: function(response){

        	if(response.id == 0){
        		setbuttonstyle(response.id, 'add');
        	}else{
        		setbuttonstyle(response.id, 'update');
        	}
        	if(response.type == 'success'){
        		var type = BootstrapDialog.TYPE_SUCCESS;
        	}else{
        		var type = BootstrapDialog.TYPE_WARNING;
        	}
        	BootstrapDialog.show({  title: 'Save Tank Plan Filter', 
					        		message : response.msg, 
					        		cssClass: 'small-dialog',	
					        		type: type});
        },
        error: function(response){
        	setbuttonstyle(0, 'add');
        	BootstrapDialog.show({title: 'Failed', message : 'Failed to Fetch details. Try again later.'});
        }
     });
}

function getfilterData(id){
	$.ajax({
        type: 'POST',
        dataType: "json",
        url: appHome+'/tank/common_ajax',
        data: {
				'filter-id' : id,
				'action_type' : 'get_saved_tp_filter',
		},
        success: function(response){
        	var multiIds = "";
        	var arrtrigger = ['activity-filter','customer_group_plan','businesstype-filter'];
        	var triggerIds = "";
        	$.each(response, function(i, obj) {
	    			if( $.isArray(obj) && $('#'+i).hasClass('multi-sel-ctrl')){
	    				if(obj.length > 0){
	    					$('#'+i).val(obj);
	    					if(jQuery.inArray(i, arrtrigger) !== -1){
	    						triggerIds += "#"+i+',';
	    					}
	    				}else{
	    					$('#'+i).val('');
	    				}
	    				multiIds += "#"+i+',';
	    				
	    			}else{
	    				$('#'+i).val(obj);
	    			}
	    	});
        	if(multiIds != ""){
        		multiIds = multiIds.slice(0, -1);
        		$(multiIds).multiselect("refresh");
        	}
        	if(triggerIds != ""){
        		triggerIds = triggerIds.slice(0, -1);
        		$(triggerIds).trigger("change");
        	}
        	setbuttonstyle(id, 'update');
        },
        error: function(response){
        	setbuttonstyle(0, 'add');
        	BootstrapDialog.show({title: 'Failed', message : 'Failed to Fetch details. Try again later.'});
        }
      });
}

function setbuttonstyle(id, type){
	if(id == 0 && type == 'add'){
		var addClass = 'fa-plus';
	}else if(id != 0 && type == 'update'){
		var addClass = 'fa-floppy-o';
	}else{
		var addClass = 'fa-search';
	}
	$('.save-plan-filter span').removeClass('fa-plus fa-floppy-o fa-search fa-spinner fa-spin').addClass(addClass);
	$('.save-plan-filter').attr('disabled', false);
	$('#filter-text-id').val(id+','+type);
}

$(document).ready(function(){

	if($("#filter-text").length > 0){
		$('#filter-text').autocomplete({
		  source: function(request, response) {
    			$.getJSON(appHome+'/tank/get_tank_filter', { 
    										onlyme: ($('#saved-my-filter').is(':checked') ? 1 : 0),
    										term: $('#filter-text').val(),
    										}, 
              			 response);
  		  },
	      minLength: 0,
	      type: "POST",
		  select: function (event, ui) {
			$(this).val(ui.item.label);
			$('.save-plan-filter span').removeClass('fa-plus fa-floppy-o fa-search fa-spinner fa-spin').addClass('fa-spinner fa-spin');
			$('.save-plan-filter').attr('disabled', true);
			getfilterData(ui.item.value);
			return false;
		  },
		  change: function (event, ui) {
	         /*if (ui.item === null) {
				setbuttonstyle(0);
	         }*/
		  },
		  response: function( event, ui ) {
		  	
		  	var txtval = $('#filter-text').val().trim();
		  	var sval = 0;
		  	if(ui.content.length > 0){
		  		$.each(ui.content, function(i, obj) {
	    			if(obj.label == txtval){
	    				sval = obj.value;
	    				if($('#filter-text-id').val().indexOf("update") === -1){
		  					setbuttonstyle(sval, "search");
		  				}
		  				return false;
	    			}else{
	    				if($('#filter-text-id').val().indexOf("update") === -1){
	    					setbuttonstyle(0, "add");
	    				}
	    			}
	    		});
		  	}else{
		  		if($('#filter-text-id').val().indexOf("update") === -1){
		  			setbuttonstyle(sval, "add");
		  		}
		  	}
		  	
		  }
		 }).focus(function() {
		 	$('#filter-text-id').parent().removeClass('highlight');
		 	if($('#filter-text').val().trim() == ""){
			 	$(this).autocomplete('search');
			 	setbuttonstyle(0, "add");
		 	}
		});
	 }
});

var interModalObj = {};

//Intermodal Booking form
$(document).on('click', '.intermodel' ,function(e){
	e.preventDefault();
	var pid = $(this).attr('data-plan_id');
	interModalObj = $(this);

	if($(this).parents().find('.tank_plan_checkbx').prop('checked')){
		BootstrapDialog.show({title: 'Booking', message : "Already Booked", type: BootstrapDialog.TYPE_WARNING,cssClass: 'small-dialog'});
	} else {
		var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
		var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';
		$("#intermodel_modal_div").html(ajaxLoader);
		$(".intermodel_modal_submit").attr('disabled','disabled');		
		
		$("#intermodel_modal").modal('show');
			
		$.ajax({
			type: 'POST',
			url: appHome+'/tank/common_ajax',
			data: {
				'action_type' : 'intermodel_modal',
				'pid' : pid
			},
			success: function(response){
				$("#intermodel_modal_div").html(response);
				$(".intermodel_modal_submit").removeAttr('disabled');
			},
			error: function(response){
			}
		});
	
	}

});

var interModalBookingMsg = "";
var percentComplete = 0;

//Intermodal Booking
$(document).on('click', '.intermodel_modal_submit' ,function(){
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
	
	highlight($('#auto_from_town'), '');
	highlight($('#auto_to_town'), '');
	highlight($('#auto_supplier_code'), '');
	highlight($('#im_plan_date'), '');
	highlight($('#tank_status'), '');
	
	var check_fields = (success.indexOf(false) > -1); 
	if(check_fields !== true){
		$(".intermodel_modal_submit").attr('disabled','disabled');
		percentComplete = 20;
		interModalBookingMsg = "";
		showProgress('continue','success');	
		bookAndGenSuppInstruction();
	}
});

function bookAndGenSuppInstruction(){
	$.ajax({
		type: 'POST',
		dataType: "json",
		url: appHome+'/tank/common_ajax',
		data: $("#intermodel_modal_form").serialize(),
		success: function(response){
			interModalBookingMsg += "<br>- " + response.message;
			
			if(response.status == "success"){
				if(response.isbooked == "Yes"){
					percentComplete = 40;
					showProgress('continue','success');
					genDGDInstruction();
					$("#hdn_instruction_file").val(response.file + '|' + response.fileid);
				} else {
					percentComplete = 100;
					showProgress('update-only','success');
				}
				
			} else {
				showProgress('stop','failed');
			}
		},
		error: function(response){
			interModalBookingMsg += "<br>- Error while generating Instruction/updating record.";
			showProgress('stop','failed');
		}
	});
}

function genDGDInstruction(){
	
	var tankno = $("#hdn_tankno").val();
	var is_hazards_prod = $("#hdn_is_hazards_prod").val();
	var pl_jobno = $("#hdn_pl_jobno").val();
	var pl_id = $("#hdn_pl_id").val();
	var pl_activity = $("#hdn_pl_activity").val();	
	var tank_status = $("#tank_status").val();
	var special_instr = $("#special_instr").val();
	
	$.ajax({
		type: 'POST',
		dataType: "json",
		url: appHome+'/tank/common_ajax',
		data: {
			action_type : 'generate_dgd_report',
			tankno : tankno,
			is_hazards_prod :is_hazards_prod,
			pl_jobno : pl_jobno,
			pl_id : pl_id,
			pl_activity : pl_activity,
			tank_status : tank_status,
			special_instr : special_instr,
		},
		success: function(response){
			if(response.message != ""){
				interModalBookingMsg +=  "<br>- " + response.message;
			}
			if(response.status == "success"){
				percentComplete = 60;
				showProgress('continue','success');
				$("#hdn_dgd_file").val(response.file + '|' + response.fileid);
				sendBookingMain();
			} else {
				showProgress('stop','failed');
			}
		},
		error: function(response){
			interModalBookingMsg += "<br>- Error while generating DGD.";
			showProgress('stop','failed');
		}
	});
}


function sendBookingMain(){
	
	var pl_id = $("#hdn_pl_id").val();
	var pl_jobno = $("#hdn_pl_jobno").val();
	var supplier_code = $("#auto_supplier_code").val();
	var from_town = $("#auto_from_town").val();
	var to_town = $("#auto_to_town").val();
	var instr_file = $("#hdn_instruction_file").val();
	var dgd_file = $("#hdn_dgd_file").val();
	var tankno = $("#hdn_tankno").val();
	var activity = $("#hdn_pl_activity").val();
	
	$.ajax({
		type: 'POST',
		dataType: "json",
		url: appHome+'/tank/common_ajax',
		data: {
			action_type : 'mail_intermodal_booking',
			pl_jobno : pl_jobno,
			supplier_code : supplier_code,
			from_town : from_town,
			to_town : to_town,
			instr_file : instr_file,
			dgd_file : dgd_file,
			pl_id : pl_id,
			tankno : tankno,
			activity : activity,
		},
		success: function(response){
			interModalBookingMsg +=  "<br>- " + response.message;
			if(response.status == "success"){
				percentComplete = 100;
				showProgress('continue','success');
			} else {
				showProgress('stop','failed');
			}
		},
		error: function(response){
			interModalBookingMsg += "<br>- Error while sending mails.";
			showProgress('stop','failed');
		}
	});
}

var statusCheckBit = 0;
function showProgress($process, $status){
	$(".progress").show();
	$('#intermodal-progressbar').css('width',percentComplete.toString()+ '%');
	$('#intermodal-progressbar').data('aria-valuenow',percentComplete.toString());
	$('#intermodal-progressbar').html(percentComplete.toString() + '%');
	
	if($status == "success"){
		statusCheckBit += 1;
	} else {
		statusCheckBit -= 1;
	}
	
	if($process == "continue" || $process == "update-only"){
		if(percentComplete == 100){
			
			if($process == "update-only"){
				$message = "Successfully updated booking data";
				$msgtype = BootstrapDialog.TYPE_SUCCESS;
			} else if(statusCheckBit == 4){
				$message = "Successfully Booked." + interModalBookingMsg;
				$msgtype = BootstrapDialog.TYPE_SUCCESS;
			} else {
				$message = "Booking was partially successful." + interModalBookingMsg;
				$msgtype = BootstrapDialog.TYPE_WARNING;
			}
			
			$("#intermodel_modal").modal('hide');
			BootstrapDialog.show({title: 'Booking', message : $message, type: $msgtype, closable: false, buttons:[{
                label: ' OK ',
                action: function(dialogRef){
					refreshPage();
                    dialogRef.close();
                }
            }]});
			statusCheckBit = 0;
		}
	} else {
		$('#intermodal-progressbar').removeClass('progress-bar-success').addClass('progress-bar-danger');	
		$(".intermodel_modal_submit").removeAttr('disabled');
		
		$message = "Booking failed/partially successful." + interModalBookingMsg;
		BootstrapDialog.show({title: 'Booking', message : $message, type: BootstrapDialog.TYPE_DANGER,closable: false, buttons:[{
                label: ' OK ',
                action: function(dialogRef){
					refreshPage();
                    dialogRef.close();
                }
            }]});
		$(".progress").fadeOut(2000);
		statusCheckBit = 0;
	}
}

function refreshPage(){
	if($('#page_name').val() == "tank-plan-index"){
		getTankPlans('#search-form'); //reload tank plan 
	} else {
		window.location.reload(true);					
	}
}

//Autocomplete function to fetch the Town
$(document).on('keydown.autocomplete', '#auto_from_town, #auto_to_town', function() {
     $(this).autocomplete({source:  appHome+'/tank/autocomp_town',
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
		      $(this).val(ui.item.value);
		  },
		  change: function (event, ui) {
	         if (ui.item === null) {
	        	 	BootstrapDialog.show({title: 'Error', message : 'Not a valid Town',
					buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
	            $(this).val('');
	         }
		  }
	});
});

//Autocomplete function to fetch the Supplier
$(document).on('keydown.autocomplete', '#auto_supplier_code', function() {
	$(this).autocomplete({source:  appHome+'/tank/autocomp_supplier',
	      source:  appHome+'/tank/autocomp_supplier',
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
		       $(this).val(ui.item.value);
		  },
		  change: function (event, ui) {
	         if (ui.item === null) {
	        	 	BootstrapDialog.show({title: 'Error', message : 'Not a valid Town',
					buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
	            $(this).val('');
	         }
		  }
	});
});

function getDamagedIcon(){

	var plan_ids = [];
	var valid_plans = [];
	var base_path = appHome.replace('erp.php','');
	var major_path = base_path+'images/Damaged_Major.png';
	var minor_path = base_path+'images/Damaged_Minor.png';
	
	$('.damage-img').each(function() {
		if($(this).data('pl-id')){
			if(plan_ids.indexOf($(this).data('pl-id')) == -1){
	    		plan_ids.push($(this).data('pl-id'));
	    	}
	    }
	});

	if(plan_ids.length > 0){
		$.ajax({
			type: 'POST',
			dataType: "json",
			url: appHome+'/tank/common_ajax',
		    data: {
				'plan_ids' : plan_ids,
				'action_type' : 'get_damaged_icon',
			},
			success: function(response){
				if(response){
					$.each(response, function(key,value) {
						$('.tank_'+key).removeClass('fa-spinner fa-spin');
						$('.tank_'+key).attr("data-severity",value.damage_severity);
						$('.tank_'+key).attr("data-from-date",value.from_date);
						$('.tank_'+key).attr("data-to-date",value.to_date);
						if(value.damage_severity == 'Major'){
							$('.tank_'+key).attr("src",major_path);
						}
						else{
							$('.tank_'+key).attr("src",minor_path);
						}
						valid_plans.push(parseInt(key));
						
					}); 
					$('.damage-img').removeClass('fa-spinner fa-spin');
					$.each(plan_ids, function(index, plan_id) {
						if(valid_plans.indexOf(plan_id) !== -1){
							// pass
						}
						else{
							$('.tank_'+plan_id).remove();
						}
					});
				}
				else{
					$('.damage-img').remove();
				}
			}
		});
	}
	
}

$(document).on('hover', '.damage-img', function(){
	var severity = $(this).data('severity'); 
	var from_date = $(this).data('from-date'); 
    $(this).css('cursor', 'pointer');
	$('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
	data = "<table style='border-collapse: unset;background-color:#ddd;border-radius:3px;margin:1px;align:center;'><tr>";
	data +="<td class='center-cell' style='background-color:white;'>Severity: "+severity+"</td></tr>"
	data +="<tr><td class='center-cell' style='background-color:white;'>From Date: "+from_date+"</td></tr>"
	data  += "</table>"
	$(this).attr('data-original-title',data);
	$(this).tooltip('show');
});

$(document).on('click','.damage-img', function(e){
	var tank_id = $(this).data('tank-id');
	var tank_number = $(this).data('tank-number');
	$('#damage-document-head').html('Documents - Tank:'+tank_number);
	$('#DamageFileUpTankModal').modal('show');
	tankDamagedFileList(tank_id);
});

/**
 * document list in popup
 */
function tankDamagedFileList(tank_id){
	
	var url = appHome+'/tank-core/common_ajax';
	$.ajax({
		type: "POST",
		cache: false,
		url: url,
		dataType: "text",
	    data: {
	        'tank_id' : tank_id,
	        'page' : 'tank-plan',
	        'action_type' : 'get_damaged_info'
	    },
		beforeSend: function() {
            // setting a timeout
        	$('#file_list').html("<div class='text-center'><img src="+$('#loaderpath').val()+"></div>");
        },
		success: function(result){
			$('#file_list').html(result);
			$('.damged-check').hide();
			$('.action').hide();
			$("#file-list-table").tablesorter();
			$("#file-list-table").trigger("update");
	    	var sorting = [[1,0]];
	    	$("#file-list-table").trigger("sorton",[sorting]);
			$('#file-list-table').tablesorter({
		         widthFixed: true,
		         widgets: ['zebra', 'filter'],
		         widgetOptions: {
		           filter_reset: '.reset'
		         },
		    })
		    $('.tablesorter-filter-row').hide();
		}
	});
}

$(document).on('change','#job-sea-type',function(){
	var sea_type = $(this).val();
	if(sea_type == 2 || sea_type == ''){
		$('#imco-term').multiselect("enable");
	}
	else{
		$('#imco-term').multiselect("deselectAll", false).val('').multiselect("refresh");
		$('#imco-term').multiselect("disable");
	}
});


//When its a Haulage supplier do not let to remove customer
/*
if($('#page_name').val() == "tank-plan-form" || $('#page_name').val() == "tank-plan-index"){
	$(document).on('change','#supplier',function(){
		if($("#supplier").val() == ""){
			$("#supplier").val('TBC').chosen().trigger("chosen:updated");
		}
	});
}
*/