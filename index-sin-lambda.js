var AWS = require("aws-sdk");
var handler = function () {
  var dynamodb = new AWS.DynamoDB({
    apiVersion: "2012-08-10",
    endpoint: "http://localhost:8000",
    region: "us-west-2",
    credentials: {
      accessKeyId: "2345",
      secretAccessKey: "2345",
    },
  });
  var docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: "2012-08-10",
    service: dynamodb,
  });
  dynamodb.listTables(
    {       
      Limit: 1,
    },
    function (err, data) {
      if (err) console.error(err);
      // an error occurred
      else {
        if (!data || !data.TableNames || data.TableNames.length == 0) {
          createTable();
        } else {
          console.log(data);
        }
      } // successful response
    }
  );
  const createTable = () => {
    const params = {
      TableName: "Envio",
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
        {
          AttributeName: "fechaAlta",
          KeyType: "RANGE",
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "fechaAlta",
          AttributeType: "S",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };
    console.log("Creating the table");
    dynamodb.createTable(params, function (err, data) {
      if (err) console.error(err);
      // an error occurred
      else {
        console.log(data);
        updateTableIndex();
      } // successful response
    });
  };
  const updateTableIndex = () => {
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
};
handler();
