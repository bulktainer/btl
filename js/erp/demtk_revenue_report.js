$(document).on('click', '#search_list', function(e) {
  	
   var form = '#'+$(this).closest('form').attr('id');
   var from_date = $('#load_date_from').val();
   var to_date = $('#load_date_to').val(); 
   if( from_date == '' && to_date == '') {
   success = [];
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
	highlight($(form).find('#load_date_from'), '');
	highlight($(form).find('#load_date_to'), '');
	var check_fields = (success.indexOf(false) > -1);
	if(check_fields === true){
		 e.preventDefault();
		BootstrapDialog.show({title: 'DAMAG and AVLB Report', message : 'Please select the From date and To date..',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],	
				});       
	} 
   }

}); 
$(document).ready(function(){
	var rowcount = $('#row_count').val();
    if(rowcount){
    	$('#count-row').text(rowcount);
    }else{
        $('#count-row').text(0);
    }
});
$( window ).load(function() {
	function setMultiSelectElement(element){
		$("#"+element).multiselect({
        enableCaseInsensitiveFiltering: true,
        enableFiltering: true,
        maxHeight: 200,
        buttonWidth: '100%',
        onChange: function(element, checked) {
          if (checked === true && element.val() == '') {
           element.parent().val('');
           element.parent().multiselect('refresh');
         }
         if (checked === true && element.val() != ''){
           element.parent().multiselect('deselect', '');
           element.parent().multiselect('refresh');
         }
         if(checked === false && element.parent().val() == null){
         	element.parent().val('');
         	element.parent().multiselect('refresh');
         }
       }
       
     });
	}

    if($('#tank_business_type').length > 0){
      var tankBusinessTypeElement = $('#tank_business_type').attr('id');
      setMultiSelectElement(tankBusinessTypeElement);
       $('.tmp-input-ctrl').remove();
    }
    if($('#from_country').length > 0){
      var fromCountryElement = $('#from_country').attr('id');
      setMultiSelectElement(fromCountryElement);
       $('.tmp-input-ctrl').remove();
    }
    if($('#to_country').length > 0){
      var toCountryElement = $('#to_country').attr('id');
      setMultiSelectElement(toCountryElement);
       $('.tmp-input-ctrl').remove();
    }
    if($('#customer').length > 0){
      var customerElement = $('#customer').attr('id');
      setMultiSelectElement(customerElement);
       $('.tmp-input-ctrl').remove();
    }
    if($('#from_region').length > 0){
      var fromRegionElement = $('#from_region').attr('id');
      setMultiSelectElement(fromRegionElement);
       $('.tmp-input-ctrl').remove();
    }
     if($('#to_region').length > 0){
      var toRegionElement = $('#to_region').attr('id');
      setMultiSelectElement(toRegionElement);
       $('.tmp-input-ctrl').remove();
    }
  });
