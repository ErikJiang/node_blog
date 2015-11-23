var User = require('../models/users');
var crypto = require('crypto');

/* GET users listing. */
function router(app){
    //show login page
    app.get('/login', function(req, res, next) {
        res.render('login', {user: null});
    });
    //login handler
    app.post('/login', function(req, res, next){
        var md5 = createHash('md5'),
            password_md5 = md5.update(req.body.password).digest('hex');
        //var user = new User({
        //    userName: req.body.username,
        //    password: req.body.password,
        //    userAge: 18,
        //    profile: '这个人很懒，什么都没有留下。',
        //    eMail: 'name@example.com',
        //    headImg: './images/owl.png'
        //});
        User.get(req.body.username, function(err, user){
            if((!user) || (user.password!=password_md5)){
                return res.render('/login', {loginErr:'用户名或密码错误！'});
            }
            req.session.user = user;
            res.render('/index', {user: user});
        });

    });

    //show regist page
    app.get('/register', function(req, res, next){
        res.render('register', {user: null});
    });
}

module.exports = router;
