$(function() {
	// if($("#page-type").val() == "add" || $("#page-type").val() == "edit"){
			Dropzone.autoDiscover = false;
			//Dropzone class
			var myDropzone = new Dropzone("body", {
				url: "#",
				// acceptedFiles: "image/*,application/pdf",
				maxFiles : 1, 
				previewsContainer: "#file-upload-panel",
				disablePreviews: true,
				autoProcessQueue: false,
				uploadMultiple: false,
				clickable: false,
				init : function() {
		
					myDropzone = this;
			
					//Restore initial message when queue has been completed
					this.on("drop", function(event) {
						if(event.dataTransfer.files.length > 0){
							fileInput = document.getElementById("file_to_upload"); 
							fileInput.files = event.dataTransfer.files;
							document.getElementById("file-upload-panel").scrollIntoView();
							$("#file-upload-panel").css("background-color", "#bdbdbd");
							setTimeout(() => {
								$("#file-upload-panel").css("background-color", "unset");
							}, 800);
							fileSelected();
							setTimeout(() => {
								if($("#auto_upload_on_drag").is(":checked")){
									uploadFile();
								}
								myDropzone.removeAllFiles( true );
							}, 200);
						}
					});
			
				}
			});
		// }
});

$('#add_product').click(function () {
	$('.new-primay-class').hide();
	$('#add_product_response').empty();
	$("#prod_customer_ids").multiselect('select', []);
	
	$('#add_product_modal_form').trigger('reset');
	$("#prod_customer_ids").multiselect( 'refresh' );
	$("#prod_division").trigger("chosen:updated");
	$("#prod_bus_type").trigger("chosen:updated");
	$("#hazardous_product").trigger("chosen:updated");
	if($('#customer').val()){
	  $("#prod_customer_ids").multiselect('select', [$('#customer').val()]);
	}
	$('#add_product_modal').modal("show");
  
  });
  
  $('#add_product_modal').on('change', '[name="hazardous_product"]', function (e) {
	if ($(this).val() == 1) {
	  $('.new-primay-class').show();
	} else {
	  $('.new-primay-class').hide();
	}
  });
  
  $('#create-product').click(function (e) {
	e.preventDefault();
	var form = '#add_product_modal_form';
	var button = $('#create-product');
	button.attr('disabled', true);
	success = [];
	ExistSuccess = "";
	highlight($(form).find('#prod_name'), '');
	highlight($(form).find('#hazardous_product'), '');
	//highlight for form validations
	function highlight(field, empty_value) {
	  if (field.length > 0) {
		if (field.val().trim() === empty_value) {
		  $(field).parent().addClass('highlight');
		  success.push(false);
		} else {
		  $(field).parent().removeClass('highlight');
		  success.push(true);
		}
	  }
	}
  
	function isproductExist(prod_name) {
	  ExistSuccess = [];
  
	  var type = "create";
	  var pname = prod_name.val();
	  var custArr = []
	  $( "#prod_customer_ids option:selected" ).each(function() {
	  	custArr.push($( this ).val());
	  });
	  var customers = custArr.join(',');
	  $.ajax({
		type: 'POST',
		async: false,
		url: appHome + '/products/common_ajax',
		data: {
		  'action_type': 'productname_exist',
		  'prod_id': null,
		  'pname': pname,
		  'type': type,
		  'customers': customers
		},
		success: function (response) {
		  if (response > 0) {
			ExistSuccess = 'Exist'
			$(prod_name).parent().addClass('highlight');
		  } else {
			ExistSuccess = 'Ok'
			$(prod_name).parent().removeClass('highlight');
		  }
		},
		error: function (response) {
		  button.attr('disabled', false);
		  $(form).find('#add_product_response').empty().prepend(alert_error).fadeIn();
		}
	  });
	}
  
	if($('#prod_name').val() != ''){
		isproductExist($(form).find('#prod_name'));
	}
	if(ExistSuccess == 'Exist'){
	  
		success.push(false);
	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This Product already exists for the selected customers.</div>';
	}else{
		success.push(true); 
		alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	} 
  
	var check_fields = (success.indexOf(false) > -1);
  
	if (check_fields === true) {
	  button.attr('disabled', false);
	  $(form).find('#add_product_response').empty().prepend(alert_required).fadeIn();
	} else {
	  $.ajax({
		type: 'POST',
		url: appHome + '/products/common_ajax',
		data: $(form).serialize().replace(/%5B%5D/g, '[]'),
		
		success: function (response) {
		  $(form).find('#add_product_response').empty().prepend('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Product Data Saved Successfully.</div>' ).fadeIn();
		  button.removeAttr('disabled');
		  $('#product').append(response);
		  $('#product').trigger("chosen:updated");
		  $('#product').change();
		  $('#add_product_modal').modal('hide');
		},
		error: function (response) {
		  button.attr('disabled', false);
		  $(form).find('#response').empty().prepend(alert_error).fadeIn();
		}
	  });
	}
  
  
  });
