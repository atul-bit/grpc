const { pool } = require("../config/postgressConnection");
const grpc = require("grpc");


const getAll = async () => {
    try{

        let result = await pool.query("SELECT * FROM product");
        if(result.rows.length > 0){

            // return result.rows;
            return {code: grpc.status.OK,status: "true", msg : "data fetched successfully", products : result.rows}    
        } else {
            return {code: grpc.status.CANCELLED,status: "false", msg : "No data found", products : result.rows}
        }
    } catch (err) {
        console.log("error ==>", err);
        return {code: grpc.status.CANCELLED,status: "false", msg : err, products : []};
    }
}

const createProduct = async (data) => {
    let {name, price} = data;
    try {
        let checkExists = await pool.query("SELECT * FROM product WHERE name = $1",[name]);

        console.log("checkExists ==>", checkExists);

        if(checkExists.rows.length > 0) {
            return { code: grpc.status.ALREADY_EXISTS,status : "false",msg: "Already exists"};
        }
        let insert = await pool.query("INSERT INTO product(name,price) VALUES ($1,$2)",[name,price]);
        console.log("insert ===>", insert)

        return  {code: grpc.status.OK,status : "true",msg : "inserted sucessfully!!"};

    } catch (e) {
        console.log("error ==>", e);
        return {code: grpc.status.CANCELLED,details: e};
    }

}

const readProduct = async (id) => {
    try {
        let product = await pool.query("SELECT * FROM product WHERE id = $1",[id]);
        console.log("product ===>", product.rows[0]);
        product = product.rows[0];
        
        if (product !== undefined) {
            return { code : grpc.status.OK,status : "True",msg: "Successfully found", data : product};
        } else {
            return { code : grpc.status.NOT_FOUND,status : "false",msg: "Not found", data : {}}
        }
    } catch (err) {
        console.log("err ===>", err);
        return {code: grpc.status.CANCELLED,status: "false",msg: err}
    }
}

const updateProduct = async (data) => {
    console.log("data ==>", data)
    let {id, name, price} = data;
    console.log("productId ==>", id);
    try {   
        let existingProduct = await pool.query("SELECT * FROM product WHERE id = $1",[id]);

        if (existingProduct.rows.length > 0) {

            let update = await pool.query("UPDATE product SET name = $1,price = $2 WHERE id = $3",[name, price, id]);  
            console.log("update ==>", update); 
            return {code: grpc.status.OK,status : "true",msg : "updated successfully!!"};

        } else {
            return {
                code: grpc.status.NOT_FOUND,
                status : "false",
                msg: "Not found"
            }
        }
    } catch (err) {
        console.log("err ===>", err)
        return {
            code: grpc.status.CANCELLED,
            status : "false",
            msg: err
        }
    }

}

const deleteProduct = async (productId) => {
    console.log("productId ==>", productId);
    try {   
        let existingCustomer = await pool.query("SELECT * FROM product WHERE id = $1",[productId]);
        console.log("existingCustomer ==>", existingCustomer)

        if (existingCustomer.rows.length > 0) {

            let deleteProduct = await pool.query("DELETE FROM product WHERE id = $1",[productId]);  
            console.log("deleteProduct ==>", deleteProduct);
            return {code : grpc.status.NOT_FOUND,status : "true", msg : "deleted sucessfully!!"}; 

        } else {
            // callback();
            return {
                code: grpc.status.NOT_FOUND,
                status : "false",
                msg: "Not found"
            }
        }
    } catch (err) {
        console.log("err ===>", err);
        // callback();
        return {
            code: grpc.status.CANCELLED,
            status : "false",
            msg: err
        }
    }
}

module.exports = {
    getAll,
    createProduct,
    readProduct,
    updateProduct,
    deleteProduct
}