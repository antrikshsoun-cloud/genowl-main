<?php
/**
 * Genowl Studio - Hostinger Database API: Contact Desk Inquiries
 */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . '/db_config.php';

// POST: Save contact inquiry
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input.']);
        exit;
    }

    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $subject = trim($data['subject'] ?? ($data['service'] ?? ($data['category'] ?? 'General Inquiry')));
    $message = trim($data['message'] ?? ($data['description'] ?? ''));

    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name, email, and message are required.']);
        exit;
    }

    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare(
            "INSERT INTO contacts (name, email, subject, message, created_at)
             VALUES (:name, :email, :subject, :message, NOW())"
        );
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':subject' => $subject,
            ':message' => $message,
        ]);
        $contactId = $pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'contact_id' => $contactId,
            'message' => 'Inquiry received in Hostinger Database! We will respond to your email shortly.'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// GET: Retrieve inquiries
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->query("SELECT id, name, email, subject, message, created_at FROM contacts ORDER BY id DESC LIMIT 50");
        $results = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $results]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}
