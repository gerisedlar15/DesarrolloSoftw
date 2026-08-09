<?php
// 1. Damos permiso para que React (que corre en el puerto 5173) pueda enviar datos acá
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

// 2. Recibimos el paquete de texto (JSON) que mandó React y lo traducimos a PHP
$datos_json = file_get_contents("php://input");
$datos = json_decode($datos_json);

// Si alguien entra al archivo por error sin mandar datos, frenamos el proceso
if (!$datos) {
    exit(json_encode(["error" => "No se recibieron datos"]));
}

// 3. Credenciales de tu base de datos en XAMPP (por defecto root y sin contraseña)
$servidor = "localhost";
$usuario = "root";
$password = "";
$base_datos = "mozzafiato";

// Creamos la conexión
$conexion = new mysqli($servidor, $usuario, $password, $base_datos);

// Si falla la conexión a la base de datos, avisamos a React
if ($conexion->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]));
}

// 4. Preparamos la orden para insertar en la tabla 'persona'. 
// Usamos signos de interrogación (?) por seguridad, para evitar hackeos (Inyección SQL).
$sql = "INSERT INTO persona (nombreApe, telefono, correoElect, observacion, rol) VALUES (?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);

// Reemplazamos las "s" (string/texto) con los datos reales que llegaron de React
$stmt->bind_param("sssss", $datos->nombreApe, $datos->telefono, $datos->correoElect, $datos->observacion, $datos->rol);

// 5. Ejecutamos la orden y le respondemos a React si salió bien o mal
if ($stmt->execute()) {
    echo json_encode(["mensaje" => "Persona guardada con éxito"]);
} else {
    echo json_encode(["error" => "Error al guardar: " . $stmt->error]);
}

// Cerramos las conexiones
$stmt->close();
$conexion->close();
?>