$(document).ready(function(){
	
	//Page size change
	$('.custom-page-pagesize').change(function(e){
		var pagelimit = $(this).val();
		$('#pagesize').val(pagelimit);
		$('#demtk-job-filter-form').submit();
	});	
	
	/*$('#cust_country').change(function(e){
		if($('#cust_country').val() == ""){
			 $(".demtk_cust").show();
		}else{
			$(".demtk_cust").hide();
			$("#cust_code").val('');
			$(".multi-sel-ctrl").multiselect("refresh");
		}
		
	});*/	

  $('#recharge_type').change(function(e){
    $('#sort').val('');
    $('#sorttype').val('');
    if($(this).val() == "PRDEM"){
      var customerLabel = "PRDEM Customers";
      var fromDateLabel = "PRDEM charge from Date";
      var toDateLabel = "PRDEM charge to Date";
      $('.demtk_staus').hide();
      $('.btn-amend-demtk-terms').hide();
    }else{
      var customerLabel = "DEMTK Customers";
      var fromDateLabel = "DEMTK charge from Date";
      var toDateLabel = "DEMTK charge to Date";
      $('.demtk_staus').show();
      $('.btn-amend-demtk-terms').show();
    }
    $('.customer-label').html(customerLabel);
    $('.date-from-label').html(fromDateLabel);
    $('.date-to-label').html(toDateLabel);
    
  });
	/**
	 * filter result in index page
	 */	
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
        var jobval = $('#job-no-filter').val();
        if(jobval==''){
          highlight($(form).find('#date_from'), '');
        }
        highlight($(form).find('#date_to'), '');
        var check_fields = (success.indexOf(false) > -1);
          if(check_fields === true){
              $('html, body').animate({ scrollTop: 0 }, 400);
              $('#response').empty().prepend(alert_required).fadeIn();
            } else {
              $('#export_input').val(0);
              $(form).submit();
            }
    });

    $('#excel-export-btn').click(function(e){
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
      var jobval = $('#job-no-filter').val();
      if(jobval==''){
        highlight($(form).find('#date_from'), '');
      }
      highlight($(form).find('#date_to'), '');
      var check_fields = (success.indexOf(false) > -1);
      if(check_fields === true){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('#response').empty().prepend(alert_required).fadeIn();
        } else {
          
          $('#export_input').val(1);
          $(form).submit();
          $('#export_input').val(0);
        }
    });
    
    $('.btn-create-invoice').click(function(e){
        e.preventDefault();
        var totalCount = $( ".confirm_checkbox:checked" ).length;
        var sCount  = 0;
        var dCount = 0;
        var msg = "";
        var rechargeType = $('#hidden-recharge-type').val();
        $( ".confirm_checkbox" ).each(function() {

          var dFlag = $(this).is(':checked');
          var sFlag =  $(this).parent().prev('td').find('.confirm_summary_check').is(':checked');
          console.log(sFlag+'-'+dFlag)
          if(sFlag && dFlag){
            sCount = sCount + 1;
          }else if(!sFlag && dFlag){
            dCount = dCount + 1;
          }
        });

        if(sCount > 0){
          msg += sCount+" Jobs are linked  to Summary Invoices<br>";
        }
        if(dCount > 0){
          msg += dCount+" Jobs are Creating "+rechargeType+" Invoices<br>";
        }

        msg += "<b>Are you sure want to apply?<b>";

        BootstrapDialog.show({
            type: BootstrapDialog.TYPE_PRIMARY,
            title: 'Confirmation ('+ totalCount +' Items)',
            message: msg,
            size: BootstrapDialog.SIZE_SMALL,
            buttons: [{
   		             label: 'Close',
   		             action: function(dialogItself){
   		                 dialogItself.close();
   		             }
   		         },{
   	             label: 'Ok',
   	             cssClass: 'btn-primary',
   	             action: function(){
   	            	 var jobArr = [];
	   	             $( ".confirm_checkbox:checked" ).each(function() {
	   	             	  var data_json = jQuery.parseJSON($( this ).attr('data-json'));
                      var pl_id = data_json.pl_id;
                      if($('.summ_chk_'+pl_id).is(':checked')){
                        data_json.summary = 1;
                      }else{
                        data_json.summary = 0;
                      }
	   	             	  jobArr.push(data_json); 
	   	             });
	   	             var json = JSON.stringify({jobArr : jobArr});
	   	     		 $.ajax({
	   	     		    url: appHome+'/demtk/common_ajax',
	   	     		    type: 'post',
	   	     		    dataType: 'html',
		   	     		 beforeSend: function() {
		   		        	$('.bootstrap-dialog-footer-buttons > .btn-primary').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> OK");
		   		        	$('.bootstrap-dialog-footer-buttons > .btn-primary').attr('disabled','disabled');
		   		        },
	   	     		    data : {
	   	     		    		'json' : json,
	   	     		    		'action_type' : 'create_demtk_invoice_automatically',
                      'recharge_type' : $('#hidden-recharge-type').val(),
	   	     		    },
	   	     		    success: function(response) {
	   	     		    	$('html, body').animate({ scrollTop: 0 }, 400);
	   	     		    	location.reload();
	   	     		    	localStorage.setItem('response', response);
	   	     		    }
	   	     		  });

   	             }
            }]
        });
     });
    
	/**
	 * function for disable buttons
	 */
	function disableButton(){
		var acceptCount = $('.accept:checked').length;

    var labelFlag = false;
    $( ".confirm_summary_check:checked" ).each(function() {
         if($(this).parent().next('td').find('.confirm_checkbox:checked').length > 0){
          labelFlag = true;
         }
    });
    if(labelFlag){
      $('.btn-create-invoice').html('<span class="glyphicon glyphicon-export"></span>&nbsp;Link Invoice');
    }else{
      $('.btn-create-invoice').html('<span class="glyphicon glyphicon-export"></span>&nbsp;Create Invoice');
    }

		if(acceptCount > 0){
			$('.btn-create-invoice').removeAttr('disabled');
      $('.btn-amend-demtk-terms').removeAttr('disabled');
		}else{
			$('.btn-create-invoice').attr('disabled','disabled');
      $('.btn-amend-demtk-terms').attr('disabled','disabled');
		}
	}
	
$(".all_accept").change(function() {
        $('#response').empty()
        $('.each_tr').removeClass('success danger');
        var checked = $(this).is(':checked');
        $(".confirm_checkbox,.all_deny").prop('checked',false);
        if(checked) {
            $('.accept').prop('checked',true);
            $('.each_tr').addClass('success');
            
        }else{
          $('.all_accept_summary_inv').prop('checked',false);
          $('.all_accept_summary_inv').trigger("change");
        }
        disableButton();
    });

$(".confirm_checkbox").change(function() {
	$('#response').empty()
    //accept all checkbox
  if(!$(this).is(':checked')){
    $(this).parent().prev('td').find('.confirm_summary_check:not(:disabled)').attr('checked',false);
  }
	acceptAllDemtk();
  summaryAcceptAll();
	disableButton();
});

// summary checkbox select all start
$(".all_accept_summary_inv").change(function() {
        var checked = $(this).is(':checked');
        $(".confirm_summary_check:not(:disabled)").prop('checked',false);
        if(checked) {
            $('.confirm_summary_check:not(:disabled)').prop('checked',true);
            $('.confirm_checkbox').prop('checked',true);
            $('.confirm_checkbox').trigger("change");
        }

});

function summaryAcceptAll(){
    var acceptCount = $('.confirm_summary_check:checked').length;
    var acceptTotal = $('.confirm_summary_check').length;
    if(acceptCount == acceptTotal){
      $(".all_accept_summary_inv").prop('checked',true);
    }else{
      $(".all_accept_summary_inv").prop('checked',false);
    }
}

function acceptAllDemtk(){
  var acceptCount = $('.accept:checked').length;
  var acceptTotal = $('.accept').length;
  if(acceptCount == acceptTotal){
    $(".all_accept").prop('checked',true);
  }else{
    $(".all_accept").prop('checked',false);
  }
}

$(".confirm_summary_check").change(function() {

    if($(this).is(':checked')){
      $(this).parent().next('td').find('.confirm_checkbox').attr('checked',true);
    }
    summaryAcceptAll();
    acceptAllDemtk();
    disableButton();
});
// summary checkbox select all end

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
                 if(checked === false && element.parent().val() == null){
                     element.parent().val('');
                     element.parent().multiselect('refresh');
                 }
            }
        });
    }
    $('.tmp-input-ctrl').remove();
    
    $('.demtkhover').tooltip();

    if($("#tank_num").length > 0){
         
         $("#tank_num").autocomplete({
              source:  appHome+'/purchase_order/get_tank_no_list',
              minLength: 2,
              type: "GET",
              success: function (event, ui) {
               
              },
              select: function (event, ui) {
              $(this).val(ui.item.label);
              $('#hdn_tank_num').val(ui.item.label);
              $('#hdn_tank_id').val(ui.item.value);
              return false;
              },
              change: function (event, ui) {
                if(($('#formname').val() == 'demtkform') && ($('#formname').length > 0)){
                     if (ui.item === null) {
                         BootstrapDialog.show({title: 'Error', message : 'Not a valid Tank. Please try later.',
                     buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',  
                  });
                         $(this).val('');
                         $('#hdn_tank_num').val('');
                         $('#hdn_tank_id').val('');
                     }
                     
                }
              }
          });
     }

$(document).on('click', '.btn-amend-demtk-terms', function(){
    var jobids = [];
    var customer = cur = days = rate = multiMsg = "";
    var cusflag = curflag = daysflag = rateflag = false;
    $('#response_amend_demtk').html('');
    $(".confirm_checkbox").each(function() {
    if ($(this).is(':checked')) {
      var a = $(this).data('jobno');
      jobids.push(a);
      if(!cusflag || !curflag || !daysflag || !rateflag){
        var json = JSON.parse( $(this).attr('data-json') );
        if(customer == ""){
          customer = json.DEMTK_customer;
          cur = json.currency;
          days = json.j_free_days;
          rate = json.j_demurrage_after_free_days;
        }

        if(!cusflag  && customer != json.DEMTK_customer){ 
          cusflag = true; multiMsg += ', DEMTK customer';

        }
        if(!curflag  && cur != json.currency){ 
          curflag = true; multiMsg += ', Currency';
        }
        if(!daysflag && days != json.j_free_days){ 
          daysflag = true; days = 0;  multiMsg += ', Freedays';
        }
        if(!rateflag && rate != json.j_demurrage_after_free_days){ 
          rateflag = true; rate = 0; multiMsg += ', Rate Per Day';
        }
      }
    }});

    if(cusflag){ customer = cur = ""; }
    $('#demtk_customer').val(customer).chosen().trigger("chosen:updated");
    fillCurrencyByCustomer(cur);
    $('#free_days,#free_days_current').val(days);
    $('#daily_rate').val(rate);

    if(multiMsg != ""){ $('#response_amend_demtk').html( alertMsgDiv( 'Multiple values found in '+multiMsg.replace(/^,/, '')+'.' ,'error') ); }
    var ids = jobids.toString();
    $('#job_id').val(ids);
});

$(document).on('click', '.save-demtk-datas', function(e){
  e.preventDefault();
  var success = [];
  function highlight(field, empty_value){
        if(field.length > 0){
          if(field.val().trim() === empty_value){
            $(field).parent().addClass('highlight');
            success.push(false);
          } else {
            $(field).parent().removeClass('highlight');
            success.push(true);
          }
        }
  }
  $('.highlight').removeClass('highlight');
  highlight($('#demtk_customer'), '');
  highlight($('#demurrage_currency'), '');
  var check_fields = (success.indexOf(false) > -1);
  if(check_fields === true){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_required).fadeIn();
  } else {
        $(this).attr('disabled','disabled');
        $.ajax({
             type: 'POST',
             url : appHome+'/demtk/demkJobUpdate',
             data: $('#demtk-form').serialize().replace(/%5B%5D/g, '[]'),
             success: function(response){
               window.location.reload();
               var message = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-thumbs-o-up"></i>'+response+'</div>';
               localStorage.setItem('response', message);
               $('html, body').animate({scrollTop:$('#response').position().top}, 0);
             },
             error: function(response){
               $('.create-po-template').attr('disabled',false);
               $('html, body').animate({ scrollTop: 0 }, 400);
               $('form').find('#response').empty().prepend(alert_error).fadeIn();
             }
        });
}
});

// On change demtk customer
$(document).on('change', '#demtk_customer', function(){
  fillCurrencyByCustomer('');
});

/**
* function for fill recharge currency
*/
function fillCurrencyByCustomer(selcur){
  var customer = $('#demtk_customer').val();
  var currency = $('#hdn_currency').val();
  if(customer != ""){
    $.ajax({
        type: 'POST',
        url: appHome+'/job/common_ajax',
        data: {
          'customer'  : customer,
          'currency'  : currency,
          'action_type' : 'get_currency_by_customer'
        },
        success: function(response){
          $('#demurrage_currency').html(response);
          $('#demurrage_currency').val(selcur).chosen().trigger("chosen:updated");
        }
    });
  }
}

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
		$('#demtk-job-filter-form').submit();
	}
});

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
    });
