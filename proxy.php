<?
    $data = $_POST['tx'];
    $url = $_POST['server'];
    $json = json_decode($data,true);
 
    $post_data = "jsonrpc=2.0&id=1&method=sendrawtransaction&params=%5B%22";
    $post_data = $post_data.$json['params'][0]."%22%5D";
    echo $post_data;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));   
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
    $response = curl_exec($ch);
    curl_close($ch);
    echo $response;