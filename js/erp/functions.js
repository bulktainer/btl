/**
* global
*/
$(document).ready(function(){
	$('.disable-before-load').removeClass('disabled');
	$('.full_loader').hide(); //added in DM-18-jun-2018
	
	$('.collapse-icon-custom').click(function(){
	    $(this).find('i').toggleClass('fa-minus-circle fa-plus-circle');    
	});
});
$('#response').empty().prepend(localStorage.getItem('response')).fadeIn();
$('#response1').empty().prepend(localStorage.getItem('response1')).fadeIn();
localStorage.clear();

var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required information below.</div>';

$("[data-toggle=tooltip]").tooltip();

/**
* chosen select dropdowns
*/
var chosen_options = {
  allow_single_deselect: true,
  width: "100%"
};

var selected_curr;

$('select.chosen').chosen(chosen_options);


$(document).ready(function(){
      $("input[name='dirty_clean']").click(
      function(){
          if ($(this).is(':checked') && $(this).val() == 'clean') {
              var haz_det = $('#haz_detail').val();
              var primary_cls = $('#primary_class').val();
              var sec_cls = $('#secondary_class').val();
              var ter_cls = $('#tertiary_class').val();
              var ship_name = $('#proper_shipping_name').val();
              var pk_grp = $('#packing_group').val();
                $('#haz_hidden').val(haz_det);
                $('#pri_hidden').val(primary_cls);
                $('#sec_hidden').val(sec_cls);
                $('#ter_hidden').val(ter_cls);
                $('#ship_hidden').val(ship_name);
                $('#pkgrp_hidden').val(pk_grp);
                $('#haz_detail').val('N/A');
                $('#primary_class').val('N/A');
                $('#secondary_class').val('N/A');
                $('#tertiary_class').val('N/A');
                $('#proper_shipping_name').val('N/A');
                $('#packing_group').val('N/A');
            
          }if ($(this).is(':checked') && $(this).val() == 'dirty') { 
              var haz_det = $('#haz_hidden').val();
              var primary_cls = $('#pri_hidden').val();
              var sec_cls = $('#sec_hidden').val();
              var ter_cls = $('#ter_hidden').val();
              var ship_name = $('#ship_hidden').val();
              var pk_grp = $('#pkgrp_hidden').val();
            
                $('#haz_detail').val(haz_det);
                $('#primary_class').val(primary_cls);
                $('#secondary_class').val(sec_cls);
                $('#tertiary_class').val(ter_cls);
                $('#proper_shipping_name').val(ship_name);
                $('#packing_group').val(pk_grp);
          }
      }); 


  /**
  * reload chosen select boxes
  */
  $('#supplier_extras_modal, #customer_quote_modal').on('shown.bs.modal', function(){
    $(this).find('.chosen').chosen('destroy').chosen(chosen_options);
    $(this).find('.chosen').prop('selectedIndex', 0);
  });


  /**
  * datepicker
  */
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

  $(document).on('focus', '.dynamicdatepicker', function(e){	
	 $(this).datepicker({
	    dateFormat: btl_default_date_format,
	    changeMonth: true,
	    changeYear: true,
	    inline: true,
	    startDate: 0
	  });
  });

  $('.date-input-icon').click(function() {
	    $(this).parent().find('.date-input').trigger('focus');
  });
  
  $('.date-input').datepicker({
	    dateFormat: btl_default_date_format,
	    inline: true,
	    startDate: 0
  });
  
  
  function alert_msg(msg){
    BootstrapDialog.show({
      type: BootstrapDialog.TYPE_WARNING,
      message: msg,
      buttons: [{
        label: 'OK',
        action: function(dialogItself){
            dialogItself.close();
        }
      }]
    });
  }

  function to_decimal(value){
    return parseFloat(value).toFixed(2);
  }


  $('select:not(.no-highlight)').change(function() {
    if($(this).val() === '0'){
      $(this).parent().addClass('highlight');
    } else {
      $(this).parent().removeClass('highlight');
    }
  });

  $('input').live('blur',function() {
    if($(this).val() === '' && !$(this).hasClass('datepicker') && !$(this).hasClass('filter-input-fld')){
      $(this).parent().addClass('highlight');
    } else {
      $(this).parent().removeClass('highlight');
    }
  });


});


$(function() {
  $.tablesorter.addParser({
    id: 'data',
    is: function(s) {
      return false;
    },
    format: function(s, table, cell, cellIndex) {
      var $cell = $(cell);
      if (cellIndex === 1) {
          return $cell.attr('data-date') || s;
      }
      return s;
    },
    type: 'text'
  });

  $('.custom-table').tablesorter({
    headers: {
      1: {
        sorter: 'data'
      }
    },
    sortList: [[0, 0]],
    widgets: ['zebra', 'filter', 'saveSort'],
    widgetOptions: {
      filter_childRows: false,
      filter_columnFilters: true,
      filter_cssFilter: 'tablesorter-filter',
      filter_functions: null,
      filter_hideFilters: false,
      filter_ignoreCase: true,
      filter_reset: '.reset',
      filter_searchDelay: 300,
      filter_startsWith: false,
      filter_useParsedData: false
    }
  }).tablesorterPager({
    container: $('.custom-pagination'),
    output: 'Records {startRow} to {endRow} (Total {totalRows} Results) - Page {page} of {totalPages}',
    removeRows: false,
    size: 25
  });

  $('.filter').change(function(){
    var filters = $('table').find('input.tablesorter-filter'),
        col = $(this).find(':selected').data('filter-column'),
        txt = $(this).find(':selected').data('filter-text');
    filters.eq(col).val(txt).trigger('search', false);
  });
});

$('.filters').hide();

$('.reset').click(function(){
  $('.chosen').val('').trigger('chosen:updated');
  
  var defalt_fltr_curr = $('#default_filter_currency').val();  
  if (defalt_fltr_curr == undefined) {
	  defalt_fltr_curr = 1;
  }
  $('#currency-filter').val(defalt_fltr_curr).trigger('chosen:updated');
});


$('.show-filters').click(function(){
  $('.filters').slideToggle({
    complete: function(){
      $(this).css('overflow', 'visible');
    }
  }).toggleClass('active');

  if($('.filters').hasClass('active')){
    $('.show-filters').removeClass('btn-info').addClass('btn-primary');
    $('.show-filters').html('<span class="glyphicon glyphicon-remove-circle"></span> Close Search Filters');
  } else {
    $('.show-filters').removeClass('btn-primary').addClass('btn-info');
    $('.show-filters').html('<span class="glyphicon glyphicon-sort"></span> View Search Filters');
  }
});






/*-------------------------------------------------------------------------------------*\
  File upload JS
\*-------------------------------------------------------------------------------------*/

function newFileSelected(e) {
	var file = $('#file_to_upload')[0].files[0];
	if (file) {
	  var fileSize = 0;
	  if (file.size > 1024 * 1024)
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	  else
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

	  var attachable_id = $('input[name="attachable_id"]').val();
	  $('#file_size').html('Size: ' + fileSize);
	  $('#file_type').html('Type: ' + file.type);
		$('#progress_num').removeClass('success');
	}
}

function newUploadFile(e) {

	//var attachable_id = $('input[name="attachable_id"]').val();

	if(!$('#file_to_upload')[0]) {
		return false;
	}
	if($('#file_to_upload').attr('value') == ""){
		return false;
	}
  
  var postpath = $('#erp-root').val()+'erp.php/upload';

	var fd = new FormData();
	fd.append("file_to_upload", $('#file_to_upload')[0].files[0]);
	fd.append("file_desc", $('#file_desc').val());
	fd.append("attachable_id", $('input[name="attachable_id"]').val());
	fd.append("attachable_type", $('input[name="attachable_type"]').val());

	var xhr = new XMLHttpRequest();

	// file received/failed
	xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4) {
					$('#progress_num').addClass(xhr.status == 200 ? "success" : "failure");
			}
	};

	xhr.upload.addEventListener("progress", newUploadProgress, false);
	xhr.addEventListener("load", newUploadComplete, false);
	xhr.addEventListener("error", newUploadFailed, false);
	xhr.addEventListener("abort", newUploadCanceled, false);
	xhr.open("POST", postpath);
	xhr.send(fd);
}

function newUploadProgress(evt) {
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progress_num').show().html(percentComplete.toString() + '%');
}

function newUploadComplete(evt) {

	// clear the form
	$('.file-upload-fieldset').find('input:text, input:file').val('');
	$('#file_size').empty();
	$('#file_type').empty();

	// fade out the progress indicator for added sexiness
	$('#progress_num').delay(2000).fadeOut('slow');

	var row = JSON.parse(evt.target.responseText);

	$('#attachments').removeClass('hidden');
  
  var root = $('#erp-root').val().slice(0,-1);

	var table = $('.table-attachments');
	table.children('tbody').append(
				'<tr class="new-ajax-row success">' +
					'<td>'+row.id+'</td>' +
					'<td><a href="'+root+row.path+'" target="_blank" title="View/Download file">'+row.path+'</a></td>' +
					'<td>'+row.description+'</td>' +
					'<td>'+row.created_at+'</td>' +
					'<td><a href="'+row.path+'" target="_blank" title="View/Download file"><i class="fa fa-download"></i></a></td>' +
					'<td class="center-cell"><a href="#" title="Delete Document" class="delete-attachment-and-file delete-icon" data-attachment-id="'+row.id+'" data-path="'+row.path+'"><i class="fa fa-trash-o"></i></a></td>' +
				'</tr>');

	// add hidden field so that files can be updated with a cost ID
	$('.file-upload-fieldset').append('<input type="hidden" name="files-to-update[]" value="'+row.id+'" />');

	var delay = setTimeout(function(){
		$('.new-ajax-row').removeClass('success');
	},2000);

  // Refresh tab-content height
  $('.tab-content').css({ height: $('.tab-pane').height() });
}

function newUploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

function newUploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}



// Delete an attachment and the file
$('.attachments-hug').on('click', ('.delete-attachment-and-file'), function(e) {
	e.preventDefault();

	var table = $(this).closest('table')
			row = $(this).closest('tr'),
			attachmentid = $(this).attr('data-attachment-id'),
			path = $(this).attr('data-path');
			root = $('#erp-root').val();

	BootstrapDialog.confirm('Are you sure you want to delete attachment #'+attachmentid+'?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				url: root+'erp.php/delete-attachment-and-file',
				data: {
					'attachment_id' : attachmentid,
					'path' : path
				},
				success: function(response){
					row.remove();
					if(table.find('tbody > tr').length == 0) {
							$('#attachments').addClass('hidden');
					}
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

/**
* Validations
*/

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

function NonDecimalNumber(data) {
    var re = /^-?\d+(\.\d{1,2})?$/;
    var result = 0;
    
    if(data.value != "")
    {
	    result = parseInt(data.value);
	    
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
	    	 result = parseInt(result);
	    	 $(data).val(result);
	    }
    }
}


function Date_Check(data)
{
	var dt_val = $(data).val();
	var dt_len = dt_val.length;
	var dt_split = dt_val.split('/');
  var dt_arr = btl_default_date_format.split('/');
	var dt_err = false;
	
	if (dt_val != "" && dt_len == 10 && dt_split.length == 3)
	{
		var dt_date = parseInt(dt_split[dt_arr.indexOf('dd')]);
		var dt_month = parseInt(dt_split[dt_arr.indexOf('mm')]);
		var dt_year = parseInt(dt_split[dt_arr.indexOf('yy')]);
		
		if(!isNaN(dt_year) && dt_year > 0)
		{
			if(!isNaN(dt_month) && dt_month > 0 && dt_month <= 12)
			{
				if(!isNaN(dt_date) && dt_date > 0 && dt_date <= 31) 
				{
					switch(dt_month) {
					    case 4:
					    case 6:	
					    case 9:
					    case 11:
					    	if(dt_date == 31) {dt_err = true;}
					    	break;
					    case 2:	
					    	if (dt_date > 29) {
					    		dt_err = true;
					    	} else if(dt_year % 4 != 0 && dt_date > 28) {
					    		dt_err = true;
					    	}
					    	break;
					}
					
				} else {
					dt_err = true;
				}

			} else {
				dt_err = true;
			}
			
		} else {
			dt_err = true;
		}
		
	} else {
		dt_err = true;
	} 
	
	if(dt_err){
		return false;
	} else {
		return true;
	}
	
}

function checkIsValidDateRange(date1, date2)
{
	var dt_split_1 = date1.split('/');
	var dt_split_2 = date2.split('/');
  var dt_arr = btl_default_date_format.split('/');
	
	if (dt_split_1.length != 3 || dt_split_2.length != 3)
	{
		return false;
	}
	
	var dt_date_1 = parseInt(dt_split_1[dt_arr.indexOf('dd')]);
	var dt_month_1 = parseInt(dt_split_1[dt_arr.indexOf('mm')]);
	var dt_year_1 = parseInt(dt_split_1[dt_arr.indexOf('yy')]);
	
	var dt_date_2 = parseInt(dt_split_2[dt_arr.indexOf('dd')]);
	var dt_month_2 = parseInt(dt_split_2[dt_arr.indexOf('mm')]);
	var dt_year_2 = parseInt(dt_split_2[dt_arr.indexOf('yy')]);
	
	var cdate1 = (dt_year_1 * 366) + (dt_month_1 * 30) +  dt_date_1;
	var cdate2 = (dt_year_2 * 366) + (dt_month_2 * 30) +  dt_date_2;
	
	var result = false;
	
	if (cdate2 >= cdate1)
	{
		result = true;
	}
	
	return result;
}
//Accept number and string only
function NumberValuesAndString(fld,e)
{
	var strCheckphone = '0123456789.-';
	var key = '';
	var whichCodeNum = (window.Event) ? e.which : e.keyCode;

	if(window.navigator.userAgent.indexOf("MSIE") > -1){
		whichCodeNum = e.keyCode; 
	}
	
	if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter

	key = String.fromCharCode(whichCodeNum);

	if(/^[a-zA-Z0-9 ]*$/.test(key) == false) {
	    return false;
	}
}

function commonHighlight(field, empty_value){
    if(field.length > 0){
	      if(field.val().trim() === empty_value){
	        $(field).parent().addClass('highlight');
	        return false;
	      } else {
	        $(field).parent().removeClass('highlight');
	        return true;
	      }
	}
}

function commonHighlightTextarea(field, empty_value){
     if(field.length > 0){
           if(field.val().trim() === empty_value){
             $(field).css('border','1px solid red'); 
             return false;
           } else {
             $(field).css('border','1px solid #ccc'); 
             return true;
           }
      } 
}

function isValidationSuccess(success, alert_required){
	
	var check_fields = (success.indexOf(false) > -1);
	if(check_fields === true){
		alertMsgCommon(alert_required);
	    return false;
    } else {
   	 	return true;
    }
}

function alertMsgCommon(alert_required){
	$('html, body').animate({ scrollTop: 0 }, 400);
    $('#response').empty().prepend(alert_required).fadeIn();
}

function alertMsgDiv(msg, msgType){

  if(msgType == 'success'){
    var classType = "alert-success";
    var msgType = "Success!";
    var exclamation = "fa fa-thumbs-o-up";
  }else{
    var classType = "alert-danger";
    var msgType = "Uh oh!";
    var exclamation = "fa fa-exclamation-triangle";
  }
	return '<div class="alert '+classType+' alert-dismissable">'
				+'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'
				+'<i class="'+exclamation+'"></i> <strong>'+msgType+'</strong> '+ msg +'</div>';
}

function showBTLloader(){
    var h = $('.overlay-complete-loader').height();
    if(h == 0) { h = 100; }
    $('.btl_overlay').height(2000);  
    $('.btl_relative').show();
}

function htmlRenderWithBTLloader(classname, htmldata){
  $('.btl_relative').hide();
  $('.'+classname).html(htmldata);
}

function showCommentMoreLessCommon(showChar){ // How many characters are shown by default
    $('.more').each(function() {
        var content = $(this).html();
        var moretext = '<i class="fa fa-plus-circle comment-show red-tooltip" data-html="true" data-comment="'+content+'"></i>';
        if(content.length > showChar) {
           var c = content.substr(0, showChar);
           var h = content.substr(showChar, content.length - showChar);
           var html = c + '<span class="morecontent"><span>' + h + '</span><a href="" class="morelink-common" more-data="'+content+'">' + moretext + '</a></span>';
           $(this).html(html);
        }
        
    });
}

$(document).on('click', '.morelink-common', function(e) {
  e.preventDefault();
  var lesstext = "<i class='fa fa-minus-circle'></i>";
  if($(this).hasClass("less")) {
      $(this).removeClass("less");
      var content = $(this).attr('more-data');
    var moretext = '<i class="fa fa-plus-circle comment-show red-tooltip" data-html="true" data-comment="'+content+'"></i>';
      $(this).html(moretext);
  } else {

      $(this).addClass("less");
      $(this).html(lesstext);
  }
  $(this).parent().prev().toggle();
  $(this).prev().toggle();
  return false;
});

function getJsDateObj(date1)
{
	var dt_split = date1.split('/');
  	var dt_arr = btl_default_date_format.split('/');
	
	var dt_date = parseInt(dt_split[dt_arr.indexOf('dd')]);
	var dt_month = parseInt(dt_split[dt_arr.indexOf('mm')]);
	var dt_year = parseInt(dt_split[dt_arr.indexOf('yy')]);

	var result = new Date(dt_year + '-' + dt_month + '-' + dt_date);
	
	return result;
}

function getAddedDate(dateString, addvalue, datesFormat){
	
	var result = datesFormat;
	var dateObj = getJsDateObj(dateString);
		dateObj.setDate(dateObj.getDate() + addvalue);
	
	var yearVal = dateObj.getFullYear();
	var monthVal = dateObj.getMonth() + 1;
	var dateVal = dateObj.getDate();
	
	if(dateVal < 10){
		dateVal = '0' + dateVal;
	}
	
	if(monthVal < 10){
		monthVal = '0' + monthVal;
	}
	
	result = result.replace("yyyy",yearVal);
	result = result.replace("mm",monthVal);
	result = result.replace("dd",dateVal);

	return result;
}

//Accept character and space and plus symbol
function CharacterAndPlus(fld,e)
{
	var key = '';
	var whichCodeNum = (window.Event) ? e.which : e.keyCode;

	if(window.navigator.userAgent.indexOf("MSIE") > -1){
		whichCodeNum = e.keyCode; 
	}
	
	if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter

	key = String.fromCharCode(whichCodeNum);

	if(/^[a-zA-Z+ ]*$/.test(key) == false) {
	    return false;
	}
}

//Accept printable character
function PrintableCharacter(fld,e)
{
	var key = '';
	var whichCodeNum = (window.Event) ? e.which : e.keyCode;

	if(window.navigator.userAgent.indexOf("MSIE") > -1){
		whichCodeNum = e.keyCode; 
	}
	
	if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter

	key = String.fromCharCode(whichCodeNum);

	if(/^[a-zA-Z0-9@()_.~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\? ]*$/.test(key) == false) {
	    return false;
	}
}

//Accept number,string and slash
function NumberLetterSlash(fld,e)
{
	var strCheckphone = '0123456789.-';
	var key = '';
	var whichCodeNum = (window.Event) ? e.which : e.keyCode;

	if(window.navigator.userAgent.indexOf("MSIE") > -1){
		whichCodeNum = e.keyCode; 
	}
	
	if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter

	key = String.fromCharCode(whichCodeNum);

	if(/^[a-zA-Z0-9/ ]*$/.test(key) == false) {
	    return false;
	}
}

//Accept number and plus
function NumberSpacePlus(fld,e)
{
	var strCheckphone = '0123456789.-';
	var key = '';
	var whichCodeNum = (window.Event) ? e.which : e.keyCode;

	if(window.navigator.userAgent.indexOf("MSIE") > -1){
		whichCodeNum = e.keyCode; 
	}
	
	if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter

	key = String.fromCharCode(whichCodeNum);

	if(/^[0-9+ ]*$/.test(key) == false) {
	    return false;
	}
}

function getFormattedDate(date_string, converting_format = "dd/mm/yy", current_format = "yy-mm-dd")
{
	current_format = current_format.replace(/\//g, "-");
	date_string = date_string.replace(/\//g, "-");
	var dt_split = date_string.split('-');
	dt_arr = current_format.split('-');
	var dt_date = parseInt(dt_split[dt_arr.indexOf('dd')]);
	var dt_month = parseInt(dt_split[dt_arr.indexOf('mm')]);
	var dt_year = parseInt(dt_split[dt_arr.indexOf('yy')]);
	return converting_format.replace("yy", dt_year)
							.replace("mm", (dt_month.toString().length == 1? "0": "") + dt_month)
							.replace("dd", (dt_date.toString().length == 1? "0": "") + dt_date);
}