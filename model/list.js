const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, {timestamps: true})

const itemSchema = {
  name: String,
  items: [listSchema],
};

const List = mongoose.model('List', listSchema)
const Item = mongoose.model('Item', itemSchema)
module.exports = {List, Item, listSchema}