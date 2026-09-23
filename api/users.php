<?php
/**
 * Genowl Studio - Hostinger Database API: User Registrations & Login Tracking
 * Tables: genowl_users, genowl_login_logs
 * Founding Team: Antriksh, Bilal, Maulik, Jaywardhan, and Ritesh
 */

ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . '/db_config.php';

// POST: Record user login / signup (Google OAuth or Email)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input.']);
        exit;
    }

    $email = trim(strtolower($data['email'] ?? ''));
    $name = trim($data['name'] ?? 'Genowl Member');
    $id = trim($data['id'] ?? ('usr_' . substr(md5($email), 0, 16)));
    $avatar = trim($data['avatar'] ?? '');
    $provider = trim(strtolower($data['provider'] ?? 'email'));
    $action = trim(strtolower($data['action'] ?? 'login'));

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'A valid email address is required.'
        ]);
        exit;
    }

    try {
        $pdo = getDbConnection();

        // 1. Ensure genowl_users master table exists
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS genowl_users (
                id VARCHAR(64) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                avatar TEXT NULL,
                provider VARCHAR(32) DEFAULT 'email',
                verified TINYINT(1) DEFAULT 1,
                login_count INT DEFAULT 1,
                last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        // 2. Ensure genowl_login_logs table exists
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS genowl_login_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(64) NULL,
                email VARCHAR(255) NOT NULL,
                name VARCHAR(255) NULL,
                provider VARCHAR(32) DEFAULT 'email',
                action VARCHAR(32) DEFAULT 'login',
                ip_address VARCHAR(45) NULL,
                user_agent TEXT NULL,
                login_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        // 3. Upsert user into genowl_users
        $stmtUser = $pdo->prepare("
            INSERT INTO genowl_users (id, name, email, avatar, provider, verified, login_count, last_login_at, created_at)
            VALUES (:id, :name, :email, :avatar, :provider, 1, 1, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                avatar = CASE WHEN VALUES(avatar) != '' THEN VALUES(avatar) ELSE avatar END,
                provider = VALUES(provider),
                verified = 1,
                login_count = login_count + 1,
                last_login_at = NOW();
        ");

        $stmtUser->execute([
            ':id' => $id,
            ':name' => $name,
            ':email' => $email,
            ':avatar' => $avatar,
            ':provider' => $provider,
        ]);

        // 4. Record entry in genowl_login_logs
        $clientIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ($_SERVER['REMOTE_ADDR'] ?? 'Unknown'));
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

        $stmtLog = $pdo->prepare("
            INSERT INTO genowl_login_logs (user_id, email, name, provider, action, ip_address, user_agent, login_at)
            VALUES (:user_id, :email, :name, :provider, :action, :ip_address, :user_agent, NOW())
        ");

        $stmtLog->execute([
            ':user_id' => $id,
            ':email' => $email,
            ':name' => $name,
            ':provider' => $provider,
            ':action' => $action,
            ':ip_address' => substr($clientIp, 0, 45),
            ':user_agent' => substr($userAgent, 0, 500),
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'User authentication successfully recorded in Hostinger Database!',
            'user' => [
                'id' => $id,
                'name' => $name,
                'email' => $email,
                'avatar' => $avatar,
                'provider' => $provider,
                'last_login_at' => date('Y-m-d H:i:s'),
            ]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error recording login: ' . $e->getMessage()
        ]);
    }
    exit;
}

// GET: Fetch recent registered users & login metrics
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $pdo = getDbConnection();

        // Check if table exists
        $check = $pdo->query("SHOW TABLES LIKE 'genowl_users'");
        if ($check->rowCount() === 0) {
            echo json_encode(['success' => true, 'total_users' => 0, 'users' => []]);
            exit;
        }

        $stmt = $pdo->query("
            SELECT id, name, email, avatar, provider, verified, login_count, last_login_at, created_at
            FROM genowl_users
            ORDER BY last_login_at DESC
            LIMIT 50
        ");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $totalUsers = $pdo->query("SELECT COUNT(*) FROM genowl_users")->fetchColumn();
        $googleUsers = $pdo->query("SELECT COUNT(*) FROM genowl_users WHERE provider = 'google'")->fetchColumn();
        $emailUsers = $pdo->query("SELECT COUNT(*) FROM genowl_users WHERE provider = 'email'")->fetchColumn();

        echo json_encode([
            'success' => true,
            'total_users' => (int)$totalUsers,
            'google_users' => (int)$googleUsers,
            'email_users' => (int)$emailUsers,
            'users' => $users,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}
