$(document).ready(function(){
	//To delete the contact detail
	$(document).on('click','.delete-contact',function(e){
		e.preventDefault();
		var delete_url 		= $(this).attr('href'),
			contact_email 	= $(this).data('email'),
			return_url 		= window.location.href;
		BootstrapDialog.confirm('Are you sure you want to delete this Contact?', function(result){
			if(result) {
				$.ajax({
					type : 'POST',
					url  : delete_url,
					data :{
						'contact_email' 	: contact_email
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
});//End of document ready