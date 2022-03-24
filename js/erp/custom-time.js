$(document).ready(function(){
	
	$(document).on('change', '.time-validate', function(){
		CorrectTime($(this));
	});
	$(document).on('keypress', '.time-validate', function(e){
		var value = $(this).val();
		
		var strCheckphone = '0123456789:-';
		var key = '';
		var whichCodeNum = (window.Event) ? e.which : e.keyCode;

		if(window.navigator.userAgent.indexOf("MSIE") > -1){
			whichCodeNum = e.keyCode; 
		}

		if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter

		key = String.fromCharCode(whichCodeNum);

		if(strCheckphone.indexOf(key) == -1) return false;  // Not a valid key

		if((whichCodeNum != 58 || whichCodeNum != 45) && (value.length == 2 || value.length == 5)){
			
			var secondChar = value.substring(2, 3);
			
			if(value.length == 5 && secondChar != "" && secondChar != "undefined"){
				var d = secondChar;
			}else{
				var d = ":";
			}
			if(key != '-' && key != ':'){
				$(this).val(value + d);
			}
		} else if ((whichCodeNum == 58 || whichCodeNum == 45) && value.length != 2 && value.length != 5) {
			return false;
		}
	});
	$(document).on('keyup', '.time-validate', function(e){
		var value = $(this).val();
		var whichCodeNum = (window.Event) ? e.which : e.keyCode;

		if(window.navigator.userAgent.indexOf("MSIE") > -1){
			whichCodeNum = e.keyCode; 
		}
		
		if(value.length == 10 && whichCodeNum != 0 && whichCodeNum != 37 && whichCodeNum != 38 && whichCodeNum != 39 && whichCodeNum != 40)
		{
			CorrectTime($(this));
		}
	});	


//time validator
function CorrectTime(data)
{
	var dt_val = $(data).val();
	
	var delimiterChange = dt_val.substring(2, 3);
	if(delimiterChange != '-' && delimiterChange != ':'){
		delimiterChange = ":";
	}
	dt_val = dt_val.replace(/-|:/g, delimiterChange);
	var dt_split = dt_val.split(delimiterChange);
	var dt_hour_str = '0';
	var dt_min_str = '0';
	var dt_sec_str = '0';
	
	if(dt_split.length == 3) {
		dt_hour_str = dt_split[0];
		dt_min_str = dt_split[1];
		dt_sec_str = dt_split[2];
	} else if(dt_split.length == 2) {
		dt_hour_str = dt_split[0];
		dt_min_str = dt_split[1];
	} else if(dt_split.length == 1) {
		dt_hour_str = dt_split[0];
	}  
	
	var dt_hour = parseInt(dt_hour_str);
	var dt_min = parseInt(dt_min_str);
	var dt_sec = parseInt(dt_sec_str);
	
	if(dt_hour > 23) {
		dt_hour_str = '23';
	}
	if(dt_min > 59) {
		dt_min_str = '59'; 
	}
	if(dt_sec > 59) {
		dt_sec_str = '59';
	}
		
	if(dt_hour <= 9 && dt_hour_str.length == 1) {
		dt_hour_str = '0' + dt_hour_str;
	}
	if(dt_min <= 9  && dt_min_str.length == 1) {
		dt_min_str = '0' + dt_min_str; 
	}
	if(dt_sec <= 9 && dt_sec_str.length == 1) {
		dt_sec_str = '0' + dt_sec_str;
	}
	
	if(dt_hour == 0 || isNaN(dt_hour)) {
		dt_hour_str = '00';
	}
	if(dt_min == 0 || isNaN(dt_min)) {
		dt_min_str = '00'; 
	}
	if(dt_sec == 0 || isNaN(dt_sec)) {
		dt_sec_str = '00';
	}
	
	if(dt_val != "")
	{
		$(data).val(dt_hour_str + delimiterChange + dt_min_str + delimiterChange + dt_sec_str);
	}
	
}

});//end of document ready