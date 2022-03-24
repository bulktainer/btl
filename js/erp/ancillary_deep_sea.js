(function() {

  $(window).load(function() {
	$('.tab-pane').addClass('anillary-height');
    $('.anillary-height').css('position', 'relative');
  });

})(); 

$(document).ready(function(){
	$('.save-deep-sea, .update-deep-sea').on('click', function(e) {
		$('.highlight').removeClass('highlight');
		e.preventDefault();
	    validateFormAcillary($(this));
	    return false;
	});
	
	function validateFormAcillary($button) {
	    var $this = $button
	        $form = $this.closest('form'),
	        path = $this.attr('data-path'),
	        returnPath = path + '/index?' + $('input[name="returnpathds"]').val();

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
		    
		    highlight($('#supplier_id'), '');
		    highlight($('#valid_from'), '');
		    highlight($('#country'), '');
		    highlight($('#category'), '');
		    highlight($('#job_type'), '');
		    highlight($('#curr_id'), '');
		    highlight($('#price'), '');
		    
	    var check_fields = (success.indexOf(false) > -1);

	    /**
	    * save supplier cost
	    */
	    if($this.hasClass('save-deep-sea')){
	      if(check_fields){
	        $('html, body').animate({ scrollTop: 0 }, 400);
	        $('form').find('#response').empty().prepend(alert_required).fadeIn();
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
	          }
	        });
	      }
	    }

	    /**
	    * update supplier cost
	    */
	    if($this.hasClass('update-deep-sea')){
	      if(check_fields){
	        $('html, body').animate({ scrollTop: 0 }, 400);
	        $('form').find('#response').empty().prepend(alert_required).fadeIn();
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
	          }
	        });
	      }
	    }

	  }
	
	$('#ancillary-deep-sea-form').on('change', 'select#supplier_id', function(e) {
		e.preventDefault();
		var $this = $(this),
	        supplier_id = $this.find(':selected').text();
	    	$("#supplier").val(supplier_id);
	    	
	    	if($('#supplier').val() == ""){
				$("#curr_id").prop('disabled',false).trigger('chosen:updated');
				
			}else{
				getSuppCurrency();//To get the currency of supplier
			}
	});
	/*
	 * Get currency from Supplier
	 */
	function getSuppCurrency(){
		var suppler_id = $('#supplier_id').val();
		 $.ajax({
		        type: 'POST',
		        url: appHome+'/supplier-ancillary/common_ajax',
		        data: {
		      	  'action_type' 	: 'get_supp_cur_deep_sea',
		      	  'suppler_id' 		: suppler_id,
		      	},
		        success: function(response){
			        	$('#curr_id').val(response).chosen().trigger("chosen:updated");
			        	$("#curr_id").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
		        }
		  });
	}
	
	if(($('#supplier_id').val() != "") && ($('#form_type').val() == 'edit')){
    	$("#curr_id").prop('disabled',true).trigger('chosen:updated').prop('disabled',false);
	}
	
	//Page size change
    $(document).on('change', '#country', function(){
    	var country_iso = $('#country').val();
      $.ajax({
	        type: 'POST',
	        url: appHome+'/supplier-ancillary/common_ajax',
	        data: {
	      	  'action_type' 	: 'get_city',
	      	  'country_iso' 	: country_iso,
	      	},
	        success: function(response){
	        	var obj = $.parseJSON(response);
	        	var opt = '<option value=""></option>';
	        		$.each(obj,function(index, data){
	        		opt += '<option value="'+data.id+'">'+data.name+'</option>';
	        		});
	        		$('#city').html(opt).trigger("chosen:updated");
	        	//$('.chosen').chosen().trigger("chosen:updated");
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	  });
    });
    
    if(($('#country').val() != "") && ($('#city').val() == "") && ($('#form_type').val() == 'edit')){
    	$('#country').trigger('change');
    }
  //Ancillary Rate Listing Page Filter 
    $('#ancillary-deep-sea-filter').on('click', function(e) {
          e.preventDefault();
          $("#page").val(0);
          $('#response').empty();
          ancillary_deep_sea_listing();
    });
    //ancillary listing
    function ancillary_deep_sea_listing(){
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
            $("#ancillary-deep-sea-list").html(response);
            $('.btl_relative').hide();
            $("#totalrecords").val($("#totalrecordcount").val()); 
            $("#rec-count").text($("#totalrecordcount").val());
            $('html, body').animate({ scrollTop: 0 }, 400);
            applySortClass();
            if($('#page_name').val() == "ancillary-deep-sea-listing"){
         		$('#totalrecords').val($('#totalrecordcount').val());
         	}
          },
          error: function(response){
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_error).fadeIn();
            $('.btl_relative').hide();
          }
        });
    }
    
    $(document).on('change', '#activity', function(){
    	if($(this).val()  == "DEMTK"){
    		$('#sq').prop('checked', false);
    		$('#sq').val('0');
    		$("#sq").attr("disabled", true);
    		$('.dactivity').show();
    		$('.price_section').addClass('input-group');
    		 
    	}else{
    		$("#sq").removeAttr("disabled");
    		$('.dactivity').hide();
    		$('.price_section').removeClass('input-group');
    	}
    	
    });
    
    $('#activity').trigger('change');
    
  //Function for End Date Undisclosed 
	$('#no_end_validity').change(function() {
	    if($(this).prop("checked")){
			previous_valid_unditl_date = $('input[name="valid_to"]').val();
			$('input[name="valid_to"]').attr('readonly','true');		
			$('input[name="valid_to"]').datepicker( "option", "disabled", true );
			$('input[name="valid_to"]').hide();
			$("#dummy_date").show();
			$('input[name="valid_to"]').val($("#max_validity").val());
		} else {
			$('input[name="valid_to"]').removeAttr('readonly');
			$('input[name="valid_to"]').datepicker( "option", "disabled", false );
			$("#dummy_date").hide();
			$('input[name="valid_to"]').show();
			$('input[name="valid_to"]').val(previous_valid_unditl_date);
		}
	});
	
	$(document).on('click', '.detDeepSea', function(e) {

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
			        url: appHome+'/supplier-ancillary/common_ajax',  
			        async : false,
			        data:  $('form').serialize() +
						'&dsCountry=' + currentVar.attr('data-country') +
						'&dsCategory=' + currentVar.attr('data-category')+
						'&action_type=' + 'get-ds-details'
					,
			        success: function(response){
			        	currentVar.closest('tr').next('.sub-tr').html('<td colspan="12" class="text-center" style="background-color: #d8d8d8;" >'+response+'</td>');
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
	
	$(document).on('click', '.delete-ancillry-btn', function(e) {
	      e.preventDefault();
	      var ds_id = $(this).attr('data-id'),
	          path = $(this).attr('data-path'),
	          returnPath = path + '/index?' + $('input[name="returnpathds"]').val();
	      BootstrapDialog.confirm('Are you sure you want to delete this Deep sea Ancillary rate?', function(result){
	        if(result) {
	          $.ajax({
	            type: 'POST',
	            url: path+'/'+ds_id+'/delete',
	            success: function(response){
	              if($("#page-name").val() == "storage-listing"){
	            	  ancillary_deep_sea_listing();
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
	$('#ancillary-deep-sea-filter').trigger('click');
	
	$(document).on('click', '.ds-edit-btn,.ds-add-btn', function(e) {
	    e.preventDefault();
	    saveDsFilters($(this));
	});
	
	$('.goback-deep-sea').on('click', function(e) {
	    e.preventDefault();
	    var returnPath = $(this).attr("href") + '?' + $('input[name="returnpathds"]').val();
	    window.location.href = returnPath;
	});
	
	function saveDsFilters($this){
		  var filterVals = $('form').serialize();
		  var linklocation = $this.attr("href");

		  $.ajax({
		      url: appHome+'/supplier-ancillary/common_ajax',
		      type: 'post',
		      dataType: 'text',
		      data : {
		          'action_type' : 'keep_index_dsfilter',
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

	    ancillary_deep_sea_listing();
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
	
	//Pagination button
	$(document).on('click', '.first-page', function(){
		var pageNumber = $(this).data('pagenumber');
		$('#page').val(pageNumber);
		ancillary_deep_sea_listing();
	});


	//Pagination button
	$(document).on('click', '.last-page', function(){
		var pageNumber = $(this).data('pagenumber');
		$('#page').val(pageNumber);
		ancillary_deep_sea_listing();
	});

	//Pagination button
	$(document).on('click', '.next-page', function(){
		var pageNumber = $(this).data('pagenumber');
		$('#page').val(pageNumber);
		ancillary_deep_sea_listing();
	});


	//Pagination button
	$(document).on('click', '.prev-page', function(){
		var pageNumber = $(this).data('pagenumber');
		$('#page').val(pageNumber);
		ancillary_deep_sea_listing();
	});

	//Page size change
	$(document).on('change', '.page-limit', function(){
		var pageSize = $(this).val();
		$('#pagesize').val(pageSize);
		$('#page').val(0);
		ancillary_deep_sea_listing();
	});
	
});//end of document ready
