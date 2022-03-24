var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
success = [];

// On load
$(document).ready(function(){
	var equipment_type = $('#hidden-equipment-type').val();
	$('#equipment_type').val(equipment_type);
	$('.chosen').chosen().trigger("chosen:updated");

 	$('.date-picker').datepicker( {
        changeYear: true,
        changeMonth: false,
        showButtonPanel: true,
        yearRange: "-100:+0",
        dateFormat: 'yy',
        onClose: function(dateText, inst) { 
        function isDonePressed(){
            return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
                        	}
	        if (isDonePressed()){
	            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
	            $(this).datepicker('setDate', new Date(year,1, 1));
	        }
        },
        
    }).focus(function() {
	 	$(".ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-month").remove();
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
		
	}	
});

$(document).on('click', '.create-equipment,.edit-equipment', function(e){
	$('.highlight').removeClass('highlight');
	e.preventDefault();
	success = [];
	var form = '#'+$(this).closest('form').attr('id');
      
	//To highlight the required field
	highlight($(form).find('#reference_number'), ''); 
	highlight($(form).find('#owner'), ''); 
	var check_fields = (success.indexOf(false) > -1);
	  
	   // To edit the activity
	  
	if($(this).hasClass('edit-equipment')){
		var equipment_id = $('#hidden-equipment-id').val();
        if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
     	} else {
	     	$(this).prop('disabled','disabled');
	        
	        $.ajax({
	        	type: 'POST',
	        	url: appHome+'/equipment/'+equipment_id+'/update',
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
	   
	//To create the activity
	if($(this).hasClass('create-equipment')){
	    if(check_fields === true){
	       $('html, body').animate({ scrollTop: 0 }, 400);
	       $('form').find('#response').empty().prepend(alert_required).fadeIn();
	    } else {
	    	$(this).prop('disabled','disabled');
	       	
	       	$.ajax({
	        	type: 'POST',
	        	url: appHome+'/equipment/add',
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

//To delete the corresponding field
$(document).on('click', '.delete-equipment-btn', function(e) {
    e.preventDefault();
    var id = $(this).attr('data-equipment-id');

    BootstrapDialog.confirm('Are you sure you want to delete this Equipment?', function(result){
        if(result) {
	        $.ajax({
	            type: 'POST',
	            url: appHome+'/equipment/'+id+'/delete',
	            data: {
	            	'equipment_id' : id
	            },
	            success: function(response){
	            	window.location.href = appHome+'/equipment/index';
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

// Change equipment status
$(document).on('click', '.equipment_change_status', function(e) {
	e.preventDefault();
	var equipment_id = $(this).attr('data-id');
	var changeTo = $(this).attr('data-equipment-change-to');
		
	var message = 'Are you sure, you want to move the equipment to '+changeTo.charAt(0).toUpperCase() + changeTo.slice(1)+' ?';
	
	if(changeTo == 'live'){
		var mtype = BootstrapDialog.TYPE_SUCCESS;
		var mButton = 'btn-success';
	}else{
		var mtype = BootstrapDialog.TYPE_PRIMARY;
		var mButton = 'btn-primary';
	}

	BootstrapDialog.show({
        type: mtype,
        title: 'Confirmation',
        message: message,
        buttons: [{
		             label: 'Close',
		             action: function(dialogItself){
		                 dialogItself.close();
		             }
		         },{
	            label: 'Ok',
	            cssClass: mButton,
	            action: function(){
	            	 $.ajax({
	     		        type: 'POST',
	     		        url: appHome+'/equipment/common_ajax',
	     		        data: {
	     		      	  'equipment_id' : equipment_id,
	     		      	  'action_type' : 'change_activity_status',
	     		      	  'changeTo' : changeTo,
	     		        },
	     		       beforeSend: function() {
	     		        	$('.bootstrap-dialog-footer-buttons > .'+mButton).html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		     		        $('.bootstrap-dialog-footer-buttons > .'+mButton).attr('disabled','disabled');
	     		        },
	     		        success: function(response){
	     		        	location.reload();
	     		            localStorage.setItem('response', response);
	     		            $('html, body').animate({ scrollTop: 0 }, 400);
	     		        },
	     		        error: function(response){
	     		          $('html, body').animate({ scrollTop: 0 }, 400);
	     		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
	     		        }
	     		  });
	            }
        }]
    });
});

//To view the details of selected items in popup
$(document).on('click', '.view_equipment',function(e) {
	var equipment_id = $(this).data('id');
	var equipment_type = $(this).data(equipment_type);
	$('.view_small_loader').show();
	$('.reset_values').html('');
	// if(equipment_type == 1){
	// 	$('#trucks_view_modal').modal('show');
	// }
	// else if(equipment_type == 2){
	// 	$('#trailers_view_modal').modal('show');
	// }
	// else if(equipment_type == 3){
	// 	$('#heating_stations_view_modal').modal('show');
	// }
	// else if(equipment_type == 4){
	// 	$('#lifters_view_modal').modal('show');
	// }
	// else if(equipment_type == 5){
	// 	$('#depots_view_modal').modal('show');
	// }
	
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: appHome+'/equipment/common_ajax',
		data: {
			'equipment_id' : equipment_id,
			'action_type' : 'get_equipment_detail'
		},
		success: function(response){
			$('.view_small_loader').hide();
			if(response != ""){
				$('#modal_equipment_status').html(response.equipment_is_archived);
				$('#modal_equipment_type').html(response.equipment_type);
				$('#modal_reference_number').html(response.equipment_reference_number);
				$('#modal_owner').html(response.equipment_owner);
				$('#modal_make').html(response.equipment_make);
				$('#modal_model').html(response.equipment_model);
				$('#modal_registration_number').html(response.equipment_registration_number);
				$('#modal_adr').html(response.equipment_adr);
				$('#modal_manufacture_year').html(response.equipment_manufacture_year);
				$('#modal_note').html(response.equipment_note);
				$('#modal_category').html(response.equipment_category);
				$('#modal_weight').html(response.equipment_tare_weight);
				$('#modal_l_agreement').html(response.equipment_lease_agreement);
				$('#modal_mot_date').html(response.equipment_mot_date);
				$('#modal_capacity').html(response.equipment_capacity);
				$('#modal_compressor').html(response.equipment_compressor);
				$('#modal_hydro_pack_pump').html(response.equipment_hydro_pack_pump);
				$('#modal_base').html(response.equipment_base);
				$('#modal_mot_frequency').html(response.equipment_frequency);
				$('#modal_hoses').html(response.equipment_hoses);
			}
		},
		error: function(response){
			BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
				 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
		}
	});
});

$(document).on('change', '#equipment_type', function(){
	var equipment_type = $(this).val();
	window.location.href = appHome+'/equipment/create?equipment_type_filter='+equipment_type;
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
		$('.equipment-form').submit();
	}
});