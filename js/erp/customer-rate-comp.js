$( document ).ready(function() {
	

	
	$(document).on('change', '.custom-page-pagesize', function(e) {
		var pagelimit = $(this).val();
		$('#pagesize').val(pagelimit);
		$('#customer_index_listing').submit();
	});

	function printTableData(jsonData){/*
		var table = '';
		table +=  '<table class="table table-condensed table-striped table-hover tablesorter hide-filters thick-table-10-2-5px" id="customer_ansillary_table">'+
					  '<thead>'+
					    '<tr>'+
					       '<th class="td-with-border text-center ">'+
					       		'<div class="horiz1">Quote No</div>'+
					       '</th>'+
					  '<thead>'+
					  '<tbody>';
	
		if(jsonData.length > 0){
			$.each(jsonData, function(i, item) {
			table +=  "<tr>" +
						"<td><b>"+item.q_number+"<b></td>" +
						"</tr>";
				
			});
		}else{
			table = '<tr><td colspan="10">'+
						'<div class="alert alert-warning alert-dismissable">'+
				  			'<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'+
				  			'<i class="fa fa-exclamation-circle"></i> <strong>Sorry</strong>, there are no Job Templates.'+
				  		'</div>'+
				  	'</td></tr>';
		}
		table +=  '</tbody></table>';
		return table;
	*/}
	
	function getquoteList(){/*	
		$('#table_data').html('');
		var supp_code_filter = $('#supp_code_filter').val();
		var transport_mode_filter = $('#transport_mode_filter').val();
		var currency_type_filter = $('#currency_type_filter').val();
		$.ajax({
		    url: appHome+'/supplier-route-compare/common_ajax',
		    type: 'post',
		    async : false,
		    dataType: 'html',
		    beforeSend: function() {
		            // setting a timeout
		    	 $('.full_relative').show();
		     },
		    data : {
		    		'supp_code_filter'	  : supp_code_filter,
		    		'transport_mode_filter' : transport_mode_filter,
		    		'currency_type_filter' : currency_type_filter,
		    		'action_type' : 'get_rate_list'
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
		        
		        $('.full_relative').hide();
		    }
	  });
	*/}
	
	$('#btn_search_list').click(function(e){
		//getquoteList(); not completed
	});

	/**
	 * limit the control
	 */
	$(".multi-sel-ctrl").change(function () {
		var optioncount = $(this).find('option:selected').length;
		var optlimit = 20;
		var count = 1;
		var $this = $(this);
		
	    if(optioncount > optlimit) {
	    	$(this).find('option:selected').each(function(){
	    		if(count > optlimit){
	    			$(this).prop('selected',false);
	    		}
	    		count +=1;
	    	})
	    	BootstrapDialog.show({title: 'Customer Limt', message : 'Selection is limited to '+optlimit+' items only.',
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
			onChange: function(element, checked) {}
		});
		}
		$('.tmp-input-ctrl').remove();//This control is for not showing old select box
		$("#div-disable-a-link .custom-pagination a").attr('href','#');
});
