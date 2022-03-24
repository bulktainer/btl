function isEmailCheck(email) {
	  var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	  var emailaddress = email.val().trim();
	  if(emailaddress != ""){
	  	var t = regex.test(emailaddress);
	  	if(t){
	  		email.css('border', '1px solid #666');
	  		return true;
	  	}else{
	  		email.css('border', '1px solid red');
	  		return false;
	  	}
	  }
}
$(document).on("click",".to-name,#to-email1,#to-email2,#to-email3",function(e) {
		$(this).css('border', '1px solid #666');
});

$(document).on("click",".send-mail-button",function(e) {
	   	e.preventDefault();

	   	var toMailName = $('[name="to-name[]"][data-email="to-email1"]').val().trim();
	   	var toMail = $('#to-email1').val().trim();
	   	var success = [];
	   	success.push(isEmailCheck($('#to-email1')) );
	   	success.push(isEmailCheck($('#to-email2')) );
	   	success.push(isEmailCheck($('#to-email3')) );

	   	if(toMailName == ""){
	   		success.push(false);
	   		$('[name="to-name[]"][data-email="to-email1"]').css('border', '1px solid red');
	   	}
	   	if(toMail == ""){ 
	   		success.push(false);
	   		$('#to-email1').css('border', '1px solid red');
	   	}
	   var check_fields = (success.indexOf(false) > -1);

	   if(!check_fields && toMailName != "" && toMail != ""){
	   		$('.send-mail-button').attr('disabled', true);
	   		var oldVal = $(this).html();
	   		$(this).html('<i class="fa fa-spinner fa-spin"></i>&nbsp;'+oldVal);
	   		$('.simbax').submit();
	   }
});