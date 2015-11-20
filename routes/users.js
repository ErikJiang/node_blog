
/* GET users listing. */
function router(app){
    //登录处理
    app.get('/login', function(req, res, next) {
        res.render('login');
    });
}

module.exports = router;
