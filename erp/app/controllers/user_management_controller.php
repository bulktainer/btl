<?php
use Btl\Helpers;
class UserManagementController extends BaseController {
	
  function index() {
	
  	$GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/user.js"></script>'.chr(10);
  	
  	// add filter and page variables to session
  	$_SESSION['user_return_url'] = BTL_DEFAULT_HTTP . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];

  	// START SEARCH SECTION
  	//result filters
  	$pagesize        = filter_input(INPUT_GET, 'pagesize', FILTER_SANITIZE_NUMBER_INT);
  	$fullNameFilter  = trim(filter_input(INPUT_GET, 'fullname-filter', FILTER_SANITIZE_STRING));
  	$emailFilter     = trim(filter_input(INPUT_GET, 'email-filter', FILTER_SANITIZE_STRING));
  	$userStatus      = trim(filter_input(INPUT_GET, 'user-status', FILTER_SANITIZE_STRING));
  	
	$sql_select = " users.username,
					trim(users.full_name) AS full_name,
					trim(users.company) AS company,
					trim(users.email) AS email,
					trim(users.tel) AS tel,
					users.access,
					users.is_active,
          users.user_id,
          users.is_admin,
					(CASE WHEN users.access='fa' THEN 'Full Access' ELSE 'Restricted Access' END) AS access_detail ";
	  	
	$sql_join = " ";
	
	$condition_columns = '';
	$conditions = array();
	
	// option filter
  	if($fullNameFilter) {
  		$condition_columns .= " AND (users.full_name LIKE '%{$fullNameFilter}%' ) ";
  	}
  	if($emailFilter) {
  		$condition_columns .= " AND (users.email LIKE '%{$emailFilter}%' ) ";
  	}
  	
  	if($userStatus == 'active'){
  		$condition_columns .= " AND  users.is_active=1 ";
  	}else if($userStatus == 'inactive'){
  		$condition_columns .= " AND  users.is_active=0 ";
  	}
  	// add filter and page variables to session
  	$_SESSION['querystring'] = $_SERVER['QUERY_STRING'];
  	
  	$condition_columns = ltrim($condition_columns, ' AND ');
  	array_unshift($conditions, $condition_columns);
  	
  	$sort_order = " trim(users.full_name) ASC ";
  	
  	$pagination_limit = 50;
  	$pagination_total = User::count(array('conditions' => $conditions, 'joins' => $sql_join));
  	$pagination_page = intval(filter_input(INPUT_GET, 'page', FILTER_SANITIZE_STRING));
  	$pagination_page = $pagination_page == '' ? 1 : $pagination_page;
  	$pagination_total_pages = intval(ceil($pagination_total / $pagination_limit));
  	$pagination_next_page = $pagination_page === $pagination_total_pages ? $pagination_page : $pagination_page + 1;
  	$pagination_prev_page = $pagination_page == 1 ? 1 : $pagination_page - 1;
  	
  	$pagination = array(
  			'limit' => $pagination_limit,
  			'total' => $pagination_total,
  			'page' => $pagination_page,
  			'total_pages' => $pagination_total_pages,
  			'next_page' => $pagination_next_page,
  			'prev_page' => $pagination_prev_page
  	);
  	
  	$usersList = User::find('all', array(
  											'select' => $sql_select,
								  			'joins' => $sql_join,
								  			'conditions' => $conditions,
								  			'limit' => $pagination['limit'],
								  			'offset' => ($pagination['page'] - 1) * $pagination['limit'],
								  			'order' => $sort_order)
									);
  	
  	$adjust_val = ($pagination['total'] == 0) ? 0 : 1;
  	$pagination['min'] = ($pagination['page'] - 1) * $pagination['limit'] + $adjust_val;
  	$pagination['max'] = $pagination['min'] + count($usersList) - $adjust_val;

  	render("user/index", array(
						  		 "usersList"		=> $usersList,
						  		 'pagination' 		=> $pagination,
						  	),"layouts/basic"
		);
  }
  
  /**
   * function for view edit page
   * @param unknown_type $rout_id
   */
  function edit($user_id, $form){  	

    $teamArr = array();
    $userOrder = 60;
    $loggedUser = $_SESSION['MM_Username'];

  	$GLOBALS["_css_scripts"] = '<link href="' . HOME . 'css/bootstrap-multiselect.css" rel="stylesheet" />'.chr(10);
  	$GLOBALS["_js_scripts"] = '<script src="' . HOME . 'js/bootstrap-multiselect.js"></script>'.chr(10);
  	$GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/user.js"></script>'.chr(10);
  	$userModel = User::find_by_user_id($user_id);
    $username = $userModel->username;
  	$custCode = Customer::find_by_sql("SELECT DISTINCT(cust_code) AS val,cust_code AS txt FROM customer ORDER BY cust_code ASC");

    //User Restriction DM Aug 21
    if($loggedUser != 'admin'){
      $sqlUser = "SELECT min(ut.permission_order) AS permission_order FROM user_teams ut INNER JOIN  user_permission up ON ut.id = up.user_team_id WHERE up.userid =  '".$loggedUser."'";

      $permissionOrder = User::find_by_sql($sqlUser);
      if(!empty($permissionOrder)){
        $userOrder = $permissionOrder[0]->permission_order;
      }
    }
    else{
      $userOrder = 10;
    }

    $team_list = User::find_by_sql("SELECT id as val,team as txt FROM user_teams   WHERE permission_order >= ? GROUP BY id  ORDER BY permission_order ASC", array($userOrder));

    $select = "SELECT ut.id as val,ut.team as txt FROM user_teams ut INNER JOIN  user_permission up ON ut.id = up.user_team_id WHERE up.userid =  '".$username."'";
    $special_per = Customer::find_by_sql("SELECT super_user  FROM special_permission");
    if($special_per ){
      $super_user_list =  implode(',',json_decode($special_per[0]->super_user));
    }
    $selectTeam = User::find_by_sql($select);

    foreach ($selectTeam as $key => $team_value) {
        $teamArr[] = $team_value->val;  
    }

  	render("user/form", array(
						  			"userModel" => $userModel,
                    "custCode"  => $custCode,
                    "super_user_list"  => $super_user_list,
					  				"teamArr"  => $teamArr,
					  	      "team_list"  => $team_list,
  									"form"		=> $form
						  	),"layouts/basic"
		);
  }
  
  /**
   * render create page
   */
  function create(){

  	$form = 'add';
    $loggedUser = $_SESSION['MM_Username'];
    $userOrder = 60;

  	$GLOBALS["_css_scripts"] = '<link href="' . HOME . 'css/bootstrap-multiselect.css" rel="stylesheet" />'.chr(10);
  	$GLOBALS["_js_scripts"] = '<script src="' . HOME . 'js/bootstrap-multiselect.js"></script>'.chr(10);
  	$GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/user.js"></script>'.chr(10);
  	
  	$userModel = new User();
  	$custCode = Customer::find_by_sql("SELECT DISTINCT(cust_code) AS val,cust_code AS txt FROM customer ORDER BY cust_code ASC");
  	// $team_list = Customer::find_by_sql("SELECT id AS val,team AS txt FROM user_teams ");
    $special_per = Customer::find_by_sql("SELECT super_user  FROM special_permission");
    if($special_per ){
      $super_user_list = implode(',',json_decode($special_per[0]->super_user));
    }

    //User Restriction DM Aug 21
    if($loggedUser != 'admin'){
      $sqlUser = "SELECT min(ut.permission_order) AS permission_order FROM user_teams ut INNER JOIN  user_permission up ON ut.id = up.user_team_id WHERE up.userid =  '".$loggedUser."'";

      $permissionOrder = User::find_by_sql($sqlUser);
      if(!empty($permissionOrder)){
        $userOrder = $permissionOrder[0]->permission_order;
      }
    }
    else{
      $userOrder = 10;
    }

    $team_list = User::find_by_sql("SELECT id as val,team as txt FROM user_teams   WHERE permission_order >= ? GROUP BY id  ORDER BY permission_order ASC", array($userOrder));

 
  	render("user/form", array(
							  			"userModel" 		=> $userModel,
                      "custCode"          =>$custCode,
  	                  "super_user_list"   =>$super_user_list,
  										"team_list"  		=> $team_list,
  										'form' 				=> $form,
							  	),"layouts/basic"
			);
  }
  
  /**
   *  save new route to db
   */
  function add(){

  	$params = $_POST;
  	$message = '';
  	$username = trim($params['user-username']);
  	$c = $this->checkUsernameExist(array('username' => $username,'type' => ''));
    $teamArray = $params['team-form'];

  	if($c == 0){
  		$userModel = new User();
      $password = hash_hmac('sha256', trim($params['user-password']), SECRET_KEY);
  		$attributes = array(
			  			'username' 		=>	$username,
              'password'    =>  $password,
			  			'full_name' 	=>  trim(removeSlashes($params['user-fullname'])),
			  			'company'		=>  trim(removeSlashes($params['user-companyname'])),
			  			'email'			=>  trim(removeSlashes($params['user-email'])),
			  			'tel'			=>  trim(removeSlashes($params['user-telephone'])),
			  			'access'		=>  trim($params['user-access']),
  						'created_by'	=>	trim($_SESSION['MM_FullName']),
  						'created_at'	=>	date(BTL_DEF_MYSQL_DATE_TIME),
  						'is_active'		=>  trim($params['user-status']),
  		                'u_cust_code'   =>trim(implode(',', $params['user-customercode'])),
  						'team' => trim($params['team']),
              'password_updated' => date(BTL_DEF_MYSQL_DATE_TIME),
              'is_double_verification' => $params['is_double_verification'] ? 1 : 0
			  			);
  		$userCreate = User::create($attributes);
      if($userCreate){
        // Add password to history
        $user_object = User::find_by_username($username);
        User::addPasswordHistory($user_object->user_id, $password);
      }
      $permission = User::connection();
      if($userCreate && $teamArray){
          foreach ($teamArray as $key => $team_values) {
            $sql_permission = "INSERT INTO user_permission (`userid`,`user_team_id`) VALUES ('".$username."','".$team_values."')";
            $res = $permission->query($sql_permission);
          }
      }
  		if($userCreate){
  			$message = 'The User details was successfully saved.';
  		} else {
  			$error_msg = "There was a problem when creating this User, please try again.";
  		}
  	}else if($c > 0){
  		$error_msg = "Username Already Exist, please try again";
  	}else{
  		$error_msg = "There was a problem when creating this User, please try again.";
  	}
  	$this->render_message($message, $error_msg);
  	
  }
  
  /**
   * function for update route info
   * @param unknown_type $rout_id
   */
  function update($user_id){

  	$message = '';
  	$error_msg = '';  	
  	$params = $_POST;
  	$userModel = User::find_by_user_id($user_id);
    $username = $userModel->username;
    $teamArray = $params['team-form'];

  	$attributes = array(
			  			'full_name' 	=>  trim(removeSlashes($params['user-fullname'])),
			  			'company'		=>  trim(removeSlashes($params['user-companyname'])),
			  			'email'			=>  trim(removeSlashes($params['user-email'])),
			  			'tel'			=>  trim(removeSlashes($params['user-telephone'])),
			  			'access'		=>  trim($params['user-access']),
			  			'modified_by'	=>	trim($_SESSION['MM_FullName']),
			  			'modified_at'	=>	date(BTL_DEF_MYSQL_DATE_TIME),
  	          'u_cust_code'   =>trim(implode(',', $params['user-customercode'])),
              'is_double_verification' => $params['is_double_verification'] ? 1 : 0
  						// 'team' => trim($params['team'])
			  			);
  	if($username != $_SESSION['MM_Username']){
  		$attributes['is_active'] = trim($params['user-status']);
  	}
  	$confirm_change_password = $params['confirm_change_password'];
  	if($confirm_change_password){
      $attributes['password'] = hash_hmac('sha256', trim($params['user-password']), SECRET_KEY);
      $attributes['password_updated'] = date(BTL_DEF_MYSQL_DATE_TIME);
  	}
  	
  	$userUpdate = $userModel->update_attributes($attributes);
    $permission = User::connection();
    if($userUpdate){
          $sql_permission = "DELETE FROM user_permission WHERE userid = '".$username."'";
          $res = $permission->query($sql_permission);
            if($res && $teamArray){
            foreach ($teamArray as $key => $team_values) {
              $sql_permission = "INSERT INTO user_permission (`userid`,`user_team_id`) VALUES ('".$username."','".$team_values."')";
              $res = $permission->query($sql_permission);
          }
        }
    }
  	if($userUpdate){
  		$message = 'The User details was successfully saved.';
  	} else {
  		$error_msg = "There was a problem when updating, please try again.";
  	}
  	
  	if($userUpdate && $confirm_change_password && trim($params['user-status']) == 1){
      $attributes['password'] = trim($params['user-password']);
  		$mailSend = $this->sendnewPassword($attributes, $username);
  		if($mailSend['status'] == 'success'){
  			$message = $mailSend['msg']; 
  		}else{
  			$error_msg = $mailSend['msg'];
  		}
  	}
  	$this->render_message($message, $error_msg);
  	
  }
  
  public function checkUsernameExist($params){
  	$username = $params['username'];
  	$type  = $params['type'];
  	 
  	$query = "SELECT count(*) as count FROM users
  				WHERE username=?";
  	
  	/* if($type == 'update'){
  		$query .= " AND username <> '{$username}' ";
  	} */
  	 
  	$c = User::find_by_sql($query,array($username));
  	$count = $c[0]->count;
  	 
  	return $count;
  }
  
  /**
   * function for viewing msg
   * @param unknown_type $success
   * @param unknown_type $error
   */
  private function render_message($success = '', $error = '') {
  	render("tank/message", array(
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
  			case 'usernameexist' :
  				echo  $this->checkUsernameExist($_POST);
  				break;
  			case 'changeStatus' :
  				echo  $this->changeUserStatus($_POST);
  				break;
        case 'email_exist' :
          echo  $this->checkEmailExist($_POST);
          break;
  			default :
  				echo 'Ooops, unexpected action occured';
  		}
  	}
  }
  
  private function sendnewPassword($attributes,$uname){
  	$fullName = $attributes['full_name'];
  	$email = $attributes['email'];
  	$mailSubject = 'Bulk Tainer Logistics- new login credentials';
  	$password = $attributes['password'];
  	//Start Mail
  	try{
  		//Start : Message body
  		$job_messagebody .= '<html><body style="font:13px Arial;width:75%;">';
  		$job_messagebody .= "Dear ".ucfirst($fullName).",";
  		$job_messagebody .= "<br><br>";
  		$job_messagebody .= "Your new Login Credentials are : <br>";
  		$job_messagebody .= "Username : $uname<br>";
  		$job_messagebody .= "Password : $password<br>";
 			
  		$job_messagebody .= "<br><br>Kind Regards,<br><strong>Bulk Tainer Logistics </strong>".
  							"<br><strong>Tel:</strong> 0044(0)1642 065100";
  	
  		$job_messagebody .= "</body></html>";
  		//End : Message body
  	
  		if(BTL_ENV == 'production' || BTL_ENV == 'usa-production'){
  			$transport = Swift_SmtpTransport::newInstance(BTL_EMAIL_HOST_NEW, BTL_EMAIL_PORT_NEW, BTL_DEFAULT_EMAIL_ENCR);
  		}else{
  			$transport = Swift_SmtpTransport::newInstance(BTL_EMAIL_HOST, BTL_EMAIL_PORT,BTL_DEFAULT_EMAIL_ENCR)
  			->setUsername(BTL_EMAIL_USER)
  			->setPassword(BTL_EMAIL_PASS);
  		}
  			
  		$mailer = Swift_Mailer::newInstance($transport);
  			
  		$message = Swift_Message::newInstance($mailSubject)
  					->setFrom(array($_SESSION['user-email'] => $_SESSION['MM_FullName']))
  					->setTo(array($email => $fullName))
  					->setReplyTo(array($_SESSION['user-email'] => $_SESSION['MM_FullName']))
  					->setReturnPath($_SESSION['user-email']);
  			
  		$message->setBody($job_messagebody,'text/html');
  		$sent = $mailer->send($message);
  	
  		if($sent) {
  			$feedback['msg'] = 'The User details was successfully saved and Mail has been sent to <strong>' . $fullName.'</strong>';
  			$feedback['status'] = 'success';
  		} else {
  			$feedback['msg'] = 'Unable to sent mail to ' . $fullName;
  			$feedback['status'] = 'error';
  		}
  	} catch(Exception $e){
  		$feedback['msg'] = "Error : Unable to sent mail - " . $e->getMessage();
  		$feedback['status'] = 'error';
  	}
  	return $feedback;
  }
  
  private function changeUserStatus($params){
  	$updateStatus = $params['updateStatus'];
  	$uname = trim($params['username']);
  	
  	$userModel = User::find($uname);
  	$attributes = array(
  			'modified_by'	=>	trim($_SESSION['MM_FullName']),
  			'modified_at'	=>	date('Y-m-d H:i:s'),
  			'is_active'		=>  $updateStatus,
  	);
  	$res = $userModel->update_attributes($attributes);
  	return $res;
  }
  
  /*
   * Use it one time only to encript all password
   */
  function updateExistingPassword(){
    
    if(false){
        try{
          $users = User::find_by_sql("SELECT user_id,password, password_backup FROM users");
          
          foreach ($users as $key => $value) {
            $password = hash_hmac('sha256', $value->password_backup, SECRET_KEY);
    
            $updated = User::update_all( array(
                      'set' => array('password' => $password,
                                      'password_updated' => date(BTL_DEF_MYSQL_DATE_TIME)),
                      'conditions' => array('user_id' => $value->user_id)
            ));
          }
          echo "Success";
        }
        catch(exception $e){
          //Exception
          echo "Failed";
        }
    } else {
        echo "This needs to be run only one time. If required enable the code before running. ";
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
      ),"layouts/basic");
    }
    catch(Exception $e){
      //Exception
    }
  }

  /**
    * Email exist or not
  */
  public function checkEmailExist($params){
    
    try{
      $email = $params['email'];
      $type  = $params['type'];
      $user_id = $params['user_id'];
       
      if($type == 'create'){
        $query = "SELECT count(*) AS count FROM users WHERE email = ?";
        $result = User::find_by_sql($query, array($email));
      }
      else{
        $query = "SELECT count(*) AS count FROM users WHERE email = ? AND user_id <> ?";
        $result = User::find_by_sql($query,array($email, $user_id));
      }
      return $result[0]->count;
    }
    catch(Exception $e){
      //Exception
      return 0;
    }
  }
}
