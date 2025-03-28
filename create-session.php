<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// For demo purposes, we'll simulate a successful response
// In production, this would integrate with actual Stripe API
try {
    // Verify request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    // Get POST data
    $postData = json_decode(file_get_contents('php://input'), true);
    if (!$postData) {
        $postData = $_POST;
    }

    // Validate required fields
    if (empty($postData['appName']) || empty($postData['appType']) || empty($postData['features'])) {
        throw new Exception('Missing required fields');
    }

    // In production, this would be your actual Stripe integration
    // For demo, we'll return a mock successful response
    $response = [
        'id' => 'demo_' . time(), // Mock session ID
        'success' => true,
        'message' => 'Demo checkout session created successfully',
        'data' => [
            'appName' => $postData['appName'],
            'appType' => $postData['appType'],
            'features' => $postData['features'],
            'amount' => $postData['amount'] ?? 0
        ]
    ];

    // Send success response
    http_response_code(200);
    echo json_encode($response);

} catch (Exception $e) {
    // Send error response
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>