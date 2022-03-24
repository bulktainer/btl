<?php

/**
 * Updated By PHP Office365 Generator 2019-11-17T17:00:44+00:00 16.0.19506.12022
 */
namespace Office365\PHP\Client\SharePoint;

use Office365\PHP\Client\Runtime\ClientObject;
use Office365\PHP\Client\Runtime\DeleteEntityQuery;
use Office365\PHP\Client\Runtime\ResourcePathEntity;
use Office365\PHP\Client\Runtime\UpdateEntityQuery;
/**
 * Represents 
 * an instance of a tenant-scoped app for a given host web.
 */
class TenantAppInstance extends ClientObject
{
    /**
     * @return string
     */
    public function getId()
    {
        if (!$this->isPropertyAvailable("Id")) {
            return null;
        }
        return $this->getProperty("Id");
    }
    /**
     * @var string
     */
    public function setId($value)
    {
        $this->setProperty("Id", $value, true);
    }
    /**
     * @return string
     */
    public function getSiteId()
    {
        if (!$this->isPropertyAvailable("SiteId")) {
            return null;
        }
        return $this->getProperty("SiteId");
    }
    /**
     * @var string
     */
    public function setSiteId($value)
    {
        $this->setProperty("SiteId", $value, true);
    }
    /**
     * @return string
     */
    public function getWebId()
    {
        if (!$this->isPropertyAvailable("WebId")) {
            return null;
        }
        return $this->getProperty("WebId");
    }
    /**
     * @var string
     */
    public function setWebId($value)
    {
        $this->setProperty("WebId", $value, true);
    }
}