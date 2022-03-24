<?php

/**
 * Updated By PHP Office365 Generator 2019-11-16T17:57:50+00:00 16.0.19506.12022
 */
namespace Office365\PHP\Client\SharePoint;

use Office365\PHP\Client\Runtime\InvokePostMethodQuery;
use Office365\PHP\Client\Runtime\ClientObject;
use Office365\PHP\Client\Runtime\ResourcePathEntity;
/**
 * An object 
 * (1) that can be assigned security permissions.The HasUniqueRoleAssignments property is not included in the 
 * default 
 * scalar property set for this type.
 */
class SecurableObject extends ClientObject
{
    /**
     * Creates unique role assignments for the securable object.
     * @param bool $copyRoleAssignments
     */
    public function breakRoleInheritance($copyRoleAssignments)
    {
        $qry = new InvokePostMethodQuery($this->getResourcePath(), "breakroleinheritance", array($copyRoleAssignments));
        $this->getContext()->addQuery($qry);
    }
    /**
     * @return RoleAssignmentCollection
     */
    public function getRoleAssignments()
    {
        if (!isset($this->RoleAssignments)) {
            $this->setProperty('RoleAssignments', new RoleAssignmentCollection($this->getContext(), new ResourcePathEntity($this->getContext(), $this->getResourcePath(), "roleassignments")));
        }
        return $this->getProperty('RoleAssignments');
    }
    /**
     * Gets a Boolean value indicating whether the object has unique security or
     * inherits its role assignments from a parent object.
     * @return bool
     */
    public function getHasUniqueRoleAssignments()
    {
        return $this->getProperty('HasUniqueRoleAssignments');
    }
    /**
     * Specifies 
     * the object where role assignments for 
     * this object are defined.<85>
     * @return SecurableObject
     */
    public function getFirstUniqueAncestorSecurableObject()
    {
        if (!$this->isPropertyAvailable("FirstUniqueAncestorSecurableObject")) {
            $this->setProperty("FirstUniqueAncestorSecurableObject", new SecurableObject($this->getContext(), new ResourcePathEntity($this->getContext(), $this->getResourcePath(), "FirstUniqueAncestorSecurableObject")));
        }
        return $this->getProperty("FirstUniqueAncestorSecurableObject");
    }
    /**
     * Specifies 
     * whether the role assignments are 
     * uniquely defined for this securable object or 
     * inherited from a parent securable object. If the value is "false", role 
     * assignments are inherited from a parent securable object.
     * @var bool
     */
    public function setHasUniqueRoleAssignments($value)
    {
        $this->setProperty("HasUniqueRoleAssignments", $value, true);
    }
}