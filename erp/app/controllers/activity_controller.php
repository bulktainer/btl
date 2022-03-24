<?php

class ActivityController extends BaseController
{

    function index()
    {
        $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/activity.js"></script>' . chr(10);

        // add filter and page variables to session
        $_SESSION['user_return_url'] = BTL_DEFAULT_HTTP . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];

        // START SEARCH SECTION
        // result filters
        $pagesize = filter_input(INPUT_GET, 'pagesize', FILTER_SANITIZE_NUMBER_INT);
        $activityFilter = filter_input(INPUT_GET, 'activity-filter', FILTER_SANITIZE_STRING);
        $statusFilter = filter_input(INPUT_GET, 'status-filter', FILTER_SANITIZE_NUMBER_INT);
        //query to select all the fields from the activity table to display on index page 
        $sql_select = " activities.act_id AS act_activity_id, activities.activity AS act_activity,
        activities.act_desc AS act_description,activities.act_nominal AS act_nominal,
        activities.act_is_archived,
        " . " IF (activities.planning=1,'Yes', 'No') AS 'act_planning',
        " . " IF (activities.moving=1,'Yes', 'No') AS 'act_moving',
        " . " IF (activities.quote=1,'Yes', 'No') AS 'act_quote',
        " . " IF (activities.act_reason=1,'Yes', 'No') AS 'act_reason_code', 
        " . " IF (activities.act_cost_page=1,'Yes', 'No') AS 'act_costpage', 
        " . " IF (activities.act_rechargeable=1,'Yes', 'No') AS 'act_rechargeable_col', 
        " . " IF (activities.act_operational_review=1,'Yes', 'No') AS 'act_operational_review_col',
        " . " IF (activities.act_slush=1,'Yes', 'No') AS 'act_slush_val',
        CASE
        WHEN tracking_point = 1 THEN 'To' 
        WHEN tracking_point = 2 THEN 'Both'
        ELSE 'From'
        END AS tracking_point_name,
        CASE
        WHEN last_activity = 0 THEN 'None' 
        WHEN last_activity = 1 THEN 'Allowed'
        ELSE 'Ignored'
        END AS last_activity_name ";
    
        $sql_join = " ";

        $condition_columns = '';
        $conditions = array();

        // option filter
        if ($activityFilter) {
            $condition_columns .= " AND (activities.activity LIKE '%{$activityFilter}%' ) ";
        }

        if ($statusFilter != "") {
            $condition_columns .= " AND activities.act_is_archived = $statusFilter";
        }
        
        // add filter and page variables to session
        $condition_columns = ltrim($condition_columns, ' AND ');
        array_unshift($conditions, $condition_columns);

        $sort_order = " trim(activities.activity) ASC ";
        if(!$pagesize) {
                $pagesize = 50;
        }
        $pagination_limit = $pagesize;
        $pagination_total = Activity::count(array(
            'conditions' => $conditions,
            'joins' => $sql_join
        ));
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

        $activityList = Activity::find('all', array(
            'select' => $sql_select,
            'joins' => $sql_join,
            'conditions' => $conditions,
            'limit' => $pagination['limit'],
            'offset' => ($pagination['page'] - 1) * $pagination['limit'],
            'order' => $sort_order
        ));

        $adjust_val = ($pagination['total'] == 0) ? 0 : 1;
        $pagination['min'] = ($pagination['page'] - 1) * $pagination['limit'] + $adjust_val;
        $pagination['max'] = $pagination['min'] + count($activityList) - $adjust_val;

        //Permiited users
        $userList = array();
        $users = User::find_by_sql("SELECT userid FROM user_permission WHERE user_team_id IN(3,5,6)");
        if(!empty($users)){
            foreach ($users as $key => $value) {
                $userList[] = $value->userid;
            }
        }
        
        render("activity/index", array(
            "activityList" => $activityList,
            'pagination' => $pagination,
            'userList' => $userList
        ), "layouts/basic");
    }

    // Function to render the message
    private function render_message($success = '', $error = '')
    {
        render("activity/message", array(
            'success_msg' => $success,
            'error_msg' => $error
        ), false);
    }

    // function for common ajax operations
    // 24-OCT-2018 DM
    function commonAjax()
    {
        if (isset($_POST['action_type'])) {
            switch ($_POST['action_type']) {

                case 'get_activity_detail':
                    echo $this->getActivityDetail($_POST);
                    break;
                case 'activitynameexist':
                    echo $this->checkActivityNameExist($_POST);
                    break;
                case 'change_activity_status':
                    echo $this->changeActivityStatus($_POST);
                    break;
                default:
                    echo 'Ooops, unexpected action occured';
            }
        }
    }
    //Function to get the activity details
    private function getActivityDetail($params)
    {
        $returnArray = array();
        $act_id = trim($_POST['act_id']);
        $activityData = Activity::find_by_act_id($act_id);
        //To display in view page
        if (! empty($activityData)) {

            $returnArray['act_activity'] = $activityData->activity;
            $returnArray['act_planning'] = ($activityData->planning == 1) ? 'Yes' : 'No';
            // $returnArray['act_moving'] = ($activityData->moving == 1) ? 'Yes' : 'No';
            $returnArray['act_quote'] = ($activityData->quote == 1) ? 'Yes' : 'No';
            $returnArray['act_costpage'] = ($activityData->act_cost_page == 1) ? 'Yes' : 'No';
            $returnArray['act_reason'] = ($activityData->act_reason == 1) ? 'Yes' : 'No';
            $returnArray['act_reachargeable'] = ($activityData->act_rechargeable == 1) ? 'Yes' : 'No';
            $returnArray['act_operationalreview'] = ($activityData->act_operational_review == 1) ? 'Yes' : 'No';
            $returnArray['act_description'] = $activityData->act_desc;
            $returnArray['act_nominal'] = $activityData->act_nominal;
           // $returnArray['tracking_point'] = $activityData->tracking_point;
            $trackingpoint=$activityData->tracking_point;
            if($trackingpoint == 1)
            {
                $returnArray['tracking_point']="To";
            }
            else if ($trackingpoint == 2) 
            {
                $returnArray['tracking_point']="Both";
            }
            else 
            {
                $returnArray['tracking_point']="From";
            }
            
        	$last_activity = $activityData->last_activity;
            if($last_activity == 0) {
                $returnArray['last_activity'] = "None";
            } else if ($last_activity == 1) {
                $returnArray['last_activity'] = "Allowed";
            } else {
                $returnArray['last_activity'] = "Ignored";
            }
            
        }
        echo json_encode($returnArray);
    }

    // Function to delete the activity
    function delete($activity_id)
    {
        $error_msg = '';
        $success_msg = '';

        $useractivity = Activity::find($activity_id);
        $useractivity_deleted = $useractivity->delete();

        // If the activity is deleted

        if ($useractivity_deleted) {
            $success_msg = "The Activity was successfully deleted.";
        } else {
            $error_msg = "There was a problem when deleting this Activity, please try again.";
        }

        render("activity/message", array(
            'useractivity' => $useractivity,
            'success_msg' => $success_msg,
            'error_msg' => $error_msg
        ), false);
    }
    //Function to create new activity
    function create()
    {
        $form = 'add';
        $GLOBALS["_js_scripts"] .= '<script src='.BTL_DEFAULT_HTTP.'ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>' . chr(10);
        $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/activity.js"></script>' . chr(10);

        $activityModel = new Activity();
        render("activity/form", array(
            "activityModel" => $activityModel,
            'form' => $form
        ), "layouts/basic");
    }

    // Function to add the new activity
    function add()
    {
        // Function to check whether the tags are added in the text field
        if (! function_exists('replaceHtmlCustome')) {

            function replaceHtmlCustome($str)
            {
                return preg_replace('/\s*([>])\s*/', ' > ', preg_replace('/\s*([<])\s*/', ' < ', str_replace(array(
                    '<',
                    '>',
                    '"'
                ), array(
                    " < ",
                    " > ",
                    "'"
                ), ($str)))); // Modify DM-27-OCT-2018
            }
        }

        $params = $_POST;
        $message = '';
        $activityname = trim(strtoupper($params['activity-name']));
        // checking whether the activty exist
        $c = $this->checkActivityNameExist(array(
            'activityname' => $activityname,
            'type' => ''
        ));
        if ($c == 0) {
            $activityModel = new Activity();
            $attributes = array(
                'activity' => $activityname,
                'planning' => trim($params['activity_planning']),
                'moving' => trim($params['activity_moving']),
                'quote' => trim($params['activity_quotation']),
                'act_reason' => trim($params['activity_reason']),
                'act_cost_page' => trim($params['activity_costpage']),
                'act_desc' => trim(replaceHtmlCustome($params['activity_description'])),
                'act_nominal' => trim(replaceHtmlCustome($params['activity_nominal'])),
                'act_rechargeable' => trim($params['activity_recharge']),
                'act_operational_review' => trim($params['activity_review']),
                'created_by' => trim($_SESSION['MM_FullName']),
                'created_at' => date('Y-m-d H:i:s'),
                'tracking_point' => $params['tracking_point'],
                'act_slush' => $params['act_slush_val'],
            	'last_activity' => $params['last_activity']
            );
            $activityCreate = $activityModel->create($attributes);

            if ($activityCreate) {

                $message = 'The activity details was successfully saved.';
            } else {
                $error_msg = "There was a problem when creating this activity, please try again.";
            }
        } else if ($c > 0) {
            $error_msg = "Activity Already Exist, please try again";
        } else {
            $error_msg = "There was a problem when creating this Activity, please try again.";
        }
        $this->render_message($message, $error_msg);
    }

    // Function to update the activity details
    function update($activity_id)
    {

        // Function to check whether the tags are added in the text field
        if (! function_exists('replaceHtmlCustome')) {

            function replaceHtmlCustome($str)
            {
                return preg_replace('/\s*([>])\s*/', ' > ', preg_replace('/\s*([<])\s*/', ' < ', str_replace(array(
                    '<',
                    '>',
                    '"'
                ), array(
                    " < ",
                    " > ",
                    "'"
                ), ($str)))); // Modify DM-27-OCT-2018
            }
        }

        $message = '';
        $error_msg = '';
        $params = $_POST;
        $hiddenname = $_POST['hidden-activityname'];

        $activityname = trim(strtoupper($params['activity-name']));
        if ($hiddenname == $activityname) {
            $c = 0;
        } else {
            $c = $this->checkActivityNameExist(array(
                'activityname' => $activityname,
                'type' => ''
            ));
        }
        if ($c == 0) {
            $activityModel = Activity::find($activity_id);
            $attributes = array(
                'activity' => $activityname,
                'planning' => trim($params['activity_planning']),
                'moving' => trim($params['activity_moving']),
                'quote' => trim($params['activity_quotation']),
                'act_reason' => trim($params['activity_reason']),
                'act_cost_page' => trim($params['activity_costpage']),
                'act_desc' => trim(replaceHtmlCustome($params['activity_description'])),
                'act_nominal' => trim(replaceHtmlCustome($params['activity_nominal'])),
                'act_rechargeable' => trim($params['activity_recharge']),
                'act_operational_review' => trim($params['activity_review']),
                'modified_by' => trim($_SESSION['MM_FullName']),
                'modified_at' => date('Y-m-d H:i:s'),
                'tracking_point' => $params['tracking_point'],
                'act_slush' => $params['act_slush_val'],
            	'last_activity' => $params['last_activity']
            );
            $activityUpdate = $activityModel->update_attributes($attributes);
            if ($activityUpdate) 
            {
                $message = 'The Activity details was successfully saved.';
            } 
            else 
            {
                $error_msg = "There was a problem when updating, please try again.";
            }
            } 
            else if ($c > 0) 
            {
            $error_msg = "Activity Already Exist, please try again";
            } 
            else 
            {
            $error_msg = "There was a problem when creating this Activity, please try again.";
            }

        $this->render_message($message, $error_msg);
    }

    // Function to edit the activity
    function edit($activity_id, $form)
    {
        $GLOBALS["_js_scripts"] .= '<script src="' . HOME . 'js/erp/activity.js"></script>' . chr(10);
        $activityModel = Activity::find($activity_id);

        render("activity/form", array(
            "activityModel" => $activityModel,
            "form" => $form
        ), "layouts/basic");
    }

    // Function to check whether the activity exist in the table
    public function checkActivityNameExist($params)
    {
        $activityname = $params['activityname'];
        $type = $params['type'];

        $query = "SELECT count(*) as count FROM activities
  				WHERE activity=?";

        $c = User::find_by_sql($query, array(
            $activityname
        ));
        $count = $c[0]->count;

        return $count;
    }

    /**
     * chage quote to trash,live and archive
     * @param array post $params
     */
    private function changeActivityStatus($params){
        $activityId = $params['activityId'];
        $changeTo = $params['changeTo'];
        $activity = $params['activity'];

        if($changeTo == 'archive'){
            $attributes = array('act_is_archived' => 1);
        }else{
            $attributes = array('act_is_archived' => 0);
        }

        $activities = Activity::find_by_pk($activityId);
        $activities->update_attributes($attributes);     
        $success_msg = '<strong>'.$activity.'</strong> is Successfully moved to '.ucfirst($changeTo);
        render("activity/message", array(
                'success_msg' => $success_msg
        ), false);  
    }
} // End of activity controller
?>