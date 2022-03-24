$(document).ready(function(){

	$('.summary-select-all').change(function(e){
	     if ($(this).is(":checked")) {
	     	$('.summary-each-checkbox').prop( "checked", true );
	     } else {
	     	$('.summary-each-checkbox').prop( "checked", false );
	     }
	});

  $('.summary-each-checkbox').change(function(e){
    var acceptTotal1 = $('.summary-each-checkbox:checked').length;
    var acceptCount1 = $('.summary-each-checkbox').length;

    if(acceptCount1 == acceptTotal1){
      $('.summary-select-all').prop('checked',true);
    }else{
      $('.summary-select-all').prop('checked',false);
    }
  });

  $('.demtk-select-all').change(function(e){
       if ($(this).is(":checked")) {
        $('.demtk-each-checkbox').prop( "checked", true );
       } else {
        $('.demtk-each-checkbox').prop( "checked", false );
       }
   });



  $('.demtk-each-checkbox').change(function(e){
    var acceptTotal1 = $('.demtk-each-checkbox:checked').length;
    var acceptCount1 = $('.demtk-each-checkbox').length;

    if(acceptCount1 == acceptTotal1){
      $('.demtk-select-all').prop('checked',true);
    }else{
      $('.demtk-select-all').prop('checked',false);
    }
  });

 	$('#generate-invoice').click(function(e){
 		e.preventDefault();
 		$('[type="checkbox"]').addClass('checkbox-readonly');
 		$('#generate-invoice').attr('disabled', true);
 		$('#generate-invoice').html('<i class="fa fa-spinner fa-spin"></i>&nbsp; Generate');
 		$.ajax({
            type: 'POST',
            url: appHome+'/batch-invoice/generate', 
            dataType: "json",
            data: $('#summary-invoice').serialize(),
            success: function(response){
              $('.summary-each-checkbox:checked').closest('.checkbox-parent').remove();
              $('#summary-response').html(response.summary_msg);

              $('.demtk-each-checkbox:checked').closest('.checkbox-parent').remove();
              $('#demtk-response').html(response.demtk_msg);
              resetallItems();
            },
            error: function(response){
              $('html, body').animate({ scrollTop: 0 }, 400);
              $('form').find('#response').empty().prepend(alert_error).fadeIn();
              resetallItems();
            }
          });
 	});

 	function resetallItems(){
 		$('.checkbox-readonly').removeClass('checkbox-readonly');
 		$('#generate-invoice').attr('disabled', false);
 		$('#generate-invoice').html('<span class="glyphicon glyphicon-ok-sign"></span>&nbsp; Generate');
 	}

 	$(document).on('click', '.checkbox-readonly', function(e) {
        e.preventDefault();
    });
});