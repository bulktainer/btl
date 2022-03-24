$(document).ready(function(){ 
        $("ul.sf-menu").supersubs({ 
            minWidth:    12,   // minimum width of sub-menus in em units 
            maxWidth:    27,   // maximum width of sub-menus in em units 
            extraWidth:  1     // extra width can ensure lines don't sometimes turn over 
                               // due to slight rounding differences and font-family 
        }).superfish();  // call supersubs first, then superfish, so that subs are 
                         // not display:none when measuring. Call before initialising 
                         // containing tabs for same reason. 

    $("input[name='dirty_clean']").click(
	    function(){
	       	if ($(this).is(':checked') && $(this).val() == 'clean') {
	          	var prod = $('#job_prod').val();
	          	var haz_det = $('#prod_unno').val();
	          	var primary_cls = $('#prod_primary_class').val();
	          	var sec_cls = $('#prod_secondary_class').val();
	          	var ter_cls = $('#prod_tertiary_class').val();
	          	var ship_name = $('#prod_ship_name').val();

	          	var pk_grp = $('#prod_pk_grp').val();
	          	if(prod != '') {
	          		$('#prod_hidden').val(prod);
	          		$('#haz_hidden').val(haz_det);
	          		$('#pri_hidden').val(primary_cls);
	          		$('#sec_hidden').val(sec_cls);
	          		$('#ter_hidden').val(ter_cls);
	          		$('#ship_hidden').val(ship_name);
	          		$('#pkgrp_hidden').val(pk_grp);
	          		$('#job_prod').val('N/A');
	          		$('#prod_unno').val('N/A');
	          		$('#prod_primary_class').val('N/A');
	          		$('#prod_secondary_class').val('N/A');
	          		$('#prod_tertiary_class').val('N/A');
	          		$('#prod_ship_name').val('N/A');
	          		$('#prod_pk_grp').val('N/A');
	          	}
	        }if ($(this).is(':checked') && $(this).val() == 'dirty') {
	          	var prod = $('#prod_hidden').val();
	          	var haz_det = $('#haz_hidden').val();
	          	var primary_cls = $('#pri_hidden').val();
	          	var sec_cls = $('#sec_hidden').val();
	          	var ter_cls = $('#ter_hidden').val();
	          	var ship_name = $('#ship_hidden').val();
	          	var pk_grp = $('#pkgrp_hidden').val();
	          	if(prod != '') {
	          		$('#job_prod').val(prod);
	          		$('#prod_unno').val(haz_det);
	          		$('#prod_primary_class').val(primary_cls);
	          		$('#prod_secondary_class').val(sec_cls);
	          		$('#prod_tertiary_class').val(ter_cls);
	          		$('#prod_ship_name').val(ship_name);
	          		$('#prod_pk_grp').val(pk_grp);
	          	}
	        }
	    });	


	$(document).on('click', '#generate-xml', function(e){
		var return_path = $("#job-url").val();
		var generate_xml_url = $(this).attr('data-path');
		var _this = $(this);
		
		_this.html('<span class="fa fa-refresh fa-spin"></span> Create EDI');
		_this.attr('disabled', 'disabled');
		
		$.ajax({
	        type: 'POST',
	        url: generate_xml_url,
	        data: {},
			data: $("#form_inter").serialize().replace(/%5B%5D/g, '[]'),
	        success: function(response){
				response = JSON.parse(response);
				
				if(response.status == "success"){
					successMessage = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> '+ response.message +'</div>';
					localStorage.setItem('response', successMessage);
					window.location.href = return_path;
					_this.html('<span class="glyphicon glyphicon-ok-sign"></span> Create EDI');
					_this.removeAttr('disabled');	
				} else {
					alertError = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> '+ response.message +'</div>';
					$('html, body').animate({ scrollTop: 0 }, 400);
		          	$('#response').empty().prepend(alertError).fadeIn();
					_this.html('<span class="glyphicon glyphicon-ok-sign"></span> Create EDI');
					_this.removeAttr('disabled');
					console.log(response);
				}
	        },
	        error: function(response){
	        	$('html, body').animate({ scrollTop: 0 }, 400);
	          	$('form').find('#response').empty().prepend(alert_error).fadeIn();
				_this.html('<span class="glyphicon glyphicon-ok-sign"></span> Create EDI');
				_this.removeAttr('disabled');
	        }
	    });
	
	})
	
	$(document).on('click', '#Preview-xml', function(e){
		e.preventDefault();
		var generate_xml_url = $(this).attr('data-path');
		var prevAction = $('#form_inter').attr('action');
		$('#form_inter').attr('action', generate_xml_url).submit();
		$('#form_inter').attr('action', prevAction);
	})

}); 
