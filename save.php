<?php
/**
 * save.php — writes the updated proposal JSON back to data/<filename>
 * Called via POST from app.js when the user clicks "Save changes".
 */

/* CORS Headers */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

/* Handle CORS preflight OPTIONS request */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['ok' => true]);
    exit;
}

/* Whitelist permitted json files */
$allowed = [
    'proposal.json',
    'real-estate.json',
    'restaurant.json',
    'plumbing.json',
    'healthcare.json',
    'ecommerce.json',
    'school-management.json',
    'church-ministry.json',
    'hotel-hospitality.json'
];

$file = $_GET['file'] ?? 'proposal.json';
if (!in_array($file, $allowed, true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid file specified']);
    exit;
}

/* If accessed via GET, return the JSON file or a status health check (prevents 405 on browser GET) */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $filePath = __DIR__ . '/data/' . $file;
    if (file_exists($filePath)) {
        echo file_get_contents($filePath);
    } else {
        echo json_encode(['ok' => true, 'status' => 'save.php ready for POST saves', 'file' => $file]);
    }
    exit;
}

/* Only accept POST or PUT for writing */
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed. Use POST to save.']);
    exit;
}

/* Read and validate the incoming JSON */
$raw = file_get_contents('php://input');
if (empty($raw) && !empty($_POST)) {
    $raw = $_POST['data'] ?? json_encode($_POST);
}

$decoded = json_decode($raw);

if ($decoded === null) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON: ' . json_last_error_msg()]);
    exit;
}

/* Write back to the target data file */
$filePath = __DIR__ . '/data/' . $file;
$bytes    = file_put_contents(
    $filePath,
    json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
);

if ($bytes === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => "Could not write to data/{$file} — check file permissions"]);
    exit;
}

echo json_encode(['ok' => true, 'file' => $file, 'bytes' => $bytes]);
