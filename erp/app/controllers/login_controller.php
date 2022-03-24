<?php

class LoginController extends BaseController
{
    //Login Function
    function index($auth=null)
    {
      $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/login.js"></script>'.chr(10);
      if(!isset($_SESSION)) {
        session_start();
      }
      
      if(isset($_SESSION['MM_Username'])){
          header('Location:/Welcome.php');
      }
      
      if($auth == "err"){
        $msg = "Incorrect Username/Password or Account has been locked!"; // validation message
      } else if($auth == "token_expire"){
        $msg = "Password reset link expire after 1 hour if unused!";
      }
      else{
        $msg = "";
      }

      $loginFormAction = HOME.'erp.php/auth/authenticate';//Form action url
      render("login/index", array(
          'loginFormAction'=> $loginFormAction,
           "errors" => $msg
      ),"layouts/loginstyle");
    }
    
    //check login credentials
    function authentication(){

      if(isset($_POST['username'])) {
        $loginUsername           = $_POST['username'];
        $password                = hash_hmac('sha256', trim($_POST['password']), SECRET_KEY);
        $MM_fldUserAuthorization = "access";
        $MM_redirectLoginSuccess = "Welcome.php";
        $MM_redirectLoginFailed  = HOME . "erp.php/auth/login";
        $MM_redirecttoReferrer   = false;
        
        $LoginRS__query = User::find_by_sql("SELECT * FROM users WHERE username = ? AND password = ? AND is_active = 1 AND is_locked=0", array($loginUsername,$password));
        
        if(!empty($LoginRS__query)){
          $password_age = "-".PASSWORD_AGE." day";
          $password_updated  = date(BTL_DEF_MYSQL_DATE_TIME, strtotime($LoginRS__query[0]->password_updated));
          $expire_date       = date(BTL_DEF_MYSQL_DATE_TIME, strtotime($password_age));
          $user_id           = $LoginRS__query[0]->user_id;
          $MM_redirectResetPage    = HOME."erp.php/auth/".$user_id."/reset-password";   
          $tfa_auth_passed = true; 
          $tfa_enabled      = $LoginRS__query[0]->is_double_verification;
          $tfa_qr_scanned   = $LoginRS__query[0]->tfa_qr_scanned_flag;  

          if($password_updated >= $expire_date){
            if($tfa_enabled == 1 && $tfa_qr_scanned == 0){
               $MM_redirectLoginSuccess = "erp.php/auth/scan-tfa-qr/".sha1($user_id);
               header("Location: ". HOME . $MM_redirectLoginSuccess);
            }
            else{
              $loginStrGroup    = $LoginRS__query[0]->access;
              $loginStrName     = $LoginRS__query[0]->full_name;
              $loginStrCustCode = $LoginRS__query[0]->u_cust_code;
              $login_email      = $LoginRS__query[0]->email;
              $login_tel        = $LoginRS__query[0]->tel;
              $login_gmail_pass = $LoginRS__query[0]->gmail_pass;
              $loginUsername    = $LoginRS__query[0]->username;
              $is_admin         = $LoginRS__query[0]->is_admin;
              $secret           = $LoginRS__query[0]->tfa_secret;
        
              //declare session variables and assign them

              if($tfa_enabled == 1 && $tfa_qr_scanned == 1){
                if(isset($_POST['code'])){
                  $tfa_auth_passed = $this->tfaAuthentication($secret,$_POST['code']);
                }
                else{
                  $tfa_auth_passed = false; 
                }
              }
              if($tfa_auth_passed){
                  $_SESSION['MM_Username']  = $loginUsername;
                  $_SESSION['MM_UserGroup'] = $loginStrGroup;       
                  $_SESSION['MM_FullName']  = $loginStrName; 
                  $_SESSION['MM_CustCode']  = $loginStrCustCode;
                  $_SESSION['user-email']   = $login_email;
                  $_SESSION['user-tel']     = $login_tel;
                  $_SESSION['user_id']      = $user_id;
                  $_SESSION['is_admin']     = $is_admin;
                    
                  setcookie('user', $loginUsername, 0, "/"); //expire when browser close           
                  setcookie('active_time', date(BTL_DEF_MYSQL_DATE_TIME), 0, "/"); //expire when browser close
                  
                  if (isset($_SESSION['PrevUrl']) && false) {
                    $MM_redirectLoginSuccess = $_SESSION['PrevUrl'];  
                  }
                  // Last login success
                  User::lastLoginUpdate($user_id, true);
                  header("Location: ". HOME . $MM_redirectLoginSuccess);
              }
              else{
                    //User::lastLoginUpdate($user_id, false);
                    header("Location: {$MM_redirectLoginFailed}" . "/err" );
              } 
            }
          }
          else{
            header("Location: $MM_redirectResetPage");
          }
        }
        else{
          $user_result = User::find_by_sql("SELECT * FROM users WHERE username = ? AND is_locked=0", array($loginUsername));
          if($user_result){
            $user_id = $user_result[0]->user_id;
            User::lastLoginUpdate($user_id, false);
          }
          header("Location: {$MM_redirectLoginFailed}" . "/err" );
        }
      }
    }
    
    function logout(){
        session_set_cookie_params(0);

        if (!isset($_SESSION)) {
            session_start();
        }

        if ((isset($_SESSION))){
            //to fully log out a visitor we need to clear the session varialbles
            $_SESSION['MM_Username']   = NULL;
            $_SESSION['MM_UserGroup']  = NULL;
            $_SESSION['MM_FullName']   = NULL;
            $_SESSION['MM_CustCode']   = NULL;
            $_SESSION['PrevUrl']       = NULL;
            $_SESSION['user-email']    = NULL;
            $_SESSION['user-tel']      = NULL;
            $_SESSION['user_id']       = NULL;
            $_SESSION['is_admin']      = NULL;
            $_SESSION['menu_html']     = NULL;
            unset($_SESSION['MM_Username']);
            unset($_SESSION['MM_UserGroup']);
            unset($_SESSION['MM_FullName']);
            unset($_SESSION['MM_CustCode']);
            unset($_SESSION['PrevUrl']);
            unset($_SESSION['user-email']);
            unset($_SESSION['user-tel']);
            unset($_SESSION['user_id']);
            unset($_SESSION['is_admin']);
            unset($_SESSION['user_return_url']);
            unset($_SESSION['menu_html'] );
            unset($_COOKIE['user']);
            unset($_COOKIE['j_id']);
            unset($_COOKIE['active_time']);
            
            setcookie('user', null, -1, '/');
            setcookie('j_id', null, -1, '/');
            setcookie('active_time', null, -1, '/');
            //session destroy
            session_destroy();
            //Login page for erp section
            if(strstr($_SERVER["SCRIPT_NAME"],'erp.php')){
                $logoutGoTo = HOME . "erp.php/login";
            };

            if ($logoutGoTo) {
              header("Location: $logoutGoTo");
              exit;
            }
        }else if(!array_key_exists('MM_Username', $_SESSION) && isset($_COOKIE['user']) && $_COOKIE['user'] != ""){
            $this->extendSessionValues($_COOKIE['user']);
        }
    }
  
    function extendSessionValues($userName){
    
        $LoginRS__query = User::find_by_sql("SELECT * FROM users WHERE username = ? LIMIT 1", array(trim($userName)));
        
        if ($LoginRS__query) {
            $loginStrGroup    = $LoginRS__query[0]->access;
            $loginStrName     = $LoginRS__query[0]->full_name;
            $loginStrCustCode = $LoginRS__query[0]->u_cust_code;
            $login_email      = $LoginRS__query[0]->email;
            $login_tel        = $LoginRS__query[0]->tel;
            $login_gmail_pass = $LoginRS__query[0]->gmail_pass;
            $user_id          = $LoginRS__query[0]->user_id;
            $is_admin         = $LoginRS__query[0]->is_admin;
  
            //declare session variables and assign them
            if (!isset($_SESSION)) {
                session_start();
            }
            
            $_SESSION['MM_Username']    = $userName;
            $_SESSION['MM_UserGroup']   = $loginStrGroup;
            $_SESSION['MM_FullName']    = $loginStrName;
            $_SESSION['MM_CustCode']    = $loginStrCustCode;
            $_SESSION['user-email']     = $login_email;
            $_SESSION['user-tel']       = $login_tel;
            $_SESSION['user_id']        = $user_id;
            $_SESSION['is_admin']       = $is_admin;
            $_SESSION['menu_html']      = getMenuList($Bulktest);
        }
    }

    /**
    * Reset password
    */
    function resetPassword($user_id){

      try{
        $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/login.js"></script>'.chr(10);

        $user_model = User::find_by_user_id($user_id);

        render("login/reset_password", array(
            "user_model" => $user_model
        ),"layouts/loginstyle");
      }
      catch(Exception $e){
        //Exception
      }
    }

    /**
    * Save password
    */
    function savePassword(){

      try{
        $password = hash_hmac('sha256', trim($_POST['new_password']), SECRET_KEY);
        $user_id  = trim($_POST['user_id']);

        if($_POST['type'] == 'token'){
          $updated = User::update_all( array(
                    'set' => array('password' => $password,
                                  'password_updated' => date(BTL_DEF_MYSQL_DATE_TIME),
                                  'token' => null),
                    'conditions' => array('user_id' => $user_id)
          ));
        }
        else{
          $updated = User::update_all( array(
                    'set' => array('password' => $password,
                                  'password_updated' => date(BTL_DEF_MYSQL_DATE_TIME)),
                    'conditions' => array('user_id' => $user_id)
          ));
        }
        if($updated){
          // Add password to history
          User::addPasswordHistory($user_id, $password);
          // Sent password change mail
          $this->sentPasswordChangeMail($user_id, $_POST['new_password']);
          // update token
          $message = 'The user password was successfully saved.';
        } else {
          $error_msg = "There was a problem when saving password, please try again.";
        }
     
        $this->render_message($message, $error_msg);
      }
      catch(exception $e){
        //Exception
      }
    }

     // Function to render the message
    private function render_message($success = '', $error = ''){
      render("login/message", array(
          'success_msg' => $success,
          'error_msg' => $error
      ), false);
    }

  /**
   * function for common ajax operations
  */
  function commonAjax(){
    if(isset($_POST['action_type'])) {
      switch($_POST['action_type'])
      {
        case 'password_exist' :
          echo $this->checkPasswordExist($_POST);
          break;
        case 'email_exist' :
          echo $this->checkEmailExist($_POST);
          break;
        case 'check_history_password' :
          echo $this->checkHistoryPassword($_POST);
          break;
        case 'check_if_existing_user':
          echo  $this->checkIfExistingUser($_POST);

        case 'password_reset_mail':
          echo $this->passwordResetMail($_POST);
          break;
        case 'check_common_password':
          echo $this->checkCommonPassword($_POST);
          break;
        default :
          echo 'Ooops, unexpected action occured';
      }
    }
  }

  /**
   * function for check password exist
  */
  function checkPasswordExist($params){

    try{
      $count = 0;
      $params['password'] = hash_hmac('sha256', trim($params['password']), SECRET_KEY);
      $user_model = User::find_by_sql("SELECT count(*) as count FROM users
        WHERE user_id=? AND password=?",array($params['user_id'],$params['password']));

      if($user_model){
        $count = $user_model[0]->count;
      }
      echo $count;
    }
    catch(Exception $e){
      // Exception
      echo $count;
    }
  }

  /**
   * function for check history passwords
  */
  function checkHistoryPassword($params){

    try{
      $count = 0;
      $history_count = HISTORY_LIMIT;
      $params['password'] = hash_hmac('sha256', trim($params['password']), SECRET_KEY);
      
      $password_model = PasswordHistory::find_by_sql("SELECT p_password FROM password_history
        WHERE p_user_id=? 
        ORDER BY p_updated_at DESC 
        LIMIT $history_count",array($params['user_id']));

      foreach ($password_model as $key => $value) {
        if($params['password'] == $value->p_password){
          $count = 1;
          break;
        }
      }
      echo $count;
    }
    catch(Exception $e){
      // Exception
      echo $count;
    }
  }

  /**
   * function for sent password change mail
  */
  function sentPasswordChangeMail($user_id, $password){

    try{
      $mail_param = array();

      $user_model = User::find_by_user_id($user_id);
      $mail_param['subject'] = "Bulk Tainer Logistics - New login credentials";
      //Get From email data
      $from_mail = User::find_by_sql("SELECT user_list FROM tbl_user_restriction WHERE user_code = 'USER_MANAGEMENT'");
      $from_mail_data = json_decode($from_mail[0]->user_list);
      $mail_param['from'] = array('email' => $from_mail_data->from_email, 'name'=> $from_mail_data->from_name);
            
      //Start : Message body
      $mail_param['message'] .= '<html><body style="font:13px Arial;width:75%;">';
      $mail_param['message'] .= "Dear ".ucfirst($user_model->full_name).",";
      $mail_param['message'] .= "<br><br>";
      $mail_param['message'] .= "Your new Login Credentials are : <br>";
      $mail_param['message'] .= "Username : $user_model->username<br>";
      $mail_param['message'] .= "Password : $password<br>";
      
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

  function scanTfaQr($token='',$auth = null){
    if(isset($_POST['btn_continue'])){
      $MM_redirectLoginSuccess = "Welcome.php";
      $user_id = $_POST['user_id'];
      $MM_redirectLoginFailed = HOME."erp.php/auth/scan-tfa-qr/".sha1($user_id)."/pass-err";
      $user_result = User::find_by_sql("SELECT * FROM users WHERE user_id = ?", array($user_id));
      $loginStrGroup    = $user_result[0]->access;
      $loginStrName     = $user_result[0]->full_name;
      $loginStrCustCode = $user_result[0]->u_cust_code;
      $login_email      = $user_result[0]->email;
      $login_tel        = $user_result[0]->tel;
      $login_gmail_pass = $user_result[0]->gmail_pass;
      $loginUsername    = $user_result[0]->username;
      $is_admin         = $user_result[0]->is_admin;
      $secret = $user_result[0]->tfa_secret;
      $tfa_auth_passed = $this->tfaAuthentication($secret,$_POST['code']);
      if($tfa_auth_passed){

        $_SESSION['MM_Username']  = $loginUsername;
        $_SESSION['MM_UserGroup'] = $loginStrGroup;       
        $_SESSION['MM_FullName']  = $loginStrName; 
        $_SESSION['MM_CustCode']  = $loginStrCustCode;
        $_SESSION['user-email']   = $login_email;
        $_SESSION['user-tel']     = $login_tel;
        $_SESSION['user_id']      = $user_id;
        $_SESSION['is_admin']     = $is_admin;
              
        setcookie('user', $loginUsername, 0, "/"); //expire when browser close           
        if(isset($_COOKIE['user'])){
          $cookie = $_COOKIE['user'];
        }

        if (isset($_SESSION['PrevUrl']) && false) {
          $MM_redirectLoginSuccess = $_SESSION['PrevUrl'];  
        }
        
        $userUpdate = User::update_all(
            array(  'set' => array('tfa_qr_scanned_flag' => 1),
                'conditions' => array('user_id' => $user_id)
        ));

        // Last login success
        User::lastLoginUpdate($user_id, true);
        header("Location: ". HOME . $MM_redirectLoginSuccess);
      }
      else{
        header("Location: {$MM_redirectLoginFailed}");
      }
      
    }
    else{
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
        $authService = new AuthService();
        $g = $authService->getTfaObject();
        $user_result = User::find_by_sql("SELECT username,user_id,tfa_secret FROM users WHERE SHA1(user_id) = ? AND tfa_qr_scanned_flag = 0", array($token));
       
        if(isset($user_result[0])){
          $msg = $auth;
          $uname = $user_result[0]->username;
          $user_id = $user_result[0]->user_id;
          $secret = $user_result[0]->tfa_secret;
          $qr_img_link = $g->getURL($uname,$domain, $secret);
          render("login/scan_qr", array(
                'qr_img_link'=> $qr_img_link,
                 "user_id" => $user_id,
                 "msg" => $msg
            ),"layouts/loginstyle");
        }
        else{
          $MM_redirectLoginFailed  = HOME . "erp.php/auth/login";
          header("Location: ". $MM_redirectLoginFailed);
        }
    }
    

  }

 private function checkIfExistingUser($params){
    $returnArray        = array();
    $username           = $params['username'];
    $user_details    = User::find_by_sql("SELECT count(*) AS count FROM users WHERE username = ? AND is_double_verification = 1 AND tfa_qr_scanned_flag = 1",array($username));
    if(!empty($user_details)){
      echo $user_details[0]->count;exit;
    }
    else{
      echo 0;exit;
    }
 }

 function tfaAuthentication($secret,$code){
    $authService = new AuthService();
    $g = $authService->getTfaObject();
    if($g->checkCode($secret, $code)){
      return true;
    }
    else{
      return false;
    }
 }



  /**
    * Forgot password
  */
  function forgotPassword(){

    try{
      $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/login.js"></script>'.chr(10);

      render("login/forgot_password", array(
      ),"layouts/loginstyle");
    }
    catch(Exception $e){
      //Exception
    }
  }

  /**
   * function for check mail exist
  */
  function checkEmailExist($params){

    try{
      $count = 0;
      $user_model = User::find_by_sql("SELECT count(*) as count FROM users
        WHERE email=?",array($params['email']));

      if($user_model){
        $count = $user_model[0]->count;
      }
      echo $count;
    }
    catch(Exception $e){
      // Exception
      echo $count;
    }
  }

  /**
   * function for password reset mail
  */
  function passwordResetMail($params){

    try{
      $mail_param = array();

      $user_model = User::find_by_sql("SELECT email,full_name,user_id FROM users 
                      WHERE email=? AND is_active=1 
                      AND is_locked=0", array($params['email']));
      if($user_model){
        $user_model = $user_model[0];
        $expire_time = date(BTL_DEF_MYSQL_DATE_TIME,strtotime("+1 hour"));
        $token = hash_hmac('sha256', '2418*2'.$user_model->email, SECRET_KEY);
        $key = substr(hash_hmac('sha256',uniqid(rand(),1),SECRET_KEY),3,10);
        $token = $token . $key;

        $updated = User::update_all(array(
                    'set' => array('token' => $token,
                                   'token_expire' => $expire_time),
                    'conditions' => array('user_id' => $user_model->user_id)
        ));

        $mail_param['subject'] = "Bulk Tainer Logistics - Password Reset Request";
        //Get From email data
        $from_mail = User::find_by_sql("SELECT user_list FROM tbl_user_restriction WHERE user_code = 'USER_MANAGEMENT'");
        $from_mail_data = json_decode($from_mail[0]->user_list);
        $mail_param['from'] = array('email' => $from_mail_data->from_email, 'name'=> $from_mail_data->from_name);
              
        //Start : Message body
        $mail_param['message'] .= '<html><body style="font:13px Arial;width:75%;">';
        $mail_param['message'] .= "Dear ".ucfirst($user_model->full_name).",";
        $mail_param['message'] .= "<br><br>";
        $mail_param['message'] .= "A request has been received to change the password for your account. Please click this <a href='".HOME."erp.php/auth/change-password/".$token."'>reset</a> link to change your password. <br><br>";
        $mail_param['message'] .= "If you did not initiate this request, please contact system administrator immediately<br>";
        
        $mail_param['message'] .= "<br><br>Kind Regards,<br><strong>Bulk Tainer Logistics </strong><br><strong>Tel:</strong> 0044(0)1642 065100";
      
        $mail_param['message'] .= "</body></html>";
        
        $mail_param['to'][] = array('email' => $user_model->email, 'name' => $user_model->full_name);
        
        $mailer = new MailController();
        $status = $mailer->sentMain($mail_param);

        if($status){
          $message = 'Password reset link sent successfully.';
        } else {
          $error_msg = "There was a problem when sending mail, please try again.";
        }
      }
      else{
        $error_msg = "Your account has been Locked/Inactive, please contact admin.";
      }
     
      $this->render_message($message, $error_msg);
    }
    catch(Exception $e){
      // Exception
    }
  }

  /**
    * Change password
  */
  function changePassword($token){

    try{
      $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/login.js"></script>'.chr(10);

      $user_model = User::find_by_token($token);
      
      if($user_model){
        $current_time = time();
        if($current_time <= strtotime($user_model->token_expire)){
          render("login/change_password", array(
            'user_id' => $user_model->user_id
          ),"layouts/loginstyle");
        }
        else{
          $this->index('token_expire');
        }
      }
      else{
        $this->index();
      }
    }
    catch(Exception $e){
      //Exception
    }
  }

  /**
   * function for check history passwords
  */
  function checkCommonPassword($params){

    $count = 0;
    try{
      $password_model = PasswordHistory::find_by_sql("SELECT count(*) as count
        FROM common_passwords
        WHERE '".$params['password']."' LIKE CONCAT('%',password,'%')");

      echo $password_model[0]->count;
    }
    catch(Exception $e){
      // Exception
      echo $count;
    }
  }

  function hasSession(){

  }
}

