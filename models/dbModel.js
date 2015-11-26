/**
 * Created by jiangink on 15/11/25.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/node_blog');


//Schema
var userSchema = new mongoose.Schema({
    userName: {type:'String', required:true},
    password: {type:'String', required:true},
    userTitle: {type:'Number'},
    nickName: {type:'String'},
    profile: {type:'String'},
    eMail: {type:'String'},
    headImg: {type:'String'},
    createTime: {type:'Date'}
});

//var userSchema = new mongoose.Schema({
//    userName: String,
//    password: String
//});

//Model
exports.userModel = mongoose.model('users', userSchema);
