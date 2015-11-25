
var crypto = require('crypto');
var dbModel = require('../models/dbModel');
var userModel = dbModel.userModel;

/* GET users listing. */
function router(app){
    //show login page
    app.get('/login', function(req, res, next) {
        res.render('login', {
            user: null,
            errinfo: null
        });
    });
    //login handler
    app.post('/login', function(req, res, next){
        //console.log("-----pwd", req.body.password);
        var md5 = crypto.createHash('md5'),
            password_md5 = md5.update(req.body.password).digest('hex');

        //User.findByName(req.body.username, function(err, user){
        //    if(err){
        //        console.log(err);
        //        return res.render('login', {
        //            user: null,
        //            errinfo:'query err!'
        //        });
        //    }
        //    //console.log(">>user:", user+"<=>"+req.body.username);
        //    //console.log(">>pwd:", user.password+"<=>"+password_md5);
        //    if((!user) || (user.password!=password_md5)){
        //        return res.render('login', {
        //            user: null,
        //            errinfo:'用户名或密码错误!'
        //        });
        //    }
        //    req.session.user = user;
        //    res.render('index', {user: user});
        //});
        //userModel.findOne({userName: req.body.username}, function(err, user){
        userModel.findOne({userName: 'test'}, function(err, user){
            if(err){
                console.log('+++err: '+err);
                return res.render('login', {
                    user: null,
                    errinfo: 'query err!'
                });
            }
            console.log('+++err+: '+err);
            console.log('+++user+: '+user);
            if((!user) || (user.password!=password_md5)){
                return res.render('login', {
                    user: null,
                    errinfo:'用户名或密码错误!'
                });
            }
            req.session.user = user;
            res.render('index', {user: user});
        });

    });

    //show register page
    app.get('/register', function(req, res, next){
        res.render('register', {
            user: null,
            errinfo: null
        });
    });
    //register Handler
    app.post('/register', function(req, res, next){
        //获取用户名密码信息

        //1、用户名是否存在
        //需要客户端AJAX单独判断

        //2、密码是否一致
        //需要客户端进行判断

        //3、保存数据库
        console.log("username:"+req.body.username);
        console.log("password:"+req.body.password);
        var username = req.body.username;
        var md5 = crypto.createHash('md5');
        var passwd_md5 = md5.update(req.body.password).digest('hex');
        //var user = new User({
        //    userName: username,
        //    password: passwd_md5
        //});
        var user = new userModel({
            userName: username,
            password: passwd_md5
        });
        user.save(function(err, user){
           if(err){
               console.log(err);
               return res.render('register',{
                   user: null,
                   errinfo: '注册失败'
               });
           }
           res.render('feedback',{
               user: null,
               type: 'signup',
               errinfo: null,
               sucessinfo: '恭喜注册成功！'
           });
        });
    });
}

module.exports = router;
