const Mongo = require('../common/mongo');
require('dotenv').config();
// const url = process.env.mongoUrl || 

module.exports = new Mongo(`${process.env.mongoUrl}`, `${process.env.mongoDBName}`);
