var usersRouter = require("./users");

function router(app){
    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.render('index', {user: req.session.user});
    });

    //user router
    usersRouter(app);
}


module.exports = router;
