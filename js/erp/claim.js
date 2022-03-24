var jobFileListingFun = "";
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';

//Delete particular Claim
$(document).on('click','.delete-claim',function(e){
	e.preventDefault();
	var delete_url 		= $(this).attr('href'),
		claim_id		= $(this).data('claim-id'),
		return_url 		= window.location.href;
	BootstrapDialog.confirm('Are you sure you want to delete this Claim?', function(result){
		if(result) {
			$.ajax({
				type : 'POST',
				url  : delete_url,
				data :{
					'claim_id' 	: claim_id,
				},
				success: function(response){
					window.location.href = return_url;
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

$(document).on('change', '#c_claim_transfered', function(){
	if($(this).is(':checked')){
		$('#c_claim_against_1').attr('disabled', 'disabled').trigger('chosen:updated');
		$('#c_their_claim_ref_1').attr('disabled', 'disabled');
		
		$('#c_claim_against_2_display').show();
		$('#c_their_claim_ref_2_display').show();
		
	} else {
		$('#c_claim_against_1').removeAttr('disabled', 'disabled').trigger('chosen:updated');
		$('#c_their_claim_ref_1').removeAttr('disabled', 'disabled');
		
		$('#c_claim_against_2_display').hide();
		$('#c_their_claim_ref_2_display').hide();
	}
});

$(document).on('change', '#c_claim_outcome', function(){
	if($.inArray($(this).val(), ['2','3','4']) !== -1){
		$('#c_reason_for_closure').removeAttr('disabled', 'disabled').trigger('chosen:updated');
	} else {
		$('#c_reason_for_closure').attr('disabled', 'disabled').trigger('chosen:updated');
	}
});

//Start : Plus/Minus change 
var multiDivHtml = {};

// damage 
//Plus button  
$('.claim-add-btn').live('click',function(){
	var data = $(this).parents('.multi-div').data();
	var div_root = data.root;
	var div_parent = data.itemdiv;
	var div_varname = data.varname;
	var div_pos = $(this).data('pos');
	var sourceHtml = ""; 
	var lastDivCopy = $("." + div_parent).length;
	var div_count = data.count+1;
	var currencyClass = data.classname;
	
	$(this).parents('.multi-div').data('count',div_count);
	
	if(multiDivHtml[div_varname] == undefined){
		multiDivHtml[div_varname] = $("."+div_parent).clone()[0].outerHTML;
		sourceHtml = multiDivHtml[div_varname];
	} else {
		sourceHtml = multiDivHtml[div_varname];	
	}

	sourceHtml = sourceHtml.replace(/\[\d*\]/g,'['+ div_count +']');
	sourceHtml = sourceHtml.replace(/_0__chosen/g, '_' + div_count + '__chosen'); //Handling chosen
	sourceHtml = sourceHtml.replaceAll('highlight', ''); //remove highlight
	sourceHtml = sourceHtml.replaceAll('hasDatepicker', ''); //fix for datepicker
	
	$('#' + div_root).append(sourceHtml);
	$("." + div_parent).eq(lastDivCopy).find(".chosen-container").remove(); //Handling chosen
	$("." + div_parent).eq(lastDivCopy).find('select').show(); //Handling chosen	
	$("." + div_parent).eq(lastDivCopy).find('select').val(''); //Handling chosen
	$("." + div_parent).eq(lastDivCopy).find('select').chosen(); //Handling chosen
	$("." + div_parent).eq(lastDivCopy).find('input').val('');
	$("." + div_parent).eq(lastDivCopy).find('textarea').val('');  
	$("." + div_parent).eq(lastDivCopy).find('.claim-add-btn').data('pos',div_count);
	$("." + div_parent).eq(lastDivCopy).find('.claim-add-btn').show();
	$("." + div_parent).eq(lastDivCopy).find('.claim-sub-btn').show();
	
	$(this).next('.claim-sub-btn').show();
	$(this).hide();
	$(this).next('.sa-sag-sub-btn').show();
	
	changeDamageOptions();
 });

 //Minus button 
 $('.claim-sub-btn').live('click',function(){

	var data = $(this).parents('.multi-div').data();
	var div_parent = data.itemdiv;
	var _this_div = $(this).parents('.' + div_parent);
	var next = _this_div.next('.' + div_parent).length;
	var prev = _this_div.prev('.' + div_parent).length;
	var div_count = $('.' + div_parent).length;
	if((prev > 0 && next > 0) || (prev == 0 && next > 0)   ){
		if(div_count == 2){
			_this_div.next('.' + div_parent).find('.claim-sub-btn').hide();
		}
		_this_div.remove();
	} else if(prev > 0 && next == 0) {
		_this_div.prev('.' + div_parent).find('.claim-add-btn').show();
		if(div_count == 2){
			_this_div.prev('.' + div_parent).find('.claim-sub-btn').hide();
		}
		_this_div.remove();
	}
});
//End : Plus/Minus change


/**
* Claim edit and update
*/
$('.update-qsshe-btn').click(function(e){
  $('.highlight').removeClass('highlight');
  e.preventDefault();
  var form = $('#claim-form'),
      success = [],
      path = $(this).attr('data-path');

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

  $('select[id^=cd_damage_type]').each(function(key, value){
		var $secondItem = $('select[id^=cd_damage_detail]');
		if(key == 0){
			if($(this).val() != "" || $secondItem.eq(key).val() != ""){
				highlight($(this), '');
				highlight($secondItem.eq(key), '');
			}	
		} else {
			highlight($(this), '');
			highlight($secondItem.eq(key), '');
		}
  })	

  $('input[id^=ct_date]').each(function(key, value){
		var $secondItem = $('input[id^=ct_event_type]');
		if(key == 0){
			if($(this).val() != "" || $secondItem.eq(key).val() != ""){
				highlight($(this), '');
				highlight($secondItem.eq(key), '');
			}	
		} else {
			highlight($(this), '');
			highlight($secondItem.eq(key), '');
		}
  })	
		
  if($("#c_claimable_curr_name").val() != "" || ($("#c_claimable_cost").val() != "" && $("#c_claimable_cost").val() != 0)){
		highlight($("#c_claimable_curr_name"), '');
		highlight($("#c_claimable_cost"), '');
  }
	
  if($("#c_unclaimable_curr_name").val() != "" || ($("#c_unclaimable_cost").val() != "" && $("#c_unclaimable_cost").val() != 0)){
		highlight($("#c_unclaimable_curr_name"), '');
		highlight($("#c_unclaimable_cost"), '');
  }	
  
  if(($('#c_claim_outcome').val() == 2) || ($('#c_claim_outcome').val() == 3) || ($('#c_claim_outcome').val() == 4)){
	highlight($("#c_reason_for_closure"), '');
  }

  if($('#c_claim_stage').val() == 8){
	highlight($("#c_reason_for_closure"), '');
	highlight($("#c_claim_closed_date"), '');
  }
  var check_fields = (success.indexOf(false) > -1);
  
  /**
  * update edit-supplier
  */
  if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
  } else {
    	$(this).prop('disabled','disabled');

		$("#c_claim_against_1").removeAttr('disabled');
		$("#c_their_claim_ref_1").removeAttr('disabled');
		$("#c_reason_for_closure").removeAttr('disabled');

	    $.ajax({
	        type: 'POST',
	        url: path,
	        data: $(form).serialize().replace(/%5B%5D/g, '[]'),
	        success: function(response){
				if($('#returnpath').val() != ""){
					window.location.href = $('#returnpath').val();
				} else {
					window.location.href = $('#returnindex').val();
				}
	          	localStorage.setItem('response', response);
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	    });
  }

});


// Delete a Storage Cost File
$('.doc-file-list').on('click', ('.delete-claim-rate-file'), function(e) {
  e.preventDefault();

  var table = $(this).closest('table')
      row = $(this).closest('tr'),
      id = $(this).data('id'),
      path = $(this).data('path');
      filepath = $(this).data('filepath');

  BootstrapDialog.confirm('Are you sure you want to delete Document #'+id+'?', function(result){
    if(result) {
      $.ajax({
        type: 'POST',
        url: path,
        data: {
          'id' : id,
          'path' : filepath
        },
        success: function(response){
          row.remove();
          if(table.find('tbody > tr').length == 0) {
              $('.doc-file-list').addClass('hidden');
          }
		  $('#fileresponse').empty().prepend(response).fadeIn().delay(2000).fadeOut('slow');
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
});


//Start : Damage option change
function changeDamageOptions(){
	$(".sa_damage_type").each(function(key, value) {
		var dmgtype = $(this).val();
		
		if(dmgtype !== ""){
			$('.sa_damage_detail').eq(key).find('option').hide();
			$('.sa_damage_detail').eq(key).find('[data-subtype="'+ dmgtype +'"]').show();
		} else {
			$('.sa_damage_detail').eq(key).find('option').show();
		}
		
		//Remove selection if the option dont match
		$current_stat = $('.sa_damage_detail').eq(key).find(':selected').css('display');
		if($current_stat == "none"){
			$('.sa_damage_detail').eq(key).val('');
		}
		
		$('.sa_damage_detail').eq(key).trigger("chosen:updated");
	});
}

//Run this every time opten the page
changeDamageOptions();

$(document).on('change', '.sa_damage_type', function(){
	changeDamageOptions();
});
//End : Damage option change


/**
 * File upload JS
 */
function fileSelected(e) {
	var file = $('#file_to_upload')[0].files[0];
	if (file) {
	  var fileSize = 0;
	  if (file.size > 1024 * 1024)
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	  else
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

		var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
		$('#fileName').val(fname);
	  	$('#file_size').html('Size: ' + fileSize);
	  	$('#file_type').html('Type: ' + file.type);
	}
}

function uploadFile(e) {

	var ref_id = $('input[name="ref_id"]').val();
    var path = appHome + '/claim/upload';

	if(!$('#file_to_upload')[0].files[0]) {
		return false;
	}

	var fd = new FormData();
	fd.append("file_to_upload", $('#file_to_upload')[0].files[0]);
	fd.append("cf_doc_type", $('#cf_doc_type').val());
	fd.append("cf_doc_type_text", $('#cf_doc_type :selected').text());
	fd.append("cf_c_id", $('#cf_c_id').val());
	fd.append("cf_description", $('#cf_description').val());

	var xhr = new XMLHttpRequest();

	// file received/failed
	xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4) {
					//$('#progress_num').addClass(xhr.status == 200 ? "success" : "failure");
			}
	};

	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	xhr.open("POST", path);
	xhr.send(fd);
}

function uploadProgress(evt) {
	$('.upload-btn-claim').attr('disabled',true);
	$('.upload-btn-claim').html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Upload');
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progressJobPage').show();
	$('#job-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
	$('#job-progress-bar').css('width',percentComplete.toString()+ '%');
	$('#job-progress-bar').data('aria-valuenow',percentComplete.toString());
	$('#job-progress-bar').html(percentComplete.toString() + '%');
}

function uploadComplete(evt) {
	// clear the form
	$('#files_btn_div').find('input:text, input:file').val('');
	$("#cf_doc_type").val(5).trigger('chosen:updated');
	$('#file_size').empty();
	$('#file_type').empty();
  	var delPath = $("#fileDelPath").val();

	// fade out the progress indicator for added sexiness
	$('#progressJobPage').delay(2000).fadeOut('slow');
	$('.upload-btn-claim').removeAttr('disabled');
	$('.upload-btn-claim').html('Upload');

	var row = JSON.parse(evt.target.responseText);

	$('.doc-file-list').removeClass('hidden');

	var table = $('.table-doc-file-list');
	var file_count = $('.file-row').length + $('.new-ajax-row').length + 1;
	table.children('tbody').append(
				'<tr class="new-ajax-row success">' +
					'<td>'+file_count+'</td>' +
					'<td><a href="'+row.path+'" target="_blank" title="View/Download file">'+row.path+'</a></td>' +
					'<td class="td_file_desc">'+row.description+'</td>' +
					'<td>'+row.doc_type+'</td>' +
			        '<td>'+row.date_added+'</td>' +
					'<td><a href="'+row.path+'" target="_blank" title="View/Download file"><i class="fa fa-download"></i></a></td>' +
					'<td class="center-cell"><a href="javascript:void(0)" title="Delete Document" class="delete-claim-rate-file delete-icon" data-path="' + delPath + '" data-id="' + row.id + '" data-filepath="' + row.path + '"><i class="fa fa-trash-o"></i></a></td>' +
				'</tr>');

	var delay = setTimeout(function(){
		$('.new-ajax-row').removeClass('success');
	},2000);
}

function uploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}

//Page size change
$('.custom-page-pagesize').change(function(e){
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('#claim_filter').submit();
});

/**
 * Start : multi select option for customers
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
//End : multi select option for customers

//Start : Drag upload
$(function() {
	if($("#page-type").val() == "claim-edit"){
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
	                          uploadFile($('.upload-btn-claim')[0]);
	                      }
		                myDropzone.removeAllFiles( true );
		              }, 200);
		            }
				});
		
			}
		});
	}
});
//End : Drag upload

//Start : Sorting
 $(document).on('click', '.sortClass', function(e) {
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
	  $('#claim_filter').submit();
    }
  });

  //changes related to sorting
  if($('#sort').length > 0 && $('#sort').val() != ''){
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
    /*$('html, body').animate({
          'scrollTop' : $("#doublescroll").position().top
      });*/
  }
//End : Sorting


//Currency symbol change
$(document).on('change', '.costs_curr', function(e) {
	var cur = $(this).val();
	var curSymbol = $(this).parents('.form-group').find('.costs_symbol i');
	
	if (currency_having_symbols.indexOf(cur.toUpperCase()) >= 0) {
	  	curSymbol.removeClass().html("").addClass('fa fa-'+cur.toLowerCase());
	} else {
	  	curSymbol.removeClass().html(cur.toUpperCase()).addClass('fa fa '+cur);
	}
});

$('.costs_curr').trigger('change');

//Currency change in Listing page
if($("#page-type").val() == "claim-index"){
  $('.fa-currency').each(function(key, value){
		var cur = $(this).data('curr');
		
		if (currency_having_symbols.indexOf(cur.toUpperCase()) >= 0) {
		  	$(this).removeClass().html("").addClass('fa fa-'+cur.toLowerCase());
		} else {
		  	$(this).removeClass().html(cur.toUpperCase()).addClass('fa fa '+cur);
		}
  })	
}

if($("form").attr('id') == "claim-form"){
	autoCompleteInsuranceNumber();
}

$(document).on('click', '.link_insurance_po', function(e) {
	e.preventDefault();
	if($('#insurancenum').val() != ""){
		var ins_id = $('#hdn_ins_id').val();
		var ins_num = $('#hdn_ins_num').val();
		var claim_id= $(this).data('id');
		var type = $(this).data('type');
		$(this).prop('disabled','disabled');
		$.ajax({
			type	: 'POST',
			url		: appHome+'/claim/common_ajax',
			data: {
			'ins_id'		: ins_id,
			'ins_num'		: ins_num,
			'claim_id'		: claim_id,
			'type'			: type,
			'action_type' 	: 'link_insurance'
			},
			success: function(response){
				if(response == "success"){
					if(type == "link"){
						var linkText = '<label class="col-sm-2 control-label "for="product">Linked Insurance PO</label>'+
						'<div class="col-sm-3">'+
							'<a href="'+appHome+'/insurancepo/create?po_number='+ins_num+'"  data-id="'+claim_id+'" style="font-weight: bold;bold;font-size: 15px;" target="_blank">'+ins_num+'</a>&nbsp'+
						'<a class="btn btn-primary link_insurance_po"  data-id="'+claim_id+'" data-type="unlink" style=" padding: 2px 20px;"><span class="fa fa-link"> UNLINK</span></a>'+
						'</div>';
						$('.insurediv').html(linkText);
					}else{
						var linkText = '<label class="col-sm-2 control-label "for="product">Link Insurance PO</label>'+
						'<div class="col-sm-3">'+
							'<input id="insurancenum" name="insurancenum" class="form-control insurancenum" type="text" placeholder ="Insurance PO" value="" maxlength="25" autocomplete="on"/>'+
							'<input id="hdn_ins_id" name="hdn_ins_id" type="hidden" value="" />'+
							'<input id="hdn_ins_num" name="hdn_ins_num"  type="hidden" value="" />'+
						'</div>'+
						'<a class="col-sm-1 btn btn-success link_insurance_po"  data-id="'+claim_id+'" data-type="link">LINK</a>';
						$('.insurediv').html(linkText);
						autoCompleteInsuranceNumber();
					}
				}
			},
			error: function(response){
				$('html, body').animate({ scrollTop: 0 }, 400);
				$('form').find('#response').empty().prepend(alert_error).fadeIn();
			}
		});
	}
});

function autoCompleteInsuranceNumber(){
	//Autocomplete function to fetch the insurance PO numbers
	if($(".insurancenum").length > 0){
		$(".insurancenum").autocomplete({
			source:  appHome+'/claim/getInsurancePO',
			minLength: 2,
			type: "GET",
			success: function (event, ui) {
			},
			select: function (event, ui) {
			$(this).val(ui.item.label);
			$('#hdn_ins_num').val(ui.item.label);
			$('#hdn_ins_id').val(ui.item.value);
			return false;
			},
			change: function (event, ui) {
					if (ui.item === null) {
							BootstrapDialog.show({title: 'Error', message : 'Not a valid Insurance PO. Please try later.',
							buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
						$(this).val('');
						$('#hdn_ins_num').val('');
						$('#hdn_ins_id').val('');
					}

			}
		});
	}
}
directOrInsurance();
$(document).on('change', '#c_claim_direct_or_insurance', function(e) {
	directOrInsurance();
});

function directOrInsurance(){
	var ins = $('#c_claim_direct_or_insurance').val();
	if(ins == 2){
		$('.insurediv').show();
	}else{
		$('.insurediv').hide();
		if($('.link_insurance_po').attr('data-type') == "unlink"){
			$('.link_insurance_po').trigger('click');
		}
	}
}
$(document).on('change', '#c_claim_outcome', function(e) {
	claimOutcome();
});
 
function claimOutcome(){
	if($('#c_claim_outcome').val() == "4"){
		$("#c_claim_against_1").val(982).trigger('chosen:updated');
	}else if($('#c_claim_outcome').val() == "8"){
		$("#c_claim_against_1").val(751).trigger('chosen:updated');
	}
}
clicked_td = null;
$(document).on('click', '.claim_date_txt_fld', function(){
	var claim_id = $(this).data('claim_id');
	var claim_date = $(this).data('claim_date');
	$('#c_claim_updated_date').val(claim_date);
	$('#claim_id').val(claim_id);
	clicked_td = this;
});

$(document).on('click', '.date_update_submit', function(){
	var claim_id = $('#claim_id').val();
	var claim_date = $('#c_claim_updated_date').val();
	$.ajax({
		type: 'POST',
		url: appHome+'/claim/common_ajax',
		data: {
			'claim_id' 	  : claim_id,
			'claim_date'  : claim_date,
			'action_type' : 'update_date'
			  },
		success: function(response){
			$('.view_small_loader').hide();
			$(clicked_td).text(claim_date);
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});
});
JobOrPo();
$(document).on('click', '.job_or_po', function(e) {
    JobOrPo();
});

function JobOrPo(){
	if($("input[name='job_or_po']:checked").val() == 'job'){
	  $('.changepass').show();
	  $('.po').hide();
	  $('.job').show();
	  $('#po_number').val('');
	  $('#hdn_po_num').val('');
	  $('#hdn_po_id').val('');
	  $('#tank_num').attr('readonly', true);
	}else{
		$('.changepass').hide();
		$('.job').hide();
		$('.po').show();
		$('#job_number').val('');
		$('#hdn_job_num').val('');
		$('#hdn_job_id').val('');
		$('#customer').val('');
		$('#sea_type').val('');
		$('#sea_type_id').val('');
		$('#product').val('');
		$('#tank_num').attr('readonly', false);
	}
  }

  //Autocomplete function to fetch the po numbers
if($("#po_number").length > 0){
	$("#po_number").autocomplete({
		 source:  appHome+'/insurancepo/get_po_no_list',
		 minLength: 2,
		 type: "GET",
		 success: function (event, ui) {
		  
		 },
	   select: function (event, ui) {
	   $(this).val(ui.item.label);
	   $('#hdn_po_num').val(ui.item.label);
	   $('#hdn_po_id').val(ui.item.value);
	   getPoTankNumbers(ui.item.value);
	   return false;
	   },
	   change: function (event, ui) {
			if (ui.item === null) {
			   BootstrapDialog.show({title: 'Error', message : 'Not a valid PO. Please try later.',
		  buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			   });
			   $('#po_number').val('');
			   $('#hdn_po_num').val('');
			   $('#hdn_po_id').val('');
			}
	   }
	 });
  }
  
  //Autocomplete function to fetch the job numbers
  if($("#job_number").length > 0){
	$("#job_number").autocomplete({
		 source:  appHome+'/insurancepo/get_job_no_list',
		 minLength: 2,
		 type: "GET",
		 success: function (event, ui) {
		  
		 },
	   select: function (event, ui) {
	   $(this).val(ui.item.label);
	   $('#hdn_job_num').val(ui.item.label);
	   $('#hdn_job_id').val(ui.item.value);
	   $('#customer').val(ui.item.customer);
	   $('#customer_id').val(ui.item.customer_id);
	   $('#sea_type').val(ui.item.seatype);
	   $('#sea_type_id').val(ui.item.seatypeid);
	   $('#product').val(ui.item.product);
	   $('#product_id').val(ui.item.product_id);
	   $('#tank_num').val(ui.item.tank_num);
	   $('#hdn_tank_id').val(ui.item.tank_num_id);
	   $('#hdn_tank_num').val(ui.item.tank_num);
	   return false;
	   },
	   change: function (event, ui) {
			if (ui.item === null) {
			   BootstrapDialog.show({title: 'Error', message : 'Not a valid Job. Please try later.',
		  buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			   });
			   $('#job_number').val('');
			   $('#hdn_job_num').val('');
			   $('#hdn_job_id').val('');
			   $('#customer').val('');
			   $('#customer_id').val('');
			   $('#sea_type').val('');
			   $('#sea_type_id').val('');
			   $('#product').val('');
			   $('#product_id').val('');
			   $('#tank_num').val('');
			   $('#hdn_tank_id').val('');
			   $('#hdn_tank_num').val('');
			}
	   }
	 });
	}

	function getPoTankNumbers($po_id) {
		ExistSuccess = [];
		$.ajax({
			type: 'POST', 
			url: appHome+'/insurancepo/common_ajax',
			async : false,
			data: {
				'action_type' : 'po_tank_number',
				'po_id'	      : $po_id
			},
			success: function(response){
			  var obj = $.parseJSON(response);
			  var opt = '<option value=""></option>';
				$.each(obj,function(index, data){
				  if(data != null && ' '){
					opt += '<option value="'+index+'">'+data+'</option>';
					$('.tank_num_val').html(opt);
				  }
				});
				$('.chosen').chosen().trigger("chosen:updated");
			},
			error: function(response){
			  $('html, body').animate({ scrollTop: 0 }, 400);
			  $('form').find('#response').empty().prepend(alert_error).fadeIn();
			}
	  });
		  
	  }

	$(document).on('click', '.save_po_job_cost', function(e){
		
		$('.highlight').removeClass('highlight');
  		e.preventDefault();
  		var form = '#'+$(this).closest('form').attr('id'),
      	success = [],
      	path = $(this).attr('data-path');
		var po_or_job 					= $("input[name='job_or_po']:checked").val();
		var supplier 					= $('#supplier').val();
		var cliam_id 					= $('#claim_id').val();
		var jobPoArray 					= [];
		if(po_or_job == 'job'){
			jobPoArray 					= {
				'job_number' 	: $('#hdn_job_num').val(),
				'job_id'    	: $('#hdn_job_id').val(),
				'tank_id' 		: $('#hdn_tank_id').val(),
				'tank_number' 	: $('#hdn_tank_num').val(),
				'customer'    	: $('#customer').val(),
				'customer_id'	: $('#customer_id').val(),
				'sea_type' 		: $('#sea_type').val(),
				'sea_type_id' 	: $('#sea_type_id').val(),
				'product' 		: $('#product').val(),
				'product_id' 	: $('#product_id').val()
			}
		}else{
			jobPoArray					= {
				'po_number'		: $('#hdn_po_num').val(),
				'po_id' 		: $('#hdn_po_id').val(),
				'tank_id' 		: $('#tank_num_po').val(),
				'tank_number' 	: $('#tank_num_po :selected').text()
			}
		}
		
		function highlight(field, empty_value){
			if(field.length > 0){
			  if(field.val().trim() === empty_value){
				$(field).parent().addClass('highlight');
				success.push(false);console.log(success);
			  } else {
				$(field).parent().removeClass('highlight');
				success.push(true);
			  }
			}
		}

		if($("input[name='job_or_po']:checked").val() == 'job'){
		highlight($('#job_number'), '');
		}else{
		highlight($('#po_number'), '');
		}

		var check_fields = (success.indexOf(false) > -1);
  
	if(check_fields === true){
		$('html, body').animate({ scrollTop: 0 }, 400);
		$('form').find('#response').empty().prepend(alert_required).fadeIn();
	} else {
		$(this).attr('disabled','disabled');
			$.ajax({
				type: 'POST',
				url: appHome+'/claim/common_ajax',
				data: {
					'cliam_id'			: cliam_id,
					'po_or_job' 	  	: po_or_job,
					'supplier'  		: supplier,
					'jobPoArray'  		: jobPoArray,
					'action_type' 		: 'create_linked_po_job'
					},
				success: function(response){
					$('.clear').val('');
					$('.clear').trigger('chosen:updated');
					$('.claimAddSubCosts').prepend(response);
					$(".save_po_job_cost").attr('disabled', false);
				},
				error: function(response){
					BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
						buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		}
	});

	$(document).on('click', '.detailsLinkedCosting', function(e) {

		var poid = $(this).data('sid');
		var type = $(this).data('type');
		var mid = $(this).data('mid');
		var poarea = $(this).data('po');
		var currentVar = $(this);
		currentVar.find('i').toggleClass('fa-plus fa-minus');
		if(currentVar.attr("is-ajax-send") == 0){
		  $('<tr class="sub-tr">'
			+'<td style="background-color: #d8d8d8;" colspan="12" class="text-center">'
			  +'<i class="fa fa-spinner fa-spin" style="font-size:16px"></i>'
			  +'</td>'
			+'</tr>').insertAfter(currentVar.closest('tr'));
	  
		  setTimeout(function(){ 
			$.ajax({
				  type: 'POST', 
				  url: appHome + '/claim/common_ajax',
					data: {
					  'action_type' 	: 'claim_linked_cost',
					  'po_id' 		    : poid,
					  'type'          	: type,
					  'mid'				: mid,
					  'poarea'			: poarea
					},
				  success: function(response){
					currentVar.closest('tr').next('.sub-tr').html('<td colspan="12" style="background-color: #d8d8d8;" >'+response+'</td>');
				currentVar.attr("is-ajax-send", "1");
				$("[data-toggle=tooltip]").tooltip();
				showCommentMoreLessCommon(50);
				$('[data-toggle="popover"]').popover();
				  }
			});
		   }, 100);
		}else{
		  currentVar.closest('tr').next('.sub-tr').toggle('slow');
		}
	  });

	  //multiple recharge
$(document).ready(function(){
	$(".enable-multi-recharge").prop("checked", false);
	if($("#multiple-recharge").length < 1) {
		$('.enable-multi-recharge').attr('disabled','disabled');
	}
	$('#main_currency').val('EUR').trigger('chosen:updated');
	$('#main_currency').trigger("change");
});
var reqArray = []; // for requered 
$(document).on('change','.recharge_amount', function(){
	$('.save-multiple-recharge-btn').removeAttr('disabled');
	reqArray.push($(this).attr('data-id'));
	$('#current_id').val(reqArray);
});
$(document).on('change','.enable-multi-recharge', function(){
  var id = $(this).attr('data-id');
    $('.normal-recharge-td_'+id).toggle();
    $('.multiple-recharge-td_'+id).toggle();
    
    $(".multiple-recharge_"+id).prop("checked", false);
    if($("input[name='enable-multi-recharge']:checked").length == 1){
      $('#multiple-recharge-btn').show();
      $('#multiple-recharge-btn').attr('disabled','disabled');
    }else if($("input[name='enable-multi-recharge']:checked").length == 0){
      $('#multiple-recharge-btn').hide();
      $('#multiple-recharge-btn').attr('disabled','disabled');
    }
    
  
  

});
$(document).on('change','.multiple-recharge', function(){
	if($('.multiple-recharge:checkbox:checked').length > 0){
		$('#multiple-recharge-btn').removeAttr('disabled');
	}else{
		$('#multiple-recharge-btn').attr('disabled','disabled');
	} 
});

$(document).on('click','#multiple-recharge-btn', function(){

  var job = [];
  var po = [];

  $.each($("input[name='multiple-recharge[]']:checked"), function(){
    job.push(JSON.parse($(this).val()));
  });
  
  $.each($("input[name='multiple-rechargepo[]']:checked"), function(){
    po.push(JSON.parse($(this).val()));
  });

  $('#job').val(JSON.stringify(job));
  $('#po').val(JSON.stringify(po));
  
});

$(document).on('click','#multiple-recharge-btn', function(){
	$('#multiple_hid_form').submit();
});

$(document).on('click','.claim_sub_update', function(e){
	e.preventDefault();
	var form = '#'+$(this).closest('form').attr('id'),
      	success = [],
      	path = $(this).attr('data-path');

	function highlight(field, empty_value){
		if(field.length > 0){
		  if(field.val().trim() === empty_value){
			$(field).parent().addClass('highlight');
			success.push(false);console.log(success);
		  } else {
			$(field).parent().removeClass('highlight');
			success.push(true);
		  }
		}
	}

	if($("input[name='job_or_po']:checked").val() == 'job'){
	highlight($('#job_number'), '');
	}else{
	highlight($('#po_number'), '');
	}

	var check_fields = (success.indexOf(false) > -1);

	if(check_fields === true){
		$('html, body').animate({ scrollTop: 0 }, 400);
		$('form').find('#response').empty().prepend(alert_required).fadeIn();
	} else {
	  $(this).attr('disabled','disabled');
	  var po_id = $('#po_sub_id').val();
		$.ajax({
		  type: 'POST',
		  url: '../'+po_id+'/subupdate',
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
});

$(document).on('click', '.delete-sub-cost-btn', function(e){
	e.preventDefault();
	
	var delete_url = $(this).attr('href'),
	  ins_id = $(this).data('sub-id'),
	  $this = $(this),
	  return_url = window.location.href;
	
	BootstrapDialog.confirm('Are you sure you want to delete this Sub Cost ?', function(result){
	  if(result) {
		$.ajax({
		  type: 'POST',
		  url: delete_url,
		  data: {'ins_id' : ins_id
		  },
		  success: function(response){
			window.location.href = return_url;
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

  $(document).on('change', '#main_currency', function(e){
	var currency_id = $(this).chosen().val();
	switch_specific_currency_icons(currency_id,'main-currency-change');
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

   $(document).on('change','#main_currency', function(){
	var cur  = $(this).val();
	var bcur = $(this).data('cur');
	if(cur =="EUR"){
	  var claimatotal     	= $('#po_total').data('val');
	  var unClaimatotal     = $('#unclaim_total').data('val');
	  var conseqCosts 		= $('#consequential_costs').data('val');
	  var tatalCost      	= $('#totalCost').data('val');
	  var recovered  		= $('#recovered').data('val');

	  $('#po_total').val(claimatotal);
	  $('#unclaim_total').val(unClaimatotal);
	  $('#consequential_costs').val(conseqCosts);
	  $('#totalCost').val(tatalCost);
	  $('#recovered').val(recovered);
	}else{
	  $.ajax({
		type: 'POST',
		url: appHome+'/claim/common_ajax',
		data: {
		  'currency'    : cur,
		  'action_type' : 'get_exchange_rate'
			},
		success: function(response){
			  $('.view_small_loader').hide();
			  var claimatotal     	= $('#po_total').data('val');
			  var unClaimatotal     = $('#unclaim_total').data('val');
			  var conseqCosts 		= $('#consequential_costs').data('val');
			  var tatalCost      	= $('#totalCost').data('val');
			  var recovered  		= $('#recovered').data('val');

		  if(response != ""){
			  var claimatotal     	= (claimatotal * response).toFixed(2);
			  var unClaimatotal     = (unClaimatotal * response).toFixed(2);
			  var conseqCosts 		= (conseqCosts * response).toFixed(2);
			  var tatalCost      	= (tatalCost * response).toFixed(2);
			  var recovered  		= (recovered * response).toFixed(2);

			  $('#po_total').val(claimatotal);
			  $('#unclaim_total').val(unClaimatotal);
			  $('#consequential_costs').val(conseqCosts);
			  $('#totalCost').val(tatalCost);
			  $('#recovered').val(recovered);
		  }
		},
		error: function(response){
		  BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
			buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
		  });
		}
	  });
	}
  });