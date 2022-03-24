<?php
mysql_select_db($database_Bulktest, $Bulktest);

//Get config values stored inside the table tbl_config for Job PDFs.
if(isset($_module_name) && $_module_name != "")
{
	$_sql_stmt = "SELECT * FROM tbl_config WHERE item = '" .$_module_name."'";
	$_recset = mysql_query($_sql_stmt, $Bulktest) or die(mysql_error());
	$_rec = mysql_fetch_assoc($_recset);
	$configValues = json_decode($_rec['config_json']);
}

//Get main config values
$_sql_stmt_main = "SELECT * FROM tbl_config WHERE item = 'MainConfig' ";
$_recset_main = mysql_query($_sql_stmt_main, $Bulktest) or die(mysql_error());
$_rec_main = mysql_fetch_assoc($_recset_main);
$mainConfigValues = json_decode($_rec_main['config_json']);
//sharepoint credntials
if(!defined("BTL_SHAREPOINT_DATA")){//Array for share point credentials
	define("BTL_SHAREPOINT_DATA", json_encode($mainConfigValues->BTL_SHAREPOINT_DATA));
	if(BTL_SHAREPOINT_DATA){
		$sharepointArr = json_decode(BTL_SHAREPOINT_DATA);
		define("BTL_SP_USERNAME",$sharepointArr->username);
		define("BTL_SP_PASSWORD",$sharepointArr->password);
		define("BTL_SP_URL",$sharepointArr->url);
		define("BTL_SP_SITEURL",$sharepointArr->siteurl);
		define("BTL_SHAREPOINT_ACTIVE",$sharepointArr->active);
	}	
}
if(!defined("BRANCH")){
	define("BRANCH", $mainConfigValues->BRANCH);
}
if(!defined("BTL_DEF_DATE_DATA")){//Array for dynamic dateformat
	define("BTL_DEF_DATE_DATA", json_encode($mainConfigValues->BTL_DEF_DATE_DATA));
	if(BTL_DEF_DATE_DATA){
		$dateArr = json_decode(BTL_DEF_DATE_DATA);
		define("BTL_DEF_DATE_FORMAT",$dateArr->BTL_DEF_DATE_FORMAT);
		define("BTL_DEF_PLACEHOLDER",$dateArr->BTL_DEF_PLACEHOLDER);
		define("BTL_DEF_VIEW_DATE",$dateArr->BTL_DEF_VIEW_DATE);
		define("BTL_DEF_VIEW_DATE_INDEX",$dateArr->BTL_DEF_VIEW_DATE_INDEX);
		define("BTL_DEF_MONTH_DATE_TIME",$dateArr->BTL_DEF_MONTH_DATE_TIME);
		define("BTL_DEF_FETCH_DB",$dateArr->BTL_DEF_FETCH_DB);
		define("BTL_DEF_MYSQL_DATE",$dateArr->BTL_DEF_MYSQL_DATE);
		define("BTL_DEF_MYSQL_DATE_TIME",$dateArr->BTL_DEF_MYSQL_DATE_TIME);
		define("BTL_DEF_VIEW_DATE_TIME",$dateArr->BTL_DEF_VIEW_DATE_TIME);
	}	
}
if(!defined("BTL_ENABLE_COMMON_FUNC")){
	define("BTL_ENABLE_COMMON_FUNC", $mainConfigValues->BTL_ENABLE_COMMON_FUNC);
}
if(BRANCH == "USA"){
	if(!defined("BTL_FULL_MENU")){
		define("BTL_FULL_MENU", "usa");
	}
	if(!defined("BTL_BASE_CSS")){
		define("BTL_BASE_CSS", "css/erp/base_us.css");
	}
	if(!defined("BTL_STYLE_CSS")){
		define("BTL_STYLE_CSS", "css/style_us.css");
	}
	if(!defined("BTL_STYLE_ALT_CSS")){
		define("BTL_STYLE_ALT_CSS", "css/style_alter_us.css");
	}
	if(!defined("BTL_COMMN_DOC_UPLOAD")){
		if(BTL_ENABLE_COMMON_FUNC == 0){
			define("BTL_COMMN_DOC_UPLOAD",HOME);
		}else{
		define("BTL_COMMN_DOC_UPLOAD",$mainConfigValues->BTL_COMMN_DOC_UPLOAD);
		}
	}
	if(!defined("BTL_BASE_PATH_UK")){
		define("BTL_BASE_PATH_UK",$mainConfigValues->BTL_BASE_PATH_UK );
	}	
} else {
	if(!defined("BTL_FULL_MENU")){
		define("BTL_FULL_MENU", "uk");
	}
	if(!defined("BTL_BASE_CSS")){
		define("BTL_BASE_CSS", "css/erp/base.css");
	}
	if(!defined("BTL_STYLE_CSS")){
		define("BTL_STYLE_CSS", "css/style.css");
	}
	if(!defined("BTL_STYLE_ALT_CSS")){
		define("BTL_STYLE_ALT_CSS", "css/style_alter.css");
	}
	if(!defined("BTL_COMMN_DOC_UPLOAD")){
		define("BTL_COMMN_DOC_UPLOAD",HOME);
	}
	if(!defined("BTL_BASE_PATH_UK")){
		define("BTL_BASE_PATH_UK", '');
	}
}
if(!defined("BTL_DEF_TIMEZONE")){
	define("BTL_DEF_TIMEZONE", $mainConfigValues->BTL_DEF_TIMEZONE);
	date_default_timezone_set(BTL_DEF_TIMEZONE); //Defining TimeZone for Changes
}
if(!defined("BTL_DEF_CURRENCY")){
	define("BTL_DEF_CURRENCY", $mainConfigValues->BTL_DEF_CURRENCY);
}
if(!defined("BTL_DEF_CURRENCY_ID")){
	define("BTL_DEF_CURRENCY_ID", $mainConfigValues->BTL_DEF_CURRENCY_ID);
}
if(!defined("BTL_DEF_TANKTYPE_CURRENCY")){
	define("BTL_DEF_TANKTYPE_CURRENCY", $mainConfigValues->BTL_DEF_TANKTYPE_CURRENCY);
}
if(!defined("BTL_DEF_CURRENCY_CLASS")){
	define("BTL_DEF_CURRENCY_CLASS", $mainConfigValues->BTL_DEF_CURRENCY_CLASS);
}
if(!defined("BTL_DEF_TANKTYPE_CURRENCY_CLASS")){
	define("BTL_DEF_TANKTYPE_CURRENCY_CLASS", $mainConfigValues->BTL_DEF_TANKTYPE_CURRENCY_CLASS);
}
if(!defined("BTL_LOGO")){
	define("BTL_LOGO", $mainConfigValues->BTL_LOGO);
}
if(!defined("BTL_LOGO_SIZE")){
	define("BTL_LOGO_SIZE", $mainConfigValues->BTL_LOGO_SIZE);
}
if(!defined("BTL_ABOUT_US")){
	define("BTL_ABOUT_US", $mainConfigValues->BTL_ABOUT_US);
}
if(!defined("BTL_CONTACT_US")){
	define("BTL_CONTACT_US", $mainConfigValues->BTL_CONTACT_US);
}
if(!defined("BTL_ABOUT_CONTACT_LNK")){
	if(BRANCH == "USA"){
		define("BTL_ABOUT_CONTACT_LNK", "");
	} else {
		define("BTL_ABOUT_CONTACT_LNK", BTL_ABOUT_US . " | " . BTL_CONTACT_US);
	}
}
if(!defined("BTL_COPY_RIGHT")){
	define("BTL_COPY_RIGHT", $mainConfigValues->BTL_COPY_RIGHT);
}
//Welcom page
if(!defined("BTL_CUSTOM_WELCOME")){
	define("BTL_CUSTOM_WELCOME", $mainConfigValues->BTL_CUSTOM_WELCOME);
}
if(!defined("BTL_CUSTOM_WELCOME_IMAGE")){
	define("BTL_CUSTOM_WELCOME_IMAGE", $mainConfigValues->BTL_CUSTOM_WELCOME_IMAGE);
}
if(!defined("BTL_CUSTOM_WELCOME_IMAGE_SIZE")){
	define("BTL_CUSTOM_WELCOME_IMAGE_SIZE", $mainConfigValues->BTL_CUSTOM_WELCOME_IMAGE_SIZE);
}
//PDF template
if(!defined("BTL_PDF_JOB_TEMPLATE_1")){
	define("BTL_PDF_JOB_TEMPLATE_1", $mainConfigValues->BTL_PDF_JOB_TEMPLATE_1);
}
if(!defined("BTL_PDF_JOB_TEMPLATE_2")){
	define("BTL_PDF_JOB_TEMPLATE_2", $mainConfigValues->BTL_PDF_JOB_TEMPLATE_2);
} //this is for view invoice
//Job mail detail
if(!defined("BTL_JOB_MAIL_AUTO_TEXT_1")){
	define("BTL_JOB_MAIL_AUTO_TEXT_1", $mainConfigValues->BTL_JOB_MAIL_AUTO_TEXT_1);
}
//Web site
if(!defined("BTL_WEB_SITE")){
	define("BTL_WEB_SITE", $mainConfigValues->BTL_WEB_SITE);
}
//Email config
if(!defined("BTL_EMAIL_HOST")){
	define("BTL_EMAIL_HOST", $mainConfigValues->BTL_EMAIL_HOST);
}
if(!defined("BTL_EMAIL_PORT")){
	define("BTL_EMAIL_PORT", $mainConfigValues->BTL_EMAIL_PORT);
}
if(!defined("BTL_EMAIL_USER")){
	define("BTL_EMAIL_USER", $mainConfigValues->BTL_EMAIL_USER);
}
if(!defined("BTL_EMAIL_PASS")){
	define("BTL_EMAIL_PASS", $mainConfigValues->BTL_EMAIL_PASS);
}
if(!defined("BTL_EMAIL_PASS_2")){
	define("BTL_EMAIL_PASS_2", $mainConfigValues->BTL_EMAIL_PASS_2);
}
//Quote export templates
if(!defined("BTL_XLS_QUOTE_TEMPLATE_1")){
	define("BTL_PDF_QUOTE_TEMPLATE_1", $mainConfigValues->BTL_XLS_QUOTE_TEMPLATE_1);
}
if(!defined("BTL_PDF_QUOTE_LOGO")){
	define("BTL_PDF_QUOTE_LOGO", $mainConfigValues->BTL_PDF_QUOTE_LOGO);
}
if(!defined("BTL_EXPORT_FILE_PREFIX")){
	define("BTL_EXPORT_FILE_PREFIX", $mainConfigValues->BTL_EXPORT_FILE_PREFIX);
}
//Exchange rate service constants
if(!defined("BTL_ER_SERVICE_MAIL_ALERT_TO_1")){
	define("BTL_ER_SERVICE_MAIL_ALERT_TO_1", $mainConfigValues->BTL_ER_SERVICE_MAIL_ALERT_TO_1);
}
if(!defined("BTL_ER_SERVICE_MAIL_ALERT_TO_2")){
	define("BTL_ER_SERVICE_MAIL_ALERT_TO_2", $mainConfigValues->BTL_ER_SERVICE_MAIL_ALERT_TO_2);
}
if(!defined("BTL_ERP_SITE")){
	define("BTL_ERP_SITE", $mainConfigValues->BTL_ERP_SITE);
}
if(!defined("BTL_CURRENCY_WITH_SYMBOL")){
	define("BTL_CURRENCY_WITH_SYMBOL", $mainConfigValues->BTL_CURRENCY_WITH_SYMBOL);
}

if(!defined("BTL_EMAIL_HOST_NEW")){
	define("BTL_EMAIL_HOST_NEW", $mainConfigValues->BTL_EMAIL_HOST_NEW);
}
if(!defined("BTL_EMAIL_PORT_NEW")){
	define("BTL_EMAIL_PORT_NEW", $mainConfigValues->BTL_EMAIL_PORT_NEW);
}
if(!defined("BTL_DEFAULT_EMAIL_ENCR")){
	define("BTL_DEFAULT_EMAIL_ENCR", ($mainConfigValues->BTL_DEFAULT_EMAIL_ENCR == '') ? NULL : $mainConfigValues->BTL_DEFAULT_EMAIL_ENCR);
}
if(!defined("BTL_GOOGLE_API")){
	define("BTL_GOOGLE_API", $mainConfigValues->BTL_GOOGLE_API);
}
if(!defined("BTL_GPS_GOOGLE_KEY")){
	define("BTL_GPS_GOOGLE_KEY", $mainConfigValues->BTL_GPS_GOOGLE_KEY);
}
if(!defined("BTL_EXCHANGE_RATE_KEY")){
	define("BTL_EXCHANGE_RATE_KEY", $mainConfigValues->BTL_EXCHANGE_RATE_KEY);
}
if(!defined("BTL_REPORT_LOG")){
	define("BTL_REPORT_LOG", $mainConfigValues->BTL_REPORT_LOG);
}

if(!defined("BTL_PDF_JOB_TEMPLATE_SINGAPORE")){
	define("BTL_PDF_JOB_TEMPLATE_SINGAPORE", $mainConfigValues->BTL_PDF_JOB_TEMPLATE_SINGAPORE);
}
if(!defined("BTL_PDF_JOB_TEMPLATE_IBERIA")){
	define("BTL_PDF_JOB_TEMPLATE_IBERIA", $mainConfigValues->BTL_PDF_JOB_TEMPLATE_IBERIA);
}
if(!defined("BTL_PDF_JOB_TEMPLATE_CHINA")){
	define("BTL_PDF_JOB_TEMPLATE_CHINA", $mainConfigValues->BTL_PDF_JOB_TEMPLATE_CHINA);
}
if(!defined("BTL_PDF_JOB_TEMPLATE_NA")){
	define("BTL_PDF_JOB_TEMPLATE_NA", $mainConfigValues->BTL_PDF_JOB_TEMPLATE_NA);
}
if(!defined("BTL_PDF_JOB_TEMPLATE_AB")){
	define("BTL_PDF_JOB_TEMPLATE_AB", $mainConfigValues->BTL_PDF_JOB_TEMPLATE_AB);
}
if(!defined("BTL_PDF_JOB_TEMPLATE_USA")){
	define("BTL_PDF_JOB_TEMPLATE_USA", $mainConfigValues->BTL_PDF_JOB_TEMPLATE_USA);
}
if(!defined("BTL_INV_IBERIA_TEMPLATE")){
	define("BTL_INV_IBERIA_TEMPLATE", $mainConfigValues->BTL_INV_IBERIA_TEMPLATE);
}
if(!defined("BTL_INV_SINGAPORE_TEMPLATE")){
	define("BTL_INV_SINGAPORE_TEMPLATE", $mainConfigValues->BTL_INV_SINGAPORE_TEMPLATE);
}
if(!defined("BTL_INV_CHINA_TEMPLATE")){
	define("BTL_INV_CHINA_TEMPLATE", $mainConfigValues->BTL_INV_CHINA_TEMPLATE);
}
if(!defined("BTL_INV_USA_TEMPLATE")){
	define("BTL_INV_USA_TEMPLATE", $mainConfigValues->BTL_INV_USA_TEMPLATE);
}
if(!defined("BTL_INV_NA_TEMPLATE")){
	define("BTL_INV_NA_TEMPLATE", $mainConfigValues->BTL_INV_NA_TEMPLATE);
}
if(!defined("BTL_INV_AB_TEMPLATE")){
	define("BTL_INV_AB_TEMPLATE", $mainConfigValues->BTL_INV_AB_TEMPLATE);
}
if(!defined("BTL_PDF_QUOTE_LOGO_IBERIA")){
	define("BTL_PDF_QUOTE_LOGO_IBERIA", $mainConfigValues->BTL_PDF_QUOTE_LOGO_IBERIA);
}
if(!defined("BTL_PDF_QUOTE_LOGO_SINGAPORE")){
	define("BTL_PDF_QUOTE_LOGO_SINGAPORE", $mainConfigValues->BTL_PDF_QUOTE_LOGO_SINGAPORE);
}
if(!defined("BTL_PDF_QUOTE_LOGO_CHINA")){
	define("BTL_PDF_QUOTE_LOGO_CHINA", $mainConfigValues->BTL_PDF_QUOTE_LOGO_CHINA);
}
if(!defined("BTL_PDF_QUOTE_LOGO_USA")){
	define("BTL_PDF_QUOTE_LOGO_USA", $mainConfigValues->BTL_PDF_QUOTE_LOGO_USA);
}
if(!defined("BTL_PDF_QUOTE_LOGO_NA")){
	define("BTL_PDF_QUOTE_LOGO_NA", $mainConfigValues->BTL_PDF_QUOTE_LOGO_NA);
}
if(!defined("BTL_PDF_QUOTE_LOGO_AB")){
	define("BTL_PDF_QUOTE_LOGO_AB", $mainConfigValues->BTL_PDF_QUOTE_LOGO_AB);
}

if(!defined("BTL_XLS_QUOTE_TEMPLATE_IBERIA")){
	define("BTL_XLS_QUOTE_TEMPLATE_IBERIA", $mainConfigValues->BTL_XLS_QUOTE_TEMPLATE_IBERIA);
}
if(!defined("BTL_XLS_QUOTE_TEMPLATE_SINGAPORE")){
	define("BTL_XLS_QUOTE_TEMPLATE_SINGAPORE", $mainConfigValues->BTL_XLS_QUOTE_TEMPLATE_SINGAPORE);
}
if(!defined("BTL_XLS_QUOTE_TEMPLATE_CHINA")){
	define("BTL_XLS_QUOTE_TEMPLATE_CHINA", $mainConfigValues->BTL_XLS_QUOTE_TEMPLATE_CHINA);
}
if(!defined("BTL_XLS_QUOTE_TEMPLATE_USA")){
	define("BTL_XLS_QUOTE_TEMPLATE_USA", $mainConfigValues->BTL_XLS_QUOTE_TEMPLATE_USA);
}
if(!defined("BTL_XLS_QUOTE_TEMPLATE_NA")){
	define("BTL_XLS_QUOTE_TEMPLATE_NA", $mainConfigValues->BTL_XLS_QUOTE_TEMPLATE_NA);
}
if(!defined("BTL_XLS_QUOTE_TEMPLATE_AB")){
	define("BTL_XLS_QUOTE_TEMPLATE_AB", $mainConfigValues->BTL_XLS_QUOTE_TEMPLATE_AB);
}
if(!defined("DS_BTL_XLS_QUOTE_TEMPLATE_IBERIA")){
	define("DS_BTL_XLS_QUOTE_TEMPLATE_IBERIA", $mainConfigValues->DS_BTL_XLS_QUOTE_TEMPLATE_IBERIA);
}
if(!defined("DS_BTL_XLS_QUOTE_TEMPLATE_SINGAPORE")){
	define("DS_BTL_XLS_QUOTE_TEMPLATE_SINGAPORE", $mainConfigValues->DS_BTL_XLS_QUOTE_TEMPLATE_SINGAPORE);
}
if(!defined("DS_BTL_XLS_QUOTE_TEMPLATE_CHINA")){
	define("DS_BTL_XLS_QUOTE_TEMPLATE_CHINA", $mainConfigValues->DS_BTL_XLS_QUOTE_TEMPLATE_CHINA);
}
if(!defined("DS_BTL_XLS_QUOTE_TEMPLATE_USA")){
	define("DS_BTL_XLS_QUOTE_TEMPLATE_USA", $mainConfigValues->DS_BTL_XLS_QUOTE_TEMPLATE_USA);
}
if(!defined("DS_BTL_XLS_QUOTE_TEMPLATE_NA")){
	define("DS_BTL_XLS_QUOTE_TEMPLATE_NA", $mainConfigValues->DS_BTL_XLS_QUOTE_TEMPLATE_NA);
}
if(!defined("DS_BTL_XLS_QUOTE_TEMPLATE_AB")){
	define("DS_BTL_XLS_QUOTE_TEMPLATE_AB", $mainConfigValues->DS_BTL_XLS_QUOTE_TEMPLATE_AB);
}
if(!defined("DS_BTL_XLS_QUOTE_TEMPLATE_1")){
	define("DS_BTL_XLS_QUOTE_TEMPLATE_1", $mainConfigValues->DS_BTL_XLS_QUOTE_TEMPLATE_1);
}
if(!defined("BTL_PERMISSION_DIRECTORS")){
	define("BTL_PERMISSION_DIRECTOR", 3);
}
if(!defined("BTL_PERMISSION_MANAGERS")){
	define("BTL_PERMISSION_MANAGER", 5);
}
if(!defined("BTL_PERMISSION_IT")){
	define("BTL_PERMISSION_IT", 4);
}
if(!defined("BTL_PERMISSION_ACCOUNTS")){
	define("BTL_PERMISSION_ACCOUNTS", 6);
}
if(!defined("BTL_PERMISSION_M&R")){
	define("BTL_PERMISSION_M&R", 1);
}
if(!defined("BTL_PERMISSION_STANDARD")){
	define("BTL_PERMISSION_STANDARD", 2);
}
if(!defined("TANK_EXP_DEFAULT_DAYS")){
	define("TANK_EXP_DEFAULT_DAYS", 130);
}

if(!defined("ZOOM_CREDENTIALS")){//Array for dynamic dateformat
	define("ZOOM_CREDENTIALS", json_encode($mainConfigValues->ZOOM_CREDENTIALS));
	if(ZOOM_CREDENTIALS){
		$zoom_data = json_decode(ZOOM_CREDENTIALS);
		define("ZOOM_BASE_URL", $zoom_data->ZOOM_BASE_URL);
		define("ZOOM_CLIENT_ID", $zoom_data->ZOOM_CLIENT_ID);
		define("ZOOM_CLIENT_SECRET", $zoom_data->ZOOM_CLIENT_SECRET);
		define("ZOOM_REDIRECT_URL", $zoom_data->ZOOM_REDIRECT_URL);
		define("ZOOM_AUTH_CODE", $zoom_data->ZOOM_AUTH_CODE);
		define("ZOOM_CHANNEL", $zoom_data->ZOOM_CHANNEL);
		define("ZOOM_CHANNEL_CCT", $zoom_data->ZOOM_CHANNEL_CCT);
		define("ZOOM_CHANNEL_TPT", $zoom_data->ZOOM_CHANNEL_TPT);
	}	
}

if(!defined("BTL_HERE_MAP_APIKEY")){
	define("BTL_HERE_MAP_APIKEY", $mainConfigValues->BTL_HERE_MAP_APIKEY);
}
if(!defined("AZURE_CONNECTION_STRING")){
	define("AZURE_CONNECTION_STRING", $mainConfigValues->AZURE_CONNECTION_STRING);
}

if(!defined("SUMMARY_INVOICE_FOLDER_PATH")){
	define("SUMMARY_INVOICE_FOLDER_PATH", "uploads/SUMMARY_invoice/");
}

if(!defined("QSSHE_FOLDER_PATH")){
	define("QSSHE_FOLDER_PATH", "uploads/QSSHE/");
}

if(!defined("QSSHE_FROM_MAIL")){
	define("QSSHE_FROM_MAIL", $mainConfigValues->QSSHE_FROM_MAIL);
}

//European Union countries
$european_countries = array('AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HR','HU','IE','IT','LT','LU','LV','MT','NL','PL','PT','RO','SE','SI','SK');
define("EUROPEAN_UNION_COUNTRIES", $european_countries);
define("JT_INSTR_ACTIVITY", '["RAILL","SHUN","BARGE","RAILE","ETAS","ETA"]');

//SFTP CREDENTIALS
if(!defined("SFTP_CREDENTIALS")){
	define("SFTP_CREDENTIALS", json_encode($mainConfigValues->SFTP_CREDENTIALS));
	if(SFTP_CREDENTIALS){
		$sftp_data = json_decode(SFTP_CREDENTIALS);
		define("SFTP_URL", $sftp_data->SFTP_URL);
		define("SFTP_PORT", $sftp_data->SFTP_PORT);
		define("SFTP_STAGE_USER", $sftp_data->SFTP_STAGE_USER);
		define("SFTP_STAGE_PASSWORD", $sftp_data->SFTP_STAGE_PASSWORD);
		define("SFTP_LIVE_USER", $sftp_data->SFTP_LIVE_USER);
		define("SFTP_LIVE_PASSWORD", $sftp_data->SFTP_LIVE_PASSWORD);
	}	
}

//SEQUOIA CREDENTIALS
if(!defined("SEQUOIA_CREDENTIALS")){
	define("SEQUOIA_CREDENTIALS", json_encode($mainConfigValues->SEQUOIA_CREDENTIALS));
	if(SEQUOIA_CREDENTIALS){
		$sequoia_data = json_decode(SEQUOIA_CREDENTIALS);
		define("SEQUOIA_LIVE_URL", $sequoia_data->SEQUOIA_LIVE_URL);
		define("SEQUOIA_STAGE_URL", $sequoia_data->SEQUOIA_STAGE_URL);
		define("SEQUOIA_SOAP_ACTION", $sequoia_data->SEQUOIA_SOAP_ACTION);
	}	
}

//AUTHENTICATION CREDENTIALS
if(!defined("AUTHENTICATION_CREDENTIALS")){
	define("AUTHENTICATION_CREDENTIALS", json_encode($mainConfigValues->AUTHENTICATION_CREDENTIALS));
	if(AUTHENTICATION_CREDENTIALS){
		$authentication_data = json_decode(AUTHENTICATION_CREDENTIALS);
		define("PASSWORD_AGE", $authentication_data->PASSWORD_AGE);
		define("HISTORY_LIMIT", $authentication_data->HISTORY_LIMIT);
		define("MAX_ALLOWED_ATTEMPTS", $authentication_data->MAX_ALLOWED_ATTEMPTS);
		define("USER_LOCK_PERIOD", $authentication_data->USER_LOCK_PERIOD);
		define("SECRET_KEY", $authentication_data->SECRET_KEY);
		define("DEFAULT_SESSION_PERIOD", $authentication_data->DEFAULT_SESSION_PERIOD);
	}	
}
?>
