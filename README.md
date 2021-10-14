# Importante!! Durante la primera ejecución crea la base de datos sino existe, hay que rehacer la llamada al endpoint

# Paso a paso del práctico
## Eliminar el container dynamodb
``docker container rm dynamodb``
## Crear una red en docker
``docker network create awslocal``
## Ejecutar la base de datos en modo compartido
``docker run -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb``
## Abrir el shell JavaScript de DynamoDB
http://localhost:8000/shell/
## Proyecto nodejs para el backend
<!-- iniciamos proyecto node -->
``npm init``
<!-- agregamos aws-sdk para poder trabajar con DynamoDB   -->
``npm install --save aws-sdk``
## Crear la tabla Envio
<!-- Agregamos archivo index.js con la funcion handler la cual crea un servicio para conectarse a dynamo y un cliente para consumir la base de datos. -->
<!-- var AWS = require('aws-sdk');
var handler = function() {
var dynamodb = new AWS.DynamoDB({
apiVersion: '2012-08-10',
endpoint: 'http://localhost:8000',
region: 'us-west-2',
credentials: {
accessKeyId: '2345',
secretAccessKey: '2345'
}
});
var docClient = new AWS.DynamoDB.DocumentClient({
apiVersion: '2012-08-10',
service: dynamodb
});
// codigo de la funcion
}
handler(); // llamada para testing-->
## Crear el archivo template.yaml con la siguiente definición del API:
- POST /envios  <!--crea un nuevo envio -->
- GET /envios/pendientes <!--retorna un listado de envíos pendientes-->
- PUT /envios/{idEnvio}/entregado <!-- marca un envío como entregado quitando el atributo pendiente -->
## Levantar el API con SAM Local utilizando el siguiente comando:
``sam local start-api --docker-network awslocal``
## Comprobar el llamado a la función con Postman o un browser a la dirección
http://localhost:3000/envios/pendientes

