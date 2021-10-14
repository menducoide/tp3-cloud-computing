const { docClient } = require("./dynamo-config");
const { Guid } = require("js-guid");

const getById = (_id) => {
  const params = {
    TableName: "Envio",
    Key: {
      id: _id,
    },
  };
  console.log(params)
  const response = docClient
    .get(params)
    .promise()
    .then((response) => {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(response),
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: "Ops! Algo salió mal",
      };
    });
  return response;
};
const getPendientes = () => {
  const params = {
    TableName: "Envio",
    IndexName: "EnviosPendientesIndex",
  };
  const response = docClient
    .scan(params)
    .promise()
    .then((response) => {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(response),
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: "Ops! Algo salió mal",
      };
    });
  return response;
};
const create = (data) => {
  const params = {
    TableName: "Envio",
    Item: {
      id: new Guid().toString(),
      fechaAlta: new Date().toISOString(),
      ...JSON.parse(data),
      pendiente: new Date().toISOString(),
    },
  };
  const response = docClient
    .put(params)
    .promise()
    .then(() => {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(params.Item),
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: "Ops! Algo salió mal",
      };
    });
  return response;
};
const updateStatus = (id) => {
  const params = {
    TableName: "Envio",
    Key: {
      id: id,
    },
    UpdateExpression: "REMOVE pendiente",
    ConditionExpression: "attribute_exists(pendiente)",
  };
  const response = docClient
    .update(params)
    .promise()
    .then(() => {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: "Envio actualizado satisfactoriamente",
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: "Ops! Algo salió mal",
      };
    });
  return response;
};
exports.getById = getById;
exports.getPendientes = getPendientes;
exports.create = create;
exports.updateStatus = updateStatus;
