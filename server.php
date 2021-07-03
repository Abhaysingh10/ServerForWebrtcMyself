<?php
 
$host = "127.0.0.1";
$port = "6000";
 
set_time_limit(0);
// create socket
$socket = socket_create(AF_INET, SOCK_STREAM, 0) or die('Could not create socket');
// bind socket to port
$result  = socket_bind($socket, $host, $port) or die('Could not bind to socket');
// start listening to connections
$result = socket_listen($socket, 3) or die('Could not set up socket listener');
 
while(true){
    // accept incoming connections
    // spawn another socket to handle communication
    $spawn = socket_accept($socket) or die('Could not accept incoming connection');
    // read client input
    $input  = socket_read($spawn, 1024) or die('Could not read input');
    // clean up input string
    $input = trim($input);
    echo "Client Message: ".$input;
    // reverse the message and send back
    $output = strrev($input);
    socket_write($spawn, $output, strlen($output)) or die('Could not write output');
}
 
// Close sockets
socket_close($spawn);
socket_close($socket);
 
?>