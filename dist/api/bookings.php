<?php
/**
 * Genowl Studio - Hostinger Database API: Bookings
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

// POST: Save new booking
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
    $service_type = trim($data['service_type'] ?? ($data['service'] ?? 'General Consultation'));
    $budget = trim($data['budget'] ?? ($data['amount'] ?? ''));
    $project_scope = trim($data['project_scope'] ?? ($data['details'] ?? ($data['notes'] ?? '')));

    if (empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name and email are required.']);
        exit;
    }

    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare(
            "INSERT INTO bookings (name, email, service_type, budget, project_scope, status, created_at)
             VALUES (:name, :email, :service_type, :budget, :project_scope, 'pending', NOW())"
        );
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':service_type' => $service_type,
            ':budget' => $budget,
            ':project_scope' => $project_scope,
        ]);
        $bookingId = $pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'booking_id' => $bookingId,
            'message' => 'Booking successfully recorded in Hostinger Database! Studio team will connect within 30 minutes.'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// GET: Retrieve bookings
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->query("SELECT id, name, email, service_type, budget, project_scope, status, created_at FROM bookings ORDER BY id DESC LIMIT 50");
        $results = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $results]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}
