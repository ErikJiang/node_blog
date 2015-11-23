/**
 * Created by jiangink on 15/11/23.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/node_blog');

//Schema
var userSchema = new mongoose.Schema({
    userName: {type:'String', required:true},
    password: {type:'String', required:true},
    userAge: {type:'Number'},
    nickname: {type:'String'},
    profile: {type:'String'},
    eMail: {type:'String'},
    headImg: {type:'String'},
    createTime: {type:'Date', default:Date.now}
},{
    collection: 'users'
});

//Model
var userModel = mongoose.model('User', userSchema);

function User(user){
    this.userName = user.userName;
    this.password = user.password;
    this.userAge = user.userAge;
    this.profile = user.profile;
    this.eMail = user.eMail;
    this.headImg = user.headImg;
}

User.prototype.save = function(callback){
    var user = {
        userName: this.userName,
        password: this.password,
        userAge: this.userAge,
        profile: this.profile,
        eMail: this.eMail,
        headImg: this.headImg
    };
    //Entity
    var userEntity = new userModel(user);
    //save data
    userEntity.save(function(err, user){
        if(err){
            return callback(err);
        }
        callbak(null, user);
    });
};

User.get = function(name, callback){
  userModel.findOne({userName: name}, function(err, user){
      if(err){
          return callback(err);
      }
      callback(null, user);
  });
};

module.exports = User;


