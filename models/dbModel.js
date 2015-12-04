/**
 * Created by jiangink on 15/11/25.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/node_blog');


//Schema
var userSchema = new mongoose.Schema({
    userName: {type:'String', required:true},
    password: {type:'String', required:true},
    userTitle: {type:'Number', default: 0},
    nickName: {type:'String', default: '匿名'},
    profile: {type:'String', default: '这个人很懒，啥都没写，呵呵哒～'},
    eMail: {type:'String', default: 'username@example.com'},
    headImg: {type:'String', default: './images/owl.png'},
    createTime: {type:'Date', default: Date.now()}
});

//Model
exports.userModel = mongoose.model('users', userSchema);
