<?php
require_once "include/service.php";

header("Content-Type: application/json");

$bank = loadBank($_SESSION["bankId"] ?? null);

if ($bank) {
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
