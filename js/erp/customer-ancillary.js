var previous_valid_date = '';
$( document ).ready(function() {
	
	/**
	 * select all option in listing page
	 */
	$(document).on('click', '.customerancillary-select-all', function(e) {
		var status = this.checked; // "select all" checked status
		$('.customer_ansillary_checkbox:visible').each(function(){ //iterate all listed checkbox items
	       this.checked = status; //change ".checkbox" checked status     
	   });		
	});
	
	/**
	 * for filter show and hide
	 */
	$('#search_box_bttn').click(function(){
	    $('#search_box_bttn i').toggleClass('fa-search-minus fa-search-plus');
	    $('.search_box').slideToggle("slow");
	    $('#response,#response_count').slideToggle("fast"); 
	});
	
	$(document).on('change', '.custom-page-pagesize', function(e) {
		var pagelimit = $(this).val();
		$('#pagesize').val(pagelimit);
		$('#customer_index_listing').submit();
	});
	
	function decimalNumberJobtemplate(data) {
		var re = /^-?\d+(\.\d{1,2})?$/;
	    var result = 0;
	    
	    if(data.value != "")
	    {
		    result = parseFloat(data.value).toFixed(2);
		    
		    if(!re.test(data.value))
		    {
		    	if(result != 'NaN'){
		    		$(data).val(result);
		    	} else {
		    		$(data).val('');
		    	}
		    } else {
		    	if(result == 0) $(data).val(0);
		    	if(result > 99999999) {
		    		alert('You have exceeded the maximum limit!\n Your entered value will be truncated to 8 digits.');
		    		result = result.substring(0, 8);
		    	} else if(result < -9999999) {
		    		alert('You have crossed the minimum allowable limit!\n Your entered value will be truncated to 7 digits.');
		    		result = result.substring(0, 8);
		    	} 
		    	 result = parseFloat(result).toFixed(2);
		    	 $(data).val(result);
		    }
	    }
	}
	
	if($('#customer_quote_page').val() == 'customer_quote_page'){
		getquoteList();
		switch_currency_icons($('#currency'),'currency-fa');
		
		$("#div-disable-a-link .custom-pagination a").on("click", function(){
			checkboxSelectall();
		});
		
		$(document).on('click', '.customer_ansillary_checkbox', function(e) {
			checkboxSelectall();
		});
		
		
		
		
	}
	/**
	 * function for select all checkboxes
	 */
		
	function checkboxSelectall(){
		
		setTimeout(
				  function() 
				  {
					    var checked = $('.customer_ansillary_checkbox:visible:checked').length;
						var Unchecked = $('.customer_ansillary_checkbox:visible').length;
						if((checked == Unchecked) && (Unchecked > 0) && (checked > 0)){
							$('.customerancillary-select-all').prop('checked',true);
						}else{
							$('.customerancillary-select-all').prop('checked',false);
						}
				  }, 50);
		
		
	}
	function printTableData(jsonData){
		var table = '';
		if(jsonData.length > 0){
			$.each(jsonData, function(i, item) {
			var to_date = item.qe_surcharge_no_end_validity == 1 ? ' Undisclosed' : item.qe_surcharge_date_to;
			table +=  "<tr>" +
						"<td><b>"+item.q_number+"<b></td>" +
						"<td>"+item.cust_name+"</td>" +
						"<td>"+item.q_product+"</td>" +
						"<td class='text-center'>"+item.q_curr+"</td>" +
						"<td class='text-right'><i class='fa fa-"+item.q_curr.toLowerCase()+" '></i> "+item.qe_fuel_surcharge_amt +"</td>" +
						"<td class='text-right'>"+item.qe_fuel_rate+"% </td>" +
						"<td class='text-center'>"+item.qe_sucharge_date+"</td>" +
						"<td class='text-center'>"+to_date+"</td>" +
						"<td>"+item.q_surcharge_type+"</td>" +
						"<td class='text-right'><i class='fa fa-"+item.q_curr.toLowerCase()+" '></i> "+item.q_surcharge_total+"</td>" +						
						"<td class='text-center'><input type='checkbox' data-custid='"+item.cust_id+"' data-id='"+item.q_number+"' class='small-checkbox customer_ansillary_checkbox'></td>" +
						
					"</tr>";
				
			});
		}else{
			table = '<tr><td colspan="10">'+
						'<div class="alert alert-warning alert-dismissable">'+
				  			'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'+
				  			'<i class="fa fa-exclamation-circle"></i> <strong>Sorry</strong>, there are no Job Templates.'+
				  		'</div>'+
				  	'</tr></td>';
		}
		
		return table;
	}
	
	function getquoteList(){	
		$('#table_data').html('');
		var cust_id = $('#customer_id').val();
		var fromDate =  $('#date_from').val();
		var toDate =  $('#date_to').val();
		var quoteNo = $('#search_quote_no').val();
		var product  = $('#product_id').val();
		var customerListID = $('select#customer-filter').val();
		var surcharge_type_filter = $('#surcharge_type_filter').val();
		var currency_type_filter = $('#currency_type_filter').val();
		var seaTypeId =  $('#sea_type_filter').val();
		$.ajax({
		    url: appHome+'/customerancillary/common_ajax',
		    type: 'post',
		    async : false,
		    dataType: 'html',
		    beforeSend: function() {
		            // setting a timeout
		    	 $('.full_relative').show();
		     },
		    data : {
		    		'cust_id'	  : cust_id,
		    		'customerListID' : customerListID,
		    		'fromDate'	  : fromDate,
		    		'toDate'	  : toDate,
		    		'quoteNo' 	  : quoteNo,
		    		'product'	  : product,
		    		'currency_type_filter' : currency_type_filter,
		    		'surcharge_type_filter' : surcharge_type_filter,
		    		'seaTypeId' : seaTypeId,
		    		'action_type' : 'get_quote_list'
		    },
		    success: function(data) {
		    	var jsonData = $.parseJSON(data);
		    	var table = printTableData(jsonData);
		    	$('#table_data').html(table);	
		    	
		    	$("#div-disable-a-link .custom-pagination a").attr('href','#');
		    	
		    	$("#customer_ansillary_table").trigger("update"); 
		    	var sorting = [[1,0]]; 
		    	$("#customer_ansillary_table").trigger("sorton",[sorting]);
		        $('#customer_ansillary_table')	
		           .tablesorter({
		             widthFixed: true,
		             widgets: ['zebra', 'filter'],
		             widgetOptions: {
		               filter_reset: '.reset'
		             }
		           })
		           .tablesorterPager({
		             container: $('.custom-pagination'),
		             output: 'Records {startRow} to {endRow} (Total {totalRows} Results) - Page {page} of {totalPages}',
		             removeRows: false,
		             size: 25
		           });
		        if(data == '[]'){
		        	$('.custom-pagination').hide();
		        }
		        
		        $('.full_relative').hide();
		    }
	  });
	}
	
	$('#btn_search_list').click(function(e){
		getquoteList();
		checkboxSelectall();
	});

	$('#currency').change(function(){
		switch_currency_icons($('#currency'),'currency-fa');
	});
	function switch_currency_icons(currency, currency_icon) {
		
		
		  var currency_id = currency.chosen().val(),
		      $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
		      currency_name = $currency.attr('data-label');

		  if(!$currency.length) {
		    alert('Error. Currency not found.');
		    return false;
		  }

		  if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
		  	$('.'+currency_icon).removeClass().html("").addClass('fa '+currency_icon+' fa-'+currency_name);
		  }
		  else {
		  	$('.'+currency_icon).removeClass().html(currency_name.toUpperCase()).addClass('fa '+currency_icon);
		  }  
	}
	

	$('#no_end_validity').click(function(e){
		$('#customer_surcharge_date_to').parent().removeClass('highlight');
	});
	
	$('#customer_save_surcharge').click(function(e){
		
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
		  
	   var checkedval = [];
	   var success = [];
	   $('.customer_ansillary_checkbox:checked').each(function(){ //iterate all listed checkbox items
		   var qno = $(this).data('id');
		   var cid = $(this).data('custid');
	       //checkedval.push(qno);
	       checkedval.push({
					   	    cid: cid,
					   	    quoteno: qno
	   	  					});
	   });
   
	   highlight($('#currency'), '');
	   highlight($('#surcharge_type'), '');
	   highlight($('#customer_surcharge_date_from'), '');

	   if($('#customer_surcharge_date_from').val() != "" && !$('#no_end_validity').is(':checked')){
		highlight($('#customer_surcharge_date_to'), '');
	  }
	   
	   var check_fields = (success.indexOf(false) > -1);
	   if(check_fields == true){
		 $('html, body').animate({ scrollTop: 0 }, 400);
		 $('#response').empty().prepend(alert_required).fadeIn();
		 return false;
	   }

	   	if($('#no_end_validity').is(":checked")){
	   		no_end_validity = 1;
	   	}
	   	else{
	   		no_end_validity = 0;
	   	}
	   
	   if(checkedval.length > 0){
		   var curr = $(this);
		   curr.attr('disabled', true);
		   curr.find('span').removeClass('glyphicon glyphicon-ok-sign').addClass('fa fa-spinner fa-spin');
			$.ajax({
			    url: appHome+'/customerancillary/common_ajax',
			    type: 'post',
			    //async : false,
			    dataType: 'html',
			    data : {
			    		'checkedval'	: checkedval,
			    		'currency' 		: $('#currency').val(),
			    		'surcharge_type' : $('#surcharge_type').val(),
			    		'customer_surcharge_date_from' : $('#customer_surcharge_date_from').val(),
			    		'customer_surcharge_date_to' : $('#customer_surcharge_date_to').val(),
			    		'surcharge_percentage' : $('#surcharge_percentage').val(),
			    		'surcharge_amount' : $('#surcharge_amount').val(),
			    		'no_end_validity' : no_end_validity,
			    		'action_type'   : 'update_customer_ancillary_rate'
			    },
			    success: function(data) {
					curr.attr('disabled', false);
					curr.find('span').removeClass('fa fa-spinner fa-spin').addClass('glyphicon glyphicon-ok-sign');
			    	var msgs = '<div class="alert alert-success alert-dismissable">'+
						        	'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'+
						        '<i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> Customer Surcharges Applied Successfully.  </div>';
			        
			    	getquoteList();		
			    	
			    	
			    	for (i = 0; i < checkedval.length; i++) {
						$(".customer_ansillary_checkbox[data-id="+checkedval[i].quoteno+"]").prop("checked","true");
					}
			    	$('html, body').animate({ scrollTop: 0 }, 400);
			    	$('#response').empty().prepend(msgs).fadeIn();
				},
				error: function(response){
					curr.attr('disabled', false);
					curr.find('span').removeClass('fa fa-spinner fa-spin').addClass('glyphicon glyphicon-ok-sign');
					BootstrapDialog.show({title: 'Error', message : 'Unable to Update. Please try later.',
							buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
		  });
	   }else{
		   $('html, body').animate({ scrollTop: 0 }, 400);
			$('#response').empty().prepend('<div class="alert alert-danger alert-dismissable"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please Select any Checkbox</div>').fadeIn();
			return false;
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
	if($('#cust-ancilary tr').length >= 7){
		DoubleScroll(document.getElementById('doublescroll'));
	}
	
});

//Function for End Date Undisclosed
$(document).on('change','#no_end_validity', function(){
	
    if($(this).prop("checked")){
    	previous_valid_date = $('input[name="surcharge_date_to"]').val();
		$('input[name="surcharge_date_to"]').attr('readonly','true');		
		$('input[name="surcharge_date_to"]').datepicker( "option", "disabled", true );
		$('input[name="surcharge_date_to"]').hide();
		$("#dummy_date").show();
		$('input[name="surcharge_date_to"]').val($("#max_validity").val());
	} else {
		$('input[name="surcharge_date_to"]').removeAttr('readonly');
		$('input[name="surcharge_date_to"]').datepicker( "option", "disabled", false );
		$("#dummy_date").hide();
		$('input[name="surcharge_date_to"]').show();
		$('input[name="surcharge_date_to"]').val(previous_valid_date);
	}
});

$(document).on('click','.delete_history',function(e){
	e.preventDefault();
	var history_id = $(this).data('history_id');
	BootstrapDialog.confirm('Are you sure you want to delete this Customer Surcharge History?', function(result){
		if(result) {
			$.ajax({
				type : 'POST',
				url  : appHome+'/customerancillary/common_ajax',
				data :{
					'history_id' 	: history_id,
					'action_type'	: "delete_history"
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

$(document).on('change','#customer_surcharge_date_from,#customer_surcharge_date_to', function (e) {
	var pre_dt = $('#customer_surcharge_date_from');
	var next_dt = $('#customer_surcharge_date_to');
	var dt1 = Date_Check(pre_dt);
	var dt2 = Date_Check(next_dt);
	if(dt1 == true && dt2 == true){
		 if(!checkIsValidDateRange(pre_dt.val(),next_dt.val())) {
			 BootstrapDialog.show({title: 'Warning', message : " 'To date' should be greater than 'From date'."});
			 $( "#customer_surcharge_date_to" ).datepicker('setDate','');
		 }
	 }
});