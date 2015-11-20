var usersRouter = require("./users");

function router(app){
    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });

    app.get('/home', function(req, res, next) {
        res.render('home');
    });

    //
    usersRouter(app);
}


module.exports = router;
