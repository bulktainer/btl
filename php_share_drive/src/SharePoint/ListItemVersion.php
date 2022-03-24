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
 * a version of a list item.
 */
class ListItemVersion extends ClientObject
{
    /**
     * @return string
     */
    public function getCreated()
    {
        if (!$this->isPropertyAvailable("Created")) {
            return null;
        }
        return $this->getProperty("Created");
    }
    /**
     * @var string
     */
    public function setCreated($value)
    {
        $this->setProperty("Created", $value, true);
    }
    /**
     * @return bool
     */
    public function getIsCurrentVersion()
    {
        if (!$this->isPropertyAvailable("IsCurrentVersion")) {
            return null;
        }
        return $this->getProperty("IsCurrentVersion");
    }
    /**
     * @var bool
     */
    public function setIsCurrentVersion($value)
    {
        $this->setProperty("IsCurrentVersion", $value, true);
    }
    /**
     * @return integer
     */
    public function getVersionId()
    {
        if (!$this->isPropertyAvailable("VersionId")) {
            return null;
        }
        return $this->getProperty("VersionId");
    }
    /**
     * @var integer
     */
    public function setVersionId($value)
    {
        $this->setProperty("VersionId", $value, true);
    }
    /**
     * @return string
     */
    public function getVersionLabel()
    {
        if (!$this->isPropertyAvailable("VersionLabel")) {
            return null;
        }
        return $this->getProperty("VersionLabel");
    }
    /**
     * @var string
     */
    public function setVersionLabel($value)
    {
        $this->setProperty("VersionLabel", $value, true);
    }
    /**
     * @return User
     */
    public function getCreatedBy()
    {
        if (!$this->isPropertyAvailable("CreatedBy")) {
            $this->setProperty("CreatedBy", new User($this->getContext(), new ResourcePathEntity($this->getContext(), $this->getResourcePath(), "CreatedBy")));
        }
        return $this->getProperty("CreatedBy");
    }
    /**
     * @return FieldCollection
     */
    public function getFields()
    {
        if (!$this->isPropertyAvailable("Fields")) {
            $this->setProperty("Fields", new FieldCollection($this->getContext(), new ResourcePathEntity($this->getContext(), $this->getResourcePath(), "Fields")));
        }
        return $this->getProperty("Fields");
    }
    /**
     * @return FileVersion
     */
    public function getFileVersion()
    {
        if (!$this->isPropertyAvailable("FileVersion")) {
            $this->setProperty("FileVersion", new FileVersion($this->getContext(), new ResourcePathEntity($this->getContext(), $this->getResourcePath(), "FileVersion")));
        }
        return $this->getProperty("FileVersion");
    }
}