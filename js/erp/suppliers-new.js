$(function() {
	if($("#drag_and_drop_on_supplier_add_modal").val()){
			Dropzone.autoDiscover = false;
			//Dropzone class
			var myDropzone = new Dropzone("#supplier_extras_modal", {
				url: "#",
				// acceptedFiles: "image/*,application/pdf",
				maxFiles : 1, 
				previewsContainer: "#file-upload-panel",
				disablePreviews: true,
				autoProcessQueue: false,
				uploadMultiple: false,
				clickable: false,
				init : function() {
		
					myDropzone = this;
			
					//Restore initial message when queue has been completed
					this.on("drop", function(event) {
						if(event.dataTransfer.files.length > 0){
							fileInput = document.getElementById("file_to_upload"); 
							fileInput.files = event.dataTransfer.files;
							document.getElementById("file-upload-panel").scrollIntoView();
							$("#file-upload-panel").css("background-color", "#bdbdbd");
							setTimeout(() => {
								$("#file-upload-panel").css("background-color", "unset");
							}, 800);
							fileSelected();
							setTimeout(() => {
								if($("#auto_upload_on_drag").is(":checked")){
									uploadFile();
								}
								myDropzone.removeAllFiles( true );
							}, 200);
						}
					});
			
				}
			});
		}
});