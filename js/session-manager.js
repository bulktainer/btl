$(document).ajaxComplete(function ( event, xhr, settings) {
           if(xhr.responseText == 'LOGOUT_TRIGGERED_WHILE_AJAX'){
            location.href = appHome+'/login';
           }

        });

$(function() {
  $(".btn").live('click', function(e){
   setTimeout(function(){ inIframe(); }, 500);
  });
});

function inIframe () {
 if($('iframe').length > 0){
    $.ajax({
    	type: "POST",
    	url: appHome+"/has-session", 
    	success: function(result){
    }
   });
 }

}
