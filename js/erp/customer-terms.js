(function() {
	var path=$("#term_path").val();
	var grid = [];
	
	if(path !== undefined)
	$.ajax({
  	    url: path,
  	    type: 'get',
	    dataType: 'json',
  	    success: function(data){
  	    		var autoload = true;
  	    		if (data == "") {autoload = false;}
  	    	
  	    		grid = $("#terms_grid").grid({
  	    				dataSource: data,
  	    				autoLoad: autoload,
  	    				columns :[{field: "id", title:"#", width:"30px"},
  	    				          {field: "item", title: "General Rates", width:"200px" },
  	    				          {field: "unit_of_cost", title: "Cost per" },
  	    				          {field: "cost1", title: "Cost1" },
  	    				          {field: "cost2", title: "Cost2" },
  	    				          {field: "cost3", title: "Cost3" },
  	    				          {field: "comments", title: "Comments",width:"250px" },
  	    				          {field: "free_period", title: "Free Period",width:"50px"},
  	    				          {title:"", field: "test",type: "icon", icon: "ui-icon-pencil",width:"30px", events:{"click": Edit }},
  	    				          {title:"", field: "test",type: "icon", icon: "ui-icon-trash",width:"30px", events:{"click": Delete }}
  	    				]
  	    		});
  	    		
  	    		$("#next-id").val( grid.count()+1 );
  	    		$('.term-currency').trigger('change');
  	    		if (data == "") {
  	    			 $("#terms_grid tr").eq(1).find('div').text("No records found.");
  	    		}
  	    }
	});
	 
	
	function Edit(e)
	{
		$('#terms_modal').modal('show');
		$("#rate-id").val(e.data.record.id);
		$("#general_rates").val(e.data.record.item);
		$("#unit_of_cost").val(e.data.record.unit_of_cost);
		$("#free_period").val(e.data.record.free_period);
		$("#cost1").val(e.data.record.cost1);
		$("#cost2").val(e.data.record.cost2);
		$("#cost3").val(e.data.record.cost3);
		$("#comments").val(e.data.record.comments);
		$('#updateid').val("1");
	}
	
	function Delete(e) {
        if (confirm("Are you sure?")) {
            grid.removeRow(e.data.id);
        }
    }
	
	$("#add").click(function(e) {
		$("#rate-id").val("");
		$("#general_rates").val("");
		$("#unit_of_cost").val("");
		$("#free_period").val("");
		$("#cost1").val("");
		$("#cost2").val("");
		$("#cost3").val("");
		$("#comments").val("");
		$('#updateid').val("0");
			
		$('#terms_modal').modal('show');
	});
	
	
	function Save() {
		
		var update_flag = $('#updateid').val();
		var id = parseInt($("#rate-id").val());
		var nextid = parseInt($("#next-id").val());
		
		var cost1 = $("#cost1").val();
		var cost2 = $("#cost2").val();
		var cost3 = $("#cost3").val();
		
		if(cost1 == "") {cost1 = "N/A";}
		if(cost2 == "") {cost2 = "N/A";}
		if(cost3 == "") {cost3 = "N/A";}
		
		var item = $("#general_rates").val();
		if(item == ""){
			BootstrapDialog.show({title: 'General Rates', message : 'Please enter general rate description.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close(); $("#general_rates").focus();}}],cssClass: 'small-dialog',	
			});
			return false;
		}
		
		if(update_flag == 1){
			grid.updateRow(
			id,{
				"id": id,
				"item": item, 
				"unit_of_cost" : $("#unit_of_cost").val(),
				"free_period" : $("#free_period").val(),
				"cost1" : cost1,
				"cost2" : cost2,
				"cost3" : cost3,
				"comments" : $("#comments").val()
			});
			
		} else {
			
			grid.addRow(
				{
				"id": nextid,
				"item": item, 
				"unit_of_cost" : $("#unit_of_cost").val(),
				"free_period" : $("#free_period").val(),
				"cost1" : cost1,
				"cost2" : cost2,
				"cost3" : cost3,
				"comments" : $("#comments").val()
			});
			$("#next-id").val( nextid + 1 );
		}
		
		$('#terms_modal').modal('hide');
    }

	
    $("#save-term").click(function(){
    	Save();
    });
    
    
    //Validation and Submit function
	$("#save").click(function(){
		var cost_currency_name_1 = $("#currency1").val();
		var cost_currency_name_2 = $("#currency2").val();
		var cost_currency_name_3 = $("#currency3").val();
		   
		var data = grid.getAll();
		$("#grid_data").val(JSON.stringify(data));
		   
		if(cost_currency_name_1 == cost_currency_name_2 || cost_currency_name_2 == cost_currency_name_3 || cost_currency_name_1 == cost_currency_name_3){
			   BootstrapDialog.show({title: 'General Rates', message : 'Please select different currencies for Cost1, Cost2 & Cost3.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
		  });
		  $('html, body').animate({ scrollTop: 0 }, 400);
		  return false;
		}
		   
		$("#customer-term-form").submit();
	});
	

	$('.input-group-addon').click(function() {
	    $(this).parent().find('.datepicker').trigger('focus');
	  });

	  $('.datepicker').datepicker({
	    dateFormat: btl_default_date_format,
	    changeMonth: true,
	    changeYear: true,
	    inline: true,
	    startDate: 0
	  });
	  
})();


$(document).ready(function(){

/**
 * Check if there is any change in Customer form
 */
$("#f_frmEditRow").change(function(){
	$("#checkFormChangeCustomerPg").val("1");
});

$("#customer-terms-edit").click(function(){
	if($("#checkFormChangeCustomerPg").val() == "1"){
		if(confirm("You have modified some of the fields.\nDo you want to navigate without saving the data?")) {
			window.location.href = $(this).data('href');
		}
	} else {
		window.location.href = $(this).data('href');
	}
});

$("#ds-customer-terms-edit").click(function(){
	if($("#checkFormChangeCustomerPg").val() == "1"){
		if(confirm("You have modified some of the fields.\nDo you want to navigate without saving the data?")) {
			window.location.href = $(this).data('href');
		}
	} else {
		window.location.href = $(this).data('href');
	}
});


/*
 * Back button with data lost warning.
 */
$("#customer-back-btn").click(function(){
	if($("#checkFormChangeCustomerPg").val() == "1"){
		if(confirm("You have modified some of the fields.\nDo you want to go back without saving the data?")) {
			window.location.href = $(this).data('href');
		}
	} else {
		window.location.href = $(this).data('href');
	}
});


/**
 * on currency change
 */
$('.term-currency').change(function() {
   var currency_ctrl = $(this);
   var currency_name = currency_ctrl.val();
   var cost_fld = currency_ctrl.data('cost_fld');
   var fa = $("#"+cost_fld);
   
   if(cost_fld == "cost_symbol1")
	   $("#terms_grid tr").eq(0).find('th div').eq(3).html("Cost1 (" + currency_name + ")");
   else if(cost_fld == "cost_symbol2")
	   $("#terms_grid tr").eq(0).find('th div').eq(4).html("Cost2 (" + currency_name + ")");
   else if(cost_fld == "cost_symbol3")
	   $("#terms_grid tr").eq(0).find('th div').eq(5).html("Cost3 (" + currency_name + ")");
   
   if (currency_having_symbols.indexOf(currency_name) >= 0) {
	   	$(fa).removeClass().addClass('fa fa-' + currency_name.toLowerCase() ).html("");
	
   } else {
	   	$(fa).removeClass().addClass('fa').html(currency_name);
   }
   
 });

 
 //Start chosen plugin.
 $(".term-currency").trigger('change');
 $(".term-currency").chosen({allow_single_deselect: true});
 
});