<?php

//session_start();
//require_once('include/logout.php');

// hide notices
error_reporting(error_reporting() & ~E_NOTICE ^ E_DEPRECATED);

define('BASE_DIR', 'erp');
define('APP_DIR', BASE_DIR.'/app');

require "Connections/Bulktest.php";

//For not expiring the login
extendSessionValues($Bulktest); 

// close base connection
mysql_close($Bulktest);

require BASE_DIR."/vendor/autoload.php";
require BASE_DIR."/lib/controller.php";

// Helpers
require APP_DIR."/helpers/app_helper.php";
require APP_DIR."/helpers/application_helper.php";
require APP_DIR."/helpers/form_helper.php";
require APP_DIR."/helpers/view_helper.php";
require APP_DIR."/helpers/customer_quotes_helper.php";
require APP_DIR."/helpers/supplier_costs_helper.php";
require APP_DIR."/helpers/storage_costs_helper.php";

// Service Objects
require APP_DIR."/services/sharepointaccess.php";
require APP_DIR."/services/authservice.php";

// Controllers
require APP_DIR."/controllers/access_controller.php";
require APP_DIR."/controllers/activity_controller.php";
require APP_DIR."/controllers/user_management_controller.php";
require APP_DIR."/controllers/login_controller.php";


// Config files
require BASE_DIR."/config/application.php";
require BASE_DIR."/config/routes.php";

// CSS script tag
global $_css_scripts;
// JS script tag
global $_js_scripts;

dispatch();
