var qssheFileListingFun = "";
var showQssheEmailRec = "";
var qsshemailMsg = "";

$(document).ready(function(){

    if($('.more').length > 0){
      showCommentMoreLessCommon(20);
    }

  if($('#event_invest_expung').val() == '1'){
     resetItems('disable');
  }

  $(document).on('click', '.date-p', function(e) {
    $('.datepicker-close-out').datepicker('show');
  });

  $(document).on('click', '.input-group-addon', function(e) {
    $(this).parent().find('.datepicker').trigger('focus');
  });

  function updateClaim(ins_value){
    
    $.ajax({
        type: 'POST', 
        url: appHome+'/qsshe/common_ajax',
        data: {
          'action_type' : 'update_insurance',
          'ins_value' : ins_value,
          'qsshe_id' : $('#hidden-qsshe-id').val()
        },
        success: function(response){},
        error: function(response){}
    });
  }

  $(document).on('click', '#insurance-claim', function(e) {
    var ins_value = ($(this).is(':checked')) ? 1 : 0;
    if(ins_value){
      BootstrapDialog.confirm('Letter of Reservation is required, please create it after the updation. Are you sure you want to Tick?', function(result) {
        if(!result){
          $('#insurance-claim').attr('checked', false);
          $("#lor").hide();
        }else{
          $("#lor").show();
        }
      }); 
    }else{
      $("#lor").hide();
    }
  });

  

  if($('.qsshe-doc-popup').length > 0){
    $('.qsshe-doc-popup').popover({ trigger: "hover" });
  }

$(document).on('click', '.update-qsshe-btn', function(e) {
    $('.highlight').removeClass('highlight');
    $('.highlight-custome').removeClass('highlight-custome');
    $('.req-letter-doc-link').css('color', '#428bca');
    e.preventDefault();
    
    var success = [];
    //success.push( commonHighlight($('#dept-investigate'), '') );
    //success.push( commonHighlight($('#event-type'), '') );
    

    if($('#other-eta-type').is(':checked')){
      success.push( commonHighlight($('#other-type-textbox'), '') );
    }else{
      success.push( commonHighlight($('#eventype-what'), '') );
      success.push( commonHighlight($('#eventype-who'), '') );
      success.push( commonHighlight($('#eventype-mode'), '') );
      success.push( commonHighlight($('#eventype-order'), '') );
      success.push( commonHighlight($('#eventype-when'), '') );
      success.push( commonHighlight($('#eventype-complaint'), '') );
      success.push( commonHighlight($('#eventype-why'), '') );
    }
    function highlightmulti(field, empty_value){
      if(field.length > 0){
          if(field.val() === empty_value || field.val() === null){
            $(field).parent().addClass('highlight-custome');
              success.push(false);
          } else {
               $(field).parent().removeClass('highlight-custome');
                success.push(true);
          }
      }
     }
    highlightmulti($('#dept-investigate'), '');

    if($('#qsshe-capa-issued').val() == 'Yes'){
      success.push( commonHighlight($('#qsshe-capa-issued-date'), '') );
    }
     if($('#qsshe-ncr-issued').val() == 'Yes'){
      success.push( commonHighlight($('#qsshe-ncr-issued-date'), '') );
    }
    //success.push( commonHighlight($('#event-type2'), '') );
    //success.push( commonHighlight($('#qsshe-closed-by'), '') );

    if( isValidationSuccess(success, alert_required) === true ){ //success

      $(this).attr('disabled', true);
      var qssheId = $('#hidden-qsshe-id').val();
      $.ajax({
        type: 'POST',
        url: appHome+'/qsshe/'+qssheId+'/update',
        data: $("#qsshe-form").serialize().replace(/%5B%5D/g, '[]'),
        success: function(response){

          var ret = $('#returnpath').val();
          if(ret == ""){
            ret = appHome+'/qsshe/index';
          }
          window.location.href = ret;
          localStorage.setItem('response', response);
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
      });
      
    }

});


$(document).on('change', '#qsshe-date-close-out', function(e) {
  
  var start = $('#hidden-created-at').val(); //yyyy-mm-dd
  var end = $('#qsshe-date-close-out').val(); // dd/mm/yyyy
  var days = 0;

  if(start != "" && end != ""){

      var endArr = end.split("/");
      var endf = endArr[2]+'-'+endArr[1]+'-'+endArr[0];

      start = new Date(start);
      end = new Date(endf);

      diff  = new Date(end - start),
      days  = diff/1000/60/60/24;
  }
  $('#qsshe-days-to-close').val(days);
});


$(document).on('click', '.delete-qsshe', function(e) {
    var id = $(this).data('qssheid');

    BootstrapDialog.show({
         type: BootstrapDialog.TYPE_DANGER,
             title: 'Warning',
             message: 'Are you sure you want to delete?',
             buttons: [{
                     label: 'No',
                     action: function(dialogItself){
                         dialogItself.close();
                     }
                   },{
                   label: 'Yes',
                   cssClass: 'btn-danger',
                   action: function(dialogItself){
                             var $button = this; // 'this' here is a jQuery object that wrapping the <button> DOM element.
                             $button.disable();
                             $button.spin();
                             dialogItself.setClosable(false);
                            $.ajax({
                                type: 'POST', 
                                url: appHome+'/qsshe/common_ajax',
                                data: {
                                  'action_type' : 'delete_qsshe',
                                  'id' : id,
                                },
                                beforeSend: function(dialogItself) {
                                 
                                },  
                                success: function(response){
                                  localStorage.setItem('response', response);
                                  location.reload();
                                },
                                error: function(response){
                                  BootstrapDialog.show({title: 'Failed to Delete', message : 'Failed to Delete . Try again later.'});
                                }
                            });
                   }
           }]
         });


});

$(document).on('change', '.qsshe-eventtype', function(e) {
  var id = $(this).attr('id');
  $('#'+id+'-val').val($(this).val());
  getQssheRepeatIssue();
});

$(document).on('change', '#qsshe-capa-issued', function(e) {

    $('#qsshe-capa-issued-date').val('');
    if($(this).val() == 'Yes'){
      $('.qsshe-capa-date-class').removeClass('hidden');
    }else{
      $('.qsshe-capa-date-class').addClass('hidden');
    }
});

$(document).on('change', '#qsshe-ncr-issued', function(e) {

    $('#qsshe-ncr-issued-date').val('');
    if($(this).val() == 'Yes'){
      $('.qsshe-ncr-date-class').removeClass('hidden');
    }else{
      $('.qsshe-ncr-date-class').addClass('hidden');
    }
});


    

      $(document).on('click', '.sortClass', function(e) {
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
          $('#qsshe-filter-form').submit();
        }
      });

      //changes related to sorting
      if($('#sort').length > 0 && $('#sort').val() != ''){
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
        /*$('html, body').animate({
              'scrollTop' : $("#doublescroll").position().top
          });*/
      }

      $(document).on('change', '#qsshe-customer-contact', function(e) {
        if(!isEmail($(this)) && $(this).val().trim() != ""){

          BootstrapDialog.show({title: 'Error', message : 'Invalid Email Address.',
             buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',  
          });
          $(this).val($(this).attr('data-exisitngvalue'));
          $(this).select();
        }
      });

      function isEmail(email) {
        var regex = btl_email_regex;
        var emailaddress = email.val().trim();
        var t = regex.test(emailaddress);
        if(t){
          return true;
        }else{
          return false;
        }
      }

      qssheFileListingFun = function(){
            $.ajax({
                type: "POST",
                cache: false,
                url: appHome+'/qsshe/common_ajax',
                dataType: "text",
                data: ({
                  'action_type':'job_file_list',
                  'qsshe_id': $('#hidden-qsshe-id').val()
                }), 
                success: function(result)
                { 
                  $("#files_btn_div_list").html(result);
                  $("#form-btn-colorbox").colorbox({href: function(){
                    var url = $(this).parents('form').data('target');
                    var ser = $(this).parents('form').serialize();
                    return url+'?'+ser;
                  }, width:'80%', height:"90%", iframe:true});
                  $('a.colorbox').colorbox({iframe:true, width:'80%', height:'90%'});
                }  
          });
      }

      qsshemailMsg = function(msgType){
        if(msgType == 'success'){
          $('.qsshe-doc-msg').html(alertMsgDiv('Email Send Successfully.',msgType));
        }else{
          $('.qsshe-doc-msg').html(alertMsgDiv(' Failed to send email.', msgType));
        }
      };

      showQssheEmailRec = function ($showlastMailRec) {
          
          var $qssheId = $("#hidden-qsshe-id").val() ;
          var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
          var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';

          $("#emailrec_btn_div").html(ajaxLoader);

          $.ajax({
            type: "POST",
            cache: false,
            url: appHome+'/qsshe/common_ajax',
            dataType: "text",
            data: ({
              'action_type':'email_record',
              'qssheId': $qssheId
            }), 
            success: function(result)
            { 
              $("#emailrec_btn_div").html(result);
              $('a.colorbox').colorbox({iframe:true, width:'80%', height:'90%'});

              if($showlastMailRec == 1){
                $('#form-email-feedback').hide().html('<p class="alert alert-success">Mailed Successfully!!!</p>').fadeIn();
                $('#form-email-feedback').delay(3000).slideUp();
                
                $("#emailrec_btn_div .table tr:nth-last-child(1)").css("background-color", "#dff0d8");  
                
                setTimeout(function () {
                  $("#emailrec_btn_div .table tr:nth-last-child(1)").css("background-color", "#fff");
                  }, 3000);
                
                $('html, body').animate({scrollTop: $("#form-email-feedback").offset().top - 150 }, 200);
              }
            }  
          });

      }

  if($("#page-type").length > 0 && $("#page-type").val() == 'qsshe-edit'){
      
      qssheFileListingFun();
      showQssheEmailRec();
      $(".datepicker-close-out").datepicker({
          minDate: new Date($('#hidden-created-at').val()),
          dateFormat: btl_default_date_format,
          changeMonth: true,
          changeYear: true,
          inline: true,
    });
  }

  $(document).on('click', '.word-doc-btn', function(e) {
        e.preventDefault();
        $('#download-type').val($(this).val());
        if($(this).val() == 'create' || $(this).val() == 'save'){
          $(this).html('<i class="fa fa-spinner fa-spin"></i>&nbsp;'+$(this).text());
          $('.word-doc-btn').attr('disabled',true);
        }
        $('#qsshe-word-form').submit();
  })


    $(document).on('click', '.showmore_new', function(e) {
      e.preventDefault();
      $(this).find('.fa').toggleClass('fa-plus-circle fa-minus-circle')
    });

    //Show more of file list
    $('.showmore_mail_info').live('click', function(e) {
      e.preventDefault();
      var elemid = '#'+$(this).data('id');
      var elem = $(this);   
      $(elemid).toggle("", function () {
        $(elemid).is(":hidden") ? $(elem).html('Show <i class="fa fa-plus"><i>') : $(elem).html('Hide <i class="fa fa-minus"><i>');
      });
    });


    $(document).on('click', '.delete-qsshe-row', function(e) {
      var pageName = $('#page_name').val(); 
      e.preventDefault();
      var id = $(this).data('id');
      var parent = $(this).parent().parent();
      var action = $(this).data('action');
      var current = $(this);

      BootstrapDialog.confirm('Are you sure you want to delete the row with ID '+id+'? This cannot be undone', function(result) {
    
          if(result){
            $.ajax({  
              type: "POST",  
              url: appHome + '/qsshe/common_ajax',  
              dataType: "text",
              data: "action_type="+action+"&id="+id,
              beforeSend: function() {
                $(parent).find("td").css({ 'color': '#fff','background-color': '#cc0000' })
              },  
              success: function(result1){ 
                if(result1 == 1) {
                    $(parent).fadeOut(1000, function() { 
                      parent.remove(); 
                      if($('.qsshe-doc-tr').length == 0){ $('.qsshe-doc-last-tr').remove(); }
                    });
                } else {
                  $(parent).find("td").css({ 'color': '', 'background-color': ''  })
                }
              }  
            });
          }
         });

    });

    
    $(document).on('click', '#other-eta-type', function(e) {
      if($(this).is(':checked')){
        $('#other-type-textbox').attr('readonly',false);
      }else{
        $('#other-type-textbox').val('');
        $('#other-type-textbox').attr('readonly',true);
      }
    });

     $(document).on('click', '.add-outstanding', function(e) {
      e.preventDefault();
      var lastnameCount = parseInt($('.outstanding-actions-div:last').attr('data-count')) + 1;
      if($('.outstanding-actions-div').length > 200){
        BootstrapDialog.show({title: 'Warning', message : 'Exceeds maximum length. Please contact your System Administrator'});
        return false;
      }else{

        $(this).parents('.outstanding-actions-div').clone().insertAfter(".outstanding-actions-div:last");
        $(this).hide();

        $('.outstanding-actions-div:last').attr('data-count', lastnameCount);

        $('.outstanding-action:last').attr('name','alloutstanding['+lastnameCount+'][outstanding-action]');
        $('.responsible-party:last').attr('name','alloutstanding['+lastnameCount+'][responsible-party]');
        $('.outstanding-close-date:last').attr('name','alloutstanding['+lastnameCount+'][outstanding-close-date]');
        $('.due-by:last').attr('name','alloutstanding['+lastnameCount+'][due-by]');
        $('.note-status:last').attr('name','alloutstanding['+lastnameCount+'][note-status]');

        $('.outstanding-due-date:last').attr('id','outstanding-due-'+lastnameCount);
        $('.outstanding-close-date:last').attr('id','outstanding-close-'+lastnameCount);

        $('#outstanding-due-'+lastnameCount+',#outstanding-close-'+lastnameCount).removeClass('hasDatepicker').datepicker({
                                                                            dateFormat: btl_default_date_format,
                                                                            changeMonth: true,
                                                                            changeYear: true,
                                                                            inline: true,
                                                                      });

        $('.outstanding-action:last,.responsible-party:last,.due-by:last,.outstanding-close-date:last,.note-status:last').val('');
        $(".outstanding-inc-capa:last").prop('checked', false); 
      }
     });

     $(document).on('click', '.remove-outstanding', function(e) {
      e.preventDefault();
      if($('.outstanding-actions-div').length > 1){

        var curId = $(this).parents('.outstanding-actions-div').find('.alloutstanding-id').val();
        $('#alloutstanding-del-id').val( $('#alloutstanding-del-id').val()+','+curId );
        $(this).parents('.outstanding-actions-div').remove();
        $('.add-outstanding:last').show();
      }

     });

     $(document).on('click', '.add-eventtimeline', function(e) {
      e.preventDefault();
      var lastnameCount = parseInt($('.eventtimeline-actions-div:last').attr('data-count')) + 1;
      //if($('.eventtimeline-actions-div').length > 200){
      //  BootstrapDialog.show({title: 'Warning', message : 'Exceeds maximum length. Please contact your System Administrator'});
      //  return false;
      //}else{

        $(this).parents('.eventtimeline-actions-div').clone().insertAfter(".eventtimeline-actions-div:last");
        $(this).hide();

        $('.eventtimeline-actions-div:last').attr('data-count', lastnameCount);

        $('.insurance-claim:last').attr('name','eventtimeline['+lastnameCount+'][insurance-claim]');

        $('.eventlog-date:last').attr('name','eventtimeline['+lastnameCount+'][eventlog-date]');
        $('.eventlog-date:last').attr('id','eventlog-date-'+lastnameCount);

        $('#eventlog-date-'+lastnameCount).removeClass('hasDatepicker').datepicker({
                                                                            dateFormat: btl_default_date_format,
                                                                            changeMonth: true,
                                                                            changeYear: true,
                                                                            inline: true,
                                                                      });

        $('.eventlog-event:last').attr('name','eventtimeline['+lastnameCount+'][eventlog-event]');
        $('.eventlog-details:last').attr('name','eventtimeline['+lastnameCount+'][eventlog-details]');
        $('.eventtimeline-id:last').attr('name','eventtimeline['+lastnameCount+'][id]');
        $('.eventtimeline-id:last').val(0);

        $('.eventlog-date:last,.eventlog-event:last,.eventlog-details:last').val('');
        $(".insurance-claim:last").prop('checked', false); 

     // }
     });

     $(document).on('click', '.remove-eventtimeline', function(e) {
      e.preventDefault();
      if($('.eventtimeline-actions-div').length > 1){
        var curId = $(this).parents('.eventtimeline-actions-div').find('.eventtimeline-id').val();
        $('#eventtimeline-del-id').val( $('#eventtimeline-del-id').val()+','+curId );
        $(this).parents('.eventtimeline-actions-div').remove();
        $('.add-eventtimeline:last').show();
      }

     });

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
       if(checked === false && element.parent().val() == null ){
         element.parent().val('');
         element.parent().multiselect('refresh');
       }
    }
      });
      $('.tmp-input-ctrl').remove();//This control is for not showing old select box
    }

    

    $(document).on('change', '#event_invest_expung', function(e) {
      if($(this).is(':checked')){
        BootstrapDialog.confirm('Are you sure you want to apply this?', function(result) {
          if(result){
              resetItems('disable');
              $('#is-reset-apply').val(1);
              $("#event_invest_expung").prop('checked', true);
              $("#event_invest_expung").val(1);
          }else{
              $("#event_invest_expung").prop('checked', false);
          }
        });
      }else{
        resetItems('enable');
        $('#is-reset-apply').val(0);
      }
    });

    function resetItems(type){

      if(type == 'enable'){
        $('.reset-expung').css('pointer-events', 'auto');
        $('.reset-expung').css('color', '#333');
        document.onkeydown = function (e) {e.stopPropagation();}
      }else{
        $('.reset-expung').css('pointer-events', 'none');
        $('.reset-expung').css('color', '#aba6a6');
        document.onkeydown = function (e) { e.preventDefault();   }
      }
      
      /*$('input[type=text]:not(.not-reset)').val('');
      $("input:checkbox:not(.not-reset)").prop('checked', false); 
      $("select:not(.not-reset)").val(''); 
      $("textarea:not(.not-reset)").val(''); 
      $(".multi-sel-ctrl").multiselect('refresh');
      $('.chosen').chosen().trigger("chosen:updated");

      $( ".eventtimeline-actions-div" ).not(':first').each(function( index ) {
          var id = $(this).find('.eventtimeline-id').val();
          $('#eventtimeline-del-id').val( $('#eventtimeline-del-id').val()+','+id );
          $(this).remove();
      });
      $('.add-eventtimeline').show();*/
    }

    $('#customer_group_qsshe').change(function(e){
      $("#cust_code").val("");
      $("#cust_code").multiselect("refresh");
  
      if($(this).val() == ""){
        $("#cust_code").multiselect('enable');
      } else {
        $("#cust_code").multiselect('disable');
      }
    });

    if($('#page_type').val() == 'qsshe_list' && $('#customer_group_qsshe').val() != ""){
      $("#cust_code").multiselect('disable');
    }
  
});
 /**-------------------------------------fileupload start ------*/
function uploadFile() {
      $('#feedback').hide();
      var fd = new FormData();
      fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
      fd.append("filename", document.getElementById('fileName').value);
      fd.append("fileDesc", document.getElementById('fileDesc').value);
      fd.append("hidden-qsshe-id", document.getElementById('hidden-qsshe-id').value);
      fd.append("hidden-qsshe-number", document.getElementById('hidden-qsshe-number').value);
      fd.append("include-doc-capa", ( ($('#include-doc-capa').is(':checked')) ? 1 : 0) );
      fd.append("action_type", 'qsshe-file-upload');
      //fd.append("method", document.getElementById('form_type').value);
      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", uploadProgress, false);
      xhr.addEventListener("load", uploadComplete, false);
      xhr.addEventListener("error", uploadFailed, false);
      xhr.addEventListener("abort", uploadCanceled, false);
      xhr.open("POST", appHome + '/qsshe/common_ajax');
      xhr.send(fd);
      resetUploadBar();
    }

    function uploadProgress(evt) {

      $('.upload-qsshe-files').attr('disabled',true);
      $('.upload-qsshe-files').html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Upload');
      var percentComplete = Math.round(evt.loaded * 100 / evt.total);
      $('#progressJobPage').show();
      $('#job-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
      $('#job-progress-bar').css('width',percentComplete.toString()+ '%');
      $('#job-progress-bar').data('aria-valuenow',percentComplete.toString());
      $('#job-progress-bar').html(percentComplete.toString() + '%');
    }

    function resetUploadBar(){

      $('#progressJobPage').hide();
      $('#job-progress-bar').css('width','0%');
      $('#job-progress-bar').data('aria-valuenow','0');
      $('#job-progress-bar').data('aria-valuemax','0');
      $('#job-progress-bar').html('0%');
      $('#fileSize,#fileType').html('');
      $('.upload-qsshe-files').attr('disabled',false);
      $('.upload-qsshe-files').html('Upload');
      $('#fileToUpload,#fileName,#fileDesc').val('');
      $('#include-doc-capa').attr('checked', false);
    }

    function uploadComplete(evt) {
      /* This event is raised when the server sends back a response */
      //alert(evt.target.responseText);
      $('#feedback').html(evt.target.responseText).fadeIn();
      $('#feedback').delay(3000).slideUp();
      //If success show uploaded files list
      if((evt.target.responseText).indexOf("alert-success") > 0){
         qssheFileListingFun();
         resetUploadBar();
      }else{
        $('#job-progress-bar').removeClass('progress-bar-success').addClass('progress-bar-danger');
        setTimeout(function(){ resetUploadBar(); }, 2000);
      }
    }

    function uploadFailed(evt) {
      alert("There was an error attempting to upload the file.");
    }

    function uploadCanceled(evt) {
      alert("The upload has been canceled by the user or the browser dropped the connection.");
    }

    /*
  File upload JS
*/
function fileSelected() {
  var file = document.getElementById('fileToUpload').files[0];
  if (file) {
    var fileSize = 0;
    if (file.size > 1024 * 1024)
    fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
    else
    fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
  
    var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
    document.getElementById('fileName').value = fname;
    document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
    document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
    $('.upload-qsshe-files').attr('disabled', false);
  }
}


$(document).on('click', '.is-capa-include', function(e) {
    var curr = $(this);

    var cur_status = ( curr.is(':checked') ) ? 1 : 0;
    var value = curr.val();
    var value_s = ( curr.is(':checked') ) ? false : true;
    BootstrapDialog.confirm('Are you sure you want to apply this?', function(result) {
      if(result){
          $.ajax({
              type: 'POST', 
              url: appHome+'/qsshe/common_ajax',
              data: {
                'action_type' : 'change_file_status',
                'cur_status' : cur_status,
                'file_id' : value
              },
              success: function(response){
                $('.qsshe-doc-msg').html(response);
              },
              error: function(response){
                BootstrapDialog.show({title: 'Failed to Update', message : 'Failed to Update . Try again later.'});
              }
          });
      }else{
          curr.attr('checked', value_s);
      }
    });
});

  function getQssheRepeatIssue(){
    var evt_what = $('#eventype-what').val().trim();
    var evt_who = $('#eventype-who').val().trim();
    var evt_mode = $('#eventype-mode').val().trim();
    var evt_order = $('#eventype-order').val().trim();
    var evt_when = $('#eventype-when').val().trim();
    var evt_complaint = $('#eventype-complaint').val().trim();
    var evt_why = $('#eventype-why').val().trim();
    var qsshe_id = $('#hidden-qsshe-id').val();

    if( evt_what != "" && 
        evt_who != "" && 
        evt_mode != "" && 
        evt_order  != "" && 
        evt_when  != "" && 
        evt_complaint  != "" && 
        evt_why  != ""){

        $.ajax({
                type: 'POST', 
                url: appHome+'/qsshe/common_ajax',
                dataType: 'json',
                data: {
                  'action_type' : 'check_ECTA_avaliable',
                  'evt_what' : evt_what,
                  'evt_who' : evt_who,
                  'evt_mode' : evt_mode,
                  'evt_order' : evt_order,
                  'evt_when' : evt_when,
                  'evt_complaint' : evt_complaint,
                  'evt_why' : evt_why,
                  'qsshe_id' : qsshe_id
                },
                success: function(response){
                  if(response.ret_type != ""){
                    $('#qsshe-is-type-repeat').val('Yes');
                    $('#qsshe-is-supplier-repeat').val('Yes').trigger("chosen:updated");
                    $('#qsshe-pre-id-repeat').val(response.ret_type);
                  }else{
                    $('#qsshe-is-type-repeat').val('No');
                    $('#qsshe-is-supplier-repeat').val('No').trigger("chosen:updated");
                    $('#qsshe-pre-id-repeat').val('');
                  }
                  
                },
                error: function(response){}
        });


    }else{
      $('#qsshe-is-type-repeat').val('No');
      $('#qsshe-is-supplier-repeat').val('No').trigger("chosen:updated");
      $('#qsshe-pre-id-repeat').val('');
    }

  }

$(document).on('change', '#qsshe-mostused-ecta', function(e) {
  var items = $(this).val();
  if(items != ""){
      items = items.split('-');
      $('#eventype-what').val(items[0]).trigger("chosen:updated");
      $('#eventype-who').val(items[1]).trigger("chosen:updated");
      $('#eventype-mode').val(items[2]).trigger("chosen:updated");
      $('#eventype-order').val(items[3]).trigger("chosen:updated");
      $('#eventype-when').val(items[4]).trigger("chosen:updated");
      $('#eventype-complaint').val(items[5]).trigger("chosen:updated");
      $('#eventype-why').val(items[6]).trigger("chosen:updated");
  }else{
      $('#eventype-what,#eventype-who,#eventype-mode,#eventype-order,#eventype-when,#eventype-complaint,#eventype-why').val('').trigger("chosen:updated");
  }
  $( ".qsshe-eventtype" ).each(function( index ) {
      var id = $(this).attr('id');
      $('#'+id+'-val').val($(this).val());
  });
  getQssheRepeatIssue();
});

$(function() {
	if($("#drag_and_drop_on").val()){
			Dropzone.autoDiscover = false;
			//Dropzone class
			var myDropzone = new Dropzone("body", {
				url: "#",
				// acceptedFiles: "image/*,application/pdf",
				maxFiles : 1, 
				previewsContainer: "#file-upload-panel",
				disablePreviews: true,
				autoProcessQueue: false,
				uploadMultiple: false,
				clickable: false,
				init : function() {
		
					myDropzone = this;
			
					//Restore initial message when queue has been completed
					this.on("drop", function(event) {
            if(event.dataTransfer.files.length > 0){
              fileInput = document.getElementById("fileToUpload"); 
              fileInput.files = event.dataTransfer.files;
              document.getElementById("file-upload-panel").scrollIntoView();
              $("#file-upload-panel").css("background-color", "#bdbdbd");
              setTimeout(() => {
                $("#file-upload-panel").css("background-color", "unset");
              }, 800);
              fileSelected();
              setTimeout(() => {
                // uploadFile(); to automatic upload
                myDropzone.removeAllFiles( true );
              }, 200);
            }
		
		
					});
			
				}
			});
		}
});


