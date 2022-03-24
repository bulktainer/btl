
//file upload function start------------------------

function decimalNumberTank(data) {
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

/**
 * Switches currency icon classes
 */

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

function trim2decimalOnly(element){
	var len = element.val();
	var with2Decimals = len.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
	if(with2Decimals > 9999.99){
		with2Decimals = 9999.99;
	}
	element.val(with2Decimals);
}
function isoCode(){
	
	var len = $('#tank_length').val();
	if(len != "" && len != null)
		{
		var with2Decimals = len.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
		var flag = 0;
		var isocode = '';
		$(".iso-code").each(function() {
			var isolen = $(this).data('length');
			if(isolen == with2Decimals){
	    	isocode = $(this).data('code');
			}
			});
	
		$('#tank_iso_code').val(isocode);
		$($('#tank_iso_code')).parent().removeClass('highlight');  
		if(len == 6.0580){
			$('#tank_type').val('20ft');
		}
		else if(len > 6.0580){
			$('#tank_type').val('swap');
		}
		else{
			$('#tank_type').val('');
		}
		$('.chosen').trigger("chosen:updated");

	}
}
/**
 * document file uplad function
 */
function documentFileUpload(e) {
	
	var filename = $("#fileName").val();
	var filenameCtrl = $("#fileName");
	var page_name = $('#page_name').val();

	
	if(filename.trim() != ''){
			uploadPath = $("#fileUploadPath").val();
			if(!$('#file_to_upload')[0]) {
				return false;
			}
		
			if(!$('#file_to_upload').val()) {
				$("#upload_btn").attr('disabled','disabled');
				return false;
			}
			
			var fd = new FormData();
			fd.append("file_to_upload", $('#file_to_upload')[0].files[0]);
			fd.append("attachable_id", $('input[name="attachable_id"]').val());
			fd.append("attachable_type", $('#attachable_type').val());
			fd.append("new_file_name", $('#fileName').val());
			fd.append("tank_file_description", $('#tank_file_upload_textarea').val());
		
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
	var id = $('#attachable_id').val();
	var type = $('#attachable_type').val();
	var page_name = $('#page_name').val();

	if(type == 'Tank'){
		var typeData = 'tank_doc';
	}else if(type == 'Tank_gallery'){
		var typeData = 'tank_gallery';
	}else if(type == 'Tank_periodic_test'){
		var typeData = 'tank_periodic_test';
	}else{
		var typeData = 'on_hire_agreement_doc';
	}
	if(page_name == 'profile'){
		profileTankList(id,type);
	}
	else{
		tankFileList(id,type);
	}
	$('#progress_num_uf,#fileSize,#fileType,#fileExist').delay(2000).fadeOut('slow');
	$('.docs-icon[data-id="'+ id +'"][data-upload-type="'+ typeData +'"]').find('.fa').removeClass().addClass('fa fa-file');
	if(page_name == 'intermediate-tank-series-page'){
		$('.docs-icon[data-id="'+ id +'"][data-upload-type="batch_tank_series"]').find('.fa').removeClass().addClass('fa fa-file');
	}
}

// file upload functio end--------------------------

/**
 * document list in popup
 */
function tankFileList(id,type){
	var url = appHome+'/tank-core/common_ajax';
	$.ajax({  
		type: "POST", 
		cache: false, 
		url: url,  
		dataType: "text",
		data: ({
			'id' :id,
			'type' : type,
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
		    if( $('#page-type').val() == 'intermediate-tank-series-page') {
		    	if ( $( "tr" ).is( ".file-row" ) ) {
 
    				$('.docs-icon[data-id="'+ id +'"][data-upload-type="batch_tank_series"]').find('.fa').removeClass().addClass('fa fa-file');
 
				}}

			}  
	});
}
//To find the Next Periodic Test Due date
function testInformation(context)
{ 
	var predate = $('#tank_prev_test_date').val();
	if(predate != "")
		{
		$('#tank_next_mot_date').datepicker("option", "minDate", null);
		$('#tank_next_mot_date').datepicker("option", "maxDate", null); 
		}
	//console.log(predate);
	var nextdate = "2.5Yr";//$('#tank_next_mot_type').val();
	//console.log(nextdate);
	 if(predate != "" && nextdate != "")
 	{
	var predate = $('#tank_prev_test_date').val().split('/');
	var dateDay = parseInt(predate[0]);
    var dateMonth = parseInt(predate[1]);
    var dateYear = parseInt(predate[2]);
    var nex = [dateMonth,dateDay,dateYear].join('/');
	var d=new Date($.datepicker.formatDate('mm/dd/yy', new Date(nex)));
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDate();

	var tankmotType=parseFloat(nextdate)
	var motyear=parseInt(tankmotType);
	var motmonth=tankmotType-motyear;
	var calmotmonth = motmonth * 12;
	var nextperiodic = new Date(year + motyear , month + calmotmonth , day);
	$('#tank_next_mot_date').val($.datepicker.formatDate('dd/mm/yy', new Date(nextperiodic)));
	$($('#tank_next_mot_date')).parent().removeClass('highlight');  
	
/*	if(nextdate == '2.5Yr')
	{
	var nextperiodic = new Date(year + 2 , month + 6 , day);
	$('#tank_next_mot_date').val($.datepicker.formatDate('dd/mm/yy', new Date(nextperiodic)));
	$($('#tank_next_mot_date')).parent().removeClass('highlight');  
	}
	else if(nextdate == '5Yr')
	{
	var nextperiodic = new Date(year + 5, month, day);
	$('#tank_next_mot_date').val($.datepicker.formatDate('dd/mm/yy', new Date(nextperiodic)));
	$($('#tank_next_mot_date')).parent().removeClass('highlight');  
	}
	*/	
 	}
}
//function for the test type and previous date change
$("#tank_next_mot_type,#tank_prev_test_date").change(function(){
   testInformation(); 	
    
    //	$('#tank_prev_test_date').parent().addClass('highlight');
 
});
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
function nominalCapacityRange()
{
var tank_capacity1=$('#tank_capacity').val();
var tank_capacity2=$('#tank_capacity2').val();
var tank_capacity3=$('#tank_capacity3').val();
var tank_capacity4=$('#tank_capacity4').val();
	if(tank_capacity1 < 24000 || tank_capacity1 > 35500)
	{ 
	$('#tank_normal_capasity').val('0');
	calculateNominalCapacity();
	}
	if(tank_capacity2 < 24000 || tank_capacity2 > 35500)
	{
	$('#tank_normal_capacity2').val('0');
	calculateNominalCapacity();
	}
	if(tank_capacity3 < 24000 || tank_capacity3 > 35500)
	{
	$('#tank_normal_capacity3').val('0');
	calculateNominalCapacity();
	}
	if(tank_capacity4 < 24000 || tank_capacity4 > 35500)
	{
	$('#tank_normal_capacity4').val('0');
	calculateNominalCapacity();
	}
	
	if(tank_capacity1 >= 24000 && tank_capacity1 <= 25499 )
	{
	$('#tank_normal_capasity').val('25000');
	calculateNominalCapacity();
	}
	if(tank_capacity1 >= 25500 && tank_capacity1 <= 27499)
	{
	$('#tank_normal_capasity').val('26000');
	calculateNominalCapacity();
	}
	if(tank_capacity1 >= 27500 && tank_capacity1 <= 32499)
	{
	$('#tank_normal_capasity').val('31000');
	calculateNominalCapacity();
	}
	if(tank_capacity1 >= 32500 && tank_capacity1 <= 34499)
	{
	$('#tank_normal_capasity').val('33000');
	calculateNominalCapacity();
	}
	if(tank_capacity1 >= 34500 && tank_capacity1 <= 35500)
	{
	$('#tank_normal_capasity').val('35000');
	calculateNominalCapacity();
	}
	
	if(tank_capacity2 >= 24000 && tank_capacity2 <= 25499 )
	{	
	$('#tank_normal_capacity2').val('25000');
	calculateNominalCapacity();
	}
	if(tank_capacity2 >= 25500 && tank_capacity2 <= 27499)
	{
	$('#tank_normal_capacity2').val('26000');
	calculateNominalCapacity();
	}
	if(tank_capacity2 >= 27500 && tank_capacity2 <= 32499)
	{
	$('#tank_normal_capacity2').val('31000');
	calculateNominalCapacity();
	}
	if(tank_capacity2 >= 32500 && tank_capacity2 <= 34499)
	{
	$('#tank_normal_capacity2').val('33000');
	calculateNominalCapacity();
	}
	if(tank_capacity2 >= 34500 && tank_capacity2 <= 35500)
	{
	$('#tank_normal_capacity2').val('35000');
	calculateNominalCapacity();
	}
	
	if(tank_capacity3 >= 24000 && tank_capacity3 <= 25499 )
	{	
	$('#tank_normal_capacity3').val('25000');
	calculateNominalCapacity();
	}
	if(tank_capacity3 >= 25500 && tank_capacity3 <= 27499)
	{
	$('#tank_normal_capacity3').val('26000');
	calculateNominalCapacity();
	}
	if(tank_capacity3 >= 27500 && tank_capacity3 <= 32499)
	{
	$('#tank_normal_capacity3').val('31000');
	calculateNominalCapacity();
	}
	if(tank_capacity3 >= 32500 && tank_capacity3 <= 34499)
	{
	$('#tank_normal_capacity3').val('33000');
	calculateNominalCapacity();
	}
	if(tank_capacity3 >= 34500 && tank_capacity3 <= 35500)
	{
	$('#tank_normal_capacity3').val('35000');
	calculateNominalCapacity();
	}
	
	if(tank_capacity4 >= 24000 && tank_capacity4 <= 25499 )
	{	
	$('#tank_normal_capacity4').val('25000');
	calculateNominalCapacity();
	}
	if(tank_capacity4 >= 25500 && tank_capacity4 <= 27499)
	{
	$('#tank_normal_capacity4').val('26000');
	calculateNominalCapacity();
	}
	if(tank_capacity4 >= 27500 && tank_capacity4 <= 32499)
	{
	$('#tank_normal_capacity4').val('31000');
	calculateNominalCapacity();
	}
	if(tank_capacity4 >= 32500 && tank_capacity4 <= 34499)
	{
	$('#tank_normal_capacity4').val('33000');
	calculateNominalCapacity();
	}
	if(tank_capacity4 >= 34500 && tank_capacity4 <= 35500)
	{
	$('#tank_normal_capacity4').val('35000');
	calculateNominalCapacity();
	}
	
}

$(document).ready(function(){
	var value = $('#tank_compartments').val();
	showCapacityBox(value);
	calculateCapacity();
	calculateNominalCapacity();
	showLeaseDetails();
	hideDeepSeaFlag();
	if($('#page-type').data('form-type') != 'duplicate'){
		getDamagedData($('#attachable_main_form').val());
	}
	/*if ($("input[name='pot-type'][value='1']").prop("checked")){
		$('#tank_compartments').attr('disabled',true);
		$('.chosen').trigger("chosen:updated");
	}*/
	
	if($('#page-type').data('form-type') == 'edit')
	{
		if ($("input[name='tank_electric_tank'][value='0']").prop("checked")){
		$("#tank_electric_type").attr("disabled",true);
		$('.electricgray').css({color:'grey'});
		}
	}
	$('.chosen').trigger("chosen:updated");
	
	
	$( ".datemanufacture" ).datepicker( "option", "yearRange", "1980:2028" );
	if($('#page-type').data('form-type') == 'add')
		{
		$('#tank_next_mot_date').datepicker("option", "minDate", -1);
		$('#tank_next_mot_date').datepicker("option", "maxDate", -2); 
		}
	//Function to calculate the largest date
	$('.datepicker').on('change', function(){
		if($('#tank_prev_test_date').length > 0   && $('#tank_next_mot_date').length > 0){
		   var pre_dt = $('#tank_prev_test_date');
		   var next_dt = $('#tank_next_mot_date');

		   var dt1 = Date_Check(pre_dt);
		   var dt2 = Date_Check(next_dt);

		   if(dt1 == true && dt2 == true)
			{
				if(!checkIsValidDateRange(pre_dt.val(),next_dt.val())) {
					 BootstrapDialog.show({title: 'Tank Master', message : "'Next Periodic Test Due' should be greater than 'Prev. Periodic Test Date'."});
				
				//$('#tank_next_mot_date').val('');
				$( "#tank_next_mot_date" ).datepicker('setDate','');
				}
			}
		}
	});

	// Lease Info
	if($('#lease_id').val() != ''){
		getTankContracts($('#tank_id').val(),$('#lease_id').val(),'tank');
	}
//$('#tank_no').attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
var ExistSuccess = 'Ok';
var invalidTank = 'Ok';
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var oldalert = alert_required;
// tank number new format start ----------------------------------------
//SET CURSOR POSITION
$.fn.setCursorPosition = function(pos) {
  this.each(function(index, elem) {
    if (elem.setSelectionRange) {
      elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
      var range = elem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  });
  return this;
};	

$.fn.getCursorPosition = function() {  
    var el = $(this).get(0);  
    var pos = 0;  
    if ('selectionStart' in el) {  
        pos = el.selectionStart;  
    } else if ('selection' in document) {  
        el.focus();  
        var Sel = document.selection.createRange();  
        var SelLength = document.selection.createRange().text.length;  
        Sel.moveStart('character', -el.value.length);  
        pos = Sel.text.length - SelLength;  
    }  
    return pos;  
}  

/**
 * its for change _ to each key pressed
 */
$('#tank_no').keydown(function(evt) {
	
	var TankNo = $('#tank_no').val();
	var firstIndex = TankNo.indexOf('_');
	var currPostion = $('#tank_no').getCursorPosition();
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	
	if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 96 && charCode <= 122)){
		if(firstIndex !=  -1){			
			var newString = TankNo.slice(0, firstIndex) + TankNo.slice(firstIndex + 1);	
			$('#tank_no').val(newString);
			$('#tank_no').setCursorPosition(firstIndex);
		}
	}else if(charCode == 8){ //8 - back space
		if(currPostion == 11){
			var underscore = "/";
		}else{
			var underscore = "_";
		}
		var newString = [TankNo.slice(0, currPostion), underscore, TankNo.slice(currPostion)].join('');
		if(currPostion == 0){
			newString = newString.substring(1);
		}
		$('#tank_no').val(newString);
		$('#tank_no').setCursorPosition(currPostion);
	}else if(charCode == 46){ //8 - back space
		//if(!$.browser.mozilla)
			currPostion = currPostion +1;
		
		if(currPostion == 11){
			var underscore = "/";
		}else{
			var underscore = "_";
		}
		var newString = [TankNo.slice(0, currPostion), underscore, TankNo.slice(currPostion)].join('');
		$('#tank_no').val(newString);
		$('#tank_no').setCursorPosition(currPostion - 1);
	}
});

/**
 * if it work in crome issue in delete key press
 * so its work only in mozilla
 */
$('#tank_no').keyup(function(evt) {
	if($.browser.mozilla){
		var TankNo = $('#tank_no').val();
		var firstIndex = TankNo.indexOf('_');
		var currPostion = $('#tank_no').getCursorPosition();
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		
		 if(charCode == 46 && TankNo != ''){ //46 - delete
				if(currPostion == 10){
					var underscore = "/";
				}else{
					var underscore = "_";
				}
				var newString = TankNo.slice(0, currPostion) + TankNo.slice(currPostion + 1);
				newString = [newString.slice(0, currPostion), underscore, newString.slice(currPostion)].join('');
				$('#tank_no').val(newString);
				$('#tank_no').setCursorPosition(currPostion);
			}else if(charCode == 46 && TankNo == ''){
				$('#tank_no').val('__________/_');
				$('#tank_no').setCursorPosition(0);
			}
	}
});
/**
 * change cursor position
 */
$('#tank_no').on('click focus',function(e) {
	var TankNo = $('#tank_no').val();
	var firstIndex = TankNo.indexOf('_');
	if(TankNo == '__________/_')
		$('#tank_no').setCursorPosition(firstIndex);
	
});
//tank number new format start ----------------------------------------

$('.create-Tank-data,.edit-Tank-data').click(function(e){
	  $('.highlight').removeClass('highlight');
	  e.preventDefault();
	  var form = '#'+$(this).closest('form').attr('id'),
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
	  
	  function isEmail(email) {
		  var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		  var t = regex.test(email.val());
		  if(t){
			  $(email).parent().removeClass('highlight');
			  success.push(true);
		  }else{
			  $(email).parent().addClass('highlight');
		        success.push(false);
		  }
		}
	  
	  function isDataExist(text,button){
		  ExistSuccess = [];
		  
		  if(button.hasClass('edit-Tank-data')){
		  		var type = "update";
		  	}
		  	if(button.hasClass('create-Tank-data')){
		  		var type = "create";
		  	}
			  $.ajax({
			        type: 'POST', 
			        url: appHome+'/tank-core/common_ajax', 
			        async : false,
			        data: {
						'type' : type,
						'action_type' : 'check_tank_dd_data_exist',
						'data_type' : $('#data_type').val(),
						'tank_data_value' : $('#tank-data-value').val(),
						'tankDataId' : $('#tank_data_id').val()
					},
			        success: function(response){
			        	if(response > 0){
			        		ExistSuccess = 'Exist'
			        		$(text).parent().addClass('highlight');
			        	}else{
			        		ExistSuccess = 'Ok'
			        		$(text).parent().removeClass('highlight');
			        	}
			        },
			        error: function(response){
			          $('html, body').animate({ scrollTop: 0 }, 400);
			          $('form').find('#response').empty().prepend(alert_error).fadeIn();
			        }
			  });
	  }
	  /**
	   * numeric check
	   */
	  function isNumeric(value) {
		  var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
		  var str =value.val();
		  if(str.charAt(0) == '.'){
			  str = '0'+str;
		  }
		  if((numberRegex.test(str)) && (str >= 0)) {
			  $(value).parent().removeClass('highlight');
			  success.push(true);
		  }else{		  
			  $(value).parent().addClass('highlight');
		      success.push(false);
		  }  
		}
	  
	  if($('#data_type').val() == 'tank_allocation_override_permission'){
		  var tankDataValue =  $('#data_type_user');
	  }else{
		  var tankDataValue =  $('#tank-data-value');
	  }
	  highlight(tankDataValue, '');
	  
	  if(tankDataValue.val().trim() != '' && $('#data_type').val() == 'tank_height'){
		  isNumeric(tankDataValue, '');
	  }
	  if(tankDataValue.val().trim() != '' &&  $('#data_type').val() == 'tank_width'){
		  isNumeric(tankDataValue, '');
	  }
	  if(tankDataValue.val().trim() != '' &&  $('#data_type').val() == 'tank_length'){
		  isNumeric(tankDataValue, '');
	  }
	  if(tankDataValue.val().trim() != '' &&  $('#data_type').val() == 'compartments'){
		  isNumeric(tankDataValue, '');
	  }
	  if(tankDataValue.val().trim() != '' &&  $('#data_type').val() == 'tank_test_date_expiry_mail'){
		  isEmail(tankDataValue, '');
	  }
	  
	  var check_fields = (success.indexOf(false) > -1);
	  if(check_fields === false && $('#data_type').val() != 'tank_allocation_override_permission'){
		  isDataExist(tankDataValue,$(this));
	  }
	  
	  if(ExistSuccess == 'Exist'){
		  success.push(false);
	  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank data already exists.</div>';
	  }else{
		  success.push(true); 
		  alert_required = oldalert;
	  }
	  
	  var check_fields = (success.indexOf(false) > -1);
	  
	  /**
	   * create-tank-data
	   */
	   if($(this).hasClass('create-Tank-data')){
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	       $.ajax({
	         type: 'POST',
	         url: path+'/add-datatype',
	         data: $(form).serialize().replace(/%5B%5D/g, '[]'),
	         success: function(response){
	           window.location.href = $('#returnpath').val();
	           localStorage.setItem('response', response);
	         },
	         error: function(response){
	           $('html, body').animate({ scrollTop: 0 }, 400);
	           $('form').find('#response').empty().prepend(alert_error).fadeIn();
	         }
	       });
	     }
	}
	 
   /**
    * update tank data
    */
    if($(this).hasClass('edit-Tank-data')){
  	var tank_data_id = $('#tank_data_id').val();
      if(check_fields === true){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_required).fadeIn();
      } else {
        $.ajax({
          type: 'POST',
          url: '../'+tank_data_id+'/update-tank-data',
          data: $(form).serialize().replace(/%5B%5D/g, '[]'),
          success: function(response){
            window.location.href = $('#returnpath').val();
            localStorage.setItem('response', response);
          },
          error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
          }
        });
      }
    }
	  
	});

	$('#btn-tank-discard').click(function(e){
		var path = $(this).data('path');
		e.preventDefault();
		 BootstrapDialog.show({
	         type: BootstrapDialog.TYPE_DANGER,
	         title: 'Confirmation',
	         message: 'Are you sure want to Discard?',
	         buttons: [{
			             label: 'Close',
			             action: function(dialogItself){
			                 dialogItself.close();
			             }
			         },{
		             label: 'Ok',
		             cssClass: 'btn-danger',
		             action: function(dialogItself){
		            	 window.location.replace(path);
		             }
	         }]
	     });
		
	});
$('#btn-tank-master-back').click(function(e){
	
	if($(this).data('type') == 'edit'){
		var tank_id = $('#tank_id').val();
		var action = appHome+'/tank-core/'+tank_id+'/backbutton-edit';
	}else if($(this).data('type') == 'add'){
		var action = appHome+'/tank-core/backbutton';
	}
	$('#tank-core-data-page2').attr('action',action);
	$('#tank-core-data-page2').submit();
});


/**
* update tank
*/
$('.create-Tank-save,.edit-Tank-update').click(function(e){
  $('.highlight').removeClass('highlight');
  e.preventDefault();
  var form = '#'+$(this).closest('form').attr('id'),
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
  
  /**
   * function for validation in radio
   */
   function highlightRadio(fieldname){
	  
	  var radioTotal = $("input[type='radio'][name='"+fieldname+"']").length;
	  var checkedTotal = $("input[type='radio'][name='"+fieldname+"']:checked").length;
	  
	  if(checkedTotal == 0){
		  $("input[type='radio'][name='"+fieldname+"']").closest('.radio-validation-div').addClass('highlight-custome');
	      success.push(false);
	  }else{
		  $("input[type='radio'][name='"+fieldname+"']").closest('.radio-validation-div').removeClass('highlight-custome');
	      success.push(true);
	  }
  }
  
  /**
   * tank number valid or not
   */
  function tankNumberValid(txt){
	  var numReg = /^[a-zA-z]{4}[0-9]{6}\/[0-9]{1}$/;
	  var tno = txt.val();
	  if(numReg.test(tno)){
		  invalidTank = 'Ok';
		  $(txt).parent().removeClass('highlight');
		  success.push(true);
	  }else{		  
		  invalidTank = 'tankInvalid';
		  $(txt).parent().addClass('highlight');
	      success.push(false);
	  }
  }
  /**
   * numeric check
   */
  function isNumeric(value) {
	  var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
	  var str =value.val();
	  if(str.charAt(0) == '.'){
		  str = '0'+str;
	  }
	  if((numberRegex.test(str)) && (str >= 0)) {
		  $(value).parent().removeClass('highlight');
		  success.push(true);
	  }else{		  
		  $(value).parent().addClass('highlight');
	      success.push(false);
	  }  
	  //highlight($(form).find('#tank_no'), '');
	  var check_fields = (success.indexOf(false) > -1);
	}
  
  /**
   * tank number exist or not
   */
  function istankExist(tankNo,button) {
	ExistSuccess = [];
	  
	if(button.hasClass('edit-Tank-update')){
  		var type = "update";
  	}
  	if(button.hasClass('create-Tank-save')){
  		var type = "create";
  	}
	var tankNumber = tankNo.val();
	var tank_id = $('#tank_id').val();
	
	  $.ajax({
	        type: 'POST', 
	        url: path+'/tank_exist',
	        async : false,
	        data: {
				'tankNumber' : tankNumber,
				'tank_id'	: tank_id,
				'type'	   : type
			},
	        success: function(response){
	        	if(response > 0){
	        		ExistSuccess = 'Exist';
	        		console.log(tankNo);
	        		$(tankNo).parent().addClass('highlight');        		
	        	}else{
	        		ExistSuccess = 'Ok';
	        		$(tankNo).parent().removeClass('highlight');
	        	}
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	  });
  }  
	  //page 1  
	  highlight($('#tank_no'), '');
	  highlight($('#tank_capacity'), '');
	  if($('#tank_compartments').val() == '2')
	  	{
		  highlight($('#tank_capacity2'), '');
	  	}
	  if($('#tank_compartments').val() == '3')
		 {
			  highlight($('#tank_capacity2'), '');
			  highlight($('#tank_capacity3'), '');
		 }
	  if($('#tank_compartments').val() == '4')
		 {
			  highlight($('#tank_capacity2'), '');
			  highlight($('#tank_capacity3'), '');
			  highlight($('#tank_capacity4'), '');
		 }
	 
	  highlight($('#tank_length'), '');
	  highlight($('#tank_width'), '');
	  highlight($('#tank_height'), '');
	  highlight($('#tank_division'), '');
	  highlight($('#tank_weight'), '');
	  highlight($('#tank_compartments'), '');
	  highlight($('#tank_business_type'), '');
	  highlight($('#tank_catwalk'), '');
	  highlight($('#tank_t_number'), '');
	  highlight($('#tank-mot-date'), '');
	  highlight($('#tank-mot-next-date'), '');
	  highlight($('#tank_prev_test_date'), '');
	  highlight($('#tank_next_mot_date'), '');
	  highlight($('#tank_next_mot_type'), '');
	  highlight($('#tank_pre_periodic_test_type'), '');
	  highlight($('#tank_manu_date'), '');
	  highlight($('#tank_discharge'), '');
	  highlight($('#tank_inspection_date'), '');
	  //highlight($('#tank_iso_code'), '');
	  
	 // highlight($('#tank_discharge'), '');
	 // highlightRadio('pot-type');
	  //highlightRadio('tank_discharge');
	  //highlightRadio('vapour_connection_position');
	  highlightRadio('tank_syphon');
	  highlightRadio('tank_baffles');
	  highlightRadio('tank_handrail');
	  highlightRadio('tank_heat_foot_valve');
	  highlightRadio('tank_electric_tank');
	  //highlightRadio('tank_steam_coil');
	  
	  // check numeric valus greater than 0
	  if($.trim($('#tank_steam_area').val()) != ''){
		  isNumeric($('#tank_steam_area'), '');
	  }
	  if($.trim($('#tank_storm_covers').val()) != ''){
		  isNumeric($('#tank_storm_covers'), '');
	  }
	  if($.trim($('#tank-lease-agreement-no').val()) != ''){
		  isNumeric($('#tank-lease-agreement-no'), '');
	  }
	  if($.trim($('#tank-lease-per-day-rate').val()) != ''){
		  isNumeric($('#tank-lease-per-day-rate'), '');
	  } 
      
      if($.trim($('#amount-per-day-paid').val()) != ''){
          isNumeric($('#amount-per-day-paid'), '');
      } 

	  isNumeric($('#tank_weight'), '');
	  isNumeric($('#tank_length'), '');
	  isNumeric($('#tank_width'), '');
	  isNumeric($('#tank_height'), '');
	  isNumeric($('#tank_capacity'), '');
	  if($.trim($('#tank_steam_area').val()) != ''){
		  isNumeric($('#tank_steam_area'), '');
	  }
	
	  if($.trim($('#tank_no').val()) != ''){
		  //function for chech tank no exist
		  istankExist($('#tank_no'),$(this));
	  }
	  if($.trim($('#tank_no').val()) != ''){
		  tankNumberValid($('#tank_no'));
	  }
	  if($('#tank_business_type').val() == 'DED' || $('#tank_business_type').val() == 'SPOT'){
		highlight($('#lease_id'), '');
		$('#lease_div').collapse('show');
		$('#lease_btn i').removeClass('fa-plus-circle').addClass('fa-minus-circle');
	  }
	  
  if(ExistSuccess == 'Exist'){
	  success.push(false);
	  $($('#tank_no')).parent().addClass('highlight');   
  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank No already exists.</div>';
  }else if(invalidTank == 'tankInvalid'){
	  success.push(false);
  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank Number must match a pattern ABCU123456/7 ! Please, re-enter</div>';
  }else{
	  success.push(true); 
	  alert_required = oldalert;
  }   
  var check_fields = (success.indexOf(false) > -1);
  /**
  * update edit-vgm-route
  */
  if($(this).hasClass('edit-Tank-update')){
	var tank_id = $('#tank_id').val();
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {
      $(this).attr('disabled','disabled');
      $.ajax({
        type: 'POST',
        url: '../'+tank_id+'/update',
        data: $('#tank-core-data-page1').serialize().replace(/%5B%5D/g, '[]'),
        success: function(response){
          window.location.href = $('#returnpath').val();
          localStorage.setItem('response', response);
        },
        error: function(response){
        	 $(this).removeAttr('disabled');
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  }
  
   if($(this).hasClass('create-Tank-save')){
	      if(check_fields === true){
	        $('html, body').animate({ scrollTop: 0 }, 400);
	        $('form').find('#response').empty().prepend(alert_required).fadeIn();
	      } else {
	       $(this).attr('disabled','disabled');
	       $.ajax({
	         type: 'POST',
	         url: path+'/add',
	         data: $('#tank-core-data-page1').serialize().replace(/%5B%5D/g, '[]'),
	         success: function(response){
	        	 var tankno = $('#tank_no').val();
	        	 console.log(tankno);
	        window.location.href = appHome+'/tank-core/index?sort=&sorttype=&page_name=tank-core-index&tank-filter='+tankno+'&tank-division=&tank-type=&tank-status=all';
	           localStorage.setItem('response', response);
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

//Delete tank
$('.delete-Tank').click(function(e) {
	e.preventDefault();
	
	var delete_url = $(this).attr('data-href'),
		tank_id = $(this).data('tank-id'),
		tank_no = $(this).attr('data-tank-num'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
		
	 BootstrapDialog.show({
         type: BootstrapDialog.TYPE_DANGER,
         closable : false,
         title: "Confirmation (<strong>"+tank_no+"</strong>)",
         message: "Are you sure want to delete this Tank?",
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
						timeout: 90000,
		  		       beforeSend: function() {
				        	$('.bootstrap-dialog-footer-buttons > .btn-danger').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		    		        $('.bootstrap-dialog-footer-buttons > .btn-danger').attr('disabled','disabled');
				        },
						data: {
							'tank_id' : tank_id
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

//Delete tank
$('.delete-Tank-data').click(function(e) {
	e.preventDefault();
	
	var delete_url = $(this).attr('href'),
	tank_did = $(this).data('tank-did'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
	
	BootstrapDialog.confirm('Are you sure you want to delete this Tank data ?', function(result){
		if(result) {
			$.ajax({
				type: 'POST',
				url: delete_url,
				data: {'tank_did' : tank_did},
				success: function(response){
					//location.reload();
					window.location.href = return_url;
					localStorage.setItem('response', response);
				},
				error: function(response){
					BootstrapDialog.show({title: 'VGM Route', message : 'Unable to delete this Tank. Please try later.',
						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				}
			});
		} 
	});
});


$('.file-upload-btn').on('click',function(e) {
	var id = $(this).attr('data-id');
	var upload_type = $(this).attr('data-upload-type');
	var modal_title = $(this).attr('data-modal-title');
	var tankNo = $(this).parent().siblings(":first").text();
	if(upload_type == 'tank_doc'){
		var type = 'Tank';
		$('#FileUpModalLabel').html('Documents -Tank:'+tankNo);
	}else if(upload_type == 'tank_gallery'){
		var type = 'Tank_gallery';
		$('#FileUpModalLabel').html('Tank Gallery :'+tankNo);
	}else if(upload_type == 'tank_periodic_test'){
		var type = 'Tank_periodic_test';
		$('#FileUpModalLabel').html('Tank Periodic Test :'+tankNo);
	}else if (upload_type == 'batch_tank_series'){
		var tnk = $(this).parent().siblings(":first").next('td').find('input').val();
		$('#attachable_id').val(id);
		$('#FileUpModalLabel').html('Batch Series :'+tnk);
	}
	else{
		var type = 'Tank_on_hire';
		$('#FileUpModalLabel').html('On hire Agreement Documents -Tank:'+tankNo);
	}
	
	var page_name = $('#page_name').val();
	if(page_name == 'profile'){
		profileTankList(id,type);
	}
	else{
		tankFileList(id,type);
	}
	
	$("#upload_btn").attr('disabled','disabled');
	$('#file_to_upload').val('');
	$('#progress_num_uf').hide();
	$('#file_desc,#JobfileName').val('');
	$('#fileSize,#fileType,#fileExist').html('');
	
});

$('.add-manufacture').on('click',function(e) {
	$('#tank_manufacture_id,#tank-new-manufacture-name').val('');
	$('.chosen').trigger("chosen:updated");
	$('.existing-manufacture-div').hide();
	$('.new-manufacture-div').show();	
	$('#tank-manufacture-validation').val('new');
});
//To save thew new manufacturer name to the database and to keep the new name as selected
$('.save-manufacture').on('click',function(e) {
	var manufacturename=$('#tank-new-manufacture-name').val(); 
	highlight($('#tank-new-manufacture-name'), '');
	function highlight(field, empty_value){
	    if(field.length > 0){
	      if(field.val().trim() === empty_value){
	        $(field).parent().addClass('highlight');
	      } else {
	        $(field).parent().removeClass('highlight');   
	$.ajax({
	    type: 'POST',
	    url: appHome+'/tank-core/common_ajax',
	    data: {
	      'manufactureName' : manufacturename,
	      'action_type' : 'manufacture-name'
	    },
	    success: function(response){
	       data = JSON.parse(response)
	       if(response)
	    	   {
	    		$('.new-manufacture-div').hide();
	    		$('.existing-manufacture-div').show();
	    		var div_data="<option value="+data.key+' selected="selected"'+">"+data.value+"</option>";
	    		$(div_data).appendTo('#tank_manufacture_id'); 
	    		$('.chosen').trigger("chosen:updated");
	    	   }
	    },
	    error: function(response){
	    	//console.log(response);
	     alert('Error Occured');
	    }
	});
	      }
	    }
	  }
	});
$('.add-manufacture-close').on('click',function(e) {
	$('#tank_manufacture_id,#tank-new-manufacture-name').val('');
	$('#tank-manufacture-validation').val('existing');
	$('.new-manufacture-div').hide();
	$('.existing-manufacture-div').show();	
});

$('.add-ownership').on('click',function(e) {
	$('#tank-ownership-new,#tank-new-ownership-name').val('');
	$('.chosen').trigger("chosen:updated");
	$('.existing-ownership-div').hide();
	$('.new-ownership-div').show();	
	$('#tank-ownership-validation').val('new');
});

$('.add-ownership-close').on('click',function(e) {
	$('#tank-ownership-new,#tank-new-ownership-name').val('');
	$('#tank-ownership-validation').val('existing');
	$('.new-ownership-div').hide();
	$('.existing-ownership-div').show();	
});

$('#tank_lease_curr').change(function(){
	switch_currency_icons($('#tank_lease_curr'), 'currency-fa');
});
/**
 * for setting max length for adding core data in tank
 */
$('#data_type').change(function(){
	if($('#page-type').val() == 'form-page-tank-data'){
		setmaxlengthfortankcoreData();
		if($('#data_type').val() == 'tank_allocation_override_permission'){
			$('.user-div').removeClass('hidden');
			$('.text-div').addClass('hidden');
		}else{
			$('.user-div').addClass('hidden');
			$('.text-div').removeClass('hidden');
		}
		$('#tank-data-value').val('');
	}
});

$('#tank_division').change(function(){
	var division = $(this).val();
	if(division == 'FEED'){
		$('#tank_allow_feed').attr('checked',true);
		$('#tank_allow_feed').attr('disabled',true);
	}else{
		//$('#tank_allow_feed').attr('checked',false);
		$('#tank_allow_feed').attr('disabled',false);
	}
	onchangeFillProduct();
});
$('#tank_allow_feed').change(function(){
	onchangeFillProduct();
});

$(document).on('change', '#tank_length', function(){
	isoCode();	
});

$('#tank_weight').change(function(){
	var weight = $(this).val();
	if(weight > 999999){
		weight = 999999;
	}
	$('#tank_weight').val(parseInt(weight));
});

/*$('#tank_length,#tank_width,#tank_height').change(function(){
	trim2decimalOnly($(this));
});*/

$('#tank_steam_area').change(function(){
	
	var len = $('#tank_steam_area').val();
	var with2Decimals = len.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
	if(with2Decimals >= 1000){
		with2Decimals = 999.99;
	}
	$('#tank_steam_area').val(with2Decimals);
});

$('.view-tank').on('click',function(e) {
	var id = $(this).attr('data-id');
	$.ajax({
		type: "POST", 
		async: false, 
		url: appHome+'/tank-core/common_ajax', 
		dataType: "json",
		data: ({
			'tank_id' : id,
			'action_type' : 'view_tank'
		}),  
		success: function(response)
		{ 
			$('#tank_status').html(response.tank_status);
			$('#tank_tank_no').html(response.tank_no);
			$('#tank_capacity').html(response.tank_capacity);
			$('#tank_capacity2').html(response.tank_capacity2);
			$('#tank_capacity3').html(response.tank_capacity3);
			$('#tank_capacity4').html(response.tank_capacity4);
			$('#tank_dimensions').html(response.tank_dim);			
			$('#tank_weight').html(response.tank_weight);
			$('#tank_division').html(response.tank_division);
			$('#tank_length').html(response.tank_length);
			$('#tank_width').html(response.tank_width);
			$('#tank_height').html(response.tank_height);
			$('#tank_potvalue').html(response.tank_potvalue);
			
			/*var productArr = response.prod_name;
			var resPro = "";
			if(productArr.length > 0){
				$.each( productArr, function( index, value ){
					resPro += '<span class="" style="font-size: 10px;">'+value+'</span><br>';
				});
			}
			$('.product_names_modal').html(resPro);*/
			
			$('#tank_iso_code').html(response.tank_iso_code);
			$('#tank_baffle_type').html(response.tank_baffle_type);
			$('#tank_prev_test_date').html(response.tank_prev_test_date);
			
			$('#tank_compartments').html(response.tank_compartments); 
			$('#tank_businesstype').html(response.tank_businesstype); 
			$('#tank_tatwalk').html(response.tank_tatwalk); 
			$('#tank_t_number').html(response.tank_t_number); 
			$('#tank_mot_date').html(response.tank_mot_date); 
			$('#tank_next_mot_date').html(response.tank_next_mot_date); 
			$('#tank_next_mot_type').html(response.tank_next_mot_type);		
			$('#tank_electric_type').html(response.tank_electric_type); 
			$('#tank_inspection_date').html(response.tank_inspection_date); 
			$('#tank_manlids').html(response.tank_manlids);
			
			$('#tank_bottom_valve_type').html(response.tank_bottom_valve_type); 
			$('#tank_foot_valve_manufacturer').html(response.tank_foot_valve_manufacturer);
			$('#tank_second_closure_manufacturer').html(response.tank_second_closure_manufacturer);
			$('#tank_bottom_outlet_manufacturer').html(response.tank_bottom_outlet_manufacturer);
			$('#tank_top_airline_valve_manufacturer').html(response.tank_top_airline_valve_manufacturer);
			$('#tank_top_airline_outlet_manufacturer').html(response.tank_top_airline_outlet_manufacturer);
			$('#tank_bottom_airline_valve_manufacturer').html(response.tank_bottom_airline_valve_manufacturer);
			$('#tank_bottom_airline_valve_manufacturer').html(response.tank_bottom_airline_valve_manufacturer);
			$('#tank_bottom_outlet_valve_manufacturer').html(response.tank_bottom_outlet_valve_manufacturer);
			$('#tank_top_valve_manufacturer').html(response.tank_top_valve_manufacturer);
			$('#tank_top_outlet_manufacturer').html(response.tank_top_outlet_manufacturer);
			$('#tank_next_mot_type').html(response.tank_next_mot_type);
			$('#tank_bottom_valve_size').html(response.tank_bottom_valve_size); 
			$('#tank_bottom_outlet_type').html(response.tank_bottom_outlet_type); 
			$('#tank_top_valve_type').html(response.tank_top_valve_type); 
			$('#tank_top_uutlet_type').html(response.tank_top_uutlet_type); 
			$('#tank_airline_outlet_type').html(response.tank_airline_outlet_type); 
			$('#tank_discharge').html(response.tank_discharge);
			$('#tank_steam_area').html(response.tank_steam_area);
			$('#tank_manufacture_date').html(response.tank_manufacture_date);
			$('#tank_manufacture').html(response.tank_manufacture_name);

			$('#tank_top_airline_outlet_type').html(response.tank_top_airline_outlet_type);
			$('#tank_bottom_airline_valve_type').html(response.tank_bottom_airline_valve_type); 
			$('#tank_bottom_airline_outlet_type').html(response.tank_bottom_airline_outlet_type); 
			$('#tank_created_by').html(response.tank_created_by);
			$('#tank_created_on').html(response.tank_created_on);
			$('#tank_group_view').html(response.tank_customer_group);
			$('#tank_normal_capasity').html(response.tank_normal_capasity);
			$('#tank_normal_capacity2').html(response.tank_normal_capacity2);
			$('#tank_normal_capacity3').html(response.tank_normal_capacity3);
			$('#tank_normal_capacity4').html(response.tank_normal_capacity4);
			$('#baffle_compartment_size').html(response.baffle_compartment_size);
			$('#tank_steam_coil_pressure').html(response.tank_steam_coil_pressure);
			$('#tank_steam_connection_type').html(response.tank_steam_connection_type);
			$('#tank_frame_type').html(response.tank_frame_type);
			$('#tank_shell_thickness').html(response.tank_shell_thickness);
			$('#tank_isolation_thickness').html(response.tank_isolation_thickness);
			$('#tank_shell_material_type').html(response.tank_shell_material_type);
			$('#tank_design_pressure').html(response.tank_design_pressure);
			$('#tank_corner_casting_position').html(response.tank_corner_casting_position);
			$('#tank_test_pressure').html(response.tank_test_pressure);
			$('#tank_design_temp').html(response.tank_design_temp);
			$('#tank_top_vapour_valve_type').html(response.tank_top_vapour_valve_type);
			$('#tank_top_outlet_type').html(response.tank_top_outlet_type);
			$('.tank_ownership_new').html(response.tank_ownership_new);			
			$('#tank_capacity_total').html(response.tank_capacity + response.tank_capacity2 + response.tank_capacity3 + response.tank_capacity4);
			$('#tank_normal_capacity_total').html(response.tank_normal_capasity + response.tank_normal_capacity2 + response.tank_normal_capacity3 + response.tank_normal_capacity4);
			$('#tank_pre_mot_type').html(response.tank_periodic_test_type);
			$('#tank_prev_inspection_date').html(response.tank_pre_inspection_date);
			$('#tank_gps_identifier').html(response.tank_gps_identifier);
			$('#tank_gps_status').html(response.tank_gps_status);
			$('#tank_type_label').html(response.tank_type);
			if(response.is_tank_semi_dedicated == 1){
				$('.is_tank_semi_dedicated').html(' Yes');
			}else{
				$('.is_tank_semi_dedicated').html(' No');
			}
			
			
			if(response.tank_syphon_tube == 1){
				$('#tank_syphon_tube').html(' Yes');
			}else{
				$('#tank_syphon_tube').html(' No');
			}
			
			if(response.tank_storm_covers != 0 && response.tank_storm_covers != ''){
				$('#tank_storm_covers').html(' Yes');
			}else{
				$('#tank_storm_covers').html(' No');
			}
			
			if(response.tank_heat_foot_valve == 1){
				$('#tank_heat_foot_valve').html(' Yes');
			}else if(response.tank_heat_foot_valve == 2){
				$('#tank_heat_foot_valve').html(' Unknown');
			}else{
				$('#tank_heat_foot_valve').html(' No');
			}

			if(response.tank_syphon == 1){
				$('#tank_syphon').html(' Yes');
			}else{
				$('#tank_syphon').html(' No');
			}
			
			if(response.tank_handrail == 1){
				$('#tank_handrail').html(' Yes');
			}else if(response.tank_handrail == 2){
				$('#tank_handrail').html(' Unknown');
			}else{
				$('#tank_handrail').html(' No');
			}
			
			if(response.tank_electric_tank_check == 1){
				$('#tank_electric_tank_check').html(' Yes');
			}else{
				$('#tank_electric_tank_check').html(' No');
			}	

			if(response.tank_baffles == 1){
				$('#tank_baffles').html(' Yes');
				$('.baffleSizeType').show();
			}else{
				$('#tank_baffles').html(' No');
				$('.baffleSizeType').hide();
			}

			if(response.tank_steam_coils == 1){
				$('#tank_steam_coils').html(' Yes');
			}else{
				$('#tank_steam_coils').html(' No');
			}
			
			if(response.tank_short_term_lease == 1){
				$('#tank_short_term_lease').html('Yes');
			}
			else{
				$('#tank_short_term_lease').html('No');
			}
			/*var arrCustomer = response.customerList;
			var res = '';
			if(arrCustomer.length > 0){
				$.each( arrCustomer, function( index, value ){
					res += '<span class="" style="font-size: 10px;">'+value+'</span><br>';
				});
				$('.division_customers').html(res);
			}*/
			if(response.tank_compartments == '2'){
				$('.capacity-row2').show();
				$('.capacity-row3').hide();
				$('.capacity-row4').hide();
				$('.capacity-row5').show();
			}else if(response.tank_compartments == '3'){
				$('.capacity-row2').show();
				$('.capacity-row3').show();
				$('.capacity-row4').hide();
				$('.capacity-row5').show();
			}
			else if(response.tank_compartments == '4'){
				$('.capacity-row2').show();
				$('.capacity-row3').show();
				$('.capacity-row4').show();
				
				$('.capacity-row5').show();
			}
			else{
				$('.capacity-row2').hide();
				$('.capacity-row3').hide();
				$('.capacity-row4').hide();
				$('.capacity-row5').hide();
			}

			if(response.tank_is_deepsea_approved == 1){
				$('#tank_is_deepsea_approved').html('Yes');
			}
			else{
				$('#tank_is_deepsea_approved').html('No');
			}
			
			if(response.tank_stubbie == 1){
				$('#tank_stubbie').html(' Yes');
			}else{
				$('#tank_stubbie').html(' No');
			}
		}  
	});
	
});

$(".click-view-tank-image").live('click', function(e){
	var path = $(this).attr('data-view-path');
	$('.tank-image-modal').attr('src',path);
});

$(".delete-tank-doc").live('click', function(e){
	e.preventDefault();	
	$this = $(this);
	var up_fileInfo = $this.data();
	var deleteType = up_fileInfo.upload_type;
	var file_deletePath = appHome+'/tank-core/common_ajax';
	var attachid = 0;
	var siFileListCount = 0;
	var docidArr = up_fileInfo.docid.split("-");
	var tankId = $('#attachable_id').val();

	BootstrapDialog.confirm('Are you sure you want to delete this document ?', function(result){
		if(result == true) {
			$.ajax({
				type: "POST", 
				async: false, 
				url: file_deletePath, 
				dataType: "html",
				data: ({
					'docid' : docidArr[1],
					'tableType' : docidArr[0],
					'deleteType' : deleteType,
					'tankId' : tankId,
					'action_type' : 'delete_tank_docs'
				}),  
				success: function(response)
				{ 
					
					if(response == 'success') {
						//remove icons
						$this.parents('tr').remove();

						tp_file_list = $(".tp-file-list tr").length;
						if (tp_file_list == 2)
						{
							$("#emptyFilesTr").removeClass();
							var id = $('#attachable_id').val();
							$('.docs-icon[data-id="'+ id +'"][data-upload-type="'+deleteType+'"]').find('.fa').removeClass().addClass('fa fa-file-o');
						}

	
					}else{
						BootstrapDialog.show({title: 'Error', message : 'Error occured Please try agan later.',
							 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
						});
					}
				}  
			});
		}
	});		
	
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
	
	function setmaxlengthfortankcoreData(){
		if($('#page-type').val() == 'form-page-tank-data'){
			var dataType = $('#data_type').val();
			var maxlength = 40;
			switch(dataType){
				case 'Baffle_Type' : maxlength = 45; break;
				case 'tank_height' : maxlength = 9; break; //decimal(6,2)
				case 'tank_width' : maxlength = 9; break; //decimal(6,2)
				case 'tank_length' : maxlength = 9; break; //decimal(6,2)
				case 'compartments' : maxlength = 1; break; //int 1
				case 't_number'	 : maxlength = 3; break; // varchar(3)
				case 'ISO-Code'	 : maxlength = 45; break; //varchar(45)
				case 'catwalk'  : maxlength = 10; break; //varchar(10)
				case 'business_type'  : maxlength = 8; break; //varchar(8)
				case 'division'  : maxlength = 4; break; //varchar(4)
				case 'discharge_type'  : maxlength = 10; break; //varchar(10)
				case 'Foot_Valve_Type'  : maxlength = 10; break; //varchar(10)
				case 'Foot_Valve_Manufacturer'  : maxlength = 45; break; //varchar(45)
				case 'Second_Closure'  : maxlength = 45; break; //varchar(45)
				case 'Second_Closure_Manufacturer'  : maxlength = 45; break; //varchar(45)
				case 'Bottom_Outlet_Type'  : maxlength = 25; break; //varchar(25)
				case 'Bottom_Outlet_Manufacturer'  : maxlength = 45; break; // varchar(45)
				case 'Top_Airline_Valve_Type'  : maxlength = 25; break; //varchar(25)
				case 'Top_Airline_Valve_Manufacturer'  : maxlength = 45; break; //varchar(45)
				case 'Top_Airline_Outlet_Manufacturer'  : maxlength = 45; break; //varchar(45)
				case 'Top_Valve_Type'  : maxlength = 10; break; //varchar(10)
				case 'Top_Valve_Manufacturer'  : maxlength = 45; break; //varchar(45)
				case 'Top_Outlet_Manufacturer'  : maxlength = 45; break; //varchar(45)
				case 'Electric_Type'	 : maxlength = 20; break; //varchar(20)
				case 'Next_Periodic_Test_Type'  : maxlength = 8; break;  //varchar(8)
				case 'Bottom_Airline_Valve_Type'  : maxlength = 10; break; //varchar(10)
				case 'Tank_Ownership'  : maxlength = 45; break; //varchar(45)
				case 'Bottom_Airline_Valve_Manufacturer'  : maxlength = 45; break; //varchar(45)
				case 'Bottom_Outlet_Valve_Manufacturer'  : maxlength = 45; break; //varchar(45)
				case 'tank_manlids'  : maxlength = 3; break; //varchar(3)
				case 'tank_steam_connection_type'  : maxlength = 20; break; //varchar(3)
				case 'tank_steam_connection_type'  : maxlength = 20; break; //varchar(20)
				case 'tank_frame_type'  : maxlength = 20; break; //varchar(20)
				case 'tank_shell_thickness'  : maxlength = 10; break; //varchar(10)
				case 'tank_isolation_thickness'  : maxlength = 10; break; //varchar(10)
				case 'tank_shell_material_type'  : maxlength = 10; break; //varchar(10)
				
				case 'tank_corner_casting_position'  : maxlength = 20; break; //varchar(10)
				case 'tank_corner_casting_position'  : maxlength = 20; break; //varchar(10)
				
			}
			$('#tank-data-value').attr('maxlength',maxlength);
		}
	}
	
	/**
	 * function for change vapour connection radio changes
	 */
	function vapourConnectionDD(vapourConnectionValue){
		
		if(vapourConnectionValue == 'BOTTOM'){
			//enable
			$('#tank_bottom_vapour_valve_type,#tank_bottom_vapour_valve_type_rear,#tank_bottom_vapour_valve_type_middle,#tank_bottom_vapour_valve_manufacturer,#tank_bottom_vapour_valve_manufacturer_rear,#tank_bottom_vapour_valve_manufacturer_middle,#tank_bottom_vapour_connection_type,#tank_bottom_vapour_connection_type_rear,#tank_bottom_vapour_connection_type_middle,#tank_bottom_vapour_connection_manufacturer,#tank_bottom_vapour_connection_manufacturer_rear,#tank_bottom_vapour_connection_manufacturer_middle').attr('disabled',false);
			//disable
			$('#tank_top_vapour_valve_type,#tank_top_vapour_valve_type_rear,#tank_top_vapour_valve_type_middle,#tank_top_vapour_valve_manufacturer,#tank_top_vapour_valve_manufacturer_rear,#tank_top_vapour_valve_manufacturer_middle,#tank_top_vapour_connection_type,#tank_top_vapour_connection_type_rear,#tank_top_vapour_connection_type_middle,#tank_top_vapour_connection_manufacturer,#tank_top_vapour_connection_manufacturer_rear,#tank_top_vapour_connection_manufacturer_middle').val('');
			$('#tank_top_vapour_valve_type,#tank_top_vapour_valve_type_rear,#tank_top_vapour_valve_type_middle,#tank_top_vapour_valve_manufacturer,#tank_top_vapour_valve_manufacturer_rear,#tank_top_vapour_valve_manufacturer_middle,#tank_top_vapour_connection_type,#tank_top_vapour_connection_type_rear,#tank_top_vapour_connection_type_middle,#tank_top_vapour_connection_manufacturer,#tank_top_vapour_connection_manufacturer_rear,#tank_top_vapour_connection_manufacturer_middle').attr('disabled',true);
		}else if(vapourConnectionValue == 'TOP'){
			//enable
			$('#tank_top_vapour_valve_type,#tank_top_vapour_valve_type_rear,#tank_top_vapour_valve_type_middle,#tank_top_vapour_valve_manufacturer,#tank_top_vapour_valve_manufacturer_rear,#tank_top_vapour_valve_manufacturer_middle,#tank_top_vapour_connection_type,#tank_top_vapour_connection_type_rear,#tank_top_vapour_connection_type_middle,#tank_top_vapour_connection_manufacturer,#tank_top_vapour_connection_manufacturer_rear,#tank_top_vapour_connection_manufacturer_middle').attr('disabled',false)
			//disable
			$('#tank_bottom_vapour_valve_type,#tank_bottom_vapour_valve_type_rear,#tank_bottom_vapour_valve_type_middle,#tank_bottom_vapour_valve_manufacturer,#tank_bottom_vapour_valve_manufacturer_rear,#tank_bottom_vapour_valve_manufacturer_middle,#tank_bottom_vapour_connection_type,#tank_bottom_vapour_connection_type_rear,#tank_bottom_vapour_connection_type_middle,#tank_bottom_vapour_connection_manufacturer,#tank_bottom_vapour_connection_manufacturer_rear,#tank_bottom_vapour_connection_manufacturer_middle').val('');
			$('#tank_bottom_vapour_valve_type,#tank_bottom_vapour_valve_type_rear,#tank_bottom_vapour_valve_type_middle,#tank_bottom_vapour_valve_manufacturer,#tank_bottom_vapour_valve_manufacturer_rear,#tank_bottom_vapour_valve_manufacturer_middle,#tank_bottom_vapour_connection_type,#tank_bottom_vapour_connection_type_rear,#tank_bottom_vapour_connection_type_middle,#tank_bottom_vapour_connection_manufacturer,#tank_bottom_vapour_connection_manufacturer_rear,#tank_bottom_vapour_connection_manufacturer_middle').attr('disabled',true);
		}else {
			$('#tank_top_vapour_valve_type,#tank_top_vapour_valve_type_rear,#tank_top_vapour_valve_type_middle,#tank_top_vapour_valve_manufacturer,#tank_top_vapour_valve_manufacturer_rear,#tank_top_vapour_valve_manufacturer_middle,#tank_top_vapour_connection_type,#tank_top_vapour_connection_type_rear,#tank_top_vapour_connection_type_middle,#tank_top_vapour_connection_manufacturer,#tank_top_vapour_connection_manufacturer_rear,#tank_top_vapour_connection_manufacturer_middle').attr('disabled',false);
			$('#tank_bottom_vapour_valve_type,#tank_bottom_vapour_valve_type_rear,#tank_bottom_vapour_valve_type_middle,#tank_bottom_vapour_valve_manufacturer,#tank_bottom_vapour_valve_manufacturer_rear,#tank_bottom_vapour_valve_manufacturer_middle,#tank_bottom_vapour_connection_type,#tank_bottom_vapour_connection_type_rear,#tank_bottom_vapour_connection_type_middle,#tank_bottom_vapour_connection_manufacturer,#tank_bottom_vapour_connection_manufacturer_rear,#tank_bottom_vapour_connection_manufacturer_middle').attr('disabled',false);
		}
		$('.chosen').trigger("chosen:updated");
	}
	/**
	 * function for active dd depend upon discharge value
	 */
	function dischargeDD(dischargeValue){
		
		if(dischargeValue == 'BOTTOM'){
			//enable
			$('#tank_bottom_outlet_type,#tank_bottom_outlet_type_rear,#tank_bottom_outlet_type_middle,#tank_bottom_outlet_manufacturer,#tank_bottom_outlet_manufacturer_rear,#tank_bottom_outlet_manufacturer_middle').attr('disabled',false);
			//disable
			$('#tank_top_valve_type,#tank_top_valve_type_rear,#tank_top_valve_type_middle,#tank_top_valve_manufacturer,#tank_top_valve_manufacturer_rear,#tank_top_valve_manufacturer_middle,#tank_top_outlet_type,#tank_top_outlet_type_rear,#tank_top_outlet_type_middle,#tank_top_outlet_manufacturer,#tank_top_outlet_manufacturer_rear,#tank_top_outlet_manufacturer_middle').val('');
			$('#tank_top_valve_type,#tank_top_valve_type_rear,#tank_top_valve_type_middle,#tank_top_valve_manufacturer,#tank_top_valve_manufacturer_rear,#tank_top_valve_manufacturer_middle,#tank_top_outlet_type,#tank_top_outlet_type_rear,#tank_top_outlet_type_middle,#tank_top_outlet_manufacturer,#tank_top_outlet_manufacturer_rear,#tank_top_outlet_manufacturer_middle').attr('disabled',true);
		}else if(dischargeValue == 'TOP'){
			//enable
			$('#tank_top_valve_type,#tank_top_valve_manufacturer,#tank_top_outlet_type,#tank_top_outlet_manufacturer').attr('disabled',false)
			//disable
			$('#tank_bottom_outlet_type,#tank_bottom_outlet_type_rear,#tank_bottom_outlet_type_middle,#tank_bottom_outlet_manufacturer,#tank_bottom_outlet_manufacturer_rear,#tank_bottom_outlet_manufacturer_middle').val('');
			$('#tank_bottom_outlet_type,#tank_bottom_outlet_type_rear,#tank_bottom_outlet_type_middle,#tank_bottom_outlet_manufacturer,#tank_bottom_outlet_manufacturer_rear,#tank_bottom_outlet_manufacturer_middle').attr('disabled',true);
		}else {
			$('#tank_top_valve_type,#tank_top_valve_type_rear,#tank_top_valve_type_middle,#tank_top_valve_manufacturer,#tank_top_valve_manufacturer_rear,#tank_top_valve_manufacturer_middle,#tank_top_outlet_type,#tank_top_outlet_type_rear,#tank_top_outlet_type_middle,#tank_top_outlet_manufacturer,#tank_top_outlet_manufacturer_rear,#tank_top_outlet_manufacturer_middle').attr('disabled',false);
			$('#tank_bottom_outlet_type,#tank_bottom_outlet_type_rear,#tank_bottom_outlet_type_middle,#tank_bottom_outlet_manufacturer,#tank_bottom_outlet_manufacturer_rear,#tank_bottom_outlet_manufacturer_middle').attr('disabled',false);
		}
		$('.chosen').trigger("chosen:updated");
	}
	
	$('#tank_discharge').change(function(){
		dischargeDD($(this).val());
	});
	
	$('#vapour_connection_position').change(function(){
		vapourConnectionDD($(this).val());
	});
	$('.rdbaffles').click(function() {
		if($("[name='tank_baffles']:checked").val() == 1)
			{
			//var tagline = "<hr/>";
		    //$('.bafflesection').before(tagline);    
			$(".bafflesection").show();
			}
		else
			{
			$(".bafflesection").hide();
			$('#baffle_compartment_size').val('');
			$('.tank-baffle-type').prop('checked', false);
			//$('div.bafflesection + hr').hide();
			}
		
	});
	$('.stmcover').click(function() {
		if($("[name='tank_storm_covers']:checked").val() == 1)
			{
			$(".stormsection").show();
			}
		else
			{
			$(".stormsection").hide();
			$('#baffle_compartment_size').val('');
			}
		
	});
	$('#tank_foot_valve_manufacturer').change(function(){
		$('#tank_second_closure_manufacturer,#tank_bottom_outlet_manufacturer').val($(this).val());
		$('.chosen').trigger("chosen:updated");
	});
	
	$('#tank_bottom_vapour_valve_manufacturer').change(function(){
		$('#tank_bottom_vapour_connection_manufacturer').val($(this).val());
		$('.chosen').trigger("chosen:updated");
	});
	
	$('#tank_top_valve_manufacturer').change(function(){
		$('#tank_top_outlet_manufacturer').val($(this).val());
		$('.chosen').trigger("chosen:updated");
	});
	
	$('#tank_bottom_valve_type').change(function(){
		if($(this).val()== 'Uniflow'){
			$('#tank_bottom_valve_size').val('Uniflow Butterfly Valve');
		}else{
			$('#tank_bottom_valve_size').val('');
		}
		$('.chosen').trigger("chosen:updated");
	});
	
	$('#tank_top_vapour_valve_manufacturer').change(function(){
		$('#tank_top_vapour_connection_manufacturer').val($(this).val());
		$('.chosen').trigger("chosen:updated");
	});
	
	//auto disable dropdown
	if($('#page-type').val() == 'form-page'){
		if($('#page-type').attr('data-form-type') != 'edit'){
			isoCode();
		}
		dischargeDD($("#tank_discharge").val());
		vapourConnectionDD($("#vapour_connection_position").val());
		//tankGover($('#tank_govr'));
	}
	
	if($('#page-type').val() == 'form-page-tank-data'){
		setmaxlengthfortankcoreData();
	}
	  $(document).on('click', '.tank_core_change_status', function(e) {
		     e.preventDefault();
		    var tankNo = $(this).attr('data-id');
		    if($(this).hasClass('tank_core_change_status')){
		        var changeTo = $(this).attr('data-quote-change-to');   
		        var tank = $(this).attr('data-tank-num');   
		    }
		    var message = 'Are you sure want to move <strong>'+tank+'</strong> to '+changeTo.charAt(0).toUpperCase() + changeTo.slice(1);+' ?';
		    
		    if(changeTo == 'live'){
		        var mtype = BootstrapDialog.TYPE_SUCCESS;
		        var mButton = 'btn-success';
		    }else if(changeTo == 'archive'){
		        var mtype = BootstrapDialog.TYPE_PRIMARY;
		        var mButton = 'btn-primary';
		    }else{
		        var mtype = BootstrapDialog.TYPE_DANGER;
		        var mButton = 'btn-danger';
		    }
		     BootstrapDialog.show({
		         type: mtype,
		         closable : false,
		         title: 'Confirmation',
		         message: message,
		         buttons: [{
		                     label: 'Close',
		                     action: function(dialogItself){
		                         dialogItself.close();
		                     }
		                 },{
		                 label: 'Ok',
		                 cssClass: mButton,
		                 action: function(){
		                     $.ajax({
		                        type: 'POST',
		                        url: appHome+'/tank-core/common_ajax',
		                        data: {
		                          'tankNo' : tankNo,
		                          'tank' : tank,
		                          'action_type' : 'change_tank_status',
		                          'changeTo' : changeTo
		                        },
		                       beforeSend: function() {
		                            $('.bootstrap-dialog-footer-buttons > .'+mButton).html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		                            $('.bootstrap-dialog-footer-buttons > .'+mButton).attr('disabled','disabled');
		                        },
		                        success: function(response){
		                            
		                           localStorage.setItem('response', response);
		                           location.reload();
		                            
		                        },
		                        error: function(response){
		                          $('html, body').animate({ scrollTop: 0 }, 400);
		                          $('form').find('#response').empty().prepend(alert_error).fadeIn();
		                        }
		                  });
		                 }
		         }]
		     });
		    
		});
	  var page_type = $('#page-type');
	  if(page_type.length && page_type.attr('data-page-type') == 'tank-master-page1'){
		  //tankFileList($('#attachable_id').val(),'Tank');
		  	var page_name = $('#page_name').val();
			if(page_name == 'profile'){
				profileTankList($('#attachable_id').val(),'Tank');
			}
			else{
				tankFileList($('#attachable_id').val(),'Tank');
			}
	  }
	
	if($('#sort').val() != '' && $('#page_name').val() == 'tank-core-index'){
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
		$('html, body').animate({
	        'scrollTop' : $(".tank-core-table").position().top
	    });
	}
    $('.sortClass').click(function(e) {
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
    		$('.tank-core-form').submit();
    	}
    });
    
    $('.view_log_tank_detail').click(function(e) {
    	var jsonData = jQuery.parseJSON($(this).parent('td').find('.history_json').val()); 
    	var updateby = $(this).attr('data-updateby');
    	var updateon = $(this).attr('data-updateon');
    	var html = "";
    	$.each(jsonData, function(key,value) {
    		var field = (key != null) ? key : "";
    		var updateValue = (value != null) ? value : "";
    		var oldHtml = "";
    		var newHtml = "";
    			
    		if($.isArray(updateValue)){
    			if($.isArray(updateValue[0])){
    				$.each( updateValue[0], function( key, value ) {
    					oldHtml += ((value != null) ? value : "")+"<br>";
    				});
    			}else{
    				oldHtml = (updateValue[0] != null) ? updateValue[0] : "";
    			}
    			
    			if($.isArray(updateValue[1])){
    				$.each( updateValue[1], function( key, value ) {
    					newHtml += ((value != null) ? value : "")+"<br>";
    				});
    			}else{
    				newHtml = (updateValue[1] != null) ? updateValue[1] : "";
    			}
    		}
    		
    		html += '<tr>'
    					+'<td><strong>'+field+'</strong></td>'
    					+'<td>'+oldHtml+'</td>'
    					+'<td>'+newHtml+'</td>'
    			+'</tr>'
    	}); 
    	$('.tank-history-update-by').html(updateby);
    	$('.tank-history-update-on').html(updateon);
    	$('.log-history-append').html(html);
    });
	
    $('#tank-modification-table').tablesorter({
         widthFixed: true,
         widgets: ['zebra', 'filter'],
         widgetOptions: {
           filter_reset: '.reset'
         },
    })
    $('.tablesorter-filter-row').hide();
    
    $('#document_btn').click(function(){
        $('#document_btn i').toggleClass('fa-minus-circle fa-plus-circle');    
    });
    
    $("input[type='radio']").click(function(){
        $(this).closest('.radio-validation-div').removeClass('highlight-custome');    
    });
    
    $('#tank_move_archived').click(function(e) {
    	
    	//$(this).html('<i class="fa fa-refresh fa-spin" style="font-size:14px" aria-hidden="true"></i>&nbsp;Move to Archived');
    	//$(this).attr("disabled", "disabled");
    	BootstrapDialog.show({
            type: BootstrapDialog.TYPE_PRIMARY,
            closable : false,
            title: "Confirmation",
            message: "Are you sure want to Archive the Tanks having <b>END</b> Activity ?",
            buttons: [{
   		             label: 'Close',
   		             action: function(dialogItself){ dialogItself.close(); }
   		         },{
   	             label: 'Ok',
   	             cssClass: 'btn-primary',
   	             action: function(dialogItself){
   	          	 $.ajax({
		   	 	        type: 'POST',
		   	 	        url: appHome+'/tank/move-archived/',
		   	 	        beforeSend: function() {
		   	 	        	$('.bootstrap-dialog-footer-buttons > .btn-primary').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		   	 	        	$('.bootstrap-dialog-footer-buttons > .btn-primary').attr('disabled','disabled');
		   	 	        },
		   	 	        success: function(response){
		   	 	        	if(response){
		   	 	        		var msg = 'The updating operation completed successfully';
		   	 	        		var cls = 'alert-success';
		   	 	        	}else{
		   	 	        		var msg = 'The updating operation failed';
		   	 	        		var cls = 'alert-danger';
		   	 	        	}
		   	 	        	var dispMsg = '<div class="alert '+cls+' alert-dismissable">'
						   	 	            +'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'
						   	 	            +'<i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> '+msg+'</div>';
		   	 	        	
		   	 	        	localStorage.setItem('response', dispMsg);
		   	 	        	location.reload();
		   	 	        },
		   	 	        error: function(response){
		   	 	        var dispMsg = '<div class="alert alert-danger alert-dismissable">'
						   	 	            +'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'
						   	 	            +'<i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> The updating operation failed!</div>';
		   	 	        	localStorage.setItem('response', dispMsg);
		   	 	        	location.reload();
		   	 	        }
		   	       	});
   	             }
            }]
        });
   	});
    showTechnicalInfo($('#tank_compartments').val());
    //bussinessTypeUnknownDisablied();
});//end of document ready

$(document).on('click' ,'.tank-elec', function(){
	if ($(this).val() == "1") {
		$('#tank_electric_type').attr('disabled',false);
		$('.electricgray').css({color:'rgb(51, 51, 51)'});
	}
	else {
		$("#tank_electric_type").attr("disabled",true);
		$('.electricgray').css({color:'grey'});
	}
	$('.chosen').trigger("chosen:updated");
});

/*
* Disable compartments when pot is single
*/
/*$(document).on('click' ,'.pot-type', function(){
	if ($(this).val() == '1') {
       $('#tank_compartments').attr('disabled',true);
       $('#tank_compartments').val('1'); 
       showCapacityBox(1);
    }
    else {
        $("#tank_compartments").attr("disabled", false);
	}
	$('.chosen').trigger("chosen:updated");
});*/

/*
* Disable compartments when single pot 
*/
$(document).on('change' ,'#tank_compartments', function(){
	var value = $(this).val();
	showCapacityBox(value);
	showTechnicalInfo(value);
});

/*
* Disable compartments when single pot 
*/
$(document).on('keyup' ,'.capacity-sum', function(e){
	calculateCapacity();
});
$(document).on('change' ,'#tank_compartments', function(){
	calculateCapacity();
	calculateNominalCapacity();
});	
/*
* Disable compartments when single pot 
*/
$(document).on('keyup' ,'.nominal-sum', function(e){
	calculateNominalCapacity();
});	

function calculateNominalCapacity(){
	var sum = 0;
	var capacity1 = $('#tank_normal_capasity').val();
	var capacity2 = $('#tank_normal_capacity2').val();
	var capacity3 = $('#tank_normal_capacity3').val();
	var capacity4 = $('#tank_normal_capacity4').val();
	if(capacity1 != ''){
		sum = sum + parseInt(capacity1);
	}
	if(capacity2 != ''){
		sum = sum + parseInt(capacity2);
	}
	if(capacity3 != ''){
		sum = sum + parseInt(capacity3);
	}
	if(capacity4 != ''){
		sum = sum + parseInt(capacity4);
	}
	$('#tank_normal_capacity_total').val(sum);
}

function calculateCapacity(){ 
	var sum = 0;
	var capacity1 = $('#tank_capacity').val();
	var capacity2 = $('#tank_capacity2').val();
	var capacity3 = $('#tank_capacity3').val();
	var capacity4 = $('#tank_capacity4').val();
	if(capacity1 != ''){
		sum = sum + parseInt(capacity1);
	}
	if(capacity2 != ''){
		sum = sum + parseInt(capacity2);
	}
	if(capacity3 != ''){
		sum = sum + parseInt(capacity3);
	}
	if(capacity4 != ''){
		sum = sum + parseInt(capacity4);
	}
	$('#tank_capacity_total').val(sum);
}

function showCapacityBox(value){
	if (value == "2") {
		$('.pot-capacity2').show();
		$('.pot-capacity3,.pot-capacity4').hide()
		{
			$('#tank_capacity3').val('0');
			$('#tank_capacity4').val('0');
			$('#tank_normal_capacity3').val('0');
			$('#tank_normal_capacity4').val('0');
		}
		$('.pot-total').show();
		
	}
	else if(value == "3"){
		$('.pot-capacity2').show();
		$('.pot-capacity3').show();
		$('.pot-capacity4').hide()
		{
			$('#tank_capacity4').val('0');
			$('#tank_normal_capacity4').val('0');
		}
		$('.pot-total').show();
	}
	else if(value == "4"){
		$('.pot-capacity2').show();
		$('.pot-capacity3').show();
		$('.pot-capacity4').show();
		$('.pot-total').show();
	}
	else{
		$('.pot-capacity2,.pot-capacity3,.pot-capacity4').hide()
		{
			$('#tank_capacity2').val('0');
			$('#tank_capacity3').val('0');
			$('#tank_capacity4').val('0');
			$('#tank_normal_capacity2').val('0');
			$('#tank_normal_capacity3').val('0');
			$('#tank_normal_capacity4').val('0');
		}
		$('.pot-total').hide();
		
	}
}
//To check the required field after each line
$(document).on('change', '.req-field', function(){
	//var numItems = $('.req-field').length;
	var indexvalue = $(".req-field").index(this);
	var currentindexvalue=$('.req-field:lt('+indexvalue+')').length;
	$(".req-field").each(function(index, value) {
	
	if(index < currentindexvalue)
		{
			if($(this).val() == '' || $(this).val() == null || $(this).val() == "__________/_")
				{
				$($(this)).parent().addClass('highlight'); 
				}
			else if($(this).attr('type') == "radio") 
				{	
				var radioname = $(this).attr('name');
				var checkedTotal = $("input[type='radio'][name='"+radioname+"']:checked").length;
				if(checkedTotal == 0)
					{
					$("input[type='radio'][name='"+radioname+"']").closest('.radio-validation-div').addClass('highlight-custome');
					}
		 
				}
		}
	
	});	
});


$(document).on('change', '#tank_business_type', function(){
	bussinessTypeUnknownDisablied();
});

$(document).on('change', '#tank_pre_inspection_date', function(){
	addOneYear();
});

function addOneYear(){
	var predate 	= $('#tank_pre_inspection_date').val().split('/');
	if(predate != "")
	{
	$('#tank_inspection_date').datepicker("option", "minDate", null);
	$('#tank_inspection_date').datepicker("option", "maxDate", null); 
	}
	var dateDay 	= parseInt(predate[0]);
    var dateMonth 	= parseInt(predate[1]);
    var dateYear 	= parseInt(predate[2]) + 1;
    var nex 		= [dateMonth,dateDay,dateYear].join('/');
    var addyear	    = new Date($.datepicker.formatDate('mm/dd/yy', new Date(nex)));
    $('#tank_inspection_date').val($.datepicker.formatDate('dd/mm/yy', new Date(addyear)));
}
$(document).on('change', '#tank_pre_periodic_test_type', function(){
	if($('#tank_next_mot_type').val() == ""){
		$('#tank_next_mot_type').val($(this).val());
		$('.chosen').trigger("chosen:updated");
		testInformation(); 
	}
});

$(document).on('click', '#damaged', function(){
	if($('#damaged:checkbox:checked').length > 0)
		{
		$(".tank_damaged_drd").show();
		}
	else
		{
		$("#tank_damaged_dd :selected").removeAttr('selected');
		$('.chosen').trigger("chosen:updated");
		$('#tank_damaged_active_from').val('');
		$(".tank_damaged_drd").hide();
		}
});

function showTechnicalInfo(value){
	if(value == '2'){
		$('.capalab').html('Front');
		$('#tank_front').attr('checked','checked');
		$('#tank_rear').attr('checked','checked');
		$('#tank_middle').removeAttr('checked');
		$('#front_label').show();
		$('#rear_conection').show();
		$('#middle_conection').hide();
		$('.middle_val').chosen().val('').trigger("chosen:updated");
	}else if(value == '3'){
		$('.capalab').html('Front');
		$('#tank_front').attr('checked','checked');
		$('#tank_rear').attr('checked','checked');
		$('#tank_middle').attr('checked','checked');
		$('#front_label').show();
		$('#rear_conection').show();
		$('#middle_conection').show();
	}else{
		$('.capalab').html('');
		$('#tank_front').removeAttr('checked');
		$('#tank_rear').removeAttr('checked');
		$('#tank_middle').removeAttr('checked');
		$('#front_label').hide();
		$('#rear_conection').hide();
		$('#middle_conection').hide();
		$('.middle_val,.rear_val').chosen().val('').trigger("chosen:updated");
	}
}
function bussinessTypeUnknownDisablied(){
	if(($('#tank_business_type').val() == 'MAN') || ($('#tank_business_type').val() == 'TPT')){
		$("input[name=tank_storm_covers][value=2]").prop('checked', true);
		$("input[name=tank_handrail][value=2]").prop('checked', true);
		$("input[name=tank_heat_foot_valve][value=2]").prop('checked', true);
		$('#vapour_connection_position option').removeAttr("disabled");
		$('.chosen').chosen().trigger("chosen:updated");
	}else if(($('#tank_business_type').val() == 'DED') || ($('#tank_business_type').val() == 'SPOT')){
		$('#vapour_connection_position option').removeAttr("disabled");
		//$("#vapour_connection_position option:not(option[value='UNKNOWN'])").prop('disabled',true);
		$("#vapour_connection_position option[value*='UNKNOWN']").prop('disabled',true);
		$('.chosen').chosen().trigger("chosen:updated");
	}
	else{
		$("input[name=tank_storm_covers][value=2]").prop('checked', false);
		$("input[name=tank_handrail][value=2]").prop('checked', false);
		$("input[name=tank_heat_foot_valve][value=2]").prop('checked', false);
		$('#vapour_connection_position option').removeAttr("disabled");
		$('.chosen').chosen().trigger("chosen:updated");
	}
}

//To apply the Bussiness type changes (in document ready change is triggering)
if(($('#tank_business_type').val() == 'SPOT') || ($('#tank_business_type').val() == 'TPT')){
	$("#tank_customer_group").val("");
	$("#tank_customer_group").prop('disabled',true).trigger('chosen:updated');
}else{
	$("#tank_customer_group").prop('disabled',false).trigger('chosen:updated')
}
$(document).on('change', '#tank_business_type', function() {
	if(($(this).val() == 'SPOT') || ($(this).val() == 'TPT')){
		$("#tank_customer_group").val("");
		$("#tank_customer_group").prop('disabled',true).trigger('chosen:updated');
	}else{
		$("#tank_customer_group").prop('disabled',false).trigger('chosen:updated')
	}
});

/**
* update tank
*/
$('.create-tank-profile-save,.edit-tank-profile-update').click(function(e){

  	var ExistSuccess = 'Ok';
	var invalidTank = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
  
  $('.highlight').removeClass('highlight');
  e.preventDefault();
  var form = '#'+$(this).closest('form').attr('id'),
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
  
  /**
   * function for validation in radio
   */
   function highlightRadio(fieldname){
	  
	  var radioTotal = $("input[type='radio'][name='"+fieldname+"']").length;
	  var checkedTotal = $("input[type='radio'][name='"+fieldname+"']:checked").length;
	  
	  if(checkedTotal == 0){
		  $("input[type='radio'][name='"+fieldname+"']").closest('.radio-validation-div').addClass('highlight-custome');
	      success.push(false);
	  }else{
		  $("input[type='radio'][name='"+fieldname+"']").closest('.radio-validation-div').removeClass('highlight-custome');
	      success.push(true);
	  }
  }
  
  /**
   * tank number valid or not
   */
  function tankNumberValid(txt){
	  var numReg = /^[a-zA-z]{4}[0-9]{6}\/[0-9]{1}$/;
	  var tno = txt.val();
	  if(numReg.test(tno)){
		  invalidTank = 'Ok';
		  $(txt).parent().removeClass('highlight');
		  success.push(true);
	  }else{		  
		  invalidTank = 'tankInvalid';
		  $(txt).parent().addClass('highlight');
	      success.push(false);
	  }
  }
  /**
   * numeric check
   */
  function isNumeric(value) {
	  var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
	  var str =value.val();
	  if(str.charAt(0) == '.'){
		  str = '0'+str;
	  }
	  if((numberRegex.test(str)) && (str >= 0)) {
		  $(value).parent().removeClass('highlight');
		  success.push(true);
	  }else{		  
		  $(value).parent().addClass('highlight');
	      success.push(false);
	  }  
	  //highlight($(form).find('#tank_no'), '');
	  var check_fields = (success.indexOf(false) > -1);
	}
  
  /**
   * tank number exist or not
   */
  function istankProfileExist(tankNo,button) {
	ExistSuccess = [];
	var type = '';
	  
	if(button.hasClass('edit-tank-profile-update')){
  		type = "update";
  	}
  	if(button.hasClass('create-tank-profile-save')){
  		type = "create";
  	}
	var tankNumber = tankNo.val();
	var tank_id = $('#tank_id').val();
	
	  $.ajax({
	        type: 'POST', 
	        url: path+'/tank-profile-exist',
	        async : false,
	        data: {
				'tankNumber' : tankNumber,
				'tank_id'	: tank_id,
				'type'	   : type
			},
	        success: function(response){
	        	if(response > 0){
	        		ExistSuccess = 'Exist';
	        		$(tankNo).parent().addClass('highlight');        		
	        	}else{
	        		ExistSuccess = 'Ok';
	        		$(tankNo).parent().removeClass('highlight');
	        	}
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	  });
  }  
	  //page 1  
	  highlight($('#tank_profile_id'), '');	 
	  highlight($('#tank_length'), '');
	  highlight($('#tank_width'), '');
	  highlight($('#tank_height'), '');
	  highlight($('#tank_division'), '');
	  highlight($('#tank_weight'), '');
	  highlight($('#tank_compartments'), '');
	  highlight($('#tank_business_type'), '');
	  highlight($('#tank_catwalk'), '');
	  highlight($('#tank_t_number'), '');
	  highlight($('#tank-mot-date'), '');
	  highlight($('#tank_manu_date'), '');
	  highlight($('#tank_discharge'), '');
	  highlightRadio('tank_syphon');
	  highlightRadio('tank_baffles');
	  highlightRadio('tank_handrail');
	  highlightRadio('tank_heat_foot_valve');
	  highlightRadio('tank_electric_tank');
	  //highlightRadio('tank_steam_coil');
	  
	  // check numeric valus greater than 0
	  if($.trim($('#tank_steam_area').val()) != ''){
		  isNumeric($('#tank_steam_area'), '');
	  }
	  if($.trim($('#tank_storm_covers').val()) != ''){
		  isNumeric($('#tank_storm_covers'), '');
	  }
	  if($.trim($('#tank-lease-agreement-no').val()) != ''){
		  isNumeric($('#tank-lease-agreement-no'), '');
	  }
	  if($.trim($('#tank-lease-per-day-rate').val()) != ''){
		  isNumeric($('#tank-lease-per-day-rate'), '');
	  } 
      
      if($.trim($('#amount-per-day-paid').val()) != ''){
          isNumeric($('#amount-per-day-paid'), '');
      } 

	  isNumeric($('#tank_weight'), '');
	  isNumeric($('#tank_length'), '');
	  isNumeric($('#tank_width'), '');
	  isNumeric($('#tank_height'), '');
	  //isNumeric($('#tank_capacity'), '');
	  if($.trim($('#tank_steam_area').val()) != ''){
		  isNumeric($('#tank_steam_area'), '');
	  }
	
	  if($.trim($('#tank_profile_id').val()) != ''){
		  //function for chech tank no exist
		  istankProfileExist($('#tank_profile_id'),$(this));
	  }
	  // if($.trim($('#tank_profile_id').val()) != ''){
		 //  tankNumberValid($('#tank_profile_id'));
	  // }
	  
  if(ExistSuccess == 'Exist'){
	  success.push(false);
	  $($('#tank_profile_id')).parent().addClass('highlight');   
  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank Profile ID already exists.</div>';
  }else if(invalidTank == 'tankInvalid'){
	  success.push(false);
  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank Profile ID must match a pattern ABCU123456/7 ! Please, re-enter</div>';
  }else{
	  success.push(true); 
	  alert_required = oldalert;
  }   
  var check_fields = (success.indexOf(false) > -1);
  /**
  * update edit-vgm-route
  */
  if($(this).hasClass('edit-tank-profile-update')){
	var tank_id = $('#tank_id').val();
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {
      $(this).attr('disabled','disabled');
      $.ajax({
        type: 'POST',
        url: '../'+tank_id+'/profile-update',
        data: $('#tank-core-data-page1').serialize().replace(/%5B%5D/g, '[]'),
        success: function(response){
          window.location.href = $('#returnpath').val();
          localStorage.setItem('response', response);
        },
        error: function(response){
        	 $(this).removeAttr('disabled');
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  }
  
   if($(this).hasClass('create-tank-profile-save')){
	      if(check_fields === true){
	        $('html, body').animate({ scrollTop: 0 }, 400);
	        $('form').find('#response').empty().prepend(alert_required).fadeIn();
	      } else {
	       $(this).attr('disabled','disabled');
	       $.ajax({
	         type: 'POST',
	         url: path+'/profile-add',
	         data: $('#tank-core-data-page1').serialize().replace(/%5B%5D/g, '[]'),
	         success: function(response){
	        	var tankno = $('#tank_profile_id').val();
	        	window.location.href = appHome+'/tank-core/profile-index?sort=&sorttype=&page_name=profile&tank-filter='+tankno+'&tank-division=&tank-type=&tank-status=all';
	            localStorage.setItem('response', response);
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

$(document).on('click', '.view-tank-profile', function(){
	var id = $(this).attr('data-id');
	$.ajax({
		type: "POST", 
		async: false, 
		url: appHome+'/tank-core/common_ajax', 
		dataType: "json",
		data: {
			'tank_id' : id,
			'action_type' : 'view_tank_profile'
		},
		success: function(response)
		{ 
			$('#tank_status').html(response.tank_status);
			$('#deepsea_approved_status').html(response.deepsea_approved_status);
			$('#tank_tank_no').html(response.tank_no);
			$('#tank_capacity').html(response.tank_capacity);
			$('#tank_capacity2').html(response.tank_capacity2);
			$('#tank_capacity3').html(response.tank_capacity3);
			$('#tank_capacity4').html(response.tank_capacity4);
			$('#tank_dimensions').html(response.tank_dim);			
			$('#tank_weight').html(response.tank_weight);
			$('#tank_division').html(response.tank_division);
			$('#tank_length').html(response.tank_length);
			$('#tank_width').html(response.tank_width);
			$('#tank_height').html(response.tank_height);
			$('#tank_potvalue').html(response.tank_potvalue);
			
			/*var productArr = response.prod_name;
			var resPro = "";
			if(productArr.length > 0){
				$.each( productArr, function( index, value ){
					resPro += '<span class="" style="font-size: 10px;">'+value+'</span><br>';
				});
			}
			$('.product_names_modal').html(resPro);*/
			
			$('#tank_iso_code').html(response.tank_iso_code);
			$('#tank_baffle_type').html(response.tank_baffle_type);
			$('#tank_prev_test_date').html(response.tank_prev_test_date);
			
			$('#tank_compartments').html(response.tank_compartments); 
			$('#tank_businesstype').html(response.tank_businesstype); 
			$('#tank_tatwalk').html(response.tank_tatwalk); 
			$('#tank_t_number').html(response.tank_t_number); 
			$('#tank_mot_date').html(response.tank_mot_date); 
			$('#tank_next_mot_date').html(response.tank_next_mot_date); 
			$('#tank_next_mot_type').html(response.tank_next_mot_type);		
			$('#tank_electric_type').html(response.tank_electric_type); 
			$('#tank_inspection_date').html(response.tank_inspection_date); 
			$('#tank_manlids').html(response.tank_manlids);
			
			$('#tank_bottom_valve_type').html(response.tank_bottom_valve_type); 
			$('#tank_foot_valve_manufacturer').html(response.tank_foot_valve_manufacturer);
			$('#tank_second_closure_manufacturer').html(response.tank_second_closure_manufacturer);
			$('#tank_bottom_outlet_manufacturer').html(response.tank_bottom_outlet_manufacturer);
			$('#tank_top_airline_valve_manufacturer').html(response.tank_top_airline_valve_manufacturer);
			$('#tank_top_airline_outlet_manufacturer').html(response.tank_top_airline_outlet_manufacturer);
			$('#tank_bottom_airline_valve_manufacturer').html(response.tank_bottom_airline_valve_manufacturer);
			$('#tank_bottom_airline_valve_manufacturer').html(response.tank_bottom_airline_valve_manufacturer);
			$('#tank_bottom_outlet_valve_manufacturer').html(response.tank_bottom_outlet_valve_manufacturer);
			$('#tank_top_valve_manufacturer').html(response.tank_top_valve_manufacturer);
			$('#tank_top_outlet_manufacturer').html(response.tank_top_outlet_manufacturer);
			$('#tank_next_mot_type').html(response.tank_next_mot_type);
			$('#tank_bottom_valve_size').html(response.tank_bottom_valve_size); 
			$('#tank_bottom_outlet_type').html(response.tank_bottom_outlet_type); 
			$('#tank_top_valve_type').html(response.tank_top_valve_type); 
			$('#tank_top_uutlet_type').html(response.tank_top_uutlet_type); 
			$('#tank_airline_outlet_type').html(response.tank_airline_outlet_type); 
			$('#tank_discharge').html(response.tank_discharge);
			$('#tank_steam_area').html(response.tank_steam_area);
			$('#tank_manufacture_date').html(response.tank_manufacture_date);
			$('#tank_manufacture').html(response.tank_manufacture_name);

			$('#tank_top_airline_outlet_type').html(response.tank_top_airline_outlet_type);
			$('#tank_bottom_airline_valve_type').html(response.tank_bottom_airline_valve_type); 
			$('#tank_bottom_airline_outlet_type').html(response.tank_bottom_airline_outlet_type); 
			$('#tank_created_by').html(response.tank_created_by);
			$('#tank_created_on').html(response.tank_created_on);
			$('#tank_group_view').html(response.tank_customer_group);
			$('#tank_normal_capasity').html(response.tank_normal_capasity);
			$('#tank_normal_capacity2').html(response.tank_normal_capacity2);
			$('#tank_normal_capacity3').html(response.tank_normal_capacity3);
			$('#tank_normal_capacity4').html(response.tank_normal_capacity4);
			$('#baffle_compartment_size').html(response.baffle_compartment_size);
			$('#tank_steam_coil_pressure').html(response.tank_steam_coil_pressure);
			$('#tank_steam_connection_type').html(response.tank_steam_connection_type);
			$('#tank_frame_type').html(response.tank_frame_type);
			$('#tank_shell_thickness').html(response.tank_shell_thickness);
			$('#tank_isolation_thickness').html(response.tank_isolation_thickness);
			$('#tank_shell_material_type').html(response.tank_shell_material_type);
			$('#tank_design_pressure').html(response.tank_design_pressure);
			$('#tank_corner_casting_position').html(response.tank_corner_casting_position);
			$('#tank_test_pressure').html(response.tank_test_pressure);
			$('#tank_design_temp').html(response.tank_design_temp);
			$('#tank_top_vapour_valve_type').html(response.tank_top_vapour_valve_type);
			$('#tank_top_outlet_type').html(response.tank_top_outlet_type);
			$('.tank_ownership_new').html(response.tank_ownership_new);			
			$('#tank_capacity_total').html(response.tank_capacity + response.tank_capacity2 + response.tank_capacity3 + response.tank_capacity4);
			$('#tank_normal_capacity_total').html(response.tank_normal_capasity + response.tank_normal_capacity2 + response.tank_normal_capacity3 + response.tank_normal_capacity4);
			$('#tank_pre_mot_type').html(response.tank_periodic_test_type);
			$('#tank_prev_inspection_date').html(response.tank_pre_inspection_date);
			$('#tank_gps_identifier').html(response.tank_gps_identifier);
			$('#tank_gps_status').html(response.tank_gps_status);
			if(response.is_tank_semi_dedicated == 1){
				$('.is_tank_semi_dedicated').html(' Yes');
			}else{
				$('.is_tank_semi_dedicated').html(' No');
			}
			
			
			if(response.tank_syphon_tube == 1){
				$('#tank_syphon_tube').html(' Yes');
			}else{
				$('#tank_syphon_tube').html(' No');
			}
			
			if(response.tank_storm_covers != 0 && response.tank_storm_covers != ''){
				$('#tank_storm_covers').html(' Yes');
			}else{
				$('#tank_storm_covers').html(' No');
			}
			
			if(response.tank_heat_foot_valve == 1){
				$('#tank_heat_foot_valve').html(' Yes');
			}else if(response.tank_heat_foot_valve == 2){
				$('#tank_heat_foot_valve').html(' Unknown');
			}else{
				$('#tank_heat_foot_valve').html(' No');
			}

			if(response.tank_syphon == 1){
				$('#tank_syphon').html(' Yes');
			}else{
				$('#tank_syphon').html(' No');
			}
			
			if(response.tank_handrail == 1){
				$('#tank_handrail').html(' Yes');
			}else if(response.tank_handrail == 2){
				$('#tank_handrail').html(' Unknown');
			}else{
				$('#tank_handrail').html(' No');
			}
			
			if(response.tank_electric_tank_check == 1){
				$('#tank_electric_tank_check').html(' Yes');
			}else{
				$('#tank_electric_tank_check').html(' No');
			}	

			if(response.tank_baffles == 1){
				$('#tank_baffles').html(' Yes');
				$('.baffleSizeType').show();
			}else{
				$('#tank_baffles').html(' No');
				$('.baffleSizeType').hide();
			}

			if(response.tank_steam_coils == 1){
				$('#tank_steam_coils').html(' Yes');
			}else{
				$('#tank_steam_coils').html(' No');
			}
			
			if(response.tank_short_term_lease == 1){
				$('#tank_short_term_lease').html('Yes');
			}
			else{
				$('#tank_short_term_lease').html('No');
			}
			/*var arrCustomer = response.customerList;
			var res = '';
			if(arrCustomer.length > 0){
				$.each( arrCustomer, function( index, value ){
					res += '<span class="" style="font-size: 10px;">'+value+'</span><br>';
				});
				$('.division_customers').html(res);
			}*/
			if(response.tank_compartments == '2'){
				$('.capacity-row2').show();
				$('.capacity-row3').hide();
				$('.capacity-row4').hide();
				$('.capacity-row5').show();
			}else if(response.tank_compartments == '3'){
				$('.capacity-row2').show();
				$('.capacity-row3').show();
				$('.capacity-row4').hide();
				$('.capacity-row5').show();
			}
			else if(response.tank_compartments == '4'){
				$('.capacity-row2').show();
				$('.capacity-row3').show();
				$('.capacity-row4').show();
				
				$('.capacity-row5').show();
			}
			else{
				$('.capacity-row2').hide();
				$('.capacity-row3').hide();
				$('.capacity-row4').hide();
				$('.capacity-row5').hide();
			}
		}  
	});
});

//Delete tank profile
$(document).on('click', '.delete-tank-profile', function(e){
	e.preventDefault();
	
	var delete_url = $(this).attr('data-href'),
		tank_id = $(this).data('tank-id'),
		tank_no = $(this).attr('data-tank-num'),
		$this = $(this),
		return_url = window.location.href;
	
	if($('#returnpath').val()) {
		return_url = $('#returnpath').val();
	}
		
	BootstrapDialog.show({
         type: BootstrapDialog.TYPE_DANGER,
         closable : false,
         title: "Confirmation (<strong>"+tank_no+"</strong>)",
         message: "Are you sure want to delete this Tank Profile?",
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
						timeout: 90000,
		  		       beforeSend: function() {
				        	$('.bootstrap-dialog-footer-buttons > .btn-danger').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		    		        $('.bootstrap-dialog-footer-buttons > .btn-danger').attr('disabled','disabled');
				        },
						data: {
							'tank_id' : tank_id
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

/**
 * document list in popup
 */
function profileTankList(id,type){
	var url = appHome+'/tank-core/common_ajax';
	$.ajax({  
		type: "POST", 
		cache: false, 
		url: url,  
		dataType: "text",
		data: ({
			'id' :id,
			'type' : type,
			'action_type' : 'list_profile_upload_docs',
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


$(".delete-tank-profile-doc").live('click', function(e){
	e.preventDefault();	
	$this = $(this);
	var up_fileInfo = $this.data();
	var deleteType = up_fileInfo.upload_type;
	var file_deletePath = appHome+'/tank-core/common_ajax';
	var attachid = 0;
	var siFileListCount = 0;
	var docidArr = up_fileInfo.docid.split("-");
	var tankId = $('#attachable_id').val();

	BootstrapDialog.confirm('Are you sure you want to delete this document ?', function(result){
		if(result == true) {
			$.ajax({
				type: "POST", 
				async: false, 
				url: file_deletePath, 
				dataType: "html",
				data: ({
					'docid' : docidArr[1],
					'tableType' : docidArr[0],
					'deleteType' : deleteType,
					'tankId' : tankId,
					'action_type' : 'delete_tank_profile_docs'
				}),  
				success: function(response)
				{ 
					
					if(response == 'success') {
						//remove icons
						$this.parents('tr').remove();

						tp_file_list = $(".tp-file-list tr").length;
						if (tp_file_list == 2)
						{
							$("#emptyFilesTr").removeClass();
							var id = $('#attachable_id').val();
							$('.docs-icon[data-id="'+ id +'"][data-upload-type="'+deleteType+'"]').find('.fa').removeClass().addClass('fa fa-file-o');
						}

	
					}else{
						BootstrapDialog.show({title: 'Error', message : 'Error occured Please try agan later.',
							 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
						});
					}
				}  
			});
		}
	});		
});

$(document).on('change','#lease_id', function(e){
	showLeaseDetails();
	// Lease Info
	if($('#lease_id').val() != ''){
		getTankContracts($('#tank_id').val(),$('#lease_id').val(),'lease');
	}

});

function showLeaseDetails(){
	$('.reset_values').html('');

	var lease_id = $('#lease_id').val();
	if(lease_id != '' && lease_id != undefined){
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: appHome+'/lease/common-ajax',
			data: {
				'lease_id' : lease_id,
				'action_type' : 'get_lease_detail'
			},
			success: function(response){
				$('.view_small_loader').hide();
				$('.lease-table,.lease-info-div').css('display', 'block');
				if(response != ""){
					$('#modal_company,.l-company-name').html(response.lease_company);
					$('#modal_contract_number,.l-contract-number').html(response.contract_number);
					$('#modal_daily_rate').html(response.daily_rate);
					$('#modal_currency').html(response.currency);
					$('#modal_lease_type,.l-lease-type').html(response.lease_type);
					$('#modal_lease_term').html(response.lease_term);
					$('#modal_original_hire_date').html(response.original_hire_date);
					$('#modal_hire_cost').html(response.on_hire_cost);
					$('#modal_hire_location').html(response.on_hire_location);
					$('#modal_days_free').html(response.days_free);
					$('#modal_revised_hire_date').html(response.revised_hire_date);
					$('#modal_off_hire_due_date').html(response.off_hire_due_date);
					$('#modal_tank_manufacturer').html(response.tank_manufacturer);
					$('#modal_replacement_value').html(response.replacement_value);
					$('#modal_depreciated_rv').html(response.depreciated_rv);
					$('#modal_tank_status').html(response.tank_status);
					$('#modal_comments').html(response.comments);
				}
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	}
	else{
		$('.lease-table,.lease-info-div').css('display', 'none');
	}
}

$(document).on('click', '#document_upload_btn', function(){
    $('#document_upload_btn i').toggleClass('fa-minus-circle fa-plus-circle');
}); 

$(document).on('click', '#lease_info_btn', function(){
    $('#lease_info_btn i').toggleClass('fa-minus-circle fa-plus-circle');
});

$(document).on('click', '#technical_btn', function(){
    $('#technical_btn i').toggleClass('fa-minus-circle fa-plus-circle');
});
$(document).on('click', '#lease_btn', function(){
    $('#lease_btn i').toggleClass('fa-minus-circle fa-plus-circle');
});

$(document).on('change', '#tank_length', function(){
	hideDeepSeaFlag();
});

function hideDeepSeaFlag(){
	var length = $('#tank_length').val();
	if(length < 7 && length >= 6 ){
		$('.deep-flag').show();
	}
	else{
		$('.deep-flag').hide();
	}
}

$(document).on('click', '#damaged_btn', function(){
    $('#damaged_btn i').toggleClass('fa-minus-circle fa-plus-circle');
});

$(document).on('click','#add-damaged', function(e){
	$('.clear-data').val('');
	$('#severity').val('minor');
	$('.chosen').trigger("chosen:updated");
	$('#mode').val('add');
	$('#damaged_modal').modal('show');
	$('#damage_id').val(0);
	$('#details').val('');
	$('#dam-response').empty();
	$('#date_from').parent().removeClass('highlight');
	$('#details').css('border','1px solid #ccc');
});

$(document).on('click','#save_damaged', function(e){
	$('.highlight').removeClass('highlight');
	 e.preventDefault();
	var form = '#'+$(this).closest('form').attr('id'),
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

	highlight($('#severity'), '');
	highlight($('#date_from'), '');
	highlight($('#details'), '');
	commonHighlightTextarea($('#details'), '');
	  
	 var check_fields = (success.indexOf(false) > -1);

	if(check_fields === true){
	    $('html, body').animate({ scrollTop: 0 }, 400);
	    $('#dam-response').empty().prepend(alert_required).fadeIn();
	} else {
		$('#damaged_modal').modal('hide');
		$('#dam-response').empty();
		var severity = $('#severity').val();
		var date_from = $('#date_from').val();
		var date_to = $('#date_to').val();
		var details = $('#details').val().trim();
		var tank_id = $('#attachable_main_form').val();
		var mode = $('#mode').val();
		var damage_id = $('#damage_id').val();

	    $.ajax({
	        type: 'POST',
	        url: appHome+'/tank-core/common_ajax',
	        data: {
	        	'severity' : severity,
	        	'date_from' : date_from,
	        	'date_to' : date_to,
	        	'details' : details,
	        	'tank_id' : tank_id,
	        	'mode' : mode,
	        	'damage_id' : damage_id,
	        	'action_type' : 'save_damaged_info'
	        },
	        success: function(response){
	        	getDamagedData(tank_id);
	        	
	        },
	        error: function(response){
	           $('html, body').animate({ scrollTop: 0 }, 400);
	           $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	    });
	}
});

function getDamagedData(tank_id){
	
	if(tank_id){
		var h = $('.overlay-complete-loader').height();
		if(h == 0) { h = 100; }
		$('.btl_overlay').height(h);  
		$('.btl_relative').show();
		$.ajax({
	        type: 'POST',
	        url: appHome+'/tank-core/common_ajax',
	        data: {
	        	'tank_id' : tank_id,
	        	'action_type' : 'get_damaged_info'
	        },
	        success: function(response){
	        	$('#damage-list').html(response);
	        	$('.btl_relative').hide();
	        },
	        error: function(response){
	           $('html, body').animate({ scrollTop: 0 }, 400);
	           $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	    });
	}
}

$(document).on('click','.edit-damage', function(){
	var severity = $(this).data('severity');
	var date_from = $(this).data('date-from');
	var date_to = $(this).data('date-to');
	var details = $(this).data('details');
	$('#severity').val(severity);
	$('.chosen').trigger("chosen:updated");
	$('#date_from').val(date_from);
	$('#date_to').val(date_to);
	$('#details').val(details);
	$('#damage_id').val($(this).data('damage-id'));
	$('#mode').val('edit');
	$('#damaged_modal').modal('show');
	$('#dam-response').empty();
	$('#date_from').parent().removeClass('highlight');
	$('#details').css('border','1px solid #ccc');
});

$(document).on('click','.delete-damaged', function(){
	var  damage_id = $(this).data('damage-id');

	BootstrapDialog.show({
        type: BootstrapDialog.TYPE_DANGER,
        closable : false,
        title: "Confirmation",
        message: "Are you sure want to delete this Damaged Info ?",
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
					    url: appHome+'/tank-core/common_ajax',
					    data: {
					    	'damage_id' : damage_id,
					    	'action_type' : 'delete_damaged_info'
					    },
					    success: function(response){
					    	dialogItself.close();
					    	getDamagedData($('#attachable_main_form').val());
					    },
					    error: function(response){
					       $('html, body').animate({ scrollTop: 0 }, 400);
					       $('form').find('#response').empty().prepend(alert_error).fadeIn();
					    }
					});
				}
		}]
    });
});

/**
 * document file uplad function
 */
function damageFileUpload(e) {
	
	var filename = $("#damage_file_name").val();
	var filenameCtrl = $("#damage_file_name");
	var page_name = $('#page_name').val();

	
	if(filename.trim() != ''){
			uploadPath = $("#damage_path").val();
			if(!$('#damage_file')[0]) {
				return false;
			}
		
			if(!$('#damage_file').val()) {
				$("#damage_upload_btn").attr('disabled','disabled');
				return false;
			}
			
			var fd = new FormData();
			fd.append("file_to_upload", $('#damage_file')[0].files[0]);
			fd.append("attachable_id", $('input[name="attachable_id"]').val());
			fd.append("new_file_name", $('#damage_file_name').val());
			fd.append("damage_id", $('#damage_id').val());
		
			var xhr = new XMLHttpRequest();
		
			// file received/failed
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
						$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
						xhr.addEventListener("load", documentFileUploadComplete, false);
						$('#progress_num_uf').addClass(xhr.status == 200 ? "success" : "failure");
					
				}
			};
			xhr.upload.addEventListener("progress", documentDamageFileUploadProgress, false);
			xhr.addEventListener("load", documentDamageFileUploadComplete, false);
			xhr.addEventListener("error", documentFileUploadFailed, false);
			xhr.addEventListener("abort", documentFileUploadCanceled, false);
			xhr.open("POST", uploadPath);
			xhr.send(fd);
			$('#damage_file_name').val('');
			$('#damage_file').val('');
	
		}else{
			filenameCtrl.val('');
			filenameCtrl.focus();
		}
}
/**
 * process function
 * @param evt
 */
function documentDamageFileUploadProgress(evt) {
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progress_upload').show();
	$('#upload-progress-bar-damage').removeClass('progress-bar-danger').addClass('progress-bar-success');
	$('#upload-progress-bar-damage').css('width',percentComplete.toString()+ '%');
	$('#upload-progress-bar-damage').data('aria-valuenow',percentComplete.toString());
	$('#upload-progress-bar-damage').html(percentComplete.toString() + '%');
}

$(document).on('change','#damage_file', function(){
	var file = document.getElementById('damage_file').files[0];
	$('#damageFileSize,#damageFileType,#damageFileExist').show();
	if (file) {
	  var fileSize = 0;
	  if (file.size > 1024 * 1024)
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	  else
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
	  
	  var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
	  
	  var extension = fname.substr( (fname.lastIndexOf('.') +1) );
	 
	  var randomNumber = Math.floor(Math.random()*90000) + 10000;
	  document.getElementById('damage_file_name').value = randomNumber+'_'+fname;
	  document.getElementById("damage_file_name").select(fname);
	  document.getElementById('damageFileSize').innerHTML = 'Size: ' + fileSize;
	  document.getElementById('damageFileType').innerHTML = 'Type: ' + file.type;
	}
	
	var file_cntrl = $('#damage_file');
	if(file_cntrl.val() != "" )
	{
		$("#damage_upload_btn").removeAttr('disabled');
	}		
		$('#upload-progress-bar').css('width','0%');
		$('#upload-progress-bar').data('aria-valuenow','0');
		$('#upload-progress-bar').html('');
});

/**
 * upload complete
 * @param evt
 */
function documentDamageFileUploadComplete(evt) {
	var id = $('#attachable_id').val();
	var type = $('#attachable_type').val();
	var page_name = $('#page_name').val();
	var typeData = 'damaged';

	$('#progress_upload,#damageFileSize,#damageFileType,#damageFileExist').delay(2000).fadeOut('slow');
	$('.docs-icon[data-id="'+ id +'"][data-upload-type="'+ typeData +'"]').find('.fa').removeClass().addClass('fa fa-file');
}

$(document).on('click','#generate-batches',function(e){
	  
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	$('.highlight').removeClass('highlight');
	e.preventDefault();
	var form = '#tank-batch-form',
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

  	function istankExistss(tankNo,button) {
		ExistSuccess = [];
		var tankNumber = tankNo.val();
		$.ajax({
	        type: 'POST', 
	        url: appHome+'/tank-core/tank_exist',
	        async : false,
	        data: {
				'tankNumber' : tankNumber
			},
	        success: function(response){
	        	if(response > 0){
	        		ExistSuccess = 'Exist';
	        		success.push(false);
	        		$(tankNo).parent().addClass('highlight');   
	        		alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank Number already exists.</div>';     		
	        		$('html, body').animate({ scrollTop: 0 }, 400);
	          		$('form').find('#response').empty().prepend(alert_error).fadeIn();

	        	}else{
	        		ExistSuccess = 'Ok';
	        		$(tankNo).parent().removeClass('highlight');
	        	}
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	  	});
  	}

  	function tankNumberValidss(txt){
	  	var numReg = /^[a-zA-z]{4}[0-9]{6}\/[0-9]{1}$/;
	  	var tno = txt.val();
	  	if(numReg.test(tno)){
		  	invalidTank = 'Ok';
		  	$(txt).parent().removeClass('highlight');
		  	success.push(true);
	  	}else{		  
		  	invalidTank = 'tankInvalid';
		  	$(txt).parent().addClass('highlight');
	      	success.push(false);
	  	}
  	}

    if($("#tank_numbers").val()>100){
    	$("#tank_numbers").parent().addClass('highlight');
    	success.push(false);
    	tank_number_alert = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Maximum 100 Tanks Generations Limit.</div>';
		alert_required = tank_number_alert;
	}else{
		$("#tank_numbers").parent().removeClass('highlight');
    	success.push(true);

	}

	highlight($('#tank_no'), '');
	highlight($('#profile_id'), '');
	highlight($('#tank_numbers'), '');
	highlight($('#lease_id'), '');

	if($.trim($('#tank_no').val()) != ''){
		istankExistss($('#tank_no'),$(this));
		if(ExistSuccess === 'Exist'){
		  	alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank Number already exists.</div>';
		}
	}

	if($.trim($('#tank_no').val()) != ''){
		tankNumberValidss($('#tank_no'));
		if(invalidTank === 'tankInvalid'){
			alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank Profile ID must match a pattern ABCU123456/7 ! Please, re-enter</div>';
		}
	}
	var check_fields = (success.indexOf(false) > -1);
	if(check_fields === true){
	    $('html, body').animate({ scrollTop: 0 }, 400);
	    $('#response').empty().prepend(alert_required).fadeIn();
	} else {
		$('#tank-batch-form').submit();
	}

});

$(".tank_periodic_test_date").change(function(){
	 var id = $(this).attr('id');
	 var manu_date = $(this).val();
	 var nextperiodic = seriesDateCalculationsPlus($(this));
	 $(this).closest('td').next('td').find('input').val($.datepicker.formatDate('dd/mm/yy', new Date(nextperiodic)));
	 $(this).closest('td').next('td').next('td').find('input').val($.datepicker.formatDate('dd/mm/yy', new Date(nextperiodic)));
	 $(this).closest('td').prev('td').find('input').val(manu_date);
});

$(".next_periodic_test_date").change(function(){
	 var id = $(this).attr('id');
	 var manu_date = $(this).val();
	 var previousPeriodic = seriesDateCalculationsMinus($(this));
	 $(this).closest('td').next('td').find('input').val(manu_date);
	 $(this).closest('td').prev('td').find('input').val($.datepicker.formatDate('dd/mm/yy', new Date(previousPeriodic)));
	 $(this).closest('td').prev('td').prev('td').find('input').val($.datepicker.formatDate('dd/mm/yy', new Date(previousPeriodic)));
});

$(".profile_tank_manu_date").change(function(){
	    var id = $(this).attr('id');
		//$(this) refers to button that was clicked
        var manu_date = $(this).val();
        $(this).closest('td').next('td').find('input').val(manu_date);
        var nextperiodic = seriesDateCalculationsPlus($(this));
        $(this).closest('td').next('td').next('td').find('input').val($.datepicker.formatDate('dd/mm/yy', new Date(nextperiodic)));
		$(this).closest('td').next('td').next('td').next('td').find('input').val($.datepicker.formatDate('dd/mm/yy', new Date(nextperiodic)));
    	
});
$(".next_inspection_date").change(function(){
	    var id = $(this).attr('id');
        var manu_date = $(this).val();
        $(this).closest('td').prev('td').find('input').val(manu_date);
        var previousPeriodic = seriesDateCalculationsMinus($(this));
        $(this).closest('td').prev('td').prev('td').find('input').val($.datepicker.formatDate('dd/mm/yy', new Date(previousPeriodic)));
	 	$(this).closest('td').prev('td').prev('td').prev('td').find('input').val($.datepicker.formatDate('dd/mm/yy', new Date(previousPeriodic)));
    	
});

function seriesDateCalculationsMinus(obj){
	var predate     = obj.val();
	var nextdate = "2.5";
	if(predate != "" && nextdate != "")
 	{
		var predate      = predate.split('/');
		var dateDay      = parseInt(predate[0]);
    	var dateMonth    = parseInt(predate[1]);
    	var dateYear 	 = parseInt(predate[2]);
    	var nex          = [dateMonth,dateDay,dateYear].join('/');
		var d            = new Date($.datepicker.formatDate('mm/dd/yy', new Date(nex)));
		var year         = d.getFullYear();
		var month        = d.getMonth();
		var day          = d.getDate();
		var tankmotType  = parseFloat(nextdate)
		var motyear      = parseInt(tankmotType);
		var motmonth     = tankmotType-motyear;
		var calmotmonth  = motmonth * 12;
		var nextperiodic = new Date(year - motyear , month - calmotmonth , day);
	}
	return nextperiodic;	
}

function seriesDateCalculationsPlus(obj){

	var predate     = obj.val();
	var nextdate = "2.5";
	if(predate != "" && nextdate != "")
 	{
		var predate      = predate.split('/');
		var dateDay      = parseInt(predate[0]);
    	var dateMonth    = parseInt(predate[1]);
    	var dateYear 	 = parseInt(predate[2]);
    	var nex          = [dateMonth,dateDay,dateYear].join('/');
		var d            = new Date($.datepicker.formatDate('mm/dd/yy', new Date(nex)));
		var year         = d.getFullYear();
		var month        = d.getMonth();
		var day          = d.getDate();
		var tankmotType  = parseFloat(nextdate)
		var motyear      = parseInt(tankmotType);
		var motmonth     = tankmotType-motyear;
		var calmotmonth  = motmonth * 12;
		var nextperiodic = new Date(year + motyear , month + calmotmonth , day);
	}
	return nextperiodic;	
}

$(document).on('click','#make-available',function(e){
	$('.highlight').removeClass('highlight');
	e.preventDefault();
	var counts = $("#row_count").val();
	var form = '#tank-series-form',
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
	var alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	for($z= 1; $z<=counts; $z++){

		highlight($('#batch_tank_no'+$z), '');
		highlight($('#batch_tank_capacity'+$z), '');
		highlight($('#profile_tank_manu_date'+$z), '');
		highlight($('#tank_prev_test_date'+$z), '');
		highlight($('#tank_next_mot_date'+$z), '');
		highlight($('#next_inspection_date'+$z), '');

		if($.trim($('#batch_tank_no'+$z).val()) != ''){
		  	istankOccur($('#batch_tank_no'+$z));
		  	tankNumberCheck($('#batch_tank_no'+$z));
		  	if(invalidTank === 'tankInvalid'){
		  		alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank Profile ID must match a pattern ABCU123456/7 ! Please, re-enter</div>';
		  	}
		  	if(ExistSuccess === 'Exist'){
		  		alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank Number already exists.</div>';
		  		$($('#batch_tank_no'+$z)).parent().addClass('highlight'); 
		  	}
		}
	}


  	function istankOccur(tankNo) {
		ExistSuccess = [];
		var tankNumber = tankNo.val();
		$.ajax({
	        type: 'POST', 
	        url: appHome+'/tank-core/tank_exist',
	        async : false,
	        data: {
				'tankNumber' : tankNumber
			},
	        success: function(response){
	        	if(response > 0){
	        		ExistSuccess = 'Exist';
	        		success.push(false);
	        		//$(tankNo).parent().addClass('highlight'); 		
	        		$('html, body').animate({ scrollTop: 0 }, 400);
	          		$('form').find('#response').empty().prepend(alert_error).fadeIn();

	        	}else{
	        		ExistSuccess = 'Ok';
	        		$(tankNo).parent().removeClass('highlight');
	        	}
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	  	});
  	}

  	function tankNumberCheck(txt){
	  var numReg = /^[a-zA-z]{4}[0-9]{6}\/[0-9]{1}$/;
	  var tno = txt.val();
	  if(numReg.test(tno)){
		  invalidTank = 'Ok';
		  $(txt).parent().removeClass('highlight');
		  success.push(true);
	  }else{		  
		  invalidTank = 'tankInvalid';
		  $(txt).parent().addClass('highlight');
	      success.push(false);
	  }
  	}
	var check_fields = (success.indexOf(false) > -1);
		if(check_fields === true){
	   	 	$('html, body').animate({ scrollTop: 0 }, 400);
	    	$('#response').empty().prepend(alert_required).fadeIn();
		} else {
			$('#tank-series-form').submit();
		}
});

$(document).on('click', '.show-date-pic', function(e){
	$('#plan_date').focus();
});

$(document).on('click', '.allocate-tank-plan', function(e){
  	e.preventDefault();
  	var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      //tank_plan_id = $('input[name="plan_id_edit"]').val(),
      path = $(this).attr('data-path');
  	
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

  	highlight($(form).find('#job_no'), '');
  	highlight($(form).find('#activity'), '');
  	highlight($(form).find('#tank_no'), '');
  	highlight($(form).find('#plan_date'), '');
  	highlight($(form).find('#from_town'), '');
  	highlight($(form).find('#to_town'), '');
  	var check_fields = (success.indexOf(false) > -1); 
  	if($(this).hasClass('allocate-tank-plan')){
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {
    	var button = $(this);
    	button.find('span').removeClass().addClass("fa fa-refresh fa-spin");
    	button.attr('disabled','disabled');

    	if($(this).hasClass('allocate-tank-plan')){
    		var tpurl = appHome+'/tank-core/create_tanks';
    	}

		addUpdateTankPlan(tpurl);

    }
    return false;
  }
});

function addUpdateTankPlan(url){
	$.ajax({
        type: 'POST',
        url: url,
        data: $("#add-line-form").serialize().replace(/%5B%5D/g, '[]'),
        success: function(response){
        	  window.location.href = appHome+'/tank-core/index';
        	  localStorage.setItem('response', response);
         
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          button.find('span').removeClass().addClass("glyphicon glyphicon-ok-sign");
      	  button.removeAttr('disabled');
        }
      });
}

$(document).on('click', '#btn-tnk-series-back', function(e){

	var action = appHome+'/tank-core/back-button-tank-series';
	$('#add-line-form').attr('action',action);
	$('#add-line-form').submit();
}); 

$(document).on('click', '#goback_intermediate', function(e){

	var first_tank_number  = $("#first_tank_number").val();
	var tanks = $("#row_count").val();
	var profile_id = $("#tank_profile_id").val();
	var action = appHome+'/tank-core/back-button-create-batch';
	$('#tank-series-form').attr('action',action);
	$('#tank-series-form').submit();
	$('#tank_no').val(first_tank_number);
	$('#tank_numbers').val(tanks);
	$('#profile_id').val(profile_id).chosen().trigger("chosen:updated");
}); 

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
	  var attachable_type = $('#attachable_type').val();
	 
	  var randomNumber = Math.floor(Math.random()*90000) + 10000;
	  document.getElementById('fileName').value = randomNumber+'_'+fname;
	  document.getElementById("fileName").select(fname);
	  if(attachable_type == 'Tank_gallery'){
		  var ImageArray = ['jpg','jpeg','gif','png']
		  if($.inArray(extension,ImageArray) < 0){
			  document.getElementById('fileSize').innerHTML = '<span style="color:red;">Warning : <br>- Unsupported File</span>';
			  document.getElementById('fileType').innerHTML = '<span style="color:red;">- Please Choose an Image file(.jpeg,.jpg,.gif,.png)</span>';
			  $("#upload_btn").attr('disabled','disabled');
			  return false;
		  }
	  }

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


$(function() {
if($('#page-type').val() == "form-page"){
		Dropzone.autoDiscover = false;
		//Dropzone class
		var myDropzone = new Dropzone("body", {
			url: "#",
			// acceptedFiles: "image/*,application/pdf",
			maxFiles : 1, 
			previewsContainer: "#document_upload_btn_div",
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
						if($('#document_upload_btn_div').hasClass('collapse')){
							$("#document_upload_btn").click();
						} 
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
		var myDropzone1 = new Dropzone("#damaged_modal", {
			url: "#",
			// acceptedFiles: "image/*,application/pdf",
			maxFiles : 1, 
			previewsContainer: "#damaged-form",
			disablePreviews: true,
			autoProcessQueue: false,
			uploadMultiple: false,
			clickable: false,
			init : function() {
	
				myDropzone1 = this;
		
				//Restore initial message when queue has been completed
				this.on("drop", function(event) {
					if(event.dataTransfer.files.length > 0){
						fileInput = document.getElementById("damage_file"); 
						fileInput.files = event.dataTransfer.files;
						
						$("#damaged-file-upload-panel").css("background-color", "#bdbdbd");
						setTimeout(() => {
							$("#damaged-file-upload-panel").css("background-color", "unset");
						}, 800);
						$(fileInput).trigger('change')
						setTimeout(() => {
							// documentFileUpload(); to automatic upload
							myDropzone1.removeAllFiles( true );
						}, 200);
					}
	
	
				});
		
			}
		});
	}

	if($('#drag_and_drop_files_on_tank_index').val()){
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

	function getTankCoreDocs(){
		var tid = [];
		$('.tank-docs-td').each(function(){
				tid.push($(this).attr('data-tankid'));
		})
		
		$.ajax({  
			type: "POST", 
			cache: false, 
			url: appHome+'/tank-core/common_ajax',  
			dataType: "json",
			data: ({
				'tid' :tid,
				'action_type' : 'get_docs_icon_info',
			}),
			success: function(result){
				$('.tank-docs-td .fa-spinner, .tank-hrdocs-td .fa-spinner').removeClass('fa-spinner fa-spin').addClass('fa-file-o');
				$.each( result, function( index, value ){
					
					if($.inArray("Tank", value) !== -1){
						$('.tank-docs-td[data-tankid="'+index+'"] [data-upload-type="tank_doc"] i').removeClass('fa-file-o').addClass('fa-file');
					}

					if($.inArray("Tank_on_hire", value) !== -1){
						$('.tank-hrdocs-td[data-tankid="'+index+'"] [data-upload-type="on_hire_agreement_doc"] i').removeClass('fa-file-o').addClass('fa-file');
					}

					if($.inArray("Tank_gallery", value) !== -1){
						$('.tank-docs-td[data-tankid="'+index+'"] [data-upload-type="tank_gallery"] i').removeClass('fa-file-o').addClass('fa-file');
					}

					
				});
			}

		});
	}

	if($('#page-type').length > 0 && $('#page-type').val() == 'listing-page'){
		getTankCoreDocs();
	}
});


function getTankContracts(tank_id, lease_id, type='tank'){
	var tank_number = $('#tank_no').val();
	$.ajax({
		type: 'POST',
		url: appHome+'/tank-core/common_ajax',
		data: {
			'tank_id' : tank_id,
			'lease_id' : lease_id,
			'tank_number' : tank_number,
			'type' : type,
			'action_type' : 'get_lease_tank_contracts_by_tank_id'
		},
		success: function(response){
			if(response){
				$('#tank_contracts').html(response);
				$('.datepicker').datepicker({
				    dateFormat: btl_default_date_format,
				    changeMonth: true,
				    changeYear: true,
				    inline: true,
				    startDate: 0
				});
			}
		},
		error: function(response){
			$('html, body').animate({ scrollTop: 0 }, 400);
         	$('form').find('#response').empty().prepend(alert_error).fadeIn();
		}
	});
}

$(document).on('click','.input-group-addon',function(){
	$(this).parent().find('.datepicker').trigger('focus');
});
