<?php
/**
 * Genowl Studio - Hostinger Database API: Project Leads & Intelligent Bookings
 * Table: genowl_project_leads
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

// POST: Record new comprehensive project lead with all minor details
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input.']);
        exit;
    }

    // 1. Identifiers & Contact
    $receipt_id = trim($data['receipt_id'] ?? ('GENOWL-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8))));
    $customer_name = trim($data['customer_name'] ?? ($data['name'] ?? ''));
    $customer_email = trim($data['customer_email'] ?? ($data['email'] ?? ''));
    $customer_phone = trim($data['customer_phone'] ?? ($data['phone'] ?? ''));

    // 2. Service & Styling
    $service_type = trim($data['service_type'] ?? ($data['service'] ?? '2D Website'));
    $service_style = trim($data['service_style'] ?? ($data['style'] ?? ''));
    $turnaround_speed = trim($data['turnaround_speed'] ?? ($data['speed'] ?? 'standard'));
    if (!in_array($turnaround_speed, ['standard', 'priority', 'urgent'])) {
        $turnaround_speed = 'standard';
    }

    // 3. Commercials
    $quoted_price = trim($data['quoted_price'] ?? ($data['price'] ?? '$99'));
    $payment_status = trim($data['payment_status'] ?? 'pending');
    if (!in_array($payment_status, ['pending', 'deposit_paid', 'fully_paid', 'refunded'])) {
        $payment_status = 'pending';
    }

    // 4. Meeting & Scheduling
    $meeting_date = !empty($data['meeting_date']) ? trim($data['meeting_date']) : null;
    $meeting_time_slot = trim($data['meeting_time_slot'] ?? ($data['preferred_time'] ?? ''));
    $meeting_platform = trim($data['meeting_platform'] ?? 'Google Meet');

    // 5. Assets & Project Brief
    $reference_url = trim($data['reference_url'] ?? '');
    $project_scope = trim($data['project_scope'] ?? ($data['details'] ?? ($data['notes'] ?? '')));

    // 6. Keywords & Voice Intelligence
    $extracted_keywords = is_array($data['extracted_keywords'] ?? null) 
        ? implode(', ', $data['extracted_keywords']) 
        : trim($data['extracted_keywords'] ?? '');
    $voice_transcript = trim($data['voice_transcript'] ?? ($data['transcript'] ?? ''));
    $lead_source = trim($data['lead_source'] ?? 'Order Modal');

    // 7. Project Metadata JSON (Flexible minor details store)
    $project_metadata = isset($data['project_metadata']) && is_array($data['project_metadata'])
        ? json_encode($data['project_metadata'], JSON_UNESCAPED_UNICODE)
        : (isset($data['project_metadata']) && is_string($data['project_metadata']) ? $data['project_metadata'] : null);

    // 8. Foundry Workflow
    $status = trim($data['status'] ?? 'new');
    if (!in_array($status, ['new', 'meeting_scheduled', 'in_progress', 'client_review', 'completed', 'cancelled'])) {
        $status = 'new';
    }
    $assigned_founder = trim($data['assigned_founder'] ?? 'Unassigned');
    if (!in_array($assigned_founder, ['Antriksh', 'Bilal', 'Maulik', 'Jaywardhan', 'Ritesh', 'Unassigned'])) {
        $assigned_founder = 'Unassigned';
    }
    $founder_notes = trim($data['founder_notes'] ?? '');

    // Validation
    if (empty($customer_name) || empty($customer_email) || empty($customer_phone)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name, email, and phone number are required.']);
        exit;
    }

    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare("
            INSERT INTO genowl_project_leads (
                receipt_id,
                customer_name,
                customer_email,
                customer_phone,
                service_type,
                service_style,
                turnaround_speed,
                quoted_price,
                payment_status,
                meeting_date,
                meeting_time_slot,
                meeting_platform,
                reference_url,
                project_scope,
                extracted_keywords,
                voice_transcript,
                lead_source,
                project_metadata,
                status,
                assigned_founder,
                founder_notes,
                created_at
            ) VALUES (
                :receipt_id,
                :customer_name,
                :customer_email,
                :customer_phone,
                :service_type,
                :service_style,
                :turnaround_speed,
                :quoted_price,
                :payment_status,
                :meeting_date,
                :meeting_time_slot,
                :meeting_platform,
                :reference_url,
                :project_scope,
                :extracted_keywords,
                :voice_transcript,
                :lead_source,
                :project_metadata,
                :status,
                :assigned_founder,
                :founder_notes,
                NOW()
            )
            ON DUPLICATE KEY UPDATE
                customer_name = VALUES(customer_name),
                customer_phone = VALUES(customer_phone),
                service_type = VALUES(service_type),
                service_style = VALUES(service_style),
                turnaround_speed = VALUES(turnaround_speed),
                quoted_price = VALUES(quoted_price),
                meeting_time_slot = VALUES(meeting_time_slot),
                reference_url = VALUES(reference_url),
                project_scope = VALUES(project_scope),
                extracted_keywords = VALUES(extracted_keywords),
                project_metadata = VALUES(project_metadata)
        ");

        $stmt->execute([
            ':receipt_id' => $receipt_id,
            ':customer_name' => $customer_name,
            ':customer_email' => $customer_email,
            ':customer_phone' => $customer_phone,
            ':service_type' => $service_type,
            ':service_style' => $service_style,
            ':turnaround_speed' => $turnaround_speed,
            ':quoted_price' => $quoted_price,
            ':payment_status' => $payment_status,
            ':meeting_date' => $meeting_date,
            ':meeting_time_slot' => $meeting_time_slot,
            ':meeting_platform' => $meeting_platform,
            ':reference_url' => $reference_url,
            ':project_scope' => $project_scope,
            ':extracted_keywords' => $extracted_keywords,
            ':voice_transcript' => $voice_transcript,
            ':lead_source' => $lead_source,
            ':project_metadata' => $project_metadata,
            ':status' => $status,
            ':assigned_founder' => $assigned_founder,
            ':founder_notes' => $founder_notes,
        ]);

        $leadId = $pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'lead_id' => $leadId,
            'receipt_id' => $receipt_id,
            'message' => 'Project lead and minor specifications successfully recorded in Hostinger Database!',
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// GET: Retrieve recent leads
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $pdo = getDbConnection();
        $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 100) : 50;
        $stmt = $pdo->prepare("
            SELECT 
                id,
                receipt_id,
                customer_name,
                customer_email,
                customer_phone,
                service_type,
                service_style,
                turnaround_speed,
                quoted_price,
                payment_status,
                meeting_date,
                meeting_time_slot,
                meeting_platform,
                reference_url,
                project_scope,
                extracted_keywords,
                voice_transcript,
                lead_source,
                project_metadata,
                status,
                assigned_founder,
                founder_notes,
                created_at
            FROM genowl_project_leads 
            ORDER BY id DESC 
            LIMIT :limit
        ");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $results = $stmt->fetchAll();

        echo json_encode(['success' => true, 'count' => count($results), 'data' => $results]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}
