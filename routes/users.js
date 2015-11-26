
var crypto = require('crypto');
var check = require('./checkLogin');
var dbModel = require('../models/dbModel');
var userModel = dbModel.userModel;

/* GET users listing. */
function router(app){
    //show login page
    app.get('/login.do', check.checkNotLogin);
    app.get('/login.do', function (req, res, next) {
        res.render('login', {
            user: null,
            errinfo: null
        });
    });

    //login handler
    app.post('/login.do', check.checkNotLogin);
    app.post('/login.do', function (req, res, next) {
        var md5 = crypto.createHash('md5'),
            password_md5 = md5.update(req.body.password).digest('hex');

        userModel.findOne({userName: req.body.username}, function (err, user) {
            if(err){
                console.log('err: ', err);
                return res.render('login', {
                    user: null,
                    errinfo: 'query err!'
                });
            }
            if((!user) || (user.password!=password_md5)){
                return res.render('login', {
                    user: null,
                    errinfo:'用户名或密码错误!'
                });
            }
            req.session.user = user;
            //res.render('index', {user: req.session.user});
            res.redirect('/');
        });
    });

    //show register page
    app.get('/register.do', check.checkNotLogin);
    app.get('/register.do', function (req, res, next) {
        res.render('register', {
            user: null,
            errinfo: null
        });
    });

    //register Handler
    app.post('/register.do', check.checkNotLogin);
    app.post('/register.do', function (req, res, next) {
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

        var user = new userModel({
            userName: username,
            password: passwd_md5
        });
        user.save(function (err, user) {
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

    //logout handler
    app.get('/logout.do', check.checkIsLogin);
    app.get('/logout.do', function (req, res, next) {
        req.session.user = null;
        res.redirect('/');
    });

    //findByName Ajax Handler
    app.get('/findByName.do', function (req, res, next) {
        var name = req.query.name;
        userModel.findOne({userName: name}, function (err, user) {
            if (err){
                console.log("err:", err);
                return res.send(err);
            }
            res.send(user);
        });
    });

}

module.exports = router;
