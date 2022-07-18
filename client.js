const PROTO_PATH = "./protos/customers.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

require('dotenv').config();
const serverUrl = process.env.serverUrl


var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const CustomerService = grpc.loadPackageDefinition(packageDefinition).CustomerService;
const client = new CustomerService(
    `${serverUrl}`,
    grpc.credentials.createInsecure()
);

module.exports = client;