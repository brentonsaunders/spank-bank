<?php
const BANK_ID_LENGTH = 12;
const BANK_ID_PREFIX_LENGTH = 6;

session_start();

function getDb() {
    static $db = null;

    if ($db) {
        return $db;
    }

    $host = "localhost";
    $username = "root";
    $password = "";
    $dbname = "spank_bank";

    try {
        $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch(PDOException $e) {
        echo "Error connecting to database: " . $e->getMessage();
    }

    return $db;
}

function bankIdPrefix($id) {
    return substr($id, 0, BANK_ID_PREFIX_LENGTH);
}

function bankExists($id) {
    $db = getDb();

    $stmt = $db->prepare("SELECT * FROM banks WHERE id=:id");

    $stmt->execute([":id" => bankIdPrefix($id)]);

    return !!$stmt->fetch(PDO::FETCH_ASSOC);
}

function generateBankId() {
    do {
        $id = randalnumstr(BANK_ID_LENGTH);
    } while (bankExists($id));

    return $id;
}

function loadBank($id) {
    if (!$id) {
        return null;
    }
    
    $db = getDb();

    $stmt = $db->prepare("SELECT *, AES_DECRYPT(links, :id) AS links
                          FROM banks
                          WHERE id=:id_prefix");

    $stmt->execute([
        ":id" => $id,
        ":id_prefix" => bankIdPrefix($id),
    ]);

    $bank = $stmt->fetch(PDO::FETCH_ASSOC) ?? null;

    if (!$bank || !password_verify($id, $bank["hashed_id"])) {
        return null;
    }

    $bank["id"] = $id;

    $bank["links"] = $bank["links"]
        ? json_decode(base64_decode($bank["links"]), true)
        : [];

    $bank["link_count"] = count($bank["links"]);

    $bank["total_nuts"] = 0;
    $bank["last_nut_time"] = null;
    $bank["tags"] = [];

    foreach ($bank["links"] as $link) {
        foreach ($link["tags"] as $tag) {
            $bank["tags"][$tag] ??= 0;

            ++$bank["tags"][$tag];
        }

        $bank["total_nuts"] += $link["nuts"];

        if ($link["last_nut_time"]) {
            if (!$bank["last_nut_time"] ||
                $bank["last_nut_time"] < $link["last_nut_time"]) {
                $bank["last_nut_time"] = $link["last_nut_time"];
            }
        }
    }

    return $bank;
}

function saveBank($bank) {
    $links = base64_encode(json_encode($bank["links"]));

    $db = getDb();

    $stmt = $db->prepare("UPDATE banks
                          SET links=AES_ENCRYPT(:links, :id)
                          WHERE id=:id_prefix");

    $stmt->execute([
        ":links" => $links,
        ":id" => $bank["id"],
        ":id_prefix" => bankIdPrefix($bank["id"]),
    ]);
}

function createBank() {
    $db = getDb();

    $id = generateBankId();
    $hashedId = password_hash($id, PASSWORD_BCRYPT);

    $stmt = $db->prepare("INSERT INTO banks (
                              id,
                              hashed_id,
                              creation_time,
                              links
                          ) VALUES (
                              :id,
                              :hashed_id,
                              :creation_time,
                              NULL
                          )");

    $stmt->execute([
        ":id" => substr($id, 0, BANK_ID_PREFIX_LENGTH),
        ":hashed_id" => $hashedId,
        ":creation_time" => time(),
    ]);

    return $id;
}

function addLink($bankId, $url, $tags = []) {
    $bank = loadBank($bankId);

    if (!$bank) {
        return;
    }
    
    $url = trim($url);

    if (!filter_var($url, FILTER_VALIDATE_URL)) {
        return;
    }

    $url = preg_replace("/\/$/", "", $url);

    $tags = array_unique(
        array_map(
            fn($tag) => strtolower(preg_replace("/\s+/", " ", trim($tag))),
            $tags
        )
    );

    if (!array_key_exists($url, $bank["links"])) {
        $bank["links"][$url] = [
            "url" => $url,
            "nuts" => 0,
            "last_nut_time" => null,
            "creation_time" => time(),
        ];
    }

    $bank["links"][$url]["tags"] = $tags;

    saveBank($bank);
}

function deleteLink($bankId, $url) {
    $bank = loadBank($bankId);

    if (!$bank) {
        return;
    }

    $url = preg_replace("/\/$/", "", trim($url));

    unset($bank["links"][$url]);

    saveBank($bank);
}

function nut($bankId, $url) {
    $bank = loadBank($bankId);

    if (!$bank) {
        return;
    }

    $url = preg_replace("/\/$/", "", trim($url));

    if (!array_key_exists($url, $bank["links"])) {
        return;
    }

    ++$bank["links"][$url]["nuts"];

    $bank["links"][$url]["last_nut_time"] = time();

    saveBank($bank);
}

function randomLink($bankId, $tags = null) {
    $bank = loadBank($bankId);

    if (!$bank || count($bank["links"]) === 0) {
        return null;
    }

    $links = $bank["links"];

    if ($tags) {
        $links = array_filter(
            $links,
            fn($link) => array_intersect($tags, $link["tags"]) === $tags
        );
    }

    $maxNuts = array_reduce(
        $links,
        fn($max, $link) => max($max, $link["nuts"]),
        0
    );

    $weights = array_values(array_map(
        fn($link) => abs($maxNuts - $link["nuts"]) + 1,
        $links
    ));

    $link = choices($links, $weights);

    return $link;
}

function randalnumstr($length) {
    $chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    $string = "";

    for ($i = 0; $i < $length; ++$i) {
        $string .= $chars[rand(0, strlen($chars) - 1)];
    }

    return $string;
}

function choices($array, $weights = []) {
    $sum = 0;

    $array = array_values($array);
    
    for ($i = 0; $i < count($array); ++$i) {
        if (!isset($weights[$i])) {
            $weights[$i] = 1;
        }
        
        $sum += $weights[$i];
    }

    $n = rand(1, $sum);

    for ($i = 0; $i < count($array); ++$i) {
        $n -= $weights[$i];

        if ($n <= 0) {
            return $array[$i];
        }
    }

    return null;
}
