var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';

$(document).ready(function(){
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
});
// multi select 
$(document).on('change', '.multi-sel-ctrl', function(e){
	var optioncount = $(this).find('option:selected').length;
	var optlimit = 25;
	var count = 1;
	var $this = $(this);
	
    if(optioncount > optlimit) {
    	$(this).find('option:selected').each(function(){
    		if(count > optlimit){
    			$(this).prop('selected',false);
    		}
    		count +=1;
    	})
    	BootstrapDialog.show({title: 'Tank Plans', message : 'Selection is limited to 25 items only.',
			 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
		});
    	$(".multi-sel-ctrl").multiselect('refresh');
    }
});

// Get supplier report details
$(document).on('click', '#accounts_cost_search', function(){ 
    var form = '#'+$(this).closest('form').attr('id');
    $('#page').val(1);
    $('#response').empty();
    getAccountExportCosts(form);
});


function getAccountExportCosts(form,load_more=false){ 
    
    var h = $('.overlay-complete-loader').height();
    if(h == 0) { h = 100; }
    $('.btl_overlay').height(h);  
    $('.btl_relative').show();
  if(load_more == false){
      var button = $('#accounts_cost_search');
  }
  else{
    var button = $('.btn_more');
  }
    button.find('span').removeClass().addClass("fa fa-spinner fa-spin");
    button.attr('disabled','disabled');
    
    $.ajax({ 
        type: 'POST',
        url: appHome+'/account-export-costs/common-ajax',
        data: $(form).serialize(),
        success: function(response){
            $('.btl_relative').hide();
          button.find('span').removeClass("fa fa-spinner fa-spin");
          button.removeAttr('disabled');
          if(load_more == false){
            $('#report-div').html(response);
          }
          else{
            $('#account-export-cost-table tbody tr:last').after(response);
            var count = $('.rows_count').data('count');
            var page_size = $('#page_size').val();
            if(parseInt(count) < parseInt(page_size)){
              $('.view-list').remove();
            }
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
  var form = '#account-export-cost-form';
  $('.rows_count').remove();
  getAccountExportCosts(form, true);
});

$(document).on('click', '.mark-exported',function(){
  markJobCostExported();
});

function markJobCostExported(){
   var invoice_ids = [];
   var job_cost_ids = [];
  // var jcIds = [];
  $('.checklist:checked').each(function(){
    invoice_ids.push($(this).val());
  });

  $.ajax({ 
    type: 'POST',
    url: appHome+'/account-export-costs/common-ajax',
    data: {
      'invoice_ids' : invoice_ids,
      'action_type' : 'mark_cost_exported'
    },
    success: function(response){
        if(response){
          $('#response').html(response);
          $('.checklist:checked').each(function(){
            var id = $(this).attr('id');
            $('#'+id).remove();
          });
          $('html, body').animate({ scrollTop: 0 }, 400);
        }
        else{
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
    },
    error: function(response){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_error).fadeIn();
    }
  });
}

$(document).on('change', '.checklist', function(){
  checkboxChange();
});

$(document).on('click', 'input:checkbox[name=toggleall]', function(){
//$('input:checkbox[name=toggleall]').click (function () {
  $(':checkbox[name=ids\\[\\]]').prop('checked', this.checked);
  checkboxChange();  
});

function checkboxChange(){
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
}