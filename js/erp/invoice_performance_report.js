$(document).ready(function(){

     var customerElement = $('#cust-code').attr('id');
     $('.filter-results').click(function(e){
      e.preventDefault();
      var form = '#'+$(this).closest('form').attr('id'),
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

      highlight($(form).find('#date_from'), '');
      highlight($(form).find('#date_to'), '');

      var check_fields = (success.indexOf(false) > -1);
        if(check_fields === true){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_required).fadeIn();
          } else {
              $('.full_loadrow').show();
              $('.count-table').hide();
              $("form").submit();
          }
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
    });