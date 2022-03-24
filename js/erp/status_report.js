$(document).ready(function(){
	var cust_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please select the customer code.</div>';
	var alert_success = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-thumbs-o-up"></i>Successfully saved !!!</div>';
	function initOrderingNew() {
	    var $supplierRows = $('#status_report_table').find('.report-each-row');
	    $supplierRows.find('.order').css({ visibility: 'visible' });
	    $supplierRows.first().children('td:first').find('.order--up').css({ visibility: 'hidden' });	    
	    $supplierRows.last().children('td:first').find('.order--down').css({ visibility: 'hidden' });
	}
	function highlightRow() {
		    var $this = $(this);
		    $this.css({ outline: '2px dashed rgba(0, 255, 0, 0.8)' });
		    setTimeout(function() {
		      $this.css({ outline: 'none' });
		    }, 1000);
	}
	initOrderingNew();
	
	$('table').on('click', 'a.remove-tank', function(e) {
	    e.preventDefault();
	    var $this = $(this);
	    var tankNo = $this.data('tank');
	    var message = 'Are You Sure want to remove tank <strong>'+tankNo+ '</strong> ?';
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
		             cssClass: 'btn-danger',
		             action: function(dialogItself){
	     		        $('.bootstrap-dialog-footer-buttons > .btn-danger').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		     		    $('.bootstrap-dialog-footer-buttons > .btn-danger').attr('disabled','disabled');
		         	    $row = $this.parents('.report-each-row');
		         	    $row.css({
		         			  'color': '#fff',
		         			  'background-color': '#ffb3b3'
		         		  })
		         		 $row.fadeOut(1000, function() {
		         			dialogItself.close();
		         			$("#tank_no_filter option[value='"+tankNo+"']").prop("selected", false);
			     		    $(".multi-sel-ctrl").multiselect('refresh');
		         			$row.remove();
		         			initOrderingNew();
		         			if($('.report-each-row').length == 0){
		         				 var noRowMsg = '<div class="alert alert-warning alert-dismissable">'
		         					 			+'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'
		         					 			+'<i class="fa fa-exclamation-circle"></i> <strong>Sorry</strong>, No Records Found.'
		         					 			+'</div>'
		         				 $('#doublescroll').html(noRowMsg);
		         				 $('#btn_search_list,#btn_filter').attr('disabled', true);
		         				 $('#btn_export').attr('disabled', true);
		         			}
		         			
		         		 });
		         	    
		             }
	         }]
	     });
});
	
	$('table').on('click', 'a.order--down', function(e) {
		    e.preventDefault();
		    var $this = $(this),
		    	$row = $this.parents('.report-each-row'),
		    	$nextRow = $row.next();
		    $nextRow.after($row); 
		    highlightRow.call($row);
		    initOrderingNew();
	});
	$('table').on('click', 'a.order--up', function(e) {
	    e.preventDefault();
	    var $this = $(this),
        	$row = $this.parents('.report-each-row'),
        	$nextRow = $row.prev();
	    $nextRow.before($row);
	    highlightRow.call($row);
	    initOrderingNew();
	});
	//To hide while customer group is selected
	if($("#customer_group").val() != ''){
		 $(".grouphide").hide();
	}else{
		$(".grouphide").show();
	}
	
	$('.select-box,.multi-sel-ctrl').change(function(){
		$('.no-record-msg').html('');
		var custCode = $('#customer_code_filter').val();
		var tankNo = $('#tank_no_filter').val();
		if(custCode != "" || tankNo != null){
			$('#btn_search_list,#btn_filter').removeAttr('disabled');
			$('#btn_export').removeAttr('disabled');
		}else{
			$('#btn_search_list,#btn_filter').attr('disabled', true);
			$('#btn_export').attr('disabled', true);
		}
	});
	
	$(".time-picker").click(function (e) {
		$('#plan_time').focus();
	})
	
	$(".button-press").click(function (e) {
		$('#key_identifier').val($(this).data('type'));
	})
	
	$("#btn_search_list").click(function (e) {
		 e.preventDefault();
		 var jobArr = [];
		 var tankNoArr = [];
		 var bussinessType = $('#businesstype-filter').val();
		 var customerGroup = $('#customer_group').val();
		 var custCode = $('#customer_code_filter').val();
		 var tankNo = $('#tank_no_filter').val();
		 var exportType = $('#export_type_filter').val();
		 var date = $('#plan_date').val();
		 var time = $('#plan_time').val();
		 var customerTeam = $('#customer_team').val();
		 
		 $(".report-each-row").each(function( index ) {
			  var jobNo = $(this).data('job-no');
			  var tankNo = $(this).data('tank-no-tr');
			  if(jobNo != ''){
				  jobArr.push(jobNo);
			  }
			  if(tankNo != ''){
				  tankNoArr.push(tankNo);
			  }
		});
		 $.ajax({
				type: "POST", 
				timeout: 90000, // sets timeout to 90 sec
				beforeSend: function() {
					$('#btn_search_list').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
     		        $('#btn_search_list').attr('disabled','disabled');
		        },
				url: appHome+'/status-report/common_ajax',
				data: ({
					'action_type':'save_report_data',
					'bussinessType' : JSON.stringify(bussinessType),
					'customerGroup' : customerGroup,
					'custCode' : JSON.stringify(custCode),
					'tankNo' : JSON.stringify(tankNoArr),
					'exportType' : exportType,
					'jobArr' : JSON.stringify(jobArr),
					'date'	: date,
					'time'	: time,
					'customerTeam' : customerTeam
				}),  
				success: function(result){
					if(result == 1){
						// $('#supplier_compare_rate_form').submit();
						$('#btn_search_list').html("<span class='glyphicon glyphicon-ok-sign'></span>Save");
						$('#btn_search_list').removeAttr('disabled');
						$('html, body').animate({ scrollTop: 0 }, 400);
						$('#response').empty().prepend(alert_success).fadeIn();
						
					}else{
			 		     $('html, body').animate({ scrollTop: 0 }, 400);
			 		     $('#response').empty().prepend(alert_error).fadeIn();
					}
				},
				 error: function(response){
	 		          $('html, body').animate({ scrollTop: 0 }, 400);
	 		          $('#response').empty().prepend(alert_error).fadeIn();
	 		        }
			});
		 
	});
	

	$("#get_tank_number").click(function (e) {
		
		e.preventDefault();
		$('.full_loader').show();
		$('.tank_list_loader').addClass('fa-spin');
		$('#response').empty();
		setTimeout(function(){ 
			$(this).prop('disabled', true);
			$("#btn_filter").prop('disabled', true);
			$("#btn_search_list").prop('disabled', true);
			$("#btn_export").prop('disabled', true);
			getTankNumbers();
			$('.tank_list_loader').removeClass('fa-spin');
		}, 50);
		
	});
	function getTankNumbers(){
		$('.full_loader').show();
		$("#tank_no_filter").val("");
		$("#tank_no_filter").multiselect("refresh");
	var custCode = $("#customer_code_filter").val();
	var bussinessType =$("#businesstype-filter").val();
	if(custCode != "" && custCode != null){
		$.ajax({
			type: "POST", 
			timeout: 90000, // sets timeout to 90 sec
			async : false,
			beforeSend: function() {
	        	$('.tank_name_loader').show();
	        },
			url: appHome+'/status-report/common_ajax',
			data: ({
				'action_type':'get_tank_numbers',
				'custCode' : custCode,
				'bussinessType' : bussinessType
			}),  
			success: function(result){ 
				var obj = JSON.parse(result);
				var count = 0;
				 $.each(obj, function (index, data) { count = count + 1;					       
				        $("#tank_no_filter option[value='" + obj[index] + "']").attr("selected", true);
				 })
				 $("#tank_no_filter").multiselect("refresh");
				 $('.tank_name_loader').hide();
				 $("#get_tank_number").prop('disabled', false);
				 $("#btn_filter").prop('disabled', false);
				 $("#btn_search_list").prop('disabled', false);
				 $("#btn_export").prop('disabled', false);
				 $('.full_loader').hide();
				 if(count > 1){
					 $(".multi-sel-ctrl").change(); 
				 }
				}  
		});
	}else{
		$('.full_loader').hide();
		$('.report-tbl').hide();
		$('#response_count').hide();
		$('.record-empty').show();
		$("#btn_filter").prop('disabled', false);
		$("#btn_search_list").prop('disabled', false);
		$("#btn_export").prop('disabled', false);
		$('html, body').animate({ scrollTop: 0 }, 400);
        $('#response').empty().prepend(cust_error).fadeIn();
	}
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
	if($('.bor_table tr').length > 10){
		DoubleScroll(document.getElementById('doublescroll'));
	}  

	/**
	 * limit the control
	 */
	$(".multi-sel-ctrl").change(function () {
		var optioncount = $(this).find('option:selected').length;
		var optlimit = 300;
		var count = 1;
		var $this = $(this);
		
	    if(optioncount > optlimit) {
	    	$(this).find('option:selected').each(function(){
	    		if(count > optlimit){
	    			$(this).prop('selected',false);
	    		}
	    		count +=1;
	    	})
	    	BootstrapDialog.show({title: 'Customer Limt', message : 'Selection is limited to 300 items only.',
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

	//On change date_from
	$("#date_from_filter, #date_to_filter").change(function () {
		$("#period_filter").chosen().val("").trigger("chosen:updated");
	});

	//On change period
	$("#period_filter").change(function (){
		$("#date_from_filter").val("");
		$("#date_to_filter").val("");
	});
	
	$('#customer_group').change(function(e){
		
		if($("#customer_group").val() != ''){
			 $(".grouphide").hide();
			if($("#customer_group").val() == "2"){
				$('#customer_team').val("11").trigger('chosen:updated');
			}
		}else{
			$(".cust_group_loader").show();
			$(".grouphide").show();
			
			setTimeout(function(){
				$("#tank_no_filter").val("");
				$("#tank_no_filter").multiselect("refresh");
				
				$(".cust_group_loader").hide();
			}, 50);
			$('.report-tbl').hide();
			$('#response_count').hide();
			$('#response').hide();
			getCustomerCode();
		}
		$("#btn_filter").prop('disabled', false);
		$("#btn_search_list").prop('disabled', false);
		$("#btn_export").prop('disabled', false);
	});
	$('.reset_default').click(function(e){
		e.preventDefault();
		$('.full_loader').show();
		setTimeout(function(){ 
			$("#businesstype-filter").val("MAN");
			$("#tank_no_filter").val("");
			$(".multi-sel-ctrl").multiselect("refresh");
			$('#customer_group').val("2");
			$('#customer_team').val("11");
			//getCustomerCode();
			//getTankNumbers();
			$('.full_loader').show();
			$("#btn_filter").click();
		}, 50);
	
	});
	$('.reset_search').click(function(e){
		e.preventDefault();
		$('.full_loader').show();
		$('.no-record-msg').hide();
		setTimeout(function(){ 
			$("#businesstype-filter").val("");
			$("#tank_no_filter").val("");
			$("#customer_code_filter").val("");
			$(".multi-sel-ctrl").multiselect("refresh");
			$('#customer_group').val("");
			$('#customer_team').val("");
			$('.chosen').chosen().trigger("chosen:updated");
			$("#plan_date").val("");
			$("#plan_time").val("");
			$('.full_loader').hide();
			//$("#btn_filter").click();
			$('.report-tbl').hide();
			$('#response_count').hide();
			if($("#customer_group").val() != ''){
				 $(".grouphide").hide();
			}else{
				$(".grouphide").show();
			}
			$('.norecord').show();
		}, 50);
	
	});
	$('#btn_filter').click(function(e){
		e.preventDefault();
		if(($("#customer_group").val() == '') && ($("#tank_no_filter").val() == null)){
			BootstrapDialog.show({title: 'Customer Limt', message : 'Customer Group or Tank No should not be empty.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			}); 
		}else{
			$("#supplier_compare_rate_form").submit();
		}
		
	});
	
	function getCustomerCode(){
		var grouptype = $('#customer_group').val();
		var customerElement = $('#customer_code_filter').attr('id');
		$("#"+customerElement).val("");
		$("#"+customerElement).multiselect('enable');
		$("#"+customerElement).multiselect("refresh");
		var cust_val_type =$('#customer_group').data('custtype');
		
		if(!$.isArray(grouptype)){
			grouptype = [grouptype];
		}
		var url = appHome;
		if(grouptype != "" && grouptype[0] != 0){
			$.ajax({
				type: "POST", 
				timeout: 90000, // sets timeout to 90 sec
				async: false,
				beforeSend: function() {
		        	$('.cust_name_loader').show();
		        },
				url: url+'/jobtemplate-quotes/common_ajax',
				data: ({
					'action_type':'get_customer_from_group',
					'grouptype' : grouptype
				}),  
				success: function(result){ 
					var obj = JSON.parse(result);
					if(!$.isEmptyObject(obj)){
						$('.chosen').chosen().trigger("chosen:updated");
						$("#"+customerElement+" option:selected").removeAttr("selected");
						var count=0;
						$.each(obj, function (key, value) { count=count+1;
							var selType =  value;
							$("#"+customerElement+" option[value='" + selType + "']").attr("selected", true);
						})
					}else{
						$("#"+customerElement).val("");
					}
					 $("#"+customerElement).multiselect("refresh");
					 $('.cust_name_loader').hide();
					 $('.full_loader').hide();
					 if(count > 1){
						 $(".multi-sel-ctrl").change(); 
					 }
					}  
			});
		}
	}

});//end of document ready