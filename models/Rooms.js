const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roomGenerator = require('../util/roomIdGenerator.js');

const RoomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    roomId:{
        type: String
    },
    dateOfEntry:{
        type: Date,
        default: Date.now()
    },
    Messages:[{
        Username: {type: String},
        date: {type:Date, default: Date.now},
        body: {type:String}
    }]
});

const item = mongoose.model('room',RoomSchema);
module.exports = item;
