<?php

// Date format fix
\ActiveRecord\Connection::$datetime_format = 'Y-m-d H:i:s';

// Setup ActiveRecord
ActiveRecord\Config::initialize(function($cfg) {
  global $db_config;
  $cfg->set_model_directory('erp/app/models');
  $cfg->set_connections(array(
    'development' => "mysql://{$db_config['username']}:{$db_config['password']}@{$db_config['hostname']}/{$db_config['database']}"
  ));
  date_default_timezone_set(BTL_DEF_TIMEZONE);
});

// Setup Dispatch
if("" != BTL_URL_PREFIX) {
  config("dispatch.url", BTL_DEFAULT_HTTP.BTL_SERVER_NAME."/".BTL_URL_PREFIX."erp.php");
} else {
  config("dispatch.url", BTL_DEFAULT_HTTP.BTL_SERVER_NAME."/erp.php");
}
config("dispatch.views", "erp/app/views");
config("dispatch.layout", "layouts/index");
