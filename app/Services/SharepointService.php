<?php
namespace App\Services;

use Office365\Runtime\Auth\UserCredentials;
use Office365\SharePoint\ClientContext;

class SharepointService{

    public function uploadFile($data,$file_name)
    {
        $credentials = new UserCredentials(config('services.sharepoint.username'),config('services.sharepoint.password'));
        $client = (new ClientContext(config('services.sharepoint.siteurl')))->withCredentials($credentials);
        $sourceFileName = $file_name;
        $targetLibraryTitle = "Documents";
        $targetList = $client->getWeb()->getLists()->getByTitle($targetLibraryTitle);
        $uploadFile = $targetList->getRootFolder()->uploadFile(basename($sourceFileName),file_get_contents($data));
        $client->executeQuery();
         return $uploadFile->getServerRelativeUrl();
    }
}