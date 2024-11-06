<?php

require 'vendor/autoload.php';
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: GET");

// CONFIG: Change these variables to a valid region and bucket.
$awsEndpoint = getenv('COMPANION_AWS_ENDPOINT') ?: null;
$awsRegion = getenv('COMPANION_AWS_REGION') ?: 'eu-west-2';
$bucket = getenv('COMPANION_AWS_BUCKET') ?: 'ImageToolLearn-test';
// Directory to place uploaded files in.
$directory = 'ImageToolLearn-php-example';

// Create the S3 client.
$s3 = new Aws\S3\S3Client([
  'version' => 'latest',
  'endpoint' => $awsEndpoint,
  'region' => $awsRegion,
]);

// Retrieve data about the file to be uploaded from the request body.
$body = json_decode(file_get_contents('php://input'));
$filename = $body->filename;
$contentType = $body->contentType;

// Create a PutObject command.
$command = $s3->getCommand('putObject', [
  'Bucket' => $bucket,
  'Key' => "{$directory}/{$filename}",
  'ContentType' => $contentType,
  'Body' => '',
]);

$request = $s3->createPresignedRequest($command, '+5 minutes');

header('content-type: application/json');
echo json_encode([
  'method' => $request->getMethod(),
  'url' => (string) $request->getUri(),
  'fields' => [],
  // Also set the content-type header on the request, to make sure that it is the same as the one we used to generate the signature.
  // Else, the browser picks a content-type as it sees fit.
  'headers' => [
    'content-type' => $contentType,
  ],
]);
