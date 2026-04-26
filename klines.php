<?php

// ============================
// HEADER (CORS + JSON)
// ============================
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// ============================
// INPUT PARAM
// ============================
$symbol   = isset($_GET['symbol']) ? strtoupper($_GET['symbol']) : '';
$interval = isset($_GET['interval']) ? $_GET['interval'] : '5m';
$limit    = isset($_GET['limit']) ? intval($_GET['limit']) : 100;

// ============================
// VALIDASI (PENTING BIAR AMAN)
// ============================

// whitelist interval Binance
$allowed_intervals = [
  "1m","3m","5m","15m","30m",
  "1h","2h","4h","6h","8h","12h",
  "1d","3d","1w","1M"
];

if(!$symbol || !preg_match('/^[A-Z0-9]{5,15}$/', $symbol)){
    echo json_encode(["error"=>"Invalid symbol"]);
    exit;
}

if(!in_array($interval, $allowed_intervals)){
    echo json_encode(["error"=>"Invalid interval"]);
    exit;
}

if($limit <= 0 || $limit > 1000){
    $limit = 100;
}

// ============================
// URL BINANCE
// ============================
$url = "https://api.binance.com/api/v3/klines?symbol=$symbol&interval=$interval&limit=$limit";

// ============================
// CACHE (OPTIONAL, DISARANKAN)
// ============================
$cacheFile = "cache_{$symbol}_{$interval}.json";
$cacheTime = 10; // detik (buat trading real-time jangan lama2)

if(file_exists($cacheFile)){
    if(time() - filemtime($cacheFile) < $cacheTime){
        echo file_get_contents($cacheFile);
        exit;
    }
}

// ============================
// CURL
// ============================
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

// biar tidak gampang diblock
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "User-Agent: Mozilla/5.0",
  "Accept: application/json"
]);

$response = curl_exec($ch);

// ============================
// ERROR HANDLING
// ============================
if(curl_errno($ch)){
    echo json_encode(["error"=>curl_error($ch)]);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if($httpCode !== 200){
    echo json_encode(["error"=>"HTTP ".$httpCode]);
    exit;
}

// ============================
// SIMPAN CACHE
// ============================
file_put_contents($cacheFile, $response);

// ============================
// OUTPUT
// ============================
echo $response;