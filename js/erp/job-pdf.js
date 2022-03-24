(function() {
  
	var returnpath = $("#returnpath").val();
	var dataSavePdf = $("#data-view-pdf").val();

  	var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
  	var alert_success_pdf = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i>Successfully generated PDF file !!!</div>';

    $("#SavePDF").click(function(){
    	
    	var $form = $("#vgm-form");
    	var $this = $(this);
    	$("#save_pdf").val('Yes');
    	
    	$this.attr('disabled','disabled');
    	$this.text(" Loading......");
    	
    	$.ajax({
    	      url: dataSavePdf,
    	      async: false,
    	      timeout: 90000,
    	      type: 'POST',
    	      dataType: 'json',
    	      data: $form.serialize(),
    	      success: function(data) {
    	    	  $this.removeAttr('disabled');
    	    	  $this.text("Save PDF to Job");
    	    	  if(data.status == "success")
    	    	  {
        	    	  $('html, body').animate({ scrollTop: 0 }, 400);
        	          $('#response').empty().prepend(alert_success_pdf).fadeIn();
        	          window.location = returnpath + '#jobfiles';
    	    	  } else {
    	    		  $('html, body').animate({ scrollTop: 0 }, 400);
        	          $('#response').empty().prepend(alert_error).fadeIn();
    	    	  }
    	      },
    	      error:function(jqXHR, textStatus, errorThrown){
    	    	  $this.removeAttr('disabled','disabled');
    	    	  $this.text("Save PDF to Job");
    	    	  $('html, body').animate({ scrollTop: 0 }, 400);
    	          $('#response').empty().prepend(alert_error).fadeIn();
    	      }
    	});
    	
    });
    
    $('#ship_tare_weight, #ship_goods_weight').focusout(function(){ 
    	var weightUnit = $('#vgmWeight').val();
    	if(isNaN(parseFloat($(this).val()))){
    		$(this).val('0'+weightUnit);
    	}
    	var stw = $("#ship_tare_weight").val();
    	var sgw = $("#ship_goods_weight").val();
    	var total = parseFloat(stw) + parseFloat(sgw); 
    	total = total.toFixed(2);
    	total = total.replace('.00','');
    	$(this).val(parseFloat($(this).val())+ weightUnit);
    	$('#ship_total_weight').val(total + weightUnit);
    })
    
    $("#ship_tare_weight, #ship_goods_weight").focus(function(){
        $(this).val(parseFloat($(this).val()));
    });
    
})();
