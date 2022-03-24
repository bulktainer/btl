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
 * This class 
 * contains configuration settings for the client people picker control hosted by 
 * the SharePoint sharing UI.
 */
class PickerSettings extends ClientObject
{
    /**
     * @return bool
     */
    public function getAllowEmailAddresses()
    {
        if (!$this->isPropertyAvailable("AllowEmailAddresses")) {
            return null;
        }
        return $this->getProperty("AllowEmailAddresses");
    }
    /**
     * @var bool
     */
    public function setAllowEmailAddresses($value)
    {
        $this->setProperty("AllowEmailAddresses", $value, true);
    }
    /**
     * @return bool
     */
    public function getAllowOnlyEmailAddresses()
    {
        if (!$this->isPropertyAvailable("AllowOnlyEmailAddresses")) {
            return null;
        }
        return $this->getProperty("AllowOnlyEmailAddresses");
    }
    /**
     * @var bool
     */
    public function setAllowOnlyEmailAddresses($value)
    {
        $this->setProperty("AllowOnlyEmailAddresses", $value, true);
    }
    /**
     * @return string
     */
    public function getPrincipalAccountType()
    {
        if (!$this->isPropertyAvailable("PrincipalAccountType")) {
            return null;
        }
        return $this->getProperty("PrincipalAccountType");
    }
    /**
     * @var string
     */
    public function setPrincipalAccountType($value)
    {
        $this->setProperty("PrincipalAccountType", $value, true);
    }
    /**
     * @return integer
     */
    public function getPrincipalSource()
    {
        if (!$this->isPropertyAvailable("PrincipalSource")) {
            return null;
        }
        return $this->getProperty("PrincipalSource");
    }
    /**
     * @var integer
     */
    public function setPrincipalSource($value)
    {
        $this->setProperty("PrincipalSource", $value, true);
    }
    /**
     * @return PeoplePickerQuerySettings
     */
    public function getQuerySettings()
    {
        if (!$this->isPropertyAvailable("QuerySettings")) {
            return null;
        }
        return $this->getProperty("QuerySettings");
    }
    /**
     * @var PeoplePickerQuerySettings
     */
    public function setQuerySettings($value)
    {
        $this->setProperty("QuerySettings", $value, true);
    }
    /**
     * @return integer
     */
    public function getVisibleSuggestions()
    {
        if (!$this->isPropertyAvailable("VisibleSuggestions")) {
            return null;
        }
        return $this->getProperty("VisibleSuggestions");
    }
    /**
     * @var integer
     */
    public function setVisibleSuggestions($value)
    {
        $this->setProperty("VisibleSuggestions", $value, true);
    }
}