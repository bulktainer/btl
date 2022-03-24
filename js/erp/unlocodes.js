$(document).ready(function(){
localStorage.clear();
	
var success = [];	
var requiredFields = ['un_country_code', 'un_locode', 'un_name', 'un_name_wo_diacritics', 'un_latitude_char','un_longitude_char'];
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';

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

function highlight_gname_ary(field, empty_value){
	field.each(function(){
		if($(this).length > 0){
			
			if(field.parents().find('textarea').val() != ""){
				if($(this).val().trim() === empty_value){
			        $(this).parent().addClass('highlight');
			        success.push(false);
			    } else {
			        $(this).parent().removeClass('highlight');
			        success.push(true);
			    }	
			}

	    }	
	})	
}

function checkDuplicateUnLocode() {
	var $un_id = $('#un_id').val();
	var $un_code = $('#un_locode').val();
	var $un_country_code = $('#un_country_code').val();
	
	if($un_code != ""){
		$.ajax({
	        type: 'POST',
	        url: appHome +'/unlocodes/common_ajax',
	        async : false,
	        data: {
				'un_country_code' : $un_country_code,
				'un_locode' : $un_code,
				'un_id'	   : $un_id,
				'action_type' : 'check-duplicate'
			},
	        success: function(response){
	        	if(response > 0){
	        		success.push(false);
	        		$("#un_locode").parent().addClass('highlight');
	        	}else{
	        		$("#un_locode").parent().removeClass('highlight');
	        	}
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
		});
	}
}

//To create and edit the activity
$('.create-unlocode, .edit-unlocode').click(function(e){
	e.preventDefault();
	$('.highlight').removeClass('highlight');
	success = [];
	
	var form = $('#'+$(this).closest('form').attr('id'));
	var path = $("#path").val()

	//Required field validation
    for(var i = 0; i < requiredFields.length; i++) {
      var $field = form.find('[name="'+requiredFields[i]+'"]');
      validateField($field);
    }
	//GeoFence name validation
	highlight_gname_ary($('input[id^=geofence_name]'), '');
	
	if($("#form-type").val() == "add"){
		checkDuplicateUnLocode();	
	}
	
	var check_fields = (success.indexOf(false) > -1);
	
   // Edit
   if($(this).hasClass('edit-unlocode')){
		 var unid = $('#un_id').val();
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	       $(this).prop('disabled','disabled');
	       $.ajax({
	         type: 'POST',
	         url: path + '/' + unid +'/edit',
	         data: $(form).serialize().replace(/%5B%5D/g, '[]'),
	         success: function(response){
	           window.location.href = $('#returnpath').val();
	           localStorage.setItem('response', response);
	         },
	         error: function(response){
	           $('html, body').animate({ scrollTop: 0 }, 400);
	           $('form').find('#response').empty().prepend(alert_error).fadeIn();
	         }
	       });
	     }
   }

   // Create
  if($(this).hasClass('create-unlocode')){
	     if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	     } else {
	       $(this).prop('disabled','disabled');
	       $.ajax({
	         type: 'POST',
	         url: path + '/create',
	         data: $(form).serialize().replace(/%5B%5D/g, '[]'),
	         success: function(response){
	           window.location.href = $('#returnpath').val();
	           localStorage.setItem('response', response);
	         },
	         error: function(response){
	           $('html, body').animate({ scrollTop: 0 }, 400);
	           $('form').find('#response').empty().prepend(alert_error).fadeIn();
	         }
	       });
	     }
	}

  });

	//To delete the corresponding field
	$('.delete-unlocode').on('click', function(e) {
	  e.preventDefault();
	  var id = $(this).attr('data-unlocode-id'),
	      path = $("#path").val();
	
	  BootstrapDialog.confirm('Are you sure you want to delete this UN Locode?', function(result){
	    if(result) {
	      $.ajax({
	        type: 'POST',
	        url: path + '/delete',
	        data: {un_id : id},
	        success: function(response){
	          window.location.href = path+'/index';
	          localStorage.setItem('response', response);
	        },
	        error: function(response){
	          $('html, body').animate({ scrollTop: 0 }, 400);
	          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	        }
	      });
	    }
	  });
	});

});//end of document ready


//Multi select controller
$(document).ready(function(){
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
});


//Page size change
$('.custom-page-pagesize').change(function(e){
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('#search-form').submit();
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	 //e.target // active tab
     //e.relatedTarget // previous tab
	var previousTab = e.relatedTarget.getAttribute('href');
	var currentTab = e.target.getAttribute('href');
	
	$(previousTab).hide();
	$(currentTab).show();
})

//Show last 10 upload history
$('#upload_details_btn').click(function(e){
	if($("#upload_details_btn_div").html() == ""){
		
		var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
		var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';
		$("#upload_details_btn_div").html(ajaxLoader);

		$.ajax({
			type: "POST",
			cache: false,
			url: appHome+'/unlocodes/common_ajax',
			dataType: "text",
			data: ({
				'action_type':'upload_history',
			}), 
			success: function(result)
			{ 
				$("#upload_details_btn_div").html(result);
			}  
		});
	}
});


 $("#unlocodes-filter").autocomplete({
	  source: function(request, response) {
		 	$.ajax({
		            url: appHome+'/unlocodes/codelist',
		            dataType: "json",
		            data: {
		                term : request.term,
		                country : $("#country-filter").val()
		            },
		            success: function(data) {
		                response(data);
		            }
		        });
		  },

      minLength: 1,
      type: "GET",
      success: function (event, ui) {},
	  select: function (event, ui) {
    	event.preventDefault();
		$(this).val(ui.item.label);
		return false;
	  },
	  focus: function(event, ui) {
	        event.preventDefault();
	        $(this).val(ui.item.label);
	  },
	  change: function (event, ui) {
         if (ui.item === null) {
            $(this).val('');
         }
	  }
  });

