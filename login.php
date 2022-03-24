<?php
   //session_starts here 
   session_start();
   
   //session not set then redirect to login
   if(!isset($_SESSION['MM_Username'])){ 
       header("Location: " . str_ireplace("login.php", "", $_SERVER['REQUEST_URI']) . "erp.php/login");
   }//if session set then redirect to home page
   else if(isset($_SESSION['MM_Username'])){
       header('Location:Welcome.php');
   }
?>
