<?php

/**
 * Updated By PHP Office365 Generator 2019-11-16T19:51:42+00:00 16.0.19506.12022
 */
namespace Office365\PHP\Client\SharePoint;

/**
 * Specifies 
 * a change on a view.The RelativeTime property is not included in the default 
 * scalar property set for this type.
 */
class ChangeView extends Change
{

    /**
     * Identifies 
     * the changed view.
     * @return string
     */
    public function getViewId()
    {
        if (!$this->isPropertyAvailable("ViewId")) {
            return null;
        }
        return $this->getProperty("ViewId");
    }
    /**
     * Identifies 
     * the changed view.
     * @var string
     */
    public function setViewId($value)
    {
        $this->setProperty("ViewId", $value, true);
    }
    /**
     * Identifies 
     * the list 
     * that contains the changed view.Exceptions: 
     * Error CodeError Type NameCondition-1System.NotSupportedExceptionThe list identifier in 
     *   the change fields (2) item of 
     *   the change collection is NULL.
     * @return string
     */
    public function getListId()
    {
        if (!$this->isPropertyAvailable("ListId")) {
            return null;
        }
        return $this->getProperty("ListId");
    }
    /**
     * Identifies 
     * the list 
     * that contains the changed view.Exceptions: 
     * Error CodeError Type NameCondition-1System.NotSupportedExceptionThe list identifier in 
     *   the change fields (2) item of 
     *   the change collection is NULL.
     * @var string
     */
    public function setListId($value)
    {
        $this->setProperty("ListId", $value, true);
    }
    /**
     * Identifies 
     * the site 
     * (2) that contains the changed view.Exceptions: 
     * Error CodeError Type NameCondition-1System.NotSupportedExceptionThe site identifier in 
     *   the change fields (2) item of 
     *   the change collection is NULL.
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
     * Identifies 
     * the site 
     * (2) that contains the changed view.Exceptions: 
     * Error CodeError Type NameCondition-1System.NotSupportedExceptionThe site identifier in 
     *   the change fields (2) item of 
     *   the change collection is NULL.
     * @var string
     */
    public function setWebId($value)
    {
        $this->setProperty("WebId", $value, true);
    }
}