<?php
/***
 	- Page for recreating exisitng mysql functions
	- that are depreciated in php 7
*/

if (!function_exists('mysql_select_db')){ 
    function mysql_select_db($database_Bulktest, $Bulktest){
    	return mysqli_select_db($Bulktest, $database_Bulktest);
    }
}

if (!function_exists('mysql_query')){ 
    function mysql_query($_sql_stmt, $temp = ''){
        global $Bulktest;
    	return mysqli_query($Bulktest, $_sql_stmt);
    }
}


if (!function_exists('mysql_fetch_assoc')){ 
    function mysql_fetch_assoc($_recset){
    	return mysqli_fetch_assoc($_recset);
    }
}

if (!function_exists('mysql_error')){ 
    function mysql_error(){
        global $Bulktest;
    	return mysqli_error($Bulktest);
    }
}

if (!function_exists('mysql_escape_string')){ 
    function mysql_escape_string($theValue){
        global $Bulktest;
    	return mysqli_escape_string($Bulktest, $theValue);
    }
}

if (!function_exists('mysql_real_escape_string')){ 
    function mysql_real_escape_string($theValue){
    	global $Bulktest;
    	return mysqli_real_escape_string($Bulktest, $theValue);
    }
}

if (!function_exists('mysql_num_rows')){ 
    function mysql_num_rows($rows){
    	return mysqli_num_rows($rows);
    }
}

if (!function_exists('mysql_result')){ 
    function mysql_result($query ,$rows = 0, $field = ""){
    	$data = array();
    	$query->data_seek($row); 
    	$data = $query->fetch_array(); 
    	if(!empty($data) && $field != "" && array_key_exists($field, $data)){
    		$data = $data[$field];
    	}
    	return $data;
    }
}

if (!function_exists('mysql_close')){ 
    function mysql_close(){
        global $Bulktest;
    	return mysqli_close($Bulktest);
    }
}

if (!function_exists('mysql_errno')){ 
    function mysql_errno(){
        global $Bulktest;
        return mysqli_errno($Bulktest);
    }
}

if (!function_exists('mysql_connect')){ 
    function mysql_connect($hostname_Bulktest, $username_Bulktest, $password_Bulktest, $database_Bulktest){
        return mysqli_connect($hostname_Bulktest, $username_Bulktest, $password_Bulktest, $database_Bulktest);
    }
}

if (!function_exists('mysql_fetch_array')){ 
    function mysql_fetch_array($query,$type = MYSQLI_ASSOC){
        return mysqli_fetch_array($query, $type);
    }
}

if (!function_exists('mysql_fetch_row')){ 
    function mysql_fetch_row($query){
        return mysqli_fetch_row($query);
    }
}

if (!function_exists('mysql_data_seek')){ 
    function mysql_data_seek($query, $row){
        return mysqli_data_seek($query, $row);
    }
}

if (!function_exists('mysql_affected_rows')){ 
    function mysql_affected_rows(){
        global $Bulktest;
        return mysqli_affected_rows($Bulktest);
    }
}

if (!function_exists('set_magic_quotes_runtime')){
    function set_magic_quotes_runtime($s){
    }
}

if (!function_exists('mysql_insert_id')){
    function mysql_insert_id(){
        global $Bulktest;
        return mysqli_insert_id($Bulktest);
    }
}

if (!function_exists('mysql_free_result')){
    function mysql_free_result($query){
        return mysqli_free_result($query);
    }
}

function manage_infinity($expression){
    $result = is_infinite($expression) ? 0 : $expression;
    $result = is_nan($result) ? 0 : $result;
    
    return $result;
}


?>