const express = require("express");
const router = express.Router();
const client = require("../client");

router.get("/", (req, res) => {
    console.log("in get ==>");
    client.getAll(null, (err, data) => {
        console.log("data ==>", data)
        if (!err) {
            res.json({ results: data.customers });
        }
    });
});

router.post("/insert", (req, res) => {
    let newCustomer = {
        name: req.body.name,
        lastName: req.body.lastName,
        age: req.body.age
    };

    client.insert(newCustomer, (err, data) => {
        if (err) throw err;

        console.log("Customer created successfully", data);
        // res.redirect("/");
        res.json({ results: data });
    });
});

router.post("/update", (req, res) => {
    const updateCustomer = {
        _id: req.body._id,
        name: req.body.name,
        lastName: req.body.lastName,
        age: req.body.age
    };

    client.update(updateCustomer, (err, data) => {
        if (err) throw err;

        console.log("Customer updated successfully", data);
        res.json({ results: data });
    });
});

router.post("/remove", (req, res) => {
    client.remove({ _id: req.body._id }, (err, data) => {
        if (err) throw err;

        console.log("Customer removed successfully", data);
        res.json({ results: data });
    });
});


module.exports = router;
