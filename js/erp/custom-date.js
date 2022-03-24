
$('.date-validate-only').each(function() {
	var $picker_vld = $(this);
	$picker_vld.change(function(){
		CorrectDate($(this));
	});
	$picker_vld.keypress(function(e){
		var value = $picker_vld.val();
		
		var strCheckphone = '0123456789/';
		var key = '';
		var whichCodeNum = (window.Event) ? e.which : e.keyCode;

		if(window.navigator.userAgent.indexOf("MSIE") > -1){
			whichCodeNum = e.keyCode; 
		}

		if ( whichCodeNum == 5 || whichCodeNum == 8 ||  whichCodeNum == 13 || whichCodeNum == 0 ) return true;  // Enter

		key = String.fromCharCode(whichCodeNum);

		if(strCheckphone.indexOf(key) == -1) return false;  // Not a valid key

		if(whichCodeNum != 47 && (value.length == 2 || value.length == 5))
		{
			$picker_vld.val(value +'/');
		} else if (whichCodeNum == 47 && value.length != 2 && value.length != 5) {
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
			CorrectDate($picker_vld);
		}
	});	
});

$('.custdate').each(function() {	
	var $picker = $(this);
	//$picker.mask("00/00/0000", {placeholder: "dd/mm/yyyy",byPassKeys:[0,8,46]});
	$picker.datepicker({
	    dateFormat: "dd/mm/yy",
	    inline: true,
	    startDate: 0
	  }); 
	$picker.change(function(){
		CorrectDate($(this));
	});

	//Date icon
	$picker.next('.input-group-addon').click(function() {
		$picker.trigger('focus');
	});
});

//date validator
function CorrectDate(data)
{
	var dt_val = $(data).val();
	var dt_len = dt_val.length;
	var dt_split = dt_val.split('/');
	var dt_arr = btl_default_date_format.split('/');
	var dt_err = false;
	var d = new Date();
	
	if (dt_val != "" && dt_len == 10 && dt_split.length == 3)
	{
		var dt_date = parseInt(dt_split[dt_arr.indexOf('dd')]);
		var dt_month = parseInt(dt_split[dt_arr.indexOf('mm')]);
		var dt_year = parseInt(dt_split[dt_arr.indexOf('yy')]);
		var dt_date_str = dt_split[dt_arr.indexOf('dd')];
		var dt_month_str = dt_split[dt_arr.indexOf('mm')];
		var dt_year_str = dt_split[dt_arr.indexOf('yy')];
		
		if(!isNaN(dt_year) && dt_year > 0)
		{
			if(!isNaN(dt_month) && dt_month > 0 && dt_month <= 12)
			{
				if(!isNaN(dt_date) && dt_date > 0 && dt_date <= 31) 
				{
					// do nothing
				} else {
					dt_date_str = "31";
				}

				switch(dt_month) {
			    case 4:
			    case 6:	
			    case 9:
			    case 11:
			    	if(dt_date == 31) {dt_date_str = "30";}
			    	break;
			    case 2:	
					if (dt_year % 4 == 0 && dt_date > 29)
					{
						dt_date_str = "29";
					} else if (dt_date > 29) {
			    		dt_date_str = "28";
			    	} 
			    	break;
				}

			} else {
				dt_month_str = "12";

				if(!(!isNaN(dt_date) && dt_date > 0 && dt_date <= 31)) 
				{
					dt_date_str = "31";
				} 
			}
			
		} else {
			dt_year_str = d.getFullYear();
			dt_month_str = "12";
			dt_date_str = "31";
		}
		
	} else {
		dt_year_str = d.getFullYear();
		dt_month_str = "12";
		dt_date_str = "31";
	} 

	if(dt_year < 1900 || dt_year > 2100)
	{
		dt_year_str = d.getFullYear();
	}
	
	if(dt_val != "")
	{
	    var dt_str_arr =[];  
		dt_str_arr[dt_arr.indexOf('dd')] = dt_date_str;
		dt_str_arr[dt_arr.indexOf('mm')] = dt_month_str;
		dt_str_arr[dt_arr.indexOf('yy')] = dt_year_str;
		$(data).val(dt_str_arr[0] + "/" + dt_str_arr[1] + "/" + dt_str_arr[2]);
	}
	
}