$(document).ready(function(){
	$(document).on('click','.update_rate',function(e){
		e.preventDefault();
		$.ajax({
			type 	: 'POST',
			url		: appHome+'/exchange-rate/update',
	        data	: $('#exchange_rates').serialize().replace(/%5B%5D/g, '[]'),
	        success	: function(response){
	          window.location.href = $('#returnpath').val();
	          localStorage.setItem('response', response);
	        },
	        error	: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
		});
		
	});
    
});

/*Get exchange currency list through AJAX */
$(document).on('click', '#currency-filter-submit', function(){ 
	var form = '#'+$(this).closest('form').attr('id');
	$('#page').val(0);
	$('#response').empty();
	getCurrency(form);
});
//function to get Datas
function getCurrency(form){ 
	var h = $('.overlay-complete-loader').height();
	if(h == 0) { h = 100; }
	$('.btl_overlay').height(h);  
	$('.btl_relative').show();
	var button = $('#currency-filter-submit');
	button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');
 	
	$.ajax({ 
        type: 'GET',
        url: appHome+'/exchange-rate/ajax-get-currency-list',
        data: $(form).serialize(),
        success: function(response){
        	$('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
        	$('.btl_relative').hide();
        	$('.currency-list').html(response);
        	button.find('span').removeClass().addClass("glyphicon glyphicon-filter");
         	button.removeAttr('disabled');
         	if($('#page_name').val() == "exchangerate-update-index"){
         		$('#totalrecords').val($('#hd_totalrecords').val());
         	}

			if($('#exchangetable tr').length > 10){
				DoubleScroll(document.getElementById('doublescroll'));
			}
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          var alert_msg = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong!</div>';
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          button.find('span').removeClass().addClass("glyphicon glyphicon-filter");
       	  button.removeAttr('disabled');
      	 
        }
    });
}

//Pagination button
$(document).on('click', '.first-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getCurrency('#exchange-form');
});


//Pagination button
$(document).on('click', '.last-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getCurrency('#exchange-form');
});

//Pagination button
$(document).on('click', '.next-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getCurrency('#exchange-form');
});


//Pagination button
$(document).on('click', '.prev-page', function(){
	var pageNumber = $(this).data('pagenumber');
	$('#page').val(pageNumber);
	getCurrency('#exchange-form');
});

//Page size change
$(document).on('change', '.page-limit', function(){
	var pageSize = $(this).val();
	$('#pagesize').val(pageSize);
	getCurrency('#exchange-form');
});



$(document).on('keypress', '#exchange_password', function(){ 
  $('.response-msg').html('');
  $('.highlight').removeClass('highlight');
});


$(document).on('click', '.update-modal-btn', function(){ 

  $('#exchange_password').val('');
  $('.highlight').removeClass('highlight');
  $('.response-msg').html('');

  if($("input[name='exchg[]']:checked").length == 0){
    $('#exchange-password-btn').attr('disabled', true);
  }else{
    $('#exchange-password-btn').attr('disabled', false);
  }
});

$(document).on('click', '#exchange-password-btn', function(){ 

  $('.response-msg').html('');
  $('.highlight').removeClass('highlight');

  var exchange_password = $('#exchange_password').val();
    if(exchange_password != ""){
      $.ajax({
          type: 'POST',
          dataType: "json",
          url : appHome+'/exchange-rate/common_ajax',
          data: {
              'password'  : exchange_password,
              'action_type'    : 'check_password',
              },
          success: function(response){
            if(response.status == true){
              $('#confirm_exchange_model').modal('toggle');
              updateafterPassword(exchange_password);
            }else{
                $('.response-msg').html(response.msg);
                $('#exchange_password').val('');
                $('#exchange_password').parent().addClass('highlight');
            }
          },
          error: function(response){
          }
      });
    }else{
        $('#exchange_password').parent().addClass('highlight'); 
    }
    
});

//update the exchange rates for null values
function updateafterPassword(exchange_password){   
	//validation
	var n = $("input[name='exchg[]']:checked").length;    
        if(n == 0) {
        	$('html, body').animate({ scrollTop: 0 }, 400);
           	var alert_msg = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please select a checkbox!</div>';
		  	$('#response').empty().prepend(alert_msg).fadeIn();
		 	setTimeout(function() {
				$('.response-alert').empty();
		  	}, 3000);
			return false;
        } 
        else {
        	//declaration 
    		var exchangeDates  = [];
    		var rowCurrency    = []; 
   		 	var columnCurrency = []; 
    		var curr_id_base   = [];
    		//getting attributes from checkboxes
   			$("input[name='exchg[]']:checked").each(function(){
          		exchangeDates.push($(this).attr("ex-date"));
          		rowCurrency.push($(this).attr("row-value"));
          		columnCurrency.push($(this).attr("col-value"));
          		curr_id_base.push($(this).attr("base-id"));  
    		});
    		//Page Number 
    		var page = $("#page").val();
    		// get exchange API rate AJAX
    		columnCurrency = columnCurrency.map(a => a.toUpperCase());
    		getExchangeRates(exchangeDates,rowCurrency,columnCurrency,curr_id_base,page,exchange_password);
        }
}
//exchange rates 
function getExchangeRates(exchangeDates,rowCurrency,columnCurrency,curr_id_base,page,exchange_password){ 
	var h = $('.overlay-complete-loader').height();
	if(h == 0) { h = 100; }
	$('.btl_overlay').height(h);  
	$('.btl_relative').show();
	var button = $('#rate_update');
	button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');
 	
	$.ajax({ 
        type: 'POST',
        url : appHome+'/exchange-rate/ajax-get-rates',
        data: {
	        	'exchangeDates'  : exchangeDates,
	        	'rowCurrency'    : rowCurrency,
	        	'columnCurrency' : columnCurrency,
	        	'curr_id_base'   : curr_id_base,
            'password' : exchange_password	
	          },
        success: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
        	var form = '#exchange-form';
			$('#page').val(page);
			$('#response').html(response);
			getCurrency(form);
         	button.removeAttr('disabled');
         	button.find('span').removeClass("fa fa-spinner fa-spin");	
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          	var alert_msg = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong!</div>';
		  $('.response-alert').empty().prepend(alert_msg).fadeIn();
		  setTimeout(function() {
			$('.response-alert').empty();
		  }, 3000);
          $('form').find('#response').empty().prepend(alert_msg).fadeIn();
          button.find('span').removeClass().addClass("glyphicon glyphicon-filter");
       	  button.removeAttr('disabled');
      	 
        }
    });
}

//Double Scroll 
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

$(document).on('click', '.row_check', function(){
  checkExchangeRates();
});

$(document).on('click','#all_row', function(){
  if($('#all_row').is(':checked')){
      $('.row_check').attr('checked', true);
      checkExchangeRates();
    }
    else{
      $('.row_check').attr('checked', false);
      checkExchangeRates();
    }

});

function checkExchangeRates(){
  $('.row_check').each(function () {
    var value = $(this).attr('id');
    var row = value.split("_");
    if(row){
      if($(this).is(':checked')){
        $('.currency_'+row[1]).attr('checked', true);
      }
      else{
        $('.currency_'+row[1]).attr('checked', false);
      }
    }
  });
}

$(document).on('click', '.column_header', function(){
  var value = $(this).attr('id');
  var row = value.split("_");
  
  if(row){
    if($(this).is(':checked')){
      $('.column_'+row[1]).attr('checked', true);
    }
    else{
      $('.column_'+row[1]).attr('checked', false);
    }
  }
});
