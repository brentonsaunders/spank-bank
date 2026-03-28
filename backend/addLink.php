<?php
require_once "include/service.php";

$url = filter_input(INPUT_POST, "url", FILTER_SANITIZE_URL);
$tags = json_decode($_POST["tags"] ?? "") ?? [];

addLink($_SESSION["bankId"] ?? null, $url, $tags);
