$(function() {
	    $("ul.sf-menu").supersubs({
	      minWidth: 12,
	      maxWidth: 27,
	      extraWidth: 1
	    }).superfish();
	  });
	$(document).ready(function() {
        if($("#j_cust_code").length != 0){
        $('#j_cust_code').multiselect({
            enableCaseInsensitiveFiltering: true,
            enableFiltering: true,
            buttonWidth: '100%',
            maxHeight: 200,
            onChange: function(element, checked) {
                element.parent().multiselect('refresh');
                if (checked === true && element.val() != 0) {
                     element.parent().multiselect('deselect', 0);
                     element.parent().multiselect('refresh');
                 }
                 if (checked === true && element.val() == 0) {
                     element.parent().val(0);
                     element.parent().multiselect('refresh');
                 }
                 if(checked === false && element.parent().val() == null){
                     element.parent().val(0);
                     element.parent().multiselect('refresh');
                 }
            }
            });
    	}
        if($("#rechrge_cust_code").length != 0){
            $('#rechrge_cust_code').multiselect({
                enableCaseInsensitiveFiltering: true,
                enableFiltering: true,
                buttonWidth: '100%',
                maxHeight: 200,
                onChange: function(element, checked) {
                    element.parent().multiselect('refresh');
                    if (checked === true && element.val() != 0) {
                         element.parent().multiselect('deselect', 0);
                         element.parent().multiselect('refresh');
                     }
                     if (checked === true && element.val() == 0) {
                         element.parent().val(0);
                         element.parent().multiselect('refresh');
                     }
                     if(checked === false && element.parent().val() == null){
                         element.parent().val(0);
                         element.parent().multiselect('refresh');
                     }
                }
                });
        	}

        if($("#customer_group").length != 0){
            $('#customer_group').multiselect({
                enableCaseInsensitiveFiltering: true,
                enableFiltering: true,
                buttonWidth: '100%',
                maxHeight: 200,
                onChange: function(element, checked) {
                    element.parent().multiselect('refresh');
                    if (checked === true && element.val() != 0) {
                         element.parent().multiselect('deselect', 0);
                         element.parent().multiselect('refresh');
                     }
                     if (checked === true && element.val() == 0) {
                         element.parent().val(0);
                         element.parent().multiselect('refresh');
                     }
                     if(checked === false && element.parent().val() == null){
                         element.parent().val(0);
                         element.parent().multiselect('refresh');
                     }
                }
                });
        	}

        if($("#team_id").length != 0){
            $('#team_id').multiselect({
                enableCaseInsensitiveFiltering: true,
                enableFiltering: true,
                buttonWidth: '100%',
                maxHeight: 200,
                onChange: function(element, checked) {
                    element.parent().multiselect('refresh');
                    if (checked === true && element.val() != 0) {
                         element.parent().multiselect('deselect', 0);
                         element.parent().multiselect('refresh');
                     }
                     if (checked === true && element.val() == 0) {
                         element.parent().val(0);
                         element.parent().multiselect('refresh');
                     }
                     if(checked === false && element.parent().val() == null){
                         element.parent().val(0);
                         element.parent().multiselect('refresh');
                     }
                }
                });
        	}

        if($("#j_col_country").length != 0){
            $('#j_col_country').multiselect({
                enableCaseInsensitiveFiltering: true,
                enableFiltering: true,
                buttonWidth: '100%',
                maxHeight: 200,
                onChange: function(element, checked) {
                    element.parent().multiselect('refresh');
                    if (checked === true && element.val() != 0) {
                         element.parent().multiselect('deselect', 0);
                         element.parent().multiselect('refresh');
                    }
                    if (checked === true && element.val() == 0) {
                         element.parent().val(0);
                         element.parent().multiselect('refresh');
                    }
                    if(checked === false && element.parent().val() == null){
                         element.parent().val(0);
                         element.parent().multiselect('refresh');
                    }
                }
            });
        }

        if($("#j_del_country").length != 0){
            $('#j_del_country').multiselect({
                enableCaseInsensitiveFiltering: true,
                enableFiltering: true,
                buttonWidth: '100%',
                maxHeight: 200,
                onChange: function(element, checked) {
                    element.parent().multiselect('refresh');
                    if (checked === true && element.val() != 0) {
                         element.parent().multiselect('deselect', 0);
                         element.parent().multiselect('refresh');
                    }
                    if (checked === true && element.val() == 0) {
                         element.parent().val(0);
                         element.parent().multiselect('refresh');
                    }
                    if(checked === false && element.parent().val() == null){
                         element.parent().val(0);
                         element.parent().multiselect('refresh');
                    }
                }
            });
        }
    	
        $('.tmp-input-ctrl').remove();//This control is for not showing old select box
		//Dm-22-Sep-2017
        $('#add_manually_exchange').click(function(){
        	if($('#add_manually_exchange').is(':checked')){
        		$('.exchange_rate_full_div').slideDown();
            }else{
            	$('.exchange_rate_full_div').slideUp();
            }
        });
        $('.datepicker').datepicker({
            dateFormat: btl_default_date_format,
            changeMonth: true,
            changeYear: true,
            inline: true,
            startDate: 0
          });
        $(document).on('click', '.show-demtk-tr', function(e) {	
            var jobNo = $(this).attr('data-jobno');
        	$(this).find('span').toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
        	$('.demtk-'+jobNo).toggle('slow');
        });
        
        
        //Job Performance Report process
        $(document).on('click', '#job-performance-btn', function(e){
    		e.preventDefault();
    		var __this = $(this);
    		$('#export_pdf').val('no');
    		$date_from = $("#date_from").val();
    		$date_to = $("#date_to").val();
    		
    		if($date_from != "" && $date_to != "") {
    			
    			$.ajax({ 
        	        type: 'POST',
        	        url: appHome+'/job-performance-report/ajax_report',
        	        data: $("#job-performance-report").serialize(),
        	        beforeSend: function() {
    					__this.find('span').removeClass().addClass("fa fa-spinner fa-spin");
    					__this.attr('disabled','disabled');
    					$("#job-performance-report-div").html("");
		          	},
        	        success: function(response){
        	        	$("#job-performance-report-div").html(response);
        	        	__this.find('span').removeClass("fa fa-spinner fa-spin");
        	        	__this.removeAttr('disabled','disabled');
                        $("[data-toggle=tooltip]").tooltip();
                        $("#btn-export-excel").removeAttr('disabled','disabled');
        	        },
        	        error: function(response){
        	        }
        	    });
    			
    		} else {
    			BootstrapDialog.show({title: 'Job Performance Report', message : 'Please select dates.'});
    		}
    		
    	});

    });

$(document).on('change', '#display_format', function(e) {    
            var display_format = $(this).val();
            if(display_format == 1 || display_format == 2) {
                $("#jt_number_div").css("display","block");
                $("#export_excel").css("display","block");
                $("#btn-export-excel").attr('disabled','disabled');
            }else{
                $("#search_jt_no").val("");
                $("#jt_number_div").css("display","none");
                $("#export_excel").css("display","none");
            }
});

$(document).on('change', '#snapshot_date', function(e) { 
     var val = $(this).children(":selected").val();
     if ( val  === "" ) {
            $('.snap-disabled').prop( "disabled", false );
            $('#display_format option[value="2"]').attr("disabled", false);
            $('#exchange_cost_date option[value="booking-date"]').attr("disabled", false);
      }
      else{
        $('.snap-disabled').prop( "disabled", true );
        $('#display_format option[value="2"]').attr("disabled", true);
        $('#exchange_cost_date option[value="booking-date"]').attr("disabled", true);
      }
      $('#display_format').trigger('chosen:updated');
      $('#exchange_cost_date').trigger('chosen:updated');
});

$(document).on('click', '.job_review_comment', function(e) { 
    var $this = $(this);
    var current_comment = $(this).attr('data-comment');
    var job_id =$(this).attr('data-id');
    BootstrapDialog.show({
        title: 'Job Review Comment',
        message: $('<textarea class="form-control" id="text_comments" placeholder="Comment...">'+current_comment+'</textarea>'),
        buttons: [
            {
				label: 'Cancel',
				hotkey: 13, // Enter.
				action: function(dialogRef){
					dialogRef.close();
				}
			},
            {
            label: 'Update',
            cssClass: 'btn-primary',
            hotkey: 13, // Enter.
            action: function(dialogRef) {
                var modified_comment = $("#text_comments").val();
                $.ajax({
                    type: 'POST',
                    url: appHome+'/job-performance-report/common_ajax',
                    data: {
                        'je_job_id'   : job_id,
                        'je_comments' : modified_comment,
                        'action_type' : 'update_job_review_comment'
                    },
                    success: function(response){
                    if(response == "success"){
                       $this.attr('data-comment',modified_comment);
                       $this.find('.comment-section').attr('data-original-title',modified_comment);
                       $('[data-toggle="tooltip"]').tooltip();
                    }
                    if(response == "failed") {
                        BootstrapDialog.show({title: 'Failed to update', message : 'Failed to update comment . Try again later.'});
                    }
                },
                error: function(response){
                    BootstrapDialog.show({
                        title: 'Failed to update', message : 'Failed to update comment. Try again later.'
                    });
                }
            });
            dialogRef.close();
            }
        }]
    });
});

