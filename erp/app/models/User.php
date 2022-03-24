<?php

class User extends ActiveRecord\Model {
	static $table_name = 'users';
    static $primary_key = 'username';
    
    /**
     * Get the array user special permission 
     * update in the func/job_costing_func.php
     */
    static function getSpecialUserPermissionerp($type){
    	
    	$return = array();
    	$perArr = User::find_by_sql(" SELECT user_list FROM tbl_user_restriction WHERE user_code=? LIMIT 1 ", array($type));
    	
    	if(!empty($perArr) && $perArr[0]->user_list != ""){
    		$return = json_decode($perArr[0]->user_list, true);
    	}
    	return $return;
    }
    /**
     * function for get permitted users
    */
    function getPermiitedUsers($userArray){
        
        try{
            //Special permission
            $users = (!empty($userArray)) ? implode(',', $userArray) : '';
            $user_list = array();
            $permission_sql = "SELECT userid FROM user_permission WHERE user_team_id IN($users)";
            $user_data = User::find_by_sql($permission_sql);
            if(!empty($user_data)){
                foreach ($user_data as $row) {
                    $user_list[] =  $row->userid;
                }
            }
            return $user_list;
        }
        catch(Exception $e){
            return $user_list;
        }
    }

    static function getUserDetailsByID($id){

        $retUser = array('fullname' => '', 'email' => '');
        try{
            $uM = User::find_by_sql('SELECT full_name,email FROM users WHERE user_id=? LIMIT 1', array($id));
            if(!empty($uM)){
                $retUser['fullname'] = $uM[0]->full_name;
                $retUser['email'] = $uM[0]->email;
            }
        }catch(Exception $e){ }

        return $retUser;
    }

    static function getUserFullName($id){
        $result = "";
        $u = User::find_by_sql("SELECT full_name FROM users WHERE user_id = ? ", array($id));
        if(!empty($u)){
            $result = $u[0]->full_name;
        }
        return $result;
    }

    /**
     * Last login details
    */
    static function lastLoginUpdate($user_id, $is_success=true){
        
        try{
            $ip = User::getIPAddress();
            $user = User::find_by_user_id($user_id);
            if($is_success){
                $user->update_attributes(
                    array('last_login_success' => date(BTL_DEF_MYSQL_DATE_TIME),
                        'login_failed_count' => 0,
                        'last_ip_address' => $ip
                    ));
            }
            else{
                if($user->is_locked == 0){
                    $login_failed_count =  is_numeric($user->login_failed_count) ? $user->login_failed_count + 1 : 0;
                    
                    if(MAX_ALLOWED_ATTEMPTS <= $login_failed_count){
                        $attributes =  array('last_login_failed' => date(BTL_DEF_MYSQL_DATE_TIME),
                                            'login_failed_count' => $login_failed_count,
                                            'is_locked' => 1,
                                            'locked_date' => date(BTL_DEF_MYSQL_DATE_TIME),
                                            'last_ip_address' => $ip
                        );
                        User::sentAccountLockMail($user_id, true);
                    }
                    else{
                        $attributes = array('last_login_failed' => date(BTL_DEF_MYSQL_DATE_TIME),
                            'login_failed_count' => $login_failed_count,
                            'last_ip_address' => $ip
                        );
                    }
                    $user->update_attributes($attributes);
                }
            }
        }
        catch(Exception $e){
            // Exception
        }
    }


    /**
     * Save password history
    */
    static function addPasswordHistory($user_id, $password){
        
        try{
            $attributes = array(
                'p_user_id' => $user_id,
                'p_password' => $password,
                'p_updated_at' => date(BTL_DEF_MYSQL_DATE_TIME)
            );

            PasswordHistory::create($attributes);
        }
        catch(Exception $e){
            //Exception
        }
    }


    /**
     * Update 2FA status
    */
    static function updateDoubeVerificationStatus($params){

        try{
            $update_status = $params['update_status'];
            $user_id = trim($params['user_id']);
            
            $userModel = User::find_by_user_id($user_id);
            $attributes = array(
                    'modified_by'                =>  $_SESSION['MM_FullName'],
                    'modified_at'                =>  date(BTL_DEF_MYSQL_DATE_TIME),
                    'is_double_verification'     =>  $update_status,
            );

            if(empty($userModel->tfa_secret) && $userModel->tfa_qr_scanned_flag == 0 && $update_status != 0){
             $length = 16;
             $attributes['tfa_secret'] = substr(str_shuffle('234ABCDEFGHIJKLMNOPQRSTUVWXYZ'),1,$length);
            }
            if($update_status == 0){
              $attributes['tfa_qr_scanned_flag'] = $update_status;  
            }
            
            $res = $userModel->update_attributes($attributes);

            if($update_status != 0){
                User::sentQrMail($params);
            }

            return $res;
        }
        catch(Exception $e){
            //Exception
        }
    }


    /**
     * Unlock user account
    */
    static function unlockAcoount($params){

        try{
            $update_status = $params['update_status'];
            $user_id = trim($params['user_id']);
            
            $userModel = User::find_by_user_id($user_id);
            $attributes = array(
                    'modified_by'                => $_SESSION['MM_FullName'],
                    'modified_at'                => date(BTL_DEF_MYSQL_DATE_TIME),
                    'is_locked'                  => $update_status,
                    'locked_date'                => null
            );
            $res = $userModel->update_attributes($attributes);
            
            if($res){
                User::sentAccountUnLockMail($user_id);
            }
            return $res;
        }
        catch(Exception $e){
            //Exception
        }
    }


    /**
     * Get IP address
    */
    function getIPAddress() {  
        //whether ip is from the share internet  
        if(!empty($_SERVER['HTTP_CLIENT_IP'])) {  
            $ip = $_SERVER['HTTP_CLIENT_IP'];  
        }  
        //whether ip is from the proxy  
        elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {  
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];  
        }  
        //whether ip is from the remote address  
        else{  
            $ip = $_SERVER['REMOTE_ADDR'];  
        }  
        return $ip;  
    }  

    /**
      * function for account lock email
    */
    static function sentAccountLockMail($user_id, $is_failed=false){

        try{
            $mail_param = array();

            $user_model = User::find_by_user_id($user_id);
            $mail_param['subject'] = "Bulk Tainer Logistics - Account Blocked";
            //Get From email data
            $from_mail = User::find_by_sql("SELECT user_list FROM tbl_user_restriction 
                WHERE user_code = 'USER_MANAGEMENT'");
            $from_mail_data = json_decode($from_mail[0]->user_list);
            $mail_param['from'] = array('email' => $from_mail_data->from_email, 'name'=> $from_mail_data->from_name);
                
            //Start : Message body
            $mail_param['message'] .= '<html><body style="font:13px Arial;width:75%;">';
            $mail_param['message'] .= "Dear ".ucfirst($user_model->full_name).",";
            $mail_param['message'] .= "<br><br>";

            if($is_failed){
                $mail_param['message'] .= "As a security precaution, your account has been blocked.<br>Someone may have tried to gain access with your credentials or you have entered incorrect credentials ".MAX_ALLOWED_ATTEMPTS." times. <br>";
                $mail_param['message'] .= "The last login attempt was from IP address - ".$user_model->last_ip_address.".";
            }
            else{
                $mail_param['message'] .= "As a security precaution, your account has been blocked.<br>Your account has been inactive since last ".USER_LOCK_PERIOD." days.";
            }

            $mail_param['message'] .= "<br><br>Please contact system administrator for activating your account.";
          
            $mail_param['message'] .= "<br><br>Kind Regards,<br><strong>Bulk Tainer Logistics </strong><br><strong>Tel:</strong> 0044(0)1642 065100";
        
            $mail_param['message'] .= "</body></html>";
          
            $mail_param['to'][] = array('email' => $user_model->email, 'name' => $user_model->full_name);
          
            $mailer = new MailController();
            $res = $mailer->sentMain($mail_param);
        }
        catch(Exception $e){
            // Exception
        }
    }

    /**
      * function for account lock email
    */
    function sentAccountUnLockMail($user_id){

        try{
            $mail_param = array();

            $user_model = User::find_by_user_id($user_id);
            $mail_param['subject'] = "Bulk Tainer Logistics - Account Unlock";
            //Get From email data
            $from_mail = User::find_by_sql("SELECT user_list FROM tbl_user_restriction 
                WHERE user_code = 'USER_MANAGEMENT'");
            $from_mail_data = json_decode($from_mail[0]->user_list);
            $mail_param['from'] = array('email' => $from_mail_data->from_email, 'name'=> $from_mail_data->from_name);
                
            //Start : Message body
            $mail_param['message'] .= '<html><body style="font:13px Arial;width:75%;">';
            $mail_param['message'] .= "Dear ".ucfirst($user_model->full_name).",";
            $mail_param['message'] .= "<br><br>";
            $mail_param['message'] .= "Your account has been unlocked. <br>";
            $mail_param['message'] .= "Please <a href='".HOME."erp.php/login'>click</a> to login.";
          
            $mail_param['message'] .= "<br><br>Kind Regards,<br><strong>Bulk Tainer Logistics </strong><br><strong>Tel:</strong> 0044(0)1642 065100";
        
            $mail_param['message'] .= "</body></html>";
          
            $mail_param['to'][] = array('email' => $user_model->email, 'name' => $user_model->full_name);
          
            $mailer = new MailController();
            $res = $mailer->sentMain($mail_param);
        }
        catch(Exception $e){
            // Exception
        }
    }

    static function sentQrMail($params){

        $user_id = trim($params['user_id']); 

        $query = "SELECT config_json FROM tbl_config WHERE item = 'URL_PARAMS'";
        $configObj = Config::find_by_sql($query);
        if(isset($configObj[0])){
            $urlObj = json_decode($configObj[0]->config_json);
            $serverType = BTL_SERVER_TYPE;
            $domain = $urlObj->$serverType;
        }
        else{
            $domain = 'bt-ms.com'; 
        }         
        $userModel = User::find_by_user_id($user_id);
        $authService = new AuthService();
        $g = $authService->getTfaObject();
        $uname = $userModel->username;
        $user_id = $userModel->user_id;
        $secret = $userModel->tfa_secret;
        $qr_img_link = $g->getURL($uname,$domain, $secret);
        $mail_param = array();
        $mail_param['subject'] = "Bulk Tainer Logistics - 2 Factor Authentication";
        //Get From email data
        $from_mail = User::find_by_sql("SELECT user_list FROM tbl_user_restriction WHERE user_code = 'USER_MANAGEMENT'");
        $from_mail_data = json_decode($from_mail[0]->user_list);
        $mail_param['from'] = array('email' => $from_mail_data->from_email, 'name'=> $from_mail_data->from_name);

        //Start : Message body
        $mail_param['message'] .= '<html><body style="font:13px Arial;width:75%;">';
        $mail_param['message'] .= "Dear ".ucfirst($userModel->full_name).",";
        $mail_param['message'] .= "<br><br>";
        $mail_param['message'] .= "Two Factor Authentication for your login has been enabled. Kindly scan the QR Code given below into your Google Authenticator App.";
        $mail_param['message'] .= "If you skip this you won't be able to login to the system.<br>";
        $mail_param['message'] .= "It's better to save this mail or download the QR code image for future use.<br>";

        $mail_param['message'] .= '<img src="'.$qr_img_link.'"> <br>';

   
        $mail_param['message'] .= "<br><br>Kind Regards,<br><strong>Bulk Tainer Logistics </strong><br><strong>Tel:</strong> 0044(0)1642 065100";
      
        $mail_param['message'] .= "</body></html>";
        
        $mail_param['to'][] = array('email' => $userModel->email, 'name' => $userModel->full_name);
        
        $mailer = new MailController();
        $res = $mailer->sentMain($mail_param);
        
    }

    static function getEmailByFullName($fullName){
    	
    	$return = null;
    	$user = User::find_by_sql(" SELECT email FROM users WHERE full_name = ?  LIMIT 1 ", array($fullName));
    	
    	if(!empty($user) && $user[0]->email != ""){
    		$return = $user[0]->email;
    	}
    	return $return;
    }

    static function getEmailByUserId($userId){
    	
    	$return = null;
    	$user = User::find_by_sql(" SELECT email FROM users WHERE user_id=? LIMIT 1 ", array($userId));
    	
    	if(!empty($user) && $user[0]->email != ""){
    		$return = $user[0]->email;
    	}
    	return $return;
    }
}
