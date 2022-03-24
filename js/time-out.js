/**
 * Dm-15-Nov-2017
 */
/*$(document).ready(function(){
	*//**
	 * before 5 minu
	 * eg if phpTimeOut = 300 (5 Minutes)
	 *    : 1400 is default PHP 24Min // A
	 *    : 600 is 10 min before session expire // B
	 *    : (300 / 60) * 60,000 => 300 * 1000 // C
	 *//*
	var phpTimeOut = ($('#phphServerTimeOut').length > 0 ) ? $('#phphServerTimeOut').val() : 1400 ; // A
	var phpTimeOut = phpTimeOut - 600 ; // B	
	var increaseTime = phpTimeOut * 1000; // C
	var greaterTime = new Date().getTime() + increaseTime;
	var currentTime = new Date().getTime();
	
	var aa = new Date(greaterTime);
	var bb = new Date(currentTime);
	console.log('Load : ' + aa + ' - ' + bb);
	
	var _btl_timout_duration = 10;
	var _btl_timout_check_frequency = 5; //runs every second
	
	var _btl_timout_duration_ms = _btl_timout_duration * 1000;
	var _btl_timout_check_ms = _btl_timout_duration_ms / _btl_timout_check_frequency;
	var userName = ($('#login-username').length > 0) ? $('#login-username').val() : '';
	var _keep_session_url = "/include/logout.php?_keep_session=yes&user="+userName;
	var _btl_url = window.location.href;
	_btl_url = _btl_url.substring(0,_btl_url.lastIndexOf(".php"));
	_btl_url = _btl_url.substring(0,_btl_url.lastIndexOf("/"));
	_keep_session_url = _btl_url + _keep_session_url;

	function timeout_refresh() {
    	if(currentTime >= greaterTime) {
			$.ajax({  
    			type: "GET", 
    			cache: false, 
    			url: _keep_session_url,  
    			dataType: "text",
    			success: function(result)
    			{ 
    				currentTime = new Date().getTime();
    				greaterTime = new Date().getTime() + increaseTime;
    				
    				var aa1 = new Date(greaterTime);
    		    	var bb1 = new Date(currentTime);
    		    	console.log('Success : ' + aa1 + ' - ' + bb1);
    				setTimeout(timeout_refresh, _btl_timout_check_ms);
    			}  
    		});
    	} else {
        	currentTime = new Date().getTime();
        	setTimeout(timeout_refresh, _btl_timout_check_ms);
        }
    }
    setTimeout(timeout_refresh, _btl_timout_check_ms);
});

*/
//old code
/*$(document).ready(function(){

	var _btl_timout_duration = 3600; 	  //1 hour : This need to be configured in logout.php also
	var _btl_timout_check_frequency = 60; //60 times
	
	var _btl_timout_duration_ms = _btl_timout_duration * 1000;
	var _btl_timout_check_ms = _btl_timout_duration_ms / _btl_timout_check_frequency;
	var _keep_session_url = "/include/logout.php?_keep_session=yes";
	var _kill_session_url = "/include/logout.php?_stop_session=yes";
	var _btl_url = window.location.href;
	_btl_url = _btl_url.substring(0,_btl_url.lastIndexOf(".php"));
	_btl_url = _btl_url.substring(0,_btl_url.lastIndexOf("/"));
	_keep_session_url = _btl_url + _keep_session_url;
	_kill_session_url = _btl_url + _kill_session_url;
	
	//1 hour timeout
    var idle_time = new Date().getTime();
    $(document.body).bind("mousemove keypress", function(e) {
        idle_time = new Date().getTime();
    });
    
    function timeout_refresh() {
    	if(new Date().getTime() - idle_time >= _btl_timout_duration_ms) {
    		if(confirm("Your session has timed out. \nDo you want to extend the session?")){
    			$.ajax({  
        			type: "GET", 
        			cache: false, 
        			url: _keep_session_url,  
        			dataType: "text",
        			success: function(result)
        			{ 
        				idle_time = new Date().getTime();
        				setTimeout(timeout_refresh, _btl_timout_check_ms);
        			}  
        		});
    		} else {
    			$.ajax({  
        			type: "GET", 
        			cache: false, 
        			url: _kill_session_url,  
        			dataType: "text",
        			success: function(result)
        			{ 
        				window.location.reload(true);
        			}  
        		});
    		}
    	}
        else {
        	$.ajax({
    			type: "GET", 
    			cache: false, 
    			url: _keep_session_url,  
    			dataType: "text",
    			success: function(result){}  
    		});
        	setTimeout(timeout_refresh, _btl_timout_check_ms);
        }
            
    }
    
    setTimeout(timeout_refresh, _btl_timout_check_ms);

});*/