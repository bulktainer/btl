<?php

namespace Btl\Helpers;

function mysql_date($date) {
  
    $dateformat = explode('/', BTL_DEF_DATE_FORMAT);
    $datearray = explode('/', $date);
    $mysql_date = $datearray[array_search('yy', $dateformat)].'-'.$datearray[array_search('mm', $dateformat)].'-'.$datearray[array_search('dd', $dateformat)];
    return ($mysql_date != '--') ? $mysql_date : '';
    
}

function check_date($date)
{
	$date_ary = explode('/', $date);
	if(count($date_ary) == 3)
	{
		if (checkdate ($date_ary[1], $date_ary[0], $date_ary[2]))
		{
			return true;
		}
		
	}
	
	return false;
}

/**
 * common function for managers in new codeset
 * DM-13-Oct-2017
 * business overview report 
 * kick back report
 * user management
 */
function get_managers(){
	$permitted_users = array("leannep",
							"admin",
							"PaulA",
							"gary",
							"david",
							"graeme",
							"alison",
							"Guido",
							"gerwin",
							"piverson",
							"andread",
							"edoardo",
							"olivia",
							"rebeccar",
							"marco",
							"mhanafin",
							"RebeccaP",
							"ageers",
							"marcj",
							"jwebster",
							"cfraser",
							"emilyt",
							"rhughes",
							"pwood",
							"rhimsworth",
							"ahoetzinger",
							"mmorley",
							"lagullo"
							);
	return $permitted_users;
}
/**
 * common function for managers in new codeset
 * DM-24-Apr-2019
 * PO
 
 */
function get_PO_Users(){
    $permitted_po_users = array(
        "admin",
        "david",
        "gayleb",
        "jwebster",
        "gary",
        "PaulA",
        "marcj",
        "graeme",
        "jchris",
        "pelthe",
        "csmith",
        "bhessing",
        "cjessop",
        "milski"
    );
    return $permitted_po_users;
}
/**
 * common function for managers in new codeset
 * DM-24-Apr-2019
 * PO
 
 */
function get_PO_Salary_Users(){
    $permitted_po_users = array(
        "admin",
        "david",
        "gayleb",
        "jwebster",
        "gary",
        "PaulA",
        "marcj",
        "graeme"
    );
    return $permitted_po_users;
}
/**
 * function for getting customer groups
 */
function getGroupNames(){
	$groupNames = \CustomerGroup::find_by_sql(" SELECT group_id,group_name FROM customer_group WHERE isactive=1 ORDER BY group_name ASC ");
	return $groupNames;
}

function getCustomersByGroup($groupId,$customerReturnType){
	$custArray = \Customer::find_by_sql('SELECT cust_code,cust_id FROM customer WHERE customer_group=? ',array($groupId));
	$returnString = "";
	$returnArr = array();
	if(!empty($custArray)){
		foreach($custArray AS $eachCust){
			$returnArr[] = ($customerReturnType == 'cust_code') ? $eachCust->cust_code : $eachCust->cust_id;
		}
	}
	return $returnArr;
}

/**
 * function for save user log activites
 */
function savereportLog($reportType, $detailArr=array()){
	
	if(BTL_REPORT_LOG == 1){
		$updatedby = $_SESSION['MM_Username'];
		$updatedAt = date('Y-m-d H:i:s');
		
		$ip= isset($_SERVER['HTTP_X_FORWARDED_FOR']) ?	$_SERVER['HTTP_X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR'];
		$dateilArrJson = json_encode(array('ip' => $ip, 'data' => $detailArr));
		
		try{
			$sql = "INSERT INTO `report_log`
						(`report_type`, `report_run_at`, `report_run_by`, `details`)
						VALUES
						('$reportType', '$updatedAt', '$updatedby', '$dateilArrJson')";
			\Config::connection()->query($sql);
		}
		catch(Exception $e){
			//print_r($e);
		}
	}
}

/**
 * 
 * 
 */
function getInvName($billingOffice = 'GB'){
	
	$arr = array('GB' => 'INV', // uk
				 'IB' => 'INV', // iberia
				 'SG' => 'INV', // singapore
				 'USA' => 'INV', // Latam
				 'NA' => 'INV',
				 'AB' => 'INV',
				 'CN'	=> 'INV');
	return $arr[$billingOffice];
	
}

/*
 * function to update the status for the case of different activity
 */
function wtvStatusShipCases($activity,$from_town,$to_town,$supplier = "") {
    $wtv_status = 0;
    if(in_array($activity, array('SHIP', 'CSHIP'))){
        $wtv_status = 3;
        if($supplier != ""){
            $sqlvgm = \VgmRoute::find_by_sql("SELECT vgm_options from vgm_route WHERE from_address_code = ?
                                                 AND to_address_code = ? AND supp_code  = ? LIMIT 1",array($from_town,$to_town,$supplier));
        }
        if(!empty($sqlvgm)){
            if($sqlvgm[0]->vgm_options == 3){
                $wtv_status = 1;
            }
        }
    }else if(in_array($activity, array('LOAD', 'LOADD', 'LOADR', 'TIP', 'TIPDR', 'TIPRE', 'CLOAD'))){
        $wtv_status = 3;
    }
    return $wtv_status;
}

/*
 * function for get customer by multiple customer group
 */
function getCustomersByMultipleGroup($customer_group, $customerReturnType){
	$group = implode(', ', $customer_group);
	$custArray = \Customer::find_by_sql("SELECT cust_code,cust_id FROM customer WHERE customer_group IN ({$group})");
	$returnString = "";
	$returnArr = array();
	if(!empty($custArray)){
		foreach($custArray AS $eachCust){
			$returnArr[] = ($customerReturnType == 'cust_code') ? $eachCust->cust_code : $eachCust->cust_id;
		}
	}
	return $returnArr;
}

function euCountrySupport($fCountry, $tCountry){
	
	try{
		$safety_security = array();
		$get_eu_country = \Country::get_eu_countries();
		$safety_security ['readonly'] = "";
		$safety_security ['label'] ="GB MRN/MUCR/DUCR";
    	if( ($fCountry == 'GB' && in_array($tCountry, $get_eu_country)) ||
						($tCountry == 'GB' && in_array($fCountry, $get_eu_country)) ){
			$safety_security ['safety_security']= "show";
			$safety_security ['label']= "EU MRN";
		
			if( ($fCountry == 'GB' && in_array($tCountry, $get_eu_country))){
				$safety_security ['label']= "GB DUCR/MUCR";
				$safety_security ['readonly'] = "readonly";

				}
		}
		return $safety_security;

	}catch(Exception $e){
			//print_r($e);
	}
}
function get_lookup_enum($integer,$lookup_type)
{
	$result = '';
    $package = \StgLookupType::find('one', array('select' =>'enum_value', 'conditions' => array('integer_value = ? AND lookup_type =?', $integer,$lookup_type)));

    if (count($package) > 0) {
      $result = $package->enum_value;
    }
    return $result;
}

function UpdateJobSaftyGweight($jobNo){

	try{
		$r = \JobSafetySecurity::find_by_sql('SELECT jss_job_id FROM job_safety_security WHERE jss_job_no = ? LIMIT 1', array($jobNo));
		if(!empty($r)){
			\JobSafetySecurity::connection()->query("call updateSSjobLoadedWeight(".$r[0]->jss_job_id.")");
		}
	}catch(Exception $e){
			//print_r($e);
	}

}

/*
 * function for get user name by team id
 */
function getBusinessDevelopmentUser($temp_id){
    $userArray = \User::find_by_sql("SELECT users.username as name FROM users inner join user_permission on users.username=user_permission.userid where user_permission.user_team_id =? AND users.username =?",array($temp_id,$_SESSION['MM_Username']));
    $returnArr = array();
    if(!empty($userArray)){
        foreach($userArray AS $eachCust){
            $returnArr[] = $eachCust->name;
        }
    }
    return $returnArr;
}

//get the eori number from customer code
function getEoriNumber($custCode){
    $custEori = \Customer::find_by_sql("SELECT cust_eori FROM customer WHERE cust_code = ? LIMIT 1",array($custCode));
    return $custEori[0]->cust_eori;
}

//return the MAN,SPOT,DED Business type array
function getBusinessTankType(){
	$business_type = array((object) array( 'val' => 'S','txt' => 'SPOT'), (object) array( 'val' => 'M','txt' => 'MAN'), (object) array( 'val' => 'D','txt' => 'DED'));
	return $business_type;
}

function getUrlParamsFromMultiselect($select,$param,$append = false){
	$queryParams = array();
	foreach ($select as $key => $value) {
		$queryParams[] = $param."[]=".$value;
	}
	$queryString = implode('&', $queryParams);
	if($append){
       $queryString = '&'.$queryString;
	}
	else{
		$queryString = '?'.$queryString;
	}
	return $queryString;
}

/*
	* function to return the status of the weight,time,vgm
	*/
function get_wtv_status($weight,$activity,$time = "", $j_seals_required =0, $seals = ""){
		
	$wtv_stat = 0;
	if(in_array($activity, array('LOAD', 'LOADD', 'LOADR', 'CLOAD'))){
		
		$plweight = ($weight == 0) ? "" : $weight;
		
		if($plweight != "" && $time != "" && (!$j_seals_required || ($j_seals_required == 1 && $seals != ""))){
			$wtv_stat = 1;
		} elseif($plweight == "" && $time == "" && (($j_seals_required == 1 && $seals == "") || !$j_seals_required)){
			$wtv_stat = 3;
		}else if($time != "" && (!$j_seals_required || ($j_seals_required == 1 && $seals != "")) && in_array($activity, array('LOADD'))){
			$wtv_stat = 1;
		}else {
			$wtv_stat = 2;
		}
	}
	else if(in_array($activity, array('TIP', 'TIPDR', 'TIPRE'))){
		$plweight = ($weight == 0) ? "" : $weight;
		
		if($plweight != "" && $time != ""){
			$wtv_stat = 1;
		} elseif($plweight == "" && $time == ""){
			$wtv_stat = 3;
		}else if($time != "" && in_array($activity, array('TIPDR'))){
			$wtv_stat = 1;
		}else {
			$wtv_stat = 2;
		}
	}
	return $wtv_stat;
}

function validateDate($date,$format='Y-m-d'){
	$dateArr = explode('-', $date);
	switch ($format) {
		case 'd-m-Y':
			$month = $dateArr[1];
			$year = $dateArr[2];
			$day = $dateArr[0];
			break;
		case 'm-d-Y':
			$month = $dateArr[0];
			$year = $dateArr[2];
			$day = $dateArr[1];
			break;
		default:
			$month = $dateArr[1];
			$year = $dateArr[0];
			$day = $dateArr[2];
			break;
	}
	return checkdate($month, $day, $year);
}
