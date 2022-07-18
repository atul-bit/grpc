

const grpc = require("grpc");
// const { pool } = require("../config/postgressConnection");
const postgressCrud = require("../model/postgressCrud")

const productServices = {
    listProducts:  async (_, callback) => {
        console.log("called in productServices getAll ==>");
        try {
            const products = await postgressCrud.getAll();
            console.log("products ==>", products)
            callback(null,  products );

        } catch (e) {
            console.log("error is ==>", e);
            callback(null,{
                code: grpc.status.CANCELLED,
                status : "false",
                msg: e
            });
        }

    },

    readProduct: async (call, callback) => {

        try {
            const product = await postgressCrud.readProduct(call.request.id);
            callback(null,product);
        } catch (err) {
            console.log("error ==>", err);
            callback({
                code: grpc.status.CANCELLED,
                status : "false",
                msg : err
            });
        }

    },

    createProduct: async (call, callback) => {
        console.log("call ==>", call, call.request)
        try {
            let insert = await postgressCrud.createProduct(call.request);
            callback(null,insert);
        } catch(err) {
            console.log("error is ==>", err);
            callback(null,{
                code: grpc.status.CANCELLED,
                status : "false",
                msg: err
            });
        }
    },

    updateProduct: async (call, callback) => {
        try {
            console.log("call.request ==>", call.request);
            let update = await postgressCrud.updateProduct(call.request);
            callback(null, update);

        } catch (err) {
            console.log("error is ==>", err);
            callback(null,{
                code: grpc.status.CANCELLED,
                status : "false",
                msg: err
            });
        }

    },

    deleteProduct: async (call, callback) => {
        try {   
            let deleteResult = await postgressCrud.deleteProduct(call.request.id);
            callback(null,deleteResult);
            
        } catch (err) {
            console.log("err ===>", err);
            callback(null,{
                code: grpc.status.CANCELLED,
                status : "false",
                msg: err
            });
        }
    }
}

module.exports = {
    productServices
};