$(document).ready(function(){
	$('.datepicker').on('change', function(){
		   $('.response_load').html('');
		   var frm_dt = $('#date_from');
		   var to_dt = $('#date_to');
	
		   var dt1 = Date_Check(frm_dt);
		   var dt2 = Date_Check(to_dt);
	
		   if(dt1 == true && dt2 == true){
				if(!checkIsValidDateRange(frm_dt.val(),to_dt.val())) {
					 BootstrapDialog.show({title: 'Warning', message : "'To date' should be greater than 'From date'."});
					 $('.datepicker').val('');
				}
			}
	 });
});
