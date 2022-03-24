$(document).on('change', '.custom-page-pagesize', function(e) {
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('#job-filter-form').submit();
});
$(document).ready(function(){
   
    $('#confirm_upload_modal').on('hidden.bs.modal', function () {
		$("#disp_msg").empty();
		$("#upload_doc").find('i').removeClass().addClass("fa fa-upload");
		$(".upload_doc").removeAttr("disabled");
		$("#fileToUpload").val("");
		$("#fileSize").val("");
		$("#fileName").val("");
		$("#fileDesc").val("");  
		$("#fileCustomerAccess").val("");	
	});

	$('#search_box_bttn').click(function(){
    	$('#search_box_bttn i').toggleClass('fa-search-minus fa-search-plus');
    	$('.search_box').slideToggle("slow");
    	$('#response,#response_count').slideToggle("fast"); 
    });
	
	$('.job-tr').click(function (e) { 
     var $this       = $(this);
     var expand      = $(this).data('expand');
     var param       = $(this).data('param');
     var cust_code   = $(this).data('cust');
     var cust_ord    = $(this).data('custord');
     var jt_num      = $(this).data('jt');
     var ets_date    = $(this).data('etsdate');
     var ajax_called = $(this).data('ajax');
	 var showUpload  = $("#showUpload").val();
	 $(this).find('span').toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
     if(ajax_called == 0){
        $('.deepsea-jobgroup-list[data-expand="' + expand + '"]').toggle();
        $('.deepsea-jobgroup-list[data-expand="' + expand + '"] td').html("<div align='center'><img src='" + appHome  +  "/../images/ajax.gif'></div>");
        $.ajax({
          type: 'POST',
          url: appHome + '/deepsea-jobgroup/common_ajax',
          data: {
            'action_type' : 'batch_list',
            'cust_code': cust_code,
            'cust_ord' : cust_ord,
            'jt_num'   : jt_num,
            'ets_date' : ets_date,
			'expand'   : expand,
			'showUpload' : showUpload
           
          },
          success: function(response){
             renderDataInListing($this,response,expand);
          },
          error: function(response){}
        });

    } else {
        $('.deepsea-jobgroup-list[data-expand="' + expand + '"]').toggle();  
    }
    });

	function renderDataInListing($this,response,expand){

        $('.deepsea-jobgroup-list[data-expand="' + expand + '"] td').html(response);
        $this.data('ajax','1');
        $('[data-toggle="tooltip"]').tooltip({ placement: 'right'});

    }

	function DoubleScroll(element) {
    	var scrollbar= document.createElement('div');
    	scrollbar.appendChild(document.createElement('div'));
    	scrollbar.style.overflow= 'auto';
    	scrollbar.style.overflowY= 'hidden';
    	scrollbar.firstChild.style.width= element.scrollWidth+'px';
    	scrollbar.firstChild.style.paddingTop= '1px';
    	scrollbar.firstChild.appendChild(document.createTextNode('\xA0'));
    	scrollbar.onscroll= function() {
        	element.scrollLeft= scrollbar.scrollLeft;
    	};
    	element.onscroll= function() {
        	scrollbar.scrollLeft= element.scrollLeft;
    	};
    	element.parentNode.insertBefore(scrollbar, element);
	}
	if($('#bor_table tr').length > 10){
		DoubleScroll(document.getElementById('doublescroll'));
	} 
	if($('#tank-plan-list tr').length > 10){
		DoubleScroll(document.getElementById('doublescroll'));
	}  

	$(".multi-sel-ctrl").change(function () {
		var optioncount = $(this).find('option:selected').length;
		var optlimit = 25;
		var count = 1;
		var $this = $(this);
	
    	if(optioncount > optlimit) {
    		$(this).find('option:selected').each(function(){
    			if(count > optlimit){
    				$(this).prop('selected',false);
    			}	
    			count +=1;
    		})
    		BootstrapDialog.show({title: 'Customer Limt', message : 'Selection is limited to 25 items only.',
			 	buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
			});
    		$(".multi-sel-ctrl").multiselect('refresh');
    	}
	});

	/**
	 * multi select option for customers
 	*/
	if($(".multi-sel-ctrl").length != 0){
		$(".multi-sel-ctrl").multiselect({
			enableCaseInsensitiveFiltering: true,
			enableFiltering: true,
			maxHeight: 200,
			buttonWidth: '100%',
			onChange: function(element, checked) {
			
				if (checked === true && element.val() != '') {
					if($(this.$select).attr('id') == 'fromtown-filter'){
						$('#fromtown-part-filter').val('');
					}else if($(this.$select).attr('id') == 'totown-filter'){
						$('#totown-part-filter').val('');
					}
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
	$('.tmp-input-ctrl').remove();//This control is for not showing old select box
	Date.prototype.toInputFormat = function() {
    	var yyyy = this.getFullYear().toString();
   	 	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    	var dd  = this.getDate().toString();
    	return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
 	};
	$(".jobshead").hide();  
	$(".job_ids").hide();	
});//end of document ready

$(document).on('click', '#upld_doc', function(e) {
	e.preventDefault();
	$("#confirm_upload_modal").modal('show');
	$(".jobshead").show();
	$(".job_ids").show();
});
function $id(id) {
	return document.getElementById(id);
}
function uploadFile() {
	var $error = false;
	var successMessage = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong>Files Uploaded Successfully.</div>';
	var select_quote_msg = "<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><i class='fa fa-exclamation-triangle'></i> <strong>Uh oh!</strong> Please select a job from lisitng for upload.</div>";
	var checkedval = [];
	$('.each-check-job:checked').each(function(){ //iterate all listed checkbox items
		var selected_costs = $(this).attr('data-job-id');
		checkedval.push(selected_costs);
	});
	checkedval = $.unique(checkedval);
	console.log(checkedval);
	$("#fileJobNum").val(checkedval);
	if(checkedval.length == 0){
		$("#disp_msgs").empty().prepend(select_quote_msg).fadeIn();
			$error = true;
	}
	
	if($error == false){
		if(!$id('fileToUpload').files[0]) {
			var empty_msg = "<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><i class='fa fa-exclamation-triangle'></i> <strong>Uh oh!</strong> Please select a file.</div>";
			$("#disp_msgs").empty().prepend(empty_msg).fadeIn();
			return false;
		}
		var fd = new FormData();
		fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
		fd.append("fileName", document.getElementById('fileName').value);
		fd.append("fileDesc", document.getElementById('fileDesc').value);
		fd.append("fileJobNum", document.getElementById('fileJobNum').value);
		fd.append("fileCustomerAccess", document.getElementById('fileCustomerAccess').value);
		fd.append("jobFileType", $('#job-filetype').val());
		var xhr = new XMLHttpRequest();
		// file received/failed
	    if (xhr.readyState == 0){
			$(".upload_doc").attr("disabled","disabled");
			$("#upload_doc").find('i').removeClass("fa fa-upload").addClass("fa fa-spinner fa-spin");
		}
		xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4) {
				$('#progress_num').addClass(xhr.status == 200 ? "success" : "failure");
			}
		};
		xhr.onprogress = function () {
			$(".upload_doc").attr("disabled","disabled");
			$("#upload_doc").find('i').removeClass().addClass("fa fa-spinner fa-spin");
		};
		xhr.open("POST", appHome + '/deepsea-jobgroup/jobF-fle-upload');
		xhr.send(fd);
		xhr.onload = function () {
			if (xhr.status === 200) {
			  $(".upload_doc").removeAttr("disabled");
			  window.location.reload();
			  localStorage.setItem('response', successMessage);
			  $('html, body').animate({ scrollTop: 0 }, 400);
			} else {
			  alert('Something went wrong uploading the file.');
			}
		};
	}
}

function fileSelected() {
	var file = document.getElementById('fileToUpload').files[0];
	if (file) {
	  var fileSize = 0;
	  if (file.size > 1024 * 1024)
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	  else
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
		var fname  = file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
		document.getElementById('fileName').value = fname;
		document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
		document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
	}
}

$(document).on('click', '.check-all', function(e) {
	var expandchecks = $(this).attr('data-expandchecks');
    var status = this.checked; // "select all" checked status
	
     $('.each-check-job-'+expandchecks).each(function(){ //iterate all listed checkbox items
        this.checked = status; //change ".checkbox" checked status
        if(status == true){
			var seljobnum = $(this).attr('data-job-id');
			// $("#fileJobNum").val(seljobnum);
          	var qno = $(this).attr('data-cquote-id');
        }
     });
});

$(document).on('click', '.each-check-job', function(e) { 
	var expandchecks = $(this).attr('data-expandchecks');
	if($('.each-check-job-'+expandchecks+':checked').length == $('.each-check-job-'+expandchecks).length){
      $('.check-all-'+expandchecks).prop('checked',true);
    }else{
      $('.check-all-'+expandchecks).prop('checked',false);
    }
	var seljobnum = $(this).attr('data-job-id');
    var checked =   $(this).is(':checked');      
    if(checked){
         $('.ref_checks_'+seljobnum).prop('checked',true);
    } else {
         $('.ref_checks_'+seljobnum).prop('checked',false);
    }

});

// Show a modal of job files
$(document).on('click','.job_files_info' ,function(e){
	e.preventDefault();
	var job_number = $(this).data('job');
	$('html, body').animate({ scrollTop: 0 }, 400);
  	$.ajax({
	  type: 'POST',
	  url: appHome+'/deepsea-jobgroup/common_ajax/',
	  data : {
		'action_type' : 'JobFileListing',
		'job_number'  : job_number	   
	  },
	  success: function(response){
		$('#modal-job-files-info').empty().append(response).show();

	  },
	  error: function(response){
		$('#modal-supplier-cost-files-info').find('.modal-body').empty().append(alert_error).fadeIn();
	  }
	});
});

//Delete file and job notes 
$('.delete-row').live('click',function(e) {
	var pageName = $('#page_name').val();	
	var plan_id = $(this).attr('data-plan-files-id');
	e.preventDefault();
	var id = $(this).data('id');
	var parent = $(this).parent().parent();
	if (confirm('Are you sure you want to delete the row with ID '+id+'? This cannot be undone')) {
		var action = $(this).data('action');
		$.ajax({  
				type: "POST",  
				url: appHome + '/deepsea-jobgroup/common_ajax',  
				dataType: "text",
				data: "action_type="+action+"&id="+id,
				beforeSend: function() {
					$(parent).find("td").css({
						'color': '#fff',
						'background-color': '#cc0000'
					})
				},  
				success: function(result)
				{ 
					if(result=='1') {
						$(parent).fadeOut(1000, function() {
						$(this).remove();
						if(pageName = 'job-edit' && plan_id != '' && plan_id != undefined){
							var plancount = $(".delete-row[data-plan-files-id='" + plan_id + "']").length;
							if(plancount == 0){
								$(".file-upload-btn[data-id='" + plan_id + "'] i").removeClass('fa-file').addClass('fa-file-o');
							}
						}
						});
					} else {
							//alert(result);
							$(parent).find("td").css({
								  'color': '',
								  'background-color': ''
							})
					}
				}  
		});
	}
});

$(function() {
		
	if($("#drag_and_drop_on_modal").val()){
			Dropzone.autoDiscover = false;
			//Dropzone class
			var myDropzone = new Dropzone("#confirm_upload_modal", {
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
							fileInput = document.getElementById("fileToUpload"); 
							fileInput.files = event.dataTransfer.files;
							document.getElementById("file-upload-panel").scrollIntoView();
							$("#file-upload-panel").css("background-color", "#bdbdbd");
							setTimeout(() => {
								$("#file-upload-panel").css("background-color", "unset");
							}, 800);
							fileSelected();
							setTimeout(() => {
								// newUploadFile(null); to automatic upload
								myDropzone.removeAllFiles( true );
							}, 200);
						}
		
		
					});
			
				}
			});
		}
});