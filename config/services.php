<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'sharepoint' => [
        'username' => env('SHARE_POINT_USERNAME'),
        'password' => env('SHARE_POINT_PASSWORD'),
        'appid' => env('SHARE_POINT_APP_ID'),
        'siteurl' => env('SHARE_POINT_SITE_URL'),
        'appsec' => env('SHARE_POINT_APP_SEC'),
        'reurl' => env('SHARE_POINT_RE_URL'),
    ]

];
