<?php
/**
 * Genowl Studio - Outbound Domain Email Dispatcher
 * Sends authenticated transactional emails directly from support@genowl.tech
 */

// Enable CORS for genowl.tech
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Ensure POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only POST requests are allowed.']);
    exit;
}

// Read raw JSON body
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input.']);
    exit;
}

$to = isset($data['to']) ? trim($data['to']) : '';
$subject = isset($data['subject']) ? trim($data['subject']) : 'Genowl Studio Notification';
$html = isset($data['html']) ? $data['html'] : '';
$text = isset($data['text']) ? $data['text'] : strip_tags($html);

// Validate recipient email
if (empty($to) || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'A valid recipient email address is required.']);
    exit;
}

// Sender Configuration (Authenticated Hostinger Domain)
$fromName = 'Genowl Studio';
$fromEmail = 'support@genowl.tech';
$replyTo = 'support@genowl.tech';

// Construct professional MIME boundary for multi-part email (HTML + Plaintext fallback)
$boundary = "==_MIME_BOUNDARY_" . md5(time()) . "_==";

$headers = [];
$headers[] = "From: {$fromName} <{$fromEmail}>";
$headers[] = "Reply-To: {$replyTo}";
$headers[] = "Return-Path: {$fromEmail}";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";
$headers[] = "X-Mailer: Genowl-MailEngine/2.0 (Hostinger-Authenticated)";
$headers[] = "X-Priority: 1 (Highest)";
$headers[] = "Importance: High";

// Multipart Body
$body = "--{$boundary}\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= $text . "\r\n\r\n";

$body .= "--{$boundary}\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= $html . "\r\n\r\n";

$body .= "--{$boundary}--";

// Additional sendmail parameter to set envelope sender (-f)
$additionalParams = "-f {$fromEmail}";

// Dispatch email via Hostinger server mail engine
$mailSent = @mail($to, $subject, $body, implode("\r\n", $headers), $additionalParams);

if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Email successfully dispatched from support@genowl.tech',
        'sender' => $fromEmail,
        'recipient' => $to,
        'timestamp' => date('c')
    ]);
} else {
    // If envelope sender parameter fails in some PHP environments, retry standard mail()
    $headersPlain = implode("\r\n", $headers);
    $retrySent = @mail($to, $subject, $body, $headersPlain);

    if ($retrySent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Email dispatched via Hostinger standard relay.',
            'sender' => $fromEmail,
            'recipient' => $to,
            'timestamp' => date('c')
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Hostinger mail server rejected dispatch. Google Apps Script fallback will be triggered.',
            'sender' => $fromEmail
        ]);
    }
}
