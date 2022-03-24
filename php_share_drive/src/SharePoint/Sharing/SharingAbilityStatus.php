<?php

/**
 * Updated By PHP Office365 Generator 2019-10-12T20:07:53+00:00 16.0.19402.12016
 */
namespace Office365\PHP\Client\SharePoint\Sharing;

use Office365\PHP\Client\Runtime\ClientValueObject;
/**
 * Represents 
 * the status for a specific sharing capability for the current user.
 */
class SharingAbilityStatus extends ClientValueObject
{
    /**
     * Indicates 
     * the reason why the capability is disabled if the capability is disabled for any 
     * reason.This value 
     * MUST be None (section 3.2.5.449.1.2) if 
     * the capability is not disabled.This value MUST be Unavailable (section 3.2.5.449.1.1) 
     * if this capability is not applicable.This value MUST be one of the other SharingCapabilityDisabledReasons 
     * (section 3.2.5.449) if the 
     * capability is disabled for any reason.
     * @var integer
     */
    public $disabledReason;
    /**
     * Indicates 
     * whether capability is enabled.This value 
     * MUST be true if this capability is enabled and MUST be false if it is not.
     * @var bool
     */
    public $enabled;
}