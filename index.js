var AWS = require("aws-sdk");
const { Guid } = require("js-guid");
const { dynamodb, docClient } = require("./dynamo-config");
const { getById, getPendientes, create, updateStatus } = require("./envios");

const updateTableIndex = async () => {
  var params = {
    TableName: "Envio",
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S",
      },
      {
        AttributeName: "pendiente",
        AttributeType: "S",
      },
    ],
    GlobalSecondaryIndexUpdates: [
      {
        // optional
        Create: {
          IndexName: "EnviosPendientesIndex",
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
            {
              AttributeName: "pendiente",
              KeyType: "RANGE",
            },
          ],
          Projection: { ProjectionType: "KEYS_ONLY" },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      // ... more optional indexes ...
    ],
  };
  console.log("Updating the table");
  dynamodb.updateTable(params, function (err, data) {
    if (err) console.error(err);
    // an error occurred
    else console.log(data); // successful response
  });
};
const createTable = async () => {
  const params = {
    TableName: "Envio",
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH",
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };
  console.log("Creating the table");
  await dynamodb.createTable(params, function (err, data) {
    if (err) console.error(err);
    // an error occurred
    else {
      console.log(data);
      updateTableIndex();
    } // successful response
  });
};

var handler = async ({ pathParameters, httpMethod, body }) => {
  const { TableNames: tablas } = await dynamodb.listTables().promise();
  if (!tablas.includes("Envio")) {
    await createTable();
  }
  switch (httpMethod) {
    case "GET": {
      const idEnvio = (pathParameters || {}).idEnvio || false;
      if (idEnvio) {
        return await getById(idEnvio);
      } else {
        return await getPendientes();
      }
    }
    case "POST": {
      return await create(body);
    }
    case "PUT": {
      const idEnvio = (pathParameters || {}).idEnvio || false;
      return await updateStatus(idEnvio);
    }
    default:
      return {
        statusCode: 501,
        headers: { "content-type": "text/plain" },
        body: `Método ${httpMethod} no soportado`,
      };
  }
};
exports.handler = handler;
