<?php
require_once "include/service.php";

header("Content-Type: application/json");

$bankId = filter_input(INPUT_POST, "bankId", FILTER_SANITIZE_STRING);

$bank = loadBank($bankId);

if ($bank) {
    $_SESSION["bankId"] = $bankId;
    
    echo json_encode([
        "id" => $bank["id"],
        "total_nuts" => $bank["total_nuts"],
        "last_nut_time" => $bank["last_nut_time"],
        "link_count" => $bank["link_count"],
        "tags" => $bank["tags"],
    ]);
} else {
    echo json_encode(null);
}
