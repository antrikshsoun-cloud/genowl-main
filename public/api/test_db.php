<?php
/**
 * Genowl Studio - Live Database Connection Diagnostic Tool
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/db_config.php';

try {
    $pdo = getDbConnection();
    
    // Check if genowl_project_leads table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'genowl_project_leads'");
    $tableExists = $stmt->rowCount() > 0;
    
    // Count total leads
    $count = 0;
    if ($tableExists) {
        $count = $pdo->query("SELECT COUNT(*) FROM genowl_project_leads")->fetchColumn();
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Hostinger MySQL Database connected successfully!',
        'table_genowl_project_leads_exists' => $tableExists,
        'total_leads_recorded' => (int)$count,
        'php_version' => PHP_VERSION,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
}
