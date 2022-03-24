var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';

// Get supplier report details
$(document).on('click', '#supplier_search', function(){ 
	var form = '#'+$(this).closest('form').attr('id');
	$('#page').val(1);
	$('#response').empty();
	getSupplierReport(form);
});


function getSupplierReport(form,load_more=false){ 
	
	var h = $('.overlay-complete-loader').height();
	if(h == 0) { h = 100; }
	$('.btl_overlay').height(h);  
	$('.btl_relative').show();
  if(load_more == false){
	  var button = $('#supplier_search');
  }
  else{
    var button = $('.btn_more');
  }
	button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');
 	
	$.ajax({ 
        type: 'POST',
        url: appHome+'/supplier-report/common-ajax',
        data: $(form).serialize(),
        success: function(response){
        	$('.btl_relative').hide();
          button.find('span').removeClass("fa fa-spinner fa-spin");
          button.removeAttr('disabled');
          if(load_more == false){
          	$('#report-div').html(response);
            initalizeTableSorter();
          }
          else{
            $('#supplier_report_table tbody tr:last').after(response);
            var count = $('.row_count').last().data('count');
            var job_cost = $('.total_cost').last().data('cost');
            var job_count = $('.job_count').last().data('job');
            $('.record_length').text(count);
            $('.tab-job-count').text(job_count);
            $('.tab-total-cost').text(job_cost);
            var count = $('#rec_count').val();
            var page_size = $('#page_size').val();
            if(parseInt(count) < parseInt(page_size)){
              $('.view-list').remove();
            }
            initalizeTableSorter();
            //Resort table
            var resort = true;
            $('.tablesorter').trigger("update", [resort]);
          }
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          button.find('span').removeClass().addClass("glyphicon glyphicon-filter");
       	  button.removeAttr('disabled');
      	 
        }
    });
}

$(document).on('click', '.btn_more', function(){ 
  var page = $('#page').val();
  page = parseInt(page) + 1;
  $('#page').val(page);
  $('#response').empty();
  var button = $('.btn_more');
  button.find('span').addClass("fa fa-spinner fa-spin");
  button.attr('disabled','disabled');
  var form = '#supplier_rate';
  $('.count-tr').remove();
  getSupplierReport(form, true);
});

function initalizeTableSorter(){
  //sorter
  $(".tablesorter").tablesorter({
      cssHeader:'sortheader',
      cssAsc:'headerSortUp',
      cssDesc:'headerSortDown',
      dateFormat: "yyyymmdd"
  });
}