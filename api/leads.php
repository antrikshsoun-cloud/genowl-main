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

    // Reject dummy or missing email - ONLY genuine bookings with verified customer email are recorded!
    if (empty($customer_email) || !filter_var($customer_email, FILTER_VALIDATE_EMAIL) || strpos($customer_email, '@client.genowl.tech') !== false || strpos($customer_email, 'voice_caller') !== false) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'A verified customer email address is required to record a service booking.'
        ]);
        exit;
    }

    // 2. Service & Customizations
    $service_type = trim($data['service_type'] ?? ($data['service'] ?? '2D Website'));
    $customizations = trim($data['customizations'] ?? ($data['extra_details'] ?? ($data['details'] ?? ($data['project_scope'] ?? ''))));
    $service_style = trim($data['service_style'] ?? ($data['style'] ?? ''));
    $turnaround_speed = trim($data['turnaround_speed'] ?? ($data['speed'] ?? 'standard'));
    if (!in_array($turnaround_speed, ['standard', 'priority', 'urgent'])) {
        $turnaround_speed = 'standard';
    }

    // 3. Commercials
    $quoted_price = trim($data['quoted_price'] ?? ($data['price'] ?? '$500'));
    $payment_status = trim($data['payment_status'] ?? 'pending');
    if (!in_array($payment_status, ['pending', 'deposit_paid', 'fully_paid', 'refunded'])) {
        $payment_status = 'pending';
    }

    // 4. Meeting & Booked Slot
    $meeting_date = !empty($data['meeting_date']) ? trim($data['meeting_date']) : null;
    $meeting_time_slot = trim($data['booked_slot'] ?? ($data['meeting_time_slot'] ?? ($data['preferred_time'] ?? 'Kickoff Consultation')));
    $meeting_platform = trim($data['meeting_platform'] ?? 'Google Meet / Studio Desk');

    // 5. Project Scope (Mirrors Customizations)
    $project_scope = !empty($customizations) ? $customizations : trim($data['project_scope'] ?? 'Client requested custom build.');
    $reference_url = trim($data['reference_url'] ?? '');

    // 6. Voice & Source
    $voice_transcript = trim($data['voice_transcript'] ?? ($data['transcript'] ?? ''));
    $extracted_keywords = is_array($data['extracted_keywords'] ?? null) 
        ? implode(', ', $data['extracted_keywords']) 
        : trim($data['extracted_keywords'] ?? '');
    $lead_source = trim($data['lead_source'] ?? 'AI Voice Agent Service Booking');

    // 7. Workflow
    $status = trim($data['status'] ?? 'meeting_scheduled');
    $assigned_founder = trim($data['assigned_founder'] ?? 'Unassigned');
    $founder_notes = trim($data['founder_notes'] ?? '');

    if (empty($customer_name)) {
        $customer_name = ucfirst(explode('@', $customer_email)[0]);
    }
    if (empty($customer_phone)) {
        $customer_phone = 'Captured via AI Voice Booking';
    }

    try {
        $pdo = getDbConnection();

        // Auto-migration: ensure customizations column exists in Hostinger MySQL
        try {
            $pdo->exec("ALTER TABLE genowl_project_leads ADD COLUMN IF NOT EXISTS customizations TEXT NULL");
        } catch (Exception $colEx) {
            // Ignore if column already exists or MySQL version doesn't support IF NOT EXISTS
        }

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
                customizations,
                project_scope,
                extracted_keywords,
                voice_transcript,
                lead_source,
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
                :customizations,
                :project_scope,
                :extracted_keywords,
                :voice_transcript,
                :lead_source,
                :status,
                :assigned_founder,
                :founder_notes,
                NOW()
            )
            ON DUPLICATE KEY UPDATE
                customer_name = VALUES(customer_name),
                customer_phone = VALUES(customer_phone),
                service_type = VALUES(service_type),
                customizations = VALUES(customizations),
                meeting_time_slot = VALUES(meeting_time_slot),
                project_scope = VALUES(project_scope)
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
            ':customizations' => $customizations,
            ':project_scope' => $project_scope,
            ':extracted_keywords' => $extracted_keywords,
            ':voice_transcript' => $voice_transcript,
            ':lead_source' => $lead_source,
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
                customizations,
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
