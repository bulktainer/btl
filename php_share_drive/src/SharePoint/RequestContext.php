<?php

/**
 * Updated By PHP Office365 Generator 2019-11-17T18:22:48+00:00 16.0.19506.12022
 */
namespace Office365\PHP\Client\SharePoint;

use Office365\PHP\Client\Runtime\ClientObject;
use Office365\PHP\Client\Runtime\DeleteEntityQuery;
use Office365\PHP\Client\Runtime\ResourcePathEntity;
use Office365\PHP\Client\Runtime\UpdateEntityQuery;
/**
 * Provides 
 * basic WSS context information: site, web, list, and list item.Use this class to return context information about such 
 * objects as the current Web application, site collection, site, list, or list 
 * item.
 */
class RequestContext extends ClientObject
{
    /**
     * @return Site
     */
    public function getSite()
    {
        if (!$this->isPropertyAvailable("Site")) {
            $this->setProperty("Site", new Site($this->getContext(), new ResourcePathEntity($this->getContext(), $this->getResourcePath(), "Site")));
        }
        return $this->getProperty("Site");
    }
    /**
     * @return Web
     */
    public function getWeb()
    {
        if (!$this->isPropertyAvailable("Web")) {
            $this->setProperty("Web", new Web($this->getContext(), new ResourcePathEntity($this->getContext(), $this->getResourcePath(), "Web")));
        }
        return $this->getProperty("Web");
    }
    /**
     * @return RequestContext
     */
    public function getCurrent()
    {
        if (!$this->isPropertyAvailable("Current")) {
            $this->setProperty("Current", new RequestContext($this->getContext(), new ResourcePathEntity($this->getContext(), $this->getResourcePath(), "Current")));
        }
        return $this->getProperty("Current");
    }
}