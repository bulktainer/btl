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

function validCharactersOnly(fld,event){
	 var regex = new RegExp("^[a-zA-Z0-9_.-]+$");
	 var key = '';
	 var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
	 var whichCodeNum = (window.Event) ? event.which : event.keyCode;

	 if(window.navigator.userAgent.indexOf("MSIE") > -1){
		whichCodeNum = event.keyCode; 
	 }
	 if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter
	 if (!regex.test(key)) {
	       event.preventDefault();
	       return false;
	 }
}

function validCharacterCustom(fld,event){
	 var regex = new RegExp("^[a-zA-Z0-9 _-]+$");
	 var key = '';
	 var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
	 var whichCodeNum = (window.Event) ? event.which : event.keyCode;

	 if(window.navigator.userAgent.indexOf("MSIE") > -1){
		whichCodeNum = event.keyCode; 
	 }
	 if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter
	 if (!regex.test(key)) {
	       event.preventDefault();
	       return false;
	 }
}