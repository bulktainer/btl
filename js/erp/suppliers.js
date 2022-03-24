
function checkboxSelectall(){
	setTimeout(
			  function() 
			  {
				    var checked = $('.supp-fuel-checkbox:visible:checked').length;
					var Unchecked = $('.supp-fuel-checkbox:visible').length;
					if((checked == Unchecked) && (Unchecked > 0) && (checked > 0)){
						$('.supp-fuel-select-all').prop('checked',true);
					}else{
						$('.supp-fuel-select-all').prop('checked',false);
					}
			  }, 50);
	if($('.supp-fuel-checkbox:checked').length > 0){
		$('.save-fuel-surcharges').removeAttr('disabled');
	}else{
		$('.save-fuel-surcharges').attr('disabled','disabled');
	}
}

$(document).on('click', '.supp-fuel-checkbox', function(e) {
	checkboxSelectall();
});

/**
 * select all option in listing page
 */
$(document).on('click', '.supp-fuel-select-all', function(e) {
	var status = this.checked; // "select all" checked status
	$('.supp-fuel-checkbox:visible').each(function(){ //iterate all listed checkbox items
       this.checked = status; //change ".checkbox" checked status     
   });
	if($('.supp-fuel-checkbox:checked').length > 0){
		$('.save-fuel-surcharges').removeAttr('disabled');
	}else{
		$('.save-fuel-surcharges').attr('disabled','disabled');
	}
});

$(document).on('change', '.custome-page-size-js', function(e) {
	  var supplier_id = $('#supplier_id').val();
	  var transport_mode = $('#transport_mode').val();
	  $('input[name="transport_mode_id"]').val(transport_mode);
	  if(transport_mode != "" && transport_mode != null){
		  get_supplier_costs(supplier_id, transport_mode)
	  }else{
		  $('#fuel_surcharges_table').empty();
	  }
});

$(document).ready(function(){
	
	$("#div-disable-a-link .custom-pagination a").removeAttr('href');
    $("#div-disable-a-link .custom-pagination a").attr('onclick','checkboxSelectall()');
	
	if($('#sort').length > 0 && $('#sort').val() != ''){
		$('.center-cell').removeClass('sortClass-th');
		$('a[data-sort="'+$('#sort').val()+'"]').parent('th').addClass('sortClass-th');
		if($('#sorttype').val() == 'asc'){
			var imgUrl = 'fa fa-lg fa-sort-asc';
			var title = 'Ascending';
		}else{
			var imgUrl = 'fa fa-lg fa-sort-desc';
			var title = 'Descending';
		}
		var ImgSrc  = $('a[data-sort="'+$('#sort').val()+'"]').siblings('.fa');
		ImgSrc.removeClass().addClass(imgUrl);
		ImgSrc.attr('title',title);
		$('html, body').animate({
	        'scrollTop' : $("#doublescroll").position().top
	    });
	}
	
});

$(document).on('click', '.sortClass', function(e) {
	if($('.norecords').length != 1 ){
		$('.center-cell').removeClass('sortClass-th');
		$(this).parent('th').addClass('sortClass-th');
		var sort = $(this).attr('data-sort');
		var sort_type = $(this).attr('data-sort-type');
		if($('#sort').val() == sort){
			if($('#sorttype').val() == 'asc')
				$('#sorttype').val('desc');
			else
				$('#sorttype').val('asc');
		}else{
			$('#sort').val(sort);
			$('#sorttype').val(sort_type);
		}
		$('.supplier-cost-form').submit();
	}
});


$(document).on('change', '.custom-page-pagesize', function(e) {
	var pagelimit = $(this).val();
	$('#pagesize').val(pagelimit);
	$('.supplier-cost-form').submit();
});

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
if($('#doublescroll table tr').length > 10){
	DoubleScroll(document.getElementById('doublescroll'));
} 

/**
* save / update supplier
*/
var alert_extraitem_save = '<div id="response"><div class="alert alert-success alert-dismissable"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> The Supplier Extra cost was successfully saved.</div></div>';
var alert_extraitem_delete = '<div id="response"><div class="alert alert-success alert-dismissable"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><i class="fa fa-thumbs-o-up"></i> <strong>Success!</strong> The Supplier Extra cost item was successfully deleted.</div></div>';

$('.save-supplier, .update-supplier').click(function(e){
  e.preventDefault();

  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      supplier_id = $('input[name="supplier_id"]').val(),
      path = $(this).attr('data-path'),
      total_supplier_extras = $('#supplier-extras').find('tbody tr').length;

  function highlight(field, empty_value){
    if(field.length > 0){
      if(field.val() === empty_value){
        $(field).parent().addClass('highlight');
        success.push(false);
      } else {
        $(field).parent().removeClass('highlight');
        success.push(true);
      }
    }
  }

  highlight($(form).find('#supplier_code'), '');
  highlight($(form).find('#supplier_name'), '');
  highlight($(form).find('#currency'), '');

  var check_fields = (success.indexOf(false) > -1);

  /**
  * save supplier
  */
  if($(this).hasClass('save-supplier')){
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('.response').empty().prepend(alert_required).fadeIn();
    } else {
      $.ajax({
        type: 'POST',
        url: path+'/add/'+total_supplier_extras,
        data: $(form).serialize(),
        success: function(response){
          window.location.href = path+'/index';
          localStorage.setItem('response', response);
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('.response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  }

  /**
  * update supplier
  */
  if($(this).hasClass('update-supplier')){
    if(check_fields === true){
      $('html, body').animate({ scrollTop: 0 }, 400);
      $('form').find('.response').empty().prepend(alert_required).fadeIn();
    } else {
      $.ajax({
        type: 'POST',
        url: '../'+supplier_id+'/update/'+total_supplier_extras,
        data: $(form).serialize().replace(/%5B%5D/g, '[]'),
        success: function(response){
          window.location.href = path+'/index';
          localStorage.setItem('response', response);
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('.response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  }
});


/**
* delete supplier
*/
$('.delete-supplier').click(function(e){
  e.preventDefault();

  var supplier_id = $(this).attr('data-id');
  var path = $(this).attr('data-path');

  BootstrapDialog.confirm('Are you sure you want to delete this Supplier?', function(result){
    if(result) {
      $.ajax({
        type: 'POST',
        url: path+'/'+supplier_id+'/delete',
        data: $('form').serialize(),
        success: function(response){
          window.location.href = path+'/index';
          localStorage.setItem('response', response);
        },
        error: function(response){
          $('html, body').animate({ scrollTop: 0 }, 400);
          $('form').find('.response').empty().prepend(alert_error).fadeIn();
        }
      });
    }
  });
});


/**
* add supplier extra
*/
$(document).on('click', '.add-supplier-extra, .update-supplier-extra', function(e){
  e.preventDefault();
  
  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      table = $('#supplier-extras').find('.table'),
      row = $(this).attr('data-row');

  function highlight(field, empty_value){
    if(field.length > 0){
      if(field.val() === empty_value){
        $(field).parent().addClass('highlight');
        success.push(false);
      } else {
        $(field).parent().removeClass('highlight');
        success.push(true);
      }
    }
  }

  highlight($(form).find('#name'), '');
  highlight($(form).find('#cost'), '');
  highlight($(form).find('#unit'), '');

  $(form).find('#transport_mode').val($('.select_hidden').attr('data-transport')).trigger('chosen:updated');

  if($('#transport_mode').val() === ''){
    $('#transport_mode').parent().addClass('highlight');
    success.push(false);
  } else {
    $('#transport_mode').parent().removeClass('highlight');
    success.push(true);
  }

  var check_fields = (success.indexOf(false) > -1);

  if(check_fields === true){
    $(form).find('.response').empty().prepend(alert_required).fadeIn();
  } else {
	  saveresult = 0;
	  newextraid = 0;
	  isUploadIcon = 'fa fa-file-o';
	  var uploadId = [];
	  $('input[name="files-to-update[]"]').each(function(){
		  uploadId.push($(this).val());
	  });
	  $.ajax({
			type: 'POST',
			url: '../add-edit-supplier-extra',
			data: {
				'id' : $(form).find('#supp_extra_cost_id').val(),
				'name' : $(form).find('#name').val(),
				'cost' : $(form).find('#cost').val(),
				'unit' : $(form).find('#unit').val(),
				'notes' : $(form).find('#notes').val(),
				'transport_mode' : $(form).find('#transport_mode').val(),
				'currency' : $('#currency').val(),
				'supplier_id' : $('#supplier_id').val(),
				'uploadId' : uploadId
			},
			dataType: "json",
			async: false,
			success: function(response){
				if(response.hasOwnProperty('is_upload') && response.is_upload == 1){
					isUploadIcon = 'fa fa-file';
				}
				if(response.result == "success") {
					 saveresult = 1;
					 newextraid = response.id;
					 $('html, body').animate({ scrollTop: 0 }, 400);
				     $('#supplier-form').find('.response').empty().prepend(alert_extraitem_save).fadeIn();
				} else {
					saveresult = 0;
					$('html, body').animate({ scrollTop: 0 }, 400);
					$('#supplier-form').find('.response').empty().prepend(alert_required).fadeIn();
				}
			},
			error: function(response){
				saveresult = 0;
				$('html, body').animate({ scrollTop: 0 }, 400);
				$('#supplier-form').find('.response').empty().prepend(alert_required).fadeIn();
			}
		});

    if($(this).hasClass('add-supplier-extra') && saveresult){
    	var currIcon = "";
    	if(currency_having_symbols.indexOf($('#currency').val().toUpperCase()) >= 0) {
    		currIcon = '<i class="fa fa-'+$('#currency').val().toLowerCase()+'"></i>';
    	}else{
    		currIcon = '<i class="fa">'+$('#currency').val().toUpperCase()+'</i>';
    	}
    	
    	var htmlTemplate = ['<tr>',
    	'<td width="20%">',
    	//'<input type="hidden" name="supplier_extras_name[]" value="'+$(form).find('#name').val()+'" />',
    	'<span class="name">'+$(form).find('#name').val()+'</span>',
    	'</td>',
    	'<td width="10%">',
    	//'<input type="hidden" name="supplier_extras_transport_mode[]" value="'+$(form).find('#transport_mode option:selected').val()+'" />',
    	'<span class="transport-mode">'+$(form).find('#transport_mode option:selected').text()+'</span>',
    	'</td>',
    	'<td class="center-cell" width="10%">',
    	//'<input type="hidden" name="supplier_extras_cost[]" value="'+$(form).find('#cost').val()+'" />',
    	''+currIcon+' ',
    	'<span class="cost">'+$(form).find('#cost').val()+'</span>',
    	'</td>',
    	'<td class="center-cell" width="15%">',
    	//'<input type="hidden" name="supplier_extras_unit[]" value="'+$(form).find('#unit').val()+'" />',
    	'<span class="unit">'+$(form).find('#unit').val()+'</span>',
    	'</td>',
    	'<td width="35%">',
    	//'<input type="hidden" name="supplier_extras_notes[]" value="'+$(form).find('#notes').val()+'" />',
    	'<span class="notes">'+$(form).find('#notes').val()+'</span>',
    	'</td>',
    	'<td class="text-right actions" width="10%">',
    	'<a href="#" title="Edit Supplier Extra" class="edit-supplier-extra edit-icon" data-id="'+ newextraid +'" data-name="'+$(form).find('#name').val()+'" data-transport="'+$(form).find('#transport_mode').val()+'" data-currency="' + $('#currency').val() + '" data-cost="'+$(form).find('#cost').val()+'" data-unit="'+$(form).find('#unit').val()+'" data-notes="'+$(form).find('#notes').val()+'">',
    	'<span class="glyphicon glyphicon-pencil">',
    	'</span>',
    	'</a> ',
    	'<a href="#" title="Edit Supplier Extra" class="edit-supplier-extra docs-icon" data-id="'+ newextraid +'" data-name="'+$(form).find('#name').val()+'" data-transport="'+$(form).find('#transport_mode').val()+'" data-currency="' + $('#currency').val() + '" data-cost="'+$(form).find('#cost').val()+'" data-unit="'+$(form).find('#unit').val()+'" data-notes="'+$(form).find('#notes').val()+'">',
    	'<i class="'+isUploadIcon+'"></i></a>',
    	'<a href="#" title="Delete Supplier Extra" class="delete-supplier-extra delete-icon" data-id="'+ newextraid +'">',
    	'<i class="fa fa-trash-o">',
    	'</i>',
    	'</a>',
    	'</td>',
    	'</tr>'].join("");

      table.children('tbody').append(htmlTemplate);
      $('#supplier-extras').find('.wrapper').removeClass('hidden');
      $('#supplier-extras').find('.wrapper').show();
    }

    if($(this).hasClass('update-supplier-extra') && saveresult){
      table.find('tr').removeClass('updated');
      table.find('tr').eq(row).addClass('updated');
      var docIcon = $(this).parents().find(".table-attachments tr").length > 1 ? 'fa fa-file' : 'fa fa-file-o';

      $('tr.updated').find('span.name').text($(form).find('#name').val());
      $('tr.updated').find('span.transport-mode').text($(form).find('#transport_mode option:selected').text());
      $('tr.updated').find('span.cost').text($(form).find('#cost').val());
      $('tr.updated').find('span.unit').text($(form).find('#unit').val());
      $('tr.updated').find('span.notes').text($(form).find('#notes').val());

      //$('#supplier_extras_name').val($(form).find('#name').val());
      //$('#supplier_extras_transport_mode').val($(form).find('#transport_mode').val());
      //$('#supplier_extras_cost').val($(form).find('#cost').val());
      //$('#supplier_extras_unit').val($(form).find('#unit').val());
      //$('#supplier_extras_notes').val($(form).find('#notes').val());

      $('.updated').find('.edit-supplier-extra').attr('data-name', $(form).find('#name').val());
      $('.updated').find('.edit-supplier-extra').attr('data-transport', $(form).find('#transport_mode').val());
      $('.updated').find('.edit-supplier-extra').attr('data-cost', $(form).find('#cost').val());
      $('.updated').find('.edit-supplier-extra').attr('data-unit', $(form).find('#unit').val());
      $('.updated').find('.edit-supplier-extra').attr('data-notes', $(form).find('#notes').val());
      
      $('.updated').find('.docs-icon .fa').removeClass().addClass(docIcon);
    }
    $('#supplier_extras_modal').modal('hide');
    $('.table').trigger('update');
  }
  $('[name="files-to-update[]"]').remove();
});


$(document).on('click', '.add-supp-modal', function(e){
	  $('#supplier_extras_modal').find('.panel-upload').removeClass('hidden');
	  $('#supplier_extras_modal').find('.panel-upload').show();
	  $('[name="files-to-update[]"]').remove();
});
/**
* on modal hidden
*/
$('#supplier_extras_modal').on('hidden.bs.modal', function(){
  $(this).find('.response').empty();
  $(this).find('.highlight').removeClass('highlight');
  $(this).find('.panel-upload').addClass('hidden');
  $(this).find(".supplier-extra-toggle").show();

  if($('.active-docs-icon')){
	  var file_row_count = $(this).find(".table-attachments tr").length;
	  if(file_row_count > 1){
		  $('.active-docs-icon i').removeClass().addClass('fa fa-file');
	  }else{
		  $('.active-docs-icon i').removeClass().addClass('fa fa-file-o');
	  }
	  $('.active-docs-icon').removeClass('active-docs-icon');
  }
  $('.supp-close-button').html('<span class="glyphicon glyphicon-remove-circle"></span> Cancel');
  $('.update-supplier-extra').show();

  $(this).find('#supp_extra_cost_id').val('');
  $(this).find('#name').val('');
  $(this).find('#transport_mode').val('');
  $(this).find('#cost').val('');
  $(this).find('#unit').val('');
  $(this).find('#notes').val('');
  $(this).find('#attachable_id').val('');
  $('#attachment-rows').html(""); 
  
  $(this).find('.update-supplier-extra').addClass('add-supplier-extra').removeClass('.update-supplier-extra').html('<span class="glyphicon glyphicon-plus-sign"></span> Add Supplier Extra');
  $('.modal-footer .btn-success').removeClass('update-supplier-extra');
  $(this).find('.add-supplier-extra').removeAttr('data-row');
  
  $(this).find('form')[0].reset();
});


/**
* on modal shown
*/

$('#supplier_extras_modal').on('shown.bs.modal', function(){
  var fa = $(this).find('.input-group-addon .fa');
  var currency_name = $('#currency').val().toUpperCase();
  
  if (currency_having_symbols.indexOf(currency_name) >= 0) {
  	$(fa).removeClass().addClass('fa fa-' + currency_name.toLowerCase() + ' currency-fa').html("");
  }
  else {
  	$(fa).removeClass().addClass('fa currency-fa').html(currency_name);
  }
  
});


/**
* edit supplier cost extra
*/
$(document).on('click', '.edit-supplier-extra', function(e){
  e.preventDefault();
  $('[name="files-to-update[]"]').remove();
  $('.view_small_loader').show();
  var popup = $('#supplier_extras_modal');
  var extra_id = $(this).attr('data-id');
  var row = $(this).closest('tr')[0].rowIndex;
  var currency = $(this).attr('data-currency');

  if($(this).hasClass('docs-icon')){
	  $(".supplier-extra-toggle").hide();
	  $(".panel-upload").show();
	  $(this).addClass('active-docs-icon');
	  $('.add-supplier-extra').hide();
	  $('.supp-close-button').html('<span class="glyphicon glyphicon-remove-circle"></span> Close');
  } else {
	  $(".supplier-extra-toggle").show();
	  $(".panel-upload").hide();
  }
  
  $('.select_hidden').attr('data-transport', $(this).attr('data-transport'));
  $(popup).find('.fa').removeClass().addClass('fa fa-'+currency);
  $(popup).find('.add-supplier-extra').addClass('update-supplier-extra').removeClass('add-supplier-extra').html('<span class="glyphicon glyphicon-ok-sign"></span> Save Supplier Extra');
	$(popup).find('.panel-upload').removeClass('hidden')

  $(popup).find('#supp_extra_cost_id').val($(this).attr('data-id'));
  $(popup).find('#name').val($(this).attr('data-name'));
  $(popup).find('#transport_mode').val($(this).attr('data-transport'));
  $(popup).find('#cost').val($(this).attr('data-cost'));
  $(popup).find('#unit').val($(this).attr('data-unit'));
  $(popup).find('#notes').val($(this).attr('data-notes'));
	$(popup).find('#attachable_id').val(extra_id);
	
	$.ajax({
		type: 'POST',
		url: '../generate-attachment-table-rows',
		data: {
			'attachable_id' : extra_id,
			'attachable_type' : 'SupplierCostsExtra'
		},
		success: function(response){
			if(response) {
				$('#attachment-rows').html(response);
				$('#attachments').removeClass('hidden');
			} else {
				$('#attachment-rows').html("");
				$('#attachments').addClass('hidden');
			}
			$('.view_small_loader').hide();
		},
		error: function(response){
			alert('Oops! Error in generating existing file attachments');
		}
	});

  $(popup).find('.update-supplier-extra').attr('data-row', row);
  $(popup).modal('show');
});


/**
* on transport mode change
*/
$('#supplier_extras_modal #transport_mode').change(function(){
  $('.select_hidden').attr('data-transport', $(this).val());
});


/**
* delete supplier cost extra
*/
$(document).on('click', '.delete-supplier-extra', function(e){
  e.preventDefault();

  var table = $(this).closest('table'),
      row = $(this).closest('tr'),
      message = 'Are you sure you want to delete this record?',
      extracostid = $(this).attr('data-id');

  BootstrapDialog.confirm(message, function(result){
    if(result) {
    	$.ajax({
			type: 'POST',
			url: '../delete-supplier-extra',
			data: {
				'id' : extracostid
			},
			dataType: "json",
			async: false,
			success: function(response){
				if(response.result == "success") {
					 $('html, body').animate({ scrollTop: 0 }, 400);
				     $('#supplier-form').find('.response').empty().prepend(alert_extraitem_delete).fadeIn();
				     
				     row.remove();
				     $('.table').trigger('update');
				} else if(response.result == "warning") {
					BootstrapDialog.show({title: 'Supplier Extras', message : response.msg,
						buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
					});
				} else {
					saveresult = 0;
					$('html, body').animate({ scrollTop: 0 }, 400);
					$('#supplier-form').find('.response').empty().prepend(alert_required).fadeIn();
				}
			},
			error: function(response){
				saveresult = 0;
				$('html, body').animate({ scrollTop: 0 }, 400);
				$('#supplier-form').find('.response').empty().prepend(alert_required).fadeIn();
			}
		});    	

      if(table.find('tbody').find('tr').length === 0){
        table.closest('.wrapper').hide();
      }
    }
  });
  
});


/**
* on currency change
*/
$('#currency').change(function() {
  var currency = $(this).val();
  var fa = $('#supplier-extras').find('.currency-cell').find('.fa');
  var currency_name = $(this).find("option:selected").text().toUpperCase();
  
  if (currency_having_symbols.indexOf(currency_name) >= 0) {
  	$(fa).removeClass().addClass('fa fa-' + currency_name.toLowerCase() ).html("");
  }
  else {
  	$(fa).removeClass().addClass('fa').html(currency_name);
  }
  
});
$('#currency').trigger('change');


$('#surcharge_currency').change(function() {
	  var currency = $(this).val();
	  var fa = $("#surcharge_amount").siblings().find(".fa");
	  var currency_name = $(this).find("option:selected").text().toUpperCase();
	  
	  if (currency_having_symbols.indexOf(currency_name) >= 0) {
	  	$(fa).removeClass().addClass('fa fa-' + currency_name.toLowerCase() ).html("");
	  }
	  else {
	  	$(fa).removeClass().addClass('fa').html(currency_name);
	  }
});


/**
* fuel surcharges
*/
function get_supplier_costs(supplier_id, transport_mode){

	if($('.custome-page-size-js').length > 0){
  		var page_size = $('.custome-page-size-js').val();
  	}else{
  		var page_size = 50;
  	}
  $.ajax({
    type: 'GET',
    timeout: 120000,
    beforeSend: function() {
        // setting a timeout
	 $('.full_relative').show();
    },
    url: '../'+supplier_id+'&'+transport_mode+'/supplier-costs?page='+page_size,
    success: function(response){
      $('#fuel_surcharges_table').empty().append(response);
      $("#div-disable-a-link .custom-pagination a").removeAttr('href');
      $("#div-disable-a-link .custom-pagination a").attr('onclick','checkboxSelectall()');

      $('.table')
        .tablesorter({
          widthFixed: true,
          widgets: ['zebra', 'filter'],
          widgetOptions: {
            filter_reset: '.reset'
          }
        })
        .tablesorterPager({
          container: $('.custom-pagination'),
          output: 'Records {startRow} to {endRow} (Total {totalRows} Results) - Page {page} of {totalPages}',
          removeRows: false,
          //size: 25
        });
      $('.table').trigger('pageSize', $('.custome-page-size-js').val());
      $('.full_relative').hide();
      checkboxSelectall();
    },
    error: function(response){
      $('#fuel_surcharges_form').find('.modal-body').empty().append(alert_error).fadeIn();
    }
  });
}

/**
* on transport mode change
*/
$('#fuel_surcharges_form #transport_mode').change(function(){
  var supplier_id = $('#supplier_id').val();
  var transport_mode = $('#transport_mode').val();
  $('input[name="transport_mode_id"]').val(transport_mode);
  if(transport_mode != "" && transport_mode != null){
	  get_supplier_costs(supplier_id, transport_mode)  
  }else{
	  $('#fuel_surcharges_table').empty();
  }
  
});


/**
* save / update supplier
*/
$('.save-fuel-surcharges').click(function(e){
  e.preventDefault();

  var form = '#'+$(this).closest('form').attr('id'),
      success = [],
      supplier_id = $('input[name="supplier_id"]').val(),
      transport_mode = $('input[name="transport_mode_id"]').val();

  function highlight(field, empty_value){
    if(field.length > 0){
      if(field.val() === empty_value){
        $(field).parent().addClass('highlight');
        success.push(false);
      } else {
        $(field).parent().removeClass('highlight');
        success.push(true);
      }
    }
  }

  highlight($(form).find('#transport_mode'), '');
  highlight($(form).find('#_surcharge_to_date'), '');
  highlight($(form).find('#_surcharge_from_date'), '');
  highlight($(form).find('#surcharge_currency'), '');

  var supplier_cost_ids = [];
  $('input[name="supplier_cost_id[]"]:checked').each(function(){
    supplier_cost_ids.push($(this).val());
  });

  $('#supplier_cost_ids').val(supplier_cost_ids);

  var check_fields = (success.indexOf(false) > -1);
  var check_supplier_cost_ids = $('#supplier_cost_ids').val();

  if(check_fields === true){
    $('html, body').animate({ scrollTop: 0 }, 400);
    $('form').find('.response').empty().prepend(alert_required).fadeIn();
  } else {
    if(check_supplier_cost_ids === '') {
      BootstrapDialog.show({
        title: 'Uh oh!',
        type: BootstrapDialog.TYPE_DANGER,
        message: 'Please select at least one Supplier Rate to apply the new Surcharges changes to.',
        buttons: [{
          label: 'OK',
          action: function(dialogItself){
            dialogItself.close();
          }
        }]
      });
    } else {
      $.ajax({
        type: 'POST',
        url: '../save-supplier-costs',
        data: $(form).serialize(),
        success: function(response){
          get_supplier_costs(supplier_id, transport_mode);
          $('form').find('.response').empty().prepend(response).fadeIn();
        },
        error: function(response){
          $('form').find('.response').empty().prepend(alert_error).fadeIn();
        }
      });
      $('html, body').animate({ scrollTop: 0 }, 400);
    }
  }
});
