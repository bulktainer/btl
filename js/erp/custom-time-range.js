$(document).ready(function(){
	
$('.time-range-validate').each(function() {
	var $picker_vld = $(this);
	$picker_vld.change(function(){
		CorrectTimeRange($(this));
	});
	$picker_vld.keypress(function(e){
		var value = $picker_vld.val();
		
		var strCheckphone = '0123456789';
		var key = '';
		var whichCodeNum = (window.Event) ? e.which : e.keyCode;

		if(window.navigator.userAgent.indexOf("MSIE") > -1){
			whichCodeNum = e.keyCode; 
		}

		if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter

		key = String.fromCharCode(whichCodeNum);

		if(strCheckphone.indexOf(key) == -1) return false;  // Not a valid key

		if(whichCodeNum != 45 && (value.length == 4))
		{
			$picker_vld.val(value +'-');
		} else if (whichCodeNum == 45 && value.length != 4) {
			return false;
		}
	});
	$picker_vld.keyup(function(e){
		var value = $picker_vld.val();
		var whichCodeNum = (window.Event) ? e.which : e.keyCode;

		if(window.navigator.userAgent.indexOf("MSIE") > -1){
			whichCodeNum = e.keyCode; 
		}
		
		if(value.length == 10 && whichCodeNum != 0 && whichCodeNum != 37 && whichCodeNum != 38 && whichCodeNum != 39 && whichCodeNum != 40)
		{
			CorrectTimeRange($picker_vld);
		}
	});	
});

//time range validator
function CorrectTimeRange(data) {
	
	var dt_val = $(data).val();
	var dt_split = dt_val.split('-');
	var time1_str = '0';
	var time2_str = '0';
	
	if(dt_split.length == 2) {
		time1_str = dt_split[0];
		time2_str = dt_split[1];
	} else if(dt_split.length == 1) {
		time1_str = dt_split[0];
	} 
	
	if(time1_str == ""){time1_str = '0'}
	if(time2_str == ""){time2_str = '0'}
	
	var time1 = getTimeRangCorrected(time1_str);
	var time2 = getTimeRangCorrected(time2_str);
	
	var result = time1 + "-" + time2;
	result = (result == "0000-0000") ? '' : result; 

	$(data).val(result);
}

function getTimeRangCorrected(data){
	
	var time_hh_str = data.substring(0, 2);
	var time_mm_str = data.substring(2, 4);
	var time_mm_str_oring = time_mm_str;

	if(time_hh_str == ""){time_hh_str = '0'}
	if(time_mm_str == ""){time_mm_str = '0'}
	
	var time_hh = parseInt(time_hh_str);
	var time_mm = parseInt(time_mm_str);
	
	if(isNaN(time_hh)) time_hh = '0';
	if(isNaN(time_mm)) time_mm = '0';
	
	time_hh_str = time_hh.toString();
	time_mm_str = time_mm.toString();
	
	if(time_hh == 0){
		time_hh_str = "00";
	}else if (time_hh < 10){
		time_hh_str = '0' + time_hh_str;
	}
	
	if(time_mm == 0){
		time_mm_str = "00";
	}else if(time_mm < 10 && time_mm_str_oring.length == 2){
		time_mm_str = "0" + time_mm_str;
	}else if(time_mm <= 5){
		time_mm_str = time_mm_str + "0";	
	}else if(time_mm < 10){
		time_mm_str = "59";	
	}else if(time_mm >= 59){
		time_mm_str = "59";
	}
	 
	return time_hh_str + time_mm_str;
}

});//end of document ready