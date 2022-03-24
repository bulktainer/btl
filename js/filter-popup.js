function showFilterBox(popupId) {
  var popup = '#'+popupId;
  $(popup).addClass("show");
  $(popup+' .popup_search').focus();
  $(".popuptext").each(function(index, element) {
    var id = $(element).attr('id');
    if(id != popupId){
      if($(element).hasClass('show')){
         $(element).removeClass('show');
      }
    }
  });
}

$(document).on('keypress', '.popup_search', function(e){
  if (e.which == 13) {
    var elem = e.srcElement.id;
    var elem_id = '#'+elem;
    var search = $(elem_id).val();
    var realElementId = elem_id.replace("_search", "");
    $(realElementId).val(search);
    $(elem_id).parent().parent().removeClass('show');
  }
});


$(function() {
    LoadPopUpFilter()
});

function getSearchInput(id,element,valueText){
  var type = $(element).attr('data-type');
  var placeholder = $(element).attr('placeholder');
  var returnHtml = '';
  switch(type){
    case 'text':
    returnHtml += '<div class="input-group">';
    returnHtml += '<input type="text" class="form-control popup_search filter-input-fld" id="'+id+'" '+valueText+' placeholder="'+placeholder+'" autofocus>';
    returnHtml += '<span class="input-group-addon"><span class="btn btn-success" style="padding:0px 12px;"';
    returnHtml += ' onclick="closePopUpDiv(\''+id+'\',\'text\')"> Go </span> </span>';
    returnHtml += '</div>';
    break;
    case 'datepicker':
    var placeholderText = '';
    if(placeholder && placeholder !=  undefined){
      placeholderText = ' placeholder="'+placeholder+'" '
    }

    returnHtml += '<div class="input-group">';
    returnHtml += '<input type="text" ';
    returnHtml += 'class="datepicker form-control date-validate-only filter-input-fld" ';
    returnHtml += 'id="'+id+'" name="'+id+'" '+valueText+' ';
    returnHtml += ' maxlength="10" '+ placeholderText +' /> <span ';
    returnHtml += 'class="input-group-addon"><span ';
    returnHtml += ' class="glyphicon glyphicon-calendar" onclick="showDatePicker(\''+id+'\')"></span> </span>';
    returnHtml += '<span class="input-group-addon"><span class="btn btn-success" style="padding:0px 12px;"';
    returnHtml += ' onclick="closePopUpDiv(\''+id+'\')"> Go </span> </span>';
    returnHtml += '</div>';
    
    break;
    case 'number':
      var operand = '';
      var value = $(element).val();
      if(value.indexOf('gteq') != -1){
            value = value.replace('gteq','');
            operand = 'gteq';
      }
      else if(value.indexOf('lteq') != -1 ){
          value = value.replace('lteq','');
          operand = 'lteq';
       }     
      else if(value.indexOf('gt') != -1){
        value = value.replace('gt','');
        operand = 'gt';
      }       
      else if(value.indexOf('lt') != -1){
        value = value.replace('lt','');
        operand = 'lt';
      }       
     else if(value.indexOf('eq') != -1 ){
       value = value.replace('eq','');
       operand = 'eq';
     }
    returnHtml +='<div class="input-group"><input type="number" value= "'+value+'" placeholder="'+placeholder+'"class="form-control filter-input-fld" id="'+id+'" min="0" autofocus>';
    returnHtml +='<span class="input-group-addon"><select class="popup_select filter-input-fld" id="'+id+'_select">';
    returnHtml +='<option value="eq"';
    if(operand == 'eq'){
      returnHtml += 'selected ="selected"';
    }
    returnHtml +='>=</option>';

    returnHtml +='<option value="gt"';
    if(operand == 'gt'){
      returnHtml += 'selected ="selected"';
    }
    returnHtml +='>&gt;</option>';

    returnHtml +='<option value="lt"';
    if(operand == 'lt'){
      returnHtml += 'selected ="selected"';
    }
    returnHtml += '>&lt;</option>';

    returnHtml +='<option value="gteq"';
    if(operand == 'gteq'){
      returnHtml += 'selected ="selected"';
    }
    returnHtml +='>&gt;=</option>';

    returnHtml +='<option value="lteq"';
    if(operand == 'lteq'){
      returnHtml += 'selected ="selected"';
    }
    returnHtml +='>&lt;=</option>';
    returnHtml +='</select></span>';
    returnHtml += '<span class="input-group-addon"><span class="btn btn-success" style="padding:0px 12px;"';
    returnHtml += ' onclick="closePopUpDiv(\''+id+'\',\'number\')"> Go </span> </span>';
    returnHtml += '</div>';
    break;
    case 'select':
    var value = $(element).val();
    var options = '';
    options = '<option>All</option>'
    optionsObj = JSON.parse($(element).attr('data-options'));
    if(optionsObj){
        for(i=0; i< optionsObj.length;i++){
          options +='<option value="'+optionsObj[i].text+'"';
          if(value == optionsObj[i].text){
            options +=' selected ="selecetd" ';
          }
          options +='>'+optionsObj[i].text+'</option>'
        }
    }
    returnHtml += '<select name="'+id+'" id="'+id+'" class="chosen form-control filter popup-values" onchange="closePopUpDiv(\''+id+'\',\'select\')">'
    returnHtml += options;
    returnHtml += '</select>';
    break;
    case 'textarea':
    var value = $(element).val();
    returnHtml += '<div class="input-group">';
    returnHtml += '<textarea class="form-control popup_search filter-input-fld" id="'+id+'"  placeholder="'+placeholder+'" autofocus>'+value+'</textarea>';
    returnHtml += '<span class="input-group-addon"><span class="btn btn-success btn-popup" style="padding:0px 12px;"';
    returnHtml += ' onclick="closePopUpDiv(\''+id+'\',\'text\')"> Go </span> </span>';
    returnHtml += '</div>';
    break;
  }
  return returnHtml;
}
  
  function closePopUpDiv(id,type='datepicker'){
    var mainDiv = $('#'+id).parent().parent();   
    var mainDivId =  $(mainDiv).attr('id');
    switch(type){
      case 'number':
         var operandId =  '#'+id+'_select';
         var operand = $(operandId+' :selected').text();
         var value = $('#'+id).val();
         if(value)
         value = operand + value;
         else
          value = '';
      break;
      case 'datepicker':
          var value = $('#'+mainDivId+' .datepicker').val()
      break;
      case 'select':
          var value = $('#'+id+' :selected').text();
          mainDiv = $('#'+id).parent();
      break;
      case 'text':
          var value = $('#'+id).val();
          value = value.trimStart();
      break;
    }
     
     var textBoxId = id.replace("_search", "");
     $('#'+textBoxId).val(value);
     $(mainDiv).removeClass('show');
  }
  
  function showDatePicker(id){
    $('#'+id).focus();
  }
  
 function LoadPopUpFilter(){
     $(".popup-filter").each(function(index, element) {
       var id = $(element).attr('id');
       var html = "";
       var popup_id = id +'_popup';
       var search_id = id + '_search';
       var type = $(element).attr('data-type');
       var popup_style = $(element).attr('data-popup-style');
       popup_style_text = '';
       var value = $(element).val();
       if(type == 'number'){
          if(value.indexOf('gteq') != -1){
                value = value.replace('gteq','>=');
          }
          else if(value.indexOf('lteq') != -1 ){
              value = value.replace('lteq','<=');
          }     
          else if(value.indexOf('gt') != -1){
            value = value.replace('gt','>');
          }       
          else if(value.indexOf('lt') != -1){
            value = value.replace('lt','<');
          }       
         else if(value.indexOf('eq') != -1 ){
           value = value.replace('eq','=');
         }
       }
       var valueText = '';
       if(value && value !=undefined ){
        valueText = ' value="'+value+'" ';
       }
       if(popup_style && popup_style != undefined){
          popup_style_text = 'style = "'+popup_style+'" ';
       }
       html += '<div class="popup">';
       html += '<a onclick="showFilterBox(\''+popup_id+'\')" class="filter-toggler">';
       html += '<input type="text" name="'+id+'" id="'+id+'" class="form-control text popup-values filter-input-fld" '+valueText+' readonly="readonly">';
       html += '</a>';
       html += '<span class="popuptext" id="'+popup_id+'" '+popup_style_text+'>';
       html += getSearchInput(search_id,element,valueText);
       html += '<span>';
       html += '</div>';
       if(type == 'datepicker'){
         setTimeout(function() {
          $('#'+search_id).datepicker({
              dateFormat: btl_default_date_format,
              changeMonth: true,
              changeYear: true,
              inline: true,
              startDate: 0
          });
          $(".datepicker").attr("autocomplete", "off");
        }, 2000);
       }
       
       $('#'+id).parent().html(html);
    });
 }
