<?php

/**
 * Updated By PHP Office365 Generator 2019-10-12T15:24:30+00:00 16.0.19402.12016
 */
namespace Office365\PHP\Client\SharePoint;

use Office365\PHP\Client\Runtime\ClientValueObject;
/**
 * Information 
 * about a currency necessary for currency identification and display in the UI.
 */
class CurrencyInformation extends ClientValueObject
{
    /** 
     * The 
     * Display String (ex: $123,456.00 (United States)) for a specific currency which 
     * contains a sample formatted value (the currency and the number formatting from 
     * the web's locale) and the name of the country/region for the currency.
     * @var string
     */
    public $DisplayString;
    /** 
     * The LCID 
     * (locale identifier) for a specific currency.
     * @var string
     */
    public $LCID;
}