
const ObjectID = require("mongodb");
const mongo = require('mongodb');
const grpc = require("grpc");
const { Pool, Client } = require('pg')

const util = require("../common/util");
const collectionName = 'tasks';


const customerServices = {
    getAll:  async (_, callback) => {
        console.log("called in getAll ==>");
        try {

        const customers = await util.mongo.find(collectionName, {});
        
        console.log("customers ==>", {customers});

            callback(null,  {customers} );
        } catch (e) {
            console.log("error is ==>", e);
            callback({
                code: grpc.status.CANCELLED,
                details: e
            });
        }

    },

    get: async (call, callback) => {

        var customerId = new mongo.ObjectID(call.request._id);
        console.log("customerId ==>", customerId);
        let query = {
            '_id' : customerId
        }
        try {
            let customer = await util.mongo.findOne(collectionName,query);
            console.log("customer ===>", customer);
    
            if (customer) {
                callback(null, customer);
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found"
                });
            }
        } catch (err) {
            console.log("err ===>", err);
            callback({
                code: grpc.status.CANCELLED,
                details: err
            });
        }

    },

    insert: async (call, callback) => {
        console.log("call ==>", call, call.request)
        let customer = call.request;
        try {
            let checkExists = await util.mongo.findOne(collectionName,{"name" : customer.name});
            console.log("checkExists ==>", checkExists);

            if(checkExists && checkExists !== null){
                callback({
                    code: grpc.status.ALREADY_EXISTS,
                    details: "Already exists"
                });
                return;
            }
            let insert = await util.mongo.insertOne(collectionName,customer);
            console.log("insert ===>", insert)
            const customers = await util.mongo.find(collectionName, {});
    
            callback(null, {customers});
        } catch (e) {
            console.log("error ==>", e);
            callback({
                code: grpc.status.CANCELLED,
                details: e
            });
        }
    },

    update: async (call, callback) => {
        let customerId = new mongo.ObjectID(call.request._id);
        console.log("customerId ==>", customerId);
        let query = {
            '_id' : customerId
        }
        try {   
            let existingCustomer = await util.mongo.findOne(collectionName,query);

            if (existingCustomer) {
                let updateData = {
                    ...call.request
                }
                delete updateData._id;
                console.log("updateData ==>", updateData);
                const updateObject = {
                    $set:updateData
                  };
                let update = await util.mongo.updateOne(collectionName,query,updateObject);  
                console.log("update ==>", update); 

                callback(null, existingCustomer);
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found"
                });
            }
        } catch (err) {
            console.log("err ===>", err)
            callback({
                code: grpc.status.CANCELLED,
                details: e
            });
        }

    },

    remove: async (call, callback) => {
        var customerId = new mongo.ObjectID(call.request._id);
        console.log("customerId ==>", customerId);
        let query = {
            '_id' : customerId
        }
        try {   
            let existingCustomer = await util.mongo.findOne(collectionName,query);

            if (existingCustomer) {

                let deleteUSer = await util.mongo.remove(collectionName,query);  
                console.log("deleteUSer ==>", deleteUSer); 

                callback(null, existingCustomer);
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found"
                });
            }
        } catch (err) {
            console.log("err ===>", err);
            callback({
                code: grpc.status.CANCELLED,
                details: err
            });
        }
    }
}

module.exports = {
    customerServices
};