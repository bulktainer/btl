<?php

class AuthService
{
	 public function __construct() {
     }
     public function getTfaObject()
     {
     	require_once BTL_BASE_PATH . '/../sonata-project/google-authenticator/src/FixedBitNotation.php';
        require_once BTL_BASE_PATH . '/../sonata-project/google-authenticator/src/GoogleAuthenticatorInterface.php';
        require_once BTL_BASE_PATH . '/../sonata-project/google-authenticator/src/GoogleAuthenticator.php';
        require_once BTL_BASE_PATH . '/../sonata-project/google-authenticator/src/GoogleQrUrl.php';
        $g = new \Google\Authenticator\GoogleAuthenticator();
        return $g;
     }
}