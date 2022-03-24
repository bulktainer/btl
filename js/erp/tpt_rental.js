var alert_success = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-thumbs-o-up"></i>Successfully saved !!!</div>';
var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
//Function to accept only numbers in the filed
function NumberValuesOnly(fld,e)
{
	var strCheckphone = '0123456789';
	var key = '';
	var whichCodeNum = (window.Event) ? e.which : e.keyCode;

	if(window.navigator.userAgent.indexOf("MSIE") > -1){
		whichCodeNum = e.keyCode; 
	}
	
	if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter

	key = String.fromCharCode(whichCodeNum);

	if(strCheckphone.indexOf(key) == -1) return false;  // Not a valid key
}
//Function to assign 1000 if the value is less than 1000
function minMaxFunction()
{
	
	var tankweight = $('#tank_weight').val();
	if(tankweight < 1000)
		{
		$('#tank_weight').val('1000');
		}
}

function changeCurrency($this){
	$('#currency_name').val($this.selectedOptions[0].text);
	let currency_name = $this.selectedOptions[0].text;
	if($this.selectedOptions[0].text){

		if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
			$('.currency-fa').removeClass().html("").addClass('fa currency-fa'+' fa-'+currency_name.toLowerCase());
		}
		else {
			$('.currency-fa').removeClass().html(currency_name.toUpperCase()).addClass('fa currency-fa');
		}
	}
	else{
		$('.currency-fa').removeClass().html("").addClass('fa currency-fa');
	}
	// $('#currency_symbol_div').html('')
}


function changeDepotForReturn($this){
	$('#depot_for_return_code').val($this.selectedOptions[0].text != "N/A"? $this.selectedOptions[0].text : "");
}

var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';

$('.edit-tpt-rental,.create-tpt-rental').click(function(e){
	$('.highlight').removeClass('highlight');
	e.preventDefault();
	var form = '#'+$(this).closest('form').attr('id');
	success = [];
  
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
	
	function isEmail(email) {
		var regex =  /^\w+([\.\+-]?\w+)+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,15}|[0-9]{1,3})(\]?)$/;
		var t = regex.test(email.val());
		if(t){
			$(email).parent().removeClass('highlight');
			success.push(true);
		}else{
			$(email).parent().addClass('highlight');
			  success.push(false);
		}
	}
	
	highlight($(form).find('#tank_ownership'), '');
	highlight($(form).find('#currency'), '');
	highlight($(form).find('#origin_town'), '');
	highlight($(form).find('#origin_country'), '');
	highlight($(form).find('#destination_town'), '');
	highlight($(form).find('#destination_country'), '');
	highlight($(form).find('#origin_free_days'), '');
	highlight($(form).find('#destination_free_days'), '');
	highlight($(form).find('#daily_rate_after_free_days'), '');
	highlight($(form).find('#rental_amount'), '');
	highlight($(form).find('#clean'), '');
	highlight($(form).find('#depot_lift'), '');
	highlight($(form).find('#btl_collect_demtk'), '');
	highlight($(form).find('#pre_reposition_budget'), '');
	// highlight($(form).find('#depot_for_return'), '');
	highlight($(form).find('#email'), '');
	commonHighlightTextarea($(form).find('#information'), '');
	highlight($(form).find('#valid_from'), '');
	highlight($(form).find('#valid_to'), '');
	
	
	if($('#email').val() != ''){
		isEmail($(form).find('#email'));
	}
	
	success.push(true); 
	
	var check_fields = (success.indexOf(false) > -1);
	/**
	* update edit-vgm-route
	*/
	if($(this).hasClass('edit-tpt-rental')){
	   
	  if(check_fields === true){
		$('html, body').animate({ scrollTop: 0 }, 400);
		$('form').find('#response').empty().prepend(alert_required).fadeIn();
	  } else {
		  $(this).prop('disabled','disabled');
		  var tpt_rental_id = $('#hidden-tpt-rental-id').val();
		$.ajax({
		  type: 'POST',
		  url: appHome+'/tpt-rental/'+tpt_rental_id+'/update',
		  data: $(form).serialize().replace(/%5B%5D/g, '[]'),
		  success: function(response){
			window.location.href = $('#returnpath').val();
			localStorage.setItem('response', response);
		  },
		  error: (response) => {
			$(this).removeAttr('disabled');
			$('html, body').animate({ scrollTop: 0 }, 400);
			$('form').find('#response').empty().prepend(alert_error).fadeIn();
		  }
		});
	  }
	}
	
	/**
	 * create-vgm-route
	 */
	 if($(this).hasClass('create-tpt-rental')){
	   if(check_fields === true){
		 $('html, body').animate({ scrollTop: 0 }, 400);
		 $('form').find('#response').empty().prepend(alert_required).fadeIn();
	   } else {
		 $(this).prop('disabled','disabled');
		 $.ajax({
		   type: 'POST',
		   url: appHome+'/tpt-rental/add',
		   data: $(form).serialize().replace(/%5B%5D/g, '[]'),
		   success: function(response){
			 window.location.href = $('#returnpath').val();
			 localStorage.setItem('response', response);
		   },
		   error:(response) => {
			 $('html, body').animate({ scrollTop: 0 }, 400);
			 $(this).removeAttr('disabled');
			 $('form').find('#response').empty().prepend(alert_error).fadeIn();
		   }
		 });
	   }
	 }
});

$('.delete-tpt-rental').click(function(e) {
	e.preventDefault();
	
	var delete_url = $(this).attr('data-href'),
	tpt_rental_uid = $(this).attr('data-tpt-rental-uid'),
	return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
		
	 BootstrapDialog.show({
         type: BootstrapDialog.TYPE_DANGER,
         closable : false,
         title: "Confirmation (<strong>"+tpt_rental_uid+"</strong>)",
         message: "Are you sure want to delete this TPT Rental Agreement?",
         buttons: [{
		             label: 'Close',
		             action: function(dialogItself){
		                 dialogItself.close();
		             }
		         },{
	             label: 'Ok',
	             cssClass: 'btn-danger',
	             action: function(dialogItself){
	 				$.ajax({
						type: 'POST',
						url: delete_url,
		  		       	beforeSend: function() {
				        	
						},
						data: {
							
						},
						success: function(response){
							dialogItself.close();
							window.location.href = return_url;
							localStorage.setItem('response', response);
						},
						error: function(response){
							BootstrapDialog.show({title: 'Warning', message : 'Unable to delete this Tank. Please try later.',
								 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
							});
						}
					});
	             }
         }]
     });
});

function deleteDoc($this){
	
	docid = $($this).data('docid');
	doc_name = $($this).data('name');
	var url = appHome+'/tpt-rental/common-ajax';
	BootstrapDialog.confirm('Are you sure you want to delete Document '+doc_name+'?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				url: url,
				data: {
					'docid' : docid,
					'action_type': 'delete_tank_docs'
				},
				success: function(response){
					documentList()
				},
				error: function(response){
					$('html, body').animate({
						scrollTop: $("#feedback").offset().top
					}, 700);
					$('#feedback').empty().prepend(alert_error).fadeIn();
				}
			});
		}
	});
}

/**
 * File upload JS
 */



function documentList(){
	var url = appHome+'/tpt-rental/common-ajax';
	$.ajax({  
		type: "POST", 
		cache: false, 
		url: url,  
		dataType: "text",
		data: ({
			'id' :$('#tpt_rental_id').val(),
			'action_type' : 'list_upload_docs',
			'pageType' : $('#page-type').val()
		}),  
		beforeSend: function() {
            // setting a timeout
        	$('#fileAttachment').html("<td colspan='5'><div class='text-center'><img src="+$('#loaderpath').val()+"></div></td>");
        },
		success: function(result)
		{ 
			$("#file_to_upload").val("");
			$("#fileName,#tank_file_upload_textarea").val("");
			//$('#fileSize,#fileType,#fileExist').html('');
			$("#upload_btn").attr('disabled','disabled');
			
			$('#fileAttachment').html(result);
			
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
		}  
	});
}

/**
 * document file uplad function
 */
 function documentFileUpload(e) {
	
	var filename = $("#fileName").val();
	var filenameCtrl = $("#fileName");

	
	if(filename.trim() != ''){
			uploadPath = appHome+'/tpt-rental/upload';
			if(!$('#file_to_upload')[0]) {
				return false;
			}
		
			if(!$('#file_to_upload').val()) {
				$("#upload_btn").attr('disabled','disabled');
				return false;
			}
			
			var fd = new FormData();
			fd.append("file_to_upload", $('#file_to_upload')[0].files[0]);
			fd.append("attachable_id", $('#tpt_rental_id').val());
			fd.append("file_name", $('#fileName').val());
			fd.append("description", $('#file_upload_textarea').val());
			fd.append('page-type', $('#page-type').val());
			var xhr = new XMLHttpRequest();
		
			// file received/failed
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
						$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
						xhr.addEventListener("load", documentFileUploadComplete, false);
						$('#progress_num_uf').addClass(xhr.status == 200 ? "success" : "failure");
					
				}
			};
			xhr.upload.addEventListener("progress", documentFileUploadProgress, false);
			xhr.addEventListener("load", documentFileUploadComplete, false);
			xhr.addEventListener("error", documentFileUploadFailed, false);
			xhr.addEventListener("abort", documentFileUploadCanceled, false);
			xhr.open("POST", uploadPath);
			xhr.send(fd);
	
		}else{
			filenameCtrl.val('');
			filenameCtrl.focus();
		}
}
/**
 * process function
 * @param evt
 */
function documentFileUploadProgress(evt) {
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progress_num_uf').show();
	$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
	$('#upload-progress-bar').css('width',percentComplete.toString()+ '%');
	$('#upload-progress-bar').data('aria-valuenow',percentComplete.toString());
	$('#upload-progress-bar').html(percentComplete.toString() + '%');
}

/**
 * when upload is failed
 * @param evt
 */
function documentFileUploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

/**
 * if uplad is cancel
 * @param evt
 */
function documentFileUploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}

/**
 * upload complete
 * @param evt
 */
function documentFileUploadComplete(evt) {
	$('#file_to_upload').val("");
	$('#fileName').val("");
	$('#file_upload_textarea').val("");
	documentList();

	$('#progress_num_uf,#fileSize,#fileType,#fileExist').delay(2000).fadeOut('slow');
	
	$('.docs-icon[data-tpt-rental-id="'+ $('#tpt_rental_id').val() +'"]').find('.fa').removeClass().addClass('fa fa-file');
}

// file upload functio end--------------------------

$('#file_to_upload').change(function(){
	changeFileToUpload();
});

function changeFileToUpload(){
	var file = document.getElementById('file_to_upload').files[0];
	$('#fileSize,#fileType,#fileExist').show();
	if (file) {
	  var fileSize = 0;
	  if (file.size > 1024 * 1024)
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	  else
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
	  
	  var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
	  
	  var extension = fname.substr( (fname.lastIndexOf('.') +1) );
	 
	  var randomNumber = Math.floor(Math.random()*90000) + 10000;
	  document.getElementById('fileName').value = randomNumber+'_'+fname;
	  document.getElementById("fileName").select(fname);
	  

	  document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
	  document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
	}
	
	var file_cntrl = $('#file_to_upload');
	if(file_cntrl.val() != "" )
	{
		$("#upload_btn").removeAttr('disabled');
	}		
		$('#upload-progress-bar').css('width','0%');
		$('#upload-progress-bar').data('aria-valuenow','0');
		$('#upload-progress-bar').html('');
}

$('document').ready(()=> {
	if($('#page-type').val() == 'edit' && !($('#is_index').val())){
		documentList();
	}
})

function openFileModal($this){
	$('#tpt_rental_id').val($($this).data('tpt-rental-id'));
	documentList();
}


$(document).on('click', '#rental_search', function(e){
	e.preventDefault();
	var h = $('.overlay-complete-loader').height();
	if(h == 0) { h = 100; }
	$('.btl_overlay').height(h);  
	$('.btl_relative').show();
	var button = $('#rental_search');
	button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');

	$.ajax({
      	url: appHome +'/tpt-rental/common-ajax',
     	type: 'POST',
      	data : $("#rental-form").serialize().replace(/%5B%5D/g, '[]'),
      	success: function(response){
          	$('.btl_relative').hide();
        	$('#report-div').html(response);
        	if($('#records').val() == 1){
        		$('.rental_button').show();
        	}
        	else{
        		$('.rental_button').hide();
        	}
        	button.find('span').removeClass("fa fa-spinner fa-spin");
         	button.removeAttr('disabled');
        },
      	error: function(response){
      		$('html, body').animate({ scrollTop: 0 }, 400);
          	$('form').find('#response').empty().prepend(alert_error).fadeIn();
          	button.find('span').removeClass().addClass("glyphicon glyphicon-filter");
       	  	button.removeAttr('disabled');
      	}
    }); 
});

$(document).on('click','#rental_save', function(){
	
	var rental_id = $('input[name="rental_id"]:checked').val();
	var button = $('#rental_save');
	button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');
 	if(rental_id != undefined && rental_id != ''){
		$.ajax({
	      	url: appHome +'/tpt-rental/common-ajax',
	     	type: 'POST',
	      	data : {
	      		'job_id' : $('#job_id').val(),
	      		'rental_id' : rental_id,
	      		'action_type' : 'save_rental_agreements'
	      	},
	      	success: function(response){
	          	// $('html, body').animate({ scrollTop: 0 }, 400);
				window.location.href = "#job_cost_area";
				$('#is_first').val(1);
				$('#tpt_rental_id').val(rental_id);
				getJobCosts();
				$('.rental_button').hide();
	          	$('#rental_save_response').empty().prepend(alert_success).fadeIn();
	          	button.find('span').removeClass();
	       	  	button.removeAttr('disabled');
	        },
	      	error: function(response){
	      		$('html, body').animate({ scrollTop: 0 }, 400);
	          	$('form').find('#response').empty().prepend(alert_error).fadeIn();
	          	button.find('span').removeClass();
	       	  	button.removeAttr('disabled');
	      	}
	    });
	}
	else{
		$('html, body').animate({ scrollTop: 0 }, 400);
		$('form').find('#response').empty().prepend(alert_error).fadeIn();
		button.find('span').removeClass();
   	  	button.removeAttr('disabled');
	} 
});

$(document).on('click','.rental_radio', function(){
	$('.rental_button').show();
});

$('document').ready(function(){
	if($('#is_first').val() == 1) {
		getJobCosts(1);
	}
});

function getJobCosts(is_load=0){
	let first = 0;
	if($('#is_first').val() == 1 && $('#from').val() == 0) first = 1;
	$.ajax({
		url: appHome +'/tpt-rental/common-ajax',
	   	type: 'POST',
		beforeSend: function() {
						
		},
		data : {
			'job_no' : $('#job_no').val(),
			'rental_id': $('#tpt_rental_id').val(),
			'action_type' : 'get_temp_job_costs',
			'first': first,
			'is_load': is_load
		},
		success: function(response){
			$('#job_cost_table_div').show();
			$('#job_cost_tbody').html(response);
			$('#is_first').val(0);
			if(response){
				$('#final_save').show();
			}
		  
	  	},
		error: function(response){
			
		}
  }); 
}

function deleteJobCost($this){
	var id = $($this).attr('data-id');
		
	BootstrapDialog.show({
		type: BootstrapDialog.TYPE_DANGER,
		closable : false,
		title: "Delete Confirmation",
		message: "Are you sure want to delete this Job Cost?",
		
		buttons: [{
					label: 'Close',
					action: function(dialogItself){
						dialogItself.close();
					}
				},{
				label: 'Ok',
				cssClass: 'btn-danger',
				action: function(dialogItself){
				$.ajax({
					type: 'POST',
					url: appHome +'/tpt-rental/common-ajax',
					beforeSend: function() {
						
					},
					data: {
						id: id,
						action_type: 'delete_temp_job_cost'
					},
					success: function(response){
						dialogItself.close();
						getJobCosts();
					},
					error: function(response){
						BootstrapDialog.show({title: 'Warning', message : 'Unable to delete this Tank. Please try later.',
								buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
						});
					}
					});
				}
		}]
	});
}
$(document).on('change', '#job_cost_supplier', function(){
	var supplier = $('#job_cost_supplier').val();
	var mode = $('#mode').val();
	if(mode == 'add'){
		getSupplierCurrency(supplier);
	}
});
// Get supplier currency
function getSupplierCurrency(supplier){

	$.ajax({
		type: 'POST',
		url: appHome+'/purchase_order/common_ajax',
		data: {
		  'action_type' : 'get_supp_currency',
		  'supp': supplier
		},
		success: function(currency) {
			if(currency){
				currency = currency.toUpperCase();
			}
			else{
				currency = 'EUR';
			}

			$('#currency').val(currency);
			$('#actual_currency').val(currency);
			$('.chosen').chosen().trigger("chosen:updated");
			switch_specific_currency_icons(currency,'actual-currency-change');
			switch_specific_currency_icons(currency,'estimated-currency');
		}
  	});
}

$(document).on('click', '.save-job-cost,.update-job-cost', function(e){
	
	  $('.highlight').removeClass('highlight');
	  e.preventDefault();
	  var form = '#'+$(this).closest('form').attr('id'),
		  success = []
  
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
	  
	  highlight($('#job_no'), '');
	  highlight($('#activity'), '');
	  //highlight($('#element_code'), '');
	  highlight($('#job_cost_supplier'), '');
	  highlight($('#currency'), '');
	  highlight($('#actual_currency'), '');
	  //notNumber($('#element_code'), '');
  
	  var check_fields = (success.indexOf(false) > -1);
	  var estimated_currency = $('#currency').val().trim();
	  var actual_currency = $('#actual_currency').val().trim();
	  actual_currency_key = actual_currency.toLowerCase();
	  var estimated_amount = $('#estimated_amt').val().trim();
	  var actual_amount = $('#actual_amount').val().trim();
	  var exchange_json = ($('#exchange_rate_json').val() != '') ? JSON.parse($('#exchange_rate_json').val()) : '';
	 
	  var reason_code_for_overspend = $('#reason_code_for_overspend').val();
  
	  var overspend = 0;
	  var job_actual_amt = 0;
	  if(actual_amount != 0){
		  if(actual_currency != estimated_currency){
				job_actual_amt = actual_amount * (1/(exchange_json[actual_currency_key]));
		  }
		  else{
			job_actual_amt = actual_amount;
		  }
	  }

	  overspend = (job_actual_amt) - estimated_amount;
	  /**
	  * update edit-vgm-route
	  */
	  if($(this).hasClass('update-job-cost')){
  
		if(check_fields === true){
		  $('html, body').animate({ scrollTop: 0 }, 400);
		  $('form').find('#response').empty().prepend(alert_required).fadeIn();
		} 
		else if(overspend > 0 && reason_code_for_overspend == ''){
			highlight($('#reason_code_for_overspend'), '');
		  $('html, body').animate({ scrollTop: 0 }, 400);
		  $('form').find('#response').empty().prepend(alert_required).fadeIn();
		}
		else {
		  $(this).attr('disabled','disabled');  
		  $.ajax({
			type: 'POST',
			url: appHome+'/tpt-rental/common-ajax',
			data: $(form).serialize().replace(/%5B%5D/g, '[]'),
			success: function(response){
			  window.location.href = $('#returnpath').val();
			  localStorage.setItem('response', response);
			  $(this).removeAttr('disabled');
			},
			error: function(response){
			  $(this).removeAttr('disabled');
			  $('html, body').animate({ scrollTop: 0 }, 400);
			  $('form').find('#response').empty().prepend(alert_error).fadeIn();
			}
		  });
		}
	  }
	  
	  /**
	   * create-vgm-route
	   */
	   if($(this).hasClass('save-job-cost')){
		  if(check_fields === true){
			  $('html, body').animate({ scrollTop: 0 }, 400);
			  $('form').find('#response').empty().prepend(alert_required).fadeIn();
		  } 
		  else if(overspend > 0 && reason_code_for_overspend == ''){
				highlight($('#reason_code_for_overspend'), '');
			  $('html, body').animate({ scrollTop: 0 }, 400);
			  $('form').find('#response').empty().prepend(alert_required).fadeIn();
		  }
		  else {
			  $(this).attr('disabled','disabled');  
			  $.ajax({
				  type: 'POST',
				  url: appHome+'/tpt-rental/common-ajax',
				  data: $(form).serialize().replace(/%5B%5D/g, '[]'),
				  success: function(response){
					  
					window.location.href = $('#returnpath').val();
					localStorage.setItem('response', response);
					  
				  	$(this).removeAttr('disabled');
				  },
				  error: function(response){
				   $(this).removeAttr('disabled');
				   $('html, body').animate({ scrollTop: 0 }, 400);
				   $('form').find('#response').empty().prepend(alert_error).fadeIn();
				  }
			  });
		 }
	   }
	});

	function matchSupplierCurr(){
		if(($('#supplier-currency').val() != "") && ($('#actual_currency').val() != "") && ($('#supplier-currency').val() != $('#actual_currency').val())){
			$('.supplier-paste-curr').html('<strong>WARNING!</strong> Invoice currency different to Supplier currency');
		}else{
			$('.supplier-paste-curr').html('');
		}
	}

	$('#actual_currency').on('change', function() {
		var currency_id = $(this).chosen().val();
		switch_specific_currency_icons(currency_id,'actual-currency-change');
		matchSupplierCurr();
	});

	function switch_specific_currency_icons(currency_id,change_class){
		var $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
		currency_name = $currency.attr('data-label');
  
		if(!$currency.length) {
		  alert('Error. Currency not found.');
		  return false;
		}
		if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
			$("."+change_class ).removeClass().html("").addClass(change_class+' fa currency-fa fa-'+currency_name);
		}
		else {
			$("."+change_class ).removeClass().html(currency_name.toUpperCase()).addClass(change_class+' fa currency-fa');
		}
	}

	function getExchangeRates(actual_currency, year_week){

		$.ajax({
			type: 'POST',
			url: appHome+'/job-cost/common_ajax',
			data: {
			  'actual_currency' : actual_currency,
			  'year_week': year_week,
			  'action_type' : 'get_currency_exchangerate'
			},
			success: function(response){
				if(response){
					var obj = JSON.parse(response);
					$('#exchange_rate_json').val(response);
				}
			}
		});
	}

	$(document).ready(() => {
		var actual_currency = $('#currency').val();
		var year_week = $('#jobcost_year_week').val();
		if(year_week != ''){
			getExchangeRates(actual_currency, year_week);
		}
	});

	$('.cancel-job-cost').click(function(e){
		e.preventDefault();
		window.location.replace($('#returnpath').val());
	});
$(document).on('click','#final_save', function(){
	
	var button = $('#final_save');
	button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');

	$.ajax({
      	url: appHome +'/tpt-rental/common-ajax',
     	type: 'POST',
      	data : {
      		'job_id' : $('#job_id').val(),
			'prev_rental_id' : $('#prev_tpt_rental_id').val(),
      		'action_type' : 'save_final_jobcosting'
      	},
      	success: function(response){
          	$('html, body').animate({ scrollTop: 0 }, 400);
          	$('form').find('#response').empty().prepend(alert_success).fadeIn();
          	button.find('span').removeClass();
       	  	button.removeAttr('disabled');
       	  	window.location.href = $('#returnpath').val();
       	  	localStorage.setItem('response', alert_success);
        },
      	error: function(response){
      		$('html, body').animate({ scrollTop: 0 }, 400);
          	$('form').find('#response').empty().prepend(alert_error).fadeIn();
          	button.find('span').removeClass();
       	  	button.removeAttr('disabled');
      	}
    }); 
});

$(function() {
	if($("#page-type").val() == "add" || $("#page-type").val() == "edit"){
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
							changeFileToUpload();
							setTimeout(() => {
								// documentFileUpload(); to automatic upload
								myDropzone.removeAllFiles( true );
							}, 200);
						}
		
		
					});
			
				}
			});
		}

		if($("#drag_and_drop_files_on_tpt_rental_index").val()){
			Dropzone.autoDiscover = false;
			//Dropzone class
			var myDropzone = new Dropzone("#FileUpModal", {
				url: "#",
				// acceptedFiles: "image/*,application/pdf",
				maxFiles : 1, 
				previewsContainer: "#uploadModalForm",
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
							document.getElementById("uploadModalForm").scrollIntoView();
							$("#uploadModalForm").css("background-color", "#bdbdbd");
							setTimeout(() => {
								$("#uploadModalForm").css("background-color", "unset");
							}, 800);
							changeFileToUpload();
							setTimeout(() => {
								// documentFileUpload(); to automatic upload
								myDropzone.removeAllFiles( true );
							}, 200);
						}
		
		
					});
			
				}
			});
		}
});
