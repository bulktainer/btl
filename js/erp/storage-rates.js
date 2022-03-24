var previous_valid_unditl_date = "";

(function() {
  localStorage.clear();

  var success = [],
      requiredFields = ['direction', 'address_id', 'town', 'supplier_id', 'equipment_type_id','equipment_status','curr_id','imo','free_days','from_date', 'to_date'],
      requiredDynamicFields = []; //['day_from[]','daily_rates[]','sur_day_from[]','sur_day_to[]','sur_price[]','sur_reason[]','lumps_apply_day[]','lumps_price[]','lumps_reason[]'],
      alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>',
      alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required & correct information below.</div>';

  $(window).load(function() {
    resizePane();// call to the function for recalculating the height of the tab pane
  });

  //The function for recalculating the height of the tab pane
  function resizePane(removedHeight = 0){
    var active = $('.tab-pane.active').height();
    var lumpsum_height = $('.lumpsum-div').height();
    if(removedHeight > 0){
      active -= removedHeight;
    }
    else{
      active += lumpsum_height/3;
    }
    
    $('.tab-content').css('height', active+'px');

  }

$(document).ready( function() {
     /*The below function recalculates the size of the alert div 
     and deducts that height from the tab pane 
     when that specific alert is removed*/
     $('.alert-dismissable .close').on('click', function(){
        var elementHeight = $(this).parent().height();
        resizePane(elementHeight);
     });
});

  function validateDynamicField(field) {
    field.each(function(){
        if($(this).val() === ''){
          $(this).parent().addClass('highlight');
          success.push(false);
        } else {
          $(this).parent().removeClass('highlight');
          success.push(true);
        }
    });
  }

  function validateField(field) {
    if(field.length){
      if(field.val() === ''){
        $(field).parent().addClass('highlight');
        success.push(false);
      } else {
        $(field).parent().removeClass('highlight');
        success.push(true);
      }
    }
  }

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

  function validate_date_fields()
  {
    var frm_dt = $('#from_date');
    var to_dt = $('#to_date');
    
    if(to_dt.val() != "" && frm_dt.val() != "") {
      var dt1 = Date_Check(frm_dt);
      var dt2 = Date_Check(to_dt);
      
      if(!dt1)
      {
        success.push(false);
        frm_dt.parent().next().text('Invalid Date.');
        frm_dt.parent().addClass('highlight');
      } else {
        frm_dt.parent().next().text('');
        frm_dt.parent().removeClass('highlight');
      }
      
      if(!dt2)
      {
        success.push(false);
        to_dt.parent().next().text('Invalid Date.');
        to_dt.parent().addClass('highlight');
      } else {
        to_dt.parent().next().text('');
        to_dt.parent().removeClass('highlight');
      }
      
      if(dt1 == true && dt2 == true)
      {
        if(!checkIsValidDateRange(frm_dt.val(),to_dt.val())) {
          success.push(false);
          to_dt.parent().next().text('To-date should be greater than From-date.');
          to_dt.parent().addClass('highlight');
        } else {
          to_dt.parent().next().text('');
          to_dt.parent().removeClass('highlight');
        }
      }
    }
  }

  function validateForm($button) {
    var $this = $button
        $form = $this.closest('form'),
        path = $this.attr('data-path'),
        returnPath = path + '/index?' + $('input[name="returnpath"]').val();

    success = [];

    var storagerate_id = $("#sr_id").val();
    var modality = $("#modality");
    

    //Required field validation
    for(var i = 0; i < requiredFields.length; i++) {
      var $field = $form.find('[name="'+requiredFields[i]+'"]');
      validateField($field);
    }

    //Modality muli select validatoin
    if(modality.val() == null){
        $(modality).next().addClass('mulit-highlight');
      success.push(false);
    } else {
      $(modality).next().removeClass('mulit-highlight');
      success.push(true);
    }

    //Dynamic colum validation
    for(var i = 0; i < requiredDynamicFields.length; i++) {
      var $field = $form.find('[name="'+requiredDynamicFields[i]+'"]');
      validateDynamicField($field);
    }

    //Daily rate Day to colum is not required
    var $field = $form.find('[name="day_to[]"]');
    $field.each(function(){
        $(this).parent().removeClass('highlight');
    });

    //Date validation
    validate_date_fields();
    success.push(checkDailyRateIsValid(true));
    success.push(checkLumpsumRateIsValid());
    success.push(checkSurchargeRateIsValid());
    
    var check_fields = (success.indexOf(false) > -1);
    
    /**
    * save supplier cost
    */
    if($this.hasClass('save-storage')){
      if(check_fields){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_required).fadeIn();
        $('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  
      } else {
		$('input[name="to_date"]').removeAttr("disabled"); //for passing this date to controller
        $.ajax({
          type: 'POST',
          url: path+'/add',
          data: $form.serialize(),
          success: function(response){
            window.location.href = returnPath;
            localStorage.setItem('response', response);
          },
          error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
            $('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  
          }
        });
      }
    }

    /**
    * update supplier cost
    */
    if($this.hasClass('update-storage')){
      if(check_fields){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_required).fadeIn();
        $('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  
      } else {
		$('input[name="to_date"]').removeAttr("disabled"); //for passing this date to controller
        $.ajax({
          type: 'POST',
          url: path+'/'+storagerate_id+'/edit',
          data: $form.serialize().replace(/%5B%5D/g, '[]'),
          success: function(response){
            window.location.href = returnPath;
            localStorage.setItem('response', response);
          },
          error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
            $('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  
          }
        });
      }
    }

  }

  // Deleting
  $('#storage-cost-list, #storage-form').on('click', '.delete-storage-rates', function(e) {
      e.preventDefault();
      var id = $(this).attr('data-id'),
          path = $(this).attr('data-path'),
          returnPath = path + '/index?' + $('input[name="returnpath"]').val();

      BootstrapDialog.confirm('Are you sure you want to delete this Storage Rate?', function(result){
        if(result) {
          $.ajax({
            type: 'POST',
            url: path+'/'+id+'/delete',
            data: $('form').serialize(),
            success: function(response){
              if($("#page-name").val() == "storage-listing"){
                storage_listing();
                $('html, body').animate({ scrollTop: 0 }, 400);
                $('#response').empty().prepend(response).fadeIn();
              } else {
                window.location.href = returnPath;
                localStorage.setItem('response', response);  
              }
              
            },
            error: function(response){
              $('html, body').animate({ scrollTop: 0 }, 400);
              $('form').find('#response').empty().prepend(alert_error).fadeIn();
            }
          });
        }
      });
  });


$('#curr_id').change(function() {
      var currency = $(this).val();
      var fa = $('.input-group-addon i.fa');
      var currency_name = $(this).find("option:selected").text().toUpperCase();

      $("#curr_name").val(currency_name);

      if (currency_having_symbols.indexOf(currency_name) >= 0) {
        $(fa).removeClass().addClass('fa fa-' + currency_name.toLowerCase() ).html("");
      }
      else {
        $(fa).removeClass().addClass('fa').html(currency_name);
      }
});

$('#curr_id').trigger('change');


$('.save-storage, .update-storage').on('click', function(e) {
     e.preventDefault();
     validateForm($(this));
     return false;
});


$('#storage-form').on('change', 'select#modality', function(e) {
    if($(this).val() != null){
      $(this).next().removeClass('mulit-highlight');
    }
});


$('#storage-form').on('change', 'select#address_id', function(e) {
  var $this = $(this),
      address_code = $this.find(':selected').text();

  $("#address_code").val(address_code);

  // fill business type and quote div
  $.ajax({
      url: appHome+'/supplier-ancillary/common_ajax',
      type: 'post',
      dataType: 'json',
      data : {
          'action_type' : 'get_city_from_address',
          'getValue' : address_code
      },
      beforeSend: function() {
            // setting a timeout
          $('.town_loader').show();
        },
      success: function(obj){
          if(obj.status == 'new'){
            $('.existing-fields select').find('optgroup[label="'+obj.country+'"]').append('<option value="'+obj.id+'">'+obj.name+'</option>');
            $("#town").val(obj.id); 
          }else{
            $("#town").val(obj.id);
          }
          
          $('.chosen').chosen().trigger("chosen:updated");
          $('.town_loader').hide();
          $("#town").parent().removeClass('highlight');
        },
      error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
          $('.town_loader').hide();
        }
    });
});

$('.sc-add-btn').on('click', function(e) {
    e.preventDefault();
    saveFilters($(this));
});

$('#storage-cost-list').on('click', '.sc-edit-btn, .sc-duplicate-btn', function(e) {
    e.preventDefault();
    saveFilters($(this));
});

$('.goback-storage-rates').on('click', function(e) {
    e.preventDefault();
    var returnPath = $(this).attr("href") + '?' + $('input[name="returnpath"]').val();
    window.location.href = returnPath;
});

function saveFilters($this){
  var filterVals = $('form').serialize();
  var linklocation = $this.attr("href");

  $.ajax({
      url: appHome+'/supplier-ancillary/common_ajax',
      type: 'post',
      dataType: 'text',
      data : {
          'action_type' : 'keep_index_fileter',
          'filters' : filterVals
      },
      success: function(response){
          if(response == "success"){
              window.location.href = linklocation; 
          }
        },
      error: function(response){}
    });
}


$('#storage-form').on('keypress', '.dailyrate_rate, .dailyrate_day_from, .dailyrate_day_to', function(e) {
  if(e.keyCode == 13){
    e.preventDefault();
    var $this = $(this);
    var cur_position = $(this).parents('.form-group').data("otherdiv-pos");
    var has_value = $(this).parents('.form-group').data("hasvalue");
    var old_value = $(this).data("oldvalue");
    if(e.shiftKey){

      BootstrapDialog.confirm('Are you sure you want to delete rest of the Daily Rates?', function(result){
        if(result) {
            $this.parents('.form-group').data("hasvalue","no"); 
            if(cur_position != "first"){
              $this.parents('.form-group').data("otherdiv-pos","last");  
            }

            $this.parents('.form-group').nextAll().each(function(){
              $(this).remove();
            });
            $('.tab-content').css({ height: $('.tab-pane').height() });
        } else {
            $this.data("oldvalue", old_value);
            $this.val(old_value);
        }
      });
    }
    else{
      if($('#free_days').val() == ""){
        $('#free_days').val(0);
      }
      $(this).data("oldvalue", $(this).val());
      if(($(this).val() != "" || $(this).val() != "0") && has_value == "no"){ 
          var otherDivData = $(this).parents('.form-group').data();
          var otherdivCountController = $('#'+otherDivData.otherdivCountController);
          var otherdivCount = otherdivCountController.val();
          otherdivCountController.val(parseInt(otherdivCount)+1);
          childerns = $(this).parents('.form-group').children();
          this_day_from_element = childerns[1].children[0];
          this_day_to_element = childerns[2].children[0];
          this_daily_rate_element = childerns[3].children[0].children[1];
          if(this_day_from_element.value && this_day_to_element.value && this_daily_rate_element.value){
            if(checkDailyRateIsValid()){

              $(this).parents('.form-group').data("hasvalue","yes");   
              if(cur_position != "first"){
                $(this).parents('.form-group').data("otherdiv-pos","middle");  
              }
              $('#addcost-divs').children('.'+otherDivData.otherSample).clone().appendTo( "#"+otherDivData.otherdivContainer);
              $(this).parents('.form-group').next('.form-group').data("otherdiv-pos","last");
              $('.tab-content').css({ height: $('.tab-pane').height() });
              // $(document.querySelectorAll(".dailyrate_day_from")).val($(this).parents('.form-group').children);
              $(document.querySelectorAll(".dailyrate_day_from")).focus();
            }
          }
          else if(this_day_from_element.value === null || this_day_from_element.value === ""){
            $(this_day_from_element).focus();
          }
          else if(this_day_to_element.value === null || this_day_to_element.value === ""){
            $(this_day_to_element).focus();
          }
          else if(this_daily_rate_element.value === null || this_daily_rate_element.value === ""){
            $(this_daily_rate_element).focus();
          }
          
      }
    }
  }
});

function checkDailyRateIsValid(from_submit = false){
  is_valid = true;
  var last_day = parseInt($('#free_days').val());
  day_from_array = $('.dailyrate_day_from');
  day_to_array = $('.dailyrate_day_to');
  dailyrate_rate_array = $('.dailyrate_rate');
  day_from_array.each((index, el)=> {
    if(index <= day_from_array.length - 2){
      if(
        (
          from_submit &&
          index == day_from_array.length - 2 && 
          el.value === "" && 
          day_to_array[index].value === "" && 
          dailyrate_rate_array[index].value === ""
        ) || 
        (
          parseInt(el.value) == last_day + 1 &&
          (day_to_array[index].value == "" || parseInt(day_to_array[index].value) >= parseInt(el.value))
          )){
        $(el).parent().removeClass('highlight');
        $(day_to_array[index]).parent().removeClass('highlight');
      } else {
        if(parseInt(el.value) != last_day + 1){
          $(el).parent().addClass('highlight');
        }
        if(!(day_to_array[index].value == "" || parseInt(day_to_array[index].value) >= parseInt(el.value))){
          $(day_to_array[index]).parent().addClass('highlight');
        } 
        is_valid = false;
      }
      last_day = parseInt(day_to_array[index].value);
    }
  });
  return is_valid;
}

function checkLumpsumRateIsValid(){
  is_valid = true;
  var last_day = parseInt($('#free_days').val());
  lumps_apply_day_array = $('.lumps_apply_day');
  lumps_price_array = $('.lumps_price');
  lumps_reason_array = $('.lumps_reason');
  lumps_apply_day_array.each((index, el)=> {
    if(index <= lumps_apply_day_array.length - 2){
      
      if(
        (
          index == lumps_apply_day_array.length - 2 && 
          el.value === "" && 
          lumps_price_array[index].value === "" && 
          lumps_reason_array[index].value === ""
        ) 
          || parseInt(el.value) > last_day){
        $(el).parent().removeClass('highlight');
      } else {
        $(el).parent().addClass('highlight');
        is_valid = false;
      }
      last_day = parseInt(el.value);
    }
  });
  return is_valid;
}

function checkSurchargeRateIsValid(){
  is_valid = true;
  var last_day = parseInt($('#free_days').val());
  var first = false;
  sur_day_from_array = $('.sur_charge_day_from');
  sur_day_to_array = $('.sur_charge_day_to');
  sur_charge_rate_array = $('.sur_charge_rate');
  sur_charge_reason_array = $('.sur_charge_reason');
  sur_day_from_array.each((index, el)=> {
    if(index <= sur_day_from_array.length - 2){
      if(
        (
          index == sur_day_from_array.length - 2 && 
          el.value === "" && 
          sur_day_to_array[index].value === "" && 
          sur_charge_rate_array[index].value === "" &&
          sur_charge_reason_array[index].value === ""
        ) ||
        (!first && (parseInt(el.value) > last_day && (sur_day_to_array[index].value == "" || parseInt(sur_day_to_array[index].value) >= parseInt(el.value)))) || 
        (first && parseInt(el.value) == last_day + 1 && (sur_day_to_array[index].value == "" || parseInt(sur_day_to_array[index].value) >= parseInt(el.value)))){
        $(el).parent().removeClass('highlight');
        $(sur_day_to_array[index]).parent().removeClass('highlight');
      } else {
        if(!((!first && (parseInt(el.value) > last_day) || first && parseInt(el.value) == last_day + 1))) {
          $(el).parent().addClass('highlight');
        }
        if(!(sur_day_to_array[index].value == "" || parseInt(sur_day_to_array[index].value) >= parseInt(el.value))){
          $(sur_day_to_array[index]).parent().addClass('highlight');
        }
        is_valid = false;
      }
      first = true;
      last_day = parseInt(sur_day_to_array[index].value);
    }
  });
  return is_valid;
}

$(document).on('click', '.storage-status-move-all', function(e) {
    var status = $(this).prop("checked");
    $('.each-check-storage').each(function(){ 
        $(this).prop("checked", status);
    });  
});


// Delete a Storage Cost File
$('.doc-file-list, #modal-storage-cost-files-info').on('click', ('.delete-storage-rate-file'), function(e) {
  e.preventDefault();

  var table = $(this).closest('table')
      row = $(this).closest('tr'),
      id = $(this).data('id'),
      path = $(this).data('path');
      root = $(this).data('root');

  BootstrapDialog.confirm('Are you sure you want to delete Document #'+id+'?', function(result){
    if(result) {
      $.ajax({
        type: 'POST',
        url: root,
        data: {
          'id' : id,
          'path' : path
        },
        success: function(response){
          row.remove();
          if(table.find('tbody > tr').length == 0) {
              $('.doc-file-list').addClass('hidden');
          }
          // Refresh tab-content height
          $('.tab-content').css({ height: $('.tab-pane').height() });
        },
        error: function(response){
          $('html, body').animate({
            scrollTop: $("#feedback").offset().top
          }, 700);
          $('#feedback').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  });
});

function storage_listing(){
    var path = $("#listing-path").val(); 
    var ancillary_type = $('#ancillary_type').val();
    var h = $('.overlay-complete-loader').height();
    if(h == 0) { h = 100; }
    $('.btl_overlay').height(h); 
    $('.btl_relative').show(); 

    $.ajax({
      type: 'POST',
      url: path,
      data: $('form').serialize(),
      success: function(response){
        $("#storage-cost-list").html(response);
        $('.btl_relative').hide();

        $("#totalrecords").val($("#totalrecordcount").val()); 
        $("#rec-count").text($("#totalrecordcount").val());

        if($("#archive_status").val() == "1"){
           $("#btn-move-archive").html("<i aria-hidden='true' style='font-size:14px' class='fa fa-archive'></i> Move to Live");
           $("#btn-move-archive").attr('data-move-to','Live');    
        } else {
           $("#btn-move-archive").html("<i aria-hidden='true' style='font-size:14px' class='fa fa-archive'></i> Move to Archive");
           $("#btn-move-archive").attr('data-move-to','Archive');
        }
        applySortClass();
      },
      error: function(response){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_error).fadeIn();
        $('.btl_relative').hide();
      }
    });
}


if($("#page-name").val() == "storage-listing"){
    storage_listing();

    //Pagination button
    $(document).on('click', '.first-page, .last-page, .next-page, .prev-page', function(){
      var pageNumber = $(this).data('pagenumber');
      $('#page').val(pageNumber);
      storage_listing();
    });

    //Page size change
    $(document).on('change', '.page-limit', function(){
      var pageSize = $(this).val();
      $('#pagesize').val(pageSize);
      $('#page').val(1);
      storage_listing();
    });
}

//Storage Listing Page Filger 
$('#storage-filter').on('click', function(e) {
      e.preventDefault();
      $("#page").val(0);
      storage_listing();
});


$(document).on('click', '.sortClass', function(){
    
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
    $('#response').empty();

    storage_listing();
});

function applySortClass(){
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
}

$(document).on('click', '#btn-move-archive', function(e) {
      e.preventDefault();
     
      var checkedval = [];
      $('.each-check-storage').each(function(){
          var selqno = $(this).attr('data-cost-id');
          if($(this).prop("checked") == true){
              checkedval.push(selqno);
          }
      });
      checkedval = $.unique(checkedval);
      
      var move = $(this).attr('data-move-to');
      var mButton = 'btn btn-primary';
      if(checkedval.length > 0)
      {
        BootstrapDialog.show({
              type: BootstrapDialog.TYPE_PRIMARY,
              title: 'Confirmation ('+checkedval.length+' Storage Rates)',
              message: 'Are you sure you want to move these rates to '+move+' ?',
              buttons: [{
                       label: 'Close',
                       action: function(dialogItself){
                           dialogItself.close();
                       }
                   },{
                     label: 'Ok',
                     cssClass: mButton,
                     action: function(dialogRef){
                       var clickbtn = $(this);
                       $.ajax({
                          type: 'POST',
                          url: appHome+'/supplier-ancillary/common_ajax',
                          data: {
                            'cost_ids' : JSON.stringify({checkedval}),
                            'move' : move,
                            'action_type' : 'change_storage_status',
                          },
                         beforeSend: function() {
                          clickbtn.html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
                          clickbtn.attr('disabled','disabled');
                          },
                          success: function(response){
                             storage_listing(); 
                             $('html, body').animate({ scrollTop: 0 }, 400);
                             $('#response').empty().html(response).fadeIn();
                             dialogRef.close();
                          },
                          error: function(response){
                            $('html, body').animate({ scrollTop: 0 }, 400);
                            $('#response').empty().prepend(alert_error).fadeIn();
                            dialogRef.close();
                          }
                    });
                     }
              }]
        }); 
      
      }
    
  });

// Show a modal of cost files
$('#storage-cost-list').on('click', '.storage_cost_files_info', function(e) {
  e.preventDefault();

  var cost_id = $(this).data('cost-id');
  $('html, body').animate({ scrollTop: 0 }, 400);

  $.ajax({
    type: 'GET',
    url: appHome + '/supplier-ancillary/storage-rates/supplier-cost-files-info/' + cost_id,
    success: function(response){
      $('#modal-storage-cost-files-info').empty().append(response).show();
    },
    error: function(response){
      $('#modal-storage-cost-files-info').find('.modal-body').empty().append(alert_error).fadeIn();
    }
  });
});


/**
 * multi select option for customers
 */
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

$('.tmp-input-ctrl').remove();//This control is for not showing old select box

//Plus button 
$('.other-add-btn').live('click',function(){
    var otherDivData = $(this).parents('.form-group').data();
    var otherdivCountController = $('#'+otherDivData.otherdivCountController);
    var otherdivCount = otherdivCountController.val();
    otherdivCountController.val(parseInt(otherdivCount)+1);

    $(this).parents('.form-group').data("otherdiv-pos","middle");
    $(this).hide();
    $('#addcost-divs').children('.'+otherDivData.otherSample).clone().appendTo( "#"+otherDivData.otherdivContainer);
    $(this).parents('.form-group').next('.form-group').data("otherdiv-pos","last");
    
    $('.tab-content').css({ height: $('.tab-pane').height() });
 });

 //Minus button 
 $('.other-sub-btn').live('click',function(){
    var otherDivData = $(this).parents('.form-group').data();
    var otherdivCountController = $('#'+otherDivData.otherdivCountController);
    var otherdivCount = otherdivCountController.val();
    var otherdivPos = otherDivData.otherdivPos;
    
    if (otherdivCount == 2 || otherdivPos == 'last')
    {
      $(this).parents('.form-group').prev().children().children('.other-add-btn').show();
      $(this).parents('.form-group').prev().data("otherdiv-pos","last");
    }
    if (otherdivCount != 1)
    {
      $(this).parents('.form-group').remove();
      otherdivCountController.val(parseInt(otherdivCount)-1);
    }
    
    $('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page   
 });



$(document).on('click', '.edit-doc-desc', function(e) {
      e.preventDefault();
      $("#edit_file_desc,#edit_file_desc_id").val('');
      $('.btn-update-desc').attr('disabled',false);

      var desc = $(this).closest('td').prev('.td_file_desc').text().trim();
      var decId = $(this).attr('data-fileid');
      $("#edit_file_desc").val(desc);
      $("#edit_file_desc_id").val(decId);
});

$('#modal-storage-cost-files-info, #doc_edit_desc').on('click', '.close-update-desc', function(e) {
    $('#doc_edit_desc').modal('toggle');
 });

 $(document).on('click', '.btn-update-desc', function(e) {
      e.preventDefault();
      var id  = $("#edit_file_desc_id").val()
      var des = $("#edit_file_desc").val().trim();
      $('.btn-update-desc').attr('disabled',true);
      $.ajax({
            type: 'POST',
            url: appHome+'/supplier-ancillary/common_ajax',
            data: {
              'desc' : des ,
              'desc_id' : id,
              'action_type' : 'update_cost_desc'
                },
            success: function(response){
              $('.edit-doc-desc[data-fileid="'+id+'"]').parent('td').prev('.td_file_desc').text(des);
              $('#doc_edit_desc').modal('toggle');
              $('.btn-update-desc').attr('disabled',false);
            },
            error: function(response){
              BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
                 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',  
              });
            }
      });
});

  //Start : Tool tip area
  $(document).scroll(function(){
      $(".dailyrate-tooltip").tooltip('hide');
  });

  $(function () {
      $('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
  });

  $(document).on('mouseout', '.dailyrate-tooltip', function(){
      $(".dailyrate-tooltip").tooltip('hide');
      $('#hover_last').val('');
  });

  $(document).on('hover', '.dailyrate-tooltip', function(){
      $('#hover_last').val($(this).attr('data-srid'));
      hoverPopup($(this));

      if($(this).attr('data-isAjaxCall') == 0 && $(this).attr('data-isSendAjax') == 0){
        fillHoverByAjax($(this));
      } 
  });
    
  function fillHoverByAjax(thisVal){

    var srid = thisVal.attr('data-srid');
    var curr = thisVal.attr('data-currency');

    $.ajax({
      type: 'POST',
      url: appHome+'/supplier-ancillary/common_ajax',
      data: {
          'srid' : srid,
          'action_type' : 'hover_popup_daily_rate',
          },
      beforeSend: function() {
          thisVal.attr('data-isajaxcall','1');
       },    
      success: function(responseString){
        response = JSON.parse(responseString);
        var existingjson = JSON.parse(thisVal.attr('data-popupdetails'));
        
        if(!$.isEmptyObject(response)){
          $.each(response, function(item, obj) {
            var newArr = ({"from" : obj.from, "to" : obj.to, "rate" : obj.rate, "type" : obj.type, "reason" : obj.reason});
            existingjson[item] = newArr;
          });
        }
        thisVal.attr('data-popupdetails',JSON.stringify(existingjson));
        hoverPopup(thisVal);
      }
    });
  }

  /**
   * function for hover popup
   */
  function hoverPopup(currentElement){
      $('[data-toggle="tooltip"]').tooltip({ placement: 'top'});
      var currency_name = currentElement.attr('data-currency'); 
      var currency_symbol = "";    

      if (currency_having_symbols.indexOf(currency_name) >= 0) {
          currency_symbol = '<i class="fa fa-' + currency_name.toLowerCase() + '"></i>';
      } else {
          currency_symbol = '<i class="fa">' + currency_name + '</i>';
      }

      var jsonData = JSON.parse(currentElement.attr('data-popupdetails')); 
      var imageUrl = '<img src="'+appHome+'/../images/ajax.gif"/>';
      var previousType = 1;   
      var tooltipHtml = "<table class='table table-bordered table-hover tablesorter hide-filters thick-table' style='font-size:10px;border-collapse:unset;border-radius:3px;margin:1px;align:center;border-right:2px solid green;' >";
          tooltipHtml += "<tr style='background-color:#ddd;'><td colspan='4'>Daily Rates</td></tr>";
		  tooltipHtml += "<tr style='background-color:#ddd;'><td width='20%'>Day From</td><td width='20%'>Day To</td><td width='20%'>Daily Rate</td><td width='40%'></td></tr>";

      $.each(jsonData, function(i, obj) {
		  if(previousType != obj.type){
			 if(obj.type == 2){
				tooltipHtml += "<tr style='background-color:#ddd;'><td colspan='4'>Surcharge</td></tr>";
		  		tooltipHtml += "<tr style='background-color:#ddd;'><td>Day From</td><td>Day To</td><td>Price</td><td>Reason</td></tr>";
			}else if(obj.type == 3){
				tooltipHtml += "<tr style='background-color:#ddd;'><td colspan='4'>Lumpsum</td></tr>";
		  		tooltipHtml += "<tr style='background-color:#ddd;'><td>Apply Day</td><td></td><td>Price</td><td>Reason</td></tr>";
			}
			previousType = obj.type;
		  }
		
          tooltipHtml += "<tr><td style='border-bottom:1px solid #ddd;background-color:white;'>"+obj.from+"</td>";
          tooltipHtml += "<td class='' style='border-bottom:1px solid #ddd;background-color:white;'>"+obj.to+"</td>";
		  tooltipHtml += "<td class='' style='border-bottom:1px solid #ddd;background-color:#ddd;'>"+ currency_symbol + ' ' + obj.rate+"</td>";
          tooltipHtml += "<td class='' style='border-bottom:1px solid white;background-color:#ddd;word-wrap: break-word;'>"+ obj.reason + "</td></tr>";
      });

      if($.isEmptyObject(jsonData)){
          // tooltipHtml += "<tr><td  colspan='3' class='center-cell' style='background-color:white;'>"+imageUrl+"</td></tr>";
      }

      tooltipHtml += "</table>";

      currentElement.attr('data-original-title',tooltipHtml);
      if($('#hover_last').val() == currentElement.attr('data-srid')){
        currentElement.tooltip('show');
      }
  }
  //End : Tool tip area


  $('#storage-form').on('change', 'select#supplier_id', function(e) {
      var $this = $(this),
          supplier_id = $this.find(':selected').val();

      $.ajax({
          url: appHome+'/supplier-ancillary/common_ajax',
          type: 'post',
          dataType: 'json',
          data : {
              'action_type' : 'get_curr_from_supplier',
              'getValue' : supplier_id
          },
          beforeSend: function() {
                // setting a timeout
              $('.curr_loader').show();
            },
          success: function(obj){
              if(obj.status == 'success'){
                  $("#curr_id").val(obj.curr_id);
                  $("#curr_name").val(obj.curr_name);
                  $('#curr_id').trigger('change');
                  $('.chosen').chosen().trigger("chosen:updated");
                  $('.curr_loader').hide();
              } else {
                $('html, body').animate({ scrollTop: 0 }, 400);
                $('form').find('#response').empty().prepend(alert_error).fadeIn();
                $('.curr_loader').hide();
              }
            },
          error: function(response){
              $('html, body').animate({ scrollTop: 0 }, 400);
              $('form').find('#response').empty().prepend(alert_error).fadeIn();
              $('.curr_loader').hide();
            }
        });
  });

	//Function for End Date Undisclosed 
	$('#no_end_validity').change(function() {
	    if($(this).prop("checked")){
			previous_valid_unditl_date = $('input[name="to_date"]').val();
			$('input[name="to_date"]').attr('readonly','true');		
			$('input[name="to_date"]').datepicker( "option", "disabled", true );
			$('input[name="to_date"]').hide();
			$("#dummy_date").show();
			$('input[name="to_date"]').val($("#max_validity").val());
		} else {
			$('input[name="to_date"]').removeAttr('readonly');
			$('input[name="to_date"]').datepicker( "option", "disabled", false );
			$("#dummy_date").hide();
			$('input[name="to_date"]').show();
			$('input[name="to_date"]').val(previous_valid_unditl_date);
		}
	});


})();  //End of first f


/**
 * File upload JS
 */
function fileSelected(e) {
	var file = $('#file_to_upload')[0].files[0];
	if (file) {
	  var fileSize = 0;
	  if (file.size > 1024 * 1024)
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	  else
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

	  var cost_id = $('input[name="supplier_cost_id"]').val();
	  $('#file_size').html('Size: ' + fileSize);
	  $('#file_type').html('Type: ' + file.type);
	}
}

function uploadFile(e) {

	var ref_id = $('input[name="ref_id"]').val();
  var path = e.getAttribute("data-path") + '/upload';

	if(!$('#file_to_upload')[0].files[0]) {
		return false;
	}

	var fd = new FormData();
	fd.append("file_to_upload", $('#file_to_upload')[0].files[0]);
	fd.append("file_desc", $('#file_desc').val());
	fd.append("ref_id", ref_id);

	var xhr = new XMLHttpRequest();

	// file received/failed
	xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4) {
					$('#progress_num').addClass(xhr.status == 200 ? "success" : "failure");
			}
	};

	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	xhr.open("POST", path);
	xhr.send(fd);
}

function uploadProgress(evt) {
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progress_num').show().html(percentComplete.toString() + '%');
}

function uploadComplete(evt) {
	// clear the form
	$('.file-upload-fieldset').find('input:text, input:file').val('');
	$('#file_size').empty();
	$('#file_type').empty();
  var delPath = $("#fileDelPath").val();

	// fade out the progress indicator for added sexiness
	$('#progress_num').delay(2000).fadeOut('slow');

	var row = JSON.parse(evt.target.responseText);

	$('.doc-file-list').removeClass('hidden');

	var table = $('.table-doc-file-list');
	table.children('tbody').append(
				'<tr class="new-ajax-row success">' +
					'<td>'+row.id+'</td>' +
					'<td><a href="'+row.path+'" target="_blank" title="View/Download file">'+row.path+'</a></td>' +
					'<td class="td_file_desc">'+row.description+'</td>' +
					'<td><a href="#" '+ 
                     'data-fileid="'+row.id+'" ' +
                     'data-toggle="modal" ' +
                     'data-target="#doc_edit_desc" ' +
                     'title="Edit Description" ' +
                     'class="edit-doc-desc">' +
                     '<span style="font-size:14px" class="glyphicon glyphicon-pencil"></span></a>' +
          '</td>' +
          '<td>'+row.date_added+'</td>' +
					'<td><a href="'+row.path+'" target="_blank" title="View/Download file"><i class="fa fa-download"></i></a></td>' +
					'<td class="center-cell"><a href="#" title="Delete Document" class="delete-storage-rate-file delete-icon" data-root="' + delPath + '" data-id="'+row.id+'" data-path="'+row.path+'"><i class="fa fa-trash-o"></i></a></td>' +
				'</tr>');

	// add hidden field so that files can be updated with a cost ID
	$('.file-upload-fieldset').append('<input type="hidden" name="files-to-update[]" value="'+row.id+'" />');

	var delay = setTimeout(function(){
		$('.new-ajax-row').removeClass('success');
	},2000);

  // Refresh tab-content height
  $('.tab-content').css({ height: $('.tab-pane').height() });
}

function uploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}

function export_csv(){
  var data = $('form').serialize();
  var path = appHome+'/supplier-ancillary/manage-csv/export'
  data = data+'&export=1';
  window.location.href = path +"?"+data;
}

function export_excel(){
  var data = $('form').serialize();
  var path = appHome+'/supplier-ancillary/manage-csv/export-excel'
  data = data+'&export=1';
  window.location.href = path +"?"+data;
}
$(function() {
	if($("#storage_rate_file_form").val() == "1"){
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
              fileInput = document.getElementById("file_to_upload"); 
              fileInput.files = event.dataTransfer.files;
              document.getElementById("file-upload-panel").scrollIntoView();
              $("#file-upload-panel").css("background-color", "#bdbdbd");
              setTimeout(() => {
                $("#file-upload-panel").css("background-color", "unset");
              }, 800);
              fileSelected();
              setTimeout(() => {
                              if($("#auto_upload_on_drag").is(":checked")){
                                  uploadFile($('#file_upload_btn_supplier_ancillary')[0]);
                              }
                myDropzone.removeAllFiles( true );
              }, 200);
            }
					});
			
				}
			});
		}
});
