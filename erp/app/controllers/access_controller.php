<?php
use Btl\Helpers;
class AccessController extends BaseController {
	
 /*
  * Unauthorised access page
  */
  function showPrivilegeError(){
    render("access/privilege", array(), "layouts/basic");
  }

  /*
  * Module permission to user
  */
  function moduleUserPrivilege(){

      $GLOBALS["_css_scripts"] = '<link href="' . HOME . 'css/bootstrap-multiselect.css" rel="stylesheet" />'.chr(10);
      $GLOBALS["_js_scripts"] = '<script src="' . HOME . 'js/bootstrap-multiselect.js"></script>'.chr(10);
      $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/access.js"></script>'.chr(10);
    
      $_SESSION['user_return_url'] = BTL_DEFAULT_HTTP . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
      
      // module list
      $module_list = $this->getModuleData();

      // user list
      $user_list = User::find_by_sql('SELECT full_name AS name, user_id AS user_id, access 
        FROM users WHERE is_active = 1 ORDER BY access, full_name ASC');

      render("access/module_user_privilege", array(
        'module_list' => $module_list,
        'user_list' => $user_list
      ), "layouts/basic");
    
  }

  private function getModuleData($menuonly=false){
 
      $module_list = array();
      $menuCondition = "";

      if($menuonly){
          $menuCondition = "AND mc.type = 'menu' ";
      }

      $module_data = ModuleContents::find_by_sql("
        SELECT mc.module_id, mc.type, mc.module_id_ref, mc.group_id, mc.description, mc1.description AS module, mc.menu_level_0, mc.menu_level_1, mc.menu_level_2, mc.function_order 
        FROM module_contents AS mc 
        LEFT JOIN module_contents AS mc1 ON mc.module_id_ref = mc1.module_id 
              AND mc1.is_active = 1 AND mc1.menu_level_1 = 0 AND mc1.menu_level_2 = 0 
        WHERE mc.is_active = 1 
          AND mc.url IS NOT NULL 
          AND mc.description != 'Home' 
          $menuCondition 
        ORDER BY mc.menu_level_0 ASC, mc.menu_level_1 ASC, mc.menu_level_2 ASC, mc.function_order ASC");

      if(!empty($module_data)){
        foreach ($module_data as $each) {
            $description = "";

            if($each->function_order > 0){
              $description .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            if($each->menu_level_2 > 0){
              $description .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            if($each->menu_level_1 > 0){
              $description .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            }

            $description .= str_pad($each->module_id, 4, '0', STR_PAD_LEFT) . ' | ' . $each->description;

          if(array_key_exists($each->module, $module_list)){
            $module_list[$each->module][$each->module_id] = $description;
          }
          else{
             $module_list[$each->module] = array($each->module_id => $description);
          }
        }
      }

      return $module_list;
  }

  /*
  * user permission to module
  */
  function userModulePrivilege(){
    $module_list = array();

    try{
      $GLOBALS["_css_scripts"] = '<link href="' . HOME . 'css/bootstrap-multiselect.css" rel="stylesheet" />'.chr(10);
      $GLOBALS["_js_scripts"] = '<script src="' . HOME . 'js/bootstrap-multiselect.js"></script>'.chr(10);
      $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/access.js"></script>'.chr(10);
    
      $_SESSION['user_return_url'] = BTL_DEFAULT_HTTP . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];

      $module_data = ModuleContents::find_by_sql("
        SELECT mc.module_id, mc.type, mc.module_id_ref, mc.description, mc1.description AS module,
          mc.menu_level_0, mc.menu_level_1,mc.menu_level_2, mc.comments
        FROM module_contents AS mc 
        LEFT JOIN module_contents AS mc1 ON mc.module_id_ref = mc1.module_id 
              AND mc1.is_active = 1 AND mc1.menu_level_1 = 0 AND mc1.menu_level_2 = 0 
        WHERE mc.is_active = 1 
          AND mc.url IS NOT NULL 
          AND mc.description != 'Home' 
        ORDER BY mc.menu_level_0 ASC, mc.menu_level_1 ASC, mc.menu_level_2 ASC, mc.function_order ASC ");
      
      // user list
      $user_data = User::find_by_sql("SELECT full_name AS name, user_id AS user_id, 
        CASE WHEN (access = 'fa') THEN 'Full Access' ELSE 'Restricted Access' END AS access  
          FROM users WHERE is_active = 1 ORDER BY full_name ASC");

      // group list
      $group_data = User::find_by_sql('SELECT module_id, group_id
          FROM module_contents WHERE is_active = 1 ORDER BY menu_level_0 ASC,menu_level_1 ASC,menu_level_2 ASC');

      if(!empty($group_data)){
        $group_list = array();
        foreach ($group_data as $each) {
          $group_list[$each->module_id] = $each->group_id;
        }
      }

    $user_list = array();
    if(!empty($user_data)){  
        foreach ($user_data as $each) {
          if(array_key_exists($each->access, $user_list)){
            $user_list[$each->access][$each->user_id] = $each->name;
          }
          else{
             $user_list[$each->access] = array($each->user_id => $each->name);
          }
        }
      }

      if(!empty($module_data)){
        foreach ($module_data as $each) {
          if(array_key_exists($each->module, $module_list)){
            $module_list[$each->module][$each->module_id] = array("name" => $each->description, "type"=> $each->type, "level0" => $each->menu_level_0, "level1" => $each->menu_level_1, "level2" => $each->menu_level_2,"mcomment" => $each->comments, "moduleId" => $each->module_id);
          }
          else{
             $module_list[$each->module] = array($each->module_id => array("name" => $each->description, "type"=> $each->type, "level0" => $each->menu_level_0, "level1" => $each->menu_level_1, "level2" => $each->menu_level_2, "mcomment" => $each->comments, "moduleId" => $each->module_id));
          }
        }
      }

      render("access/user_module_privilege", array(
        'module_list' => $module_list,
        'user_list' => $user_list,
        'group_list' => $group_list
      ), "layouts/basic");
    }
    catch(Exception $e){
      // echo 'Message: ' .$e->getMessage();
    }
  }

  /*
  * user permission to module
  */
  function createModulePrivilege(){

    try{
      $params = $_POST;
      $module = $params['modules'];
      $module = explode('_', $module)[1];
      $user_ids = array_filter($params['user_ids']);

      $privilege = UserPrivilege::connection();

      $delete_sql = "DELETE FROM user_privilege WHERE user_module = ".$module;
      $sql_query = "INSERT INTO user_privilege(user_id, user_module) VALUES" ;

      $data = $privilege->query($delete_sql);
     
      if(!empty($user_ids)) {
          foreach($user_ids as $user_id){
              $sql_query .= '('.$user_id.','.$module.'),';
          }
          $sql_query = rtrim($sql_query,",");
          $res = $privilege->query($sql_query);
      } 

      echo true;
    }
    catch(Exception $e){
      echo false;
    }
  }

  /*
  *
  */
  function getPrivilegedUsersByModule(){
    
    try{
      $user_ids = array();
      $module = $_POST['module'];
      $module = explode('_', $module)[1];
      $sql = "SELECT user_id FROM user_privilege WHERE user_module = ?";
      $user_result = UserPrivilege::find_by_sql($sql, array($module));
      if(!empty($user_result)){
        foreach ($user_result as $each) {
          $user_ids[] = $each->user_id;
        }
      }
      echo json_encode($user_ids);
    }
    catch(Exception $e){
      echo json_encode($user_ids);
    }
  }

  /*
  * User permission to module
  */
  function createUserPrivileges(){

    try{
      $params = $_POST;

      $modules = array_filter($params['modules']);
      $module_list = array_filter($params['module_groups']);
      $user_id = $params['user_id'];

      $privilege = UserPrivilege::connection();

      $delete_sql = "DELETE FROM user_privilege WHERE user_id = ".$user_id;
      $sql_query = "INSERT INTO user_privilege(user_id, user_module) VALUES" ;

      $data = $privilege->query($delete_sql);

      if(!empty($modules)){
          foreach($modules as $module){
            $sql_query .= '('.$user_id.','.$module.'),';
          }
          $sql_query = rtrim($sql_query,",");
          $res = $privilege->query($sql_query);
      }
      
      echo true;
    }
    catch(Exception $e){
      echo false;
    }
  }

  /*
  * Get privileged modules
  */
  function getPrivilegedModulesByUser(){
    
    try{
      $module_ids = array();
      $user_id = $_POST['user_id'];

      $sql = "SELECT user_module FROM user_privilege WHERE user_id = ?";
      $user_result = UserPrivilege::find_by_sql($sql, array($user_id));
      if(!empty($user_result)){
        foreach ($user_result as $each) {
          $module_ids[] = $each->user_module;
        }
      }
      echo json_encode($module_ids);
    }
    catch(Exception $e){
      echo json_encode($module_ids);
    }
  }


function moduleIndex() {
    
    $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/access.js"></script>'.chr(10);
    
    // add filter and page variables to session
    $_SESSION['user_return_url'] = BTL_DEFAULT_HTTP . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];

    // START SEARCH SECTION
    //result filters
    $pagesize        = filter_input(INPUT_GET, 'pagesize', FILTER_SANITIZE_NUMBER_INT);
    $moduleFilter    = trim(filter_input(INPUT_GET, 'module-filter', FILTER_SANITIZE_STRING));
    $groupFilter     = trim(filter_input(INPUT_GET, 'group-filter', FILTER_SANITIZE_STRING));
    $moduleStatus     = trim(filter_input(INPUT_GET, 'module-status', FILTER_SANITIZE_STRING));

    $condition_columns = '';

    // option filter
    if($moduleFilter) {
      $condition_columns .= " AND (mc1.description LIKE '%{$moduleFilter}%' ) ";
    }
    if($groupFilter) {
      $condition_columns .= " AND (mc2.description LIKE '%{$groupFilter}%' ) ";
    }

    if($moduleStatus){
        if($moduleStatus == 'active'){
          $condition_columns .= " AND mc.is_active = 1 ";
        }else {
          $condition_columns .= " AND mc.is_active = 0 ";
        }
    }

    $sql_select = " SELECT mc.*, mc1.description AS module, mc2.description AS groupname ";
    $sql_count  = " SELECT count(*) AS count ";
    $sql_query  = " FROM module_contents AS mc 
                        LEFT JOIN module_contents AS mc1 ON mc.module_id_ref = mc1.module_id 
                              AND mc1.type = 'menu' AND mc1.menu_level_1 = 0 AND mc1.menu_level_2 = 0 
                        LEFT JOIN module_contents AS mc2 ON mc.group_id = mc2.module_id 
                              AND mc2.type = 'menu' AND mc2.menu_level_1 != 0 AND mc2.menu_level_2 = 0 
                        WHERE 1=1 {$condition_columns}
                        ORDER BY mc.menu_level_0 ASC, mc.menu_level_1 ASC, mc.menu_level_2 ASC, mc.function_order ASC "; 
    
    $module_count = ModuleContents::find_by_sql($sql_count . $sql_query);
    $module_count[0]->count;

    $pagination_limit = 50;
    $pagination_total = $module_count[0]->count;
    $pagination_page = intval(filter_input(INPUT_GET, 'page', FILTER_SANITIZE_STRING));
    $pagination_page = $pagination_page == 0 ? 1 : $pagination_page;
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
    
    $offset = ($pagination['page'] - 1) * $pagination['limit'];
    $sql_query_limit = ' LIMIT ' . $offset . ',' . $pagination['limit'] ;
                                        
    $module_data = ModuleContents::find_by_sql($sql_select . $sql_query . $sql_query_limit);

    $adjust_val = ($pagination['total'] == 0) ? 0 : 1;
    $pagination['min'] = ($pagination['page'] - 1) * $pagination['limit'] + $adjust_val;
    $pagination['max'] = $pagination['min'] + count($module_data) - $adjust_val;

    render("access/module_index", array(
                   "module_data"    => $module_data,
                   'pagination'     => $pagination,
                ),"layouts/basic"
    );
  }


  function getNextModuleData(){

    $module_id = $_POST['module_id'];

    $sql_query  = " SELECT * FROM module_contents WHERE module_id = $module_id "; 
    $module = ModuleContents::find_by_sql($sql_query);

    $result = array();

    if($module){
        if($module[0]->menu_level_0 != "0" &&  $module[0]->url != ""){

            $sql_query = "SELECT MAX(function_order) + 1 AS function_order
                          FROM module_contents 
                          WHERE module_id_ref = '" . $module[0]->module_id_ref . "'";

            $module_detail = ModuleContents::find_by_sql($sql_query);

            $result = array(
                "type" => "function",
                "menu_level_0" => $module[0]->menu_level_0,
                "menu_level_1" => $module[0]->menu_level_1,
                "menu_level_2" => $module[0]->menu_level_2,
                "function_order" => $module_detail[0]->function_order,
                "module_id_ref" => $module[0]->module_id_ref,
                "group_id" => $module[0]->group_id,
                "url_required" => "YES"
            );

        } elseif($module[0]->menu_level_1 == "0" && $module[0]->menu_level_2 == "0"){

            $sql_query = "SELECT MAX(menu_level_1) + 1 AS menu_level_1  
                          FROM module_contents 
                          WHERE module_id_ref = '" . $module[0]->module_id_ref . "'"; 
            $module_detail = ModuleContents::find_by_sql($sql_query);

            $result = array(
                "type" => "menu",
                "menu_level_0" => $module[0]->menu_level_0,
                "menu_level_1" => $module_detail[0]->menu_level_1,
                "menu_level_2" => $module[0]->menu_level_2,
                "function_order" => 0,
                "module_id_ref" => $module[0]->module_id_ref,
                "group_id" => "",
                "url_required" => "NO"
            );

        } elseif($module[0]->menu_level_1 != "0" && $module[0]->menu_level_2 == "0" && $module[0]->url == ""){

            $sql_query = "SELECT MAX(menu_level_2) + 1 AS menu_level_2
                          FROM module_contents 
                          WHERE group_id = '" . $module[0]->group_id . "'";

            $module_detail = ModuleContents::find_by_sql($sql_query);

            $result = array(
                "type" => "menu",
                "menu_level_0" => $module[0]->menu_level_0,
                "menu_level_1" => $module[0]->menu_level_1,
                "menu_level_2" => $module_detail[0]->menu_level_2,
                "function_order" => 0,
                "module_id_ref" => $module[0]->module_id_ref,
                "group_id" => $module[0]->group_id,
                "url_required" => "YES"
            );

        } elseif($module[0]->menu_level_1 != "0" && $module[0]->menu_level_2 == "0" && $module[0]->url != ""){
            
            $sql_query = "SELECT Max(function_order)+1 AS function_order 
                          FROM module_contents 
                          WHERE group_id = '" . $module[0]->group_id . "'"; 

            $module_detail = ModuleContents::find_by_sql($sql_query);

            $result = array(
                "type" => "function",
                "menu_level_0" => $module[0]->menu_level_0,
                "menu_level_1" => $module[0]->menu_level_1,
                "menu_level_2" => $module[0]->menu_level_2,
                "function_order" => $module_detail[0]->function_order,
                "module_id_ref" => $module[0]->module_id_ref,
                "group_id" => $module[0]->group_id,
                "url_required" => "YES"
            );

        } elseif($module[0]->menu_level_1 != "0" && $module[0]->menu_level_2 != "0"){

            $sql_query = "SELECT Max(function_order)+1 AS function_order 
                          FROM module_contents 
                          WHERE menu_level_0 = '" . $module[0]->menu_level_0 . "'
                            AND menu_level_1 = '" . $module[0]->menu_level_1 . "'
                            AND menu_level_2 = '" . $module[0]->menu_level_2 . "'"; 

            $module_detail = ModuleContents::find_by_sql($sql_query);

            $result = array(
                "type" => "function",
                "menu_level_0" => $module[0]->menu_level_0,
                "menu_level_1" => $module[0]->menu_level_1,
                "menu_level_2" => $module[0]->menu_level_2,
                "function_order" => $module_detail[0]->function_order,
                "module_id_ref" => $module[0]->module_id_ref,
                "group_id" => $module[0]->group_id,
                "url_required" => "YES"
            );
        } 
    }

    echo json_encode($result);
  }

  /**
   * render create page
   */
  function moduleCreate(){

    $form = 'add';
    $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/access.js"></script>'.chr(10);
    
    $moduleModel = new ModuleContents();
    $module_list = $this->getModuleData(ture);

    $module_type = array(
            (object) array('value' => 'menu', 'text'=> 'Menu'),
            (object) array('value' => 'function',  'text'=> 'Function')
          );

    $show_type = array(
            (object) array('value' => 'all', 'text'=> 'All'),
            (object) array('value' => 'fa',  'text'=> 'fa user only'),
            (object) array('value' => 'ra',  'text'=> 'ra user only')
          );

    if(!empty($_POST)){

       $attributes = array(
                        'type' => $_POST['module-type']
                        ,'description' => $_POST['description']
                        ,'url'        => $_POST['module-url']
                        ,'comments'   => $_POST['module-comments']
                        ,'is_active'  => $_POST['module-status']
                        ,'menu_level_0' => $_POST['module-menu_level_0']
                        ,'menu_level_1' => $_POST['module-menu_level_1']
                        ,'menu_level_2' => $_POST['module-menu_level_2']
                        ,'function_order' => $_POST['function-order']
                        ,'show_type' => $_POST['show_type']
                        ,'access_code' => $_POST['access_code']
                    );

       $moduleModel = ModuleContents::create($attributes);

       if($moduleModel){

          if(!($moduleModel->menu_level_1 == 0 && $moduleModel->menu_level_2 == 0)){ //if not first level
              if($_POST['group_id'] == "" ){         
                  $moduleModel->group_id = $moduleModel->module_id; 
              } else {
                  $moduleModel->group_id = $_POST['group_id']; 
              }
          }  

          if($_POST['module_id_ref'] == ""){         
              $moduleModel->module_id_ref = $moduleModel->module_id; 
          } else {
              $moduleModel->module_id_ref = $_POST['module_id_ref']; 
          }

          $moduleModel->save();

          $message = 'The Module details was successfully saved.';
       } else {
          $error_msg = "There was a problem when creating this Module, please try again.";
       }
     
       $this->render_message($message, $error_msg);
       
    } else {
      
      $sql_query  = " SELECT max(menu_level_0) + 1 AS count FROM module_contents"; 
      $module = ModuleContents::find_by_sql($sql_query);
      $menu_level_0 = $module[0]->count;

      render("access/module_form", array(
                      "moduleModel" => $moduleModel,
                      'form'        => $form,
                      'module_list' => $module_list,
                      'module_type' => $module_type,
                      'menu_level_0' => $menu_level_0,
                      'show_type' =>  $show_type
                  ),"layouts/basic"
      );
    }
    
  }

  /**
   * render edit page
   */
  function moduleEdit($module_id, $form){

    $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/access.js"></script>'.chr(10);
    
    $moduleModel = ModuleContents::find($module_id);
    $module_list = $this->getModuleData(true);

    $module_type = array(
            (object) array('value' => 'menu', 'text'=> 'Menu'),
            (object) array('value' => 'function',  'text'=> 'Function')
          );

    $show_type = array(
            (object) array('value' => 'all', 'text'=> 'All'),
            (object) array('value' => 'fa',  'text'=> 'fa user only'),
            (object) array('value' => 'ra',  'text'=> 'ra user only')
          );

    if(!empty($_POST)){

       $attributes = array(
                        'description' => $_POST['description']
                        ,'url'        => $_POST['module-url']
                        ,'comments'   => $_POST['module-comments']
                        ,'is_active'  => $_POST['module-status']
                        ,'menu_level_1' => $_POST['module-menu_level_1']
                        ,'menu_level_2' => $_POST['module-menu_level_2']
                        ,'function_order' => $_POST['function-order']
                        ,'show_type' => $_POST['show_type']
                    );

       $moduleModel->update_attributes($attributes);

       if($moduleModel){
          $message = 'The Module details was successfully saved.';
       } else {
          $error_msg = "There was a problem when creating this Module, please try again.";
       }
     
       $this->render_message($message, $error_msg);

    } else {

      render("access/module_form", array(
                      "moduleModel" => $moduleModel,
                      'form'        => $form,
                      'module_list' => $module_list,
                      'module_type' => $module_type,
                      'module_id'   => $module_id,
                      'menu_level_0' => 0,
                      'show_type' => $show_type
                  ),"layouts/basic"
      );

    } 
    
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
   * function for viewing locked account
  */
  function getAccountUnlock(){
    
    try{
      $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/access.js"></script>'.chr(10);
      $_SESSION['user_return_url'] = BTL_DEFAULT_HTTP . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];

      //result filters
      $pagesize        = filter_input(INPUT_GET, 'pagesize', FILTER_SANITIZE_NUMBER_INT);
      $fullNameFilter  = trim(filter_input(INPUT_GET, 'fullname-filter', FILTER_SANITIZE_STRING));
      $emailFilter     = trim(filter_input(INPUT_GET, 'email-filter', FILTER_SANITIZE_STRING));
      $userStatus      = trim(filter_input(INPUT_GET, 'user-status', FILTER_SANITIZE_STRING));
    
      $sql_select = "users.username,
        users.full_name,
        users.company,
        users.email,
        users.is_active,
        users.is_locked,
        users.locked_date,
        users.user_id,
        users.is_double_verification,
        users.session_period
        ";
          
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
      }else if($userStatus == 'locked'){
        $condition_columns .= " AND  users.is_locked=1 ";
      }else if($userStatus == '2fa'){
        $condition_columns .= " AND  users.is_double_verification=1 ";
      }
      
      $condition_columns = ltrim($condition_columns, ' AND ');
      array_unshift($conditions, $condition_columns);
      
      $sort_order = " trim(users.full_name) ASC ";
      
      if(!$pagesize) {
        $pagesize = 50;
      }
      $pagination_limit = $pagesize;
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
      
      $users_list = User::find('all', array(
                          'select' => $sql_select,
                          'joins' => $sql_join,
                          'conditions' => $conditions,
                          'limit' => $pagination['limit'],
                          'offset' => ($pagination['page'] - 1) * $pagination['limit'],
                          'order' => $sort_order)
                    );
      
      $adjust_val = ($pagination['total'] == 0) ? 0 : 1;
      $pagination['min'] = ($pagination['page'] - 1) * $pagination['limit'] + $adjust_val;
      $pagination['max'] = $pagination['min'] + count($users_list) - $adjust_val;

      render('access/account_unlock', array(
                     'users_list' => $users_list,
                     'pagination' => $pagination,
                  ),'layouts/basic'
      );
    }
    catch(Exception $e){
      //Exception
    }
  }

  /**
   * function for common ajax operations
   */
  function commonAjax(){
    if(isset($_POST['action_type'])) {
      switch($_POST['action_type'])
      {
        case 'update_double_verification' :
          echo  User::updateDoubeVerificationStatus($_POST);
          break;
        case 'unlock_account' :
          echo  User::unlockAcoount($_POST);
          break;
        case 'save_session_period' :
          echo  $this->saveSessionPeriod($_POST);
          break;
        case 'get_session_average_time' :
          echo $this->getSessionAverageTime($_POST);
          break;
        default :
          echo 'Ooops, unexpected action occured';
      }
    }
  }

  /**
   * function for get session period
  */
  function getSessionPeriod(){

    try{
      $user_data = array();

      $GLOBALS["_css_scripts"] = '<link href="' . HOME . 'css/bootstrap-multiselect.css" rel="stylesheet" />'.chr(10);
      $GLOBALS["_js_scripts"] = '<script src="' . HOME . 'js/bootstrap-multiselect.js"></script>'.chr(10);
      $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/access.js"></script>'.chr(10);
      $_SESSION['user_return_url'] = BTL_DEFAULT_HTTP . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];

      // user list
      $user_list = User::find_by_sql("SELECT full_name AS txt, user_id AS val
                                      FROM users 
                                      WHERE is_active = 1
                                      ORDER BY full_name ASC");
      if(isset($_GET['user_id'])){
        $user_data = User::find_by_user_id($_GET['user_id']);
      }
      render('access/session_period', array(
        'user_list' => $user_list,
        'user_data' => $user_data
        ),'layouts/basic'
      );
    }
    catch(Exception $e){
      // Exception
    }
  }

  /**
   * function for save session period
  */
  function saveSessionPeriod($params){

    try{
      $success_msg = '';
      $error_msg = '';
      $session_period = $params['session_period'];
      $user_id = array_filter($params['user_id']);
      $object = User::connection();
     
      if(empty($user_id)){        
        $result = $object->query("UPDATE users SET session_period = $session_period
                            WHERE user_id<>0");
      }
      else{
        $user_id = implode($user_id, ',');
        $user_id = trim($user_id,',');
        $result = $object->query("UPDATE users SET session_period = $session_period
                            WHERE user_id IN($user_id)");
          
      }
      if($result){
        $success_msg =  "Session Period saved successfully";
        if($session_period == 0){
          $success_msg .=  ". The updated users will have a session period of 8 hours because the session period given in the last update was 0 or empty.";
        }
      }
      else{
        $error_msg = "There was a problem when saving session period, please try again.";
      }
      $this->render_message($success_msg, $error_msg);
    }
    catch(exception $e){
      // Exception
      $error_msg = "There was a problem when saving session period, please try again.";
      $this->render_message($success_msg, $error_msg);
    }
  }

  function getSessionAverageTime($param){
    $user_id = array_filter($param['user_id']);
    $query = "SELECT AVG(session_period) AS sess_avg FROM users ";

    if($user_id){
      $ids = implode(',', $user_id);
      $query .=  " WHERE user_id IN (".$ids.")";
    }

    $sessionTimeAverage = User::find_by_sql($query);
    return (int) $sessionTimeAverage[0]->sess_avg;
  }
}
