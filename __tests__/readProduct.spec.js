const { readProduct } = require("../model/postgressCrud");
const { pool } = require("../config/postgressConnection");


describe("checking product details by its id", () => {
    afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await pool.end();
  });

    it("it should get the detail the product by its id", async () => {

        let result = {
            "code": 0,
            "status": "True",
            "msg": "Successfully found",
            "data": {
              "id": 11,
              "name": "Hello122",
              "price": 45
            }
          }
          let message = {
            "code": 5,
            "status": "false",
            "msg": "Not found",
            "data" : {}
          }
      expect(await readProduct(11)).toEqual(result);
      expect(await readProduct(12)).toEqual(message);

    //   expect(sum(1,3)).toEqual(4);

  
    });

});


