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

// Parse email from transcript if not provided
$customerEmail = '';
if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $transcript, $matches)) {
    $customerEmail = strtolower($matches[0]);
}

// Parse spoken email format (e.g., "john at gmail dot com")
if (empty($customerEmail) && preg_match('/([a-zA-Z0-9._%+-]+)\s*(?:at|@)\s*([a-zA-Z0-9.-]+)\s*(?:dot|\.)\s*([a-zA-Z]{2,})/i', $transcript, $spokenMatches)) {
    $user = str_replace(' ', '', preg_replace('/\s*dot\s*/i', '.', $spokenMatches[1]));
    $domain = str_replace(' ', '', $spokenMatches[2]);
    $tld = str_replace(' ', '', $spokenMatches[3]);
    $customerEmail = strtolower("{$user}@{$domain}.{$tld}");
}

// Fallback email and names
$receipt_id = 'GENOWL-VAPI-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));
if (empty($customerEmail)) {
    $customerEmail = 'voice_caller_' . strtolower(substr($receipt_id, -6)) . '@client.genowl.tech';
}
if (empty($customerName)) {
    $customerName = !empty($customerEmail) && strpos($customerEmail, '@client.genowl.tech') === false
        ? ucfirst(explode('@', $customerEmail)[0])
        : 'Voice Hotline Caller';
}
if (empty($customerNumber)) {
    $customerNumber = 'Captured via Vapi Voice';
}

// Service detection from transcript
$serviceType = '2D High-Converting Web ($500)';
$lower = strtolower($transcript . ' ' . $summary);
if (strpos($lower, '3d') !== false || strpos($lower, 'webgl') !== false) {
    $serviceType = '3D WebGL Experience ($2,500)';
} elseif (strpos($lower, 'video') !== false || strpos($lower, 'commercial') !== false || strpos($lower, 'ad') !== false) {
    $serviceType = 'AI Video Commercial ($99)';
} elseif (strpos($lower, 'agent') !== false || strpos($lower, 'yzer') !== false) {
    $serviceType = 'Autonomous AI Agent ($200)';
}

// Meeting slot detection
$meetingSlot = 'Consultation Call Requested';
if (preg_match('/(?:meeting|slot|call|schedule|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)[^.!?]{5,60}/i', $transcript, $slotMatch)) {
    $meetingSlot = trim($slotMatch[0]);
}

// Keyword extraction
$keywords = [];
$dict = ['3d', 'webgl', 'three.js', '60fps', '2d', 'saas', 'agent', 'voice', 'video', 'commercial', 'urgent', 'meeting', 'stripe', 'hostinger'];
foreach ($dict as $word) {
    if (strpos($lower, $word) !== false) {
        $keywords[] = $word;
    }
}
$extractedKeywords = implode(', ', $keywords);

$projectScope = !empty($summary) 
    ? "YZER Call Summary: {$summary}\n\nFull Transcript:\n{$transcript}" 
    : "YZER Call Transcript:\n{$transcript}";

try {
    $pdo = getDbConnection();
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
            '$99',
            :meeting_time_slot,
            'YZER AI Voice Hotline',
            :project_scope,
            :extracted_keywords,
            :voice_transcript,
            'Vapi Voice Hotline / Webhook',
            'new',
            'Unassigned',
            NOW()
        )
    ");

    $stmt->execute([
        ':receipt_id' => $receipt_id,
        ':customer_name' => $customerName,
        ':customer_email' => $customerEmail,
        ':customer_phone' => $customerNumber,
        ':service_type' => $serviceType,
        ':meeting_time_slot' => $meetingSlot,
        ':project_scope' => $projectScope,
        ':extracted_keywords' => $extractedKeywords,
        ':voice_transcript' => $transcript,
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Vapi call lead successfully recorded in Hostinger Database',
        'receipt_id' => $receipt_id,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
