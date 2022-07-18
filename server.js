
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
require('dotenv').config();

const customerServices = require("./grpcProtosServices/customerService")
const PROTO_PATH = "./protos/customers.proto";

const productServices = require("./grpcProtosServices/productServices")
const PROTO_PATH_PRODUCT = "./protos/products.proto";

const serverUrl = process.env.serverUrl


const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const packageDefinitionProduct = protoLoader.loadSync(PROTO_PATH_PRODUCT, {});



const customersProto = grpc.loadPackageDefinition(packageDefinition);
const productsProto = grpc.loadPackageDefinition(packageDefinitionProduct);




const server = new grpc.Server();

server.addService(customersProto.CustomerService.service,customerServices.customerServices);
server.addService(productsProto.ProductService.service,productServices.productServices);

server.bindAsync(`${serverUrl}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if(!error){
        
        console.log(`Server running at ${serverUrl}`);
        server.start();
    }
});