$(document).ready(function(){
	
	var ExistSuccess 	= 'Ok';
	var alert_required 	= '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
	var oldalert 		= alert_required;
	
	//view tank details
	$('.view-tank').on('click',function(e) {
		var id = $(this).attr('data-id');
		$.ajax({
			type	: "POST",
			async	: false,
			url		: appHome+'/tank-core-new/common_ajax',
			dataType: "json",
			data	: ({
				'tank_id' : id,
				'action_type' : 'view_tank'
				}),
			success: function(response)
			{
				$('#tank_status').html(response.tank_status);
				$('#tank_tank_no').html(response.tank_no);
				$('#tank_capacity').html(response.tank_capacity);
				$('#tank_length').html(response.tank_length);
				$('#tank_width').html(response.tank_width);
				$('#tank_height').html(response.tank_height);
				$('#tank_division').html(response.tank_division);
				$('#allow_feed').html(response.allow_feed);
				$('#tank_weight').html(response.tank_weight);
				$('#tank_compartments').html(response.tank_compartments);
				$('#tank_businesstype').html(response.tank_businesstype);
				$('#tank_ownership').html(response.tank_ownership);
				$('#tank_ownership_new').html(response.tank_ownership_new);
				$('#tank_short_term').html(response.tank_short_term);
				$('#tank_catwalk').html(response.tank_catwalk);
				$('#tank_t_no').html(response.tank_t_no);
				$('#tank_mot_date').html(response.tank_mot_date);
				$('#tank_next_mot_date').html(response.tank_next_mot_date);
				$('#tank_next_mot_type').html(response.tank_next_mot_type);
				$('#tank_electric').html(response.tank_electric);
				$('#tank_electric_type').html(response.tank_electric_type);
				$('#tank_inspection_date').html(response.tank_inspection_date);
				$('#tank_manlids').html(response.tank_manlids);
				$('#tank_storm_covers').html(response.tank_storm_covers);
				$('#tank_bottom_valve_type').html(response.tank_bottom_valve_type);
				$('#tank_bottom_valve_size').html(response.tank_bottom_valve_size);
				$('#tank_bottom_outlet_type').html(response.tank_bottom_outlet_type);
				$('#tank_top_valve_type').html(response.tank_top_valve_type);
				$('#tank_top_valve_size').html(response.tank_top_valve_size);
				$('#tank_top_outlet_type').html(response.tank_top_outlet_type);
				$('#tank_airline_outlet_type').html(response.tank_airline_outlet_type);
				$('#tank_discharge').html(response.tank_discharge);
				$('#tank_handrail').html(response.tank_handrail);
				$('#tank_tram').html(response.tank_tram);
				$('#tank_baffles').html(response.tank_baffles);
				$('#tank_steam_coil').html(response.tank_steam_coil);
				$('#tank_syphon').html(response.tank_syphon);
				$('#tank_steam_area').html(response.tank_steam_area);
				$('#tank_man_date').html(response.tank_man_date);
				$('#tank_gps_identifier').html(response.tank_gps_identifier);
				if(response.tank_active_status ==1){
					$('#tank_active_status').html(' Active');
				}
				else{
					$('#tank_active_status').html(' Disable');
				}
				
			}
		});
		
	});
	
	$('.create-Tank-save,.edit-Tank-update').click(function(e){
		  $('.highlight').removeClass('highlight');
		  e.preventDefault();
		  var form = '#'+$(this).closest('form').attr('id'),
		      success = [],
		      path = $(this).attr('data-path');

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
		  
		  
		  /**
		   * tank number valid or not
		   */
		  function tankNumberValid(txt){
			  var numReg = /^[a-zA-z]{4}[0-9]{6}\/[0-9]{1}$/;
			  var tno = txt.val();
			  if(numReg.test(tno)){
				  invalidTank = 'Ok';
				  $(txt).parent().removeClass('highlight');
				  success.push(true);
			  }else{
				  invalidTank = 'tankInvalid';
				  $(txt).parent().addClass('highlight');
			      success.push(false);
			  }
		  }
		  /**
		   * numeric check
		   */
		  function isNumeric(value) {
			  var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
			  var str =value.val();
			  if(str.charAt(0) == '.'){
				  str = '0'+str;
			  }
			  if((numberRegex.test(str)) && (str >= 0)) {
				  $(value).parent().removeClass('highlight');
				  success.push(true);
			  }else{
				  $(value).parent().addClass('highlight');
			      success.push(false);
			  }
			  //highlight($(form).find('#tank_no'), '');
			  var check_fields = (success.indexOf(false) > -1);
			}
		  
		  /**
		   * tank number exist or not
		   */
		  function istankExist(tankNo,button) {
			ExistSuccess = [];
			  
			if(button.hasClass('edit-Tank-update')){
		  		var type = "update";
		  	}
		  	if(button.hasClass('create-Tank-save')){
		  		var type = "create";
		  	}
			var tankNumber = tankNo.val();
			var tank_id = $('#tank_id').val();
			
			  $.ajax({
			        type: 'POST', 
			        url: path+'/tank_exist',
			        async : false,
			        data: {
						'tankNumber' : tankNumber,
						'tank_id'	: tank_id,
						'type'	   : type
					},
			        success: function(response){
			        	if(response > 0){
			        		ExistSuccess = 'Exist';
			        		console.log(tankNo);
			        		$(tankNo).parent().addClass('highlight');        		
			        	}else{
			        		ExistSuccess = 'Ok';
			        		$(tankNo).parent().removeClass('highlight');
			        	}
			        },
			        error: function(response){
			          $('html, body').animate({ scrollTop: 0 }, 400);
			          $('form').find('#response').empty().prepend(alert_error).fadeIn();
			        }
			  });
		  }
		  	  
			  //page 1  
			  highlight($('#tank_no'), '');
			  highlight($('#tank_capacity'), '');
			  
			 
			  highlight($('#tank_length'), '');
			  highlight($('#tank_width'), '');
			  highlight($('#tank_height'), '');
			  highlight($('#tank_division'), '');
			  highlight($('#tank_weight'), '');
			  highlight($('#tank_compartments'), '');
			  highlight($('#tank_business_type'), '');
			  highlight($('#tank_walkway'), '');
			  highlight($('#tank_t_number'), '');
			  highlight($('#tank_prev_test_date'), '');
			  highlight($('#tank_next_mot_date'), '');
			  highlight($('#tank_inspection_date'), '');
			  highlight($('#tank_manlids'), '');
			  highlight($('#tank_next_mot_type'), '');
			  highlight($('#tank_manu_date'), '');
			  
			
			  if($.trim($('#tank_no').val()) != ''){
				  //function for chech tank no exist
				  istankExist($('#tank_no'),$(this));
			  }
			  if($.trim($('#tank_no').val()) != ''){
				  tankNumberValid($('#tank_no'));
			  }
			  
		  if(ExistSuccess == 'Exist'){
			  success.push(false);
			  $($('#tank_no')).parent().addClass('highlight');   
		  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank No already exists.</div>';
		  }else if(invalidTank == 'tankInvalid'){
			  success.push(false);
		  	  alert_required =  '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank Number must match a pattern ABCU123456/7 ! Please, re-enter</div>';
		  }else{
			  success.push(true); 
			  alert_required = oldalert;
		  }   
		  var check_fields = (success.indexOf(false) > -1);
		  /**
		  * update edit-vgm-route
		  */
		  if($(this).hasClass('edit-Tank-update')){
			var tank_id = $('#tank_id').val();
		    if(check_fields === true){
		      $('html, body').animate({ scrollTop: 0 }, 400);
		      $('form').find('#response').empty().prepend(alert_required).fadeIn();
		    } else {
		      $(this).attr('disabled','disabled');
		      $.ajax({
		        type: 'POST',
		        url: '../'+tank_id+'/update',
		        data: $('#tank-core-data-new').serialize().replace(/%5B%5D/g, '[]'),
		        success: function(response){
		          window.location.href = $('#returnpath').val();
		          localStorage.setItem('response', response);
		        },
		        error: function(response){
		        	 $(this).removeAttr('disabled');
		          $('html, body').animate({ scrollTop: 0 }, 400);
		          $('form').find('#response').empty().prepend(alert_error).fadeIn();
		        }
		      });
		    }
		  }
		  
		   if($(this).hasClass('create-Tank-save')){
			      if(check_fields === true){
			        $('html, body').animate({ scrollTop: 0 }, 400);
			        $('form').find('#response').empty().prepend(alert_required).fadeIn();
			      } else {
			       $(this).attr('disabled','disabled');
			       $.ajax({
			         type: 'POST',
			         url: path+'/add',
			         data: $('#tank-core-data-new').serialize().replace(/%5B%5D/g, '[]'),
			         success: function(response){
			        	 var tankno = $('#tank_no').val();
			        window.location.href = appHome+'/tank-core-new/index?sort=&sorttype=&page_name=tank-core-index&tank-filter='+tankno+'&tank-division=&tank-type=&tank-status=all';
			           localStorage.setItem('response', response);
			         },
			         error: function(response){
			           $(this).removeAttr('disabled');
			           $('html, body').animate({ scrollTop: 0 }, 400);
			           $('form').find('#response').empty().prepend(alert_error).fadeIn();
			         }
			       });
			      }
		   }
		   
		});
	
	//tank number new format start ----------------------------------------
	//SET CURSOR POSITION
	$.fn.setCursorPosition = function(pos) {
	this.each(function(index, elem) {
	  if (elem.setSelectionRange) {
	    elem.setSelectionRange(pos, pos);
	  } else if (elem.createTextRange) {
	    var range = elem.createTextRange();
	    range.collapse(true);
	    range.moveEnd('character', pos);
	    range.moveStart('character', pos);
	    range.select();
	  }
	});
	return this;
	};	

	$.fn.getCursorPosition = function() {  
	  var el = $(this).get(0);  
	  var pos = 0;  
	  if ('selectionStart' in el) {  
	      pos = el.selectionStart;  
	  } else if ('selection' in document) {  
	      el.focus();  
	      var Sel = document.selection.createRange();  
	      var SelLength = document.selection.createRange().text.length;  
	      Sel.moveStart('character', -el.value.length);  
	      pos = Sel.text.length - SelLength;  
	  }  
	  return pos;  
	}  

	/**
	 * its for change _ to each key pressed
	 */
	$('#tank_no').keydown(function(evt) {
		
		var TankNo = $('#tank_no').val();
		var firstIndex = TankNo.indexOf('_');
		var currPostion = $('#tank_no').getCursorPosition();
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		
		if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 96 && charCode <= 122)){
			if(firstIndex !=  -1){			
				var newString = TankNo.slice(0, firstIndex) + TankNo.slice(firstIndex + 1);	
				$('#tank_no').val(newString);
				$('#tank_no').setCursorPosition(firstIndex);
			}
		}else if(charCode == 8){ //8 - back space
			if(currPostion == 11){
				var underscore = "/";
			}else{
				var underscore = "_";
			}
			var newString = [TankNo.slice(0, currPostion), underscore, TankNo.slice(currPostion)].join('');
			if(currPostion == 0){
				newString = newString.substring(1);
			}
			$('#tank_no').val(newString);
			$('#tank_no').setCursorPosition(currPostion);
		}else if(charCode == 46){ //8 - back space
			//if(!$.browser.mozilla)
				currPostion = currPostion +1;
			
			if(currPostion == 11){
				var underscore = "/";
			}else{
				var underscore = "_";
			}
			var newString = [TankNo.slice(0, currPostion), underscore, TankNo.slice(currPostion)].join('');
			$('#tank_no').val(newString);
			$('#tank_no').setCursorPosition(currPostion - 1);
		}
	});

	/**
	 * if it work in crome issue in delete key press
	 * so its work only in mozilla
	 */
	$('#tank_no').keyup(function(evt) {
		if($.browser.mozilla){
			var TankNo = $('#tank_no').val();
			var firstIndex = TankNo.indexOf('_');
			var currPostion = $('#tank_no').getCursorPosition();
			var charCode = (evt.which) ? evt.which : evt.keyCode;
			
			 if(charCode == 46 && TankNo != ''){ //46 - delete
					if(currPostion == 10){
						var underscore = "/";
					}else{
						var underscore = "_";
					}
					var newString = TankNo.slice(0, currPostion) + TankNo.slice(currPostion + 1);
					newString = [newString.slice(0, currPostion), underscore, newString.slice(currPostion)].join('');
					$('#tank_no').val(newString);
					$('#tank_no').setCursorPosition(currPostion);
				}else if(charCode == 46 && TankNo == ''){
					$('#tank_no').val('__________/_');
					$('#tank_no').setCursorPosition(0);
				}
		}
	});
	/**
	 * change cursor position
	 */
	$('#tank_no').on('click focus',function(e) {
		var TankNo = $('#tank_no').val();
		var firstIndex = TankNo.indexOf('_');
		if(TankNo == '__________/_')
			$('#tank_no').setCursorPosition(firstIndex);
		
	});
	
	$(document).on('click', '.tank_core_change_status', function(e) {
	    e.preventDefault();
	   var tankNo = $(this).attr('data-id');
	   if($(this).hasClass('tank_core_change_status')){
	       var changeTo = $(this).attr('data-quote-change-to');   
	       var tank = $(this).attr('data-tank-num');   
	   }
	   var message = 'Are you sure want to move <strong>'+tank+'</strong> to '+changeTo.charAt(0).toUpperCase() + changeTo.slice(1);+' ?';
	   
	   if(changeTo == 'live'){
	       var mtype = BootstrapDialog.TYPE_SUCCESS;
	       var mButton = 'btn-success';
	   }else if(changeTo == 'archive'){
	       var mtype = BootstrapDialog.TYPE_PRIMARY;
	       var mButton = 'btn-primary';
	   }else{
	       var mtype = BootstrapDialog.TYPE_DANGER;
	       var mButton = 'btn-danger';
	   }
	    BootstrapDialog.show({
	        type		: mtype,
	        closable 	: false,
	        title		: 'Confirmation',
	        message		: message,
	        buttons		: [{
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
		                       url: appHome+'/tank-core-new/common_ajax',
		                       data: {
		                         'tankNo' 		: tankNo,
		                         'tank' 		: tank,
		                         'action_type' 	: 'change_tank_status',
		                         'changeTo' 	: changeTo
		                       },
		                      beforeSend: function() {
		                           $('.bootstrap-dialog-footer-buttons > .'+mButton).html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
		                           $('.bootstrap-dialog-footer-buttons > .'+mButton).attr('disabled','disabled');
		                       },
		                       success: function(response){
		                           
		                          localStorage.setItem('response', response);
		                          location.reload();
		                           
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
	//Delete tank
	$('.delete-Tank').click(function(e) {
		e.preventDefault();
		
		var delete_url 	= $(this).attr('data-href'),
			tank_id 	= $(this).data('tank-id'),
			tank_no 	= $(this).attr('data-tank-num'),
			$this 		= $(this),
			return_url 	= window.location.href;
		
		if($('#returnpath').val()) {
			return_url = $('#returnpath').val();
		}
			
		 BootstrapDialog.show({
	         type		: BootstrapDialog.TYPE_DANGER,
	         closable 	: false,
	         title		: "Confirmation (<strong>"+tank_no+"</strong>)",
	         message	: "Are you sure want to delete this Tank ?",
	         buttons	: [{
			             label: 'Close',
			             action: function(dialogItself){
			                 dialogItself.close();
			             }
				         },{
			             label: 'Ok',
			             cssClass: 'btn-danger',
			             action: function(dialogItself){
			 				$.ajax({
								type: 'POST',
								url: delete_url,
								timeout: 90000,
				  		       beforeSend: function() {
						        	$('.bootstrap-dialog-footer-buttons > .btn-danger').html("<i style='font-size:18px' class='fa fa-refresh fa-spin'></i> Please Wait..");
				    		        $('.bootstrap-dialog-footer-buttons > .btn-danger').attr('disabled','disabled');
						        },
								data: {
									'tank_id' : tank_id
								},
								success: function(response){
									dialogItself.close();
									window.location.href = return_url;
									localStorage.setItem('response', response);
								},
								error: function(response){
									BootstrapDialog.show({title: 'Warning', message : 'Unable to delete this Tank. Please try later.',
										 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
									});
								}
							});
			             }
		         }]
	      	});
		});
	//attaching the file
	$('#file_to_upload').change(function(){
		var file = document.getElementById('file_to_upload').files[0];
		$('#fileSize,#fileType,#fileExist').show();
		if (file) {
		  var fileSize = 0;
		  if (file.size > 1024 * 1024)
			fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
		  else
			fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
		  
		  var fname =  file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g,'_').slice(-40);
		  
		  var extension = fname.substr( (fname.lastIndexOf('.') +1) );
		  var attachable_type = $('#attachable_type').val();
		 
		  var randomNumber = Math.floor(Math.random()*90000) + 10000;
		  document.getElementById('fileName').value = randomNumber+'_'+fname;
		  document.getElementById("fileName").select(fname);
		  if(attachable_type == 'Tank_gallery'){
			  var ImageArray = ['jpg','jpeg','gif','png']
			  if($.inArray(extension,ImageArray) < 0){
				  document.getElementById('fileSize').innerHTML = '<span style="color:red;">Warning : <br>- Unsupported File</span>';
				  document.getElementById('fileType').innerHTML = '<span style="color:red;">- Please Choose an Image file(.jpeg,.jpg,.gif,.png)</span>';
				  $("#upload_btn").attr('disabled','disabled');
				  return false;
			  }
		  }

		  document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
		  document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
		}
		
		var file_cntrl = $('#file_to_upload');
		if(file_cntrl.val() != "" )
		{
			$("#upload_btn").removeAttr('disabled');
		}		
			$('#upload-progress-bar').css('width','0%');
			$('#upload-progress-bar').data('aria-valuenow','0');
			$('#upload-progress-bar').html('');
	});
	/**
	 * document file uplad function
	 */
	$(document).on('click','#upload_btn',function(){ 
	//function documentFileUpload() {
		
		var filename = $("#fileName").val();
		var filenameCtrl = $("#fileName");
		
		if(filename.trim() != ''){
				uploadPath = $("#fileUploadPath").val();
				
				if(!$('#file_to_upload')[0]) {
					return false;
				}
			
				if(!$('#file_to_upload').val()) {
					$("#upload_btn").attr('disabled','disabled');
					return false;
				}
				
				var fd = new FormData();
				fd.append("file_to_upload", $('#file_to_upload')[0].files[0]);
				fd.append("attachable_id", $('input[name="attachable_id"]').val());
				fd.append("attachable_type", $('#attachable_type').val());
				fd.append("new_file_name", $('#fileName').val());
			
				var xhr = new XMLHttpRequest();
			
				// file received/failed
				xhr.onreadystatechange = function(e) {
					if (xhr.readyState == 4) {
							$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
							xhr.addEventListener("load", documentFileUploadComplete, false);
							$('#progress_num_uf').addClass(xhr.status == 200 ? "success" : "failure");
						
					}
				};

				xhr.upload.addEventListener("progress", documentFileUploadProgress, false);
				xhr.addEventListener("load", documentFileUploadComplete, false);
				xhr.addEventListener("error", documentFileUploadFailed, false);
				xhr.addEventListener("abort", documentFileUploadCanceled, false);
				xhr.open("POST", uploadPath);
				xhr.send(fd);
		
			}else{
				filenameCtrl.val('');
				filenameCtrl.focus();
			}
	});
	/**
	 * process function
	 * @param evt
	 */
	function documentFileUploadProgress(evt) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		$('#progress_num_uf').show();
		$('#upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
		$('#upload-progress-bar').css('width',percentComplete.toString()+ '%');
		$('#upload-progress-bar').data('aria-valuenow',percentComplete.toString());
		$('#upload-progress-bar').html(percentComplete.toString() + '%');
	}

	/**
	 * when upload is failed
	 * @param evt
	 */
	function documentFileUploadFailed(evt) {
		alert("There was an error attempting to upload the file.");
	}

	/**
	 * if uplad is cancel
	 * @param evt
	 */
	function documentFileUploadCanceled(evt) {
		alert("The upload has been canceled by the user or the browser dropped the connection.");
	}

	/**
	 * upload complete
	 * @param evt
	 */
	function documentFileUploadComplete(evt) {
		var id = $('#attachable_id').val();
		var type = $('#attachable_type').val();
		if(type == 'Tank'){
			var typeData = 'tank_doc';
		}else if(type == 'Tank_gallery'){
			var typeData = 'tank_gallery';
		}else if(type == 'Tank_periodic_test'){
			var typeData = 'tank_periodic_test';
		}else{
			var typeData = 'on_hire_agreement_doc';
		}
		tankFileList(id,type);
		$('#progress_num_uf,#fileSize,#fileType,#fileExist').delay(2000).fadeOut('slow');
		$('.docs-icon[data-id="'+ id +'"][data-upload-type="'+ typeData +'"]').find('.fa').removeClass().addClass('fa fa-file');
	}

	// file upload functio end--------------------------
	/**
	 * document list in popup
	 */
	function tankFileList(id,type){
		var url = appHome+'/tank-core-new/common_ajax';
		$.ajax({  
			type: "POST", 
			cache: false, 
			url: url,  
			dataType: "text",
			data: ({
				'id' :id,
				'type' : type,
				'action_type' : 'list_upload_docs',
				'pageType' : $('#page-type').val()
			}),  
			beforeSend: function() {
	            // setting a timeout
	        	$('#fileAttachment').html("<td colspan='5'><div class='text-center'><img src="+$('#loaderpath').val()+"></div></td>");
	        },
			success: function(result)
			{ 
				$("#file_to_upload").val("");
				$("#fileName,#tank_file_upload_textarea").val("");
				$("#upload_btn").attr('disabled','disabled');
				
				$('#fileAttachment').html(result);
				
				$("#fileAttachment-table").tablesorter(); 
				$("#fileAttachment-table").trigger("update"); 
		    	var sorting = [[1,0]]; 
		    	$("#fileAttachment-table").trigger("sorton",[sorting]);
				$('#fileAttachment-table').tablesorter({
			         widthFixed: true,
			         widgets: ['zebra', 'filter'],
			         widgetOptions: {
			           filter_reset: '.reset'
			         },
			    })
			    $('.tablesorter-filter-row').hide();
			}  
		});
	}

	$('.file-upload-btn').on('click',function(e) {
		var id = $(this).attr('data-id');
		var upload_type = $(this).attr('data-upload-type');
		var modal_title = $(this).attr('data-modal-title');
		var tankNo = $(this).parent().siblings(":first").text();
		if(upload_type == 'tank_doc'){
			var type = 'Tank';
			$('#FileUpModalLabel').html('Documents -Tank:'+tankNo);
		}else if(upload_type == 'tank_gallery'){
			var type = 'Tank_gallery';
			$('#FileUpModalLabel').html('Tank Gallery :'+tankNo);
		}else if(upload_type == 'tank_periodic_test'){
			var type = 'Tank_periodic_test';
			$('#FileUpModalLabel').html('Tank Periodic Test :'+tankNo);
		}
		else{
			var type = 'Tank_on_hire';
			$('#FileUpModalLabel').html('On hire Agreement Documents -Tank:'+tankNo);
		}
		
		tankFileList(id,type);
		$("#upload_btn").attr('disabled','disabled');
		$('#file_to_upload').val('');
		$('#progress_num_uf').hide();
		$('#file_desc,#JobfileName').val('');
		$('#fileSize,#fileType,#fileExist').html('');
		
	});

	var page_type = $('#page-type');
	if(page_type.length && page_type.attr('data-page-type') == 'tank-master-page1'){
		  tankFileList($('#attachable_id').val(),'Tank');
	}

	$(".delete-tank-doc").live('click', function(e){
		e.preventDefault();	
		$this = $(this);
		var up_fileInfo = $this.data();
		var deleteType = up_fileInfo.upload_type;
		var file_deletePath = appHome+'/tank-core-new/common_ajax';
		var attachid = 0;
		var siFileListCount = 0;
		var docidArr = up_fileInfo.docid.split("-");
		var tankId = $('#attachable_id').val();

		BootstrapDialog.confirm('Are you sure you want to delete this document ?', function(result){
			if(result == true) {
				$.ajax({
					type: "POST", 
					async: false, 
					url: file_deletePath, 
					dataType: "html",
					data: ({
						'docid' : docidArr[1],
						'tableType' : docidArr[0],
						'deleteType' : deleteType,
						'tankId' : tankId,
						'action_type' : 'delete_tank_docs'
					}),  
					success: function(response)
					{ 
						
						if(response == 'success') {
							//remove icons
							$this.parents('tr').remove();

							tp_file_list = $(".tp-file-list tr").length;
							if (tp_file_list == 2)
							{
								$("#emptyFilesTr").removeClass();
								var id = $('#attachable_id').val();
								$('.docs-icon[data-id="'+ id +'"][data-upload-type="'+deleteType+'"]').find('.fa').removeClass().addClass('fa fa-file-o');
							}

		
						}else{
							BootstrapDialog.show({title: 'Error', message : 'Error occured Please try agan later.',
								 buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
							});
						}
					}  
				});
			}
		});		
		
	});
	
	var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';

    var alert_success = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-thumbs-o-up"></i>Successfully saved !!!</div>';

    var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Tank data already exists.</div>';

	//Add popup the ownership modal
	$(document).on('click', '#add_new_owner', function(){
    	$('#tank_ownership_new').val('');
    	$('#modal_add_new_owner').modal('show');
    	$('.response').empty().html('');
    });
	//To save the ownership
	$(document).on('click', '#save_owner', function(e){
		e.preventDefault();	
		  success = [];	

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

		  highlight($('#tank_ownership_new_val'), '');

		  var check_fields = (success.indexOf(false) > -1);

	      if(check_fields == true) {
	        $('.response').empty().prepend(alert_required).fadeIn();
	      } else {
	 			$(this).attr('disabled','disabled');
	 			saveTankOwnership($('#tank_ownership_new_val').val().trim());
	      }
	    });

	    function saveTankOwnership(value){
	    	
	    	$.ajax({ 
		        type: 'POST',
		        url: appHome+'/tank-core-new/save-tank-ownership',
		        data: {
		        	'data_type' 	  : 'Tank_Ownership',
		        	'tank_data_value' : value
		        },
		        success: function(response){
			        $('#save_owner').removeAttr('disabled');
		        	if(response == 'true'){
			         	$('.response').empty().prepend(alert_success).fadeIn();
			         	$('#tank_ownership_new').find('option:selected').remove();
			         	var html = '<option value="'+value+'" style="font-weight:bold;" selected>'+value+'</option>';
			         	$('#tank_ownership_new').append(html);
			         	$('.chosen').chosen().trigger("chosen:updated");
			         	$('#tank_ownership_new_val').val('');

			        }
			        else{
			        	$('.response').empty().prepend(alert_error).fadeIn();
			        }
		        },
	        	error: function(response){
					$('.response').empty().prepend(alert_error).fadeIn();
					$('#save_owner').removeAttr('disabled');
	        	}
	    	});
	    }
});//end of document ready
