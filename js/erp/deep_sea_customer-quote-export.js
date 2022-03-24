(function() {
  	var quotes = $("#quotenumbers").val();
	if(quotes){
		var path = $("#data-sel-path").val();	
	}else{
		var path = $("#data-path").val();
	}
  	var failpath   = $("#data-failpath").val();
  	var excelpath  = $("#data-excelpath").val();
  	var pdfpath    = $("#data-pdfpath").val();
  	var customerid = $("#customerid").val();
  	var customer_name   = $("#customer-name").val();
	var multi_diff_cust = $("#multi_diff_cust").val();
	var customer_names  = $("#customer_names").val();
	var customer_ids    = $("#customer_ids").val();
	var export_type     = $("#export_type").val();
  	var grid     = [];
	var tempgrid = {};
  	var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
  	var alert_success_pdf = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i>Successfully exported to PDF file !!!</div>';
  	var alert_success_xls = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i>Successfully exported to Excel file !!!</div>';
  	var alert_success_redirection_xls = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i>Successfully exported to Excel file, click the links below !!!</div>';
  	var alert_success_redirection_pdf = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i>Successfully exported to PDF file, click the links below !!!</div>';
  	
  	$.ajax({
  	    url: appHome+path,
  	    type: 'post',
        data: { 'quote_numbers': quotes , 'multi_diff_cust' : multi_diff_cust, 'customer_names' : customer_names , 'customer_ids' : customer_ids},
  	    dataType: 'json',
  	    success: function(data) {
  	      		if(data != "") 
  	      		{ 
        			if(export_type == 1)
					{  
						$.each(data, function(key, value) { 
							tempgrid["grid"+key] = $('#grid'+key).grid({
							dataSource:value,
  	          				columns: [
  	              						{field: "ID" },
  	              						{field: "Date", sortable: true },
  	              						{field: "LoadPoint", title: "Load Point" },
  	              						{field: "LoadCountry", title:"Load Country"},
  	    		  						{field: "DeliveryPoint", title:"Delivery Point"},
  	    		  						{field: "DeliveryCountry", title:"Delivery Country"},
  	    		  						{field: "Product"},
  	    		  						{field: "IMO"},
  	    		  						{field: "POL"},
  	    		  						{field: "POD"},
  	    		  						{field: "Carrier"},
  	    		  						{field: "Terms"},
  	    		  						{field: "FreeDays", title:"Free Days"},
  	    		  						{field: "Validity"},
  	    		  						{field: "Curr"},
  	    		  						{field: "Rate"},
  	    		  						{field: "AdditionalInfo", title:"Additional Info"},
  	    		  						{title: "", field: "Edit", width: 20, type: "icon", icon: "ui-icon-pencil", tooltip: "Edit", events: { "click": Edit } },
  	              						{title: "", field: "Delete", width: 20, type: "icon", icon: "ui-icon-trash", tooltip: "Delete", events: { "click": Delete } }
  	          					],
  	         					//  pager: { enable: true, limit: 2, sizes: [2, 5, 10, 20] }
  	        				 });

						});
 
				}else{
					grid = $("#grid").grid({
					dataSource: data,
					columns: [
						{field: "ID" },
						{field: "Date", sortable: true },
						{field: "LoadPoint", title: "Load Point" },
						{field: "LoadCountry", title:"Load Country"},
						{field: "DeliveryPoint", title:"Delivery Point"},
						{field: "DeliveryCountry", title:"Delivery Country"},
						{field: "Product"},
						{field: "IMO"},
						{field: "POL"},
						{field: "POD"},
						{field: "Carrier"},
						{field: "Terms"},
						{field: "FreeDays", title:"Free Days"},
						{field: "Validity"},
						{field: "Curr"},
						{field: "Rate"},
						{field: "AdditionalInfo", title:"Additional Info"},
						{title: "", field: "Edit", width: 20, type: "icon", icon: "ui-icon-pencil", tooltip: "Edit", events: { "click": Edit } },
						{title: "", field: "Delete", width: 20, type: "icon", icon: "ui-icon-trash", tooltip: "Delete", events: { "click": Delete } }
					],
						  
				   //  pager: { enable: true, limit: 2, sizes: [2, 5, 10, 20] }
				   });
				}
  	     	 } else {
				BootstrapDialog.show({
					title  : 'No Quotes Found',
					type   : BootstrapDialog.TYPE_INFO,
					message: 'Sorry! No Completed Quotes to export for this customer',
				  draggable: false, 
				  cssClass : 'msg-dialog',
				  buttons  : [{
					   id  : 'goback',
					  label: 'Go Back',
					  icon : 'glyphicon glyphicon-ok-sign',       
				  cssClass : 'btn-success',
					  action: function(dialogRef) {
						  dialogRef.close();
						  window.location.href =appHome+failpath ;
					  }
				  }
				  ]
			  });
  	      }
  	    }
  	});


	function Edit(e) {
		$("#fld_Ref").val(e.data.record.Ref);
		$("#fld_ID").val(e.data.record.ID);
		$("#fld_Date").val(e.data.record.Date);
		$("#fld_LoadPoint").val(e.data.record.LoadPoint);
		$("#fld_LoadCountry").val(e.data.record.LoadCountry);
		$("#fld_DeliveryPoint").val(e.data.record.DeliveryPoint);
		$("#fld_DeliveryCountry").val(e.data.record.DeliveryCountry);
		$("#fld_Product").val(e.data.record.Product);
		if(e.data.record.IMO == "Yes") {
			$("#fld_imo").prop('checked', true);
		} else {
			$("#fld_imo").prop('checked', false);
		}
		
		$("#fld_pol").val(e.data.record.POL);
		$("#fld_pod").val(e.data.record.POD);
		$("#fld_Carrier").val(e.data.record.Carrier);
		$("#fld_Terms").val(e.data.record.Terms);
		$("#fld_FreeDays").val(e.data.record.FreeDays);
		$("#fld_Validity").val(e.data.record.Validity);
		
		$("#fld_Currency").val(e.data.record.Curr);
		$("#fld_Rate").val(e.data.record.Rate);
		$("#fld_Add_Info").val(e.data.record.AdditionalInfo);
		$('#rate-curr').removeClass();
		$('#rate-curr').addClass('fa fa-' + e.data.record.Curr.toLowerCase());
		var gridID = $(this). closest('table'). attr('id');
		$("#gridID").val(gridID);
		$("#mtitle").text("Customer quote Id " + e.data.record.ID);
		$('#myModal').modal('show');
	};


	function Delete(e) {
		if(export_type == 1 ){
			var gridID = $(this). closest('table'). attr('id');
			if (confirm("Are you sure?")) {
				tempgrid[gridID].removeRow(e.data.id);
			}
			 }else{
				if (confirm("Are you sure?")) {
				   grid.removeRow(e.data.id);
				}
		 }
    }

	function Save() {
		var ref = parseInt($("#fld_Ref").val());
		var gridID = $("#gridID").val();
		if(export_type == 1 ){
			tempgrid[gridID].updateRow(
				ref,{
					"Ref" : ref,
					"ID" : $("#fld_ID").val(),
					"Date" : $("#fld_Date").val(),
					"Customer" : $("#fld_Customer").val(),
					"LoadPoint" : $("#fld_LoadPoint").val(),
					"LoadCountry" : $("#fld_LoadCountry").val(),
					"DeliveryPoint" : $("#fld_DeliveryPoint").val(),
					"DeliveryCountry" : $("#fld_DeliveryCountry").val(),
					"Product" : $("#fld_Product").val(),
					"IMO" : $("#fld_imo").is(':checked') ? "Yes" : "No",
					"POL" : $("#fld_pol").val(),
					"POD" : $("#fld_pod").val(),
					"Carrier" : $("#fld_Carrier").val(),
					"Terms" : $("#fld_Terms").val(),
					"FreeDays" : $("#fld_FreeDays").val(),
					"Validity" : $("#fld_Validity").val(),
					"Curr" : $("#fld_Currency").val(),
					"Rate" : $("#fld_Rate").val(),
					"AdditionalInfo" : $("#fld_Add_Info").val()
				});
		
		}else{
			grid.updateRow(
				ref,{
					"Ref" : ref,
					"ID" : $("#fld_ID").val(),
					"Date" : $("#fld_Date").val(),
					"LoadPoint" : $("#fld_LoadPoint").val(),
					"LoadCountry" : $("#fld_LoadCountry").val(),
					"DeliveryPoint" : $("#fld_DeliveryPoint").val(),
					"DeliveryCountry" : $("#fld_DeliveryCountry").val(),
					"Product" : $("#fld_Product").val(),
					"IMO" : $("#fld_imo").is(':checked') ? "Yes" : "No",
					"POL" : $("#fld_pol").val(),
					"POD" : $("#fld_pod").val(),
					"Carrier" : $("#fld_Carrier").val(),
					"Terms" : $("#fld_Terms").val(),
					"FreeDays" : $("#fld_FreeDays").val(),
					"Validity" : $("#fld_Validity").val(),
					"Curr" : $("#fld_Currency").val(),
					"Rate" : $("#fld_Rate").val(),
					"AdditionalInfo" : $("#fld_Add_Info").val()
				});
		}

    }
	
    $("#save-quote").click(function(){
    	Save();
    	$('#myModal').modal('hide');
    });
    
    $("#fld_Currency").change(function (){
    	$('#rate-curr').removeClass();
		$('#rate-curr').addClass('fa fa-' + $(this).val().toLowerCase());
    });

    $("#SaveExcel").click(function(){
    	
    	var xlsfile = $('#data-excelfile').val();
		var export_type = $('#export_type').val();
		var multi_diff_cust = $('#multi_diff_cust').val();
    	if(xlsfile != "" && !confirm("This will replace existing Excel file.\nDo you want to continue?"))
    	{
    		return false;
    	}
		if(export_type == 1){ 	
			var customer_ids = $('#customer_ids').val(); 
			var multi_diff_cust = $('#multi_diff_cust').val();			
			var each_customer_data = {};
			$.each(tempgrid, function(key, value) {
				var customer_fetch_id = key.split("d")[1];
				 each_customer_data[customer_fetch_id] = value.getAll();			
		    });
			var exprt_data_string = JSON.stringify(each_customer_data);
			if(multi_diff_cust == 1){
				var dataToBePassed = {'content': exprt_data_string,'cid':customer_ids,'export_type': export_type,'multi_diff_cust': multi_diff_cust,'quote_type':'deep-sea'};
			}else{
				var dataToBePassed = {'content':exprt_data_string,'cid':customer_ids,'export_type': export_type,'multi_diff_cust': multi_diff_cust,'quote_type':'deep-sea'};
			}
		}else{
			var exprt_data = grid.getAll();
    		exprt_data_string = JSON.stringify(exprt_data);
			var dataToBePassed = {'content':exprt_data_string,'cid':customerid,'cname':customer_name,'quote_type':'deep-sea'};
		}
    	var $this = $(this);
    	$this.attr('disabled','disabled');
    	$this.text(" Loading......");    	
    	$.ajax({
    	      url: appHome+excelpath,
    	      async: false,
    	      timeout: 90000,
    	      type: 'POST',
    	      dataType: 'json',
    	      data: (dataToBePassed),
    	      success: function(data) { 
    	    	 	 	$this.removeAttr('disabled');
    	    	  		$this.text("Save & Export to Excel");
				  		if(export_type == 1 && multi_diff_cust == 1){
							var links = "";
							$.each(data, function(key, value) {
								if(value.status == "success")
								{   var id = value.id.split(",");
									if(id != ""){
									links += '<label name="customer_name">'+value.customer+'</label>&nbsp:&nbsp<a href="'+value.filename+'" target="_blank">Click here to download the file</a><br>';
									$('#response').empty().prepend(alert_success_redirection_xls).fadeIn();
									}
								} else {
									$('html, body').animate({ scrollTop: 0 }, 400);
									$('#response').empty().prepend(alert_error).fadeIn();
								}
							 });
							var final_links = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+links+'</div>'
							  $('#response').append(final_links).fadeIn();
							  $('html, body').animate({ scrollTop: 0 }, 400);
 						} 
						else{
    	    	  			if(data.status == "success"){
        	    	  				$('html, body').animate({ scrollTop: 0 }, 400);
        	          				$('#response').empty().prepend(alert_success_xls).fadeIn();
							 		window.location = data.filename;

    	    	  			} else {
    	    		  				$('html, body').animate({ scrollTop: 0 }, 400);
        	          				$('#response').empty().prepend(alert_error).fadeIn();
    	    	  			}
						}
    	      },
    	      error:function(jqXHR, textStatus, errorThrown){
    	    	  $this.removeAttr('disabled','disabled');
    	    	  $this.text("Save & Export to Excel");
    	    	  $('html, body').animate({ scrollTop: 0 }, 400);
    	          $('#response').empty().prepend(alert_error).fadeIn();
    	      }
    	});
    	
    });
    
    
    $("#SavePDF").click(function(){
    	
    	var pdffile = $('#data-pdffile').val();
    	if(pdffile != "" && !confirm("This will replace existing PDF file.\nDo you want to continue?"))
    	{
    		return false;
    	}
		if(export_type == 1){ 			
			var customer_ids = $('#customer_ids').val(); 
			var multi_diff_cust = $('#multi_diff_cust').val();			
			var each_customer_data = {};
			$.each(tempgrid, function(key, value) {
				var customer_fetch_id = key.split("d")[1];
				 each_customer_data[customer_fetch_id] = value.getAll();			
		    });
			var exprt_data_string = JSON.stringify(each_customer_data);
			if(multi_diff_cust == 1){
				var dataToBePassed = {'content': exprt_data_string,'cid':customer_ids,'export_type': export_type,'multi_diff_cust': multi_diff_cust,'quote_type':'deep-sea'};
			}else{
				var dataToBePassed = {'content':exprt_data_string,'cid':customer_ids,'export_type': export_type,'multi_diff_cust': multi_diff_cust,'quote_type':'deep-sea'};
			}
		} else {
    	    var exprt_data = grid.getAll();
    	    exprt_data_string = JSON.stringify(exprt_data);
			var dataToBePassed = {'content':exprt_data_string,'cid':customerid,'cname':customer_name,'quote_type':'deep-sea'};
		}
    	var $this = $(this);
    	$this.attr('disabled','disabled');
    	$this.text("Loading.....");

    	$.ajax({
    	      url: appHome+pdfpath,
    	      async: false,
    	      timeout: 90000,
    	      type: 'POST',
    	      dataType: 'json',
    	      data: (dataToBePassed),
    	      success: function(data) { 
    	    	  		$this.removeAttr('disabled');
    	    	  		$this.text("Save & Export to PDF");
				  		if(export_type == 1 && multi_diff_cust == 1){
							var links =" ";
							$.each(data, function(key, value) { 
							if(value.status == "success")
							{   var id = value.id.split(",");
								if(id != ""){
									links += '<label name="customer_name">'+value.customer+'</label>&nbsp:&nbsp<a href="'+value.filename+'" target="_blank">Click here to download the file</a><br>';
									$('#response').empty().prepend(alert_success_redirection_pdf).fadeIn();	
								}  
							} else {
								$('html, body').animate({ scrollTop: 0 }, 400);
								$('#response').empty().prepend(alert_error).fadeIn();
							}
						  });
						  var final_links = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+links+'</div>'
						  $('#response').append(final_links).fadeIn();
						  $('html, body').animate({ scrollTop: 0 }, 400);
						} else{
							if(data.status == "success"){
							$('html, body').animate({ scrollTop: 0 }, 400);
							$('#response').empty().prepend(alert_success_pdf).fadeIn();
							window.open(data.filename, '_blank');
							} else {
								$('html, body').animate({ scrollTop: 0 }, 400);
								$('#response').empty().prepend(alert_error).fadeIn();
							}
				 		}
    	      },
    	      error:function(jqXHR, textStatus, errorThrown){
    	    	  				$this.removeAttr('disabled','disabled');
    	    	 				$this.text("Save & Export to PDF");
    	    	  				//alert("OOps!! Please try later.");
    	    	  				$('html, body').animate({ scrollTop: 0 }, 400);
    	          				$('#response').empty().prepend(alert_error).fadeIn();
    	      }
    	});
    	
    });
    
    
})();


function NumberValues(fld,e)
{
	var strCheckphone = '0123456789.-';
	var key = '';
	var whichCodeNum = (window.Event) ? e.which : e.keyCode;

	if(window.navigator.userAgent.indexOf("MSIE") > -1){
		whichCodeNum = e.keyCode; 
	}
	
	if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter

	key = String.fromCharCode(whichCodeNum);

	if(strCheckphone.indexOf(key) == -1) return false;  // Not a valid key
}

function decimalNumber(data) {
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
