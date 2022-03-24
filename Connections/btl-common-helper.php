<?php

function btl_common_pdf_logo_by_customer($type = 'pdf', $billingType = 'GB', $templateNumber = 1){
	$returnType = "";
	
	switch ($type){
		CASE 'pdf_inv' 		:
							if(in_array($billingType, array('IB','ES'))){
								$returnType = BTL_BASE_PATH.'/../pdf/'.BTL_INV_IBERIA_TEMPLATE;
							}else if($billingType == 'SG'){
								$returnType = BTL_BASE_PATH.'/../pdf/'.BTL_INV_SINGAPORE_TEMPLATE;
							}else if($billingType == 'CN'){
								$returnType = BTL_BASE_PATH.'/../pdf/'.BTL_INV_CHINA_TEMPLATE;
							}else if($billingType == 'USA'){
								$returnType = BTL_BASE_PATH.'/../pdf/'.BTL_INV_USA_TEMPLATE;
							}else if($billingType == 'NA'){
								$returnType = BTL_BASE_PATH.'/../pdf/'.BTL_INV_NA_TEMPLATE;
							}else if($billingType == 'AB'){
								$returnType = BTL_BASE_PATH.'/../pdf/'.BTL_INV_AB_TEMPLATE;
							}else{
								$returnType = ($templateNumber == 1) ? BTL_BASE_PATH.'/../pdf/'.BTL_PDF_JOB_TEMPLATE_1 : BTL_BASE_PATH.'/../pdf/'.BTL_PDF_JOB_TEMPLATE_2;
							}
							break;
			
		CASE 'pdf' 		: 
							if(in_array($billingType, array('IB','ES'))){
								$returnType = BTL_BASE_PATH.'/../pdf/'.BTL_PDF_JOB_TEMPLATE_IBERIA;
							}else if($billingType == 'SG'){
								$returnType = BTL_BASE_PATH.'/../pdf/'.BTL_PDF_JOB_TEMPLATE_SINGAPORE;
							}else if($billingType == 'CN'){
								$returnType = BTL_BASE_PATH.'/../pdf/'.BTL_PDF_JOB_TEMPLATE_CHINA;
							}else if($billingType == 'USA'){
								$returnType = BTL_BASE_PATH.'/../pdf/'.BTL_PDF_JOB_TEMPLATE_USA;
							}else if($billingType == 'NA'){
								$returnType = BTL_BASE_PATH.'/../pdf/'.BTL_PDF_JOB_TEMPLATE_NA;
							}else if($billingType == 'AB'){
								$returnType = BTL_BASE_PATH.'/../pdf/'.BTL_PDF_JOB_TEMPLATE_AB;
							}else{
								$returnType = ($templateNumber == 1) ? BTL_BASE_PATH.'/../pdf/'.BTL_PDF_JOB_TEMPLATE_1 : BTL_BASE_PATH.'/../pdf/'.BTL_PDF_JOB_TEMPLATE_2;
							}	
							break;
		CASE 'logo' 	:
							if(in_array($billingType, array('IB','ES'))){
								$returnType = BTL_PDF_QUOTE_LOGO_IBERIA;
							}else if($billingType == 'SG'){
								$returnType = BTL_PDF_QUOTE_LOGO_SINGAPORE;
							}else if($billingType == 'CN'){
								$returnType = BTL_PDF_QUOTE_LOGO_CHINA;
							}else if($billingType == 'USA'){
								$returnType = BTL_PDF_QUOTE_LOGO_USA;
							}else if($billingType == 'NA'){
								$returnType = BTL_PDF_QUOTE_LOGO_NA;
							}else if($billingType == 'AB'){
								$returnType = BTL_PDF_QUOTE_LOGO_AB;
							}else{
								$returnType = BTL_PDF_QUOTE_LOGO;
							}
							break;
		CASE 'ss_excel' :
							if(in_array($billingType, array('IB','ES'))){
								$returnType = BTL_XLS_QUOTE_TEMPLATE_IBERIA;
							}else if($billingType == 'SG'){
								$returnType = BTL_XLS_QUOTE_TEMPLATE_SINGAPORE;
							}else if($billingType == 'CN'){
								$returnType = BTL_XLS_QUOTE_TEMPLATE_CHINA;
							}else if($billingType == 'USA'){
								$returnType = BTL_XLS_QUOTE_TEMPLATE_USA;
							}else if($billingType == 'NA'){
								$returnType = BTL_XLS_QUOTE_TEMPLATE_NA;
							}else if($billingType == 'AB'){
								$returnType = BTL_XLS_QUOTE_TEMPLATE_AB;
							}else{
								$returnType = BTL_XLS_QUOTE_TEMPLATE_1;
							}
							break;
		CASE 'ds_excel'	:
							if(in_array($billingType, array('IB','ES'))){
								$returnType = DS_BTL_XLS_QUOTE_TEMPLATE_IBERIA;
							}else if($billingType == 'SG'){
								$returnType = DS_BTL_XLS_QUOTE_TEMPLATE_SINGAPORE;
							}else if($billingType == 'CN'){
								$returnType = DS_BTL_XLS_QUOTE_TEMPLATE_CHINA;
							}else if($billingType == 'USA'){
								$returnType = DS_BTL_XLS_QUOTE_TEMPLATE_USA;
							}else if($billingType == 'NA'){
								$returnType = DS_BTL_XLS_QUOTE_TEMPLATE_NA;
							}else if($billingType == 'AB'){
								$returnType = DS_BTL_XLS_QUOTE_TEMPLATE_AB;
							}else{
								$returnType = DS_BTL_XLS_QUOTE_TEMPLATE_1;
							}
							break;
	}
	return $returnType;
}


function customerBillingOfiiceCore($combine = false){
	$bo = array( 'GB'         => 'United Kingdom',
				  'SG'         => 'Singapore',
				  'IB'         => 'Iberia',
				  'USA'        => 'USA',
				  'NA'         => 'NA',
				  'CN'	       => 'China',
				  'AB'	       => 'Nordics',
	              'E'          => 'BTT ES');
	if($combine){
		$bo['BTTUK'] = "BTT UK";
	}else{
		$bo['I'] = "BTT Intermodal";
		$bo['D'] = "BTT Domestic";
	}
	return $bo;
}

/**
 * function for encode special characters issue
 * @param unknown_type $str
 * @return string
 */
function iconvPDFencoding($str){
	return iconv('UTF-8', 'windows-1252', $str);
}

/**
 * function for extend session values
 */
function extendSessionValues($Bulktest){
    if (!isset($_SESSION)) {
        session_start();
    }
    
    $is_not_authentication_route = true;
    if(!empty(strpos($_SERVER['REQUEST_URI'], 'auth'))){
    	$is_not_authentication_route = false;
    }

    $is_ajax = false;
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' &&  $is_not_authentication_route ) {
        $is_ajax = true;
    }
    // redirect if not logged in
    if (!isset($_SESSION['MM_Username'])){
        session_set_cookie_params(0);
        
        // redirect if not logged in
        if(isset($_COOKIE['user']) && $_COOKIE['user'] != ""){
            $userName = $_COOKIE['user'];
            
            $LoginRS__query=sprintf("SELECT * FROM users WHERE username='%s' LIMIT 1 ",trim($userName));
            $LoginRS = mysql_query($LoginRS__query, $Bulktest) or die(mysql_error());
            $loginFoundUser = mysql_num_rows($LoginRS);
            
            if ($loginFoundUser) {
                $loginStrGroup  = mysql_result($LoginRS,0,'access');
                $loginStrName = mysql_result($LoginRS,0,'full_name');
                $loginStrCustCode = mysql_result($LoginRS,0,'u_cust_code');
                $login_email = mysql_result($LoginRS,0,'email');
                $login_tel = mysql_result($LoginRS,0,'tel');
                $login_gmail_pass = mysql_result($LoginRS,0,'gmail_pass');
                $user_id = mysql_result($LoginRS, 0, 'user_id');
                $is_admin = mysql_result($LoginRS, 0, 'is_admin');
                $session_period = mysql_result($LoginRS, 0, 'session_period');
                if(empty($session_period)){
                	$session_period = DEFAULT_SESSION_PERIOD;
                }
                $now = date(BTL_DEF_MYSQL_DATE_TIME);
                $cookieDate = date(BTL_DEF_MYSQL_DATE_TIME, strtotime($_COOKIE['active_time']));
                $expire_time = date(BTL_DEF_MYSQL_DATE_TIME, strtotime("+ {$session_period} minutes {$cookieDate}"));

                if($now < $expire_time){
	                //declare session variables and assign them
	                $_SESSION['MM_Username'] = $userName;
	                $_SESSION['MM_UserGroup'] = $loginStrGroup;
	                $_SESSION['MM_FullName'] = $loginStrName;
	                $_SESSION['MM_CustCode'] = $loginStrCustCode;
	                $_SESSION['user-email'] = $login_email;
	                $_SESSION['user-tel'] = $login_tel;
	                $_SESSION['user_id'] =  $user_id;
	                $_SESSION['is_admin'] = $is_admin;
	                setcookie('active_time', date(BTL_DEF_MYSQL_DATE_TIME), 0, "/"); 

	                // To get menu html
	                $_SESSION['menu_html'] = getMenuList($Bulktest);
	            } else {
	                setcookie('user', null, -1, '/');
	                setcookie('j_id', null, -1, '/');
	                setcookie('active_time', null, -1, '/');
	                
	                if($is_ajax){
	                    echo 'LOGOUT_TRIGGERED_WHILE_AJAX'; exit;
	                } else {
	                    header("Location: " . HOME . "erp.php/login");
	                }
	            }

            } else {
            	if($is_ajax){
			       echo 'LOGOUT_TRIGGERED_WHILE_AJAX'; exit;
            	} else {
                    header("Location: " . HOME . "erp.php/login");
            	}
            }
        } else {
        	if($is_ajax){
			    echo 'LOGOUT_TRIGGERED_WHILE_AJAX'; exit;
			}
            if(stripos($_SERVER['PHP_SELF'], "erp.php/auth") === false && stripos($_SERVER['PHP_SELF'], "erp.php/login") === false){
                header("Location: " . HOME . "erp.php/login");
            }
        }
    } 
}
