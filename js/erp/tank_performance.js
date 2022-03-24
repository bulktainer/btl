$(document).ready(function(){
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
});

//Search operation ajax
$(document).on('click', '#tank_report', function(e){
	var form = '#'+$(this).closest('form').attr('id');
	$('#page').val(1);
	getTankPerformanceReport(form);
});

// get tank performance report data
function getTankPerformanceReport(form, load_more=false){ 
	var h = $('.overlay-complete-loader').height();
	if(h == 0) { h = 100; }
	$('.btl_overlay').height(h);  
	$('.btl_relative').show();
	var button = $('#tank_report');
	button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');
 	
	$.ajax({ 
        type: 'POST',
        url: appHome+'/tank-performance/common-ajax',
        data: $(form).serialize(),
        success: function(response){
        	
        	if(load_more == false){
	        	button.find('span').removeClass("fa fa-spinner fa-spin");
	         	button.removeAttr('disabled');
	         	$('#report-div').html(response);
	        }
	        else{
	        	$('#btn_tank_perf_more').find('span').removeClass("fa fa-spinner fa-spin");
	        	$('#btn_tank_perf_more').removeAttr('disabled');
	        	button.find('span').removeClass("fa fa-spinner fa-spin");
	         	button.removeAttr('disabled');
		        //Add response into table
				$("#tankPerfor-tbody").append(response);
				//Swap total field
				$(".totalRowClass").eq(1).replaceWith($(".totalRowClass").eq(0));
				//Show row count and hide load more
				var $rowCount = $(".totalRowClass").data("reporowcount");
				var $rec_count = $(".totalRowClass").data("rec_count");
				var $pageSize = $("#page_size").val();
				
				$("#rowCountHead").text($rowCount); 
				$("#rowCountHead").text($rowCount + ' tanks found');
				if($rec_count < parseInt($pageSize)) {
					$(".btn-tr").remove();
				}
			}

        	$('.btl_relative').hide();
        	$(".tablesorter").tablesorter({
				 cssHeader:'sortheader',
				 cssAsc:'headerSortUp',
				 cssDesc:'headerSortDown'
			}); 
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          button.find('span').removeClass().addClass("glyphicon glyphicon-filter");
       	  button.removeAttr('disabled');
      	 
        }
    });
}

// Load more function
$(document).on('click', '#btn_tank_perf_more', function(e){
	var page = $('#page').val();
	page = parseInt(page) + 1;
	$('#page').val(page);
	var form = '#tank-form';
	$('#response').empty();
	var button = $(this);
	button.find('span').addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');
	getTankPerformanceReport(form, true);
});
 
