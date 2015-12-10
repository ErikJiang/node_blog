var usersRouter = require("./users");
var articlesRouter = require("./articles");
var dbModel = require('../models/dbModel');
var articleModel = dbModel.articleModel;

function router(app){
    /* GET home page. */
    app.get('/', function(req, res, next) {
        var curPage = req.query.curPage ? parseInt(req.query.curPage) : 1;
        var condition = {};
        if(req.session.user) {
            //condition.author = req.session.user.userName;
        }
        articleModel.count(condition, function(err, count) {
            if(err) {
                console.log(err);
                return res.render('index', {
                    user: req.session.user,
                    errinfo: 'count err!'
                });
            }
            articleModel.find(condition, null, {
                skip: (curPage-1)*5,
                limit: 5
            }, function (err, articles) {
                if(err) {
                    console.log(err);
                    return res.render('index', {
                        user: req.session.user,
                        errinfo: 'find err!'
                    });
                }
                res.render('index', {
                    user: req.session.user,
                    curPage: curPage,
                    articles: articles,
                    isFirstPage: curPage-1 === 0,
                    isLastPage: (curPage-1)*5+articles.length === count
                });
            });
        });
    });

    //user router
    usersRouter(app);

    //articles router
    articlesRouter(app);
}


module.exports = router;
