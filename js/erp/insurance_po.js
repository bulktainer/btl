$(document).ready(function(){
    var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
   
  if($('#form').val() == "edit"){
    JobOrPo();
  }else{
    $('.po').hide();
  }
   
  $(document).on('click', '.job_or_po', function(e) {
    JobOrPo();
  });

    function JobOrPo(){
      if($("input[name='job_or_po']:checked").val() == 'job'){
        $('.changepass').show();
        $('.po').hide();
        $('.job').show();
        $('#po_number').val('');
        $('#hdn_po_num').val('');
        $('#hdn_po_id').val('');
        $('#tank_num').attr('readonly', true);
        /*$('#tank_num').val('');
        $('#hdn_tank_id').val('');
        $('#hdn_tank_num').val('');*/
      }else{
          $('.changepass').hide();
          $('.job').hide();
          $('.po').show();
          $('#job_number').val('');
          $('#hdn_job_num').val('');
          $('#hdn_job_id').val('');
          $('#customer').val('');
          $('#sea_type').val('');
          $('#sea_type_id').val('');
          $('#product').val('');
          $('#tank_num').attr('readonly', false);
          /*$('#tank_num').val('');
          $('#hdn_tank_id').val('');
          $('#hdn_tank_num').val('');*/
      }
    }
    
    $(document).on('change', '.custom-page-pagesize', function (e) {
      var pagelimit = $(this).val();
     $('#pagesize').val(pagelimit);
      $('#insurance-form').submit();
    });

    /* For displaying month and year only */
	$(function() {
	    $('.date-picker').datepicker( {
	        changeMonth: true,
	        changeYear: true,
	        showButtonPanel: true,
	        yearRange: "2018:2099",
	        dateFormat: 'MM yy',
	        onClose: function(dateText, inst) { 
	        function isDonePressed(){
	                            return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
	                        	}
	        if (isDonePressed()){

	                            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
	                            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
	                            $(this).datepicker('setDate', new Date(year, month, 1));
	                            }
	            }
	    });
	});

    //To focus on the date picker
	$(document).on('click', '.show-date-pic', function(e){
	    $('#po_date').focus();
	});

    //insurance po number creation
	$('.btn-po-number').click(function(e){
        var success = [];
        $('.highlight').removeClass('highlight');
        e.preventDefault();

        function highlight(field, empty_value){
          if(field.length > 0){
            if(field.val().trim() === empty_value){
              $(field).parent().addClass('highlight');
              success.push(false);console.log(success);
            } else {
              $(field).parent().removeClass('highlight');
              success.push(true);
            }
          }
        }
        
      // validation start-------------------------------
        if($(this).hasClass('btn-po-number')){
            e.preventDefault();
            
            highlight($('#po_date'), '');
            if($('#po_date').val() != ''){
                //function for check create new insurance po number
                isDateValid();
            }
             
            if(ExistSuccess == 'Exist'){
                success.push(false);
                  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> This date is already used for creating PO.</div>';
            }else if(ExistSuccess == 'dateFormat'){
                success.push(false);
                  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Invalid Date Format.</div>';
             
            }
            else{
                success.push(true); 
                alert_required = oldalert;
            }
            var check_fields = (success.indexOf(false) > -1);
               
        }

        function isDateValid() {
            ExistSuccess = [];
            $.ajax({
                type: 'POST', 
                url: appHome+'/insurancepo/common_ajax',
                async : false,
                data: {
                    'action_type' : 'insurance_po_generation',
                    'po_date'	  : $('#po_date').val()
                },
                success: function(response){
                    if(response == 'dateformat'){
                        ExistSuccess = 'dateFormat'
                        $('#po_date').parent().addClass('highlight');
                    }else{
                        ExistSuccess = 'Ok'
                        $('#po_number').val(response);	
                        $('#po_date').parent().removeClass('highlight');
                        if(check_fields === true){
                            $('html, body').animate({ scrollTop: 0 }, 400);
                            $('form').find('#response').empty().prepend(alert_required).fadeIn();
                          } else {
                            $('#form-btn-po-number').submit();
                          }
                    }
                },
                error: function(response){
                  $('html, body').animate({ scrollTop: 0 }, 400);
                  $('form').find('#response').empty().prepend(alert_error).fadeIn();
                }
          });
              
          }
  });

  $('#actual_currency').on('change', function() {
    var currency_id = $(this).chosen().val();
    switch_specific_currency_icons(currency_id,'actual-currency-change');
   
  });
  function switch_specific_currency_icons(currency_id,change_class){
    var $currency = $('.currency-meta[data-id="'+currency_id+'"]'),
    currency_name = $currency.attr('data-label');

    if(!$currency.length) {
      alert('Error. Currency not found.');
      return false;
    }
    if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
        $("."+change_class ).removeClass().html("").addClass(change_class+' fa currency-fa fa-'+currency_name);
    }
    else {
        $("."+change_class ).removeClass().html(currency_name.toUpperCase()).addClass(change_class+' fa currency-fa');
    }
   }

   if($('#form_type').val() == 'sub_insurance'){
   //Autocomplete function to fetch the tank numbers
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
                if (ui.item === null) {
                     BootstrapDialog.show({title: 'Error', message : 'Not a valid Tank. Please try later.',
                     buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
                    });
                    $(this).val('');
                    $('#hdn_tank_num').val('');
                    $('#hdn_tank_id').val('');
                }   
         }
       });
  }

  //Autocomplete function to fetch the po numbers
if($("#po_number").length > 0){
  $("#po_number").autocomplete({
       source:  appHome+'/insurancepo/get_po_no_list',
       minLength: 2,
       type: "GET",
       success: function (event, ui) {
        
       },
     select: function (event, ui) {
     $(this).val(ui.item.label);
     $('#hdn_po_num').val(ui.item.label);
     $('#hdn_po_id').val(ui.item.value);
     getPoTankNumbers(ui.item.value);
     return false;
     },
     change: function (event, ui) {
          if (ui.item === null) {
             BootstrapDialog.show({title: 'Error', message : 'Not a valid PO. Please try later.',
        buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
             });
             $('#po_number').val('');
             $('#hdn_po_num').val('');
             $('#hdn_po_id').val('');
          }
     }
   });
}

//Autocomplete function to fetch the job numbers
if($("#job_number").length > 0){
  $("#job_number").autocomplete({
       source:  appHome+'/insurancepo/get_job_no_list',
       minLength: 2,
       type: "GET",
       success: function (event, ui) {
        
       },
     select: function (event, ui) {
     $(this).val(ui.item.label);
     $('#hdn_job_num').val(ui.item.label);
     $('#hdn_job_id').val(ui.item.value);
     $('#customer').val(ui.item.customer);
     $('#customer_id').val(ui.item.customer_id);
     $('#sea_type').val(ui.item.seatype);
     $('#sea_type_id').val(ui.item.seatypeid);
     $('#product').val(ui.item.product);
     $('#product_id').val(ui.item.product_id);
     $('#tank_num').val(ui.item.tank_num);
     $('#hdn_tank_id').val(ui.item.tank_num_id);
     $('#hdn_tank_num').val(ui.item.tank_num);
     return false;
     },
     change: function (event, ui) {
          if (ui.item === null) {
             BootstrapDialog.show({title: 'Error', message : 'Not a valid Job. Please try later.',
        buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
             });
             $('#job_number').val('');
             $('#hdn_job_num').val('');
             $('#hdn_job_id').val('');
             $('#customer').val('');
             $('#customer_id').val('');
             $('#sea_type').val('');
             $('#sea_type_id').val('');
             $('#product').val('');
             $('#product_id').val('');
             $('#tank_num').val('');
             $('#hdn_tank_id').val('');
             $('#hdn_tank_num').val('');
          }
     }
   });
  }
}

$('.insurance_create,.insurance_update').click(function(e){

  $('.highlight').removeClass('highlight');
  e.preventDefault();
  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      path = $(this).attr('data-path');

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
  
  highlight($('#insurer_invol'), '');
  highlight($('#actual_currency'), '');
  if($("input[name='job_or_po']:checked").val() == 'job'){
    highlight($('#job_number'), '');
  }else{
    highlight($('#po_number'), '');
  }
  
  
  var check_fields = (success.indexOf(false) > -1);

  /**
   * create-vgm-route
   */
   if($(this).hasClass('insurance_create')){
     if(check_fields === true){
       $('html, body').animate({ scrollTop: 0 }, 400);
       $('form').find('#response').empty().prepend(alert_required).fadeIn();
     } else {
      
       $.ajax({
         type: 'POST',
         url: appHome+'/insurancepo/create_sub_po',
         data: $(form).serialize().replace(/%5B%5D/g, '[]'),
         success: function(response){
           window.location.reload();
           localStorage.setItem('response', response);
           var bottom = $(document).height() - $(window).height();
           $('html, body').animate({ scrollTop: bottom }, 400);
           
         },
         error: function(response){
         $('html, body').animate({ scrollTop: 0 }, 400);
           $('form').find('#response').empty().prepend(alert_error).fadeIn();
         }
       });
     }
   }

   if($(this).hasClass('insurance_update')){
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('#response').empty().prepend(alert_required).fadeIn();
    } else {
    $(this).attr('disabled','disabled');
    var po_id = $('#po_sub_id').val();
      $.ajax({
        type: 'POST',
        url: '../'+po_id+'/update',
        data: $(form).serialize().replace(/%5B%5D/g, '[]'),
        success: function(response){
          window.location.href = $('#returnpath').val();
          localStorage.setItem('response', response);
          $(this).removeAttr('disabled');
        },
        error: function(response){
        $(this).removeAttr('disabled');
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('#response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  }

});

$('#actual_amount').on('click', function() {
	if($(this).val() == '0.00'){	
		$(this).val('');
	}
});

$(document).on('click', '.detailinsurancepo', function(e) {

  var poid = $(this).data('sid');
  var currentVar = $(this);
  currentVar.find('i').toggleClass('fa-plus fa-minus');
  if(currentVar.attr("is-ajax-send") == 0){
    $('<tr class="sub-tr">'
      +'<td style="background-color: #d8d8d8;" colspan="12" class="text-center">'
        +'<i class="fa fa-spinner fa-spin" style="font-size:16px"></i>'
        +'</td>'
      +'</tr>').insertAfter(currentVar.closest('tr'));

    setTimeout(function(){ 
      $.ajax({
            type: 'POST', 
            url: appHome + '/insurancepo/common_ajax',
              data: {
                'action_type' 	: 'insurance_sub_cost',
                'po_id' 		  : poid,
                'from' 			    : 'list-page'
              },
            success: function(response){
              currentVar.closest('tr').next('.sub-tr').html('<td colspan="12" style="background-color: #d8d8d8;" >'+response+'</td>');
          currentVar.attr("is-ajax-send", "1");
          $("[data-toggle=tooltip]").tooltip();
          showCommentMoreLessCommon(50);
          $('[data-toggle="popover"]').popover();
            }
      });
     }, 100);
  }else{
    currentVar.closest('tr').next('.sub-tr').toggle('slow');
  }
});

$(document).on('click', '.detailsLinkedCosting', function(e) {

  var poid = $(this).data('sid');
  var type = $(this).data('type');
  var currentVar = $(this);
  currentVar.find('i').toggleClass('fa-plus fa-minus');
  if(currentVar.attr("is-ajax-send") == 0){
    $('<tr class="sub-tr">'
      +'<td style="background-color: #d8d8d8;" colspan="12" class="text-center">'
        +'<i class="fa fa-spinner fa-spin" style="font-size:16px"></i>'
        +'</td>'
      +'</tr>').insertAfter(currentVar.closest('tr'));

    setTimeout(function(){ 
      $.ajax({
            type: 'POST', 
            url: appHome + '/insurancepo/common_ajax',
              data: {
                'action_type' 	: 'insurance_linked_cost',
                'po_id' 		    : poid,
                'type'          : type
              },
            success: function(response){
              currentVar.closest('tr').next('.sub-tr').html('<td colspan="12" style="background-color: #d8d8d8;" >'+response+'</td>');
          currentVar.attr("is-ajax-send", "1");
          $("[data-toggle=tooltip]").tooltip();
          showCommentMoreLessCommon(50);
          $('[data-toggle="popover"]').popover();
            }
      });
     }, 100);
  }else{
    currentVar.closest('tr').next('.sub-tr').toggle('slow');
  }
});

//view purchase order template
$(document).on('click', '.view_insurance_po', function(e){ 
		$('.view_small_loader').show();
		$('.reset_values').html('');
		var po_id = $(this).data('id');
		$.ajax({ 
			type: 'POST',
			dataType: 'json',
			url: appHome+'/insurancepo/common_ajax',
			data: {
				'po_id' : po_id,
				'action_type' : 'get_po_detail'
				  },
			success: function(response){
				$('.view_small_loader').hide();
				if(response != ""){
					$('#modal_po_no').html(response.po_insurace);
					$('#modal_month').html(response.po_month);
					$('#modal_year').html(response.po_year);
					$('#modal_invol').html(response.invol);
					$('#modal_amt').html(response.amt);
					$('#modal_cur').html(response.cur);
					
				}
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	});

  /*$(document).on('click', '.delete-ins-po', function(e){
    e.preventDefault();
    var file_id = $(this).attr('data-id');
    var path = $(this).attr('data-path');

    BootstrapDialog.confirm('Are you sure you want to delete this PO?', function(result){
        if(result) {
          var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
		  var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';

		  $("#files_btn_div_list").html(ajaxLoader);
          
          $.ajax({
            type: 'POST',
            url: appHome+'/jobtemplate-quotes/common_ajax',
            data: {
            	'file_id' : file_id,
            	'path' : path,
            	'action_type' : 'delete_job_template_file'
            },
            success: function(response){
            	jobFileList(0);
            },
            error: function(response){
              $('html, body').animate({ scrollTop: 0 }, 400);
              $('form').find('#response').empty().prepend(alert_error).fadeIn();
            }
          });
        }
    });
  });*/

  //Delete purchase order
	$(document).on('click', '.delete-ins-po', function(e){
      e.preventDefault();
      
      var delete_url = $(this).attr('href'),
        ins_id = $(this).data('ins-id'),
        $this = $(this),
        return_url = window.location.href;
      if($('#returnpath').val()) {
        return_url = $('#returnpath').val();
      }
      
      BootstrapDialog.confirm('Are you sure you want to delete this Insurance PO?', function(result){
        if(result) {
          $.ajax({
            type: 'POST',
            url: delete_url,
            data: {'ins_id' : ins_id
            },
            success: function(response){
              window.location.href = return_url;
              localStorage.setItem('response', response);
            },
            error: function(response){
              BootstrapDialog.show({title: 'Error', message : 'Unable to delete. Please try later.',
                 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
              });
            }
          });
        } 
      });
    });

    $(document).on('click', '.view_subcost', function(e){
      $('.view_small_loader').show();
      $('.reset_values').html('');
      var po_id = $(this).data('id');
      var sub_category = $(this).data('categ');
      if(sub_category == 'job'){
        $(".typejob").show();
        $(".typepo").hide();
      }else{
        $(".typejob").hide();
        $(".typepo").show();
      }
      $.ajax({ 
        type: 'POST',
        dataType: 'json',
        url: appHome+'/insurancepo/common_ajax',
        data: {
          'po_id' : po_id,
          'action_type' : 'get_subpo_detail'
            },
        success: function(response){
          $('.view_small_loader').hide();
          if(response != ""){
            $('#modal_po_no').html(response.ins_po_number);
            $('#modal_job_no').html(response.ins_job_number);
            $('#modal_tank_no').html(response.ins_tank_number);
            $('#modal_customer').html(response.ins_customer_code);
            $('#modal_sea_type').html(response.ins_sea_type);
            $('#modal_product').html(response.ins_product);
            $('#modal_supplier').html(response.ins_supplier);
          }
        },
        error: function(response){
          BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
             buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
          });
        }
      });
    });

    $(document).on('click', '.delete-sub-cost-btn', function(e){
      e.preventDefault();
      
      var delete_url = $(this).attr('href'),
        ins_id = $(this).data('sub-id'),
        $this = $(this),
        return_url = window.location.href;
      if($('#returnpath').val()) {
        return_url = $('#returnpath').val();
      }
      
      BootstrapDialog.confirm('Are you sure you want to delete this Sub Costing ?', function(result){
        if(result) {
          $.ajax({
            type: 'POST',
            url: delete_url,
            data: {'ins_id' : ins_id
            },
            success: function(response){
              window.location.href = return_url;
              localStorage.setItem('response', response);
            },
            error: function(response){
              BootstrapDialog.show({title: 'Error', message : 'Unable to delete. Please try later.',
                 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
              });
            }
          });
        } 
      });
    });

    function getPoTankNumbers($po_id) {
      ExistSuccess = [];
      $.ajax({
          type: 'POST', 
          url: appHome+'/insurancepo/common_ajax',
          async : false,
          data: {
              'action_type' : 'po_tank_number',
              'po_id'	      : $po_id
          },
          success: function(response){
            var obj = $.parseJSON(response);
            var opt = '<option value=""></option>';
              $.each(obj,function(index, data){
                if(data != null && ' '){
                  opt += '<option value="'+index+'">'+data+'</option>';
                  $('.tank_num_val').html(opt);
                }
              });
              $('.chosen').chosen().trigger("chosen:updated");
          },
          error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
          }
    });
        
    }

    $(document).on('change', '#tank_num_po', function(){
	    $('#hdn_tank_id').val($(this).find(":selected").val());
      $('#hdn_tank_num').val($(this).find(":selected").text());
	  });

    $(document).on('change', '#main_currency', function(e){
      var currency_id = $(this).chosen().val();
      switch_specific_currency_icons(currency_id,'main-currency-change');
     
    });

});//end of document ready

//multiple recharge
$(document).ready(function(){
	$(".enable-multi-recharge").prop("checked", false);
	if($("#multiple-recharge").length < 1) {
		$('.enable-multi-recharge').attr('disabled','disabled');
	}
  $('#main_currency').val('EUR').trigger('chosen:updated');
  $('#main_currency').trigger("change");
});
var reqArray = []; // for requered 
$(document).on('change','.recharge_amount', function(){
	$('.save-multiple-recharge-btn').removeAttr('disabled');
	reqArray.push($(this).attr('data-id'));
	$('#current_id').val(reqArray);
});
$(document).on('change','.enable-multi-recharge', function(){
  var id = $(this).attr('data-id');
    $('.normal-recharge-td_'+id).toggle();
    $('.multiple-recharge-td_'+id).toggle();
    
    $(".multiple-recharge_"+id).prop("checked", false);
    if($("input[name='enable-multi-recharge']:checked").length == 1){
      $('#multiple-recharge-btn').show();
      $('#multiple-recharge-btn').attr('disabled','disabled');
    }else if($("input[name='enable-multi-recharge']:checked").length == 0){
      $('#multiple-recharge-btn').hide();
      $('#multiple-recharge-btn').attr('disabled','disabled');
    }
    
  
  

});
$(document).on('change','.multiple-recharge', function(){
	if($('.multiple-recharge:checkbox:checked').length > 0){
		$('#multiple-recharge-btn').removeAttr('disabled');
	}else{
		$('#multiple-recharge-btn').attr('disabled','disabled');
	} 
});

$(document).on('click','#multiple-recharge-btn', function(){

  var job = [];
  var po = [];

  $.each($("input[name='multiple-recharge[]']:checked"), function(){
    job.push(JSON.parse($(this).val()));
  });
  
  $.each($("input[name='multiple-rechargepo[]']:checked"), function(){
    po.push(JSON.parse($(this).val()));
  });

  $('#job').val(JSON.stringify(job));
  $('#po').val(JSON.stringify(po));
  
});

$(document).on('change','#main_currency', function(){

  var cur  = $(this).val();
  var bcur = $(this).data('cur');
  if(cur =="EUR"){
    var pototal     = $('#po_total').data('val');
    var conseqCosts = $('#consequential_costs').data('val');
    var excess      = $('#excess').data('val');
    var claimTotal  = $('#claimable_total').data('val');

    $('#po_total').val(pototal);
    $('#consequential_costs').val(conseqCosts);
    $('#excess').val(excess);
    $('#claimable_total').val(claimTotal);
  }else{
    $.ajax({ 
      type: 'POST',
      url: appHome+'/insurancepo/common_ajax',
      data: {
        'currency'    : cur,
        'action_type' : 'get_exchange_rate'
          },
      success: function(response){
            $('.view_small_loader').hide();
            var pototal     = $('#po_total').data('val');
            var conseqCosts = $('#consequential_costs').data('val');
            var excess      = $('#excess').data('val');
            var claimTotal  = $('#claimable_total').data('val');

        if(response != ""){
            var pototal     = (pototal * response).toFixed(2);
            var conseqCosts = (conseqCosts * response).toFixed(2);
            var excess      = (excess * response).toFixed(2);
            var claimTotal  = (claimTotal * response).toFixed(2);
          
            $('#po_total').val(pototal);
            $('#consequential_costs').val(conseqCosts);
            $('#excess').val(excess);
            $('#claimable_total').val(claimTotal);         
        }
      },
      error: function(response){
        BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
          buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
        });
      }
    });
  }
});