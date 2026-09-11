<?php
/**
 * Hostinger MySQL Database Configuration for Genowl Studio
 * Table: genowl_project_leads, bookings, contacts
 */

ini_set('display_errors', 0);
error_reporting(E_ALL);

// 1. Check for a permanent local credentials file (IMMUNE TO GIT DEPLOYS)
// Git will NEVER overwrite db_credentials.php during pulls or auto-deploys
$localCredentials = __DIR__ . '/db_credentials.php';
if (file_exists($localCredentials)) {
    require_once $localCredentials;
}

// 2. Set default fallbacks if not defined in db_credentials.php
if (!defined('DB_HOST')) define('DB_HOST', getenv('HOSTINGER_DB_HOST') ?: 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', getenv('HOSTINGER_DB_NAME') ?: 'u123456789_genowldb');
if (!defined('DB_USER')) define('DB_USER', getenv('HOSTINGER_DB_USER') ?: 'u123456789_genowluser');
if (!defined('DB_PASS')) define('DB_PASS', getenv('HOSTINGER_DB_PASS') ?: 'YOUR_DATABASE_PASSWORD');

function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Database connection failed. Please verify credentials in api/db_credentials.php or api/db_config.php'
            ]);
            exit;
        }
    }
    return $pdo;
}
