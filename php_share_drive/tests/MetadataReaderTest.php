<?php

use Office365\PHP\Client\Runtime\OData\MetadataResolver;
use Office365\PHP\Client\Runtime\OData\ODataV3Reader;

class MetadataReaderTest extends SharePointTestCase
{
    public function testLoadMetadata()
    {
        $edmxContents = MetadataResolver::getMetadata(self::$context);
        $this->assertNotNull($edmxContents);
        return $edmxContents;
    }


    /**
     * @depends testLoadMetadata
     * @param string $edmxContent
     * @throws ReflectionException
     */
    public function  testParseMetadata($edmxContent){
        $outputPath = dirname((new \ReflectionClass(self::$context))->getFileName());
        $rootNamespace = ((new \ReflectionClass(self::$context))->getNamespaceName());
        self::$context->requestFormDigest();
        self::$context->executeQuery();

        $generatorOptions = array(
            'outputPath' => $outputPath,
            'rootNamespace' => $rootNamespace,
            'ignoredTypes' => array(),
            'ignoredProperties' => array()
        );
        $reader = new ODataV3Reader($edmxContent,$generatorOptions);
        $model = $reader->generateModel();
        $this->assertNotNull($model);
        $this->assertNotEquals(0,count($model->getTypes()));
    }
}
