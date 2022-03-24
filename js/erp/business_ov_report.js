$(document).ready(function(){
	//Page size change
	$('.custom-page-pagesize').change(function(e){
		var pagelimit = $(this).val();
		$('#pagesize').val(pagelimit);
		$('#export_pdf').val('no');
		$('#search-form').submit();
	});	
	
	function DoubleScroll(element) {
        var scrollbar= document.createElement('div');
        scrollbar.appendChild(document.createElement('div'));
        scrollbar.style.overflow= 'auto';
        scrollbar.style.overflowY= 'hidden';
        scrollbar.firstChild.style.width= element.scrollWidth+'px';
        scrollbar.firstChild.style.paddingTop= '1px';
        scrollbar.firstChild.appendChild(document.createTextNode('\xA0'));
        scrollbar.onscroll= function() {
            element.scrollLeft= scrollbar.scrollLeft;
        };
        element.onscroll= function() {
            scrollbar.scrollLeft= element.scrollLeft;
        };
        element.parentNode.insertBefore(scrollbar, element);
    }

	if($('#bor_table tr').length > 10){
		DoubleScroll(document.getElementById('doublescroll'));
	}
    
    $('.datepicker').on('change', function(){
	   var frm_dt = $('#date_from');
	   var to_dt = $('#date_to');

	   var dt1 = Date_Check(frm_dt);
	   var dt2 = Date_Check(to_dt);

	   if(dt1 == true && dt2 == true)
		{
			if(!checkIsValidDateRange(frm_dt.val(),to_dt.val())) {
				 BootstrapDialog.show({title: 'Business Overview Report', message : "'To date' should be greater than 'From date'."});
			}
		}
    });
	
	if($(".multi-sel-ctrl").length != 0){
		$(".multi-sel-ctrl").multiselect({
			enableCaseInsensitiveFiltering: true,
			enableFiltering: true,
			maxHeight: 200,
			buttonWidth: '100%',
			onChange: function(element, checked) {
				if(checked && element.val() == ""){
					element.parent().val('');
				 	element.parent().multiselect('refresh');
				}
				else{
					element.parent().multiselect('deselect', '');
					element.parent().multiselect('refresh');
				}
				if(checked === false && element.parent().val() == null ){
					element.parent().val('');
					element.parent().multiselect('refresh');
				}
			}
		});
		$('.tmp-input-ctrl').remove();
	}
	
});
