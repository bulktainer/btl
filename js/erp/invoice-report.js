var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
var alert_success = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i><span class="message-export"></span></div>';
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
$(document).ready(function(){
  if($(".multi-sel-ctrl").length != 0){
    $(".multi-sel-ctrl").multiselect({
      enableCaseInsensitiveFiltering: true,
      enableFiltering: true,
      maxHeight: 200,
      buttonWidth: '100%',
      onChange: function(element, checked) {
        
        if (checked === true && element.val() != '') {
          if($(this.$select).attr('id') == 'fromtown-filter'){
            $('#fromtown-part-filter').val('');
          }else if($(this.$select).attr('id') == 'totown-filter'){
            $('#totown-part-filter').val('');
          }
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
  $('.tmp-input-ctrl').remove();
});

// /*Get tank plan details */
$(document).on('click', '#invoice_report_search', function(){ 
  var form = '#'+$(this).closest('form').attr('id');
  $('#page').val(1);
  $('#response').empty();
  getInvoiceReport(form);
});

$(document).on('click', '.btn_more', function(){ 
  var page = $('#page').val();
  page = parseInt(page) + 1;
  $('#page').val(page);
  var form = '#invoice-report-form';
  $('#response').empty();
  var button = $('.btn_more');
  button.find('span').addClass("fa fa-spinner fa-spin");
  button.attr('disabled','disabled');
  getInvoiceReport(form, true);
});

function addParserSort(){
  $.tablesorter.addParser({ 
      // set a unique id 
      id: 'comments', 
      is: function(s) { 
        // return false so this parser is not auto detected 
        return false; 
      }, 
      format: function(s, table, cell, cellIndex) { 
        // get data attributes from $(cell).attr('data-something');
        // check specific column using cellIndex
        var data = $(cell).attr('data-comments');
        if(data != undefined && data != ''){
          return $(cell).attr('data-comments');
        }
        else{
          data = '';
          return data;
        }
      }, 
      // set type, either numeric or text 
      type: 'text' 
  });
}

function initializeSorter(){
  $(".tablesorter").tablesorter({
    cssHeader:'sortheader',
    cssAsc:'headerSortUp',
    cssDesc:'headerSortDown',
    dateFormat: "ddmmyyyy",
    headers: { 
      '.no-sort' : {
        sorter: false, parser: false
      },
      '.comments-sort' : { 
        sorter: 'comments'
      },
      '.actual-comments-sort' : {
        sorter: 'actual_comments'
      }
    }
  });
}

//Get invoice report
function getInvoiceReport(form, load_more=false){ 
  
  var h = $('.overlay-complete-loader').height();
  if(h == 0) { h = 100; }
  $('.btl_overlay').height(h);  
  $('.btl_relative').show();
  
  if(load_more == false){
      var button = $('#invoice_report_search');
  }
  else{
    var button = $('.btn_more');
  }
  button.find('span').addClass("fa fa-spinner fa-spin");
  button.attr('disabled','disabled');

  $.ajax({ 
        type: 'POST',
        url: appHome+'/invoice-report/common-ajax',
        data: $(form).serialize(),
        success: function(response){
          $('.btl_relative').hide();
          button.find('span').removeClass("fa fa-spinner fa-spin");
          button.removeAttr('disabled');
          if(load_more == false){
            $('#report-div').html(response);
            addParserSort();
            initializeSorter();
          }
          else{
            $('#invoice_report_table tbody tr:last').after(response);
            var count = $('.row_count').last().data('count');
            $('.record_length').text(count);
            $('.record_length_footer').text(count+' rows');
            var count_nxt = $('.rec_count').last().val();
            var page_size = $('#page_size').val();
            if(parseInt(count_nxt) < parseInt(page_size)){
              $('.view-list').remove();
            }
            initializeSorter();
            //Resort table
            var resort = true;
            $('.tablesorter').trigger("update", [resort]);
          }
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          button.removeAttr('disabled');
        }
    });
}