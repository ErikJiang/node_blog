/**
 * Created by jiangink on 15/11/23.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/node_blog');

//Schema
//var userSchema = new mongoose.Schema({
//    userName: {type:'String', required:true},
//    password: {type:'String', required:true},
//    userAge: {type:'Number'},
//    nickname: {type:'String'},
//    profile: {type:'String'},
//    eMail: {type:'String'},
//    headImg: {type:'String'},
//    createTime: {type:'Date'}
//});

var userSchema = new mongoose.Schema({
    userName: String,
    password: String
});
//Model
var userModel = mongoose.model('users', userSchema);

function User(user){
    this.userName = user.userName;
    this.password = user.password;
}

User.prototype.save = function(callback){
    //var user = {
    //    userName: this.userName,
    //    password: this.password,
    //    userAge: 18,
    //    nickname: '匿名',
    //    profile: '这个人很懒,什么都没有留下.',
    //    eMail: 'name@example.com',
    //    headImg: './images/owl.png',
    //    createTime: '2015-11-25'
    //};
    var user = {
        userName: this.userName,
        password: this.password
    };
    //Entity
    var userEntity = new userModel(user);
    //save data
    userEntity.save(function(err, user){
        if(err){
            return callback(err);
        }
        callback(null, user);
    });
};

User.findByName = function(name, callback){
  userModel.findOne({ userName: name }, function(err, user){
      if(err){
          return callback(err);
      }
      callback(null, user);
  });
};


module.exports = User;


