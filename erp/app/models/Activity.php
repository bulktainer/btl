<?php

class Activity extends ActiveRecord\Model {
	static $table_name = 'activities';
    static $primary_key = 'act_id';
    
    const HAULAGE_ACTIVITIES    = array('LOAD','LOADD','LOADR','TIP','TIPDE','TIPRE','TIPDR','SHUN','SHUNE','SHUNH');
    
  static public function get_activity_id($aid)
  {
  	$result = '';
  	$activity = self::find('one', array('select' =>'act_id', 'conditions' => array('activity = ?', $aid)));
  	
  	if (count($activity) > 0) {
  		$result = $activity->act_id;
  	}
  	return $result;
  }
  
}
