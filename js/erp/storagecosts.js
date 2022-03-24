$(document).ready(function(){

	$('#search_box_bttn').click(function(){
    	$('#search_box_bttn i').toggleClass('fa-search-minus fa-search-plus');
    	$('.search_box').slideToggle("slow");
    	$('#response,#response_count').slideToggle("fast"); 
    });

	$('.tmp-input-ctrl').remove();//This control is for not showing old select box
	Date.prototype.toInputFormat = function() {
    	var yyyy = this.getFullYear().toString();
   	 	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    	var dd  = this.getDate().toString();
    	return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
 	};	
});//end of document ready

//Pagination button
$(document).on('click', '.first-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getStorageCostListing('#plan-filter-form');
});


//Pagination button
$(document).on('click', '.last-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getStorageCostListing('#plan-filter-form');
});

//Pagination button
$(document).on('click', '.next-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getStorageCostListing('#plan-filter-form');
});


//Pagination button
$(document).on('click', '.prev-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getStorageCostListing('#plan-filter-form');
});

//Page size change
$(document).on('change', '.page-limit', function(){
	var pageSize = $(this).val();
	$('#pagesize').val(pageSize);
	$('#page').val(0);
	getStorageCostListing('#plan-filter-form');
});

$(document).on('click', '#filter-btn', function(){ 
	var form = '#'+$(this).closest('form').attr('id');
	$('#page').val(0);
	$('#response').empty();
	getStorageCostListing(form);
})

function getStorageCostListing(form){ 
	
	var h = $('.storage-tbl').height();
	if(h == 0) { h = 100; }
	$('.btl_overlay').height(h);  
	$('.btl_relative').show();
	var button = $('#filter-btn');
	button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');

	$.ajax({ 
        type: 'GET',
        url: appHome+'/storage-costs/ajax-get-listing',
        data: $(form).serialize(),
        success: function(response){ 
        	$('.btl_relative').hide();
        	$('.storage-tbl').html(response);
        	button.find('span').removeClass().addClass("glyphicon glyphicon-filter");
         	button.removeAttr('disabled');
			$('#totalrecords').val($('#hd_totalrecords').val());
			getCost();
			if($('#page').val() == 0){
				if($('#bor_table tr').length > 10){
					DoubleScroll(document.getElementById('doublescroll'));
				} 
			}
			if($("#section").val() == "HISTORY" || $("#section").val() == "LIVEPRECALC"){
				InitSort();
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

function getCost(){

	var $jsonObj = [];
	var base_path = appHome.replace('erp.php','');
	
	$('.job-tr').each(function() {
		var $eachItem = {};
		
		if($(this).data('planids')){
	    	$eachItem.pl_id =  $(this).data('planids');
	    }
		if($(this).data('jobnum')){
			$eachItem.job_no = $(this).data('jobnum');	 
	    }
		if($(this).data('activity')){
	    	$eachItem.activity = $(this).data('activity');	    	
	    }
		if($(this).data('toaddressid')){
			$eachItem.to_address = $(this).data('toaddressid');
		}
		if($(this).data('suppid')){
	    	$eachItem.supplier_id = $(this).data('suppid');
	    }
		if($(this).data('tanktype')){
	    	$eachItem.equipment_type = $(this).data('tanktype');
	    }
		if($(this).data('imo')){
	    	$eachItem.imo = $(this).data('imo');
	    }
		if($(this).data('pldate')){
	    	$eachItem.date = $(this).data('pldate');
	    }
		if($(this).data('tankstatus')){
	    	$eachItem.tank_status = $(this).data('tankstatus');
	    }
		if($(this).data('order')){
	    	$eachItem.pl_order_no = $(this).data('order');
	    }

		$jsonObj.push($eachItem);
	});

	if($jsonObj.length > 0 && $("#section").val() == "LIVE"){
		$.ajax({
			type: 'POST',
			dataType: "json",
			url: appHome+'/storage-costs/common-ajax',
		    data: {
				'action_type' : 'get_costs',
				'data' : JSON.stringify($jsonObj)
			},
			success: function(response){
				if(response){
					 $(".job-tr").find('.stg-icon').html('');	
					
					 $.each(response, function(key,value) {
						if(value.length > 0){
							$.each(value, function(subkey,subvalue) {
								$direction = "";
								switch(subvalue.direction) {
								  case 4:
								    $direction = "All";
								    break;
								  case 3:
								    $direction = "Storage";
								    break;
								  case 2:
								    $direction = "Export";
								    break;
								  case 1:
								    $direction = "Import";
								    break;
								} 

								$modality = "";
								switch(subvalue.modality) {
								  case 5:
								    $modality = "Vessel & Rail";
								    break;
								  case 4:
								    $modality = "All";
								    break;
								  case 3:
								    $modality = "Depot";
								    break;
								  case 2:
								    $modality = "Vessel";
								    break;
								  case 1:
								    $modality = "Rail";
								    break;
								}
								
								$imo_chg = "";
								if(subvalue.imo_chg == 1){
									$imo_chg = "Yes";
								} else if(subvalue.imo_chg == 2){
									$imo_chg = "No";
								} else {
									$imo_chg = "Both";
								}
									
								$direction = '<a title="Storage Rate" target="_blank" href="' + appHome +  '/supplier-ancillary/storage-rates/' + subvalue.rate_id + '/edit">'+ $direction + '</a>\n';

								$('[data-planids='+ subvalue.plan_id +']').find('.stg-direction').append($direction);
								$('[data-planids='+ subvalue.plan_id +']').find('.stg-modality').append($modality + "\n");
								$('[data-planids='+ subvalue.plan_id +']').find('.stg-curr').append(subvalue.currency + "\n");
								
								//if((subvalue.current_cost + subvalue.project_cost_5 + subvalue.project_cost_10 + subvalue.project_cost_15 + subvalue.project_cost_20) != 0) {
									$('[data-planids='+ subvalue.plan_id +']').find('.stg-curcost').append(subvalue.current_cost.toFixed(2) + "<br>");
									$('[data-planids='+ subvalue.plan_id +']').find('.stg-pcost5').append(subvalue.project_cost_5.toFixed(2) + "<br>");
									$('[data-planids='+ subvalue.plan_id +']').find('.stg-pcost10').append(subvalue.project_cost_10.toFixed(2) + "<br>");
									$('[data-planids='+ subvalue.plan_id +']').find('.stg-pcost15').append(subvalue.project_cost_15.toFixed(2) + "<br>");
									$('[data-planids='+ subvalue.plan_id +']').find('.stg-pcost20').append(subvalue.project_cost_20.toFixed(2) + "<br>");
									$('[data-planids='+ subvalue.plan_id +']').find('.stg-icon').text("");
								//}
								
								$('[data-planids='+ subvalue.plan_id +']').find('.stg-imo').text($imo_chg);
								
								if(subvalue.days_remaining > 2){
									$('[data-planids='+ subvalue.plan_id +']').addClass('success');
									$('[data-planids='+ subvalue.plan_id +']').find('.stg-icon').html('<i class="fa fa-check" aria-hidden="true" title="Tank not yet incurred \nStorage cost"><span class="hide">1</span></i>\n');
								}else if(subvalue.days_remaining == 2 || subvalue.days_remaining == 1){
									$('[data-planids='+ subvalue.plan_id +']').removeClass('success').addClass('warning');
									$('[data-planids='+ subvalue.plan_id +']').find('.stg-icon').html('<i class="fa fa-exclamation" aria-hidden="true" title="Tank is about to incur \nStorage costs in next 2 days"><span class="hide">2</span></i>\n');
								}else if(subvalue.is_current_cost_high == 1 && subvalue.days_remaining == ""){
									$('[data-planids='+ subvalue.plan_id +']').removeClass('success').addClass('danger');
									$('[data-planids='+ subvalue.plan_id +']').find('.stg-icon').html('<i class="fa fa-exclamation-triangle" aria-hidden="true" title="Tank has incurred \n> &euro;100 Storage Costs" ><span class="hide">4</span></i>\n');
								}else if(subvalue.current_cost > 0 && subvalue.days_remaining == ""){
									$('[data-planids='+ subvalue.plan_id +']').removeClass('success').addClass('danger');
									$('[data-planids='+ subvalue.plan_id +']').find('.stg-icon').html('<i class="fa fa-times" aria-hidden="true" title="Tank has started \nincurring Storage Cost"><span class="hide">3</span></i>\n');
								}else if(subvalue.current_cost == 0){
									$('[data-planids='+ subvalue.plan_id +']').removeClass('success').addClass('alert-info');
									$('[data-planids='+ subvalue.plan_id +']').find('.stg-icon').html('<i class="fa fa-check" aria-hidden="true" title="Tank not yet incurred \nStorage cost"><span class="hide">1</span></i>\n');
								}
								
								if(value.length > 1){
									$('[data-planids='+ subvalue.plan_id +']').find('.stg-icon').html('<i class="fa fa-bug" aria-hidden="true" title="Multiple Storage Costs. \nPlease correct." style="color: #D9534F;"><span class="hide">5</span></i>\n');
								} 
								
							});
						}
					 }); 
				 
					 InitSort();
					
				}
				else{
					$(".job-tr").find('.stg-icon').html('');			
				}
			}
		});
	}
	
}

function InitSort() {
	$(".tablesorter").tablesorter({
		dateFormat: "ddmmyyyy",
		 cssHeader:'sortheader',
		 cssAsc:'headerSortUp',
		 cssDesc:'headerSortDown',
	});
}

var callCount = 0;

function DoubleScroll(element) {
	if(callCount == 0){
		callCount += 1;
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
}

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