$(document).on('change', '.custom-page-pagesize', function(e) {
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('#job-template-list').submit();
});

$(document).on('click', '#search_box_bttn', function(e) {	
    $('#search_box_bttn i').toggleClass('fa-search-minus fa-search-plus');
    $('.search_box').slideToggle("slow");
});