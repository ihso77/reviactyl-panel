<?php
// Reviactyl Panel - Built-in PHP Server
// This script serves the Laravel application

$host = '0.0.0.0';
$port = 8080;

// Check if PHP's built-in server is available
if (php_sapi_name() !== 'cli') {
    echo "This script must be run from CLI\n";
    exit(1);
}

echo "Starting Reviactyl Panel server on http://{$host}:{$port}\n";

// Use PHP's built-in server with Laravel's public directory
passthru(PHP_BINARY . " -S {$host}:{$port} -t public public/index.php");
