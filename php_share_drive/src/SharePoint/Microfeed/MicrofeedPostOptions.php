<?php

/**
 * Updated By PHP Office365 Generator 2019-10-12T19:39:07+00:00 16.0.19402.12016
 */
namespace Office365\PHP\Client\SharePoint\Microfeed;

use Office365\PHP\Client\Runtime\ClientValueObject;

class MicrofeedPostOptions extends ClientValueObject
{
    /**
     * @var string
     */
    public $Content;
    /**
     * @var integer
     */
    public $ContentFormattingOption;
    
    public $DataLinks;
    /**
     * @var string
     */
    public $DefinitionName;
    
    public $MediaLink;
    /**
     * @var array
     */
    public $PeopleList;
    /**
     * @var string
     */
    public $PostSource;
    /**
     * @var string
     */
    public $PostSourceUri;
    /**
     * @var string
     */
    public $RefThread_ReferenceID;
    /**
     * @var string
     */
    public $RefThread_RefReply;
    /**
     * @var string
     */
    public $RefThread_RefRoot;
    /**
     * @var string
     */
    public $TargetActor;
    /**
     * @var bool
     */
    public $UpdateStatusText;
}