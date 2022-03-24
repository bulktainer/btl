<?php

/**
 * Updated By PHP Office365 Generator 2019-10-12T20:07:53+00:00 16.0.19402.12016
 */
namespace Office365\PHP\Client\SharePoint\UI\ApplicationPages;

use Office365\PHP\Client\Runtime\ClientValueObject;

class PickerEntityInformationRequest extends ClientValueObject
{
    /**
     * @var string
     */
    public $EmailAddress;
    /**
     * @var integer
     */
    public $GroupId;
    /**
     * @var string
     */
    public $Key;
    /**
     * @var integer
     */
    public $PrincipalType;
}