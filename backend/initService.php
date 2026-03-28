<?php
require_once "include/service.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $_SESSION["bankId"] ??= null;
}
