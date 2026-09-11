<?php
/**
 * Genowl Studio - Vapi Server Webhook Receiver
 * Table: genowl_project_leads
 * Automatically records phone and WebRTC call transcripts, summaries, and customer info
 */

ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only POST method is accepted']);
    exit;
}

require_once __DIR__ . '/db_config.php';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit;
}

// Log incoming payload for debugging
$logFile = __DIR__ . '/vapi_webhook.log';
@file_put_contents($logFile, date('[Y-m-d H:i:s] ') . $rawInput . PHP_EOL, FILE_APPEND);

// Extract message object
$message = $data['message'] ?? $data;
$messageType = $message['type'] ?? 'unknown';

// We process end-of-call-report, summary, or any transcript event
$transcript = $message['transcript'] ?? '';
$summary = $message['summary'] ?? ($message['analysis']['summary'] ?? '');
$customerNumber = $message['call']['customer']['number'] ?? ($data['call']['customer']['number'] ?? '');
$customerName = $message['call']['customer']['name'] ?? '';

// If no transcript or summary, acknowledge receipt
if (empty($transcript) && empty($summary)) {
    echo json_encode(['success' => true, 'message' => 'Event acknowledged: ' . $messageType]);
    exit;
}

// Extract tool/function call parameters if present
$toolArgs = null;
if (isset($message['toolCalls'][0]['function']['arguments'])) {
    $toolArgs = is_array($message['toolCalls'][0]['function']['arguments']) 
        ? $message['toolCalls'][0]['function']['arguments']
        : json_decode($message['toolCalls'][0]['function']['arguments'], true);
} elseif (isset($message['functionCall']['parameters'])) {
    $toolArgs = is_array($message['functionCall']['parameters'])
        ? $message['functionCall']['parameters']
        : json_decode($message['functionCall']['parameters'], true);
}

// 1. Identify Service Type
$serviceType = '';
if (!empty($toolArgs['service_type'])) {
    $serviceType = trim($toolArgs['service_type']);
} else {
    $lower = strtolower($transcript . ' ' . $summary);
    if (strpos($lower, '3d') !== false || strpos($lower, 'webgl') !== false) {
        $serviceType = '3D WebGL Experience ($1,000)';
    } elseif (strpos($lower, 'video') !== false || strpos($lower, 'commercial') !== false || strpos($lower, 'ad') !== false) {
        $serviceType = 'AI Video Commercial ($100)';
    } elseif (strpos($lower, 'agent') !== false || strpos($lower, 'yzer') !== false) {
        $serviceType = 'Autonomous AI Agent ($200)';
    } elseif (strpos($lower, '2d') !== false || strpos($lower, 'website') !== false || strpos($lower, 'web') !== false) {
        $serviceType = '2D High-Converting Web ($500)';
    }
}

// 2. Extract Customer Email (direct, function call, or spelled letter-by-letter)
$customerEmail = '';
if (!empty($toolArgs['customer_email']) && filter_var($toolArgs['customer_email'], FILTER_VALIDATE_EMAIL)) {
    $customerEmail = strtolower(trim($toolArgs['customer_email']));
}

if (empty($customerEmail) && preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $transcript, $matches)) {
    $customerEmail = strtolower($matches[0]);
}

// Check spelled phonetic email format (e.g. "a n t r i k s h at g m a i l dot com" or "john at gmail dot com")
if (empty($customerEmail)) {
    $cleanText = strtolower($transcript);
    // Convert digit words to numbers
    $numMap = ['zero'=>'0','one'=>'1','two'=>'2','three'=>'3','four'=>'4','five'=>'5','six'=>'6','seven'=>'7','eight'=>'8','nine'=>'9'];
    foreach ($numMap as $w => $n) {
        $cleanText = preg_replace("/\b{$w}\b/", $n, $cleanText);
    }
    $cleanText = preg_replace('/\s*(?:at the rate|at sign|\bat\b|@)\s*/i', '@', $cleanText);
    $cleanText = preg_replace('/\s*(?:dot|period|\.)\s*/i', '.', $cleanText);
    $cleanText = preg_replace('/\s*(?:underscore)\s*/i', '_', $cleanText);
    $cleanText = preg_replace('/\s*(?:dash|hyphen|minus)\s*/i', '-', $cleanText);

    if (preg_match('/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})/i', $cleanText, $spokenMatch)) {
        $u = str_replace(' ', '', $spokenMatch[1]);
        $d = str_replace(' ', '', $spokenMatch[2]);
        $t = str_replace(' ', '', $spokenMatch[3]);
        $candidate = strtolower("{$u}@{$d}.{$t}");
        if (filter_var($candidate, FILTER_VALIDATE_EMAIL)) {
            $customerEmail = $candidate;
        }
    }
}

// STRICT GATE: If the customer did not ask to book or did not provide a real email, DO NOT record!
$hasBookingIntent = !empty($toolArgs['booked_slot']) || 
    !empty($toolArgs['service_type']) || 
    preg_match('/\b(book|booking|order|hire|reserve|slot|schedule|kickoff)\b/i', $transcript . ' ' . $summary);

if (!$hasBookingIntent || empty($customerEmail) || strpos($customerEmail, '@client.genowl.tech') !== false || strpos($customerEmail, 'voice_caller') !== false) {
    echo json_encode([
        'success' => true,
        'message' => 'Phone call acknowledged. No service booking recorded (inquiry only or no verified email).'
    ]);
    exit;
}

// 3. Extract Extra Details / Customizations
$customizations = !empty($toolArgs['customizations']) 
    ? trim($toolArgs['customizations']) 
    : '';

if (empty($customizations)) {
    // Extract customizations from summary or transcript
    if (!empty($summary)) {
        $customizations = $summary;
    } else {
        $customizations = 'Phone consultation booking via +1 (628) 245-9578';
    }
}

// 4. Extract Booked Slot
$bookedSlot = !empty($toolArgs['booked_slot']) 
    ? trim($toolArgs['booked_slot']) 
    : '';

if (empty($bookedSlot)) {
    if (preg_match('/(?:meeting|slot|call|schedule|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)[^.!?]{5,60}/i', $transcript, $slotMatch)) {
        $bookedSlot = trim($slotMatch[0]);
    } else {
        $bookedSlot = 'Phone Kickoff Consultation';
    }
}

$receipt_id = 'GENOWL-PHONE-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));
$customerName = ucfirst(explode('@', $customerEmail)[0]);

try {
    $pdo = getDbConnection();

    // Ensure customizations column exists
    try {
        $pdo->exec("ALTER TABLE genowl_project_leads ADD COLUMN IF NOT EXISTS customizations TEXT NULL");
    } catch (Exception $e) {}

    $stmt = $pdo->prepare("
        INSERT INTO genowl_project_leads (
            receipt_id,
            customer_name,
            customer_email,
            customer_phone,
            service_type,
            turnaround_speed,
            quoted_price,
            meeting_time_slot,
            meeting_platform,
            customizations,
            project_scope,
            extracted_keywords,
            voice_transcript,
            lead_source,
            status,
            assigned_founder,
            created_at
        ) VALUES (
            :receipt_id,
            :customer_name,
            :customer_email,
            :customer_phone,
            :service_type,
            'standard',
            '$500',
            :meeting_time_slot,
            'Official Phone Line (+1 628 245-9578)',
            :customizations,
            :project_scope,
            :extracted_keywords,
            :voice_transcript,
            'Phone Hotline Call (+1 628 245-9578)',
            'meeting_scheduled',
            'Unassigned',
            NOW()
        )
    ");

    $stmt->execute([
        ':receipt_id' => $receipt_id,
        ':customer_name' => $customerName,
        ':customer_email' => $customerEmail,
        ':customer_phone' => !empty($customerNumber) ? $customerNumber : '+1 (628) 245-9578 (Phone Caller)',
        ':service_type' => !empty($serviceType) ? $serviceType : '2D High-Converting Web ($500)',
        ':meeting_time_slot' => $bookedSlot,
        ':customizations' => $customizations,
        ':project_scope' => $customizations,
        ':extracted_keywords' => 'phone call, official hotline, booking, verified email',
        ':voice_transcript' => $transcript,
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Phone booking successfully recorded in Hostinger Database!',
        'receipt_id' => $receipt_id,
        'booking' => [
            'service_type' => $serviceType,
            'customizations' => $customizations,
            'booked_slot' => $bookedSlot,
            'customer_email' => $customerEmail,
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}

