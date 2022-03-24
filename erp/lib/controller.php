<?php

class BaseController {
  private $message;
  private $errors;

  // Constructor --------------------------------------------------------------
  public function __construct() {
    if(session('message')) {
      $this->message = session('message');
      session('message', null);
    }
  }

  // Get controller class name based on URL parameter -------------------------
  public static function get_name($param) {
    $parts = explode("-", $param);
    $parts = array_map("ucfirst", $parts);
    return implode("", $parts)."Controller";
  }

}
