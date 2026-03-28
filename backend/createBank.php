<?php
require_once "include/service.php";

if (array_key_exists("bankId", $_SESSION) && !$_SESSION["bankId"]) {
    $bankId = createBank();

    $_SESSION["bankId"] = $bankId;
}
