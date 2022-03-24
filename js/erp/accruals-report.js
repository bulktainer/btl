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

$(document).on('click', '.toggleall', function(){
  $('.invoice_list').prop('checked', this.checked);
  fillHiddenIdstoTextarea();
});
/*Get tank plan details */
$(document).on('click', '#accruals_search', function(){ 
	var form = '#'+$(this).closest('form').attr('id');
	$('#page').val(1);
	$('#response').empty();
	getAccrualsReport(form);
});


function getAccrualsReport(form){ 
	
	var h = $('.overlay-complete-loader').height();
	if(h == 0) { h = 100; }
	$('.btl_overlay').height(h);  
	$('.btl_relative').show();
	var button = $('#accruals_search');
	button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');
  var sendData = $(form).serialize();
  if(sendData.indexOf('&comment-text-') != -1){
      var serialized_data = $(form).serialize();
      var trimPos = serialized_data.indexOf('&comment-text-');
      sendData = serialized_data.substring(0,trimPos);
  }
  $('#btnMultiComments').attr('disabled',true);
  $('#btnExport').attr('disabled',true);
	$.ajax({ 
        type: 'POST',
        url: appHome+'/accruals/ajax-get-accruals-report',
        data: sendData,
        success: function(response){
        	// $('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
        	$('.btl_relative').hide();
        	$('#report-div').html(response);
        	button.find('span').removeClass("fa fa-spinner fa-spin");
         	button.removeAttr('disabled');
          $('#btnExport').removeAttr('disabled');
          setTableSorter();
          //$('.sortclass').css( 'cursor', 'pointer' );//
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
	var form = '#accruals-form';
	$('#response').empty();
	var button = $('.btn_more');
	button.find('span').addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');
	getAccrualsReportMoreData(form);
});


function getAccrualsReportMoreData(form){ 
	
	var h = $('.overlay-complete-loader').height();
	if(h == 0) { h = 100; }
	$('.btl_overlay').height(h);  
	$('.btl_relative').show();
	
	$.ajax({ 
        type: 'POST',
        url: appHome+'/accruals/ajax-get-accruals-report-more-data',
        data: $(form).serialize(),
        success: function(response){
        	$('.btn_more').find('span').removeClass("fa fa-spinner fa-spin");
        	$('.btl_relative').hide();
        	$('.remove-total').remove();
        	$('.view-list').remove();
        	$('#accruals_report_table tbody tr:last').after(response);
          var foot = '';
          $('#accruals_report_table tbody .info').each(function() {
             var css = $(this).attr('style');//$(this).css();
             var classAttr = $(this).attr('class');
             foot += '<tr  class="'+classAttr+'"style="'+css+'">' + $( this ).html() + '</tr>';
             $(this).remove();
          });
        	var count = $('.row_count').last().data('count');
        	$('.record_length').text(count);
          setTimeout(function(){
             var len = $('#remove_all:checked').length;
             if(len > 0){
                $('.single-remove').prop('checked',true);
             }
             $('#accruals_report_table tfoot').html(foot)
          },500)
          var resort = true;
          $('#accruals_report_table').trigger("update", [resort]);

        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
       	  button.removeAttr('disabled');
      	 
        }
    });
}

/*Get tank plan details */
$(document).on('click', '#accounts_search', function(){ 
  var form = '#'+$(this).closest('form').attr('id');
  $('#page').val(1);
  $('#response').empty();
  getAccountExportReport(form);
});

$(document).on('click', '.invoice_list', function(){ 
  fillHiddenIdstoTextarea();
  checkboxFun();
});

$(document).on('click', '.invoice-mail-check', function(){ 
  fillMailaccExportTextarea();
  checkboxFun();
});

$(document).on('click', 'input:checkbox[name=toggleall-email]', function(){ 
    $('.invoice-mail-check').prop('checked', this.checked);
    fillMailaccExportTextarea();
    checkboxFun();
});

$(document).on('click', '.btn-autosend-email', function(e){ 
    e.preventDefault();
    BootstrapDialog.confirm('Are you Sure want to send email?', function(result){
          if(result) {
              autosendMail();
          }
      });
});

function autosendMail(){

    $(".btn-autosend-email").attr('disabled', true);
    var btntext = $(".btn-autosend-email").text();
    $(".btn-autosend-email").html('<i class="fa fa-spinner fa-spin" style="font-size:14px"></i>&nbsp;' +btntext);
     $.ajax({ 
        type: 'POST',
        url: appHome+"/account-export/common-ajax",
        data: {
          'email-invoices': $('#textarea-invoice-mail').val(),
          'action_type': 'auto-send-email'
        },
        success: function(response){
          $('#page').val(1);
          $('#response').html(response);
          getAccountExportReport($('#account-form'));
          $(".btn-autosend-email").attr('disabled', false);
          $(".btn-autosend-email").html(btntext);
        },
        error: function(response){
          $(".btn-autosend-email").attr('disabled', false);
          $(".btn-autosend-email").html(btntext);
        }
    });
}


function fillHiddenIdstoTextarea(){
  var ids = "";
  $('.invoice_list:checked').each(function(){
    ids += $(this).attr('data-type')+'|'+$(this).val()+',';
  });
  $('#textarea-export-invoice').val( ids.slice(0, -1) );
  if($('.invoice_list:checked').length > 0){
    $('.csv-btns').attr('disabled', false);
  }else{
    $('.csv-btns').attr('disabled', true);
  }
}

function fillMailaccExportTextarea(){
  
  var ids = [];
  $('.invoice-mail-check:checked').each(function(){
    ids.push({invoice_no : $(this).val(), invoice_pdf : $(this).attr("data-value"),inv_type : $(this).attr("data-type"),customer_id:$(this).attr("data-custid") });
  });
  $('#textarea-invoice-mail').val(JSON.stringify(ids));
  if(ids.length > 0){
    $('.btn-email-invoices-new[data-type="email"],.btn-autosend-email').attr('disabled', false);
  }else{
    $('.btn-email-invoices-new[data-type="email"],.btn-autosend-email').attr('disabled', true);
  }
}

function checkboxFun(){
      if($(".checklist:checked").length > 0){
          $('.export-btns').removeAttr('disabled');
        }else{
          $('.export-btns').attr('disabled','disabled');
      }
      var acceptCount = $('.checklist:checked').length;
      var acceptTotal = $('.checklist').length;
      if(acceptCount == acceptTotal){
        $(':checkbox[name=toggleall]').prop('checked',true);
      }else{
        $(':checkbox[name=toggleall]').prop('checked',false);
      }

      var acceptCount1 = $('.invoice-mail-check:checked').length;
      var acceptTotal1 = $('.invoice-mail-check').length;
      if(acceptCount1 == acceptTotal1){
        $(':checkbox[name=toggleall-email]').prop('checked',true);
      }else{
        $(':checkbox[name=toggleall-email]').prop('checked',false);
      }
  }

function getAccountExportReport(form){ 
  var h = $('.overlay-complete-loader').height();
  if(h == 0) { h = 100; }
  $('.btl_overlay').height(h);  
  $('.btl_relative').show();
  var button = $('#accounts_search');
  button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
  button.attr('disabled','disabled');
  
  $.ajax({ 
        type: 'POST',
        url: appHome+'/account-export/ajax-get-account-export-report',
        data: $(form).serialize(),
        success: function(response){
          // $('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
          $('.btl_relative').hide();
          $('#report-div').html(response);
          button.find('span').removeClass("fa fa-spinner fa-spin");
          button.removeAttr('disabled');
          $('#export-type-hidden').val($('#export-type').val());
          fillHiddenIdstoTextarea();
          $('a.cboxElement').colorbox({iframe:true, width:'80%', height:'90%'});
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          button.find('span').removeClass().addClass("glyphicon glyphicon-filter");
          button.removeAttr('disabled');
         
        }
    });
}

$(document).on('click', '.btn_account_more', function(){ 
  var page = $('#page').val();
  page = parseInt(page) + 1;
  $('#page').val(page);
  $('#response').empty();
  var button = $('.btn_account_more');
  button.find('span').addClass("fa fa-spinner fa-spin");
  button.attr('disabled','disabled');
  getAccountExportReportData();
});


function getAccountExportReportData(){ 
  
  var h = $('.overlay-complete-loader').height();
  if(h == 0) { h = 100; }
  $('.btl_overlay').height(h);  
  $('.btl_relative').show();
  
  $.ajax({ 
        type: 'POST',
        url: appHome+'/account-export/ajax-get-account-export-report-data',
        data: $('#account-form').serialize(),
        success: function(response){
          $('.btn_account_more').find('span').removeClass("fa fa-spinner fa-spin");
          $('.btl_relative').hide();
          $('.view-list').remove();
          $('.tr-group').remove();
          $('#account_report_table  > tbody:last-child').append(response);
          var count = $('.row_count').last().data('count');
          $('.total-count').text(count);
          fillHiddenIdstoTextarea();
          $('a.cboxElement').colorbox({iframe:true, width:'80%', height:'90%'});
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          button.removeAttr('disabled');
         
        }
    });
}

$(document).on('click', '#export_selected', function(e){
  e.preventDefault();

  var type = $('#export-type').val();
  $.ajax({ 
        type: 'POST',
        url: appHome+'/account-export/ajax-mark-invoice-exported',
        data: {
          'invoices': $('#textarea-export-invoice').val(),
          'type': type
        },
        success: function(response){
          if(response != ""){

            $('.invoice_list:checked').each(function(){
              $('.chk_'+$(this).val()).closest('tr').remove();  
            });
            var count = $('.total-count').text();
            var length =  parseInt(count) - parseInt($('.invoice_list:checked').length);
            $('.total-count').text(length);
            var alert_message = '<div class="alert alert-success alert-dismissable">'+
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
            '<i class="fa fa-thumbs-o-up"></i>&nbsp;'+response+'</div>';
          }else{
            var alert_message = '<div class="alert alert-danger alert-dismissable">'+
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
            '<i class="fa fa-exclamation-triangle"></i>&nbsp;<strong>Uh oh!</strong> please select the invoices to exported.</div>'
          }
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('#response').empty().prepend(alert_message).fadeIn();
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          button.removeAttr('disabled');
         
        }
    });
});



$(document).on('click', '.btn-email-invoices-new', function(e){
  var type = $(this).attr('data-type');
  e.preventDefault();
  // if(type == 'email'){
  //   $('#form-new-checkbox-value').attr('action', appHome.replace('erp.php','')+'email-invoice.php');
  //   $('#form-new-checkbox-value').submit();
  // }else 
  if(type == 'export-csv'){
    $('#form-new-checkbox-value').attr('action', appHome+'/account-export/account-report-csv');
    $('#form-new-checkbox-value').submit();
  }
});



$(document).on('click', '.btn-email-invoices', function(){
  var invoices = [];
  var files = '';


  var returnPath = 'erp.php/account-export/account-report'
  var domain = appHome.split('erp');

  var i = 0;
  $('.invoices-selected:checked').each(function(){
    
    files = files + 'files%5B'+i+'%5D%5Binvoice_pdf%5D='+$(this).attr('data-pdf')+
    '&files%5B'+i+'%5D%5Binvoice_no%5D='+$(this).val()+'&';
    i = i+1;
  });
  var url = domain[0]+'email-invoice.php?returnpath='+returnPath+'&'+files;
  window.open(url, '_blank');
});

function validate(){
  
  var invoices = [];
  // var jcIds = [];
  $('.invoice_list:checked').each(function(){
    invoices.push($(this).val());
  });
  if(invoices.length > 0){
    return true;
  }
  else{
    var alert_message = '<div class="alert alert-danger alert-dismissable">'+
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
            '<i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong>  no valid invoices have been selected. Ensure that the selected invoices haven\'t already been exported.</div>'
    $('html, body').animate({ scrollTop: 0 }, 400);
    $('#response').empty().prepend(alert_message).fadeIn();
    return false;
  }
}

$(document).on('click', '#email-invoices', function(){ 

  var invoiceMail = $("#textarea-invoice-mail").val();
    $.ajax({ 
        type: 'POST',
        url: appHome+"/account-export/common-ajax",
        data: {
          'invoice_data': invoiceMail,
          'action_type': 'render_email_form'
        },
        success: function(response){
          $("#email_modal").modal('show');
          $("#email-invoice-form-view").html(response);
        },
        error: function(response){
         
        }
    });
});

$(document).on('click', '#send_email', function(){ 
    var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>'; 
    var form = "#form-email-invoice",success = [];
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
    highlight($(form).find('#to-email1'), '');
    highlight($(form).find('#subject-line'), '');
    highlight($(form).find('#to-name1'), '');
    var btl_email_regex = /^\w+([\.\+-]?\w+)+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,15}|[0-9]{1,3})(\]?)$/;
    function isEmail(email) {
        var regex = btl_email_regex;
        var t = regex.test(email.val());
        if(t){
          $(email).parent().removeClass('highlight');
          success.push(true);
        }else{
          var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please enter a valid email.</div>'; 
          $(email).parent().addClass('highlight');
          success.push(false);
          alert_required = alert_error;

        }
    }
    var email1 = $("#to-email1").val();
    var email2 = $("#to-email2").val();
    var email3 = $("#to-email3").val();
    if(email1.length>0){
      isEmail($('#to-email1'));
    }
    if(email2.length>0){
      isEmail($('#to-email2'));
    }
    if(email3.length>0){
      isEmail($('#to-email3'));
    }
    var check_fields = (success.indexOf(false) > -1);
    if(check_fields === true){
      $('#email_modal').animate({ scrollTop: 0 }, 400);
      $('form').find('#responsemodal').empty().prepend(alert_required).fadeIn();
    } else {
              var inv_url = appHome+'/account-export/send_email_inv';
              $.ajax({ 
                  type: 'POST',
                  url : inv_url,
                  data: $("#form-email-invoice").serialize().replace(/%5B%5D/g, '[]'),
                  beforeSend: function() {
                           $("#send_email").attr('disabled','disabled');
                          $("#send_email").find('i').removeClass("fa fa-arrow-right").addClass("fa fa-refresh fa-spin");
                  },
                  success: function(response){
                    $('#email_modal').modal('hide');
                    $("#send_email").removeAttr('disabled');
                    $("#send_email").find('i').removeClass("fa fa-refresh fa-spin").addClass("fa fa-arrow-right");
                    $('#page').val(1);
                    $('#response').html(response);
                    getAccountExportReport($('#account-form'));
                      $('html, body').animate({ scrollTop: 0 }, 400);
                  },
                  error: function(response){
                    var alert_error_occur = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong.</div>'; 
                    $('form').find('#responsemodal').empty().prepend(alert_error_occur).fadeIn();
                    $('html, body').animate({ scrollTop: 0 }, 400);
                  }
              });
    }
});
$(document).on("focus",".to-name",function(e) {
  $(".to-name").autocomplete({
    source: appHome + "/account-export/contact_list",
    minLength: 2,
    type: "GET",
    select: function (event, ui) {
        var item = ui.item;
          if(item) {
            var id = $(this).data('email');
            $(this).val(item.name);
            $("#"+id).val(item.email);
          }
        }
  });
});

$(document).on("click",".subject-selector",function(e) {
  e.preventDefault();
  var subject = $(this).data('subject');
  $('#subject-line').val(subject);
  $('.subject-selector').show();
  if($('.subject-selector').hasClass('hidden')){
    $(".subject-selector").removeClass("hidden");
  }
  $(this).fadeOut();
});

$('#email_modal').on('hidden.bs.modal', function () {
      $('#form-email-invoice')[0].reset();
      $("#send_email").find('i').removeClass("fa fa-refresh fa-spin").addClass("fa fa-arrow-right");
      $("#send_email").removeAttr('disabled');
});


$('#remove_all').live('click',function(){
    if (this.checked) {
         $('.single-remove').prop('checked',true);
    }
    else{   
        $('.single-remove').prop('checked',false);
    }
    manageMultipleRemoveBtn();

});
$('.single-remove').live('click',function(){
   manageMultipleRemoveBtn();
});
$('#remove_accurals').on('click',function(){
   var comment   = $('#multi_comment').val();
   var remove_id = $('#multi_ids').val();
   if(!comment || comment.trim() == ''){
      var html = '<div class="alert alert-danger alert-dismissable"> <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>Comment required</div>';
      $('#removal_response').html(html);
   }
   else{
     removeAccural(remove_id,comment) 
     $('#link-btn').click();
   }
});
function removeAccural(remove_id,comment){
      $.ajax({ 
            type: 'POST',
            url: appHome+"/account-export/common-ajax",
            data: {
              'comment':comment,
              'jc_id': remove_id,
              'action_type': 'remove_accurals'
            },
            success: function(response){
              if(response > 0){
                 $('#multi_comment').val('');
                 $('#removal_response').html('');
                 setTimeout(function() {
                  BootstrapDialog.show({type:BootstrapDialog.TYPE_SUCCESS,title: 'Success', message : 'Removed Accurals'});
                 }, 500);
                 setTimeout(function() {
                  $('.bootstrap-dialog-close-button .close').click();
                 }, 1700);

                 if(remove_id.indexOf('|') != -1){
                    var removedIds = remove_id.split('|');
                    for (var i = 0 ; i < removedIds.length; i++) {
                     var parent = $('#comment-'+removedIds[i]).parent();
                     $(parent).fadeOut(1000, function() {
                       $(this).remove();
                     });
                   }
                 }
                 else{
                    var parent = $('#comment-'+remove_id).parent();
                     $(parent).fadeOut(300, function() {
                       $(this).remove();
                     });
                 }
                 $('#accruals_search').click();
                 returnValue = true;
              }
            },
            error: function(response){
             returnValue = false;
            }
      });

}



$('#btnMultiComments').on('click',function(){
   var idArr = [];
   idArr = getAllSelectedAccrualIds();
   $('#multi_ids').val(idArr.join("|"));
});



function getAllSelectedAccrualIds(){
  var accrualIDs = [];
  $( ".single-remove:checked" ).each(function( index ) {
             accrualIDs.push($(this).data('id'));
             
  });
  return accrualIDs;
}

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

 function manageMultipleRemoveBtn(){
    var len = $(".single-remove:checked").length;
    if(len > 0){
       $('#btnMultiComments').removeAttr('disabled');
    }
    else{
      $('#btnMultiComments').attr('disabled', true);
    }
 }




 function setTableSorter(){
    $('#accruals_report_table').tablesorter({
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

$(document).on("click","#btnExport",function(e) {
  e.preventDefault();
  var form = '#'+$(this).closest('form').attr('id');
  var filters = $(form).serialize();
  var url = appHome+'/accruals/export-accrual?'+filters;
  window.location.href = url;
  //console.log(filters)
});
