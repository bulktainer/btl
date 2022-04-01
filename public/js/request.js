// $(document).on('click','.vncbvnvn',function(e){
//     alert('dfg');
// 	e.preventDefault();
// 	var delete_url 		= $(this).attr('href'),
// 		claim_id		= $(this).data('claim-id'),
// 		return_url 		= window.location.href;
// 	BootstrapDialog.confirm('Are you sure you want to delete this Claim?', function(result){
// 		if(result) {
// 			$.ajax({
// 				type : 'POST',
// 				url  : delete_url,
// 				data :{
// 					'claim_id' 	: claim_id,
// 				},
// 				success: function(response){
// 					window.location.href = return_url;
// 					localStorage.setItem('response', response);
// 				},
// 				error: function(response){
// 					BootstrapDialog.show({title: 'Error', message : 'Unable to delete. Please try later.',
// 						 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
// 					});
// 				}
// 			});
// 		}
// 	});
// });