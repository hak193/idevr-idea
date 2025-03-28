<?php
require_once('vendor/autoload.php');

// Set your secret key. In production, this should be set in a secure configuration file
// or via environment variables in cPanel
\Stripe\Stripe::setApiKey('sk_live_your_secret_key_here');

// Get POST data
$appName = $_POST['appName'] ?? '';
$appType = $_POST['appType'] ?? '';
$features = json_decode($_POST['features'] ?? '[]', true);
$amount = intval($_POST['amount'] ?? 0);

try {
    // Create a new Stripe Checkout Session
    $session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'usd',
                'unit_amount' => $amount * 100, // Convert to cents
                'product_data' => [
                    'name' => "Custom $appType App Development",
                    'description' => "Development of $appName with " . count($features) . " features",
                ],
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => 'https://your-domain.com/success.html?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => 'https://your-domain.com/builder.html',
        'metadata' => [
            'app_name' => $appName,
            'app_type' => $appType,
            'features' => json_encode($features)
        ]
    ]);

    // Return the session ID
    header('Content-Type: application/json');
    echo json_encode(['id' => $session->id]);

} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>