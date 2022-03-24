<?php
privilege_settings($database_Bulktest, $Bulktest);

function privilege_settings($database_Bulktest, $Bulktest){

	$fullPermissionBit = false; //TO override user privilage function
  $isValid = false;
  $isAjax = false;

  session_start();
  if(isset($_SESSION['is_admin']) && $_SESSION['is_admin'] == 1 ){
    $fullPermissionBit = true; 
  }

  $modes = array("haulage","shipping","ds_shipping","rail","barge","shunt","cleaning");
	mysql_select_db($database_Bulktest, $Bulktest);
	
	if(isset($_SERVER['REQUEST_URI'])){
		if($fullPermissionBit) { //Full permission 
      $isValid = false;
    }
		else{

      /* AJAX check  */
      if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) 
                && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        $isAjax = true;
      }

			$searchStr = ltrim($_SERVER['REQUEST_URI'], "/");
			$searchStr = str_ireplace(BTL_URL_PREFIX, '', $searchStr);
      $searchStr = str_ireplace('erp.php/access/privilege-error', '', $searchStr);
      $searchStr = str_ireplace('Welcome.php', '', $searchStr);

			$user_id = $_SESSION['user_id'];
			
			if($searchStr != '/' || !empty($searchStr) || strpos($searchStr,'Logout') != 0){
				$isValid = true;
			}
			if(!empty($searchStr)){
				$searchStr = explode('?', $searchStr)[0];
				$searchStr = preg_replace('/\d+/', "%", $searchStr);
				$searchStr = str_replace($modes, "%", $searchStr);

				if (strpos($searchStr, 'dangerousgoods') !== false){
				  $searchStr = 'dangerousgoods';
				}
			}
			else{
				$isValid = false;
			}
		}

		if(!empty($user_id) && $isValid){
			$sql = "SELECT mc.module_id FROM module_contents AS mc 
              INNER JOIN user_privilege AS up 
                   ON mc.module_id = up.user_module
              WHERE up.user_id = '$user_id' 
                   AND mc.url LIKE '%$searchStr%' ";
			$result = mysql_query($sql, $Bulktest) or die(mysql_error());
			$row = mysql_fetch_assoc($result);

      if($_SESSION['MM_UserGroup'] == "fa" && !empty($row)){
        if($isAjax){
          echo false; die;
        } else {
          header("Location: " . HOME . "erp.php/access/privilege-error");  
        }
        
      }elseif($_SESSION['MM_UserGroup'] == "ra" && empty($row)){
        if($isAjax){
          echo false; die;
        } else {
          header("Location: " . HOME . "erp.php/access/privilege-error");
        }
				
			}
		}

	}
}

/* Build dynamic menu */
function getMenuList($Bulktest){
	
  $fullPermissionBit = false; //TO override user privilage function

  if(isset($_SESSION['is_admin']) && $_SESSION['is_admin'] == 1 ){
    $fullPermissionBit = true; 
  }

	$user_id = $_SESSION['user_id'];
    
    try{
        $row = array();
       
        $menu_html = '<div id="nav" class="container_12 rounded">
                        <ul class="sf-menu">
                          <li class="first-item">
                            <a href="' . HOME . 'Welcome.php">Home</a>
                          </li>';

        if($fullPermissionBit){
            $menu_query = "SELECT m.* FROM module_contents m 
                            WHERE type = 'menu' AND m.is_active = 1 AND description != 'Home'
                            AND m.show_type IN ('all','fa') 
                            ORDER BY menu_level_0 ASC,menu_level_1 ASC, menu_level_2 ASC";
        }
        elseif($_SESSION['MM_UserGroup'] == "ra"){
            $menu_query = "SELECT m.* FROM module_contents m 
                            WHERE type = 'menu' AND m.is_active = 1 AND description != 'Home' 
                            AND m.module_id IN (
                                SELECT u.user_module FROM user_privilege u WHERE u.user_id = '$user_id'
                            )
                            AND m.show_type IN ('all','ra') 
                            ORDER BY menu_level_0 ASC,menu_level_1 ASC, menu_level_2 ASC";
        }
        else {
            $menu_query = "SELECT m.* FROM module_contents m 
                            WHERE type = 'menu' AND m.is_active = 1 AND description != 'Home' 
                            AND m.module_id NOT IN (
                                SELECT u.user_module FROM user_privilege u WHERE u.user_id = '$user_id'
                            )
                            AND m.show_type IN ('all','fa') 
                            ORDER BY menu_level_0 ASC,menu_level_1 ASC, menu_level_2 ASC";
        }

        $menu_result = mysql_query($menu_query, $Bulktest) or die(mysql_error());

        while($rec = mysql_fetch_assoc($menu_result)){
          $row[] = $rec; 
        }

        $recCount = count($row);
        $menu_level_0 = false;
        $menu_level_1 = false;
        $menu_level_2 = false;
        $menu_type = "";

        for($i = 0; $i < $recCount; $i++) {
           
            if($row[$i]['menu_level_1'] == 0 && $row[$i]['menu_level_2'] == 0){ 
                if($menu_type == "level0_ul"){
                  $menu_html .= '</ul></li>';
                }

                $menu_html .= getMainMenuHtml($row[$i]); 
                $menu_level_0 = true;
                $menu_type = "level0";

                if($row[$i+1]['menu_level_1'] == 0 || $recCount == ($i+1) ){
                  $menu_html .= '</li>'; 
                }
                elseif($row[$i+1]['menu_level_1'] != 0){
                  $menu_html .= '<ul>'; 
                  $menu_type .= "_ul";
                }
            }
            elseif($row[$i]['menu_level_1'] != 0 && $row[$i]['menu_level_2'] == 0 && $menu_level_0){ 
                $menu_html .= getSubmenuHtml($row[$i]);
                $menu_level_1 = true;
                $menu_type = "level1";

                if($row[$i+1]['menu_level_1'] == 0 || $recCount == ($i+1)){
                  $menu_html .= '</li></ul></li>'; 
                  $menu_level_0 = false;
                }
                elseif($row[$i+1]['menu_level_2'] == 0){
                  $menu_html .= '</li>'; 
                }
                elseif($row[$i+1]['menu_level_2'] != 0){
                  $menu_html .= '<ul>'; 
                }
            }
            elseif($row[$i]['menu_level_1'] != 0 && $row[$i]['menu_level_2'] != 0 && $menu_level_0 && $menu_level_1){ 
                $menu_html .= getNextSubMenuHtml($row[$i]);
                $menu_type = "level2";
                if($row[$i+1]['menu_level_1'] == 0 || $recCount == ($i+1)){
                  $menu_html .= '</ul></li></ul></li>'; 
                  $menu_level_0 = false;
                  $menu_level_1 = false;
                }
                elseif($row[$i+1]['menu_level_1'] != 0 && $row[$i+1]['menu_level_2'] == 0){
                  $menu_html .= '</ul></li>'; 
                  $menu_level_1 = false;
                }
            }

        }

        $menu_html .= '</ul></div>';

        return $menu_html;
    }
    catch(Exception $e){
        //print_r($e);
    }
}

/* Get Main menu */
function getMainMenuHtml($row){
  if(empty($row['url'])){
  	$url = "#";
  }
  else{
  	$url = HOME.$row['url'];
  }
  $menu_html .= '<li class="current main"><a href="'.$url.'">'.$row['description'].'</a>';
  return $menu_html;
}

/* Get Sub menu */
function getSubmenuHtml($row){
   if(empty($row['url'])){
  	$url = "#";
  }
  else{
  	$url = HOME.$row['url'];
  }
  $menu_html .= '<li class="current sub"><a style="word-break: keep-all" href="'. $url .'">'.$row['description'].'</a>';
  return $menu_html;
}

/* Get Next Sub menu */
function getNextSubMenuHtml($row){
  if(empty($row['url'])){
    $url = "#";
  }
  else{
    $url = HOME.$row['url'];
  }
  $menu_html .= '<li class="current next-sub"><a href="'. $url .'">'.$row['description'].'</a></li>';
  return $menu_html;
}

?>