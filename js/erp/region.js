$(document).ready(function(){
 	var ExistSuccess = 'Ok';
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert = alert_required;
$(".multi-sel-ctrl").change(function () {
	var optioncount = $(this).find('option:selected').length;
	var $this = $(this);
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
         	if(checked === false && element.parent().val() == null){
           		element.parent().val('');
           		element.parent().multiselect('refresh');
         	}
			
		}
	});
}
$('.tmp-input-ctrl').remove();
		//To view the details of the corresponding country
$(document).on('click','.view_region',function(e){
		$('.view_small_loader').show();
		$('.reset_values').html('');
		var r_id = $(this).data('id');
		var namediv ="";
		var isodiv  = "";
		$.ajax({
			type	: 'POST',
			dataType: 'JSON',
			url		: appHome+'/region/common_ajax',
			data	:{
						'r_id' 	        : r_id,
						'action_type' 	: 'get_region_details'
					},
			success	:function(response){
				$('.view_small_loader').hide();
                $('.region-name').html(response.region_name);
				if(response != ""){
					$.each(response.name, function(i, name) {
						$('#modal_contry_name').html(namediv +='<tr><td>'+name+'</td></tr>');
				    });
				    $.each(response.iso, function(j, iso) {
						$('#modal_iso').html(isodiv +='<tr><td>'+iso+'</td></tr>');
				    });
			   }
			},
			error: function(response){
				BootstrapDialog.show({title: 'Error', message : 'Error occured. Please try later.',
					 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
			}
		});
	});

    //Delete particular region
	$(document).on('click','.delete-region',function(e){
		e.preventDefault();
		var delete_url 	= $(this).attr('href'),
			country_id 	= $(this).data('region-id'),
			return_url 	= window.location.href;
		BootstrapDialog.confirm('Are you sure you want to delete this Region?', function(result){
			if(result) {
				$.ajax({
					type : 'POST',
					url  : delete_url,
					data :{
						'country_id' 	: country_id
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

    /**
	* region edit and update
	*/
	$('.create-region,.edit-region').click(function(e){
	  $('.highlight-custome').removeClass('highlight-custome');
	    e.preventDefault();
	    var form = '#region-form',
	      success = [],
	      path = $(this).attr('data-path');
	    function highlight(field, empty_value){
	    	if(field.length > 0){
	      		if(field.val().trim() === empty_value){
	        		$(field).parent().addClass('highlight-custome');
	        			success.push(false);
	      		} else {
	       				$(field).parent().removeClass('highlight-custome');
	        				success.push(true);
	      		}
	    	}
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
	    //function to check whether the customer name or iso excist
	    function isRegionNameExists(region,button) {
		    ExistSuccess = [];
		    if(button.hasClass('edit-region')){
	  		   var type = "update";
	  	    }
	  	    if(button.hasClass('create-region')){
	  		  var type = "create";
	  	    }
			var regionname = $('#region_name').val();
		
			if(type == "create" && regionname !=""){
			  	$.ajax({
			        type: 'POST',
			        url: appHome+'/region/common_ajax',
			        async : false,
			        data: {
						'regionname' 	: regionname,
						'action_type' 	: 'regionnameexist'
					},
			        success: function(response){
			        var obj = JSON.parse(response);
			        	if(obj.name == 'yes'){
			        		ExistSuccess = 'Exist'
			        		$(region).parent().addClass('highlight-custome');
			        	}else{
			        		ExistSuccess = 'Ok'
				        	$(region).parent().removeClass('highlight-custome');
			        	}
			        },
			        error: function(response){
			          $('html, body').animate({ scrollTop: 0 }, 400);
			          $('form').find('#response').empty().prepend(alert_error).fadeIn();
			        }
			  	});
			}
	  	}

	  	highlight($(form).find("#region_name"),"");
	  	highlightmulti($(form).find("#country"),"");

	  	if($('#region_name').val() != '' ){
		  	isRegionNameExists($(form).find('#region_name'),$(this)); //function for chech country name or iso exist or not
	  	}	  
	  	if(ExistSuccess == 'Exist'){
		  	success.push(false);
	  	 	alert_required =  '<div class="alert alert-danger alert-dismissable">'
	  		  					+'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
	  		  					+'<i class="fa fa-exclamation-triangle"></i>'
	  		  					+'<strong>Uh oh!</strong> This Region name already exists.</div>';
	 	}else{
		  success.push(true);
		  alert_required = oldalert;
	  	}
	  	var check_fields = (success.indexOf(false) > -1);
	  	console.log(success);
	  	/**
	  	* update edit-region
	  	*/
	  	if($(this).hasClass('edit-region')){
		 	var country_id = $('#country_id').val();
	    	if(check_fields === true){
	      		$('html, body').animate({ scrollTop: 0 }, 400);
	      		$('form').find('#response').empty().prepend(alert_required).fadeIn();
	    	} else {
	    		$(this).prop('disabled','disabled');
	      		$.ajax({
	       	 		type: 'POST',
	        		url: appHome+'/region/'+country_id+'/update',
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
	  	/**
	   	* create-region
	   	*/
	   	if($(this).hasClass('create-region')){
	     	if(check_fields === true){
	       	$('html, body').animate({ scrollTop: 0 }, 400);
	       	$('form').find('#response').empty().prepend(alert_required).fadeIn();
	     	} else {
	       		$(this).prop('disabled','disabled');
	       		$.ajax({
	         		type: 'POST',
	         		url: appHome+'/region/add',
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
$(document).on('change', '.custom-page-pagesize', function (e) {
		  var pagelimit = $(this).val();
		  $('#pagesize').val(pagelimit);
		  $('.country_core').submit();
	});

});//end of document ready