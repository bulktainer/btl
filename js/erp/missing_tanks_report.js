$(document).ready(function(){
	
	$('.full_loadrow').show();
	$('.count_label').hide();
	if($('#sort').val() != '' && $('#page_name').val() == 'missing-tank-index'){
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
	        'scrollTop' : $(".missing-tank-table").position().top
	    });
	}
	
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
    var hiddenCount = $('#hidden_count').val();
    if(hiddenCount != "" && $('#hidden_count').length > 0){
        var jsonObj = JSON.parse(hiddenCount);
	    var currectcodecount = jsonObj.count1;
	    var incurrectcodecount = jsonObj.count2;
	    $('.full_loadrow').hide();
	    $('.count_label').show();
	    $('.count-correct-code').text(currectcodecount);
	    $('.count-incorrect-code').text(incurrectcodecount);
	    $('.missing-code').text($('.total-count-tr').length);
    }
    $('.btn-filter-missing').click(function(e) {
    	e.preventDefault();
    	$('#status,#sort,#sorttype').val('');
    	$('#tank-missing-form').submit();
    });
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
    		$('#tank-missing-form').submit();
    	}
    });
    
});