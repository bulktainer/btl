<?php

/**
 * Updated By PHP Office365 Generator 2019-10-08T21:56:53+00:00 16.0.19325.12009 
*/
namespace Office365\PHP\Client\SharePoint;

use Office365\PHP\Client\Runtime\ClientValueObject;
class AlertCreationInformation extends ClientValueObject
{
    /** 
     * @var integer  
     */
    public $AlertFrequency;
    /** 
     * @var string  
     */
    public $AlertTemplateName;
    /** 
     * @var string  
     */
    public $AlertTime;
    /** 
     * @var integer  
     */
    public $AlertType;
    /** 
     * @var bool  
     */
    public $AlwaysNotify;
    /** 
     * @var integer  
     */
    public $DeliveryChannels;
    /** 
     * @var integer  
     */
    public $EventType;
    /** 
     * @var integer  
     */
    public $EventTypeBitmask;
    /** 
     * @var string  
     */
    public $Filter;
    /** 
     * @var array  
     */
    public $Properties;
    /** 
     * @var integer  
     */
    public $Status;
    /** 
     * @var string  
     */
    public $Title;
}