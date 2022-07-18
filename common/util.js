const Mongo = require("../config/mongo");
const ObjectID = require("mongodb").ObjectID;
// const passwordValidator = require("password-validator");

// Password Validator schema pass with min 6 in liength has digit in it and not spaces
// let passValidator = new passwordValidator();
// passValidator.is().min(6).has().digits().has().not().spaces();
// require("dotenv").config();

// const passValidate = async (param) => {
//   return passValidator.validate(param);
// };

const snatizeFromMongo = async (result) => {
  if (result && result[0].totalData) {
    for (let res of result[0].totalData) {
      if (res._id) {
        res.id = res._id;
        delete res._id;
      }
    }
    result[0].totalSize = result[0].totalCount[0]
      ? result[0].totalCount[0].count
      : 0;
    delete result[0].totalCount;
  }
  return result;
};
const snatizeArrayForId = async (result) => {
  if (result) {
    for (let res of result) {
      if (res._id) {
        res.id = res._id;
        delete res._id;
      }
    }
  }
  return result;
};

const mongoPool = {
  get() {
    return Mongo.db;
  },
  getObjectId(id) {
    return ObjectID(id);
  },
  async findOne(collection, filter, projection = {}) {
    const result = await Mongo.db
      .collection(collection)
      .findOne(filter, projection);
    return result;
  },
  async count(collection, filter, options = {}) {
    const result = await Mongo.db.collection(collection).count(filter, options);
    return result;
  },
  async find(
    collection,
    filter = {},
    projection = {},
    skip = 0,
    limit = 200000
  ) {
    const result = await Mongo.db
      .collection(collection)
      .find(filter, projection)
      .skip(skip)
      .limit(limit)
      // .aggregate()
      .toArray();
    return result;
  },
  
  async findAndPaginate(
    collection,
    filter = {},
    projection = {},
    skip = 0,
    limit = 200000
  ) {
    const dataParams = [{ $match: filter }, { $skip: skip }, { $limit: limit }];
    if (Object.keys(projection).length > 0) {
      dataParams.push({ $project: projection });
    }

    console.log("projection got in mongo func", projection);

    let result = [];
    result = await Mongo.db
      .collection(collection)
      .aggregate([
        {
          $facet: {
            totalData: dataParams,
            totalCount: [
              {
                $match : filter,
              },
              {
                $group: { _id: null, count: { $sum: 1 } },
              },
            ],
          },
        },
      ])
      .toArray();

    return result;
  },
  async insertOne(collection, insertData) {
    const result = await Mongo.db.collection(collection).insertOne(insertData);
    return result;
  },
  async insertMany(collection, insertData) {
    const result = await Mongo.db.collection(collection).insertMany(insertData);
    return result;
  },
  async updateOne(collection, filter, upsetData) {
    const result = await Mongo.db
      .collection(collection)
      .updateOne(filter, upsetData, { upsert: true });
    return result;
  },
  async updateMany(collection, filter, upsetData) {
    const result = await Mongo.db
      .collection(collection)
      .updateMany(filter, upsetData, { upsert: true });
    return result;
  },
  async aggregateData(collection, query) {
    return await Mongo.db
      .collection(collection)
      .aggregate(query, { allowDiskUse: true })
      .toArray();
  },
  async remove(collection, filter) {
    const result = await Mongo.db.collection(collection).deleteOne(filter);
    return result;
  },
  async update(collection, filter, upsetData) {
    const result = await Mongo.db
      .collection(collection)
      .update(filter, {$set : upsetData}, { upsert: true });
    return result;
  },
};


module.exports = {
  mongo: mongoPool,
//   passValidate,
  snatizeFromMongo,
  snatizeArrayForId,
};
