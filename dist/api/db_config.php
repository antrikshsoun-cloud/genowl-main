<?php
/**
 * Hostinger MySQL Database Configuration for Genowl Studio
 */

// Database Credentials
// Replace with your Hostinger database details:
define('DB_HOST', 'localhost');
define('DB_NAME', getenv('HOSTINGER_DB_NAME') ?: 'u123456789_genowldb');
define('DB_USER', getenv('HOSTINGER_DB_USER') ?: 'u123456789_genowluser');
define('DB_PASS', getenv('HOSTINGER_DB_PASS') ?: 'YOUR_DATABASE_PASSWORD');

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
                'error' => 'Database connection failed. Please update database credentials in public/api/db_config.php'
            ]);
            exit;
        }
    }
    return $pdo;
}
