var mongoose = require('mongoose');
var http = require('http');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var conn = mongoose.connect('mongodb://admin:123@ds151232.mlab.com:51232/sumit');

var details = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true }
}, {
    collection: 'users',
    strict: true
});

var access_detail = mongoose.Schema({
    user_id: { type: String, required: true },
    access_token: { type: String, required: true },
    expiry: { type: String, required: true },
}, {
    collection: 'access_token',
    strict: true
});

var user_address = mongoose.Schema({
    user_id: { type: String, required: true, ref: 'users_model' },
    address: Array,
    phone_no: Number
}, {
    collection: 'address',
    strict: true
});

var users_model = conn.model('users_model', details);
var access_token_model = conn.model('access_token_model', access_detail);
var user_address_model = conn.model('user_address_model', user_address);
module.exports = {
    user: users_model,
    access: access_token_model,
    address: user_address_model,
}