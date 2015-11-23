var usersRouter = require("./users");

function router(app){
    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.render('index',{user: null});
    });

    //
    usersRouter(app);
}


module.exports = router;
