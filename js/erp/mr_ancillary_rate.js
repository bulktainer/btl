(function() {

  $(window).load(function() {
    //var active = $('.tab-pane.active,.anillary-height').height();
	$('.tab-pane').addClass('anillary-height');
    $('.anillary-height').css('position', 'relative');
  });

})();  //End of first f

$(document).ready(function(){
	//Currency change
	$(document).on('change','#curr_id', function(){
	      var currency = $(this).val();
	      var fa = $('.icon_change i.fa');
	      var currency_name = $(this).find("option:selected").text().toUpperCase();
	      $("#curr_name").val(currency_name);
	      if (currency_having_symbols.indexOf(currency_name) >= 0) {
	        $(fa).removeClass().addClass('fa fa-' + currency_name.toLowerCase() ).html("");
	      }
	      else {
	        $(fa).removeClass().addClass('fa').html(currency_name);
	      }
	});
	
	//walkway
	$('.other-add-btn-walk').live('click',function(){
		$(this).hide();
		var subtypeval = getSubWalk();
		$('.walkway_set').append(subtypeval);
		hideMinusButtonSingleWalkway();
		$('#curr_id').trigger('change');
		$('.comm_cur').trigger('change');
				
	});

	function getSubWalk(){
	    var wcount = $('.walkcount').length;
	    var opt	= '<div class="form-group" >'
	    	+'<input type="hidden" name="walkway_ids[]" class="walkway_ids walkcount" value="new">'
	    /*	+'<div class="col-sm-2 col-md-2">'
	    	+'<input class="form-control commw_length" name="walk_length['+wcount+']" placeholder="" type="text" value="" onKeyPress="return NumberValuesOnly(this,event);" onchange="return NonDecimalNumber(this);" autocomplete="off" onpaste="return false;" maxlength="4">'
	    +'</div>'*/

	    +'<div class="col-sm-2 col-md-2">'
	    +'<input class="form-control commw_width sty" name="walk_width['+wcount+']" placeholder="" type="text" value="" onkeypress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off"  onpaste="return false;" maxlength="8">'
	    +'</div>'

	    +'<div class="col-sm-2 col-md-2 usdcur">'
	    +'<div class="input-group">'
	    +'<span class="input-group-addon icon_change"><i class="fa fa-eur"></i></span>'
	    +'<input type="text" class="form-control commw_cur sty" name="walk_price['+wcount+']" value="" onkeypress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off" onpaste="return false;" maxlength="8" />'
	    +'</div>'
	    +'</div>'

	    +'<div class="col-sm-2 col-md-2">'
	    +'<div class="input-group">'
	    +'<span class="input-group-addon"><i class="fa fa-usd"></i></span>'
	    +'<input type="text" class="form-control sty" name="walk_usd_price['+wcount+']" id="walk_way_usd" value="" onkeypress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off" onpaste="return false;" maxlength="8" readonly/>'
	    +'</div>'
	    +'</div>'
	    
	    +'<div class="col-sm-2 col-md-2">'
	    +'<input class="form-control" name="walk_reason['+wcount+']" placeholder="" type="text" value="" autocomplete="off" maxlength="30">'
	    +'</div>'
	    +'<div class="col-sm-2 col-md-2">'
	    +'<a class="btn btn-success other-add-btn-walk"><span class="glyphicon glyphicon-plus-sign"></span></a>'
	    +'<a class="btn btn-danger other-sub-btn-walk"><span class="glyphicon glyphicon-minus-sign"></span></a>'
	    +'</div>'
	    +'</div>';
	    return opt;
	}

		$('.other-sub-btn-walk').live('click',function(){
		if($('.other-sub-btn-walk').length > 1){
			$(this).parents('div').eq(1).remove();
			$('.other-add-btn-walk').last().show();
			hideMinusButtonSingleWalkway();
		}
		
	});

		hideMinusButtonSingleWalkway();
	//Function to hide the minus button when single plus button is present
	function hideMinusButtonSingleWalkway(){
		$('.other-add-btn-walk').hide();
		$('.other-add-btn-walk').last().show();
		if($('.other-add-btn-walk').length == 1){
			$('.other-sub-btn-walk').hide();
		}else{
			$('.other-sub-btn-walk').show();
		}
	}

	//cladding
	$('.other-add-btn-clad').live('click',function(){
		$(this).hide();
		var subtypeval = getSubClad();
		$('.cladding_set').append(subtypeval);
		
		hideMinusButtonSingleClad();
		$('#curr_id').trigger('change');
		$(".commw_cur").trigger('change');
	});

	function getSubClad(){
		var cladcount = $('.cladcount').length;
	    var opt	= '<div class="form-group" >'
	    	+'<input type="hidden" name="cladding_ids[]" class="cladding_ids cladcount" value="new">'
	    	+'<div class="col-sm-2 col-md-2">'
	    	+'<input class="form-control comm_length sty" name="clad_length['+cladcount+']" placeholder="" type="text" value="" onkeypress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off" onpaste="return false;" maxlength="8">'
	    +'</div>'

	    +'<div class="col-sm-2 col-md-2">'
	    +'<input class="form-control comm_width sty" name="clad_width['+cladcount+']" placeholder="" type="text" value="" onkeypress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off"  onpaste="return false;" maxlength="8">'
	    +'</div>'

	    +'<div class="col-sm-2 col-md-2 usdcur">'
	    +'<div class="input-group">'
	    +'<span class="input-group-addon icon_change"><i class="fa fa-eur"></i></span>'
	    +'<input type="text" class="form-control comm_cur sty" name="clad_price['+cladcount+']" value="" onkeypress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off" onpaste="return false;" maxlength="8" />'
	    +'</div>'
	    +'</div>'

	    +'<div class="col-sm-2 col-md-2">'
	    +'<div class="input-group">'
	    +'<span class="input-group-addon"><i class="fa fa-usd"></i></span>'
	    +'<input type="text" class="form-control sty" name="clad_usd_price['+cladcount+']" id="usd_com_cur" value="" onkeypress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off" onpaste="return false;" maxlength="8" readonly/>'
	    +'</div>'
	    +'</div>'
	    
	    +'<div class="col-sm-2 col-md-2">'
	    +'<input class="form-control"  name="clad_reason['+cladcount+']"  placeholder="" type="text" value="" autocomplete="off" maxlength="30">'
	    +'</div>'
	    +'<div class="col-sm-2 col-md-2">'
	    +'<a class="btn btn-success other-add-btn-clad"><span class="glyphicon glyphicon-plus-sign"></span></a>'
	    +'<a class="btn btn-danger other-sub-btn-clad"><span class="glyphicon glyphicon-minus-sign"></span></a>'
	    +'</div>'
	    +'</div>';
	    return opt;
	}

		$('.other-sub-btn-clad').live('click',function(){
		if($('.other-sub-btn-clad').length > 1){
			$(this).parents('div').eq(1).remove();
			$('.other-add-btn-clad').last().show();
			hideMinusButtonSingleClad();
		}
		
	});

		hideMinusButtonSingleClad();
	//Function to hide the minus button when single plus button is present
	function hideMinusButtonSingleClad(){
		$('.other-add-btn-clad').hide();
		$('.other-add-btn-clad').last().show();
		if($('.other-add-btn-clad').length == 1){
			$('.other-sub-btn-clad').hide();
		}else{
			$('.other-sub-btn-clad').show();
		}
	}

	/*****/

	//Tank Buffer
	$('.other-add-btn-tk').live('click',function(){
		$(this).hide();
		var subtypeval = getSubTk();
		$('.tk_set').append(subtypeval);
		hideMinusButtonSingleTk();
		$('#curr_id').trigger('change');
		$('.comm_cur').trigger('change');
				
	});

	function getSubTk(){
	    var wcount = $('.tkcount').length;
	    var opt	= '<div class="form-group" >'
	    +'<input type="hidden" name="tk_ids[]" class="tk_ids tkcount" value="new">'
	    +'<div class="col-sm-2 col-md-2">'
	    +'<input class="form-control" name="tank_buffer_percen['+wcount+']" placeholder="" type="text" value="" autocomplete="off" maxlength="30">'
	    +'</div>'

	    +'<div class="col-sm-2 col-md-2 usdcur">'
	    +'<div class="input-group">'
	    +'<span class="input-group-addon icon_change"><i class="fa fa-eur"></i></span>'
	    +'<input type="text" class="form-control commw_cur sty" name="tank_buffer_price['+wcount+']" value="" onkeypress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off" onpaste="return false;" maxlength="8" />'
	    +'</div>'
	    +'</div>'

	    +'<div class="col-sm-2 col-md-2">'
	    +'<div class="input-group">'
	    +'<span class="input-group-addon"><i class="fa fa-usd"></i></span>'
	    +'<input type="text" class="form-control sty" name="tank_buffer_usd_price['+wcount+']" id="walk_way_usd" value="" onkeypress="return NumberValues(this,event);" onchange="return decimalNumber(this);" autocomplete="off" onpaste="return false;" maxlength="8" readonly/>'
	    +'</div>'
	    +'</div>'
	    
	    +'<div class="col-sm-2 col-md-2">'
	    +'<a class="btn btn-success other-add-btn-tk"><span class="glyphicon glyphicon-plus-sign"></span></a>'
	    +'<a class="btn btn-danger other-sub-btn-tk"><span class="glyphicon glyphicon-minus-sign"></span></a>'
	    +'</div>'
	    +'</div>';
	    return opt;
	}

		$('.other-sub-btn-tk').live('click',function(){
		if($('.other-sub-btn-tk').length > 1){
			$(this).parents('div').eq(1).remove();
			$('.other-add-btn-tk').last().show();
			hideMinusButtonSingleTk();
		}
		
	});

		hideMinusButtonSingleTk();
	//Function to hide the minus button when single plus button is present
	function hideMinusButtonSingleTk(){
		$('.other-add-btn-tk').hide();
		$('.other-add-btn-tk').last().show();
		if($('.other-add-btn-tk').length == 1){
			$('.other-sub-btn-tk').hide();
		}else{
			$('.other-sub-btn-tk').show();
		}
	}


	/*****/

	$('.save-mr-ancillaries-data, .update-mr-ancillaries-data').on('click', function(e) {
		$('.highlight').removeClass('highlight');
		e.preventDefault();
	    validateFormAcillary($(this));
	    return false;
	});

	function validateFormAcillary($button) {
	    var $this = $button
	        $form = $this.closest('form'),
	        path = $this.attr('data-path'),
	        returnPath = path + '/index?' + $('input[name="returnpath"]').val();

	    success = [];
	   var master_id = $('#master_id').val();

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
		    
		    highlight($('#address_id'), '');
		    highlight($('#town'), '');
		    highlight($('#supplier_id'), '');
		    highlight($('#curr_id'), '');
		    //highlight($('#from_date'), '');
		    //highlight($('#to_date'), '');
		    
			    /*$('.comm_length').each(function(){
			    	      highlight($(this), '');
			    });
			    $('.comm_width').each(function(){
			    	      highlight($(this), '');
			    });
			    $('.comm_cur').each(function(){
		    	      highlight($(this), '');
			    });
			    $('.commw_length').each(function(){
		    	      highlight($(this), '');
			    });
			    $('.commw_width').each(function(){
		    	      highlight($(this), '');
			    });
			    $('.commw_cur').each(function(){
			    	highlight($(this), '');
			    });*/
			    $('.sub_req').each(function(){
			    	highlight($(this), '');
			    });
			    
	    var check_fields = (success.indexOf(false) > -1);

	    /**
	    * save supplier cost
	    */
	    if($this.hasClass('save-mr-ancillaries-data')){
	      if(check_fields){
	        $('html, body').animate({ scrollTop: 0 }, 400);
	        $('form').find('#response').empty().prepend(alert_required).fadeIn();
	        //$('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  
	      } else {
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
	            //$('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  
	          }
	        });
	      }
	    }

	    /**
	    * update supplier cost
	    */
	    if($this.hasClass('update-mr-ancillaries-data')){
	      if(check_fields){
	        $('html, body').animate({ scrollTop: 0 }, 400);
	        $('form').find('#response').empty().prepend(alert_required).fadeIn();
	        //$('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  
	      } else {
	        $.ajax({
	          type: 'POST',
	          url: path+'/'+master_id+'/edit',
	          data: $form.serialize().replace(/%5B%5D/g, '[]'),
	          success: function(response){
	            window.location.href = returnPath;
	            localStorage.setItem('response', response);
	          },
	          error: function(response){
	            $('html, body').animate({ scrollTop: 0 }, 400);
	            $('form').find('#response').empty().prepend(alert_error).fadeIn();
	            //$('.tab-content').css({ height: $('.tab-pane').height() }); //resizes the page  
	          }
	        });
	      }
	    }

	  }

	$('#mr-ancillary-form').on('change', 'select#address_id', function(e) {
		  var $this = $(this),
		      address_code = $this.find(':selected').text();

		  $("#address_code").val(address_code);
	});
	$('#mr-ancillary-form').on('change', 'select#supplier_id', function(e) {
	    var $this = $(this),
	        supplier_id = $this.find(':selected').text();
	    	$("#supplier").val(supplier_id);
	    	
	    	if($('#supplier').val() == ""){
				$("#curr_id").prop('disabled',false).trigger('chosen:updated');
				
			}else{
				getSuppCurrency();//To get the currency of supplier
			}
	});
	
	if($('#form_type').val() == 'edit'){
		var changeArr = new Array();
		$('.comm_cladding').live('change',function(){
			var cost_id = $(this).attr("data-priceid");
			var idx 	= $.inArray(cost_id, changeArr);
			if (idx == -1) {
				changeArr.push( cost_id );
			}
			$('#cladding_change').val(changeArr);
		});
		
		var removeArr = new Array();
		$('.remove_edit').live('click',function(){
			var cost_id = $(this).attr("data-priceid");
			var idx 	= $.inArray(cost_id, removeArr);
			if (idx == -1) {
				removeArr.push( cost_id );
			}
			changeArr = $.grep(changeArr, function(value) {
				  return value != cost_id;
			});
			$('#cladding_delete').val(removeArr);
			$('#cladding_change').val(changeArr);
		});
		
		var wchangeArr = new Array();
		$('.comm_walkway').live('change',function(){
			var cost_id = $(this).attr("data-priceid");
			var idx 	= $.inArray(cost_id, wchangeArr);
			if (idx == -1) {
				wchangeArr.push( cost_id );
			}
			$('#walkway_change').val(wchangeArr);
		});
		
		var wremoveArr = new Array();
		$('.wremove_edit').live('click',function(){
			var cost_id = $(this).attr("data-priceid");
			var idx = $.inArray(cost_id, wremoveArr);
			if (idx == -1) {
				wremoveArr.push( cost_id );
			}
			wchangeArr = $.grep(wchangeArr, function(value) {
				  return value != cost_id;
			});
			$('#walkway_delete').val(wremoveArr);
			$('#walkway_change').val(wchangeArr);
		});

		var tkchangeArr = new Array();
		$('.comm_tk').live('change',function(){
			var cost_id = $(this).attr("data-priceid");
			var idx 	= $.inArray(cost_id, tkchangeArr);
			if (idx == -1) {
				tkchangeArr.push( cost_id );
			}
			$('#tk_change').val(tkchangeArr);
		});
		
		var tkremoveArr = new Array();
		$('.tkremove_edit').live('click',function(){
			var cost_id = $(this).attr("data-priceid");
			var idx = $.inArray(cost_id, tkremoveArr);
			if (idx == -1) {
				tkremoveArr.push( cost_id );
			}
			tkchangeArr = $.grep(tkchangeArr, function(value) {
				  return value != cost_id;
			});
			$('#tk_delete').val(tkremoveArr);
			$('#tk_change').val(tkchangeArr);
		});
	}
	
	if($('#form_type').val() == 'edit'){
	$("#curr_id").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
	$('#curr_id').trigger('change');
}

/*
 * Get currency from Supplier
 */
function getSuppCurrency(){
	var suppler_id = $('#supplier_id').val();
	 $.ajax({
	        type: 'POST',
	        url: appHome+'/supplier-ancillary/common_ajax',
	        data: {
	      	  'action_type' 	: 'get_supp_currency',
	      	  'suppler_id' 		: suppler_id,
	      	},
	        success: function(response){
	        	var jsonObj = JSON.parse(response);
	        	if(jsonObj.master_id == null){
		        	$('#curr_id').val(jsonObj.cur_id).chosen().trigger("chosen:updated");
		        	$('#curr_id').trigger("change");
		        	$("#curr_id").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
		        	if(suppler_id == 'TBC'){
						$("#curr_id").prop('disabled',false).trigger('chosen:updated');
					}
	        	}else{
	        		BootstrapDialog.show({title: 'Warning', message : 'M&R ancillary rates are already created for this supplier.To update the rates please click here <a target="_blank" href="'+appHome+ '/supplier-ancillary/mr-ancillaries-data/'+ jsonObj.master_id +'/edit">#'+jsonObj.master_id+'</a>',
	        			buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],
	        		});
	        		$('#supplier_id').val('').chosen().trigger("chosen:updated");
	        		$('#supplier').val('');
	        	}
	        }
	  });
}
if($('#form_type').val() == "edit"){
	$("#supplier_id").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
}

$('#mr_Test').click(function(){
    $('#mr_Test i').toggleClass('fa-minus-circle fa-plus-circle');    
});
$('#mr_General_MR').click(function(){
    $('#mr_General_MR i').toggleClass('fa-minus-circle fa-plus-circle');    
});
$('#mr_Parts').click(function(){
    $('#mr_Parts i').toggleClass('fa-minus-circle fa-plus-circle');    
});
$('#mr_Damages').click(function(){
    $('#mr_Damages i').toggleClass('fa-minus-circle fa-plus-circle');    
});
$('#mr_Cleaning').click(function(){
    $('#mr_Cleaning i').toggleClass('fa-minus-circle fa-plus-circle');    
});

$('#mr_Modifications').click(function(){
    $('#mr_Modifications i').toggleClass('fa-minus-circle fa-plus-circle');    
});

//To get the country name
$(document).on('change', '#town', function(e){
    //           ↓
    var label=$('#town :selected').parent().attr('label');
    $('#country').val(label);
});

$(document).on('click', '.detailancillary', function(e) {

		var costid = $(this).data('sid');
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
			        url: appHome + '/supplier-ancillary/common_ajax',
		          	data: {
		            	'action_type' 	: 'supp_ancillary_data',
		            	'supp_id' 		: costid,
		            	'from' 			: 'list-page'
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

});//end of document ready

if($("#page-name").val() == "ancillary-listing"){
    ancillary_listing();

    //Pagination button
    $(document).on('click', '.first-page, .last-page, .next-page, .prev-page', function(){
      var pageNumber = $(this).data('pagenumber');
      $('#page').val(pageNumber);
      ancillary_listing();
    });

    //Page size change
    $(document).on('change', '.page-limit', function(){
      var pageSize = $(this).val();
      $('#pagesize').val(pageSize);
      $('#page').val(0);
      ancillary_listing();
    });
}

//Ancillary Rate Listing Page Filter 
$('#ancillary-filter').on('click', function(e) {
      e.preventDefault();
      $("#page").val(0);
      $('#response').empty();
      ancillary_listing();
});
//ancillary listing
function ancillary_listing(){
    var path = $("#listing-path").val(); 
    var h = $('.overlay-complete-loader').height();
    if(h == 0) { h = 100; }
    $('.btl_overlay').height(h); 
    $('.btl_relative').show(); 

    $.ajax({
      type: 'POST',
      url: path,
      data: $('form').serialize(),
      success: function(response){
        $("#ancillary-list").html(response);
        $('.btl_relative').hide();
        $("#totalrecords").val($("#totalrecordcount").val()); 
        $("#rec-count").text($("#totalrecordcount").val());
        $('html, body').animate({ scrollTop: 0 }, 400);
      },
      error: function(response){
        $('html, body').animate({ scrollTop: 0 }, 400);
        $('form').find('#response').empty().prepend(alert_error).fadeIn();
        $('.btl_relative').hide();
      }
    });
}
$('.local_currency').live('change',function(){
	var local_cur_id = $("#curr_id").val();
	if(local_cur_id.length>0){				
		var amt = $(this).val();
 		var convertedcost = convert_amt_to_USD(amt,local_cur_id).toFixed(2);
    	$(this).parents(".usdcur").first().next().find("#usd_currency_rate").val(convertedcost);
    }
});

$('.comm_cur').live('change',function(){
	var local_cur_id = $("#curr_id").val();
	if(local_cur_id.length>0){				
		var amt = $(this).val();
 		var convertedcost = convert_amt_to_USD(amt,local_cur_id).toFixed(2);
    	$(this).parents(".usdcur").first().next().find("#usd_com_cur").val(convertedcost);
    }
});

$('.commw_cur').live('change',function(){
	var local_cur_id = $("#curr_id").val();
	if(local_cur_id.length>0){				
		var amt = $(this).val();
 		var convertedcost = convert_amt_to_USD(amt,local_cur_id).toFixed(2);
    	$(this).parents(".usdcur").first().next().find("#walk_way_usd").val(convertedcost);
	}
});

$('#ancillary-list').on('click', '.delete-ancillry-btn', function(e) {
      e.preventDefault();
      var price_id = $(this).attr('data-price-id'),
          m_id = $(this).attr('data-id'),
          path = $(this).attr('data-path'),
          returnPath = path + '/index?' + $('input[name="returnpath"]').val();
      BootstrapDialog.confirm('Are you sure you want to delete this Ancillary Rate?', function(result){
        if(result) {
          $.ajax({
            type: 'POST',
            url: path+'/'+price_id+'/delete',
            data: { 'm_id' : m_id } ,
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
function convert_amt_to_USD($amt,$local_currency){
  var rate = get_rate($local_currency,3);
  if(!rate) {
    alert('Error. No exchange rate found.');
    return false;
  }

  var converted_cost = ($amt * rate);
  return isNaN(converted_cost) ? 0 : converted_cost;
}
function get_rate(currency_from, currency_to) {
  var $rate = $('[data-from="'+currency_from+'"][data-to="'+currency_to+'"]');

  if(currency_from == currency_to) {
    return 1;
  }

  return $rate.length ? $rate.attr('data-rate') : false;
}

/**
 * document file uplad function
 */
function documentFileUpload(e) {
	
	var filename = $("#fileName").val();
	var filenameCtrl = $("#fileName");
	
	if(filename.trim() != ''){
			uploadPath = $("#fileUploadPath").val();
			
			if(!$('#file_to_upload')[0]) {
				return false;
			}
		
			if(!$('#file_to_upload').val()) {
				$("#upload_btn").attr('disabled','disabled');
				return false;
			}
			
			var fd = new FormData();
			fd.append("file_to_upload", $('#file_to_upload')[0].files[0]);
			fd.append("master_id", $('#file_upload_master_id').val());
			fd.append("new_file_name", $('#fileName').val());
			fd.append("new_file_discription", $('#fileDesc').val());
			var xhr = new XMLHttpRequest();
		
			// file received/failed
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
						$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
						xhr.addEventListener("load", documentFileUploadComplete, false);
						$('#progress_num_uf').addClass(xhr.status == 200 ? "success" : "failure");
					
				}
			};

			xhr.upload.addEventListener("progress", documentFileUploadProgress, false);
			xhr.addEventListener("load", documentFileUploadComplete, false);
			xhr.addEventListener("error", documentFileUploadFailed, false);
			xhr.addEventListener("abort", documentFileUploadCanceled, false);
			xhr.open("POST", uploadPath);
			xhr.send(fd);
	
		}else{
			filenameCtrl.val('');
			filenameCtrl.focus();
		}
}

/**
 * process function
 * @param evt
 */
function documentFileUploadProgress(evt) {
	
	$("#upload_btn").attr('disabled',true);
	var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	$('#progress_num_uf').show();
	$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
	$('#upload-progress-bar').css('width',percentComplete.toString()+ '%');
	$('#upload-progress-bar').data('aria-valuenow',percentComplete.toString());
	$('#upload-progress-bar').html(percentComplete.toString() + '%');
}

/**
 * when upload is failed
 * @param evt
 */
function documentFileUploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

/**
 * if uplad is cancel
 * @param evt
 */
function documentFileUploadCanceled(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
}

/**
 * upload complete
 * @param evt
 */
function documentFileUploadComplete(evt) {
	var master_id = $('#file_upload_master_id').val();
	$("#upload_btn").attr('disabled',true);
	setTimeout( function(){
				  uploadList(master_id);
				  $('#progress_num_uf').hide();
			  }, 1000);
}

function uploadList(master_id){
	
	$('.loadershow').show();
	$formType = $('#form_type').val();
	$('#fileSize,#fileType').html('');
	$("#upload_btn").attr('disabled',true);
	$('#upload-progress-bar').css('width','0%');
	$('#upload-progress-bar').data('aria-valuenow','0');
	$('#upload-progress-bar').html('');
	$('.highlight').removeClass('highlight');
	
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: appHome+'/supplier-ancillary/common_ajax',
		beforeSend: function() {
            // setting a timeout
        	},
		data: {
			'master_id' : master_id,
			'action_type' : 'get_document_list'
			  },
		success: function(response){
			$('.loadershow').hide();
			$('.product-pannel-file-list').show();
			$("#fileName").val('');
			$("#file_to_upload").val('');
			$("#fileDesc").val('');

			var del_class = 'delete_document';
			var mousepointer = "color:red;";
			if($('#upload_btn').length == 0){
				del_class = '';
				mousepointer = "display: none;";
			}
			tddata = "";
			if ( response.length > 0 ) {
				$.each(response, function(i, item) {
					tddata += '<tr>'+
								'<td><a target="_blank" href="'+item.prePath+'">'+item.fileName+'</a></td>'+
								'<td class="text-left" >'+item.docs_description+'</td>'+
								
								'<td class="text-left" >'+item.docDate+'</td>';
					
					tddata +=	'<td class="text-center" ><a target="_blank" title="Download Document" href="'+item.prePath+'"><i class="fa fa-download"></i></a></td>'+
								'<td class="text-center" ><a style="'+mousepointer+'" class="'+del_class+'" data-id="'+item.docs_id+'" href="javascript:void(0);" title="Delete Document"><i class="fa fa-trash-o"></i></a></td>'+								
							 '</tr>';
				});
				
			}else{
				tddata +='<tr id="emptyFilesTr" class="">'+
							'<td style="text-align:center;" colspan="6"><p class="alert alert-warning" style="margin-bottom:0;">No files found.</p></td>'+
						 '</tr>';
			}
			$('#fileAttachment').html(tddata);
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});
}

//file upload start---------------------------------------
	$(document).on('change','#file_to_upload',function(){
		fileSelected();
			
		});

		function fileSelected(){
			var file = document.getElementById('file_to_upload').files[0];
			$('#fileSize,#fileType,#fileExist').show();
			if (file) {
			  var fileSize = 0;
			  if (file.size > 1024 * 1024)
				fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
			  else
				fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
			  
			  var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
			  document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
			  document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
			  document.getElementById('fileName').value = Math.floor((Math.random() * 99999) + 10000) +'-'+fname;
			  document.getElementById("fileName").select(fname);
			 
			}
			
			var file_cntrl = $('#file_to_upload');
			var $messageDiv = $('#upMessage'); 
			if(file_cntrl.val() != "" )
			{
				if(file.size > 20971520){
					$messageDiv.show().html('<font color="red">File should be less than 20 MB </font>'); 
					//setTimeout(function(){ $messageDiv.hide().html('');}, 3000);
					$('#upload_btn').attr('disabled','disabled');
				}else{
					$messageDiv.show().html(''); 
					$("#upload_btn").removeAttr('disabled');
				}
	
			}		
				$('#upload-progress-bar').css('width','0%');
				$('#upload-progress-bar').data('aria-valuenow','0');
				$('#upload-progress-bar').html('');
		}

	$(document).on('click', '.delete_document', function(e){ 
		var doc_id = $(this).data('id');

		BootstrapDialog.show({
         type: BootstrapDialog.TYPE_DANGER,
         title: 'Confirmation',
         message: 'Are you sure want to Delete?',
         buttons: [{
		             label: 'Close',
		             action: function(dialogItself){
		                 dialogItself.close();
		             }
		         },{
	             label: 'Ok',
	             cssClass: 'btn-danger',
	             action: function(dialogItself){
	            	 	dialogItself.close();
	            		$.ajax({
	            			type: 'POST',
	            			url: appHome+'/supplier-ancillary/common_ajax',
	            			data: {
	            				'doc_id' : doc_id,
	            				'action_type' : 'delete_document'
	            				  },
	            			success: function(response){
	            					var consig_id = $('#file_upload_master_id').val();
		            				uploadList(consig_id);
	            			},
	            			error: function(response){
	            				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
	            					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
	            				});
	            			}
	            		});;
	             }
         }]
     });
	});
	$(document).ready(function(){
		uploadList($('#file_upload_master_id').val());

		$(document).on('click', '.doc-uploaded', function(e){ 
			var master_id = $(this).data('id');
			uploadList(master_id);//Show the uploaded file
		});

	});

	$(function() {
		if($("#mr_ancillary_file_form").val() == "1"){
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