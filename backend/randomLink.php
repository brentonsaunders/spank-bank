<?php
require_once "include/service.php";

header("Content-Type: application/json");

$tags = json_decode($_GET["tags"] ?? "");

$link = randomLink($_SESSION["bankId"] ?? null, $tags);

echo json_encode($link);
