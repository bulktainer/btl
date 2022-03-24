<?php

use Office365\PHP\Client\Runtime\Auth\AuthenticationContext;
use Office365\PHP\Client\Runtime\Utilities\RequestOptions;
use Office365\PHP\Client\SharePoint\ClientContext;
use Office365\PHP\Client\Runtime\ClientRuntimeContext;
use Office365\PHP\Client\SharePoint\File;
use Office365\PHP\Client\SharePoint\SPList;
class SharePointAccess {
  //Authentication Process is done here ; checking username and password in the SharePoint  account.
  public function sharepointAuthentication() {
      try {
          //this path shud be required ,its important
          require_once BTL_BASE_PATH.'/../php_share_drive/examples/bootstrap.php';
          $authCtx = new AuthenticationContext(BTL_SP_URL);
          $authCtx->acquireTokenForUser(BTL_SP_USERNAME,BTL_SP_PASSWORD);
          $ctx = new ClientContext(BTL_SP_URL,$authCtx);
          return $ctx;
      }
      catch (Exception $e) {
        echo 'Error: ', "Sorry! We have encountered an authentication error", "\n";
        //echo 'Error: ',  $e->getMessage(), "\n";
    }
  }
  // For uploading from Front End View to SharePoint
  public function sharepointAccessFile($localPathvalue, $areaType = '') {
      try {

          $ctx = $this->sharepointAuthentication();
          $localPath = $localPathvalue;
          if($areaType != '' && strpos($areaType, 'job-files') !== false){
            $pathFolderUrl =  BTL_SP_SITEURL.$areaType;
            $targetFolderUrl = $this->createYearMonthFolder($ctx,$pathFolderUrl);
          }else{
            $targetFolderUrl =  BTL_SP_SITEURL;
          }
          $this->uploadFiles($ctx,$localPath,$targetFolderUrl);
      }
      catch (Exception $e) {
        echo 'Error: ', "Sorry! Files can't be uploaded right now", "\n";
        //echo 'Error: ',  $e->getMessage(), "\n";
    }
  }
  //Upload File Function ;uploading files into SharePoint
  public function uploadFiles(ClientContext $ctx, $localPath, $targetFolderUrl) {

      $fileName = basename($localPath);
      $fileCreationInformation = new \Office365\PHP\Client\SharePoint\FileCreationInformation();
      $fileCreationInformation->Content = file_get_contents($localPath);
      $fileCreationInformation->Url = $fileName;
      $uploadFile = $ctx->getWeb()->getFolderByServerRelativeUrl($targetFolderUrl)->getFiles()->add($fileCreationInformation);
      $ctx->executeQuery();

  }

    // checking whether files exist in SharePoint or not
    public function checkFileExists($fileName){
      try{
          $ctx = $this->sharepointAuthentication();
          $fileUrl = BTL_SP_SITEURL.$fileName;
          $file = $ctx->getWeb()->getFileByServerRelativeUrl($fileUrl);
          $ctx->load($file);
          $ctx->executeQuery();
          if($file->getProperty("Exists")==1){
              return true;
          }

        }catch (Exception $e) {
              return false;
       }
    }

  //Delete File from SharePoint
  public function deleteFiles($fileName, $areaType = '',$filedate = '') {
      try {
            $ctx = $this->sharepointAuthentication();
            $deletePath = BTL_SP_SITEURL;
            if($areaType != ""){  $deletePath .= $areaType;  }
            if($filedate != ""){
              $deletePath .= str_replace("-", "/", $filedate).'/';
            }
            $deletePath .= $fileName;
            $fileToDelete = $ctx->getWeb()->getFileByServerRelativeUrl($deletePath);
            /*if($filedate != '' && $areaType != ''){
              $folderPath = explode('-',$filedate);
              $deletePath = BTL_SP_SITEURL.$areaType.$folderPath[0].'/'.$folderPath[1].'/'.$fileName;
              $fileToDelete = $ctx->getWeb()->getFileByServerRelativeUrl($deletePath);
            }else{
              $fileToDelete = $ctx->getWeb()->getFileByServerRelativeUrl(BTL_SP_SITEURL.$fileName);
            }*/
            $fileToDelete->deleteObject();
            $ctx->executeQuery();
      }
      catch (Exception $e) {
            //echo 'Error: ',  "File Cannot be deleted!", "\n";
            //echo 'Error: ',  $e->getMessage(), "\n";
      }
  }
  //Download file from SharePoint based on the type of file
  public function downloadFile($params,$theType){
      try {

          switch ($theType) {
              case 'job-file':
                                $ctx = $this->sharepointAuthentication();
                                if($params['added_date'] != "" ){
                                  $datePath = str_replace("-", "/", $params['added_date']);
                                  $fileUrl = BTL_SP_SITEURL . 'job-files/'.$datePath.'/'.$params['filename'];
                                }else{
                                  $fileUrl = BTL_SP_SITEURL . 'job-files/'.$params['filename'];
                                }
				$file = $ctx->getWeb()->getFileByServerRelativeUrl($fileUrl);
                                $ctx->load($file);
                                $ctx->executeQuery();
                                 if($file->getProperty("Exists")==1){
                                    $size =  $file->getProperty("Length");
                                    $fileContent = Office365\PHP\Client\SharePoint\File::openBinary($ctx, $fileUrl);
                                    //header('Content-type: application/octet-stream');
                                    header("Content-Type:".$params['mime_Type']);
                                    header("Content-Length:".$size);
                                    header("Content-Disposition: attachment; filename=".$params['filename']);
                                    // Print data
                                    echo $fileContent;
                                }
                                break;

              case 'job_template':
                                $ctx = $this->sharepointAuthentication();
                                $fileUrl = BTL_SP_SITEURL . $params['filepath'];
                                $file = $ctx->getWeb()->getFileByServerRelativeUrl($fileUrl);
                                $ctx->load($file);
                                $ctx->executeQuery();
                                 // echo "<pre>"; print_r($file->getProperty("Exists")) ; die;
                                 if($file->getProperty("Exists")==1){
                                    $size =  $file->getProperty("Length");
                                    $fileContent = Office365\PHP\Client\SharePoint\File::openBinary($ctx, $fileUrl);
                                    //header('Content-type: application/octet-stream');
                                    header("Content-Type:".$params['mime_Type']);
                                    header("Content-Length:".$size);
                                    header("Content-Disposition: attachment; filename=".$params['filename']);
                                    // Print data
                                    echo $fileContent;
                                }
                                else{
                                    return false;
                                }
                                break;

                      default:
                                // code...
                                $sql = "SELECT
                                        docs.docs_type,
                                        docs.docs_size,
                                        docs.docs_name
                                        FROM docs WHERE docs.docs_id = ?  limit 1";
                                        $doc_details =  Product::find_by_sql($sql ,array($params));
                                        $params = $doc_details[0];
                                        $ctx = $this->sharepointAuthentication();
                                        $fileUrl = BTL_SP_SITEURL.$params->docs_name;
                                        $file = $ctx->getWeb()->getFileByServerRelativeUrl($fileUrl);
                                        $ctx->load($file);
                                        $ctx->executeQuery();
                                        if($file->getProperty("Exists")==1){
                                            $size =  $file->getProperty("Length");
                                            $fileContent = Office365\PHP\Client\SharePoint\File::openBinary($ctx, $fileUrl);
                                            //header('Content-type: application/octet-stream');
                                                header("Content-Type:".$params->docs_type);
                                                header("Content-Length:".$size);
                                                header("Content-Disposition: attachment; filename=".$params->docs_name);
                                                // Print data
                                                echo $fileContent;
                                            }
                                            else{
                                                return false;
                                            }
                                            break;
                                        }

                                    }
                                    catch (Exception $e) {
                                        echo '<h3>404 - File not found!</h3>', "\n";
                                        //echo 'Error: ',  $e->getMessage(), "\n";
                                    }

  }
  //create dyanamic year and month
  public function createYearMonthFolder(ClientContext $ctx,$parentFolderUrl){
     try{
          $returnUrl = '';
          $existYearFolder = $this->checkFolderExists($parentFolderUrl,date('Y'));
          $existMonthFolder = $this->checkFolderExists($parentFolderUrl, date('m'));
          if($existYearFolder && $existMonthFolder) {
              $returnUrl = $parentFolderUrl.date('Y').'/'.date('m');
          }else if($existYearFolder){
              $parentFolder = $ctx->getWeb()->getFolderByServerRelativeUrl($parentFolderUrl.date('Y').'/');
              $childFolder = $parentFolder->getFolders()->add(date('m'));
              $ctx->executeQuery();
              $returnUrl = $childFolder->getProperty("ServerRelativeUrl"); 
          }else{
              $parentFolder = $ctx->getWeb()->getFolderByServerRelativeUrl($parentFolderUrl);
              $childFolder = $parentFolder->getFolders()->add(date('Y'));
              $ctx->executeQuery();
              $yearFolder = $childFolder->getProperty("ServerRelativeUrl");
              $parentYearFolder = $ctx->getWeb()->getFolderByServerRelativeUrl($yearFolder);
              $childMonthFolder = $parentYearFolder->getFolders()->add(date('m'));
              $ctx->executeQuery();
              $returnUrl = $childMonthFolder->getProperty("ServerRelativeUrl"); 
          }
          return $returnUrl;
    }catch (Exception $e) {
          return false;
    }
   // print "Child folder {$childFolder->getProperty("ServerRelativeUrl")} has been created ";
  }

  public function createSubFolder($parentFolderUrl, $folderName){
    try{
      $returnUrl = '';
      $ctx = $this->sharepointAuthentication();
      $existFolder = $this->checkFolderPathExists($parentFolderUrl, $folderName);
      if($existFolder){
        $parentFolder = $ctx->getWeb()->getFolderByServerRelativeUrl($parentFolderUrl);
        $childFolder = $parentFolder->getFolders()->add($folderName);
        $ctx->executeQuery();
        $returnUrl = $childFolder->getProperty("ServerRelativeUrl");
      } 
      return $returnUrl;
    }catch (Exception $e) {
      return false;
    }
  }
   
  //check folders exist or not
  public function checkFolderExists($folderUrl, $foldername){
    try{
      $ctx = $this->sharepointAuthentication();
      $folder = $ctx->getWeb()->getFolderByServerRelativeUrl($folderUrl.$foldername);
      $ctx->load($folder);
      $ctx->executeQuery();
      if($folder->getProperty("Exists") == 'Exists'){
        return true;
      }
    }catch (Exception $e) {
      return false;
    }
  }

  //check folders exist or not
  public function checkFolderPathExists($folderUrl, $foldername){
    try{
      $ctx = $this->sharepointAuthentication();
      $folder = $ctx->getWeb()->getFolderByServerRelativeUrl($folderUrl);
      $ctx->load($folder);
      $ctx->executeQuery();
      if($folder->getProperty("Exists") == 'Exists'){
        return true;
      }
      return false;
    }catch (Exception $e) {
      return false;
    }
  }

  // For uploading from Front End View to SharePoint
  public function sharepointFileUpload($localPathvalue, $areaType = '') {
    try {
      $ctx = $this->sharepointAuthentication();
      $localPath = $localPathvalue;
      $targetFolderUrl = ($areaType != '') ? BTL_SP_SITEURL.$areaType : BTL_SP_SITEURL;
      $this->uploadFiles($ctx,$localPath, $targetFolderUrl);
    }
    catch (Exception $e) {
      return "Error: Sorry! Files can't be uploaded right now\n";
      //echo 'Error: ',  $e->getMessage(), "\n";
    }
  }

  //Delete File from SharePoint
  public function deleteSharepointFiles($fileName) {
    try {
      $ctx = $this->sharepointAuthentication();
      $fileToDelete = $ctx->getWeb()->getFileByServerRelativeUrl(BTL_SP_SITEURL.$fileName);
      $fileToDelete->deleteObject();
      $ctx->executeQuery();
    }
    catch (Exception $e) {
      echo 'Error: ',  "File Cannot be deleted!", "\n";
      //echo 'Error: ',  $e->getMessage(), "\n";
    }
  }

  function downloadSupportingDocument($file_path, $target_path, $date_added){
    try{
      $ctx = $this->sharepointAuthentication();
      $fileUrl = BTL_SP_SITEURL . 'job-files/'.$date_added.'/'.$file_path;
      $file = $ctx->getWeb()->getFileByServerRelativeUrl($fileUrl);
      $ctx->load($file);
      $ctx->executeQuery();
       
      if($file->getProperty("Exists")==1){
          $size =  $file->getProperty("Length");
          $fileContent = Office365\PHP\Client\SharePoint\File::openBinary($ctx, $fileUrl);
          file_put_contents($target_path, $fileContent);
      }
    }
    catch(Exception $e){
      // Exception
    }
  }
}
