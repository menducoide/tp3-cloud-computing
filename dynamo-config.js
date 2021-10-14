var AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  endpoint: "http://dynamodb:8000",
  region: "us-west-2",
  credentials: {
    accessKeyId: "2345",
    secretAccessKey: "2345",
  },
});
const docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  service: dynamodb,
});
exports.dynamodb = dynamodb; 
exports.docClient = docClient; 