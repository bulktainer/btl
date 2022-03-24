<?php

/**
 * Updated By PHP Office365 Generator 2019-11-17T16:35:02+00:00 16.0.19506.12022
 */
namespace Office365\PHP\Client\SharePoint;

use Office365\PHP\Client\Runtime\ClientObject;
use Office365\PHP\Client\Runtime\DeleteEntityQuery;
use Office365\PHP\Client\Runtime\ResourcePathEntity;
use Office365\PHP\Client\Runtime\UpdateEntityQuery;
/**
 * Represents 
 * a list definition or a list template, which defines the fields and views for a 
 * list. List definitions are contained in files within \\Program Files\Common 
 * Files\Microsoft Shared\Web Server Extensions\12\TEMPLATE\FEATURES, but list 
 * templates are created through the user interface or through the object model 
 * when a list is saved as a template.Use the Web.ListTemplates property (section 3.2.5.143.1.2.13) 
 * to return a ListTemplateCollection (section 3.2.5.92) for a 
 * site collection. Use an indexer to return a single list definition or list 
 * template from the collection.
 */
class ListTemplate extends ClientObject
{
    /**
     * @return bool
     */
    public function getAllowsFolderCreation()
    {
        if (!$this->isPropertyAvailable("AllowsFolderCreation")) {
            return null;
        }
        return $this->getProperty("AllowsFolderCreation");
    }
    /**
     * @var bool
     */
    public function setAllowsFolderCreation($value)
    {
        $this->setProperty("AllowsFolderCreation", $value, true);
    }
    /**
     * @return integer
     */
    public function getBaseType()
    {
        if (!$this->isPropertyAvailable("BaseType")) {
            return null;
        }
        return $this->getProperty("BaseType");
    }
    /**
     * @var integer
     */
    public function setBaseType($value)
    {
        $this->setProperty("BaseType", $value, true);
    }
    /**
     * @return string
     */
    public function getDescription()
    {
        if (!$this->isPropertyAvailable("Description")) {
            return null;
        }
        return $this->getProperty("Description");
    }
    /**
     * @var string
     */
    public function setDescription($value)
    {
        $this->setProperty("Description", $value, true);
    }
    /**
     * @return string
     */
    public function getFeatureId()
    {
        if (!$this->isPropertyAvailable("FeatureId")) {
            return null;
        }
        return $this->getProperty("FeatureId");
    }
    /**
     * @var string
     */
    public function setFeatureId($value)
    {
        $this->setProperty("FeatureId", $value, true);
    }
    /**
     * @return bool
     */
    public function getHidden()
    {
        if (!$this->isPropertyAvailable("Hidden")) {
            return null;
        }
        return $this->getProperty("Hidden");
    }
    /**
     * @var bool
     */
    public function setHidden($value)
    {
        $this->setProperty("Hidden", $value, true);
    }
    /**
     * @return string
     */
    public function getImageUrl()
    {
        if (!$this->isPropertyAvailable("ImageUrl")) {
            return null;
        }
        return $this->getProperty("ImageUrl");
    }
    /**
     * @var string
     */
    public function setImageUrl($value)
    {
        $this->setProperty("ImageUrl", $value, true);
    }
    /**
     * @return string
     */
    public function getInternalName()
    {
        if (!$this->isPropertyAvailable("InternalName")) {
            return null;
        }
        return $this->getProperty("InternalName");
    }
    /**
     * @var string
     */
    public function setInternalName($value)
    {
        $this->setProperty("InternalName", $value, true);
    }
    /**
     * @return bool
     */
    public function getIsCustomTemplate()
    {
        if (!$this->isPropertyAvailable("IsCustomTemplate")) {
            return null;
        }
        return $this->getProperty("IsCustomTemplate");
    }
    /**
     * @var bool
     */
    public function setIsCustomTemplate($value)
    {
        $this->setProperty("IsCustomTemplate", $value, true);
    }
    /**
     * @return string
     */
    public function getName()
    {
        if (!$this->isPropertyAvailable("Name")) {
            return null;
        }
        return $this->getProperty("Name");
    }
    /**
     * @var string
     */
    public function setName($value)
    {
        $this->setProperty("Name", $value, true);
    }
    /**
     * @return bool
     */
    public function getOnQuickLaunch()
    {
        if (!$this->isPropertyAvailable("OnQuickLaunch")) {
            return null;
        }
        return $this->getProperty("OnQuickLaunch");
    }
    /**
     * @var bool
     */
    public function setOnQuickLaunch($value)
    {
        $this->setProperty("OnQuickLaunch", $value, true);
    }
    /**
     * @return integer
     */
    public function getListTemplateTypeKind()
    {
        if (!$this->isPropertyAvailable("ListTemplateTypeKind")) {
            return null;
        }
        return $this->getProperty("ListTemplateTypeKind");
    }
    /**
     * @var integer
     */
    public function setListTemplateTypeKind($value)
    {
        $this->setProperty("ListTemplateTypeKind", $value, true);
    }
    /**
     * @return bool
     */
    public function getUnique()
    {
        if (!$this->isPropertyAvailable("Unique")) {
            return null;
        }
        return $this->getProperty("Unique");
    }
    /**
     * @var bool
     */
    public function setUnique($value)
    {
        $this->setProperty("Unique", $value, true);
    }
}