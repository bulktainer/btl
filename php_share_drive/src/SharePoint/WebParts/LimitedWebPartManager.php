<?php

/**
 * Updated By PHP Office365 Generator 2019-11-16T20:28:28+00:00 16.0.19506.12022
 */
namespace Office365\PHP\Client\SharePoint\WebParts;

use Office365\PHP\Client\Runtime\ClientValueObject;
use Office365\PHP\Client\Runtime\InvokePostMethodQuery;
use Office365\PHP\Client\Runtime\ClientObject;
use Office365\PHP\Client\Runtime\ResourcePathEntity;
/**
 * Provides 
 * operations to access and modify the existing Web Parts on a Web Part 
 * Page, and add new ones to the Web Part Page.
 */
class LimitedWebPartManager extends ClientObject
{
    /**
     * Imports a Web Part from a string in the .dwp format
     * @param string $webPartXml
     * @return WebPartDefinition
     */
    public function importWebPart($webPartXml)
    {
        $payload = new ClientValueObject();
        $payload->setProperty("webPartXml", $webPartXml);
        $webPartDefinition = new WebPartDefinition($this->getContext());
        $qry = new InvokePostMethodQuery($this->getResourcePath(), "ImportWebPart", null, $payload);
        $this->getContext()->addQuery($qry, $webPartDefinition);
        return $webPartDefinition;
    }
    /**
     * @return WebPartDefinitionCollection
     */
    public function getWebParts()
    {
        if (!$this->isPropertyAvailable('WebParts')) {
            $this->setProperty("WebParts", new WebPartDefinitionCollection($this->getContext(), new ResourcePathEntity($this->getContext(), $this->getResourcePath(), "WebParts")));
        }
        return $this->getProperty("WebParts");
    }
    /**
     * Specifies 
     * whether the Web Part Page 
     * contains one or more personalized Web Parts. 
     * Its value 
     * MUST be "true" if both the personalization scope 
     * of the Web Part Page is "User" and the Web Part Page contains one or 
     * more personalized Web Parts; otherwise, it MUST be "false".
     * @return bool
     */
    public function getHasPersonalizedParts()
    {
        if (!$this->isPropertyAvailable("HasPersonalizedParts")) {
            return null;
        }
        return $this->getProperty("HasPersonalizedParts");
    }
    /**
     * Specifies 
     * whether the Web Part Page 
     * contains one or more personalized Web Parts. 
     * Its value 
     * MUST be "true" if both the personalization scope 
     * of the Web Part Page is "User" and the Web Part Page contains one or 
     * more personalized Web Parts; otherwise, it MUST be "false".
     * @var bool
     */
    public function setHasPersonalizedParts($value)
    {
        $this->setProperty("HasPersonalizedParts", $value, true);
    }
    /**
     * Specifies 
     * the current personalization scope 
     * of the Web Part Page.Its value 
     * MUST be "User" if personalized data is loaded for the Web Parts 
     * on the Web Part Page, or "Shared" if common data for all users is 
     * loaded.
     * @return integer
     */
    public function getScope()
    {
        if (!$this->isPropertyAvailable("Scope")) {
            return null;
        }
        return $this->getProperty("Scope");
    }
    /**
     * Specifies 
     * the current personalization scope 
     * of the Web Part Page.Its value 
     * MUST be "User" if personalized data is loaded for the Web Parts 
     * on the Web Part Page, or "Shared" if common data for all users is 
     * loaded.
     * @var integer
     */
    public function setScope($value)
    {
        $this->setProperty("Scope", $value, true);
    }
}