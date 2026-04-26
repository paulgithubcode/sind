<?php

// ============================
// WAJIB PALING ATAS (JANGAN ADA SPASI SEBELUM INI)
// ============================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// handle preflight (kadang dibutuhkan)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ============================
// FETCH DATA
// ============================
$url = "https://indodax.com/tradingview/search_v2";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if(curl_errno($ch)){
    echo json_encode(["error"=>curl_error($ch)]);
    exit;
}

curl_close($ch);

// ============================
// OUTPUT
// ============================
echo $response;