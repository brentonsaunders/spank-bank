<?php
require_once "include/service.php";

$url = filter_input(INPUT_POST, "url", FILTER_SANITIZE_URL);

deleteLink($_SESSION["bankId"] ?? null, $url);
