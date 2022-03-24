$.fn.inlineEdit = function () {

	$(this).click(function(){
		var elem = $(this);
		var new_value, replace_with;

		var type = elem.attr('data-type');
		var curr_value = elem.parent().find('input[type="hidden"]').val();

		if(type === 'cost'){
			var currency = $(this).closest('form').attr('data-currency');
			replace_with = $('<span class="input-group-addon"><i class="fa '+currency+'"></i></span><input name="temp" type="text" class="form-control" value="'+curr_value+'" />');
		}

		if(type === 'text'){
			replace_with = $('<input name="temp" type="text" class="form-control" value="'+curr_value+'" />');
		}

		if(type === 'textarea'){
			replace_with = $('<textarea name="temp" type="textarea" class="form-control">'+curr_value+'</textarea>');
		}

		elem.hide();
		elem.before(replace_with);
		replace_with.focus();

		replace_with.blur(function(){
			if($(this).val() != ""){
				if(type === 'cost'){
					new_value = parseFloat($(this).val()).toFixed(2);
				} else {
					new_value = $(this).val();
				}
				elem.parent().find('input[name="'+$(elem).attr('data-name')+'[]"]').val(new_value);
				elem.find('.value').html(new_value);
			}
			$(this).parent().find('.input-group-addon').remove();
			$(this).remove();
			elem.show();
		});

		replace_with.keydown(function(e){
			if(e.which == 13){
				replace_with.blur();
			} else if(e.which == 27) {
				$(this).parent().find('.input-group-addon').remove();
				$(this).remove();
				elem.show();
			}
		});
	});
};