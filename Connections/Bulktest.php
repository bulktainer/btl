<?php
# FileName="Connection_php_mysql.htm"
# Type="MYSQL"
# HTTP="true"

define("BTL_DEFAULT_HTTP", "http://");
//define("BTL_DEFAULT_HTTP", "https://");

/*if (isset($_SERVER['REQUEST_SCHEME']) && $_SERVER['REQUEST_SCHEME'] == 'http' && BTL_DEFAULT_HTTP == 'https://') {
	header("Location: " . BTL_DEFAULT_HTTP . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']);
	exit;
}
*/
if(!defined("BTL_ENV")) {
  
  define("BTL_SERVER_NAME", $_SERVER["HTTP_HOST"]);
  define("BTL_BASE_PATH", dirname(__FILE__));

  if(strstr(BTL_SERVER_NAME, "localhost")) {
    define("BTL_ENV", "local_mikos");
  } elseif(strstr(BTL_SERVER_NAME, "beansapp.local")) {
    define("BTL_ENV", "local_simbax");
  } elseif(strstr(BTL_SERVER_NAME, "bulkoni.erp.simbax.com")) {
    define("BTL_ENV", "bulkon_production");
  } elseif(strstr(BTL_SERVER_NAME, "simstaging.co.uk")) {
    define("BTL_ENV", "staging");
  } elseif(strstr(BTL_SERVER_NAME, "usa.bt-ms.com")) {
    define("BTL_ENV", "usa-production");   
  } else {
    define("BTL_ENV", "production");
  }
}

switch(BTL_ENV) {
  case "local_mikos" :
    $db_config = array(
      "hostname" => "localhost",
      "username" => "root",
      "password" => "pass@123",
      "database" => "btl_live_3mar2022", // "btl_19mar2021l" //"" btl_26july2021
    );
    define('HOME', BTL_DEFAULT_HTTP.'localhost/btl-Help/');
    define("BTL_URL_PREFIX", "btl-Help/");
    define("BTL_SERVER_TYPE", "LOCAL");
    //ini_set('display_errors', 1);
    //error_reporting(E_ALL);
    //error_reporting(E_ALL &~(E_DEPRECATED | E_NOTICE | E_STRICT));
    break;

  default :
    die("Missing environment config.");
    break;
}


$hostname_Bulktest = $db_config['hostname'];
$database_Bulktest = $db_config['database'];
$username_Bulktest = $db_config['username'];
$password_Bulktest = $db_config['password'];

$Bulktest = mysqli_connect($hostname_Bulktest, $username_Bulktest, $password_Bulktest) or trigger_error(mysql_error(),E_USER_ERROR);

require_once('ud_php_core_func.php');
require_once('json-config.php');
require_once('btl-common-helper.php');
require_once('btl-constants.php');
require_once('user-previlege.php');
?>
